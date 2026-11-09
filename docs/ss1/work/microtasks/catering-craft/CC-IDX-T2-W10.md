# CC-IDX-T2-W10 — Catering Craft, 2nd Term source index

Status: **IMPLEMENTED_TESTING_DEFERRED**. Source indexing only. No lesson, answer key, correction, source rule, approval or verification claimed. Tests, importer, database and device runs remain deferred by owner.

## Verified source and locator

- Source: `SS1-SRC-f433169ca25c`; member `SSS 1/2nd Term SS1_/2ND TERM S1 CATERING CRAFT PRACTICES.doc`.
- Composite archive SHA-256: `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`; member SHA-256: `fd8115ff99dd3c370b86b4b5a326fe647e49328bc83f2d041c73f29b1b84ad59`; both verified.
- Extractor: `word-extractor` 1.0.4 `extract(path).getBody()`; full getBody() SHA-256 `371aa91970bceb96c354a002a3ac7a5384ca597c1c2f404f51f13096b7324c8a`.
- Scheme row 17: `10.\tStandard and Local Measuring Equipment`; SHA-256 `b695738eeb6516f23c84acebbb79d819d03e55b2e13d8ba568408c7c7b8db0ca`.
- Week range: lines 1301–1398; SHA-256 `1cc8cb6acd059ffa9ee5a12e610ce7303b146dd2a33bc85410c44f24b3149786`. Line numbers are 1-based over getBody() split on `\n`; week hash covers the exact UTF-8 lines joined with `\n`.
- Body topic: `STANDARD AND LOCAL MEASURING EQUIPMENT`; CONTENT list: `Meaning of measuring equipment; measuring equipment and their uses; conversion methods`.

## Section index

| Section | Source lines |
|---|---:|
| MEASURING EQUIPMENT/ TOOLS | 1307–1308 |
| STANDARD TOOLS / LOCAL TOOLS table | 1310–1321 |
| MEASURING EQUIPMENT AND THEIR USES | 1323 |
| TOOLS FOR WEIGHING | 1324–1326 |
| MEASURING CUPS | 1328 |
| MEASURING SPOONS | 1330 |
| EVALUATION 1 | 1332–1334 |
| CONVERSION METHODS | 1336 |
| LOCAL / STANDARD (METRIC) conversion table | 1337–1375 |
| GENERAL EVALUATION QUESTIONS | 1377–1382 |
| READING ASSIGNMENT | 1384–1387 |
| WEEKEND ASSIGNMENT | 1389–1394 |
| THEORY | 1396–1398 |

## Objective candidates (indexed, not approved lesson objectives)

1. Define measuring equipment and explain why it is used in catering.
2. Identify the source-listed standard and local measuring tools.
3. Explain the uses of balance and spring scales, measuring cups and measuring spoons.
4. Read and explain the local-to-standard metric conversion table, subject to later verification of the values.

## Assessment and supporting blocks

Evaluation 1332–1334; general evaluation 1377–1382; reading 1384–1387; weekend MCQs 1389–1394; theory 1396–1398.

No answers, marks, marking criteria or practical rubric appear in these source blocks. Original question text remains in the source and is not answered or dropped by this index.

## Source observations

Two flattened tables are present: standard/local tools (1310–1321) and local/standard metric conversions (1337–1375). The source-wide visual inventory found no equipment illustrations. Conversion values are preserved as source data and routed to a new factual-dependency review; no conversion is silently changed.

## Package outcome

- Added `COV-CC-T2-W10-SCHEME-10` to `backend/src/db/ss1/subjects/catering-craft.json` as **PARTIAL**, with `lesson_ids: []`.
- No parsed lesson identity is asserted; the importer was not run.
- Package remains **PENDING**. No lesson, asset, correction, rule, answer, approval or verification was added.
