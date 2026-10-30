# BK-WK-T1-W02 — Bookkeeping, 1st Term, Week 2 objective indexing

Status: **IMPLEMENTED_TESTING_DEFERRED** (implemented; not approved, not verified). Testing deferred by owner. Week 2 is **not delivered**: 7 coverage entries are PARTIAL and 2 are UNRESOLVED, and the missing comparison, the unsolved example, the untaught balancing and the contra sequencing are appended as bounded tasks.

## Inputs
- Base: `origin/master` `f0a796475987a72f81bf0498be5b7551d4dcafb2`, the master current when work started (PRs #257, #259, #260 and #261 had merged; PR #262 remained open on the Yoruba files, so Bookkeeping was free of the single-writer collision).
- Prerequisites `BK-SRC-T1` and `BK-INV-T1` are `IMPLEMENTED_TESTING_DEFERRED`. The package held 0 coverage entries before this task.
- Source `SS1-SRC-62b02f2adcb3`, manifest member `SSS 1/1st Term SS1_/book keeping.docx`, 38,275 bytes, SHA-256 `9b24550136a914c0056299abdb8aeed897244929a2c330ff3892d1fa07efdce0`, re-verified this run against the supplied archive (SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`). Nothing from the archive or the extract is committed.
- Method: Python stdlib `zipfile` + `xml.etree.ElementTree` over `word/document.xml` of the verified member. A block is a direct child of `w:body`, 0-based (blocks 0-219; block 220 is `w:sectPr`); block text is the concatenation of its `w:t` runs with `w:tab` omitted; a range hash is the SHA-256 of the block texts first..last inclusive joined with `\n`, empty blocks included. The importer, parser and compiler were not run; the inventory's parsed-row values are quoted from `BK-INV-T1` and not re-derived.

## Scheme mapping
- The scheme is the preamble list at blocks 0-29 (range SHA-256 `581587fcf71c6d77b82abac943b40f79becbda4807c855bd3431cf63bc6d302b`): twelve numbered entries, no week numbers.
- Week 2 is the second labelled week (block 87 `WEEK TWO`) and is the only week whose body defines the double column cash book, so entries 5-7 (blocks 10-17, range SHA-256 `eeca75c3fe7c2f98f294472585990146b25512a7d834a85f5ab21a1bd6ec303f`) map to it by label order and by topic.

| Scheme entry | Blocks | Range SHA-256 | Text |
|---|---|---|---|
| 5 | 10-12 | `af820d7350176e7c73a31ad9aebe92a2b98e387837bc44e8ae252234db0a0189` | `5.Double column cash book`; `-Meaning of double column cash book.`; `-Items in double column cash book` |
| 6 | 13-15 | `5e226de310583020debfaae32f84b55afc519cd97b20632b8569044b0972a1ff` | `6.Double column cash book`; `-Difference between single column cash book.`; `-Preparation of double column cash book.` |
| 7 | 16-17 | `5002456ae48f4ababa65f4c2fe7f86c2c7ab41319d9dfa31edf3406731754074` | `7.Double column cash book.`; `-Preparation of double column cash book.` |

- Block 17 is byte-identical to block 15 (`e5818ceb257356431c8226e7de4a8d1e8af538fdc177294d1c2bb5d64c0ccc17`): entry 7 restates entry 6's preparation sub-item and adds nothing.
- The scheme words the topic three times for one teaching week. The body has one heading (`DOUBLE COLUMN CASH BOOK`, block 88), one meaning, two entry rules and one unsolved example: the three entries are indexed as three objectives against that single body, not as three bodies.

## Section
- `WEEK TWO`, block 87, SHA-256 `88b3326818ebf3577b66bea2ea4fa2f670e9335dbeaf07bbe3729906fa939df6`; section blocks 87-108, range SHA-256 `ed00cfec8ef42cc9b1b02f35df0d866d77d2b5560db48a295b3e35dff3496218`, 22 blocks, 1,114 characters of block text (1,135 including the 21 joining newlines).
- Parts: label 87; heading 88 `DOUBLE COLUMN CASH BOOK` (`6cc6e346f1e66d4d8dfb36bc6da9dc9a3a77fd402a833dbeb8536966262df867`); meaning 89 (`3a8acf3d47622167f3591dffda4f919431925d2c8e92779832662b3131e5b16c`, 247 characters); heading 90 `Accounting Entries`; rules 91-92 (range `3f86c2bd635d757b6a3e7c7da0daf81d388fa063903990fd17a69eea3d4516e0`); `Example:` 93 and instruction 94; placeholder year 95 `19x9` (`9a0adea5a3daa4b083fcd92f2645b188884efb89f8fd30a82bfe913f947d55d3`); nine transactions 96-104 (range `2ba067dca64e73480a72396b6182127fd34d2f691f0914392f1b7421d2e061ae`); empty blocks 105-108 (range `6a3cf5192354f71615ac51034b3e97c20eda99643fcaf5bbe6d41ad59bd12167`).
- Inventory parsed row (mammoth raw text, regex replication only, importer not run): title `DOUBLE COLUMN CASH BOOK`, body 1,148 characters, body SHA-256 `bb5f26395bbe6ce4bae80f128748821df86b6895d8a4a4e87ead79c6d31f2e4b`. The character count differs from the 1,114 block-text characters because mammoth keeps `w:tab` elements as tabs and joins paragraphs differently; no parsed-row identity is declared in the package.
- Week 2 contains no Word table, drawing, image, OLE object, equation or media file. The document's three tables sit at blocks 122, 135 (Week 3) and 175 (Week 4); its eight drawing objects at blocks 49, 56, 70, 79 (Week 1) and 170 (Week 4). No VISUAL_DISPOSITION item is raised for this week.

## Coverage entries added (9)
| ID | Objective | Locator | Status |
|---|---|---|---|
| `COV-BK-T1-W02-SCHEME-5` | Scheme entry 5: meaning and items | scheme 10-12; body 87-108 | PARTIAL |
| `COV-BK-T1-W02-SCHEME-6` | Scheme entry 6: difference and preparation | scheme 13-15; body 87-108 | PARTIAL |
| `COV-BK-T1-W02-SCHEME-7` | Scheme entry 7: preparation | scheme 16-17; body 87-108 | PARTIAL |
| `COV-BK-T1-W02-MEANING` | Meaning: cash and bank columns on each side | body 88-89 | PARTIAL |
| `COV-BK-T1-W02-ITEMS` | Items: the cash and bank columns and what they record | body 89-92 | PARTIAL |
| `COV-BK-T1-W02-ENTRIES` | Accounting entries: cash/cheque payments and the withdrawal | body 90-92 | PARTIAL |
| `COV-BK-T1-W02-DIFF` | Difference between single and double column cash book | scheme 14 only | UNRESOLVED |
| `COV-BK-T1-W02-EXAMPLE` | Worked example: nine April transactions, balanced | body 93-104 | PARTIAL |
| `COV-BK-T1-W02-BALANCE` | Balancing the two-column book and bringing balances down | body 94; no demonstration | UNRESOLVED |

The 7 PARTIAL entries mean the source teaches the objective in part (or sets the exercise) but no deliverable lesson exists and the defects below must be corrected before teaching. The 2 UNRESOLVED entries mean the objective is in the scheme but no body teaches it.

## What the week teaches
| Part | Taught | Withheld |
|---|---|---|
| Meaning | Two columns, one cash and one bank, on both the debit and credit sides; used for mixed cash and bank transactions (89) | No illustration, no naming of the book as a ledger account, no contrast with the single column book |
| Items | The two columns and their contents in outline (89), payment-side rules (91-92) | No item list, no column headings, no discount column, no opening or closing balance lines, no statement that credit transactions are excluded |
| Entries | Cash payment credited to the cash column; cheque payment credited to the bank column (91); bank withdrawal debits cash and credits bank (92) | No receipt-side entries; no examples under either rule; block 92's withdrawal wording conflicts with the direct cheque payment at 104 |
| Example | Instruction (94), nine dated transactions (96-104) under `19x9` (95) | No solution, no totals, no balances, no folio marks; blocks 105-108 empty |
| Assessment | None | No questions, no answers, no marking scheme for Week 2 |

## Source defects (open item `BOOKKEEPING-T1-W02-SOURCE-DEFECTS`)
| # | Block | Defect |
|---|---|---|
| 1 | 89 | `The two column Cash book so-called because` has no verb; the book is called `two column` where the scheme and heading say `double column`; `transaction` is singular for several transactions |
| 2 | 90-92 | `Accounting Entries` introduces two payment-side rules only; no receipt-side entry is stated |
| 3 | 92 | The withdrawal case is illustrated with wages, which conflicts with block 104 `Wages paid by cheque N75` (a direct cheque payment, not a withdrawal) |
| 4 | 94 | No business name, no opening balances, and no statement that each column is balanced separately |
| 5 | 95 | `19x9` is a placeholder year; no term or opening date is given |
| 6 | 96-104 | No folio column is used, and block 104 alone ends with a full stop |
| 7 | 105-108 | Four empty blocks close the week: no solution and no assessment |

No correction wording is authored here; the lessons must not copy the uncorrected text.

## Contra dependency
Two of the nine transactions move money between cash and bank: `April 4: Paid N1,850 of the capital into bank` (block 97, `fae83f79ab16560d9edbbc9dcf5a09fb6421ae6741d5678c485606c916e4d542`) and `April 29: Cash paid into bank N1,000` (block 103, `7d34d6ef7381c46f9c155cc5b5a8607ef6412c9675f7d6039971b60013aaf977`). Both are contra entries, while the scheme schedules contra entry as entry 8 (blocks 18-21), after this week; Week 2 never mentions contra, the folio column or the `C` folio. Recorded as `BOOKKEEPING-T1-W02-CONTRA-SEQUENCING` and booked for decision in `BK-FACT-T1-W02-DEFECTS`.

## Queue changes
- `BK-WK-T1-W02` → `IMPLEMENTED_TESTING_DEFERRED`.
- Appended 3 items:
  - `BK-LES-T1-W02-DIFF` (LESSON, PENDING) - the untaught single-vs-double comparison; depends on `BK-WK-T1-W01` for the single column content.
  - `BK-LES-T1-W02-PREP` (LESSON, PENDING) - the prepared and balanced solution to the example plus practice; depends on `BK-PRES-T1-WORKED`.
  - `BK-FACT-T1-W02-DEFECTS` (FACTUAL_DEPENDENCY, BLOCKED) - one recorded decision on the seven defects, the contra treatment and the placeholder year.
- Counts: items 34 → 37; kinds add LESSON 2 and FACTUAL_DEPENDENCY 1; status 6 implemented / 29 pending / 2 blocked; notes 11 → 12; coverage 0 → 9; open items 4 → 9; `next_runnable` loses `BK-WK-T1-W02` and begins `BK-WK-T1-W04`.

## Limits
- Indexing only: no lesson authored, no source rule added, no asset, no package delivery change, no schema, compiler, parser or importer edit, no importer or plan run. `bookkeeping.json` was edited only to add the nine coverage entries and five open items. Testing deferred by owner.
- Not approved and not verified. Week 2 is not complete: two objectives are untaught, the example has no solution, the balancing method is never demonstrated and two transactions depend on contra entry, which the scheme schedules later.
- The five open items opened by this task are `BOOKKEEPING-T1-W02-DIFFERENCE-MISSING`, `BOOKKEEPING-T1-W02-BALANCING-UNTAUGHT`, `BOOKKEEPING-T1-W02-EXAMPLE-NO-SOLUTION`, `BOOKKEEPING-T1-W02-CONTRA-SEQUENCING` and `BOOKKEEPING-T1-W02-SOURCE-DEFECTS`. Each names its own follow-up; none is closed by this note.
- Every hash cited in this note, in the coverage entries, in the open items and in the new queue items was re-computed from the verified member during this run.
