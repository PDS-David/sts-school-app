# BK-PRES-T3-CURRENCY — Bookkeeping, 3rd Term currency and dates

Status: **IMPLEMENTED_TESTING_DEFERRED**. Exact source notation and dated figures recorded; no conversions or updates made.

## Source identity
- Source: `SS1-SRC-97f226215927`
- Member SHA-256: `343c428b86364be8e1784c814fdd7ca3d02836f508e7eff289af0e139447fd7d`

## Currency notation
- The source uses `#` before monetary amounts (for example, petty cash float #700 and transaction figures in the June 1999 illustration).
- It does not explicitly name a currency, provide an ISO currency code or use a named currency symbol in the extracted text.
- Preserve `#` as source notation. Do not silently convert it to a naira symbol, dollar sign or another currency.

## Dated examples and document metadata
- Mr Odili transaction illustration: month of June 1999, block 180.
- Balance-sheet format: “as at 31st Dec. 2000”, block 428.
- Bose Adetoro Enterprises assignment heading: 31 Dec. 1983, block 457.
- Assignment instruction: 31 Dec. 1883, block 468 — source date conflict, unresolved.
- DOCX core metadata: created and modified 2016-05-19T02:50:00Z; creator Elias; last modified by fash; revision 2. This metadata does not prove the dates or monetary values of every transaction.

## Update policy
No inflation adjustment, currency conversion or current-price update was performed. These are historical teaching figures. Any newly authored examples should state their currency and date explicitly and should not be represented as original source data.
