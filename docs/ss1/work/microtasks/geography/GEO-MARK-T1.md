# GEO-MARK-T1 — Geography First Term marker and irregular-section disposition

Status: **IMPLEMENTED_TESTING_DEFERRED**. All 56 marker occurrences and irregular sections are accounted for by line and category; no unsafe/non-unique parser rule is fabricated.

## Source identity
- Source `SS1-SRC-1c1c1bdcecb4`; member `SSS 1/1st Term SS1_/1ST TERM S1 GEOGRAPHY.doc`.
- Member SHA-256 `4220757cb96c6d6ac5153f7a862b45725a7d87c8e64be5b11ec39a843ca1491c`; composite archive SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`.
- Whole getBody body lines 1-708; SHA-256 `13e8d0c013ef89c6b8965b8cc6d4a5308c5ee450a7df3588d2462db68c86ee3e`.
- Locator: word-extractor 1.0.4 getBody(), 1-based LF lines, no normalisation.

## Marker register

| Category | Occurrences |
|---|---|
| EVALUATION QUESTIONS | 52, 111, 157, 193, 206, 223, 301, 327, 374, 444, 464, 504, 513, 562, 581, 658 |
| EVALUATION QUESTION (singular) | 67, 394 |
| GENERAL EVALUATION | 70, 331, 397, 468, 517 |
| GENERAL EVALUATION QUESTIONS | 161, 249, 620, 686 |
| READING ASSIGNMENT | 77, 168, 256, 337, 402, 475, 524, 592, 693 |
| WEEKEND ASSIGNMENT | 80, 171, 259, 340, 405, 478, 527, 595, 627, 696 |
| THEORY | 87, 178, 266, 347, 412, 490, 535, 602, 634, 705 |

Total: 56 marker occurrences (16 + 2 + 9 + 9 + 10 + 10). Every week heading label occurs exactly once. Week Nine has no EVALUATION QUESTIONS marker and no READING ASSIGNMENT marker; its only evaluation heading is GENERAL EVALUATION QUESTIONS at line 620.

## Irregular and unlabelled sections
- Week Three: `B: EARTH REVOLUTION` at lines 228-231 (block SHA-256 `813d79df4a89907c6245f96859e5c508d278d1755ec761b657c32b1fe89279b5`); “Dawn and Twilight” at lines 242-243 (SHA-256 `242581bea1150363ffc379eb08d432e205998dcbc812814d60b8f7eb3c429d12`). The rotation section has no matching “A:” label, and Dawn/Twilight has no separate evaluation.
- Week Five: unnumbered subsection at line 354 (“Calculation of distance using lines of latitude”) and line 378 (“Calculation of Local Time using the lines of longitude”). READING ASSIGNMENT label at line 402 is glued to the end of the preceding line after a long run of spaces.
- Week Nine: no evaluation-questions marker and no reading-assignment marker.
- Week Ten: lettered subsections (a)-(d) at lines 645, 653, 663 and 668. Importance/disadvantage lists at lines 673-684 are tab-aligned two-column text, not a Word table.
- Missing drawing prompts: Week Six Theory line 491; Week Seven Theory line 536; Week Ten Theory lines 705-706. No corresponding diagram/map/figure exists in the source; the only JPEGs are branding letterheads.

## Rule-anchor decision
The inventory lists the marker categories and line numbers but not the full exact source line text for each occurrence. Repeated generic headings cannot be safely used as unique `classify_marker` anchors without checking the full unmodified 708-line text. No generic rule is added. Blocking open item `GEOGRAPHY-T1-MARKER-EXACT-ANCHORS` requires exact unique anchors and validation before rules can be written.

## Open items recorded in geography.json
- `GEOGRAPHY-T1-MARKER-EXACT-ANCHORS`
- `GEOGRAPHY-T1-W03-UNLABELLED-SECTIONS`
- `GEOGRAPHY-T1-W05-READING-ASSIGNMENT-GLUED`
- `GEOGRAPHY-T1-W09-MISSING-EVALUATION-READING`
- `GEOGRAPHY-T1-W10-LETTERED-LISTS`
- `GEOGRAPHY-T1-MISSING-DRAWING-PROMPTS`

No marker is used as evidence that teaching was covered. No lesson is authored by this marker task.
