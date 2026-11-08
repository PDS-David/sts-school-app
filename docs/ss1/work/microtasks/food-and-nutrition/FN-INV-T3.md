# FN-INV-T3 — Food and Nutrition, 3rd Term week inventory

Status: **IMPLEMENTED_TESTING_DEFERRED** (inventory only; not approved, not verified). Testing deferred by owner. No lesson, coverage entry, rule, correction or asset was written; the package stays `PENDING`.

## Inputs
- Base: origin/master at the start of this item (A4, 8 November 2026); no other agent held the `food-and-nutrition` claim and no `origin/agent*` branch had touched the subject in the previous three hours.
- Prerequisite FN-SRC-T3 is `IMPLEMENTED_TESTING_DEFERRED`; the package already registers source `SS1-SRC-136db891415d` (header `OMEGA TERM E – NOTE FOR SS1 FOODS AND NUTRITION`, block 0) and holds no lessons.
- Original: `SSS 1/3rd Term SS1_/FOOD _ NUTRITION.docx`, extracted from the repository copy `docs/ss1/sources/SSS1-original.zip`. The archive SHA-256 was checked and equals `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`; the member SHA-256 is `13f16ea0b3b0456275e9d0841d4725a01fa459da50b12c6e1cfb957dd9415dee`, equal to the task and to `SOURCE_ASSIGNMENTS.csv`. (FN-SRC-T3 could only check the member; the composite archive is now also checked.)
- Method: `word/document.xml` read with lxml in a private scratch directory outside the repository. Nothing from the document is committed.

## Locator rule (reproducible)
Block = direct child of `w:body` in `word/document.xml`, 0-based: 287 children, blocks 0-285 are paragraphs, block 286 is `w:sectPr`; there is no table. Block text = concatenation of its `w:t` runs, UTF-8, no normalisation. Range hash = SHA-256 of the block texts first..last inclusive joined with `\n`, empty blocks included. Python: `T=[''.join(x.text or '' for x in b.iter('{W}t')) for b in body]; sha256('\n'.join(T[a:b+1]).encode())`. The last non-empty block is 279; blocks 280-285 are empty or whitespace-only paragraphs.

## Section inventory (nine labelled weeks, one combined closing marker)
| ID | Exact label | Label block | Blocks | Label sha256 | Range sha256 |
|---|---|---|---|---|---|
| opening | cover `OMEGA TERM E – NOTE FOR SS1 FOODS AND NUTRITION`, `Scheme of work`, `Weeks ... topics` and twelve scheme rows | 2 | 0-24 | `b3ead3269caf9f2e281130d7956be785e5d8e4af46af9e8deb940c035f496389` | `a92ddfac5b7ba203c4687c33483862986f63262549354c3009718fcc953a0bdf` |
| W01 | `WEEK 1:  ` (two trailing spaces) — `FOOD HYGIENE` | 25 | 25-63 | `db9663597ad9f735559d0ad53f51577cebc05c7a5b5cf8cd4cf010989d7064c1` | `469b7e933b3ba10277c81376fee946421e9ed4831725802c6286a6ee3800282a` |
| W02 | `WEEK 2: ` (one trailing space) — `METHODS OF COOKING` | 64 | 64-98 | `8a30551c32ee055e0588e4af87bb92441907271c30bb2674fca5cf6be168df2d` | `1e29724ec5072e1fd016410cd63ecb21fd7962076063d333ba205d8b99bb9cb3` |
| W03 | `WEEK 3:  COOKING METHODS CONTD.` (topic on the marker paragraph) | 99 | 99-126 | `941ca995c1ec445bb832d9fa6b57bfbfa514d6f15245baee01727d3420d239dc` | `dda11ffbc4e731b11e5edaba60d4323799f419ea808a9c82bb9cf73a74d8b722` |
| W04 | `WEEK 4: ` — `FOOD STUDY` / `CEREALS/ GRAINS` | 127 | 127-150 | `158d19e73fee4c85dacfc71092e2c843c984ebbdc733902e7149b475e8b51988` | `a0396bc0bfb95755074d4d2126c68d1d8c42bc3721428de2915039985904216c` |
| W05 | `WEEK 5: ` — `LEGUMES/ PULSES` | 151 | 151-186 | `a2a62efa0faa958c207f3388e42aeed6b9f492b85e593c8238c4d497f48ad2a3` | `ed78860ddc87a5e2deafa924c299837f31daa466bd3e712b82a57ec8d91027d5` |
| W06 | `WEEK 6:` — ` PRACTICAL ON COOKING METHODS: CEREALS` / `  AND LEGUMES.` (heading only) | 187 | 187-192 | `ea8185ea349241ba2bae6171c243e142665662fa446d963fbcbef51cb68a6c56` | `2f6da2f4f8efd6ec6bf8ca9d183592853444ee461f8eb268e7c1305d8d3609c3` |
| W07 | `WEEK 7; VEGETABLES.` (semicolon, topic on the marker paragraph) | 193 | 193-225 | `965b5282342b4fa78c725f733b6b5d34c9f871a8d9a1d92e71bceb9ef902b40d` | `7e3db01a1632b24fcbb879485208859bbdb00676b9278ac4b7a2a1dfe99e7755` |
| W08 | `WEEK 8:` — ` FRUITS.` | 226 | 226-273 | `b1145cc14714ec30cdc2fd5d7b9524b48651f932c7d2f3c8891b2c505da83707` | `0c43c02ec311d4462f0da94250433a32719b0b6deda4face2fdddd8fb4c466b5` |
| W09 | `WEEK 9:` — ` PRACTICALS ON FRUITS AND VEGETABLES.` (heading only) | 274 | 274-277 | `cc3f538c73c6ea5fe63470d216e1d860a9e45489d6c165abc2139b037b4a0713` | `c6fdf7c8a72776abfb7e9407d2727394d28e4cfffa7a183fe6f3d5840c3f2110` |
| end | `WEEK 10 & 11` / `REVISIONS AND EXAMS` | 278 | 278-285 | `1b46514956e765e50a8476ec11e7d4fa41da08c3c55eabaf046dfa4a1a33f986` | `eed08fce5dacd1c808c2f9ffe949fcc5d99c82eb49b585b397e2491a024241c7` |

Eight weeks have teaching text. Week 6 (block 187-189) and Week 9 (274-275) are a heading only, with no recipe, equipment, steps, assessment or rubric. There is no Week 10 body: 'WEEK 10 & 11' is followed only by 'REVISIONS AND EXAMS'.

## Scheme of work (blocks 2-22)
- Plain paragraphs, **not a table**; the numbers are typed text. Rows: 1 `Revision/ food hygiene` (4) with a food-borne-diseases, sanitation-law and regulatory-bodies line (5); 2 cooking of food (6) with heat transfer and moist heat methods (7-8); 3 dry heat method (9) with `(b) Frying` (10, no `(a)`); 4 cereals and grains (11) with processing and extraction rate (12-13); 5 legumes/ pulses (14) with a line containing a stray `\\` (15); 6 practicals on cooking methods, cereals and legumes (16); 7 vegetables (17); 8 fruits (18); 9 practicals on fruits and vegetables (19); 10 `Meat cookery` (20); 11 `Revision.` (21); 12 `Examination.` (22).
- The body has no meat-cookery week, so scheme row 10 has no body; the body's combined `WEEK 10 & 11` marker corresponds to scheme rows 11 and 12. Recorded as printed; no meat content may be written from outside knowledge.
- The scheme also promises things the bodies do not deliver: a revision of food hygiene and the functions of NAFDAC and SON (row 1; NAFDAC and SON are named only in the Week 1 assignment, block 60), advantages and disadvantages of the moist and dry methods and of frying (rows 2-3; they appear only in assignments 97 and 125-126), `Importance` of legumes (row 5) and `preparatory and serving of vegetables` (row 7).

## Parser findings (recorded only; no rule added)
- `split_before`: ten markers, each at the start of its own paragraph — `WEEK 1:  ` (25), `WEEK 2: ` (64), `WEEK 3:  COOKING METHODS CONTD.` (99), `WEEK 4: ` (127), `WEEK 5: ` (151), `WEEK 6:` (187), `WEEK 7; VEGETABLES.` (193), `WEEK 8:` (226), `WEEK 9:` (274), `WEEK 10 & 11` (278). The separator is a colon, a semicolon or nothing, so a rule must match `WEEK` plus digits and not depend on the colon. The scheme header `Weeks   topics` (block 3) starts with `Week`: a case-insensitive `^week` without the digits would match it, and the scheme's typed `1.`-`12.` prefixes must not be treated as headings. A bare `WEEK\s*\d+` split reads `WEEK 10 & 11` as an ordinary Week 10 with a one-line body.
- `attach_stranded_label`: the topic is in the next block for Weeks 1, 2, 4, 5, 8 and 9 (26, 65, 128, 152, 227, 275); the topic shares the marker paragraph for Weeks 3 and 7 (99, 193); the Week 6 topic is split over two blocks (188-189); `WEEK 10 & 11` is followed by `REVISIONS AND EXAMS` (279). `EVALUATION`/`ASSIGNMENT` labels vary (`EVALUATION:` at 58, 95, 124, 147; `EVALUATION;` at 183, 223, 267; `ASSIGNMENT:` and `ASSIGNMENT;`) and must not be treated as week markers.
- `classify_marker`: block 279 and scheme rows 21-22 are the only revision/examination text; block 279 has no teaching content and none sits under it, so a revision heading cannot erase teaching, but the Week 6 and Week 9 heading-only practicals must not be classed as revision either.
- Notation: the boiling point at block 88 is printed `(1000C)` where the final `0` is a superscript run; plain-text extraction therefore prints it as `1000C`. Blocks 29-31, 35-41, 44-45, 53-57, 68-74, 76-78, 80-83, 85-87, 90-92, 96, 104-106, 109-116, 118-123, 142-146, 161-163, 177, 213, 244-248, 259, 261, 263 and 265 use automatic list numbering that a plain extraction does not print; other lists are typed (`1.`, `2.`).

## Assessment lines
All unanswered in the source; no rubric, marking scheme or answer is printed. W1 evaluation 58-59, assignment 60; W2 evaluation 95-96, assignment 97; W3 evaluation 124, assignment 125 plus an orphan `2.` line (126); W4 evaluation 147-148, assignment 149 (draw and label a cereal); W5 evaluation 183, assignment 184 (draw and label a legume); W6 none; W7 evaluation 223, assignment 224; W8 evaluation 267-268, assignment 269; W9 none; closing marker none.

## Tables, drawings and media
None. The document has no `w:tbl`, `w:drawing`, `w:pict`, `w:object`, equation, footnote, hyperlink, text box or media part; one section. Weeks 4 and 5 only ask the pupil to draw and label a structure (149, 184) and the source supplies no figure. Because nothing exists to dispose of, **no visual-disposition item was added**, and no nutrition table, equipment illustration or practical rubric exists to preserve.

## Preservation and factual findings (each has an item)
- Cooking processes (heat transfer, boiling, stewing, steaming, baking, grilling, roasting, frying and deep-fat rules, milling, parboiling, legume and fruit preparation): `FN-PRES-T3-COOKING-PROCESSES`. The source prints no quantity, temperature, time or equipment for any process.
- Source wording defects kept distinct from any correction (`botulin`, `presence of presence`, `coking`, `Sautéing`/`SAUTEEING`, garbled blocks 122, 211, 250, 262, 264, the semicolon marker at 193, and others): `FN-PRES-T3-SOURCE-WORDING`.
- Claims needing authoritative primary sources before a lesson repeats them: food poisoning versus food infection and their examples (46-48, where salmonella appears under both), lead, mercury and cobalt (48), the hospital and symptoms lines (48-49), the sanitation-law statements (51-57), heat transfer (76-78), boiling and frying rules (88, 117-123), cereal and parboiling statements (131-140), the anti-nutritional-factor statement (157), vegetable and fruit nutrient and heat-effect claims (202-213, 220-222, 237-242, 252-257) and the osmosis and apple statements (262-264): `FN-FACT-T3-FOOD-HYGIENE-COOKING`. No dose or treatment is printed and none may be added.
- Content gaps are recorded inside the week items as open items, never invented here: W1 revision and NAFDAC/SON content; W2 braising undefined and no advantages or disadvantages; W3 advantages and disadvantages, orphan line 126; W4 drawing task without a figure; W5 importance and nutritive value, `TYPES OF BEANS` listing non-beans, dishes beans-only; W6 and W9 practical content unspecified; W7 preparation and serving; W8 garbled passages and an unanswered local-knowledge assignment.
- Safety: the only heat/fire content is the frying rules (117-123); the only chemical content is the contaminant list (48); there is no first-aid text. No practical observation was made and none is recorded.

## Edits made by this item
- `docs/ss1/work/microtasks/food-and-nutrition/QUEUE.json`: `FN-INV-T3` → `IMPLEMENTED_TESTING_DEFERRED` with the evidence above; 14 `PENDING` items appended (`FN-PRE-T3`, `FN-WK-T3-W01`…`W09`, `FN-MARK-T3-REVEXAM`, `FN-PRES-T3-COOKING-PROCESSES`, `FN-PRES-T3-SOURCE-WORDING`, `FN-FACT-T3-FOOD-HYGIENE-COOKING`), each depending on `FN-INV-T3` + `FN-SRC-T3` (the fact item also on weeks 1-5, 7 and 8); `counts`, `status_counts` and `next_runnable` recomputed from the items; one note appended; a trailing newline was added to the file. No existing ID other than `FN-INV-T3` changed.
- This file. No package, lesson, coverage, rule, correction, asset, shared schema/compiler, test or other-subject file touched. Food and Nutrition stays separate from Catering Craft.

## Checks run
Authoring checks only: SHA-256 of the archive and member; the label blocks and every range recomputed from the extraction; every quoted snippet in the new items asserted against its stated block; JSON parse of the queue; unique IDs; every `depends_on` resolving; counts, status counts and `next_runnable` recomputed from the items; every 64-hex string in this note and in the new items recomputed against the extraction. No test, typecheck, importer, database or device check was run.

## Not done / remaining
No tests (deferred by owner), no importer or plan run, no lesson or rule. This does not claim the subject or class complete.
