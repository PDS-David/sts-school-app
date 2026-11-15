# GEO-WK-T2-W02 — Second Term Geography: Plateaus

Status: **IMPLEMENTED — TESTING DEFERRED BY OWNER**. Content approval remains PENDING; no verification is claimed.

## Verified input
- Archive SHA-256: `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`.
- Source member: `SSS 1/2nd Term SS1_/2ND TERM S1 GEOGRAPHY.doc`; SHA-256 `fa120c0e9f2f7a47df2c775afdfe049b41ab2acb1972c1457b31c85e70b3a2e5`.
- Week Two block: `getBody()` lines 99–155; SHA-256 `d83e1cd4092e61f3891d294ed3e9a1589f60de6c833ad4d976f0a621e25a72a5`.
- Exact parsed row: `SS1-SRC-ba9dee61c27c:BODY:d83e1cd4092e61f3891d294ed3e9a1589f60de6c833ad4d976f0a621e25a72a5`.

## Findings and corrections
- The source identifies tectonic, volcanic and dissected plateaus. The replacement explains all three processes and related landforms.
- Deccan Plateau is corrected from tectonic to volcanic because it is formed mainly by extensive lava flows.
- The source's “Columbia Snake” wording is standardised to Columbia Plateau. The unclear “Mesetal Liberia” and Harz references are not used as standard tectonic examples without verification.
- Jos Plateau is retained as a school-source example of a dissected plateau, with a note that its geological history is complex and includes volcanic features.
- The source's “nine planets” question is updated: there are eight recognised planets; Pluto is a dwarf planet.

## Implementation
- Added `SUP-SS1-GEOGRAPHY-T2-W02-PLATEAUS`.
- Added eight keyed practice items with complete marking, totalling 33 marks.
- Added five objective-level coverage records and `COV-GEO-T2-SCHEME-2`.
- Added `CORR-GEO-T2-W02-PLATEAU-CLASSIFICATION-AND-PLANET-COUNT`, bound to the exact source row/hash.
- Added a non-blocking open item for the unverified `Essential Geography` pages 34–35 pointer.

## Provenance
NPS, Plateaus and Mesas: https://www.nps.gov/subjects/nnlandmarks/plateaus-and-mesas.htm
USGS, Plateaus: https://apps.usgs.gov/thesaurus/term-simple.php?code=832&thcode=3
NASA, About the Planets: https://science.nasa.gov/solar-system/planets/

## Integrity and deferred verification
Body hash refreshed by the repository's `refreshIntegrityHashes.ts` script: `c9825e1013ad357e4f5658539e6cf81df44abe2e59120a35982dfc3eec5e9802`.
Not run: package validator, tests, TypeScript, importer, database integration or device checks. No PASS is claimed.
