'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowRight, History, Loader2 } from 'lucide-react';
import { sessionRecap, type PastPractice } from '@/lib/practice-review';
import { percent, type AttemptRecord } from '@/lib/progress';
import { api } from './api';
import { Modal } from './dialogs';
import { QuestionRecap } from './practice';
import { fmt } from './shared';

type SessionItem = Pick<PastPractice, 'id' | 'lastAnsweredAt' | 'answered' | 'correct'>;
type Page = { sessions: SessionItem[]; nextCursor: string | null };
type Detail = { session: PastPractice; attempts: AttemptRecord[] };
const sessionDate = new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short' });

export function SessionHistory({ activeSessionId }: { activeSessionId?: string }) {
  const [page, setPage] = useState<Page>({ sessions: [], nextCursor: null });
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<Detail | null>(null);
  const [detailBusy, setDetailBusy] = useState(false);
  const [detailError, setDetailError] = useState('');
  const generation = useRef(0);
  const detailRequest = useRef(0);
  const closeRecap = useCallback(() => {
    detailRequest.current++;
    setSelectedId(null);
  }, []);
  const load = useCallback(async (cursor?: string) => {
    const current = generation.current;
    setBusy(true);
    setError('');
    try {
      const next = await api<Page>(
        `/api/practice-history${cursor ? `?cursor=${encodeURIComponent(cursor)}` : ''}`,
      );
      if (current !== generation.current) return;
      setPage((old) => ({
        ...next,
        sessions: cursor
          ? [
              ...new Map(
                [...old.sessions, ...next.sessions].map((item) => [item.id, item]),
              ).values(),
            ]
          : next.sessions,
      }));
    } catch (e) {
      if (current === generation.current) setError((e as Error).message);
    } finally {
      if (current === generation.current) setBusy(false);
    }
  }, []);
  useEffect(() => {
    generation.current++;
    setPage({ sessions: [], nextCursor: null });
    void load();
    return () => {
      generation.current++;
      detailRequest.current++;
    };
  }, [activeSessionId, load]);
  const openRecap = useCallback(async (id: string) => {
    const request = ++detailRequest.current;
    setSelectedId(id);
    setDetail(null);
    setDetailError('');
    setDetailBusy(true);
    try {
      const next = await api<Detail>(`/api/practice-history?sessionId=${encodeURIComponent(id)}`);
      if (request === detailRequest.current) setDetail(next);
    } catch (e) {
      if (request === detailRequest.current) setDetailError((e as Error).message);
    } finally {
      if (request === detailRequest.current) setDetailBusy(false);
    }
  }, []);
  return (
    <section className="panel session-history" aria-labelledby="past-sessions-heading">
      <div className="section-heading">
        <div>
          <h2 id="past-sessions-heading">
            <History size={22} aria-hidden="true" /> Past sessions
          </h2>
          <p>Revisit saved answers and explanations from earlier practice.</p>
        </div>
      </div>
      {page.sessions.length ? (
        <ul className="history-list">
          {page.sessions.map((session) => (
            <li key={session.id}>
              <div>
                <time dateTime={session.lastAnsweredAt}>
                  {sessionDate.format(new Date(session.lastAnsweredAt))}
                </time>
                <span>
                  {session.answered} {session.answered === 1 ? 'answer' : 'answers'} ·{' '}
                  {session.correct}/{session.answered} correct
                </span>
              </div>
              <button
                type="button"
                className="button secondary"
                aria-label={`View recap from ${sessionDate.format(new Date(session.lastAnsweredAt))}`}
                onClick={() => void openRecap(session.id)}
              >
                View recap <ArrowRight size={16} aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      ) : !busy && !error ? (
        <p className="quiet-note">
          When you finish or replace a practice session, its saved answers appear here.
        </p>
      ) : null}
      {busy ? (
        <p role="status">
          <Loader2 size={17} className="spin" /> Loading saved sessions…
        </p>
      ) : null}
      {error ? (
        <div role="alert">
          <p>{error}</p>
          <button
            type="button"
            className="button secondary"
            onClick={() => void load(page.nextCursor || undefined)}
          >
            Try again
          </button>
        </div>
      ) : null}
      {page.nextCursor && !busy && !error ? (
        <button
          type="button"
          className="text-button history-more"
          onClick={() => void load(page.nextCursor!)}
        >
          Show more sessions
        </button>
      ) : null}
      {selectedId ? (
        <Modal title="Past session recap" onClose={closeRecap}>
          <span className="modal-eyebrow">YOUR SAVED PRACTICE</span>
          <h2>Past session recap</h2>
          {detailBusy ? (
            <p role="status">Loading saved answers…</p>
          ) : detailError ? (
            <div role="alert">
              <p>{detailError}</p>
              <button
                type="button"
                className="button secondary"
                onClick={() => void openRecap(selectedId)}
              >
                Try again
              </button>
            </div>
          ) : detail && detail.session.id === selectedId ? (
            <>
              <p>
                <time dateTime={detail.session.lastAnsweredAt}>
                  {sessionDate.format(new Date(detail.session.lastAnsweredAt))}
                </time>{' '}
                · {detail.session.correct}/{detail.session.answered} correct ·{' '}
                {fmt(percent(detail.session.correct, detail.session.answered))} accuracy
              </p>
              <QuestionRecap
                questionIds={detail.session.questionIds}
                rows={sessionRecap(detail.session, detail.attempts)}
              />
            </>
          ) : null}
        </Modal>
      ) : null}
    </section>
  );
}
