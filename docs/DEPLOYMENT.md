# LabSprint on Vercel

## Current setup

| Item                    | Configuration                                                                            |
| ----------------------- | ---------------------------------------------------------------------------------------- |
| Production URL          | [labsprint.vercel.app](https://labsprint.vercel.app)                                     |
| Automatic project alias | `labsprint-joreenns-projects.vercel.app` — not configured for learner sign-in            |
| Vercel project/team     | `labsprint` in `joreenns-projects`                                                       |
| Framework/runtime       | Next.js, Node.js 24                                                                      |
| Production database     | Neon Free, `labsprint-db`, Singapore (`sin1`)                                            |
| Database scope          | Production only                                                                          |
| Authentication          | Better Auth email/password, secrets configured in Vercel                                 |
| Canonical auth origin   | `https://labsprint.vercel.app`                                                           |
| Current release         | LabSprint 0.3.0, 1 November 2026                                                         |
| Current deployment      | `dpl_2gbLei2niAr3c8SLrhk2Jn9n4FtV` — READY                                               |
| Source commit           | `0048738c6268932f2b7518710e0f44368582306a`                                               |
| Source integration      | Direct source upload from versioned source; automatic Git deployments are not configured |
| Access                  | Public production approved by the owner; protected previews                              |

Vercel has confirmed the 0.2 deployment is READY. Hosted HTTP checks passed for registration, atomic answer/checkpoint scoring, bookmarks, appearance, and one-time recovery-code password reset. Recovery preserved the same user ID, attempt, bookmark, active practice, and theme; revoked the old session; allowed the new password; left nine unused codes; and rejected reuse of the consumed code. Live browser sign-in after recovery also passed. The production request scan found zero HTTP 500-or-higher responses in the preceding 15 minutes. Synthetic update-test accounts were removed; no real learner account was reset or targeted for cleanup. Local browser checks covered theme previews, timer movement, password visibility, and immediate practice feedback. See [VERIFICATION.md](VERIFICATION.md) for the exact boundaries and monitoring limits.

Hosted migrations 2 (appearance) and 3 (recovery-code hashes) were applied additively using Vercel's production environment runner. Existing accounts and history were not replaced. The initial 30 October deployment was `dpl_8sZynD9k3P1HEpwnnN4hMCiMPVpv`; it is retained as historical release information rather than the current version.

Local accounts and progress under `.data/` are separate from the hosted database and are not automatically copied. New hosted users create their accounts on the canonical production origin.

Use only [labsprint.vercel.app](https://labsprint.vercel.app) for learners. Authentication trusts that canonical origin; the automatic project alias is not configured as an additional sign-in origin.

## Files and secrets

The 0.2 upload used an explicit allowlist of 61 source/configuration files. No book PDFs, extracted text, `.data/`, or `.env` files were uploaded. `.vercelignore` also excludes private/generated files for future CLI deployments. Review this file whenever adding data or tooling to the project.

Vercel holds these production variables; their values must remain private:

| Variable             | Purpose                                                         |
| -------------------- | --------------------------------------------------------------- |
| `DATABASE_URL`       | Hosted PostgreSQL connection, with provider-required encryption |
| `BETTER_AUTH_SECRET` | Random authentication secret                                    |
| `BETTER_AUTH_URL`    | Exact canonical HTTPS production origin                         |

Do not print credentials, copy production values into `.env.example`, or commit pulled environment files. The local setup works without cloud environment variables. Keep `DATABASE_URL` unset when you intend to use embedded local PGlite.

Preview deployments do not have access to the production database. If preview application testing is needed, provision a separate test database and secret and configure the exact preview origin. Do not trust arbitrary origins or disable authentication/origin protection to make previews work.

## Future deployments

The local checkout is already linked through `.vercel/project.json`, which stays ignored. From the folder containing `package.json`, use the owner's authenticated Vercel account:

```powershell
npm exec --yes --package=vercel@65.8.0 -- vercel deploy --prod --scope joreenns-projects
```

Verify that the linked target is `labsprint` in `joreenns-projects` before deploying. The CLI uploads the current source; there is no Git push that automatically releases this project yet. Do not upload `.data/` or source PDFs.

The build command is `npm run build`, using Webpack and self-hosted fonts. Run the local checks in [QUALITY.md](QUALITY.md) before releasing changes. Keep production database credentials out of preview environments.

## Database changes

Hosted migrations 1–3 are applied, including additive appearance and recovery-code storage. For future schema changes, add a numbered migration without rewriting previously deployed migrations. Apply it to the intended target before serving code that depends on it.

The confirmed initial production command was:

```powershell
npm exec --yes --package=vercel@65.8.0 -- vercel env run --environment production --scope joreenns-projects -- npm run db:migrate
```

Confirm the linked project/team before rerunning this command. It injects the selected production environment for the migration process; do not print the injected values. A write-only authentication secret is not needed by this migration.

Running `npm run db:migrate` directly uses `DATABASE_URL` from the current process, `.env.local`, or `.env`; if absent, it migrates the local embedded database instead. Never assume this bare command targets production. Stop a local server before migrating its embedded database. Do not disable certificate verification to resolve a connection error.

## Hosted acceptance checks

- Create an account on the canonical production origin and sign out/back in.
- Answer a question, bookmark another, refresh, and confirm history persists.
- Use the same account on a phone or iPad to check shared progress.
- Use a second account to check that histories and bookmarks remain separate.
- Redo a missed question and confirm first-attempt accuracy is preserved.
- Check all option rationales and the source reference.
- Check phone/tablet layouts and keyboard navigation.
- Confirm unauthenticated user-data requests are rejected.
- Confirm production has public access while previews remain protected.
- Review deployment/build/runtime logs after release.

These are acceptance steps, not claims that every hosted check has already passed.

## Operational limits

The test edition contains 56 original starter questions and is not comprehensive or independently expert-validated exam coverage. Standalone Strasinger and Rodak source files remain pending. Philippine Medtech Laws questions require verified current Philippine primary sources. Password recovery uses saved one-time codes; the owner chose this approach instead of configuring an email-sending domain. Optional email plumbing remains disabled without provider credentials and a verified sender. Full offline practice, account deletion, backups policy, and content administration remain future work. Use provider backup options as progress becomes important.

Anyone who receives the public production link may register. Each account's stored progress remains private to that account. Sharing the URL is not an invitation-code access control mechanism.
