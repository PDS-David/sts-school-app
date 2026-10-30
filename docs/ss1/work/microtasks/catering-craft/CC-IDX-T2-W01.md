# CC-IDX-T2-W01 — Catering Craft, 2nd Term WEEK ONE indexing

Status: **IMPLEMENTED_TESTING_DEFERRED** (indexing only; not approved, not verified). Testing deferred by owner.

## Inputs and checks performed
- Base: origin/master `6862d45`. Open PRs at start touched Yoruba and Bookkeeping only; no `ss1/cc-idx-t2-w01*` branch existed. `AGENTS.md` is absent. CC-INV-T2 and CC-SRC-T2 are `IMPLEMENTED_TESTING_DEFERRED` on master (evidence: `CC-INV-T2.md`). CC-IDX-T2-W01 was `PENDING`.
- Source `SS1-SRC-f433169ca25c`, member `SSS 1/2nd Term SS1_/2ND TERM S1 CATERING CRAFT PRACTICES.doc`, 207,872 bytes, SHA-256 `fd8115ff99dd3c370b86b4b5a326fe647e49328bc83f2d041c73f29b1b84ad59` — **verified** against the task. Read from the per-term archive `2nd_Term_SS1_-20230730T171417Z-001.zip` (member path inside it: `2nd Term SS1 /2ND TERM S1 CATERING CRAFT PRACTICES.doc`). The composite archive was not supplied and its hash was not checked.
- Text read with `word-extractor` 1.0.4 `extract(path).getBody()`: 67,884 characters, 1,407 lines, SHA-256 `371aa91970bceb96c354a002a3ac7a5384ca597c1c2f404f51f13096b7324c8a` — equals the task. Private scratch copy only; nothing from the source is committed.
- Locator re-check: lines 26–223 joined with `\n` hash to `364cab63782211430375a9bb7bc524e31cffb050f98dbae6fce6cb893b254c70`, equal to the locator. The importer's `WEEK_MARKER` and title/`TOPIC` logic, replicated in a scratch script (importer not run), finds 12 markers at lines 26, 226, 384, 616, 765, 845, 930, 1056, 1197, 1301, 1401, 1405; Week One's parsed body (198 lines, 10,083 characters) has the same SHA-256 and parsed title `FOOD COMMODITIES`. The scheme header `WEEK<TAB>TOPIC` (line 7) is not matched.
- Nothing run: no tests, typechecks, importer, database, device or deployment.

## Locator method
Line numbers are 1-based over `getBody()` text split on `\n`; a range runs from its first to its last non-blank line; SHA-256 over the UTF-8 lines joined with `\n`.

## Section index (lines 26–223)
| Section | Lines | SHA-256 | Notes |
|---|---|---|---|
| WEEK ONE label | 26-26 | `635789fb4e63974d59acfd3667c0b0fb9a4b935d51684c017ac9879e598deb6b` | marker line |
| TOPIC: FOOD COMMODITIES | 27-27 | `b1bdbf04bafb58735b2c4c4e5ee0838caacc0eed217faa00314eba3a3f1aab55` | topic line |
| CONTENT (Meat, Poultry) | 28-30 | `be518a7be47be94bc523f8df8e858e0f864968d0845bfc9c53d96c5133a0951d` | week content list |
| FOOD COMMODITIES | 32-42 | `a76cab8a415e2dd79bfe03533ca2aa7b0d05bfbbdc2d43588860e850bc56b23c` | definition and nine-item list of commodities |
| MEAT | 44-45 | `7431b4cba95b53ea2b2bfb68c38ab432638e8f2df227d98f973b0712925fd43f` | definition |
| FOOD VALUE OF MEAT | 47-52 | `6cb9a5d0692ef5e0c28294d0045c93db61a569d4407f131a1b9d015c836e222a` | protein, mineral elements, vitamins, fat, water |
| TYPES OF MEAT | 54-66 | `530c8003b180b4edbc2772cb745a66d523cb8977e2b28fc3d037349b0bc99df6` | intro line 55; 10-row Animal Source / Name table lines 57-66 |
| EVALUATION 1 | 68-70 | `e64819cc35c8d52b34036bed339af237d719d798758c5a901900d6b1ec0ae852` | 2 questions |
| CUTS OF MEAT | 72-81 | `23a042e24bc6e3564a0b5671aced06bca789c727261d9660e58f4a91d88ca05c` | list of cuts |
| APPEARANCE OF MEAT | 83-92 | `fa8cef336c415e5e786612ea27757de4330bcdcc5ccd87bbf17fb9ff6b6b3ea8` | white meat, red meat, lean meat, extractives, offal |
| FACTORS TO BE CONSIDERED WHEN PURCHASE OF MEAT | 94-100 | `8dff544360348886aa613954160a3ce89f9ca09a8e1836c6b010c5722602545c` | colour, odour, tenderness, lean, cut surface, young animals |
| Factors affecting the tenderness/toughness of Meat | 102-114 | `b0f77b4239fd27ca25f93dbd94f71e5821a56acef269195a06293d456d658b6e` | age and activity (103-106); tenderizing methods (108-114) |
| METHODS OF COOKING MEAT | 116-122 | `10ce343e348e37b8d0c848672b14ce0e53b2078d22f9c0c9667f3ef5ade2ff95` | boiling, frying, stewing, roasting, grilling |
| Effects of Heat (Cooking) on Meat | 124-128 | `52ce9d4b0766f461300865630eded1b43e560dc997971b7992c46dd8fc0ae899` | four numbered effects |
| PRESERVATION OF MEAT | 130-136 | `9af20414f481d16719c9627a5e921b839ef42cbda3b3eb2079a2458b797109be` | salting, chilling, freezing, canning, smoking, drying |
| EVALUATION 2 | 138-140 | `96c6cfd42109df12044aded09d27bb4572e485cbfb4d6e72bbcc11a9962a9af3` | 2 questions |
| POULTRY | 142-145 | `19d3c949a424941b59cd89c13aa43a3691efbbedc03b69d4665813f2282b460f` | definition; white and dark meat |
| TYPES OF CHICKEN | 147-152 | `9316de8d32220a863a04b67cea4de39f9374bcd69f9cb38845a68982b65ccbb0` | spring chicken, broiler, cockerels and old layers, old hen |
| FOOD VALUES OF POULTRY | 154-159 | `d344874e32a42ad11afa8399b4dcf8e98da9cebdbbfd0af76d1ee2c3e21f9760` | proteins, fat, mineral salts, vitamins, water |
| EVALUATION 3 | 161-163 | `84a0d0fbd333327261feb10aec7f581b75e93e181584abf8814b2077b533cdca` | 2 questions |
| FACTORS TO CONSIDER WHEN PURCHASE OF POULTRY | 165-173 | `0e3de12ad71b7a49685f6dc91e52322591a8f211e2e295734bb3332b7f7ac15e` | eight numbered points |
| PREPARATION OF POULTRY | 175-178 | `5186f2bd7d17369f45f2686984638e87ecf070acb9515520095ea40bfec76bb9` | rigor mortis and hanging (176); removing raw flavour (178) |
| STORAGE OF POULTRY | 180-183 | `2cbf93b7700132436d2c341692ddf792bfe5660c179c12056f082718a6bfbeaa` | live; dressed and frozen |
| EVALUATION 4 | 185-187 | `b38d3694f695fafdca7bf8134f17d58be90bdbfdf3b20802f7a65e8011a58bad` | 2 questions |
| GAME | 189-199 | `80a5b54781b6faba67b6dd87cdccdaabe06600a9363c32233ab65907257e0f77` | definition and three types (189-194); food value (196); storage/hanging (198-199) |
| GENERAL EVALUATION | 201-206 | `fdd0fd188ed49158ba3cf8c016b3d23f3192d417d94c20756264226ba07337b8` | 5 questions; question 5 is on electric shock (206) |
| READING ASSIGNMENT | 208-210 | `63b904166b8c013b20be70ce7c7086e51ef5e6148861af3d9b367c12d0ccf95d` | two textbook references with page ranges (209-210) |
| WEEKEND ASSIGNMENT | 212-219 | `6ea74b84ee61b0acbd2c3394cf305875d49786230480c11430a7ee6f7c587dfe` | 5 objective-style questions with options A-D; no answer key |
| THEORY | 221-223 | `a61dbb2ad412e05ea00a7dc9e96c6f3ce7a93aa0b416c2b4c40c67fef63bef26` | 2 questions |

The 26 lines between sections (31, 43, 46, 53, 67, 71, 82, 93, 101, 115, 123, 129, 137, 141, 146, 153, 160, 164, 174, 179, 184, 188, 200, 207, 211, 220) are blank or whitespace-only; line 137 holds spaces only. Blank lines inside a section (for example 85, 87, 89, 91, 177, 195, 197) belong to that section's range. No teaching text is outside the sections above.

## Assessment and assignment blocks (indexed, not answered)
- EVALUATION after MEAT FOOD VALUE/TYPES (68–70, 2 questions), after PRESERVATION OF MEAT (138–140, 2), after POULTRY food values (161–163, 2), after POULTRY storage (185–187, 2); GENERAL EVALUATION (201–206, 5); READING ASSIGNMENT (208–210, two textbook references with page ranges); WEEKEND ASSIGNMENT (212–219, five objective-style questions with options A–D); THEORY (221–223, 2 questions).
- None has an answer, marking guide or mark allocation in the source. No answer is authored here. Preservation of these blocks is owned by `CC-PRES-T2-ASSESSMENT-BLOCKS`.
- General evaluation question 5 (line 206, electric shock in the kitchen) has no teaching text in the week; it is already recorded under `CC-FACT-T2-SAFETY-QUESTIONS-WITHOUT-TEACHING`.

## Objective candidates (from the source's own headings and linked questions; none is a coverage claim)
1. Define food commodities and list them (32–42; questions 69, 202).
2. Nutritive value of meat (47–52; question 70).
3. Types of meat and the animal-source names (54–66).
4. Cuts of meat (72–81).
5. Meat terms: white, red and lean meat, extractives, offal (83–92; question 203).
6. Factors when purchasing meat (94–100; theory 222).
7. Tenderness and toughness, and tenderizing tough meat (102–114; question 139).
8. Methods of cooking meat and the effects of heat (116–128).
9. Preservation of meat (130–136; question 140).
10. Poultry: definition, white and dark meat, types of chicken (142–152; questions 162–163, theory 223).
11. Food values of poultry (154–159).
12. Purchasing, preparing and storing poultry (165–183; questions 186–187, general 204).
13. Game: classification, food value, storage (189–199; general 205).

## Scheme mapping and coverage
- Scheme row 1 (line 8, `1.<TAB>Food Commodities- Meat and poultry`) maps to this week by order and by the week's own CONTENT list (lines 28–30: Meat, Poultry). Candidates 1–12 fall under it; the GAME section (candidate 13) and the general commodities list (candidate 1, lines 37–42 name fish, vegetables, fruits, eggs, milk and additives that the scheme assigns to Weeks 2–4) go beyond the row's wording and are retained and indexed, not dropped.
- Package change: **one** coverage entry, `COV-CC-T2-W01-SCHEME-1`, status **PARTIAL**, `lesson_ids: []`, three evidence items. It is PARTIAL because the source teaches the topic but no deliverable lesson exists, the questions have no answers and the factual passages are unverified. No lesson id is bound, because no parsed-row id has been confirmed by an importer run. PARTIAL keeps the delivery blocker in place; no coverage beyond indexing is claimed. The package stays `PENDING`.

## Table
Lines 57–66 hold the 10-row Animal Source / Name table (flattened by word-extractor to tab-separated lines, header at 57). Its visual disposition remains with `CC-VIS-T2-W01-TBL1`; the lines are preserved unchanged.

## Findings (source wording retained; nothing corrected)
- Line 92 reads `sweat bread` and line 176 reads `Hang the bird the bird`; line 134 describes canning with chemical preservatives and line 135 smoking with phenols and aldehyde as natural preservatives; line 176 gives hanging the bird for at least one hour; lines 180–183 describe live and dressed-and-frozen storage. These are already owned by `CC-FACT-T2-MEAT-POULTRY-FISH-EGG-HYGIENE`.
- The game section (189–199) is not covered by any existing FACT item, so one follow-up was appended: `CC-FACT-T2-GAME-CLASSIFICATION-STORAGE` (lines 189–199 and table row 63).
- Weekend assignment questions 213–219 carry no answer key; question 5 (line 219) lists options that include a fish and a turkey; no answer is supplied.
- 24 lines in the week carry trailing whitespace (for example lines 90, 106, 196); the locator hashes include it, so any later re-hash must not trim lines.

## Edits
- `backend/src/db/ss1/subjects/catering-craft.json`: `coverage` goes from `[]` to one PARTIAL entry. No other field changed.
- `QUEUE.json`: CC-IDX-T2-W01 → `IMPLEMENTED_TESTING_DEFERRED` with its evidence reference; `CC-FACT-T2-GAME-CLASSIFICATION-STORAGE` appended (PENDING, depends on CC-INV-T2, CC-SRC-T2, CC-IDX-T2-W01); counts, `status_counts` and `next_runnable` recomputed; one note appended. No other item changed.
- This file. No lesson, rule, correction, asset, answer, shared schema/compiler or other-subject file touched.

## Authoring checks (not tests)
JSON parse of both edited JSON files; SHA-256 calculation of the full body, week range and every section; unique ID and reference checks; diff inspection.

## Remaining
Every other 2nd Term week, the 3rd Term source and the opening scheme/marker items still need their own indexing; the 3rd Term source has no coverage entry. Alias approval (`CATERING-CRAFT-ALIAS-APPROVAL`) stays an owner action. Next eligible per the queue: `CC-IDX-T2-W02` (2nd Term WEEK TWO, lines 226–381), after the package-level `CC-TEST-PACKAGE` that the queue lists first and that stays deferred. Not executed here. This does not claim the subject or class complete.
