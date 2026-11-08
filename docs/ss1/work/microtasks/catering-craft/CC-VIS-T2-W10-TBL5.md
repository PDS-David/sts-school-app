# CC-VIS-T2-W10-TBL5 — visual/table disposition

Status: **IMPLEMENTED_TESTING_DEFERRED**. Original visual inspection only; source text is not rewritten.

## Verified source and rendered evidence

- Source: `SS1-SRC-f433169ca25c`; member `SSS 1/2nd Term SS1_/2ND TERM S1 CATERING CRAFT PRACTICES.doc`.
- Member SHA-256: `fd8115ff99dd3c370b86b4b5a326fe647e49328bc83f2d041c73f29b1b84ad59`.
- Full getBody() SHA-256: `371aa91970bceb96c354a002a3ac7a5384ca597c1c2f404f51f13096b7324c8a`.
- Private LibreOffice render: PDF page 33; source table order 5 of six.
- Locator: getBody lines 1310–1321; PDF page 33.

## Table disposition

- Table: **STANDARD TOOLS / LOCAL TOOLS**.
- Layout: 2 columns with lists inside each cell.
- Decision: **TEXT/TSV representation**. Preserve exact source cell wording, order, labels and grouping in the source text. A future lesson may present a faithful Markdown table without altering the original source. No image asset is created.

## Visual finding

The rendered two-column grid is clear. Standard tools and local tools are separately headed; the source list is retained in its original order. Text/TSV representation is sufficient; no image asset or table-schema extension is required.

## Package outcome

No `assets[]` entry or table-schema extension is needed. No table cells are dropped. No tests, importer, database or device runs were performed.
