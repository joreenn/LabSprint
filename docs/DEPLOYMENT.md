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
| Current release         | LabSprint 0.4.2, 11 November 2026                                                        |
| Current deployment      | `dpl_BsDUYV4YU5iqySkALZfqjXMrAB1F` — READY and promoted                                  |
| Source commit           | `6ec56ee7d995d42e7be9c30dde00ba597acb0813`                                               |
| Source integration      | Direct source upload from versioned source; automatic Git deployments are not configured |
| Access                  | Public production approved by the owner; protected previews                              |

Vercel confirmed the current deployment is READY with the canonical alias and matching source commit. Anonymous HTTP and served-asset checks confirmed 450 question stems (408 existing and 42 new), the 42 new IDs, and version 0.4.2. All 47 local tests, TypeScript, formatting, content checks, and the production build passed. A disposable local production account verified the new bilirubin question, its saved correct version-1 answer, all explanations, and Jarreau page 132. A 390-pixel viewport had no horizontal overflow. No production account/progress writes were performed. See [the current checkpoint](RESUME-V042.md) for exact boundaries and [VERIFICATION.md](VERIFICATION.md) for historical recovery evidence.

Hosted migrations 2 (appearance), 3 (recovery-code hashes), and 4 (recovery-accounting index) were applied additively using Vercel's production environment runner. Migration 4 was verified during the 0.4.1 release and was not repeated for this content-only release. Existing accounts and history were not replaced. The initial 30 October deployment was `dpl_8sZynD9k3P1HEpwnnN4hMCiMPVpv`; it is retained as historical release information rather than the current version.

Local accounts and progress under `.data/` are separate from the hosted database and are not automatically copied. New hosted users create their accounts on the canonical production origin.

Use only [labsprint.vercel.app](https://labsprint.vercel.app) for learners. Authentication trusts that canonical origin; the automatic project alias is not configured as an additional sign-in origin.

## Files and secrets

The 0.4.2 upload used an explicit allowlist of 74 source/configuration files exported from the committed source. No book PDFs, extracted text, local data, credentials, audit artifacts, or local skills were uploaded. `.vercelignore` also excludes private/generated files for future CLI deployments. Review this file whenever adding data or tooling to the project.

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

The test edition contains 450 original questions. It is not comprehensive or independently expert-validated exam coverage. See the source-audit records for checked pages and limitations. Philippine Medtech Laws questions require verified current Philippine primary sources. Password recovery uses saved one-time codes; the owner chose this approach instead of configuring an email-sending domain. Optional email plumbing remains disabled without provider credentials and a verified sender. Full offline practice, account deletion, backups policy, and content administration remain future work. Use provider backup options as progress becomes important.

Anyone who receives the public production link may register. Each account's stored progress remains private to that account. Sharing the URL is not an invitation-code access control mechanism.
