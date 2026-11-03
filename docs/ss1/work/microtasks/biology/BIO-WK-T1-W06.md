# BIO-WK-T1-W06 — Biology, 1st Term, Week 6 (objective index)

Status: **IMPLEMENTED_TESTING_DEFERRED** (objective index only; not approved, not verified). Testing deferred by owner. No tests, typechecks, importer, database or device checks were run.

## Inputs
- Branch `ss1/bio-wk-t1-w06-20261103`, cut from origin/master `68663e49755b003ad0010680f0f0465638fe7fa6` (3 November 2026; English PRs #301-#312 merged). Working tree clean at start.
- Prerequisite BIO-INV-T1 is IMPLEMENTED_TESTING_DEFERRED; its week inventory, block locators and locator rule were reused, not re-derived.
- Source: composite archive `SSS 1-20260507T072431Z-3-001.zip`, SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`, hashed locally. Member `SSS 1/1st Term SS1_/BIOLOGY 1 alfa term - Copy.docx`, SHA-256 `936fb6374ca206d17275d6e9be6ff0947219af221b144aafc162bb1f78087ce8`, hashed before parsing; both equal the queue's required_attachments. The archive and the XML extract were kept outside Git; nothing from the document is committed.

## Locator rule
Block = direct child of `w:body` in `word/document.xml`, 0-based; block text = concatenation of its `w:t` runs, UTF-8, no normalisation, with text-box text counted in the block that holds the text box; range hash = SHA-256 of the block texts first..last inclusive joined with `\n`, empty blocks included. Re-verified this run: 1106 blocks (block 1105 is `w:sectPr`); label block 781 SHA-256 `03792d537a25eed5326e922c8a90f71cfb1c9739ed47959db18710e2aa49a653`; blocks 781-834 range SHA-256 `e6df637e58ce695ff642859639fbd24c3206509327af1c1612c71ddcddec77d6`; scheme block 7 SHA-256 `c2c9d6de15c9e85f2424f85a328436ae6ff161dbde8bde99962005840f02280e`. All equal the queue locators.

## Objective
| Scheme entry | Locator | Status | Teaching blocks |
|---|---|---|---|
| 6. Nutrient cycling in Nature | scheme block 7; Week 6 label block 781; body blocks 781-825 (range `3628d37fa086d39c4c9c1c53a1a57fa732421e4004120ad02114f65ba3d79975`) | PARTIAL — carbon and water cycles taught, no deliverable lesson (`COV-BIO-T1-W06-SCHEME-6`) | carbon 784-795; water 804-819 |

- Definition: block 783 defines a nutrient cycle as the circulation of nutrients such as carbon, sulphur and water.
- Carbon cycle: definition 785; photosynthesis 786, respiration 787, putrefaction 788, combustion 789, sea-atmosphere exchange 790; importance 792-795. Image `media/image6.jpeg` at block 795.
- Water cycle: definition 805; plant absorption, transpiration, animal use, run-off, percolation, underground water and ocean return; importance to plants 806-812 and to animals 813-819. Image `media/image7.jpeg` at block 821.
- Sulphur: named at block 783 but no cycle is taught. Coverage row `COV-BIO-T1-W06-SULPHUR` is UNRESOLVED.
- Nitrogen: not named by the scheme line or by any Week 6 block. It is not asserted as an objective; `BIO-FACT-T1-W06-SCOPE` asks whether the curriculum requires it.
- PARTIAL because the package contains no lesson and no parsed row for the week, and the importer has not been run.

## Assessment scope (blocks 826-833)
| Item | Blocks | Disposition |
|---|---|---|
| ASSIGNMENT / WEEK 6 heading | 826-827 | Labels only |
| Q1 constituent elements, food sources and functions of carbohydrate, protein and lipid | 828-831 | **Misplaced**: taught in Week 7 from block 837 |
| Q2 enzyme definition and characteristics | 832-833 | **Misplaced**: taught in Week 7 at blocks 903-909 |

Week 6 sets no question on carbon, water or sulphur cycling, no experiment and no practical. Its only assessment tests the following week's material. `BIOLOGY-T1-W06-ASSIGNMENT-MISPLACED` is open and `BIO-LES-T1-W06-ASSESSMENT` is appended.

## Observed defects (retained uncorrected)
1. Block 783 uses the singular `certain nutrient` and treats water, a compound, as a nutrient example.
2. Block 788 prints `C02` with a zero.
3. Block 792 reads `made up of carbon component`.
4. Block 793 reads `carbon in item`.
5. Blocks 805 and 807 print `transportation` where transpiration is meant.
6. Block 805 reads `form underground water empties into the oceans`, and its cloud sentence repeats `when` and lacks a main clause.
7. Block 828 says `two function` for two functions.
8. Block 833 labels the second enzyme question `b` with no `a`.
9. The assignment's questions belong to Week 7 and are not re-labelled here.

## Visual disposition
The two cycle drawings at blocks 795 and 821 are already covered by `BIO-VIS-T1-NUTRIENT-CYCLES` (PENDING): `media/image6.jpeg` SHA-256 `87e5a6ee5d40cdd770056a899b8c2131ad8fe8c76481bf950e047714e0de7f1e` and `media/image7.jpeg` SHA-256 `d9713621b42933a7d3d63f23703e3e0236c28bd87303f39dec0f30f7ae83497c`. No new asset item is added here.

## Appended tasks
- `BIO-LES-T1-W06-SULPHUR` — LESSON, PENDING; depends on BIO-SRC-T1, BIO-WK-T1-W06 and BIO-FACT-T1-W06-SCOPE.
- `BIO-LES-T1-W06-ASSESSMENT` — LESSON, PENDING; same dependencies.
- `BIO-FACT-T1-W06-SCOPE` — FACTUAL_DEPENDENCY, BLOCKED; depends on BIO-SRC-T1 and BIO-WK-T1-W06.
- Neither lesson is runnable until the expert decision is recorded; no lesson text, answer key or correction is authored here.

## Edits
- `biology.json`: two coverage rows appended; three CONTENT open items appended (`BIOLOGY-T1-W06-COVERAGE`, `BIOLOGY-T1-W06-ASSIGNMENT-MISPLACED`, `BIOLOGY-T1-W06-SOURCE-DEFECTS`), all blocking. Sources, source rules, lessons, delivery corrections and assets untouched; `package_status` remains PENDING.
- `QUEUE.json`: BIO-WK-T1-W06 set to IMPLEMENTED_TESTING_DEFERRED with its implementation reference extended; three items appended; counts and status_counts recomputed (60 items: 6 implemented, 52 pending, 2 blocked); BIO-WK-T1-W06 removed from `next_runnable`, which now begins BIO-INV-T3; one note appended. No existing ID otherwise changed.
- This file.

## Checks run (authoring only)
Archive and member SHA-256 verified; 1106 blocks parsed; Week 6 range and label hashes equal the queue; scheme-block hash computed; whole-document string searches for nitrogen, sulphur, nutrient cycle, carbohydrate, lipid and enzyme; JSON parse and byte-exact round-trip through the project serialisation with CRLF for both edited files; strict key sets against the package schema; unique coverage, open-item and queue IDs; every PARTIAL/UNRESOLVED coverage row named by a blocking open item (2/2); every new dependency resolves; every `next_runnable` entry PENDING with implemented dependencies; `git diff` reviewed. Nothing was run against the importer, compiler, database or tests.

## Remaining
Week 6 has no deliverable lesson or usable assessment: the two taught cycles need the normal import/parse step, and the sulphur and assessment supplements await `BIO-FACT-T1-W06-SCOPE`. Next eligible Biology items are BIO-INV-T3, BIO-TEST-PACKAGE and BIO-PRE-T1. This does not claim the week, subject or class complete.
