# BK-VIS-T3-TRIAL-BALANCE — Trial-balance list and classification diagram disposition

Status: **IMPLEMENTED_TESTING_DEFERRED**. Source visual inspection only; no app display verification.

## Source
- Trial-balance list: blocks 90–136.
- Differences/purpose and diagram: blocks 141–164.
- VML connectors/arrows occur at blocks 90–91, 103, 117, 130, 141, 156, 158–161.
- No native Word table or embedded image file.

## Disposition
The account list aligns names with DR/CR markers through tab spacing and VML rules. The diagram at blocks 155–164 visually groups credit liabilities, credit income/gain, debit expenses and debit assets. The extracted words survive, but relative position, connector direction and column association may not. A text-only copy cannot safely infer every account's debit/credit placement from whitespace alone.

## Future delivery boundary
Reconstruct the list as a structured table and the classification graphic as an explicit labelled diagram or accessible text hierarchy. Check every row against the source before reuse; preserve the original source's account names and do not claim the diagram was tested in the app.
