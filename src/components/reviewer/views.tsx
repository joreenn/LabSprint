'use client';
import { useState, type FormEvent } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  BookMarked,
  BookOpen,
  Bookmark,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  FlaskConical,
  Flag,
  GraduationCap,
  Loader2,
  LogOut,
  Play,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
} from 'lucide-react';
import { questions, subjects } from '@/content/questions';
import type { Question, Subject } from '@/content/types';
import {
  dailyProgress,
  firstAttempts,
  latestAttempts,
  localDay,
  percent,
  progressFor,
  questionMap,
  suggestedSubject,
} from '@/lib/progress';
import type { View, Workspace } from './types';
import { fmt, SubjectIcon, PageHeading, Stat, SubjectCard, QuestionRow, Empty } from './shared';
import { Practice } from './practice';
import { ReferenceShelf } from './reference-shelf';
import { ProgressFacts, ProgressGuide } from './progress-signals';
export function Dashboard({
  workspace: w,
  name,
  onPractice,
  onView,
  onResume,
}: {
  workspace: Workspace;
  name: string;
  onPractice: (v: { subjectId?: string; ids?: string[]; label?: string }) => void;
  onView: (v: View) => void;
  onResume: () => void;
}) {
  const p = progressFor(w.attempts),
    first = firstAttempts(w.attempts),
    today = w.attempts.filter(
      (a) => localDay(a.createdAt) === localDay(new Date().toISOString()),
    ).length;
  const suggestion = suggestedSubject(w.attempts);
  return (
    <>
      <div className="overview-heading">
        <PageHeading
          eyebrow="A LITTLE PRACTICE. A STRONGER YOU."
          title={`Hey ${name}, let’s make progress.`}
          description="Your next milestone starts with one good study session."
          action={
            <span className="date-label">
              {new Date().toLocaleDateString('en', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              })}
            </span>
          }
        />
      </div>
      <div className={`hero-grid ${w.activeSession ? 'has-saved-session' : ''}`}>
        <section className="hero-card">
          <div className="hero-text">
            <span className="hero-kicker">
              <span /> YOUR DAILY DOSE OF CONFIDENCE
            </span>
            <h2>
              One question closer
              <br />
              to your <span>RMT.</span>
            </h2>
            <p>
              No clock. No rush. Just you, your goals,
              <br className="desktop-break" /> and a little progress every day.
            </p>
            <button
              className="button lime"
              onClick={() =>
                w.activeSession ? onResume() : onPractice({ label: 'Daily mixed practice' })
              }
            >
              {w.activeSession ? 'Resume practice' : 'Start practice'} <ArrowRight size={18} />
            </button>
            <div className="hero-foot">
              <CheckCircle2 size={14} /> All subjects, always open
            </div>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="art-grid" />
            <div className="art-orbit" />
            <FlaskConical className="big-flask" size={112} strokeWidth={1} />
            <div className="art-spark spark-one">✦</div>
            <div className="art-spark spark-two">✧</div>
            <div className="art-tag">
              <span>+1</span> a little more ready
            </div>
            <div className="art-dot" />
          </div>
        </section>
        <section className="goal-card">
          <div className="card-topline">
            <span className="label">TODAY’S LITTLE WIN</span>
            <span className="goal-icon">
              <Target size={19} />
            </span>
          </div>
          <div className="goal-number">
            {today}
            <span> / {w.settings.dailyGoal}</span>
          </div>
          <p>{today === 1 ? 'question' : 'questions'} answered today</p>
          <div className="progress-track">
            <span style={{ width: `${Math.min(100, (today / w.settings.dailyGoal) * 100)}%` }} />
          </div>
          <div className="goal-caption">
            {today >= w.settings.dailyGoal
              ? 'Goal met. Nice work!'
              : `${w.settings.dailyGoal - today} more to your daily goal`}
          </div>
          <div className="goal-bottom">
            <Sparkles size={17} />
            <span>Consistency over perfection.</span>
          </div>
        </section>
      </div>
      <div className="stats-grid">
        <Stat
          icon={Target}
          label="First-attempt accuracy"
          value={fmt(p.accuracy)}
          note={
            p.seen ? `${p.firstCorrect}/${p.seen} correct` : 'Unavailable · no first attempts yet'
          }
          color="purple"
        />
        <Stat
          icon={BookOpen}
          label="Question bank explored"
          value={`${p.seen}`}
          suffix={`/ ${p.total}`}
          note={`${p.seen} of ${p.total} questions explored`}
          color="blue"
        />
        <Stat
          icon={BookMarked}
          label="Ready for another look"
          value={`${p.needsReview}`}
          note="Missed on your latest attempt"
          color="orange"
          onClick={() => onView('review')}
        />
        <Stat
          icon={TrendingUp}
          label="Practice attempts"
          value={`${p.attempts}`}
          note="Every effort adds up"
          color="green"
        />
      </div>
      <ProgressGuide stats={p} />
      <section className="subjects-section">
        <div className="section-heading">
          <div>
            <h2>
              Your subjects <span className="count-pill">{subjects.length}</span>
            </h2>
            <p>Follow your curiosity. Choose what to work on today.</p>
          </div>
          <button className="text-button" onClick={() => onView('subjects')}>
            Explore topics <ArrowUpRight size={17} />
          </button>
        </div>
        <div className="subjects-grid">
          {subjects.map((s) => (
            <SubjectCard
              key={s.id}
              subject={s}
              attempts={w.attempts}
              onClick={() => onPractice({ subjectId: s.id })}
            />
          ))}
        </div>
      </section>
      <div className="bottom-grid">
        <section className="panel next-step">
          <span className="mini-icon">
            <Sparkles size={20} />
          </span>
          <div>
            <span className="label">A GOOD PLACE TO START</span>
            <h3>{suggestion.shortName}</h3>
            <p>
              {p.needsReview
                ? 'Give a tricky topic another look. Understanding grows with another try.'
                : 'Start exploring, and we’ll help you spot the topics that need a little more love.'}
            </p>
            <button
              className="text-button"
              onClick={() => onPractice({ subjectId: suggestion.id })}
            >
              Practice this subject <ArrowRight size={16} />
            </button>
          </div>
        </section>
        <section className="panel milestone-card">
          <div className="card-topline">
            <h3>Your next milestones</h3>
            <GraduationCap size={20} />
          </div>
          <div className="milestone">
            <span className="milestone-dot lavender" />
            <div>
              <strong>MTAP</strong>
              <small>All MLS subjects</small>
            </div>
            <span className="pill">
              {w.settings.mtapDate
                ? new Date(w.settings.mtapDate + 'T00:00:00').toLocaleDateString('en', {
                    month: 'short',
                    day: 'numeric',
                  })
                : 'December goal'}
            </span>
          </div>
          <div className="milestone">
            <span className="milestone-dot peach" />
            <div>
              <strong>Mockboards</strong>
              <small>Build on your foundations</small>
            </div>
            <span className="pill">
              {w.settings.mockDate
                ? new Date(w.settings.mockDate + 'T00:00:00').toLocaleDateString('en', {
                    month: 'short',
                    day: 'numeric',
                  })
                : 'January goal'}
            </span>
          </div>
          <button className="text-button subtle" onClick={() => onView('settings')}>
            Add dates when you’re ready <ArrowRight size={14} />
          </button>
        </section>
      </div>
      {first.length === 0 ? (
        <div className="quiet-note">
          <CircleHelp size={17} />
          <p>
            Your dashboard starts fresh. This starter bank contains {questions.length} questions,
            rather than the full MTAP or board-exam syllabus.
          </p>
        </div>
      ) : (
        <div className="quiet-note">
          <CircleHelp size={17} />
          <p>
            This is a starter question bank. Coverage reflects these {questions.length} questions,
            rather than the full MTAP or board-exam syllabus.
          </p>
        </div>
      )}
    </>
  );
}
export function SubjectBrowser({
  workspace: w,
  onPractice,
}: {
  workspace: Workspace;
  onPractice: (v: { subjectId?: string; topic?: string; label?: string }) => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  return (
    <>
      <PageHeading
        eyebrow="FOLLOW YOUR CURIOSITY"
        title="A subject for every study day."
        description="Every subject stays open. Choose a whole subject or zoom in on a topic."
        action={
          <button
            className="button primary"
            onClick={() => onPractice({ label: 'Mixed MLS practice' })}
          >
            <Plus size={18} />
            Mixed practice
          </button>
        }
      />
      <div className="subjects-grid subjects-full">
        {subjects.map((s) => (
          <div key={s.id} className={`subject-expand ${selected === s.id ? 'expanded' : ''}`}>
            <SubjectCard
              subject={s}
              attempts={w.attempts}
              onClick={() => setSelected(selected === s.id ? null : s.id)}
            />
            {selected === s.id ? (
              <div className="topic-expand">
                <button
                  className="button primary wide"
                  onClick={() => onPractice({ subjectId: s.id })}
                >
                  Practice whole subject <ArrowRight size={16} />
                </button>
                {s.topics.map((topic) => {
                  const p = progressFor(w.attempts, s.id, topic);
                  return (
                    <button
                      className="topic-row"
                      key={topic}
                      disabled={p.total === 0}
                      onClick={() => onPractice({ subjectId: s.id, topic })}
                    >
                      <div className="topic-facts">
                        {topic}
                        <small>
                          {p.total
                            ? `${p.total} ${p.total === 1 ? 'question' : 'questions'} available`
                            : 'Pending source review'}
                        </small>
                        <ProgressFacts stats={p} />
                      </div>
                      <ChevronRight size={15} />
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>
        ))}
      </div>
      <div className="quiet-note">
        <BookOpen size={18} />
        <p>
          This test edition covers selected topics in each subject. More topics and reviewed
          questions can be added without changing your existing progress.
        </p>
      </div>
    </>
  );
}
export function ReviewQueue({
  workspace: w,
  onPractice,
  onBookmark,
}: {
  workspace: Workspace;
  onPractice: (v: { ids: string[]; label: string }) => void;
  onBookmark: (id: string) => void;
}) {
  const [tab, setTab] = useState('missed');
  const latest = latestAttempts(w.attempts),
    everMissed = new Set(w.attempts.filter((a) => !a.correct).map((a) => a.questionId));
  const ids =
    tab === 'saved'
      ? w.bookmarks
      : tab === 'recovered'
        ? [...latest.values()]
            .filter((a) => a.correct && everMissed.has(a.questionId))
            .map((a) => a.questionId)
        : [...latest.values()].filter((a) => !a.correct).map((a) => a.questionId);
  const availableIds = ids.filter((id) => questionMap.has(id));
  const p = progressFor(w.attempts);
  return (
    <>
      <PageHeading
        eyebrow="ANOTHER LOOK, A DEEPER UNDERSTANDING"
        title="Mistakes are part of the process."
        description="Return to tricky questions. Your original results stay in your history."
        action={
          availableIds.length ? (
            <button
              className="button primary"
              onClick={() =>
                onPractice({
                  ids: availableIds,
                  label: tab === 'saved' ? 'Bookmarked questions' : 'Review queue',
                })
              }
            >
              <Play size={17} />
              Practice this list
            </button>
          ) : undefined
        }
      />
      <div className="tab-bar">
        <button className={tab === 'missed' ? 'active' : ''} onClick={() => setTab('missed')}>
          Needs another look <span>{[...latest.values()].filter((a) => !a.correct).length}</span>
        </button>
        <button className={tab === 'recovered' ? 'active' : ''} onClick={() => setTab('recovered')}>
          Previously missed → corrected <span>{p.corrected}</span>
        </button>
        <button className={tab === 'saved' ? 'active' : ''} onClick={() => setTab('saved')}>
          Bookmarks <Bookmark size={15} />
        </button>
      </div>
      <ProgressGuide stats={p} />
      {availableIds.length ? (
        <div className="question-list">
          {availableIds.map((id) => {
            const q = questionMap.get(id);
            return q ? (
              <QuestionRow
                key={id}
                question={q}
                marked={w.bookmarks.includes(id)}
                onBookmark={() => onBookmark(id)}
                onPractice={() => onPractice({ ids: [id], label: 'Question review' })}
              />
            ) : null;
          })}
        </div>
      ) : (
        <Empty
          icon={tab === 'saved' ? Bookmark : BookMarked}
          title={
            tab === 'saved'
              ? 'Keep a useful question close.'
              : tab === 'recovered'
                ? 'Understanding takes another try.'
                : 'A fresh page for your progress.'
          }
          description={
            tab === 'saved'
              ? 'Tap the bookmark on any question to find it here.'
              : tab === 'recovered'
                ? 'Questions you miss and later answer correctly will appear here.'
                : 'Questions missed on your latest attempt will appear here, ready for another look.'
          }
        />
      )}
    </>
  );
}
export function Progress({ workspace: w }: { workspace: Workspace }) {
  const p = progressFor(w.attempts),
    days = dailyProgress(w.attempts);
  const first = firstAttempts(w.attempts);
  const max = Math.max(5, ...days.map((d) => d.count));
  return (
    <>
      <PageHeading
        eyebrow="SEE HOW FAR YOU’VE COME"
        title="A clearer picture of your progress."
        description="First attempts show your starting knowledge. Repeats show your practice."
      />
      <div className="stats-grid">
        <Stat
          icon={Target}
          label="First-attempt accuracy"
          value={fmt(p.accuracy)}
          note={
            p.seen ? `${p.firstCorrect}/${p.seen} correct` : 'Unavailable · no first attempts yet'
          }
          color="purple"
        />
        <Stat
          icon={TrendingUp}
          label="Repeat accuracy"
          value={fmt(p.repeatAccuracy)}
          note={`${p.repeatCorrect}/${p.repeatCount} correct · ${p.repeatCount} repeat ${p.repeatCount === 1 ? 'attempt' : 'attempts'}`}
          color="green"
        />
        <Stat
          icon={BookOpen}
          label="Bank coverage"
          value={fmt(percent(p.seen, p.total))}
          note={`${p.seen} of ${p.total} questions explored`}
          color="blue"
        />
        <Stat
          icon={BookMarked}
          label="Needs another look"
          value={`${p.needsReview}`}
          note="Based on your latest answers"
          color="orange"
        />
      </div>
      <ProgressGuide stats={p} />
      <section className="panel trend-panel">
        <div className="section-heading">
          <div>
            <h2>A little progress, day by day</h2>
            <p>New questions explored in the past 7 days · your device’s local time</p>
          </div>
          <span className="pill">First attempts only</span>
        </div>
        <div
          className="chart"
          role="img"
          tabIndex={0}
          aria-label={days
            .map(
              (d) =>
                `${d.label}: ${d.count} ${d.count === 1 ? 'question' : 'questions'}, first-attempt accuracy ${fmt(d.accuracy)}, ${d.correct}/${d.count} correct`,
            )
            .join('; ')}
        >
          {days.map((d) => (
            <div className="chart-column" key={d.day}>
              <span>{d.count}</span>
              <div className="chart-track">
                <div style={{ height: `${(d.count / max) * 100}%`, minHeight: d.count ? 8 : 0 }} />
              </div>
              <strong>{d.label}</strong>
              <small>
                {fmt(d.accuracy)}
                <br />
                {d.correct}/{d.count}
              </small>
            </div>
          ))}
        </div>
        <div className="chart-key">
          <span />
          New questions <span className="muted-key" />
          First-attempt accuracy · correct/answered beneath each day
        </div>
      </section>
      <div className="section-heading">
        <div>
          <h2>Know your foundations</h2>
          <p>
            Subject and topic accuracy use first attempts, so repeats don’t inflate the results.
          </p>
        </div>
      </div>
      <div className="topic-progress-list">
        {subjects.map((s) => {
          const sp = progressFor(w.attempts, s.id);
          return (
            <details className="panel subject-details" key={s.id}>
              <summary>
                <SubjectIcon subject={s} />
                <div>
                  <h3>{s.name}</h3>
                  <p>
                    First-attempt accuracy:{' '}
                    {sp.seen
                      ? `${fmt(sp.accuracy)} · ${sp.firstCorrect}/${sp.seen} correct`
                      : 'Unavailable · no first attempts yet'}
                  </p>
                  {sp.limitedData ? <p>Limited practice data · small sample.</p> : null}
                  <p>
                    {sp.seen} of {sp.total} questions explored · {sp.needsReview} to revisit
                  </p>
                </div>
                <ChevronRight size={18} />
              </summary>
              <div className="topic-detail">
                <ProgressFacts stats={sp} />
                {s.topics.map((t) => {
                  const tp = progressFor(w.attempts, s.id, t);
                  return (
                    <div className="topic-row" key={t}>
                      <div className="topic-facts">
                        {t}
                        <small>
                          {tp.total} {tp.total === 1 ? 'question' : 'questions'} available
                        </small>
                        <ProgressFacts stats={tp} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </details>
          );
        })}
      </div>
      <div className="quiet-note">
        <CircleHelp size={18} />
        <p>
          {first.length
            ? 'Use these results to decide what to review next.'
            : 'Your first practice session will start your progress story.'}{' '}
          This starter bank does not cover the full syllabus. Results are learning signals, not a
          prediction of passing.
        </p>
      </div>
    </>
  );
}
export function QuestionLibrary({
  workspace: w,
  onPractice,
  onBookmark,
}: {
  workspace: Workspace;
  onPractice: (v: { ids: string[]; label: string }) => void;
  onBookmark: (id: string) => void;
}) {
  const [search, setSearch] = useState(''),
    [subject, setSubject] = useState(''),
    [style, setStyle] = useState('');
  const filtered = questions.filter(
    (q) =>
      (!subject || q.subjectId === subject) &&
      (!style || q.kind === style) &&
      `${q.stem} ${q.topic}`.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <>
      <PageHeading
        eyebrow="YOUR GROWING QUESTION BANK"
        title="Find your next lightbulb moment."
        description="Browse original questions with source references and explanations for every option."
      />
      <ReferenceShelf />
      <div className="library-controls">
        <label className="search-input">
          <Search size={18} />
          <input
            aria-label="Search questions or topics"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search a question or topic…"
          />
        </label>
        <select
          aria-label="Filter by subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        >
          <option value="">All subjects</option>
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>
              {s.shortName}
            </option>
          ))}
        </select>
        <select
          aria-label="Filter by question style"
          value={style}
          onChange={(e) => setStyle(e.target.value)}
        >
          <option value="">All styles</option>
          <option value="recall">Recall</option>
          <option value="case">Clinical cases</option>
        </select>
      </div>
      <div className="library-result-count">
        <span>
          {filtered.length} {filtered.length === 1 ? 'question' : 'questions'}
        </span>
        {filtered.length ? (
          <button
            className="text-button"
            onClick={() =>
              onPractice({ ids: filtered.map((q) => q.id), label: 'Your filtered questions' })
            }
          >
            Practice these <ArrowRight size={16} />
          </button>
        ) : null}
      </div>
      {filtered.length ? (
        <div className="question-list">
          {filtered.map((q) => (
            <QuestionRow
              key={q.id}
              question={q}
              marked={w.bookmarks.includes(q.id)}
              onBookmark={() => onBookmark(q.id)}
              onPractice={() => onPractice({ ids: [q.id], label: 'Question practice' })}
            />
          ))}
        </div>
      ) : (
        <Empty
          icon={Search}
          title="Let’s try another search."
          description="Search a broader topic or choose a different subject."
        />
      )}
    </>
  );
}
export function Preferences({
  workspace: w,
  onSave,
  onSignOut,
}: {
  workspace: Workspace;
  onSignOut: () => void;
  onSave: (settings: Workspace['settings']) => Promise<void>;
}) {
  const [busy, setBusy] = useState(false),
    [error, setError] = useState('');
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setBusy(true);
    setError('');
    try {
      await onSave({
        dailyGoal: Number(data.get('dailyGoal')),
        mtapDate: String(data.get('mtapDate')) || null,
        mockDate: String(data.get('mockDate')) || null,
      });
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <PageHeading
        eyebrow="MAKE THIS SPACE YOURS"
        title="A routine that works for you."
        description="Set a gentle daily goal. Add exam dates whenever you know them."
      />
      <div className="settings-grid">
        <form className="panel settings-form" onSubmit={submit}>
          <h2>Your study preferences</h2>
          <label>
            Daily question goal
            <input
              name="dailyGoal"
              type="number"
              min={1}
              max={100}
              defaultValue={w.settings.dailyGoal}
              required
            />
            <small>A nudge, never a deadline. Between 1 and 100 questions.</small>
          </label>
          <label>
            MTAP date <span className="optional">optional</span>
            <input name="mtapDate" type="date" defaultValue={w.settings.mtapDate || ''} />
          </label>
          <label>
            Mockboards date <span className="optional">optional</span>
            <input name="mockDate" type="date" defaultValue={w.settings.mockDate || ''} />
          </label>
          {error ? (
            <p className="inline-error" role="alert">
              {error}
            </p>
          ) : null}
          <button className="button primary" disabled={busy}>
            {busy ? <Loader2 size={17} className="spin" /> : <Check size={17} />}Save preferences
          </button>
        </form>
        <div className="settings-info">
          <section className="panel">
            <ShieldCheck size={26} />
            <h3>Your own review history</h3>
            <p>
              Signed in as <strong>{w.user.email}</strong>. Your answers, bookmarks, and preferences
              belong to this account.
            </p>
            <p>
              Use the same account on your phone, iPad, or laptop to access saved progress. An
              internet connection to the deployed app is required.
            </p>
          </section>
          <section className="panel">
            <BookOpen size={26} />
            <h3>A bank built to improve</h3>
            <p>
              {questions.length} original questions, with explanations for every choice. Primary
              references include Harr, SUCCESS!, and Apollon where text can be verified.
            </p>
            <p>
              Spot something unclear? Flag it from the answer explanation. Question IDs and versions
              make corrections traceable.
            </p>
            <span className="pill">LabSprint v0.3.0 · Starter bank</span>
          </section>
          <button className="button secondary" onClick={onSignOut}>
            <LogOut size={17} />
            Sign out of LabSprint
          </button>
        </div>
      </div>
    </>
  );
}
