# BK-VIS-T1-TACC-W01 — Week 1 T-account visual disposition

Status: **IMPLEMENTED_TESTING_DEFERRED**. Source structure reviewed from BK-INV-T1; no drawing is committed and no display verification is claimed.

## Source and locator
- Source: `SS1-SRC-62b02f2adcb3`, SHA-256 `9b24550136a914c0056299abdb8aeed897244929a2c330ff3892d1fa07efdce0`.
- Cash account: blocks 49–57; VML connectors at block 49 and double-rule groups at block 56.
- Bank account: blocks 70–80; VML connectors at block 70 and double-rule group at block 79.
- The source contains no image/media part; the rulings are VML drawing objects embedded in paragraphs.

## Disposition
The drawing objects add the visual geometry of two T-accounts: a vertical divider, a horizontal top rule and double rules beneath the totals. The surrounding extracted text retains the Dr/account/Cr heading and the transaction labels and amounts, including tab-separated runs. It does **not** retain the ruled box, the divider between debit and credit sides, or reliable column alignment. A plain-text rendering is therefore not a faithful, independently teachable representation of the source account layout.

A later lesson must restate each account as an explicit two-sided table with labelled debit and credit sides, particulars, folio and amount columns, and visible balance carried down/brought down rows where those rows are used. This is a semantic teaching representation, not a claim that the source drawing itself survives extraction. The lesson must separately resolve the known source arithmetic defects before reproducing figures.

## Preservation boundary
- Original VML drawings and source wording remain unchanged.
- No image asset is added: the source drawings are Word VML, not standalone image files.
- No importer run, browser rendering or mobile display test was performed.
- Residual structure loss is recorded for lesson authoring; no source correction is made here.
