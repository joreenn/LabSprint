import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { rm } from 'node:fs/promises';
import { resolve } from 'node:path';
import { questions } from '../src/content/questions';
import {
  progressFor,
  studyStreak,
  studyStreakWeek,
  dailyProgress,
  everMissedQuestionIds,
} from '../src/lib/progress';
import { scheduledReviews, sessionRecap } from '../src/lib/practice-review';

test('compact progress preserves all-history results; session pages and recaps are scoped and read-only', async () => {
  const directory = resolve('.data', `history-test-${randomUUID()}`);
  process.env.LABSPRINT_DATA_DIR = directory;
  delete process.env.DATABASE_URL;
  const { getDb, closeDb } = await import('../src/db');
  const tables = await import('../src/db/schema');
  const { sql } = await import('drizzle-orm');
  const { getCompactWorkspace, getSessionPage, getSessionDetail, historyTimeZone } =
    await import('../src/lib/server/history');
  const { getWorkspace } = await import('../src/lib/server/workspace');
  const owner = { id: randomUUID(), name: 'History test', email: 'history@example.test' };
  const other = { id: randomUUID(), name: 'Other', email: 'other@example.test' };
  try {
    const db = await getDb();
    await db.insert(tables.user).values([owner, other]);
    const base = Date.now() - 20 * 86400000;
    const rows = Array.from({ length: 18 }, (_, i) => ({
      id: randomUUID(),
      userId: owner.id,
      sessionId: `session-${String(i).padStart(2, '0')}`,
      questionId: questions[0].id,
      optionId: questions[0].correctOptionId,
      correct: i !== 0,
      questionVersion: 1,
      createdAt: new Date(base + i * 86400000),
    }));
    rows.push({
      ...rows[0],
      id: randomUUID(),
      sessionId: 'active-session',
      questionId: questions[1].id,
      correct: false,
      createdAt: new Date(Date.now() - 60000),
    });
    rows.push({
      ...rows.at(-1)!,
      id: randomUUID(),
      sessionId: 'corrected-early',
      correct: true,
      createdAt: new Date(Date.now() - 30000),
    });
    await db.insert(tables.attempts).values(rows);
    await db
      .insert(tables.attempts)
      .values({ ...rows[0], id: randomUUID(), userId: other.id, sessionId: 'private-other' });
    await db.insert(tables.preferences).values({
      userId: owner.id,
      settings: { dailyGoal: 10, mtapDate: null, mockDate: null },
      activeSession: {
        id: 'active-session',
        questionIds: [questions[1].id],
        index: 0,
        answers: {},
      },
    });
    await db.insert(tables.bookmarks).values({ userId: owner.id, questionId: questions[0].id });
    const full = await getWorkspace(owner);
    const compact = await getCompactWorkspace(
      owner,
      historyTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone),
    );
    assert.ok(
      compact.attempts.length <= 5,
      'repeats do not produce an unbounded workspace payload',
    );
    assert.equal(full.attempts.length, 20);
    assert.deepEqual(progressFor(compact.attempts), progressFor(full.attempts));
    assert.deepEqual(dailyProgress(compact.attempts), dailyProgress(full.attempts));
    assert.deepEqual(
      studyStreak(compact.attempts, new Date(), compact.activity),
      studyStreak(full.attempts),
    );
    assert.deepEqual(
      studyStreakWeek(compact.attempts, new Date(), compact.activity),
      studyStreakWeek(full.attempts),
    );
    assert.deepEqual(scheduledReviews(compact.attempts), scheduledReviews(full.attempts));
    assert.deepEqual(everMissedQuestionIds(compact.attempts), everMissedQuestionIds(full.attempts));
    assert.deepEqual(compact.activeSession?.answers, full.activeSession?.answers);
    assert.deepEqual(compact.bookmarks, full.bookmarks);
    assert.deepEqual(
      progressFor([...compact.attempts, full.attempts[5]]),
      progressFor(full.attempts),
      'an acknowledged replay already in the aggregate is not counted twice',
    );
    const manila = await getCompactWorkspace(owner, 'Asia/Manila');
    const calendar = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Manila',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    const expectedDays = new Map<string, number>();
    for (const answer of full.attempts) {
      const day = calendar.format(new Date(answer.createdAt));
      expectedDays.set(day, (expectedDays.get(day) ?? 0) + 1);
    }
    assert.deepEqual(
      manila.activity,
      [...expectedDays]
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([day, count]) => ({ day, count })),
    );

    assert.equal(progressFor(compact.attempts).firstCorrect, 0);
    assert.equal(progressFor(compact.attempts).corrected, 2);
    const increment = {
      ...full.attempts.at(-1)!,
      id: randomUUID(),
      sessionId: 'incremental',
      correct: false,
      createdAt: new Date().toISOString(),
    };
    assert.deepEqual(
      progressFor([...compact.attempts, increment]),
      progressFor([...full.attempts, increment]),
    );
    assert.deepEqual(
      scheduledReviews([...compact.attempts, increment]),
      scheduledReviews([...full.attempts, increment]),
    );
    // Microsecond timestamps must not be lost when building the next-page cursor.
    for (let i = 0; i < 12; i++)
      await db.execute(sql`INSERT INTO attempt(id,user_id,session_id,question_id,option_id,correct,question_version,created_at)
      VALUES (${randomUUID()},${owner.id},${`precise-${i}`},${questions[0].id},${questions[0].correctOptionId},true,1,${`${new Date(base + 86400000).toISOString().slice(0, 10)}T01:00:00.000${String(i + 1).padStart(3, '0')}Z`}::timestamptz)`);
    const ids: string[] = [];
    let cursor: string | null = null;
    do {
      const page = await getSessionPage(owner.id, cursor);
      assert.ok(page.sessions.length <= 8);
      ids.push(...page.sessions.map((item) => item.id));
      cursor = page.nextCursor;
    } while (cursor);
    assert.equal(ids.length, 31);
    assert.equal(new Set(ids).size, 31);
    assert.ok(!ids.includes('active-session') && !ids.includes('private-other'));
    await assert.rejects(() => getSessionPage(owner.id, 'bad-cursor'), /no longer valid/);
    await assert.rejects(() => getSessionDetail(other.id, 'session-00'), /unavailable/);
    const before = (await getWorkspace(owner)).attempts.length;
    const first = await getSessionDetail(owner.id, 'session-00');
    const repeat = await getSessionDetail(owner.id, 'session-01');
    assert.equal(sessionRecap(first.session, first.attempts)[0].attemptKind, 'First attempt');
    assert.equal(sessionRecap(repeat.session, repeat.attempts)[0].attemptKind, 'Repeat');
    assert.equal(sessionRecap(first.session, first.attempts)[0].correct, false);
    assert.equal(
      (await getWorkspace(owner)).attempts.length,
      before,
      'opening recaps never writes attempts',
    );
    assert.deepEqual((await getCompactWorkspace(other)).bookmarks, []);
    assert.throws(() => historyTimeZone('invalid/timezone'), /refresh/);
  } finally {
    await closeDb();
    await rm(directory, { recursive: true, force: true });
  }
});
