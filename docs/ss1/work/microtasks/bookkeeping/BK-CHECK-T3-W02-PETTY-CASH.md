# BK-CHECK-T3-W02-PETTY-CASH — Petty cash illustration review

Status: **IMPLEMENTED_TESTING_DEFERRED**. Arithmetic review by source reading; original rows unchanged.

## Source
- Blocks 62–81; source member SHA-256 `343c428b86364be8e1784c814fdd7ca3d02836f508e7eff289af0e139447fd7d`.

## Analysis-column arithmetic
- Postage: 30.
- Cleaning: 15 + 20 = 35.
- Transport: 40 + petrol 15 = 55.
- Medical expense: 55.
- Ledger/Bola: 70.
- Analysis total: 30 + 35 + 55 + 55 + 70 = **245**, agreeing with the printed analysis total at block 74.
- The individual payment rows also total 15 + 70 + 30 + 40 + 20 + 55 + 15 = **245**.

## Imprest interpretation and limit
The source shows an initial float of #700, an analysis/payment total of #245, a reimbursement/receipt of #245, and a subsequent balance brought down of #700 in the flattened layout. This is consistent with an imprest reimbursement restoring the float to #700 after #245 expenditure. The exact column positions of the closing/reimbursement lines are VML/tab-dependent; do not replace the source table until visual reconstruction confirms which #245 and #700 cells occupy the receipt, total and balance columns.

## Boundary
Arithmetic totals of the expense analysis and payment rows agree. No source value is changed; no new worked example is represented as original.
