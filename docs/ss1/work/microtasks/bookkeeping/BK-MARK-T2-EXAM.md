# BK-MARK-T2-EXAM — Bookkeeping, 2nd Term examination marker

Status: **IMPLEMENTED_TESTING_DEFERRED**. Scheme marker only; no examination content is invented.

## Source
- Source ID: `SS1-SRC-97c1db5b1eb0`
- Member SHA-256: `c8c75f55e327d7d3e6ece6b3caca2ea841d3d3a45d324ceb221843c265157af3`
- Inventory: `BK-INV-T2.md`

## Marker
- Exact anchor `12.\tExamination`, scheme block 30, SHA-256 `2f860849f7d2e4301055eaaeb35d7e7d81ec252651bdd6496a56f6a41e8517e9`.
- The marker is in the preamble, immediately before the first teaching-week body at block 31.
- No examination paper, questions, answers, marks, duration or marking scheme is supplied.

## Implementation
- Added `RULE-BK-T2-EXAM-12` as `classify_marker` / `SCHEME_ONLY`.
- Added `COV-BK-T2-EXAM-12` with `MARKER` status targeting that rule ID.
- No examination content was authored.

## Verification boundary
Package declarations are written; importer/compiler and package tests remain deferred. No duplicate lesson coverage was linked.
