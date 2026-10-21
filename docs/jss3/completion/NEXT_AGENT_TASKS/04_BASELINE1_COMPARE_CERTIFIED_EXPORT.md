# BASELINE1 — Verify the actual protected 2,179 rows

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

## Required inputs — not provided by the curriculum ZIP

Owner's actual **certified full-content export** of the 2,179 Primary/JSS1/JSS2 rows AND the proposed release snapshot of the SAME protected scope. The source ZIPs for those classes are not a certified export. No verified filenames exist; request the real files. Owner must identify stable key columns, full lesson-content columns and baseline provenance. Use curriculum rows only, not student records.

Files already in master: `docs/jss3/completion/P1_BASELINE/{README.md,compare_baseline.py,test_compare_baseline.py}`. The comparer is implemented and synthetic-tested; that does not mean the protected rows have been checked.

## Execute

Validate both exports contain the same field schema and genuinely include full lesson content. Use equivalent export formats: null, empty string, number/text types and line endings are deliberately NOT silently normalised. Run synthetic tests, then:
```bash
python3 -m unittest discover -s docs/jss3/completion/P1_BASELINE -p 'test_*.py'
python3 docs/jss3/completion/P1_BASELINE/compare_baseline.py --baseline /actual/certified-export.json --snapshot /actual/release-snapshot.json --key id --output "$PWD/baseline-evidence/result.json"
```
Replace `id` with the verified stable identity columns, comma-separated. Do NOT pass --content or override --expected-count for the acceptance run; those are diagnostic modes. Ensure compared_fields includes every supplied content/provenance field and the body column. The report contains field names/identities and input hashes, not full content.

## Completion gate

Require 2,179 baseline rows, no missing/extra/duplicate identities, no content differences, verified baseline provenance and full-content scope. If differences exist, diagnose upstream export/import behaviour and fix it without overwriting the certified baseline. Do not delete rows or rewrite the baseline to obtain PASS. If inputs are absent, retain BLOCKED and finish only reproducible preparation. Publish the sanitised comparison result and any tested fix, never the full exports.
