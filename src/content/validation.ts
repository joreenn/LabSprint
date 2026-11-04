import type { Question, Subject } from './types';

/** Structural validation only: this cannot verify medical accuracy or source fidelity. */
export function validateQuestionBank(bank: readonly Question[], catalog: readonly Subject[]) {
  const errors: string[] = [];
  const ids = new Set<string>();
  const stems = new Map<string, string>();
  for (const q of bank) {
    const label = q.id || '(missing question ID)';
    if (!q.id?.trim()) errors.push(`${label}: question ID is required`);
    if (ids.has(q.id)) errors.push(`${label}: duplicate question ID`);
    ids.add(q.id);
    const subject = catalog.find((s) => s.id === q.subjectId);
    if (!subject) errors.push(`${label}: unknown subject`);
    else if (!subject.topics.includes(q.topic)) errors.push(`${label}: unknown topic`);
    if (!q.stem?.trim() || !q.takeaway?.trim())
      errors.push(`${label}: stem and takeaway are required`);
    const normalizedStem = q.stem
      ?.toLowerCase()
      .replace(/[^\p{L}\p{N}]+/gu, ' ')
      .trim();
    if (normalizedStem) {
      if (stems.has(normalizedStem))
        errors.push(`${label}: duplicate stem with ${stems.get(normalizedStem)}`);
      else stems.set(normalizedStem, label);
    }
    if (!Array.isArray(q.options) || q.options.length !== 4) {
      errors.push(`${label}: exactly four choices are required`);
    }
    const options = Array.isArray(q.options) ? q.options : [];
    if (new Set(options.map((o) => o.text?.trim().toLowerCase())).size !== options.length)
      errors.push(`${label}: duplicate choice text`);
    if (new Set(options.map((o) => o.id)).size !== options.length)
      errors.push(`${label}: duplicate option ID`);
    if (!q.correctOptionId || options.filter((o) => o.id === q.correctOptionId).length !== 1)
      errors.push(`${label}: answer key must identify exactly one choice`);
    for (const option of options) {
      if (!option.id?.trim() || !option.text?.trim())
        errors.push(`${label}: option ID and text are required`);
      if (!option.rationale?.trim())
        errors.push(`${label}: explanation missing for option ${option.id}`);
    }
    if (!Number.isInteger(q.version) || q.version < 1)
      errors.push(`${label}: a positive integer version is required`);
    if (
      !q.source?.title?.trim() ||
      !q.source?.chapter?.trim() ||
      !Number.isInteger(q.source?.pdfPage) ||
      q.source.pdfPage < 1
    )
      errors.push(`${label}: reference title, chapter, and PDF page are required`);
  }
  return errors;
}

export function topicCoverage(bank: readonly Question[], catalog: readonly Subject[]) {
  return catalog.flatMap((subject) =>
    subject.topics.map((topic) => ({
      subjectId: subject.id,
      subject: subject.name,
      topic,
      count: bank.filter((q) => q.subjectId === subject.id && q.topic === topic).length,
    })),
  );
}
