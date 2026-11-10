# AG-CORR-T3-W06-TBL-GESTATION-HASH — Agricultural Science, Third Term Week Six

Status: **IMPLEMENTED_TESTING_DEFERRED**. The gestation table hash was independently reproduced from the verified source DOCX and the inventory value corrected. The six-row, three-column table and all within-cell paragraph pairings remain unchanged.

## Source identity

- Source ID: `SS1-SRC-458a07f7ea5a`
- Archive member: `SSS 1/3rd Term SS1_/3RD TERM S1 AGRICULTURAL SCIENCE.docx`
- Composite archive SHA-256: `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`
- Member SHA-256: `9e920bff3769d9d977c4b2849cc77c769b6033be9176f4f6b35c27935999e12a`
- Source table: direct-body block 724 in `word/document.xml`
- Dimensions: **6 rows × 3 columns**, 18 cells.
- Concatenated cell-text length: 148 Unicode characters before UTF-8 encoding.

Archive/member hashes were independently recomputed from the Library archive and match `SOURCE_ASSIGNMENTS.csv`.

## Canonical calculation reproduced

The inventory's documented method is SHA-256 of concatenated cell text in document order, without normalization or separators. The reproducible procedure is:

1. Locate direct child 724 of `w:body` in `word/document.xml` (zero-based).
2. Iterate its `w:tr` rows in document order.
3. Within each row, iterate `w:tc` cells in document order.
4. For each cell, concatenate all `w:t` run text in document order, across the cell's paragraphs.
5. Concatenate all 18 cell strings directly, with **no spaces, tabs, newlines, delimiters or other separators** inserted between cells. Empty cells, if present, contribute an empty string.
6. Encode the resulting 148-character string as UTF-8 and calculate SHA-256.

**Recomputed canonical table-text SHA-256:**

`7b1f4bfc31fe563d88fe519302d11e61eb59129a4ad39d3f8dcde1c48207ac0c`

The previously recorded value `2a4920ab1813f229acf23091705f2ae7378471933fbf2d7e93c5a86e062d1925` does not reproduce under the documented calculation and is replaced in `AG-INV-T3.md`.

## Table structure and paragraph pairings preserved

The exact row-major cell text is:

| Row | Species cell | Female-name cell | Gestation-period cell |
|---|---|---|---|
| 1 | SPECIES | NAME OF FEMALE | GESTATION PERIOD |
| 2 | Horse / Cattle | Mare / Cow | 336 days / 283 days |
| 3 | Goat | Doe | 150 days |
| 4 | Sheep | Ewe | 150 days |
| 5 | Pig | Sow | 114 days |
| 6 | Rabbit / Chicken | Doe / Hen | 31days / 21 days |

**Important Word structure:** In row 2, the Horse/Cattle, Mare/Cow and 336 days/283 days values are each two separate paragraphs inside their respective cells. In row 6, Rabbit/Chicken, Doe/Hen and 31days/21 days are similarly paired as separate paragraphs within one cell each. They are not separate table rows. The table has six rows and three columns; preserve all cell boundaries and paragraph breaks. Do not split paired entries into new rows or flatten them into separate records.

No species, female names, gestation periods, punctuation, capitalization, cell order, row order, blank cells or paragraph boundaries were changed.

## Inventory change

Updated the table row in `AG-INV-T3.md` from the non-reproducible value `2a4920ab...` to `7b1f4bfc31fe563d88fe519302d11e61eb59129a4ad39d3f8dcde1c48207ac0c` and made the canonical no-separator method explicit. The paragraph-pairing note was added so the hash does not obscure the table's within-cell structure.

## Changes and validation

- Added this reproducibility record.
- Independently re-extracted all 18 table cells from the verified source member and recomputed the canonical SHA-256.
- Confirmed 6 × 3 dimensions, row-major order, 148 concatenated characters, and the paired paragraph boundaries in the Horse/Cattle and Rabbit/Chicken rows.
- Updated only the block-724 hash/method and its paragraph-pairing note in `AG-INV-T3.md`.
- Marked `AG-CORR-T3-W06-TBL-GESTATION-HASH` `IMPLEMENTED_TESTING_DEFERRED`.
- No table text/structure, source bytes, package lesson, correction, asset, shared code or other subject changed.
- Tests, importer/compiler, TypeScript, database, learner rendering and device checks remain deferred.
