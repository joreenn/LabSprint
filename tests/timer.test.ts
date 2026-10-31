import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  beginNextPhase,
  clampTimerPosition,
  formatTimer,
  initialTimer,
  isStoredTimer,
  pauseTimer,
  timerMilliseconds,
  timerPreset,
} from '../src/lib/study-timer';

test('countdown uses elapsed timestamps across suspended tabs and never goes negative', () => {
  const running = { ...initialTimer, running: true, startedAt: 1000 };
  assert.equal(timerMilliseconds(running, 61000), 24 * 60000);
  assert.equal(timerMilliseconds(running, 1000 + 45 * 60000), 0);
  const paused = pauseTimer(running, 61000);
  assert.equal(timerMilliseconds(paused, 20 * 60000), 24 * 60000);
});
test('stopwatch pause/resume retains elapsed time without ticking while paused', () => {
  const first = { ...timerPreset('stopwatch'), running: true, startedAt: 1000 };
  const paused = pauseTimer(first, 31000);
  assert.equal(paused.elapsedMs, 30000);
  assert.equal(timerMilliseconds({ ...paused, running: true, startedAt: 100000 }, 110000), 40000);
});
test('four Pomodoro focus sessions earn a long break, which advances only on explicit action', () => {
  const finished = { ...initialTimer, remainingMs: 0, completedFocus: 3 };
  assert.equal(timerMilliseconds(finished, 12345), 0);
  const next = beginNextPhase(finished, 12345);
  assert.equal(next.phase, 'longBreak');
  assert.equal(next.remainingMs, 15 * 60000);
  assert.equal(next.completedFocus, 4);
  assert.equal(beginNextPhase({ ...next, running: false, remainingMs: 0 }, 20000).phase, 'focus');
});
test('timer drag stays inside phone edges and above navigation, even after a resize', () => {
  assert.deepEqual(
    clampTimerPosition(
      { x: 900, y: 1000 },
      { width: 285, height: 360 },
      { width: 390, height: 844 },
    ),
    { x: 93, y: 396 },
  );
  assert.deepEqual(
    clampTimerPosition(
      { x: -100, y: -100 },
      { width: 285, height: 360 },
      { width: 390, height: 844 },
    ),
    { x: 12, y: 12 },
  );
  assert.equal(formatTimer(1), '00:01');
  assert.equal(formatTimer(3600000), '1:00:00');
});
test('invalid persisted timer data cannot restore a running clock', () => {
  assert.equal(isStoredTimer(initialTimer), true);
  assert.equal(isStoredTimer({ ...initialTimer, running: true, startedAt: null }), false);
  assert.equal(isStoredTimer({ ...initialTimer, focusMinutes: Infinity }), false);
});
