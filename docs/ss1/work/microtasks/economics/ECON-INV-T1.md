# ECON-INV-T1 — Economics, 1st Term week inventory

Status: **IMPLEMENTED_TESTING_DEFERRED** (inventory only; not approved, not verified). Testing deferred by owner.

## Inputs and checks performed
- Base: `origin/master` `a98983a` (fetched at publish time; PR #180 DP-INV-T1 was merged by the owner into `a98983a` after this work began on `b5bbe2e`, and it touches only Data Processing; no Economics PR is open). No `AGENTS.md` on master. `ECON-SRC-T1` is `IMPLEMENTED_TESTING_DEFERRED` and the 1st Term source is registered in `backend/src/db/ss1/subjects/economics.json` as `SS1-SRC-2ab0c50bcab6`.
- Source: manifest member `SSS 1/1st Term SS1_/1ST TERM S1 ECONOMICS (1) (1).doc`, 1,264,128 bytes, SHA-256 `8ad05c78b18edee3d6a011391d6ae057af457ab27f68a1ff05381d9c32e962bc` **verified** from the supplied composite archive `SSS 1-20260507T072431Z-3-001 (1).zip`, whose SHA-256 **was checked** this session: `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e` (equal to the prompt and `SOURCE_ASSIGNMENTS.csv`). `archive_member` kept verbatim.
- Text read with word-extractor 1.0.4 `getBody()`: 53,430 characters, 1,060 lines (823 non-blank), SHA-256 `026eeec9b2b8a68bba6bed3719a921e08030d56b2bb4cfdafd40352133e5037e`. Private scratch copy only; nothing from the source is committed.
- Legacy Word 97 binary (nFib 193, fComplex 0, not encrypted, no ObjectPool). FIB text range CP 2,048–55,896, ccpText 53,532, header 89 chars, textbox stream 226 chars, no footnotes/endnotes/comments. Marks on the same bytes: 286 BEL (0x07) cell/row ends, 1 inline picture (0x01), 6 page breaks (0x0C), 219 tabs, **102 drawn-object anchors** (0x08), 2 non-breaking spaces.
- The 286 BEL marks are exactly 229 table-cell ends + 57 row ends belonging to **12 tables** (antiword: 12 `informaltable`, 57 `row`, 229 `entry`; 0 graphics/media objects). No OLE objects, no WMF/EMF, no second picture.
- Media: one JPEG in the Data stream at offset 10,508, 870,389 bytes, 3,306 × 2,515, SHA-256 `b334a0e127cb7f94bf10dd46672a8545fe303971ba10d0dc9a50600962ddea9a` — byte-identical to the publisher advertisement already seen in the Commerce and Data Processing sources. It carries a phone number and e-mail address; it is not teaching content and must not be committed or reproduced.
- Header and footer both read `MR OSHO/1ST TERM/ecONOMICS/SS1` + tab + `Page 1` (lower-case `ecONOMICS`); the header also holds the page field. Document properties: author `Adeniyi Adeyanju`, created/modified 2019-08-28, application Hewlett-Packard.
- Nothing run: no tests, typechecks, importer, database, device or deployment. No password or credential occurs; no click-by-click or executable procedure appears (the worked examples are calculations, not instructions to execute).

## Locator method
Line numbers are 1-based over the `getBody()` output split on `\n`. A range runs from the `WEEK …` marker line to the last non-blank line before the next marker (document end for Week Ten); the SHA-256 is over those lines joined with `\n`, UTF-8. Labels and topic lines are quoted exactly; `\t` denotes a literal tab.

## Inventory
Unlabelled opening: lines 1–43, SHA-256 `619fc6e5db6827df8bd4ce0289b0b59be7b207c8daa798c1f42fdd2fb9fb8a9b`. It holds blank space and a tab (1–17), `FIRST TERM E-LEARNING NOTE` (18), the subject/class line `SUBJECT: ECONOMICS` + seven tabs + `CLASS: SS1` (20), `SCHEME` (22), the tab header `WEEK\tTOPIC ` (24), thirteen scheme rows (25–36), `REFERENCE BOOKS` (38) and three unnumbered entries (39–41: *Amplified and Simplified Economics for Senior Secondary School* by Femi Longe; *Comprehensive Economics for Senior Secondary School* by J.V. Anyaele; *Fundamentals of Economics for SSS* by R.A.I. Anyanwuocha). Rows 1–6 carry no literal number in the text; rows 7–13 are literal (`7.`, `8 `, `9.`, `10.`, `11.`, `12 & 13.`).

| Week | Marker line (exact) | Topic line (exact) | Lines | SHA-256 |
|---|---|---|---|---|
| 1 | `WEEK ONE` | `DEFINITION AND THE SCOPE OF ECONOMICS` | 44-116 | `4506372278dd7327422d43ac169351c46754ed5af63d3df6810bdd3be6b148eb` |
| 2 | `WEEK TWO` | `ECONOMICS AS A SCIENCE, ARTS OR SOCIAL SCIENCE` | 117-169 | `9e6974c4a9cbd17d6cca9dcbb21d80306a04589f8c67a8e3f6860664bd70f5e8` |
| 3 | `WEEK THREE` | `BASIC CONCEPTS OF ECONOMICS` | 172-247 | `98bac31f435a7d6d60f273226168882ffecb7f1853ac0abea8d9676142602ee2` |
| 4 | `WEEK FOUR` | `Importance of opportunity cost to individual` | 250-300 | `3f34480ce990164ec6ea6007b4eb1e0b4b107de63687ea63549f030c8f8b3cb9` |
| 5 | `WEEK FIVE` | `BASIC ECONOMIC PROBLEMS OF THE SOCIETY` | 302-369 | `debf4842510a2259847a6f266982c44e1fe5c5f306f030137e2d94975f972afe` |
| 6 | `WEEK SIX` | `TOOLS OF ECONOMIC ANALYSIS` | 372-615 | `d723b2c583388290363f5f59ea6ef45d093f57b310596838ccad264ca8ada93c` |
| 7 | `WEEK SEVEN` | `DATA COLLECTION AND PRESENTATION` | 618-797 | `7c4a4e30ce0d310dac3a22467cbb36d4d8241887d776c797a572924146e92ca7` |
| 8 | `WEEK EIGHT` | `PRODUCTION` | 800-896 | `ca2649e66ba10258568a5ab880d31268aa5586b9320cfdab3a4af7950481e299` |
| 9 | `WEEK NINE` | `LAND AS A FACTOR OF PRODUCTION` | 899-982 | `edf633f4bbbc5d07bfc9a5edaed1eb6300e54f5fcb6fe0320cb5aaa49f703b07` |
| 10 | `WEEK TEN` | `LABOUR AS A FACTOR OF PRODUCTION` | 985-1059 | `b65654678f1202523b6bf2a5d61b5cd9c70f785a9a9677e0c4a37c996e3d757d` |

Week count: **ten** teaching weeks, each with a body. The file ends at line 1,060 (blank); the last content line is 1,059 under Week Ten's `SECTION B`. No `WEEK ELEVEN`, `TWELVE` or `THIRTEEN` marker exists.

## Scheme-to-body mapping
| Scheme row (line) | Body | Note |
|---|---|---|
| Meaning of Economics (25) | Week One | body also covers scope, branches and why we study |
| Economics as a Science, Arts or Social subject (26) | Week Two | body adds career prospects |
| Basic Concept of Economics (27) | Week Three | wants, scarcity, choice, scale of preference, opportunity cost |
| Importance of Opportunity Cost to an Individual, Firms and the Government (28) | Week Four | body title is lower case and names only the individual |
| Basic Economic Problems of the Society (29) | Week Five | what/how/for whom, effective allocation |
| Basic Tools for Economics Analysis (30) | Week Six | tables, graphs, bar and pie charts, linear graph |
| 7. Data Collection and Presentation (31) | Week Seven | frequency tables and measures of central tendency |
| 8 Theory of Production (32) | Week Eight | production, goods, factors and rewards |
| 9. Land as a Factor of Production (33) | Week Nine | land, law of diminishing returns and its table |
| 10. Labour as a Factor of Production (34) | Week Ten | labour, types and efficiency |
| 11. Revision (35) | none | no `WEEK ELEVEN` marker, no body |
| 12 & 13. Examination (36) | none | no `WEEK TWELVE`/`THIRTEEN` marker, no body |

Scheme and body agree on topics 1–10 except the Week Four title wording. Recorded, not corrected.

## Assessment blocks inside the weeks (all preserved, none answered)
- Week One: `EVALUATION` 71–73, 80–82, 93–95; `GENERAL EVALUATION QUESTIONS` 100–105; `WEEKEND ASSIGNMENT` 107–112; `SECTION B` 114–116.
- Week Two: `EVALUATION` 133–135, 145–147; `GENERAL EVALUATION QUESTIONS` 152–157; `WEEKEND ASSIGNMENT` 159–165; `SECTION B` 167–169.
- Week Three: `EVALUATION` 193–195, 220–222; `GENERAL EVALUATION QUESTIONS` 227–232; `WEEKEND ASSIGNMENT` 234–240; `SECTION B` 242–247.
- Week Four: `EVALUATION` 277–279; `REVISION/ GENERAL EVALUATION` 284–289; `WEEKEND ASSIGNMENT` 291–296; `SECTION B` 298–300.
- Week Five: `EVALUATION` 323–325, 340–345; `GENERAL EVALUATION QUESTIONS` 350–358; `WEEKEND ASSIGNMENT ` 360–365 (trailing space); `SECTION B` 367–369.
- Week Six: `EVALUATION` 406–408, 440–442, 499–501, 553–555; `GENERAL EVALUATION QUESTIONS` 560–577; `WEEKEND ASSIGNMENT` 579–600 (includes a pie-chart question 586–599); `SECTION B` 602–615.
- Week Seven: `EVALUATION` 693–695, 768–770; `REVISION/GENERAL EVALUATION` 776–782; `WEEKEND ASSIGNMENT` 784–793; `SECTION B` 795–797.
- Week Eight: `EVALUATION` 826–828, 872–875; `GENERAL EVALUATION QUESTIONS` 880–885; `WEEKEND ASSIGNMENT` 887–892; `SECTION B` 894–896.
- Week Nine: `EVALUATION` 944–946, 957–959; `GENERAL REVISION` 966–971; `WEEKEND ASSIGNMENT` 973–978; `SECTION B` 980–982.
- Week Ten: `EVALUATION` 1016–1018, 1035–1037; `GENERAL REVISION` 1043–1048; `WEEKEND ASSIGNMENT` 1050–1055; `SECTION B` 1057–1059.
- No answer key, marking scheme, mark allocation or rubric appears anywhere (searched `answer`, `marking`, `marks`, `score`, `rubric`). All questions are printed unanswered; the only worked answers are the examples inside Week Six and Week Seven.

## Tables (12; 229 cell ends + 57 row ends = 286 BEL)
| # | Lines | Shape | Content |
|---|---|---|---|
| 1 | start (CP 5–8) | 1 × 1 | empty shell, no cell text |
| 2 | 399–404 | 6 × 5 | performance of four students: Students/Eng/Maths/Econs/Total, A–D, totals 240/230/260/730 |
| 3 | 453–454 | 2 × 6 | simple bar data: Score 2–10, Frequency 7/8/9/4/2 |
| 4 | 470–473 | 4 × 4 | component bar data: Class/Boys/Girls/Total, S.S.1p 24/18/42, S.S.1w 17/22/89, totals 41/40/81 |
| 5 | 489–492 | 4 × 4 | multiple bar data: `Produce line Tunner` (header), years 2000/200/2002, cocoa/cotton/groundnut values |
| 6 | 507–510 | 4 × 2 | pie data: English 9, Mathematics 6, Science 5, Others 20 periods |
| 7 | 513–518 | 6 × 4 | pie solution: Subjects/Periods/Working/Degree, 9/40, 6/40, 5/40, 20/40 of 3600, totals 40/3600 |
| 8 | 606–607 | 2 × 7 | weekend sales: Days Mon–Sat, Sales(N) 1970/1000/3500/2250/1000/2500 |
| 9 | 637–644 | 7 × 3 | frequency table: Scores 0/2/4/6/8/10, tally strokes, Frequency 4/8/4/6/5/3, total 30 |
| 10 | 726–735 | 9 × 3 | median example: Marks 1–10, tally strokes, Frequency, total 20 |
| 11 | 789–790 | 2 × 7 | weekend meat data: Meat Purchased (kg) 1–6, Frequency 2/4/10/8/5/1 |
| 12 | 922–931 | 8 × 5 | law of diminishing returns: 4 hectares, 1–7 men, TP/AP/MP, MP −6 at the seventh |

word-extractor renders each table as tab-separated lines; headers that span two or three lines (unit/heading text at 922–924) and trailing tabs on total rows must be re-joined from structure, not guessed. Dispositions: `ECON-VIS-T1-W06-TABLE-EXAMPLES`, `ECON-VIS-T1-W07-FREQUENCY-TABLES`, `ECON-VIS-T1-W09-DIMINISHING-TABLE`.

## Diagrams and charts
The document draws its figures with 102 VML/drawn-object anchors (`0x08`), not with images; labels often sit in a separate 226-character textbox stream, so anchors and labels cannot be paired automatically.
- Demand curve, Week Six 414–424 (10 anchors, CP 24,090–24,450): axis labels `Price (N)`, `Quantity`, `D`, `Demand Curve`, points at 7/5/3 and 5/10/15.
- Simple bar chart, Week Six 452–467 (22 anchors, CP 26,021–26,046): axis `Frequency`, scores 2/4/6/8/10.
- Component bar chart, Week Six 469–487 (23 anchors, CP 26,311–26,344): drawn stacked bars; textbox labels `KEY`, 50/40/30/20/10, `Girls`, `Boys`, `S. S. 1p`, `S. S. 1w`.
- Multiple bar chart, Week Six 488–498 (24 anchors, CP 26,510): textbox labels `Year`, 2000/2001/2002, `KEY`, 800/600/400/200.
- Linear graph, Week Six 533–552 (4 anchors, CP 27,710–28,152): axes `Price (N)`/`Quantity`, plotted points for the Q = 42 − 2p example.
- Weekend pie figure, Week Six 582–599 (14 anchors, CP 29,729–30,056): a drawn circle with sectors; textbox labels `Banana 600`, `Carrot 1000`, `Mango 1200`, `0range 80`, age ranges `1 - 16 yrs`, `19 - 60 yrs`, `9 yrs`.
- Pie chart example, Week Six 503–518: no drawing — only the data table (507–510) and the degree solution table (513–518).
- Three further anchors at CP 31,959–31,999 sit beside the Week Seven frequency table (637–644), probably border marks; they carry no labels.
- The two anchors at CP 5–8 belong to the empty start shell.
No flowchart, screenshot or other diagram exists. Dispositions: `ECON-VIS-T1-W06-GRAPHS`, `ECON-VIS-T1-W06-BAR-CHARTS`, `ECON-VIS-T1-W06-PIE-CHARTS`, plus the table and publisher-media items above.

## Embedded media and layout
- One JPEG (publisher advertisement, 3,306 × 2,515, SHA-256 `b334a0e1…`) held in the textbox stream; no teaching image. Disposition: `ECON-VIS-T1-PUBLISHER-MEDIA`. It must not be committed or used as an asset.
- 6 page breaks at CP 6, 17,608, 22,346, 26,535, 27,816, 34,628: before the title, before Week Five, inside Week Five before `SECTION B`, between the multiple-bar table and its chart, before the linear-graph example, and before the Week Seven median solution. They are typographic, not section boundaries.
- Header and footer both print `MR OSHO/1ST TERM/ecONOMICS/SS1` and the page number; both are non-teaching.

## Findings for the importer's parser (findings only; no rules added)
- `split_before` candidate: exactly ten `WEEK <WORD>` lines (44, 117, 172, 250, 302, 372, 618, 800, 899, 985), upper case, alone on the line. No tab-prefixed, numbered or lower-case form occurs. Scheme rows (25–36) must not split.
- `attach_stranded_label` candidate: each week's topic is the line immediately after the `WEEK` marker (45, 118, 173, 251, 303, 373, 619, 801, 900, 986) and there is no `TOPIC:` token anywhere. Week Four's topic is lower case and names only the individual part; it must still attach to `WEEK FOUR`. Scheme rows 1–6 lose their numbers in the text while rows 7–13 keep literal numbers, so numbering cannot be inferred from the text alone.
- `classify_marker` candidate: scheme rows 11 (`11. Revision.`, 35) and 12 (`12 & 13. Examination.`, 36) have no body and are calendar markers. The in-body headings `REVISION/ GENERAL EVALUATION` (284), `REVISION/GENERAL EVALUATION` (776), `GENERAL REVISION` (966) and `GENERAL REVISION` (1043) carry only questions, not teaching; classify them by body as assessment blocks. No revision teaching exists to be erased; if a later source supplies a revision body it must be classified by body.
- Table flattening: each table arrives as a run of tab-separated lines with 286 BEL marks; multi-line headers and wrapped cells merge (921–924, 513–518) and total rows trail tabs. Drawn charts arrive as `0x08` anchors with no label text; their labels are separated into the textbox stream. Tabs (219) drive both tables and axis layouts.
- The footer typo `ecONOMICS` and the scheme header's trailing space (`WEEK\tTOPIC `) must survive re-authoring.

## Content issues recorded (not corrected here)
- Arithmetic in the worked examples: the linear-graph table prints Q = 56 at p = 3 where 42 − 2 × 3 = 36 (535); the component-bar table prints a S.S.1w total of 89 where 17 + 22 = 39 (472); the pie solution prints 810/540/450/1800 degrees where 9/40 × 360° = 81°, 6/40 × 360° = 54°, 5/40 × 360° = 45°, 20/40 × 360° = 180° (513–518, with `3600` for 360°); the median example prints `70th + 11th` where the 10th and 11th positions are meant (736), and its formula lines are garbled (736–737); line 526 leaves a stray `Q = 42 - 21`; line 531 prints `42 x 2 x N7` where `42 - 2 x N7` is meant. The means (674–678) and both medians (704–719) are arithmetically correct.
- Typos and spacing: `Alfred Marshal` (56), `H. J. Daven Port` (57), `Edvins Canon` (58), `Robins` (60), `priving` (521), `Tunner` and year `200` for 2001 (489), `Different between` (571), `S. S. 1p` (471), `It's quality` (914), `Bodies of water` (953), `yams` example (933), header/footer `ecONOMICS`, missing commas in the median lists (710, 713).
- Week Six's weekend assignment relies on a drawn pie chart (586–599) whose labels are in the textbox stream; the question cannot be answered from the flattened text alone.

## Factual, safety and neutrality flags (later correction work; nothing corrected here)
- Definitions and attributions: Adam Smith in 1776 (54), John Stuart Mill in 1843 (55), Alfred Marshall in 1890 (56), H. J. Daven Port / Edvins Canon / A. I. Pigou (undated, 57–59) and Lionel C. Robbins in 1932 (60). Verify each quotation, date and spelling against authoritative sources; keep the source's wording distinct from the corrected attribution. These belong to `ECON-FACT-T1-DEFINITIONS`.
- Dated examples and figures: the `GENERAL EVALUATION` state budget `for 2010` (562–569), the Jos carrot/onion data for 2001–2004 (572–577), Naira amounts written without a price year (246–247, 610–614), the `West Africa countries` question (231) and the Nigeria references (952, 1046) are date-sensitive; a lesson must present them as dated illustrations, not current statistics. These belong to `ECON-FACT-T1-DATED-EXAMPLES`.
- All worked arithmetic and statistics must be rechecked before a lesson adopts an answer; that is `ECON-FACT-T1-CALCULATION-VERIFY`, kept separate from the preserved source wording.
- No password, credential, unsafe step or executable instruction was found; the Naira examples are illustrative only, and no step may be turned into a required live execution.

## Edits made by this item
- Appended to `docs/ss1/work/microtasks/economics/QUEUE.json`, with dependencies `ECON-INV-T1` + `ECON-SRC-T1` and status `PENDING`: `ECON-PRE-T1`, `ECON-WK-T1-W01` … `ECON-WK-T1-W10`, `ECON-MARK-T1-REVEXAM`, `ECON-VIS-T1-W06-TABLE-EXAMPLES`, `ECON-VIS-T1-W06-GRAPHS`, `ECON-VIS-T1-W06-BAR-CHARTS`, `ECON-VIS-T1-W06-PIE-CHARTS`, `ECON-VIS-T1-W07-FREQUENCY-TABLES`, `ECON-VIS-T1-W09-DIMINISHING-TABLE`, `ECON-VIS-T1-PUBLISHER-MEDIA`, `ECON-PRES-T1-CALCULATIONS`, `ECON-PRES-T1-SOURCE-WORDING`, `ECON-PRES-T1-LAYOUT`, `ECON-FACT-T1-DEFINITIONS`, `ECON-FACT-T1-DATED-EXAMPLES`, `ECON-FACT-T1-CALCULATION-VERIFY`.
- Set `ECON-INV-T1` to `IMPLEMENTED_TESTING_DEFERRED` with the evidence above; recomputed `counts`, `status_counts` and `next_runnable`; appended a queue note.
- No lesson, coverage entry, correction, asset or parser rule was written; no other subject, shared file, package or test file was touched.

## Not done
No tests, typechecks, importer/plan run, database/device check, migration, import or deployment (deferred by owner). No merge. Economics stays a separate subject (not merged into Commerce, Financial Accounting or Bookkeeping). Week count and labels above are what the document itself contains.
