import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PracticeOutbox, type PracticeTask } from '../src/lib/practice-outbox';

const task = (id: string): PracticeTask => ({
  kind: 'answer',
  id,
  sessionId: 'session',
  questionId: id,
  optionId: 'A',
  nextIndex: 1,
});
function storage() {
  const values = new Map<string, string>();
  return {
    getItem: (k: string) => values.get(k) ?? null,
    setItem: (k: string, v: string) => {
      values.set(k, v);
    },
    removeItem: (k: string) => {
      values.delete(k);
    },
  };
}
test('failed answers survive a reload and retry in order with stable IDs', async () => {
  const disk = storage();
  const first = new PracticeOutbox(
    'alice',
    disk,
    async () => {
      throw new Error('Offline');
    },
    () => {},
    () => {},
  );
  first.enqueue(task('one'));
  first.enqueue(task('two'));
  assert.equal(await first.flush(), false);
  assert.equal(first.state.tasks.length, 2);
  first.dispose();
  const sent: string[] = [];
  const restored = new PracticeOutbox(
    'alice',
    disk,
    async (t) => {
      sent.push(t.id);
      return null;
    },
    () => {},
    () => {},
  );
  assert.equal(await restored.flush(), true);
  assert.deepEqual(sent, ['one', 'two']);
  assert.equal(restored.state.tasks.length, 0);
  assert.equal(
    new PracticeOutbox(
      'bob',
      disk,
      async () => null,
      () => {},
      () => {},
    ).state.tasks.length,
    0,
  );
});
test('finishing cannot overtake an in-flight answer and rapid flushes never duplicate sends', async () => {
  const sent: string[] = [];
  let release!: () => void;
  const barrier = new Promise<void>((resolve) => {
    release = resolve;
  });
  const queue = new PracticeOutbox(
    'alice',
    storage(),
    async (t) => {
      if (t.id === 'one') await barrier;
      sent.push(t.id);
      return null;
    },
    () => {},
    () => {},
  );
  queue.enqueue(task('one'));
  queue.enqueue({ kind: 'finish', id: 'finish', sessionId: 'session' });
  const flush = queue.flush();
  assert.deepEqual(sent, []);
  release();
  await Promise.all([flush, queue.flush()]);
  assert.deepEqual(sent, ['one', 'finish']);
});
