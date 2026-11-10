# BK-VIS-T1-TBL-W03 — Week 3 cash-book table disposition

Status: **IMPLEMENTED_TESTING_DEFERRED**. Source cells reviewed from BK-INV-T1; importer and display verification remain deferred.

## Source and locator
- Source: `SS1-SRC-62b02f2adcb3`, SHA-256 `9b24550136a914c0056299abdb8aeed897244929a2c330ff3892d1fa07efdce0`.
- Table A: block 122, 4 rows × 10 cells, SHA-256 `50f7bcab93db04a2fa33854ba34f46d6e95918e4455540913256e0bd02990bb8`.
- Table B: block 135, 3 rows × 10 cells, SHA-256 `bc543e99e8376f0fe5228f6c3310772051ac2dcd1c71bb8bb96202015256fcc7`.
- Flattened effect/action text: blocks 116–118 and 130–132.

## Disposition of the two cash-book tables
Both tables have Date, Particulars, Folio, Cash and Bank columns on each side, with a currency sub-header row. Table A records Dr Bank / Cr Cash for cash paid into the bank. Table B records Dr Cash / Cr Bank for cash withdrawn from the bank. The cell values and their positional interpretation are preserved in the inventory.

The importer text view emits cells one per line and empty cells as empty lines. Row grouping is only inferable from blank-line positions; column positions and the identity of the Cash and Bank amount columns are not reliably self-describing. A learner reading flattened text cannot safely reconstruct the table without counting cells. The two cash-book tables must therefore be restated as explicit semantic tables in authored teaching, preserving both sides, Date, Particulars, Folio, Cash and Bank labels, and the direction of each contra entry.

## Disposition of the Effect / Action Required pairs
The source has two pairs of paragraph text, not Word tables. Each starts with the flattened heading “EffectAction Required” and is followed by effect and action paragraphs. The pairs describe the decrease/increase and debit/credit treatment for the two directions of contra entry. The text survives, but the side-by-side column relationship is not encoded as a semantic table. An authored explanation should restate the information with clear headings or a semantic table, without silently correcting the source wording.

## Preservation boundary
- No source wording or cells are changed.
- No image asset is needed; these are native Word tables and paragraph pairs.
- The source examples contain figure/sequence defects already recorded in the factual dependency items; the lesson must not copy figures without resolving them.
- No importer run or rendered display test was performed.
