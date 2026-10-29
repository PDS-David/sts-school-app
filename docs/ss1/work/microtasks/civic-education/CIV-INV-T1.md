# CIV-INV-T1 — Civic Education (1st Term)

Status: IMPLEMENTED — TESTING DEFERRED BY OWNER. Source inventory only. No lesson, coverage entry, rule, correction, asset, test, typecheck, importer run, database check or deployment was performed.

## Input

| Field | Value |
| --- | --- |
| Source | SS1-SRC-fe52495abec9 |
| archive_member | `SSS 1/1st Term SS1_/CIVIC SSS1.docx` |
| Member SHA-256 | `ee459b07229cc9ddea7b338c10fc4080261afdbceb2fe5d8765ef1ce520ce80a` (matches SOURCE_ASSIGNMENTS.csv) |
| Member size | 24,152 bytes |
| Container | Composite archive `SSS 1-20260507T072431Z-3-001 (1).zip`, SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e` (verified; archive not committed) |
| Committed? | No - original bytes and private extracts stay outside Git |

## Method

- Text view: mammoth 1.12.2 `extractRawText`; 20,117 characters, 511 lines, SHA-256 `5c13b2993572de127842693962da27c4f82085bd11dd1085d8c8015b53d0182d`.
- Locator: `\n`-split text, 1-based line numbers; a week range starts at its `WEEK ...` marker line and ends at the line before the next marker (last week to end of file); SHA-256 over the UTF-8 lines joined with `\n` (no trailing newline).
- Structure: `word/document.xml` body children parsed directly; table cells read paragraph by paragraph; media and object parts enumerated from the ZIP.
- Nothing was rendered and no importer/plan run was made (testing deferred by owner).

## Opening (lines 1-120, SHA-256 `6c36e8838f857b2148cbfd1d82c817a38dc50f93f8b4235e361f7d640020a9cb`)

- 1 `ALPHA TERM SCHEME OF WORK FOR SS1`
- 3 `CIVIC EDUCATION`
- 5/7 table header `WEEK` / `TOPIC`
- The scheme is a real Word table (body child 2), 13 rows x 2 cells: header + week rows 1-11 + row `12 – 13` / `REVISION AND EXAMINATION` (115-117).
- No teaching text before `WEEK ONE` (121).

Scheme rows and mapping:

| Scheme row | Label (line) | Body |
| --- | --- | --- |
| 1 | INTRODUCTION TO CIVIC EDUCATION (11) | WEEK ONE |
| 2 | VALUE (21) | WEEK TWO (`TOPIC: VALUES`) |
| 3 | ACCEPTABLE SOCIETAL VALUES EXCETATION (31), incl. bullet "Opportunity to defrend oneself" (35) | WEEK THREE; the "opportunity" bullet is taught as WEEK FOUR |
| 4 | COMMUNITY SERVICE AND ITS VALUES (39) | none |
| 5 | HIV / AIDS (49) | none |
| 6 | HIV/AIDS (59) | none |
| 7 | YOUTH EMPOWERMENT (69) | WEEK FIVE |
| 8 | IMPORTANCE AND BENEFITS OF YOUTH EMPOWERMENT SKILLS (81) | WEEK SIX |
| 9 | GOALS OF CITIZENSHIP EDUCATION (cont.) (91) | WEEK SEVEN |
| 10 | GOALS OF CITIZENSHIP EDUCATION (cont) (99): meaning, structure and functions of government | WEEK EIGHT (`TOPIC: GOVERNMENT`) |
| 11 | NATIONALISM (Definition) (109) | none |
| 12-13 | REVISION AND EXAMINATION (115-117) | none (marker) |

## Week inventory

| Week | Marker and title | Lines | SHA-256 | Sections (anchor lines) |
| --- | --- | --- | --- | --- |
| WEEK ONE | 121; `TOPIC: INTRODUCTION TO CIVIC EDUCATION` (123) | 121-172 | `ed1a4c1908619ef6e710bffb3e95bdf5c7b5f500d9dd97e3e80f2610846cd275` | 127-129 definition, 131 NEEDS, 143 OBJECTIVES IN SCHOOLS, 159 IMPORTANCE TO NATION BUILDING; no assessment block |
| WEEK TWO | 173; `TOPIC: VALUES` (175) | 173-210 | `1dfa4413154b91e1dd63f78e9fede595bea987f5ec3c638d17d9737688377915` | 177 definition, 181 TYPES OF VALUE, 199 selflessness, 201 justice, 205 Assignment |
| WEEK THREE | 211; `ACCEPTABLE SOCIETAL VALUES` (213, no `TOPIC:`) | 211-244 | `60fd0099c08e4d3d38c9c47507fda014c3715d59ecd0bf7b37e41b75e281b4ec` | 215 TYPES OF JUSTICE, 227 IMPORTANCE OF JUSTICE, 237 IMPORTANCE OF VALUES; no assessment block |
| WEEK FOUR | 245; `OPPORTUNITY TO DEFENT ONESELF` (247, no `TOPIC:`, source spelling) | 245-274 | `9b1e5d2ba70914b9401a0f5fa38ac977b157a86423057e3d64bb18cad7eac0a2` | 247 definition, 253 BENEFITS, 261 HOW TO DEFEND ONESELF, 271 Assignment |
| WEEK FIVE | 275; `TOPIC: YOUTH EMPOWERMENT` (277) | 275-370 | `8e31d34913f624400a1e453c4ef1f221b3ef15fd59080cb7e61bf62bb9d82ccf` | 279 definition, 285 coping skills 285-317, 319 manipulating skills, 333 intellectual skills, 335 TYPES OF INTELLECTUAL SKILLS, 345 communication skills, 347 TYPES OF COMMUNICATION SKILLS, 363 ASSIGNMENT |
| WEEK SIX | 371; `IMPORTANCE AND BENEFITS OF YOUTH EMPOWERMENT` (373, no `TOPIC:`) | 371-392 | `21c28cdb999ece33d7c4d662e3daee41738f7a120725fc4fe175f9558b12e52e` | 375-387 seven numbered benefits, 389 Assignment |
| WEEK SEVEN | 393; `TOPIC: GOALS OF CITIZENSHIP EDUCATION` (395) | 393-432 | `59878b0c569a280014879e25e4f01c202ea231147ad495ad3ac4bcf8d149f159` | 397 citizenship, 399 goals, 409 ACQUISITION OF CITIZENSHIP (415-421), 423 ASSIGNMENT |
| WEEK EIGHT | 433; `TOPIC: GOVERNMENT` (435) | 433-511 | `1b8a0d08f5c7b0c79ee0cbf0287eac36bf8ae0c8dc554e889160c3c895355437` | 437 definition, 439 STRUCTURE, 451 Functions, 455 Executive, 469 Legislature, 491 Judiciary; file ends at 503 |

The body has eight week markers only - 121, 173, 211, 245, 275, 371, 393, 433. There is no WEEK NINE or later marker.

## Scheme-to-body gap (recorded, not repaired)

- Scheme rows 4 (community service), 5 and 6 (HIV/AIDS) and 11 (nationalism) have no teaching body at all.
- Body WEEK FOUR is the "Opportunity to defrend oneself" bullet of scheme row 3, not a scheme row of its own.
- Body weeks 5-8 map to scheme rows 7-10, so body numbering runs three behind the scheme from WEEK FIVE onward.
- The scheme's `12 – 13` revision/examination row has no body, revision note, examination paper or marking scheme.
- No content was invented for the missing rows. They are recorded by CIV-MARK-T1-SCHEME-GAPS; lesson tasks can follow only from a later indexing item.

## Tables and media

- Exactly one Word table: body child 2, 13 rows x 2 cells (the scheme). It is the only structured table; no comparison or teaching table exists elsewhere.
- No media: 0 `word/media` parts, 0 `a:blip`, 0 `w:object`, 0 `w:pict`, 0 `w:txbxContent`, 0 `m:oMath`, 0 `w:vertAlign` runs. No visual-disposition item exists for images because there are none; CIV-VIS-T1-TBL-SCHEME covers the table itself.
- The raw text linearises the table: week numbers appear as bare `1`...`11` lines and the last row as `12 – 13` (en dash U+2013). These digits are scheme cells, not body markers.
- Two U+2019 right single quotes and seven U+2013 en dashes are present in the raw text (for example `social – political`, `12 – 13`).

## Parser rule findings (findings only - no rule written)

- `split_before`: body markers are `WEEK ONE` ... `WEEK EIGHT` (word labels); compiler.ts requires a numeric-only `week_label`, so normalisation is needed. The bare digits 1-11 in the opening are scheme cells and must not be read as markers; the first `WEEK` line (5) is a table header, not a marker.
- `attach_stranded_label`: WEEK THREE (213), WEEK FOUR (247) and WEEK SIX (373) have no `TOPIC:` prefix; without the rule these headings would read as ordinary lead paragraphs.
- `classify_marker`: `REVISION AND EXAMINATION` exists only as scheme row `12 – 13` (115-117); it must be classified as a marker, not a lesson, and must not create a WEEK TWELVE body.

## Content issues recorded (not corrected)

- Spelling and typography in the source: `EXCETATION` (31), `defrend` (35), `Capentry` (83), `DEFENT` (247), `fives` (365), `singed` (479), `os called ther state House of Assembly` (447), `stature of a woman` (493). Keep verbatim.
- Truncated paragraphs: 199 (ends "as he fought and stood for justice and") and 201 (ends "we can say that h"). Do not complete them.
- Week 4 step 3 (267) reads "Do not use sexually attractive or provocative diseases especially in the public" - garbled; preserve verbatim (CIV-PRES-T1-DEFENCE-ADVICE), do not guess the missing word.
- Week 5 assignment (365) asks for government roles although government is taught in Week 8; Week 6 assignment (391) asks for eight problems of youth empowerment while the body lists seven benefits and no problems. Recorded, not answered.
- Week 8 ends mid-topic at judiciary function 4 (503): no evaluation, reading assignment, weekend assignment or general evaluation exists anywhere in the document.
- Scheme row 9 and 10 are labelled "(cont.)" with no earlier matching goal section other than the Week 7 body; the body's goals list (399-407) is short.

## Factual and neutrality flags

- Week 7 citizenship acquisition claims (birth, registration, naturalization with a stated 15-year residence, dual citizenship) need the Constitution/citizenship legislation in force with dates - CIV-FACT-T1-CITIZENSHIP-LAW.
- Week 8 institutional and constitutional-power claims (three tiers, bicameral/unicameral legislatures, judiciary heads, executive/legislative/judicial functions) need the Constitution as amended and current official sources - CIV-FACT-T1-GOVERNMENT-STRUCTURE.
- Week 4 "self-defence is the use of force" needs the criminal-law provisions in force - CIV-FACT-T1-SELF-DEFENCE-LAW.
- Week 1 states "democracy is the best form of government" (169). Teaching must stay neutral on contested political questions; this and similar evaluative claims are preserved as source wording, not adopted as lesson fact.
- No HIV/AIDS teaching body exists, so no medical or public-health claim is made here; the scheme-only topics must not be authored from the scheme labels.

## Edits made

- Updated `docs/ss1/work/microtasks/civic-education/QUEUE.json`: CIV-INV-T1 -> `IMPLEMENTED_TESTING_DEFERRED`; 16 new PENDING items appended:
  - 8 `SOURCE_WEEK_INDEXING` (CIV-WK-T1-W01..W08)
  - 1 `SOURCE_PREAMBLE_INDEXING` (CIV-PRE-T1)
  - 2 `SOURCE_MARKER_DISPOSITION` (CIV-MARK-T1-SCHEME-GAPS, CIV-MARK-T1-REVEXAM)
  - 1 `VISUAL_DISPOSITION` (CIV-VIS-T1-TBL-SCHEME)
  - 1 `SOURCE_PRESERVATION` (CIV-PRES-T1-DEFENCE-ADVICE)
  - 3 `FACTUAL_DEPENDENCY` (citizenship law, government structure, self-defence law)
- Every new item depends on CIV-INV-T1 and CIV-SRC-T1 (the preservation and factual items cite the week sections in their objectives). Counts now 24 items; status 4 implemented, 19 pending, 1 blocked; 19 eligible next-runnable.
- No package, lesson, coverage entry, rule, correction, asset or test file was written; `backend/src/db/ss1/subjects/civic-education.json` is untouched.

## Not done / next eligible

- Testing, typechecks, importer/plan runs, database and device checks remain deferred by owner.
- Next eligible: CIV-INV-T2, CIV-INV-T3, CIV-TEST-PACKAGE, and the 16 new T1 items listed above.
- CIV-FACT-CONTENT-APPROVAL remains BLOCKED. This task does not claim the Civic Education subject or the SS1 class complete.
