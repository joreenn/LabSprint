import { questions, subjects } from '../src/content/questions';
import { topicCoverage, validateQuestionBank } from '../src/content/validation';

const errors = validateQuestionBank(questions, subjects);
if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else {
  const topics = topicCoverage(questions, subjects);
  console.log(
    `Validated ${questions.length} questions across ${subjects.length} subjects and ${topics.length} listed topics.`,
  );
  console.log(
    `${topics.filter((t) => t.count === 0).length} topics have no questions; ${topics.filter((t) => t.count === 1).length} have one question.`,
  );
  console.log('Structural checks do not establish academic accuracy or full syllabus coverage.');
}
