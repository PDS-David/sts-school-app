# BK-PRES-T1-WORKED — Bookkeeping 1st Term worked material preservation

Status: **IMPLEMENTED_TESTING_DEFERRED**. Source-faithful inventory and arithmetic review; no source figure or wording changed.

## Source identity and locator method
- Source: `SS1-SRC-62b02f2adcb3`, archive member `SSS 1/1st Term SS1_/book keeping.docx`.
- Member SHA-256: `9b24550136a914c0056299abdb8aeed897244929a2c330ff3892d1fa07efdce0`.
- Locators are direct-child `w:body` blocks in `word/document.xml`, 0-based; see BK-INV-T1 for reproducible block/range hashing.

## Preserved worked material and findings

| Material | Locator | Source content / structure | Consistency finding |
|---|---|---|---|
| Single-column cash account, Illustration 1 | Blocks 37–57 | Question transactions and a printed cash-account solution with Dr/Cr sides and balance c/d | Internally totals 2,115 on each side, but solution uses 115 instead of question's 155 and 750 instead of 700. Correct figures from the question give receipts 2,155, payments 1,055 and closing balance 1,100. Printed 1,010 is wrong by 90. |
| Bank account, Illustration 2 | Blocks 59–80 | Question transactions and printed bank-account solution | Solution repeats most of Illustration 1's credit entries, omits the June 9 cheque purchase of 300, and has an unquantified June 7 transaction. Printed credit items total 1,505, not 3,180; printed balances 1,910 and 1,010 sum to 2,920. No valid reconciliation is possible from the given list. |
| Double-column cash book example | Blocks 93–104 | Nine April transactions and an instruction to prepare and balance a two-column cash book | No worked solution follows; blocks 105–108 are empty. The example uses placeholder year “19x9”. Two cash/bank transfers appear before the scheme's contra-entry topic; treatment remains subject to the recorded Week 2 expert decision. |
| Contra example A | Blocks 119–122 | Cash balance N300, then N710 paid into bank, with a Dr Bank / Cr Cash table | Table cell placement records a correct contra direction, but the stated N710 transfer exceeds the stated N300 cash balance and has no stated source. The table is not a reconciled running cash book. |
| Contra example B | Blocks 133–135 | N800 withdrawn from bank, with a Dr Cash / Cr Bank table | Direction is correct. Opening bank balance is unstated; no totals or closing balances are shown. |
| Debit/credit identification table | Blocks 174–175 | Eleven transactions and answers in a four-column table | All eleven answers are present and consistent by source cell reading. This is worked material, not a question with hidden answers. |
| Posting illustration | Blocks 183–205 | Twenty June transactions; instruction to prepare a two-column cash book, balance it and post to ledgers | No cash book, totals, balances or ledger postings follow. No worked solution exists. |
| Assignment 1 | Blocks 207–209 | Reference to an external textbook page and question | External source is not supplied. Do not reproduce it. Needs owner decision on an approved substitute or original practice. |
| Assignment 2 | Blocks 210–217 | Seven January transactions | No answer or worked ledger solution is supplied. |

## Accounting structure to preserve
- Cash and bank accounts are separate accounts; in a double-column cash book they are represented as Cash and Bank amount columns on both debit and credit sides.
- The debit side records receipts; the credit side records payments. A direct cash payment credits Cash; a direct cheque payment credits Bank.
- A transfer between cash and bank is a contra: debit the receiving column and credit the giving column, with “C” in the folio column on both sides. The source's Week 2 timing of two contra transactions is separately blocked for expert decision.
- A balance carried down (c/d) is entered on the shorter side to make the two sides equal at period end; the balance brought down (b/d) opens the next period on the side of the balance. Do not infer that the source taught these steps adequately: its examples are either incorrect or unsolved.
- In a ledger, the account receiving value is debited and the account giving value is credited; posting requires a ledger format and folio trace. The source states rules but supplies no completed ledger.

## Authoring and reuse boundary
1. Preserve the original source examples as evidence; never overwrite their figures.
2. Any corrected or newly worked example must be labelled “Project-authored worked example” and show the derivation.
3. Keep unresolved or defective source figures out of learner-facing answer keys until the factual decision items are settled.
4. Do not invent missing amounts, textbook questions, opening balances or answers.
5. The double-column example's solution must await the Week 2 contra-sequencing decision; the Week 4 posting illustration must await its source-defect and figure decisions.

## Verification boundary
No importer, compiler, package validator, typecheck, database, browser or mobile test was run. This is a source-reading disposition, not approval or certification.
