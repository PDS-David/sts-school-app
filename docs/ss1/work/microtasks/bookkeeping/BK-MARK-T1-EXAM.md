# BK-MARK-T1-EXAM — Bookkeeping, 1st Term examination marker disposition

Status: **IMPLEMENTED_TESTING_DEFERRED**. Source disposition only; no lesson or assessment has been invented.

## Source identity
- Source: `SS1-SRC-62b02f2adcb3`
- Archive member: `SSS 1/1st Term SS1_/book keeping.docx`
- Source SHA-256: `9b24550136a914c0056299abdb8aeed897244929a2c330ff3892d1fa07efdce0`
- Inventory: `BK-INV-T1.md`
- Locator convention: 0-based direct children of `w:body` in the source member's `word/document.xml`; block hashes are over exact block text as documented in BK-INV-T1.

## Disposition

### Scheme entry `12.\\tExamination`
- Block: 29
- Block SHA-256: `2f860849f7d2e4301055eaaeb35d7e7d81ec252651bdd6496a56f6a41e8517e9`
- Classification: `SCHEME_ONLY` / `EXAMINATION`.
- The entry is in the preamble, before the first teaching-week marker at block 30. It is not inside a parsed teaching row and has no accompanying lesson body.

## Findings
- This is the twelfth and final scheme entry. The first teaching-week marker follows at block 30; no examination body follows the marker.
- The source contains no examination paper, questions, answers, marks, duration or marking scheme.
- No examination content is inferred or authored under this disposition.

## Implementation boundary
- Add one `classify_marker` source rule per exact anchor with `kind: SCHEME_ONLY`.
- Add one `MARKER` coverage record per marker, targeted to its corresponding rule ID.
- Leave all original source bytes and text unchanged.
- Testing/importer execution remains deferred; this record does not claim parser verification, content approval or executable delivery.
