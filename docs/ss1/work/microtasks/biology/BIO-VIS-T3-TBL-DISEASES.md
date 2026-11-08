# BIO-VIS-T3-TBL-DISEASES — Microorganism diseases table disposition

Status: **IMPLEMENTED — TESTING DEFERRED BY OWNER**. This is a structural disposition only; it does not validate the medical claims or approve the table for delivery.

## Source evidence

- Source: `SS1-SRC-78059230037f`, 3rd Term SS1 Biology document.
- Locator: Week 2, blocks 149–152; native table at block 151.
- Table dimensions: 21 rows × 5 columns (header plus 20 disease rows).
- Block-text SHA-256: `781a2ddb44d6167e3e2956d4c26ba46fdb5a267edf56387cc17b5d4fdc179f5c`.
- Columns: disease, causative agent, symptoms, transmission, control.
- The inventory records that plain-text extraction concatenates cells without separators. The importer was not run, so actual importer output remains unverified.

## Disposition

1. The native table contributes 20 disease entries across five distinct fields: disease, causative agent, symptoms, transmission and control.
2. Flattened text cannot reliably preserve the row boundaries or five-column relationships. It is not a readable substitute for the native table.
3. Delivery must restate the content as a semantic five-column table, preserving source cell associations. Do not reconstruct row pairings from a flattened text string.
4. The inventory identifies the disease rows as including chickenpox, cholera, common cold, dengue, diarrhoea, diphtheria, leprosy, measles, pneumonia, poliomyelitis, rabies, septic sore throat, sleeping sickness, smallpox, tuberculosis, tetanus, typhoid, whooping cough, influenza and malaria. The inventory summary says 20 disease entries; the exact cell text must be taken from the verified source document when the table is authored.
5. The source contains eight external symptom-guide hyperlinks. They are recorded as source links only and were not opened or verified:
   - NHLBI cough page: `https://www.nhlbi.nih.gov/health/health-topics/topics/cough/`
   - Seven legacy NYT Health symptom-guide pages at `http://health.nytimes.com/health/guides/symptoms/`, for the symptom slugs described in the inventory: `depression`, `stress-and-anxiety`, `swollen-glands`, `abdominal-pain`, `agitation`, `bloody-or-tarry-stools`, and `confusion`. The inventory does not preserve the complete per-link hrefs beyond this prefix and slug description; no missing URL suffix is guessed.

## Factual and delivery restrictions

The disease names, causative agents, symptoms, transmission routes and controls require current authoritative disease-specific review under `BIOLOGY-T3-W02-HEALTH-CLAIMS`. Legacy symptom-guide links are not sufficient authority. Any approved corrections must be recorded as separate delivery wording; the original source remains unchanged. Do not turn this task into individualized medical advice.

## Verification

No importer, parser, application display, test suite or visual regression check was run. Testing was deferred by owner.
