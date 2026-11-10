# SS1 test report, 2026-11-08 run 2 (tester T1)

Tested SHA: `65035ef`. Environment: Node v22.23.4. Changes made: none to packages, queues or source (this report only). Importer, DB, deployment, CI and UI were not run.
Compared with run 1 (`TEST_REPORT_20261108.md`, tested `999c95a`).

## Results

| Check | Run 1 | Run 2 |
|---|---|---|
| `cd backend && npx tsc --noEmit` | pass | pass |
| all `tests/ss1/*.test.mts` (7 files) | 15 pass / 21 fail / 2 skipped (38 tests) | 23 pass / 25 fail / 2 skipped (50 tests; the new invariants file adds 12) |
| `_invariants.test.mts` | 8 pass, 4 fail | 8 pass, 4 fail (same four tests, fewer violations) |
| per file | english 0/6, french 0/6, literature 0/8, mathematics 0/1, catering-craft 6/6, further-mathematics 9 (2 skipped) | identical |
| registered sources vs archive | 61 of 61 match | not re-run (no source change) |

## Delta of defects

| # | Run 1 | Run 2 | Status |
|---|---|---|---|
| D1 schema failures | 124 violations in 6 packages | 12 violations in 6 packages: english 4 (`SS1-02-english-COR-012`, `-013`, `-014`, `-015`: unrecognised key `evidence.objective_scope_audit`), french 2, literature 2, mathematics 2, physics 1, technical-drawing 1 | IMPROVED: the 112 English coverage `evidence` key errors are fixed; the English corrections and the five other packages are unchanged. The six per-package test files still fail at parse time. |
| D2 Mathematics lesson hashes | 3 | 3 (`SUP-SS1-MATHEMATICS-T1-W03-BASE-OPERATIONS`, `-T1-W05-STANDARD-FORM`, `-T1-W06-INDICES`) | RECURRING |
| D3 PARTIAL/UNRESOLVED without an open item, where indexing is complete | english 15, technical-drawing 20 | english 15, technical-drawing 20 | RECURRING |
| D4 stale `next_runnable` | 59 violations, 16 queues | 32 violations: bookkeeping 6, catering-craft 3, physics 3, yoruba 13, and one each in agricultural-science, civic-education, commerce, data-processing, french, geography, government | IMPROVED: chemistry, biology, economics, financial-accounting and food-and-nutrition are now consistent |

New defects this run: none. The `*-TEST-PACKAGE` items (12 subjects) are eligible and say "write, do not run"; they are worker items and I did not take them.

## Independent verification of worker output (re-derived from the archive, no trust in the notes)

1. **Chemistry, `CHEM-IDX-T1A-W04` and `-W05` (agent A1).** Member `SSS 1/1st Term SS1_/1ST TERM S1 CHEMISTRY.docx` is 2,187,976 bytes with SHA256 `07053f97...bb3a6`, as recorded. Text read with `mammoth.extractRawText` is 55,382 characters and 2,129 lines, matching the recorded SHA256 `f88594cb...e702`. The week-four range (lines 608-867) hashes to the recorded `4aea3a2b...dd9c`. All 31 section rows in the two item notes were recomputed (SHA256 of the lines joined with `\n`): 31 of 31 match, 0 mismatches.
2. **Economics, `ECON-PRE-T1` (agent A3).** Member `1ST TERM S1 ECONOMICS (1) (1).doc` is 1,264,128 bytes with SHA256 `8ad05c78...62bc`, as recorded. Text read with `word-extractor` `getBody()` is 53,430 characters and 1,060 lines, with SHA256 `026eeec9...037e`, as recorded. The opening block (lines 1-43) hashes to the recorded `619fc6e5...9fb8a9b`. I checked 10 of the 13 scheme rows (line hash and the `WEEK ...` marker line): 10 of 10 match. The other 3 rows (including line 36, which combines weeks 12 and 13) did not parse in my script and are NOT verified.

Not verified: the correctness of coverage statuses, objective wording and follow-up decisions in either note (only locators and hashes were re-derived), and any other worker commit.

## Observations on how the work is being done

- Workers follow the protocol: claim, one item per commit, release; every checked commit stays within the item's allowed paths; packages stay PENDING; edited packages (chemistry, economics, biology, financial-accounting) pass the schema.
- Done-conditions differ between subjects. English requires an open item for every PARTIAL/UNRESOLVED entry; the Chemistry done-condition does not, and A1 records gaps as queue follow-ups. In Chemistry W04, 5 of 7 coverage entries are PARTIAL/UNRESOLVED with no open item. This meets Chemistry's condition but not English's. The invariant test therefore only reports this for subjects still being indexed.
- Commits by A2 and A3 are authored as "Claude", so the agent is identifiable only from the commit message.

## Next run

`git fetch && git pull --rebase origin master && npm ci --ignore-scripts && node --import tsx --test tests/ss1/_invariants.test.mts`. Priorities: D1 (still blocks four per-package test files), D2, then verify the next batch of worker commits by recomputing their recorded hashes from the archive.
