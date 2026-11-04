# v0.4.0 continuation notes

Updated 4 November 2026 (Asia/Manila). The detailed active checklist is at the top of WORK-STATE.md. Read that file and git status before resuming. Existing v0.4.0 source imports 366 items; final audit, test/build/browser verification, commit/push and deployment are pending. Production remains v0.3.0 until a new READY deployment is confirmed.

Do not recreate the source modules or repeat completed migrations. Preserve original IDs, versions, history, bookmarks and saved sessions. Source PDFs and extracted pages stay local under Downloads/ignored tmp and are never committed or deployed. This first batch does not complete the long-term 2,000-per-subject target.

## Evidence log

- Read repository instructions and installed Next component guidance.
- Draft bank: 56 existing + 80 Rodak + 84 Strasinger + 80 Harr chemistry/immunology + 66 Harr laboratory/microbiology/parasitology.
- PDF/source-fidelity audits in progress. Original Harr PDF is unavailable; retained page-marked text is the source evidence for its additions.
- apply_patch file writes failed in this session; direct scoped Python writes succeed. No security settings changed or approval bypassed.
- Next: original-item integrity comparison, content validation, regression suite and source audit corrections.

- Content validation passed: 366 items, seven subjects, 42 topics; one empty topic and four one-question topics.
- Existing baseline check passed for all 56 original items (IDs, keys, rationales, versions and references unchanged).
- Full regression suite running in exec session 67201; do not mark passed until exit is observed.

- Initial complete regression suite passed: 36 tests, zero failed. Added a permanent original-56 SHA-256 content fixture/test for future regression protection; focused test run passed. Formatting found eight draft files needing normalization; wait until source reviewers finish before formatting owned files.

- Source audits complete: Rodak 80, Strasinger 84 and Harr 146 checked. Only concrete correction was para-h5-011 citation 703 → 701. Full scope/evidence/limitations are recorded in the four audit MDs. No independent professional review is claimed.
- Local preview exec session 81287 uses LABSPRINT_DATA_DIR=tmp/v040-preview-data; contains only a synthetic QA learner. Browser verification in progress.

- TypeScript check passed. Local browser reference shelf confirms ten source editions, Rodak80 and Strasinger84, and actual per-subject totals. Fixed singular wording for a source with one question. Remaining browser flows and final suite/build are pending.

- Local browser verification complete: references80/84 and ten editions; five selected hematology items from three source editions confirmed via API; saved answer/bookmark and resume survivedrefresh; new Strasinger and Rodak rationales displayed their page citations; single-question replacement warning and recap worked. Phone320/390px and desktop1366px layouts checked; no horizontal overflow or browser warnings/errors. Screenshot: docs/screenshots/v040-reference-books.jpg.
- Next: stop local preview81287, run final37-test suite/build/format/content checks, record outputs, then publish and verify.

- Formatting passed for the complete source/test/docs tree. Local preview stopped. Final build running in exec66086 and final regression suite in exec5910; check their exit results before marking complete.

- FINAL RESULTS CONFIRMED: exec66086 production build exited0 (TypeScript passed); exec5910 full suite exited0, 37passed/0failed. No required code checks remain. Next: record publication commit, deployexistingproject, checkREADY/domain andhostedbehavior, thenfinishcheckpoint.
