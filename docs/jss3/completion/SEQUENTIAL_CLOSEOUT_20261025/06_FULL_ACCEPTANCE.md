# TASK 06 — Full-source + PostgreSQL acceptance of the actual final candidate

## Common execution instructions (included so this prompt stands alone)
Repository: https://github.com/PDS-David/sts-school-app ; default branch **master**.
The owner has assigned tasks 02 through 08 in sequence. Execute ONLY the task named in this file. The coordinating agent may proceed to the next after reporting this task's result; a separate worker must not start another task. Say `STARTING TASK NN` before implementation, then `TASK NN: COMPLETE`, `PARTIAL`, or `BLOCKED` with evidence before handing over. Never call a blocked task complete.

Start from freshly fetched master, record its full SHA and inspect open PRs. Read applicable AGENTS.md and docs/jss3/completion/NEXT_AGENT_TASKS/EXECUTION_CONTRACT.md. Historical reports describe their own commits; check current code before repeating work. These task-specific instructions supersede contradictory historical work orders, but do not invent owner policy or deployment authority. PR #53 was merged at 94982cbc5e9e2b2d61aa77ff4d2173135b17cca8; this is a reference, not a command to reset current master. Use an isolated branch `jss3/taskNN-YYYYMMDD-unique`.

Implementation, tests, branch publication and a PR are authorised. No production deployment, import, migrations, real-student cleanup or automatic merge is included. Master may auto-deploy: check the release configuration before merging; the owner/integrator must resolve that operation separately. Do not request a pasted token. Use the connected GitHub account or existing secure credentials. If write access fails, deliver a binary-capable patch AND git bundle with base/head hashes and exact apply instructions; do not report an unpublished commit as remotely available. Never force-push master or overwrite another worker's files.

Preserve every original JSS3 row (313 in the current capture), original identities/order/source bytes, other classes, existing completions, practical holds and asset associations. All substantive JSS3 teaching belongs in First/Second Terms; Third Term is BECE preparation only; no JSS3 Computer Studies. No cosmetic UI redesign. Label replacements accurately; do not invent original wording, authentic chants, observed performances or historical certification. Source-intent uncertainty and usable equivalent teaching are separate claims.

Use Node 24.19.0, `npm ci --ignore-scripts`, and a Python venv with `pip install -r scripts/jss3/acceptance-requirements.txt`. Record actual versions. Never change the lockfile incidentally. For commands not reproduced below, read the actual script/help before executing; stop on changed CLI contracts instead of guessing flags. Keep private inputs, full captures, credentials and student data outside Git. Evidence may contain counts, hashes, redacted logs and provenance.

Private corpus, where required: JSS3_NEXT_STAGE_INPUTS_20261016.zip (a filename with (1) or (2) is acceptable), SHA256 0a5b0d929e1dc61801cde43f8a85235d2e236ced334d2091583f5fa16524ea3c. It contains 39 originals and an audited 313-row capture. Obtain from current uploads/Library first; ask once only if genuinely unavailable. It is NOT the protected 2,179-row baseline. No old worker patch ZIP is needed. Never execute scripts from the archive; use repository scripts.

For corpus verification, set INPUT_ZIP to its real absolute path and EVIDENCE_DIR to a new private output directory:
`python3 scripts/jss3/run_acceptance.py --archive "$INPUT_ZIP" --output "$EVIDENCE_DIR" --without-db`
Exit 2 is an honest INCOMPLETE only if ACCEPTANCE.json says corpus passed and database checks were deliberately omitted. FAIL/BLOCKED is not a pass. Add --tsx-no-ipc only for a documented IPC restriction. For full acceptance use a disposable loopback PostgreSQL 16 database named jss3_test_*; privately set JSS3_LOCAL_TEST_DATABASE_URL and replace --without-db with --database-url-env JSS3_LOCAL_TEST_DATABASE_URL. Do not use an ambient production DATABASE_URL. Never force historical supplement totals.

For changed lesson content, use a fresh capture; regenerate with:
`python3 scripts/jss3/build_implemented_lessons.py backend/src/db/data/jss3Supplements.json "$EVIDENCE_DIR/capture/supplemented-rows.json" docs/jss3/replacements/IMPLEMENTED_LESSONS.csv`
`python3 scripts/jss3/build_teacher_schedule.py`
Inspect every generated diff. Rerun affected validation after regeneration. Do not erase historical coverage-conflict reports as a generator side effect or blindly repin counts. Preserve all 313 original row objects, not only counts.

Commit coherent checkpoints before long runs. Deliver code/content, tests and `docs/jss3/completion/SEQUENTIAL_CLOSEOUT_20261025/TASK_NN_REPORT.md` recording base/tested/head SHAs, exact commands, exits/pass/fail/skips, implementation scope, remaining inputs and publication URL. Refresh master before publication, reconcile actual conflicts and rerun affected checks. Clearly separate IMPLEMENTED / VERIFIED / PUBLISHED / MERGED / DEPLOYED. No promised zero-error outcome substitutes for observed tests.

## Required inputs
Repository candidate containing completed tasks 02-05 (or explicitly list any blocked item); exact private JSS3 archive described in common instructions; Node24.19.0; Python requirements; PostgreSQL16. No production database or protected export is needed here. This is final-candidate technical acceptance, not proof of historical 2,179 rows or device usability.
## Setup
Read scripts/jss3/run_acceptance.py, verify_handoff.py and capture_rows.py. Audit the DB suite list against new tests from Task02/05 so no new runtime is omitted. With Docker available, a disposable example is:
`docker run --name jss3-task06-pg-UNIQUE -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=<LOCAL_TEST_PASSWORD> -e POSTGRES_DB=jss3_test_task06 -p 127.0.0.1:55436:5432 -d postgres:16`
Replace UNIQUE and LOCAL_TEST_PASSWORD with local task values; first check name/port are unused. Wait with pg_isready; record server version. Set JSS3_LOCAL_TEST_DATABASE_URL privately to `postgres://postgres:<URL_ENCODED_LOCAL_TEST_PASSWORD>@127.0.0.1:55436/jss3_test_task06`. A native disposable loopback PostgreSQL16 is equally valid. Do not publish the URL/password or use the app's real DATABASE_URL. Remove only the container/database created by this task after preserving redacted evidence.
## Execute and fix
From repo root and activated environment run:
`python3 scripts/jss3/run_acceptance.py --archive "$INPUT_ZIP" --output "$EVIDENCE_DIR" --database-url-env JSS3_LOCAL_TEST_DATABASE_URL`
Use a new EVIDENCE_DIR; add --tsx-no-ipc only if actually needed. Read ACCEPTANCE.json AND individual test logs. All registered DB suites must run with zero skips; allowed DB placeholders in corpus must have corresponding actual DB passes. No missing-source skips. Also run newly added Task02/05 suites if runner integration is incomplete, and fix the runner rather than leaving future checks omitted.
Repair genuine implementation faults; update stale expectations only with independently checked source/body rationale. Preserve all source rows and other classes. Regenerate implemented records/schedule if required, inspect diffs, and rerun affected checks after the final edit. Do not merely copy old logs or force 484/current counts; derive and explain actual deltas.
## Completion
Publish redacted command/environment/check summaries, source/candidate hashes, all-original-row equality, destination and Computer counts, held-entry status, tests/failures/skips and CI URL. Full PASS means exit0 and every actual required suite passed on that candidate. If PG/archive is missing, report exactly BLOCKED; --without-db is not completion. Commit evidence tied to tested tree, not a false all-JSS3 certification. Production and devices remain Task08; protected baseline remains Task07.
