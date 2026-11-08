# AG-VIS-T2-TBL-CEREALS — Agricultural Science, Second Term Weeks Four–Five

Status: **IMPLEMENTED_TESTING_DEFERRED**. Source table inspected; importer and learner rendering were not run.

## Integrity and locator
- Composite archive SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`; exact Second Term member SHA-256 `e9706d69cbb41e7149e2fe62a202ec21143e827fb78c46cb92efe142f9d7e042` — verified.
- Cereals table: `word/document.xml` direct `w:body` block 286 (0-based); block text SHA-256 `e85f47c0bf2bab22cd9534ddf5368d4d76f9ccbcf75c9930c4ca8b5f47b4394e`.

## Structure and content
- The original DOCX contains a 17-row × 3-column table: blank S/N header, Maize (`Zea mays`) and Rice (`Oryza sativa`) columns, then sixteen attribute rows.
- Attributes: Description; Varieties/cultivar; Land preparation; Climatic requirement; Soil requirement; Method of propagation; Planting date; Planting; Seed rate; Spacing; Cultural practices; Maturity period; Harvesting; Processing; Uses; Storage.
- The original Word table preserves crop/attribute/value cell boundaries. Concatenated block text does not; the crop names, row labels and values run together without delimiters. Plain-text extraction alone cannot reliably preserve the pairings.

## Source figures retained verbatim
The table includes (among other source statements) maize temperature `260C-300C`, rainfall `75cm-150cm`, pH `6-7`, seed rate `20-30kg per hectare`, spacing `80cm between row and 30cmwithin row`, and maturity `90-120 days`. Rice entries include temperature `200c`, upland rainfall `75cm-120cm`, swamp-rice rainfall `over 250cm`, seed rate `65kg per hectare at 2-3 seeds per hole`, spacing `25-30cm`, and maturity `4-7 months`. These are source strings, not validated agronomic recommendations. No unit, decimal, spacing, date or terminology correction is made in this visual task.

## Disposition
When the original Weeks Four–Five lesson row is bound, retain the Maize and Rice columns and all sixteen attribute rows as a structured table or explicit paired list. Do not treat concatenated plain text as sufficient. Do not create a duplicate supplement for already-taught content. If the frozen importer/schema cannot preserve the table, request a versioned foundation change rather than altering source wording or figures.

## Changes and validation
- Added open item `AGRICULTURAL-SCIENCE-T2-W04-05-CEREALS-TABLE-STRUCTURE` as a delivery blocker, linked to the existing coverage and this task.
- Marked `AG-VIS-T2-TBL-CEREALS` `IMPLEMENTED_TESTING_DEFERRED`; recomputed queue counts and `next_runnable`.
- Verified archive/member and table block hashes; inspected all 17×3 source cells; parsed package/queue JSON; checked unique IDs and PARTIAL/UNRESOLVED coverage open-item links.
- Importer, tests, TypeScript, DB and learner rendering **not run**; testing remains deferred.
- No source bytes, table values, lesson bodies, corrections, assets, schema or compiler changed.
