# BIO-VIS-T3-TBL-CROP-PESTS — Crop-pests summary table disposition

Status: **IMPLEMENTED — TESTING DEFERRED BY OWNER**. This is a structural disposition only; it does not validate or endorse pesticide or pest-control claims.

## Source evidence

- Source: `SS1-SRC-78059230037f`, 3rd Term SS1 Biology document.
- Locator: combined Weeks 6–7 section, block 584.
- Table dimensions: 9 rows × 3 columns (header plus eight pest rows).
- Block-text SHA-256: `4adf3ba8954ae272ca10341350945c30f7fc9cbf8aca4af25a679628c9cf9d18`.
- Columns: pests, effects, control.
- Source row range: eight pest entries, from grasshopper through birds.
- The inventory records that plain-text extraction concatenates cells without separators. The importer was not run, so actual importer output remains unverified.

## Disposition

1. The native table contributes eight pest summaries across three fields: pest, effects and control.
2. Flattened text does not preserve reliable row or column relationships. It is not a readable substitute for the table.
3. Delivery must use a semantic three-column table with each source row's cells kept together. Do not reconstruct row pairings from flattened text.
4. The control column contains named pesticide products and a stated concentration. These remain source claims only; this disposition does not reproduce the names or concentration as instructions, add application details, or endorse the controls.
5. Preserve source wording in the evidence record. Do not alter or extend it in this visual task.

## Factual and safety restrictions

The pest-control claims require qualified agricultural and pesticide-safety review before any teaching reuse. Any approved correction must be recorded separately from the original source. Do not add product recommendations, doses, mixing directions, application methods or other operational pesticide guidance.

## Verification

No importer, parser, application display, test suite or visual regression check was run. Testing was deferred by owner.
