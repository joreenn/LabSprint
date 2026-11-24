import type { Question } from './types';

export type EditorialReview = {
  questionId: string;
  version: number;
  reviewer: string;
  reviewedAt: string;
  outcome: 'approved' | 'changes-requested';
  evidence: string;
};
// Add only documented reviews by a qualified, independent MLS reviewer.
// An empty register is deliberate: source checks are not independent approval.
export const editorialReviews: readonly EditorialReview[] = [];
export function editorialStatus(question: Pick<Question, 'id' | 'version'>) {
  return (
    editorialReviews.findLast(
      (review) => review.questionId === question.id && review.version === question.version,
    )?.outcome ?? 'pending'
  );
}
export function validateEditorialReviews(bank: readonly Question[], reviews = editorialReviews) {
  const errors: string[] = [];
  const keys = new Set<string>();
  for (const review of reviews) {
    const key = `${review.questionId}@${review.version}`;
    if (keys.has(key)) errors.push(`${key}: duplicate independent review`);
    keys.add(key);
    const question = bank.find((q) => q.id === review.questionId);
    if (
      !question ||
      review.version < 1 ||
      !Number.isInteger(review.version) ||
      review.version > question.version
    )
      errors.push(`${key}: unknown question/version`);
    if (
      !review.reviewer.trim() ||
      !review.evidence.trim() ||
      !/^\d{4}-\d{2}-\d{2}$/.test(review.reviewedAt) ||
      !Number.isFinite(Date.parse(review.reviewedAt))
    )
      errors.push(`${key}: reviewer, evidence and review date are required`);
    if (!['approved', 'changes-requested'].includes(review.outcome))
      errors.push(`${key}: invalid review outcome`);
    if (question?.version === review.version && review.outcome === 'changes-requested')
      errors.push(`${key}: resolve requested changes before release`);
  }
  return errors;
}
