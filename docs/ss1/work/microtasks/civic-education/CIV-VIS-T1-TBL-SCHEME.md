# CIV-VIS-T1-TBL-SCHEME — Civic Education (1st Term scheme table)

Status: IMPLEMENTED — TESTING DEFERRED. This is a representation/disposition decision only; no lesson, coverage, rule, correction or answer was added.

## Source identity

- Source ID: `SS1-SRC-fe52495abec9`
- Member: `SSS 1/1st Term SS1_/CIVIC SSS1.docx`
- Member SHA-256: `ee459b07229cc9ddea7b338c10fc4080261afdbceb2fe5d8765ef1ce520ce80a`
- Existing Mammoth 1.12.2 lines: 5–117.
- Existing raw-text SHA-256: `5c13b2993572de127842693962da27c4f82085bd11dd1085d8c8015b53d0182d`.

## Visual/structural inspection

- Exactly one native Word table: 13 rows × 2 columns.
- Row 1 is the WEEK/TOPIC header.
- Rows 2–13 are the twelve scheme entries, including the combined `12 – 13` revision/examination row.
- The table is not an image.
- The original DOCX contains zero image blips, VML/pict objects, text boxes or OLE objects.

## Representation decision

1. Keep the original DOCX member as the authoritative, byte-identical source under its registered source ID and SHA-256.
2. Use the cell-separated transcription in `CIV-PRE-T1.md` for human-readable inspection. Week numbers remain separate from topic cells, and the topic cell's line breaks/bullet objectives remain listed as separate subitems.
3. Do not add an image asset: the table is structured text/data, not a visual image.
4. Do not flatten the entire table into one lesson body or one undifferentiated string.
5. The current `ss1-subject-v1` package schema has no structured source-table field. This task's allowed paths also exclude a schema extension and explicitly prohibit lessons, coverage, rules, corrections and answers. Therefore no package field is fabricated; a future schema/importer enhancement must add explicit table-cell preservation if the application needs to render this source table directly.

## Boundary

No package JSON or schema field was changed. No image asset, lesson, coverage, rule, correction, answer, approval or verification state was created. The original source remains the exact authority; the transcription is a review aid, not a replacement.
