# AG-PRE-T2 — Agricultural Science, 2nd Term preamble indexing

Status: **IMPLEMENTED_TESTING_DEFERRED** (preamble disposition only; not approved or verified). Testing deferred by owner.

## Inputs and provenance

- Repository base: `master` at `794c7cb5b9c17159d88014f3d58a191d13110049`.
- Source: `SS1-SRC-956594d97094`, manifest member `SSS 1/2nd Term SS1_/2ND TERM S1 AGRICULTRAL SCIENCE.docx`.
- Source SHA-256: `e9706d69cbb41e7149e2fe62a202ec21143e827fb78c46cb92efe142f9d7e042`, verified from the extracted member and equal to `SOURCE_ASSIGNMENTS.csv` in AG-SRC-T2.
- The composite archive SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e` was verified during AG-SRC-T2.
- Preamble boundary: direct `w:body` blocks 0–23 (0-based); SHA-256 of the range text: `9967f8c0eb88e7a77adad2d6f9c1495888393fa2eab579a7e05ee5740b5f0791`.
- Locator method is defined in AG-INV-T2: concatenate each block's `w:t` runs without normalization; join inclusive block text with newline; hash UTF-8 bytes. The original DOCX and private extracts are not committed.

## Block disposition

| Blocks | Observed content | Disposition |
|---|---|---|
| 0 | `SECOND TERM E-LEARNING NOTE` | Generic term-template heading, not a subject name. The source alias is already declared by `SS1-SRC-956594d97094-R001`; approval remains pending. |
| 1 | Blank/separator | No instructional content identified. |
| 2 | `SUBJECT: AGRICULTURAL SCIENCE`, class `SS 1` | Subject/class metadata confirms the subject from the document, not the misspelled filename. No lesson objective or coverage row. |
| 3 | Blank/separator | No instructional content identified. |
| 4–5 | Scheme-of-work lead-in/structure | Scheme metadata, not a teaching body. |
| 6 | `WEEKTOPIC` | Scheme table header. It is not a teaching-week label and must not trigger week splitting. |
| 7 | First unnumbered scheme row | Scheme objective for Week 1 by order; objective-level teaching and assessment mapping belongs to `AG-WK-T2-W01`. |
| 8 | Second unnumbered scheme row | Scheme objective for Weeks 2–3 by order; mapping belongs to `AG-WK-T2-W02-03`. |
| 9 | Explicit scheme row `4-5.` | Scheme objective for Weeks 4–5; mapping belongs to `AG-WK-T2-W04-05`. |
| 10 | Explicit scheme row `6.` | Scheme objective for Week 6; mapping belongs to `AG-WK-T2-W06`. |
| 11 | Explicit scheme row `7.` | Scheme objective for Week 7; mapping belongs to `AG-WK-T2-W07`. |
| 12 | Unnumbered scheme row | Scheme objective for Week 8 by order; mapping belongs to `AG-WK-T2-W08`. |
| 13 | Unnumbered scheme row | Scheme objective for Week 9 by order; mapping belongs to `AG-WK-T2-W09`. |
| 14 | `Revision.` | Scheme-only revision marker; no revision lesson is inferred. Disposition belongs to `AG-MARK-T2-REVISION`. |
| 15 | Explicit scheme row `11-12. Examination` | Examination marker, not an examination paper or teaching body. Disposition belongs to `AG-MARK-T2-EXAM`. |
| 16 | Blank/separator | No instructional content identified. |
| 17–21 | `REFERENCES` list (four books) | Bibliographic metadata, not lesson content. Preserve source references; no editions, page ranges or rights status are inferred beyond the inventory. |
| 22–23 | Blank/empty blocks | No instructional content identified. |

The scheme's omitted week numbers are inferred from row order only where AG-INV-T2 explicitly records that structure. The row at block 15 explicitly carries `11-12`; it is not re-labelled as a Week 10 lesson. The separate Week 10 body consists only of its label and the word `REVISION` (blocks 675–676), handled by the marker-disposition task.

## Coverage and rule decisions

- No new source rule is needed in this preamble task. The existing source-alias declaration is reused; revision and examination classifications are delegated to the two dedicated marker tasks.
- Scheme rows for Weeks 1, 2–3, 4–5, 6, 7, 8 and 9 are delegated to their corresponding weekly indexing tasks. Their objective-level coverage must be based on actual teaching and assessment evidence, not inferred from the scheme row alone.
- The revision and examination markers must use `classify_marker` with `SCHEME_ONLY` where applicable and `MARKER` coverage targeting the exact rule ID. No lesson IDs or examination/revision content are fabricated here.
- References and cover/template metadata are not teaching objectives; no artificial coverage rows are created.
- No package lesson, correction, asset, source rule or coverage entry is created by this task. No source wording or source bytes are changed.

## Structural and delivery observations

- Week labels in this source are word-numbered and concatenated with `DATE`; the scheme header `WEEKTOPIC` and `WEEKEND ASSIGNMENT` lines are not week labels. The actual parser's behavior remains unverified.
- The source has a separate Week 10 label followed only by `REVISION`, with no Week 10 teaching body. Scheme items 11–12 identify examination; the document contains no Week 11/12 body, examination paper or marking scheme.
- AG-INV-T2 found practical demonstration and field-work instructions in Weeks 2–3, but no observation/recording template. Agro-chemical spraying is mentioned elsewhere without product, rate or PPE instructions; this preamble task adds none.
- A tutor-brand image is in the document header, outside the body-block range. Its exclusion from instructional content and non-republication of contact details belong to `AG-VIS-T2-BRANDING`.
- The source-alias owner approval remains pending and blocks delivery. The package remains `PENDING`.

## Edits and checks

- Added this preamble disposition record.
- Updated only `AG-PRE-T2` to `IMPLEMENTED_TESTING_DEFERRED`, recorded this report as its implementation reference, recomputed queue status counts, and removed the completed item from `next_runnable`.
- No package field, source rule, lesson, coverage row, correction, asset, shared importer/schema/compiler, or other subject was changed.
- Authoring checks: JSON parse, task ID/status/dependency consistency, and review of the intended file changes. Tests, importer/compiler, typecheck, database, rendering and device checks were not run, in accordance with the owner's deferred-testing instruction.

## Remaining

- The source-alias approval remains an owner action and blocks delivery.
- Scheme objectives for Weeks 1, 2–3, 4–5, 6, 7, 8 and 9 require their respective weekly indexing decisions.
- Revision and examination markers require their separate dispositions.
- Next eligible after this item: `AG-PRE-T3`, subject to a fresh master/queue read.
