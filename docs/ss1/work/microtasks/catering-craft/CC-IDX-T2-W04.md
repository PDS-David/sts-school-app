# CC-IDX-T2-W04 — Catering Craft, 2nd Term source index

Status: **IMPLEMENTED_TESTING_DEFERRED**. Source indexing only. No lesson or answer key authored; no correction, source rule, approval or verification claimed. Testing, importer, database and device runs remain deferred by owner.

## Verified source and locator

- Source: `SS1-SRC-f433169ca25c`, member `SSS 1/2nd Term SS1_/2ND TERM S1 CATERING CRAFT PRACTICES.doc`.
- Composite archive SHA-256: `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`; member SHA-256: `fd8115ff99dd3c370b86b4b5a326fe647e49328bc83f2d041c73f29b1b84ad59`; both verified before extraction.
- Extractor: `word-extractor` 1.0.4 `extract(path).getBody()`; full getBody() SHA-256 `371aa91970bceb96c354a002a3ac7a5384ca597c1c2f404f51f13096b7324c8a` (67,884 characters, 1,406 lines).
- Scheme row 11: `4.\tFood Commodities- Cereals, Pulses, Herbs and Flavouring`; SHA-256 `be4b4eac68d52c5af4466dec3e4a0529dc94db5918efaa53cfd6c2d668a72a84`.
- Week range: lines 616–763; SHA-256 `6adadb605e85b92b405850e67bc1958bf903108220235f117be5f903a5f8c2f1`. Line numbers are 1-based over getBody() split on `\n`; the week hash covers the exact UTF-8 lines joined with `\n`.
- Body topic: `FOOD COMMODITIES`; CONTENT list: `Cereal, Pulses, Herbs and Spices`.

## Section index

| Section | Source lines |
|---|---:|
| CEREALS AND GRAINS | 621–622 |
| NUTRITIVE VALUE OF CEREALS | 624–628 |
| EVALUATION 1 | 630–632 |
| PULSES AND LEGUMES | 633–637 |
| NUTRITIVE VALUE OF LEGUMES | 639–643 |
| EVALUATION 2 | 645–647 |
| NUTS; food value; storage; quality/purchasing; uses | 649–671 |
| EVALUATION 3 | 672–674 |
| HERBS AND SPICES; classification | 676–701 |
| EVALUATION 4 | 704–706 |
| FLAVOURINGS AND COLOURINGS; flavourings table; colourings table | 708–740 |
| GENERAL EVALUATION QUESTIONS | 742–747 |
| READING ASSIGNMENT | 749–752 |
| WEEKEND ASSIGNMENT | 754–759 |
| THEORY | 761–763 |

## Objective candidates (indexed, not approved lesson objectives)

1. Define cereals/grains and identify examples; explain the source-listed food value of cereals.
2. Distinguish pulses and oil seeds within legumes and describe their listed food values.
3. Describe nuts, their food value, storage, purchasing criteria and culinary uses.
4. Differentiate herbs and spices and record the source's natural/artificial classification.
5. Distinguish natural/artificial flavourings and colourings using the source tables.

## Assessment and supporting blocks

Evaluations 630–632, 645–647, 672–674 and 704–706; general evaluation 742–747; reading 749–752; weekend MCQs 754–759; theory 761–763.

No answers, marks, marking criteria or practical rubric appear in these source blocks. The original question text remains in the archive and is not answered or dropped by this index.

## Source observations

Scheme row 4 says 'Cereals, Pulses, Herbs and Flavouring'; body CONTENT list says 'Cereal, Pulses, Herbs and Spices'. Body also includes nuts and colourings. Three flattened tables are present: English/Yoruba/Hausa/Igbo names (681–695), flavourings (713–728), colourings (731–741). The general evaluation asks for a cereal drawing (743), but the source-wide render found no embedded picture; it also asks culinary words and functions of a catering establishment (746–747), not taught in this week.

## Package outcome

- Added `COV-CC-T2-W04-SCHEME-4` to `backend/src/db/ss1/subjects/catering-craft.json` as **PARTIAL**, with `lesson_ids: []`.
- No parsed lesson identity is asserted; the importer was not run.
- Package remains **PENDING**. No lesson, asset, correction, rule, answer, approval or verification was added.
