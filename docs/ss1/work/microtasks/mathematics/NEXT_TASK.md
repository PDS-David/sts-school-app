# MATH-FACT-HEADER-T1 — Mathematics

Copy the following prompt into one worker session. Attach the composite archive named below.

```text
TASK: SS1 MATH-FACT-HEADER-T1 ONLY
Repository: PDS-David/sts-school-app
Subject slug: mathematics
Queue: docs/ss1/work/microtasks/mathematics/QUEUE.json
Reviewed base: d01704cd15aa69241a8775c5e072fd2297b1d71b; start from latest origin/master, not this historical SHA.

Implement exactly MATH-FACT-HEADER-T1 (FACTUAL_DEPENDENCY). Do not perform other weeks, other sources or the entire subject.

START
Fetch master, record SHA, read applicable AGENTS.md and check open PRs for this exact item. Use a separate branch/worktree. If already completed on master, report its evidence and stop without duplicating it. If another worker owns an open PR for it, report that PR and do not overwrite it. Confirm the queue prerequisites: MATH-SRC-T1. Do not treat implementation-deferred status as approval or successful testing.

OBJECTIVE
Verify against the original 1st Term document the exact header/title text, class line and subject wording recorded in mathematics.json, and record whether it names Mathematics (and not Further Mathematics or another subject). Inspection of the document only; no owner decision is needed for what the header says.

EXISTING EVIDENCE
Recorded: header_text="SS1 GENERAL MATHEMATICS SCHEME OF WORK FOR FIRST TERM"; header_evidence.locator="document title line (first line of extracted text)". mapping_status in the CSV is FILENAME_ASSIGNMENT_VERIFY_DOCUMENT_HEADER, i.e. assignment by filename with document-header verification still required. PR #71 head recorded that the file its worker received in chat (MATHss1.docx, 150666 bytes) did NOT match this manifest source (819678 bytes, OI-MATHS-001); the worker must confirm the member's SHA-256 equals the manifest value before reading, and must not read any other copy.

COMPLETION CONDITION
Exact header lines (verbatim, short) and their locator recorded in the item note and in the source's header_evidence where they differ; any mismatch with Mathematics recorded as an open item and reported. The alias approval_reference is NOT changed here (see MATH-APPROVAL-ALIASES).

READ
- docs/ss1/work/microtasks/mathematics/QUEUE.json
- docs/ss1/contracts/CONTRACT.md
- backend/src/db/ss1/subjectPackageSchema.ts
- docs/ss1/IMPLEMENTATION_20261026/SOURCE_ASSIGNMENTS.csv
- backend/src/db/ss1/subjects/mathematics.json
- docs/ss1/work/SS1-03/CHECKPOINT.md
Read the subject QUEUE_BUILD.md and relevant existing note if available. A package absent because this task creates it is not a missing input; use the strict contract's required envelope and arrays. Preserve existing package content if another completed task has since created it.

ATTACHMENTS
[
  {
    "archive": "SSS 1-20260507T072431Z-3-001 (1).zip",
    "archive_sha256": "024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e",
    "member": "SSS 1/1st Term SS1_/MATHss1.docx",
    "member_sha256": "d8cd49545976d4d35687bb7a8efc93cf387489bf190e00b20f981c9592e671cb"
  }
]
The shared archive's display filename is SSS 1-20260507T072431Z-3-001 (1).zip. Verify its SHA-256 and the assigned member hash. Use only the source(s) specified above. If archive access is missing, request that exact archive; do not treat missing access as missing curriculum. Convert/render legacy DOC privately if necessary. Record tool/method and reproducible locators. Do not substitute a different document based on filename or size.

ALLOWED WRITE PATHS
- backend/src/db/ss1/subjects/mathematics.json
- docs/ss1/work/microtasks/mathematics/QUEUE.json
- docs/ss1/work/microtasks/mathematics/MATH-FACT-HEADER-T1.md
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
Update this item's status only when its implementation completion condition is met; recompute queue counts and next_runnable from actual satisfied dependencies. Retain completed evidence and add a short note at docs/ss1/work/microtasks/mathematics/MATH-FACT-HEADER-T1.md with input hashes, edits, remaining dependencies and starting SHA. Do not edit shared NEXT_ASSIGNMENTS.md or other subjects' prompts.

CHECKS
Only hashes, JSON syntax, reference consistency and diff inspection. No tests, typechecks, importer runs, database, device checks or deployment. Testing deferred by owner.

DELIVERY
Commit and push a unique subject/item branch; open a PR to master with MATH-FACT-HEADER-T1 in its title. Do not merge. If push access is unavailable, provide a downloadable binary-capable patch with its exact base SHA; do not request a token in chat.
Report completion or precise blocker, files changed, commit/PR or patch, and the next eligible item. Stop after this ONE task.
```
