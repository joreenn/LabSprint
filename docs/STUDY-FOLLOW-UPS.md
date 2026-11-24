# Study follow-ups checkpoint

Implemented and verified locally; included in the v0.5.0 priorities 2–6 release. See PRIORITIES-2-6-CHECKPOINT.md for publication status.

- **Review queue → Due for review:** a missed answer schedules a follow-up 72 hours after the last miss. An early correction leaves it scheduled. A correct answer at or after the due time clears it, and another miss schedules a new follow-up. The immediate missed list is separate.
- **Practice setup → New questions only:** combines with the subject, topic, and style filters, excludes saved and locally pending answers, and shows the actual eligible pool. The server checks the selection against saved answers before replacing a session. Intentional review lists and explicit single-question reviews keep their existing flow.
- **Progress → Past sessions:** uses account-scoped server pages of eight sessions and loads exact saved answers when a recap is opened. The current session is excluded. Earlier finished and replaced sessions with saved answers can both be reopened; legacy records cannot reliably distinguish them. Viewing a recap does not submit answers. Saved scores stay authoritative if an explanation has changed.

No schema migration, account change, or new dependency. The v0.5.0 streak timing change is documented separately. All 57 tests, formatting, and the production build including TypeScript passed. The server test confirmed that a new-only request with a previously answered question does not replace an existing session, and another account can still start that question.

Browser verification used the isolated `tmp/follow-ups-preview-data` database. On the 390px layout, a prior early correction remained due and a correct scheduled retry cleared it. The new-only switch reduced the 474-question pool to 472 after excluding two previously answered questions. The newly finished recap reopened after refresh; keyboard Tab reached its explanation, and opening it left the saved attempt count at four. There was no horizontal overflow in the phone recap or desktop Overview. The browser warning/error log was empty. Screenshot: `docs/screenshots/past-session-recap-phone.jpg`.

The original feature work changed no production data, schema, settings, or deployment. Current release status is recorded in PRIORITIES-2-6-CHECKPOINT.md.
