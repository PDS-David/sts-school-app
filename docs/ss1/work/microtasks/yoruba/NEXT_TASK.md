# YO-SRC-T1 — Yoruba

Copy the following prompt into one worker session. Attach the composite archive named below.

```text
TASK: SS1 YO-SRC-T1 ONLY
Repository: PDS-David/sts-school-app
Subject slug: yoruba
Queue: docs/ss1/work/microtasks/yoruba/QUEUE.json
Reviewed base: d01704cd15aa69241a8775c5e072fd2297b1d71b; start from latest origin/master, not this historical SHA.

Implement exactly YO-SRC-T1 (SOURCE_REGISTRATION). Do not perform other weeks, other sources or the entire subject.

START
Fetch master, record SHA, read applicable AGENTS.md and check open PRs for this exact item. Use a separate branch/worktree. If already completed on master, report its evidence and stop without duplicating it. If another worker owns an open PR for it, report that PR and do not overwrite it. Confirm the queue prerequisites: none. Do not treat implementation-deferred status as approval or successful testing.

OBJECTIVE
Register the 1st Term Yoruba source in the Yoruba package, creating the minimum package because none exists: header-verified source entry (and source_alias rule only if the heading requires it) plus the blocking open item YORUBA-OBJECTIVE-INDEXING.

EXISTING EVIDENCE
backend/src/db/ss1/sourceRegistry.json and docs/ss1/IMPLEMENTATION_20261026/SOURCE_ASSIGNMENTS.csv both list SS1-SRC-48b641249e3b with member 'SSS 1/1st Term SS1_/YORUBA.docx', sha256 7403d8243ee646a221bb3d92fe18d202c73be0bde4deb10fa68a3dec0b4a6aef, 55974 bytes, term '1st Term', slug 'yoruba', worker A, mapping_status FILENAME_ASSIGNMENT_VERIFY_DOCUMENT_HEADER (the two copies were compared statically and are equal). This is REGISTERED METADATA ONLY: the document heading has not been recorded as verified in the repository. No yoruba.json exists on master; WORKER_START.json package_paths lists backend/src/db/ss1/subjects/yoruba.json as the expected path. SS1-02 CHECKPOINT.md states 'Yoruba: initial schemes/opening sections read only; no package yet' without recording any header, week or objective finding.

COMPLETION CONDITION
PERMISSION: yoruba.json (an allowed write path) does not exist on master and this item is explicitly permitted to CREATE it, using only the existing ss1-subject-v1 contract and no other file. Done when yoruba.json exists and is schema-valid by inspection: schema_version ss1-subject-v1, subject_slug yoruba, canonical_subject confirmed from the document, package_status PENDING, sources contains exactly this source with archive_member/sha256/term equal to the CSV row, lessons/delivery_corrections/assets/coverage empty, and one open item YORUBA-OBJECTIVE-INDEXING (kind CONTENT, blocks_delivery true, affected_ids = registered source IDs, required_action pointing to the YO-INV items). Archive and member SHA-256 verified before reading. Open the member, read its exact opening heading and record it as sources[].header_text (exact, uniquely occurring in the unmodified extracted text; follow the convention in author_packages.py source()). Confirm canonical_subject from that heading ('Yoruba' is only the name author_packages.py uses for the slug, not evidence). If the heading differs from canonical_subject beyond case/whitespace (for example by Yoruba diacritics), add a source_alias rule with a unique exact anchor and honest evidence; approval_reference must state only that the assigned-subject mapping is supported by this heading, not teacher approval. If the heading shows a different subject, do NOT register: record the specific discrepancy as a FACT open item/queue note and stop. Also record whether Yoruba diacritics/subdots survive the extraction unchanged (no normalisation of anchors or text). Do not author lessons, coverage, approval or verification. Do not run tests, typechecks, importer or database. Testing deferred by owner.

READ
- docs/ss1/work/microtasks/yoruba/QUEUE.json
- docs/ss1/contracts/CONTRACT.md
- backend/src/db/ss1/subjectPackageSchema.ts
- docs/ss1/IMPLEMENTATION_20261026/SOURCE_ASSIGNMENTS.csv
- backend/src/db/ss1/compiler.ts
- docs/ss1/work/SS1-02/CHECKPOINT.md
- docs/ss1/work/SS1-02/author_packages.py
- docs/ss1/work/SS1-02/extract_sources.cjs
- scripts/ss1/prepare_sources.py
Read the subject QUEUE_BUILD.md and relevant existing note if available. A package absent because this task creates it is not a missing input; use the strict contract's required envelope and arrays. Preserve existing package content if another completed task has since created it.

ATTACHMENTS
[
  {
    "archive": "SSS 1-20260507T072431Z-3-001.zip",
    "archive_sha256": "024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e",
    "member": "SSS 1/1st Term SS1_/YORUBA.docx",
    "member_sha256": "7403d8243ee646a221bb3d92fe18d202c73be0bde4deb10fa68a3dec0b4a6aef"
  }
]
The shared archive's display filename is SSS 1-20260507T072431Z-3-001 (1).zip. Verify its SHA-256 and the assigned member hash. Use only the source(s) specified above. If archive access is missing, request that exact archive; do not treat missing access as missing curriculum. Convert/render legacy DOC privately if necessary. Record tool/method and reproducible locators. Do not substitute a different document based on filename or size.

ALLOWED WRITE PATHS
- backend/src/db/ss1/subjects/yoruba.json
- docs/ss1/work/microtasks/yoruba/QUEUE.json
- docs/ss1/work/microtasks/yoruba/YO-SRC-T1.md
No shared schema/compiler/importer, other subject, UI or JSS3 changes. The task note path above is explicitly authorised even if not previously present in the queue.

IMPLEMENTATION RULES
- Registration creates/adds only this source and justified metadata under master's schema; package stays PENDING. Do not fabricate header text or alias approval. A real subject/header mismatch becomes a precise open item, not silent reassignment.
- Indexing records exact objectives, evidence and existing lesson associations for this item only. Add small PENDING follow-up tasks for genuine uncovered objectives; do not invent coverage or write the follow-up lessons now.
- Header/preamble checks inspect only their stated scope; do not expand into a whole-subject audit.
- Preserve original source wording, stable identities and other workers' changes. Correct teaching through separately tracked replacements, not silent source edits.
- Source rules or coverage requiring unavailable exact parser identities must remain explicitly unresolved; never guess a hash or claim runtime validation. Parsing/importer execution is deferred in this stage.
- Use the strict schema's supported fields. If required structure is unsupported, record the precise foundation dependency rather than changing the schema.
- Do not assert approval, certification or successful verification. Keep genuinely unresolved items open.
- Do not commit original documents, full extracts, private renders or credentials.

FINISH
Update this item's status only when its implementation completion condition is met; recompute queue counts and next_runnable from actual satisfied dependencies. Retain completed evidence and add a short note at docs/ss1/work/microtasks/yoruba/YO-SRC-T1.md with input hashes, edits, remaining dependencies and starting SHA. Do not edit shared NEXT_ASSIGNMENTS.md or other subjects' prompts.

CHECKS
Only hashes, JSON syntax, reference consistency and diff inspection. No tests, typechecks, importer runs, database, device checks or deployment. Testing deferred by owner.

DELIVERY
Commit and push a unique subject/item branch; open a PR to master with YO-SRC-T1 in its title. Do not merge. If push access is unavailable, provide a downloadable binary-capable patch with its exact base SHA; do not request a token in chat.
Report completion or precise blocker, files changed, commit/PR or patch, and the next eligible item. Stop after this ONE task.
```
