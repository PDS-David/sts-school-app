> **Current instructions:** Read [EXECUTION_CONTRACT.md](EXECUTION_CONTRACT.md) first. It supersedes conflicting execution/publication rules below. Workers submit PRs; only the designated integrator merges. Do not repeat completed work.

# SEQUENCE2 — Implement progression only after policy approval

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

## Required authorisation and inputs

Owner must explicitly start **Batch 3 implementation** and approve the student-state policy before executing this task. The earlier S1 permission covered design only. Inputs: current repo, input ZIP, `docs/jss3/completion/S1_SEQUENCE_DESIGN.md`, current capture/schedule, and approved placement decisions. If policy is not approved, do not modify progression/schema; produce the exact decision request below, with a placement proposal if useful.

Ask/record: (1) must inserted supplements gate later originals? (2) preserve both passed topics AND the previously accessible unpassed frontier for returning students? (3) may a supplement appear before original #1 or must the PIN-gated identity remain stable? (4) which original lesson anchors each otherwise ambiguous supplement? Do not treat source week numbers as order indices.

## Design correction before implementation

S1's “topic itself already passed” exception alone does NOT protect the previously unlocked but unpassed next topic. Define a persisted or reproducible grandfathered frontier/version policy and test that case explicitly. Rollback must be scoped to the plan/school/rows changed, not a broad update of all JSS3 schools. Keep source order_index, topic IDs, assets and completions intact. Unapproved placements stay pending.

## Execute once authorised

Implement one shared sequence/unlock helper used by GET /learning/topics and direct POST completion, the additive reversible metadata migration, validated stable-identity placement configuration, and a dry-run-first apply tool. Gate by exact school/class/term and source/supplement identity. No pending placement may be written. Update the mobile first-topic/PIN logic using explicit sequence metadata; preserve original API compatibility. Do not apply to production.

Test on disposable PostgreSQL: fresh student, passed topic, previously open/unpassed topic, failed predecessor, missing PIN, new supplement completed, manual unordered topic, wrong school/class, direct API bypass, idempotent apply, wrong-body/title abort, rollback, unchanged assets/completions and original rows. Regenerate current scheduling records. Stage only with authorisation and observe progression on a test account.

## Completion gate

Working code + migration + dry-run/apply/rollback tools + placement data with explicit approvals + passing local DB matrix. A design or CSV alone is not completion. Present production plan separately; publish implementation to master without executing a production write.
