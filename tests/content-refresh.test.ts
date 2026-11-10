import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { questions, subjects } from '../src/content/questions';
import { referenceRefreshQuestions } from '../src/content/reference-refresh-questions';
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

test('reference refresh preserves every question from the 366-item release', () => {
  const baseline: Record<string, string> = JSON.parse(
    readFileSync('tests/fixtures/bank-v040-hashes.json', 'utf8'),
  );
  assert.equal(Object.keys(baseline).length, 366);
  for (const [id, hash] of Object.entries(baseline)) {
    const question = questions.find((item) => item.id === id);
    assert.ok(question, `Existing question removed: ${id}`);
    assert.equal(
      createHash('sha256')
        .update(JSON.stringify(stable(question)))
        .digest('hex'),
      hash,
      `Existing content, key, version, or citation changed: ${id}`,
    );
  }
});

test('the complete refresh is available to normal practice selection without duplicate items', () => {
  assert.equal(referenceRefreshQuestions.length, 42);
  assert.ok(questions.length >= 408);
  assert.deepEqual(validateQuestionBank(questions, subjects), []);
  const selected = referenceMixedSample(questions, questions.length, () => 0.5);
  assert.equal(new Set(selected.map((q) => q.id)).size, questions.length);
  for (const question of referenceRefreshQuestions)
    assert.ok(
      selected.some((q) => q.id === question.id),
      `Unreachable new item: ${question.id}`,
    );
});
