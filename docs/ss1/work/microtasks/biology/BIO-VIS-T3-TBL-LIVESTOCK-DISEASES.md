# BIO-VIS-T3-TBL-LIVESTOCK-DISEASES — Livestock-diseases table disposition

Status: **IMPLEMENTED — OWNER VERIFICATION PENDING**. This is a structural disposition only; it does not validate animal-health claims.

## Source evidence

- Source: `SS1-SRC-78059230037f`, 3rd Term SS1 Biology document.
- Locator: combined Weeks 6–7 section, block 621.
- Table dimensions: 6 rows × 4 columns (header plus five disease entries).
- Block-text SHA-256: `7da8b2be37d612d45533d879fe022efab04c03e0b1859864b39144a67bd31b1f`.
- Columns: name of disease, causative organisms, symptoms, control.
- The inventory identifies five livestock diseases, from Newcastle disease through trypanosomiasis.
- Plain-text extraction concatenates cells without separators. The importer was not run, so actual importer output remains unverified.

## Disposition

1. The native table contributes five livestock-disease entries across four distinct fields.
2. Flattened text does not preserve reliable row or column relationships and is not a readable substitute for the table.
3. Delivery must use a semantic four-column table, preserving source row/cell associations. Do not reconstruct them from flattened text.
4. Preserve source wording in the evidence record. Do not correct, extend or endorse disease names, causative organisms, symptoms or control statements within this visual task.

## Factual and delivery restrictions

The symptoms and vaccination/immunisation claims require qualified veterinary review against current authoritative sources before student-facing reuse. Any approved corrections must be recorded separately from the original source. Do not add treatment advice, vaccine schedules or individualized animal-health instructions.

## Verification

No importer, parser, application display, test suite or visual regression check was run in this change. Owner verification remains pending. The required Biology package test may be run by the owner after reviewing this PR.
