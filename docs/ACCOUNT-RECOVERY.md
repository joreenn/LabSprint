# Account recovery

LabSprint supports one-time recovery codes without requiring an email provider. Password visibility buttons are available on sign-in, sign-up, and recovery forms.

## Save codes before you need them

While signed in, open Preferences and the recovery-code panel. Confirm your current password, generate a set of ten codes, and copy or download them somewhere private. New accounts are prompted to do this after registration. The raw codes are displayed once and are not stored in browser storage or in the database.

Each code is a cryptographically random 128-bit value. The database stores only its SHA-256 digest, account owner, and use timestamp. Treat saved codes like a password: anyone with a code and your registered email can recover that account. Generating another set invalidates every code in the previous set.

## Recover the same account

Open `/forgot-password`, enter your registered email, one unused saved code, and a new password of at least 12 characters. A successful recovery keeps the same user ID and preserves answers, bookmarks, appearance, preferences, and progress. All previous sessions are revoked, so sign in again on your devices.

Code consumption, the credential update, and session revocation run in one database transaction with an account row lock. Two requests cannot spend the same code twice. Passwords use Better Auth's configured hashing and verification functions; no separate password hash scheme is introduced. The application currently uses authoritative database sessions rather than a cookie/session cache.

Unauthenticated recovery attempts are rate-limited in the database by trusted ingress IP and hashed email. Incorrect codes and unknown accounts receive the same public error. Code generation is authenticated, separately rate-limited, and requires the current password.

If an existing user forgets a password before saving any recovery codes, this mechanism cannot retroactively prove their identity. Creating codes requires the current password, even when a device still has a signed-in session. An established email recovery channel or another independently verified recovery process is required in that case; do not bypass account ownership checks or create a replacement account expecting old progress to appear automatically.

## Optional email recovery

Email links are implemented through Better Auth and Resend but are disabled until both `RESEND_API_KEY` and `MAIL_FROM` are configured. `MAIL_FROM` must be a sender address the owner has verified with the provider. The provider's test sender is not suitable for arbitrary friends' email addresses.

No new email service was provisioned for the recovery-code update. The interface offers the email method only when configured. It never presents a fake sent-message success when email recovery is unconfigured.

The optional email flow uses the canonical `BETTER_AUTH_URL`, a library-generated one-use token, a 30-minute expiry, and session revocation after reset. Recovery URLs and tokens are never logged. `/api/recovery-status` exposes only a boolean configuration status.

## Verification

`tests/recovery.test.ts` runs against an isolated embedded database. It checks current-password reauthentication, hash-only code storage, rotation invalidation, unchanged progress, invalid-password protection, concurrent consumption, reuse rejection, old-session invalidation, new-password sign-in, account isolation, hostile-origin rejection, generic errors, persistent rate limits, and the optional email token's one-use flow with an in-memory mail transport.

No production email, recovery token, code, password, or learner account is used by the automated tests.
