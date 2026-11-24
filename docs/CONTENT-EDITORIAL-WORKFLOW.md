# Content review and expansion workflow

## Current state (2026-11-24)

The bank has 498 original questions across 48 listed topics and seven subjects. Independent MLS approval is not recorded for any current question version. This is separate from the completed source checks in the source-audit documents. The app displays this distinction in the reference shelf. Medtech Laws has zero questions; do not infer legal or complete syllabus coverage from its subject label.

## Expansion order

1. **Medtech Laws:** obtain current Philippine primary materials and a qualified reviewer before writing or publishing questions. Verify amendments and current PRC/Board issuances; a historical act alone may not establish the current rule. Record exact section, official URL, access date and applicability. No new legal questions are invented in this release.
2. **Review the thin-topic additions:** six Liver function, six Renal physiology, six Molecular diagnostics and six Antimicrobial susceptibility questions were source-checked; each topic now has seven questions. Have a qualified independent reviewer check the stem, key, every distractor, rationale and page citation.
3. **Remaining topics:** use `npm run content:check` for actual subject totals and `topicCoverage(questions, subjects)` in `src/content/validation.ts` for the current topic inventory; prioritize low counts and unresolved reports, then expand source diversity. The 2,000-per-subject figure is only a backlog target.

## Record an independent review

For each question/version, add a documented entry to `src/content/editorial-review.ts`: stable ID, exact version, reviewer attribution agreed with that person, date, outcome and evidence location. Do not enter approvals on behalf of a reviewer or infer approval from an automated check. Store private reviewer details outside the repository. Only version-matched approvals count in the UI; increasing a question version requires another review. A current `changes-requested` entry fails the release content check. Historical approvals remain for traceability.

Keep existing question IDs and option IDs stable. Update the version for substantive academic changes, retain references, and run continuation tests so existing answers/bookmarks remain associated. Recaps use recorded scores and disclose explanation-version differences; they must not regrade old answers. Run content validation and tests before release.

## Triage reported questions

The existing authenticated report form stores question ID, reason and submission date, limited to the reporting account; this release retains it. For maintainers, `npm run content:reports` exports a private, paged review queue to the ignored `tmp/content-reports.ndjson`, without account email addresses or credentials. It requires the database environment for the intended deployment; it does not change report status, answers or content. Do not share the export publicly: report text is user supplied and may contain personal details. Do not run the export against production simply to test it.

The legacy report schema does not store the question version separately. The export deliberately says `reportedVersion: null`; use the report date and Git history to find the applicable version rather than claiming today's version was reported. Record each issue's report ID, applicable question/version, decision and evidence in a private editorial tracker. Confirm the fix against the actual source; if ambiguous, request qualified review. Mark resolution in that tracker only after the corrected version passes checks. A public admin interface, reviewer roles and automatic report-resolution notifications remain future work; no such access is introduced here.

## Release gate

Structural checks catch duplicate IDs/stems, invalid keys, missing explanations/references, invalid versions and incomplete editorial entries. They cannot establish medical accuracy, legal currency, independent approval, complete syllabus coverage or exam readiness. Until qualified review is completed, describe the bank as source-checked practice with independent review pending.
