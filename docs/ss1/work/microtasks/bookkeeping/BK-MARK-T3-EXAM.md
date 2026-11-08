# BK-MARK-T3-EXAM — Bookkeeping, 3rd Term examination marker

Status: **IMPLEMENTED_TESTING_DEFERRED**. Scheme marker only; no examination content is invented.

## Source identity
- Source: `SS1-SRC-97f226215927`
- Member SHA-256: `343c428b86364be8e1784c814fdd7ca3d02836f508e7eff289af0e139447fd7d`
- Inventory: `BK-INV-T3.md`

## Marker
- Exact scheme anchor: `12    exam`
- Block 41, SHA-256 `96bdf60333eb1cb78ace49a418eb4ba0f4fffec531a07fece7da63eecacba7be`.
- The marker is in preamble blocks 0–43, before the first teaching section at block 44.
- No examination paper, questions, answers, marks, duration or marking scheme is supplied.

## Implementation
- Added `RULE-BK-T3-EXAM-12` as an exact `classify_marker` rule with `kind: SCHEME_ONLY`.
- Added `COV-BK-T3-EXAM-12` with `status: MARKER`, targeting that rule ID.
- Original source bytes and text are unchanged.

## Verification boundary
Rule and coverage declarations are written but importer/compiler execution and package tests remain deferred. This is not teacher approval or delivery verification.
