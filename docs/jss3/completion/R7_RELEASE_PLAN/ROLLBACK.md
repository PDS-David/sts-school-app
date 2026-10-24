# R7 — rollback plan (NOT EXECUTED; options must be chosen by the owner)

> Nothing here has been run on production. The commands marked *tested* were exercised only on a disposable local PostgreSQL 16 database with synthetic rows (REPORT §3); they have **not** been rehearsed on a restore of the real backup. A rollback is a separate decision from the release decision: the owner (not the operator) chooses between §2, §3 and §4 after seeing the postflight evidence.

## 1. Principles
- **No ad-hoc SQL on production.** Only the scripted paths below, each with a guard.
- **Rolling back is also a write**: take a snapshot first (`snapshot_release_state.sql`) and record counts of `topic_completions`, `submissions`, `topic_assets`, `students` so the cost of the rollback is known.
- **Student progress is the asset to protect.** `topic_completions` and `topic_assets` have `ON DELETE CASCADE` on `topics` (`schema.sql:401,795`); deleting a topic deletes completions for it. This release deletes nothing; only ROLLBACK §3 and §4 can lose progress, and only for the scopes stated.
- Evidence of the pre-release state: `snapshot_before_release.json` + the W0 backup. Without both, do not start the release.

## 2. Code-only rollback (W4): redeploy `<PREVIOUS_RELEASE_ID>` / `<DEPLOYED_SHA>`
Use when the new API misbehaves but the data is fine (smoke failure, error-rate threshold). Command: `<DEPLOY_METHOD_ROLLBACK>` (owner/operator to specify; not invented).
**Ordering rule — read before using:** the third-party attribution and the "withdraw unsafe original" logic live in W4. If W2 has already added the three attributed Yoruba lessons and W4 is rolled back while those rows stay, the older code may serve them **without their credit**, and the pre-release code serves the audited originals for the 65 corrected topics again. Therefore: if W2 is committed, a W4 rollback must be accompanied by either a W3/W2 scoped data rollback (§3) **or** the owner's explicit decision, recorded in writing, to accept that state for `<DURATION>`. Never leave the attributed lessons live on code that does not enforce attribution.
Cache note: lazy retirement may already have replaced `topics.summary` for touched corrected topics and closed their stale generated assessments (PLAN §5.3). Redeploying old code does **not** reopen them; the old code regenerates summaries on demand. Closed assessments are not reopened by any script in the repository; do not hand-edit them.
Verify after: §5 checks.

## 3. Scoped data rollback: remove only the rows this release added
Use when W2/W3 committed content the owner now wants out, and the release's own snapshots prove the set. Prerequisites: the after-W2 comparer output (`added_by_bucket`) and per-bucket lowest added `order_index` = (pre-release max `order_index` in the bucket) + 1, from `snapshot_before_release.json`.
Template: `rollback_added_rows.sql.template` (same folder). It selects only `school_code='secondary'`, `class_name='JSS 3'`, and `order_index >= <MIN_ADDED_ORDER_INDEX>` per listed (subject, term) bucket, aborts with `R7 rollback guard` unless the selected count equals `<EXPECTED_ADDED>` exactly, deletes, and leaves the final `COMMIT`/`ROLLBACK` to the operator after reviewing the counts. *Tested* on a disposable database: correct boundary selects exactly the added rows; a wrong boundary (selecting one extra original) is refused by the guard with no deletion.
Consequences to state to the owner **before** choosing it:
- `topic_completions` for the deleted topics are deleted by cascade — students who completed any *new* lesson lose that completion. Quantify first with the `completions` column of the after-snapshot for the added rows.
- `topic_assets` of the deleted topics are deleted by cascade (W3 effects removed); if only assets must go, a separate asset-scoped delete is needed and is **not** provided here (do not improvise).
- `generated_assessment_id` links to deleted topics vanish with the rows; the assessments remain.
- Pre-existing rows in any class are not selected; the postflight must prove it:
  ```
  psql … --file snapshot_release_state.sql > "$PRIV/snapshot_after_rollback.json"
  python3 compare_release_delta.py --before "$PRIV/snapshot_before_release.json" --after "$PRIV/snapshot_after_rollback.json" --output "$PRIV/delta_rollback.json"
  ```
  expect exit 0 with no additions, but note `topic_completions` for pre-existing topics may legitimately have *risen* (live activity); a *fall* is a FAIL.
Sequences: deleted rows leave gaps in `topics.id`; re-running W2 later inserts new ids. That is harmless to the `(school, subject, class, term, order_index)` identity.

## 4. Full restore from the W0 backup (last resort)
Use only if the owner judges the data state corrupted/unsafe and §3 cannot prove a clean state. This **discards everything written after the backup was taken**, including real student activity.
### 4.1 Before deciding
Quantify what would be lost, read-only: counts of `topic_completions`, `submissions`, `students` now (snapshot) versus at backup time (`snapshot_prod_at_backup.json`); the owner decides whether to accept losing that delta or export it for re-entry. Export only aggregated counts to the owner; do not copy student rows into Git or chat.
### 4.2 Procedure (operator, owner-approved)
`<RESTORE_PROCEDURE>` — the owner designates how production is restored (in-place vs. new instance + switch); this plan does not invent it. The procedure must: stop the API (or put `<MAINTENANCE_DECISION>` in effect); restore the backup artefact whose `sha256` matches `backup_evidence.json`; confirm the server version; start the API only after §4.3 passes.
### 4.3 Restored student-progress integrity checks
1. `snapshot_release_state.sql` on the restored database; `compare_release_delta.py --before snapshot_prod_at_backup.json --after <restored>.json` → exit 0, no additions, no removals, no digest changes (identity is by value, so row ids may differ from before only if restore was to a rebuilt table; ids should be preserved by `pg_restore`).
2. `table_counts.topic_completions`, `submissions`, `students` equal their values at backup time (not before-release values, which may be higher).
3. Referential sanity (read-only), each expect `0`:
   ```
   select count(*) from topic_completions c left join topics t on t.id=c.topic_id where t.id is null;
   select count(*) from topic_completions c left join students s on s.id=c.student_id where s.id is null;
   select count(*) from topics t left join assessments a on a.id=t.generated_assessment_id where t.generated_assessment_id is not null and a.id is null;
   select count(*) from topic_assets a left join topics t on t.id=a.topic_id where t.id is null;
   ```
4. Re-run a read-only learner smoke (PREFLIGHT §9) with `<SMOKE_ACCOUNT>`: a topic the account had completed before shows as completed; the next topic's lock/PIN behaviour matches `TERM_PIN_ENFORCED=<VALUE>`.
5. The owner is told, in writing, the exact window of lost activity (backup time → restore time).

## 5. After any rollback
Re-run the PREFLIGHT §9 smoke and the §10 comparison against `snapshot_before_release.json`; write `ROLLBACK_RESULT.md` (what ran, times, counts, verdicts) under `$PRIV` and give the owner the summary. A rolled-back release is not retried without a new approved plan.

## 6. Proposed rollback triggers (owner confirms or changes in PLAN §9)
| Trigger | Proposed action |
|---|---|
| Importer/attach reports an error | none needed (transaction rolled back); stop and report |
| Comparer FAIL on any non-JSS 3 class, or any original row digest changed | stop; owner chooses §3 / §4; no further writes |
| Corrected topic serves audited original, or an attributed lesson shows without credit | §2 **and** §3 (ordering rule) |
| Login or JSS 3 topic list failing for the approved smoke account | §2 |
| 5xx on `/learning/*` above `<ERROR_RATE_THRESHOLD>` for `<OBSERVATION_MINUTES>` | §2 |
| Restored-progress checks fail after §4 | do not reopen the API; owner decision |
