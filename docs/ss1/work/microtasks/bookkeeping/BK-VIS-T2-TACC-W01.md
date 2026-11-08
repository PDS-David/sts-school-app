# BK-VIS-T2-TACC-W01 — Week 1 T-account visual disposition

Status: **IMPLEMENTED_TESTING_DEFERRED**. Source visual inspection only; no app display verification.

## Source
- Cash account illustration: blocks 38–58; Bank account illustration: blocks 60–81.
- VML drawings: blocks 50, 57, 71 and 80 (eight VML objects total).
- No separate image file; the document uses VML connectors/rules with tab-aligned account text.

## Disposition
The drawn connectors establish the two-sided debit/credit account geometry and double ruling. Text extraction retains account labels and amounts but loses the visual association between sides, balance c/d and balance b/d. A plain-text rendering is not a faithful T-account.

## Future delivery boundary
Reconstruct each account as an explicit two-sided table, checking each row and amount against the original. Preserve the source's inconsistent cash/bank examples as flagged in BK-PRES-T2-WORKED; do not silently repair figures.
