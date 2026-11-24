import { questions } from '@/content/questions';
import type { AttemptRecord } from './progress';
import { firstAttempts, questionMap } from './progress';

export type PracticeConfig = {
  subjectId?: string;
  topic?: string;
  ids?: string[];
  label?: string;
  review?: boolean;
};

export function eligibleQuestions(
  config: PracticeConfig,
  kind = 'mixed',
  excludedIds?: ReadonlySet<string>,
) {
  const includedIds = config.ids ? new Set(config.ids) : null;
  return questions.filter(
    (q) =>
      (!config.subjectId || q.subjectId === config.subjectId) &&
      (!config.topic || q.topic === config.topic) &&
      (!includedIds || includedIds.has(q.id)) &&
      !excludedIds?.has(q.id) &&
      (kind === 'mixed' || q.kind === kind),
  );
}

export function practiceSize(poolLength: number, selected: number | 'all') {
  const available = Math.min(100, Math.max(0, poolLength));
  const choice = selected !== 'all' && selected <= available ? selected : 'all';
  return {
    choice,
    count: choice === 'all' ? available : choice,
    choices: [5, 10, 20].filter((size) => size <= available),
  };
}

type SessionAnswers = { id: string; questionIds: string[]; answers: Record<string, string> };

export function sessionRecap(session: SessionAnswers, attempts: AttemptRecord[]) {
  const first = new Map(firstAttempts(attempts).map((a) => [a.questionId, a]));
  const recordedAnswers = new Map(
    attempts.filter((a) => a.sessionId === session.id).map((a) => [a.questionId, a]),
  );
  return [...new Set(session.questionIds)].flatMap((id) => {
    const question = questionMap.get(id);
    const recorded = recordedAnswers.get(id);
    const chosen = recorded?.optionId || session.answers[id];
    if (!question || (!recorded && !question.options.some((option) => option.id === chosen)))
      return [];
    const initial = first.get(id);
    return [
      {
        question,
        chosen,
        // Saved results are authoritative, even if a later content version changes the key.
        correct: recorded ? recorded.correct : chosen === question.correctOptionId,
        attemptKind: (initial && initial.sessionId !== session.id ? 'Repeat' : 'First attempt') as
          'Repeat' | 'First attempt',
        recorded: !!recorded,
        savedVersion: recorded?.questionVersion,
        explanationVersionChanged:
          recorded?.questionVersion !== undefined && recorded.questionVersion !== question.version,
        savedChoiceUnavailable:
          !!recorded && !question.options.some((option) => option.id === chosen),
      },
    ];
  });
}

export function newPracticeIds(attempts: AttemptRecord[], session: SessionAnswers) {
  const explored = new Set([...attempts.map((a) => a.questionId), ...Object.keys(session.answers)]);
  return questions.filter((q) => !explored.has(q.id)).map((q) => q.id);
}

export const FOLLOW_UP_DAYS = 3;
const FOLLOW_UP_MS = FOLLOW_UP_DAYS * 24 * 60 * 60 * 1000;

// An early correct answer does not erase a later check. A correct answer at
// or after the due time closes it; another miss schedules a new follow-up.
export function scheduledReviews(attempts: readonly AttemptRecord[], now = Date.now()) {
  const scheduled = new Map<string, number>();
  const ordered = attempts
    .map((attempt) => ({ attempt, time: Date.parse(attempt.createdAt) }))
    .filter(({ time }) => Number.isFinite(time) && time <= now)
    .sort((a, b) => a.time - b.time || a.attempt.id.localeCompare(b.attempt.id));
  for (const initial of firstAttempts([...attempts])) {
    if (initial.history?.lastMissedAt) {
      const missedAt = Date.parse(initial.history.lastMissedAt);
      if (missedAt <= now) scheduled.set(initial.questionId, missedAt + FOLLOW_UP_MS);
    }
  }
  for (const { attempt, time } of ordered) {
    if (!questionMap.has(attempt.questionId)) continue;
    if (!attempt.correct) {
      scheduled.set(
        attempt.questionId,
        Math.max(scheduled.get(attempt.questionId) ?? 0, time + FOLLOW_UP_MS),
      );
    } else {
      const dueAt = scheduled.get(attempt.questionId);
      if (dueAt !== undefined && time >= dueAt) scheduled.delete(attempt.questionId);
    }
  }
  return [...scheduled]
    .map(([questionId, dueAt]) => ({ questionId, dueAt }))
    .sort((a, b) => a.dueAt - b.dueAt || a.questionId.localeCompare(b.questionId));
}

export type PastPractice = SessionAnswers & {
  lastAnsweredAt: string;
  answered: number;
  correct: number;
};

// Existing records identify the session but do not distinguish finish from
// replacement. Rebuild read-only recaps from the exact saved answers.
export function pastPracticeSessions(
  attempts: readonly AttemptRecord[],
  activeSessionId?: string,
): PastPractice[] {
  const sessions = new Map<string, PastPractice>();
  const ordered = [...attempts].sort(
    (a, b) => a.createdAt.localeCompare(b.createdAt) || a.id.localeCompare(b.id),
  );
  for (const attempt of ordered) {
    if (attempt.sessionId === activeSessionId) continue;
    const session = sessions.get(attempt.sessionId) ?? {
      id: attempt.sessionId,
      questionIds: [],
      answers: Object.create(null) as Record<string, string>,
      lastAnsweredAt: attempt.createdAt,
      answered: 0,
      correct: 0,
    };
    if (Object.hasOwn(session.answers, attempt.questionId)) continue;
    session.questionIds.push(attempt.questionId);
    session.answers[attempt.questionId] = attempt.optionId;
    session.lastAnsweredAt = attempt.createdAt;
    session.answered += 1;
    session.correct += Number(attempt.correct);
    sessions.set(session.id, session);
  }
  return [...sessions.values()].sort(
    (a, b) => b.lastAnsweredAt.localeCompare(a.lastAnsweredAt) || b.id.localeCompare(a.id),
  );
}
