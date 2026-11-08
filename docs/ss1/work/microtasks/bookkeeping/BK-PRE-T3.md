# BK-PRE-T3 — Bookkeeping, 3rd Term scheme preamble

Status: **IMPLEMENTED_TESTING_DEFERRED**. Preamble inventory and objective-to-body mapping only.

## Source identity and locator
- Source: `SS1-SRC-97f226215927`; member SHA-256 `343c428b86364be8e1784c814fdd7ca3d02836f508e7eff289af0e139447fd7d`.
- Blocks 0–43, range SHA-256 `bccc05419af499fe4b74c00fa80fb410ba127765bf6d3d6e0c487e9c899d8434`; direct `w:body` children, zero-based.
- Complete inventory and block hashing method: `BK-INV-T3.md`.

## Scheme map
| Week | Exact scheme text | Scheme blocks | Body evidence / finding |
|---|---|---:|---|
| 1 | Revision | 5 | No revision body. Marker only. |
| 2 | Petty cash book; meaning, classification of columns, posting of transaction | 6–9 | Petty cash book blocks 44–81. |
| 3 | Trial balance and correction of errors; meaning, functions, extraction of balances | 10–13 | Trial balance section blocks 85–150 and ledger extraction/balancing example blocks 166–259. |
| 4 | Trial balance and correction of error; rules for posting balances, preparation | 14–16 | Rules blocks 151–175 and worked ledger/trial balance blocks 166–259. The source has no explicit boundary separating Weeks 3 and 4. |
| 5 | Trial balance and correction of errors; meaning/types; errors affecting and not affecting trial balance | 17–21 | Error definitions and journal correction illustration blocks 261–307. Treatment of the two error classes is not cleanly separated into complete labelled sections. |
| 6 | Trial balance and correction of errors; correction through suspense account | 22–23 | Suspense-account material blocks 308–392. |
| 7 | Trading account; definition, cost of goods sold, gross profit | 24–27 | Definitions at blocks 394–417; no standalone trading-account layout or solved example. |
| 8 | Trading account; preparation of a simple trading account | 28–29 | Final-account preparation steps blocks 418–423; no simple trading-account layout or worked calculation. |
| 9 | Profit and loss account; purpose, net sales/net profit, preparation rules | 30–33 | P&L definition at 403 and final-account steps 418–423; no distinct P&L format or worked net-sales/net-profit calculation. |
| 10 | Balance sheet; explain, content, users, preparation | 34–38 | Definition block 404, layout blocks 426–452, assignment blocks 457–468. No identifiable teaching section on users of a balance sheet. |
| 11 | Revision | 40 | No revision body. Marker only. |
| 12 | Exam | 41 | No examination paper or assessment details. Marker only. |

## Structural findings
- The scheme entries are manually typed preamble text; they are not parsed week bodies.
- No literal WEEK marker occurs in the teaching body. The source body is continuous and topic-headed. Week-to-body mappings above are evidence-based scheme mappings, not verified parser rows.
- Revision and exam entries are handled separately by `BK-MARK-T3-REVISION` and `BK-MARK-T3-EXAM`.
- Do not add `split_before` or `attach_stranded_label` rules from this preamble task. The body segmentation decision remains with week-indexing and parser verification.

## Boundary
No lesson, coverage entry or source rule is authored here. Source text and bytes remain unchanged; no importer, compiler or test execution is claimed.
