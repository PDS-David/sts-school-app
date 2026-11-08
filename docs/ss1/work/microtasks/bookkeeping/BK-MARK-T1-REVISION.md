# BK-MARK-T1-REVISION — Bookkeeping, 1st Term revision marker disposition

Status: **IMPLEMENTED_TESTING_DEFERRED**. Source disposition only; no lesson or assessment has been invented.

## Source identity
- Source: `SS1-SRC-62b02f2adcb3`
- Archive member: `SSS 1/1st Term SS1_/book keeping.docx`
- Source SHA-256: `9b24550136a914c0056299abdb8aeed897244929a2c330ff3892d1fa07efdce0`
- Inventory: `BK-INV-T1.md`
- Locator convention: 0-based direct children of `w:body` in the source member's `word/document.xml`; block hashes are over exact block text as documented in BK-INV-T1.

## Disposition

### Scheme entry `1.\\tRevision.`
- Block: 3
- Block SHA-256: `7a903777d5427675bcd33f525cb7d451e982d9676d19f0ecfc983fc71f97813c`
- Classification: `SCHEME_ONLY` / `REVISION`.
- The entry is in the preamble, before the first teaching-week marker at block 30. It is not inside a parsed teaching row and has no accompanying lesson body.

### Scheme entry `11.\\tRevision.`
- Block: 28
- Block SHA-256: `2a63828deabed8b07ba2aee44c8aec95f42a1c3e56a3d147aaf004f5ca697fc9`
- Classification: `SCHEME_ONLY` / `REVISION`.
- The entry is in the preamble, before the first teaching-week marker at block 30. It is not inside a parsed teaching row and has no accompanying lesson body.

## Findings
- The source contains two revision headings in the scheme list. Neither is followed by a revision section, worksheet, revision questions, answers or marking scheme.
- No revision content is inferred from the word “Revision”, and no lesson ID or assessment item is created.
- Both are classified as preamble-only markers using separate exact anchors; neither classification discards instructional body text because neither anchor is in a parsed week body.

## Implementation boundary
- Add one `classify_marker` source rule per exact anchor with `kind: SCHEME_ONLY`.
- Add one `MARKER` coverage record per marker, targeted to its corresponding rule ID.
- Leave all original source bytes and text unchanged.
- Testing/importer execution remains deferred; this record does not claim parser verification, content approval or executable delivery.
