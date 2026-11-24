import { sql, and, eq, inArray, asc } from 'drizzle-orm';
import { getDb } from '../../db';
import * as tables from '../../db/schema';
import type { AttemptRecord } from '../progress';
import { pastPracticeSessions } from '../practice-review';
import { HttpError } from './http';
import { defaultAppearance, defaultSettings, toAttempt } from './workspace';

export const SESSION_PAGE_SIZE = 8;
export function historyTimeZone(value: string | null) {
  const zone = value || 'UTC';
  try {
    return new Intl.DateTimeFormat('en', { timeZone: zone }).resolvedOptions().timeZone;
  } catch {
    throw new HttpError(400, 'Please refresh to load your local study calendar.');
  }
}

// Aggregate in PostgreSQL. The response grows with explored questions and study
// days, rather than every repeat. All original answer rows remain in the database.
export async function getCompactWorkspace(
  user: { id: string; name: string; email: string },
  zone = 'UTC',
) {
  const db = await getDb();
  return db.transaction(
    async (tx) => {
      const [preferences] = await tx
        .select()
        .from(tables.preferences)
        .where(eq(tables.preferences.userId, user.id));
      const activeId = preferences?.activeSession?.id ?? null;
      const result = await tx.execute<{
        answer: Omit<AttemptRecord, 'history'>;
        count: number;
        correct: number;
        lastMissedAt: string | null;
        through: { createdAt: string; id: string };
        first: boolean;
      }>(sql`
      WITH ranked AS (
        SELECT *, row_number() OVER (PARTITION BY question_id ORDER BY date_trunc('milliseconds', created_at), id) AS first_rank,
          row_number() OVER (PARTITION BY question_id ORDER BY date_trunc('milliseconds', created_at) DESC, id DESC) AS last_rank
        FROM attempt WHERE user_id = ${user.id}
      ), totals AS (
        SELECT question_id, count(*)::int AS count, count(*) FILTER (WHERE correct)::int AS correct,
          max(created_at) FILTER (WHERE NOT correct) AS last_missed_at
        FROM ranked GROUP BY question_id
      )
      SELECT jsonb_build_object('id', a.id, 'sessionId', a.session_id, 'questionId', a.question_id,
        'optionId', a.option_id, 'correct', a.correct, 'questionVersion', a.question_version,
        'createdAt', a.created_at) AS answer,
        t.count, t.correct, t.last_missed_at AS "lastMissedAt", a.first_rank = 1 AS first,
        jsonb_build_object('createdAt', l.created_at, 'id', l.id) AS through
      FROM ranked a JOIN totals t USING (question_id)
        JOIN ranked l ON l.question_id = a.question_id AND l.last_rank = 1
      WHERE a.first_rank = 1 OR a.last_rank = 1 OR a.session_id = ${activeId}
      ORDER BY a.created_at, a.id
    `);
      const activityResult = await tx.execute<{ day: string; count: number }>(sql`
      SELECT to_char(created_at AT TIME ZONE ${zone}, 'YYYY-MM-DD') AS day, count(*)::int AS count
      FROM attempt WHERE user_id = ${user.id} GROUP BY day ORDER BY day
    `);
      const bookmarks = await tx
        .select()
        .from(tables.bookmarks)
        .where(eq(tables.bookmarks.userId, user.id));
      const attempts: AttemptRecord[] = result.rows.map((row) => ({
        ...row.answer,
        createdAt: new Date(row.answer.createdAt).toISOString(),
        ...(row.first
          ? {
              history: {
                count: Number(row.count),
                correct: Number(row.correct),
                lastMissedAt: row.lastMissedAt ? new Date(row.lastMissedAt).toISOString() : null,
                through: {
                  ...row.through,
                  createdAt: new Date(row.through.createdAt).toISOString(),
                },
              },
            }
          : {}),
      }));
      const active = preferences?.activeSession;
      return {
        user,
        attempts,
        activity: activityResult.rows,
        bookmarks: bookmarks.map((b) => b.questionId),
        settings: preferences?.settings || defaultSettings,
        appearance: preferences?.appearance || defaultAppearance,
        activeSession: active
          ? {
              ...active,
              answers: Object.fromEntries(
                attempts
                  .filter((a) => a.sessionId === active.id)
                  .map((a) => [a.questionId, a.optionId]),
              ),
            }
          : null,
      };
    },
    { isolationLevel: 'repeatable read', accessMode: 'read only' },
  );
}

type Cursor = { at: string; id: string };
function decodeCursor(raw?: string | null): Cursor | null {
  if (!raw) return null;
  try {
    if (raw.length > 1200) throw new Error();
    const value = JSON.parse(Buffer.from(raw, 'base64url').toString('utf8'));
    if (
      typeof value.id !== 'string' ||
      !value.id.length ||
      value.id.length > 200 ||
      typeof value.at !== 'string' ||
      !Number.isFinite(Date.parse(value.at))
    )
      throw new Error();
    if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3,6}Z$/.test(value.at)) throw new Error();
    return { at: value.at, id: value.id };
  } catch {
    throw new HttpError(400, 'This session page is no longer valid. Reload your past sessions.');
  }
}
export async function getSessionPage(userId: string, rawCursor?: string | null) {
  const cursor = decodeCursor(rawCursor);
  const db = await getDb();
  const result = await db.execute<{
    id: string;
    lastAnsweredAt: string;
    cursorAt: string;
    answered: number;
    correct: number;
  }>(sql`
    SELECT session_id AS id, max(created_at) AS "lastAnsweredAt",
      to_char(max(created_at) AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.US"Z"') AS "cursorAt", count(*)::int AS answered,
      count(*) FILTER (WHERE correct)::int AS correct FROM attempt
    WHERE user_id = ${userId} AND session_id IS DISTINCT FROM (
      SELECT active_session->>'id' FROM study_preferences WHERE user_id = ${userId}
    ) GROUP BY session_id
    ${cursor ? sql`HAVING (max(created_at), session_id) < (${cursor.at}::timestamptz, ${cursor.id})` : sql``}
    ORDER BY max(created_at) DESC, session_id DESC LIMIT ${SESSION_PAGE_SIZE + 1}
  `);
  const rows = result.rows.slice(0, SESSION_PAGE_SIZE).map((row) => ({
    ...row,
    lastAnsweredAt: new Date(row.lastAnsweredAt).toISOString(),
  }));
  const last = rows.at(-1);
  return {
    sessions: rows,
    nextCursor:
      result.rows.length > SESSION_PAGE_SIZE && last
        ? Buffer.from(JSON.stringify({ at: last.cursorAt, id: last.id })).toString('base64url')
        : null,
  };
}
export async function getSessionDetail(userId: string, sessionId: string) {
  if (!sessionId || sessionId.length > 200)
    throw new HttpError(400, 'Please choose a saved session.');
  const db = await getDb();
  const rows = await db
    .select()
    .from(tables.attempts)
    .where(and(eq(tables.attempts.userId, userId), eq(tables.attempts.sessionId, sessionId)))
    .orderBy(asc(tables.attempts.createdAt), asc(tables.attempts.id))
    .limit(101);
  if (!rows.length) throw new HttpError(404, 'This saved session is unavailable.');
  if (rows.length > 100) throw new HttpError(413, 'This saved session exceeds the recap limit.');
  const answers = rows.map(toAttempt);
  const initial = await db
    .selectDistinctOn([tables.attempts.questionId])
    .from(tables.attempts)
    .where(
      and(
        eq(tables.attempts.userId, userId),
        inArray(
          tables.attempts.questionId,
          rows.map((r) => r.questionId),
        ),
      ),
    )
    .orderBy(
      asc(tables.attempts.questionId),
      sql`date_trunc('milliseconds', ${tables.attempts.createdAt})`,
      asc(tables.attempts.id),
    );
  const attempts = [
    ...new Map([...initial.map(toAttempt), ...answers].map((a) => [a.id, a])).values(),
  ];
  return { session: pastPracticeSessions(answers)[0], attempts };
}
