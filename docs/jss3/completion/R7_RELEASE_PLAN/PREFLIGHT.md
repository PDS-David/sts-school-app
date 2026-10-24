# R7 — preflight, apply, postflight commands (NOT EXECUTED)

> Nothing here has been run against production or any staging copy. Part B (apply) may be executed **only** by the assigned release operator after the owner has completed PLAN §9. Placeholders in `<ANGLE_BRACKETS>` are unknown and must be supplied by the owner/operator; none are guessed. Commands are for a POSIX shell; translate for PowerShell as needed (the repository's runbooks give both).

## 1. Ground rules
- Secrets only via environment variables or a secret store, set **in the operator's shell for that command only**. Never in Git, chat, logs, URLs or this repository. Keep all outputs under a private `$PRIV` directory **outside** the repository; commit nothing from it (no dumps, row exports, tokens).
- Production is touched **read-only** until Part B, with `PGOPTIONS='-c default_transaction_read_only=on'` and a SELECT-only role (`<RO_ROLE>`). `db:check-drift` is excluded from production because it creates a throw-away schema (PLAN §3.2).
- Stop at the first unexpected output. Do not "fix" the target; report.
- Libpq settings for read-only inspection (password via `PGPASSFILE` or prompt, never on the command line):
  ```
  export PGHOST=<PROD_DB_HOST> PGPORT=<PROD_DB_PORT> PGDATABASE=<PROD_DB_NAME> PGUSER=<RO_ROLE>
  export PGOPTIONS='-c default_transaction_read_only=on'
  # Managed DB requiring SSL: also export PGSSLMODE=<SSL_MODE>
  ```
- Target assertion — run before **every** session that can write; the printed database name and server must equal what the owner approved:
  ```
  psql -X -qAt -c "select current_database(), current_setting('server_version'), inet_server_addr()"
  # expected: <PROD_DB_NAME> | <PG_VERSION> | <PROD_DB_ADDR>   → anything else: STOP
  ```

## 2. Pin the candidate and prepare tooling
```
git fetch origin
git checkout --detach <CANDIDATE_SHA>
test "$(git rev-parse HEAD)" = "<CANDIDATE_SHA>" && test -z "$(git status --porcelain)" && echo PINNED
node --version            # expect v24.19.0
npm ci --ignore-scripts
python3 -m venv .venv && . .venv/bin/activate && pip install -r scripts/jss3/acceptance-requirements.txt
```
Record `<CANDIDATE_SHA>` (full 40 hex) in the approval statement. The asset files used in W3 come from this checkout (`curriculum-assets/jss3`).

## 3. Backup (W0) — read-only on production
The owner designates `<BACKUP_METHOD>` and `<BACKUP_LOCATION>`. Required evidence before any write, recorded in `$PRIV/backup_evidence.json` (fields, not content): `backup_id`, `method`, `location`, `taken_utc`, `completed_utc`, `database_name`, `size_bytes`, `sha256` of the artefact, `taken_by`, and `restore_rehearsal_ref` (§4). If the method is a logical dump, an example the owner may adopt (tool and flags are the owner's decision):
```
pg_dump --format=custom --no-owner --no-privileges --file="$PRIV/<BACKUP_FILE>" "<PROD_CONNINFO_FROM_PGENV>"
sha256sum "$PRIV/<BACKUP_FILE>"
pg_restore --list "$PRIV/<BACKUP_FILE>" > "$PRIV/backup_toc.txt"     # must list topics, topic_completions, topic_assets, submissions, assessments, students
```
A backup with no completed restore rehearsal is **not** accepted as a rollback basis.

## 4. Restore rehearsal on an isolated copy (never on production)
Restore to a database whose name matches `staging_*`, `stg_*`, `jss3_staging_*` or `jss3_test_*`, on a host that is not production and not shared (see `STAGE1/RUNBOOK.md` §1):
```
createdb <STAGING_DB_NAME>
pg_restore --no-owner --no-privileges --exit-on-error -d <STAGING_DB_NAME> "$PRIV/<BACKUP_FILE>"
```
Then, with the libpq variables pointed at the copy, take the snapshot on **both** and compare:
```
psql -X -qAt --set ON_ERROR_STOP=1 --file docs/jss3/completion/R7_RELEASE_PLAN/snapshot_release_state.sql > "$PRIV/snapshot_prod_at_backup.json"      # production (read-only)
psql -X -qAt --set ON_ERROR_STOP=1 --file docs/jss3/completion/R7_RELEASE_PLAN/snapshot_release_state.sql > "$PRIV/snapshot_restored_copy.json"      # copy
python3 docs/jss3/completion/R7_RELEASE_PLAN/compare_release_delta.py --before "$PRIV/snapshot_prod_at_backup.json" --after "$PRIV/snapshot_restored_copy.json" --output "$PRIV/restore_equivalence.json"
```
Take `snapshot_prod_at_backup.json` **immediately before** the backup starts, so the two snapshots describe the same moment. Expect exit 0 with no additions. If students were active between the snapshot and the backup, production-side `completions` can legitimately exceed the copy's; with production as `--before` and the copy as `--after` that appears as a "completions fell" FAIL — **record that explanation in writing** rather than weakening the comparer, and re-take both at a quieter moment if the difference cannot be explained by activity. Any *content* digest difference is never explained by activity and means the backup is not a faithful basis. The restored copy is the rehearsal target for §6–§9 (PLAN §7).

## 5. Schema state (decides whether W1 is needed)
Do **not** run `npm run db:check-drift` against production. Instead:
```
# (a) what changed in schema.sql between what is deployed and the candidate
git diff <DEPLOYED_SHA> <CANDIDATE_SHA> -- backend/schema.sql > "$PRIV/schema_diff.txt"
# (b) on the RESTORED COPY only (it creates and drops a throw-away schema there):
DATABASE_URL=<STAGING_DB_URL_FROM_SECRET_STORE> npm run db:check-drift --workspace backend
```
Outcome table to fill: columns/tables/indexes/constraints missing on the copy → W1 needed (list them in the approval statement as `<SCHEMA_DIFF_REF>`); none → W1 not requested. Read-only production confirmation of two columns this release's code needs:
```
psql -X -qAt -c "select column_name from information_schema.columns where table_name='assessments' and column_name='content_fingerprint'"   # expect: content_fingerprint
psql -X -qAt -c "select column_name from information_schema.columns where table_name='topic_assets' and column_name in ('alt_text','displayed','sha256','bytes') order by 1"   # expect 4 rows
```
Also read-only: confirm no duplicate identities exist before any index rebuild would be attempted:
```
psql -X -qAt -c "select count(*) from (select school_code,subject_id,class_name,term_label,order_index from topics where order_index is not null group by 1,2,3,4,5 having count(*)>1) d"   # expect 0
```

## 6. Candidate eligibility (must be true at the pinned SHA — PLAN §8 B4)
```
python3 scripts/jss3/run_acceptance.py --archive "$INPUT_ZIP" --output "$PWD/evidence-r7-$(date -u +%Y%m%d%H%M)" --database-url-env JSS3_LOCAL_TEST_DATABASE_URL
# $INPUT_ZIP = private JSS3_NEXT_STAGE_INPUTS_20261016.zip, SHA256 0a5b0d929e1dc61801cde43f8a85235d2e236ced334d2091583f5fa16524ea3c (verify first: sha256sum "$INPUT_ZIP")
# JSS3_LOCAL_TEST_DATABASE_URL = disposable LOOPBACK PostgreSQL 16, database jss3_test_*; never a production or shared URL. Output directory must be fresh.
```
Required: exit 0 (exit 2 = INCOMPLETE is **not** acceptable here), eight suites, **no** skipped delivery-correction/assessment-cache/asset tests, 313 original rows byte-equal, regenerated `IMPLEMENTED_LESSONS.csv`/teacher schedule committed at the pinned SHA. Also: `npx tsc --noEmit -p backend/tsconfig.json`, `npx tsc --noEmit -p mobile/tsconfig.json`, `node --test tests/*.cjs`. Until this passes the candidate is not release-eligible.

## 7. Importer and asset plan (offline; no database connection)
From `backend/`, with the private archive extracted to `<INPUT>` (never in Git):
```
node --import tsx src/db/ingestTopics.ts --root "<INPUT>/ALL" --school-code secondary --jss3-supplements > "$PRIV/importer-dry.log"
```
Gates on `importer-dry.log` (all must hold; otherwise STOP):
1. `FILE AUDIT PASSED` and message `Dry run only — no database connection`.
2. Only class `JSS 3` appears in the planned rows (no JSS 1/2, no Primary, no `SS 3` normal rows). `grep` the per-class breakdown.
3. 3rd Term has zero JSS 3 instructional rows; no JSS 3 Computer Studies.
4. Supplement lines = 170 (83 first, 87 second) **or** the current count at the pinned SHA, re-observed (`<N_EXPECTED_ADDED_TOPICS>` is derived from this log, not from history).
5. The per-bucket plan contains the original rows first; record the planned row count per bucket for §10.
Asset plan (needs the importer log; recompute totals):
```
python3 scripts/jss3/staging_attach_plan.py --importer-log "$PRIV/importer-dry.log" --assets-root curriculum-assets/jss3 --school-code secondary --class-name "JSS 3" --json-out "$PRIV/attach-plan.json"
```
Expect `0 problems`; the printed per-manifest `--dry-run` commands are the source of the W3 commands. Run **all** of them with `--dry-run` against the restored copy first (they connect to the database but write nothing): zero conflicts, planned inserts = expected.

## 8. Part B — apply (operator, only after PLAN §9 is signed). One step, check, next step.
Before each step: target assertion (§1) and `git rev-parse HEAD` equals `<CANDIDATE_SHA>`. Before **W2**: take the "before" snapshot (§10) immediately beforehand.
```
export DATABASE_URL="$(<SECRET_COMMAND_FOR_PROD_URL>)"     # this shell only; unset after: unset DATABASE_URL
export NODE_ENV=production                                  # ONLY if the managed DB requires SSL (pool.ts SSL switch)
```
- **W1 (only if approved):** `npm run db:migrate --workspace backend` — then re-run the §5 column checks. Measure and record elapsed time.
- **W4 (only if approved):** `<DEPLOY_METHOD>`; build from the pinned checkout: `npm ci --ignore-scripts && npm run build --workspace backend` (runs `tsc -p tsconfig.json`; confirm `backend/dist` contains the JSON data); start per the host (`node dist/index.js`). Record previous release id `<PREVIOUS_RELEASE_ID>` for ROLLBACK §2. Then §9 smoke.
- **W2 (only if approved)**, from `backend/`, the **identical** command as the dry run plus `--yes`:
  ```
  node --import tsx src/db/ingestTopics.ts --root "<INPUT>/ALL" --school-code secondary --jss3-supplements --yes
  ```
  Expected final line: `✓ Inserted <N> new topic row(s); verified <M> identical existing row(s).` If it prints `Existing curriculum differs from audited sequence …` or `Persisted curriculum does not match …`, the transaction rolled back: **stop**, take an after-snapshot, confirm PASS with zero additions, and report to the owner.
- **W3 (only if approved):** for each manifest from `attach-plan.json`, from `backend/`:
  ```
  node --import tsx src/db/attachTopicAssets.ts --manifest "<MANIFEST_CSV>" --assets "<ASSET_DIR>" --subject "<SUBJECT>" --class-name "JSS 3" --term-label "<TERM_LABEL>" --school-code secondary --dry-run
  node --import tsx src/db/attachTopicAssets.ts --manifest "<MANIFEST_CSV>" --assets "<ASSET_DIR>" --subject "<SUBJECT>" --class-name "JSS 3" --term-label "<TERM_LABEL>" --school-code secondary --apply
  ```
  The tool prints the target host before acting: it must equal `<PROD_DB_HOST>`. Never pass `--skip-title-check` or `--update-metadata` unless the owner has reviewed a dry run and approved it in writing.
- After each step: `unset DATABASE_URL`, take the §10 after-snapshot, run the comparer.

## 9. Smoke checks (there is no health endpoint)
- Process up: `curl -fsS "<PROD_API_BASE_URL>/"` → JSON with `"status":"ok"` (proves the process only).
- Authenticated, **read-only**, using an owner-approved synthetic account `<SMOKE_ACCOUNT>` (never a real student): `POST /auth/login` → token; `GET /learning/topics` (query: the class/term filters the app uses) returns the corrected copy for corrected JSS 3 topics (the response text begins `[JSS3 DELIVERY CORRECTION]`, never the audited original); `GET /learning/topics/<TOPIC_ID>/assets` lists the attached assets and `GET /learning/assets/<ASSET_ID>` returns bytes with the expected `Content-Type`. Do **not** call `POST /learning/topics/:id/complete` (writes completions and may call the AI provider) and note `GET /learning/assessments` can retire stale generated assessments as a side effect (PLAN §5.3) — run it only when that is intended.
- If no approved synthetic production account exists (PLAN §8 B9), authenticated smoke is **not performed in production**; it is performed on the restored copy only, and the release relies on the §10 snapshot comparison plus the owner's decision.
- Rehearsal copy: also confirm attribution text accompanies the three third-party lessons and that a corrected topic with a pre-existing generated assessment is retired on first contact.

## 10. Postflight and protected-row comparison
```
# before (production read-only, immediately before W2):
psql -X -qAt --set ON_ERROR_STOP=1 --file docs/jss3/completion/R7_RELEASE_PLAN/snapshot_release_state.sql > "$PRIV/snapshot_before_release.json"
psql -X -qAt --set ON_ERROR_STOP=1 --file docs/jss3/completion/R7_RELEASE_PLAN/preflight_cache_exposure.sql > "$PRIV/cache_exposure_before.json"
# after each write step:
psql -X -qAt --set ON_ERROR_STOP=1 --file docs/jss3/completion/R7_RELEASE_PLAN/snapshot_release_state.sql > "$PRIV/snapshot_after_<STEP>.json"
python3 docs/jss3/completion/R7_RELEASE_PLAN/compare_release_delta.py --before "$PRIV/snapshot_before_release.json" --after "$PRIV/snapshot_after_<STEP>.json" --allow-add-class "JSS 3" --output "$PRIV/delta_<STEP>.json"
```
Pass criteria: exit 0; `added_by_bucket` lists only `secondary | JSS 3 | …` buckets and totals exactly `<N_EXPECTED_ADDED_TOPICS>` after W2 (0 after W1/W4/W3); `rows_before` unchanged otherwise. Asset count rises by exactly the expected W3 total. Additionally run the repository's protected-export path if the owner supplied the R4 inputs (`R4_PROTECTED_COMPARISON/REPORT.md`). Only the JSON verdicts, hashes and counts leave `$PRIV`.
