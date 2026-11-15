# GEO-WK-T1-W08 — First Term Geography: Rocks of the Earth

Status: **IMPLEMENTED — TESTING DEFERRED BY OWNER**. Content approval remains PENDING; no verification is claimed.

## Verified input
- Archive SHA-256: `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`.
- Source member: `SSS 1/1st Term SS1_/1ST TERM S1 GEOGRAPHY.doc`; SHA-256 `4220757cb96c6d6ac5153f7a862b45725a7d87c8e64be5b11ec39a843ca1491c`.
- Week Eight block: `getBody()` lines 540–604; SHA-256 `d09e611390ae4688a763220f81b050507e313dc45735a92e9e39c53ef5df7e8f`.
- Exact parsed row: `SS1-SRC-1c1c1bdcecb4:BODY:d09e611390ae4688a763220f81b050507e313dc45735a92e9e39c53ef5df7e8f`.

## Findings and corrections
- The source says sedimentary rocks do not contain fossils. This is false; fossils are often preserved in sedimentary rocks.
- Petroleum appears in the source's list of organically formed sedimentary rocks. Petroleum is a liquid hydrocarbon fuel, not a solid rock.
- The source names metamorphic rocks in the three-group classification but does not teach their formation or characteristics. The supplement adds this missing strand: heat, pressure and/or hot fluids change existing rock without complete melting.
- The final weekend MCQ asks which option is not a rock and offers both petrol and micro-organisms. It has two correct non-rock options and cannot be scored as a single-answer item; a valid replacement is supplied.
- The lesson explains intrusive/extrusive igneous rocks, clastic/organic/chemical sedimentary rocks, metamorphic examples and the rock cycle.

## Implementation
- Added `SUP-SS1-GEOGRAPHY-T1-W08-ROCKS-OF-THE-EARTH`.
- Added ten keyed practice items with answers and marking, totalling 43 marks.
- Added five objective-level coverage records and upgraded `COV-GEO-T1-SCHEME-8` to `IMPLEMENTED_EQUIVALENT`.
- Added `CORR-GEO-T1-W08-ROCKS-FOSSILS-METAMORPHIC-AND-ITEM-REPAIR`, bound to the exact source row/hash.
- Added a non-blocking open item for the unverified `Essential Geography` pages 24–25 pointer.

## Provenance
USGS, What are metamorphic rocks?: https://www.usgs.gov/faqs/what-are-metamorphic-rocks
USGS, Collecting Rocks: https://pubs.usgs.gov/gip/collect1/collectgip.html
NPS, Rock ID — Teachers: https://www.nps.gov/teachers/classrooms/rock-id.htm
NPS, Activity 1: Types of Rocks: https://www.nps.gov/choh/learn/kidsyouth/activity-1-types-of-rocks.htm

## Integrity and deferred verification
Body hash refreshed by the repository's `refreshIntegrityHashes.ts` script: `a9a695edfa5a569e5d627cbdd8117c6ce245d0f9254d409821e9363e93c14cd4`.
Not run: package validator, tests, TypeScript, importer, database integration or device checks. No PASS is claimed. Package remains PENDING because other source approvals and weeks remain open.
