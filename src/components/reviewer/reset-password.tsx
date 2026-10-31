'use client';
import { useState, type FormEvent } from 'react';
import { ArrowLeft, CheckCircle2, Eye, EyeOff, Loader2, ShieldCheck } from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import { Brand } from './shared';
import './account.css';

export function ResetPassword({ token, invalid }: { token: string; invalid: boolean }) {
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const [linkInvalid, setLinkInvalid] = useState(invalid);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const newPassword = String(data.get('password'));
    if (newPassword !== String(data.get('confirmPassword'))) {
      setError('The two passwords do not match.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      const result = await authClient.resetPassword({ token, newPassword });
      if (result.error) {
        if (result.error.code === 'INVALID_TOKEN') {
          setLinkInvalid(true);
          window.history.replaceState(null, '', '/reset-password');
        } else if (result.error.status === 429) {
          setError('Too many attempts. Wait a minute before trying again.');
        } else {
          setError('We could not update your password. Use 12–128 characters and try again.');
        }
        return;
      }
      setDone(true);
      window.history.replaceState(null, '', '/reset-password');
    } catch {
      setError('We could not update your password. Check your connection and try again.');
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="reset-page">
      <section className="reset-card">
        <Brand />
        <span className="eyebrow">YOUR PROGRESS IS STILL YOURS</span>
        <h1>{done ? 'Welcome back to your journey.' : 'A fresh password. The same progress.'}</h1>
        {done ? (
          <>
            <div className="auth-status" role="status">
              <CheckCircle2 size={22} />
              <div>
                <p>
                  Your password is updated. Your account, answers, bookmarks, and progress are
                  unchanged.
                </p>
                <p>For security, sign in again on your devices.</p>
              </div>
            </div>
            <a className="button primary wide" href="/">
              Back to sign in
            </a>
          </>
        ) : linkInvalid ? (
          <>
            <div className="auth-status unavailable" role="alert">
              <ShieldCheck size={22} />
              <p>
                This link is missing, invalid, or expired. Request a new one to recover your
                account.
              </p>
            </div>
            <a className="button primary wide" href="/forgot-password">
              Choose a recovery method
            </a>
          </>
        ) : (
          <>
            <p id="reset-password-help">
              Choose a password of at least 12 characters. This link can be used once and expires
              after 30 minutes.
            </p>
            <form onSubmit={submit} aria-busy={busy}>
              <label>
                New password
                <span className="password-field">
                  <input
                    type={show ? 'text' : 'password'}
                    name="password"
                    aria-describedby={`reset-password-help${error ? ' reset-password-error' : ''}`}
                    autoComplete="new-password"
                    minLength={12}
                    maxLength={128}
                    required
                  />
                  <button
                    className="password-toggle"
                    type="button"
                    aria-label={show ? 'Hide passwords' : 'Show passwords'}
                    aria-pressed={show}
                    onClick={() => setShow(!show)}
                  >
                    {show ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </span>
              </label>
              <label>
                Confirm new password
                <input
                  type={show ? 'text' : 'password'}
                  name="confirmPassword"
                  aria-describedby={error ? 'reset-password-error' : undefined}
                  autoComplete="new-password"
                  minLength={12}
                  maxLength={128}
                  required
                />
              </label>
              {error ? (
                <div id="reset-password-error" className="inline-error" role="alert">
                  {error}
                </div>
              ) : null}
              <button className="button primary wide" disabled={busy}>
                {busy ? <Loader2 className="spin" size={18} /> : <ShieldCheck size={18} />}
                {busy ? 'Updating password…' : 'Update password'}
              </button>
              <span className="auth-loading-status" role="status" aria-live="polite">
                {busy ? 'Updating password…' : ''}
              </span>
            </form>
          </>
        )}
        {!done ? (
          <a className="reset-back" href="/">
            <ArrowLeft size={15} />
            Back to sign in
          </a>
        ) : null}
      </section>
    </main>
  );
}
