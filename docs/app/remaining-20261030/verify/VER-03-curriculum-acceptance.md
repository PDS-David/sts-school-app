# VER-03 — Run curriculum acceptance when testing resumes

Status: BLOCKED (owner must re-enable testing) · Depends: VER-01, the owner's source archives · Base: `origin/master` at the pinned candidate
Writes: `docs/app/remaining-20261030/evidence/VER-03.md` only (results and hashes; no source documents)

## Why

The owner has deferred all testing. That deferral covers exactly the evidence this project cannot manufacture: the SS1 package tests are marked "DEFERRED BY OWNER" and skip without `SS1_PLAN`; the JSS3 acceptance runner requires a private archive with a fixed structure and a disposable PostgreSQL 16 database; and the manual states that no whole-app, source-import, database or device acceptance run was performed to write it.

Everything else in this pack can be implemented without running anything. This prompt exists so the deferred step is executable the day the owner re-enables it — and so nobody mistakes "implemented" for "accepted".

## Do (only when the owner re-enables testing)

1. Pin the candidate: record the merge commit SHA and the source archives with their hashes. SS1 archive: `SSS 1-20260507T072431Z-3-001 (1).zip`, SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`. JSS3 archive: `JSS3_NEXT_STAGE_INPUTS_20261016.zip`, SHA-256 `0a5b0d929e1dc61801cde43f8a85235d2e236ced334d2091583f5fa16524ea3c`. Verify both before use; never commit them.
2. SS1:
   - `npm run test:ss1` (from VER-01) with the extracted sources available to the tests;
   - one importer dry run per subject into a disposable database, so the compiler and loader exercise all 21 packages;
   - record per-subject: sources compiled, lessons, assets, coverage statuses, compiler errors, skipped checks.
3. JSS3: `python3 scripts/jss3/run_acceptance.py` with `--archive`, a fresh `--output`, Node `v24.19.0`, and `--database-url-env` pointing at a loopback `jss3_test_*` database. Keep `# skipped 0`; do not lower a gate to make it pass.
4. App: `npm run typecheck`, `npm test`, then the DB suites from VER-01 against a disposable local database.
5. Record failures as failures. Do not edit a test, delete a case, relax a threshold or skip a subject to obtain a green result.
6. Store results under `docs/app/remaining-20261030/evidence/VER-03.md` (counts, hashes, error classes) and keep raw logs, captures and source material outside Git.

## Acceptance

- Every result line states the command, the commit, the environment class and the outcome.
- Any skipped or blocked case is counted and named, not omitted.
- No source document or private capture is committed.

## Do not

- Run any of this before the owner says testing is resumed.
- Use a production or shared database.
- Report CI success as acceptance.
- Change curriculum content to make a test pass.
