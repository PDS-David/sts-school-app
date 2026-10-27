# BIO-SRC-T1 — Biology

Copy the following prompt into one worker session. Attach the composite archive named below.

```text
TASK: SS1 BIO-SRC-T1 ONLY
Repository: PDS-David/sts-school-app
Subject slug: biology
Queue: docs/ss1/work/microtasks/biology/QUEUE.json
Reviewed base: d01704cd15aa69241a8775c5e072fd2297b1d71b; start from latest origin/master, not this historical SHA.

Implement exactly BIO-SRC-T1 (SOURCE_REGISTRATION). Do not perform other weeks, other sources or the entire subject.

START
Fetch master, record SHA, read applicable AGENTS.md and check open PRs for this exact item. Use a separate branch/worktree. If already completed on master, report its evidence and stop without duplicating it. If another worker owns an open PR for it, report that PR and do not overwrite it. Confirm the queue prerequisites: none. Do not treat implementation-deferred status as approval or successful testing.

OBJECTIVE
Register the 1st Term Biology source: open the document, read its exact opening heading and teaching content, confirm the subject from the header (not from the filename), and add its sources[] entry (source_id, sha256, archive_member verbatim, term, canonical_subject, uniquely occurring header_text, header_evidence). PERMISSION: because no package exists, this item may create the minimum package under the existing contract (schema_version ss1-subject-v1, subject_slug biology, canonical_subject confirmed from the header, package_status PENDING, all other arrays empty) and register this one source in it.

EXISTING EVIDENCE
No biology package exists on master (backend/src/db/ss1/subjects lists only english, french, mathematics, further-mathematics). SOURCE_ASSIGNMENTS.csv/sourceRegistry.json row: source_id=SS1-SRC-422e0e6ddde9, sha256=936fb6374ca206d17275d6e9be6ff0947219af221b144aafc162bb1f78087ce8, 957703 bytes, member 'SSS 1/1st Term SS1_/BIOLOGY 1 alfa term - Copy.docx', worker C, mapping_status FILENAME_ASSIGNMENT_VERIFY_DOCUMENT_HEADER: this is a filename-based assignment, NOT a verified document header. Not registered; header unread.

COMPLETION CONDITION
Package file exists with the minimum envelope and this one registered source; no lessons, coverage, corrections or assets are invented. If the header names a different subject, record an explicit handoff open item; do not delete or silently reassign. If the header differs from the canonical subject only by an alias needing an approval_reference, record an open item; do not invent the reference. The package stays PENDING; the 'source without coverage' blocker remains until indexing. Registration is not performed by the queue-building task.

READ
- docs/ss1/work/microtasks/biology/QUEUE.json
- docs/ss1/contracts/CONTRACT.md
- backend/src/db/ss1/subjectPackageSchema.ts
- docs/ss1/IMPLEMENTATION_20261026/SOURCE_ASSIGNMENTS.csv
- backend/src/db/ss1/compiler.ts
- docs/ss1/IMPLEMENTATION_20261026/04_WORKER_C_SCIENCE_AGRICULTURE_GEOGRAPHY.md
Read the subject QUEUE_BUILD.md and relevant existing note if available. A package absent because this task creates it is not a missing input; use the strict contract's required envelope and arrays. Preserve existing package content if another completed task has since created it.

ATTACHMENTS
[
  {
    "archive": "SSS 1-20260507T072431Z-3-001.zip (display name may be \"SSS 1-20260507T072431Z-3-001 (1).zip\"; the hash decides)",
    "archive_sha256": "024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e",
    "member": "SSS 1/1st Term SS1_/BIOLOGY 1 alfa term - Copy.docx",
    "member_sha256": "936fb6374ca206d17275d6e9be6ff0947219af221b144aafc162bb1f78087ce8"
  }
]
The shared archive's display filename is SSS 1-20260507T072431Z-3-001 (1).zip. Verify its SHA-256 and the assigned member hash. Use only the source(s) specified above. If archive access is missing, request that exact archive; do not treat missing access as missing curriculum. Convert/render legacy DOC privately if necessary. Record tool/method and reproducible locators. Do not substitute a different document based on filename or size.

ALLOWED WRITE PATHS
- backend/src/db/ss1/subjects/biology.json
- docs/ss1/work/microtasks/biology/QUEUE.json
- docs/ss1/work/microtasks/biology/BIO-SRC-T1.md
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
Update this item's status only when its implementation completion condition is met; recompute queue counts and next_runnable from actual satisfied dependencies. Retain completed evidence and add a short note at docs/ss1/work/microtasks/biology/BIO-SRC-T1.md with input hashes, edits, remaining dependencies and starting SHA. Do not edit shared NEXT_ASSIGNMENTS.md or other subjects' prompts.

CHECKS
Only hashes, JSON syntax, reference consistency and diff inspection. No tests, typechecks, importer runs, database, device checks or deployment. Testing deferred by owner.

DELIVERY
Commit and push a unique subject/item branch; open a PR to master with BIO-SRC-T1 in its title. Do not merge. If push access is unavailable, provide a downloadable binary-capable patch with its exact base SHA; do not request a token in chat.
Report completion or precise blocker, files changed, commit/PR or patch, and the next eligible item. Stop after this ONE task.
```
