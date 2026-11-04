# Starter-bank coverage and expansion backlog

**Updated inventory:** [1 November batch 1](CONTENT-EXPANSION-2026-11-01.md) adds 310 source-checked original items for **366 total** and integrates the supplied Rodak and Strasinger books. Other body fluids is no longer empty. The tables below remain the historical 56-item starting snapshot; use `npm run content:check` for the live counts and remaining 2,000-per-subject targets.

This inventory describes the available practice bank, not full MTAP, mockboard, or board-exam syllabus coverage. It does not establish exam readiness. Counts below were measured from `questions` and `subjects` on 31 October 2026: **56 questions, 7 subject groups, 42 listed topics; 2 topics have no questions and 27 have one question.** The app calculates its live counts from the bank; this document is an editorial snapshot.

## Historical starter priorities (updated status below)

1. **Fill the two empty listed topics:** Other body fluids; Philippine Medtech Laws. Supply authorized reference material and obtain qualified review before drafting or publishing. Medtech law content needs current primary-source verification as well as reviewer approval. Empty topics remain visible as zero available questions.
2. **Broaden the 27 one-question topics** listed below. A single item provides a very narrow practice sample. Add distinct learning objectives and meaningful recall/case variety rather than superficial rewrites. No particular item count is a validated mastery standard.
3. **Add depth to the 2–3-question topics** after reviewing a subject blueprint against the intended exam syllabus. The catalog's existing topic names are not evidence that all required topics are present.
4. **Review the subject blueprint itself:** map authoritative syllabi and authorized references, identify omitted topics, and record reviewer sign-off. The original checkpoint awaited Strasinger and Rodak. Both are now integrated in the first expansion batch with source audits; comprehensive blueprint mapping and qualified review remain pending.

Current next priorities are the still-empty Philippine Medtech Laws topic (verified current primary sources needed), the four remaining one-question topics, and thin histopathology/virology coverage. See the current batch inventory rather than interpreting the historical counts below as live totals.

## Historical measured topic inventory

| Subject                                              | Topic                        | Available questions |
| ---------------------------------------------------- | ---------------------------- | ------------------: |
| Clinical Chemistry                                   | Instrumentation              |                   1 |
| Clinical Chemistry                                   | Acid-base and electrolytes   |                   2 |
| Clinical Chemistry                                   | Carbohydrates                |                   1 |
| Clinical Chemistry                                   | Renal chemistry              |                   1 |
| Clinical Chemistry                                   | Proteins                     |                   1 |
| Clinical Chemistry                                   | Enzymes                      |                   1 |
| Clinical Chemistry                                   | Endocrinology                |                   1 |
| Immunoserology and Blood Banking                     | Immunoglobulins              |                   1 |
| Immunoserology and Blood Banking                     | Hypersensitivity             |                   1 |
| Immunoserology and Blood Banking                     | Serologic methods            |                   3 |
| Immunoserology and Blood Banking                     | Antiglobulin testing         |                   1 |
| Immunoserology and Blood Banking                     | Blood groups                 |                   1 |
| Immunoserology and Blood Banking                     | Antibody identification      |                   1 |
| Analysis of Urine and Body Fluids                    | Urine chemistry              |                   3 |
| Analysis of Urine and Body Fluids                    | Urine microscopy             |                   2 |
| Analysis of Urine and Body Fluids                    | Cerebrospinal fluid          |                   1 |
| Analysis of Urine and Body Fluids                    | Synovial fluid               |                   1 |
| Analysis of Urine and Body Fluids                    | Serous fluids                |                   1 |
| Analysis of Urine and Body Fluids                    | Other body fluids            |                   0 |
| Microbiology                                         | Bacteriology                 |                   3 |
| Microbiology                                         | Mycology                     |                   2 |
| Microbiology                                         | Virology                     |                   1 |
| Microbiology                                         | Specimen collection          |                   1 |
| Microbiology                                         | Antimicrobial susceptibility |                   1 |
| Parasitology                                         | Intestinal protozoa          |                   2 |
| Parasitology                                         | Nematodes                    |                   1 |
| Parasitology                                         | Trematodes                   |                   1 |
| Parasitology                                         | Cestodes                     |                   1 |
| Parasitology                                         | Blood parasites              |                   1 |
| Parasitology                                         | Diagnostic methods           |                   2 |
| Hematology                                           | RBC indices                  |                   1 |
| Hematology                                           | Anemias                      |                   2 |
| Hematology                                           | Leukocyte disorders          |                   1 |
| Hematology                                           | Hemostasis                   |                   2 |
| Hematology                                           | Specimen quality             |                   1 |
| Hematology                                           | Platelets                    |                   1 |
| Histopathology, Laboratory Management & Medtech Laws | Quality assessment           |                   2 |
| Histopathology, Laboratory Management & Medtech Laws | Laboratory statistics        |                   1 |
| Histopathology, Laboratory Management & Medtech Laws | Management                   |                   2 |
| Histopathology, Laboratory Management & Medtech Laws | Standards and calibration    |                   1 |
| Histopathology, Laboratory Management & Medtech Laws | Histopathology               |                   2 |
| Histopathology, Laboratory Management & Medtech Laws | Philippine Medtech Laws      |                   0 |

## Safe content-change workflow

- Keep all existing question IDs stable. Never reuse an ID for a different learning objective. Add genuinely new items with new IDs.
- Keep each item's positive integer version and source metadata. Increment the version for substantive edits and document the editorial change. Existing correctness flags are recorded with attempts; do not recompute historical results from a changed answer key.
- Preserve subject/topic identifiers where possible so existing topic history remains interpretable. Renaming or regrouping topics requires a documented mapping and a migration plan rather than silently clearing progress.
- Do not delete questions with learner history merely to replace them. A future retirement mechanism should preserve historical records, references, and bookmarks. No retirement or destructive migration is part of this update.
- For each addition, verify the stem, one correct answer, every distractor explanation, takeaway, reference title/chapter/PDF page, and version against authorized source material. Have a qualified reviewer check medical and exam relevance. A passing structural check is not that review.
- Run `npm run content:check` and `npm test` before accepting an update. The validator catches duplicate IDs/options, invalid answer keys, missing explanations, unknown topics, missing source metadata, and invalid versions. It cannot verify the truth of a question or citation.

## Progress definitions

`progressFor` in `src/lib/progress.ts` is the shared source for the following signals:

- **First-attempt accuracy:** correct first attempts / unique available questions attempted. It remains unchanged after retries. No attempts yields unavailable accuracy, not 0%.
- **Bank coverage:** unique available questions attempted / available questions in the displayed bank, subject, or topic. Repeats never increase it. An empty question pool has unavailable percentage coverage and a count of 0 available questions.
- **Repeat accuracy:** correct repeat attempts / repeat attempts; separate from the baseline and from coverage.
- **Previously missed → corrected:** distinct available questions with a recorded wrong answer and a latest correct answer. If the latest answer becomes wrong again, the question leaves this correction count and re-enters the active missed queue. An immediate correction demonstrates practice improvement, not lasting mastery.
- **Limited practice data:** at least one but fewer than `LIMITED_PRACTICE_THRESHOLD` unique first attempts in the displayed scope. The centrally defined threshold is **5**, a UI convention for warning about small samples. It is not a scientifically validated mastery, syllabus-coverage, or readiness threshold. Crossing it does not imply adequate preparation.

Removed or unavailable question IDs do not contribute to current-bank coverage, but their recorded history is not deleted by this update. Do not change that history to make a current-bank percentage look better.
