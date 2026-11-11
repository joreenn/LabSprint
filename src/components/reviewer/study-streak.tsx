'use client';

import { useEffect, useRef, type CSSProperties } from 'react';
import { Check, Minus } from 'lucide-react';
import type { firstDailyStreakSave, studyStreak, studyStreakWeek } from '@/lib/progress';
import './study-streak.css';

type Streak = ReturnType<typeof studyStreak>;
type Week = ReturnType<typeof studyStreakWeek>;
export type DailyStreakCelebration = NonNullable<ReturnType<typeof firstDailyStreakSave>>;
const CELEBRATION_MS = 4500;

function StreakFlame() {
  return (
    <svg viewBox="0 0 96 96" fill="none" aria-hidden="true" focusable="false">
      <path
        fill="#f58312"
        d="M48 7c4 12 14 19 24 31 7 8 11 17 11 26 0 18-15 29-35 29S13 82 13 64c0-14 9-23 17-32 3 8 7 10 7 10C42 32 47 21 48 7Z"
      />
      <path
        fill="#ffce55"
        d="M49 48c3 7 9 11 13 17 3 4 4 7 4 11 0 9-8 16-18 16s-18-7-18-16c0-6 4-11 9-16 1 5 4 6 4 6 2-4 5-11 6-18Z"
      />
    </svg>
  );
}

function StreakWeek({ week }: { week: Week }) {
  return (
    <ul className="streak-week" aria-label="Practice over the past seven days">
      {week.map((day) => (
        <li key={day.date} data-today={day.today} data-practiced={day.practiced}>
          <span className="streak-weekday" aria-hidden="true">
            {day.weekday}
          </span>
          <span className="streak-day-dot" aria-hidden="true">
            {day.practiced ? <Check size={16} strokeWidth={3} /> : <Minus size={13} />}
          </span>
          <span className="streak-day-description">
            {day.label}
            {day.today ? ' (today)' : ''}: {day.practiced ? 'practiced' : 'no practice'}
          </span>
        </li>
      ))}
    </ul>
  );
}

export function StudyStreakCard({ streak, week }: { streak: Streak; week: Week }) {
  return (
    <section className="study-streak-card" aria-label="Study streak">
      <div className="streak-card-heading">
        <span className="streak-card-flame">
          <StreakFlame />
        </span>
        <div>
          <strong>
            {streak.current ? `${streak.current}-day study streak` : 'Start a study streak'}
          </strong>
          <small>
            {streak.answeredToday ? 'Practiced today' : 'Save one answer to count today'}
            {streak.longest
              ? ` · Best: ${streak.longest} ${streak.longest === 1 ? 'day' : 'days'}`
              : ''}
          </small>
        </div>
      </div>
      <StreakWeek week={week} />
    </section>
  );
}

export function StreakCelebration({
  value,
  onDone,
}: {
  value: DailyStreakCelebration;
  onDone: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    element.showModal();
    heading.current?.focus({ preventScroll: true });
    const timeout = window.setTimeout(onDone, CELEBRATION_MS);
    return () => {
      window.clearTimeout(timeout);
      element.close();
    };
  }, [onDone]);

  return (
    <dialog
      ref={dialog}
      className="streak-celebration"
      aria-labelledby="streak-celebration-title"
      aria-describedby="streak-celebration-note"
      style={{ '--streak-duration': `${CELEBRATION_MS}ms` } as CSSProperties}
      onCancel={(event) => {
        event.preventDefault();
        onDone();
      }}
    >
      <div className="streak-celebration-content">
        <p className="streak-celebration-kicker">TODAY’S PRACTICE COUNTS</p>
        <div className="streak-celebration-flame">
          <StreakFlame />
        </div>
        <h2 id="streak-celebration-title" ref={heading} tabIndex={-1}>
          <span>{value.streak.current}</span> day streak!
        </h2>
        <div className="streak-celebration-week">
          <StreakWeek week={value.week} />
          <p>One study day at a time. Keep it going!</p>
        </div>
        <p id="streak-celebration-note">Returning to Overview shortly…</p>
        <div className="streak-return-track" aria-hidden="true">
          <span />
        </div>
      </div>
    </dialog>
  );
}
