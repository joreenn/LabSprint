# LabSprint

A self-paced Medical Laboratory Science reviewer for MTAP, mockboards, and board-exam preparation. Choose any subject, answer touchscreen-friendly multiple-choice questions, and learn from the rationale for every option.

This is a test project with a deliberately small, source-checked starter question bank. It is not a complete exam syllabus or a prediction of passing an examination.

## 31 October update

Version 0.2.1 improves laptop and phone readability with a shared relative type scale, larger practice text, responsive cards, and larger touch controls. See the [typography update](docs/TYPOGRAPHY-2026-10-31.md) and [current release checkpoint](docs/WORK-STATE.md).

The 0.2 update adds faster answer and next-question interactions, 20 previewable color palettes and custom gradients, optional study timers, password visibility, and account recovery with saved one-time codes. The bank now contains 56 original questions. See the [update notes](docs/UPDATES-2026-10-31.md) for behavior, migration details, and verification status.

Version 0.2 is live on the canonical production address. The production build passed, the hosted additive migrations were applied, and the live API recovery smoke test preserved the same account and its study records. See the [verification record](docs/VERIFICATION.md) for the exact test counts and remaining device/monitoring limits.

## Hosted project

LabSprint 0.2.1 is live at [labsprint.vercel.app](https://labsprint.vercel.app). Production deployment `dpl_FuymBRnh5M893wfTFFzZSHMdw4VK` is READY. Hosted API checks for version 0.2 passed for registration, atomic answer/checkpoint saving, bookmarking, appearance saving, and recovery-code password reset with history preserved. Local browser checks covered personalization, timer, password visibility, immediate practice feedback, and the typography update. See the [verification record](docs/VERIFICATION.md).

Vercel project `labsprint` is configured in `joreenns-projects`, with a production-only Neon Free database named `labsprint-db` in Singapore (`sin1`). Hosted migrations include the additive appearance and recovery-code changes, and authentication/database secrets are configured in Vercel. Production has public access as approved by the owner; previews remain protected. Source is versioned in [joreenn/LabSprint](https://github.com/joreenn/LabSprint). Vercel deployments currently use source uploads; automatic Git deployments are not configured. See [deployment details](docs/DEPLOYMENT.md).

Local accounts and practice history are not copied into the hosted database. Create a new account on the hosted address, then use that same account on your other devices.

## Run locally

Use Node.js 24 LTS and npm. From this project folder:

```powershell
npm install
npm run db:migrate
npm run dev
```

Open the local URL printed by Next.js, normally `http://127.0.0.1:3000`. Create an account with your name, email, and password. No Google account is required.

The local database is real PostgreSQL through embedded PGlite, persisted under `.data/db`. A random local auth secret is generated in `.data/auth-secret`; keep that file private. No environment configuration is needed locally, and the app initializes its schema automatically on first use. The explicit migration command above is also available for setup checks. This does not install a Windows database service. Local use does not require changing your firewall, antivirus, or Windows security settings. The development server binds to your PC's loopback address; use the hosted address for phone and iPad access. Keep `DATABASE_URL` unset for local-only work; a configured value changes the database target.

Do not run two server processes against the same local database. Stop the development server before applying migrations or running another server. Do not edit `.data/` files by hand.

## What to try

- Register, sign out, and sign back in.
- Choose any of the seven subject groups or mix subjects.
- Answer recall and case-based questions without a timer.
- Read the correct-answer explanation and the rationale for each distractor.
- Bookmark questions, revisit mistakes, and flag unclear content.
- Check subject/topic accuracy, coverage, and progress over time.
- Set optional exam dates and resume an unfinished session.
- Preview a dashboard and practice screen in a new palette before applying it; customize two colors or use a single color instead of a gradient.
- Open the optional floating study timer, choose a technique, and drag or minimize it when it is in the way.
- Save your one-time recovery codes from Preferences before you need account recovery.

Each signed-in user has separate progress. The hosted PostgreSQL database lets the same account access saved progress from another device. Localhost on a second device is a different machine and does not provide that sync.

Appearance preferences also follow the signed-in account. Study-timer state and position stay on the current device and are isolated by account. Unsynced practice answers are stored in an account-specific retry queue, with visible saving or retry status; this is not a complete offline mode.

## Keep access to your progress

The sign-in screen can show or hide the password. Account recovery uses one of 10 high-entropy, one-time recovery codes. Generate and save the codes while you can still sign in; generating a new set requires password reauthentication and replaces the previous set. The database stores hashes, and the plain codes are offered for copying or downloading at creation time.

Use **Forgot password?** with your email and an unused code to set a new password. Recovery keeps the same user ID and study history and revokes existing sessions. A code is a credential: keep the downloaded file private and separate from this repository. Existing users are prompted to set up recovery from the dashboard. Losing both the password and all saved codes cannot be repaired through this recovery flow.

Email delivery plumbing is optional and disabled without a configured provider and verified sender. Do not expect password-reset emails in this setup; the owner chose saved recovery codes for the current release.

## Technology

- Next.js 16, React, and TypeScript
- Responsive CSS, Lucide icons, and self-hosted DM Sans/Manrope fonts through Fontsource
- Better Auth email/password authentication and sessions
- Drizzle ORM with one PostgreSQL schema
- PGlite for local development; PostgreSQL through `DATABASE_URL` for Vercel

Drizzle replaces the initially proposed Prisma setup so the local embedded PostgreSQL database and the hosted database can share the same schema. The interface uses focused CSS rather than the initially suggested Tailwind/shadcn setup. Font files are included through dependencies instead of fetched from Google at runtime. The Next.js scripts use Webpack to avoid requiring Windows symlink privileges for the development/build workflow. Node.js 24 is pinned for hosting. The initial deployment uses the Neon Free database plan.

## Check the project

```powershell
npm run typecheck
npm test
npm run build
```

These are the checks to run, not a claim that they passed in every environment. See [QUALITY.md](docs/QUALITY.md) for acceptance criteria and verification boundaries.

## Project guide

- [Product brief and decisions](docs/PRODUCT.md)
- [Reference sources and content review](docs/REFERENCES.md)
- [Vercel deployment](docs/DEPLOYMENT.md)
- [Quality checklist and test guidance](docs/QUALITY.md)
- [Completed verification and preview](docs/VERIFICATION.md)
- [31 October update notes](docs/UPDATES-2026-10-31.md)

The interface entry point is `src/components/reviewer.tsx`. Its named modules under `src/components/reviewer/` separate sign-in, practice, dashboard/progress views, shared controls, dialogs, and client API handling. Question content lives in `src/content/`; scoring and persistence stay on the server under `src/lib/server/` and `src/db/`.

Book PDFs, extracted book text, passwords, and environment secrets must not be committed or deployed. Only original practice questions and their source metadata belong in the application.

## First-version boundaries

Internet access is required to load the hosted reviewer and sync results. Full offline practice is a future enhancement. There is no timed exam mode, public leaderboard, or verified prediction of exam readiness. The floating study timer is optional and never imposes a question deadline. Email verification and email recovery delivery are not configured; use the saved one-time recovery-code flow instead. The deployment link allows anyone who receives it to register, so sharing the link is not an access-control mechanism.

The bank remains limited and requires independent MLS expert review. Standalone Strasinger and Rodak reference files have not been supplied; their suggested coverage remains pending source access and verification. Supplied Hubbard, Elsevier, Linne & Ringsrud, and Lehman/SUCCESS! material supports the added questions alongside the existing Harr, Ciulla/SUCCESS!, Apollon, and Alba sources. No source PDFs are deployed.
