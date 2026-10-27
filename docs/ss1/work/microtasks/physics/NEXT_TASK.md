# PHYS-SRC-T1 — Physics

Copy the following prompt into one worker session. Attach the composite archive named below.

```text
TASK: SS1 PHYS-SRC-T1 ONLY
Repository: PDS-David/sts-school-app
Subject slug: physics
Queue: docs/ss1/work/microtasks/physics/QUEUE.json
Reviewed base: d01704cd15aa69241a8775c5e072fd2297b1d71b; start from latest origin/master, not this historical SHA.

Implement exactly PHYS-SRC-T1 (SOURCE_REGISTRATION). Do not perform other weeks, other sources or the entire subject.

START
Fetch master, record SHA, read applicable AGENTS.md and check open PRs for this exact item. Use a separate branch/worktree. If already completed on master, report its evidence and stop without duplicating it. If another worker owns an open PR for it, report that PR and do not overwrite it. Confirm the queue prerequisites: none. Do not treat implementation-deferred status as approval or successful testing.

OBJECTIVE
Register the 1st Term Physics source with manifest hash, member, term, canonical subject and verified header_text/header_evidence read from the original document. Create the minimum package first (see completion condition).

EXISTING EVIDENCE
NOT registered on master: backend/src/db/ss1/subjects/ has no physics.json (loader would report MISSING_PACKAGE) and docs/ss1/work/SS1-03/CHECKPOINT.md lists Physics as NOT STARTED. Manifest row: sha256=cb61f336ac93a3fbbb820d6c9b4adc0703e7363aff7659b7953a75bdb92f2206, 8479232 bytes, legacy binary .doc, mapping_status FILENAME_ASSIGNMENT_VERIFY_DOCUMENT_HEADER (assignment by filename, header verification required). PR #71 records header 'SUBJECT: PHYSICS CLASS: SS' on document line 3 with the class number on the next line; that is an unverified branch claim, not registered or verified metadata. Branch-only (NOT on master): b5ced7ebb0efe22df2351baa140266fbf40cbf41 (PR #71 head, branch ss1/SS1-01-20261026-claude), path backend/src/db/ss1/subjects/physics.json, blob 5b4010a8db081ddcafafd5bf98bfcbd7b31c09f3 (identical blob at 2985d57, branch ss1/SS1-03-20261027-B).

COMPLETION CONDITION
Source entry added with sha256, archive_member and term equal to the CSV row, canonical_subject from the document, exact uniquely occurring header_text and a reproducible header_evidence locator; if the document names no subject, record that fact and a source_alias need as an open item rather than guessing. PERMISSION TO CREATE THE MINIMUM PACKAGE: because no physics.json exists on master, this item may create backend/src/db/ss1/subjects/physics.json containing only the envelope (schema_version ss1-subject-v1, subject_slug physics, canonical_subject confirmed from the document, package_status PENDING), this source entry, and empty arrays for every other required section. Nothing else may be authored in it. Do not author lessons, rules or coverage here.

READ
- docs/ss1/work/microtasks/physics/QUEUE.json
- docs/ss1/contracts/CONTRACT.md
- backend/src/db/ss1/subjectPackageSchema.ts
- docs/ss1/IMPLEMENTATION_20261026/SOURCE_ASSIGNMENTS.csv
- backend/src/db/ss1/subjects/README.md
Read the subject QUEUE_BUILD.md and relevant existing note if available. A package absent because this task creates it is not a missing input; use the strict contract's required envelope and arrays. Preserve existing package content if another completed task has since created it.

ATTACHMENTS
[
  {
    "archive": "SSS 1-20260507T072431Z-3-001 (1).zip",
    "archive_sha256": "024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e",
    "member": "SSS 1/1st Term SS1_/1ST TERM S1 PHYSICS.doc",
    "member_sha256": "cb61f336ac93a3fbbb820d6c9b4adc0703e7363aff7659b7953a75bdb92f2206"
  }
]
The shared archive's display filename is SSS 1-20260507T072431Z-3-001 (1).zip. Verify its SHA-256 and the assigned member hash. Use only the source(s) specified above. If archive access is missing, request that exact archive; do not treat missing access as missing curriculum. Convert/render legacy DOC privately if necessary. Record tool/method and reproducible locators. Do not substitute a different document based on filename or size.

ALLOWED WRITE PATHS
- backend/src/db/ss1/subjects/physics.json
- docs/ss1/work/microtasks/physics/QUEUE.json
- docs/ss1/work/microtasks/physics/PHYS-SRC-T1.md
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
Update this item's status only when its implementation completion condition is met; recompute queue counts and next_runnable from actual satisfied dependencies. Retain completed evidence and add a short note at docs/ss1/work/microtasks/physics/PHYS-SRC-T1.md with input hashes, edits, remaining dependencies and starting SHA. Do not edit shared NEXT_ASSIGNMENTS.md or other subjects' prompts.

CHECKS
Only hashes, JSON syntax, reference consistency and diff inspection. No tests, typechecks, importer runs, database, device checks or deployment. Testing deferred by owner.

DELIVERY
Commit and push a unique subject/item branch; open a PR to master with PHYS-SRC-T1 in its title. Do not merge. If push access is unavailable, provide a downloadable binary-capable patch with its exact base SHA; do not request a token in chat.
Report completion or precise blocker, files changed, commit/PR or patch, and the next eligible item. Stop after this ONE task.
```
