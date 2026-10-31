'use client';
import { useEffect, useState, type FormEvent } from 'react';
import {
  Check,
  CheckCircle2,
  Copy,
  Download,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  ShieldCheck,
} from 'lucide-react';
import './account.css';

export function RecoveryCodesPanel({ onDone }: { onDone?: () => void }) {
  const [status, setStatus] = useState<{ remaining: number; total: number } | null>(null);
  const [codes, setCodes] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [show, setShow] = useState(false);
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    void fetch('/api/recovery-codes', { cache: 'no-store', signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error('Could not load recovery-code status.');
        return response.json();
      })
      .then(setStatus)
      .catch((error) => {
        if (!controller.signal.aborted) setError(error.message);
      });
    return () => controller.abort();
  }, []);
  async function generate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError('');
    setNotice('');
    const form = event.currentTarget;
    try {
      const response = await fetch('/api/recovery-codes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: String(new FormData(form).get('password')) }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Could not generate recovery codes.');
      form.reset();
      setCodes(result.codes);
      setStatus({ remaining: result.codes.length, total: result.codes.length });
      setShow(false);
      setSaved(false);
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setBusy(false);
    }
  }
  const download = () => {
    const recoveryUrl = new URL('/forgot-password', window.location.origin).href;
    const text = `LABSPRINT RECOVERY CODES\n\nKeep this file private and somewhere you can access if you forget your password.\nEach code works once with your registered email at ${recoveryUrl}\nGenerating a new set invalidates this set.\n\n${codes.join('\n')}\n`;
    const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'LabSprint-recovery-codes.txt';
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setNotice('Your download was started. Keep the file private.');
  };
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(codes.join('\n'));
      setNotice('Copied. Save them somewhere private.');
    } catch {
      setNotice('Copy was unavailable. You can download the codes or select the text manually.');
    }
  };
  return (
    <section className="recovery-codes-panel">
      <span className="recovery-panel-icon">
        <KeyRound size={24} />
      </span>
      <h2>{codes.length ? 'Keep your way back safe.' : 'Protect the progress you’ve made.'}</h2>
      <p>
        Recovery codes let you reset a forgotten password and return to the same account, answers,
        and bookmarks.
      </p>
      {codes.length ? (
        <>
          <div className="recovery-code-warning">
            <ShieldCheck size={18} />
            <span>
              These codes are shown only now. Anyone with a code and your email could recover your
              account. Keep them private.
            </span>
          </div>
          <div className="recovery-code-grid" aria-label="Your one-time recovery codes">
            {codes.map((code, index) => (
              <code key={code}>
                <span>{index + 1}.</span>
                {code}
              </code>
            ))}
          </div>
          <div className="recovery-code-actions">
            <button type="button" className="button secondary" onClick={copy}>
              <Copy size={16} />
              Copy codes
            </button>
            <button type="button" className="button secondary" onClick={download}>
              <Download size={16} />
              Download
            </button>
          </div>
          {notice ? (
            <p className="recovery-notice" role="status">
              {notice}
            </p>
          ) : null}
          <label className="recovery-confirm">
            <input
              type="checkbox"
              checked={saved}
              onChange={(event) => setSaved(event.target.checked)}
            />
            <span>I saved these codes somewhere private.</span>
          </label>
          <button
            className="button primary wide"
            type="button"
            disabled={!saved}
            onClick={() => {
              setCodes([]);
              setSaved(false);
              setNotice('');
              onDone?.();
            }}
          >
            <Check size={17} />
            I’ve saved my recovery codes
          </button>
        </>
      ) : (
        <>
          {status ? (
            <div className="recovery-current-status">
              <CheckCircle2 size={17} />
              {status.total
                ? `${status.remaining} unused recovery codes available.`
                : 'You haven’t created recovery codes yet.'}
            </div>
          ) : null}
          <form onSubmit={generate}>
            <label>
              Confirm your current password
              <span className="password-field">
                <input
                  name="password"
                  type={show ? 'text' : 'password'}
                  autoComplete="current-password"
                  maxLength={128}
                  required
                />
                <button
                  className="password-toggle"
                  type="button"
                  aria-label={show ? 'Hide password' : 'Show password'}
                  aria-pressed={show}
                  onClick={() => setShow(!show)}
                >
                  {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </span>
            </label>
            {status?.total ? (
              <p className="fine-print">
                Creating a new set immediately invalidates your previous codes. This does not change
                your password or study history.
              </p>
            ) : (
              <p className="fine-print">
                We’ll create 10 one-time codes. Save them before closing this screen.
              </p>
            )}
            {error ? (
              <div className="inline-error" role="alert">
                {error}
              </div>
            ) : null}
            <button className="button primary" disabled={busy}>
              {busy ? <Loader2 className="spin" size={17} /> : <KeyRound size={17} />}{' '}
              {status?.total ? 'Generate a replacement set' : 'Generate recovery codes'}
            </button>
          </form>
        </>
      )}
    </section>
  );
}
