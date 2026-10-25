# Task 06 — full-source + PostgreSQL acceptance

**TASK 06: BLOCKED.** Full acceptance was **not run**. `run_acceptance.py` requires `--archive` and the private `JSS3_NEXT_STAGE_INPUTS_20261016.zip` (SHA-256 `0a5b0d929e1dc61801cde43f8a85235d2e236ced334d2091583f5fa16524ea3c`) was not available to this worker (no upload, nothing found on disk). Per the task, a missing archive is reported exactly as BLOCKED; the archive-independent checks below are **not** a substitute and certify nothing about the 313 original rows, destination/Computer counts, held entries or regenerated records.

Base: master `4210ff1` (includes PRs #44–#60). Branch `jss3/task06-20261026-runner`; tested tree = that base + the runner change below.

## Implemented (the only change made)
* **Runner omission fixed.** `scripts/jss3/run_acceptance.py` listed nine DB suites and did not include Task 05's `jss3-sequence.db` nor set `JSS3_SEQ_TEST_DATABASE_URL`, so a future full run would have silently skipped the sequencing tests. Both added; the runner's zero-skip rule now applies to it.
* **Regression guard.** `tests/test_jss3_acceptance_runner.py::RunnerSuiteRegistryTests` fails if any `tests/*.db.test.mts` is neither registered in the runner nor in a written exclusion list (`protected-export.db` → Task 07 scope; `staging-admin.db` → creates its own DBs, Task 08 scope), and if the runner names a suite that does not exist. Negative control observed: against the previous runner it fails with `['jss3-sequence.db'] != []`; against the fix it passes (4/4 runner unit tests).

## Observed (archive-independent) — Node v24.19.0, PostgreSQL 16.15 on 127.0.0.1, DB `jss3_test_r6`, `npm ci --ignore-scripts`, Python venv from `acceptance-requirements.txt`
| Check | Result |
|---|---|
| `tsc --noEmit` backend / mobile | exit 0 / exit 0 |
| Static TS suites (excl. `.db.`) | 405 tests, 351 pass, 0 fail, **54 skipped** (need the archive/capture) |
| `tests/*.cjs` | 32/32 |
| Python: P1_BASELINE unit tests, runner unit tests | OK, OK (4/4) |
| Real PostgreSQL, 0 skips: topic-assets 18/18, v3-science-ci 5/5, yo-license 4/4, supplement-revision 6/6, **sequence 9/9**, protected-export 1/1, staging-admin 16/16 | pass |
| Real PostgreSQL, **skipped (1 test each, need capture/source)**: batch2-assets, delivery-correction, v1-business, v2-math-assets, v3-science-assets | **not verified** |

First attempt at the DB suites failed every test with connection errors because the disposable server had stopped between runs; restarted and re-run. Those failures were environmental, not code; the table above is the re-run.

## Not performed / unmet gates
Archive hash verification; corpus capture; `verify_handoff.py`; original-row equality (313) and counts; held-entry status; the five archive-dependent DB suites (must run with zero skips); regeneration of `IMPLEMENTED_LESSONS.csv` and the teacher schedule; CI URL for a full run. No lesson body changed in Tasks 02–05 as reported, so regeneration may be unnecessary, but that is unproven until a fresh capture is compared.

## Unblock
Supply the exact ZIP (suffix `(1)`/`(2)` acceptable), then from repo root:
`python3 scripts/jss3/run_acceptance.py --archive "$INPUT_ZIP" --output "$NEW_EVIDENCE_DIR" --database-url-env JSS3_LOCAL_TEST_DATABASE_URL`
against a disposable loopback `jss3_test_*` database. Full PASS = exit 0, all ten registered DB suites with zero skips.

Status: IMPLEMENTED runner fix + guard · VERIFIED as tabulated · PUBLISHED see PR · MERGED no · DEPLOYED no · **Full acceptance: NOT RUN (BLOCKED)**.
