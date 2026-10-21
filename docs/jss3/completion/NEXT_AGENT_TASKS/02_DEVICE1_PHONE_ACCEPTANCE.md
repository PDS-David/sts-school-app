> **Current instructions:** Read [EXECUTION_CONTRACT.md](EXECUTION_CONTRACT.md) first. It supersedes conflicting execution/publication rules below. Workers submit PRs; only the designated integrator merges. Do not repeat completed work.

# DEVICE1 — Observe and fix lesson-picture usability

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

## Required inputs

Current repo; **authorised staging backend/database and a staging mobile build**, one JSS3 student account and one other-class account, and an actual phone or owner-operated phone session. Read `docs/jss3/completion/A2_PHONE_ACCEPTANCE.md`, `mobile/src/screens/TopicDetailScreen.tsx`, `tests/lesson-image.test.mts`. The original ZIP is needed only if YOU must prepare staging, not if it is already populated. No production credentials.

## Execute

Record staging URL, backend/build SHA, device/OS, viewport and screen-reader mode. Verify staging has topic_assets.alt_text and assessments.content_fingerprint. Compare asset lists with current manifests, not old row numbers. If no authorised staging/session exists, produce only a concrete setup request and keep the observation gate BLOCKED; do not use a static HTML mockup as phone evidence.

Observe these exact asset keys: V1-DE-02-example1-capital-cash, V2-MATH-M1-F03, BS-EYE, BS-PRISM-CORRECTED, BT-02, BT-10, BT-12, BT-16. Test both source-topic and supplement-topic Science bindings where available. BS-PRISM-SOURCE must remain hidden. For each record actual readability, complete image/no crop, caption, spoken description, horizontal navigation or readable enlargement, and GIF animation. Disable/re-enable network and test picture/list retry. Confirm no-token and other-class access is rejected.

Fix only reproduced usability/access defects in the app. If adding enlargement is necessary to read the diagrams, implement accessible open/close/back behaviour, retain authenticated image requests, and test navigation and failures. Do not redesign unrelated UI. Re-observe every affected case after the fix; a code test is not a screenshot or phone observation.

## Completion gate

Commit a results table with lesson/asset IDs, observed pass/fail, device/build details and non-sensitive screenshots. No row may say PASS without observation. Report LOW_RESOLUTION_SOURCE separately when enlargement cannot recover detail. Publish fixes and tests; do not deploy production. If blocked, list the exact staging/session/device input needed, not another general audit assignment.

## Updated 21 October — preflight exists; observation does not
Read completion/DEVICE1/{REPORT.md,OBSERVATION_RESULTS.csv}, scripts/jss3/device1_preflight.py and tests/test_jss3_device1_preflight.py. Do not rebuild this tool or claim its mock tests are phone evidence. Given authorised staging, supply JSS3_STUDENT_TOKEN and JSS3_OTHER_CLASS_TOKEN through environment, then run `python3 scripts/jss3/device1_preflight.py --base-url "$STAGING_URL" --output "$OUT" --staging-confirmed`. Exit0 is API-only pass; exit2 means checks not performed. Confirm schema columns topic_assets.alt_text and assessments.content_fingerprint separately. The baked-in onrender.com URL has NOT been established as staging; do not probe it using production accounts. If no staging exists, use prompt07 to prepare an isolated environment first.
