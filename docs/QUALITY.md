# LabSprint quality guide

This checklist defines the intended behavior and where future changes should be checked. It is not a record that all checks have passed. The final build handoff should state which automated and browser checks were actually performed.

## Automated checks

```powershell
npm run typecheck
npm test
npm run build
```

Focus tests on scoring, first-attempt calculations, missed-question handling, idempotent saves, user isolation, and malformed input. Avoid tests that only repeat implementation details.

## Essential acceptance flow

- [ ] A new user can register with email/password and return after signing out.
- [ ] A wrong password does not authenticate; errors do not expose password or session data.
- [ ] User A cannot view or change User B's history, bookmarks, settings, or active session.
- [ ] Every subject group is visible at all times.
- [ ] Subject/topic filtering produces only eligible questions.
- [ ] A session can mix recall and case questions without a timer.
- [ ] Answer choices are readable and easy to tap at phone width.
- [ ] The answer is checked once, with no accidental double-count on rapid taps/retry.
- [ ] Every option has a rationale and each question has a verifiable reference.
- [ ] A missed question appears for review; a successful redo preserves its earlier attempt.
- [ ] First-attempt accuracy remains distinct from repeat accuracy.
- [ ] Subject/topic coverage is visible alongside accuracy.
- [ ] Progress trends are based on saved attempts, with honest empty states.
- [ ] Bookmarking and reporting a question persist for the account.
- [ ] Refresh and sign-in from another device preserve hosted account progress.
- [ ] An interrupted practice session resumes without losing saved answers.
- [ ] Optional dates do not assume a year or force a study schedule.
- [ ] Offline/network failure is visible and does not create a false success state.

## 0.2 update acceptance flow

These checks describe the release gate; their presence does not mean the in-progress update has passed them.

- [ ] Clicking an answer reveals a rationale immediately, before the save request resolves.
- [ ] Next-question navigation is local and does not wait for a separate checkpoint request.
- [ ] The server scores an answer and records its checkpoint atomically, without trusting client correctness.
- [ ] Rapid taps, retries, and refreshes do not duplicate or silently change a submitted answer.
- [ ] Saving/unsynced status stays visible, failed requests can retry, and the account-specific queue survives a reload.
- [ ] Starting another session or signing out waits for pending answers or explains what remains unsynced.
- [ ] A stale device cannot overwrite a newer session or move a saved checkpoint backward.
- [ ] Existing accounts and history remain intact after additive migrations 2 and 3.
- [ ] Palette selection offers dashboard and practice previews without saving until Apply.
- [ ] Cancel leaves the saved appearance unchanged; Apply persists only valid theme fields and syncs across devices.
- [ ] Custom light, dark, black, white, and saturated colors retain readable text and controls.
- [ ] Registration color selection is optional; users can change it later from Preferences.
- [ ] Timer presets, custom intervals, and stopwatch start, pause, resume, reset, minimize, and hide predictably.
- [ ] Timer dragging works by touch/pointer and keyboard and remains inside the viewport after rotation/resizing.
- [ ] Countdown time remains correct across background suspension and does not advance to a break without user action.
- [ ] Timer persistence and pending-answer persistence cannot leak across signed-in accounts.
- [ ] Login and reset password inputs can show/hide their values without changing the entered password.
- [ ] Recovery-code generation requires password reauthentication and provides exactly 10 copyable/downloadable codes.
- [ ] Only code hashes are stored server-side; replacing a set invalidates old codes.
- [ ] A valid unused code resets the password on the existing user ID, preserves study history, consumes the code, and revokes sessions.
- [ ] A used/invalid code fails without revealing whether an unrelated email exists; recovery endpoints are rate-limited.
- [ ] The app does not promise email delivery without configured mail credentials and a verified sender.
- [ ] The 56-item bank passes structure checks, retains all original IDs, and cites only inspected sources.

## Content quality gate

For every new or revised question:

1. Give it a stable ID and an explicit version.
2. Tag its subject, topic, style, and difficulty.
3. Confirm there is exactly one defensible best answer with the stated assumptions.
4. Check units, ranges, specimen conditions, terminology, and distractor plausibility.
5. Explain the correct option and every distractor in original wording.
6. Verify the cited source and exact PDF/printed page distinction.
7. Check that the stem does not reveal the answer accidentally.
8. Use an appropriate current Philippine primary source for legal content.
9. Run the content validation tests and review the mobile rendering.

Book statements can be outdated or differ in method-specific reference ranges. Flag ambiguity rather than present a disputed value as universal. A source-checked starter bank is not equivalent to independent expert validation of the entire product.

## Interface and accessibility

Check small phone portrait, iPad portrait/landscape, and desktop widths. There should be no horizontal overflow, obscured answer controls, clipped rationales, or tiny tap targets. Ensure visible keyboard focus, labels for icon-only buttons, meaningful button states, and feedback that does not rely on color alone. Respect reduced-motion preferences.

## Security and maintenance

- Authenticate data requests on the server and derive the owner from the session.
- Validate request shapes and question/option IDs server-side.
- Calculate correctness from server-owned content rather than a client-supplied flag.
- Keep session cookies protected through the auth library and require a strong production secret.
- Keep database credentials out of logs, client bundles, commits, and documentation.
- Rate-limit authentication attempts; keep library security updates reviewable.
- Store neither plaintext passwords nor book PDFs in the application data model.
- Fail closed on Vercel if persistent database/auth configuration is missing.
- Preserve migrations and stable content IDs for future upgrades.
- Keep recovery-code plaintext out of database records, logs, screenshots, deployment artifacts, and the repository.
- Treat queued client answers as pending until the server validates them; a browser-provided result is not the authoritative score.

The database records the question version on each attempt. Before changing a correct answer or substantially revising a question, define how older-version attempts appear in statistics. Preserve their original outcome and label or filter older results deliberately; do not silently reinterpret past answers against new content. Never reuse an existing question ID for an unrelated question.

## Deferred work

Expand topic coverage and expert review; supplied-file access for standalone Strasinger and Rodak; full offline support; email verification and optional recovery email delivery; account deletion/export; content administration; provider backup procedures; and broader physical-device testing. Timed exams and public competition remain outside the agreed scope. Saved recovery-code resets and interrupted-save retries are included in 0.2 and should not be described as a complete offline or email-recovery service.
