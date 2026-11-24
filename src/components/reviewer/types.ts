import { subjects } from '@/content/questions';
import { type AttemptRecord, type StudyActivity } from '@/lib/progress';
import type { Appearance } from '@/lib/appearance';
export type View =
  'dashboard' | 'subjects' | 'review' | 'progress' | 'library' | 'settings' | 'practice';
export type PracticeSession = {
  id: string;
  questionIds: string[];
  index: number;
  answers: Record<string, string>;
};
export type Workspace = {
  user: {
    id: string;
    name: string;
    email: string;
  };
  attempts: AttemptRecord[];
  activity?: StudyActivity;
  bookmarks: string[];
  settings: {
    dailyGoal: number;
    mtapDate: string | null;
    mockDate: string | null;
  };
  activeSession: PracticeSession | null;
  appearance: Appearance;
};
