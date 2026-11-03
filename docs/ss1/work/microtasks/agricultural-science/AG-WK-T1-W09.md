# AG-WK-T1-W09 — Agricultural Science, 1st Term, Week 9 (objective index)

Status: **IMPLEMENTED_TESTING_DEFERRED** (objective index only; not approved, not verified). Testing deferred by owner. No tests, typechecks, importer, database or device checks were run.

## Inputs
- Branch `ss1/ag-wk-t1-w09-20261103`, cut from origin/master `68663e49755b003ad0010680f0f0465638fe7fa6` (3 November 2026; English PRs #301-#312 merged). Working tree clean at start.
- Prerequisite AG-INV-T1 is IMPLEMENTED_TESTING_DEFERRED; its ten-week inventory, block locators and locator rule were reused, not re-derived.
- Source: composite archive `SSS 1-20260507T072431Z-3-001.zip`, SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`, hashed locally. Member `SSS 1/1st Term SS1_/1ST TERM S1 AGRICULTURAL SCIENCE.docx`, SHA-256 `df1b516cdd8855d069a329d7aa627dbd0dcd3612dd10d254c53af9cb93a56526`, hashed before parsing. Both equal the queue's required_attachments. The archive and the XML extract were kept outside Git; nothing from the document is committed.

## Locator rule
Block = direct child of `w:body` in `word/document.xml`, 0-based; block text = concatenation of its `w:t` runs, UTF-8, no normalisation; range hash = SHA-256 of the block texts first..last inclusive joined with `\n`, empty blocks included. Re-verified this run: 933 blocks; label block 721 SHA-256 `e49a67c5f9ee04d211c522971f42cfc83eaf339ea51894512b072dbb1082f102`; blocks 721-865 range SHA-256 `888982547014538459e63665cd22a6f311c6acbeeb72bb511cf855ff495b4018`; scheme block 20 SHA-256 `1e4075c136a07535f22ac8963cc4d9f183203098cff2e00a4995e097e233eace`. All equal the queue locators.

## Objective
| Scheme entry | Locator | Status | Teaching blocks |
|---|---|---|---|
| 9. Environmental Factors Affecting Agricultural Production | scheme block 20; Week 9 label block 721; body blocks 721-843 (range `833dd27676e7de0cb43acff696f032a35ab5bed08277f1a81eb18cee0a5a1a74`) | PARTIAL — taught in source, no deliverable lesson (`COV-AG-T1-W09-SCHEME-9`) | climate 723-779; biotic 805-824; edaphic 826-842 |

- Climate: rainfall definition block 734, distribution and pattern 736-738, importance 742-748; temperature 750-756; sunlight 758-762; wind 764-770; relative humidity 772-779. Block 731 also lists pressure, but no block in Week 9 or anywhere else teaches pressure.
- Biotic: predators 807; parasites with endo- and ecto-types 809-813; soil organisms 814-815; pests 816; diseases 820-821; mutualism 822-823; weeds 824.
- Edaphic: soil pH 827-830; texture 832-836; structure 838-842.
- PARTIAL because the package contains no lesson and no parsed row for the week, and the importer has not been run. The source teaching is not yet deliverable.

## Assessment scope (blocks 721-865)
| Item group | Blocks | Disposition |
|---|---|---|
| EVALUATION (rainfall) | 739-741 | Answerable from 734-738 |
| GENERAL EVALUATION | 781-786 | Q1 climate (729), Q2 rainfall (742-748), Q3 temperature (750) taught; Q4 farm versus farmstead (785) and Q5 farmstead layout (786) **not taught anywhere** |
| READING | 788-789 | Correct chapter: environmental factors, pages 212-216 |
| WK 9A | 790-801 | Q1 (791) and Q2 (792) taught by 731 and 805-824; Q5 (795-796) taught by 814 and 826-842; Q3 forestry department (793) and Q4 taungya (794) **not taught**; Theory 1 forest and eight uses (797-799) and Theory 2 forest regulation / selective exploration / afforestation / reforestation (800-801) **not taught** |
| EVALUATION (biotic) | 817-819 | Answerable from 807-816 |
| GENERAL EVALUATION/REVISION (edaphic) | 844-849 | Answerable from 827-842; five soil organisms are named at 814 |
| READING | 850-851 | **Misdirected**: Pasture and forage crops, pages 179-182, not this week |
| WK 9B | 852-863 | Q1 (853) repeats 795-796 and is taught; Q5 structure (858) taught by 838; Q6 endoparasites (859-860) taught by 809-813 (earthworm is not named in the source); Theory 1 (862) and Theory 2 (863) taught by 805-824 and 826-842; Q2 compost (854), Q3 primary forest product (855) and Q4 mulching (857) **not taught anywhere** |

Coverage rows added: `COV-AG-T1-W09-SCHEME-9` (PARTIAL), `COV-AG-T1-W09-FARMSTEAD` (UNRESOLVED, blocks 785-786), `COV-AG-T1-W09-FORESTRY` (UNRESOLVED, blocks 793-801 and 855).

## Observed defects (retained uncorrected)
1. Block 723 runs `CROPAND` together in the heading.
2. Block 731 lists pressure among the factors of climate; no teaching block exists for it.
3. Block 750 prints `coaster` for coastal.
4. Block 779 prints `forms the re-growth of disease pathogen`.
5. Blocks 785-786 ask about farmstead with no teaching block in the document.
6. Blocks 793-801 and 855 assess forestry that the week does not teach.
7. Options run together at block 796 (`Soil pHB. Soil texture`), block 853 (`C. soil organic`) and block 855 (`PulpB. timber`).
8. Block 801 prints `Selective exploration`; the standard term is selective exploitation.
9. Block 851 sets reading in Pasture and forage crops, pages 179-182, not this week.
10. Block 854 asks for compost and block 857 for mulching, with no teaching block for either.
11. Block 853 duplicates block 795-796 almost verbatim.
12. The week is split by two weekend assignments and two separate general evaluations; no single heading covers both halves.

## Cross-week and term-level placements
- Farmstead: the string occurs only at blocks 785 and 786 among all 933 blocks; Week 7 uses of land (554-565, range `a0404cdc0a76bc8d42ea7de094e4b2aa1d7651cebebe6af7f6fac66b70e19346`) does not cover it.
- Forestry: the only teaching mention is the one-sentence Week 7 definition at block 560 (SHA-256 `57fda2632ce1f81206132ce90dbbe2772e5a8c7d4dd2c223698e61fb74482958`). `taungya` occurs only at 794; `afforestation`, `reforestation` and `forest regulation` only at 801; `selective` only at 801.
- Compost and mulching: no teaching block in the 1st Term document; `compost` occurs only at 854 and `mulch` only at 414 (a Week 4 pest-control question) and 857.
- These are recorded as placements, not silently re-labelled as Week 9 objectives.

## Appended tasks
- `AG-LES-T1-W09-FARMSTEAD` — LESSON, PENDING; depends on AG-SRC-T1, AG-WK-T1-W09 and AG-FACT-T1-W09-SCOPE.
- `AG-LES-T1-W09-FORESTRY` — LESSON, PENDING; same dependencies.
- `AG-FACT-T1-W09-SCOPE` — FACTUAL_DEPENDENCY, BLOCKED; depends on AG-SRC-T1 and AG-WK-T1-W09.
- Neither lesson is runnable until the expert decision is recorded; no lesson text, answer key or correction is authored here.

## Edits
- `agricultural-science.json`: three coverage rows appended; two CONTENT open items appended (`AGRICULTURAL-SCIENCE-T1-W09-COVERAGE`, `AGRICULTURAL-SCIENCE-T1-W09-ASSESSMENT-SCOPE`), both blocking. Sources, source rules, lessons, delivery corrections and assets untouched; `package_status` remains PENDING.
- `QUEUE.json`: AG-WK-T1-W09 set to IMPLEMENTED_TESTING_DEFERRED with its implementation reference; three items appended; counts and status_counts recomputed (41 items: 6 implemented, 33 pending, 2 blocked); AG-WK-T1-W09 removed from `next_runnable`, which now begins AG-INV-T3; one note appended. No existing ID otherwise changed.
- This file.

## Checks run (authoring only)
Archive and member SHA-256 verified; 933 blocks parsed; Week 9 range and label hashes equal the queue; scheme-block hash computed; term-wide string searches for farmstead, compost, mulch, taungya, afforestation, reforestation, forest regulation and selective; JSON parse and byte-exact round-trip through the project serialisation with CRLF for both edited files; strict key sets against the package schema; unique coverage, open-item and queue IDs; every PARTIAL/UNRESOLVED coverage row named by a blocking open item (3/3); every new dependency resolves; every `next_runnable` entry PENDING with implemented dependencies; lesson and coverage references resolve; `git diff` reviewed. Nothing was run against the importer, compiler, database or tests.

## Remaining
Week 9 has no deliverable lesson: the source teaching needs the normal import/parse step, and the farmstead and forestry supplements await `AG-FACT-T1-W09-SCOPE`. Next eligible Agricultural Science items are AG-INV-T3, AG-TEST-PACKAGE and AG-PRE-T1. This does not claim the week, subject or class complete.
