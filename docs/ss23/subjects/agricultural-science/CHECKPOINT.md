# Agricultural Science — SS2 / SS3 subject checkpoint

Updated: 2026-11-16
Task family: SS23-AGRIC
Branch: `agent/ss23-agricultural-science-terms2-3-r2-20261116`
Base: `master` @ `2b3ec92b99d016b450858cce5b87d5d6056d990b`

## Status

**SS2 TERMS 1-3 DRAFTED; SOURCE REVIEW AND TEACHER APPROVAL PENDING — NOT READY FOR STUDENT RELEASE.**

This checkpoint covers only Agricultural Science. It does not certify any other subject.

## Source register

Five source documents have been extracted and their document headers checked against the intended class and term. Their exact member SHA-256 values, byte counts, archive hashes, scheme rows and body anchors are recorded in `SOURCE_MAP.json`.

| Class | Term | Source ID | Week mapping |
|---|---|---|---|
| SS2 | First | `SS23-SRC-225f920d3751` | 1-10; Weeks 8-9 are grouped under a Week Eight body heading |
| SS2 | Second | `SS23-SRC-cd612ad10f40` | Weeks 1-9 body sections mapped; Week 10 revision and Weeks 11-12 examination are assessment markers |
| SS2 | Third | `SS23-SRC-6abb32818845` | Weeks 1-10 body sections mapped; PDF review confirms Week 7-8 heading on printed page 13; Weeks 11-12 are revision/examination markers |
| SS3 | First | `SS23-SRC-d5fb9404af80` | Exam-prep topics in Weeks 1-10; scheme-only revision and examination at 11-12 |
| SS3 | Second | `SS23-SRC-b12f41490179` | Exam-prep topics in Weeks 1-8; practical, revision and mock examination at 9-12 remain unresolved |

## Implemented in this task

- `SOURCE_MAP.json`: source-to-scheme mapping with source hashes and body anchors.
- `tests/test_ss23_agricultural_science_source_map.py`: validates source identity, term coverage, SS3 exam-prep policy, week mapping parity and known blockers.
- `.github/workflows/ss23-source-validation.yml`: adds a focused Python test workflow for SS23 changes after it is present on master.

The manifest was retrieved from the branch and parsed. Checks passed for 5 unique source records, hash-derived IDs, SS2 three-term coverage, SS3 two-term exam-prep coverage, exact scheme/body mapping-week parity, the SS2 T3 Week 7-8 heading gap, and SS3 T2 Weeks 9-12 unresolved status. The new Python test file has not yet run in GitHub Actions because its workflow is new in this PR and is not on the base branch.

## Open work

1. Complete original-page review of the remaining SS2 T2 disease/pest tables and all embedded figures; SS2 T3 printed pages 12-16 have now been inspected.
2. Reconcile every T2/T3 evaluation, general evaluation, weekend assignment and theory activity to a checked answer, explanation and mark-by-mark marking guide.
3. Review all 19 lesson bodies for source coverage, technical accuracy and assessment alignment; retain all open issues as explicit blockers.
4. Prepare SS3 exam-preparation resources only (WAEC / NECO / JAMB) after the SS2 Agricultural Science package has passed its readiness gate; do not create normal SS3 instructional progression.
5. Run the integrity/hash check and all SS23 tests on the current master base; verify positive student retrieval only after teacher-approved content exists. The current pending package must remain blocked.
6. Obtain teacher approval and owner acceptance without changing approval states on the strength of CI alone.

## Exact next action

Continue the Agricultural Science readiness work: complete the T2/T3 source-assessment inventory and technical corrections, then run the full SS23 integrity workflow on the current master base. Do not move to Biology until all three Agricultural Science terms have passed source, assessment, testing and teacher-approval gates.

## SS23-AGRIC-SS2-T2-T3 — 2026-11-16

- Status: **IMPLEMENTED AS DRAFT; SOURCE-VERIFIED; PRE-REBASE TESTS GREEN; CURRENT-MASTER PR CI QUEUED; TEACHER APPROVAL NOT GRANTED.** Package remains `PENDING`; all new units remain `DRAFT`, unapproved and unverified.
- Branch: `agent/ss23-agricultural-science-terms2-3-r2-20261116`; base `master` @ `2b3ec92b99d016b450858cce5b87d5d6056d990b`; PR [#857](https://github.com/PDS-David/sts-school-app/pull/857) open; head `6a653bff4c61fa1657cf5a7b7742a0b5ad7cf87a`.
- Changed files:
  - `backend/src/db/ss23/subjects/agricultural-science.json`: 19 units across all three SS2 terms (8 existing T1, 6 new T2, 5 new T3); 173 total practice/assessment items; 15 added term/topic coverage rows; two added original-source records; 23 new authored/source-derived practice items with answers, explanations and marking; 14 new explicit blockers. Package remains PENDING.
  - `docs/ss23/subjects/agricultural-science/SOURCE_MAP.json`: corrected Week 7-8 Farm Records mapping after original DOC-to-PDF inspection; recorded the profit-and-loss transcription discrepancy and page-level review results.
  - `tests/ss23/agricultural-science.terms2-3.package.test.mts`: package/source/coverage/state and worked-calculation regression tests.
  - `tests/ss23/unit-package-validator.test.mts`: preserved the empty-term readiness regression using a synthetic package with later terms removed, rather than weakening its assertion.
- Source checks: both combined ZIP SHA-256 hashes match `RECEIPT_20261113.md`; SS2 T2 source `SS23-SRC-cd612ad10f40` (344,064 bytes) and T3 source `SS23-SRC-6abb32818845` (408,064 bytes) match their registered SHA-256 values exactly. Header text confirms SS2 and the relevant term. Original T3 PDF pages 12-16 were inspected: page 12 fertilizer/maize input-output table; page 13 Week 7-8 Farm Records heading; pages 14-15 account tables and the egg-sales label discrepancy; page 16 depreciation formula.
- Content blockers: disease taxonomy, ornamental species names, weed nomenclature, pesticide guidance, Mendelian-law nuance, farm-account table transcription, nutrient classification, feed thresholds, and exhaustive assessment answer/marking reconciliation. Do not mark any unit approved or verified.
- Pre-rebase GitHub Actions run `43790097181` on the previous branch base: locked install PASSED; `npm run ss23:refresh-hashes` refreshed 11 body hashes; `npm run validate:ss23` PASSED with zero errors; `npm run test:ss23` PASSED 38/38; `npm run validate:ss1` PASSED; backend TypeScript typecheck PASSED. This run predates the latest master merges and is not a substitute for current-base PR CI.
- The package is not ready: 50 delivery-blocking and 7 non-blocking open items remain. Main blockers include crop-disease taxonomy, ornamental and weed nomenclature, obsolete pesticide recommendations/classification, Mendelian-law nuance, farm-account transcription, animal nutrient classification, feed thresholds, and exhaustive answer/marking reconciliation.
- Exact next action: open the subject PR against current `master`; require the current SS23 integrity gate and expanded student-delivery tests to pass before treating this implementation as tested on the current base. Then continue blocker resolution; do not merge.

