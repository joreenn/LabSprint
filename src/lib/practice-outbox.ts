import type { AttemptRecord } from './progress';
import type { PracticeSession } from '@/components/reviewer/types';

export type AnswerTask = {
  kind: 'answer';
  id: string;
  sessionId: string;
  questionId: string;
  optionId: string;
  nextIndex: number;
};
export type FinishTask = { kind: 'finish'; id: string; sessionId: string };
export type PracticeTask = AnswerTask | FinishTask;
export type SaveResult = { attempt: AttemptRecord; activeSession: PracticeSession | null };
export type OutboxState = {
  tasks: PracticeTask[];
  saving: boolean;
  error: string;
  conflict: boolean;
  durable: boolean;
};
type StorageLike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

// Account-scoped durable retry queue. An answer is acknowledged only after the
// server returns its canonical, idempotent result. Navigation never waits on it.
export class PracticeOutbox {
  state: OutboxState = { tasks: [], saving: false, error: '', conflict: false, durable: true };
  private flight: Promise<boolean> | null = null;
  private disposed = false;
  private key: string;
  constructor(
    userId: string,
    private storage: StorageLike | null,
    private send: (task: PracticeTask) => Promise<SaveResult | null>,
    private notify: (state: OutboxState) => void,
    private saved: (task: PracticeTask, result: SaveResult | null) => void,
  ) {
    this.key = `labsprint-outbox-v1:${userId}`;
    try {
      const stored = JSON.parse(storage?.getItem(this.key) || '[]');
      if (Array.isArray(stored)) this.state.tasks = stored.filter(validTask).slice(0, 102);
      this.state.durable = !!storage;
    } catch {
      this.state.durable = false;
    }
  }
  private publish() {
    this.notify({ ...this.state, tasks: [...this.state.tasks] });
  }
  private persist() {
    try {
      if (!this.storage) throw new Error('Storage unavailable');
      if (this.state.tasks.length) this.storage.setItem(this.key, JSON.stringify(this.state.tasks));
      else this.storage.removeItem(this.key);
    } catch {
      this.state.durable = false;
    }
    this.publish();
  }
  enqueue(task: PracticeTask) {
    if (this.state.tasks.some((t) => t.id === task.id)) return;
    this.state.tasks.push(task);
    this.persist();
    void this.flush();
  }
  flush(): Promise<boolean> {
    if (this.flight) return this.flight;
    this.flight = this.drain().finally(() => {
      this.flight = null;
    });
    return this.flight;
  }
  private async drain() {
    this.state.saving = true;
    this.state.error = '';
    this.state.conflict = false;
    this.publish();
    try {
      while (this.state.tasks.length && !this.disposed) {
        const task = this.state.tasks[0];
        const result = await this.send(task);
        this.state.tasks.shift();
        this.persist();
        if (!this.disposed) this.saved(task, result);
      }
      return this.state.tasks.length === 0;
    } catch (error) {
      this.state.error = error instanceof Error ? error.message : 'Could not reach LabSprint.';
      this.state.conflict =
        !!error && typeof error === 'object' && 'status' in error && error.status === 409;
      return false;
    } finally {
      this.state.saving = false;
      this.publish();
    }
  }
  clear() {
    this.state.tasks = [];
    this.state.error = '';
    this.state.conflict = false;
    this.persist();
  }
  dispose() {
    this.disposed = true;
  }
}

function validTask(value: unknown): value is PracticeTask {
  if (!value || typeof value !== 'object') return false;
  const t = value as Record<string, unknown>;
  if (typeof t.id !== 'string' || typeof t.sessionId !== 'string') return false;
  return (
    t.kind === 'finish' ||
    (t.kind === 'answer' &&
      typeof t.questionId === 'string' &&
      typeof t.optionId === 'string' &&
      Number.isInteger(t.nextIndex))
  );
}
