# BK-VIS-T2-TBL-W03 — Week 3 contra cash-book tables disposition

Status: **IMPLEMENTED_TESTING_DEFERRED**. Source table/paragraph inspection only.

## Source
- Contra table A: block 123, 4 rows × 10 columns, text SHA-256 `50f7bcab93db04a2fa33854ba34f46d6e95918e4455540913256e0bd02990bb8`.
- Contra table B: block 136, 3 rows × 10 columns, text SHA-256 `bc543e99e8376f0fe5228f6c3310772051ac2dcd1c71bb8bb96202015256fcc7`.
- Flattened Effect/Action pairs: blocks 117–119 and 131–133; these are paragraph text, not native tables.

## Disposition
The two native tables preserve the cash/bank sides and date/particulars/folio columns. The Effect/Action paragraphs lose their column relationship in plain-text extraction. Table A records cash paid into bank; Table B records cash withdrawn from bank. Their original rows and N notation must remain intact.

## Future delivery boundary
Render the two cash-book tables with explicit debit/credit groupings and retain the C folio marks. Restate Effect and Action as clearly labelled pairs. Keep the two source arithmetic/opening-balance defects recorded in BK-PRES-T2-WORKED; no correction is made here.
