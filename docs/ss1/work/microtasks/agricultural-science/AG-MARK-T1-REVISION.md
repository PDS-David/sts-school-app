# AG-MARK-T1-REVISION — First Term revision marker disposition

Status: **IMPLEMENTED_TESTING_DEFERRED**. This is a source-marker disposition, not a revision lesson, content approval, verification or acceptance.

## Source and evidence

- Source: `SS1-SRC-7aa642b0085b`
- Manifest member: `SSS 1/1st Term SS1_/1ST TERM S1 AGRICULTURAL SCIENCE.docx`
- Manifest/member SHA-256: `df1b516cdd8855d069a329d7aa627dbd0dcd3612dd10d254c53af9cb93a56526`
- Existing source inspection: [AG-INV-T1.md](./AG-INV-T1.md), which records inspection of the original DOCX `word/document.xml` and the exact block locator below.
- Locator: SS1-SRC-7aa642b0085b: word/document.xml, direct w:body block 22 (0-based); exact scheme item 11; block sha256 85ccf500892b65cad9414f8eea121c37aec0733924aec52bfa823444e1214f9b
- Exact source text: `Revision of the Term’s Work.`

The inventory records ten teaching weeks (WEEK 1–10), with the final teaching-week label at block 866 and the document ending at block 931. The revision line is scheme item 11 in block 22; the scheme's examination item is separate. The source has no WEEK 11 body, revision worksheet or marking scheme. The inventory also distinguishes this scheme marker from the per-week `GENERAL EVALUATION/REVISION QUESTIONS` sections, which remain within their respective teaching-week bodies.

## Disposition implemented

- Added `SS1-SRC-7aa642b0085b-R002` to `source_rules[]` as `classify_marker` with `kind: SCHEME_ONLY`.
- Added `COV-AG-T1-REVISION-MARKER` with `status: MARKER`, bound to that rule.
- No lesson, revision questions, answer key, marking scheme or asset was created.
- The source text is retained; the rule classifies the scheme line and does not delete it.

## Validation and limitations

- Package and queue JSON were parsed before writing; the new rule and coverage IDs were checked for uniqueness.
- Queue status counts and `next_runnable` were recomputed from the live queue.
- Compiler/importer, schema test, database and application checks were **not run**. The compiler's exact-anchor and marker-disposition checks therefore remain deferred.
- The earlier inventory verified the standalone member SHA against the manifest but explicitly did not verify the enclosing composite archive SHA-256. That limitation is retained here; no claim of composite-archive verification is made.
