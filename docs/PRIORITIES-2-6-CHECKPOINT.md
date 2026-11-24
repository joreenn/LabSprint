# Priorities 2–6 checkpoint

**Status: implemented, committed, pushed and published.** Verified 2026-11-24 (Asia/Manila). No unfinished release step remains. External content review and email setup remain as listed below.

## Published release

- Version: **0.5.0** at https://labsprint.vercel.app.
- Runtime commit: `4073d736ce6660bd99f9a80a36696cd69625afc9` on `main`.
- Vercel deployment: `dpl_CPUGtNjz3DjRADGPRGbjPC6B5wi3`, observed **READY**, matching commit metadata and canonical alias.
- Deployment URL: `labsprint-3pdjos1cu-joreenns-projects.vercel.app`.
- Project: `prj_smcsMOv8LDn1iwXoDWIernTRHI2q`; team: `team_igVPwMjhaxLWAedNRpmyw3y3`.
- Exactly 83 committed app/config files were uploaded from that SHA. PDFs, credentials, audit notes, private extracts, local QA data and unrelated files were excluded. The separate audit work was preserved locally.

## Changes by priority

2. Published **Due for review**, **New questions only**, **Past sessions** and 24 previously source-checked original questions. The bank is now 498 questions across seven subjects and 48 listed topics. All 474 older question objects, IDs, versions, keys and references are unchanged. Source verification is documented in CONTENT-EXPANSION-2026-11-23.md; reuse it rather than repeating completed PDF scans.
3. A first daily saved answer queues the streak celebration. It opens only after **Next** or **Finish**, leaving the rationale available until the learner continues. The existing 4.5-second animation, lack of close icon, reduced-motion support, Escape access and automatic Overview return are preserved. Continuation remains immediate: an unacknowledged answer can celebrate at a later continuation after acknowledgement; if the session already ended, the persistent streak card updates without interrupting another screen. No unsaved answer is presented as saved activity.
4. Owner confirmed **no sending domain**. Recovery codes remain enabled, single-use and unchanged. ACCOUNT-RECOVERY.md records the exact verified-domain, sender, server-secret and inbox-delivery checks still needed. The public status endpoint correctly reports email recovery disabled. No email-delivery claim or verification-enforcement change was made.
5. Reference shelf now shows recorded independent approvals and explicitly names the empty Philippine Medtech Laws topic. Added a version-scoped independent-review register, release validation, practical editorial workflow and private paged report-export command. The register is intentionally empty: source checking is not independent MLS approval. No law questions, expert approvals or current legal applicability were invented.
6. Workspace uses SQL aggregates with original first/latest and active-session answers, plus calendar-day activity counts, rather than downloading every repeat. Progress/repeat/correction/due/streak calculations preserve their definitions. Past sessions use eight-record cursor pages with PostgreSQL microsecond-safe timestamps; exact recaps load on demand and are account-scoped, read-only and score-preserving. Library renders 20 matching questions at a time; page changes move focus/scroll to the results below the header, and filters reset the page. No data migration or new dependency was required.

## Verification completed

- All **61 tests passed**. Focused history comparisons also passed after final assertions were added: full-history and compact results agree, old acknowledgements do not count twice, local calendar grouping is correct, active sessions/bookmarks survive, cursor pages do not omit same-millisecond records, another account cannot read a recap, and recap reads create no attempts.
- Recovery tests passed for saved-code and provider-token flows, including progress/account preservation, single use, concurrency and old-session invalidation. Email transport is mocked; this does not verify inbox delivery.
- Content validation passed: **498 questions / seven subjects / 48 topics**, one empty topic, no one-question topics. The four formerly thin topics now have seven each. Independent academic approval remains unrecorded.
- Formatting, TypeScript and final production build passed. A Windows file-access retry was needed for static-page output; framework checks were not bypassed.
- Browser QA used only `tmp/priorities-26-preview-data` and synthetic records. At 390px, a saved first daily answer kept its rationale open; finishing triggered the streak and Overview return. A second daily answer did not repeat the celebration. Pages loaded eight then sixteen saved sessions, and keyboard Tab reached the recap disclosure. A completed recap reopened without an extra answer.
- Library rendered 20 rows; Next showed 21–40 of 498. Filters reset pagination and a search with no matches showed the helpful empty state. The reference shelf showed 0/498 independent approvals and zero Philippine Medtech Laws questions.
- New-only setup showed 496 eligible after two unique questions. A five-question session saved an answer, survived refresh and resumed question 2/5. Baseline stayed 0/2 after corrected repeats; a genuinely new correct answer changed it to 1/3.
- Phone (390px), tablet (768px) and desktop (1440px) had no horizontal overflow. Browser warning/error logs were empty. A text-encoding issue found during QA was corrected. Final production-mode local QA verified library focus/scroll (result count at 90px below the header).
- Live read-only checks: home HTTP 200; sixteen referenced static assets HTTP 200; anonymous session HTTP 200/null; recovery status HTTP 200/disabled; anonymous session-history HTTP 401. Assets contain the six expected feature markers, v0.5.0 and all 24 new literal IDs. Some older IDs are generated at runtime, so their preservation is established by continuation tests and exact deployed source metadata rather than a literal-string count.
- The short live log scan showed only the existing PostgreSQL SSL-mode compatibility warnings written to stderr; the checked endpoints responded successfully. SSL settings were not weakened or changed. Authenticated study workflows were verified locally, not by creating production QA progress.

## Remaining external needs

- **Email:** owner must obtain/control a sending domain, verify it with Resend, configure private sender/API-key settings and verify real delivery and recovery before enabling or claiming email reset. The current recovery-code route remains available. Do not lock out existing unverified accounts.
- **Academic content:** obtain qualified independent MLS review of question versions and current Philippine primary legal sources before drafting/publishing law questions. Follow CONTENT-EDITORIAL-WORKFLOW.md. Current reports lack separately stored historical version metadata; the private export deliberately marks it unknown and requires date/Git-history checking. Admin roles, a public triage interface and automatic resolution notices are not implemented or claimed.
- **Future scaling:** the compact response scales with explored questions and study days. SQL still aggregates the account's saved history and the existing client still ships the finite question bank; this is not a large-bank load-test result or a complete server-side content-delivery redesign.

## Resume safely

The runtime update is complete. Do not redeploy it or repeat source scans just because credits interrupted a later chat. Start any new requested work from the current repository and preserve unrelated audit files. If work stops mid-task, append the exact completed checks, remaining step and relevant deployment/commit identifiers to a new checkpoint. Conserve credits and respect the owner's preference against automatically launching additional audit agents.
