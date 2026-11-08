# CC-IDX-T2-W05 — Catering Craft, 2nd Term source index

Status: **IMPLEMENTED_TESTING_DEFERRED**. Source indexing only. No lesson or answer key authored; no correction, source rule, approval or verification claimed. Testing, importer, database and device runs remain deferred by owner.

## Verified source and locator

- Source: `SS1-SRC-f433169ca25c`, member `SSS 1/2nd Term SS1_/2ND TERM S1 CATERING CRAFT PRACTICES.doc`.
- Composite archive SHA-256: `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`; member SHA-256: `fd8115ff99dd3c370b86b4b5a326fe647e49328bc83f2d041c73f29b1b84ad59`; both verified before extraction.
- Extractor: `word-extractor` 1.0.4 `extract(path).getBody()`; full getBody() SHA-256 `371aa91970bceb96c354a002a3ac7a5384ca597c1c2f404f51f13096b7324c8a` (67,884 characters, 1,406 lines).
- Scheme row 12: `5.\tFood Commodities- Floor Cookery`; SHA-256 `6b1875dc30739dba1493ffa331ef519f4a96bc73b098dc9d5c4d628e6ba1222c`.
- Week range: lines 765–842; SHA-256 `431204f54c36231a7ba9d86b1163df6738dd6a691a53ae54de9f9c884e23da4d`. Line numbers are 1-based over getBody() split on `\n`; the week hash covers the exact UTF-8 lines joined with `\n`.
- Body topic: `FLOUR COOKERY`; CONTENT list: `Types of flour; Raising Agents; Flour mixtures`.

## Section index

| Section | Source lines |
|---|---:|
| FLOUR; milling and extraction rates | 772–778 |
| COMPOSITION OF FLOUR | 780–784 |
| EVALUATION 1 | 786–788 |
| TYPES OF FLOUR | 790–799 |
| RAISING AGENTS | 800–807 |
| EVALUATION 2 | 809–811 |
| FLOUR MIXTURES | 813–818 |
| GENERAL EVALUATION QUESTIONS | 820–825 |
| READING ASSIGNMENT | 827–829 |
| WEEKEND ASSIGNMENT | 831–838 |
| THEORY | 840–842 |

## Objective candidates (indexed, not approved lesson objectives)

1. Define flour and milling; distinguish low- and high-extraction flour.
2. Describe the source-listed composition of flour.
3. Identify and describe the listed flour types and their stated uses.
4. Explain the listed raising agents and the flour products they raise.
5. Differentiate pastry, dough, batter and cake mixtures by ingredients, raising agent and uses.

## Assessment and supporting blocks

Evaluations 786–788 and 809–811; general evaluation 820–825; reading 827–829; weekend MCQs 831–838; theory 840–842.

No answers, marks, marking criteria or practical rubric appear in these source blocks. The original question text remains in the archive and is not answered or dropped by this index.

## Source observations

Scheme row 5 says 'Floor Cookery'; body heading and content say 'FLOUR COOKERY'. This is a recorded source-label discrepancy, not corrected in the source. The general evaluation and weekend/theory questions are retained; no answer key or marks appear.

## Package outcome

- Added `COV-CC-T2-W05-SCHEME-5` to `backend/src/db/ss1/subjects/catering-craft.json` as **PARTIAL**, with `lesson_ids: []`.
- No parsed lesson identity is asserted; the importer was not run.
- Package remains **PENDING**. No lesson, asset, correction, rule, answer, approval or verification was added.
