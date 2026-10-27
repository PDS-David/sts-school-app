# SS1 subject package contract — `ss1-subject-v1` (FROZEN)

Machine schema: `backend/src/db/ss1/subjectPackageSchema.ts`. Worker start data: `WORKER_START.json`. Synthetic shape example: `example-subject-package.json` (outside `subjects/`, never loaded; its text is invented).

## Rules for workers
1. Edit ONLY `backend/src/db/ss1/subjects/<your-slug>.json`. Never touch the importer, routes, other packages or shared records.
2. Data only. Every object is strict; unknown keys/operations are rejected. No code, no regex, no JS.
3. Do not insert invented lessons into a skeleton. `PENDING` packages must have zero lessons/assets/corrections.
4. Source bytes and private extracts stay outside Git. Quote only what a rule/locator needs.
5. Need something the schema lacks? Add an `open_items` entry (kind `OWNER_ACTION`) and hand off to the foundation owner. Do not invent keys.

## Package sections (all required)
| section | content |
|---|---|
| `schema_version` | `ss1-subject-v1` |
| `subject_slug`, `canonical_subject` | registered pair (`constants.ts`); file name = `<slug>.json` |
| `package_status` | three SEPARATE axes: `implementation` (PENDING/IN_PROGRESS/IMPLEMENTED/BLOCKED), `content_approval` (NOT_REQUESTED/PENDING/APPROVED/REJECTED), `verification` (NOT_RUN/PASSED/FAILED — set only by SS1-09) |
| `sources` | manifest `source_id` + `sha256` + `archive_member`, class `SS 1`, folder term, canonical subject, verbatim `document_header_subject`, `assignment_confirmed`, `role` (PRIMARY / DUPLICATE_PROVEN / CROSS_SUBJECT_HANDOFF), `evidence_locator` |
| `source_rules` | hash-scoped operations (below) |
| `lessons` | supplements: id, term, subject, `sequence`, title, objectives, body (≥300 chars), `practice[]` (prompt+answer+marking), `covers_objectives`, `provenance`, `reuse[]`, `references[]`, `content_hash` |
| `delivery_corrections` | bind exact source identity + raw body hash to replacement lesson IDs |
| `assets` | binding, private `file`, sha256, bytes, media type, alt text (≥15 chars), `figure_order`, `displayed`, `source_locator`, `rights` |
| `coverage` | every scheme objective → status + exact evidence |
| `open_items` | exact missing fact/material/permission/owner action, affected IDs, `blocks_student_delivery` |

## Operations (the complete vocabulary)
All carry `rule_id` (`<TOKEN>-R01`), `source_id`, `source_sha256`, `reason`. The rule applies only to a document whose bytes hash to `source_sha256`. Target = canonical week label + exact `anchor`; the anchor must occur in exactly one topic, exactly once. Every rule must match exactly once per run or the import is blocked.
- `split_before_anchor` — split one parsed topic into two at the anchor; all original lines and their order are kept.
- `attach_stranded_label` — merge a topic that is only a stray label into the NEXT/PREVIOUS topic (body must equal the label exactly).
- `classify_marker` — keep the row, mark it `SCHEME_ONLY` / `EVALUATION_ONLY` / `HEADING_ONLY` / `EXAM_OR_REVISION_MARKER`. Reported separately; never counts as teaching.
- `explicit_source_alias` — approve a generic-inferred subject name (e.g. `Computer Studies`) as this package's canonical subject. Without it the alias BLOCKS.
- `exclude_proven_duplicate` — drop a topic only when its normalised body hash equals the stated target's hash and the target is a kept row.

## Identity and hashing
- **Topic identity** (existing DB constraint): `(school_code='secondary', class_name='SS 1', subject, term_label, order_index)`. Never hard-code a DB id; never use list index as identity.
- **Original rows** keep generic positional numbering. **Supplement rows are appended** after the originals of their bucket (ordered by `sequence`, then id); `topics.source_file = <LESSON_ID>.json`, week label `SUPPLEMENT <LESSON_ID>`.
- **Raw body hash** = sha256 of the exact stored `source_reference` (delivery corrections, asset binding). **Normalised hash** = NFKC, lower-case, whitespace-collapsed (duplicate proof). **Lesson `content_hash`** = sha256 of canonical JSON of `{title, objectives, body, practice}` (keys sorted, NFC). See `identity.ts`.
- **IDs:** lesson `SUP-SS1-<TOKEN>-NNN`; correction `DC-SS1-<TOKEN>-NNN`; open item `OI-<TOKEN>-NNN`; asset key `ss1-<slug>-<name>`; objective `<TOKEN>-<term digit>-NNN`.

## Status vocabulary
Coverage: `SUPPORTED` (exact SOURCE_LESSON evidence, not a marker) · `IMPLEMENTED_EQUIVALENT` (SUPPLEMENT evidence) · `PARTIAL` (evidence + note + open item) · `UNRESOLVED` (open item) · `MARKER` (classified marker row). A title, overlap or evaluation-only line is never proof of teaching. A package is reported `NOT COMPLETE` while any objective is PARTIAL/UNRESOLVED or an OPEN item blocks delivery.

## Policy (do not re-litigate)
SS1 has instructional 1st, 2nd and 3rd Terms; JSS3's Third-Term ban and Computer Studies exclusion do not apply. Data Processing is included. Senior substantive teaching ends by SS2; SS3 is exam preparation (not edited here). No exam board/year/prescribed book/pathway/subject equivalence is inferred from a filename. No elective is declared compulsory.

## Foundation interface (importer)
`ingestTopics.ts --root <dir containing "SSS 1"> --school-code secondary [--ss1-plan-out f] [--ss1-snapshot rows.json] [--ss1-packages-dir d] [--ss1-allow-partial-sources] [--ss1-require-all-packages]`
- Unknown file bytes (hash not in manifest) → blocked. Missing/pending packages → listed explicitly (blocking only with `--ss1-require-all-packages`).
- Snapshot file = JSON array of `{subject_name, term_label, order_index, title, source_file, source_reference_sha256}`; any mismatch blocks.
- SS 3 stays audit-only. Other classes are untouched.
