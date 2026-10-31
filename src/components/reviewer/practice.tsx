'use client';
import { useMemo, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Bookmark,
  CheckCircle2,
  ChevronLeft,
  CircleHelp,
  Clock3,
  Flag,
  GraduationCap,
  Loader2,
  Play,
  ShieldCheck,
  Sparkles,
  XCircle,
} from 'lucide-react';
import { questions, subjects } from '@/content/questions';
import type { Question } from '@/content/types';
import { percent, questionMap, shuffled } from '@/lib/progress';
import type { PracticeSession, Workspace } from './types';
import { fmt } from './shared';
import { Modal } from './dialogs';
export function PracticeSetup({
  config,
  active,
  busy,
  error,
  onClose,
  onStart,
}: {
  config: {
    subjectId?: string;
    topic?: string;
    ids?: string[];
    label?: string;
  };
  active: PracticeSession | null;
  busy: boolean;
  error?: string;
  onClose: () => void;
  onStart: (ids: string[]) => void;
}) {
  const [count, setCount] = useState<number | 'all'>(10),
    [kind, setKind] = useState('mixed');
  const subject = subjects.find((s) => s.id === config.subjectId);
  const pool = questions.filter(
    (q) =>
      (!config.subjectId || q.subjectId === config.subjectId) &&
      (!config.topic || q.topic === config.topic) &&
      (!config.ids || config.ids.includes(q.id)) &&
      (kind === 'mixed' || q.kind === kind),
  );
  return (
    <Modal title="Make room for a little progress." onClose={onClose}>
      <span className="modal-eyebrow">YOUR PRACTICE, YOUR PACE</span>
      <h2>Make room for a little progress.</h2>
      <p>{config.topic || subject?.name || config.label || 'Mixed MLS practice'}</p>
      <div className="setup-note">
        <Clock3 size={19} />
        <span>No timer. Explanations after every answer.</span>
      </div>
      <label>
        Question style
        <select value={kind} onChange={(e) => setKind(e.target.value)}>
          <option value="mixed">A mix of recall & cases</option>
          <option value="recall">Direct recall</option>
          <option value="case">Case-based</option>
        </select>
      </label>
      <label>Session size</label>
      <div className="segmented">
        {([5, 10, 20, 'all'] as const).map((n) => (
          <button key={n} className={count === n ? 'active' : ''} onClick={() => setCount(n)}>
            {n === 'all' ? 'All' : n}
          </button>
        ))}
      </div>
      <p className="fine-print">
        {Math.min(count === 'all' ? 100 : count, pool.length)} questions available for this session.
        Options are shuffled each time. Sessions support up to 100 questions.
      </p>
      {active ? (
        <div className="inline-warning">
          Starting a new session replaces your paused session. Every submitted answer stays in your
          history.
        </div>
      ) : null}
      {error ? (
        <p className="inline-error" role="alert">
          {error}
        </p>
      ) : null}
      <button
        className="button primary wide"
        disabled={busy || pool.length === 0}
        onClick={() =>
          onStart(
            shuffled(pool)
              .slice(0, count === 'all' ? 100 : count)
              .map((q) => q.id),
          )
        }
      >
        {busy ? <Loader2 size={17} className="spin" /> : <Play size={17} />}Start practice{' '}
        <ArrowRight size={17} />
      </button>
      {pool.length === 0 ? (
        <p role="status">No questions match this style yet. Try the mixed option.</p>
      ) : null}
    </Modal>
  );
}
export function Practice({
  session,
  workspace: w,
  busy,
  pendingQuestionIds = [],
  onAnswer,
  onNext,
  onFinish,
  onPause,
  onBookmark,
  onReport,
}: {
  session: PracticeSession;
  workspace: Workspace;
  busy: boolean;
  pendingQuestionIds?: string[];
  onAnswer: (q: Question, id: string) => void;
  onNext: () => void;
  onFinish: () => void;
  onPause: () => void;
  onBookmark: (id: string) => void;
  onReport: (q: Question) => void;
}) {
  const q = questionMap.get(session.questionIds[session.index]);
  const order = useMemo(() => (q ? shuffled(q.options.map((o) => o.id)) : []), [q?.id, session.id]);
  if (!q)
    return (
      <div className="empty-state">
        <h2>This session needs a fresh start.</h2>
        <button className="button primary" onClick={onFinish}>
          End session
        </button>
      </div>
    );
  const subject = subjects.find((s) => s.id === q.subjectId)!;
  const chosen = session.answers[q.id];
  const correct = chosen === q.correctOptionId;
  const answered = Object.keys(session.answers).length;
  const last = session.index === session.questionIds.length - 1;
  const optionOrder = order.length === q.options.length ? order : q.options.map((o) => o.id);
  return (
    <div className="practice" data-practice-active>
      <div className="practice-toolbar">
        <button className="text-button subtle" onClick={onPause} disabled={busy}>
          <ChevronLeft size={17} />
          Save & leave
        </button>
        <span>
          <Clock3 size={15} />
          Take your time
        </span>
      </div>
      <div className="practice-progress">
        <div>
          <span>STUDY SESSION</span>
          <strong>
            Question {session.index + 1} <span>of {session.questionIds.length}</span>
          </strong>
        </div>
        <div className="progress-track">
          <span style={{ width: `${(answered / session.questionIds.length) * 100}%` }} />
        </div>
      </div>
      <div className="question-card">
        <div className="question-top">
          <div className="question-tags">
            <span className={`pill tone-${subjects.indexOf(subject)}`}>{subject.shortName}</span>
            <span className="pill">{q.kind === 'case' ? 'Clinical case' : 'Recall'}</span>
            <span className="pill">{q.difficulty}</span>
          </div>
          <button
            className={`icon-button ${w.bookmarks.includes(q.id) ? 'bookmarked' : ''}`}
            aria-label={w.bookmarks.includes(q.id) ? 'Remove bookmark' : 'Bookmark question'}
            onClick={() => onBookmark(q.id)}
          >
            <Bookmark size={21} fill={w.bookmarks.includes(q.id) ? 'currentColor' : 'none'} />
          </button>
        </div>
        <p className="question-topic">{q.topic}</p>
        <h1 className="question-stem">{q.stem}</h1>
        <p className="choice-hint">
          {chosen
            ? pendingQuestionIds.includes(q.id)
              ? 'Answer selected · syncing in the background. You can keep going.'
              : 'Your answer is saved. Explore the reasoning below.'
            : 'Choose the single best answer.'}
        </p>
        <div className="options">
          {optionOrder.map((id, i) => {
            const option = q.options.find((o) => o.id === id)!;
            const right = !!chosen && id === q.correctOptionId;
            const wrong = !!chosen && id === chosen && !correct;
            return (
              <button
                className={`option ${right ? 'correct' : ''} ${wrong ? 'incorrect' : ''} ${chosen && id === chosen ? 'chosen' : ''}`}
                key={id}
                disabled={busy || !!chosen}
                onClick={() => onAnswer(q, id)}
              >
                <span className="option-letter">{String.fromCharCode(65 + i)}</span>
                <span>{option.text}</span>
                {right ? <CheckCircle2 size={21} /> : wrong ? <XCircle size={21} /> : null}
              </button>
            );
          })}
        </div>
        {busy && !chosen ? (
          <div className="saving-status" role="status">
            <Loader2 size={16} className="spin" />
            Saving your answer…
          </div>
        ) : null}
      </div>
      {chosen ? (
        <section
          className={`rationale-card ${correct ? 'rationale-correct' : 'rationale-incorrect'}`}
          aria-live="polite"
        >
          <div className="rationale-heading">
            {correct ? <CheckCircle2 size={24} /> : <CircleHelp size={24} />}
            <div>
              <h2>{correct ? 'That’s right. Here’s why.' : 'A good moment to learn.'}</h2>
              <p>
                {correct
                  ? 'Keep building that understanding.'
                  : 'This is what practice is for. Let’s make it click.'}
              </p>
            </div>
          </div>
          <div className="takeaway">
            <Sparkles size={18} />
            <div>
              <strong>THE TAKEAWAY</strong>
              <p>{q.takeaway}</p>
            </div>
          </div>
          <h3>Understand every option</h3>
          <div className="option-rationales">
            {optionOrder.map((id, i) => {
              const o = q.options.find((x) => x.id === id)!;
              return (
                <div key={id} className={id === q.correctOptionId ? 'right-reason' : ''}>
                  <span className="reason-letter">{String.fromCharCode(65 + i)}</span>
                  <div>
                    <strong>
                      {o.text}{' '}
                      {id === q.correctOptionId ? (
                        <span className="reason-badge">Correct answer</span>
                      ) : id === chosen ? (
                        <span className="reason-badge wrong">Your choice</span>
                      ) : null}
                    </strong>
                    <p>{o.rationale}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="source-box">
            <BookOpen size={17} />
            <div>
              <strong>Reference</strong>
              <p>
                {q.source.title}
                {q.source.edition ? `, ${q.source.edition}` : ''} · {q.source.chapter} · PDF page{' '}
                {q.source.pdfPage}
              </p>
              <small>
                Original practice question · {q.id} · v{q.version}
              </small>
            </div>
          </div>
          <button className="text-button subtle report-button" onClick={() => onReport(q)}>
            <Flag size={15} />
            Something unclear? Report this question
          </button>
        </section>
      ) : null}
      <div className="practice-bottom">
        <span>
          {answered} answered · {session.questionIds.length - answered} to explore
        </span>
        {chosen ? (
          <button className="button primary" disabled={busy} onClick={last ? onFinish : onNext}>
            {busy ? <Loader2 size={17} className="spin" /> : null}
            {last ? 'See session summary' : 'Next question'}
            <ArrowRight size={18} />
          </button>
        ) : (
          <span className="pill">
            <ShieldCheck size={14} />
            No time pressure
          </span>
        )}
      </div>
    </div>
  );
}
export function SessionSummary({
  session,
  onDone,
  onRedo,
}: {
  session: PracticeSession;
  onDone: () => void;
  onRedo: () => void;
}) {
  const answered = Object.entries(session.answers);
  const correct = answered.filter(
    ([id, option]) => questionMap.get(id)?.correctOptionId === option,
  ).length;
  return (
    <section className="session-summary">
      <div className="summary-orb">
        <GraduationCap size={47} />
      </div>
      <span className="eyebrow">THAT’S PROGRESS WORTH KEEPING</span>
      <h1>A little stronger than before.</h1>
      <p>Every question is a chance to connect the dots.</p>
      <div className="summary-stats">
        <div>
          <strong>{answered.length}</strong>
          <span>answered</span>
        </div>
        <div>
          <strong>{fmt(percent(correct, answered.length))}</strong>
          <span>session accuracy</span>
        </div>
        <div>
          <strong>{correct}</strong>
          <span>correct answers</span>
        </div>
      </div>
      <div className="summary-actions">
        <button className="button primary" onClick={onDone}>
          Back to my overview <ArrowRight size={18} />
        </button>
        {answered.length > correct ? (
          <button className="button secondary" onClick={onRedo}>
            Revisit {answered.length - correct} missed
          </button>
        ) : null}
      </div>
      <small>Your first-attempt results and repeats are tracked separately.</small>
    </section>
  );
}
