# Sequencing schema compatibility — 26 October 2026

Base master: 2f2232fc74de417ebf29e3feb33246bbf8980325. Tasks 02/03 are already merged; this change addresses the concrete regression reported by Task 08 / PR63.

The list ORDER BY and direct-completion sibling SELECT referenced topics.sequence_rank as a mandatory physical column. The deployed application does not run schema.sql automatically. The previous assertion that merging applies the additive migration was wrong.

Both read queries now extract the optional rank from to_jsonb(topic row), casting the present value to numeric. Before migration the absent JSON key yields NULL and legacy order/access applies. After migration existing rank behaviour is retained. No migration, DDL or placement write runs from an application request. Existing scope/PIN/pass checks are unchanged.

Added real-PostgreSQL route regression: remove the optional column on the disposable test database, verify lesson list and direct-completion PIN/predecessor guards, restore the nullable column in finally, verify unchanged access. The rest of the sequence suite still checks actual approved apply/rollback and rank ordering.

Local execution service is unavailable in this turn. CI with PostgreSQL16 is required; no local test pass is claimed. No production target was contacted, no placement activated, and no production migration/deployment is claimed.

Remaining separate items: reusable Ọya passage; sequencing activation inputs D6/D7/placement response; final source+DB acceptance; actual historical protected-row comparison; staging/device and authorised production release. This patch does not close those gates.
