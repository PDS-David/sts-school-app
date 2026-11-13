# COM-INV-T3 — Commerce (3rd Term)

Status: IMPLEMENTED — TESTING DEFERRED BY OWNER. Source inventory only. No lesson, coverage entry, parsing rule, correction, asset, test, typecheck, importer run, database check, deployment or student-device check was performed.

## Input and identity

| Field | Value |
|---|---|
| Source | `SS1-SRC-d436db5f412d` |
| Archive member | `SSS 1/3rd Term SS1_/3RD TERM S1 COMMERCE.doc` |
| Member SHA-256 | `a5d127fef6807a87a063f71c20c404036e476a46032037ffd74da12a72995589` (matches `SOURCE_ASSIGNMENTS.csv`) |
| Member size | 169,472 bytes |
| Container | Supplied composite archive, SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e` (verified) |
| Header | Third Term E-Learning Note; Subject: Commerce; Class: SS1 |

## Method and structure

- Extracted the exact legacy `.doc` member from the hash-verified ZIP without modifying its bytes.
- Read source text with antiword 0.37: 66,284 characters and 1,387 lines. Line locators below are 1-based antiword output lines.
- Rendered a private conversion using LibreOffice 25.2.3.2 to inspect page layout and drawings (22-page PDF). The private conversion is not committed.
- Converted structural inspection found 3 Word tables, 6 VML pict groups / drawing objects and 30 text-box elements; no raster media parts. The drawn examples are part of the document layout, not separate image files.
- Week-block digests are SHA-256 of the UTF-8 antiword output lines from inclusive start/end positions joined with newline, with no added trailing newline. These are extraction-text digests, not DOC binary hashes.
- No macros or embedded programs were executed. No importer, database, API or student-device test was performed.

## Opening scheme (antiword lines 4–21)

- Lines 4–5 identify Third Term E-Learning Note, Commerce, SS1.
- Scheme rows (lines 8–20): Week 1 Business Organizations – Sole Proprietorship; Week 2 Partnership; Week 3 Partnership; Week 4 Money; Week 5 Central Bank; Week 6 Commercial Bank; Weeks 7–8 The Cheque System; Week 9 Negotiable Instruments – Bills of Exchange etc.; Week 10 Other Financial Institutions; Week 11 Revision.
- The scheme is a text layout, not a complete teaching lesson. The references begin at line 21 and point to textbooks not included in this archive.
- The body has nine teaching blocks: Weeks 1–6, combined Weeks 7–8, Week 9 and Week 10. Week 11 revision is scheme-only.

## Teaching-body inventory

| Body label | Antiword lines | SHA-256 | Content and assessment inventory |
|---|---:|---|---|
| `WEEK 1` | 22–149 | `3839620bf70387d0585abb79cdd160a944ad0e23f700595fab0348e15f22e370` | Forms of business units; private/public enterprise; forms and factors affecting choice; sole proprietorship; characteristics, advantages and disadvantages; review questions, weekend assignment, theory, reading and general evaluation. |
| `WEEK 2` | 150–307 | `5891e096feedeba9fc1ed213917891f12af24b0b8c14e31a22711de9d0870252` | Partnership definition, formation conditions/procedures, partnership deed, features, advantages/disadvantages, rights, capital sources, dissolution; review questions, weekend assignment, theory, reading and general evaluation. |
| `WEEK 3` | 308–420 | `735d3f3cc2ced579f3b6a559673008750636e889af1a6205269a9d1a443d7e61` | Types of partnership; ordinary/general partnership and partner types; limited partnership and limitations of limited partners; review questions, weekend assignment, theory, reading and general evaluation. |
| `WEEK 4` | 421–554 | `dd1110097727ffa954dcc8be94d296257ad9db36644984e03fea41fcb9281d7e` | Money, trade by barter, characteristics/qualities and functions of money, forms of money, counter trade and advantages; review questions, weekend assignment, theory, reading and general evaluation. |
| `WEEK 5` | 555–662 | `163cf262e53e74fbc2df4bc86fcf1498c3b30ec5e849918e4bb9971687e72a01` | Central Bank: introduction, features and functions; review questions, weekend assignment, theory, reading and general evaluation. |
| `WEEK 6` | 663–840 | `71e6a32821e7e6ff91a6fd0dfefaaa1dc5b58f951329d0da4d1cd56351d8dcb8` | Commercial banks: definition, characteristics, functions, account types/opening procedures, credit facilities, banking security/securities, loan vs overdraft comparison table; review questions, weekend assignment, theory, reading and general evaluation. |
| `WEEK 7 – 8` | 841–1024 | `c3cb6a7bf77497f0e8f3912b82f369f5443ed4807a874d116453b295e61a3435` | Cheque system: cheque and parties, advantages, types of cheques/crossing, effects of crossing, associated terms and dishonour reasons; review questions, weekend assignment, theory, reading and general evaluation. |
| `WEEK 9` | 1025–1224 | `72b0b59ef13b25dc5498931cad90748deb07870af63134c523bd309578e42b3d` | Negotiable instruments, bills of exchange, parties/transfer/types/advantages, dishonoured bills, noting and protest, days of grace, promissory notes, bill/cheque and bill/promissory-note comparison tables; review questions, weekend assignment, theory, reading and general evaluation. |
| `WEEK 10` | 1225–1387 | `5f6a9eef2f1b7693a1df898db954c4743de7a8110be17cf01b1522cc61f6d11a` | Other financial institutions: merchant/investment banks, development banks, functions and Nigerian examples; evaluation, weekend assignment, theory, reading assignments and general evaluation. The document ends with sample negotiable-instrument forms. |

## Structured tables and drawn visuals

Three structured comparison tables were preserved in the converted document:

| Visual | Source locator | Structure |
|---|---|---|
| Loan vs overdraft | Antiword lines 787–801; Week 6 | 7-row, 4-column comparison |
| Bill of exchange vs cheque | Lines 1132–1143; Week 9 | 9-row, 4-column comparison |
| Bill of exchange vs promissory note | Lines 1180–1192; Week 9 | 6-row, 3-column comparison |

Four drawn visual groups were identified in the rendered source:

| Visual group | Source locator | Rendered PDF | Content |
|---|---|---:|---|
| General cheque crossing | Lines 897–923 | Pages 15–16 | Parallel crossing lines and labels such as company/non-negotiable/account-payee wording |
| Special cheque crossing | Lines 918–953 | Page 16 | Special-crossing example with a named bank and crossing restriction |
| Bill of exchange specimen | Lines 1038–1071 and 1325–1361 | Page 18 | Drawn bill form with names, address, bank-style details, date and monetary value |
| Promissory note specimen | Lines 1154–1179 and 1365–1384 | Page 20 | Drawn note form with named parties, address, date, amounts and stamp elements |

The cheque/bill/note specimens contain names, addresses, bank branding, dates and monetary values. Treat these as source examples, not live banking records. Do not copy them into student-facing lessons or assets. Any replacement must use synthetic names, fictional addresses and non-operational account details, with reuse rights recorded separately.

## Source-quality and factual flags

- Current institutional names and statutory functions for the Central Bank, commercial banks, merchant banks and development banks need primary Nigerian sources with effective/reference dates.
- The examples of development banks include BOI, NARDB, Federal Mortgage Bank, Urban Development Bank, Nigerian Educational Bank and NEXIM. Some names may be legacy, inaccurate or no longer current; do not present the list as a current directory without verification.
- Cheque crossing, dishonour, days of grace, acceptance, noting/protest, bills of exchange and promissory notes are legal/payment-system concepts. Verify against the Bills of Exchange Act and current CBN/Nigerian payment-system rules before correcting or teaching current law.
- The table claim that a promissory note is not a good negotiable instrument requires legal review. Preserve source wording separately from any correction.
- Currency examples and the dated sample forms are illustrative, not current market data. Do not treat them as current prices, rates or bank procedures.
- Textbook references are pointers only; the cited books/pages were not supplied.

## Structural/parser findings (findings only; no rule written)

- The body markers are numeric week labels, including the combined `WEEK 7 – 8`; the scheme is a separate opening block and must not be parsed as teaching.
- The source has ten teaching-week labels in nine body blocks because Weeks 7–8 are combined.
- Week 11 Revision exists only in the scheme. General evaluation questions appear throughout the body, but no separate Week 11 revision body or exam paper is supplied.
- Three tables and four drawn form/diagram groups require preservation and independent visual disposition; they must not be flattened or dropped.
- No parsing rule or correction was written during this inventory.

## Edits made

- This inventory record and bounded follow-up tasks are the only intended changes for `COM-INV-T3`.
- No subject package lesson, coverage, rule, correction, asset or approval state changed.
- Testing remains deferred; this is not approval, verification or student-readiness certification.
