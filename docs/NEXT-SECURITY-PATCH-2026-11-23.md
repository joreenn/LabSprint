# Next.js security patch - 23 November 2026

## Change

Upgraded the exact Next.js pin from 16.4.3 to 16.4.6 and updated its matching environment/compiler packages in the lockfile. No React version, application source, database schema, authentication setting, or question content was changed for this fix.

The [vendor November security release](https://nextjs.org/blog/november-2026-security-release) identifies fixes in 16.4.5. The [16.4.6 patch release](https://github.com/vercel/next.js/releases/tag/v16.4.6) includes those fixes and subsequent bug fixes on the same minor line. npm's production audit reported seven advisories against the old Next.js version and explicitly recommended 16.4.6 as a non-major fix. This dependency finding does not establish exploitation of LabSprint or applicability of every advisory to its configuration.

## Verification

- Installed the verified registry package with lifecycle scripts disabled.
- Reviewed the lockfile diff: only Next.js and matching Next environment/platform compiler entries changed.
- Created a disposable verification copy from committed source `ab2398ba7d62c460f84b16306d1cab68e59ce2f4`, replacing only its package manifest/lockfile. This excluded pending study-follow-up features, the 24-question expansion, and unrelated audit work.
- All **53 tests passed**, including authentication/recovery, scoring, persistence, bookmarks, content integrity, progress, outbox, and timer regressions.
- The **Next.js 16.4.6 production build passed**, including TypeScript and page generation, without the previous security fatal error.
- npm production-dependency audit returned **zero known vulnerabilities** at verification time. This is not a full application security audit or a guarantee against undiscovered issues.
- Package formatting and diff whitespace checks passed.
- The nested verification copy caused a workspace-root inference warning because it and the original checkout both contain lockfiles. No application config was changed to hide that staging-only warning.

## Publication checkpoint

Implementation and checks are complete. Commit/push and the production release are pending. Publish only the exact committed app/configuration allowlist. Do not publish pending local features, question additions, audit notes, credentials, databases, or source books. No migration is required.

Local evidence is under ignored `tmp/next-security-patch/`; its verification-stage record identifies the disposable committed-source copy. The separate security audit remains at its existing checkpoint.
