import { CircleHelp, TrendingUp } from 'lucide-react';
import { CORRECTION_EXPLANATION, LIMITED_PRACTICE_EXPLANATION, progressFor } from '@/lib/progress';

export function ProgressFacts({ stats: p }: { stats: ReturnType<typeof progressFor> }) {
  return (
    <div className="progress-facts">
      <div className="baseline-fact">
        <span>First-attempt accuracy</span>
        <strong>{p.accuracy === null ? 'Unavailable' : `${p.accuracy}%`}</strong>
        <span>{p.seen ? `${p.firstCorrect}/${p.seen} correct` : 'No first attempts yet'}</span>
      </div>
      <div className="coverage-fact">
        {p.seen} of {p.total} {p.total === 1 ? 'question' : 'questions'} explored
      </div>
      {p.limitedData ? (
        <p className="limited-data">
          <CircleHelp size={15} />
          <span>Limited practice data. {LIMITED_PRACTICE_EXPLANATION}</span>
        </p>
      ) : null}
      {p.corrected ? (
        <p className="correction-fact">
          <TrendingUp size={15} />
          <span>
            Previously missed → corrected: {p.corrected}. {CORRECTION_EXPLANATION}
          </span>
        </p>
      ) : null}
    </div>
  );
}

export function ProgressGuide({ stats: p }: { stats: ReturnType<typeof progressFor> }) {
  return (
    <div className="progress-guide">
      {p.limitedData ? (
        <p>
          <CircleHelp size={17} />
          <span>Limited practice data. {LIMITED_PRACTICE_EXPLANATION}</span>
        </p>
      ) : null}
      <p>
        <TrendingUp size={17} />
        <span>
          Previously missed → corrected: <strong>{p.corrected}</strong>. {CORRECTION_EXPLANATION}
        </span>
      </p>
      <p>
        First-attempt accuracy keeps your initial answers. Coverage counts unique questions in this
        starter bank; repeats do not increase it. These signals do not measure full syllabus
        coverage or exam readiness.
      </p>
    </div>
  );
}
