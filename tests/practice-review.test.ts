import { test } from 'node:test';
import assert from 'node:assert/strict';
import { questions } from '../src/content/questions';
import {
  eligibleQuestions,
  newPracticeIds,
  practiceSize,
  sessionRecap,
} from '../src/lib/practice-review';
import type { AttemptRecord } from '../src/lib/progress';

const q = questions[0];
const session = { id: 'current', questionIds: [q.id], answers: { [q.id]: q.correctOptionId } };
const record = (
  id: string,
  sessionId: string,
  correct: boolean,
  createdAt: string,
): AttemptRecord => ({
  id,
  sessionId,
  questionId: q.id,
  optionId: q.correctOptionId,
  correct,
  createdAt,
});

test('practice pools follow active filters, including single and empty selections', () => {
  assert.deepEqual(
    eligibleQuestions({ ids: [q.id] }).map((item) => item.id),
    [q.id],
  );
  assert.equal(eligibleQuestions({ ids: [] }).length, 0);
  assert.equal(
    eligibleQuestions({ ids: [q.id] }, q.kind === 'recall' ? 'case' : 'recall').length,
    0,
  );
  assert.ok(
    eligibleQuestions({ subjectId: q.subjectId, topic: q.topic }).every(
      (item) => item.subjectId === q.subjectId && item.topic === q.topic,
    ),
  );
});

test('session sizes never exceed the eligible pool and fall back when a filter reduces it', () => {
  assert.deepEqual(practiceSize(1, 10), { choice: 'all', count: 1, choices: [] });
  assert.deepEqual(practiceSize(8, 10), { choice: 'all', count: 8, choices: [5] });
  assert.equal(practiceSize(8, 5).count, 5);
  assert.equal(practiceSize(0, 'all').count, 0);
  assert.equal(practiceSize(150, 'all').count, 100);
});

test('recap distinguishes recorded first attempts and repeats without mutating answers', () => {
  const initial = record('first', 'earlier', false, '2026-10-01T12:00:00Z');
  const current = record('retry', 'current', true, '2026-10-02T12:00:00Z');
  const history = [current, initial];
  const before = JSON.stringify({ session, history });
  const rows = sessionRecap(session, history);
  assert.equal(rows[0].correct, true);
  assert.equal(rows[0].attemptKind, 'Repeat');
  assert.equal(rows[0].recorded, true);
  assert.equal(JSON.stringify({ session, history }), before);
  assert.equal(sessionRecap(session, [current])[0].attemptKind, 'First attempt');
});

test('saved recap results remain authoritative and unanswered or stale IDs do not become answers', () => {
  const current = record('saved', 'current', false, '2026-10-02T12:00:00Z');
  assert.equal(sessionRecap(session, [current])[0].correct, false);
  assert.equal(
    sessionRecap({ ...session, questionIds: [q.id, q.id, 'unknown'] }, [current]).length,
    1,
  );
  assert.equal(sessionRecap({ ...session, answers: {} }, [current]).length, 1);
  assert.equal(sessionRecap({ ...session, answers: {} }, [])[0], undefined);
});

test('new-question suggestions exclude recorded history and unsynced session choices', () => {
  const pending = sessionRecap(session, []);
  assert.equal(pending[0].recorded, false);
  assert.ok(!newPracticeIds([], session).includes(q.id));
  assert.equal(newPracticeIds([], session).length, questions.length - 1);
});

test('version changes are explicit and removed options never erase a saved recap result', () => {
  const current: AttemptRecord = {
    ...record('historical', 'current', true, '2026-10-02T12:00:00Z'),
    questionVersion: q.version + 1,
    optionId: 'option-removed-in-current-bank',
  };
  const [row] = sessionRecap(session, [current]);
  assert.equal(row.correct, true);
  assert.equal(row.chosen, current.optionId);
  assert.equal(row.savedVersion, current.questionVersion);
  assert.equal(row.explanationVersionChanged, true);
  assert.equal(row.savedChoiceUnavailable, true);
  assert.equal(row.question.version, q.version);
  const [sameVersion] = sessionRecap(session, [
    { ...current, questionVersion: q.version, optionId: q.correctOptionId },
  ]);
  assert.equal(sameVersion.explanationVersionChanged, false);
  assert.equal(sameVersion.savedChoiceUnavailable, false);
  assert.equal(
    sessionRecap(session, [record('legacy', 'current', true, '2026-10-02T12:00:00Z')])[0]
      .explanationVersionChanged,
    false,
  );
});
