import { questions } from '@/content/questions';
import type { AttemptRecord } from './progress';
import { firstAttempts, questionMap } from './progress';

export type PracticeConfig = {
  subjectId?: string;
  topic?: string;
  ids?: string[];
  label?: string;
};

export function eligibleQuestions(config: PracticeConfig, kind = 'mixed') {
  return questions.filter(
    (q) =>
      (!config.subjectId || q.subjectId === config.subjectId) &&
      (!config.topic || q.topic === config.topic) &&
      (!config.ids || config.ids.includes(q.id)) &&
      (kind === 'mixed' || q.kind === kind),
  );
}

export function practiceSize(poolLength: number, selected: number | 'all') {
  const available = Math.min(100, Math.max(0, poolLength));
  const choice = selected !== 'all' && selected <= available ? selected : 'all';
  return {
    choice,
    count: choice === 'all' ? available : choice,
    choices: [5, 10, 20].filter((size) => size <= available),
  };
}

type SessionAnswers = { id: string; questionIds: string[]; answers: Record<string, string> };

export function sessionRecap(session: SessionAnswers, attempts: AttemptRecord[]) {
  const first = new Map(firstAttempts(attempts).map((a) => [a.questionId, a]));
  return [...new Set(session.questionIds)].flatMap((id) => {
    const question = questionMap.get(id);
    const recorded = attempts.find((a) => a.sessionId === session.id && a.questionId === id);
    const chosen = recorded?.optionId || session.answers[id];
    if (!question || (!recorded && !question.options.some((option) => option.id === chosen)))
      return [];
    const initial = first.get(id);
    return [
      {
        question,
        chosen,
        // Saved results are authoritative, even if a later content version changes the key.
        correct: recorded ? recorded.correct : chosen === question.correctOptionId,
        attemptKind: (initial && initial.sessionId !== session.id ? 'Repeat' : 'First attempt') as
          'Repeat' | 'First attempt',
        recorded: !!recorded,
        savedVersion: recorded?.questionVersion,
        explanationVersionChanged:
          recorded?.questionVersion !== undefined && recorded.questionVersion !== question.version,
        savedChoiceUnavailable:
          !!recorded && !question.options.some((option) => option.id === chosen),
      },
    ];
  });
}

export function newPracticeIds(attempts: AttemptRecord[], session: SessionAnswers) {
  const explored = new Set([...attempts.map((a) => a.questionId), ...Object.keys(session.answers)]);
  return questions.filter((q) => !explored.has(q.id)).map((q) => q.id);
}
