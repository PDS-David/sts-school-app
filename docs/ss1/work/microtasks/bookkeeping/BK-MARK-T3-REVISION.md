# BK-MARK-T3-REVISION — Bookkeeping, 3rd Term revision markers

Status: **IMPLEMENTED_TESTING_DEFERRED**. Both markers are scheme-only; no revision content is invented.

## Source identity
- Source: `SS1-SRC-97f226215927`
- Member SHA-256: `343c428b86364be8e1784c814fdd7ca3d02836f508e7eff289af0e139447fd7d`
- Inventory: `BK-INV-T3.md`

## Markers
- Week 1 scheme entry: exact anchor `1                 Revision`, block 5, SHA-256 `001512a6ddbf840fdbd3388e661b790495094a020e23a723cbd9cf14eeaa0204`.
- Week 11 scheme entry: exact anchor `11       revision`, block 40, SHA-256 `b6d1ba5101b51df16c679e834778c5122b62ba0722f8b3685cd0d92892466166`.
- Both occur in preamble blocks 0–43, before the first teaching section at block 44.
- No revision body, worksheet, revision questions, answers or marking scheme is supplied.

## Implementation
- Added exact `classify_marker` rules `RULE-BK-T3-REVISION-1` and `RULE-BK-T3-REVISION-11`, each with `kind: SCHEME_ONLY`.
- Added `MARKER` coverage records `COV-BK-T3-REVISION-1` and `COV-BK-T3-REVISION-11`, each targeting its corresponding rule ID.
- Original source bytes and text are unchanged.

## Verification boundary
Rule and coverage declarations are written but importer/compiler execution and package tests remain deferred. This is not teacher approval or delivery verification.
