# FA-VIS-T1-W03-FORMATS — ledger and journal format disposition

Status: **IMPLEMENTED_TESTING_DEFERRED**. This is a visual-source inspection and disposition. No binary drawing, source image or new asset is committed.

## Source identity
- Source: `SS1-SRC-cf77df509ac3`, `SSS 1/1st Term SS1_/1ST TERM S1 FINANCIAL ACCOUNT.docx`.
- Archive SHA-256: `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`.
- Member SHA-256: `c6d4a1b32ff8eb5377f8e7f1014cccfc4345a706bbeb333131a5d50afa6a3edb`.
- Week Three section SHA-256: `ceeb81718319d69d21106826a24d61b37019705f3c03069fd7620e14219c403e`.
- Both figures occur on rendered source page 6. The original DOCX was converted locally to PDF for inspection; the PDF and page images are not committed.

## 1. Ledger account format

**Source locator:** Mammoth lines 385–415; heading “Format of A Ledger Account”; table text lines 387–401; drawing paragraph index 193.

**Exact one-row cell order:**
`Date | Narration | Folio | Amount | Date | Narration | Folio | Amount`

**Visual observations:**
- The source table contains eight cells in one row.
- The surrounding box has nine vertical rules (including the two outer boundaries).
- The first four cells form the left group; the second four cells form the right group.
- Nearby source prose at lines 417–423 says the ledger account is divided into two sides: Debit and Credit.
- The source table itself does **not** print “Debit” or “Credit” as additional cell headers.

**Disposition:**
- Preserve all eight cell labels and their order exactly.
- In any original student-facing representation, the first four-cell group may be labelled externally **Debit (left)** and the second group **Credit (right)**. These are explanatory side labels derived from the adjacent source prose and the standard ledger-account convention; they are not source-printed cell text and must not replace or be inserted into the eight source cells.
- The Week Three supplement's written answer (Debit left; Credit right; Date/Narration/Folio/Amount on each side) follows this disposition.
- No binary drawing or SVG is committed in this task.

## 2. Journal format

**Source locator:** Mammoth lines 431–465; heading “Format of The Journal”; table text lines 433–441; drawing paragraph index 221.

**Exact one-row cell order:**
`Date | Narration | Folio | Details | Totals`

**Visual observations:**
- The source table contains five cells in one row.
- The surrounding box has six vertical rules (including the two outer boundaries).
- The source does not show separate debit and credit amount columns within this five-cell table.

**Disposition:**
- Preserve the five source labels and their order exactly.
- Do not invent debit/credit subcolumns or silently reinterpret “Details” and “Totals”. The Week Three lesson explains the double-entry principle separately and explicitly flags the source's line 461 statement.
- No binary drawing or SVG is committed in this task.

## 3. Student-delivery boundary
- The source layout and field sequence are now documented and can be used to build an independently authored accessible table if that is approved later.
- The current lesson explains the two ledger sides and field purposes in text; it does not include the original ruled drawing.
- Coverage for `COV-FA-T1-W03-LEDGER-FORMAT` and `COV-FA-T1-W03-JOURNAL-FORMAT` remains **PARTIAL** because no student-facing rendered visual has been added.
- The open assessment item remains blocking until the teacher/owner decides whether the text explanation is sufficient or requests an original accessible visual.
- Package asset count is unchanged. No source content or owner approval is invented.

## Verification notes
- Inspected the original embedded Word drawing and the locally rendered page 6.
- Verified the eight-cell ledger row and five-cell journal row from source text.
- Counted nine ledger vertical rules and six journal vertical rules.
- Confirmed that “Debit” and “Credit” are adjacent explanatory prose, not extra cells in the ledger header.
- Confirmed the journal header contains only the five labels shown above.
- Not run: package tests, TypeScript, importer/compiler, database or device checks.

## Exact next action
If a student-facing visual is required, create a separate original accessible table using the preserved cell order and external Debit/Credit group labels; obtain teacher approval before adding it as a package asset. Do not copy or overwrite the source drawing.
