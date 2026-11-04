import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { questions, subjects } from '../src/content/questions';
import { topicCoverage, validateQuestionBank } from '../src/content/validation';

test('the available bank passes structural validation without claiming academic review', () => {
  assert.deepEqual(validateQuestionBank(questions, subjects), []);
});

test('content validation rejects duplicate IDs, invalid keys, unexplained options, and missing metadata', () => {
  const original = questions[0];
  const invalid = structuredClone(original);
  invalid.correctOptionId = 'missing-choice';
  invalid.options[0].rationale = ' ';
  invalid.source.title = '';
  invalid.version = 0;
  const issues = validateQuestionBank([original, invalid], subjects).join('\n');
  for (const problem of [
    'duplicate question ID',
    'answer key',
    'explanation missing',
    'version',
    'reference title',
  ])
    assert.ok(issues.includes(problem), `Missing check: ${problem}`);
});

test('topic counts follow the actual bank, including empty catalog topics', () => {
  const q = questions[0];
  const rows = topicCoverage([q], subjects);
  assert.equal(rows.find((t) => t.subjectId === q.subjectId && t.topic === q.topic)?.count, 1);
  assert.equal(
    rows.reduce((sum, t) => sum + t.count, 0),
    1,
  );
  assert.equal(rows.filter((t) => t.count === 0).length, rows.length - 1);
});

test('duplicate stems and choice text cannot pad the expansion counts', () => {
  const first = structuredClone(questions[0]);
  const repeated = structuredClone(first);
  repeated.id = 'different-id-same-question';
  repeated.stem = `  ${first.stem.toUpperCase()}  `;
  repeated.options[1].text = repeated.options[0].text;
  const issues = validateQuestionBank([first, repeated], subjects).join('\n');
  assert.ok(issues.includes('duplicate stem'));
  assert.ok(issues.includes('duplicate choice text'));
});

// Historical fixtures deliberately cover the original release, not the live bank size.
function stableContent(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(stableContent);
  if (value && typeof value === 'object')
    return Object.fromEntries(
      Object.entries(value)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, item]) => [key, stableContent(item)]),
    );
  return value;
}
test('expansion preserves all original question IDs, content, answer keys, versions and references', () => {
  const baseline: Record<string, string> = JSON.parse(
    readFileSync('tests/fixtures/starter-v030-hashes.json', 'utf8'),
  );
  for (const [id, hash] of Object.entries(baseline)) {
    const question = questions.find((item) => item.id === id);
    assert.ok(question, `Original question missing: ${id}`);
    assert.equal(
      createHash('sha256')
        .update(JSON.stringify(stableContent(question)))
        .digest('hex'),
      hash,
      `Original question changed: ${id}`,
    );
  }
});
