# FN-PRE-T1 — Food and Nutrition, 1st Term opening (scheme of work)

Status: **IMPLEMENTED_TESTING_DEFERRED** (not approved, not verified). Testing deferred by owner. No lesson, correction or asset was written; the package stays `PENDING` and still has no lessons.

## Inputs
- Base: origin/master at the start of this item (A4, 8 November 2026). No other agent held the `food-and-nutrition` claim; no `origin/agent*` branch had touched the subject in the previous three hours; no commit on master mentioned FN-PRE-T1.
- Prerequisites FN-INV-T1 and FN-SRC-T1 are `IMPLEMENTED_TESTING_DEFERRED`.
- Original: `SSS 1/1st Term SS1_/F _ N.docx`, SHA-256 `398b0e1f1383e88f7d71148253f8466fbfed95fefdca068907b5ba35083f4ff7`, extracted from the repository copy `docs/ss1/sources/SSS1-original.zip` (archive SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`, checked). Both equal the recorded values.
- Method: `mammoth` 1.12.2 `extractRawText` run privately (the importer's own `.docx` call): 21,131 characters, 865 lines, whole-text SHA-256 `b9bfbdfc1952ef26444e64ed49c529a9e25e5b436ef8881ca0b885ea70c1c8b2`, equal to FN-INV-T1. Lines 1-99 (the region the item names) hash to `f2306a69a9573116b0c42b9323a24e0f7a8a4dc02d49e116d2628b2505bd2068`, equal to the queue. The importer was not run. Nothing from the document is committed beyond the short scheme wording below, which the item requires preserved verbatim.

## What the opening is
Locators are 1-based lines of the extracted text split on `\n`. Line 1 is the title `SCHEME OF WORK FOR ALPHA TERM` (SHA-256 `2991c622bbcd21d6e87ad06c23348ecb7ee7efb9f0c4b10cc52c6446e0b01d61`); line 3 is the table header printed `WEEK` followed by spaces and `TOPIC` (SHA-256 `2618267ace358ea7494aa3851cd01ee5593163eeb345aaec3937869baef5be59`); lines 5-99 hold thirteen rows of a real two-cell table; lines 100-106 are empty; the first parsed body label `WEEK 1` is line 107 (offset 1200). Text before that label, computed by slicing, hashes to `9fcede9636bf8f2bd0821ac54bc68d13cef91e9a99bae75d640318c7864a8611`. Each row's number is a table cell flattened onto its own line (`1` at line 5 ... `13` at line 97) and is not a heading. Non-ASCII in lines 1-99 is only an en dash and an em dash (row 1). The document has no SUBJECT or CLASS line, so the title is the registered header text.

## Scheme rows (verbatim) and where each goes
| Row | Lines | Verbatim cells (number cell, then topic cell paragraphs; `repr` form keeps spaces) | Row sha256 | Goes to |
|---|---|---|---|---|
| 1 | 5-7 | `1` ‖ `Introduction to food and nutrition –definition—importance of human nutrition- factors affecting human nutrition` | `e2e7f2edc36afade01d863e15337ac1ebf2ac09cf4dd88d6b9d45442c68888bd` | FN-WK-T1-W01 (indexed; COV-FN-T1-W01-SCHEME-1) |
| 2 | 9-11 | `2` ‖ `Careers in food and nutrition` | `ef7251a846b7299aa9a7534c44daeae4b18834e24d1a7755e42fc87da5421d21` | FN-WK-T1-W02 |
| 3 | 13-15 | `3` ‖ `Relationship between food and nutrition to other subject` | `2cd339c99b144b9ee72a969887fc700c4a8fcd7f24c7b68ab95af78031e73d8e` | FN-WK-T1-W03 |
| 4 | 17-27 | `4` ‖ `Basic food nutrient` ‖ `--carbohydrate` ‖ `--functions of carbohydrate` ‖ `-food sources` ‖ `-symptoms of dietary deficiency` | `9fa8e66d78e4b328b6a66392462be7ab65b1518771093db3126f8b03464d438f` | FN-WK-T1-W04 |
| 5 | 29-37 | `5` ‖ `Basic food nutrient:` ‖ `-protein` ‖ `-functions` ‖ `-food sources` | `8b1483d91e11b4442d0f7d178d96726260d3bc28259e2db18c8f13edd338143a` | FN-WK-T1-W05 |
| 6 | 39-49 | `6` ‖ `Symptoms of dietary deficiency` ‖ `-Fats and oils` ‖ `-functions ` ‖ `-food sources` ‖ `-symptoms of dietary deficiency` | `1b92a0b54ccffc653f67b9b9a3e968550a488fdb7d436e4461a6933a62bf11a8` | FN-WK-T1-W06 |
| 7 | 51-61 | `7` ‖ `Vitamins-water and fat soluble vitamins` ‖ `-chemical names` ‖ `-functions of each vitamins` ‖ `-food sources` ‖ `-symptoms of food deficiencies` | `850d84b1f9d0df792b6377c85d0864f27ad8cfb4d71db672c2739370c36a8f19` | FN-WK-T1-W07 |
| 8 | 63-71 | `8` ‖ `Mineral salts and water:` ‖ `-Functions ` ‖ `-food sources` ‖ `-symptoms of deficiencies ` | `d0767441d5185384464fced6204f999a41e8b7e66c963089c021556b9f7e112b` | FN-WK-T1-W08 |
| 9 | 73-77 | `9` ‖ `Symptoms of dietary deficiencies` ‖ `-Symptoms, signs, causes  and cure e.g. kwashiorkor, marasmus etc.` | `eb7efbaa3cffddf0a90babf4a29b0e2d8842b63f9d8eaab3c6acd399081396d8` | FN-WK-T1-W09 |
| 10 | 79-85 | `10` ‖ `The Digestive System:` ‖ `Meaning of Digestion, Absorption, Assimilation and Metabolism` ‖ `Digestion of food in the mouth, stomach and small intestines` | `f1c96a76c6a0da8bd186e78026b5b51aa2fb3189b3da7fe3fdd0742e9ce91d1a` | FN-WK-T1-W10 |
| 11 | 87-91 | `11` ‖ `Enzymes involved in Digestion` ‖ `Absorption of nutrients, the role of water in digestion and absorption` | `43f47bd2cafaf0e8ad518ec566a074e7fdb588172599ffa133f752cf2f5e041e` | FN-WK-T1-W11 |
| 12 | 93-95 | `12` ‖ `Revision` | `29ec4f6c34ccf9416c84625df1583c686f69ba2052df90a5db74e32672dd4ce8` | FN-MARK-T1-REVEXAM |
| 13 | 97-99 | `13` ‖ `Examination.` | `9e052307abd704eef9e44954f17c970962ad3963d89597e0e2c6d9c3e8392541` | FN-MARK-T1-REVEXAM |

Lines 1-99 together: `f2306a69a9573116b0c42b9323a24e0f7a8a4dc02d49e116d2628b2505bd2068`; lines 5-99: `c150d17cbdb5b70064b173226ab49dcd34fff4dcd7f0078c31f3ce4e573db26c`. Row 1's hash equals the value already cited by `COV-FN-T1-W01-SCHEME-1`. Mapping of rows 1-11 to the bodies `WEEK 1`..`WEEK 11` is by number and order; the week items confirm each row against its body. Row 6 opens with `Symptoms of dietary deficiency` before `-Fats and oils` and repeats it as its last bullet (printed, not corrected). The scheme promises deficiency symptoms for rows 4, 6, 7 and 8 and the meanings of absorption, assimilation and metabolism (row 10) and the role of water (row 11); those gaps are recorded by the week items, not here.

## What was implemented (existing schema only)
- `backend/src/db/ss1/subjects/food-and-nutrition.json`: rule `SS1-SRC-de2cdd0b85f6-R002` (`classify_marker`, `SCHEME_ONLY`, anchor `SCHEME OF WORK FOR ALPHA TERM`, occurs once at offset 0 on a line start, before the first parsed body) and `MARKER` coverage `COV-FN-T1-TITLE` targeting that rule with the hashes above. The anchor is shared with the existing `source_alias` rule `SS1-SRC-de2cdd0b85f6-R001`; two other packages (yoruba, mathematics) declare the same pairing. No lesson ID was invented.
- `docs/ss1/work/microtasks/food-and-nutrition/QUEUE.json`: `FN-PRE-T1` set to `IMPLEMENTED_TESTING_DEFERRED` with the evidence; `status_counts` and `next_runnable` recomputed; one note appended. No item added or removed.
- This file.
- Not touched: shared schema or compiler, other sources' rules, existing coverage (including `COV-FN-T1-W01-SCHEME-1`, which stays `PARTIAL`), open items, the revision/examination rows (FN-MARK-T1-REVEXAM) and the table's drawn structure (FN-VIS-T1-SCHEME-TABLE). The alias approval open item `FOOD-AND-NUTRITION-ALIAS-APPROVAL` stays an owner action.

## Checks run
Authoring checks only: archive and member SHA-256; extraction hashes against the queue and FN-INV-T1; every row range and hash recomputed; the anchor found exactly once at a line start and before the first body label in the private extraction; the package parsed with the repository's zod `packageSchema` in a scratch directory (copy of `subjectPackageSchema.ts`, not the repository test); the new `MARKER` coverage target resolved to a `SCHEME_ONLY` rule; JSON parse of the queue, unique IDs, resolvable dependencies, status counts and `next_runnable` recomputed. The subject test file does not exist; no importer, plan, typecheck of the backend, database or device check was run.

## Not done / remaining
No tests (deferred by owner), no importer or plan run, so the compiler's `PREAMBLE_REQUIRES_COVERAGE` and marker-disposition checks have not been executed for this source. Rows 2-13 still need their own week, marker and visual items. This does not claim the subject or class complete.
