# GOV-VIS-T2 — Government, 2nd Term visual/symbol disposition

**Status:** IMPLEMENTED — TESTING DEFERRED. No image asset is warranted. The table, Office Math symbol and superscript runs are source structures to preserve, not assets to recreate.

## Source identity

- Source ID: SS1-SRC-c76f430c7cf8
- Archive SHA-256: 024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e
- Member: `SSS 1/2nd Term SS1_/GOVT.docx`
- Member SHA-256: bce2ae4a8b26f1737631e99387fed3cba661e328da3df274f673b6850088d782

## Comparison table — body child 162

The only table is a six-row, three-column comparison of indirect rule and the policy of assimilation. The first cell in every row is blank. Preserve the blank cells, the two comparison columns and their row relationships exactly; do not fill or delete the first column.

| Row | First cell (blank in source) | Indirect rule | Policy of assimilation |
|---:|---|---|---|
| 1 | *(blank)* | INDIRECT RULE | POLICY OF ASSIMILATION |
| 2 | *(blank)* | Indirect rule of colonial administration | Direct rule of colonial administration |
| 3 | *(blank)* | Made use of African traditional chiefs | Did not make use of African traditional chiefs |
| 4 | *(blank)* | Traditional rulers served as the pivot of indirect rule | Traditional rulers did not serve as the pivot of assimilation |
| 5 | *(blank)* | Traditional laws and customs were used in the administration | Traditional laws and customs were not used in the administration |
| 6 | *(blank)* | It was not an expensive system of administration | It was an expensive system of administration |

## Native Office Math — body child 232

The paragraph contains one native Office Math `m:oMath` object whose text is the pound sign `£`. Preserve it as native Office Math rather than flattening it or replacing it with a different symbol. The paragraph states the male-adult £100 income threshold under the Clifford Constitution.

## Superscript ordinal runs

The five original superscript runs are:
- Child 1: `ND` in `2ND TERM`.
- Child 44: `th` in `17th century`.
- Child 197: `th` in `14th, 1864` (the preceding `14` is baseline text).
- Child 237: `st` in `1st January, 1947`.
- Child 274: `st` in `1st April, 1953`.

Preserve the baseline/superscript run boundaries and text. The source wording itself is not corrected by this visual-disposition task; factual corrections are tracked separately.

## No image/media asset

The verified DOCX package contains:
- no `word/media/` parts;
- no `word/embeddings/` parts;
- no DrawingML `w:drawing`, legacy `w:pict`, embedded `w:object` or `w:txbxContent` elements.

Therefore no image, drawing, text-box or embedded-media asset is registered. The package `assets[]` remains unchanged.

## Checks and limits

- Verified archive/member SHA-256 values.
- Inspected the actual table XML and recorded all six rows and three cells per row, including each blank first cell.
- Verified the native Office Math object at child 232 contains `£`.
- Verified the five superscript runs at the specified body children.
- Confirmed no media/embedding parts or drawing/picture/object/text-box elements exist.
- No asset, coverage entry, source rule or source byte was added or changed.
- No tests, typechecks, compiler/importer, database or app/device checks run; testing remains deferred by owner.
