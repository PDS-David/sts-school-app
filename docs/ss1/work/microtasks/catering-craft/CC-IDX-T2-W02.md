# CC-IDX-T2-W02 — Catering Craft, 2nd Term WEEK TWO indexing

Status: **IMPLEMENTED_TESTING_DEFERRED** (indexing only; not approved, not verified). Testing deferred by owner.

## Inputs and checks performed
- Base: origin/master `7906714`. `AGENTS.md` is absent. CC-INV-T2 and CC-SRC-T2 are `IMPLEMENTED_TESTING_DEFERRED` on master. CC-IDX-T2-W02 was `PENDING`; CC-IDX-T2-W01 is already implemented.
- Source `SS1-SRC-f433169ca25c`, member `SSS 1/2nd Term SS1_/2ND TERM S1 CATERING CRAFT PRACTICES.doc`, 207,872 bytes, SHA-256 `fd8115ff99dd3c370b86b4b5a326fe647e49328bc83f2d041c73f29b1b84ad59` — **verified** against the task from the directly supplied member. The composite archive was not supplied and its hash was not checked.
- Text read with `word-extractor` 1.0.4 `extract(path).getBody()`: 67,884 characters, 1,407 lines, SHA-256 `371aa91970bceb96c354a002a3ac7a5384ca597c1c2f404f51f13096b7324c8a` — equals the task. Private scratch copy only; nothing from the source is committed.
- Locator re-check: lines 226-381 joined with `\n` hash to `e0d57a0841e7779973959e7514dbf841906399a073d4bf1b934dcedfc6d4f8e2`, equal to the locator. The importer's `WEEK_MARKER` and title/`TOPIC` logic, replicated in a scratch script (importer not run), finds the same 12 markers as CC-IDX-T2-W01 (lines 26, 226, 384, 616, 765, 845, 930, 1056, 1197, 1301, 1401, 1405); Week Two's parsed body (156 lines, 6,429 characters) has the same SHA-256 and parsed title `FOOD COMMODITIES`.
- Nothing run: no tests, typechecks, importer, database, device or deployment.

## Locator method
Line numbers are 1-based over `getBody()` text split on `\n`; a range runs from its first to its last non-blank line; SHA-256 over the UTF-8 lines joined with `\n`.

## Section index (lines 226-381)
| Section | Lines | SHA-256 | Notes |
|---|---|---|---|
| WEEK TWO label | 226-226 | `88b3326818ebf3577b66bea2ea4fa2f670e9335dbeaf07bbe3729906fa939df6` | marker line |
| TOPIC: FOOD COMMODITIES | 227-227 | `b1bdbf04bafb58735b2c4c4e5ee0838caacc0eed217faa00314eba3a3f1aab55` | topic line |
| CONTENT (Eggs and Fish) | 228-229 | `98faedca99b78e860bc577f5f09ec436519aeac507975e6f1e67a8196ef3f5f5` | week content list |
| EGG | 231-233 | `dfe81e84b5edf15b74c590a1fc40a87dcba381bed170608969f6553c90bbc04b` | definition and structure of the egg |
| FOOD VALUE OF EGG | 235-240 | `b9a42d1f49ebb8bdb5cb5d497f3dcfc8b2bdfedd14587cd15080ec492b939a59` | protein, minerals and vitamins, fat, water, no carbohydrate |
| GRADING OF HENS EGG | 241-245 | `6d26ed62eeb31bb94f61e1df4e9368a90694787d3b7eeecd6c6e395f92ddb0d8` | four weight bands |
| EVALUATION 1 | 247-249 | `fcea886ec35e85682a8d03b8ebb6a562950fbf6ad616667c3c18091ec4a73a21` | 2 questions; question 1 is the drawing prompt (248) |
| USES OF EGGS | 251-259 | `c7dc1c57bd438c7e0ed786be4ddee57d5553485b14f16569e8e7c86c026661e8` | seven uses (252-258) and a diet statement (259) |
| FACTORS TO CONSIDER WHEN CHOOSING EGGS | 261-268 | `f4e5a6da170c6847ed53f230e41064d12135b2ad3f9a10dfb12dcb842696dbbb` | seven numbered points |
| METHOD OF COOKING EGGS | 270-273 | `6325383b6defe870f6132cd454467952f5b88b8a58eeabd5b06593fc747bac30` | boiling, poaching, frying |
| Egg Dishes include | 275-281 | `7eab47b5c7bd7e85358cef49851129997e3ced547c163e8a6d3946126ed27156` | six dishes |
| EVALUATION 2 | 283-285 | `4f817913efe0949903110b611219b2e315c8d6f2b41e0678c54b704148540386` | 2 questions |
| Fish (definition) | 287-288 | `736c399cd02f0b4be0ffd236cee24ffbd770a29eff625214ef284d1545997384` | definition and digestibility |
| CLASSIFICATION OF FISH | 289-319 | `2123ff463db5ae4614988eb9fd7f761daa483aa12b25eeeffe2c4f099aa9adef` | fin fish (white/lean 293-299, oily/fat 300-306) and shell fish (molluscs 309-313, crustaceans 314-319) |
| EVALUATION 3 | 321-323 | `faeb9181b56113f978c3edadacb5df8abfe70fc530f2cdd21c40c67db61f4f81` | 2 questions |
| FOOD VALUE OF FISH | 325-330 | `9ccdfa1e0b2156ace67723060862d409e48f0d7f7db30b4f6b2c721753d21b8a` | protein, fat, vitamin, mineral salts, water |
| FISH CUTS | 332-338 | `c54044621ceef0c11aebe0ae26f95a821d333ab010fc482022840c9d02e6a62a` | five cuts |
| EVALUATION 4 | 340-342 | `83cfac835775a37f28d5a6a5cd9d6885bfc8242900776526a407ce50da276d9c` | 2 questions |
| FACTORS TO CONSIDER WHEN BUYING FISH | 344-350 | `c95387c5854cae55e6217c3530c936fe45547f54c19c8fb834f0934e96e3618f` | six points |
| METHODS OF COOKING FISH | 352-357 | `2ee7827611d29503895ba7a144abd3ea31a948a16422256c93f49605c3c584d5` | five methods |
| GENERAL EVALUATION | 359-364 | `00964b12fc6fc290f75a2a1b525bc4e88100471c4c15386425e0d96bbe94c436` | 5 questions; 362 game, 363 fire-fighting equipment, 364 kitchen accidents |
| READING ASSIGNMENT | 366-369 | `aab093853f4df894f815aade2134d3f33ecb93de5b825a13b2848e758926cca9` | two textbook references with page ranges (368-369) |
| WEEKEND ASSIGNMENT | 371-377 | `49411c9baad09c2efc84b2869530483514faa711622d0b93d8446d837e73976d` | 5 questions with options A-D (option D of question 4 wraps to 376); no answer key |
| THEORY | 379-381 | `c82e1c4b675104ca521e0679d1c4702bafad50bf714efec8fec49c868f58fa81` | 2 questions |

The 19 lines between sections (230, 234, 246, 250, 260, 269, 274, 282, 286, 320, 324, 331, 339, 343, 351, 358, 365, 370, 378) are blank or whitespace-only; line 230 holds two tabs only. Blank lines inside a section belong to that section's range. No teaching text is outside the sections above. Lines 228, 232, 308, 344, 352, 367, 375, 376 and 377 carry trailing whitespace and line 230 is whitespace-only; the locator hashes include it, so any later re-hash must not trim lines.

## Assessment and assignment blocks (indexed, not answered)
- EVALUATION after egg structure/food value (247-249, 2 questions), after egg uses and cooking (283-285, 2), after fish classification (321-323, 2) and after fish cuts (340-342, 2); GENERAL EVALUATION (359-364, 5); READING ASSIGNMENT (366-369, two textbook references with page ranges, not supplied and not copied); WEEKEND ASSIGNMENT (371-377, five objective-style questions with options A-D); THEORY (379-381, 2 questions).
- None has an answer, marking guide or mark allocation in the source. No answer is authored here. Preservation of these blocks is owned by `CC-PRES-T2-ASSESSMENT-BLOCKS`.
- Question 1 of the first evaluation (line 248, `Draw and label an egg.`) is a drawing prompt; the source holds no egg figure or labelled part list (CC-INV-T2 recorded no drawings or pictures in the member).
- General evaluation 362 (types of game) is taught only in Week One (lines 189-199). Lines 363 (fire-fighting equipment) and 364 (accident prevention in the kitchen) have no teaching text and are already recorded under `CC-FACT-T2-SAFETY-QUESTIONS-WITHOUT-TEACHING`. Weekend question 377 (offal) depends on Week One's meat appearance section (lines 83-92).
- Weekend question 4 (375-376) spells its fourth option `yoke`; recorded as written, not corrected.

## Objective candidates (from the source's own headings and linked questions; none is a coverage claim)
1. Structure of the egg and the eggs of other birds (231-233; evaluation 248).
2. Food value of eggs (235-240; evaluation 249, weekend 374).
3. Grading of hen's eggs by weight (241-245).
4. Uses of eggs in cookery (251-259; evaluation 284, general 360, theory 380).
5. Choosing and checking the freshness of eggs (261-268; evaluation 285).
6. Methods of cooking eggs and egg dishes (270-281).
7. Definition of fish and classification into fin fish and shell fish with examples (287-319; evaluation 322-323, general 361, weekend 372-373).
8. Food value of fish (325-330; evaluation 342).
9. Fish cuts (332-338; evaluation 341).
10. Buying fish and checking its freshness (344-350; theory 381).
11. Methods of cooking fish (352-357).

## Scheme mapping and coverage
- Scheme row 2 (line 9, `2.<TAB>Food Commodities- Eggs and Fish`, SHA-256 `6c1f28beea946ac3b69059e14c6cb721a59b236362ba57f38041a1ad1a304d52`) maps to this week by order and by the week's own CONTENT list (lines 228-229: Eggs and Fish). Candidates 1-11 fall under it; nothing in the week goes beyond the row's wording except the general evaluation questions noted above.
- Package change: **one** coverage entry, `COV-CC-T2-W02-SCHEME-2`, status **PARTIAL**, `lesson_ids: []`, three evidence items. It is PARTIAL because the source teaches the topic but no deliverable lesson exists, the questions have no answers and the factual passages are unverified. No lesson id is bound, because no parsed-row id has been confirmed by an importer run. PARTIAL keeps the delivery blocker in place; no coverage beyond indexing is claimed. The package stays `PENDING`.

## Findings (source wording retained; nothing corrected)
- Egg freshness tests (261-267) are already owned by `CC-FACT-T2-MEAT-POULTRY-FISH-EGG-HYGIENE`.
- Not covered by any existing FACT item, so one follow-up was appended: `CC-FACT-T2-FISH-EGG-CLASSIFICATION-FIGURES`. It covers the yolk and white water percentages (239), the egg weight bands whose boundaries repeat (242-245), the mollusc description of a single shell against examples that include clams, scallops and oysters (309-313), the white fish liver-oil statement and example placement (293-306), the dried-fish protein statement (326) and the dressed-fish wording (336).
- Typographical wording kept as written: `Dressed fish;` (336), `shinning` (349), `yoke` (376), `weighs more protein` (326).

## Edits
- `backend/src/db/ss1/subjects/catering-craft.json`: `coverage` goes from one entry to two. No other field changed.
- `QUEUE.json`: CC-IDX-T2-W02 → `IMPLEMENTED_TESTING_DEFERRED` with its evidence reference; `CC-FACT-T2-FISH-EGG-CLASSIFICATION-FIGURES` inserted after the Week One game item (PENDING, depends on CC-INV-T2, CC-SRC-T2, CC-IDX-T2-W02); counts, `status_counts` and `next_runnable` recomputed (7 implemented / 46 pending / 1 blocked; 54 items); one note appended. No other item changed.
- This file. No lesson, rule, correction, asset, answer, shared schema/compiler or other-subject file touched.

## Authoring checks (not tests)
JSON parse of both edited JSON files with byte-stable re-serialisation; SHA-256 calculation of the full body, week range, scheme lines and every section; replicated importer week split; unique ID and reference checks; kind and status counts recomputed from items; diff inspection.

## Remaining
Every other 2nd Term week, the 3rd Term source and the opening scheme/marker items still need their own indexing; the 3rd Term source has no coverage entry. Alias approval (`CATERING-CRAFT-ALIAS-APPROVAL`) stays an owner action. Next eligible per the queue: `CC-IDX-T2-W03` (2nd Term WEEK THREE, marker at line 384). Not executed here. This does not claim the subject or class complete.
