# AG-CORR-T3-W04-TBL-DIGESTION-HASH — Agricultural Science, Third Term Week Four

Status: **IMPLEMENTED_TESTING_DEFERRED**. The monogastric/polygastric table hash was independently reproduced from the verified source DOCX and the inventory value corrected. No table text or structure was changed.

## Source identity

- Source ID: `SS1-SRC-458a07f7ea5a`
- Archive member: `SSS 1/3rd Term SS1_/3RD TERM S1 AGRICULTURAL SCIENCE.docx`
- Composite archive SHA-256: `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`
- Member SHA-256: `9e920bff3769d9d977c4b2849cc77c769b6033be9176f4f6b35c27935999e12a`
- Source table: direct-body block 431 in `word/document.xml`
- Table dimensions: **7 rows × 3 columns**, 21 cells.
- Concatenated cell-text length: 452 Unicode characters before UTF-8 encoding.

Archive/member hashes were independently recomputed from the Library archive and match `SOURCE_ASSIGNMENTS.csv`.

## Canonical calculation reproduced

The inventory's documented method is SHA-256 of concatenated cell text in document order, without normalization or separators. The reproducible procedure is:

1. Locate direct child 431 of `w:body` in `word/document.xml` (zero-based).
2. Iterate its `w:tr` rows in document order.
3. Within each row, iterate `w:tc` cells in document order.
4. For each cell, concatenate its `w:t` run text in document order.
5. Concatenate the 21 cell strings directly, with **no spaces, tabs, newlines, delimiters or other separators** inserted between cells. Empty cells contribute an empty string.
6. Encode the resulting 452-character string as UTF-8 and calculate SHA-256.

**Recomputed canonical table-text SHA-256:**

`0dcf9de2367de925c039cd05c16545e6b1bc036861c56d2220bbe8ad34d33b86`

The previously recorded value `0ca145261c566e4b6fdfaa02c15d7b741be36a751106f10076b43b37d4bf9fd2` does not reproduce under the documented calculation and is replaced in `AG-INV-T3.md`.

## Table content and structure preserved

The extracted cell matrix remains:

| Row | Column 1 | Column 2 | Column 3 |
|---|---|---|---|
| 1 | S/N | MONOGASTRIC | POLYGASTRIC |
| 2 | *(blank)* | It cannot ruminate or chew cud | It can ruminate or chew cud |
| 3 | *(blank)* | Feed is mainly basal and concentrated food | Feed is mainly grasses and other cellulose |
| 4 | *(blank)* | Possess one stomach compartment | Possess four stomach compartment |
| 5 | *(blank)* | It cannot digest cellulose and fiber properly | It can digest cellulose and fiber very well |
| 6 | *(blank)* | Digestion is not aided by bacteria | Digestion is aided by bacteria |
| 7 | *(blank)* | It cannot synthesis their own protein | It can synthesis their own protein |

No grammar, factual wording, capitalization, punctuation, blank cells, row order, column order or table dimensions were changed. This task is a hash/inventory correction only; factual review of the table is handled by the separate `AG-FACT-T3-W04-DIGESTIVE-ACCURACY` task.

## Inventory change

Updated the table row in `AG-INV-T3.md` from the non-reproducible value `0ca145...` to `0dcf9de2367de925c039cd05c16545e6b1bc036861c56d2220bbe8ad34d33b86` and made the canonical no-separator method explicit. No other inventory entry was changed.

## Changes and validation

- Added this reproducibility record.
- Independently re-extracted all 21 table cells from the verified source member and recomputed the canonical SHA-256.
- Confirmed 7 × 3 dimensions, row-major order and exact cell text; no table content or structure changed.
- Updated only the block-431 hash/method in `AG-INV-T3.md`.
- Marked `AG-CORR-T3-W04-TBL-DIGESTION-HASH` `IMPLEMENTED_TESTING_DEFERRED`.
- No package lesson, correction, asset, source byte, shared code or other subject changed.
- Tests, importer/compiler, TypeScript, database, learner rendering and device checks remain deferred.
