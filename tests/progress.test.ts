import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  dailyProgress,
  firstAttempts,
  latestAttempts,
  progressFor,
  type AttemptRecord,
} from '../src/lib/progress';
import { questions, subjects } from '../src/content/questions';

const attempt = (
  id: string,
  questionId: string,
  correct: boolean,
  createdAt: string,
): AttemptRecord => ({ id, questionId, correct, createdAt, sessionId: id, optionId: 'A' });
test('first attempts remain separate from repeat improvement, regardless of input order', () => {
  const q = questions[0];
  const first = attempt('one', q.id, false, '2026-10-01T12:00:00Z');
  const repeat = attempt('two', q.id, true, '2026-10-02T12:00:00Z');
  const records = [repeat, first];
  assert.equal(firstAttempts(records)[0].id, 'one');
  assert.equal(latestAttempts(records).get(q.id)?.correct, true);
  const stats = progressFor(records, q.subjectId);
  assert.equal(stats.accuracy, 0);
  assert.equal(stats.repeatAccuracy, 100);
  assert.equal(stats.needsReview, 0);
  assert.equal(stats.seen, 1);
});
test('unseen topics have unknown accuracy, not zero or fabricated readiness', () => {
  const stats = progressFor([]);
  assert.equal(stats.accuracy, null);
  assert.equal(stats.repeatAccuracy, null);
  assert.equal(stats.seen, 0);
  assert.equal(stats.total, questions.length);
});
test('invalid historical question IDs never inflate coverage', () => {
  assert.equal(
    progressFor([attempt('bad', 'removed-question', true, '2026-10-01T12:00:00Z')]).seen,
    0,
  );
});
test('daily chart counts each question only on its first local calendar day', () => {
  const now = new Date('2026-10-30T12:00:00');
  const records = [
    attempt('one', questions[0].id, false, '2026-10-30T10:00:00'),
    attempt('two', questions[0].id, true, '2026-10-30T11:00:00'),
  ];
  const days = dailyProgress(records, now);
  assert.equal(days.length, 7);
  assert.equal(days[6].count, 1);
  assert.equal(days[6].accuracy, 0);
});
test('bank has unique stable IDs, four explained choices and real source identifiers', () => {
  assert.equal(new Set(questions.map((q) => q.id)).size, questions.length);
  for (const s of subjects)
    assert.ok(
      questions.some((q) => q.subjectId === s.id),
      `${s.id} has no practice questions`,
    );
  for (const q of questions) {
    const s = subjects.find((s) => s.id === q.subjectId);
    assert.ok(s?.topics.includes(q.topic), `Unknown topic: ${q.id}`);
    assert.equal(q.options.length, 4);
    assert.equal(new Set(q.options.map((o) => o.id)).size, 4);
    assert.ok(q.options.some((o) => o.id === q.correctOptionId));
    assert.ok(q.options.every((o) => o.rationale.length > 20));
    assert.ok(q.source.pdfPage > 0 && q.source.title.length > 5 && q.source.chapter.length > 2);
  }
});
