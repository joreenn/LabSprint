# LabSprint verification records

## Version 0.4.0 - 4 November 2026

Production deployment `dpl_78C6EmXfejwxfCqnnG1ya7n9q8yJ` is READY at [labsprint.vercel.app](https://labsprint.vercel.app), with source commit `0ce5486e79985de7e80e63e8fea48451e1ac69ea` in Vercel metadata and no alias error. The live Settings screen displays version 0.4.0.

### Automated and source checks

- All 37 tests passed. The production build including TypeScript, content validation, and formatting passed.
- The live bank has 366 questions across seven subjects and 42 topics: one empty topic and four one-question topics remain. Counts do not establish full syllabus coverage or exam readiness.
- All 56 original question definitions are unchanged. A permanent semantic-content integrity fixture guards their IDs, keys, versions, references, and content.
- Rechecked 80 Rodak questions and 84 Strasinger questions against the supplied PDFs, and 146 Harr questions against retained page-marked text. One Harr citation was corrected. These checks are not independent review by an MLS faculty member or medical professional. Details are in [the batch record](CONTENT-EXPANSION-2026-11-01.md) and its linked source audits.

### Local browser/API checks

Used the separate ignored `tmp/v040-preview-data` database with synthetic data. Checked source mixing (five unique hematology items from three editions), answer/bookmark persistence after refresh, saved session restoration, the larger coverage denominator, concise single-question review and replacement warning, both new book explanations/references, and question-level recap. Checked 320px and 390px phone widths and 1366px desktop width without horizontal overflow. The browser warning/error log was empty. The local preview was stopped and viewport overrides reset.

### Hosted read-only checks and limits

The live browser confirmed 366 question rows, ten source editions, 80 Rodak questions, 84 Strasinger questions, and version 0.4.0. The browser warning/error log was empty. Screenshot: `docs/screenshots/v040-live-references.jpg`.

Automatic approval review rejected a proposed production test-account write under the earlier no-production-data-change constraint. That script never ran, no synthetic production account was created, and no existing learner account was used for mutations. Production write-flow verification was not completed for this release. The unused temporary production environment file was removed. Earlier release write checks below remain historical evidence rather than a v0.4.0 test result.

No database migration or external authentication-setting change was made. Email recovery delivery remains disabled and unverified. Physical-device checks, independent MLS review, and further content expansion remain pending. Durable continuation instructions are in [RESUME-V040.md](RESUME-V040.md) and [WORK-STATE.md](WORK-STATE.md).

## Version 0.3.0 — 1 November 2026

Production deployment `dpl_2gbLei2niAr3c8SLrhk2Jn9n4FtV` is READY at [labsprint.vercel.app](https://labsprint.vercel.app), with source commit `0048738c6268932f2b7518710e0f44368582306a` recorded in Vercel metadata. The live Settings screen displays version 0.3.0.

All 32 tests passed locally, as did the production build including TypeScript, formatting, and content validation. Responsive browser checks covered 320px, 390px, 768px, and 1366px widths. Hosted checks with a fresh synthetic account passed registration, saved-answer/version metadata, bookmarking, restored checkpoints, session completion, and retry behavior. A wrong answer followed by a correct retry retained 0/1 baseline and one unique question explored; repeat accuracy was 1/1, correction count was one, and the active missed queue was empty. The synthetic account was removed by exact ID/email/name afterward. No existing learner account was reset or used for mutations.

The deployment-specific request scan returned zero 5xx records in the checked 15-minute window; this is not ongoing monitoring. The live browser warning/error log was empty. Email recovery remained disabled and actual email delivery was not tested. No schema migration or external auth/mail configuration change was made. See [USABILITY-UPDATE.md](USABILITY-UPDATE.md) and [WORK-STATE.md](WORK-STATE.md).

## Version 0.2 — 31 October 2026

Production [labsprint.vercel.app](https://labsprint.vercel.app) is READY on deployment `dpl_2ZuThDztLHFM4eQQ94ChQNJc9rZ9`. Vercel's build completed in 39 seconds from an allowlist of 61 source/configuration files. Hosted migrations 2 (appearance) and 3 (recovery-code hashes) were applied additively. Existing learner accounts and history were not replaced.

### Automated and build evidence

- Production build passed.
- An 18-test full suite passed. An additional appearance-contrast regression was then added, and four focused appearance tests passed. The current suite contains 19 tests, but these checks are not recorded as a single full 19-test run.
- Theme tests include light/dark contrast and custom color extremes; timer tests cover timestamp-based elapsed time, pause/resume, phase transitions, and viewport clamping.
- Backend coverage includes atomic score/checkpoint behavior, account isolation, stale-session protections, recovery-code hashing, code reuse rejection, and retained learner history.

### Local browser evidence

Device-sized browser testing used 386/390-pixel phone widths; no physical phone or tablet was used for these checks.

- Optional pink signup personalization opened a dashboard/practice preview and applied the selected palette.
- Canceling a palette preview left the saved appearance unchanged.
- Show/hide password controls were inspected.
- Pointer dragging changed the floating timer position; minimize, pause, and custom technique controls worked.
- Immediate answer rationale and an enabled Next control were observed before waiting for the server save. A tool-action duration is not a server-latency benchmark and no numeric latency improvement is claimed.
- The recovery form was inspected in the browser. The complete reset was exercised through the hosted API with a synthetic QA account, not by resetting a real learner.

### Hosted HTTP evidence

- Registered a synthetic account on the canonical production origin.
- Submitted one answer POST and verified the authoritative score and saved session checkpoint.
- Saved a bookmark and account appearance.
- Generated 10 recovery codes, used one for a password reset, and confirmed that the old session was revoked.
- Signed in with the new password and confirmed the same user ID, original attempt, bookmark, active practice session, and appearance were preserved.
- Confirmed nine codes remained and reuse of the consumed code returned HTTP 400.

- Signed in through the live browser after the reset and verified the personalized dashboard and floating timer. Browser error/warning logs were empty.
- The production request scan returned zero HTTP 500-or-higher responses for the preceding 15 minutes.
- Removed the exact synthetic hosted and local update-test accounts. Real learner accounts were not targeted.
- Saved the live preview below before removing the hosted test account. No recovery codes or passwords are shown.

![LabSprint 0.2 with a test account, pink theme, and floating study timer](screenshots/labsprint-v02.jpg)

### Limits

The 56-question starter bank remains limited and needs independent MLS expert review. Standalone Strasinger and Rodak files were not supplied; their coverage remains pending verified source access. Email recovery is disabled because no verified email domain/provider is configured and the owner chose recovery codes. Full offline use, physical-device cross-platform checks, and long-term monitoring are outside this evidence. There is no claim that every queued-save failure scenario or device background restriction has been exercised on real hardware.

The records below preserve the initial release evidence and its original question count.

---

## Initial release — 30 October 2026

This record covers the initial local Windows build and the later Vercel/Neon production deployment. No Windows security settings were changed.

## Automated checks

- `npm run build`: passed with Next.js 16.4.3 / Webpack, including TypeScript and production page generation.
- `npm test`: 6 tests passed. The backend integration test contains assertions for real password hashing and cookie sessions, sign-out invalidation, login rate limiting, unauthorized access, hostile origins, account isolation, input validation, server scoring, concurrent duplicate submissions, bookmarks, reports, preferences, and cross-device session conflicts.
- Progress tests verify separate first/repeat accuracy, empty-state handling, unique coverage, and daily first-attempt counts.
- Content structure test verifies all seven groups have items, unique IDs, valid subject/topic tags, four explained options, a valid key, and source metadata. This is not clinical expert validation.
- `npm run format:check`: passed before the final unchanged-format build.
- Dependency installation reported zero known audit vulnerabilities at installation time. This is not a guarantee against undiscovered vulnerabilities.

## Browser checks

Used a synthetic local QA account, separate from any real learner. Its 3 practice attempts are test data and are not attributed to the project owner.

- Created an account through the interface and loaded a fresh dashboard.
- At 390 × 844, started a five-question mixed session and submitted both wrong and correct answers.
- Verified disabled answer buttons after submission, all four rationales, takeaway, reference title/section/PDF page, and question ID/version.
- Bookmarked a missed question, paused, refreshed the page, and found both saved history and the missed question.
- Redid the missed question in a new one-question session, answered correctly, and finished the session summary.
- Verified the review count decreased to zero while first-attempt accuracy stayed 50% and repeat accuracy became 100%.
- At 834 × 1112, checked the progress layout and icon navigation. No horizontal overflow was observed (document width 819 px in an 834 px viewport).
- Checked the desktop overview at the browser's default width. Browser error/warning log was empty after the corrected flow.
- Started the optimized production server and verified the account and saved overview loaded again. The preview image is from this production build.

The browser check caught a local origin mismatch between `localhost` and `127.0.0.1`. The fix shares the authentication trust list with application mutations. A regression test now covers it while preserving rejection of hostile and cross-site requests.

## Scope not verified

No physical iPhone, Android phone, or iPad was used; device-sized browser layouts were tested. Hosted verification is recorded below; real cross-device networking on physical devices remains unverified. Offline behavior and email recovery remain unimplemented. The 42-item bank needs independent MLS expert review and expansion; Philippine Medtech Laws remains pending.

On the loopback-only production preview, Better Auth reported no client-IP header and used its shared per-path rate-limit bucket. Vercel supplies the configured `x-real-ip` header; verify this on the actual deployment. Rate limiting stays enabled locally.

## Hosted verification — 30 October 2026

Production [labsprint.vercel.app](https://labsprint.vercel.app) is READY on Vercel with a production-only Neon Free database. The initial hosted migration was applied before testing.

- Registered a synthetic QA account on the public canonical origin and loaded the overview.
- Searched for `cuvette`, selected the single matching question, and submitted the correct answer.
- Verified all four rationales and the source reference, saved a bookmark, and paused the session.
- Reloaded the page and confirmed the saved resume banner retained `1/1` answered.
- Signed out and removed only the synthetic account using its exact email and name; no real users were changed.
- Browser error/warning log was empty. The CLI request scan found zero HTTP 500-or-higher records in the preceding 15 minutes.
- Runtime logs contained three `pg` SSL-mode future-compatibility warnings, without failed requests. No external monitoring or log drains are configured.

This confirms the hosted browser-to-API-to-database flow. It does not replace testing on physical mobile devices, independent content review, or long-term monitoring. Offline support and email recovery remain unimplemented.

![Live LabSprint production preview](screenshots/labsprint-live.jpg)

## Local preview

![LabSprint production overview using a synthetic QA account](screenshots/labsprint-overview.jpg)
