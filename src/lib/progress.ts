import { questions, subjects } from '@/content/questions';

export type AttemptRecord = {
  id: string;
  sessionId: string;
  questionId: string;
  optionId: string;
  correct: boolean;
  questionVersion?: number;
  createdAt: string;
  // Server aggregate on the first answer. Original first/latest records stay intact.
  history?: {
    count: number;
    correct: number;
    lastMissedAt: string | null;
    through: { createdAt: string; id: string };
  };
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
  const grouped = new Map<string, AttemptRecord[]>();
  for (const attempt of all) {
    const group = grouped.get(attempt.questionId) ?? [];
    group.push(attempt);
    grouped.set(attempt.questionId, group);
  }
  const totals = new Map<string, { count: number; correct: number; missed: boolean }>();
  for (const initial of first) {
    const history = initial.history;
    const items = grouped.get(initial.questionId) ?? [];
    const extra = history ? items.filter((a) => afterHistory(a, history.through)) : items;
    totals.set(initial.questionId, {
      count: (history?.count ?? 0) + extra.length,
      correct: (history?.correct ?? 0) + extra.filter((a) => a.correct).length,
      missed: !!history?.lastMissedAt || extra.some((a) => !a.correct),
    });
  }
  const attemptCount = [...totals.values()].reduce((sum, item) => sum + item.count, 0);
  const firstCorrect = first.filter((a) => a.correct).length;
  const repeatCount = attemptCount - first.length;
  const repeatCorrect =
    [...totals.values()].reduce((sum, item) => sum + item.correct, 0) - firstCorrect;
  const corrected = [...latest.values()].filter(
    (a) => a.correct && totals.get(a.questionId)?.missed,
  ).length;
  return {
    total: bank.length,
    seen: first.length,
    firstCorrect,
    accuracy: percent(firstCorrect, first.length),
    coverage: percent(first.length, bank.length),
    repeatCount,
    repeatCorrect,
    repeatAccuracy: percent(repeatCorrect, repeatCount),
    corrected,
    limitedData: first.length > 0 && first.length < LIMITED_PRACTICE_THRESHOLD,
    attempts: attemptCount,
    needsReview: [...latest.values()].filter((a) => !a.correct).length,
  };
}
export function afterHistory(a: AttemptRecord, through: { createdAt: string; id: string }) {
  return (
    a.createdAt > through.createdAt || (a.createdAt === through.createdAt && a.id > through.id)
  );
}
export function everMissedQuestionIds(attempts: readonly AttemptRecord[]) {
  return new Set(
    attempts.filter((a) => !a.correct || a.history?.lastMissedAt).map((a) => a.questionId),
  );
}
export type StudyActivity = { day: string; count: number }[];
export function addStudyActivity(activity: StudyActivity, saved: AttemptRecord): StudyActivity {
  const day = localDay(saved.createdAt);
  const found = activity.some((item) => item.day === day);
  return found
    ? activity.map((item) => (item.day === day ? { ...item, count: item.count + 1 } : item))
    : [...activity, { day, count: 1 }];
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

export function studyStreak(
  attempts: readonly AttemptRecord[],
  now = new Date(),
  activity?: StudyActivity,
) {
  const today = studyDayIndex(now);
  const days = new Set<number>();
  let answeredToday = 0;

  const records = activity
    ? activity.map((item) => ({ createdAt: `${item.day}T12:00:00`, count: item.count }))
    : attempts.map((attempt) => ({ createdAt: attempt.createdAt, count: 1 }));
  for (const attempt of records) {
    const day = studyDayIndex(new Date(attempt.createdAt));
    if (!Number.isFinite(day) || day > today) continue;
    days.add(day);
    if (day === today) answeredToday += attempt.count;
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

export function studyStreakWeek(
  attempts: readonly AttemptRecord[],
  now = new Date(),
  activity?: StudyActivity,
) {
  const studied = new Set(
    activity
      ? activity.map((item) => studyDayIndex(new Date(`${item.day}T12:00:00`)))
      : attempts.map((attempt) => studyDayIndex(new Date(attempt.createdAt))),
  );
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
  activity?: StudyActivity,
) {
  const today = studyDayIndex(now);
  if (
    studyDayIndex(new Date(saved.createdAt)) !== today ||
    (activity
      ? activity.some((item) => item.day === localDay(now.toISOString()))
      : history.some((attempt) => studyDayIndex(new Date(attempt.createdAt)) === today))
  )
    return null;

  const attempts = [...history, saved];
  return {
    date: localDay(now.toISOString()),
    streak: studyStreak(attempts, now, activity && addStudyActivity(activity, saved)),
    week: studyStreakWeek(attempts, now, activity && addStudyActivity(activity, saved)),
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
