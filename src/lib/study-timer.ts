export type TimerMode = 'pomodoro' | 'gentle' | 'custom' | 'stopwatch';
export type TimerPhase = 'focus' | 'shortBreak' | 'longBreak';
export type StudyTimerState = {
  mode: TimerMode;
  phase: TimerPhase;
  focusMinutes: number;
  breakMinutes: number;
  longBreakMinutes: number;
  completedFocus: number;
  running: boolean;
  startedAt: number | null;
  remainingMs: number;
  elapsedMs: number;
};
export const initialTimer: StudyTimerState = {
  mode: 'pomodoro',
  phase: 'focus',
  focusMinutes: 25,
  breakMinutes: 5,
  longBreakMinutes: 15,
  completedFocus: 0,
  running: false,
  startedAt: null,
  remainingMs: 25 * 60000,
  elapsedMs: 0,
};
export function timerMilliseconds(timer: StudyTimerState, now: number) {
  const elapsed =
    timer.running && timer.startedAt !== null ? Math.max(0, now - timer.startedAt) : 0;
  return timer.mode === 'stopwatch'
    ? timer.elapsedMs + elapsed
    : Math.max(0, timer.remainingMs - elapsed);
}
export function pauseTimer(timer: StudyTimerState, now: number): StudyTimerState {
  const value = timerMilliseconds(timer, now);
  return {
    ...timer,
    running: false,
    startedAt: null,
    ...(timer.mode === 'stopwatch' ? { elapsedMs: value } : { remainingMs: value }),
  };
}
export function phaseDuration(timer: StudyTimerState, phase = timer.phase) {
  return (
    (phase === 'focus'
      ? timer.focusMinutes
      : phase === 'longBreak'
        ? timer.longBreakMinutes
        : timer.breakMinutes) * 60000
  );
}
export function beginNextPhase(timer: StudyTimerState, now: number): StudyTimerState {
  const completedFocus = timer.phase === 'focus' ? timer.completedFocus + 1 : timer.completedFocus;
  const phase =
    timer.phase === 'focus'
      ? timer.mode === 'pomodoro' && completedFocus % 4 === 0
        ? 'longBreak'
        : 'shortBreak'
      : 'focus';
  const next = {
    ...timer,
    completedFocus,
    phase: phase as TimerPhase,
    running: true,
    startedAt: now,
    elapsedMs: 0,
  };
  return { ...next, remainingMs: phaseDuration(next) };
}
export function timerPreset(mode: TimerMode, previous = initialTimer): StudyTimerState {
  const focusMinutes = mode === 'gentle' ? 50 : mode === 'custom' ? previous.focusMinutes : 25;
  const breakMinutes = mode === 'gentle' ? 10 : mode === 'custom' ? previous.breakMinutes : 5;
  return { ...initialTimer, mode, focusMinutes, breakMinutes, remainingMs: focusMinutes * 60000 };
}
export function formatTimer(ms: number) {
  const seconds = Math.max(0, Math.ceil(ms / 1000));
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor(seconds / 60) % 60;
  const rest = seconds % 60;
  return hours
    ? `${hours}:${String(minutes).padStart(2, '0')}:${String(rest).padStart(2, '0')}`
    : `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(rest).padStart(2, '0')}`;
}
export type TimerPosition = { x: number; y: number };
export function clampTimerPosition(
  position: TimerPosition,
  size: { width: number; height: number },
  viewport: { width: number; height: number },
): TimerPosition {
  const margin = 12,
    bottom = viewport.width <= 700 ? 88 : 20;
  return {
    x: Math.min(
      Math.max(margin, position.x),
      Math.max(margin, viewport.width - size.width - margin),
    ),
    y: Math.min(
      Math.max(margin, position.y),
      Math.max(margin, viewport.height - size.height - bottom),
    ),
  };
}
export function isStoredTimer(value: unknown): value is StudyTimerState {
  if (!value || typeof value !== 'object') return false;
  const v = value as Record<string, unknown>;
  return (
    ['pomodoro', 'gentle', 'custom', 'stopwatch'].includes(String(v.mode)) &&
    ['focus', 'shortBreak', 'longBreak'].includes(String(v.phase)) &&
    typeof v.running === 'boolean' &&
    (v.startedAt === null ||
      (typeof v.startedAt === 'number' && Number.isFinite(v.startedAt) && v.startedAt >= 0)) &&
    ['focusMinutes', 'breakMinutes', 'longBreakMinutes'].every(
      (k) =>
        typeof v[k] === 'number' &&
        Number.isInteger(v[k]) &&
        Number(v[k]) >= 1 &&
        Number(v[k]) <= 180,
    ) &&
    ['remainingMs', 'elapsedMs', 'completedFocus'].every(
      (k) => typeof v[k] === 'number' && Number.isFinite(v[k]) && Number(v[k]) >= 0,
    ) &&
    (!v.running || v.startedAt !== null)
  );
}
