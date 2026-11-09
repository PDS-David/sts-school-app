# CC-VIS-T2-W01-TBL1 — visual/table disposition

Status: **IMPLEMENTED_TESTING_DEFERRED**. Original visual inspection only; no source text changed and no asset was invented.

## Verified source and rendered evidence

- Source: `SS1-SRC-f433169ca25c`; exact member `SSS 1/2nd Term SS1_/2ND TERM S1 CATERING CRAFT PRACTICES.doc`.
- Member SHA-256: `fd8115ff99dd3c370b86b4b5a326fe647e49328bc83f2d041c73f29b1b84ad59`.
- Extractor: `word-extractor` 1.0.4; full getBody() SHA-256 `371aa91970bceb96c354a002a3ac7a5384ca597c1c2f404f51f13096b7324c8a`.
- Render: private LibreOffice PDF from the exact verified member; visual page: getBody lines 57–66; PDF page 2.
- Table identity: source inventory table order 1 of six.

## Table disposition

- Table: **Animal Source / Name**.
- Size: 10 rows × 2 columns.
- Decision: **TEXT representation**. Retain the exact source cell wording and order as tab-separated text in the original source representation. A later authored lesson may present a faithful Markdown table, but this task does not rewrite the source or create an image.
- Visual finding: The rendered table has a clear two-column grid and ten data rows (including 'Bush animals like rabbit, antelope, deer' → 'Game' and 'Domesticated birds' → 'Poultry'). The flattened getBody text retains the two column values as tab-separated rows. Text representation is sufficient; no image asset or schema extension is needed.

## Package outcome

No `assets[]` entry or schema extension is required for this table. The source remains preserved and its text cells are not discarded. No tests, importer, database or device runs were performed.
