# CC-VIS-T2-W10-TBL6 — visual/table disposition

Status: **IMPLEMENTED_TESTING_DEFERRED**. Original visual inspection only; source text is not rewritten.

## Verified source and rendered evidence

- Source: `SS1-SRC-f433169ca25c`; member `SSS 1/2nd Term SS1_/2ND TERM S1 CATERING CRAFT PRACTICES.doc`.
- Member SHA-256: `fd8115ff99dd3c370b86b4b5a326fe647e49328bc83f2d041c73f29b1b84ad59`.
- Full getBody() SHA-256: `371aa91970bceb96c354a002a3ac7a5384ca597c1c2f404f51f13096b7324c8a`.
- Private LibreOffice render: PDF page 33–34; source table order 6 of six.
- Locator: getBody lines 1337–1375; PDF pages 33–34.

## Table disposition

- Table: **LOCAL / STANDARD (METRIC) conversion table**.
- Layout: 2 columns; liquid and dry/solid groups; continues across a page break.
- Decision: **TEXT/TSV representation**. Preserve exact source cell wording, order, labels and grouping in the source text. A future lesson may present a faithful Markdown table without altering the original source. No image asset is created.

## Visual finding

The rendered table begins on page 33 and continues on page 34. The two columns and the Liquid / Dry/Solid groups remain visually identifiable; the page break is a continuation, not a second table. The source values are retained in order as text. They are not validated or corrected here; CC-FACT-T2-MEASURING-CONVERSION-FIGURES owns arithmetic, units and local-container checks.

## Package outcome

No `assets[]` entry or table-schema extension is needed. No table cells are dropped. No tests, importer, database or device runs were performed.
