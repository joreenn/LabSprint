# Work checkpoint

## User preference for interruptions

If credits or tool approvals become unavailable, stop at the current checkpoint and wait for the user to return. Resume from saved work; do not restart completed implementation, migrations, or deployments unnecessarily. Do not bypass an unavailable approval check.

## Active checkpoint: v0.4.0 expansion (4 November 2026)

Confirmed stopping point: drafting and local integration of 366 questions were saved (56 existing + 310 additions). Final verification and publication for this batch were not recorded. Current production remains v0.3.0. The exact instant credits ended cannot be recovered from these files.

Current task: audit this existing first batch, preserve the original 56 items and learner history, verify tests/build/browser behavior, then commit/push and deploy the validated batch. The 2,000-per-subject long-term target remains unfinished. No schema/auth-setting change or source PDF upload is planned.

Resume from the existing files, not from scratch. Source audits: Rodak 80; Strasinger 84; Harr chemistry/immunology 80; Harr laboratory/microbiology/parasitology 66. Final check results are pending. If interrupted, continue from the next incomplete step below; do not treat an interrupted check as passed.

- [x] Inspect local source, instructions, imports and draft counts.
- [x] Source audit: all 310 additions rechecked; corrected para-h5-011 citation page 703 to 701 (supporting range 701–702). Rodak/Strasinger used supplied PDFs; Harr used retained page-marked text. Independent MLS expert review is still pending.
- [x] Original-56 integrity comparison: both retained baseline modules match committed HEAD; all 56 definitions are unchanged.
- [x] Final verification: 37 tests passed, zero failed; production build including TypeScript passed; full formatting passed. Added permanent integrity fixture for the original 56 questions. No source PDFs, credentials, schemas or auth settings changed.
- [x] Local browser checks: ten editions; Rodak80/Strasinger84; five unique hematology questions from three editions; bookmark/answer survived refresh; coverage uses366; single-question review and both new book rationales/recaps worked; 320/390px reference shelf had no horizontal overflow; desktop1366px checked; browser warning/error log empty.
- [ ] Current docs, commit/push, deployment, hosted verification and synthetic cleanup.

## Version 0.3.0 published and verified

The owner authorized publication on 1 November 2026. All five priorities are committed and pushed to `main`, and version 0.3.0 is live at https://labsprint.vercel.app. No schema migration or external authentication-setting change was made.

- Runtime source commit: `0048738c6268932f2b7518710e0f44368582306a` (`feat: clarify study progress and streamline review workflows`).
- Production deployment: `dpl_2gbLei2niAr3c8SLrhk2Jn9n4FtV`, confirmed READY with the canonical domain assigned, matching commit metadata, and no alias error.
- Hosted synthetic-account checks passed: signup, wrong-answer saving, stored question version, bookmark preservation, refreshed saved checkpoint, session completion/retry, baseline 0/1, repeat 1/1, unique coverage 1, correction count 1, and cleared missed queue.
- Live browser verified the new progress labels and version 0.3.0; warning/error log was empty. Screenshot: `docs/screenshots/labsprint-v030-live.jpg`.
- Deployment-specific 15-minute request scan returned zero 5xx records at release verification. This is a point-in-time check, not ongoing monitoring.
- The synthetic account was removed using its exact recorded ID, test email, and name. The temporary ignored production environment file was removed. Existing learner records and the browser's existing account session were not modified by verification.
- Email recovery status remains disabled; real delivery was not tested. The existing public-production/protected-preview access settings were preserved.

- Detailed behavior, inspection findings, and verification: `USABILITY-UPDATE.md`.
- Final `npm test`: **32 passed, zero failed**. Production build including TypeScript passed. Formatting passed. `npm run content:check` passed: 56 questions, 42 topics, two empty topics, 27 single-question topics.
- Browser checks at 320px and 390px phone, 768px tablet, and 1366px desktop. Wrong → correct retry preserved 0/1 baseline and one-question coverage; correction and cleared missed queue were visible separately. Bookmark, refresh/resume, concise single-question review, actual multi-session sizes, zero-match handling, repeat recap, and read-only explanation inspection passed. Recovery unavailable/invalid-link states were checked; browser warning/error log was empty.
- Saved question-version metadata is exposed for accurate version-aware recaps. No question content, ID, version, database schema, or dependency was changed.
- Local browser QA used only `tmp/usability-preview-data`, a separate ignored test database. Existing learner data was not used. The preview server was stopped; the viewport override was reset. Screenshots: `docs/screenshots/usability-desktop.jpg` and `usability-phone.jpg`.
- Real email delivery remains unverified until a verified sender/domain and server-only service credentials are configured. Exact setup and verification steps: `ACCOUNT-RECOVERY.md`. No verification requirement was switched on for existing accounts.
- No required implementation work remains. Physical-device QA and reviewed content expansion remain separate future work.

## Previous production release 0.2.1

- LabSprint 0.2.1 was the previous production release.
- Final production deployment: `dpl_FuymBRnh5M893wfTFFzZSHMdw4VK`, confirmed READY with the production domain assigned and no alias error.
- Typography update details and responsive browser checks are in `TYPOGRAPHY-2026-10-31.md`. Production build, TypeScript, and formatting passed.
- Public hosted sign-in renders with 16px body/form text. The final phone stat-card rule was verified in the published stylesheet.
- Laptop and phone screenshots are saved in `docs/screenshots/typography-laptop.jpg` and `docs/screenshots/typography-phone.jpg`.
- The disposable local typography account was removed; the local production server was stopped. No hosted test account was created for this patch.
- No implementation or deployment work remains for the typography request.

## Previous release context

- Version 0.2 introduced the appearance picker, timer, recovery codes, and background answer saving. Its implementation and verification are documented in `UPDATES-2026-10-31.md` and `VERIFICATION.md`.
- Appearance and recovery migrations 2–3 are already applied. Do not repeat them as new migrations. The typography patch has no schema changes.
- Version 0.2 automated/build checks, hosted recovery smoke test, and login after reset passed. Its synthetic local/hosted accounts were removed.

## Remaining product limitations

The live v0.3.0 bank has 56 questions. The v0.4.0 draft integrates supplied standalone Strasinger and Rodak references and contains 366 questions; it remains limited and pending the active release checklist above. Recovery uses codes saved before the password is forgotten; reset email is disabled. Full offline use and physical-device testing remain outside this release.
