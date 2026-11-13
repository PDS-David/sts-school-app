# GEO-INV-T3 — Geography (3rd Term)

Status: IMPLEMENTED — TESTING DEFERRED BY OWNER. Source inventory only. No lesson, coverage entry, parsing rule, correction, asset, test, typecheck, importer run, database check, deployment or student-device check was performed.

## Input and identity

| Field | Value |
|---|---|
| Source | `SS1-SRC-74a10d374306` |
| Archive member | `SSS 1/3rd Term SS1_/3RD TERM S1 GEOGRAPHY.doc` |
| Member SHA-256 | `54931bac00bfde6b2ff5d32e2b645872af74dc32d8e0f69d0585f40e443726c6` (matches `SOURCE_ASSIGNMENTS.csv`) |
| Member size | 200,192 bytes |
| Container | Supplied composite archive, SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e` (verified) |
| Header | Third Term E-Learning Note; Subject: Geography; Class: SS1 |

## Method and structure

- Extracted the exact legacy `.doc` member from the hash-verified ZIP without modifying original bytes.
- Read source text with antiword 0.37: 63,011 characters and 1,493 lines. Line locators below are 1-based antiword output lines.
- Privately converted and rendered with LibreOffice 25.2.3.2 for layout inspection (23-page PDF); conversion is not committed.
- Converted structural inspection found one 38-row × 4-column Word table, four VML pict/drawing elements forming the location sketch, no raster media, and no equations. The thermal-plant listing is tab-aligned text, not a Word table.
- Week-block digests are SHA-256 of UTF-8 antiword output lines from inclusive start/end positions joined by newline, with no added trailing newline. These are extraction-text digests, not original DOC binary hashes.
- No macros or embedded programs were executed. No importer, database, API or student-device test was performed.

## Opening scheme (antiword lines 2–25)

- Lines 2–4 identify Third Term E-Learning Note, Geography, SS1.
- Scheme rows (lines 10–22): Week 1–2 Nigeria: Location, Position and Size; Week 3 Nigeria: Physical Relief and Drainage; Week 4 Nigeria: Climate; Week 5 Nigeria: Vegetation and Soils; Week 6 Nigeria: Transportation and Industries; Week 7 Nigeria: Population; Week 8 Nigeria: Agriculture; Week 9 Nigeria: Mineral Resources; Week 10 Nigeria: Power Resources.
- Line 24 references *Essential Geography for Senior Secondary Schools* by O.A. Iwena. The cited textbook is not included in the archive.
- The scheme is paragraph/tab-aligned, not a teaching body. The body begins at line 28 and contains nine sections: combined Weeks 1–2, then Weeks 3–10.

## Teaching-body inventory

| Body label | Antiword lines | SHA-256 | Content and assessment inventory |
|---|---:|---|---|
| `WEEK ONE AND TWO` | 28–165 | `0b967f0cbb4795d3d7f45f8313859ae178706cc352a67fa81a5e6610c228b433` | Nigeria location, coordinates, latitudinal/longitudinal extent, position/boundaries, size/population, political division and colonial administrative chronology; evaluation, general evaluation, reading, weekend assignment and theory. |
| `WEEK THREE` | 166–392 | `ae9898a94a4a83e8b400fc13dd01cb02f8138ff1794d53231d86fc3fd2415c31` | Relief and drainage: lowlands/plains, associated rocks, importance/disadvantages; north-central, western/eastern highlands and eastern scarpland; drainage, rivers/characteristics/importance, river basins and lakes; evaluation, reading, weekend assignment and theory. |
| `WEEK FOUR` | 393–516 | `dee959f9ad7f025e06874f5be05b8bfd8eef8e9d1de37d5acda43b72b370804a` | Nigeria climate and factors affecting climate, seasons and associated evaluations/assignments/theory. |
| `WEEK FIVE` | 517–605 | `88a50efe2ac8ef46e51c09f509f0213890b07bd9ed446a629246860c0c6ef6d5` | Vegetation of Nigeria and soils: laterite, sandy, forest and alluvial soil zones; evaluation, reading, weekend assignment and theory. |
| `WEEK SIX` | 606–992 | `dae1276b9bdad53af51da896efa8926e59d7182fe79678482604485cede742a1` | Transportation modes/contributions/problems; industries, manufacturing characteristics/classification, industrial location/localization, cottage/modern industries, industrial contributions/problems/solutions; evaluations and assignments. |
| `WEEK SEVEN` | 993–1138 | `dbd92909c045b8959ef83ba7a1fddf6b4726f71e9fc3bb24a700fc0f92778c01` | Population concepts and distribution in Nigeria; evaluation, general evaluation, reading, weekend assignment and theory. |
| `WEEK EIGHT` | 1139–1285 | `755eae8ef28c9c3cb9021874f09703ef85aab7850d4ef98be3257a7fb9ffbbb8` | Agriculture: types, importance, problems and solutions; evaluation, general evaluation, reading, weekend assignment and theory. |
| `WEEK NINE` | 1286–1430 | `96d22f2c4cf06f1847ad29a8d85c1d275e53c9d3ad931f0c1949e3c2025ad422` | Mineral resources in Nigeria, their distribution/importance and problems facing mining; evaluation, general evaluation, reading, weekend assignment and theory. |
| `WEEK TEN` | 1431–1493 | `5d33e30e1276f887f88a50c80c5a5ed6ececb87aa70b692dc791e5f0eb7dead1` | Power resources: water, coal, petroleum, natural gas; hydro-electric projects (Kainji and Shiroro), thermal power and plant/state/fuel listing, effects of climate on dams; evaluation, general evaluation, reading, weekend assignment and theory. |

## Visual and structured-content inventory

| Visual | Source locator | Structure / disposition requirement |
|---|---|---|
| Nigeria location/boundary sketch | Antiword lines 42–58; converted DOCX paragraphs 29 and 32; PDF page 1 | Word-drawn directional sketch naming Niger, Chad, Cameroon, Benin and Atlantic Ocean. It is not a detailed outline map. Determine whether an accessible, authoritative locator map should replace it. |
| State/capital/title-slogan table | Antiword lines 85–132; PDF page 2; converted DOCX table 1 | 38 rows × 4 columns (header plus 37 states/FCT). Preserve the table; verify every state/capital and slogan. |
| Thermal plant listing | Antiword lines 1447–1453; Week 10 | Tab-aligned text columns for plant, state and fuel. Not a Word table, but preserve as structured data and verify each entry. |

The source contains no raster image/media files. The location sketch is composed of VML drawing/pict elements. The state table is the only actual Word table. The thermal-plant block is plain tab-aligned text.

## Source-quality and factual flags

- Location coordinates, boundary descriptions, area and the 2006 census population statement require primary-source verification. The 2006 figure is historical and must not be presented as current population.
- The political-division and colonial-administration chronology needs historical sourcing and exact date boundaries.
- The state/capital/title-slogan table should be checked against current authoritative state/FCT sources; slogans are not necessarily official statutory designations.
- Relief, drainage, climate, rainfall, vegetation and soil-distribution claims need authoritative geographic, geological and meteorological sources with geographic scope and dates.
- Transport infrastructure, manufacturing locations, population distribution, agriculture, minerals/mining and power-plant examples may be historical or outdated. Do not present old project/production/fuel information as current without dated official datasets.
- The thermal-plant list names Egbin, Ijora, Sapele and Oji with states/fuels. Verify current/historical operational status, location and fuel type from official energy-sector sources.
- The cited textbook is a pointer only; its content is not supplied.

## Structural/parser findings (findings only; no rule written)

- The body has a combined `WEEK ONE AND TWO` marker followed by `WEEK THREE` through `WEEK TEN`. Preserve the combined first block; do not split it into fabricated lessons.
- Scheme labels are in the opening and must not be mistaken for body markers. Body begins at line 28.
- One true Word table, one drawn location sketch and one tab-aligned thermal-plant list require independent structural preservation. Do not flatten the table or tabular list into prose.
- No parsing rule or correction was written during this inventory.

## Edits made

- This inventory record and bounded follow-up tasks are the only intended changes for `GEO-INV-T3`.
- No subject package lesson, coverage, parsing rule, correction, asset or approval state changed.
- Testing remains deferred; this is not approval, verification or student-readiness certification.
