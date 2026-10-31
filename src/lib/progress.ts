import { questions, subjects } from '@/content/questions';

export type AttemptRecord = {
  id: string;
  sessionId: string;
  questionId: string;
  optionId: string;
  correct: boolean;
  createdAt: string;
};
export const questionMap = new Map(questions.map((q) => [q.id, q]));
export const percent = (correct: number, total: number) =>
  total ? Math.round((correct / total) * 100) : null;
export function firstAttempts(attempts: AttemptRecord[]) {
  const first = new Map<string, AttemptRecord>();
  [...attempts]
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt) || a.id.localeCompare(b.id))
    .forEach((a) => {
      if (questionMap.has(a.questionId) && !first.has(a.questionId)) first.set(a.questionId, a);
    });
  return [...first.values()];
}
export function latestAttempts(attempts: AttemptRecord[]) {
  const latest = new Map<string, AttemptRecord>();
  [...attempts]
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt) || a.id.localeCompare(b.id))
    .forEach((a) => {
      if (questionMap.has(a.questionId)) latest.set(a.questionId, a);
    });
  return latest;
}
export function progressFor(attempts: AttemptRecord[], subjectId?: string, topic?: string) {
  const bank = questions.filter(
    (q) => (!subjectId || q.subjectId === subjectId) && (!topic || q.topic === topic),
  );
  const ids = new Set(bank.map((q) => q.id));
  const all = attempts.filter((a) => ids.has(a.questionId));
  const first = firstAttempts(all);
  const latest = latestAttempts(all);
  return {
    total: bank.length,
    seen: first.length,
    accuracy: percent(first.filter((a) => a.correct).length, first.length),
    repeatAccuracy: percent(
      all.filter((a) => !first.some((f) => f.id === a.id) && a.correct).length,
      all.length - first.length,
    ),
    attempts: all.length,
    needsReview: [...latest.values()].filter((a) => !a.correct).length,
  };
}
export function localDay(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
export function dailyProgress(attempts: AttemptRecord[], now = new Date()) {
  const first = firstAttempts(attempts);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - 6 + i);
    const day = localDay(d.toISOString());
    const items = first.filter((a) => localDay(a.createdAt) === day);
    return {
      day,
      label: d.toLocaleDateString('en', { weekday: 'short' }),
      count: items.length,
      accuracy: percent(items.filter((a) => a.correct).length, items.length),
    };
  });
}
export function suggestedSubject(attempts: AttemptRecord[]) {
  return [...subjects].sort((a, b) => {
    const x = progressFor(attempts, a.id),
      y = progressFor(attempts, b.id);
    return y.needsReview - x.needsReview || x.seen / x.total - y.seen / y.total;
  })[0];
}
export function shuffled<T>(items: T[]) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
