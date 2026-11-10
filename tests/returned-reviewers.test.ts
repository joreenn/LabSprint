import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { questions, subjects } from '../src/content/questions';
import { returnedReviewerQuestions } from '../src/content/returned-reviewer-questions';
import { referenceMixedSample } from '../src/lib/reference-sampling';
import { validateQuestionBank } from '../src/content/validation';

function stable(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === 'object')
    return Object.fromEntries(
      Object.entries(value)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, item]) => [key, stable(item)]),
    );
  return value;
}

test('returned reviewers preserve all 408 released question objects', () => {
  const baseline: Record<string, string> = JSON.parse(
    readFileSync('tests/fixtures/bank-v041-hashes.json', 'utf8'),
  );
  assert.equal(Object.keys(baseline).length, 408);
  const byId = new Map(questions.map((question) => [question.id, question]));
  for (const [id, hash] of Object.entries(baseline)) {
    const question = byId.get(id);
    assert.ok(question, `Existing question removed: ${id}`);
    assert.equal(
      createHash('sha256')
        .update(JSON.stringify(stable(question)))
        .digest('hex'),
      hash,
      `Existing question content, key, version, or citation changed: ${id}`,
    );
  }
});

test('returned batch reaches practice across seven subjects and five supplied references', () => {
  assert.equal(returnedReviewerQuestions.length, 42);
  assert.equal(questions.length, 450);
  assert.deepEqual(validateQuestionBank(questions, subjects), []);
  for (const subject of subjects)
    assert.equal(returnedReviewerQuestions.filter((q) => q.subjectId === subject.id).length, 6);
  assert.equal(new Set(returnedReviewerQuestions.map((q) => q.source.title)).size, 5);
  const selected = referenceMixedSample(questions, questions.length, () => 0.5);
  assert.equal(new Set(selected.map((q) => q.id)).size, questions.length);
  for (const question of returnedReviewerQuestions) {
    assert.ok(
      selected.some((q) => q.id === question.id),
      `Unreachable addition: ${question.id}`,
    );
    assert.equal(question.version, 1);
  }
});
