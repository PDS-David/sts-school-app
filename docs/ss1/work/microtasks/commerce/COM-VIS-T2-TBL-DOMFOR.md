# COM-VIS-T2-TBL-DOMFOR — Commerce, 2nd Term Week 2 Domestic vs Foreign Trade table

Status: **IMPLEMENTED_TESTING_DEFERRED** (disposition recorded; not approved, not verified, app display not checked). Testing deferred by owner.

## Inputs
- Base: origin/master `7353234`. Read: `commerce.json`, `commerce/QUEUE.json`, `COM-INV-T2.md`.
- Original: `commerce.docx`, supplied as a standalone attachment; SHA-256 `c18e26659058445f2341ca9365be0eaa71cceea88e388731fc98da531a2add86` — **verified** against the registered source `SS1-SRC-0ccdf9dd3768`. The composite archive was not supplied, so its hash was not checked.
- Method: `word/document.xml` parsed with lxml in a private scratch directory; locator = 0-based child of `w:body`, as in COM-INV-T2. Only block 138 was inspected (blocks 137 and 139-140 were glanced at to confirm placement). The importer's own text call (`mammoth@1.12.2` `extractRawText`) was run on the member to see the delivered text. Nothing from the document is committed.

## Block 138 — exact cell associations
`w:tbl`, grid 2 columns (4621 / 4621), 4 rows, no merged cells (`gridSpan`/`vMerge` absent), one paragraph per cell. Block-text sha256 `ee98d2d3…c004` matches the queue.

| Row | Column 0 (Domestic Trade) | Column 1 (Foreign Trade) | Cell sha256 prefixes (col 0 / col 1) |
|---|---|---|---|
| 0 (header) | `DOMESTIC TRADE` | `FOREIGN TRADE` | `8d238581…` / `62e3531e…` |
| 1 | `1. It is a trade within the boundary of a country ` (trailing space) | `Trade with other countries` | `c8dd2e9b…` / `d8a70fdd…` |
| 2 | `2. Same currency is used to transact business` | `Different currencies used for business` | `55a8cf68…` / `8ea29a4a…` |
| 3 | `3. Same weight and measures are used` | `Different weight and measures are used` | `3486c3d7…` / `6cf46d64…` |

Hash of the eight cell texts joined by `\n`: `f0d8271bee8da61e69908f044ff2b5e00ea5a98513c3bfe409136a194641c7b0`. Source wording (including "weight and measures") is unaltered. Numbering `1.`-`3.` is only in column 0.

## Does the existing text representation preserve the pairs?
**Only by position.** The importer's call returns the table as eight consecutive paragraphs, blank-line separated, in row-major order:
`DOMESTIC TRADE` / `FOREIGN TRADE` / `1. It is a trade…` / `Trade with other countries` / `2. Same currency…` / `Different currencies…` / `3. Same weight…` / `Different weight…`, followed by an empty block and `SIMILARITIES`.
- All cell text survives, nothing is lost or merged.
- No column label, delimiter or row grouping survives. A reader gets pairs only by knowing that the cells alternate Domestic, Foreign; the header is two bare lines, and the unnumbered Foreign cells do not say which row they belong to.
- Correction to COM-INV-T2: its "cells concatenate with no separator" is true of plain `w:t` concatenation (used for the block hash), not of the importer's output, which separates cells with blank lines.
- Not verified: how the app displays those eight paragraphs, and any other extractor.

**Smallest repair under the existing schema** (no table type exists): in a Week 2 supplement or delivery replacement, restate the header and each row as an explicit pair, e.g. `Row 2 — Domestic trade: <cell>; Foreign trade: <cell>`, with the original cell wording kept as the source claim. Original row untouched. Recorded as open item `COMMERCE-T2-TBL-DOMFOR-REPRESENTATION`. No supplement is authored here (Week 2 lessons belong to later items).

## Source claims vs endorsed teaching
| Row | Pair | Disposition |
|---|---|---|
| 0 | header | Labels only; no claim. |
| 1 | within the boundary of a country / trade with other countries | Definitional contrast; no factual issue recorded. |
| 2 | same currency / **different currencies used** | Domestic side stated as generally true. Foreign side is universal-sounding: **not endorsed as written**. Not established here whether trade between partners that share a currency, or invoiced in a third currency, makes it misleading. |
| 3 | same weight and measures / **different weight and measures are used** | Same: foreign side **not endorsed as written** pending a check of whether international trade uses different or standardised units. |

Nothing here teaches that all foreign trade involves different currencies or different weights and measures. The check is not performed in this item; it is the follow-up below.

## Edits
- `commerce.json`: open items `COMMERCE-T2-TBL-DOMFOR-REPRESENTATION` (CONTENT) and `COMMERCE-T2-TBL-DOMFOR-FOREIGN-CLAIMS` (FACT), both blocking. No lesson, coverage, correction, asset or source rule touched.
- `QUEUE.json`: this item → `IMPLEMENTED_TESTING_DEFERRED`; new PENDING item `COM-FACT-T2-TBL-DOMFOR-CLAIMS` (exact cells: row 2 and row 3, column 1) inserted after it; counts, status_counts and `next_runnable` recomputed; one note appended.
- This file.

## Checks (authoring checks, not tests)
SHA-256 of the member; block and cell hashes; JSON parse of both files (round-tripped with original formatting); unique open-item and queue IDs; `depends_on` resolves; counts recomputed from items. No typecheck, suite, importer, database or device run.

## Remaining
- `COM-FACT-T2-TBL-DOMFOR-CLAIMS` (new, PENDING): factual check of the two Foreign cells.
- Paired-row restatement waits for Week 2 supplement authoring. App display unverified. This does not claim the subject or class complete.
