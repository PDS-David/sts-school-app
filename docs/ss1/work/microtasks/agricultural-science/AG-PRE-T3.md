# AG-PRE-T3 — Agricultural Science, 3rd Term preamble indexing

Status: **IMPLEMENTED_TESTING_DEFERRED** (preamble disposition only; not approved or verified). Testing deferred by owner.

## Inputs and provenance

- Repository base: `master` at `51841710f050936aea80d686c60d367a8be1ba60`.
- Source: `SS1-SRC-458a07f7ea5a`, manifest member `SSS 1/3rd Term SS1_/3RD TERM S1 AGRICULTURAL SCIENCE.docx`.
- Source SHA-256: `9e920bff3769d9d977c4b2849cc77c769b6033be9176f4f6b35c27935999e12a`, verified directly from the attached DOCX by AG-INV-T3 and equal to `SOURCE_ASSIGNMENTS.csv`.
- Preamble boundary: direct `w:body` blocks 0–25 (0-based); SHA-256 of the range text: `3f38a1bf54c05301d2a842b6fce4450dc0594cbdcf6394c34061879232353cda`.
- Locator method is defined in AG-INV-T3: concatenate each block's `w:t` runs without normalization; join inclusive block text with newline; hash UTF-8 bytes. Original source bytes and private extracts are not committed.

## Block disposition

| Blocks | Observed content | Disposition |
|---|---|---|
| 0 | `THIRD TERM E-LEARNING NOTE` | Generic term-template heading, not a subject name. Existing alias declaration `SS1-SRC-458a07f7ea5a-R001` is reused; owner approval remains pending. |
| 1 | Blank | No instructional content. Included in the preamble range hash. |
| 2 | `SUBJECT: AGRICULTURAL SCIENCE / CLASS: SS1` | Subject/class metadata explicitly confirms the subject. No lesson objective or coverage row. |
| 3 | Blank | No instructional content. Included in the preamble range hash. |
| 4 | `SCHEME OF WORK` | Scheme section heading; metadata, not a lesson. |
| 5 | Blank/separator | No instructional content identified. |
| 6 | `WEEKTOPIC` | Scheme table header, not a teaching-week label. |
| 7 | `1Simple farm tools` | Scheme item 1; objective mapping belongs to `AG-WK-T3-W01`. Source number and topic are adjacent in the runs; wording retained. |
| 8 | `2Farm power` | Scheme item 2; mapping belongs to `AG-WK-T3-W02`. |
| 9 | `3Farm mechanization` | Scheme item 3; mapping belongs to `AG-WK-T3-W03`. |
| 10 | `4 – 5Anatomy and physiology of farm animals` | Scheme item 4–5; mapping belongs to `AG-WK-T3-W04` and `AG-WK-T3-W05`. |
| 11 | `6 – 7Reproduction in farm animals` | Scheme item 6–7; mapping belongs to `AG-WK-T3-W06` and `AG-WK-T3-W07`. |
| 12 | `8Environmental physiology` | Scheme item 8; mapping belongs to `AG-WK-T3-W08`. |
| 13 | `9 – 10Livestock management (pig and cattle)` | Scheme item 9–10; mapping belongs to `AG-WK-T3-W09` and `AG-WK-T3-W10`. |
| 14 | `11Revision ` | Scheme-only revision marker. No Week 11 body, revision worksheet or marking scheme. Disposition belongs to `AG-MARK-T3-REVISION`. |
| 15 | `12Examination` | Scheme-only examination marker. No Week 12 body, examination paper or marking scheme. Disposition belongs to `AG-MARK-T3-EXAM`. |
| 16 | Blank/separator | No instructional content identified. |
| 17 | `REFERENCES` | Bibliography heading, not a lesson objective. |
| 18–23 | Six reference entries | Bibliographic metadata only. The listed books and Wikipedia were inventoried, not independently consulted; no editions, page ranges, accuracy or reuse rights are inferred. |
| 24–25 | Blank/empty blocks | No instructional content identified. Included in the preamble range hash. |

The source scheme mapping is explicit in the inventory: items 1, 2, 3, 4–5, 6–7, 8 and 9–10 correspond respectively to Weeks 1, 2, 3, 4–5, 6–7, 8 and 9–10. Items 11 and 12 are markers, not teaching-week bodies.

## Coverage and rule decisions

- Existing source alias `SS1-SRC-458a07f7ea5a-R001` is reused. No additional alias rule is created.
- Scheme objectives for Weeks 1–10 are delegated to the corresponding weekly indexing items. The weekly tasks must establish objective-level support from the actual body, assessments and source assets; scheme text alone is not proof of teaching.
- Revision and examination classification and their `MARKER` coverage rows are delegated to `AG-MARK-T3-REVISION` and `AG-MARK-T3-EXAM`. They must target the exact `classify_marker` rule IDs; this preamble task does not fabricate those rules or coverage rows.
- References, headings, subject/class metadata and blank blocks are not instructional objectives and receive no artificial coverage rows.
- No package lesson, correction, asset, source rule or coverage entry is created by this task. No source wording or source bytes are changed.

## Structural and delivery observations

- The scheme heading `WEEKTOPIC` is a table header, not a week label. The scheme row numbers and topic text are joined in the source runs; the exact row strings above preserve that adjacency without silently inserting source characters.
- The six bibliography entries are references, not proof that their contents were consulted or that the lessons are supported by them.
- The source alias owner approval remains pending and blocks delivery. The package remains `PENDING`.
- Practical project content, visual assets, and chemical/dosage safety matters occur inside teaching-week bodies and remain with their respective weekly and visual-disposition tasks; this preamble task does not resolve or omit them.

## Edits and checks

- Added this preamble disposition record.
- Updated only `AG-PRE-T3` to `IMPLEMENTED_TESTING_DEFERRED`, recorded this report as its implementation reference, recomputed queue status counts, and removed the completed item from `next_runnable`.
- No package field, source rule, lesson, coverage row, correction, asset, shared importer/schema/compiler, or other subject was changed.
- Authoring checks: JSON parse, task ID/status/dependency consistency, and review of the intended file changes. Tests, importer/compiler, typecheck, database, rendering and device checks were not run, in accordance with the owner's deferred-testing instruction.

## Remaining

- The source-alias approval remains an owner action and blocks delivery.
- Scheme objectives for Weeks 1–10 require their respective weekly indexing decisions.
- Revision and examination markers require their separate dispositions.
- Next eligible queue items are the uncompleted weekly-indexing tasks, subject to fresh master/queue ordering.
