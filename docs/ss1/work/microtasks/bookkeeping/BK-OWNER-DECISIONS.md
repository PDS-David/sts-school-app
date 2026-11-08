# Bookkeeping — consolidated owner and subject-expert decisions

Status: **Decision record prepared; no owner or subject-expert decisions are presumed.**

This sheet consolidates the outstanding Bookkeeping decisions after PR #365 was merged. It is intended to prevent repeated questions and to let independent implementation continue as soon as each decision is recorded.

## What is already implemented

- The three source documents are registered and preserved.
- First-term and third-term source inventories, objective indexing, structural dispositions and preservation records are in the package.
- Four first-term and six third-term project-authored equivalent lessons are present.
- Third-term Week 2–10 source indexing and eight supported structural boundaries are implemented. Week 9 has no distinct source heading, so no boundary was invented.
- Second-term preamble, marker, preservation and visual dispositions are implemented. No duplicate second-term lesson coverage has been linked.
- Package/queue JSON, referential integrity and authored marking totals were checked statically. The automated suite, typecheck, importer/compiler execution, database and delivery checks remain deferred; no verification is claimed.

## Decisions needed

### 1. Is the registered second-term file the intended second-term teaching source?

The second-term file's teaching body and scheme are text-identical to the first-term file; only the opening term label and a line break differ.

Choose one:
- **A — Yes, intentional:** confirm it is the intended second-term document, even though it repeats first-term content. The worker can index it as a second-term source, but should record the repetition transparently and avoid implying new teaching.
- **B — No:** provide the correct second-term Bookkeeping document.
- **C — Not confirmed:** keep second-term week indexing and duplicate-coverage linking on hold.

Recommended safe default: **C** until the source owner confirms A or supplies B.

### 2. Confirm the three source-heading aliases

The package uses the canonical subject name “Bookkeeping”, while the original headings are:
- First term: “SUBJECT: BOOK-KEEPING” / “CLASS: SS 1”
- Second term: “SUBJECT: BOOK-KEEPING” / “CLASS: SS 1”
- Third term: “SS 1 OMEGA TERM BOOK- KEEPING”

The contract requires owner approval for each alias. Confirm or reject each separately:
- First-term alias: approve / reject.
- Second-term alias: approve / reject.
- Third-term alias: approve / reject.

A rejection means the package must not silently map that source to Bookkeeping; the owner must state the correct subject disposition.

### 3. First-term Week 1 — cash-book source defects and figures

The original source has fourteen recorded defects. The main consequential issues are:
- Illustration 1's transaction list gives receipts of 2,155, payments of 1,055 and a closing balance of 1,100; its printed solution instead uses 2,115, 1,105 and 1,010 through incorrect figures.
- Illustration 2 omits a cheque payment, has an unquantified June 7 cheque, repeats unrelated credit entries and prints a false equality.
- The source shows T-accounts rather than the single-column cash-book format required by the scheme; it does not teach the columns or balancing procedure.

Decision: may the teaching supplement use newly prepared, internally consistent worked examples and explicitly identify the printed source solutions as unreliable, while leaving the original document unchanged?

Recommended default: **Yes.** Do not guess the missing June 7 amount; omit that transaction from any numerical reconstruction or present it as an unresolved source omission. Do not reuse the printed totals as correct.

### 4. First-term Week 2 — double-column cash book

The source has seven recorded defects, no solution to its nine April transactions, and no taught balancing procedure. Two transactions transfer money between cash and bank:
- 4 April: N1,850 of capital paid into the bank.
- 29 April: N1,000 cash paid into the bank.

The scheme teaches contra entries in Week 3, after this Week 2 exercise.

Decisions:
- May the Week 2 worked solution identify and record these transfers as contra entries before the formal Week 3 lesson, or should the lesson defer those entries until Week 3?
- Should the source placeholder year “19x9” remain visible, or should the supplement use a clearly labelled new illustrative year?
- May the project-authored lesson replace defective wording/layout while preserving the original source verbatim?

Recommended defaults: preserve the source verbatim; label all corrected teaching as project-authored; use a clearly stated illustrative year rather than pretending “19x9” is a real date. The sequencing of contra entries needs a teacher decision.

### 5. First-term Week 3 — contra entry

The source definition at block 113 reverses the debit/credit treatment used by its own examples. Block 112 also limits contra entries to cash paid into the bank, omitting withdrawals. One example states that N710 is paid into the bank when the stated cash balance is only N300, with no source for the difference; the other has no stated opening bank balance. Neither table is balanced or totalled.

Decision: approve the standard corrected teaching rule for the supplement: a transfer between cash and bank is debited to one account/column and credited to the other; the direction depends on whether cash is banked or withdrawn. Personal drawings are not contra entries.

For the two source examples, may the lesson replace them with new, internally consistent worked examples, labelled project-authored, rather than inventing missing opening balances or receipts?

Recommended default: **Yes.** Preserve all printed source text and figures, explain why the examples cannot be reconciled as printed, and use newly stated opening balances in the replacement examples.

### 6. First-term Week 4 — double entry and ledger posting

Eleven defects are recorded. The consequential decisions are:
- Confirm that a personal withdrawal from the bank is drawings, not a cash-to-bank contra transfer.
- Confirm whether the “N20 motor van” figure is wrong. Do not guess a replacement amount.
- Confirm the treatment of each cash/bank transfer row; contra rows are not posted a second time to ledger accounts.
- Approve a corrected, clear definition and teaching rules for double entry and posting.
- Approve an author-created ledger account format and fully worked, internally consistent replacement illustration.

Recommended defaults: classify the personal withdrawal as drawings; do not invent a motor-van amount; use a new labelled example if the N20 figure cannot be verified; preserve the original list unchanged.

### 7. Week 4 external textbook assignment

The source cites an external textbook page that was not supplied. No text has been copied. An original project-authored substitute exercise is already present.

Choose one:
- **A — Approve** replacing the unavailable textbook assignment with the existing original practice.
- **B — Supply** the exact textbook page/question for review and rights assessment.
- **C — Keep** the assignment unresolved and do not deliver it.

Recommended safe default: **A**, unless the exact textbook material is supplied with permission to use it.

### 8. Content approval versus verification

All authored equivalent lessons remain marked **content approval PENDING** and **verification DEFERRED**. Package status remains **PENDING**.

After reviewing the lesson content, the owner may approve or request changes. Approval does not mean technical verification: tests, typecheck, importer/compiler, database, device and delivery checks remain separate and must be run and evidenced later under the project verification process.

## Preservation and safety rules

- Original source files, wording and printed figures remain unchanged.
- No missing source value, opening balance, date, textbook content or teacher decision is invented.
- Newly authored examples and lessons must be labelled project-authored.
- No package is to be marked APPROVED or VERIFIED without the corresponding actual decision/evidence.
- The remaining second-term indexing and first-term source-specific lessons must not be marked complete until their dependencies are resolved.

## Queue references

- Second-term source identity: `BOOKKEEPING-T2-TEXT-MATCHES-T1`
- Source aliases: `BOOKKEEPING-ALIAS-APPROVAL`, `BOOKKEEPING-ALIAS-APPROVAL-T2`, `BOOKKEEPING-ALIAS-APPROVAL-T3`
- First-term factual decisions: `BK-FACT-T1-W01-DEFECTS`, `BK-FACT-T1-W02-DEFECTS`, `BK-FACT-T1-W03-DEFECTS`, `BK-FACT-T1-W04-BRIEF`
- External assignment: `BK-FACT-T1-W04-TEXTBOOK`
- Package content approval: `BK-FACT-CONTENT-APPROVAL`
