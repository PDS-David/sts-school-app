# CC-IDX-T2-W06 — Catering Craft, 2nd Term source index

Status: **IMPLEMENTED_TESTING_DEFERRED**. Source indexing only. No lesson or answer key authored; no correction, source rule, approval or verification claimed. Testing, importer, database and device runs remain deferred by owner.

## Verified source and locator

- Source: `SS1-SRC-f433169ca25c`, member `SSS 1/2nd Term SS1_/2ND TERM S1 CATERING CRAFT PRACTICES.doc`.
- Composite archive SHA-256: `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`; member SHA-256: `fd8115ff99dd3c370b86b4b5a326fe647e49328bc83f2d041c73f29b1b84ad59`; both verified before extraction.
- Extractor: `word-extractor` 1.0.4 `extract(path).getBody()`; full getBody() SHA-256 `371aa91970bceb96c354a002a3ac7a5384ca597c1c2f404f51f13096b7324c8a` (67,884 characters, 1,406 lines).
- Scheme row 13: `6.\tPrinciple of Cooking Methods`; SHA-256 `076fd4db3b47d9b5d402b7ccb32402222b2799a33afd1875757937bfb78452fa`.
- Week range: lines 845–927; SHA-256 `fb7e873509e94a65eaba0d93790c2171ee68729f1bc5ee049e8dc8bed204e1de`. Line numbers are 1-based over getBody() split on `\n`; the week hash covers the exact UTF-8 lines joined with `\n`.
- Body topic: `COOKING OF FOODS`; CONTENT list: `Principles of cooking—heat transfer; reasons for cooking; factors for selecting methods; why people eat out`.

## Section index

| Section | Source lines |
|---|---:|
| COOKING OF FOOD | 853–855 |
| PRINCIPLES OF COOKING—HEAT TRANSFER | 857–861 |
| EVALUATION 1 | 863–865 |
| REASONS FOR COOKING FOOD | 866–874 |
| FACTORS TO CONSIDER WHEN CHOOSING COOKING METHOD | 876–880 |
| EVALUATION 2 | 882–884 |
| WHY PEOPLE EAT OUT | 886–891 |
| METHODS OF COOKING | 893–904 |
| GENERAL EVALUATION QUESTIONS | 906–911 |
| READING ASSIGNMENT | 913–915 |
| WEEKEND ASSIGNMENT | 916–923 |
| THEORY | 925–927 |

## Objective candidates (indexed, not approved lesson objectives)

1. Define cooking and describe the source's explanation of heat transfer.
2. Explain conduction, convection and radiation as described in the source.
3. State reasons for cooking foods and factors to consider when choosing a cooking method.
4. State reasons people eat outside the home.
5. Classify the cooking methods listed by the source.

## Assessment and supporting blocks

Evaluations 863–865 and 882–884; general evaluation 906–911; reading 913–915; weekend MCQs 916–923; theory 925–927.

No answers, marks, marking criteria or practical rubric appear in these source blocks. The original question text remains in the archive and is not answered or dropped by this index.

## Source observations

Scheme row 6 says 'Principle of Cooking Methods'; body topic is 'COOKING OF FOODS'. In the methods list (895–904), frying is placed under the 'Moist-heat method' alongside boiling, poaching, steaming and stewing. That classification needs factual review; a separate queue item is added. No lesson or correction is made in this index.

## Package outcome

- Added `COV-CC-T2-W06-SCHEME-6` to `backend/src/db/ss1/subjects/catering-craft.json` as **PARTIAL**, with `lesson_ids: []`.
- No parsed lesson identity is asserted; the importer was not run.
- Package remains **PENDING**. No lesson, asset, correction, rule, answer, approval or verification was added.
