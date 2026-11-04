# LabSprint product brief

This document records the requirements and decisions agreed in the project conversation. It is the durable source for future upgrades and bug triage.

## Purpose and audience

Build a personal and small-group MLS reviewer for the owner's MTAP, mockboards, and eventual board examination. The owner intends to test it first, then share a Vercel deployment link with friends. The first version should be useful and easy to maintain, with a modest scope and few avoidable mistakes.

MTAP is in December and mockboards are in January. Exact dates and years were not confirmed. MTAP covers all MLS subjects. Dates are optional user settings; the app must not invent a deadline or lock study material behind a schedule.

## Subject coverage

Every subject group remains available at all times:

1. Clinical Chemistry
2. Immunoserology and Blood Banking
3. Analysis of Urine and Body Fluids
4. Microbiology: Bacteriology, Virology, and Mycology
5. Parasitology
6. Hematology
7. Histopathology, Laboratory Management, and Medical Technology Laws

Topics provide finer filtering and progress tracking. A visible subject does not imply that the starter bank exhaustively covers every topic. Missing or unverified topics must remain identifiable so content expansion can be targeted.

## Practice behavior

- English questions and explanations.
- Study mode with no enforced timer or time pressure. An optional study-technique timer was requested in the 31 October update; it does not impose question deadlines.
- Multiple-choice answers selected by tapping or clicking.
- A mix of direct recall and case-based questions.
- Choose a subject, a topic, or a mixed session freely each day.
- Show immediate feedback after the answer is submitted.
- Explain why the correct option is right and why each other option is wrong, including the user's selected option.
- Include a concise takeaway and an honest, checkable reference for every question.
- Allow bookmarks and reports of unclear or incorrect content.
- Support resuming an unfinished practice session.

Repeated answers must not silently replace earlier attempts. Learning a previously missed question is progress, but repeat accuracy must remain distinguishable from first-attempt accuracy.

## Progress behavior

- Track accuracy per subject and topic.
- Keep missed questions available for practice again.
- Preserve attempt history when a missed question is later answered correctly.
- Show improvement over time.
- Show coverage alongside accuracy, including when data is limited.
- Support an adjustable daily question goal without forcing a study schedule.
- Keep each user's records private to that account.

Progress indicators describe practice performance. They must not be presented as a validated passing probability or board-exam score forecast.

## Devices and interface

The owner's main devices are a phone and iPad. Friends may use iPhones, Android phones, iPads, and laptops. The interface should adapt to small touchscreens and offer generous answer targets, readable explanations, visible feedback, keyboard support, and accessible contrast.

The desired visual style is engaging and professional. Subtle motion, subject colors, clear progress graphics, and immediate answer states can add interest. Interactions should support studying and must not distract, confuse, or impose time pressure. Respect reduced-motion preferences.

The 31 October update expands personalization to 20 palettes, with many pink, blue, lavender, and other soft combinations. Users can also choose two custom colors, a gradient, or a solid color. Palette selection is optional during registration and remains available in Preferences. Show a scoped dashboard/practice preview first; selection does not save until the user applies it. Keep text and controls readable regardless of pastel or custom choices. Account appearance syncs across devices; light/dark display mode remains a local preference.

The optional floating study timer supports Pomodoro, longer focus blocks, custom intervals, and an open-study stopwatch. Users can drag it, move it by keyboard, minimize it, pause it, reset it, or hide it. It stays within the screen and avoids the mobile navigation area by default. Elapsed timestamps, rather than interval tick counts, handle background tab/device suspension. Timer position and state are device-local and account-scoped. Focus/break transitions require a clear user action; no notification, sound, or OS permission is required.

Answers should reveal feedback immediately and moving to the next question should not wait on a database request. Server scoring remains authoritative. Pending saves must have a visible status and durable account-specific retry queue, with no false claim that a failed request was saved. Flush queued work before replacing a session or signing out.

## Accounts, hosting, and permission boundaries

- Email/password sign-up and sign-in; no Google sign-in required.
- Anyone who has the deployed URL can create an account.
- The first version is intended for a limited group, not a public launch.
- A hosted shared database enables progress to follow the same account across devices.
- Vercel is the hosting platform. The initial production deployment is live; later releases require their own verification and deployment record.
- Local development must not require security settings to be weakened.
- Ask the owner before an action needs elevated PC access, security changes, or an external account/approval.

Passwords are handled by Better Auth with secure hashing and sessions. Each data API must derive the user identity from the authenticated session, rather than accept another user's ID from the browser.

The 31 October update adds show/hide password controls and forgotten-password recovery. The owner explicitly chose saved recovery codes instead of setting up an email-sending domain. A user can generate 10 high-entropy, one-time codes after password reauthentication, then copy or download them. Store only hashes server-side. Resetting the password with an unused code preserves the existing account and all history, consumes that code, and revokes existing sessions. Generating a replacement set invalidates the old set. Existing users must be prompted to save codes while they still have account access. Optional email integration is disabled without a configured provider and verified sender; do not promise reset emails or recovery without a saved code.

## Reference policy

The owner supplied local PDF paths for a library including Harr, Ciulla/SUCCESS!, Apollon, BOC, Hubbard, Jarreau/Bottom Line, Elsevier, Linne & Ringsrud, Beck/NCA, Polansky, Alba, subject handouts, and other review material.

Harr, Ciulla/SUCCESS!, and Apollon are the priority references. Supporting books can fill gaps or clarify a concept. The initial Google Drive folder could not be read through the browser tool; local supplied PDFs are the available sources.

The owner later requested Strasinger for Clinical Microscopy and Rodak for Hematology, plus broader references across subjects. Their standalone files have not been supplied and should not receive invented citations. The 31 October content expansion uses supplied Hubbard 2nd edition, Elsevier 1st edition, Linne & Ringsrud 7th edition, and Lehman/SUCCESS! 5th edition for 14 new original questions, two in every subject group. The bank becomes 56 items; the original question IDs remain intact. This expands a starter bank rather than establishing comprehensive or independently expert-validated coverage.

Practice questions should be newly authored from verified concepts rather than reproduce entire commercial question banks. Cite the exact source actually inspected. Use the source's printed page where confirmed, or explicitly label a 1-based PDF page. Never invent page numbers or claim that every book has been reviewed. Book files and extracted text stay outside the deployed application.

Medical Technology Laws require appropriate Philippine sources and current verification before publication. Do not infer Philippine legal rules from a US review book.

## Scope boundaries and later upgrades

The first version includes a manageable source-checked bank across all seven subject groups. The 31 October update adds a durable retry queue for interrupted saves and recovery-code password resets. A larger bank, additional topic coverage, full offline use, email verification/delivery, and an administrator content-review interface remain later work. Offline use was requested as a bonus, not a prerequisite.

Timed mock-exam mode and leaderboards were not selected. Do not add these by default. Future upgrades should preserve attempt history, stable question IDs, and question versions so content corrections do not erase a user's learning record.

## Implementation decisions

The agreed initial direction was Next.js/TypeScript, PostgreSQL, Better Auth, and Vercel. The actual first implementation uses Drizzle instead of Prisma to share a PostgreSQL schema between embedded local PGlite and hosted PostgreSQL. Responsive CSS and Lucide provide the interface in place of the initially suggested Tailwind/shadcn stack. DM Sans and Manrope font files are self-hosted through Fontsource dependencies. Next.js runs with Webpack to avoid requiring Windows symlink privileges. No Windows security setting is changed for this choice.

The project name is **LabSprint**. The name is branding; sessions remain untimed and self-paced.

The 0.2 data changes are additive: migration 2 stores appearance preferences, and migration 3 stores recovery-code hashes. Preserve existing users, history, question IDs, and the shared PostgreSQL schema. Atomic server-scored answer/checkpoint writes replace the older answer-write plus separate session-write flow; the client can render feedback and navigate locally while reliable saves continue.

## 4 November continuation

The saved v0.4.0 first expansion batch integrates the supplied Rodak seventh edition and Strasinger seventh edition plus existing Harr source material: 310 new original items, 366 available in total. The original 56 items, identifiers and versions are preserved. References are mixed within the eligible selection without relaxing subject/topic/style filters. The larger 2,000-per-subject target is still unfinished; source checking is not independent professional sign-off. See CONTENT-EXPANSION-2026-11-01.md and RESUME-V040.md for current inventory and release status. Older source-availability statements above describe their historical releases.
