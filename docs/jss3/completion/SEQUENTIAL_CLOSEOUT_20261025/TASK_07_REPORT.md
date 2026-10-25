# Task 07 — protected curriculum baseline comparison

**TASK 07: BLOCKED.** The protected comparison was **not run** and nothing was certified. The 2,179 figure is neither confirmed nor refuted. No substitute baseline was built. This is not a failure of JSS3 code.

Base: master `7adf6cfd961b497cd9876767aec98150748faf3e` (PR #61 merged; no open PRs at the time). Branch `jss3/task07-20261026-baseline`. Tested tree = that base (this PR adds only this report). `AGENTS.md` does not exist; `EXECUTION_CONTRACT.md`, `07_PROTECTED_BASELINE.md`, the R4 report, `B_PREP/{ACQUISITION.md,INPUT_CHECKLIST.json}`, both CLIs' `--help`, both SQL files and `compare_baseline.py` were read before running anything.

## Missing inputs (precisely)
| Need | What is required | Status |
|---|---|---|
| **A** (I1) | An identified pre-JSS3 certified export/backup, or an authorised read-only frozen/point-in-time copy, with the seven provenance fields: `origin, export_taken_utc, data_as_of_utc, scope, approval_record, export_method, sha256` | **NOT SUPPLIED.** Task uploads are empty; the sandbox and the repository contain no export, dump, backup or filled provenance file (only the template and the literature `RAMURAMU_PROVENANCE.json`, which is unrelated). |
| **A-alt** (I1-alt) | Written record naming the importer commit, source archive hashes and school/class filters that yield the certified set | NOT SUPPLIED |
| **B** (I2) | Owner-designated release-candidate snapshot, same scope/format, with provenance | NOT SUPPLIED |
| Owner decisions | I4 identity key confirmation; I6 what counts as full content; I7 engine version / route (3A/3B/3C) / who exports; I8 legacy class-name policy | OPEN — no existing owner record found that settles them, so none were invented |

The JSS3 private ZIP is not the protected baseline, current reconstructed rows or a present-day export cannot establish historical certification, and no production access was requested or used.

## Observed (tooling readiness only — synthetic data; says nothing about the real rows)
Environment: Python 3.12.3 + venv from `acceptance-requirements.txt`; Node **v24.19.0** (installed as the `node@24.19.0` npm package; the sandbox's own Node is 22.22.2 and was not used for these runs); PostgreSQL 16.15 on `127.0.0.1`, disposable databases `jss3_test_t07` and `jss3_test_t07b`, `schema.sql` loaded into these fresh synthetic databases only (no historical restore was touched). `npm ci --ignore-scripts` exit 0; `package-lock.json` unchanged.

| Check | Result |
|---|---|
| `P1_BASELINE/test_compare_baseline.py` | 18 tests OK |
| `b_prep/test_b_prep.py` with the disposable PG16 | 9 tests OK, **0 skipped** (the 3 SQL tests R4 had to skip now ran: preflight counts, legacy-name-preserving export, structurally-flawed-where-expected) |
| `R4_PROTECTED_COMPARISON/selfcheck_synthetic.py --output <tmp>` (real CLI, 50 synthetic rows) | 11/11 cases as expected: identical and surrogate-ids-only-different PASS (exit 0); changed title / `source_reference` / `source_file` / `description` / identity field, removed row, added row, duplicated identity FAIL (exit 1); surrogate ids alone FAIL without `--exclude`. `comparer_sha256` `6f9fb778d0392f4a8a9a956be31458b5d25987e9e63208ec6d314c39f8833cd9` |
| `tests/protected-export.db.test.mts` (needs `TOPIC_ASSETS_TEST_DATABASE_URL`, not `JSS3_LOCAL_TEST_DATABASE_URL`) | 1 pass, 0 fail, **0 skipped** — export preserves full values, excludes JSS3, leaves rows unmodified. (A first run without the variable showed the test as *skipped*; that was not counted.) |
| `tests/test_jss3_acceptance_runner.py` | 4 tests OK |
| Tool defects found | none; no tool was changed |

Negative controls for altered content / missing / extra / duplicate rows are therefore demonstrated, and they ran on fixtures only. **They must be re-run on the real pair once supplied.**

## Not performed
`validate_export.py` on a certified baseline and on a release snapshot; `compare_baseline.py` on a real pair; any count, scope, duplicate, missing, changed or extra-row report for the real protected rows; any rename of legacy class names; any production, backup, or restore access. `run_acceptance.py` was not run (Task 06 scope, archive absent).

## Exact commands to unblock (existing tooling, unchanged; keep everything under a private `$PRIV` outside Git)
Route 3A (existing row export, same format for both inputs):
```
sha256sum <file>
python3 scripts/jss3/b_prep/validate_export.py --export "$PRIV/certified_baseline_export.json" --kind certified-baseline --provenance "$PRIV/certified_baseline_provenance.json" --output "$PRIV/certified_baseline_validation.json"
python3 scripts/jss3/b_prep/validate_export.py --export "$PRIV/release_snapshot_export.json" --kind release-snapshot --provenance "$PRIV/release_snapshot_provenance.json" --output "$PRIV/release_snapshot_validation.json"
python3 docs/jss3/completion/P1_BASELINE/compare_baseline.py --baseline "$PRIV/certified_baseline_export.json" --snapshot "$PRIV/release_snapshot_export.json" --key school_code,class_name,subject_name,term_label,order_index --exclude id,subject_id --output "$PRIV/protected_comparison.json"
```
Route 3B (a dump): restore only into a **new loopback** `jss3_test_*` database; if `topics` lacks `term_label, source_reference, order_index` or `source_file`, stop and report — never run `schema.sql` or migrations on a historical restore. Then `psql -X -qAt --set ON_ERROR_STOP=1 … --file scripts/jss3/preflight_protected_curriculum.sql` and `…/export_protected_curriculum.sql` into `$PRIV`. Route 3C needs an explicit owner-designated read-only target and authority. No `--expected-count` and no content-field exclusion. PASS requires both validations OK (or each listed problem accepted in writing) and exact protected-content preservation; only hashes, provenance and sanitised differences are publishable.

## If historical certification is unrecoverable
That is a separate, explicit owner decision to adopt a **new prospective baseline**, which would not prove the historical claim. It has not been requested or made. General permission to finish JSS3 does not waive preservation.

## Statuses
IMPLEMENTED: nothing needed. VERIFIED: tooling only, as tabulated. **Protected comparison: BLOCKED / NOT PERFORMED.** PUBLISHED: this report in the PR. MERGED: no. DEPLOYED: no. Note for the integrator: master may auto-deploy and the release configuration is not in the repository; merging this documentation-only PR may still trigger a redeploy of unchanged code — resolve that separately.
