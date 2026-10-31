export interface Attempt {
  id: string;
  sessionId: string;
  questionId: string;
  optionId: string;
  correct: boolean;
  questionVersion?: number;
  createdAt: string;
}

export interface PracticeSession {
  id: string;
  questionIds: string[];
  index: number;
  answers: Record<string, string>;
}

export interface StudySettings {
  dailyGoal: number;
  mtapDate: string | null;
  mockDate: string | null;
}

export type { Appearance } from '../appearance';
import type { Appearance } from '../appearance';

export interface AnswerSubmission {
  attempt: Attempt;
  activeSession: PracticeSession | null;
}

export interface QuestionReport {
  id: string;
  questionId: string;
  reason: string;
  createdAt: string;
}

export interface Workspace {
  user: { id: string; name: string; email: string };
  attempts: Attempt[];
  bookmarks: string[];
  reports: QuestionReport[];
  settings: StudySettings;
  appearance: Appearance;
  activeSession: PracticeSession | null;
}
