# CIV-INV-T2 — Civic Education (2nd Term)

Status: IMPLEMENTED — TESTING DEFERRED BY OWNER. Source inventory only. No lesson, coverage entry, rule, correction, asset, test, typecheck, importer run, database check or deployment was performed.

## Input

| Field | Value |
| --- | --- |
| Source | SS1-SRC-21ddf6abc2dc |
| archive_member | `SSS 1/2nd Term SS1_/CIVIC.docx` |
| Member SHA-256 | `1e2505c4b9e197087a55e0532c3a6efc7c08765bf1d86697c6720d253d22cdef` (matches the task and SOURCE_ASSIGNMENTS.csv) |
| Member size | 21,865 bytes |
| Container | Per-term ZIP `2nd Term SS1` supplied by the owner; the composite archive hash was not checked |
| Base | origin/master `b696e3e`; no open PRs touched Civic Education; no `AGENTS.md` |
| Committed? | No - original bytes and private extracts stay outside Git |

## Method

- Text view: mammoth 1.12.2 `extractRawText` (0 messages); 15,331 characters, 499 lines, SHA-256 `2fa8d04c6b9f241c5e2ef2a51cd6f6f9a2d925d222579eb4abb3f2c037589c26`.
- Locator: `\n`-split text, 1-based lines; a week range starts at its `WEEK ...` marker and ends before the next marker (last week to end of file); SHA-256 over the UTF-8 lines joined with `\n`.
- Structure: `word/document.xml` read directly (250 body children: 249 `p`, 1 `sectPr`). The importer's `WEEK_MARKER`, adjacent-collapse and title rules were replicated by hand over the text, not run.

## Opening (lines 1-74, SHA-256 `7863ba61d068760f3c4da248c4a6105faec4c9d1a49bceef0fabb6ad0cc29d55`)

- 1 `TERM:<tab>2ND TERM`; 3 `SUBJECT:<tab>CIVIC EDUCATION`; 5 `SS 1`; 7 `SCHEME OF WORK`; 9 `WEEKS <tabs> TOPICS`.
- Scheme (11-73, SHA-256 `0919ec7d70498d96522d01ae41e720c39dc4aa0523e2f6c094206b193816eb53`) is ordinary paragraphs, **not a Word table**. Ten scheme paragraphs carry Word auto-numbering whose numbers are not in the text. The WEEKS column has no week numbers except the last row.
- Nine topic groups: Revision of Last Term's Work (11); Voter Education with meaning of voting, voters registration, process and importance (13-23); Election, meaning and importance (25-29); Electoral Bodies in Nigeria, INEC and SIEC, composition and roles (31-35); Free & Fair Elections (37-41); Electoral malpractice, meaning and forms, causes, prevention (43-49); Planning for results (51-57); The current Nigerian constitution, meaning and sources (59-63); The current Nigerian / Constitution, features and functions (65-71, the title is split over two lines).
- `12 & 13 <tabs> Test & Examination` (73) is a scheme marker with no body.

## Week inventory

| Week | Marker and title | Lines | SHA-256 |
| --- | --- | --- | --- |
| WEEK ONE | 75; `TOPIC: Reviewed of last Term's work` (77) | 75-84 | `315922ebd527d378d4f67b0e0d40feaf0733af3824362ef52f1753085885c3ab` |
| WEEK TWO | 85; `TOPIC:  VOTER EDUCATION` (87) | 85-120 | `b050de97dd85a021799f2b6f025a39e43cc5680e8d8faae24261537f1be33de1` |
| WEEK THREE (trailing space) | 121; `TOPIC: VOTER EDUCATION` (123) | 121-156 | `0acd4692fd6b5d442885f5c30ddd7987aceba51cb5034f81b1cfd5ab176ea9b8` |
| WEEK FOUR | 157; `TOPIC: MEANING OF ELECTION` (159) | 157-186 | `f364ed3d65896dd38561bc120e652e2cd8cb2ec579d72a62ab3d1909f5d264b8` |
| WEEK FIVE | 187; `TOPIC: ELECTORAL BODIES IN NIGERIA` (189) | 187-226 | `5a3221d85029c7732764f52b711c5109719a865a9924545949e2677ed583bd85` |
| WEEK SIX | 227; `FREE AND FAIR ELECTION` (229, no `TOPIC:`) | 227-250 | `7912400a484f58bf1e0e1c09c744edd4e4bca25ca6efa34317fb5f793fb99233` |
| WEEK SEVEN | 251; `TOPIC: Electoral Malpractice` (253) | 251-310 | `64c8d01ca1f8b5ed666a16d5b1568f3a845bfd0ead1f661a52b97bdad9dd4549` |
| WEEK EIGHT | 311; `TOPIC: Planning for Results` (313) | 311-368 | `7bf55d4220c4968441f547d0aa757b09b918371b37ce9dce44a0c9c42413a2a0` |
| WEEK NINE | 369; `TOPIC: The Current Nigerian constitution.` (371) | 369-402 | `57ea3043b537c32e20af05c6a84df73e2dfbe8d6f0b98f1cbafdc358dd9b11d1` |
| WEEK TEN | 403; `TOPIC: FEATURES OF THE 1999 CONSTITUTION` (405) | 403-499 | `3d358321e2e3fe635260a7185f3d8f37458ac74d52cd3cfc7fb8213aa5f1f936` |

Sections (anchor lines): W2 CONTENT 89, Voting 95, VOTER'S REGISTRATION 109, Evaluation 117; W3 Process of Voting 125, IMPORTANCE OF VOTING 139, Evaluation 151; W4 IMPORTANCE OF ELECTION 167, Evaluation 181; W5 INEC 191, Functions 195, SIEC 209, Evaluation 221; W6 Evaluation 245; W7 Sub Topic Forms 255, Causes 277, WAYS OF PREVENTING 295, Evaluation 307; W8 NEED 315, BENEFITS 329, CONSEQUENCIS 343, MEANING 357, Evaluation 363; W9 Meaning 373, SOURCES 379, Evaluation 399; W10 SUB TOPIC 407, features 409-431, FUNCTIONS 435, unheaded blocks 449-457 and 461-471, DEMERITS 475, Evaluation 489-495.

There are ten week markers only (75, 85, 121, 157, 187, 227, 251, 311, 369, 403). `WEEKS` (line 9) is not matched by the importer pattern. There is no WEEK ELEVEN or later marker and no table, drawing, image, object, equation or hyperlink (0 of each); `w:numPr` appears on 86 paragraphs (10 in the scheme, 76 in the weeks).

## Scheme-to-body observations (recorded, not repaired)

- WEEK ONE is only a review instruction (81); it carries no teaching.
- WEEK TWO and WEEK THREE share the same title `VOTER EDUCATION`; the importer would give two rows with equal titles.
- Scheme sub-topics with no body text: INEC composition (35), the meaning of free and fair elections (39), the meaning of electoral malpractice (45).
- WEEK TEN holds two unheaded blocks (449-457, 461-471); the second begins with a truncated sentence (461). No headings were invented.
- `Test & Examination` (73) has no paper or marking scheme. The closing Evaluation says `Treat Akwa Past Question Papers` / `Nos 1 -100` / `Best wishes.` (491-495); those papers are not supplied. Most weeks say `See your work book for exercise.`; the workbook is not supplied either.

## Parser rule findings (findings only - no rule written)

- `split_before`: the ten labels are standalone word labels (`WEEK ONE` ... `WEEK TEN`); the replicated importer pattern finds all ten at line start. compiler.ts requires a numeric `week_label`, so a rule could not name them, and none is needed. Hazard: WEEK THREE has a trailing space.
- `attach_stranded_label`: not needed. WEEK SIX has no `TOPIC:` prefix but its heading follows within two lines; the first-credible-line rule gives `FREE AND FAIR ELECTION`. WEEK TWO and WEEK THREE parse as `VOTER EDUCATION` both.
- `classify_marker`: `12 & 13 <tabs> Test & Examination` exists only in the scheme (73) and must not create a WEEK TWELVE/THIRTEEN body. The opening is not matched as a week row, so it is preamble outside every parsed row.
- Importer-view body hashes (trimmed block, replicated not run): W1 `8d3fef1d0531ae1b...`, W2 `89d6a4d2e1995e3f...`, W3 `45b26f4f6164ac4d...`, W4 `9c5370ac1fe4a15e...`, W5 `8a6cdae62839c934...`, W6 `e032b9fedbe282b0...`, W7 `48e61b6619261bae...`, W8 `244ffde716fadcc0...`, W9 `5e2c28fc257d5264...`, W10 `d01d1a9d51dbf1b6...` (first 16 hex characters).

## Content issues recorded (not corrected)

- Source spelling and typography to keep verbatim: `CONSEQUENCIS` (343), `Myodyssey`, `Chiefy Anthony Enahoro`, `Obafemi; Awolowo` (395), `complains` (113); 15 U+2019 quotes and 3 U+2013 dashes.
- Truncated or garbled lines: 211 (`has power to`), 279 (ends `i.e.`), 461 (`are state there`), 145 (`either to vote against during election period`).
- Line 431 cites the 1979 constitution under a 1999 heading; line 393 says past US constitutions were a model of the 1979 constitution.

## Factual and neutrality flags (for later items; nothing corrected)

- Electoral procedure and institutions (WEEK TWO, THREE, FIVE): CIV-FACT-T2-ELECTORAL-LAW, including the statement that the SIEC chairman and seven others are appointed by INEC (217).
- Constitutional statements (WEEK NINE, TEN): which constitution is current, the amendment procedure (441), National Assembly size (457), executive and judicial powers (449-453): CIV-FACT-T2-CONSTITUTION; all need primary texts with effective dates.
- Neutrality: party names as examples (199), the line praising a named leader and party and blaming another (287), and the contested demerits of the 1999 constitution (477-485): CIV-FACT-T2-NEUTRALITY. These are preserved as source wording, not adopted as lesson fact.
- No Government content is merged into Civic Education.

## Edits made

- `QUEUE.json`: CIV-INV-T2 -> `IMPLEMENTED_TESTING_DEFERRED`; **17 PENDING items appended**: `CIV-WK-T2-W01`..`W10` (10 SOURCE_WEEK_INDEXING), `CIV-PRE-T2` (preamble), `CIV-MARK-T2-SCHEME-GAPS`, `CIV-MARK-T2-REVEXAM`, `CIV-PRES-T2-LISTS` (numbering lost in raw text) and three FACTUAL_DEPENDENCY items. No visual-disposition item: the document has no table or media. Each depends on CIV-INV-T2 and CIV-SRC-T2; counts, `status_counts` and `next_runnable` recomputed; one note appended. Authoring checks only: JSON parse, unique IDs, resolvable dependencies.
- No package, lesson, coverage entry, rule, correction, asset or test file was written; `civic-education.json` is untouched.

## Not done / next eligible

- Testing, typechecks, importer/plan runs, database and device checks remain deferred by owner.
- Alias approval items (`CIVIC-EDUCATION-ALIAS-APPROVAL*`) remain owner actions.
- Next eligible: CIV-INV-T3, CIV-TEST-PACKAGE, then the T1 and T2 items. CIV-FACT-CONTENT-APPROVAL remains BLOCKED. This task does not claim the subject or class complete.
