'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  PracticeOutbox,
  type OutboxState,
  type PracticeTask,
  type SaveResult,
} from '@/lib/practice-outbox';
import { api } from './api';

const empty: OutboxState = { tasks: [], saving: false, error: '', conflict: false, durable: true };
export function usePracticeOutbox(
  userId: string | undefined,
  onSaved: (task: PracticeTask, result: SaveResult | null) => void,
) {
  const box = useRef<PracticeOutbox | null>(null);
  const callback = useRef(onSaved);
  callback.current = onSaved;
  const [state, setState] = useState<OutboxState>(empty);
  useEffect(() => {
    if (!userId) {
      setState(empty);
      box.current = null;
      return;
    }
    let storage: Storage | null = null;
    try {
      storage = localStorage;
    } catch {}
    let alive = true;
    const queue = new PracticeOutbox(
      userId,
      storage,
      async (task) => {
        if (task.kind === 'answer') {
          const { kind: _kind, ...body } = task;
          return api<SaveResult>('/api/attempts', 'POST', body);
        }
        await api('/api/practice-session', 'DELETE', { sessionId: task.sessionId });
        return null;
      },
      (next) => {
        if (alive) setState(next);
      },
      (task, result) => {
        if (alive) callback.current(task, result);
      },
    );
    box.current = queue;
    setState({ ...queue.state });
    void queue.flush();
    const online = () => {
      void queue.flush();
    };
    window.addEventListener('online', online);
    const beforeUnload = (event: BeforeUnloadEvent) => {
      if (!queue.state.durable && queue.state.tasks.length) {
        event.preventDefault();
        event.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', beforeUnload);
    return () => {
      alive = false;
      queue.dispose();
      window.removeEventListener('online', online);
      window.removeEventListener('beforeunload', beforeUnload);
      if (box.current === queue) box.current = null;
    };
  }, [userId]);
  const enqueue = useCallback((task: PracticeTask) => box.current?.enqueue(task), []);
  const flush = useCallback(() => box.current?.flush() ?? Promise.resolve(true), []);
  const clear = useCallback(() => box.current?.clear(), []);
  const pending = useCallback(() => box.current?.state.tasks || [], []);
  return { ...state, enqueue, flush, clear, pending };
}
