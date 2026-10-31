import { BookOpen, ChevronDown } from 'lucide-react';
import { questions, subjects } from '@/content/questions';

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
        Original questions with a checked reference on every explanation. The shelf grows as more
        material is reviewed.
      </p>
      <div className="reference-sources">
        {sources.map((source) => (
          <article key={source.title + source.edition}>
            <h3>{source.title}</h3>
            <p>{source.edition}</p>
            <span>
              {source.count} questions · {source.subjects.join(', ')}
            </span>
          </article>
        ))}
      </div>
      <div className="reference-requested">
        <strong>Requested for the next reference review</strong>
        <p>
          Strasinger’s urinalysis/body fluids text and Rodak’s hematology text are awaiting supplied
          reference files. They are not yet used for question citations.
        </p>
      </div>
    </details>
  );
}
