'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  Bookmark,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  FlaskConical,
  Loader2,
  LogOut,
  Moon,
  Palette,
  Play,
  Search,
  Settings2,
  Sparkles,
  Sun,
  Timer,
  CloudUpload,
  X,
} from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import { questions, subjects } from '@/content/questions';
import type { Question } from '@/content/types';
import { latestAttempts, questionMap, shuffled } from '@/lib/progress';
import type { View, PracticeSession, Workspace } from './reviewer/types';
import { api, ApiError } from './reviewer/api';
import { nav, Brand } from './reviewer/shared';
import { AuthScreen } from './reviewer/auth-screen';
import { PracticeSetup, Practice, SessionSummary } from './reviewer/practice';
import {
  Dashboard,
  SubjectBrowser,
  ReviewQueue,
  Progress,
  QuestionLibrary,
  Preferences,
} from './reviewer/views';
import { ReportDialog, Modal } from './reviewer/dialogs';
import { RecoveryCodesPanel } from './reviewer/recovery-codes';
import { AppearancePicker } from './reviewer/appearance';
import {
  applyAppearance,
  defaultAppearance,
  isAppearance,
  type Appearance,
} from '@/lib/appearance';
import { StudyTimer } from './reviewer/study-timer';
import { usePracticeOutbox } from './reviewer/use-practice-outbox';
import './reviewer/update.css';
export default function Reviewer() {
  const { data: session, isPending } = authClient.useSession();
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [view, setView] = useState<View>('dashboard');
  const [active, setActive] = useState<PracticeSession | null>(null);
  const [setup, setSetup] = useState<{
    subjectId?: string;
    topic?: string;
    ids?: string[];
    label?: string;
  } | null>(null);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');
  const [loading, setLoading] = useState(false);
  const [dark, setDark] = useState(false);
  const [report, setReport] = useState<Question | null>(null);
  const [summary, setSummary] = useState<PracticeSession | null>(null);
  const [appearanceOpen, setAppearanceOpen] = useState(false);
  const [appearanceBusy, setAppearanceBusy] = useState(false);
  const [timerOpen, setTimerOpen] = useState(false);
  const [discardConfirm, setDiscardConfirm] = useState(false);
  const [recoveryOpen, setRecoveryOpen] = useState(false);
  const [recoveryRemaining, setRecoveryRemaining] = useState<number | null>(null);
  const loaded = useRef(false);
  const currentUser = useRef<string | undefined>(undefined);
  const bookmarkPending = useRef(new Set<string>());
  const answerLock = useRef(new Set<string>());
  const outbox = usePracticeOutbox(session?.user.id, (task, result) => {
    if (!result || task.kind !== 'answer') return;
    setWorkspace((w) =>
      w
        ? {
            ...w,
            attempts: w.attempts.some((a) => a.id === result.attempt.id)
              ? w.attempts
              : [...w.attempts, result.attempt],
          }
        : w,
    );
    setActive((current) =>
      current?.id === task.sessionId
        ? {
            ...current,
            answers: { ...current.answers, [task.questionId]: result.attempt.optionId },
          }
        : current,
    );
  });
  const pendingCount = outbox.tasks.length;
  const refresh = useCallback(async () => {
    const requestedUser = currentUser.current;
    try {
      await outbox.flush();
      const data = await api<Workspace>('/api/workspace');
      if (currentUser.current !== requestedUser) return false;
      // Retain any unsent choices restored from this device; the sync banner
      // keeps them visibly separate from server-acknowledged progress.
      const pending = outbox.pending();
      if (data.activeSession) {
        const draft = data.activeSession;
        if (pending.some((t) => t.kind === 'finish' && t.sessionId === draft.id))
          data.activeSession = null;
        else
          data.activeSession = {
            ...draft,
            answers: {
              ...draft.answers,
              ...Object.fromEntries(
                pending
                  .filter((t) => t.kind === 'answer' && t.sessionId === draft.id)
                  .map((t) => (t.kind === 'answer' ? [t.questionId, t.optionId] : [])),
              ),
            },
          };
      }
      setWorkspace(data);
      setActive(data.activeSession);
      setError('');
      loaded.current = true;
      return true;
    } catch (e) {
      if (currentUser.current === requestedUser) setError((e as Error).message);
      return false;
    }
  }, [outbox.flush, outbox.pending]);
  useEffect(() => {
    currentUser.current = session?.user.id;
    setWorkspace(null);
    setActive(null);
    setSummary(null);
    setSetup(null);
    setReport(null);
    setView('dashboard');
    setError('');
    setToast('');
    setAppearanceOpen(false);
    setTimerOpen(false);
    setRecoveryOpen(false);
    setRecoveryRemaining(null);
    answerLock.current.clear();
    loaded.current = false;
    if (session?.user.id) void refresh();
  }, [session?.user.id, refresh]);
  useEffect(() => {
    try {
      setDark(localStorage.getItem('labsprint-theme') === 'dark');
    } catch {}
  }, []);
  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    applyAppearance(document.documentElement, workspace?.appearance || defaultAppearance);
  }, [dark, workspace?.appearance]);
  useEffect(() => {
    if (!workspace?.user.id) return;
    const key = `labsprint-pending-appearance:${workspace.user.id}`;
    const savePending = async () => {
      try {
        if (sessionStorage.getItem(`labsprint-recovery-onboarding:${workspace.user.id}`))
          setRecoveryOpen(true);
        const candidate = JSON.parse(sessionStorage.getItem(key) || 'null');
        if (isAppearance(candidate)) {
          await api('/api/appearance', 'PUT', candidate);
          sessionStorage.removeItem(key);
          setWorkspace((w) => (w ? { ...w, appearance: candidate } : w));
        }
      } catch {
        /* Account creation succeeds even if a color preference needs retrying. */
      }
    };
    void savePending();
    const update = () => {
      void savePending();
    };
    window.addEventListener('labsprint-appearance-updated', update);
    return () => window.removeEventListener('labsprint-appearance-updated', update);
  }, [workspace?.user.id]);
  useEffect(() => {
    if (!workspace?.user.id) return;
    let alive = true;
    void api<{ remaining: number }>('/api/recovery-codes')
      .then((data) => {
        if (alive) setRecoveryRemaining(data.remaining);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [workspace?.user.id, recoveryOpen]);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(''), 4000);
    return () => clearTimeout(timer);
  }, [toast]);
  useEffect(() => {
    const onFocus = () => {
      if (
        document.visibilityState === 'visible' &&
        currentUser.current &&
        loaded.current &&
        !loading &&
        pendingCount === 0
      )
        void refresh();
    };
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onFocus);
    return () => {
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onFocus);
    };
  }, [refresh, loading, pendingCount]);
  const toggleTheme = () => {
    setDark((d) => !d);
    try {
      localStorage.setItem('labsprint-theme', dark ? 'light' : 'dark');
    } catch {}
  };
  const changeView = (next: View) => {
    setView(next);
    setSummary(null);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };
  const handleMutationError = async (error: unknown) => {
    // A different device can advance or replace a session. Reload its saved
    // state before showing the conflict so the next action uses fresh data.
    if (error instanceof ApiError && error.status === 409) await refresh();
    setError(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
  };
  const startPractice = async (ids: string[]) => {
    setLoading(true);
    setError('');
    try {
      if (!(await outbox.flush())) {
        setError(
          'Your previous answers still need to sync. Use Retry sync before starting another session.',
        );
        return;
      }
      const next: PracticeSession = {
        id: crypto.randomUUID(),
        questionIds: shuffled(ids),
        index: 0,
        answers: {},
      };
      await api('/api/practice-session', 'PUT', { ...next, replaceSessionId: active?.id ?? null });
      setActive(next);
      setWorkspace((w) => (w ? { ...w, activeSession: next } : w));
      setSetup(null);
      setSummary(null);
      changeView('practice');
    } catch (e) {
      await handleMutationError(e);
    } finally {
      setLoading(false);
    }
  };
  const finish = () => {
    if (!active) return;
    outbox.enqueue({ kind: 'finish', id: crypto.randomUUID(), sessionId: active.id });
    setSummary(active);
    setActive(null);
    setWorkspace((w) => (w ? { ...w, activeSession: null } : w));
  };
  const answer = (question: Question, optionId: string) => {
    if (!active || active.answers[question.id]) return;
    const key = `${active.id}:${question.id}`;
    if (answerLock.current.has(key)) return;
    answerLock.current.add(key);
    setError('');
    const next = { ...active, answers: { ...active.answers, [question.id]: optionId } };
    setActive(next);
    setWorkspace((w) => (w ? { ...w, activeSession: next } : w));
    outbox.enqueue({
      kind: 'answer',
      id: crypto.randomUUID(),
      sessionId: active.id,
      questionId: question.id,
      optionId,
      nextIndex: Math.min(active.index + 1, active.questionIds.length - 1),
    });
  };
  const signOut = async () => {
    if (!(await outbox.flush())) {
      setError(
        'Some answers are not synced yet. Retry sync before signing out so your progress stays safe.',
      );
      return;
    }
    await authClient.signOut();
    setWorkspace(null);
  };
  const bookmark = async (id: string) => {
    if (!workspace || bookmarkPending.current.has(id)) return;
    bookmarkPending.current.add(id);
    const marked = workspace.bookmarks.includes(id);
    try {
      await api('/api/bookmarks', 'POST', { questionId: id, bookmarked: !marked });
      setWorkspace((w) =>
        w
          ? {
              ...w,
              bookmarks: marked
                ? w.bookmarks.filter((x) => x !== id)
                : [...new Set([...w.bookmarks, id])],
            }
          : w,
      );
      setToast(marked ? 'Bookmark removed' : 'Saved to your bookmarks');
    } catch (e) {
      await handleMutationError(e);
    } finally {
      bookmarkPending.current.delete(id);
    }
  };
  if (isPending)
    return (
      <div className="splash">
        <Brand />
        <Loader2 className="spin" />
        <p>Preparing your review space…</p>
      </div>
    );
  if (!session) return <AuthScreen />;
  if (!workspace)
    return (
      <div className="splash">
        <Brand />
        {error ? (
          <>
            <p role="alert">{error}</p>
            <button className="button primary" onClick={refresh}>
              Try again
            </button>
            <button className="button ghost" onClick={() => authClient.signOut()}>
              Sign out
            </button>
          </>
        ) : (
          <>
            <Loader2 className="spin" />
            <p>Loading your saved progress…</p>
          </>
        )}
      </div>
    );
  const needsReview = [...latestAttempts(workspace.attempts).values()]
    .filter((a) => !a.correct)
    .map((a) => a.questionId);
  const firstName = workspace.user.name.split(' ')[0] || 'there';
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Brand />
        <div className="workspace-label">YOUR STUDY SPACE</div>
        <nav aria-label="Main navigation">
          {nav.map((item) => (
            <button
              key={item.id}
              aria-label={item.label}
              onClick={() => changeView(item.id)}
              className={`nav-item ${view === item.id ? 'selected' : ''}`}
              aria-current={view === item.id ? 'page' : undefined}
            >
              <item.icon size={19} />
              <span>{item.label}</span>
              {item.id === 'review' && needsReview.length > 0 ? (
                <span className="nav-count">{needsReview.length}</span>
              ) : null}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="pace-note">
            <Sparkles size={19} />
            <strong>Your pace. Your progress.</strong>
            <p>
              Small steps today.
              <br />
              Stronger foundations tomorrow.
            </p>
          </div>
          <button
            className={`nav-item ${view === 'settings' ? 'selected' : ''}`}
            aria-label="Preferences"
            onClick={() => changeView('settings')}
          >
            <Settings2 size={18} />
            <span>Preferences</span>
          </button>
          <div className="profile">
            <span className="avatar">{firstName.slice(0, 1).toUpperCase()}</span>
            <div>
              <strong>{workspace.user.name}</strong>
              <small>MLS in the making</small>
            </div>
            <button className="icon-button" aria-label="Sign out" onClick={signOut}>
              <LogOut size={17} />
            </button>
          </div>
        </div>
      </aside>
      <div className="main-shell">
        <header className="topbar">
          <div className="mobile-brand">
            <Brand />
          </div>
          <div className="breadcrumb">
            My workspace <ChevronRight size={14} />
            <strong>
              {nav.find((n) => n.id === view)?.label ||
                (view === 'practice' ? 'Study session' : 'Preferences')}
            </strong>
          </div>
          <div className="topbar-right">
            <button
              className="icon-button"
              aria-label="Customize colors"
              title="Customize colors"
              onClick={() => setAppearanceOpen(true)}
            >
              <Palette size={19} />
            </button>
            <button
              className="icon-button"
              aria-label="Open study timer"
              title="Study timer"
              onClick={() => setTimerOpen((open) => !open)}
            >
              <Timer size={19} />
            </button>
            <button
              className="icon-button mobile-search"
              aria-label="Open question library"
              onClick={() => changeView('library')}
            >
              <Search size={19} />
            </button>
            <span className="study-mode">
              <span />
              Study mode · Untimed
            </span>
            <button
              className="icon-button"
              aria-label={dark ? 'Use light theme' : 'Use dark theme'}
              onClick={toggleTheme}
            >
              {dark ? <Sun size={19} /> : <Moon size={19} />}
            </button>
            <span className="avatar small">{firstName.slice(0, 1).toUpperCase()}</span>
          </div>
        </header>
        <main
          id="main-content"
          className={`main-content ${active && view === 'practice' ? 'practice-main' : ''}`}
        >
          <div
            className={`sync-strip ${outbox.error ? 'sync-problem' : ''}`}
            role="status"
            aria-live="polite"
          >
            {pendingCount ? <CloudUpload size={15} /> : <CheckCircle2 size={15} />}
            <span>
              {outbox.error
                ? `${pendingCount} change${pendingCount === 1 ? '' : 's'} not synced. ${outbox.error}`
                : pendingCount
                  ? `Saving ${pendingCount} change${pendingCount === 1 ? '' : 's'} in the background…`
                  : 'Progress synced'}
            </span>
            {outbox.error ? (
              <button className="text-button" onClick={() => void outbox.flush()}>
                Retry sync
              </button>
            ) : null}
            {outbox.conflict ? (
              <button className="text-button" onClick={() => setDiscardConfirm(true)}>
                Use saved session
              </button>
            ) : null}
          </div>
          {!outbox.durable && pendingCount ? (
            <div className="inline-warning">
              Keep this tab open until saving finishes. This browser could not keep a retry copy on
              this device.
            </div>
          ) : null}
          {view === 'dashboard' && recoveryRemaining === 0 ? (
            <div className="recovery-reminder">
              <span>
                <strong>Keep your progress safe.</strong> Save recovery codes in case you forget
                your password.
              </span>
              <button className="text-button" onClick={() => setRecoveryOpen(true)}>
                Set up recovery <ArrowRight size={15} />
              </button>
            </div>
          ) : null}
          {error ? (
            <div className="error-banner" role="alert">
              <CircleHelp size={18} />
              <span>{error}</span>
              <button
                className="icon-button"
                aria-label="Dismiss error"
                onClick={() => setError('')}
              >
                <X size={17} />
              </button>
            </div>
          ) : null}
          {active && !(view === 'practice') ? (
            <button
              className="resume-banner"
              onClick={async () => {
                if (pendingCount || (await refresh())) changeView('practice');
              }}
            >
              <Play size={17} />
              <span>
                {pendingCount ? 'Practice in progress' : 'Your practice is saved'} ·{' '}
                {Object.keys(active.answers).length}/{active.questionIds.length} answered
              </span>
              <strong>
                Resume <ArrowRight size={16} />
              </strong>
            </button>
          ) : null}
          {summary ? (
            <SessionSummary
              session={summary}
              onDone={() => {
                setSummary(null);
                changeView('dashboard');
              }}
              onRedo={() => {
                setSummary(null);
                setSetup({
                  ids: summary.questionIds.filter(
                    (id) =>
                      summary.answers[id] &&
                      summary.answers[id] !== questionMap.get(id)?.correctOptionId,
                  ),
                  label: 'Session mistakes',
                });
              }}
            />
          ) : active && view === 'practice' ? (
            <Practice
              session={active}
              workspace={workspace}
              busy={loading}
              pendingQuestionIds={outbox.tasks
                .filter((t) => t.kind === 'answer')
                .map((t) => t.questionId)}
              onAnswer={answer}
              onNext={() => {
                if (!active.answers[active.questionIds[active.index]]) return;
                const next = {
                  ...active,
                  index: Math.min(active.index + 1, active.questionIds.length - 1),
                };
                setActive(next);
                setWorkspace((w) => (w ? { ...w, activeSession: next } : w));
                window.scrollTo({ top: 0, behavior: 'instant' });
              }}
              onFinish={finish}
              onPause={() => {
                changeView('dashboard');
                setToast('Practice paused. Resume whenever you’re ready.');
              }}
              onBookmark={bookmark}
              onReport={setReport}
            />
          ) : view === 'dashboard' ? (
            <Dashboard
              workspace={workspace}
              name={firstName}
              onPractice={setSetup}
              onView={changeView}
            />
          ) : view === 'subjects' ? (
            <SubjectBrowser workspace={workspace} onPractice={setSetup} />
          ) : view === 'review' ? (
            <ReviewQueue workspace={workspace} onPractice={setSetup} onBookmark={bookmark} />
          ) : view === 'progress' ? (
            <Progress workspace={workspace} />
          ) : view === 'library' ? (
            <QuestionLibrary workspace={workspace} onPractice={setSetup} onBookmark={bookmark} />
          ) : (
            <Preferences
              workspace={workspace}
              onSignOut={signOut}
              onSave={async (settings) => {
                await api('/api/settings', 'PUT', settings);
                setWorkspace((w) => (w ? { ...w, settings } : w));
                setToast('Preferences saved');
              }}
            />
          )}
          {view === 'settings' ? (
            <div className="settings-extras">
              <section className="panel appearance-settings-card">
                <Palette size={25} />
                <h2>A study space that feels like you</h2>
                <p>
                  Choose a ready-made palette or mix your own colors. Preview the dashboard and
                  practice screen before applying.
                </p>
                <button className="button primary" onClick={() => setAppearanceOpen(true)}>
                  Choose my colors <Palette size={16} />
                </button>
              </section>
              <RecoveryCodesPanel />
            </div>
          ) : null}
          <footer className="page-footer">
            <span>
              <FlaskConical size={14} /> LabSprint · Learn a little. Grow a lot.
            </span>
            <span>{questions.length} original practice questions · Test edition</span>
          </footer>
        </main>
      </div>
      <nav className="mobile-nav" aria-label="Mobile navigation">
        {nav.slice(0, 4).map((item) => (
          <button
            key={item.id}
            onClick={() => changeView(item.id)}
            className={view === item.id ? 'selected' : ''}
          >
            <item.icon size={21} />
            <span>
              {item.id === 'dashboard'
                ? 'Home'
                : item.id === 'subjects'
                  ? 'Subjects'
                  : item.id === 'review'
                    ? 'Review'
                    : 'Progress'}
            </span>
          </button>
        ))}
        <button
          onClick={() => changeView('settings')}
          className={view === 'settings' ? 'selected' : ''}
        >
          <Settings2 size={21} />
          <span>Settings</span>
        </button>
      </nav>
      {toast ? (
        <div className="toast" role="status">
          <CheckCircle2 size={18} />
          {toast}
        </div>
      ) : null}
      {setup ? (
        <PracticeSetup
          config={setup}
          active={active}
          busy={loading}
          error={error}
          onClose={() => setSetup(null)}
          onStart={startPractice}
        />
      ) : null}
      {report ? (
        <ReportDialog
          question={report}
          onClose={() => setReport(null)}
          onSubmit={async (reason) => {
            await api('/api/reports', 'POST', { questionId: report.id, reason });
            setReport(null);
            setToast('Issue reported. Thank you for helping improve the bank.');
          }}
        />
      ) : null}
      {appearanceOpen ? (
        <AppearancePicker
          value={workspace.appearance || defaultAppearance}
          busy={appearanceBusy}
          onClose={() => setAppearanceOpen(false)}
          onApply={async (theme: Appearance) => {
            setAppearanceBusy(true);
            try {
              await api('/api/appearance', 'PUT', theme);
              setWorkspace((w) => (w ? { ...w, appearance: theme } : w));
              setAppearanceOpen(false);
              setToast('Your study space, your colors.');
            } finally {
              setAppearanceBusy(false);
            }
          }}
        />
      ) : null}
      {discardConfirm ? (
        <Modal title="Use saved session" onClose={() => setDiscardConfirm(false)}>
          <h2>Use the session saved online?</h2>
          <p>
            Another device changed this practice. {pendingCount} pending changes on this device
            cannot be merged automatically. Your previously saved history stays safe.
          </p>
          <div className="summary-actions">
            <button className="button secondary" onClick={() => setDiscardConfirm(false)}>
              Keep my pending answers
            </button>
            <button
              className="button primary"
              onClick={async () => {
                outbox.clear();
                answerLock.current.clear();
                await refresh();
                setSummary(null);
                setDiscardConfirm(false);
              }}
            >
              Discard pending changes & reload
            </button>
          </div>
        </Modal>
      ) : null}
      {recoveryOpen ? (
        <Modal
          title="Keep your study progress safe"
          onClose={() => {
            sessionStorage.removeItem(`labsprint-recovery-onboarding:${workspace.user.id}`);
            setRecoveryOpen(false);
          }}
        >
          <h2>Keep your study progress safe.</h2>
          <p>
            Save private recovery codes so you can reset a forgotten password. You can also do this
            later in Preferences.
          </p>
          <RecoveryCodesPanel
            onDone={() => {
              sessionStorage.removeItem(`labsprint-recovery-onboarding:${workspace.user.id}`);
              setRecoveryOpen(false);
            }}
          />
        </Modal>
      ) : null}
      <StudyTimer open={timerOpen} onClose={() => setTimerOpen(false)} userId={workspace.user.id} />
    </div>
  );
}
