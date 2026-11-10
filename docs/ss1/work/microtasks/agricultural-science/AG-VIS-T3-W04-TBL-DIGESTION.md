# AG-VIS-T3-W04-TBL-DIGESTION — Agricultural Science, Third Term Week Four

Status: **IMPLEMENTED_TESTING_DEFERRED**. Source table inspected. No media derivative or separate asset is required.

## Integrity and locator
- Composite archive SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e` and exact Third Term DOCX member SHA-256 `9e920bff3769d9d977c4b2849cc77c769b6033be9176f4f6b35c27935999e12a` — verified.
- Heading “DIFFERENCES BETWEEN MONOGASTRIC AND POLYGASTRIC ANIMALS” at direct-body block 430.
- Native Word table at block 431: **7 rows × 3 columns**.

## Structure and content disposition
The table preserves a header row `S/N | MONOGASTRIC | POLYGASTRIC` and six paired comparison rows:

| Monogastric | Polygastric |
|---|---|
| It cannot ruminate or chew cud | It can ruminate or chew cud |
| Feed is mainly basal and concentrated food | Feed is mainly grasses and other cellulose |
| Possess one stomach compartment | Possess four stomach compartment |
| It cannot digest cellulose and fiber properly | It can digest cellulose and fiber very well |
| Digestion is not aided by bacteria | Digestion is aided by bacteria |
| It cannot synthesis their own protein | It can synthesis their own protein |

- The S/N data cells are blank; no row numbering is supplied. Column grid widths are 591 / 4,647 / 4,338 twips. The table has single-line outside and internal borders.
- All six distinctions remain paired across the two comparison columns in the DOCX. A plain-text extraction that concatenates cell text could obscure those pairings; delivery must preserve a semantic 3-column table, not flatten the content into an unstructured paragraph.
- Source wording is retained exactly, including “Possess four stomach compartment” and “It cannot synthesis their own protein”. No grammar, science or terminology correction was made here.
- This is structured text in a native Word table, not a separately embedded third-party image. No distinct asset or derivative is needed. No independent image credit/licence applies; the source document does not provide separate table-reuse terms.

## Hash discrepancy
- The task/inventory records table text SHA-256 `0ca145261c566e4b6fdfaa02c15d7b741be36a751106f10076b43b37d4bf9fd2`.
- Using the stated inventory method—concatenate every cell’s `w:t` text in document order, with no separators—the verified source table produces SHA-256 `0dcf9de2367de925c039cd05c16545e6b1bc036861c56d2220bbe8ad34d33b86`.
- The recorded value does **not** reproduce under that method. No claim is made that the original recorded hash is verified. Appended `AG-CORR-T3-W04-TBL-DIGESTION-HASH` to independently confirm the canonical calculation and correct `AG-INV-T3.md`; that inventory file is outside this task's allowed write paths and was not edited here.

## Changes and validation
- Marked `AG-VIS-T3-W04-TBL-DIGESTION` `IMPLEMENTED_TESTING_DEFERRED`; appended the bounded hash-correction task; recomputed queue counts, status counts and `next_runnable`.
- Verified archive/member hashes; parsed the native table XML; counted 7 rows and 3 cells per row; extracted all six paired rows; inspected table grid widths and borders; recomputed the cell-text hash.
- Parsed package/queue JSON; checked unique IDs and confirmed every PARTIAL/UNRESOLVED coverage row has an open-item reference.
- Importer, learner rendering and app/device display **not run**; testing remains deferred.
- No source bytes, media, lessons, shared schema/compiler, other subject or delivery assets changed.
