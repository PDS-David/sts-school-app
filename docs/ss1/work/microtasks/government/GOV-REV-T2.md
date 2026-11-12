# GOV-REV-T2 — Government, 2nd Term revision/examination marker disposition

**Status:** IMPLEMENTED — TESTING DEFERRED. This records a scheme-only marker; it does not create teaching content or an examination.

## Source identity and exact anchor

- Source ID: SS1-SRC-c76f430c7cf8
- Archive SHA-256: 024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e
- Member: `SSS 1/2nd Term SS1_/GOVT.docx`
- Member SHA-256: bce2ae4a8b26f1737631e99387fed3cba661e328da3df274f673b6850088d782
- Exact source row at `word/document.xml` `w:body` child 34: `12 - 13\t\tRevision and Examination`
- Preamble children 1–34 C14N SHA-256: `7df3af37ac3307035c8b7d43421ee754018a8ccc3deb5ed651da10d764ad56a0`
- Child 34 C14N SHA-256: `a11872ded871723aa2516f83f72085a707da50d8a848237a24208d1ab6a75431`
- Exact row occurrence is unique, as recorded in GOV-INV-T2.

## Disposition

Added source rule `SS1-SRC-c76f430c7cf8-R002`:
- `op`: `classify_marker`
- `kind`: `SCHEME_ONLY`
- `match_mode`: `WHOLE_LINE`
- `anchor`: exact source row above
- source/member hash binding and exact evidence locator are stored in `government.json`.

Updated the existing coverage entry `COV-GOV-T2-SCHEME-REVISION-EXAMINATION` to use the rule ID as its MARKER target, as required by the package contract.

## Scope boundary

The 2nd Term scheme contains the unique row “12–13 Revision and Examination”, but the source body has only eleven teaching weeks. There is no Week Twelve or Week Thirteen teaching body. This row is therefore a scheme-only marker.

No revision lesson, examination paper, answer key, marks, new teaching week or additional coverage was created. The exact source wording remains unchanged.

## Checks and limits

- Verified the archive/member hashes recorded by the registration and inventory tasks.
- Reused the inventory's exact unique-row evidence and recomputed preamble/paragraph C14N hashes.
- Rule shape matches the strict schema: `classify_marker` supports `SCHEME_ONLY` and `WHOLE_LINE`.
- Updated the existing marker coverage target to the rule ID.
- No tests, typechecks, compiler/importer, database or app/device checks run; testing remains deferred by owner.
