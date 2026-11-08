# BIO-VIS-T3-TBL-LIVESTOCK-PARASITES — Livestock parasites table disposition

Status: **IMPLEMENTED — TESTING DEFERRED BY OWNER**. This is a structural disposition only; it does not validate animal-health or chemical-control claims.

## Source evidence

- Source: `SS1-SRC-78059230037f`, 3rd Term SS1 Biology document.
- Locator: combined Weeks 6–7 section, block 595.
- Table dimensions: 6 rows × 4 columns (header plus five parasite entries).
- Block-text SHA-256: `639490ecce6becdc9d9e039a4c17f021671dee7214360513fd6947c97e557e9a`.
- Columns: parasite, host, effects/economic importance, control.
- Source entries include ticks, liver fluke, roundworm, lice and tsetse fly.
- The inventory records that plain-text extraction concatenates cells without separators. The importer was not run, so actual importer output remains unverified.

## Disposition

1. The native table contributes five parasite entries across four fields.
2. Flattened text does not preserve reliable row or column relationships. It is not a readable substitute for the table.
3. Delivery must use a semantic four-column table, preserving source cell associations. Do not reconstruct row pairings from flattened text.
4. The inventory specifically notes an empty host cell in the liver-fluke row. Preserve that blank as a source gap; do not fill it by inference.
5. The control column includes insecticide and pool-treatment claims. These remain source claims only and require qualified veterinary/agricultural and chemical-safety review. No product, concentration or application procedure is added or endorsed.

## Factual and safety restrictions

The animal-health and chemical-control statements require authoritative review before student-facing reuse. Any approved correction must be recorded separately from the original source. Do not add treatment advice, chemical handling instructions, doses or application steps.

## Verification

No importer, parser, application display, test suite or visual regression check was run. Testing was deferred by owner.
