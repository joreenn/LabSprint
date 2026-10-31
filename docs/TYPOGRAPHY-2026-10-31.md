# LabSprint 0.2.1 typography update

Replaces the miniature laptop and phone text shown in the user's screenshots with a shared, relative type scale. Default browser sizes are 16px body and form text, 15px supporting text, 14px navigation/metadata, and 13px captions. Subject titles use 18px. Practice questions scale from 22–28px; answer options use 18px and rationale paragraphs use 16–18px with generous line spacing.

Layouts reflow rather than shrinking text: subject cards use one column on narrow phones, stats use one column below 360px, the palette picker uses two columns on phones, and the narrow progress chart scrolls within its panel. Timer controls, password controls, and navigation have larger touch areas. Light and dark themes share the scale, with darker light-mode secondary text and brighter dark-mode secondary text.

The type scale lives in `src/app/globals.css`. Component styles consume those variables; future additions should use the same roles. Account authentication, question content, scoring, progress persistence, appearance data, and database schema are unchanged.

## Verification

- Browser checks at 1920px and 1366px laptop widths, 740px tablet width, and 390px and 320px phone widths.
- Checked dashboard, subjects, appearance preview, practice setup, answers and rationales, timer, navigation, and progress.
- Measured 16px body text, 18px subject titles and answer options, 22px phone questions, and approximately 16px phone rationale paragraphs.
- Dashboard rendered-text audit found no text below 13px; checked pages had no document-level horizontal overflow. Chart scrolling stays local to its panel.
- A synthetic local account verified sign-in, session creation, answering, rationale display, and saved progress. Browser error/warning log was empty during the check.
- Component review: the two markup changes add a span for the collapsed Preferences label and keyboard focus for the horizontally scrollable chart. No new dependencies, effects, state, or data requests.
- Formatting passed. Production build and hosted status are recorded in `WORK-STATE.md` when complete.

Browser viewport emulation was used; physical-device testing remains for the user.
