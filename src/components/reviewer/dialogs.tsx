'use client';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Flag, Loader2, X } from 'lucide-react';
import type { Question } from '@/content/types';
export function Modal({
  children,
  title,
  onClose,
}: {
  children: React.ReactNode;
  title: string;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const prior = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const root = ref.current;
    const focusable = () =>
      Array.from(
        root?.querySelectorAll<HTMLElement>(
          'button:not([disabled]),input,select,textarea,[tabindex="0"]',
        ) || [],
      );
    focusable()[0]?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab') {
        const nodes = focusable(),
          first = nodes[0],
          last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener('keydown', key);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener('keydown', key);
      prior?.focus();
    };
  }, [onClose]);
  return (
    <div
      className="modal-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div ref={ref} role="dialog" aria-modal="true" aria-label={title} className="modal">
        <button className="icon-button modal-close" aria-label="Close dialog" onClick={onClose}>
          <X size={20} />
        </button>
        {children}
      </div>
    </div>
  );
}
export function ReportDialog({
  question,
  onClose,
  onSubmit,
}: {
  question: Question;
  onClose: () => void;
  onSubmit: (reason: string) => Promise<void>;
}) {
  const [busy, setBusy] = useState(false),
    [error, setError] = useState('');
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    try {
      await onSubmit(String(new FormData(e.currentTarget).get('reason')));
    } catch (e) {
      setError((e as Error).message);
      setBusy(false);
    }
  }
  return (
    <Modal title="Help improve this question" onClose={onClose}>
      <span className="modal-eyebrow">BETTER, TOGETHER</span>
      <h2>Help improve this question.</h2>
      <p>Tell us what feels incorrect, ambiguous, or hard to follow.</p>
      <form onSubmit={submit}>
        <label>
          Your feedback
          <textarea
            name="reason"
            minLength={5}
            maxLength={1500}
            rows={5}
            required
            placeholder="For example: the explanation for option B seems to conflict with…"
          />
        </label>
        <small className="fine-print">
          Question {question.id} · Version {question.version}
        </small>
        {error ? (
          <p role="alert" className="inline-error">
            {error}
          </p>
        ) : null}
        <button className="button primary wide" disabled={busy}>
          {busy ? <Loader2 size={17} className="spin" /> : <Flag size={17} />}Submit report
        </button>
      </form>
    </Modal>
  );
}
