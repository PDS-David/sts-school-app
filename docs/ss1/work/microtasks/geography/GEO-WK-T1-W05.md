# GEO-WK-T1-W05 — First Term Geography: Calculating Distance and Local Time

Status: **IMPLEMENTED — TESTING DEFERRED BY OWNER**. Content approval remains PENDING; no verification is claimed.

## Verified input
- Archive SHA-256: `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`.
- Source member: `SSS 1/1st Term SS1_/1ST TERM S1 GEOGRAPHY.doc`; SHA-256 `4220757cb96c6d6ac5153f7a862b45725a7d87c8e64be5b11ec39a843ca1491c`.
- Week Five block: `getBody()` lines 352–413; SHA-256 `aaf418295fc5be4a720a35f23d1a45efb9bed91b3319ee1a2ae3e56141dbde17`.
- Exact parsed row: `SS1-SRC-1c1c1bdcecb4:BODY:aaf418295fc5be4a720a35f23d1a45efb9bed91b3319ee1a2ae3e56141dbde17`.

## Findings and corrections
- The source's worked 30°S–40°N distance calculation is 70° × 111 km = 7,770 km; its printed final value `7,7770km` is a typographical error.
- The 111 km per degree rule is an approximate north-south distance rule. It is not the full distance between arbitrary points separated east-west or diagonally.
- Local-time conversion is 15° per hour or 4 minutes per degree; east is ahead and west is behind. The 75°W-to-120°E example is 195° / 15 = 13 hours ahead, changing Friday 5 p.m. to Saturday 6 a.m.
- The general evaluation answers are Ethiopia (45°E) 5 p.m., Los Angeles (75°W) 9 a.m. and Nigeria (15°E) 3 p.m. when Greenwich is 2 p.m., using the exercise's local-solar-time assumption.
- The printed question about a planet with twelve satellites is obsolete because confirmed moon counts change. It is retired from the replacement assessment and replaced with a stable question about Mercury having no natural satellite.

## Implementation
- Added `SUP-SS1-GEOGRAPHY-T1-W05-DISTANCE-AND-LOCAL-TIME`.
- Added eight worked/keyed practice questions with marking, totalling 18 marks.
- Added four objective-level coverage records and upgraded `COV-GEO-T1-SCHEME-5` to `IMPLEMENTED_EQUIVALENT`.
- Added `CORR-GEO-T1-W05-DISTANCE-LOCAL-TIME-AND-MOON-COUNT`, bound to the exact source row/hash.
- Added a non-blocking open item for the unverified `Essential Geography` pages 17–19 and page-21 theory pointer; the book was not supplied.

## Provenance
USGS, degree/minute/second distance FAQ: https://www.usgs.gov/faqs/how-much-distance-does-a-degree-minute-and-second-cover-your-maps
NGA, Coordinate Systems: https://earth-info.nga.mil/?action=coordsys&dir=coordsys

## Integrity and deferred verification
Body hash refreshed by the repository's `refreshIntegrityHashes.ts` script: `d64a99eb473e65d5be5557361377da3aec6911d3cdb1d71f4b6bad94f2e0b888`.
Not run: package validator, tests, TypeScript, importer, database integration or device checks. No PASS is claimed. Package remains PENDING due to other outstanding source approvals and weeks.
