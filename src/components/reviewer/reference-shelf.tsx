import { BookOpen, ChevronDown } from 'lucide-react';
import { questions, subjects } from '@/content/questions';
import { editorialStatus } from '@/content/editorial-review';
import { topicCoverage } from '@/content/validation';
import { expansionCoverage } from '@/content/coverage';

export function ReferenceShelf() {
  const sources = [
    ...new Set(questions.map((q) => `${q.source.title}|${q.source.edition || ''}`)),
  ].map((key) => {
    const [title, edition] = key.split('|');
    const items = questions.filter(
      (q) => q.source.title === title && (q.source.edition || '') === edition,
    );
    return {
      title,
      edition,
      count: items.length,
      subjects: [
        ...new Set(items.map((q) => subjects.find((s) => s.id === q.subjectId)?.shortName)),
      ],
    };
  });
  const reviewed = questions.filter((question) => editorialStatus(question) === 'approved').length;
  const gaps = topicCoverage(questions, subjects).filter((row) => row.count === 0);
  return (
    <details className="panel reference-shelf">
      <summary>
        <BookOpen size={20} />
        <div>
          <strong>Your reference shelf</strong>
          <span>{sources.length} checked sources · See books and coverage</span>
        </div>
        <ChevronDown size={17} />
      </summary>
      <p>
        Original practice questions with checked source references. {reviewed} of {questions.length}{' '}
        current question versions have independent academic approval recorded. Source checks alone
        are not independent MLS review.
      </p>
      {gaps.length ? (
        <div className="quiet-note">
          <p>
            <strong>Content still needed:</strong>{' '}
            {gaps.map((row) => `${row.topic} (0 questions)`).join(', ')}. These topics are not
            covered by the current bank.
          </p>
        </div>
      ) : null}
      <div className="reference-sources">
        {sources.map((source) => (
          <article key={source.title + source.edition}>
            <h3>{source.title}</h3>
            <p>{source.edition}</p>
            <span>
              {source.count} {source.count === 1 ? 'question' : 'questions'} ·{' '}
              {source.subjects.join(', ')}
            </span>
          </article>
        ))}
      </div>
      <div className="reference-requested">
        <strong>Growing toward 2,000 questions per subject</strong>
        <p>
          This is an expansion target, not the current bank size or full syllabus coverage. New
          questions are source-checked original practice items; independent academic review is still
          needed. No book PDFs or publisher question banks are included.
        </p>
        <ul>
          {expansionCoverage(questions, subjects).map((row) => (
            <li key={row.subjectId}>
              {row.subject}: {row.available.toLocaleString()} / {row.target.toLocaleString()}{' '}
              available
              {' · '}
              {row.sources} references{' · '}
              {row.remaining.toLocaleString()} remaining
            </li>
          ))}
        </ul>
      </div>
    </details>
  );
}
