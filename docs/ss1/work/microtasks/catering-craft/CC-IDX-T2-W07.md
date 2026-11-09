# CC-IDX-T2-W07 — Catering Craft, 2nd Term source index

Status: **IMPLEMENTED_TESTING_DEFERRED**. Source indexing only. No lesson or answer key authored; no correction, source rule, approval or verification claimed. Testing, importer, database and device runs remain deferred by owner.

## Verified source and locator

- Source: `SS1-SRC-f433169ca25c`, member `SSS 1/2nd Term SS1_/2ND TERM S1 CATERING CRAFT PRACTICES.doc`.
- Composite archive SHA-256: `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`; member SHA-256: `fd8115ff99dd3c370b86b4b5a326fe647e49328bc83f2d041c73f29b1b84ad59`; both verified before extraction.
- Extractor: `word-extractor` 1.0.4 `extract(path).getBody()`; full getBody() SHA-256 `371aa91970bceb96c354a002a3ac7a5384ca597c1c2f404f51f13096b7324c8a` (67,884 characters, 1,406 lines).
- Scheme row 14: `7.\tMethods of Cooking- Boiling, Poaching and Steaming`; SHA-256 `0f6169c6c3bf82844498521910ed063dc557e4724226625db92fbe0cedd4f7e5`.
- Week range: lines 930–1053; SHA-256 `75cb9e77384b8ec9600411fc758a8ada252f3798d264a4f20e6ce0b25711cf6c`. Line numbers are 1-based over getBody() split on `\n`; the week hash covers the exact UTF-8 lines joined with `\n`.
- Body topic: `METHODS OF COOKING`; CONTENT list: `Boiling; Poaching; Steaming`.

## Section index

| Section | Source lines |
|---|---:|
| BOILING; reasons; rules | 937–951 |
| EVALUATION 1 | 954–956 |
| THE VARIOUS METHODS USED IN BOILING FOODS ARE | 958–961 |
| ADVANTAGES OF BOILING | 963–970 |
| DISADVANTAGES OF BOILING | 972–977 |
| EVALUATION 2 | 979–981 |
| POACHING | 983–986 |
| ADVANTAGES OF POACHING | 988–990 |
| DISADVANTAGES OF POACHING | 992–994 |
| EVALUATION 3 | 995–997 |
| STEAMING; suitable foods | 999–1006 |
| RULES FOR STEAMING | 1008–1012 |
| EVALUATION 4 | 1014–1016 |
| ADVANTAGES OF STEAMING | 1018–1023 |
| DISADVANTAGES OF STEAMING | 1025–1030 |
| GENERAL EVALUATION QUESTION | 1032–1037 |
| READING ASSIGNMENT | 1039–1040 |
| WEEKEND ASSIGNMENT | 1042–1049 |
| THEORY | 1051–1053 |

## Objective candidates (indexed, not approved lesson objectives)

1. Explain boiling, poaching and steaming as cooking methods.
2. Describe the reasons, rules, advantages and disadvantages for boiling.
3. Describe poaching and its stated advantages/disadvantages.
4. Identify foods the source lists as suitable for steaming and state steaming rules, advantages and disadvantages.

## Assessment and supporting blocks

Evaluations 954–956, 979–981, 995–997 and 1014–1016; general evaluation 1032–1037; reading 1039–1040; weekend MCQs 1042–1049; theory 1051–1053.

No answers, marks, marking criteria or practical rubric appear in these source blocks. The original question text remains in the archive and is not answered or dropped by this index.

## Source observations

Scheme row 7 and the body CONTENT list agree on boiling, poaching and steaming. The source's general evaluation also asks about boiling/steaming, and its theory asks about boiling and poaching. No answers, marks or rubric are supplied.

## Package outcome

- Added `COV-CC-T2-W07-SCHEME-7` to `backend/src/db/ss1/subjects/catering-craft.json` as **PARTIAL**, with `lesson_ids: []`.
- No parsed lesson identity is asserted; the importer was not run.
- Package remains **PENDING**. No lesson, asset, correction, rule, answer, approval or verification was added.
