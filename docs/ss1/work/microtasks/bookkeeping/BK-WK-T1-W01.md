# BK-WK-T1-W01 — Bookkeeping, 1st Term, Week 1 objective indexing

Status: **IMPLEMENTED_TESTING_DEFERRED** (implemented; not approved, not verified). Testing deferred by owner. Week 1 is **not delivered**: 9 coverage entries are PARTIAL and 2 are UNRESOLVED, and the missing items, the missing single column format, the untaught balancing and the absent exercise are appended as bounded tasks.

## Inputs
- Base: `origin/master` `017b172` (merge of PR #271, Bookkeeping Week 4). No open PR touched the Bookkeeping package or queue when work started; the Yoruba Week 5 PR (#274) is open on other files.
- Prerequisite `BK-SRC-T1` and `BK-INV-T1` are `IMPLEMENTED_TESTING_DEFERRED`.
- Source `SS1-SRC-62b02f2adcb3`, manifest member `SSS 1/1st Term SS1_/book keeping.docx`, 38,275 bytes, SHA-256 `9b24550136a914c0056299abdb8aeed897244929a2c330ff3892d1fa07efdce0`, re-verified this run against the supplied archive (SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`). Nothing from the archive or the extract is committed.
- Method (private, outside Git): Python stdlib `zipfile` + `lxml.etree` over `word/document.xml` of the verified member. A block is a direct child of `w:body`, 0-based (blocks 0-220; block 220 is `w:sectPr`); block text is the concatenation of its `w:t` runs with `w:tab` omitted; a range hash is the SHA-256 of the block texts first..last inclusive joined with `\n`, empty blocks included. The importer, parser and compiler were not run.

## Scheme mapping
- The scheme is the preamble list at blocks 0-29 (range SHA-256 `581587fcf71c6d77b82abac943b40f79becbda4807c855bd3431cf63bc6d302b`, 880 characters): twelve numbered entries with no week numbers.
- Week 1 is the first labelled week (block 30 `WEEK ONE `). Scheme entry 1 (`Revision`, block 3) has no body and is not carried by this week; entries 2-4 map to it by label order and topic.

| Scheme entry | Blocks | Range SHA-256 | Text |
|---|---|---|---|
| 2 | 4-6 | `2fb2e055f03ddf888eb4c12a792b1dc354e0dad5cc6277b837a357b68106ea0e` | `2.Cash book`; `-Measuring of single column cash book.`; `-Items of single column cash book` |
| 3 | 7-8 | `324140ef4425dab006678c59bd2d0648b998385fe02dbc6d2127b1c5f4bbe409` | `3.Single column cash book`; `-Preparation of single column cash book.` |
| 4 | 9 | `1da5ea888ede0fa3c16ee689678ca42c29863f266d1fca3346bd19b18bdb8a8a` | `4.Preparation of single column cash-book (continues)` |

- `Measuring` in block 5 appears to intend `Meaning`; the word is recorded as printed.
- Entries 2-4 together name one topic: the single column cash book, its items and its preparation over two lessons. The body covers the meaning and two preparations, but not the items and not the book format.
- The twelve scheme entries carry no week numbers, so the mapping to Week 1 rests on label order and topic alone; the term-wide mapping is `BK-PRE-T1` (PENDING).

## Section
- `WEEK ONE `, block 30, SHA-256 `d6daf1e694c6b67d3872739f78e9ed66d657349d3adba8de1bdc261001e1fef8`; section blocks 30-86, range SHA-256 `0aa3088772e53f5e135529b39c31129af5dee4b4019ac1cdfb0758aaa96cf6d3`, 57 blocks, 1,721 characters of block text. Both values equal the BK-INV-T1 measurements.
- Parts: block 30 the label; block 31 the topic `1.0.Topic: Single Column cash book` (`117580cd35c80468257f6b052f67761645cfebe2f97e60d0975f8ce7d1c842fd`); blocks 33-34 the introduction (`e0e73db149a8e950a9762ca9e8930f1023aa7f194118615b3c0f8fdd40eac9db`); block 36 the cash account (`5da149f2ada3277cd07127cecf11dceddcdc84d4c4a0acb32d402ac0a6db8f6b`); blocks 37-48 Illustration 1 question (`82ab7015b5e6a78452764d28f3f6a77419ed676234a73ae8ee43c236eef78054`) and blocks 49-57 solution (`c6cc1788f5cf6a2b3cf0f985d9fa3e172bd20c82610ec0d8066a725343519ccc`); block 58 the bank account (`d786b6745b91b0f1b1d0440d640294494a4d4d50555ecf75814996a19feb2bf9`); blocks 59-69 Illustration 2 question (`39c4f48ca9399b168348d14c007e7fc75d150e87f77ff6dac8971c45a1aed492`) and blocks 70-80 solution (`4217801cae93fd2979dd22162e95b5db4a0b709168796ddde63e32020d61491c`); blocks 81-86 blank.
- The section is entirely ASCII and contains no tab character in block text. The account rules are drawing objects at blocks 49, 56 (two each) and 70 (two) and 79 (one), not Word tables; Week 1 has no table. No VISUAL_DISPOSITION item is raised here because `BK-VIS-T1-TACC-W01` already covers the layouts.

## Coverage entries added (11)
| ID | Objective | Locator | Status |
|---|---|---|---|
| `COV-BK-T1-W01-SCHEME-2` | Scheme entry 2: cash book meaning and items | scheme 4-6; body 30-86 | PARTIAL |
| `COV-BK-T1-W01-SCHEME-3` | Scheme entry 3: single column cash book and preparation | scheme 7-8; body 30-86 | PARTIAL |
| `COV-BK-T1-W01-SCHEME-4` | Scheme entry 4: preparation continues | scheme 9; body 30-86 | PARTIAL |
| `COV-BK-T1-W01-MEANING` | Meaning of the cash book and the no-credit rule | body 33-34 | PARTIAL |
| `COV-BK-T1-W01-ITEMS` | Items of the single column cash book | scheme 6 only | UNRESOLVED |
| `COV-BK-T1-W01-FORMAT` | Ruling and format of the single column cash book | body 49-57, 70-80 | UNRESOLVED |
| `COV-BK-T1-W01-CASH-ACCOUNT` | The cash account and its debit/credit rule | body 36 | PARTIAL |
| `COV-BK-T1-W01-BALANCING` | Balancing: balance c/d and b/d | body 56-57, 78 | PARTIAL |
| `COV-BK-T1-W01-ILLUS-1` | Illustration 1: eight July transactions, cash account | body 37-57 | PARTIAL |
| `COV-BK-T1-W01-BANK-ACCOUNT` | The bank account and its cheque rule | body 58 | PARTIAL |
| `COV-BK-T1-W01-ILLUS-2` | Illustration 2: six June transactions, bank account | body 59-80 | PARTIAL |

PARTIAL means the source teaches the objective (or prints the worked example) but no deliverable lesson exists and the defects below must be corrected first. UNRESOLVED means the scheme names the objective but the body supplies no teaching.

## What each part teaches
| Part | Teaching | Exercise |
|---|---|---|
| Cash book | 33: the book for receipts and payments in cash or cheque; 34: no credit transaction | none |
| Cash account | 36: account for money received and paid in cash; balance called cash in hand; receipts debited, payments credited | Illustration 1 |
| Illustration 1 | 37-48: opening 1,500 and seven dated transactions for Olaide | solution 49-57 |
| Bank account | 58: record of deposits and withdrawals; cheques received debited, cheques issued credited | Illustration 2 |
| Illustration 2 | 59-69: opening 2,500 and five dated June transactions, one without an amount | solution 70-80 |
| Items | none: the scheme sub-item at block 6 has no body | none |
| Format | none: both solutions are T-accounts with Dr/Cr lines and drawn rules | none |
| Balancing | 56 and 78 print c/d and b/d balances without a rule | none |

## Source defects (open item `BOOKKEEPING-T1-W01-SOURCE-DEFECTS`)
| # | Block | Defect |
|---|---|---|
| 1 | 49 | `DRCASH ACCOUNTCR` runs Dr and Cr together; 70 uses `DRBANK ACCOUNT   CR`, so the layouts differ |
| 2 | 51-56 | No fixed spacing between particulars and amounts; columns separated by three to five spaces |
| 3 | 52 | `Purchaser` misspells purchases and prints 750 where the question (43) says 700 |
| 4 | 53 | Prints 115 where the question (47) says 155 |
| 5 | 56 | `Bal. c/d1,010` has no space; 1,010 is 90 below the 1,100 the question gives |
| 6 | 57 | Totals `2,1152,115` run together and pair with the wrong figures |
| 7 | 39, 61 | Column heading is only `N`; no debit and credit column labels beyond the Dr/Cr line |
| 8 | 62 | Bank account opened with `Cash in hand2,500` rather than a bank balance |
| 9 | 66 | June 7 cheque to Komolafe has no amount |
| 10 | 67 | June 9 cheque purchase of 300 omitted from the solution |
| 11 | 73-76 | Credit side repeats Illustration 1 July entries and amounts; only the 650 belongs to this question |
| 12 | 78 | `Bal. b/d 1,910` and `Bal. c/d1,010` unexplained; the c/d is copied from Illustration 1 |
| 13 | 80 | `3,1803,180` runs together; credit items are 1,505 + 1,010 = 2,515, so the equality is false |
| 14 | 72 | `June 1 bal. b/f2,500` uses b/f for an opening balance, normally b/d |

No correction wording is authored here; the lesson must not copy the printed solutions unverified.

## Figure checks (open item `BOOKKEEPING-T1-W01-FIGURE-CHECKS`)
- Illustration 1: receipts 1,500 + 500 + 155 = **2,155**; payments 250 + 700 + 50 + 30 + 25 = **1,055**; closing balance **1,100**. The printed solution totals 2,115 on both sides using 115 for 155, 750 for 700 and a 1,010 balance: it balances with itself but not with the question.
- Illustration 2: receipts 2,500 + 450 + 230 = **3,180**; known payments 650 + 300 = **950**; closing balance **2,230**, with June 7 unquantified. The printed solution credits 650 + 750 + 50 + 30 + 25 = 1,505 plus 1,010 = 2,515 and prints 3,180 on both sides; the 1,910 at block 78 has no derivation.
- No figure in either solution can be reused without being re-derived and shown.

## Notation and visuals
- Blocks 30-86 contain **zero non-ASCII characters** and **zero tab characters**: the naira is a bare `N` in the headings at 39, 50, 61 and 71, as recorded by `BK-PRES-T1-CURRENCY`. No mark, symbol or figure was normalized.
- The two account layouts are drawing objects at blocks 49, 56, 70 and 79, not Word tables. The document's Word tables sit at blocks 122, 135 and 175 and belong to Weeks 2-4. The Week 1 layouts are already disposed of by `BK-VIS-T1-TACC-W01`.

## Assessment and references
- Week 1 sets no exercise, assignment or question; both illustrations are printed with solutions. No answer key, mark allocation or completion criterion exists, so no assessment entry is created. Recorded as `BOOKKEEPING-T1-W01-NO-EXERCISE`.
- There is no external reference, textbook page or citation in Week 1, so no external-text item is raised.

## Queue changes
- `BK-WK-T1-W01` -> `IMPLEMENTED_TESTING_DEFERRED`; its `Not yet indexed…` reference replaced.
- Appended 2 items depending on `BK-SRC-T1` and `BK-WK-T1-W01`: `BK-LES-T1-W01-CASH-BOOK` (LESSON, PENDING, also depending on `BK-PRES-T1-WORKED` and `BK-FACT-T1-W01-DEFECTS`) and `BK-FACT-T1-W01-DEFECTS` (FACTUAL_DEPENDENCY, BLOCKED).
- Counts: items 41 -> 43; LESSON 4 -> 5 and FACTUAL_DEPENDENCY 4 -> 5; coverage 22 -> 33; open items 15 -> 21; source_rules 3; lessons 0; status 8 implemented / 30 pending / 5 blocked; `next_runnable` head -> `BK-WK-T1-W03`.

## Limits
- Indexing only: no lesson authored, no source rule added, no asset, no package delivery change, no schema, compiler, parser or importer edit, no importer or plan run. `bookkeeping.json` was edited only to add coverage and open items.
- Not approved and not verified. Two objectives have no teaching, no pupil exercise exists, and both printed solutions are arithmetically wrong against their own transaction lists.
- The six open items opened by this task are `BOOKKEEPING-T1-W01-SOURCE-DEFECTS`, `BOOKKEEPING-T1-W01-FIGURE-CHECKS`, `BOOKKEEPING-T1-W01-ITEMS-MISSING`, `BOOKKEEPING-T1-W01-FORMAT-MISSING`, `BOOKKEEPING-T1-W01-BALANCING-UNTAUGHT` and `BOOKKEEPING-T1-W01-NO-EXERCISE`. None is closed by this note.
