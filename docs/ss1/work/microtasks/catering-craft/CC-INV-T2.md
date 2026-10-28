# CC-INV-T2 — Catering Craft, 2nd Term week inventory

Status: **IMPLEMENTED_TESTING_DEFERRED** (inventory only; not approved, not verified). Testing deferred by owner.

## Inputs and checks performed
- Base: `origin/master` `09071425921562518066d04ef59697f6ce12b3d9`. No open PRs existed; no other worker owns this item. CC-SRC-T2 is IMPLEMENTED_TESTING_DEFERRED on master.
- Source `SS1-SRC-f433169ca25c`, manifest member `SSS 1/2nd Term SS1_/2ND TERM S1 CATERING CRAFT PRACTICES.doc`.
- Input was the supplied **"2nd Term SS1" zip** (SHA-256 `94a32a4ec4af7d492d26feecdf06cedfedf846d3c65c27a5473a1693d0d33c0a`), member `2nd Term SS1 /2ND TERM S1 CATERING CRAFT PRACTICES.doc`, 207,872 bytes.
- Member SHA-256 `fd8115ff99dd3c370b86b4b5a326fe647e49328bc83f2d041c73f29b1b84ad59` **verified**; it equals the prompt and `SOURCE_ASSIGNMENTS.csv`. The composite archive hash (`024487…65c9a3e`) was **not** checked because the composite was not supplied; a standalone/member match is the accepted standard for this item.
- Text read with `word-extractor` 1.0.4 `extract(path).getBody()` (the importer's legacy .doc call), 67,884 characters, SHA-256 `371aa91970bceb96c354a002a3ac7a5384ca597c1c2f404f51f13096b7324c8a`. Private scratch copy only; nothing from the source is committed.
- Table and media checks used a private LibreOffice docx/PDF render: 6 tables, 0 drawings/pictures, 0 images in the PDF; the .doc `Data` stream (6,760 bytes) held no picture records and the raw file has no JPEG/PNG/EMF/WMF signatures. Absence is recorded with those three checks, not as proof the author never intended an image.
- Nothing run: no tests, typechecks, importer, database, device or deployment.

## Locator method
Line numbers are 1-based over `getBody()` text split on `\n`. A range runs from the marker line to the last non-blank line before the next marker; the SHA-256 is over those lines joined with `\n`, UTF-8.

## Inventory
Opening block (unlabelled): lines 1-23, SHA-256 `3c10522d21d78355387d09884a4928244dc768f330ae5c826ff378d15d4d173d`. It holds `SECOND TERM E-LEARNING NOTE`, the subject/class line, `SCHEME OF WORK` (a 12-row tab-separated WEEK/TOPIC list, lines 7-19, not a Word table) and two REFERENCES (lines 22-23).

| Label | Second line (exact) | Lines | SHA-256 |
|---|---|---|---|
| WEEK ONE | TOPIC: FOOD COMMODITIES | 26-223 | `364cab63782211430375a9bb7bc524e31cffb050f98dbae6fce6cb893b254c70` |
| WEEK TWO | TOPIC: FOOD COMMODITIES | 226-381 | `e0d57a0841e7779973959e7514dbf841906399a073d4bf1b934dcedfc6d4f8e2` |
| WEEK THREE | TOPIC: FOOD COMMODITIES | 384-613 | `e3fc8b5b4a674e546281d2dacf8f8f5f340d273675e09eb2588a31507bfd5330` |
| WEEK FOUR | TOPIC: FOOD COMMODITIES | 616-763 | `6adadb605e85b92b405850e67bc1958bf903108220235f117be5f903a5f8c2f1` |
| WEEK FIVE | TOPIC: FLOUR COOKERY | 765-842 | `431204f54c36231a7ba9d86b1163df6738dd6a691a53ae54de9f9c884e23da4d` |
| WEEK SIX | TOPIC: COOKING OF FOODS | 845-927 | `fb7e873509e94a65eaba0d93790c2171ee68729f1bc5ee049e8dc8bed204e1de` |
| WEEK SEVEN | TOPIC: METHODS OF COOKING | 930-1053 | `75cb9e77384b8ec9600411fc758a8ada252f3798d264a4f20e6ce0b25711cf6c` |
| WEEK EIGHT | TOPIC: METHODS OF COOKING | 1056-1194 | `6be75e678b358c3684ba8982f989c814e6a543b2e930a67e0e3b464d63f47a93` |
| WEEK NINE | TOPIC: METHODS OF COOKING - DRY HEAT | 1197-1298 | `975255ca14ee602af9ee500d0acd4fdc3530f918f93eea233bb8c99622a02ccb` |
| WEEK TEN | TOPIC: STANDARD AND LOCAL MEASURING EQUIPMENT | 1301-1398 | `1cc8cb6acd059ffa9ee5a12e610ce7303b146dd2a33bc85410c44f24b3149786` |
| WEEK ELEVEN | PRACTICAL & REVISION | 1401-1402 | `82e377b7878d4797f7c4af7596d9b86c20695f4a4b69d9522ec3b3e407bac722` |
| WEEK TWELVE | EXAMINATION | 1405-1406 | `5d936f03520df3e053a872e5628c15873dcccf0404d69cc8bfa231c88c491e31` |

Week count: 12 labelled weeks (10 teaching weeks plus two marker weeks). Weeks 11 and 12 have two lines each and no instructional body.

## Scheme-to-body label differences (recorded, not corrected)
- Scheme row 5 `Food Commodities- Floor Cookery`; body `WEEK FIVE` / `TOPIC: FLOUR COOKERY`.
- Scheme row 6 `Principle of Cooking Methods`; body `WEEK SIX` / `TOPIC: COOKING OF FOODS`.
- Scheme row 9 `Methods of Cooking- Baking, Roasting and Grilling`; body topic adds `- DRY HEAT`.
- Scheme row 11 `Practical and Revision`; body `PRACTICAL & REVISION`.

## Tables (private render order; word-extractor flattens them to tabbed lines)
1. Week One, lines 57-66: Animal Source / Name.
2. Week Four, lines 681-695: NAMES(English) / Yoruba / Hausa / Igbo.
3. Week Four, lines 713-728: Natural / Artificial (flavourings).
4. Week Four, lines 731-741: Natural / Artificial (colourings).
5. Week Ten, lines 1310-1322: STANDARD TOOLS / LOCAL TOOLS.
6. Week Ten, lines 1337-1376: LOCAL / STANDARD (METRIC).
Student drawing prompts (lines 248 "Draw and label an egg", 743 "Draw a cereal and label the parts") are exercise text, not embedded drawings. No equipment illustration or embedded media group was found. No nutrition table exists; food-value passages are prose.

## Preservation notes
No practical assessment rubric, mark allocation or answer key appears (searched rubric, marks, score, practical). Weeks 1-10 each end with READING ASSIGNMENT, WEEKEND ASSIGNMENT and THEORY blocks plus EVALUATION blocks within the week.

## Findings for the importer's parser (findings only; no rules added)
- `split_before`: the twelve lines exactly matching `WEEK <ORDINAL>` (lines 26, 226, 384, 616, 765, 845, 930, 1056, 1197, 1301, 1401, 1405) need a split; the scheme header `WEEK<TAB>TOPIC` (line 7) must not split.
- `attach_stranded_label`: the line after each WEEK label (`TOPIC: ...` for weeks 1-10; `PRACTICAL & REVISION`, `EXAMINATION  ` with trailing spaces for weeks 11-12) and the bare `CONTENT` lines belong with the week they follow.
- `classify_marker`: weeks 11 and 12 are revision and examination markers with no body; weeks 1-10 must keep their instructional bodies and must not be classified as markers.
Whether the parser already handles these is not checked.

## Possibly unsafe or outdated statements (flagged for later correction, not corrected)
Locators are in the FACT items. Themes: milk heat-treatment and storage figures (lines 427, 441-443), fruit freezing/cold storage (582-583), poultry/offal/egg handling (92, 176-183, 261-267), meat preservation chemicals and smoke (134-135), deep-frying oil and burn/fire statements (1131-1146, 1099, 1166, 1224-1226), additives and colourings (708-741), and kitchen electric-shock, fire-fighting and accident questions with no teaching text (206, 363-364, 594). Later work needs authoritative primary sources and must keep original wording separate from corrected fact. No treatment or dose is prescribed; no classroom practical observation is recorded.

## Edits
- `QUEUE.json`: CC-INV-T2 set to IMPLEMENTED_TESTING_DEFERRED; 28 PENDING items appended (10 SOURCE_WEEK_INDEXING, 1 SOURCE_SECTION_INDEXING, 2 SOURCE_MARKER_DISPOSITION, 6 VISUAL_DISPOSITION, 4 SOURCE_PRESERVATION, 5 FACTUAL_DEPENDENCY), each depending on CC-INV-T2 and CC-SRC-T2; counts and `next_runnable` recomputed.
- No package, lesson, coverage entry or rule written. Catering Craft not merged into Food and Nutrition (header names Catering Craft Practice).
- `next_runnable` lists every PENDING item whose dependencies are met, including CC-INV-T3 and CC-TEST-PACKAGE. New items that edit the shared package file should be run one at a time.
