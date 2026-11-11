import { questions, subjects } from '@/content/questions';

export type AttemptRecord = {
  id: string;
  sessionId: string;
  questionId: string;
  optionId: string;
  correct: boolean;
  questionVersion?: number;
  createdAt: string;
};
export const questionMap = new Map(questions.map((q) => [q.id, q]));
// A UI convention for a small sample, not a validated mastery or readiness threshold.
// Count unique first attempts within the currently displayed subject/topic/bank.
export const LIMITED_PRACTICE_THRESHOLD = 5;
export const LIMITED_PRACTICE_EXPLANATION = `Based on fewer than ${LIMITED_PRACTICE_THRESHOLD} first attempts; a small sample.`;
export const CORRECTION_EXPLANATION =
  'A correction shows practice improvement, not lasting mastery.';
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
  const firstIds = new Set(first.map((a) => a.id));
  const repeats = all.filter((a) => !firstIds.has(a.id));
  const firstCorrect = first.filter((a) => a.correct).length;
  const repeatCorrect = repeats.filter((a) => a.correct).length;
  // A latest correct answer must follow a recorded wrong answer. If the learner
  // misses it again later, it belongs in the missed queue rather than this count.
  const missedIds = new Set(all.filter((a) => !a.correct).map((a) => a.questionId));
  const corrected = [...latest.values()].filter(
    (a) => a.correct && missedIds.has(a.questionId),
  ).length;
  return {
    total: bank.length,
    seen: first.length,
    firstCorrect,
    accuracy: percent(firstCorrect, first.length),
    coverage: percent(first.length, bank.length),
    repeatCount: repeats.length,
    repeatCorrect,
    repeatAccuracy: percent(repeatCorrect, repeats.length),
    corrected,
    limitedData: first.length > 0 && first.length < LIMITED_PRACTICE_THRESHOLD,
    attempts: all.length,
    needsReview: [...latest.values()].filter((a) => !a.correct).length,
  };
}
export function localDay(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
// Convert the device-local calendar date to a day index. The UTC arithmetic
// compares calendar dates rather than elapsed hours across daylight-saving changes.
function studyDayIndex(date: Date) {
  return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86_400_000;
}

export function studyStreak(attempts: readonly AttemptRecord[], now = new Date()) {
  const today = studyDayIndex(now);
  const days = new Set<number>();
  let answeredToday = 0;

  for (const attempt of attempts) {
    const day = studyDayIndex(new Date(attempt.createdAt));
    if (!Number.isFinite(day) || day > today) continue;
    days.add(day);
    if (day === today) answeredToday++;
  }

  let current = 0;
  let longest = 0;
  let run = 0;
  let previous = -Infinity;
  for (const day of [...days].sort((a, b) => a - b)) {
    run = day === previous + 1 ? run + 1 : 1;
    longest = Math.max(longest, run);
    previous = day;
  }
  // Yesterday's streak stays active until the learner misses an entire day.
  if (previous >= today - 1) current = run;
  return { current, longest, answeredToday };
}

export function studyStreakWeek(attempts: readonly AttemptRecord[], now = new Date()) {
  const studied = new Set(attempts.map((attempt) => studyDayIndex(new Date(attempt.createdAt))));
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(now);
    date.setDate(date.getDate() + index - 6);
    return {
      date: localDay(date.toISOString()),
      weekday: date.toLocaleDateString('en', { weekday: 'short' }),
      label: date.toLocaleDateString('en', { weekday: 'long', month: 'short', day: 'numeric' }),
      practiced: studied.has(studyDayIndex(date)),
      today: index === 6,
    };
  });
}

export function firstDailyStreakSave(
  history: readonly AttemptRecord[],
  saved: AttemptRecord,
  now = new Date(),
) {
  const today = studyDayIndex(now);
  if (
    studyDayIndex(new Date(saved.createdAt)) !== today ||
    history.some((attempt) => studyDayIndex(new Date(attempt.createdAt)) === today)
  )
    return null;

  const attempts = [...history, saved];
  return {
    date: localDay(now.toISOString()),
    streak: studyStreak(attempts, now),
    week: studyStreakWeek(attempts, now),
  };
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
      correct: items.filter((a) => a.correct).length,
      accuracy: percent(items.filter((a) => a.correct).length, items.length),
    };
  });
}
export function suggestedSubject(attempts: AttemptRecord[]) {
  return [...subjects].sort((a, b) => {
    const x = progressFor(attempts, a.id),
      y = progressFor(attempts, b.id);
    return (
      y.needsReview - x.needsReview ||
      (x.total ? x.seen / x.total : 0) - (y.total ? y.seen / y.total : 0)
    );
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
