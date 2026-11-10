# AG-VIS-T2-TBL-ROOTS — Agricultural Science, Second Term Weeks Four–Five

Status: **IMPLEMENTED_TESTING_DEFERRED**. Source table inspected; importer and learner rendering were not run.

## Integrity and locator
- Composite archive SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`; exact Second Term member SHA-256 `e9706d69cbb41e7149e2fe62a202ec21143e827fb78c46cb92efe142f9d7e042` — verified.
- Roots/tubers table: `word/document.xml` direct `w:body` block 309 (0-based); block text SHA-256 `b35aa8b43354f8934274af4ad2fadcafd68aceb8c9de6e6ce890f60e1de98575`.

## Structure and content
- The original DOCX contains a 17-row × 3-column table: blank S/N header, Yam (`Dioscoreaspp`) and Cassava (`Manihotspp`) columns, then sixteen attribute rows.
- Attributes: Description; Varieties/cultivar; Land preparation; Climatic requirement; Soil requirement; Method of propagation; Planting date; Planting; Seed rate; Spacing; Cultural practices; Maturity period; Harvesting; Processing; Uses; Storage.
- The Word table preserves crop/attribute/value cell boundaries. Concatenated plain-text extraction does not; row labels and crop values run together without separators.
- The Cassava Seed rate cell is genuinely blank in the original table. No seed-rate figure is supplied for that crop in this table; the blank must remain explicit and must not be inferred.

## Source figures retained verbatim
The Yam column includes temperature `25o – 30oC`, rainfall `100cm – 180cm per annum`, seed rate `3 – 5 tonnes per hectare`, spacing `90cm x 100cm`, maturity `8 – 12 months`, and a 45o planting angle. Cassava entries include temperature `21o – 35oC`, rainfall `150 – 200cm per annum`, stem cuttings `25 – 30cm long`, spacing `100cm x 100cm`, maturity `10 – 15 months`, and a 45o planting angle. These are source strings, not validated agronomic recommendations. No unit, degree symbol, decimal, spacing, date, cultivar or terminology correction is made here.

## Disposition
When the original Weeks Four–Five lesson row is bound, retain the Yam and Cassava columns and all sixteen attribute rows as a structured table or explicit paired list. Preserve the blank Cassava seed-rate cell as blank/not supplied. Do not treat concatenated plain text as sufficient. Do not create a duplicate supplement for already-taught content. If the frozen importer/schema cannot preserve the table, request a versioned foundation change rather than altering source wording or figures.

## Changes and validation
- Added open item `AGRICULTURAL-SCIENCE-T2-W04-05-ROOTS-TABLE-STRUCTURE` as a delivery blocker, linked to the existing coverage and this task.
- Marked `AG-VIS-T2-TBL-ROOTS` `IMPLEMENTED_TESTING_DEFERRED`; recomputed queue counts and `next_runnable`.
- Verified archive/member and table block hashes; inspected all 17×3 source cells; parsed package/queue JSON; checked unique IDs and PARTIAL/UNRESOLVED coverage open-item links.
- Importer, tests, TypeScript, DB and learner rendering **not run**; testing remains deferred.
- No source bytes, table values, lesson bodies, corrections, assets, schema or compiler changed.
