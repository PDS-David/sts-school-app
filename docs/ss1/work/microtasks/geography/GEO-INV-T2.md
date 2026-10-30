# GEO-INV-T2 — Geography, 2nd Term inventory

Status: **IMPLEMENTED_TESTING_DEFERRED** (inventory only; not approved, not verified). Testing deferred by owner.

## Inputs
- Base: origin/master `32026bc` (fetched). `AGENTS.md` is absent. Open PRs at start: #246 (French FR-WK-T1-W04) and #247 (Further Mathematics FM-INV-T3); neither touches Geography.
- Prerequisite GEO-SRC-T2 is `IMPLEMENTED_TESTING_DEFERRED`; `backend/src/db/ss1/subjects/geography.json` holds source `SS1-SRC-ba9dee61c27c` (header_text = line 3 below), with empty coverage, lessons and rules.
- Original: `2ND TERM S1 GEOGRAPHY.doc` taken from the supplied `2nd Term SS1` archive, SHA-256 `fa120c0e9f2f7a47df2c775afdfe049b41ab2acb1972c1457b31c85e70b3a2e5` — hashed before conversion; equals the task's Member SHA-256. The composite archive (`02448712…9a3e`) was not supplied, so its hash was **not checked**.
- Method (all private, outside Git): `word-extractor` 1.0.4 `getBody()` (the importer's legacy `.doc` call) gave 665 lines, 41,609 UTF-8 bytes; as an independent structure view the file was converted to `.docx` with LibreOffice and its tables, drawing objects and images were counted; `olefile` listed the streams and scanned them for image signatures; the one image was viewed by dimensions and hash only. The importer, compiler, schema and tests were not run.
- Block convention (same as GEO-INV-T1): SHA-256 of the 1-based `getBody()` lines stated, joined with `\n`, UTF-8, no trailing newline, trailing blank lines trimmed. Whole body 1-665: `e8b89bc22155d5b69aab2565b7ae9180b26968fad6f349b57826df809e7eb737`.

## Scheme of work (`SCHEME OF WORK`, getBody 5-17)
Plain tab-separated paragraphs, not a Word table (the LibreOffice view finds tables only at the two weather examples). Every row carries a week numeral; two rows span two weeks; row 9 wraps onto a second line. Rows 8-17 SHA-256 `0bd4de0bf39dab3491a2157bcaa55202c662ef72b56e04681220f9d037ff5825`; block 5-17 `16f8346eaa97420d7393afa489cfd66d4aeec3126c08eda9e58cd0d7c8efb52c`.

| Row | Weeks | Scheme topic (verbatim, casing as in source) | Lines | Bound body label |
|---|---|---|---|---|
| 1 | 1 | REVISION / MOUNTAINS | 8 | `WEEK ONE` 23 |
| 2 | 2 | PLATEAUX | 9 | `WEEK TWO` 99 |
| 3 | 3 - 4 | LOWLAND (PLAINS) | 10 | `WEEK THREE AND FOUR` 158 |
| 4 | 5 | THE ENVIRONMENT | 11 | `WEEK FIVE` 218 |
| 5 | 6 - 7 | WEATHER AND CLIMATE | 12 | `WEEK SIX AND SEVEN` 295 |
| 6 | 8 | COMPONENTS OF GEOGRAPHIC INFORMATION SYSTEM (GIS) | 13 | `WEEK EIGHT` 451 |
| 7 | 9 | INTRODUCTION TO MAP READING: DEFINITION, TYPES OF MAP, AND SCALE | 14-15 | `WEEK NINE` 493 |
| 8 | 10 | MAP DISTANCES (CONVERSION, DIRECTION AND BEARING) | 16 | `WEEK TEN` 583 |
| 9 | 11 | REVISION | 17 | **no body** |

The scheme has nine rows covering weeks 1-11 (not eleven rows). Week 11 `REVISION` has no body row; there is no Week 12 and no examination row. Reference list: line 19 `REFERENCE MATERIAL`, line 20 one title (`Essential Geography for Senior Secondary Schools, O.A. Iwena.`); lines 19-21 SHA-256 `17204e7a2f49ac4901fddd15570d2e1b697576bcb2b3861edc37624ef600a5df`.

## Week inventory (8 labels covering weeks 1-10)
Labels are word-numbered, one label per line, and each occurs exactly once; two labels cover two scheme weeks.

| Label (line) | Topic line | Span | Block SHA-256 | Markers (lines) |
|---|---|---|---|---|
| `WEEK ONE` 23 | TOPIC: MOUNTAINS (24) | 23-96 | `ece8d4ef576c226bfa6ab945f3baae6bff53083265841e2616f2b0b73acddf45` | Evaluation Questions 35, 44, 71; General Evaluation Questions 75; Reading Assignment 82; WEEKEND ASSIGNMENT 85; THEORY 94 |
| `WEEK TWO` 99 | TOPIC: PLATEAUX (100) | 99-155 | `d83e1cd4092e61f3891d294ed3e9a1589f60de6c833ad4d976f0a621e25a72a5` | Evaluation Questions 112, 132; General Evaluation 136; READING ASSIGNMENT 143; Weekend Assignment 146; THEORY 153 |
| `WEEK THREE AND FOUR` 158 | TOPIC: LOWLAND (PLAINS) (159) | 158-217 | `f155959046daac2c20e2ba8a4bcfe1d80f5a763a0177f501227d1d0bea869652` | 'Evaluaton Questions:' (sic) 169, 194; General Evaluation Questions 198; Reading Assignment 205; Weekend Assignment 208; THEORY 215 |
| `WEEK FIVE` 218 | TOPIC: THE ENVIRONMENT (219) | 218-292 | `7d7b98bb035cf02876eb95c5d9ee0e945efc40503e28e33a0b2e8a9f11df120c` | EVALUATION: 230; EVALUATION 256; GENERAL EVALUATION QUESTIONS 271; WEEKEND ASSIGNMENT 278; THEORY 290; no READING ASSIGNMENT |
| `WEEK SIX AND SEVEN` 295 | TOPIC: WEATHER AND CLIMATE (296) | 295-448 | `d1342226010d745b41f6e6421eef1a8331e7e5e80dbfc59f4a00ae0c7b063d03` | Evaluation Questions 314, 332, 421; General Evaluation Questions 427; Reading Assignment 434; Weekend Assignment 437; Theory 446 |
| `WEEK EIGHT` 451 | TOPIC: COMPONENTS OF GEOGRAPHIC INFORMATION SYSTEM (GIS) (452) | 451-490 | `149c7a7834d22c42201ff991274f65e141314d51e29c031fcdbf847dec6d6c05` | GENERAL EVALUATION QUESTIONS 475; WEEKEND ASSIGNMENT 482; THEORY 488; no Evaluation Questions and no Reading Assignment |
| `WEEK NINE` 493 | TOPIC: INTRODUCTION TO MAP READING (494) | 493-580 | `d865dc3130bd6b91e8811fc5f7f8a0913ba41528b08d6a44f0e8a99dd352b53d` | 'Evaluaton Questions:' (sic) 519; 'Evaluaton Question' (sic, singular) 555; General Evaluation Questions 560; Reading Assignment 567; WEEKEND ASSIGNMENT 570; THEORY 579 |
| `WEEK TEN` 583 | TOPIC: MAP DISTANCES (584) | 583-659 | `f048c5367b827d80dbc99d1cbe644d6edb3fb4db72e8d2bfc94735337beb5441` | Evaluation Questions 600, 634; General Evaluation Questions 638; Reading Assignment 645; WEEKEND ASSIGNMENT 648; THEORY 657 |

Marker totals in the body: Evaluation Questions (all spellings, incl. `EVALUATION:`/`EVALUATION`) 16; General Evaluation 8; Reading Assignment 6 (absent in Weeks 5 and 8); Weekend Assignment 8; Theory 8; 46 in all. `WEEKEND ASSIGNMENT` lines begin with `WEEK`, and `Evaluaton` is misspelled at 169, 194, 519 and 555. Per-week notes: Week 1: Scheme row 1 (line 8) reads 'REVISION / MOUNTAINS' but the body has only MOUNTAINS; no revision text is present. Week 2: Types of plateau 103, importance 120, disadvantages 128. Weeks 3-4: One label for two scheme weeks; types of plains 161, importance 181, disadvantages 190. Week 5: Spheres of the environment 222, ecosystem 234, interdependence 248, environmental balance 261. Weeks 6-7: Largest span: elements 301, importance 318, 'KEEPING WEATHER RECORDS AND INSTRUMENTS' 336 (rainfall 337, temperature 372, wind 409, pressure 414, relative humidity 417); worked examples with two Word tables (lines 360 and 394). Week 8: Sources of geographic data 459-465, components of GIS 467. Week 9: How to use linear scale 526, size of a scale 548. Week 10: Straight distances 587, curve distances 591, DIRECTION 605-606 with a drawing, PROCEDURES FOR MEASURING DIRECTION 621-624 (steps (ii)-(iv); no step (i)), BEARING 626-632 with a drawing.

## Non-week blocks (hash-accounted)
- 1-3: `SECOND TERM E-LEARNING NOTE` (1, occurs once), blank, `SUBJECT: GEOGRAPHY` + tabs + `CLASS: SS 1` (3). Block 1-3 SHA-256 `3f8db4887f31f7944499d942ba3445aa4c52871b72784645e449aca70d02899c`.
- Header evidence: line 3 equals the registered `header_text` byte for byte (`SUBJECT: GEOGRAPHY`, six tabs, spaces, `CLASS: SS 1`) and occurs exactly once, so the document itself names Geography, SS 1 and the 2nd Term.
- 4 blank; 5 `SCHEME OF WORK`; 6 blank; 7 `WEEK  <TAB>TOPIC` header; 8-17 rows; 18 blank; 19-20 reference; 21-22 blank. Lines 1-22 SHA-256 `056fe6213bd0bffeb5c27115f1e66a7b9fdf4ec2ff85aecc4ce83cfaa81b63ff`.
- Between spans: lines 97-98, 156-157, 293-294, 449-450, 491-492, 581-582 and 660-665 are blank. The last text line is 659.
- Running footer (LibreOffice view): `MR OSHO/2nd TERM/GEOGRAPHY/SS 1` plus a page field; not teaching. Vendor contact details are deliberately not reproduced.
- Metadata (stale caches, not a render): title `SECTION C`, author `Rehoboth`, last saved by `tosyno`, created 2015-12-22, last saved 2019-09-03, 18 pages and 6,274 words cached.
- `getBody()` keeps four U+001E characters (non-breaking hyphens) at lines 605-606 (`South<U+001E>East`, `South<U+001E>West`).

## Substantive unlabelled / irregular sections
- Weeks 6-7 `KEEPING WEATHER RECORDS AND INSTRUMENTS` (336-420) is an unlabelled teaching block inside the label span; it holds the rainfall and temperature formulas and the worked examples with their tables.
- Week 8 has no Evaluation Questions and no Reading Assignment; Week 5 has no Reading Assignment; Week 1 has no revision text although its scheme row says REVISION.
- Week 10 `PROCEDURES FOR MEASURING DIRECTION` (621-624) lists steps (ii)-(iv) with no step (i); `Procedures for Measuring Bearing` (628-632) lists (i)-(iv).
- Observations recorded, not adjudicated: mercury or alcohol thermometer and glass rain-gauge descriptions (339, 374) are descriptions only. No practical procedure, field work, handling instruction, dose or rate appears; `Field work or survey` (465) is a list item among sources of geographic data.

## Visual groups (for `GEO-VIS-T2`)
1. **Header letterhead.** One JPEG, 949x359 px, 106,941 bytes, in the `WordDocument` stream at offset 83,025 (the only image signature in any stream; the `Data` stream is 4,096 bytes with none), SHA-256 `edd416d4bec3d9f5c64d7907a1407ff3e04981018c613f0cf551e2a1e1078c14` — byte-identical to the header images recorded for Geography 1st Term and Further Mathematics. Vendor branding with contact details; not a teaching figure; must not be committed or republished. Unlike the 1st Term, **no page-1 cover image** exists in this document.
2. **Rainfall table** (getBody 360, example at 357-359): a Word table, 2 rows by 13 cells (a label cell then twelve month columns; header row of month initials), one text paragraph with tab-separated cells.
3. **Temperature table** (getBody 394, example at 388-393): same layout, 2 rows by 13 cells.
4. **Compass/direction drawing**: a drawing-object group with text boxes (compass letters) anchored in the blank run at lines 607-620 after the DIRECTION paragraph (605-606); no embedded raster.
5. **Bearing drawing**: a drawn shape with a line, anchored on the step (iv) paragraph (632).
6. **Drawing prompts** at 641 and 659 (`Draw the four cardinal points.`) ask the learner to draw; no answer figure is supplied.
Layouts of 4 and 5 were not rendered; their shapes carry no recoverable text beyond the compass letters.

## Structural rule findings (findings only; no rule written)
- `split_before`: labels are word-numbered, two span two weeks, `WEEKEND ASSIGNMENT` lines start with `WEEK`, and the scheme header `WEEK  <TAB>TOPIC` (7) and rows start with numerals; a digit-based week pattern finds no label. Importer behaviour **unverified**.
- `attach_stranded_label`: no stranded label observed.
- `classify_marker`: scheme row 9 (`REVISION`, line 17) is a marker with no body; the misspelt `Evaluaton`, `EVALUATION:`/`EVALUATION` and singular forms and the absent Reading Assignments need explicit handling in GEO-MARK-T2; `KEEPING WEATHER RECORDS AND INSTRUMENTS` must not be classified as a marker.

## Queue items appended (11, all PENDING, each depends on `GEO-INV-T2` + `GEO-SRC-T2`)
`GEO-PRE-T2` (lines 1-22), `GEO-MARK-T2` (markers and irregular sections), `GEO-WK-T2-W01`, `W02`, `W03-04`, `W05`, `W06-07`, `W08`, `W09`, `W10` (one per label span above) and `GEO-VIS-T2` (the six visual groups).

## Edits
- `QUEUE.json`: GEO-INV-T2 -> `IMPLEMENTED_TESTING_DEFERRED`; 11 items appended; `counts`, `status_counts` and `next_runnable` recomputed; one note appended. No existing ID otherwise changed.
- This file. No package, lesson, coverage, rule, correction, asset, shared schema/compiler or other-subject file touched.
- Authoring checks only (JSON parse, unique IDs, dependency resolution, git diff); no tests, importer, typecheck or database.

## Remaining
Alias approval for the 2nd Term source (`GEOGRAPHY-T2-ALIAS-APPROVAL`) is untouched. The 3rd Term inventory (GEO-INV-T3) is unread. Next eligible: `GEO-PRE-T2`. This does not claim the subject or class complete.
