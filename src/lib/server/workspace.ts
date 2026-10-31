import { and, asc, eq, gte, sql } from 'drizzle-orm';
import { randomUUID } from 'node:crypto';
import { getDb } from '../../db';
import * as tables from '../../db/schema';
import type {
  AnswerSubmission,
  Appearance,
  Attempt,
  PracticeSession,
  StudySettings,
} from './types';
import { HttpError } from './http';
import { scoreAnswer } from './validation';
import { defaultAppearance } from '../appearance';
export { defaultAppearance } from '../appearance';

export const defaultSettings: StudySettings = { dailyGoal: 10, mtapDate: null, mockDate: null };
export function toAttempt(row: typeof tables.attempts.$inferSelect): Attempt {
  return {
    id: row.id,
    sessionId: row.sessionId,
    questionId: row.questionId,
    optionId: row.optionId,
    correct: row.correct,
    createdAt: row.createdAt.toISOString(),
  };
}
export async function getPreferences(userId: string) {
  const db = await getDb();
  const [preferences] = await db
    .select()
    .from(tables.preferences)
    .where(eq(tables.preferences.userId, userId));
  return preferences;
}
export async function getWorkspace(user: { id: string; name: string; email: string }) {
  const db = await getDb();
  const [attempts, bookmarks, reports, preferences] = await Promise.all([
    db
      .select()
      .from(tables.attempts)
      .where(eq(tables.attempts.userId, user.id))
      .orderBy(asc(tables.attempts.createdAt)),
    db.select().from(tables.bookmarks).where(eq(tables.bookmarks.userId, user.id)),
    db
      .select()
      .from(tables.reports)
      .where(eq(tables.reports.userId, user.id))
      .orderBy(asc(tables.reports.createdAt)),
    getPreferences(user.id),
  ]);
  let activeSession = preferences?.activeSession || null;
  if (activeSession) {
    const currentId = activeSession.id;
    activeSession = {
      ...activeSession,
      answers: Object.fromEntries(
        attempts.filter((a) => a.sessionId === currentId).map((a) => [a.questionId, a.optionId]),
      ),
    };
  }
  return {
    user: { id: user.id, name: user.name, email: user.email },
    attempts: attempts.map(toAttempt),
    bookmarks: bookmarks.map((b) => b.questionId),
    reports: reports.map((r) => ({
      id: r.id,
      questionId: r.questionId,
      reason: r.reason,
      createdAt: r.createdAt.toISOString(),
    })),
    settings: preferences?.settings || defaultSettings,
    appearance: preferences?.appearance || defaultAppearance,
    activeSession,
  };
}
type AttemptInput = {
  id: string;
  sessionId: string;
  questionId: string;
  optionId: string;
  nextIndex?: number;
};

/** Scores and checkpoints a submitted answer in one atomic operation. */
export async function submitAnswer(userId: string, input: AttemptInput): Promise<AnswerSubmission> {
  const result = scoreAnswer(input.questionId, input.optionId);
  if (!result) throw new HttpError(400, "Please choose one of this question's answer options.");
  const db = await getDb();
  return db.transaction(async (tx) => {
    // Serialize answer/checkpoint writes with session replacements across devices.
    const [prefs] = await tx
      .select()
      .from(tables.preferences)
      .where(eq(tables.preferences.userId, userId))
      .for('update');
    const previousAnswers = await tx
      .select()
      .from(tables.attempts)
      .where(
        and(eq(tables.attempts.userId, userId), eq(tables.attempts.sessionId, input.sessionId)),
      );
    const existing = previousAnswers.find((answer) => answer.questionId === input.questionId);
    if (existing && existing.optionId !== input.optionId)
      throw new HttpError(409, 'This question has already been answered in this session.');
    const current = prefs?.activeSession;
    if (
      !current ||
      current.id !== input.sessionId ||
      !current.questionIds.includes(input.questionId)
    ) {
      // A replay may acknowledge an old saved answer but cannot reopen its session.
      if (existing) return { attempt: toAttempt(existing), activeSession: null };
      throw new HttpError(
        409,
        'This practice changed on another device. Refresh to continue your latest session.',
      );
    }
    let saved = existing;
    if (!saved) {
      const { nextIndex: _nextIndex, ...answerInput } = input;
      [saved] = await tx
        .insert(tables.attempts)
        .values({ ...answerInput, userId, ...result })
        .onConflictDoNothing()
        .returning();
      if (!saved)
        throw new HttpError(409, 'This answer could not be saved. Please reload and try again.');
    }
    const answers = Object.fromEntries(
      previousAnswers.map((answer) => [answer.questionId, answer.optionId]),
    );
    answers[input.questionId] = saved.optionId;
    const firstUnanswered = current.questionIds.findIndex((id) => !answers[id]);
    // An eager client may ask to checkpoint ahead, but never beyond an unanswered
    // question. Keep the final answered question resumable for its rationale.
    const lastIndex = current.questionIds.length - 1;
    const requestedIndex = input.nextIndex ?? current.index;
    const index = Math.min(
      Math.max(current.index, requestedIndex),
      firstUnanswered < 0 ? Math.max(current.index, lastIndex) : firstUnanswered,
    );
    const activeSession: PracticeSession = { ...current, index, answers };
    // On retries this UPDATE is harmless; persisted score and attempt ID remain unchanged.
    await tx
      .update(tables.preferences)
      .set({ activeSession, updatedAt: new Date() })
      .where(eq(tables.preferences.userId, userId));
    return { attempt: toAttempt(saved), activeSession };
  });
}

/** Compatibility for callers which only need the saved attempt. */
export async function recordAttempt(userId: string, input: AttemptInput) {
  return (await submitAnswer(userId, input)).attempt;
}
export async function savePractice(
  userId: string,
  input: PracticeSession & { replaceSessionId?: string | null },
) {
  const db = await getDb();
  return db.transaction(async (tx) => {
    // Materialize the row before locking so concurrent first-ever session starts also serialize.
    await tx
      .insert(tables.preferences)
      .values({ userId, settings: defaultSettings })
      .onConflictDoNothing();
    const [prefs] = await tx
      .select()
      .from(tables.preferences)
      .where(eq(tables.preferences.userId, userId))
      .for('update');
    const current = prefs.activeSession;
    const sameSession = current?.id === input.id;
    if (sameSession && JSON.stringify(current.questionIds) !== JSON.stringify(input.questionIds)) {
      throw new HttpError(409, 'Questions in an existing session cannot be changed.');
    }
    if (
      !sameSession &&
      (input.replaceSessionId === undefined || input.replaceSessionId !== (current?.id ?? null))
    ) {
      throw new HttpError(
        409,
        'This practice changed on another device. Refresh before starting a new session.',
      );
    }
    if (!sameSession && input.index !== 0)
      throw new HttpError(400, 'A new practice session must start at the first question.');
    const attempts = await tx
      .select()
      .from(tables.attempts)
      .where(and(eq(tables.attempts.userId, userId), eq(tables.attempts.sessionId, input.id)));
    if (!sameSession && attempts.length)
      throw new HttpError(409, 'This session has already ended. Refresh to start a new practice.');
    const answers = Object.fromEntries(
      attempts
        .filter((a) => input.questionIds.includes(a.questionId))
        .map((a) => [a.questionId, a.optionId]),
    );
    const firstUnanswered = input.questionIds.findIndex((id) => !answers[id]);
    const index = Math.min(
      Math.max(input.index, sameSession ? current.index : 0),
      firstUnanswered < 0 ? input.questionIds.length : firstUnanswered,
    );
    const activeSession: PracticeSession = {
      id: input.id,
      questionIds: input.questionIds,
      index,
      answers,
    };
    await tx
      .update(tables.preferences)
      .set({ activeSession, updatedAt: new Date() })
      .where(eq(tables.preferences.userId, userId));
    return activeSession;
  });
}
export async function saveSettings(userId: string, settings: StudySettings) {
  const db = await getDb();
  await db
    .insert(tables.preferences)
    .values({ userId, settings })
    .onConflictDoUpdate({
      target: tables.preferences.userId,
      set: { settings, updatedAt: new Date() },
    });
}
export async function saveAppearance(userId: string, appearance: Appearance) {
  const db = await getDb();
  await db
    .insert(tables.preferences)
    .values({ userId, settings: defaultSettings, appearance })
    .onConflictDoUpdate({
      target: tables.preferences.userId,
      set: { appearance, updatedAt: new Date() },
    });
}
export async function clearPractice(userId: string, sessionId: string) {
  const db = await getDb();
  const cleared = await db
    .update(tables.preferences)
    .set({ activeSession: null, updatedAt: new Date() })
    .where(
      and(
        eq(tables.preferences.userId, userId),
        sql`${tables.preferences.activeSession}->>'id' = ${sessionId}`,
      ),
    )
    .returning({ userId: tables.preferences.userId });
  if (!cleared.length) {
    // A lost response can cause the same finish operation to be retried. An
    // already-cleared session is successful; a different active one stays safe.
    const [current] = await db
      .select({ activeSession: tables.preferences.activeSession })
      .from(tables.preferences)
      .where(eq(tables.preferences.userId, userId));
    if (current?.activeSession)
      throw new HttpError(
        409,
        'This practice changed on another device. Refresh to continue your latest session.',
      );
  }
}
export async function setBookmark(userId: string, questionId: string, bookmarked: boolean) {
  const db = await getDb();
  if (bookmarked)
    await db.insert(tables.bookmarks).values({ userId, questionId }).onConflictDoNothing();
  else
    await db
      .delete(tables.bookmarks)
      .where(and(eq(tables.bookmarks.userId, userId), eq(tables.bookmarks.questionId, questionId)));
}
export async function addReport(userId: string, questionId: string, reason: string) {
  const db = await getDb();
  const recent = await db
    .select({ id: tables.reports.id })
    .from(tables.reports)
    .where(
      and(
        eq(tables.reports.userId, userId),
        gte(tables.reports.createdAt, new Date(Date.now() - 86400000)),
      ),
    );
  if (recent.length >= 20)
    throw new HttpError(429, 'You have sent 20 reports today. Please try again tomorrow.');
  await db.insert(tables.reports).values({ id: randomUUID(), userId, questionId, reason });
}
