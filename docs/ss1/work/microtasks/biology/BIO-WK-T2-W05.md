# BIO-WK-T2-W05 — Biology, 2nd Term, Week 5 (objective index)

Status: **IMPLEMENTED_TESTING_DEFERRED**. Objective indexing and evaluation/assignment-scope review only; not approved, not verified, and not a complete or delivered week. Testing, typechecks, importer/compiler, database and device checks remain deferred by the owner.

## Source identity and conversion

- Source: `SS1-SRC-eb6e9665f42c`; archive member `SSS 1/2nd Term SS1_/2ND TERM S1 BIOLOGY.doc`; SHA-256 `41cfcb1848a8e67fe486674bf4dc94dcb13acd3e4d6477428e659f97a08f4b44`. The assigned member digest was verified against the composite archive and assignment manifest.
- The legacy DOC was converted to a private DOCX copy using LibreOffice 25.2.3.2. The inventory records LibreOffice 24.2.7.2; the Week 5 label and range hashes reproduced the inventory/queue values exactly. No original or converted file was committed.
- The converted `word/document.xml` has 963 direct `w:body` children: blocks 0-961 plus section properties at 962. Block = direct child of `w:body`, zero-based; block text = concatenated `w:t` runs (UTF-8, no normalisation); range hash = SHA-256 of block texts first..last inclusive joined with newline.
- Week 5 label block 326, hash `ef40f02a7290eb069023a5ba59fb18ef5456d93d8bbf52dcaf42c6ce07a7b358`. Body blocks 326-480 have the queue's exact range hash `b4b3a27765e6fbac3169fe274538cbdb262462295e886eed280471c310232d55`.
- Topic block 327: `TOPIC: NUTRITION IN ANIMALS`.

## Scheme objectives and teaching evidence

| Scheme objective | Locator | Status | Finding |
|---|---|---|---|
| Animal nutrition and food substances | Blocks 333-437 (range `61154ac8602d04728768f55f205d47de42386c0be9ee1bcea8585556066e90d7`) | PARTIAL | Describes feeding groups, food-substance classes, balanced diet and stated functions. The package has no lesson. |
| Digestive enzymes | Blocks 438-456 (range `6b467e2ecd04e2cdfa2337dd3b56c699c1af6b30bc76458c81309b190e8d7989`) | PARTIAL | Introduces enzyme characteristics and classes/functions. The package has no lesson. |

| Source content | Exact blocks | Evidence |
|---|---|---|
| Food-substance classes | 339-415 (range `bc1353392366ea02651dd59936023731c6881ee7eaf0ca999beffffcb2501f57`) | Describes seven food-substance groups and their stated roles/sources. A source/function/deficiency table appears at block 399. Health/deficiency claims are recorded by locator only and held for authoritative review; they are not repeated or endorsed here. |
| Balanced diet | 419-437 (range `bacdad5a813d400a9fb0a5cfe19506c147d2d599173bd8dae1a72d8d06821f73`) | Defines balanced diet and lists its functions. The health statement at block 426 is held for authoritative review and is not reproduced as medical advice. |
| Digestive enzymes | 438-456 (range `6b467e2ecd04e2cdfa2337dd3b56c699c1af6b30bc76458c81309b190e8d7989`) | Lists source-stated enzyme characteristics, classes and functions. No independent correction is made in this index. |

## Evaluation, revision and assignment review

| Source item | Locator | Source support and disposition |
|---|---|---|
| Evaluation: importance of carbohydrate, protein and lipids | blocks 415-417 | Related content appears in the food-substance sections; no answer key is supplied. |
| Evaluation: importance of protein, carbohydrate and vitamins; functions of balanced diet | blocks 434-436 | Related content appears in the food-substance and balanced-diet sections. |
| General evaluation: food sources and functions; mineral functions/deficiencies; water-soluble vitamin functions/deficiencies | blocks 458-463 (range `f65514009bb70ea1360b116f3819d8ddc84077481c0214283749e8a7d02a0bea`) | Food-source and function prompts are related to the teaching. Mineral/vitamin health statements are held for authoritative review; they are not reproduced as medical advice. |
| Reading assignment | blocks 465-466 | College Biology, chapter 6, pages 95-103. The cited book itself is not part of this source archive. |
| Weekend assignment | blocks 468-475 (range `48a26fb77db7e6644eee226fa797084837e9f6134f21e3d41a0bb087fe9209ea`) | Questions on vitamin categories, roughage and relative energy sources are related to the source teaching. The deficiency question at block 474 is held for authoritative review. |
| Theory: food-test table | block 477 | Requests a table of food, test, observation and inference. No food-test teaching, test method or approved practical reference appears in this week's body. No test materials, reagent names or procedures are inferred or added. |
| Theory: mineral functions and deficiency symptoms | block 478 | Requests a mineral-elements table. The source has no answer key, and the related health statements require authoritative review. |

No answer key or marking guide accompanies the evaluation, weekend assignment or theory items. The food-test theory request is UNRESOLVED because the source provides no corresponding teaching or approved practical resource.

## Bounded follow-up tasks and delivery gates

- `BIO-FACT-T2-W05-HEALTH-CLAIMS`: verify the source health/deficiency claims at blocks 399, 426, 461-462 and 474 against authoritative references. Any corrected supplemental wording must remain distinct from the original source and must not be presented as medical advice.
- `BIO-FACT-T2-W05-FOOD-TESTS-SAFETY`: BLOCKED pending a teacher-approved, safety-reviewed source for the conceptual food-test table requested at block 477. This index does not provide practical methods or materials.
- `BIO-LES-T2-W05-ANIMAL-NUTRITION`: author an approved supplemental lesson for animal nutrition, food-substance groups, balanced diet and digestive enzymes, using the fact-reviewed claims only.

## Material census

- The Week 5 range contains one Word table at block 399, no drawing, no embedded object or text box, and 23 tab elements.
- No food-test section or practical procedure appears in the Week 5 body. The food-test request occurs only in theory block 477.
- No health/deficiency claim, practical method, material, reagent name or answer key was added to this index.
- No source extract or converted DOCX was committed.

## Package and queue changes

- `biology.json`: added `COV-BIO-T2-W05-ANIMAL-NUTRITION` and `COV-BIO-T2-W05-DIGESTIVE-ENZYMES` (PARTIAL), `COV-BIO-T2-W05-FOOD-TESTS` and `COV-BIO-T2-W05-ASSESSMENT` (UNRESOLVED), plus blocking open items for missing lessons, health-claim review, food-test resource and the answer key. Existing source registrations, rules, lessons, corrections and assets were not changed; package status remains PENDING.
- `QUEUE.json`: marked `BIO-WK-T2-W05` IMPLEMENTED_TESTING_DEFERRED; appended a health-claim fact task, a blocked food-test resource task and an animal-nutrition lesson task; recomputed counts and `next_runnable`. Totals are 25 IMPLEMENTED_TESTING_DEFERRED, 77 PENDING and 6 BLOCKED.
- No answer key, source correction, source rule or asset was authored.

## Authoring checks and verification boundary

Checks performed: source member digest; private DOC conversion; body-child count; Week 5 label and range hashes; hashes for food-substance, balanced-diet, enzyme, evaluation, reading, weekend assignment and theory ranges; question-by-question scope comparison; structural table/drawing/tab counts; JSON parse and unique coverage/open-item/queue IDs; status counts and runnable dependencies recalculated.

No test suite, TypeScript check, importer/compiler run, database rehearsal, device check or production import was run, as required by the owner's testing deferral. No claim of approval, certification, delivery verification or week completeness is made.
