'use client';
import {
  ArrowUpRight,
  BarChart3,
  Beaker,
  BookMarked,
  BookOpen,
  Bookmark,
  Dna,
  Droplets,
  Flame,
  FlaskConical,
  LayoutDashboard,
  Microscope,
  Search,
  type LucideIcon,
} from 'lucide-react';
import { questions, subjects } from '@/content/questions';
import type { Question, Subject } from '@/content/types';
import { progressFor, type AttemptRecord } from '@/lib/progress';
import type { View } from './types';
import { Practice } from './practice';
export const icons: LucideIcon[] = [
  FlaskConical,
  Droplets,
  Beaker,
  Microscope,
  Dna,
  Flame,
  BookOpen,
];
export const nav: {
  id: View;
  label: string;
  icon: LucideIcon;
}[] = [
  { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
  { id: 'subjects', label: 'My subjects', icon: BookOpen },
  { id: 'review', label: 'Review queue', icon: BookMarked },
  { id: 'progress', label: 'My progress', icon: BarChart3 },
  { id: 'library', label: 'Question library', icon: Search },
];
export const fmt = (n: number | null) => (n === null ? '—' : `${n}%`);
export function Brand() {
  return (
    <div className="brand">
      <span className="brand-mark">
        <FlaskConical size={23} />
      </span>
      <span>
        lab<span className="brand-light">sprint</span>
        <span className="brand-dot">.</span>
      </span>
    </div>
  );
}
export function SubjectIcon({ subject, size = 23 }: { subject: Subject; size?: number }) {
  const Icon =
    icons[
      Math.max(
        0,
        subjects.findIndex((s) => s.id === subject.id),
      )
    ];
  return (
    <span className={`subject-icon tone-${subjects.findIndex((s) => s.id === subject.id)}`}>
      <Icon size={size} />
    </span>
  );
}
export function PageHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="page-heading">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action}
    </div>
  );
}
export function Stat({
  icon: Icon,
  label,
  value,
  suffix,
  note,
  color,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  suffix?: string;
  note: string;
  color: string;
  onClick?: () => void;
}) {
  const content = (
    <>
      <div className="stat-label">
        <span className={`stat-icon ${color}`}>
          <Icon size={17} />
        </span>
        {label}
      </div>
      <div className="stat-value">
        {value}
        <span>{suffix}</span>
      </div>
      <p>{note}</p>
    </>
  );
  return onClick ? (
    <button className="stat-card clickable" onClick={onClick}>
      {content}
    </button>
  ) : (
    <section className="stat-card">{content}</section>
  );
}
export function SubjectCard({
  subject: s,
  attempts,
  onClick,
}: {
  subject: Subject;
  attempts: AttemptRecord[];
  onClick: () => void;
}) {
  const p = progressFor(attempts, s.id);
  return (
    <button className="subject-card" onClick={onClick}>
      <div className="subject-card-top">
        <SubjectIcon subject={s} />
        <ArrowUpRight className="card-arrow" size={18} />
      </div>
      <h3>{s.name}</h3>
      <p>
        {s.topics.length} topics · {p.total} questions
      </p>
      <div className="subject-progress">
        <span>{p.seen ? `${p.seen} explored` : 'Ready when you are'}</span>
        <strong>{fmt(p.accuracy)}</strong>
      </div>
      <div className={`progress-track tone-track-${subjects.findIndex((x) => x.id === s.id)}`}>
        <span style={{ width: `${p.total ? (p.seen / p.total) * 100 : 0}%` }} />
      </div>
    </button>
  );
}
export function QuestionRow({
  question: q,
  marked,
  onBookmark,
  onPractice,
}: {
  question: Question;
  marked: boolean;
  onBookmark: () => void;
  onPractice: () => void;
}) {
  const s = subjects.find((x) => x.id === q.subjectId)!;
  return (
    <div className="question-row">
      <SubjectIcon subject={s} size={20} />
      <button className="question-row-content" onClick={onPractice}>
        <small>
          {s.shortName} <span>·</span> {q.topic}
        </small>
        <strong>{q.stem}</strong>
        <span>
          {q.kind === 'case' ? 'Case-based' : 'Recall'} · {q.difficulty}
        </span>
      </button>
      <button
        className={`icon-button ${marked ? 'bookmarked' : ''}`}
        aria-label={marked ? 'Remove bookmark' : 'Bookmark question'}
        onClick={onBookmark}
      >
        <Bookmark size={20} fill={marked ? 'currentColor' : 'none'} />
      </button>
      <button className="icon-button" aria-label="Practice this question" onClick={onPractice}>
        <ArrowUpRight size={20} />
      </button>
    </div>
  );
}
export function Empty({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="empty-state">
      <span className="empty-icon">
        <Icon size={31} />
      </span>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
}
