# AG-VIS-T1-TBL-W02 — Agricultural Science, First Term Week Two

Status: **IMPLEMENTED_TESTING_DEFERRED**. Source table inspected; importer and learner rendering were not run.

## Integrity and locator
- Composite archive SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`; exact First Term member SHA-256 `df1b516cdd8855d069a329d7aa627dbd0dcd3612dd10d254c53af9cb93a56526` — verified.
- Week Two table: `word/document.xml` direct `w:body` block 160 (0-based); block text SHA-256 `9cc53b2bd0d0fccc6e1b1201a426be4d0157bc8bae17412a737ce50cfd485c5a`.

## Structure and content
- The original DOCX contains a 13-row × 2-column Word table: one header row (`SUBSISTENCE AGRICULTURE` / `COMMERCIAL AGRICULTURE`) and twelve numbered contrast rows.
- The twelve contrasts concern: purpose/output; land area; labour; management; production scale; production cost; market organisation; environmental degradation; employment; cropping pattern; specialisation; and credit access.
- The original Word table retains the pairing. The concatenated block text does not: adjacent cell strings run together without a delimiter. Example: `Produce mainly for the family with little or no excess.Products are principally for sale`. This plain-text representation is not reliably readable as paired rows.
- The source table itself is readable in its native table structure; no image asset is involved.

## Disposition
The table is substantive teaching content supporting `COV-AG-T1-W02-TYPES`. It must be preserved as a two-column table or explicit paired list when the original lesson row is eventually bound. Do not treat concatenated plain text as sufficient. Because the comparison is already taught in the source, no duplicate supplemental lesson is authorized. If the frozen importer/schema cannot carry the pairing, request a versioned foundation change rather than altering source wording.

## Changes and validation
- Added open item `AGRICULTURAL-SCIENCE-T1-W02-TABLE-STRUCTURE` as a delivery blocker, linked to the existing coverage and this task.
- Marked `AG-VIS-T1-TBL-W02` `IMPLEMENTED_TESTING_DEFERRED`; recomputed queue counts and `next_runnable`.
- Verified archive/member and table block hashes; inspected all 13×2 source cells; parsed package/queue JSON; checked unique IDs and PARTIAL/UNRESOLVED coverage open-item links.
- Importer, tests, TypeScript, DB and learner rendering **not run**; testing remains deferred.
- No source bytes, lesson bodies, corrections, assets, schema or compiler changed.
