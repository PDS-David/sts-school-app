# GEO-WK-T1-W02 — First Term Geography: The Solar System

Status: **IMPLEMENTED — TESTING DEFERRED BY OWNER**. Content approval remains PENDING; no verification is claimed.

## Verified input
- Archive: `SSS 1-20260507T072431Z-3-001 (1).zip`
- Archive SHA-256: `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`
- Member: `SSS 1/1st Term SS1_/1ST TERM S1 GEOGRAPHY.doc`
- Member SHA-256: `4220757cb96c6d6ac5153f7a862b45725a7d87c8e64be5b11ec39a843ca1491c` (1,163,776 bytes)
- Source identity: `SS1-SRC-1c1c1bdcecb4`; term: 1st Term; class: SS 1.
- The exact Week Two source span is `getBody()` lines 92–180, block SHA-256 `2a30150d4cb0d3991540598cfe3ee7437dbd35a2f7692b041e10cb4911e98603`. The parsed row identity is `SS1-SRC-1c1c1bdcecb4:BODY:2a30150d4cb0d3991540598cfe3ee7437dbd35a2f7692b041e10cb4911e98603`.

## Source content indexed
The scheme row is “The Solar System: The Universe, The Planets, The Earth.” The body includes the solar-system definition; universe, galaxy, Milky Way and satellite definitions; a nine-row planetary table; descriptions of Mercury through Pluto; two evaluation sections; a general evaluation section; a reading pointer; five weekend multiple-choice questions; and two theory questions.

The source contains material that must not be delivered as current astronomy:
- It lists nine planets and calls Pluto the ninth planet. The IAU's 2006 Resolution 5A/6A classifies eight planets and Pluto as a dwarf planet.
- It calls Mercury the hottest planet. NASA identifies Venus as the hottest; Mercury is nearest to the Sun.
- It implies gravity and oxygen are unique to Earth. Gravity is universal to objects with mass; Earth is the only world currently known to support life.
- It reduces Saturn's ring system to three rings.
- It says Uranus alone rotates clockwise. Uranus has an extreme axial tilt and retrograde rotation; the source wording is misleading.
- Its satellite-count table is not reused because moon counts change and the source's figures are dated.
- The weekend item contrasting “rotate around” and “revolve around” is ambiguous in ordinary usage. The supplement supplies a precise replacement question rather than scoring the ambiguous wording.

## Implementation
- Added lesson `SUP-SS1-GEOGRAPHY-T1-W02-SOLAR-SYSTEM`.
- Added complete objectives, teaching notes, definitions, planet-by-planet characteristics, current Pluto classification, correction notes and answers to the source's evaluation/theory prompts.
- Added seven original practice items with complete answers and marking breakdowns, totalling 29 marks.
- Added six objective-level coverage records and upgraded `COV-GEO-T1-SCHEME-2` to `IMPLEMENTED_EQUIVALENT`.
- Added delivery correction `CORR-GEO-T1-W02-SOLAR-SYSTEM-CURRENT-FACTS`, bound to the exact source row ID and source body hash. Original source bytes remain unchanged.
- Added a non-blocking open item for the prescribed reading pointer `Essential Geography`, O.A. Iwena, pages 5–7. The book was not supplied, so the page reference is not claimed verified.

## Authoritative provenance
- IAU, 2006 General Assembly Resolution votes: https://www.iau.org/IAU/Iau/News/PR2006/iau-2006-general-assembly-resolution-votes.aspx
- NASA Science, Solar System Facts: https://science.nasa.gov/solar-system/solar-system-facts/
- NASA Science, Mercury Facts: https://science.nasa.gov/mercury/facts/
- NASA Science, Venus Facts: https://science.nasa.gov/venus/venus-facts/

All external facts are paraphrased in original wording; no textbook pages or copyrighted lesson passages are reproduced.

## Integrity and deferred verification
The new lesson's `body_sha256` was refreshed by running the repository's `backend/src/db/ss1/refreshIntegrityHashes.ts` script in an isolated subject-package workspace. Result: one lesson hash refreshed; `f66066bfd1164b031cdab275b9a4acbc65d0715f6c3a9ccdecd98ceed9ca0220`.

Not run, by owner instruction: package validator, subject tests, TypeScript, compiler/importer, database integration, mobile/device checks. No PASS is claimed. The package remains `PENDING` because source alias approvals and other Week One gates remain unresolved.
