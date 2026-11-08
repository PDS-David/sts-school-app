# BK-CHECK-T3-W03-TB — Mr Odili trial-balance illustration review

Status: **IMPLEMENTED_TESTING_DEFERRED**. Source calculation checked against its own ledger postings.

## Transactions and cash account
Source blocks 180–204 list cash purchases 3,000, cash sales 10,000, wages 200, insurance 800 and cash settlement with Olu 300. The cash account shows 10,000 receipts and payments 3,000 + 800 + 300 + balance c/d 5,700 = 10,000. Cash balance b/d is 5,700.

## Individual ledger balances
The source's own ledger postings (blocks 206–240) show:
- Sales: credit balance 10,000.
- Purchases: debit balance 3,000.
- Wages: debit balance 200.
- Insurance: debit balance 800.
- Olu: debit balance 300 (debit cash 300; balance c/d on credit side; balance b/d on debit side).

## Trial-balance correction finding
The printed trial balance at blocks 242–253 places Olu 300 in the **credit** column, contradicting its own ledger account. If the five ledger balances are transferred as printed in those individual accounts, the trial balance is:

| Account | Debit | Credit |
|---|---:|---:|
| Cash | 5,700 | — |
| Purchases | 3,000 | — |
| Wages | 200 | — |
| Insurance | 800 | — |
| Olu | 300 | — |
| Sales | — | 10,000 |
| **Total** | **10,000** | **10,000** |

The source's printed total line appears as debit 10,000 and credit 1,000; the credit total is missing a zero. The source also places Olu on the wrong side in the trial balance. These are two separate defects.

## Boundary
This is a separately recorded arithmetic correction based on the source's own ledger entries. The original DOCX and printed answer remain unchanged. Do not silently edit the source.
