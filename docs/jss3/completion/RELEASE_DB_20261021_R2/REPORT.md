# RELEASE-DB — 21 October 2026, second execution (PASS)

Supersedes the earlier BLOCKED record in `../RELEASE_DB_20261021/`, which stopped only because that host had no PostgreSQL. No production credentials, import, migration or deployment were used or performed.

## Base / final SHA
- Base (master at start): `a1cfcb150b1b57250eb258720d8bef7af07b5ca3`
- Branch: `jss3/release-db-20261021-r2`
- Final SHA: recorded in the PR / merge commit (a report cannot contain its own commit hash).

## IMPLEMENTED
- `docs/jss3/completion/V1_BUSINESS/build_v1_manifests.py`: the two original JPEGs it extracts from the private source `.docx` now go to a temporary directory instead of the tracked `V1_BUSINESS/assets/` folder. Before this, every real-source corpus run left `image3.jpeg` and `image4.jpeg` (private-source bytes) untracked inside the repository, one `git add -A` from being committed. Outputs are unchanged: tracked manifests, bindings CSV and `curriculum-assets/` stayed byte-identical after regeneration, and no assertion or pin was edited.

## VERIFIED (observed, this run)
- `python3 scripts/jss3/run_acceptance.py --archive JSS3_NEXT_STAGE_INPUTS_20261016.zip --output <new dir> --database-url-env JSS3_LOCAL_TEST_DATABASE_URL`, default DB-required mode, exit 0, **ACCEPTANCE.json = PASS**, `production_actions: false`. Run twice: before and after the builder fix (new output directory each time); both PASS.
- Archive SHA-256 `0a5b0d929e1dc61801cde43f8a85235d2e236ced334d2091583f5fa16524ea3c`, identical to the archive used in earlier runs. The runner staged and hash-checked the 39 documents and verified the packaged 313-row capture checksum.
- Seven DB suites, serial, **59 tests, 59 pass, 0 fail, 0 skipped, 0 cancelled**: topic-assets 18/18; batch2-assets 3/3; delivery-correction 10/10 (includes both V3 samples, `V3-BS-FAMILY-TRAITS-V3` replacement and `V3-BS-LIGHT-V3` withheld); v1-business 4/4; v2-math-assets 5/5; v3-science-assets 14/14; v3-science-ci 5/5.
- Behaviours covered by named passing tests: dry run writes nothing; attach idempotence; title/order guard refuses a shifted `order_index`; metadata drift refused unless `--update-metadata`, bytes never overwritten; V3 17 records / 13 displayed / 12 unique; hidden sources not listed or served; authenticated routes return exact bytes; cross-class and cross-school requests rejected; stale assessment/summary not served.
- Capture: **313 original rows preserved**, all original row objects exactly equal; capture stdout matches the unmodified importer. Current supplement rows: **170** (1st Term 234 total rows, 2nd Term 249), 483 total, 0 Computer Studies rows. The historical 41-supplement figure in the input ZIP README is superseded by later work, not forced.
- Cleanup: after the run the test database has 0 rows in `assessments`, `assessment_questions`, `questions` and `topics`. The 2 `schools` rows are seed rows from `backend/schema.sql`. (`pg_stat` live-tuple estimates showed stale non-zero values; exact `count(*)` was used.)
- The V1 builder identity tests (resolves every asset to one row; rejects wrong hash, retitled and missing lesson) ran against the real capture and passed with the patched builder.

## Environment
Ubuntu 24.04 container as root; PostgreSQL 16.15 from apt (`postgresql-16`), cluster started with `pg_ctlcluster`, loopback only, database `jss3_test_acceptance`, test-only password; Node 24.19.0 from the npm `node` package (the host's Node was 22); Python 3.12.3 with `scripts/jss3/acceptance-requirements.txt`; `npm ci --ignore-scripts`. No Docker. `--tsx-no-ipc` was not needed.

## Note on skips
`ACCEPTANCE.json` lists six `corpus_skips`. These are the DB-gated tests inside the no-database corpus stage, skipped by design; the same suites ran in the seven DB stages with zero skips.

## BLOCKED
None.

## NOT PERFORMED (outside this task)
Production import, migration or deployment; phone acceptance (DEVICE1); teacher decisions (TEACHER1); protected 2,179-row baseline comparison (BASELINE1); sequence policy (SEQUENCE2). These need inputs this task does not supply.

## Evidence in this folder
`RESULTS.json` (sanitised summary), `runner.log`, `SHA256SUMS`. Private captures, source documents and the input ZIP are not committed.

## Reproduce
```bash
npm ci --ignore-scripts && python3 -m pip install -r scripts/jss3/acceptance-requirements.txt
export JSS3_LOCAL_TEST_DATABASE_URL='postgres://postgres:<pw>@127.0.0.1:5432/jss3_test_acceptance'
python3 scripts/jss3/run_acceptance.py --archive "$INPUT_ZIP" --output "$PWD/new-evidence" --database-url-env JSS3_LOCAL_TEST_DATABASE_URL
```
