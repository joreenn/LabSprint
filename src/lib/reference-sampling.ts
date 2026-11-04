import type { Question } from '@/content/types';
import { sourceIdentity } from '@/content/coverage';

function shuffle<T>(items: readonly T[], random: () => number): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/** Mix eligible subjects and source books without duplicates or relaxing caller filters.
 * A short session cannot guarantee every reference. Exhausted sources never repeat an item.
 */
export function referenceMixedSample(
  pool: readonly Question[],
  count: number,
  random: () => number = Math.random,
): Question[] {
  const subjects = new Map<string, Map<string, Question[]>>();
  for (const q of new Map(pool.map((q) => [q.id, q])).values()) {
    const sources = subjects.get(q.subjectId) || new Map<string, Question[]>();
    const key = sourceIdentity(q);
    sources.set(key, [...(sources.get(key) || []), q]);
    subjects.set(q.subjectId, sources);
  }
  const queues = shuffle([...subjects.values()], random).map((sources) => {
    const buckets = shuffle([...sources.values()], random).map((items) => shuffle(items, random));
    const queue: Question[] = [];
    while (buckets.some((bucket) => bucket.length)) {
      for (const bucket of buckets) {
        const next = bucket.pop();
        if (next) queue.push(next);
      }
    }
    return queue;
  });
  const result: Question[] = [];
  const limit = Math.max(0, Number.isFinite(count) ? Math.floor(count) : 0);
  while (result.length < limit && queues.some((queue) => queue.length)) {
    for (const queue of queues) {
      if (result.length >= limit) break;
      const next = queue.shift();
      if (next) result.push(next);
    }
  }
  return result;
}
