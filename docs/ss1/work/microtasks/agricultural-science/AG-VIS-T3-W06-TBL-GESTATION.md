# AG-VIS-T3-W06-TBL-GESTATION — Agricultural Science, Third Term Week Six

Status: **IMPLEMENTED_TESTING_DEFERRED**. Source table inspected. No separate media asset or derivative is required.

## Integrity and locator
- Composite archive SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e` and exact Third Term DOCX member SHA-256 `9e920bff3769d9d977c4b2849cc77c769b6033be9176f4f6b35c27935999e12a` — verified.
- Native Word table at direct-body block 724: **6 rows × 3 columns**.
- Preceding section heading “FEATURES OF GESTATION PERIOD” at block 719; following “PARTURITION” heading at block 726.

## Table structure and paired entries
| Species column cell | Female-name cell | Gestation-period cell |
|---|---|---|
| Horse / Cattle | Mare / Cow | 336 days / 283 days |
| Goat | Doe | 150 days |
| Sheep | Ewe | 150 days |
| Pig | Sow | 114 days |
| Rabbit / Chicken | Doe / Hen | 31days / 21 days |

- The Horse/Cattle, Mare/Cow and 336 days/283 days values are each two separate paragraphs within the corresponding cell of one Word row. The Rabbit/Chicken, Doe/Hen and 31days/21 days values are similarly paired as separate paragraphs within one row. These must remain aligned; splitting the lines into independent rows or flattening the cells into one string would lose the source pairing.
- The table has six rows and three columns. The grid widths are 3,179 / 3,181 / 3,216 twips. Vertical cell borders are present; internal horizontal borders are disabled. Preserve row boundaries and paragraph breaks, adding no inferred row numbers.
- Source wording is retained, including “31days” without a space. No durations or species names were corrected or added.
- This is a native text table, not an embedded third-party image. No separate asset/derivative is required; reuse terms are governed by the source document, which supplies no independent table licence.

## Hash discrepancy
- The task/inventory records table text SHA-256 `2a4920ab1813f229acf23091705f2ae7378471933fbf2d7e93c5a86e062d1925`.
- Concatenating each cell's `w:t` text in document order, without separators, yields `7b1f4bfc31fe563d88fe519302d11e61eb59129a4ad39d3f8dcde1c48207ac0c`.
- The recorded value does **not** reproduce under the documented method. No claim is made that the recorded hash is verified. Appended `AG-CORR-T3-W06-TBL-GESTATION-HASH` to independently confirm the canonical calculation and correct `AG-INV-T3.md`; that inventory file is outside this task's allowed write paths and was not edited here.

## Changes and validation
- Marked `AG-VIS-T3-W06-TBL-GESTATION` `IMPLEMENTED_TESTING_DEFERRED`; appended the bounded hash-correction task; recomputed queue counts, status counts and `next_runnable`.
- Verified archive/member hashes; parsed table XML; counted 6 rows and 3 cells per row; inspected each cell's paragraph boundaries, paired species/name/duration values, grid widths and border settings; recomputed the cell-text hash.
- Parsed package/queue JSON; checked unique IDs and confirmed every PARTIAL/UNRESOLVED coverage row has an open-item reference.
- Importer, learner rendering and app/device display **not run**; testing remains deferred.
- No source bytes, media, lessons, shared schema/compiler, other subject or delivery assets changed.
