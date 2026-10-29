# CHEM-INV-T1A — Chemistry (1st Term, first source)

Status: IMPLEMENTED — TESTING DEFERRED BY OWNER. This note records a source inventory only. No lesson, coverage entry, rule, correction, asset, test, typecheck, importer run, database check or deployment was performed.

## Input

| Field | Value |
| --- | --- |
| Source | SS1-SRC-58b4a44c3afa |
| archive_member | `SSS 1/1st Term SS1_/1ST TERM S1 CHEMISTRY.docx` |
| Member SHA-256 | `07053f977dcbef91ee05d74a2e4dab9c3fa921cbb3792dc8698287a55197bb3a` |
| Member size | 2,187,976 bytes |
| Container | Composite archive `SSS 1-20260507T072431Z-3-001 (1).zip`, SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e` (verified; archive not committed) |
| Source document committed? | No - original bytes and private extracts remain outside Git |

Hash was checked before conversion and matches SOURCE_ASSIGNMENTS.csv.

## Method

- Text view: mammoth 1.12.2 `extractRawText` of the verified member (the importer's Docx text view). Raw text: 55,382 characters, 2,129 lines, SHA-256 `f88594cb2127d95a5bec7f17fd785efcda3c02ee1ccde5564eaa21774748e702`.
- Locator: text split on `\n`, line numbers 1-based; a week range runs from its `WEEK ...` marker line to the last line before the next marker (last week to end of file); SHA-256 is taken over the UTF-8 lines joined with `\n` (no trailing newline).
- Structure: `word/document.xml` body children parsed directly (paragraphs, tables, `a:blip` relationships), media hashed from `word/media/`; text boxes counted via `w:txbxContent`; run formatting via `w:vertAlign`.
- No table renderer, LibreOffice or Word was available; table assessment comes from the DOCX XML itself.

## Opening and scheme (lines 1-89, SHA-256 `d01fc682173f614403ea120cd39a74318967565bb9f054c12bec8f916f5f0722`)

- 33 `FIRST TERM E-LEARNING NOTE`
- 37 `SUBJECT:  CHEMISTRY` + 7 tabs + `CLASS: SS1` (registered header for this source)
- 41 `SCHEME OF WORK`; 45 `WEEK         TOPIC`; topic rows at 47, 49, 51, 53, 55, 57, 59, 61, 63, 65, 67, 69, 71
- 75 `REFERENCE MATERIALS`; five works at 77-85
- The scheme rows carry no week numbers in the extracted text (plain label lines; row 11 at 67 is unindented). The document body has ten week labels.

Scheme rows (13) with body mapping:

| Row | Scheme label (line) | Body |
| --- | --- | --- |
| 1 | INTRODUCTION TO CHEMISTRY (47) | WEEK ONE |
| 2 | LABORATORY FAMILIARIZATION (49) | WEEK TWO |
| 3 | NATURE OF MATTER (51) | WEEK THREE |
| 4 | ELEMENTS & SYMBOLS, VALENCY (53) | WEEK FOUR |
| 5 | COMPOUNDS AND MIXTURES (55) | WEEK FIVE |
| 6 | STANDARD SEPARATION TECHNIQUES FOR MIXTURES (57) | WEEK SIX (title omits "FOR MIXTURES") |
| 7 | PARTICULATE NATURE OF MATTER (59) | WEEK SEVEN |
| 8 | IUPAC NOMENCLATURE OF CHEMICAL COMPOUNDS (61) | WEEK EIGHT |
| 9 | ATOMIC NUMBER, MASS NUMBER, ISOTOPES AND CALCULATIONS (63) | WEEK NINE (title says "RELATIVE ATOMIC MASSES") |
| 10 | STRUCTURE OF THE ATOM: ORBITALS AND ELECTRONIC (65) | WEEK TEN |
| 11 | STRUCTURE OF   THE ATOM (67) | WEEK TEN (same body) |
| 12 | REVISION (69) | no body |
| 13 | EXAMINATION (71) | no body |

## Week inventory

| Week | Title line | Line range | SHA-256 of range | Sections (anchor lines) |
| --- | --- | --- | --- | --- |
| WEEK ONE | `TOPIC: INTRODUCTION TO CHEMISTRY` (93) | 90-245 | `8b348aa6be31cc15d603c4054646f4a0cdd0874c7c0cd38fd14c12fb3d3519f3` | 95 CONTENT, 103 chemistry as a science subject, 109 branches, 129 scientific methods, 153 EVALUATION, 163 applications, 169 career prospects, 199 EVALUATION, 207 GENERAL EVALUATION, 215 READING ASSIGNMENT, 223 WEEKEND ASSIGNMENT, 237 THEORY |
| WEEK TWO | `TOPIC: LABORATORY FAMILIARIZATION` (249) | 246-415 | `3064d93fa4b6050c3522c4be0fa06690cb505b4666a7508d80bcf2cd862e5d05` | 251 CONTENT, 259 definition, 265 apparatus, 273 apparatus and uses, 329 EVALUATION, 337 identification exercise, 345 safety rules, 375 GENERAL EVALUATION, 383 READING, 387 WEEKEND, 401 THEORY |
| WEEK THREE | `TOPIC: NATURE OF MATTER` (419) | 416-607 | `7dac5adad12109abcc1f79c7f76006f9f6195bcc548ce4bf4c72e4ea1e57ebc2` | 421 CONTENT, 431 nature of matter, 439/447/453 solid/liquid/gas, 459 EVALUATION, 467 solid-liquid-gas comparison, 489 EVALUATION, 497 changes, 503 physical, 517 EVALUATION, 525 chemical, 545 comparison, 565 GENERAL EVALUATION/REVISION, 577 READING, 581 WEEKEND, 599 THEORY |
| WEEK FOUR | `TOPIC:  ELEMENTS, SYMBOLS & VALENCY` (611) | 608-867 | `4aea3a2b6e25c43d020c89763df5216007c01031981f9040d4373a57b580dd9c` | 613 CONTENT, 621 elements/symbols, 627 symbols table, 699 EVALUATION, 707 classification, 719 metals vs non-metals, 741 EVALUATION, 749 valency, 793 radicals, 821 GENERAL EVALUATION/REVISION, 829 READING, 835 WEEKEND, 853 THEORY |
| WEEK FIVE | `TOPIC: COMPOUNDS AND MIXTURES` (871) | 868-1115 | `0928fd18ab69956502440832da5e87685c9c54ffc584ef53a8763eb6dccfb31d` | 873 CONTENT, 883 compound, 903 properties, 917 EVALUATION, 923 formulae, 953 formula from valencies, 989 EVALUATION, 997 mixtures, 1027 differences, 1059 EVALUATION, 1069 READING, 1075 GENERAL EVALUATION/REVISION, 1083 WEEKEND, 1097 THEORY |
| WEEK SIX | `TOPIC: STANDARD SEPARATION TECHNIQUES` (1119) | 1116-1335 | `e5e147ad7fb2954b63f69d8c7c37c4e3d507cbdef6108d0c82ffec3c87bab478` | 1121 CONTENT, 1123 introduction, 1133 filtration, 1139 centrifugation, 1149 decantation, 1155 evaporation, 1169 crystallization, 1181 fractional crystallization, 1187 EVALUATION, 1197 precipitation, 1203 sublimation, 1211 distillation, 1219 fractional distillation, 1225 EVALUATION, 1237 separating funnel, 1243 sieving, 1249 magnetic separation, 1255 chromatography, 1283 criteria for purity, 1291 GENERAL EVALUATION, 1303 READING, 1309 WEEKEND, 1327 THEORY |
| WEEK SEVEN | `TOPIC: PARTICULATE NATURE OF MATTER` (1339) | 1336-1489 | `8afae8fe7429d6acf133b984dc4a283f6eb0c848477350e2c19cff942ebfb66d` | 1341 CONTENT, 1351 atoms and molecules, 1381 EVALUATION, 1389 ions, 1399 EVALUATION, 1407 Dalton, 1423 modifications, 1439 GENERAL EVALUATION/REVISION, 1453 READING, 1459 WEEKEND, 1479 THEORY |
| WEEK EIGHT | `IUPAC NOMENCLATURE OF CHEMICAL COMPOUNDS` (1493, no `TOPIC:` prefix) | 1490-1667 | `94be1f5931d2fc33a57fba5f16e7ee4eefd989cce64622163e00e82283c45038` | 1495 CONTENT, 1509 binary compounds, 1531 EVALUATION, 1573 EVALUATION, 1581 tertiary/quaternary, 1607 EVALUATION, 1625 GENERAL EVALUATION/REVISION, 1635 READING, 1641 WEEKEND, 1659 THEORY |
| WEEK NINE | `ATOMIC NUMBER, RELATIVE ATOMIC MASSES, ISOTOPES AND CALCULATIONS` (1671, no `TOPIC:` prefix) | 1668-1895 | `8623a58d206c485f4a6c2727ddd96e045a3742cf5efa0fdcfbcea2cf74375d90` | 1673 CONTENT, 1681 constituents, 1697 Z/X/A layout, 1711 EVALUATION, 1723 isotopes, 1741 EVALUATION, 1749 relative atomic mass, 1777 EVALUATION, 1785 calculations, 1793/1809 SOLUTIONs, 1839 GENERAL EVALUATION/REVISION, 1861 READING, 1867 WEEKEND, 1883 THEORY |
| WEEK TEN | `TOPIC: STRUCTURE OF THE ATOM` (1899) | 1896-2129 | `c39b761173ca4cc92564400e195eb53d08be2775fc3b4230d2aff76cc4e33ce0` | 1901 CONTENT, 1911 orbitals, 1933 EVALUATION, 1941 electronic structure, 1985 EVALUATION, 1993 filling of electrons, 2011 EVALUATION, 2019 quantum numbers, 2079 GENERAL EVALUATION, 2087 READING, 2093 WEEKEND, 2119 THEORY |

No unlabelled teaching section exists between the ten markers; the file ends after the Week 10 THEORY block.

## Tables

Three `w:tbl` elements, all 1 row x 1 cell, none holding tabular teaching data:

- body child 2 - empty cover-layout table, no text.
- body child 581 - wraps the Week 3 WEEKEND ASSIGNMENT paragraph.
- body child 630 - wraps the Week 6 WEEKEND ASSIGNMENT paragraph.

The comparison tables (467-487, 545-563), element/symbol tables (627-697), valency rules (765-791), radical table (793-819) and energy-level table (1955-1969) are tab-separated paragraph text, not Word tables. Preserve them as text with their order.

## Media

58 media parts. 51 are 1x1 RGBA PNGs of exactly 70 bytes each (all distinct SHA-256; spacer/placeholder graphics used for layout - not content). Seven are real:

| Part | Dimensions | Bytes | SHA-256 | Week / block | Content |
| --- | --- | --- | --- | --- | --- |
| `image43.jpg` | 606x600 | 44,665 | `bb2d3e6c33f4f32bc13ba7563d35c8fd01410a9b476b64b4ad65eeea9d3572b3` | W2 / 171 | line-drawing composite of eleven apparatus/set-ups for the A-I identification exercise |
| `image27.png` | 260x340 | 175,209 | `74425d67bf9315ebd350585e5495fd9a03767703c0238c5306088ad7ad752bf1` | W6 / 571 | benchtop centrifuge photograph; credit "Encarta Encyclopedia, Biophoto Assoc./Photo Researchers, Inc." |
| `image44.png` | 556x414 | 285,420 | `e8a47bc580d540fa47e5813520b1bbdcb1b9aba3502200c2b1aea2a9a60bd8cb` | W6 / 580 | industrial salt-works photograph; credit "Encarta Encyclopedia, Kevin Schafer/Corbis"; the caption says "A Salt Evaporation Pond" |
| `image26.png` | 556x390 | 24,823 | `94f12e2fbe43ae8e3294b4def20f1384d5d5f9a9372a74875567f6b564ec560d` | W6 / 603 | solid/liquid/gas state-change clip-art; "Microsoft Corporation. All Rights Reserved." |
| `image58.png` | 484x336 | 351,341 | `52c6eee8da878c875227eaf4b9e6ae269579c4ed3648f22e8ccd0100e63662af` | W6 / 606 | industrial distillation plant photograph; "Encarta Encyclopedia, Ian Griffiths/Robert Harding Picture Library" |
| `image53.png` | 500x336 | 292,135 | `1cda1811a200c6a9a162fce7c61ea5f0823a16d853e02a01d5d81a618a1bd1d4` | W6 / 629 | laboratory worker with a multi-channel tray; "Encarta Encyclopedia, Mitch Kezar/Phototake NYC" |
| `image1.png` | 556x328 | 29,798 | `762bfab0be9b955a4751685411c930999f2242284a722b42baa2d69f3154453f` | W9 / 864 | carbon-12/13/14 atomic models; "(c) Microsoft Corporation. All Rights Reserved." |

Week 2 apparatus labels: 17 `w:txbxContent` parts exist; nine carry the letters A-I and the rest are empty. The letters are floating text boxes over `image43.jpg`, not part of the raster. Text extraction therefore yields jumbled letters ("BA", "IGHFED") without positions, and the raster yields no letters: the identification exercise cannot be reconstructed from either view alone.

Week 10: the text promises "Shapes of s and p orbitals are as follows" (1915) and labels s, px, py, pz (1921-1929), but all eight pictures there are 1x1 spacers. The orbital drawings are absent from the converted source. Image counts must not stand in for them.

## Notation to preserve (formatting, not plain text)

168 superscript and 140 subscript runs exist in `word/document.xml`; the raw text flattens them. Examples: `H2`, `02` (925), `H20` (941), `C02` (945), `Ca(NO3)2` (949), `S04` (971/975), `Na2S04` (975), `n2` (1951), `2n2` (1953-1969), `12`/`22`/`32` (1957-1969, meaning squared), `2-12`/`2-22` (1957-1961, meaning 2 x squared), `ZXA` (1697) and the 40/20 Ca layout (1703-1707). Preserve with run formatting; see CHEM-PRES-T1A-FORMULAE.

## Parser rule findings (findings only - no rule written)

- `split_before`: the body markers read `WEEK ONE` ... `WEEK TEN`; compiler.ts requires a numeric-only `week_label`, so the importer must normalize word labels to numbers before splitting. Marker lines are 90, 246, 416, 608, 868, 1116, 1336, 1490, 1668, 1896; each marker paragraph carries no other text.
- `attach_stranded_label`: WEEK EIGHT (1493) and WEEK NINE (1671) titles have no `TOPIC:` prefix and sit three lines after the marker; the scheme row at 67 is also unindented. Without the rule these labels would be read as ordinary lead paragraphs.
- `classify_marker`: `REVISION` (69) and `EXAMINATION` (71) occur only in the scheme list; no marker body, revision note, examination paper or marking scheme exists. They must be classified as markers, not teaching, and must not be attached to WEEK TEN.

## Content issues recorded (not corrected)

- `DEFINTION OF LABORATORY` (253) is the source spelling of the heading.
- U+FFFD replaces the apostrophe in `DALTON�S` (1347, 1407, 1423).
- Formula text uses the digit 0 and letter O interchangeably in places (`H20`, `C02`, `S04`, `NaS04` at 975) - see preservation item.
- Week 6 captions do not match their images (salt works vs "salt evaporation pond"; lab worker vs paper chromatography); Week 9's example names chlorine isotopes but the drawing shows carbon isotopes; all six carry proprietary credit strips.
- Week 10 orbital shapes are missing as drawings (spacers only).
- Scheme rows 10-11 both correspond to the single Week 10 body; scheme rows 12-13 have no body.
- No answer key, marking scheme, marks or rubrics were found; do not author any here.

## Safety flags

Week 2 carries apparatus-use statements (275-327) and a LABORATORY SAFETY RULES block (345-373). No first-aid instruction, chemical name, concentration or emergency procedure is stated in the document. Week 6 describes separation methods without apparatus lists, quantities, observations or safety warnings. Verification against authoritative sources is deferred to CHEM-FACT-T1A-SAFETY; no procedure or observation was invented.

## Edits made

- Updated `docs/ss1/work/microtasks/chemistry/QUEUE.json`: CHEM-INV-T1A -> `IMPLEMENTED_TESTING_DEFERRED`; 19 new PENDING items appended:
  - 10 `SOURCE_WEEK_INDEXING` (CHEM-IDX-T1A-W01..W10)
  - 1 `SOURCE_SECTION_INDEXING` (CHEM-IDX-T1A-OPEN)
  - 1 `SOURCE_MARKER_DISPOSITION` (CHEM-MARK-T1A-REVEXAM)
  - 4 `VISUAL_DISPOSITION` (W02 apparatus, W06 media, W09 isotope, W10 orbital shapes)
  - 2 `SOURCE_PRESERVATION` (notation/formulae; separation-method procedures)
  - 1 `FACTUAL_DEPENDENCY` (Week 2 safety)
- Each new item depends on CHEM-INV-T1A and CHEM-SRC-T1A (preservation/fact items additionally depend on the week-indexing items they cite; visual items stand on the inventory). Counts now 30 items; status 5 implemented, 24 pending, 1 blocked; 20 eligible next-runnable.
- No package, lesson, coverage entry, rule, correction, asset or test file was written; `backend/src/db/ss1/subjects/chemistry.json` is untouched.

## Not done / next eligible

- Testing, typechecks, importer/plan runs, database and device checks remain deferred by owner.
- Next eligible: CHEM-INV-T1B, CHEM-INV-T2, CHEM-INV-T3, CHEM-TEST-PACKAGE, and the 16 new T1A indexing/visual items listed above.
- CHEM-FACT-CONTENT-APPROVAL remains BLOCKED. This task does not claim the Chemistry subject or the SS1 class complete.
