# MATH-FACT-HEADER-T1 — Mathematics, 1st Term header verification

Status: **IMPLEMENTED_TESTING_DEFERRED** (implemented; not approved, not verified). Testing deferred by owner.

## Inputs
- Starting SHA: `96ab51dbfa5a8f9b0e31be4ad7372bb0d1e50b1e` (origin/master); no open PR or branch touched this item.
- Source `SS1-SRC-0c9004137f95`, manifest member `SSS 1/1st Term SS1_/MATHss1.docx`.
- Composite archive SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e` **verified** (supplied as `SSS_1-20260507T072431Z-3-001.zip`; the hash decides).
- Member SHA-256 `d8cd49545976d4d35687bb7a8efc93cf387489bf190e00b20f981c9592e671cb` **verified**; 819,678 bytes, equals `SOURCE_ASSIGNMENTS.csv`. It is not the 150,666-byte copy PR #71's worker received in chat (OI-MATHS-001).
- Method: member extracted unchanged with `unzip` and hashed; read with `mammoth` 1.12.2 `extractRawText({path})` (the importer's .docx call) and cross-checked against `word/document.xml`, `header1.xml` and `footer1.xml`, in a scratch directory. Nothing from the source is committed.

## Findings (verbatim, short)
- Title line: `SS1 GENERAL MATHEMATICS SCHEME OF WORK FOR FIRST TERM` — line 3 of the extracted text (lines 1-2 blank), the first non-empty body paragraph; occurs once. It matches the recorded `header_text` exactly (trailing space excluded).
- It names class SS1, first term and General Mathematics in one line. There is no separate SUBJECT or CLASS line.
- Not Further Mathematics or another subject: "FURTHER" does not occur in the text; the other "GENERAL MATHEMATICS" hit is a reference-book title. Page header part reads "Lesson note"; footer is a page number.
- No mismatch, so no new open item and no handoff.

## Edits
- `mathematics.json`: `header_evidence` for `SS1-SRC-0c9004137f95` corrected (locator was "first line of extracted text", which is blank; explanation now records the findings above). `header_text` unchanged. Alias rule `RULE-MATH-T1-ALIAS` and its `PENDING-OWNER` approval_reference **not** changed (see MATH-APPROVAL-ALIASES).
- `QUEUE.json`: MATH-FACT-HEADER-T1 → IMPLEMENTED_TESTING_DEFERRED; status counts and `next_runnable` recomputed strictly from satisfied dependencies (previously a single curated entry).

## Remaining
- Owner alias approval (MATH-APPROVAL-ALIASES). Header verification for T2 and T3 is separate (MATH-FACT-HEADER-T2/T3).

Checks run: hashes, JSON syntax, reference consistency, diff inspection only. Testing deferred by owner.
