import { test } from 'node:test';
import assert from 'node:assert/strict';
import { questions, subjects } from '../src/content/questions';
import { expansionCoverage, sourceIdentity } from '../src/content/coverage';
import { referenceMixedSample } from '../src/lib/reference-sampling';

const fixture = (id: string, subjectId: string, title: string) => ({
  ...questions[0],
  id,
  subjectId,
  source: { ...questions[0].source, title },
});

test('short subject sessions draw from different available references before repeating a source', () => {
  const pool = [
    fixture('a1', 'one', 'A'),
    fixture('a2', 'one', 'A'),
    fixture('a3', 'one', 'A'),
    fixture('b', 'one', 'B'),
    fixture('c', 'one', 'C'),
  ];
  const before = JSON.stringify(pool);
  const chosen = referenceMixedSample(pool, 3, () => 0.5);
  assert.equal(new Set(chosen.map(sourceIdentity)).size, 3);
  assert.equal(JSON.stringify(pool), before);
});

test('mixed sessions cover eligible subjects and never duplicate or invent an item', () => {
  const pool = [fixture('a', 'one', 'A'), fixture('b', 'one', 'B'), fixture('c', 'two', 'A')];
  assert.equal(new Set(referenceMixedSample(pool, 2).map((q) => q.subjectId)).size, 2);
  assert.equal(referenceMixedSample([...pool, pool[0]], 100).length, 3);
  assert.deepEqual(referenceMixedSample([], 10), []);
  assert.deepEqual(referenceMixedSample(pool, 0), []);
  assert.deepEqual(referenceMixedSample(pool, -1), []);
  assert.deepEqual(referenceMixedSample(pool, NaN), []);
  assert.equal(referenceMixedSample([pool[1]], 5)[0].id, 'b');
});

test('expansion counts track the bank and distinguish the goal from availability', () => {
  const rows = expansionCoverage(questions, subjects);
  assert.equal(
    rows.reduce((n, row) => n + row.available, 0),
    questions.length,
  );
  assert.ok(
    rows.every((row) => row.target === 2000 && row.remaining === Math.max(0, 2000 - row.available)),
  );
  assert.ok(rows.every((row) => row.sources >= 1));
});
