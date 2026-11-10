import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { questions, subjects } from '../src/content/questions';
import { microParasiteContinuation } from '../src/content/micro-parasite-continuation';
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

test('question continuation preserves all 450 previously released question objects', () => {
  const baseline: Record<string, string> = JSON.parse(
    readFileSync('tests/fixtures/bank-v042-hashes.json', 'utf8'),
  );
  assert.equal(Object.keys(baseline).length, 450);
  const byId = new Map(questions.map((question) => [question.id, question]));
  for (const [id, hash] of Object.entries(baseline)) {
    const question = byId.get(id);
    assert.ok(question, `Existing question removed: ${id}`);
    assert.equal(
      createHash('sha256')
        .update(JSON.stringify(stable(question)))
        .digest('hex'),
      hash,
      `Existing content, answer, version, or citation changed: ${id}`,
    );
  }
});

test('24 additions are available in their subject practice pools without duplicate items', () => {
  assert.equal(microParasiteContinuation.length, 24);
  assert.equal(questions.length, 474);
  assert.deepEqual(validateQuestionBank(questions, subjects), []);
  for (const subjectId of ['microbiology', 'parasitology']) {
    const added = microParasiteContinuation.filter((q) => q.subjectId === subjectId);
    assert.equal(added.length, 12);
    const pool = questions.filter((q) => q.subjectId === subjectId);
    const selected = referenceMixedSample(pool, pool.length, () => 0.5);
    assert.equal(new Set(selected.map((q) => q.id)).size, pool.length);
    for (const question of added)
      assert.ok(
        selected.some((q) => q.id === question.id),
        `Unreachable question: ${question.id}`,
      );
  }
});
