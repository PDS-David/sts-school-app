# Structured package audit — 2026-11-16

This snapshot reflects the Agricultural Science draft as updated on PR #862, based on master `70cd4a8cb1a5f7fcbd1a103e6812bbe96d4e711e`. It checks structured package fields; it does **not** certify source-page completeness, subject correctness, specialist approval, owner acceptance or student-release readiness.

## Practice and answer-guide audit

The package contains 19 draft units and 195 practice items:

| Term | Units | Practice items | Original-source questions | Authored-supplement questions |
|---|---:|---:|---:|---:|
| First Term | 8 | 150 | 128 | 22 |
| Second Term | 6 | 24 | 0 | 24 |
| Third Term | 5 | 21 | 0 | 21 |
| **Total** | **19** | **195** | **128** | **67** |

A programmatic inspection of all 195 items found:
- no missing answer;
- no missing explanation;
- no missing positive mark allocation;
- no empty marking-guide array;
- every marking-guide total equals the question's stated marks (195/195).

This confirms that answer-guide fields exist and their mark totals are internally consistent. It does **not** establish that answers are factually correct, that all original source assessment questions have been captured, or that a subject specialist has approved them.

The package now records 41 external factual references (10 additional source-hashed references in this PR) and 10 additional supported coverage rows for the T2 floriculture and crop-disease clarifications. The supplements distinguish verified facts from the original school wording. The complete source tables and all remaining taxonomic or source-text questions still require original-page reconciliation and specialist review.

In particular, all 45 Second- and Third-Term practice items are labelled `AUTHORED_SUPPLEMENT`; none is labelled `ORIGINAL_SOURCE`. Their source assessment coverage remains incomplete and must be reconciled against the original school documents. Do not represent these 45 authored items as copied past questions or original source assessment items.

## Coverage and open-item audit

Current package coverage rows:
- `SUPPORTED`: 66
- `PARTIAL`: 25
- `UNRESOLVED`: 5
- `MARKER`: 4

The package has 53 open items: 46 delivery-blocking and 7 non-blocking.

| Term | Open items | Blocking | Non-blocking |
|---|---:|---:|---:|
| First Term | 43 | 37 | 6 |
| Second Term | 5 | 5 | 0 |
| Third Term | 5 | 4 | 1 |
| **Total** | **53** | **46** | **7** |

The 53 items comprise 30 FACT, 11 VERIFICATION, 6 CONTENT, 4 PERMISSION, 1 OWNER_ACTION and 1 VISUAL item. First-Term review remains substantial; the newer Second- and Third-Term drafts do not close those earlier approval gates.

## Current gate

Package status remains `PENDING`; all 19 units remain `DRAFT`, with content approval `PENDING` and verification `DEFERRED`. Keep the package blocked from student delivery. Do not mark the subject complete based on this structural audit or CI results.

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

- Status: **IMPLEMENTED AS DRAFT; SOURCE-VERIFIED; CURRENT-MASTER PR CI GREEN; TEACHER APPROVAL NOT GRANTED.** Package remains `PENDING`; all new units remain `DRAFT`, unapproved and unverified.
- Branch: `agent/ss23-agricultural-science-terms2-3-r2-20261116`; base `master` @ `2b3ec92b99d016b450858cce5b87d5d6056d990b`; PR [#857](https://github.com/PDS-David/sts-school-app/pull/857) open; current head `b5bdfc205424a31f0d8757f261995a207302109e`.
- Changed files:
  - `backend/src/db/ss23/subjects/agricultural-science.json`: 19 units across all three SS2 terms (8 existing T1, 6 new T2, 5 new T3); 195 total practice/assessment items; 15 added term/topic coverage rows; two added original-source records; nine added external factual references; 22 additional source-assessment answer guides; 35 total added coverage rows; 45 new authored/source-derived practice items with answers, explanations and marking; 14 initial explicit blockers; four technically resolved blockers removed after authoritative review. Package remains PENDING.
  - `docs/ss23/subjects/agricultural-science/SOURCE_MAP.json`: corrected Week 7-8 Farm Records mapping after original DOC-to-PDF inspection; recorded the profit-and-loss transcription discrepancy and page-level review results.
  - `tests/ss23/agricultural-science.terms2-3.package.test.mts`: package/source/coverage/state and worked-calculation regression tests.
  - `tests/ss23/unit-package-validator.test.mts`: preserved the empty-term readiness regression using a synthetic package with later terms removed, rather than weakening its assertion.
- Source checks: both combined ZIP SHA-256 hashes match `RECEIPT_20261113.md`; SS2 T2 source `SS23-SRC-cd612ad10f40` (344,064 bytes) and T3 source `SS23-SRC-6abb32818845` (408,064 bytes) match their registered SHA-256 values exactly. Header text confirms SS2 and the relevant term. Original T3 PDF pages 12-16 were inspected: page 12 fertilizer/maize input-output table; page 13 Week 7-8 Farm Records heading; pages 14-15 account tables and the egg-sales label discrepancy; page 16 depreciation formula.
- Content blockers: disease taxonomy, ornamental species names, weed nomenclature, pesticide guidance, Mendelian-law nuance, farm-account table transcription, nutrient classification, feed thresholds, and exhaustive assessment answer/marking reconciliation. Do not mark any unit approved or verified.
- Pre-rebase GitHub Actions run `43790097181` on the previous branch base: locked install PASSED; `npm run ss23:refresh-hashes` refreshed 11 body hashes; `npm run validate:ss23` PASSED with zero errors; `npm run test:ss23` PASSED 38/38; `npm run validate:ss1` PASSED; backend TypeScript typecheck PASSED. This run predates the latest master merges and is not a substitute for current-base PR CI.
- The package is not ready: 53 open items remain (46 delivery-blocking, 7 non-blocking). Main blockers include crop-disease taxonomy, ornamental and weed nomenclature, obsolete pesticide recommendations/classification, Mendelian-law nuance, farm-account transcription, animal nutrient classification, feed thresholds, and exhaustive answer/marking reconciliation.
- Exact next action: open the subject PR against current `master`; require the current SS23 integrity gate and expanded student-delivery tests to pass before treating this implementation as tested on the current base. Then continue blocker resolution; do not merge.


## Live task checkpoint — SS23-02 Agricultural Science — 2026-11-16

- Task ID: `SS23-02 / SS23-AGRIC-SS2-T2-T3`
- Status: **Implemented as draft; source identity verified; current-head CI green; not teacher-approved; not accepted for student delivery.**
- Branch: `agent/ss23-agricultural-science-terms2-3-r2-20261116`; current head before this checkpoint update: `1377fdaa116143fcf9add283bfb9580a22537d11`.
- PR: [#857](https://github.com/PDS-David/sts-school-app/pull/857), open and unmerged; base master `2b3ec92b99d016b450858cce5b87d5d6056d990b`.
- Changed implementation: package has 19 SS2 lesson units (8 T1, 6 T2, 5 T3), 195 total practice/assessment items, 45 new authored/source-derived practice items, 22 added assessment answer guides, 9 external factual references, 24 total coverage rows added for assessment clusters and topic reconciliation (package coverage now includes the source map plus these additions). Four technical blockers were closed with authoritative citations; other technical/source and assessment blockers remain. Package status stays `PENDING`; all new lesson states remain `DRAFT`.
- Tests and evidence on current head `1377fdaa116143fcf9add283bfb9580a22537d11`, GitHub Actions [run 43791853155](https://github.com/PDS-David/sts-school-app/actions/runs/43791853155):
  - locked `npm ci --ignore-scripts`: PASS
  - `npm run ss23:refresh-hashes -- --check`: PASS
  - `npm run validate:ss23`: PASS, zero errors
  - `npm run test:ss23`: PASS, 39/39
  - package schema + student-delivery contract tests: PASS, 37/37
  - SS2/SS3 source-map Python tests: PASS, 11/11
  - `npm run validate:ss1`: PASS
  - backend TypeScript typecheck: PASS
  - Earlier assessment-verification run 43791400716 failed 38/39 because the economics test expected three practice items after assessment expansion; the assertion was corrected and current-head run above passes 39/39. No validation rule was weakened.
- Readiness output on current head: SS2 Agricultural Science T1/T2/T3 each report `IN_PROGRESS`; 14, 9 and 7 unresolved coverage rows respectively, and 24 blocking open items per term. This is not readiness certification.
- Source verification: SS2 T2 source `SS23-SRC-cd612ad10f40` (344,064 bytes) and T3 source `SS23-SRC-6abb32818845` (408,064 bytes) match the registered hashes and document headers. Original T3 pages 12-16 were inspected; Week 7-8 Farm Records heading is on printed page 13. Assessment answer guides are authored supplements, not original source answers.
- Remaining work: complete item-by-item answer reconciliation for every source evaluation, practical and external textbook/WAEC assignment; resolve disease/ornamental/weed/pesticide/feed/accounting uncertainties; review every lesson body against source; finish practical procedures; obtain teacher approval and owner acceptance. No student release, production import, merge or deployment.
- Exact next action: continue resolving the remaining Agricultural Science source/assessment blockers using the original school files and authoritative references; update this checkpoint after the next independently verified task. Do not move to Biology until all three Agricultural Science terms pass the source, content, assessment, delivery and approval gates.

- Merge note (2026-11-16, PR #857 merged into current master): the PR branch had dropped 22 First-Term technical-review items (hectare conversion, gypsum/liming, drip/overhead irrigation, PTO/engine statements, nutrient-cycle accuracy and others) in commit `a65b31a1` and lowered a test total from 53 to 31 in `b8d3f1e7`. Each of those items requires subject-specialist approval and none is recorded, so they were restored; the four Term 2/3 technical blockers the PR closed with external references stay closed. Result: 53 open items (46 blocking, 7 non-blocking), matching the PR description, and the test total is 53.
- Post-merge status (2026-11-16): the 'open and unmerged / do not merge' wording in the live updates above describes the pre-merge state. The owner directed that PR #857 be conflict-resolved and merged into master; that merge is what this note records. The package is still `PENDING`, every new unit is still `DRAFT` and unapproved, and nothing here is release-ready. The 'CI green' figures above were measured on head `1377fdaa` (53 → 31 open items); the merged result restores the 22 First-Term approval gates (53 open, 46 blocking) and was re-verified locally, with CI to run on the merge head.
