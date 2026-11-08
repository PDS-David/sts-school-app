# BIO-VIS-T3-TBL-STI — STI table disposition

Status: **IMPLEMENTED — TESTING DEFERRED BY OWNER**. This is a structural disposition only; it does not validate or endorse any medical claim.

## Source evidence

- Source: `SS1-SRC-78059230037f`, 3rd Term SS1 Biology document.
- Locator: section labelled `WEEK SEVEN`, block 183.
- Table dimensions: 5 rows × 4 columns (header plus four source entries).
- Block-text SHA-256: `0582a55b1abc45343de967bc1fe916bb0744cd94bafbb144af7a54b350de8c44`.
- Columns: disease, causative organism, symptoms, prevention/control.
- Source row labels: gonorrhoea, syphilis, AIDS and genital warts.
- The inventory records that table-cell text is concatenated without separators. The importer was not run, so actual importer output remains unverified.

## Disposition

1. The native table contains four source entries and four distinct information fields.
2. Flattened text does not preserve reliable row boundaries or the relationships between the disease, organism, symptom and prevention/control cells.
3. Delivery must use a semantic four-column table, retaining the original row/cell associations. Do not reconstruct associations from flattened text.
4. Preserve the source wording unchanged in the evidence record. Do not expand, correct or supplement disease names, organism names, symptom statements, prevention/control claims or vaccine age ranges within this visual-disposition task.

## Factual and delivery restrictions

The table's symptoms, prevention/control statements and vaccine age range require current authoritative public-health review under `BIOLOGY-T3-W03-HEALTH-CLAIMS`. The source's HIV/AIDS wording differs between the table and the adjacent body, and the body contains a transmission claim that also requires review. Any approved corrections must be recorded as separate delivery wording; the source remains unchanged. Do not provide individualized medical advice.

## Verification

No importer, parser, application display, test suite or visual regression check was run. Testing was deferred by owner.
