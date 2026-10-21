# RELEASE-DB — final-candidate refresh, not a repeat of completed R2

## Execution contract (this file is self-contained)

Repository: `https://github.com/PDS-David/sts-school-app`; target branch **master**, never assume main. Read applicable `AGENTS.md`, `docs/jss3/completion/IMPLEMENTATION_STATUS_20261020.md`, and task-specific files below. Fetch current master and record its FULL SHA. Work on an isolated branch/worktree named `jss3/<task>-<date>-<unique-suffix>`. Check whether another agent already implemented this exact task before editing. Do not revert a later change to make an old patch apply.

Owner authorises implementation and publication of tested changes to master. This does NOT authorise production deployment, database import, migration application or deletion of student data. No JSS3 Computer Studies; substantive teaching ends in Second Term. Preserve source provenance, the 313 current original row identities/bodies/order, existing supplement IDs, practical holds, asset hashes/associations and other classes. Clearly label new equivalent teaching. Do not guess school decisions, source symbols or certification. No cosmetic UI redesign.

Use Node **24.19.0** and the lockfile. From repository root:
```bash
npm ci --ignore-scripts
python3 -m pip install -r scripts/jss3/acceptance-requirements.txt
```
Use a virtual environment if required by the host; activate it so `python3` resolves to that environment. LibreOffice is needed ONLY if your task renders original documents, not for ordinary acceptance. Do not run scripts extracted from an attachment automatically; the runner uses repository scripts and treats the ZIP as data.

For a corpus test, attach the exact file **JSS3_NEXT_STAGE_INPUTS_20261016.zip**. Its outer folder contains ALL/, SOURCE_INVENTORY.csv, scheme_only_integration_manifest.csv and portable_verification/capture/original-rows.json. The runner stages only the 39 inventoried documents, checks their hashes and verifies the packaged historical capture checksum. No older worker ZIP is needed. Keep private originals, full row dumps, tokens and student data out of Git.

Corpus command, from repository root (set INPUT_ZIP to the actual attachment path):
```bash
INPUT_ZIP=/absolute/path/JSS3_NEXT_STAGE_INPUTS_20261016.zip
python3 scripts/jss3/run_acceptance.py --archive "$INPUT_ZIP" --output "$PWD/task-evidence-before" --without-db
```
Exit **2 / INCOMPLETE** is expected here only when corpus checks passed and DB checks were deliberately omitted. Read ACCEPTANCE.json; a BLOCKED or FAIL is different. If tsx IPC is denied, use a NEW output directory and add `--tsx-no-ipc`, recording the reason. Do not reuse an output directory. The runner sets all source/capture variables, including M2 and V1; do not omit them manually. For changes to lesson bodies, capture before/after, identify the exact intended supplement changes, and regenerate `IMPLEMENTED_LESSONS.csv` and the schedule with repository generators. Never re-pin assertions merely to match new output.

Deliver actual implementation plus a short `docs/jss3/completion/<TASK_ID>/REPORT.md`: base/final SHA, changed files, commands, environment, observed results/skips, exact remaining inputs. Keep tests in tests/ and reusable tools in scripts/jss3/. Preserve a checkpoint before lengthy work. Report IMPLEMENTED, VERIFIED, BLOCKED and NOT PERFORMED distinctly. A draft/report alone is not a completed app feature.

Publication: fetch again, integrate intervening master changes, rerun affected checks, and push your branch. Use the GitHub connector or authenticated Git/gh. Open a PR with the report, wait for required CI, and merge to master without force after verifying the PR head/current master. Verify the remote master SHA contains your changes. If credentials are unavailable, still finish local work; provide a binary-capable `git format-patch`, git bundle, checksummed delivery ZIP and exact base/apply commands. Do not ask for tokens in chat or call an unpushed commit fetchable. Never claim master publication until verified.

## Do not repeat completed A1

A1 was completed in master `8e83573065ff5895124a620fe84ba1ce8cda35bc`: V3 14/14; V1 4/4; Batch2 assets3/3; V2 5/5; delivery8/8; topic-assets18/18, all zero skips. Its 11 evidence checksums were re-verified. Do not assign this prompt as unfinished A1. Run it only when preparing a new release candidate or after a relevant later implementation change.

## Required inputs and scope

Attach **JSS3_NEXT_STAGE_INPUTS_20261016.zip**. Repository files: `scripts/jss3/run_acceptance.py`, `tests/jss3-{batch2-assets,delivery-correction,v1-business,v2-math-assets,v3-science-assets,v3-science-ci}.db.test.mts`, `tests/topic-assets.db.test.mts`, `backend/schema.sql`. No production credentials. No teacher answers are needed.

V3's CI database test uses synthetic row text with canonical binding identities; it proves attachment and access behaviour, not original-source body fidelity. This task must use the REAL capture generated by the runner, and run all seven suites, including both V3 delivery-correction samples.

## Execute

Create a disposable local PostgreSQL 16 instance/database. Example if Docker is available (test-only password):
```bash
docker run --name jss3-db1-test -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=test_only_password -e POSTGRES_DB=jss3_test_acceptance -p 127.0.0.1:55432:5432 -d postgres:16
docker exec jss3-db1-test pg_isready -U postgres -d jss3_test_acceptance
export JSS3_LOCAL_TEST_DATABASE_URL='postgres://postgres:test_only_password@127.0.0.1:55432/jss3_test_acceptance'
python3 scripts/jss3/run_acceptance.py --archive "$INPUT_ZIP" --output "$PWD/task-evidence-db1" --database-url-env JSS3_LOCAL_TEST_DATABASE_URL
```
If port/name is occupied, choose an unused one; do not remove an unrelated container. Wait for pg_isready success before the runner. A native LOCAL PostgreSQL installation is also acceptable. The database name must start `jss3_test_`; query parameters and remote hosts are rejected. Do not substitute SQLite, mocks or PGlite for this PostgreSQL acceptance.

The runner executes DB suites serially to avoid schema-creation races, requires zero skipped DB tests and preserves logs. Correct failures in actual code/tests after establishing their cause. Validate dry-run/no writes, attachment idempotence, title/hash guards, metadata update consent, 17 V3 bindings/13 displayed instances, hidden-source rejection, authenticated bytes, cross-class rejection, and stale assessment/summary invalidation. Counts must agree with the current definitions; do not force historical totals after unrelated later changes.

## Completion gate

ACCEPTANCE.json must say PASS; all seven DB log summaries must show zero failures AND zero skips. Capture remains 313 originals preserved; record actual supplement counts. Cleanup assertions must leave no test rows. Save sanitised summary, not private captures. If PostgreSQL cannot run, report BLOCKED with the actual platform error; do not claim DB1 complete. Provide a working runner/CI improvement if feasible. Remove only the container you created after saving evidence. Publish tested fixes/evidence to master.

## Updated 21 October: completed runs and packaging defect
RELEASE_DB_20261021_R2 reports PASS:59/59 across seven suites at a1cfcb1. TEACHER1 reports a later seven-suite PASS including owner-directed changes. Do not call RELEASE-DB unimplemented. R2 RESULTS.json checksum verifies, but its SHA256SUMS references runner.log absent from Git. Recover that exact log from the worker/package and verify expected SHA256, or document unavailable historical evidence; never synthesize it. For a new final-candidate run, commit fresh sanitised logs using git add -f when needed and verify every checksum path. A new pass supplements but does not recreate the missing old log.

Owner's Windows Docker Desktop was shown Engine running. Creation/readiness of jss3-release-db has NOT been confirmed. Docker on the owner's PC is not accessible from a cloud agent. A local agent or owner-operated commands must run the tests on that PC; prefer Linux/WSL2 with Node24.19/Python and the repo. Do not tell the owner that installing Docker grants this chat access. Do not expose PostgreSQL publicly; use 127.0.0.1 and a disposable database. Confirm docker version Client AND Server and pg_isready before testing.
