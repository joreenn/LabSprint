import type { Question, Subject } from './types';

// Editorial expansion goal, not a claim of available content or a mastery threshold.
export const SUBJECT_QUESTION_TARGET = 2000;
export const sourceIdentity = (q: Question) => `${q.source.title}|${q.source.edition || ''}`;

export function expansionCoverage(bank: readonly Question[], catalog: readonly Subject[]) {
  return catalog.map((subject) => {
    const items = bank.filter((q) => q.subjectId === subject.id);
    return {
      subjectId: subject.id,
      subject: subject.name,
      available: items.length,
      target: SUBJECT_QUESTION_TARGET,
      remaining: Math.max(0, SUBJECT_QUESTION_TARGET - items.length),
      sources: new Set(items.map(sourceIdentity)).size,
    };
  });
}
