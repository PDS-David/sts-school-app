# SS1 subject contract — ss1-subject-v1

Status: **IMPLEMENTED — TESTING DEFERRED BY OWNER**. This is a worker interface,
not certification. Authoritative executable schema: `backend/src/db/ss1/subjectPackageSchema.ts`.
All objects are strict: unknown keys/operations are rejected. Do not edit shared
schema, importer, routes or other workers' packages. Request a versioned foundation
change for unsupported source structure. No subject packages are fabricated here.

## Inputs and ownership

Use `docs/ss1/IMPLEMENTATION_20261026/SOURCE_ASSIGNMENTS.csv` (61 sources, 21
subjects). The JSON registry under `backend/src/db/ss1/` is its literal machine copy.
The only archive is `SSS 1-20260507T072431Z-3-001.zip`, SHA256
`024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`.
Do not commit archive bytes, original full-document text, private plans or credentials.
Workers own `backend/src/db/ss1/subjects/<assigned-slug>.json` and
`backend/src/db/ss1/assets/<assigned-slug>/`. Their existing task prompts govern
lesson authoring, evidence, source reuse and checkpoints. All three SS1 terms are
instructional; Data Processing is included. No SS3 redistribution occurs here.

## Exact JSON fields

Every package requires these fields, even when an array is empty:

| Section | Fields / constraints |
|---|---|
| envelope | `schema_version: "ss1-subject-v1"`, `subject_slug` from registry, `canonical_subject` confirmed from document, `package_status: PENDING / IMPLEMENTED` |
| sources[] | `source_id`, `sha256`, `archive_member` verbatim from manifest; `class_name: "SS 1"`; `term: "1st Term" / "2nd Term" / "3rd Term"`; `canonical_subject`; `header_text` exact uniquely occurring source heading; `header_evidence: {locator, explanation}` |
| source_rules[] | Rule vocabulary below; each has `id, op, source_id, source_sha256, anchor, evidence: {locator, explanation}` |
| lessons[] | `id, class_name, term, subject, title, objectives[], body, body_sha256, practice[], provenance[], state` |
| delivery_corrections[] | `id, source_id, source_sha256, source_lesson_id, body_sha256, replacement_id, reason, evidence: {locator, explanation}` |
| assets[] | `id, lesson_id, path, sha256, bytes, media_type, alt, order, source_locator, provenance, state` |
| coverage[] | `id, source_id, objective, objective_locator, status, lesson_ids[], evidence[]` (each evidence `{locator, explanation}`) |
| open_items[] | `id, kind, detail, required_action, affected_ids[], blocks_delivery` |

`kind` is CONTENT / FACT / PERMISSION / OWNER_ACTION / VERIFICATION.
An open item names the precise missing fact, material, permission or action; it
must not replace missing content with a general assurance. Include missing terms
and scheme-only objectives as unresolved items, not invented source entries.

`state` requires all of:
- `content_approval`: PENDING / APPROVED;
- `approval_reference`: nonempty evidence reference or null;
- `implementation`: DRAFT / IMPLEMENTED;
- `verification`: DEFERRED / VERIFIED;
- `verification_reference`: nonempty evidence reference or null.

An agent may mark implementation IMPLEMENTED. Do not invent approval or a
verification reference. VERIFIED requires actual later evidence. PENDING approval
can remain in a published package, visibly blocking executable delivery; it does
not prevent source-code implementation from being submitted.

`provenance` is `{title, locator, url, rights, reuse_status, attribution}`; `url` is
a valid URL or null, `reuse_status` is PERMITTED / PENDING. Explain the basis for
reuse in `rights`. A citation alone is not reuse permission. Assets have one
provenance object; lessons require a nonempty array.

`practice[]` is `{id, question, answer, marks, marking:[{criterion, marks}]}`.
Every item needs a complete answer and marking breakdown; positive integer
criterion marks sum exactly to the question's marks. Lesson objectives/practice/
provenance arrays are nonempty. Lesson bodies must actually teach the objectives;
no character-count rule purports to prove educational completeness.

## Hashes, identities and order

SHA256 is lowercase 64-character hex over exact bytes. Source/asset hashes use
original file bytes. `body_sha256` on an authored lesson hashes UTF-8 `body` only,
without Unicode/newline/whitespace normalization. The compiler creates the delivered
sourceReference by joining body, objectives, and the complete practice/marking guide;
its identified row carries a separate hash of that assembled body. Do not confuse
the two hashes.

Original parsed lesson identity is `SS1-SRC-…:BODY:<sha256 of exact parsed body>`.
Use `originalLessonId(source_id, body)`. Parsed body includes its WEEK heading;
parser trimming is part of the existing importer. IDs are content-bound: changed
segmentation/text needs newly reviewed mappings, never same-title fallback.
Repeated identical bodies within a source are ambiguous and fail closed.

Supplement IDs are `SUP-SS1-<UPPERCASE-SUBJECT-SLUG>-<STABLE-SUFFIX>`, e.g.
`SUP-SS1-DATA-PROCESSING-…`. Hyphens in the slug remain hyphens. No DB topic ID or
order_index is an authoring key. Assets use stable globally unique IDs, a stable
lesson ID, and a nonnegative figure `order` unique within that lesson.

Compiler order: original files in exact archive-member lexical order, parser
order within a file; supplements appended after originals, sorted by stable ID.
Each class/subject/term bucket gets 1-based order indexes. Existing DB identity is
`(school_code, class_name, subject, term_label, order_index)`. The importer retains
its transaction-level exact title/body/source-file compatibility check and never
updates an original row. A changed heading/segmentation or earlier-sorting new
lesson can cause a stored-snapshot mismatch. That is a blocker requiring a
separately reviewed migration, NOT authority to renumber stored rows/progress.
The pure `assertExistingCompatible` helper uses Row.filePath; snapshot adapters
must supply the same root-relative source_file representation on both sides.

## Declarative source rules

All rules bind a manifest source SHA and a nonempty exact anchor occurring once
in the unmodified extracted text. Rules run in array order; conflicts fail.
There is no arbitrary regex, JavaScript, filesystem or network execution.

| op | Extra fields | Behaviour |
|---|---|---|
| split_before | week_label | Inserts `WEEK <week_label>\n` before a line-start anchor. Numeric week or numeric range only. No source character deleted. |
| attach_stranded_label | week_label, following_anchor | Same boundary insertion before the label; following_anchor must occur once and immediately follow label with whitespace only between. |
| classify_marker | kind: REVISION / EXAMINATION / SCHEME_ONLY | Records classification for the exact containing parsed row. SCHEME_ONLY may instead identify preamble material outside parsed rows. Classification never discards a body. |
| source_alias | observed_subject, canonical_subject, approval_reference | Exact observed heading equals anchor and header_text. Only this evidence-backed declaration permits a heading differing from canonical_subject beyond case/whitespace. |
| exclude_duplicate | target_source_id, target_sha256 | Excludes only a byte-identical, same-term source with identical extracted text, in the same package. Target must exist and not itself be excluded. No near-copy/name-based exclusion. |

A source has one canonical subject in v1. A genuinely mixed-subject source or a
needed character-level correction requires a foundation version change. Preserve
raw wording and implement factual teaching corrections as delivery replacements.
Preamble text is privately hash-accounted in dispositions; workers must map its
scheme objectives in coverage. Do not assume a preamble is noninstructional merely
because the generic parser starts later.

## Coverage and blockers

Statuses: SUPPORTED / IMPLEMENTED_EQUIVALENT / PARTIAL / UNRESOLVED / MARKER.
Map every identified scheme objective to exact source/supplement IDs with explicit
locator and explanation of objective-level teaching, not word overlap. Supported,
equivalent and marker entries need targets and evidence; equivalent entries need
a supplement. PARTIAL and UNRESOLVED block delivery. Every source needs coverage.
The program checks references and declarations; it does not certify the truth or
exhaustiveness of a teacher's coverage judgment. Source-only marker preamble items
use a SCHEME_ONLY rule ID as their MARKER coverage target; do not invent a lesson ID for them.

Missing registered package, pending package, unaccounted source, missing input,
no parsed lessons, partial coverage, pending approval/reuse, blocking open item,
or missing asset causes `ready:false`. Invalid identities/hashes/schema throw.
A partial private plan contains candidate rows for investigation, not an executable
collection. Importer adds SS1 rows only when the plan has no blockers.

## Assets and delivery handoff

Paths are repository-relative under `backend/src/db/ss1/assets/<subject-slug>/`,
never absolute or traversal paths. Allowed MIME types: image/png, image/jpeg,
image/gif, image/svg+xml, application/pdf, audio/mpeg, audio/wav. Supply byte count,
exact hash, meaningful alt text, locator and rights. Loader checks containment,
file existence, bytes and hash. Runtime MIME/content sanitization, file hosting,
SVG active-content safeguards and mobile presentation remain SS1-08 requirements.

Corrections resolve an exact source ID + original file hash + original lesson ID +
body hash to one supplement from the same subject and term. Originals remain
unchanged. Same-title matches and duplicate correction targets are forbidden.
`plan.corrections` and `plan.assets` are consumed by later SS1-08 runtime integration;
this foundation does NOT claim that JSON alone changes student delivery.

## Actual CLIs (future execution, not run in this stage)

From repo root, Node24.19.0 with lockfile tooling:

```bash
python scripts/ss1/prepare_sources.py --archive '/private/SSS 1-20260507T072431Z-3-001.zip' --output /private/ss1-staged
python scripts/ss1/build_subject_packages.py --root /private/ss1-staged --output /private/ss1-plan.json
```

The source stager rejects wrong archive/member hashes, traversal, symlinks,
duplicate names and unlisted members. Output must not exist. It preserves exact
archive paths under the new directory and writes STAGING.json. Do not point root
at a term subfolder. Original files remain private.

The builder delegates to the real importer with `--ss1-reviewed --ss1-plan PATH`.
It never passes --yes, strips DB environment variables, and refuses overwrite.
Pending packages produce a private diagnostic plan and nonzero audit exit, which
is expected until workers finish. `source_previews` contains actual generic parser
bodies/IDs for worker mapping (private, not a certification or reviewed package).
Structural rules can change IDs; use final `identified_rows` for final references.

The reviewed SS1 path is intentionally plan-only: --yes is rejected until SS1-08
runtime integration and later release verification. Generic SS1 --yes is also
blocked to prevent bypass; existing generic non-writing audits remain available.
Other classes retain their existing extraction, redistribution and write paths.
SS3 remains audit-only. No new dependencies or schema/UI changes are required.

## Deferred verification

Runnable commands are in DEFERRED_VERIFICATION.md. Synthetic fixtures live only
in `scripts/ss1/`, never production subject files. Published contract/code SHA is
recorded in the PR; WORKER_START.json does not embed its own commit hash.

Full synthetic JSON example: `scripts/ss1/fixtures/synthetic-package.json`. It is
PENDING/DRAFT and deliberately cannot produce an executable curriculum plan.
