# v0.4.0 continuation checkpoint

Updated: 4 November 2026 (Asia/Manila). **The first expansion batch is complete and published.** Read [WORK-STATE.md](WORK-STATE.md) before beginning future changes.

## Confirmed interruption boundary

Draft question modules and their local imports were saved, reaching 366 items. Final verification and publication were not recorded. The exact instant credits ran out could not be determined. The old checkpoint described completed v0.3.0, so it was not treated as evidence for this batch. Resumed work reused the saved modules rather than recreating them.

## Completed work and evidence

- Content: 310 additions (80 Rodak, 84 Strasinger, 146 Harr) plus 56 preserved original items = 366. Source-audit records describe the cited-page checks and their limitations. The only concrete citation correction was `para-h5-011`: PDF page 703 became 701, with the supporting range 701-702 retained.
- Integrity: retained baseline modules match committed v0.3.0; all 56 original question definitions compare equal. A permanent semantic-content integrity test uses `tests/fixtures/starter-v030-hashes.json`.
- Automated checks: content validation passed; all 37 tests passed; the production build including TypeScript passed; formatting passed. Completed execution sessions 66086 (build) and 5910 (tests) exited successfully. Repeat these checks when later changes justify them.
- Local browser/API checks: used the separate ignored `tmp/v040-preview-data` database. Confirmed ten source editions, five unique hematology items selected from three editions, persisted answers/bookmarks after refresh, the 366-item coverage denominator, single-question review and replacement warning, both new book rationales, and question-level recap. Checked 320px and 390px phone widths and 1366px desktop width without horizontal overflow; the browser warning/error log was empty. The preview server was stopped.
- Source commit: `0ce5486e79985de7e80e63e8fea48451e1ac69ea`. Production deployment: `dpl_78C6EmXfejwxfCqnnG1ya7n9q8yJ`. Vercel project: `prj_smcsMOv8LDn1iwXoDWIernTRHI2q`; team: `team_igVPwMjhaxLWAedNRpmyw3y3`. Confirmed READY at https://labsprint.vercel.app with matching source metadata.
- Hosted read-only checks: confirmed 366 question rows, 80 Rodak questions, 84 Strasinger questions, and version 0.4.0. Screenshot: `docs/screenshots/v040-live-references.jpg`. Viewport overrides were reset.
- Production write-test boundary: automatic approval review rejected `tmp/smoke-v040.ts` because production-account writes conflicted with the earlier no-production-data-change constraint. The script never executed, `tmp/v040-hosted-user.json` was not created, and no synthetic production account was created. Do not bypass or retry that rejection. Existing users were not used for mutations. The unused temporary `tmp/v040-production.env` file was removed.

## Remaining product work

The larger 2,000-per-subject target remains unfinished: 13,634 additional items are needed numerically. Counts do not establish syllabus coverage or exam readiness. Verified current Philippine law sources, thin-topic expansion, and independent qualified MLS review remain needed. Harr verification used retained page-marked text because its original PDF was unavailable. Email delivery and physical-device testing remain separate future work.

## How to resume later

1. Read this file, [WORK-STATE.md](WORK-STATE.md), and the current Git status.
2. Identify the new user request or the first genuinely unfinished step. Preserve question IDs, answer history, bookmarks, and saved sessions.
3. Never recreate a completed batch, repeat completed migrations, upload source PDFs/extracts/credentials, or assume an interrupted check passed.
4. During long tasks, update the active checklist after each major result. Record the exact next action and running session IDs before stopping when possible.
5. If credits or approval checks become unavailable, save available progress and wait. Do not bypass an unavailable approval check.

No implementation or publication work remains for this first batch. Future work should start with the remaining product needs or a new request.
