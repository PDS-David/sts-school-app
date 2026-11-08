# BIO-VIS-T3-TBL-CROP-DISEASES — Crop-diseases table disposition

Status: **IMPLEMENTED — TESTING DEFERRED BY OWNER**. This is a structural disposition only; it does not validate disease or control claims.

## Source evidence

- Source: `SS1-SRC-78059230037f`, 3rd Term SS1 Biology document.
- Locator: combined Weeks 6–7 section, block 614.
- Table dimensions: 8 rows × 4 columns (header plus seven crop-disease entries).
- Block-text SHA-256: `8efb2438f9684f936134d0f44f641d131c6daae06fd49d932e512ff41f171092`.
- Columns: name of disease, causative organisms, symptoms, control.
- The inventory identifies seven crop diseases, from maize rust through cocoa swollen shoot.
- Plain-text extraction concatenates cells without separators; the importer was not run, so actual importer output remains unverified.

## Disposition

1. The native table contributes seven crop-disease entries across four distinct fields.
2. Flattened text does not preserve reliable row or column relationships and is not a readable substitute for the table.
3. Delivery must use a semantic four-column table, preserving source row/cell associations. Do not reconstruct them from flattened text.
4. Preserve the source spelling `Phytophytorapalmivora` in the evidence record. Do not silently correct it.
5. The control column contains source statements about fungicides and burning infected plants. These remain unverified source claims; this disposition does not endorse them or add instructions.

## Factual and safety restrictions

Disease names, causative agents, symptoms and control claims require authoritative agricultural/plant-pathology review before student-facing reuse. Any approved corrections must be recorded separately from the original source. Do not add fungicide products, application rates, mixing instructions or operational burning guidance.

## Verification

No importer, parser, application display, test suite or visual regression check was run. Testing was deferred by owner.
