'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from 'react';
import {
  ChevronDown,
  ChevronUp,
  Coffee,
  Grip,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  Timer,
  X,
} from 'lucide-react';
import {
  beginNextPhase,
  clampTimerPosition,
  formatTimer,
  initialTimer,
  isStoredTimer,
  pauseTimer,
  phaseDuration,
  timerMilliseconds,
  timerPreset,
  type StudyTimerState,
  type TimerMode,
  type TimerPosition,
} from '@/lib/study-timer';
import './study-timer.css';

export function StudyTimer({
  open,
  onClose,
  userId,
}: {
  open: boolean;
  onClose: () => void;
  userId: string;
}) {
  const [timer, setTimer] = useState<StudyTimerState>(initialTimer);
  const [position, setPosition] = useState<TimerPosition | null>(null);
  const [minimized, setMinimized] = useState(false);
  const [now, setNow] = useState(0);
  const [loadedUser, setLoadedUser] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; y: number; id: number } | null>(null);
  const storageKey = `labsprint-study-timer-v1:${userId}`;

  useEffect(() => {
    let next = { ...initialTimer },
      nextPosition: TimerPosition | null = null,
      nextMinimized = false;
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const saved = JSON.parse(raw);
        if (isStoredTimer(saved.timer)) next = saved.timer;
        if (
          saved.position &&
          Number.isFinite(saved.position.x) &&
          Number.isFinite(saved.position.y)
        )
          nextPosition = saved.position;
        nextMinimized = saved.minimized === true;
      }
    } catch {}
    setTimer(next);
    setPosition(nextPosition);
    setMinimized(nextMinimized);
    setNow(Date.now());
    setLoadedUser(userId);
  }, [storageKey, userId]);
  useEffect(() => {
    if (loadedUser !== userId) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify({ timer, position, minimized }));
    } catch {}
  }, [timer, position, minimized, storageKey, userId, loadedUser]);
  useEffect(() => {
    if (!timer.running) return;
    const tick = () => setNow(Date.now());
    tick();
    const interval = setInterval(tick, 250);
    const wake = () => {
      if (document.visibilityState === 'visible') tick();
    };
    document.addEventListener('visibilitychange', wake);
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', wake);
    };
  }, [timer.running]);
  const remaining = timerMilliseconds(timer, now);
  useEffect(() => {
    if (timer.mode !== 'stopwatch' && timer.running && remaining === 0)
      setTimer((t) => ({ ...t, running: false, startedAt: null, remainingMs: 0 }));
  }, [remaining, timer.mode, timer.running]);
  const constrain = useCallback((next: TimerPosition) => {
    const box = panel.current?.getBoundingClientRect();
    return clampTimerPosition(
      next,
      { width: box?.width || 300, height: box?.height || 360 },
      { width: window.innerWidth, height: window.innerHeight },
    );
  }, []);
  useEffect(() => {
    if (!open) return;
    const resize = () =>
      setPosition((current) => {
        const box = panel.current?.getBoundingClientRect();
        return constrain(
          current || {
            x: window.innerWidth - (box?.width || 300) - 20,
            y: window.innerHeight - (box?.height || 360) - (window.innerWidth <= 700 ? 100 : 28),
          },
        );
      });
    const frame = requestAnimationFrame(resize);
    window.addEventListener('resize', resize);
    window.visualViewport?.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      window.visualViewport?.removeEventListener('resize', resize);
    };
  }, [open, minimized, constrain, loadedUser]);
  function pointerDown(e: PointerEvent<HTMLDivElement>) {
    if (e.button !== 0) return;
    const box = panel.current?.getBoundingClientRect();
    if (!box) return;
    drag.current = { x: e.clientX - box.left, y: e.clientY - box.top, id: e.pointerId };
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
  }
  function pointerMove(e: PointerEvent<HTMLDivElement>) {
    if (!drag.current || drag.current.id !== e.pointerId) return;
    setPosition(constrain({ x: e.clientX - drag.current.x, y: e.clientY - drag.current.y }));
  }
  function pointerUp(e: PointerEvent<HTMLDivElement>) {
    if (drag.current?.id !== e.pointerId) return;
    drag.current = null;
    setDragging(false);
    if (e.currentTarget.hasPointerCapture(e.pointerId))
      e.currentTarget.releasePointerCapture(e.pointerId);
  }
  function keyboardMove(e: KeyboardEvent<HTMLDivElement>) {
    const directions: Record<string, [number, number]> = {
      ArrowLeft: [-1, 0],
      ArrowRight: [1, 0],
      ArrowUp: [0, -1],
      ArrowDown: [0, 1],
    };
    const d = directions[e.key];
    if (!d) return;
    e.preventDefault();
    const box = panel.current?.getBoundingClientRect();
    const amount = e.shiftKey ? 30 : 10;
    setPosition(
      constrain({
        x: (position?.x ?? box?.left ?? 20) + d[0] * amount,
        y: (position?.y ?? box?.top ?? 20) + d[1] * amount,
      }),
    );
  }
  function toggle() {
    const at = Date.now();
    setNow(at);
    setTimer((t) => (t.running ? pauseTimer(t, at) : { ...t, running: true, startedAt: at }));
  }
  function reset() {
    setNow(Date.now());
    setTimer((t) => ({
      ...t,
      running: false,
      startedAt: null,
      elapsedMs: 0,
      remainingMs: phaseDuration(t),
    }));
  }
  function customize(field: 'focusMinutes' | 'breakMinutes', value: string) {
    const minutes = Math.min(180, Math.max(1, Math.round(Number(value) || 1)));
    setTimer((t) => {
      const next = { ...t, [field]: minutes };
      return { ...next, remainingMs: phaseDuration(next) };
    });
  }
  const complete = timer.mode !== 'stopwatch' && remaining === 0;
  const phaseLabel =
    timer.mode === 'stopwatch'
      ? 'Open study'
      : timer.phase === 'focus'
        ? 'Focus time'
        : timer.phase === 'longBreak'
          ? 'Long break'
          : 'Short break';
  const phaseIcon =
    timer.phase === 'focus' || timer.mode === 'stopwatch' ? (
      <Sparkles size={14} />
    ) : (
      <Coffee size={14} />
    );
  const nextLabel =
    timer.phase === 'focus'
      ? `Start ${timer.mode === 'pomodoro' && (timer.completedFocus + 1) % 4 === 0 ? timer.longBreakMinutes : timer.breakMinutes}-min break`
      : `Start ${timer.focusMinutes}-min focus`;
  if (!open || loadedUser !== userId) return null;
  return (
    <div
      ref={panel}
      role="region"
      aria-label="Floating study timer"
      className={`study-timer ${minimized ? 'timer-minimized' : ''} ${dragging ? 'timer-dragging' : ''}`}
      style={position ? { left: position.x, top: position.y } : { right: 20, bottom: 100 }}
    >
      <div className="timer-topbar">
        <div
          className="timer-drag-handle"
          role="button"
          tabIndex={0}
          aria-label="Move study timer. Drag or use arrow keys; hold Shift for larger moves."
          onPointerDown={pointerDown}
          onPointerMove={pointerMove}
          onPointerUp={pointerUp}
          onPointerCancel={pointerUp}
          onKeyDown={keyboardMove}
        >
          <Grip size={15} />
          <span>
            <Timer size={14} />
            Study timer
          </span>
        </div>
        <button
          className="timer-icon-button"
          onClick={() => setMinimized((m) => !m)}
          aria-label={minimized ? 'Expand study timer' : 'Minimize study timer'}
        >
          {minimized ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        <button className="timer-icon-button" onClick={onClose} aria-label="Hide study timer">
          <X size={16} />
        </button>
      </div>
      {minimized ? (
        <div className="timer-mini">
          <span>{formatTimer(remaining)}</span>
          <small>{phaseLabel}</small>
          <button
            className="timer-icon-button"
            onClick={
              complete
                ? () => {
                    const at = Date.now();
                    setNow(at);
                    setTimer((t) => beginNextPhase(t, at));
                  }
                : toggle
            }
            aria-label={complete ? nextLabel : timer.running ? 'Pause timer' : 'Start timer'}
          >
            {timer.running ? <Pause size={16} /> : <Play size={16} />}
          </button>
        </div>
      ) : (
        <div className="timer-body">
          <div className="timer-technique">
            <label htmlFor="study-technique">A little space to focus</label>
            <select
              id="study-technique"
              aria-label="Study technique"
              disabled={timer.running}
              value={timer.mode}
              onChange={(e) => {
                setTimer((t) => timerPreset(e.target.value as TimerMode, t));
                setNow(Date.now());
              }}
            >
              <option value="pomodoro">Pomodoro · 25 / 5</option>
              <option value="gentle">Deep focus · 50 / 10</option>
              <option value="custom">My own rhythm</option>
              <option value="stopwatch">Open study · stopwatch</option>
            </select>
          </div>
          {timer.mode === 'custom' ? (
            <div className="timer-custom">
              <label>
                Focus (min)
                <input
                  aria-label="Custom focus minutes"
                  type="number"
                  min={1}
                  max={180}
                  disabled={timer.running}
                  value={timer.focusMinutes}
                  onChange={(e) => customize('focusMinutes', e.target.value)}
                />
              </label>
              <label>
                Break (min)
                <input
                  aria-label="Custom break minutes"
                  type="number"
                  min={1}
                  max={180}
                  disabled={timer.running}
                  value={timer.breakMinutes}
                  onChange={(e) => customize('breakMinutes', e.target.value)}
                />
              </label>
            </div>
          ) : null}
          <div className={`timer-clock ${complete ? 'timer-complete' : ''}`}>
            <span className="timer-phase">
              {phaseIcon}
              {phaseLabel}
            </span>
            <strong aria-live="off">{formatTimer(remaining)}</strong>
            <span className="timer-caption" role="status">
              {complete
                ? timer.phase === 'focus'
                  ? 'Focus complete. You’ve earned a breather.'
                  : 'Break complete. Ready when you are.'
                : timer.mode === 'stopwatch'
                  ? 'A gentle clock, without a finish line.'
                  : timer.running
                    ? 'One thing at a time. You’re doing well.'
                    : 'No rush. Start when you’re ready.'}
            </span>
          </div>
          {timer.mode === 'pomodoro' ? (
            <div
              className="timer-rounds"
              aria-label={`${timer.completedFocus} completed focus sessions`}
            >
              <span>
                {[0, 1, 2, 3].map((n) => (
                  <i
                    className={
                      n < timer.completedFocus % 4 ||
                      (timer.completedFocus > 0 && timer.completedFocus % 4 === 0)
                        ? 'done'
                        : ''
                    }
                    key={n}
                  />
                ))}
              </span>
              <small>
                {timer.completedFocus} focus {timer.completedFocus === 1 ? 'session' : 'sessions'}{' '}
                complete
              </small>
            </div>
          ) : null}
          <div className="timer-controls">
            <button
              className="button primary"
              onClick={
                complete
                  ? () => {
                      const at = Date.now();
                      setNow(at);
                      setTimer((t) => beginNextPhase(t, at));
                    }
                  : toggle
              }
            >
              {timer.running ? <Pause size={16} /> : <Play size={16} />}{' '}
              {complete
                ? nextLabel
                : timer.running
                  ? 'Pause'
                  : timer.startedAt === null &&
                      ((timer.mode === 'stopwatch' && timer.elapsedMs > 0) ||
                        (timer.mode !== 'stopwatch' && timer.remainingMs < phaseDuration(timer)))
                    ? 'Resume'
                    : 'Start'}
            </button>
            <button className="timer-reset" onClick={reset} aria-label="Reset current timer">
              <RotateCcw size={17} />
            </button>
          </div>
          <p className="timer-help">
            {timer.mode === 'pomodoro'
              ? '25 minutes of focus, then 5 minutes off. A 15-minute break after every 4 focus sessions.'
              : timer.mode === 'gentle'
                ? 'A longer focus block, followed by a 10-minute breather.'
                : timer.mode === 'custom'
                  ? 'Choose 1–180 minutes. Pause before changing your rhythm.'
                  : 'Pause whenever you need. This clock counts upward.'}
          </p>
          <small className="timer-local-note">
            Timer stays on this device · drag the top to move
          </small>
        </div>
      )}
    </div>
  );
}
