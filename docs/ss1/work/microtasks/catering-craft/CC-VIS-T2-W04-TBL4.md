# CC-VIS-T2-W04-TBL4 — visual/table disposition

Status: **IMPLEMENTED_TESTING_DEFERRED**. Original visual inspection only; source text is not rewritten.

## Verified source and rendered evidence

- Source: `SS1-SRC-f433169ca25c`; member `SSS 1/2nd Term SS1_/2ND TERM S1 CATERING CRAFT PRACTICES.doc`.
- Member SHA-256: `fd8115ff99dd3c370b86b4b5a326fe647e49328bc83f2d041c73f29b1b84ad59`.
- Full getBody() SHA-256: `371aa91970bceb96c354a002a3ac7a5384ca597c1c2f404f51f13096b7324c8a`.
- Private LibreOffice render: PDF page 19; source table order 4 of six.
- Locator: getBody lines 731–741; PDF page 19.

## Table disposition

- Table: **COLOURINGS — Natural / Artificial**.
- Layout: 2 columns; two header cells and lists within the columns.
- Decision: **TEXT/TSV representation**. Preserve exact source cell wording, order, labels and grouping in the source text. A future lesson may present a faithful Markdown table without altering the original source. No image asset is created.

## Visual finding

The rendered two-column table is legible. Natural lists carotene, chlorophyll, carotenoids, turmeric, jellies and anthocyanin; Artificial lists coal tars, dyes, caramel and colour enhancer. The original text preserves headings and list order. Text/TSV representation is sufficient; the additive claims remain under CC-FACT-T2-ADDITIVES-COLOURINGS.

## Package outcome

No `assets[]` entry or table-schema extension is needed. No table cells are dropped. No tests, importer, database or device runs were performed.
