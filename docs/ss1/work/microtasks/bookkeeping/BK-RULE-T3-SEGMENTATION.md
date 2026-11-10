# BK-RULE-T3-SEGMENTATION — Bookkeeping, 3rd Term source section boundaries

Status: **IMPLEMENTED_TESTING_DEFERRED**. Eight structural boundaries added from exact source headings; parser execution remains deferred.

## Source
- Source ID: `SS1-SRC-97f226215927`
- Member SHA-256: `343c428b86364be8e1784c814fdd7ca3d02836f508e7eff289af0e139447fd7d`
- Inventory: `BK-INV-T3.md`

## Rules added
| Rule | Week label | Exact source anchor | Block |
|---|---:|---|---:|
| `RULE-BK-T3-W02` | 2 | `                                PETTY CASH BOOK` | 44 |
| `RULE-BK-T3-W03` | 3 | `TRIAL BALANCE AND CORRECTION OF ERRORS` | 85 |
| `RULE-BK-T3-W04` | 4 | `RULES OF TRIAL BALANCE ` | 151 |
| `RULE-BK-T3-W05` | 5 | `TRIAL BALANCE ERRORS OR UNDISCLOSED ERRORS` | 261 |
| `RULE-BK-T3-W06` | 6 | `ERRORS THAT WILL AFFECT THE AGREEMNENT OF THE TRIAL BALANCE` | 308 |
| `RULE-BK-T3-W07` | 7 | `                            TRADING PROFIT AND LOSS ACCOUNT AND BALANCE SHEET(FINAL ACCOUNT)` | 394 |
| `RULE-BK-T3-W08` | 8 | `                PREPARATION OF FINAL ACCOUNT OF A SOLE TRADER` | 418 |
| `RULE-BK-T3-W10` | 10 | `LAYOUT OF BALANCE SHEET` | 426 |

Each rule uses `split_before`, the exact source SHA, and a block-hash locator. The inserted WEEK line is structural metadata; no source character is removed or rewritten.

## Deliberate Week 9 treatment
The source body presents definitions for trading account, profit and loss account and balance sheet together in one combined final-accounts section at blocks 394–417. The later general preparation steps are at 418–423. It does not provide a distinct Week 9 heading/body boundary. The Week 9 objective is therefore mapped to the combined final-accounts material and not given a fabricated split anchor. Week 10 receives a separate boundary at its explicit balance-sheet layout heading (block 426).

## Verification boundary
The anchors were checked against the uploaded DOCX block text and are unique in the inspected source blocks. The actual Mammoth extraction, compiler `applyRules`, importer and parsed row output have not been executed. Do not claim the resulting parser rows are verified.
