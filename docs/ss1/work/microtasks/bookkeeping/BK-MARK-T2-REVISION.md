# BK-MARK-T2-REVISION — Bookkeeping, 2nd Term revision markers

Status: **IMPLEMENTED_TESTING_DEFERRED**. Both preamble entries are marker-only; no revision material is invented.

## Source
- Source ID: `SS1-SRC-97c1db5b1eb0`
- Member SHA-256: `c8c75f55e327d7d3e6ece6b3caca2ea841d3d3a45d324ceb221843c265157af3`
- Inventory: `BK-INV-T2.md`

## Markers
- `1.\tRevision.`, scheme block 4, block SHA-256 `7a903777d5427675bcd33f525cb7d451e982d9676d19f0ecfc983fc71f97813c`.
- `11.\tRevision.`, scheme block 29, block SHA-256 `2a63828deabed8b07ba2aee44c8aec95f42a1c3e56a3d147aaf004f5ca697fc9`.
- Both precede the first teaching-week body at block 31. No revision worksheet, questions, answers or marking scheme is present.

## Implementation
- Added `RULE-BK-T2-REVISION-1` and `RULE-BK-T2-REVISION-11` as `classify_marker` / `SCHEME_ONLY`.
- Added matching `MARKER` coverage records targeting each exact rule ID.
- No teaching content or assessment was created.

## Verification boundary
Package declarations are written; importer/compiler and package tests remain deferred. No duplicate lesson coverage was linked.
