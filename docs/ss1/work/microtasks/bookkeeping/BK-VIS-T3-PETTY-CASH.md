# BK-VIS-T3-PETTY-CASH — Petty cash book layout disposition

Status: **IMPLEMENTED_TESTING_DEFERRED**. Source layout inspection only; no display verification.

## Source
- Layout and example: blocks 62–81.
- VML drawings: 19 objects across blocks 62 (4), 63 (8), 77 (6), 78 (1).
- No native Word table or image file; headings and figures are tab-aligned text with VML connectors/rules.

## Disposition
The layout contains a receipt side, date, details, voucher number, total and analysis columns for postage, cleaning, transport expense, medical expense and ledger. The text retains many labels and amounts, but the spacing and VML rules are essential to understanding which amounts sit under which headings and how the closing/reimbursement lines are ruled. Plain-text extraction alone is not a faithful table rendering.

## Future delivery boundary
Rebuild as an explicit accessible table with each original row/column association checked against the DOCX; preserve #700 float, #245 total payments and each analysis figure exactly until a separate correction is approved. Do not turn the source's VML into a decorative image or invent missing entries.
