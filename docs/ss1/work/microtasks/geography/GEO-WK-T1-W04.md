# GEO-WK-T1-W04 — First Term Geography: Latitude and Longitude

Status: **IMPLEMENTED — TESTING DEFERRED BY OWNER**. Content approval remains PENDING; no verification is claimed.

## Verified input
- Archive SHA-256: `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`.
- Source member: `SSS 1/1st Term SS1_/1ST TERM S1 GEOGRAPHY.doc`; SHA-256 `4220757cb96c6d6ac5153f7a862b45725a7d87c8e64be5b11ec39a843ca1491c`.
- Week Four block: `getBody()` lines 271–349; SHA-256 `f4dcfa072ca8e066e081d015463d1f147bd5f61fdd7c54d311c5284e0d44ea64`.
- Exact parsed row: `SS1-SRC-1c1c1bdcecb4:BODY:f4dcfa072ca8e066e081d015463d1f147bd5f61fdd7c54d311c5284e0d44ea64`.

## Source findings
The source covers latitude, longitude, major parallels and meridians, similarities/differences, great and small circles, two evaluation sections, general evaluation, reading assignment, five MCQs and two theory questions. Its comparison is tab-aligned text, not a Word table; the inventory records a drawn-object anchor at line 307.

Corrections:
- Latitude is 0°–90° north or 0°–90° south, not a single 0°–180° latitude range.
- Longitude is 0°–180° east or west of Greenwich.
- Longitude, not latitude, is used to calculate local-time differences.
- A single meridian is a semicircle; two opposite meridians form a great circle.
- The Equator is the only great-circle parallel; other parallels are small circles (the 90° parallels are points at the poles).
- A great circle is defined by a plane passing through the sphere's centre; the shortest surface route follows a great-circle arc.

## Implementation
- Added `SUP-SS1-GEOGRAPHY-T1-W04-LATITUDE-LONGITUDE-GREAT-CIRCLES`.
- Added eight keyed practice items with complete marking, totalling 31 marks.
- Added five objective-level coverage records and upgraded `COV-GEO-T1-SCHEME-4` to `IMPLEMENTED_EQUIVALENT`.
- Added `CORR-GEO-T1-W04-LATLONG-GREAT-CIRCLE-FACTS`, bound to the exact source row/hash.
- Added non-blocking follow-ups for the unverified `Essential Geography` pages 14–17 pointer and the drawing anchor at source line 307. The textual comparison is complete; visual inspection/reconstruction is not claimed.

## Provenance
USGS, Specifications for Geographic Point Location Systems: https://pubs.usgs.gov/circ/1983/0878b/report.pdf
USGS, degree/minute/second distance FAQ: https://www.usgs.gov/faqs/how-much-distance-does-a-degree-minute-and-second-cover-your-maps
USGS, UTM grid: https://www.usgs.gov/publications/universal-transverse-mercator-utm-grid-1
NGA, Coordinate Systems: https://earth-info.nga.mil/?action=coordsys&dir=coordsys
USGS, Professional Paper 1453, Glossary of Mapping Sciences: https://pubs.usgs.gov/pp/1453/report.pdf

## Integrity and deferred verification
Body hash refreshed by the repository's `refreshIntegrityHashes.ts` script: `eba6d9fdcaa91357e1c3d8c13100a67f05e29e3726c3f52146403aa4d3cd68b7`.
Not run: package validator, tests, TypeScript, importer, database integration or device checks. No PASS is claimed. Package remains PENDING due to outstanding source approvals and other week/source gates.
