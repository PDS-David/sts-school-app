# BK-PRE-T1 — Bookkeeping, 1st Term preamble indexing

Status: **IMPLEMENTED_TESTING_DEFERRED** (indexing only; not approved, not verified). Testing deferred by owner.

## Inputs
- Base: origin/master `68663e49755b003ad0010680f0f0465638fe7fa6`, fetched at start on branch `ss1/bk-pre-t1-20261103`; GitHub reported two open PRs (#313 Agricultural Science, #314 Biology), neither touching Bookkeeping, and no `ss1/bk-pre-*` branch.
- Prerequisites **BK-SRC-T1** and **BK-INV-T1** are `IMPLEMENTED_TESTING_DEFERRED`.
- Original: member `SSS 1/1st Term SS1_/book keeping.docx`, **38,275 bytes**, SHA-256 `9b24550136a914c0056299abdb8aeed897244929a2c330ff3892d1fa07efdce0`, extracted in a private scratch directory after the container archive `SSS 1-20260507T072431Z-3-001.zip` matched SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`.
- Method: `word/document.xml` parsed with the Python standard library; nothing from the document is committed; no importer, plan, test, typecheck, database or device command was run.

## Locator rule (reproducible)
Block = direct child of `w:body` in `word/document.xml`, 0-based (221 children; block 220 is `w:sectPr`). Block text = concatenation of its `w:t` runs, UTF-8, no normalisation, so `w:tab` elements are omitted. Range hash = SHA-256 of the block texts first..last inclusive joined with `\n`, empty blocks included. The twelve scheme entries are manual text, not a Word list: `w:numPr` occurs **0** times in blocks 0-29 and the numbers sit in `w:t`.

## Preamble hash accounting (blocks 0-29)
Range 0-29: SHA-256 `581587fcf71c6d77b82abac943b40f79becbda4807c855bd3431cf63bc6d302b` — matches the BK-INV-T1 value. Range 0-2: `7f4562e2dedd39aaf68128dab4c242e9cd94d1ebf11fcbad47e81c3aff601e11`. Range 3-29: `7f11d856d51181796f97362d2880792427e0e25a84a71a06f212e526f6444499`. The 30 block texts contain 880 characters, no non-ASCII and no empty block.

| Block | Exact block text | Block SHA-256 | Disposition |
|---:|---|---|---|
| 0 | `FIRST TERM` | `22bdbd260a1188de74a948962e7d93d315cdd5d9010dd96be05c6b2c2d05de42` | Term framing; package source term `1st Term`; not a teaching objective |
| 1 | `SCHEME OF WORKS` | `f18d32ed6ab654bf7651da9cb1ea849eadd77bba80e666e4489a9444d9fe9a98` | Scheme heading; not a teaching objective |
| 2 | `SUBJECT: BOOK-KEEPINGCLASS: SS 1  TOPIC` | `70ce85a6e674e30a86efafe310300cf417472a62bc230c7ebf94bbe0efe96a3e` | Registered `header_text`; flattened header (four tabs, dropped by the block-text rule); alias rule `SS1-SRC-62b02f2adcb3-R001`; open item `BOOKKEEPING-ALIAS-APPROVAL` |
| 3 | `1.Revision.` | `7a903777d5427675bcd33f525cb7d451e982d9676d19f0ecfc983fc71f97813c` | Revision marker — `BK-MARK-T1-REVISION` |
| 4 | `2.Cash book` | `d5bef69726a8ec8e4d8772db7c572a86ada92bf76d9a2a0d97bb0d43a822d721` | Entry 2 — `COV-BK-T1-W01-SCHEME-2` |
| 5 | `-Measuring of single column cash book.` | `7bbe5128910316c1d10bd00f588fae53432f71124f96c18d6ca62539432ebabf` | Sub-item 2 — `COV-BK-T1-W01-SCHEME-2`; items/format `UNRESOLVED`, named by `BOOKKEEPING-T1-W01-ITEMS-MISSING` and `BOOKKEEPING-T1-W01-FORMAT-MISSING` |
| 6 | `-Items of single column cash book` | `b327c1b07f17e954d9c92ccc746ecf9618e8fcb824ae5cc1cca116ceba506ef1` | Sub-item 2 — `COV-BK-T1-W01-ITEMS` (`UNRESOLVED`); `BOOKKEEPING-T1-W01-ITEMS-MISSING` |
| 7 | `3.Single column cash book` | `583af9c3d9e3a64726e91c8bf757686823f20c520d6570c7bf9b6543773388ca` | Entry 3 — `COV-BK-T1-W01-SCHEME-3` |
| 8 | `-Preparation of single column cash book.` | `9cace5dd9f02e3e644425a8af7a51895bb822b48f2cd151f22b1e3df22cc0783` | Sub-item 3 — `COV-BK-T1-W01-SCHEME-3`; format `UNRESOLVED`; `BOOKKEEPING-T1-W01-FORMAT-MISSING` |
| 9 | `4.Preparation of single column cash-book (continues)` | `1da5ea888ede0fa3c16ee689678ca42c29863f266d1fca3346bd19b18bdb8a8a` | Entry 4 — `COV-BK-T1-W01-SCHEME-4`; title/body mismatch recorded below |
| 10 | `5.Double column cash book` | `ffb61cbdc6dd8137827c7598adf0610780d1996cc6a195fc2717c968db022b26` | Entry 5 — `COV-BK-T1-W02-SCHEME-5` |
| 11 | `-Meaning of double column cash book.` | `f801883455de37839f2031c29f5b1cc4db4a4d09f41d22d07ac349c2dbfbe6ab` | Sub-item 5 — `COV-BK-T1-W02-MEANING` |
| 12 | `-Items in double column cash book` | `95b18fa37e2062a023ff694afd07cb2321ab1d5c47d849755060daec7a3727b5` | Sub-item 5 — `COV-BK-T1-W02-ITEMS` |
| 13 | `6.Double column cash book` | `cd132870619b16dcee484abbc2feb4005251670cbf44c62f7ff41aa97080c595` | Entry 6 — `COV-BK-T1-W02-SCHEME-6` |
| 14 | `-Difference between single column cash book.` | `f9305c9a2629fd1f74df19e3953b492d4a0c7b4baf4284b0bec13858748894f7` | Sub-item 6 — `COV-BK-T1-W02-DIFF` (`UNRESOLVED`); `BOOKKEEPING-T1-W02-DIFFERENCE-MISSING`; lesson `BK-LES-T1-W02-DIFF` |
| 15 | `-Preparation of double column cash book.` | `e5818ceb257356431c8226e7de4a8d1e8af538fdc177294d1c2bb5d64c0ccc17` | Sub-item 6 — `COV-BK-T1-W02-EXAMPLE` / `BALANCE`; example unsolved; lessons `BK-LES-T1-W02-PREP`, fact task `BK-FACT-T1-W02-DEFECTS` |
| 16 | `7.Double column cash book.` | `7570480347ecf6e428976a66d0f114e1f15ebbf949344ddf69f181333b14041e` | Entry 7 — `COV-BK-T1-W02-SCHEME-7` |
| 17 | `-Preparation of double column cash book.` | `e5818ceb257356431c8226e7de4a8d1e8af538fdc177294d1c2bb5d64c0ccc17` | Sub-item 7 — **byte-identical to block 15**; same rows and `BK-LES-T1-W02-PREP` |
| 18 | `8.Contra Entry.` | `605593e0c3a42059afb7d322ad166e011b561802c8c3aec2603fa441504181a0` | Entry 8 — `COV-BK-T1-W03-SCHEME-8` |
| 19 | `-Explain contra entry` | `5a908723b3b229039a5d1b85acdb1f424b4bb1458915c443688271da0cdd5c4d` | Sub-item 8 — `COV-BK-T1-W03-EXPLAIN` |
| 20 | `-Identify contra entry` | `8c89b3c74daa8db0ce43b77a29c41cb45486d50ff069d5dd99fd3889a386aa2d` | Sub-item 8 — `COV-BK-T1-W03-IDENTIFY` / `FOLIO` |
| 21 | `-Recording contra entry` | `8d672d66edbf2aace49c132139404820f5ed5a676fc3e393eedf7abbf9b6524e` | Sub-item 8 — `COV-BK-T1-W03-RECORD-A` / `RECORD-B`; lesson `BK-LES-T1-W03-CONTRA` |
| 22 | `9.Principle of Double entry.` | `daae5ba714732fab0d5e2b741b97356a0eb4d50bcf2b4f00e45e96f42363493c` | Entry 9 — `COV-BK-T1-W04-SCHEME-9` |
| 23 | `-Meaning of Double entry` | `02eff34492fb25ae7e167e6169dbaa292f917eb1ef885bddc83456575dafd862` | Sub-item 9 — `COV-BK-T1-W04-MEANING` / `RULES` / `TWO-ACCOUNTS` |
| 24 | `-Identify the account to be credited and debited.` | `671a9fe63d8c23d995219b4e10721fd83440b8f9dfa5ad1db0c6e36d186fb454` | Sub-item 9 — `COV-BK-T1-W04-IDENTIFY` |
| 25 | `10.Principle of Double entry.` | `9e6539a5c7608b558940faf1886b35bfd5cd2126871a38941e5eb03b3d47bc83` | Entry 10 — `COV-BK-T1-W04-SCHEME-10` |
| 26 | `-Posting of transaction from cash book to ledger.` | `fe7beb7ab9998e062690862c86c6b46385a30f14c763b9727f5db7d1c0feff6b` | Sub-item 10 — `COV-BK-T1-W04-POSTING-MEANING` / `POSTING-RULES` / `ILLUSTRATION`; lesson `BK-LES-T1-W04-POSTING` |
| 27 | `-Rule of double entry.` | `5c307887771076f6d7655f18f155210577e78db77fe0ea17c5bf7d34cc4e4ccf` | Sub-item 10 — `COV-BK-T1-W04-RULES`; lesson `BK-LES-T1-W04-DOUBLE-ENTRY` |
| 28 | `11.Revision.` | `2a63828deabed8b07ba2aee44c8aec95f42a1c3e56a3d147aaf004f5ca697fc9` | Revision marker — `BK-MARK-T1-REVISION` |
| 29 | `12.Examination` | `2f860849f7d2e4301055eaaeb35d7e7d81ec252651bdd6496a56f6a41e8517e9` | Examination marker — `BK-MARK-T1-EXAM` |

No block is unaccounted. Blocks 0-2 are structure/header (no objective); blocks 3, 28 and 29 belong to the two marker items; blocks 4-27 map to existing coverage rows.

## Scheme-to-body mapping
The document has exactly four `WEEK` occurrences: block 30 `WEEK ONE `, block 87 `WEEK TWO`, block 109 `WEEK THREE`, block 158 `WEEK FOUR`. There is **no Week 5-12 body**.

| # | Entry (block) | Sub-items (blocks) | Carried by |
|---:|---|---|---|
| 1 | `Revision.` (3) | — | Marker only — `BK-MARK-T1-REVISION` |
| 2 | `Cash book` (4) | `Measuring...` (5), `Items...` (6) | Week 1 (30-86) |
| 3 | `Single column cash book` (7) | `Preparation...` (8) | Week 1 |
| 4 | `Preparation ... (continues)` (9) | — | Week 1 |
| 5 | `Double column cash book` (10) | `Meaning...` (11), `Items...` (12) | Week 2 (87-108) |
| 6 | `Double column cash book` (13) | `Difference...` (14), `Preparation...` (15) | Week 2 |
| 7 | `Double column cash book.` (16) | `Preparation...` (17) | Week 2 |
| 8 | `Contra Entry.` (18) | `Explain` (19), `Identify` (20), `Recording` (21) | Week 3 (109-157) |
| 9 | `Principle of Double entry.` (22) | `Meaning` (23), `Identify...` (24) | Week 4 (158-219) |
| 10 | `Principle of Double entry.` (25) | `Posting...` (26), `Rule...` (27) | Week 4 |
| 11 | `Revision.` (28) | — | Marker only — `BK-MARK-T1-REVISION` |
| 12 | `Examination` (29) | — | Marker only — `BK-MARK-T1-EXAM` |

Entries 2-4 -> Week 1, 5-7 -> Week 2, 8 -> Week 3, 9-10 -> Week 4. Twelve scheme entries therefore do **not** correspond one-to-one to twelve teaching weeks.

## Findings (recorded, nothing invented)
1. **Four bodies for twelve entries.** No Week 5-12 body exists in this document. New open item `BOOKKEEPING-T1-SCHEME-VS-BODY` (OWNER_ACTION, blocking) asks the owner whether the remaining weeks exist elsewhere or the four-week body is the intended term scope.
2. **Untaught sub-item.** Block 14 `-Difference between single column cash book.` has no teaching: the word `difference` occurs only in that block across the whole document, and `single column` occurs only in blocks 5-9, 14 and the Week 1 title (31), never in a Week 1 body sentence. `COV-BK-T1-W02-DIFF` is `UNRESOLVED`, named by `BOOKKEEPING-T1-W02-DIFFERENCE-MISSING`, with lesson `BK-LES-T1-W02-DIFF` pending.
3. **Duplicate sub-item.** Blocks 15 and 17 are byte-identical (`e5818ceb...ccc17`) under near-duplicate entries 6 (`6.Double column cash book`) and 7 (`7.Double column cash book.`). The preparation task is not duplicated: `BK-LES-T1-W02-PREP` is the single bounded lesson, and the Week 2 example is unsolved (`BOOKKEEPING-T1-W02-EXAMPLE-NO-SOLUTION`).
4. **Entry 4 mismatch.** Block 9 says `single column cash-book (continues)`, but the Week 1 body continues into a **bank account** definition (58) and bank-account illustration (59-80), not a single-column cash book. Recorded under `COV-BK-T1-W01-SCHEME-4` and `BOOKKEEPING-T1-W01-FORMAT-MISSING`.
5. **Scheme repetition.** Entries 5, 6 and 7 all name the double column cash book and entries 9 and 10 the principle of double entry. They are not twelve distinct topics.
6. **Flattened header.** Block 2 is one paragraph with four tabs between `SUBJECT: BOOK-KEEPING` and `CLASS: SS 1  TOPIC`; the block-text rule drops the tabs, producing `SUBJECT: BOOK-KEEPINGCLASS: SS 1  TOPIC`. It equals the registered alias anchor in mammoth form and is already the subject of `BOOKKEEPING-ALIAS-APPROVAL`.
7. **Manual numbering.** No `w:numPr` in blocks 0-29; the numbers `1.`-`12.` are literal `w:t` text and survive extraction (tabs omitted).

## Bounded follow-ups already present
Every sub-item without a body or with an unsolved body already has a precise, bounded queue item and a blocking open item, appended by the week items and reused here; BK-PRE-T1 appended none:
- Single-column items/format: `BK-LES-T1-W01-CASH-BOOK` (PENDING), `BK-FACT-T1-W01-DEFECTS` (BLOCKED), `BOOKKEEPING-T1-W01-ITEMS-MISSING`, `BOOKKEEPING-T1-W01-FORMAT-MISSING`.
- Difference and double-column preparation: `BK-LES-T1-W02-DIFF`, `BK-LES-T1-W02-PREP` (PENDING), `BK-FACT-T1-W02-DEFECTS` (BLOCKED), `BOOKKEEPING-T1-W02-DIFFERENCE-MISSING`, `BOOKKEEPING-T1-W02-EXAMPLE-NO-SOLUTION`.
- Contra: `BK-LES-T1-W03-CONTRA` (PENDING), `BK-FACT-T1-W03-DEFECTS` (BLOCKED).
- Double entry and posting: `BK-LES-T1-W04-DOUBLE-ENTRY`, `BK-LES-T1-W04-POSTING` (PENDING), `BK-FACT-T1-W04-BRIEF`, `BK-FACT-T1-W04-TEXTBOOK` (BLOCKED).
- Markers: `BK-MARK-T1-REVISION`, `BK-MARK-T1-EXAM` (PENDING; both now the first runnable items).

## Edits
- `backend/src/db/ss1/subjects/bookkeeping.json`: appended one open item, `BOOKKEEPING-T1-SCHEME-VS-BODY` (OWNER_ACTION, `blocks_delivery: true`, four scheme coverage rows as affected IDs). No coverage, source, rule, lesson, correction, asset or status changed. Coverage remains 40, open items 26 -> 27, lessons 0, `package_status` PENDING.
- `docs/ss1/work/microtasks/bookkeeping/QUEUE.json`: `BK-PRE-T1` -> `IMPLEMENTED_TESTING_DEFERRED`, original inventory reference preserved and the indexing result appended; `next_runnable` had `BK-PRE-T1` removed (now exactly the 29 PENDING items, head `BK-MARK-T1-REVISION`); `status_counts` 10 implemented / 29 pending / 6 blocked; one note appended. Items remain 45 and no item was added, removed or reordered.
- This file. No shared schema, compiler, importer, parser, route or other-subject file touched.

## Checks
- Archive SHA-256 and member SHA-256 verified before parsing; member bytes 38,275.
- 221 `w:body` children; range 0-29 hash equals the BK-INV-T1 value; each of the 30 block hashes recorded above; range 0-2 and 3-29 recorded.
- `w:numPr` count in blocks 0-29 = 0; `WEEK` occurrences in the whole document = 4 (blocks 30, 87, 109, 158); `difference` occurrences = 1 (block 14); `single column` occurrences = 7 (blocks 5-9, 14, 31).
- JSON re-serialised with the existing 2-space, non-ASCII-preserving, CRLF convention and asserted byte-identical after re-load; all open-item affected IDs resolve to existing coverage, lesson, queue or source IDs; open-item IDs unique.
- Queue `next_runnable` set equals the PENDING set (29); status counts recomputed from items; BK-PRE-T1 reference prefix preserved.
- Nothing run: no importer, plan, test, typecheck, database or device command. Testing remains deferred.

## Remaining
`BK-MARK-T1-REVISION` and `BK-MARK-T1-EXAM` are now first. The owner decisions `BOOKKEEPING-ALIAS-APPROVAL`, `BOOKKEEPING-T2-TEXT-MATCHES-T1` and the new `BOOKKEEPING-T1-SCHEME-VS-BODY` remain open. This does not claim the subject or class complete.
