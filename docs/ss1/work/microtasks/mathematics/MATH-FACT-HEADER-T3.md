# MATH-FACT-HEADER-T3 — Mathematics, 3rd Term header verification

Status: **IMPLEMENTED_TESTING_DEFERRED** (implemented; not approved, not verified). Testing deferred by owner.

## Inputs
- Starting SHA: `d1f3c8d` (origin/master, after PR #157). No open PR and no branch for this item was found; prerequisite MATH-SRC-T3 was IMPLEMENTED_TESTING_DEFERRED (not verified).
- Source `SS1-SRC-ca00ca94afb9`, manifest member `SSS 1/3rd Term SS1_/3RD TERM S1 MATHEMATICS.docx`.
- Member SHA-256 `9cc003bfd8d06f7da212d0586a44b04749a312c4759cc3422eae2290e2ec84f2` **verified**; equals `SOURCE_ASSIGNMENTS.csv` and the task note (1,365,317 bytes).
- Supplied container: partial ZIP `3rd_Term_SS1_-20230730T172330Z-001.zip`, SHA-256 `411c596e24f3ae755326a095478db1d47d52ed3ddb7eff7e95d666d4de2aa445`, member path `3rd Term SS1 /3RD TERM S1 MATHEMATICS.docx`. It was supplied twice; both copies are byte-identical. It is not the composite archive; the composite hash was **not** checked. The same ZIP also holds `3RD TERM S1 FURTHER MATHEMATICS.docx` (a different member, SHA-256 `83af98556a1b01fa0811df6274e7cca3bec978d1e7b411c17994613b2a34a2c5`); it was not used.
- Method: member extracted unchanged and hashed; a private copy read with `mammoth` 1.12.2 `extractRawText({path})` (the importer's .docx call) and cross-checked against `word/document.xml`, `header1.xml` and `footer1.xml`. Nothing from the source is committed.

## Findings (verbatim, short)
- Line 1: `THIRD TERM E-LEARNING NOTE`.
- Line 5: `SUBJECT: MATHEMATICS` + seven tabs + `CLASS: SSS 1` (no trailing whitespace). It occurs once and matches the recorded `header_text` exactly. The recorded locator "line 2" was wrong; the line is line 5 of the extracted text (lines 2-4 are blank).
- It names Mathematics, class SSS 1 and, with line 1, the 3rd Term. `FURTHER` does not occur anywhere, so this is not Further Mathematics or another subject. The scheme lists mensuration, geometrical constructions and statistics.
- The document's class label is `SSS 1`; the package's `class_name` is the normalised `SS 1`, as for the other terms. Other `SSS 1` occurrences are a textbook title and worked examples.
- Observed, not audited: the page header holds one picture; the footer reads `MR OSHO/SS 1/MATHEMATICS/3RD TERM Page N` (consistent with the 3rd Term).
- No mismatch, so no new open item and no handoff.

## Edits
- `mathematics.json`: `header_evidence` for `SS1-SRC-ca00ca94afb9` corrected (locator and explanation). `header_text`, the alias rule `RULE-MATH-T3-ALIAS` and its `PENDING-OWNER` approval_reference are unchanged (see MATH-APPROVAL-ALIASES).
- `QUEUE.json`: MATH-FACT-HEADER-T3 → IMPLEMENTED_TESTING_DEFERRED; status counts and `next_runnable` recomputed. `runnable_now` was left as it is, as in the T1 and T2 items.

## Remaining
- Owner alias approval (MATH-APPROVAL-ALIASES).
- Many items are now unblocked (MATH-PRE-T1 to T3, week indexing, visual and fact items); they share the queue and package, so run one at a time.

Checks run: hashes, JSON syntax, reference consistency, diff inspection only. Testing deferred by owner.
