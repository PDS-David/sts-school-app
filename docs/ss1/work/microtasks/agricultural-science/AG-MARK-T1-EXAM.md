# AG-MARK-T1-EXAM — First Term examination marker disposition

Status: **IMPLEMENTED_TESTING_DEFERRED**. This is a source-marker disposition, not an examination lesson, content approval, verification or acceptance.

## Source and evidence

- Source: `SS1-SRC-7aa642b0085b`
- Manifest member: `SSS 1/1st Term SS1_/1ST TERM S1 AGRICULTURAL SCIENCE.docx`
- Manifest/member SHA-256: `df1b516cdd8855d069a329d7aa627dbd0dcd3612dd10d254c53af9cb93a56526`
- Existing source inspection: [AG-INV-T1.md](./AG-INV-T1.md), which records inspection of the original DOCX `word/document.xml`.
- Locator: SS1-SRC-7aa642b0085b: word/document.xml, direct w:body block 23 (0-based); exact scheme item 12; block sha256 c60e32db919b2fb4abce1f8e727f3c741a7e9052ee1ade94b9322df2bc92c8af
- Exact source text: `Examination.`

The inventory records ten teaching weeks (WEEK 1–10). The examination line is scheme item 12 in block 23. There is no WEEK 12 label or body and no examination paper or marking scheme in the document. The scheme-only marker is distinct from the evaluation and revision-question sections inside the teaching-week bodies.

## Disposition implemented

- Added `SS1-SRC-7aa642b0085b-R003` to `source_rules[]` as `classify_marker` with `kind: SCHEME_ONLY`.
- Added `COV-AG-T1-EXAM-MARKER` with `status: MARKER`, bound to that rule.
- No examination lesson, paper, questions, answer key, marking scheme or asset was created.
- The source text is retained; the rule classifies the scheme line and does not delete it.

## Validation and limitations

- Package and queue JSON were parsed before writing; new IDs were checked for uniqueness.
- Queue status counts and `next_runnable` were recomputed from the live queue.
- Compiler/importer, schema test, database and application checks were **not run**. The compiler's exact-anchor and marker-disposition checks remain deferred.
- The earlier inventory verified the standalone member SHA against the manifest but explicitly did not verify the enclosing composite archive SHA-256. No claim of composite-archive verification is made.
