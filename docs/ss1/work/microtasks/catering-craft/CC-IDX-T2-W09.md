# CC-IDX-T2-W09 — Catering Craft, 2nd Term source index

Status: **IMPLEMENTED_TESTING_DEFERRED**. Source indexing only. No lesson, answer key, correction, source rule, approval or verification claimed. Tests, importer, database and device runs remain deferred by owner.

## Verified source and locator

- Source: `SS1-SRC-f433169ca25c`; member `SSS 1/2nd Term SS1_/2ND TERM S1 CATERING CRAFT PRACTICES.doc`.
- Composite archive SHA-256: `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`; member SHA-256: `fd8115ff99dd3c370b86b4b5a326fe647e49328bc83f2d041c73f29b1b84ad59`; both verified.
- Extractor: `word-extractor` 1.0.4 `extract(path).getBody()`; full getBody() SHA-256 `371aa91970bceb96c354a002a3ac7a5384ca597c1c2f404f51f13096b7324c8a`.
- Scheme row 16: `9.\tMethods of Cooking- Baking, Roasting and Grilling`; SHA-256 `a402606eaa51ad7f86869f2026f5e9c5649cca1776042ead16d44bfa1e47ebaf`.
- Week range: lines 1197–1298; SHA-256 `975255ca14ee602af9ee500d0acd4fdc3530f918f93eea233bb8c99622a02ccb`. Line numbers are 1-based over getBody() split on `\n`; week hash covers the exact UTF-8 lines joined with `\n`.
- Body topic: `METHODS OF COOKING - DRY HEAT`; CONTENT list: `Baking; Roasting; Grilling`.

## Section index

| Section | Source lines |
|---|---:|
| BAKING; rules | 1204–1213 |
| EVALUATION 1 | 1215–1217 |
| ADVANTAGES OF BAKING | 1218–1221 |
| DISADVANTAGES OF BAKING | 1223–1226 |
| EVALUATION 2 | 1228–1230 |
| ROASTING | 1232–1237 |
| ADVANTAGES OF ROASTING | 1239–1243 |
| DISADVANTAGES OF ROASTING | 1245–1248 |
| EVALUATION 3 | 1250–1252 |
| GRILLING; suitable foods | 1254–1260 |
| ADVANTAGES OF GRILLING | 1262–1266 |
| DISADVANTAGES OF GRILLING | 1268–1271 |
| GENERAL EVALUATION QUESTIONS | 1273–1278 |
| READING ASSIGNMENT | 1280–1283 |
| WEEKEND ASSIGNMENT | 1285–1294 |
| THEORY | 1296–1298 |

## Objective candidates (indexed, not approved lesson objectives)

1. Define baking and state the source's baking rules, advantages and disadvantages.
2. Explain roasting and list the methods, advantages and disadvantages described.
3. Define grilling, identify suitable foods and state its listed advantages and disadvantages.

## Assessment and supporting blocks

Evaluations 1215–1217, 1228–1230 and 1250–1252; general evaluation 1273–1278; reading 1280–1283; weekend MCQs 1285–1294; theory 1296–1298.

No answers, marks, marking criteria or practical rubric appear in these source blocks. Original question text remains in the source and is not answered or dropped by this index.

## Source observations

Scheme row 9 names baking, roasting and grilling; body topic adds the suffix '— DRY HEAT'. The difference is recorded, not corrected.

## Package outcome

- Added `COV-CC-T2-W09-SCHEME-9` to `backend/src/db/ss1/subjects/catering-craft.json` as **PARTIAL**, with `lesson_ids: []`.
- No parsed lesson identity is asserted; the importer was not run.
- Package remains **PENDING**. No lesson, asset, correction, rule, answer, approval or verification was added.
