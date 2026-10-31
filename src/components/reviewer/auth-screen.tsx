'use client';
import { useEffect, useState, type FormEvent } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock3,
  Eye,
  EyeOff,
  FlaskConical,
  KeyRound,
  Loader2,
  Mail,
  Palette,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import { defaultAppearance, applyAppearance, type Appearance } from '@/lib/appearance';
import { AppearancePicker } from './appearance';
import { Brand } from './shared';
import './account.css';

type AuthMode = 'signin' | 'signup' | 'recover';

export function AuthScreen({ initialMode = 'signin' }: { initialMode?: AuthMode }) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [sent, setSent] = useState(false);
  const [recovered, setRecovered] = useState(false);
  const [recoveryMethod, setRecoveryMethod] = useState<'code' | 'email'>('code');
  const [recoveryEnabled, setRecoveryEnabled] = useState<boolean | null>(null);
  const [appearance, setAppearance] = useState<Appearance>(defaultAppearance);
  const [customized, setCustomized] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const signup = mode === 'signup';
  const recover = mode === 'recover';

  useEffect(() => {
    if (!recover) return;
    const controller = new AbortController();
    void fetch('/api/recovery-status', { signal: controller.signal, cache: 'no-store' })
      .then((response) => {
        if (!response.ok) throw new Error('Unavailable');
        return response.json();
      })
      .then((data) => setRecoveryEnabled(data.enabled === true))
      .catch(() => {
        if (!controller.signal.aborted) setRecoveryEnabled(false);
      });
    return () => controller.abort();
  }, [recover]);

  const switchMode = (next: AuthMode) => {
    setMode(next);
    setError('');
    setSent(false);
    setRecovered(false);
    setShowPassword(false);
  };

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError('');
    const data = new FormData(event.currentTarget);
    const email = String(data.get('email')).trim();
    try {
      if (recover) {
        if (recoveryMethod === 'email') {
          const result = await authClient.requestPasswordReset({
            email,
            redirectTo: new URL('/reset-password', window.location.origin).href,
          });
          if (result.error)
            setError('We could not request a reset link. Please try again in a few minutes.');
          else setSent(true);
        } else {
          const newPassword = String(data.get('password'));
          if (newPassword !== String(data.get('confirmPassword'))) {
            setError('The two passwords do not match.');
            return;
          }
          const response = await fetch('/api/recover-account', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, code: String(data.get('code')).trim(), newPassword }),
          });
          const result = await response.json();
          if (!response.ok) throw new Error(result.error || 'We could not recover this account.');
          setRecovered(true);
          setShowPassword(false);
        }
        return;
      }
      const result = signup
        ? await authClient.signUp.email({
            name: String(data.get('name')).trim(),
            email,
            password: String(data.get('password')),
          })
        : await authClient.signIn.email({ email, password: String(data.get('password')) });
      if (result.error) {
        setError(result.error.message || 'Unable to sign in. Check your details and try again.');
        return;
      }
      if (signup && result.data?.user.id) {
        try {
          if (customized)
            sessionStorage.setItem(
              `labsprint-pending-appearance:${result.data.user.id}`,
              JSON.stringify(appearance),
            );
          sessionStorage.setItem(`labsprint-recovery-onboarding:${result.data.user.id}`, '1');
        } catch {}
        window.dispatchEvent(new Event('labsprint-appearance-updated'));
      }
      if (window.location.pathname !== '/') window.location.assign('/');
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Could not reach LabSprint. Please try again.',
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth-page">
      <section className="auth-story">
        <Brand />
        <div className="auth-copy">
          <span className="eyebrow">
            <span className="tiny-star">✦</span> YOUR NEXT CHAPTER STARTS HERE
          </span>
          <h1>
            Big goals.
            <br />
            Small steps.
            <br />
            <span>You’ve got this.</span>
          </h1>
          <p>
            A calmer way to review for MTAP, mockboards, and beyond. Understand the why behind every
            answer.
          </p>
          <div className="auth-pills">
            <span>
              <CheckCircle2 size={16} />
              All MLS subjects
            </span>
            <span>
              <Clock3 size={16} />
              No time pressure
            </span>
          </div>
        </div>
        <div className="auth-visual" aria-hidden="true">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="flask-orb">
            <FlaskConical size={65} strokeWidth={1.2} />
          </div>
          <div className="floating-label">
            <Sparkles size={18} />A little more confident, every day.
          </div>
        </div>
        <small>Built for curious minds. Future RMTs.</small>
      </section>
      <section className="auth-form-side">
        <div className="auth-form-wrap">
          <span className="label">{recover ? 'LET’S GET YOU BACK' : 'LET’S MAKE PROGRESS'}</span>
          <h2>
            {recovered
              ? 'Your progress is ready for you.'
              : recover
                ? 'Your progress is still here.'
                : signup
                  ? 'Your review journey starts here.'
                  : 'Welcome to your study space.'}
          </h2>
          <p>
            {recover
              ? 'Recover the same account and keep your saved study history.'
              : signup
                ? 'Create an account to save your progress on any device.'
                : 'Pick up where you left off. One question at a time.'}
          </p>
          {recover && !recovered && !sent ? (
            <div className="recovery-methods">
              <button
                className={recoveryMethod === 'code' ? 'active' : ''}
                type="button"
                onClick={() => {
                  setRecoveryMethod('code');
                  setError('');
                }}
              >
                <KeyRound size={14} /> Recovery code
              </button>
              {recoveryEnabled ? (
                <button
                  className={recoveryMethod === 'email' ? 'active' : ''}
                  type="button"
                  onClick={() => {
                    setRecoveryMethod('email');
                    setError('');
                  }}
                >
                  <Mail size={14} />
                  Email link
                </button>
              ) : null}
            </div>
          ) : null}
          {recovered ? (
            <>
              <div className="auth-status" role="status">
                <CheckCircle2 size={22} />
                <div>
                  <p>
                    Your password has been updated. Your account, answers, bookmarks, and progress
                    are unchanged.
                  </p>
                  <p>This recovery code is now used. Sign in again with your new password.</p>
                </div>
              </div>
              <a className="button primary wide auth-back" href="/">
                Back to sign in
              </a>
            </>
          ) : sent ? (
            <div className="auth-status" role="status">
              <Mail size={22} />
              <div>
                <p>
                  If an account uses that email, you’ll receive a password-reset link. Check your
                  inbox and spam folder.
                </p>
                <p>The link expires in 30 minutes and works once.</p>
              </div>
            </div>
          ) : (
            <form onSubmit={submit}>
              {signup ? (
                <label>
                  Your name
                  <input
                    autoComplete="name"
                    name="name"
                    placeholder="What should we call you?"
                    minLength={2}
                    maxLength={80}
                    required
                  />
                </label>
              ) : null}
              <label>
                Email address
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  required
                  maxLength={254}
                />
              </label>
              {recover && recoveryMethod === 'code' ? (
                <label>
                  One unused recovery code
                  <input
                    name="code"
                    type="text"
                    autoComplete="off"
                    autoCapitalize="characters"
                    spellCheck={false}
                    placeholder="Paste one code you saved"
                    maxLength={100}
                    required
                  />
                  <small>Create recovery codes in Preferences while you’re signed in.</small>
                </label>
              ) : null}
              {!recover || recoveryMethod === 'code' ? (
                <label>
                  {recover ? 'New password' : 'Password'}
                  <span className="password-field">
                    <input
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete={signup || recover ? 'new-password' : 'current-password'}
                      minLength={signup || recover ? 12 : 1}
                      maxLength={128}
                      placeholder={signup || recover ? 'At least 12 characters' : 'Your password'}
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      aria-pressed={showPassword}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </span>
                </label>
              ) : null}
              {recover && recoveryMethod === 'code' ? (
                <label>
                  Confirm new password
                  <input
                    name="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    minLength={12}
                    maxLength={128}
                    required
                  />
                </label>
              ) : null}
              {!signup && !recover ? (
                <a className="forgot-link" href="/forgot-password">
                  Forgot password?
                </a>
              ) : null}
              {signup ? (
                <button className="signup-colors" type="button" onClick={() => setPickerOpen(true)}>
                  <span>
                    <Palette size={18} />
                    <span>
                      {customized ? 'Your study colors are ready' : 'Choose your study colors'}
                      <small>Optional · Preview before applying</small>
                    </span>
                  </span>
                  <span
                    className="signup-color-chip"
                    style={{
                      background:
                        appearance.style === 'gradient'
                          ? `linear-gradient(135deg, ${appearance.accent}, ${appearance.secondary})`
                          : appearance.accent,
                    }}
                  />
                </button>
              ) : null}
              {error ? (
                <div className="inline-error" role="alert">
                  {error}
                </div>
              ) : null}
              <button className="button primary wide" disabled={busy}>
                {busy ? <Loader2 className="spin" size={18} /> : null}
                {recover
                  ? recoveryMethod === 'code'
                    ? 'Recover my account'
                    : 'Request reset link'
                  : signup
                    ? 'Create my account'
                    : 'Sign in'}
                <ArrowRight size={18} />
              </button>
            </form>
          )}
          {recover && !recovered ? (
            <>
              <a className="text-button auth-back" href="/">
                <ArrowLeft size={15} />
                Back to sign in
              </a>
              {recoveryMethod === 'code' ? (
                <p className="fine-print">
                  Recovery codes must be saved before you forget your password. Without a saved code
                  or configured email recovery, a forgotten password cannot be reset.
                </p>
              ) : null}
            </>
          ) : !recover ? (
            <p className="auth-switch">
              {signup ? 'Already have an account?' : 'New to LabSprint?'}{' '}
              <button onClick={() => switchMode(signup ? 'signin' : 'signup')}>
                {signup ? 'Sign in' : 'Create an account'}
              </button>
            </p>
          ) : null}
          <div className="auth-privacy">
            <ShieldCheck size={18} />
            <span>
              Your progress belongs to you. Each account has its own private review history.
            </span>
          </div>
          {!recover ? (
            <p className="fine-print">
              Save your one-time recovery codes after signing up. They can bring you back to the
              same account if you forget your password.
            </p>
          ) : null}
        </div>
      </section>
      {pickerOpen ? (
        <AppearancePicker
          value={appearance}
          onClose={() => setPickerOpen(false)}
          onApply={(next) => {
            setAppearance(next);
            setCustomized(true);
            applyAppearance(document.documentElement, next);
            setPickerOpen(false);
          }}
        />
      ) : null}
    </div>
  );
}
