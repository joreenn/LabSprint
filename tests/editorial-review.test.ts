import test from 'node:test';
import assert from 'node:assert/strict';
import { questions } from '../src/content/questions';
import {
  editorialStatus,
  validateEditorialReviews,
  type EditorialReview,
} from '../src/content/editorial-review';

test('independent approval is explicit, version-scoped and never inferred from source checks', () => {
  assert.equal(editorialStatus(questions[0]), 'pending');
  assert.deepEqual(validateEditorialReviews(questions), []);
  const review: EditorialReview = {
    questionId: questions[0].id,
    version: questions[0].version,
    reviewer: 'Test fixture only',
    reviewedAt: '2026-11-24',
    outcome: 'changes-requested',
    evidence: 'Fixture; no actual review',
  };
  assert.match(
    validateEditorialReviews(questions, [review]).join(' '),
    /resolve requested changes/,
  );
  assert.match(
    validateEditorialReviews(questions, [{ ...review, reviewer: '', evidence: '' }]).join(' '),
    /required/,
  );
  assert.match(validateEditorialReviews(questions, [review, review]).join(' '), /duplicate/);
  assert.match(
    validateEditorialReviews(questions, [
      { ...review, questionId: 'nonexistent', outcome: 'approved' },
    ]).join(' '),
    /unknown/,
  );
  assert.equal(questions.filter((q) => q.topic === 'Philippine Medtech Laws').length, 0);
});
