# BK-VIS-T1-TBL-W04 — Week 4 debit/credit table disposition

Status: **IMPLEMENTED_TESTING_DEFERRED**. Source cells reviewed from BK-INV-T1; importer and display verification remain deferred.

## Source and locator
- Source: `SS1-SRC-62b02f2adcb3`, SHA-256 `9b24550136a914c0056299abdb8aeed897244929a2c330ff3892d1fa07efdce0`.
- Word table: block 175, 12 rows × 4 columns, SHA-256 `35d1163dd177a22a8987a9ff139ad68ad22462b43b152e07172182d5a834597a`.
- Header row: blank marker and transaction columns, then “Debited” and “Credited”.
- Eleven answer rows: i–xi; each pairs a transaction with the account to debit and the account to credit.

## Disposition
The table already contains all eleven answers. Reading each row in source cell order preserves the logical sequence: roman numeral, transaction, debit account, credit account. The extracted text emits one cell per line; the header row and column positions are lost. Although the order of four cells per row can be inferred from the source inventory, the plain text no longer names the columns at each row and does not provide a reliable, accessible table structure.

The table must be restated as a semantic four-column table in authored teaching, with explicit headings for item, transaction, account debited and account credited. Retain the source's answer content as a worked illustration. It is **not** an unsolved practice question: the answers are already present in the source.

## Preservation boundary
- No source cell or answer is altered.
- No arithmetic is required for this table; its eleven pairings were read from the cells and are recorded as consistent in the inventory.
- Do not reuse the table as an assessment prompt without first removing answers in a separately authored exercise.
- No importer run or rendered display test was performed.
