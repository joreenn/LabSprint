import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { questions, subjects } from '../src/content/questions';
import { thinTopicQuestions } from '../src/content/thin-topic-questions';
import { referenceMixedSample } from '../src/lib/reference-sampling';
import { eligibleQuestions } from '../src/lib/practice-review';
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

test('thin-topic expansion preserves all 474 previously released question objects', () => {
  const baseline: Record<string, string> = JSON.parse(
    readFileSync('tests/fixtures/bank-v043-hashes.json', 'utf8'),
  );
  assert.equal(Object.keys(baseline).length, 474);
  const current = new Map(questions.map((question) => [question.id, question]));
  for (const [id, hash] of Object.entries(baseline)) {
    const question = current.get(id);
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

test('24 explained additions expand each of the four one-question topics to seven', () => {
  assert.equal(thinTopicQuestions.length, 24);
  assert.equal(questions.length, 498);
  assert.deepEqual(validateQuestionBank(questions, subjects), []);
  for (const [subjectId, topic] of [
    ['chemistry', 'Liver function'],
    ['urine-body-fluids', 'Renal physiology'],
    ['microbiology', 'Microbial molecular testing'],
    ['microbiology', 'Antimicrobial susceptibility'],
  ]) {
    const pool = eligibleQuestions({ subjectId, topic });
    const added = thinTopicQuestions.filter((q) => q.subjectId === subjectId && q.topic === topic);
    assert.equal(pool.length, 7);
    assert.equal(added.length, 6);
    const sampled = referenceMixedSample(pool, pool.length, () => 0.5);
    assert.equal(new Set(sampled.map((q) => q.id)).size, pool.length);
    for (const question of added) {
      assert.ok(sampled.some((q) => q.id === question.id));
      assert.equal(question.version, 1);
      assert.ok(question.source.edition);
    }
  }
});
