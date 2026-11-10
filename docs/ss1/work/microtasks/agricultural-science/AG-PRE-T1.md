# AG-PRE-T1 — Agricultural Science, 1st Term preamble indexing

Status: **IMPLEMENTED_TESTING_DEFERRED** (preamble disposition only; not approved or verified). Testing deferred by owner.

## Inputs and provenance

- Repository base: `master` at `c4fdf778d3e6c5e37b8ed51e4d03572f08fe818c`.
- Source: `SS1-SRC-7aa642b0085b`, manifest member `SSS 1/1st Term SS1_/1ST TERM S1 AGRICULTURAL SCIENCE.docx`.
- Source SHA-256: `df1b516cdd8855d069a329d7aa627dbd0dcd3612dd10d254c53af9cb93a56526`, already verified against `SOURCE_ASSIGNMENTS.csv` by AG-SRC-T1/AG-INV-T1.
- Preamble boundary: direct `w:body` blocks 0–44 (0-based); SHA-256 of the range text: `6c16cc92e1f72d3f0deaa85356717c814d7044ca83597343d2b50b2a1f533e50`.
- Locator method is the one defined in AG-INV-T1: concatenate each block's `w:t` runs without normalization; join inclusive block text with newline; hash UTF-8 bytes. The original DOCX and private extracts are not committed.

## Block disposition

| Blocks | Observed content | Disposition |
|---|---|---|
| 0–7 | Cover material; one-cell cover table at block 2 and a drawing at block 4 | Non-instructional cover/branding. The two embedded JPEGs are tutor-brand material, not instructional figures; exclude them from lesson content and do not republish contact details. |
| 8 | `FIRST TERM E-LEARNING NOTE` | Generic term-template heading. It is not a subject name; source alias is already declared by `SS1-SRC-7aa642b0085b-R001`. |
| 9 | `SUBJECT: AGRICULTURAL SCIENCE`, class `SS1` | Subject/class metadata confirming the assigned subject. No lesson objective or coverage row. |
| 10–11 | Scheme-of-work heading/table header, including `WEEK  TOPIC` | Scheme structure, not a teaching body. Retain as source metadata; do not interpret the header as a week marker. |
| 12–21 | Scheme items 1–10 | Scheme objectives are term-level pointers to the ten teaching-week bodies. Their objective-level mapping belongs to `AG-WK-T1-W01` through `AG-WK-T1-W10`; this preamble task does not duplicate or pre-judge those coverage decisions. |
| 22 | `Revision of the Term’s Work.` (scheme item 11) | Scheme-only marker, not a Week 11 lesson. Existing rule `SS1-SRC-7aa642b0085b-R002` and coverage `COV-AG-T1-REVISION-MARKER` classify it as `MARKER`. |
| 23 | `Examination.` (scheme item 12) | Scheme-only marker, not an examination lesson or paper. Existing rule `SS1-SRC-7aa642b0085b-R003` and coverage `COV-AG-T1-EXAM-MARKER` classify it as `MARKER`. |
| 24 | Separator/blank preamble block | No instructional content identified in the inventory. |
| 25–29 | `REFERENCES` list (four books) | Bibliographic source metadata, not lesson content. Preserve as source references; no titles, editions, page ranges or rights status are inferred beyond the inventory. |
| 30–44 | Blank/empty blocks | No instructional content identified. |

The inventory's range description identifies blocks 0–7 as cover material and blocks 24 and 30–44 as blank/separator material; it does not provide individual text hashes for those blocks. The range hash above is the reproducible preamble-level hash and no per-block hashes are invented here.

## Coverage and rule decisions

- No new source rule is needed. The existing source-alias and two marker rules already represent the only preamble classifications requiring executable declarations.
- The two marker coverage rows already target their exact `classify_marker` rule IDs, as required by the contract. No lesson ID is fabricated for either marker.
- Scheme items 1–10 are not treated as non-instructional merely because they occur before the first parsed week. Their objective-level coverage is delegated to the corresponding weekly indexing tasks.
- The reference list and cover metadata are not teaching objectives and do not receive artificial coverage rows.
- No package lesson, correction, asset, or additional coverage entry is created by this task. No source wording or source bytes are changed.

## Structural and delivery observations

- The preamble contains a scheme header with the text `WEEK  TOPIC`; it is not a teaching-week label.
- The source has ten teaching-week bodies only. Items 11 and 12 are markers without Week 11/12 bodies, revision worksheet, examination paper, or marking scheme (see the separate marker dispositions).
- The source inventory found no practical observation/recording section and no safe-chemical-handling instructions. Agro-chemicals are named elsewhere in the source without rates, mixing directions, doses, or PPE instructions; this preamble task adds none.
- The source-alias owner approval remains pending. The package remains `PENDING`; this disposition does not make the term deliverable.

## Edits and checks

- Added this preamble disposition record.
- Updated only the `AG-PRE-T1` queue item to `IMPLEMENTED_TESTING_DEFERRED`, recorded this report as its implementation reference, recomputed queue status counts, and removed the completed item from `next_runnable`.
- No other queue item, package field, source rule, lesson, coverage row, correction, asset, shared importer/schema/compiler, or other subject was changed.
- Authoring checks: JSON parse, task ID/status/dependency consistency, and review of the exact intended file changes. Tests, importer/compiler, typecheck, database, rendering and device checks were not run, in accordance with the owner's deferred-testing instruction.

## Remaining

- The source-alias approval remains an owner action and blocks delivery.
- Scheme objectives 1–10 still require their respective weekly indexing decisions; this report does not substitute for them.
- The next eligible queue item after this task is `AG-PRE-T2` (subject to a fresh master/queue read before the next write).
