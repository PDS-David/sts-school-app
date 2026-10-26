# Sequencing schema compatibility — 26 October 2026

Base master: 2f2232fc74de417ebf29e3feb33246bbf8980325. Tasks 02/03 are already merged; this change addresses the concrete regression reported by Task 08 / PR63.

The list ORDER BY and direct-completion sibling SELECT referenced topics.sequence_rank as a mandatory physical column. The deployed application does not run schema.sql automatically. The previous assertion that merging applies the additive migration was wrong.

Both read queries now extract the optional rank from to_jsonb(topic row), casting the present value to numeric. Before migration the absent JSON key yields NULL and legacy order/access applies. After migration existing rank behaviour is retained. No migration, DDL or placement write runs from an application request. Existing scope/PIN/pass checks are unchanged.

Added real-PostgreSQL route regression: remove the optional column on the disposable test database, verify lesson list and direct-completion PIN/predecessor guards, restore the nullable column in finally, verify unchanged access. The rest of the sequence suite still checks actual approved apply/rollback and rank ordering.

Local execution service is unavailable in this turn. CI with PostgreSQL16 is required; no local test pass is claimed. No production target was contacted, no placement activated, and no production migration/deployment is claimed.

Remaining separate items: reusable Ọya passage; sequencing activation inputs D6/D7/placement response; final source+DB acceptance; actual historical protected-row comparison; staging/device and authorised production release. This patch does not close those gates.

## Observed verification after publication

Code candidate: 87f83cce89d8c4d1d156af914be27f5f135fb967. CI run 40263910877 / job 121381977942 passed on PostgreSQL16. Sequencing suite: 10/10 pass, zero skips, including the missing-column list/direct-completion test. Existing runtime/asset/attribution/first-admin checks and both type checks passed. No production effect is claimed.

Local execution became available with an explicit bash non-login shell in a fresh workspace. Recovered the private JSS3 archive from Library, verified SHA256 0a5b0d929e1dc61801cde43f8a85235d2e236ced334d2091583f5fa16524ea3c, and ran run_acceptance.py with --without-db --tsx-no-ipc on Node24.19.0. Corpus: 400 tests, 391 pass, 0 fail, 9 DB-only skips. Types/static/assets/comparer/runner checks pass. Original 313 row objects exactly equal, 171 supplements, 484 total (235 First / 249 Second / 0 Third / 0 Computer). Capture stdout equals unmodified importer stdout.

Regenerated IMPLEMENTED_LESSONS.csv using the fresh supplemented capture and build_teacher_schedule.py: no Git diff. Focused literature/revision tests: 10/10 pass, no skips. This closes Task03's missing fresh-capture verification, while exact prescribed-book identity remains a distinct source claim.

The combined source-plus-DB acceptance is still INCOMPLETE, not PASS: this workspace maps only UID0, so PostgreSQL cannot run under its required non-root account. CI's synthetic-identity DB passes do not replace the five source-dependent DB suites. The archive is recovered; do not ask the owner to upload it again merely because a prior worker lacked it. Evidence: FINAL_SOURCE_ACCEPTANCE.json and FINAL_SOURCE_ROW_PRESERVATION.json. No private source text/capture is committed.
