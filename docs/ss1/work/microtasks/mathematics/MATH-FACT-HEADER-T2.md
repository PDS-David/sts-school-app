# MATH-FACT-HEADER-T2 — Mathematics, 2nd Term header verification

Status: **IMPLEMENTED_TESTING_DEFERRED** (implemented; not approved, not verified). Testing deferred by owner.

## Inputs
- Starting SHA: `0541124` (origin/master). No open branch for this item was found; prerequisite MATH-SRC-T2 was IMPLEMENTED_TESTING_DEFERRED (not verified).
- Source `SS1-SRC-b802686e83d2`, manifest member `SSS 1/2nd Term SS1_/2ND TERM S1 MATHEMATICS.docx`.
- Member SHA-256 `9bcc6573d7b3c9babd7c984db1bf79cae6385e9fa3fd5820fdf8cf26af9b3368` **verified**; equals `SOURCE_ASSIGNMENTS.csv`.
- Supplied container: partial ZIP `2nd_Term_SS1_-20230730T171417Z-001.zip`, SHA-256 `94a32a4ec4af7d492d26feecdf06cedfedf846d3c65c27a5473a1693d0d33c0a`, member path `2nd Term SS1 /2ND TERM S1 MATHEMATICS.docx`. Not the composite archive; the composite hash was **not** checked.
- Method: member hashed unchanged; private copy read with `mammoth` 1.12.2 `extractRawText({path})` (the importer's .docx call) and cross-checked against `word/document.xml`, `header1.xml` and `footer1.xml`. Nothing from the source is committed.

## Findings (verbatim, short)
- Line 1: `SECOND TERM E-LEARNING NOTE`.
- Line 5: `SUBJECT: MATHEMATICS` + eight tabs + `CLASS: SS 1` (plus a trailing tab). It occurs once and matches the recorded `header_text` exactly (trailing tab excluded). The recorded locator "line 2" was wrong; the line is line 5 of the extracted text (lines 2-4 are blank).
- It names Mathematics, class SS 1 and, with line 1, the 2nd Term. `FURTHER` occurs twice, both in reading-assignment titles ("Further Maths Project"), so this is not Further Mathematics or another subject. The scheme lists quadratic equations, sets, trigonometry, circles and logic.
- Observed, not audited: the page header holds one picture; the footer reads `MR OSHO/1ST TERM/SS 1/MATHEMATICS Page N`, saying 1ST TERM in a 2nd Term document. Not used as evidence; for MATH-FACT-ADVERT-T2.
- No mismatch, so no new open item and no handoff.

## Edits
- `mathematics.json`: `header_evidence` for `SS1-SRC-b802686e83d2` corrected (locator and explanation). `header_text`, the alias rule and its `PENDING-OWNER` approval_reference are unchanged (see MATH-APPROVAL-ALIASES).
- `QUEUE.json`: MATH-FACT-HEADER-T2 → IMPLEMENTED_TESTING_DEFERRED; counts and `next_runnable` recomputed.

## Remaining
- Owner alias approval (MATH-APPROVAL-ALIASES). 3rd Term header verification is MATH-FACT-HEADER-T3.

Checks run: hashes, JSON syntax, reference consistency, diff inspection only. Testing deferred by owner.
