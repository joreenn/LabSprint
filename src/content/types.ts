export interface Subject {
  id: string;
  name: string;
  shortName: string;
  description: string;
  color: string;
  topics: string[];
}

export interface Question {
  id: string;
  subjectId: string;
  topic: string;
  kind: 'recall' | 'case';
  difficulty: 'Foundation' | 'Application';
  stem: string;
  options: { id: string; text: string; rationale: string }[];
  correctOptionId: string;
  takeaway: string;
  source: { title: string; edition?: string; pdfPage: number; chapter: string };
  version: number;
}
