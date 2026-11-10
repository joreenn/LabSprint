# Account recovery

LabSprint supports one-time recovery codes without requiring an email provider. Password visibility buttons are available on sign-in, sign-up, and recovery forms.

## Save codes before you need them

While signed in, open Preferences and the recovery-code panel. Confirm your current password, generate a set of ten codes, and copy or download them somewhere private. New accounts are prompted to do this after registration. The raw codes are displayed once and are not stored in browser storage or in the database.

Each code is a cryptographically random 128-bit value. The database stores only its SHA-256 digest, account owner, and use timestamp. Treat saved codes like a password: anyone with a code and your registered email can recover that account. Generating another set invalidates every code in the previous set.

## Recover the same account

Open `/forgot-password`, enter your registered email, one unused saved code, and a new password of at least 12 characters. A successful recovery keeps the same user ID and preserves answers, bookmarks, appearance, preferences, and progress. All previous sessions are revoked, so sign in again on your devices.

Code consumption, the credential update, and session revocation run in one database transaction with an account row lock. Two requests cannot spend the same code twice. Passwords use Better Auth's configured hashing and verification functions; no separate password hash scheme is introduced. The application currently uses authoritative database sessions rather than a cookie/session cache.

Unauthenticated recovery attempts are rate-limited in the database by trusted ingress IP and hashed email. Incorrect codes and unknown accounts receive the same public error. Code generation is authenticated, separately rate-limited, and requires the current password.

### Recovery concurrency and accounting safeguards

The authentication adapter snapshots the credential read for each sign-in or password-change request. Before creating a session or committing a password change, it locks the same user row used by saved-code recovery and checks that the stored credential still matches that snapshot. The check and resulting write share one transaction. A password proof paused before recovery cannot create a session or overwrite the recovered password afterward; the request receives `CREDENTIALS_CHANGED` and must sign in again. Password changes acquire the lock before revoking sessions, so a stale request cannot revoke the owner's fresh post-recovery session. Email-token resets also acquire that user lock before revocation and password replacement. These are database locks shared across app instances, rather than process-local locks. Both HTTP and server API calls use this adapter.

Recovery accounting processes the IP bucket before the email bucket and stops at the first exhausted bucket. That bucket's count is committed, but later buckets are untouched. An already-blocked IP therefore cannot consume another email's recovery allowance or create more email-accounting keys. Counts saturate at the bucket's limit plus one. Admitted requests prune at most 100 accounting rows older than one day; current policy windows are 15 minutes. Migration 4 adds an index on `recovery_rate_limit.window_start` for the bounded cleanup query. Apply pending migrations to the hosted database before deploying this update; local PGlite applies them automatically.

If an existing user forgets a password before saving any recovery codes, this mechanism cannot retroactively prove their identity. Creating codes requires the current password, even when a device still has a signed-in session. An established email recovery channel or another independently verified recovery process is required in that case; do not bypass account ownership checks or create a replacement account expecting old progress to appear automatically.

## Optional email recovery

Email links are implemented through Better Auth and Resend but are disabled until both `RESEND_API_KEY` and `MAIL_FROM` are configured. `MAIL_FROM` must be a sender address the owner has verified with the provider. The provider's test sender is not suitable for arbitrary friends' email addresses.

No new email service was provisioned. The recovery screen checks configuration, explains unavailable email delivery, and keeps saved recovery codes available. A failed availability check can be retried. When configured, email is the initial method, and users can switch to a code. A received request is deliberately conditional: the screen does not confirm account existence or mailbox delivery.

The optional email flow uses the canonical `BETTER_AUTH_URL`, a library-generated one-use token, a 30-minute expiry, and session revocation after reset. Recovery URLs and tokens are never logged. `/api/recovery-status` exposes only a boolean configuration status.

### Remaining setup and delivery verification

The recovery implementation does not change external mail services, secrets, or authentication settings. Publication of the application is tracked separately in `WORK-STATE.md`; email delivery still needs the setup and verification below.

1. In Resend, verify a domain the owner controls and complete its required DNS records. Use a sender on that verified domain; a sender string alone does not prove it is verified.
2. Configure server-only `RESEND_API_KEY` and `MAIL_FROM` for the intended environment. Keep `BETTER_AUTH_URL` at the exact HTTPS app origin. Example variable names are in `.env.example`; never commit real values or use `NEXT_PUBLIC_` for these secrets.
3. Restart/rebuild the intended environment so the Better Auth configuration loads the mail callback. `/api/recovery-status` reports whether variables are present and syntactically usable, **not** whether DNS or delivery is verified.
4. With an authorized test mailbox and disposable account, request a link; verify actual inbox delivery, correct HTTPS origin, successful reset, old-session revocation, preserved study history, link reuse rejection, and expiry. Check provider delivery events without copying credentials or reset links into logs or issue reports.
5. Test an unregistered email: the public response must remain the same. Exercise provider failure and rate limits; public messages must not reveal registration.

The Better Auth mail callback catches dispatch errors so a transport outage does not make registered addresses distinguishable from unknown addresses by HTTP response. It emits only a fixed operational error message. Provider delivery events are needed to diagnose delivery; the UI does not claim delivery was confirmed. Network and rate-limit failures show retry guidance, and invalid or expired links return to the recovery-method screen. Saved recovery codes remain a supported alternative; never substitute debug tokens, credential disclosure, or an account-ownership bypass for failed delivery.

### Email verification assessment

Registration currently allows immediate access without verifying inbox ownership. This is confirmed behavior, not proof that email recovery is active. Existing users may have `emailVerified=false`. Enabling Better Auth's global `emailAndPassword.requireEmailVerification` now would block their sign-in, so this update intentionally leaves account access and verification flags unchanged.

After mail delivery is verified, a separate rollout can add the provider's verification sender and an optional signed-in verification/resend flow first. A new-account verification requirement needs a documented cutoff and a tested compatibility policy for existing accounts, plus resend/expiry/rate-limit UI. Do not mark old accounts verified without proof of ownership, and do not enable the global requirement before that transition is implemented. No new-account enforcement or verification emails are claimed in this release.

Provider references: [Better Auth email/password recovery](https://www.better-auth.com/docs/authentication/email-password) and [email verification](https://www.better-auth.com/docs/concepts/email). The installed Better Auth 1.7.14 routes and option types were also inspected.

## Verification

`tests/recovery.test.ts` runs against an isolated embedded database. It checks current-password reauthentication, hash-only code storage, rotation invalidation, unchanged progress, invalid-password protection, concurrent consumption, reuse rejection, old-session invalidation, new-password sign-in, account isolation, hostile-origin rejection, generic errors, persistent rate limits, and the optional email token's one-use and expired-link flows with an in-memory mail transport. Email reset is also checked for preserved recovery codes and account identity, session revocation, identical unknown/known request responses, and generic dispatch-failure diagnostics.

No production email, recovery token, code, password, or learner account is used by the automated tests.

[The recovery security regressions](../tests/recovery-security.test.ts) pause real password verification at a deterministic barrier and complete recovery before resuming it. They cover stale sign-in after saved-code and email-token recovery, stale password changes, preservation of the owner's new session, legitimate password changes, direct server API sign-in, denied-IP isolation, saturated counters, and bounded expiry cleanup. These implementation tests use disposable local PGlite state and dummy credentials. They do not establish deployed PostgreSQL concurrency, ingress policy, inbox delivery, or completion of the separate security audit.

Actual inbox delivery remains unverified without the owner's verified sender and configured email service. Passing mocked transport tests is not a delivery claim.
