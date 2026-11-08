# BIO-VIS-T3-TBL-VECTORS — Vectors and carriers table disposition

Status: **IMPLEMENTED — TESTING DEFERRED BY OWNER**. This is a structural disposition only; it does not validate the health claims or approve the table for delivery.

## Source evidence

- Source: `SS1-SRC-78059230037f`, 3rd Term SS1 Biology document.
- Locator: Week 1, blocks 82–86; native table at block 84.
- Table dimensions: 5 rows × 3 columns.
- Block-text SHA-256: `41b3dd72df3e9f92f0505586554f78cb7cd5de26a9842043b4da31eddc74a4a0`.
- Column headings: `Vector or Carrier`, `Micro-organisms`, `Disease caused`.
- The inventory records that plain-text extraction concatenates cells without separators. The importer was not run, so actual importer output remains unverified.

## Disposition

1. The native table contributes five data rows under three distinct headings: vector/carrier, microorganism, and disease caused.
2. Flattened text does not preserve row boundaries or column relationships. It is not a reliable readable representation of the table.
3. Delivery must use a semantic three-column table, preserving each source row's cell associations; do not reconstruct associations from a flattened string.
4. The inventory records these source pairings: Anopheles / Plasmodium / malaria; tsetse fly / Trypanosome / sleeping sickness; housefly / `Vibro cholera` / cholera and typhoid; Aedes mosquito / virus / yellow fever. These are transcribed as source claims only. The exact fifth-row content is not reproduced here because the inventory summary does not enumerate it.
5. Preserve the source spelling `Vibro cholera` in the evidence. Do not silently correct it or endorse the mapping.

## Factual and delivery restrictions

The disease and vector pairings require authoritative microbiology/public-health review under `BIOLOGY-T3-W01-MICROBE-FACTS`. Any approved corrections must be recorded as separate delivery wording; the original source remains unchanged. No additional diseases, vectors, symptoms or transmission claims are added.

## Verification

No importer, parser, application display, test suite or visual regression check was run. Testing was deferred by owner.
