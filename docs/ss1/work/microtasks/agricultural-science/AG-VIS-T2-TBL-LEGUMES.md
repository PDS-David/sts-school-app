# AG-VIS-T2-TBL-LEGUMES — Agricultural Science, Second Term Weeks Four–Five

Status: **IMPLEMENTED_TESTING_DEFERRED**. Source table inspected; importer and learner rendering were not run.

## Integrity and locator
- Composite archive SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`; exact Second Term member SHA-256 `e9706d69cbb41e7149e2fe62a202ec21143e827fb78c46cb92efe142f9d7e042` — verified.
- Legumes table: `word/document.xml` direct `w:body` block 298 (0-based); block text SHA-256 `87186ec68d7711e5caba1564d1775c94d59235baff5757eda7bcae6d97cb0cf0`.

## Structure and content
- The original DOCX contains a 17-row × 3-column table: blank S/N header, Cowpea (`Vignaunguiculata`) and Groundnut (`Arachishypogea`) columns, then sixteen attribute rows.
- Attributes: Description; Varieties/cultivar; Land preparation; Climatic requirement; Soil requirement; Method of propagation; Planting date; Planting; Seed rate; Spacing; Cultural practices; Maturity period; Harvesting; Processing; Uses; Storage.
- The Word table preserves crop/attribute/value boundaries. Concatenated plain-text extraction does not; row labels and the two crop columns run together without separators, so pairings are ambiguous.

## Source figures retained verbatim
The table includes Cowpea temperature `27o-35oC`, rainfall `60-125cm per annum`, seed rate `20 – 25kg per hectare`, spacing `30 x 75cm` (erect) and `25 x 90cm` (creeping), and maturity `9 – 12 weeks`. Groundnut entries include temperature `25o-30oC`, rainfall `70-100cm per annum`, seed rate `30 – 35kg per hectare`, spacing `60 x 15cm` (erect) and `60 x 20cm` (creeping), and maturity `3 – 4 months`. These are source strings, not validated agronomic recommendations. No unit, decimal, spacing, date, cultivar or terminology correction is made in this visual task.

## Disposition
When the original Weeks Four–Five lesson row is bound, retain the Cowpea and Groundnut columns and all sixteen attribute rows as a structured table or explicit paired list. Do not treat concatenated plain text as sufficient. Do not create a duplicate supplement for already-taught content. If the frozen importer/schema cannot preserve the table, request a versioned foundation change rather than altering source wording or figures.

## Changes and validation
- Added open item `AGRICULTURAL-SCIENCE-T2-W04-05-LEGUMES-TABLE-STRUCTURE` as a delivery blocker, linked to the existing coverage and this task.
- Marked `AG-VIS-T2-TBL-LEGUMES` `IMPLEMENTED_TESTING_DEFERRED`; recomputed queue counts and `next_runnable`.
- Verified archive/member and table block hashes; inspected all 17×3 source cells; parsed package/queue JSON; checked unique IDs and PARTIAL/UNRESOLVED coverage open-item links.
- Importer, tests, TypeScript, DB and learner rendering **not run**; testing remains deferred.
- No source bytes, table values, lesson bodies, corrections, assets, schema or compiler changed.
