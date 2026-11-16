# Agricultural Science — SS2 / SS3 subject checkpoint

Updated: 2026-11-16
Task family: SS23-AGRIC
Branch: `agent/ss23-agricultural-science-source-map-20261113`
Base: `master` @ `b8651cebaa480097fd1c40c9b02c11b228187caa`

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

1. Complete the original-source page/image review for SS2 T3 worked examples and tables before using them in lessons or answer keys.
2. Audit every assessment item for correct answers, explanations, mark allocations and marking guidance; do not assume the source's “WAEC past questions and answers” reference supplies an answer key.
3. Build substantive SS2 lesson packages term by term from the source text, preserving provenance and generating independently checked answer/explanation material.
4. Build SS3 exam-preparation resources only (WAEC / NECO / JAMB). Resolve the Week 9 practical, Week 10 revision and Week 11-12 mock-exam material from real source evidence; do not create a normal SS3 instructional term.
5. Validate lesson, answer and asset hashes and verify student-facing retrieval through the actual delivery route.
6. Keep this subject marked NOT READY until all checks pass.

## Exact next action

Continue SS2 Agricultural Science First Term, Week 1-2 (Soil): extract and review the full source lesson including embedded figures/tables, create a lesson package with source provenance, practice questions, answer explanations and mark-by-mark marking guidance, then run its package and student-delivery tests. Do not move to the next subject until Agricultural Science has passed the full readiness gate.

## SS23-AGRIC-SS2-T2-T3 — 2026-11-16

- Status: **IMPLEMENTED AS DRAFT; SOURCE-VERIFIED; TESTING / TEACHER APPROVAL PENDING.** Package remains `PENDING`; every new unit remains `DRAFT`, unapproved and unverified.
- Branch: `agent/ss23-agricultural-science-terms2-3-20261116`.
- Changed files:
  - `backend/src/db/ss23/subjects/agricultural-science.json`: added 11 source-grounded lesson drafts (six Second-Term lessons and five Third-Term lessons), 15 term/topic coverage rows, two original-source records, 22 authored practice items with answers/explanations/marking, and 14 explicit blockers.
  - `docs/ss23/subjects/agricultural-science/SOURCE_MAP.json`: corrected Week 7-8 Farm Records mapping after original DOC-to-PDF inspection; recorded the profit-and-loss transcription discrepancy and page-level review results.
- Source checks: both combined ZIP SHA-256 hashes match `RECEIPT_20261113.md`; extracted SS2 Agricultural Science T2/T3 member hashes and byte counts match the registered source IDs exactly. Header text confirms SS2 and the relevant term. The original T3 PDF rendering confirms the Week 7-8 heading on printed page 13 and the depreciation formula on printed page 16.
- Content blockers: disease taxonomy, ornamental species names, weed nomenclature, pesticide guidance, Mendelian-law nuance, farm-account table transcription, nutrient classification, feed thresholds, and exhaustive assessment answer/marking reconciliation. Do not mark any unit approved or verified.
- Test results: package schema/validator, integrity refresh, full SS23 tests and SS1 validation are pending the refresh workflow. No local npm execution was possible in this environment.
- Exact next action: run the repository hash refresher, package validator, SS23 tests, backend typecheck and SS1 validation on GitHub Actions; fix all failures before opening the subject PR.

