# GEO-WK-T1-W10 — First Term Geography: Major Landforms (Mountains)

Status: **IMPLEMENTED — TESTING DEFERRED BY OWNER**. Content approval remains PENDING; no verification is claimed.

## Verified input
- Archive SHA-256: `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`.
- Source member: `SSS 1/1st Term SS1_/1ST TERM S1 GEOGRAPHY.doc`; SHA-256 `4220757cb96c6d6ac5153f7a862b45725a7d87c8e64be5b11ec39a843ca1491c`.
- Week Ten block: `getBody()` lines 639–707; SHA-256 `5b6c935769ac6e9fee6360e672ac636c6d18beeaefaf0e38a27b5655e7724080`.
- Exact parsed row: `SS1-SRC-1c1c1bdcecb4:BODY:5b6c935769ac6e9fee6360e672ac636c6d18beeaefaf0e38a27b5655e7724080`.

## Findings and corrections
- Four mountain types are covered: fold, block, volcanic and residual.
- Fold mountains form mainly through compression at convergent plate boundaries. Anticlines are upfolds; synclines are downfolds. Fold mountains are not all soft and are not necessarily volcanic.
- Block mountains form through faulting; horsts are raised blocks and grabens are down-dropped blocks. Ruwenzori is a fault-block mountain, not volcanic.
- Volcanic mountains accumulate lava, ash and cinders around vents. Examples include Fuji, Mayon, Kilimanjaro, Kenya, Elgon and Cameroon.
- Residual mountains are resistant remnants left by denudation. Mount Monadnock spelling is corrected; the Deccan Plateau is not a single residual mountain.
- The source's [pic] placeholder contains no recoverable image. Four original text schematics and drawing steps are included; a separate rendered visual asset remains a non-blocking follow-up.

## Implementation
- Added `SUP-SS1-GEOGRAPHY-T1-W10-MOUNTAINS`.
- Added formation explanations and text diagrams for all four mountain types.
- Added nine keyed practice items with marking, totalling 41 marks.
- Added five objective-level coverage records and upgraded `COV-GEO-T1-SCHEME-10` to `IMPLEMENTED_EQUIVALENT`.
- Added `CORR-GEO-T1-W10-MOUNTAIN-FORMATION-AND-EXAMPLE-REPAIRS`, bound to the exact source row/hash.
- Added non-blocking follow-ups for the missing original illustration and the unverified `Essential Geography` pages 31–33 pointer.

## Provenance
NPS, Tectonic Landforms and Mountain Building: https://www.nps.gov/subjects/geology/tectonic-landforms.htm
NPS, Mountain Building Lesson Plan: https://www.nps.gov/teachers/classrooms/mountain-building-lesson.htm
USGS, What is a fault and what are the different types?: https://www.usgs.gov/faqs/what-a-fault-and-what-are-different-types
NPS, Erosional Volcanic Landforms: https://www.nps.gov/subjects/volcanoes/erosional-volcanic-landforms.htm

## Integrity and deferred verification
Body hash refreshed by the repository's `refreshIntegrityHashes.ts` script: `c7c4185d546687cb498b7cbe13138ac8951af0b6126ec80bbe20b120a1f6df15`.
Not run: package validator, tests, TypeScript, importer, database integration or device checks. No PASS is claimed. Package remains PENDING because content approval and other source-level gates remain open.
