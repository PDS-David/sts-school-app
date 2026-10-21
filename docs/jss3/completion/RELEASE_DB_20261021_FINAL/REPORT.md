# RELEASE-DB — final-candidate verification, 21 October 2026 (PASS)

This verifies the current final candidate. Earlier A1, R2 and TEACHER1 database runs are completed history and are not described as unimplemented. This run supplements them; it does not recreate the missing R2 `runner.log`.

## Tested commit
- **Tested commit (master at start, full SHA): `a1db3dc3a23017bbb305cce4d8422ff7c4158b67`** (merge of PR #22). Re-fetched immediately before publication: master was unchanged.
- Tested tree was clean master: no code, test, schema or generator change was made, so no rerun after a fix was needed.
- **Changes after the tested commit:** only this evidence folder, `docs/jss3/completion/RELEASE_DB_20261021_FINAL/` (documentation and sanitised logs). No runtime, test or script file changed. A report cannot contain its own commit hash; the merge commit records it.

## VERIFIED (observed, this run)
- Input archive `JSS3_NEXT_STAGE_INPUTS_20261016.zip` SHA-256 `0a5b0d929e1dc61801cde43f8a85235d2e236ced334d2091583f5fa16524ea3c`, identical to R2. Its internal `SHA256SUMS` was checked in full with `sha256sum -c`: every entry OK. The runner also hash-checked the 39 source documents and the packaged 313-row capture.
- Command (default DB-required mode, fresh output dir): `python3 scripts/jss3/run_acceptance.py --archive <zip> --output <new dir> --database-url-env JSS3_LOCAL_TEST_DATABASE_URL`. Exit 0, **ACCEPTANCE.json = PASS**, `production_actions: false`. All 12 runner stages exit 0.
- Seven real-source DB suites, serial, **59 tests, 59 pass, 0 fail, 0 skipped, 0 cancelled**: topic-assets 18/18; batch2-assets 3/3; delivery-correction 10/10 (both V3 delivery-correction samples); v1-business 4/4; v2-math-assets 5/5; v3-science-assets 14/14; v3-science-ci 5/5. Per-suite counts in `RESULTS.json` are parsed from the committed logs.
- Real capture, not mocks or SQLite/PGlite: **313 original rows preserved**, all original row objects exactly equal, capture stdout matches the unmodified importer. Current supplement rows **170** (483 total; 1st Term 234, 2nd Term 249); 0 Computer Studies rows. Counts reflect current definitions, not historical totals.
- Cleanup: exact `count(*)` over every public table after the run shows only `schools` = 2 (seed rows from `backend/schema.sql`); no test rows remain. Repository working tree had no untracked or modified files after the run (no private-source bytes leaked into the tree).

## Note on skips
`ACCEPTANCE.json` lists six `corpus_skips`. They are the DB-gated tests inside the no-database corpus stage, skipped by design; the same suites executed in the seven DB stages with zero skips.

## Environment
Ubuntu 24.04.4 container (root); PostgreSQL **16.15** from Ubuntu apt, fresh cluster, `listen_addresses=127.0.0.1`, port 55432, scram-sha-256, database `jss3_test_acceptance`, test-only password; Node **v24.19.0** from the npm `node-linux-x64` package (host Node was 22.22.2); Python venv with `scripts/jss3/acceptance-requirements.txt`; `npm ci --ignore-scripts`. No Docker. `--tsx-no-ipc` not needed. The disposable cluster was removed after evidence was saved.

## IMPLEMENTED
Nothing. No implementation defect was demonstrated, so no fix was made.

## NOT RECOVERED / unchanged
The R2 `runner.log` (expected SHA-256 `f5cdac41…07ff15` in `../RELEASE_DB_20261021_R2/SHA256SUMS`) is still absent from Git and was not available to this run. It is not synthesised. This new pass does not replace it.

## NOT PERFORMED (outside this task)
Production import, migration or deployment; phone acceptance (DEVICE1); teacher decisions (TEACHER1); protected 2,179-row baseline comparison (BASELINE2); sequence policy (SEQUENCE2); any next task.

## Evidence in this folder
`RESULTS.json` (sanitised summary), `ROW_PRESERVATION.json`, `logs/` (11 sanitised stage logs), `SHA256SUMS`. Not committed: the input ZIP, staged source documents, `original-rows.json`, `supplemented-rows.json` and the importer dry-run dumps (private row bodies).
