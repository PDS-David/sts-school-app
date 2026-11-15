# GEO-WK-T1-W03 — First Term Geography: Earth as a Planet

Status: **IMPLEMENTED — TESTING DEFERRED BY OWNER**. Content approval remains PENDING; no verification is claimed.

## Verified input
- Archive SHA-256: `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`.
- Member: `SSS 1/1st Term SS1_/1ST TERM S1 GEOGRAPHY.doc`; member SHA-256 `4220757cb96c6d6ac5153f7a862b45725a7d87c8e64be5b11ec39a843ca1491c`.
- Week Three source block: `getBody()` lines 183–268; block SHA-256 `5bbc2357e24a5ef6139bc99bc1351c119dc4f7188345e35c5f12bf001a452d25`.
- Exact parsed row ID: `SS1-SRC-1c1c1bdcecb4:BODY:5bbc2357e24a5ef6139bc99bc1351c119dc4f7188345e35c5f12bf001a452d25`.

## Findings and corrections
The source teaches Earth's shape/size, evidence of sphericity, rotation, revolution, their effects, eclipses, dawn/twilight and related evaluation items. The replacement corrects:
- Treating geoid as a simple synonym for a sphere; the lesson distinguishes the oblate-spheroid approximation from the gravity-related geoid.
- Inaccurate/dated Earth measurements; uses approximate current values (equatorial diameter 12,756 km; polar diameter 12,714 km; equatorial circumference 40,075 km; surface area about 510 million km²).
- The claim that Magellan personally completed the first circumnavigation; he died before the expedition returned. Elcano led the surviving expedition back to Spain in 1522.
- Seasons attributed to revolution alone; explains the role of Earth's 23.4° axial tilt together with revolution.
- Tides attributed to rotation; explains lunar/solar gravity as the cause and rotation's role in the daily coastal pattern.
- Equinoxes, solstices, eclipses and leap years are explained with corrected terminology and conditions.

## Implementation
- Added `SUP-SS1-GEOGRAPHY-T1-W03-EARTH-PLANET-MOVEMENTS`.
- Added nine complete practice questions and answer/marking guides, totalling 38 marks.
- Added six objective-level coverage records and upgraded `COV-GEO-T1-SCHEME-3` to `IMPLEMENTED_EQUIVALENT`.
- Added `CORR-GEO-T1-W03-EARTH-MOVEMENT-FACTS`, binding the exact source row/hash to the replacement supplement.
- Added a non-blocking open item for the unverified `Essential Geography`, O.A. Iwena, pages 7–9 pointer. The book was not supplied.

## Provenance
NASA Facts About Earth: https://science.nasa.gov/earth/facts/
NASA What Is Earth? (Grades 5–8): https://www.nasa.gov/learning-resources/for-kids-and-students/what-is-earth-grades-5-8/
NASA Earth Fact Sheet: https://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html
NASA Eclipses and the Moon: https://science.nasa.gov/moon/eclipses/
NOAA Tides: https://www.noaa.gov/education/resource-collections/ocean-coasts/tides
U.S. Naval History and Heritage Command, Magellan-Elcano expedition: https://www.history.navy.mil/news-and-events/news/2021/nhhc-announces-second-annual-new-year-s-day-deck-log-contest-.html
NASA The Geoid: https://svs.gsfc.nasa.gov/5660

## Integrity and deferred verification
The new lesson body hash was refreshed using the repository's `refreshIntegrityHashes.ts` script in the isolated subject-package workspace: `b8b7a56e044bd618e87e044876e5654fac0570f9d6f72fce801c8d680643d2bf`.
Not run: package validator, subject tests, TypeScript, compiler/importer, database integration, mobile/device checks. No PASS is claimed. Package remains PENDING because source alias approvals and Week One delivery gates remain open.
