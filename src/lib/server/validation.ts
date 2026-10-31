import { z } from 'zod';
import { questions } from '../../content/questions';

export const stableId = z.string().uuid();
export const questionId = z
  .string()
  .max(100)
  .refine((id) => questions.some((q) => q.id === id), 'Question not found.');
export const attemptInput = z
  .object({
    id: stableId,
    sessionId: stableId,
    questionId,
    optionId: z.string().max(20),
    nextIndex: z.number().int().min(0).max(100).optional(),
  })
  .strict();
export const appearanceInput = z
  .object({
    presetId: z
      .string()
      .min(1)
      .max(50)
      .regex(/^[a-z0-9-]+$/),
    accent: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Choose a valid accent color.'),
    secondary: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Choose a valid secondary color.'),
    style: z.enum(['gradient', 'solid']),
  })
  .strict();
export const bookmarkInput = z.object({ questionId, bookmarked: z.boolean() }).strict();
export const reportInput = z
  .object({
    questionId,
    reason: z
      .string()
      .trim()
      .min(5, 'Please describe the issue in at least 5 characters.')
      .max(1500),
  })
  .strict();
const optionalDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .refine((value) => {
    const date = new Date(`${value}T00:00:00Z`);
    return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
  }, 'Please enter a valid date.')
  .nullable();
export const settingsInput = z
  .object({
    dailyGoal: z.number().int().min(1).max(100),
    mtapDate: optionalDate,
    mockDate: optionalDate,
  })
  .strict();
export const practiceInput = z
  .object({
    id: stableId,
    replaceSessionId: stableId.nullable().optional(),
    questionIds: z
      .array(questionId)
      .min(1)
      .max(100)
      .refine(
        (ids) => new Set(ids).size === ids.length,
        'A session cannot contain duplicate questions.',
      ),
    index: z.number().int().min(0).max(100),
    // Accepted for the UI contract; saved answers are always reconstructed from server-scored attempts.
    answers: z.record(z.string(), z.string()).default({}),
  })
  .strict()
  .refine((value) => value.index <= value.questionIds.length, 'Session position is out of range.');
export const clearPracticeInput = z.object({ sessionId: stableId }).strict();

export function scoreAnswer(id: string, option: string) {
  const question = questions.find((q) => q.id === id);
  if (!question) return null;
  if (!question.options.some((o) => o.id === option)) return null;
  return { correct: question.correctOptionId === option, questionVersion: question.version };
}
