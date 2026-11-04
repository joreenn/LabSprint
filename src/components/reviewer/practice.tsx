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
import { subjects } from '@/content/questions';
import type { Question } from '@/content/types';
import { percent, questionMap, shuffled, type AttemptRecord } from '@/lib/progress';
import {
  eligibleQuestions,
  newPracticeIds,
  practiceSize,
  sessionRecap,
  type PracticeConfig,
} from '@/lib/practice-review';
import type { PracticeSession, Workspace } from './types';
import { fmt } from './shared';
import { referenceMixedSample } from '@/lib/reference-sampling';
import { Modal } from './dialogs';
export function PracticeSetup({
  config,
  active,
  busy,
  error,
  onClose,
  onStart,
}: {
  config: PracticeConfig;
  active: PracticeSession | null;
  busy: boolean;
  error?: string;
  onClose: () => void;
  onStart: (ids: string[]) => void;
}) {
  const [count, setCount] = useState<number | 'all'>(10),
    [kind, setKind] = useState('mixed');
  const subject = subjects.find((s) => s.id === config.subjectId);
  const single = config.ids?.length === 1;
  const pool = eligibleQuestions(config, single ? 'mixed' : kind);
  const size = practiceSize(pool.length, count);
  const title = single ? 'Review 1 question' : 'Make room for a little progress.';
  return (
    <Modal title={title} onClose={onClose}>
      <span className="modal-eyebrow">YOUR PRACTICE, YOUR PACE</span>
      <h2>{title}</h2>
      <p>{config.topic || subject?.name || config.label || 'Mixed MLS practice'}</p>
      <div className="setup-note">
        <Clock3 size={19} />
        <span>No timer. Explanations after every answer.</span>
      </div>
      {!single ? (
        <label>
          Question style
          <select
            value={kind}
            aria-describedby="practice-pool-status"
            onChange={(e) => setKind(e.target.value)}
          >
            <option value="mixed">A mix of recall & cases</option>
            <option value="recall">Direct recall</option>
            <option value="case">Case-based</option>
          </select>
        </label>
      ) : null}
      {!single && pool.length > 1 ? (
        <fieldset className="practice-sizes">
          <legend>Session size</legend>
          <div className="segmented" aria-label="Session size">
            {([...size.choices, 'all'] as const).map((n) => (
              <button
                type="button"
                aria-pressed={size.choice === n}
                key={n}
                className={size.choice === n ? 'active' : ''}
                onClick={() => setCount(n)}
              >
                {n === 'all' ? `All (${Math.min(pool.length, 100)})` : n}
              </button>
            ))}
          </div>
        </fieldset>
      ) : null}
      <p className="fine-print" id="practice-pool-status" role="status">
        {size.count} {size.count === 1 ? 'question' : 'questions'} in this session
        {!single ? ` · ${pool.length} eligible` : ''}. Options are shuffled each time.
        {pool.length > 100 ? ' Sessions support up to 100 questions.' : ''}
        {!single ? ' Available reference books are mixed within your selection.' : ''}
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
        onClick={() => onStart(referenceMixedSample(pool, size.count).map((q) => q.id))}
      >
        {busy ? <Loader2 size={17} className="spin" /> : <Play size={17} />}
        {single ? 'Review 1 question' : 'Start practice'} <ArrowRight size={17} />
      </button>
      {pool.length === 0 ? (
        <p role="status" className="inline-warning">
          {kind !== 'mixed' && !single
            ? 'No questions match this style yet. Choose a mix of recall and cases, or another topic.'
            : 'No questions are available in this selection. Choose another topic or open the question library.'}
        </p>
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
        <p className="choice-hint" role="status" aria-live="polite">
          {chosen
            ? pendingQuestionIds.includes(q.id)
              ? `${correct ? 'Correct' : 'Incorrect'} answer · syncing in the background. You can keep going.`
              : `${correct ? 'Correct' : 'Incorrect'} answer · saved. Explore the reasoning below.`
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
  attempts,
  pendingQuestionIds = [],
  onDone,
  onRedo,
  onNewPractice,
}: {
  session: PracticeSession;
  attempts: AttemptRecord[];
  pendingQuestionIds?: string[];
  onDone: () => void;
  onRedo: () => void;
  onNewPractice: (ids: string[]) => void;
}) {
  const recap = sessionRecap(session, attempts);
  const correct = recap.filter((row) => row.correct).length;
  const missed = recap.length - correct;
  const newIds = newPracticeIds(attempts, session);
  const allCorrect =
    recap.length > 0 && recap.length === session.questionIds.length && missed === 0;
  return (
    <section className="session-summary">
      <div className="summary-orb">
        <GraduationCap size={47} />
      </div>
      <span className="eyebrow">THAT’S PROGRESS WORTH KEEPING</span>
      <h1>Your session, at a glance.</h1>
      <p>See what you answered and choose your next step.</p>
      <div className="summary-stats">
        <div>
          <strong>{recap.length}</strong>
          <span>answered</span>
        </div>
        <div>
          <strong>{fmt(percent(correct, recap.length))}</strong>
          <span>session accuracy</span>
        </div>
        <div>
          <strong>{correct}</strong>
          <span>{correct === 1 ? 'correct answer' : 'correct answers'}</span>
        </div>
      </div>
      <p className="summary-next-step">
        {missed
          ? `${missed} ${missed === 1 ? 'question needs' : 'questions need'} another look. Review the explanations, then try the missed questions again.`
          : allCorrect && newIds.length
            ? `All answers in this session were correct. Explore ${newIds.length} ${newIds.length === 1 ? 'new question' : 'new questions'} available in this bank.`
            : allCorrect
              ? 'All answers in this session were correct. You have explored every currently available question; use your overview to choose more practice.'
              : 'Use the recap to inspect your answers, then return to your overview to choose more practice.'}
      </p>
      <div className="summary-actions">
        {missed ? (
          <button className="button primary" onClick={onRedo}>
            Review {missed} missed {missed === 1 ? 'question' : 'questions'}{' '}
            <ArrowRight size={18} />
          </button>
        ) : allCorrect && newIds.length ? (
          <button className="button primary" onClick={() => onNewPractice(newIds)}>
            Practice new questions <ArrowRight size={18} />
          </button>
        ) : null}
        <button
          className={`button ${missed || (allCorrect && newIds.length) ? 'secondary' : 'primary'}`}
          onClick={onDone}
        >
          Back to my overview <ArrowRight size={18} />
        </button>
      </div>
      <small>
        Session accuracy includes repeats. First-attempt results stay separate. An immediate
        correction shows practice improvement, not lasting mastery.
      </small>
      <section className="summary-recap" aria-label="Question recap">
        <h2>Your question recap</h2>
        <p className="fine-print">Open any explanation without recording another answer.</p>
        {session.questionIds.map((id, index) => {
          const q = questionMap.get(id);
          const row = recap.find((entry) => entry.question.id === id);
          if (!q)
            return (
              <p key={id} className="quiet-note">
                Question {index + 1} is no longer available in this bank. Saved history is
                preserved.
              </p>
            );
          const subject = subjects.find((s) => s.id === q.subjectId);
          const pending = pendingQuestionIds.includes(id) || (!!row && !row.recorded);
          return (
            <details className="recap-question" key={id}>
              <summary>
                <span className="recap-topic">
                  <strong>
                    {index + 1}. {subject?.shortName || q.subjectId}
                  </strong>
                  <span>{q.topic}</span>
                </span>
                <span
                  className={`recap-result ${row?.correct ? 'recap-correct' : row ? 'recap-missed' : ''}`}
                >
                  {row ? (
                    row.correct ? (
                      <CheckCircle2 size={18} />
                    ) : (
                      <XCircle size={18} />
                    )
                  ) : (
                    <CircleHelp size={18} />
                  )}
                  {row ? (row.correct ? 'Correct' : 'Missed') : 'Not answered'}
                  <small>
                    {row
                      ? `${row.attemptKind}${pending ? ' · awaiting sync' : ''}`
                      : 'No attempt recorded'}
                  </small>
                </span>
                <span className="recap-open-label">View explanation</span>
              </summary>
              <div className="recap-detail">
                {row?.explanationVersionChanged ? (
                  <p className="fine-print">
                    Saved result from v{row.savedVersion}; explanations below are from the current v
                    {q.version}. Your original result is preserved.
                  </p>
                ) : null}
                {row?.savedChoiceUnavailable ? (
                  <p className="fine-print">
                    Your saved choice is no longer available in this version. The recorded result is
                    preserved; the explanations below describe the current options.
                  </p>
                ) : null}
                <h3>{q.stem}</h3>
                <div className="takeaway">
                  <Sparkles size={18} />
                  <div>
                    <strong>THE TAKEAWAY</strong>
                    <p>{q.takeaway}</p>
                  </div>
                </div>
                <div className="option-rationales">
                  {q.options.map((option) => (
                    <div
                      key={option.id}
                      className={option.id === q.correctOptionId ? 'right-reason' : ''}
                    >
                      <span className="reason-letter" aria-hidden="true">
                        {option.id === q.correctOptionId ? (
                          <CheckCircle2 size={16} />
                        ) : option.id === row?.chosen ? (
                          <XCircle size={16} />
                        ) : (
                          '•'
                        )}
                      </span>
                      <div>
                        <strong>
                          {option.text}{' '}
                          {option.id === q.correctOptionId ? (
                            <span className="reason-badge">Correct answer</span>
                          ) : null}{' '}
                          {option.id === row?.chosen ? (
                            <span className="reason-badge">Your answer</span>
                          ) : null}
                        </strong>
                        <p>{option.rationale}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="source-box">
                  <BookOpen size={17} />
                  <div>
                    <strong>Reference</strong>
                    <p>
                      {q.source.title}
                      {q.source.edition ? `, ${q.source.edition}` : ''} · {q.source.chapter} · PDF
                      page {q.source.pdfPage}
                    </p>
                    <small>
                      Original practice question · {q.id} · v{q.version}
                    </small>
                  </div>
                </div>
              </div>
            </details>
          );
        })}
      </section>
    </section>
  );
}
