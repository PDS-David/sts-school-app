# BK-WK-T1-W03 — Bookkeeping, 1st Term, Week 3 objective indexing

Status: **IMPLEMENTED_TESTING_DEFERRED** (implemented; not approved, not verified). Testing deferred by owner. Week 3 is **not delivered**: all 7 coverage entries are PARTIAL, the definition at block 113 states the opposite of the rule the week's own examples apply, the first example's figures do not reconcile and the week sets no exercise.

## Inputs
- Base: cut from `origin/master` `1764f62` (merge of PR #281, app/data-01-finance-transaction) and rebased onto `aee5120` (merge of PR #284, YO-WK-T3-W06) before opening. No open PR touched the Bookkeeping package or queue.
- Prerequisites `BK-SRC-T1` and `BK-INV-T1` are `IMPLEMENTED_TESTING_DEFERRED`.
- Source `SS1-SRC-62b02f2adcb3`, manifest member `SSS 1/1st Term SS1_/book keeping.docx`, 38,275 bytes, SHA-256 `9b24550136a914c0056299abdb8aeed897244929a2c330ff3892d1fa07efdce0`, re-verified this run against the supplied archive (SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`). Nothing from the archive or the extract is committed.
- Method (private, outside Git): Python stdlib `zipfile` + `lxml.etree` over `word/document.xml` of the verified member. A block is a direct child of `w:body`, 0-based (blocks 0-220; block 220 is `w:sectPr`); block text is the concatenation of its `w:t` runs with `w:tab` omitted; a range hash is the SHA-256 of the block texts first..last inclusive joined with `\n`, empty blocks included. Table orientation was read from `w:tc` cells, not from flattened block text. The importer, parser and compiler were not run.

## Scheme mapping
- The scheme is the preamble list at blocks 0-29 (range SHA-256 `581587fcf71c6d77b82abac943b40f79becbda4807c855bd3431cf63bc6d302b`, 880 characters): twelve numbered entries with no week numbers.
- Week 3 is the third labelled week (block 109 `WEEK THREE `). Scheme entry 8 is `8.Contra Entry.` with three sub-items, and Week 3 is the only body that names contra.

| Scheme entry | Blocks | Range SHA-256 | Text |
|---|---|---|---|
| 8 | 18-21 | `b4c3675b322d919a77f8b9dc26366c102255418656c15111b5b3c2b712d3e8a9` | `8.Contra Entry.`; `-Explain contra entry`; `-Identify contra entry`; `-Recording contra entry` |

- Block 18 alone is `605593e0c3a42059afb7d322ad166e011b561802c8c3aec2603fa441504181a0` (15 characters); blocks 19-21 together are `296958eab046e8aa7574a68fc542864ccafab97b28b15df86098e3444c00c91d` (68 characters).
- The twelve scheme entries carry no week numbers, so the mapping to Week 3 rests on label order and topic alone; the term-wide mapping is `BK-PRE-T1` (PENDING).

## Section
- `WEEK THREE `, block 109, SHA-256 `9a970d2a5cd0bee91213221e6275188baf1dd13c1f90530302e9dbc234cf3b51` (10 characters); section blocks 109-157, range SHA-256 `f82efa6d2cfe027ab42113ec3d4781f3852d5b91a9527aff9863f286a0b58997`, 49 blocks, 1,362 characters of block text.
- 23 of the 49 blocks carry text and 26 are empty: blocks 123, 125, 128, 129 and the whole of 136-157. Both values reproduce the BK-INV-T1 measurements.
- Parts:

| Part | Blocks | SHA-256 | Characters |
|---|---|---|---|
| Label | 109 | `9a970d2a5cd0bee91213221e6275188baf1dd13c1f90530302e9dbc234cf3b51` | 10 |
| Heading `CONTRA ENTRY` | 110 | `c4a1f9c685d7291ea019e08f6b00a9bf1e49150feb39d0e7a2dba5f18334ba26` | 12 |
| Definition | 111-113 | `ea3f1b450e4001fcda10161cfa809cf821936497a530a3f8ead7bf54ec5b9d72` | 353 |
| — latin-word sentence | 111 | `7cf4798488d8862d3049c68c4deaff32799d35136baf5f4d036a5a27893e80ff` | 154 |
| — folio sentence | 112 | `719ff225f6361ae3ea42dcfff41978fccbf8ee0659f963479b76a461313aa9dd` | 101 |
| — identical-side sentence | 113 | `13f67fc44e12b751cab49ef74f630d855fc25ad1de7b46ced1a29de10877a7c7` | 96 |
| (a) payment of cash to bank | 114-115 | `19408ee162179f7c8d64ed4ae2610328323cff386dc6ae98d53c3673361fd43b` | 114 |
| Effect/Action pair a | 116-118 | `e15629e27c6aa6b9b23726e4ccb36f49cdab08e51057d1083c9dfceb26c8012a` | 103 |
| Example (a) | 119-120 | `2ebd7521de05ff26bb2a1bd74a7858de613d06b9a58115c4a8a6c45c62b63f0d` | 84 |
| `DrCash BookCr` and table | 121-122 | `e16c3df4c979444fee32970bba99015955a1adfd1226fd5eb6cb2d7adbbbfa2e` | 130 |
| — table | 122 | `50f7bcab93db04a2fa33854ba34f46d6e95918e4455540913256e0bd02990bb8` | 116 |
| Folio note | 124 | `c7b640d72b698fec5e0eacb18415e915dad110e1a82fcaee2c047c505efa160a` | 62 |
| (b) withdrawals from bank | 126-127 | `1e8586577c6046518f209b00512050f11b7efca2049f02db6985ce681761731d` | 200 |
| Effect/Action pair b | 130-132 | `f10a8f06ecaae33e871693696d30a2b6756671ecd59eae459a64bcf21bdf589a` | 107 |
| Example (b), `Dr Cr` and table | 133-135 | `d8712897f37d3fac9bf31732cdee21c39d30aff853b900a0f054b447202badbd` | 151 |
| — table | 135 | `bc543e99e8376f0fe5228f6c3310772051ac2dcd1c71bb8bb96202015256fcc7` | 88 |

- Block 116 is byte-identical to block 130 (`1db4bc45a5efc035e858390ba776222e60cb197f34071115e157e232365c432c`, 21 characters): the `EffectAction Required` heading is reused verbatim.

## Coverage entries added (7)
| ID | Objective | Locator | Status |
|---|---|---|---|
| `COV-BK-T1-W03-SCHEME-8` | Scheme entry 8: contra entry — explain, identify, record | scheme 18-21; body 109-157 | PARTIAL |
| `COV-BK-T1-W03-EXPLAIN` | The meaning of a contra entry | body 111-113 | PARTIAL |
| `COV-BK-T1-W03-IDENTIFY` | Identifying a contra: which balance falls or rises, which column is debited or credited | body 116-118, 130-132 | PARTIAL |
| `COV-BK-T1-W03-FOLIO` | The `C` folio mark, written on both sides | body 112, 124 | PARTIAL |
| `COV-BK-T1-W03-RECORD-A` | Recording a payment of cash into the bank: example 119-120 and table 122 | body 119-124 | PARTIAL |
| `COV-BK-T1-W03-RECORD-B` | Recording a withdrawal of cash from the bank: example 133 and table 135 | body 126-127, 133-135 | PARTIAL |
| `COV-BK-T1-W03-RULE` | The posting rule that makes an entry a contra | body 116-118, 130-132, 124 | PARTIAL |

PARTIAL means the source names and teaches the objective but the teaching is defective or incomplete, no deliverable lesson exists and the defects below must be decided first. Nothing in this week is UNRESOLVED: all three scheme sub-items have a body, unlike Weeks 1, 2 and 4.

## What each part teaches
| Part | Teaching | Example or exercise |
|---|---|---|
| 111 | contra as a latin word: cash withdrawn from the office and deposited in the bank, or cash withdrawn from the bank for office use | none |
| 112 | contra as an entry involving the payment of cash into the bank, denoted by `C` in the folio column | none |
| 113 | contra as the transfer of an account to "the identical side" of another account | none |
| 114-115 | direction (a): payment of cash to bank; when too much cash is in the office, the whole or part can be paid in | none |
| 116-118 | effect: cash balance decreased, `Cr. Cash column`; bank balance increased, `Dr. Bank column` | none |
| 119-122 | Jan. 1 cash balanced N300; Jan. 2 N710 paid into the bank; cash book with `C` in the folio of both sides | worked, no solution text |
| 124 | `C` must be put on both sides to represent a contra entry | none |
| 126-127 | direction (b): withdrawals from bank for office use when there is insufficient cash | none |
| 130-132 | effect: bank balance decreases, `Cr. Bank column`; cash balance increases, `Dr. Cash column` | none |
| 133-135 | Jan. 4 withdrew N800 from bank; cash book `Dr Cash 800` against `Cr Bank 800` | worked, no solution text |

## Table orientation (read from `w:tc`, not from flattened text)
- Block 122, four rows of ten cells (`Date`, `Particulars`, `Folio`, `Cash`, `Bank` twice), row 1 the bare currency cells `N`, row 2 `Jan. 1 | Cash | C | — | 300` against `Jan. 1 | Bank | C | 300 | —`, row 3 the same with 710. The amount sits in the **Bank** cell on the debit side and in the **Cash** cell on the credit side: **Dr Bank / Cr Cash**, correct for money paid into the bank.
- Block 135, three rows of ten cells, row 2 `Jan. 4 | Bank | C | 800 | —` against `Jan. 4 | Cash | C | — | 800`: **Dr Cash / Cr Bank**, correct for a withdrawal.
- Both tables are Word tables and are disposed of by `BK-VIS-T1-TBL-W03`, which also covers the two flattened `EffectAction Required` pairs. The earlier reading of the flat block text of 122 (which suggests Dr Cash) is the wrong orientation; the cells settle it.

## Source defects (open item `BOOKKEEPING-T1-W03-SOURCE-DEFECTS`)
| # | Block | Defect |
|---|---|---|
| 1 | 111 | A single 154-character run-on sentence calls contra "a latin word" and never says two accounts are affected |
| 2 | 112 | Limits contra to the payment of cash into the bank, contradicting 126-135; wraps `C` in curly double quotes |
| 3 | 113 | "the transfer of an account to the identical side of another account" — the opposite of the rule the week applies |
| 4 | 116, 130 | `EffectAction Required` runs the two column headings together; 117-118 and 131-132 run effect, debit/credit and column together (`decreasedCr. Cash column`); 131 and 132 end with a trailing space |
| 5 | 116-118, 130-132 | A Word table flattened to paragraph text, so row grouping survives only as position |
| 6 | 119-120 | Cash balance N300 followed by N710 paid into the bank; the N710 has no stated source |
| 7 | 120 | The line begins with six literal spaces, not a tab |
| 8 | 121, 134 | `DrCash BookCr` runs Dr, the title and Cr together; 134 prints only `Dr Cr`, so the two tables are headed differently |
| 9 | 122, 135 | No total, no balance carried down and no balance brought down, so the effect on the two balances is never shown |
| 10 | 122, 135 | Four bare `N` cells with no column label: Cash cannot be told from Bank except by counting cells |
| 11 | 124 | The both-sides folio rule is stated once, in a note, with curly quotation marks |
| 12 | 127 | "the effect and action will be started below" — `started` should be `stated` |
| 13 | 136-157 | 22 empty blocks: the week closes with no exercise |

No correction wording is authored here; the lesson must not copy the printed sentences unverified.

## Figure checks (open item `BOOKKEEPING-T1-W03-FIGURE-CHECKS`)
- Example (a): the cash balance at Jan. 1 is **N300** and the amount paid into the bank at Jan. 2 is **N710**. A N300 balance cannot fund a N710 transfer, and no opening bank balance, receipt or loan is given anywhere in the week, so N710 cannot be derived. Block 122 balances with itself (300 and 710 on both sides) while the narrative does not.
- Example (b): N800 is withdrawn on Jan. 4 from a bank balance that is never stated; against the N300 cash balance the resulting cash would be **N1,100**, which the week never states. No table carries a total, so neither resulting balance is shown.
- Only Jan. 1, Jan. 2 and Jan. 4 are dated and no year is given, so the two examples cannot be read as one continuous cash book.
- No figure in either example can be reused without being re-derived and shown.

## Concept error (open item `BOOKKEEPING-T1-W03-CONCEPT-ERROR`)
- Block 113 defines contra as a transfer to the **identical** side. The week's own effect and action pairs post the same transaction to the **opposite** side (117-118 `Cr. Cash column` / `Dr. Bank column`; 131-132 `Cr. Bank column` / `Dr. Cash column`), and both tables do the same by cell. Block 112 adds a second error by defining contra only as payment into the bank, which would exclude direction (b).
- This is a factual correction to a stated definition, not an editorial preference, and it is recorded as `kind: FACT` rather than `CONTENT`.

## Notation and visuals
- Blocks 109-157 contain exactly **four non-ASCII characters**, all curly double quotation marks: U+201C and U+201D at block 112 and again at block 124. There are **zero tab characters** in the section.
- The naira is the bare `N` throughout (`N300`, `N710`, `N800`), consistent with `BK-PRES-T1-CURRENCY`. No mark, symbol or figure was normalized.
- The two cash book tables are Word tables (`w:tbl`) handled by `BK-VIS-T1-TBL-W03`; Week 3 has no drawing, image, OLE object or equation, so no new visual item is raised here.

## Assessment and references
- Week 3 sets no exercise, assignment or question; the section ends with two worked examples and 22 empty blocks. No answer key, mark allocation or completion criterion exists, so no assessment entry is created. Recorded as `BOOKKEEPING-T1-W03-NO-EXERCISE`.
- There is no external reference, textbook page or citation in Week 3, so no external-text item is raised.

## Sequencing
- Week 2's example already contains two transfers between cash and bank before contra is scheduled: `BOOKKEEPING-T1-W02-CONTRA-SEQUENCING` (open, BLOCKED decision in `BK-FACT-T1-W02-DEFECTS`) lists `BK-WK-T1-W03` among its affected ids.
- Week 3 records its examples in a cash book with Cash and Bank columns, the two-column form taught in Week 2, and never re-states that ruling in its own blocks. Both facts are recorded in `BOOKKEEPING-T1-W03-SCHEME-MAPPING` as decisions for `BK-FACT-T1-W03-DEFECTS`.

## Queue changes
- `BK-WK-T1-W03` -> `IMPLEMENTED_TESTING_DEFERRED`; its `Not yet indexed…` reference replaced.
- Appended 2 items depending on `BK-SRC-T1` and `BK-WK-T1-W03`: `BK-LES-T1-W03-CONTRA` (LESSON, PENDING, also depending on `BK-FACT-T1-W03-DEFECTS` and `BK-VIS-T1-TBL-W03`) and `BK-FACT-T1-W03-DEFECTS` (FACTUAL_DEPENDENCY, BLOCKED).
- Counts: items 43 -> 45; LESSON 5 -> 6 and FACTUAL_DEPENDENCY 5 -> 6; coverage 33 -> 40; open items 21 -> 26; source_rules 3; lessons 0; assets 0; notes 14 -> 15; status 9 implemented / 30 pending / 6 blocked; `next_runnable` head -> `BK-PRE-T1`.

## Limits
- Indexing only: no lesson authored, no source rule added, no asset, no package delivery change, no schema, compiler, parser or importer edit, no importer or plan run. `bookkeeping.json` was edited only to add coverage and open items.
- Not approved and not verified. The week's definition of contra is wrong as printed, one example cannot be reconciled, neither example shows a resulting balance and no exercise exists.
- The five open items opened by this task are `BOOKKEEPING-T1-W03-SCHEME-MAPPING`, `BOOKKEEPING-T1-W03-SOURCE-DEFECTS`, `BOOKKEEPING-T1-W03-FIGURE-CHECKS`, `BOOKKEEPING-T1-W03-CONCEPT-ERROR` and `BOOKKEEPING-T1-W03-NO-EXERCISE`. None is closed by this note.
