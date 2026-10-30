# AG-INV-T2 — Agricultural Science, 2nd Term week inventory

Status: **IMPLEMENTED_TESTING_DEFERRED** (inventory only; not approved, not verified). Testing deferred by owner.

## Inputs
- Base: origin/master `b696e3e` (fetched). `AGENTS.md` is absent. Open PR at start: #235 (Civic Education CIV-INV-T2) only; none owns Agricultural Science.
- Prerequisite AG-SRC-T2 is `IMPLEMENTED_TESTING_DEFERRED`; package `backend/src/db/ss1/subjects/agricultural-science.json` has source `SS1-SRC-956594d97094`, no lessons or coverage.
- Original: `2ND TERM S1 AGRICULTRAL SCIENCE.docx` taken from the supplied `2nd Term SS1` archive, SHA-256 `e9706d69cbb41e7149e2fe62a202ec21143e827fb78c46cb92efe142f9d7e042` — hashed before conversion; equals the task's Member SHA-256. The composite archive (`02448712…9a3e`) was not supplied, so its hash was **not checked**.
- Method: `word/document.xml` read with lxml in a private scratch directory; the one embedded image was viewed. Nothing from the document is committed. The importer was not run.

## Locator rule (reproducible)
Block = direct child of `w:body` in `word/document.xml`, 0-based (blocks 0-676; block 677 is `w:sectPr`). Block text = concatenation of its `w:t` runs, UTF-8, no normalisation. Range hash = SHA-256 of the block texts first..last inclusive joined with `\n`, empty blocks included.

## Week inventory (8 labels covering scheme weeks 1-10)
Labels are word-numbered, run straight into `DATE` and two of them cover two weeks.

| Weeks | Exact label | Label block | Blocks | Label sha256 | Range sha256 | Table |
|---|---|---|---|---|---|---|
| 1 | `WEEK ONEDATE: __________` | 24 | 24-30 | `e2d88213935cb2a74c6f5b63b48658fed021499c0e466015b262c70f79aa1174` | `6b1186edc3dd9b108beb340f504a00dcc4e7935fb2ba1cc428c13b8f084e3e6d` | - |
| s 2-3 | `WEEK TWO AND THREEDATE: __________` | 31 | 31-278 | `01121871f3f6eccc5c172fdec68054baec6b5ea77543c053a9dd300f9e753591` | `e251c8cbae1ddbd96d258e22b897e588dc6cd69adcde2c84b21212db14ed0d72` | - |
| s 4-5 | `WEEK FOUR AND FIVEDATE………` | 279 | 279-336 | `cfedef7fdc862d32784d7ef652431dded564e3b0fc8f74b3498436daefcc2ebf` | `1dbb2d100cc1c775a4797cdeb018bfff05030346fe9d3bb7593448e4ac5e577a` | tables 286/298/309 |
| 6 | `WEEK SIX    DATE……………` | 337 | 337-420 | `0cc991fdd5c3a5ca82a15a545e653aa6f77ec340a7bb71f6569342cff59117b1` | `8e54b81a1ac02ed85c99e0746d481317ad31d9191f6ecdab2bcaeb687cd97ce5` | - |
| 7 | `WEEK SEVENDATE………………..` | 421 | 421-516 | `c3dc7b3a50bb9e5bbbf1cdbb387934866a994e81d69193dcba41f789a365c081` | `b8ed03701eace10e135d2dbb227245677d6c160dd0876e4540e450e980657d1b` | - |
| 8 | `WEEK EIGHTDATE: …………………..` | 517 | 517-598 | `5dc4f1ae40deb267312224b47cdf5d01343a888091aeab6f42ad223a4d03aec7` | `aa24be430015e9cf92fe0e3b82b9ddffd52a5c59998ae69cb3962bd75c9f9f7e` | - |
| 9 | `WEEK NINEDATE: ……………………..` | 599 | 599-674 | `6da53770c7591dca1f306e5079aa5d61a4949ab93e170abf64976f7e0caaff72` | `bc1d1321d855bd1376adc8b8d0f08f6c5dbd9b31eae703f1358a34060ae8ba81` | - |
| 10 | `WEEK TENDATE: ……………` | 675 | 675-676 | `31939d9c0dafc228d9c0b276ea88670bd77d9b9b536acd3a1b7c3ff5df797a92` | `6d1209926076460d476c866e9e81b211418f8a1df5bd3238b5f7d132fc598717` | - |

Topic lines: W1 block 25, W2-3 32, W4-5 280, W6 338, W7 422, W8 518, W9 600; W10 has only `REVISION` (block 676). The scheme (blocks 6-15) lists nine rows: week numbers appear in the text only for blocks 9 (`4-5.`), 10 (`6.`), 11 (`7.`) and 15 (`11-12.`); blocks 7, 8, 12, 13, 14 are unnumbered, so Weeks 1, 2-3, 8, 9 and 10 are inferred from order and the body labels. There is no Week 11/12 label or body; the document ends at block 676.

## Other sections and objects
- Blocks 0-23: `SECOND TERM E-LEARNING NOTE` (0), SUBJECT/CLASS line (2), scheme (4-15), REFERENCES (17-21: four books), blank blocks. Range sha256 `9967f8c0eb88e7a77adad2d6f9c1495888393fa2eab579a7e05ee5740b5f0791`.
- Week 1 (blocks 24-30) holds only two bullets, `Answers to last term’s objective questions` and `…theory questions`; the answers themselves are not in the source.
- Tables: blocks 286 (cereals), 298 (legumes), 309 (roots and tubers), each 17 rows x 3 columns (blank header cell, two crops, 16 attribute rows). Plain-text extraction of a table block concatenates cells with no separator.
- Images: `media/image1.jpeg` (949x359, sha256 `edd416d4bec3d9f5c64d7907a1407ff3e04981018c613f0cf551e2a1e1078c14`) is used only in `header2.xml`: a tutor-brand banner with contact details, not a teaching figure. No `w:drawing`/`w:pict` in the body, no equations (`m:oMath` 0), no OLE objects. Footer 2 carries `GSS/AGRICULTURAL SCIENCE /SS1/2ND TERM` and a page field.
- Practical/observation sections: `PRACTICAL DEMONSTRATION` (blocks 68-73, clear and till the school farm, layout, ten maize ridges) and `FIELD WORK ON LAND PREPARATION` (236-237) in Weeks 2-3. Procedures are one-line instructions; no recording sheet or observation template.
- Safe-chemical-handling and doses: none. Block 186 cautions that inorganic fertilizer can burn a plant it touches; block 205 mentions weeding by herbicide spraying with no product, rate or protective equipment. The tables do give agronomic figures (seed rate kg or tonnes per hectare, spacing, temperature and rainfall ranges, maturity periods) that are source facts to keep verbatim. Later items must neither add rates or doses the source lacks nor drop the ones it has.

## Structural rule findings (findings only; no rule written)
- `split_before`: labels are word-numbered and glued to `DATE` (`WEEK ONEDATE: ____`, `WEEK TWO AND THREEDATE: ____`, `WEEK FOUR AND FIVEDATE………`), two labels span two weeks, and `WEEK SIX    DATE……` has spaces. A digit-based week pattern would find none. `WEEKEND ASSIGNMENT` lines (blocks 239, 324, 407, 504, 584, 661) and scheme header `WEEKTOPIC` (block 6) also begin with `WEEK`. Whether the importer mis-splits on these is **unverified**.
- `attach_stranded_label`: no stranded label observed; each label shares its paragraph with its DATE field.
- `classify_marker`: scheme blocks 14 (`Revision.`) and 15 (`11-12.      Examination`) and the Week 10 `REVISION` block 676 are markers with no body. `GENERAL EVALUATION/REVISION QUESTIONS` (block 232) and the per-week `GENERAL EVALUATION` headings are inside lesson bodies and must not be classified as markers.

## Edits
- `QUEUE.json`: AG-INV-T2 -> `IMPLEMENTED_TESTING_DEFERRED`; 14 PENDING items appended (AG-PRE-T2; AG-MARK-T2-REVISION, AG-MARK-T2-EXAM; AG-WK-T2-W01, W02-03, W04-05, W06, W07, W08, W09; AG-VIS-T2-TBL-CEREALS, -LEGUMES, -ROOTS; AG-VIS-T2-BRANDING), each depending on AG-INV-T2 and AG-SRC-T2; counts, status_counts and `next_runnable` recomputed; one note appended. No existing ID otherwise changed.
- This file. No package, lesson, coverage, rule, correction, asset, shared schema/compiler or other-subject file touched.
- Authoring checks only (JSON parse, unique IDs, dependency resolution, git diff); no tests, importer, typecheck or database.

## Remaining
Alias approval (`AGRICULTURAL-SCIENCE-ALIAS-APPROVAL`) is still an owner open item. The 3rd Term inventory (AG-INV-T3) is unread. Next eligible: `AG-WK-T2-W02-03` (largest week, practical and field-work content). This does not claim the subject or class complete.
