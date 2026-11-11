# Study streak checkpoint

The redesigned streak is live at [labsprint.vercel.app](https://labsprint.vercel.app). Overview and Progress show the current streak, best streak, and seven device-local calendar days of activity. Wrong answers and repeats count; a second answer on the same day does not extend the streak. Yesterday's streak stays active through today, and missing a full day does not erase the best streak.

The first server-confirmed answer of a day during practice opens the celebration. It shows the flame, streak count, and weekly activity for 4.5 seconds, then returns to Overview. There is no close icon. Escape can return early, and reduced-motion preferences disable the decorative animations. A second answer, refresh, or replay of an already-known answer does not celebrate again. The saved session and daily question goal still use existing persistence.

Theme and palette controls are under Preferences, in the appearance card. The top bar keeps the study timer and mobile library access.

No schema migration or external settings change was needed. The security audit checkpoint is separate and untouched.

Verification passed: all 13 progress tests, formatting, and the production build including TypeScript. Browser checks used the isolated `tmp/streak-redesign-preview-data` database. At 390px, a wrong first answer saved, opened the dialog with no close button, and returned to Overview automatically. Resume opened question two with 1/5 answers saved; the second saved answer stayed in practice without another celebration. The seven-day card rendered on Overview and Progress, and Preferences contained the dark-mode and palette controls. At 320px in dark mode and at desktop width, no horizontal overflow was observed. The browser warning/error log was empty. Mobile Overview screenshot: `docs/screenshots/streak-overview-phone.jpg`.

Publication complete. Runtime commit [d6f7a36](https://github.com/joreenn/LabSprint/commit/d6f7a369017f68971fde01bf07b3dd86b3616271) was pushed to `main`. Vercel deployment `dpl_Bqtvc84dTA2cBtz2AgGFrhgVREkJ` reached READY with the canonical production alias and matching source metadata. Only committed app and configuration files were uploaded.

Read-only live checks returned HTTP 200 for home and the session endpoint, and HTTP 401 for anonymous workspace access. The served assets contain the celebration, timer styling, and relocated appearance controls. The deployment's short log scan showed two PostgreSQL driver SSL compatibility notices classified as errors because they were written to stderr; the session endpoint responded successfully. No production account or progress writes were performed. No implementation or deployment work remains for this update.
