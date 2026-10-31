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
