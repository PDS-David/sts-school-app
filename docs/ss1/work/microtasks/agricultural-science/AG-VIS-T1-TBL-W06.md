# AG-VIS-T1-TBL-W06 — Agricultural Science, First Term Week Six

Status: **IMPLEMENTED_TESTING_DEFERRED**. Source table inspected; importer and learner rendering were not run.

## Integrity and locator
- Composite archive SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`; exact First Term member SHA-256 `df1b516cdd8855d069a329d7aa627dbd0dcd3612dd10d254c53af9cb93a56526` — verified.
- Week Six table: `word/document.xml` direct `w:body` block 486 (0-based); block text SHA-256 `6369ac8fa5a7579448710b6647aae3dfbd6aeef800b300976ebe3acdad0bd57d`.

## Structure and content
- The original DOCX contains a 15-row × 3-column Word table: header (`S/N`, `Agro-based Industries`, `Raw Materials Used`) and fourteen numbered industry/raw-material rows.
- The fourteen examples run from oil mill/oil seeds through beverage/cocoa-coffee-tea; other rows include soap/oil seeds, cigarette/tobacco leaves, textile/cotton, breweries/cereals, fruit canning/fruits, paper/pulpwood, sugar/sugar cane, plywood/wood, flour/cereal-grains, starch/cassava-maize, tyre/rubber latex and feed mill/groundnut-maize.
- The original Word table retains S/N, industry and raw-material cell boundaries. The concatenated block text does not: values run together without separators, so the raw-material association is not reliably recoverable from plain text alone.
- This is a structured table, not an image asset.

## Disposition
The table is substantive source teaching for `COV-AG-T1-W06-AGRO-INDUSTRIES`. When the original lesson row is bound, retain all fourteen rows and their industry/raw-material pairing as a three-column table or explicit paired list. Do not treat concatenated plain text as sufficient. Since the source already teaches these pairs, no duplicate supplemental lesson is authorized. If the frozen importer/schema cannot preserve the structure, request a versioned foundation change rather than altering source wording.

## Changes and validation
- Added open item `AGRICULTURAL-SCIENCE-T1-W06-TABLE-STRUCTURE` as a delivery blocker, linked to the existing coverage and this task.
- Marked `AG-VIS-T1-TBL-W06` `IMPLEMENTED_TESTING_DEFERRED`; recomputed queue counts and `next_runnable`.
- Verified archive/member and table block hashes; inspected all 15×3 source cells; parsed package/queue JSON; checked unique IDs and PARTIAL/UNRESOLVED coverage open-item links.
- Importer, tests, TypeScript, DB and learner rendering **not run**; testing remains deferred.
- No source bytes, lesson bodies, corrections, assets, schema or compiler changed.
