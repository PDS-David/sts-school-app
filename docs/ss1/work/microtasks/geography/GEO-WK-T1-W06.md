# GEO-WK-T1-W06 — First Term Geography: Outer Structure of the Earth

Status: **IMPLEMENTED — TESTING DEFERRED BY OWNER**. Content approval remains PENDING; no verification is claimed.

## Verified input
- Archive SHA-256: `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`.
- Source member: `SSS 1/1st Term SS1_/1ST TERM S1 GEOGRAPHY.doc`; SHA-256 `4220757cb96c6d6ac5153f7a862b45725a7d87c8e64be5b11ec39a843ca1491c`.
- Week Six block: `getBody()` lines 416–492; SHA-256 `3463c9b15cac38935748f50afe5be4eb28595f45901afa1bb3f0dea9a997ca70`.
- Exact parsed row: `SS1-SRC-1c1c1bdcecb4:BODY:3463c9b15cac38935748f50afe5be4eb28595f45901afa1bb3f0dea9a997ca70`.

## Findings and corrections
The source teaches the lithosphere, hydrosphere, atmosphere and biosphere, their importance, and assessment questions. It treats the four outer spheres as four separate layers; the replacement explains they are interacting systems that overlap. It also corrects:
- Lithosphere is Earth's rigid outer shell (crust plus uppermost rigid mantle); land covers about 29% of the surface, but lithosphere also extends beneath oceans.
- Hydrosphere includes water on, under and above Earth's surface; about 71% of the surface is water-covered.
- Dry-air composition is approximately 78.08% nitrogen, 20.95% oxygen, 0.93% argon and 0.04% carbon dioxide; water vapour is variable and excluded from dry-air percentages.
- Plants generally cannot use atmospheric nitrogen gas directly; it must first be fixed into usable compounds.
- The biosphere overlaps the other spheres; it is not a separate solid shell.

The source's theory prompt asks for a drawing of Earth's internal structure, but the scheme places the internal zone in Week Seven. It is not taught prematurely in Week Six.

## Implementation
- Added `SUP-SS1-GEOGRAPHY-T1-W06-OUTER-SPHERES`.
- Added eight keyed practice items with complete marking, totalling 34 marks.
- Added five objective-level coverage records and upgraded `COV-GEO-T1-SCHEME-6` to `IMPLEMENTED_EQUIVALENT`.
- Added `CORR-GEO-T1-W06-OUTER-SPHERES-CURRENT-FACTS`, bound to the exact source row/hash.
- Added non-blocking open items for the unverified `Essential Geography` pages 21–24 and the cross-week internal-structure drawing prompt.

## Provenance
NOAA, The Atmosphere: https://www.noaa.gov/jetstream/atmosphere
NASA, Earth Facts: https://science.nasa.gov/earth/facts/
USGS, Distribution of water on, in, and above the Earth: https://www.usgs.gov/media/images/distribution-water-and-above-earth
NASA, Earth Fact Sheet: https://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html

## Integrity and deferred verification
Body hash refreshed by the repository's `refreshIntegrityHashes.ts` script: `df41b5ab7b19ab9d364962c57d6d2226ab32960605c1ae4a0e60f8622da44764`.
Not run: package validator, tests, TypeScript, importer, database integration or device checks. No PASS is claimed. Package remains PENDING because other source approvals and weeks remain open.
