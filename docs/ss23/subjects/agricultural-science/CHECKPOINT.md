# Agricultural Science — SS2 / SS3 subject checkpoint

Updated: 2026-11-13
Task family: SS23-AGRIC
Branch: `agent/ss23-agricultural-science-source-map-20261113`
Base: `master` @ `b8651cebaa480097fd1c40c9b02c11b228187caa`

## Status

**SOURCE MAPPING IN PROGRESS — NOT READY FOR STUDENT RELEASE.**

This checkpoint covers only Agricultural Science. It does not certify any other subject.

## Source register

Five source documents have been extracted and their document headers checked against the intended class and term. Their exact member SHA-256 values, byte counts, archive hashes, scheme rows and body anchors are recorded in `SOURCE_MAP.json`.

| Class | Term | Source ID | Week mapping |
|---|---|---|---|
| SS2 | First | `SS23-SRC-237dbcc77749` | 1-10; Weeks 8-9 are grouped under a Week Eight body heading |
| SS2 | Second | `SS23-SRC-cd612ad10f40` | 1-12; source headings map to scheme |
| SS2 | Third | `SS23-SRC-6abb32818845` | 1-10 body present; Weeks 7-8 accounting heading is missing, but content begins at “Balance Sheet or Networth Statement” |
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
