# CHEM-SRC-T1B — Chemistry

```text
Execute CHEM-SRC-T1B ONLY for SS1 Chemistry.
Repository: PDS-David/sts-school-app
Subject slug: chemistry
Start from latest origin/master. Reviewed base was d016a10730dac538589e42009ca749de1f9dd4aa.

START
Read applicable AGENTS.md. Fetch master and inspect open PRs for this task. Use an isolated branch/worktree. If this exact item is already complete on master, report the evidence and stop; do not repeat it or silently select another item. If an open PR owns it, do not overwrite that worker.

QUEUE
docs/ss1/work/microtasks/chemistry/QUEUE.json
Prerequisites: CHEM-SRC-T1A.
Confirm each prerequisite's implementation is complete, without treating deferred verification as passed.

OBJECTIVE
Register the 1st Term Chemistry source (second 1st Term file): open the document, read its exact opening heading and teaching content, confirm the subject from the header (not from the filename), and add its sources[] entry (source_id, sha256, archive_member verbatim, term, canonical_subject, uniquely occurring header_text, header_evidence). The package file is created by CHEM-SRC-T1A; add only this source's entry and rules. Do not decide duplication here.

EXISTING EVIDENCE
No chemistry package exists on master (backend/src/db/ss1/subjects lists only english, french, mathematics, further-mathematics). SOURCE_ASSIGNMENTS.csv/sourceRegistry.json row: source_id=SS1-SRC-84df18289b7a, sha256=0f7e40f7ca0b8e75192f69a03a2a49776dd0b90aa69ad877565674c9002b335a, 1656948 bytes, member 'SSS 1/1st Term SS1_/CHEMISTRY SS11STTERM.docx', worker C, mapping_status FILENAME_ASSIGNMENT_VERIFY_DOCUMENT_HEADER: this is a filename-based assignment, NOT a verified document header. Not registered; header unread. This is one of TWO 1st Term Chemistry files; neither is a duplicate until CHEM-CMP-T1 compares them (the two have different hashes and sizes).

COMPLETION CONDITION
This source's entry is added to the existing package; no other source touched. If the header names a different subject, record an explicit handoff open item; do not delete or silently reassign. If the header differs from the canonical subject only by an alias needing an approval_reference, record an open item; do not invent the reference. The package stays PENDING; the 'source without coverage' blocker remains until indexing. Registration is not performed by the queue-building task.


ATTACH ONLY THIS ORIGINAL DOCUMENT
Filename: CHEMISTRY SS11STTERM.docx
Term: 1st Term
Manifest source ID: SS1-SRC-84df18289b7a
Manifest archive member: SSS 1/1st Term SS1_/CHEMISTRY SS11STTERM.docx
SHA-256: 0f7e40f7ca0b8e75192f69a03a2a49776dd0b90aa69ad877565674c9002b335a

A standalone original matching this member hash is AUTHORISED and sufficient. Do NOT ask for the full ZIP or require its folder structure. Hash before conversion; render/extract a separate private working copy. A member extracted from another enclosing ZIP is equally acceptable if its exact bytes match this SHA-256. Record the actual supplied container and whether its hash was checked; never claim a composite hash check not performed. Keep archive_member in the package exactly as the manifest.
If the complete composite ZIP is supplied instead, expected SHA-256 is 024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e. If the document hash differs, report the exact mismatch and do not substitute by name or size.

READ
- docs/ss1/work/microtasks/chemistry/QUEUE.json
- docs/ss1/contracts/CONTRACT.md
- backend/src/db/ss1/subjectPackageSchema.ts
- docs/ss1/IMPLEMENTATION_20261026/SOURCE_ASSIGNMENTS.csv
- backend/src/db/ss1/compiler.ts
- docs/ss1/IMPLEMENTATION_20261026/04_WORKER_C_SCIENCE_AGRICULTURE_GEOGRAPHY.md
- backend/src/db/ss1/subjects/chemistry.json
Read the subject QUEUE_BUILD.md and relevant task notes where available. They are historical evidence; latest QUEUE.json and this assignment govern current scope. Reuse completed reviews; inspect originals only as needed for this exact task.

ALLOWED WRITE PATHS
- backend/src/db/ss1/subjects/chemistry.json
- docs/ss1/work/microtasks/chemistry/QUEUE.json
- docs/ss1/work/microtasks/chemistry/CHEM-SRC-T1B.md
The task note is explicitly authorised even if absent from the original item's list. No other subject, shared schema/compiler/importer, UI or JSS3 changes. Do not overwrite an existing package; preserve unrelated entries and stable IDs. If a required representation is unsupported, record the exact foundation dependency rather than adding unknown fields.

IMPLEMENT
- For source registration, add ONLY this source to the existing package with its exact header, manifest identity and evidence. Inspect the document; never infer the subject solely from its filename. Keep package PENDING. Record genuine ambiguity; never fabricate alias approval or release existing holds.
- For indexing, implement objective-level coverage using exact evidence and existing identities. Add separate small pending tasks for demonstrated gaps; do not author those follow-ups in this run.
- For lesson authoring, implement teaching, examples, objectives, original practice, answers, marking breakdown, exact body hash and provenance under the existing contract. Marks must sum correctly. Content approval remains PENDING; implementation may be IMPLEMENTED; verification remains DEFERRED with no invented references. Citations do not by themselves grant copying rights.
- For header verification, inspect only the assigned heading and update exact evidence where required; do not audit the whole term.
- Existing source rows remain unchanged. Do not guess parser-generated hashes or activate whole-row corrections whose complete teaching scope is unresolved.
- Pure source extraction/rendering is allowed. No tests, typechecks, importer/plan runs, database operations, device checks, deployment or production import. Check hashes, JSON syntax, references and diff only. Testing deferred by owner.
- Do not commit original documents, full extracts, private renders or credentials.

FINISH
Update this queue item honestly; record unresolved dependencies rather than declaring the subject complete. Recompute counts and next_runnable. Write a short task note with source hash, method/locators, changes and remaining work. Do not edit other subjects or shared NEXT_ASSIGNMENTS.md.

DELIVERY
Commit and push a unique subject/item branch; open a PR to master with CHEM-SRC-T1B in its title. Do not merge. If push access is unavailable, supply a downloadable binary-capable patch with its exact base SHA. Do not request a token in chat.
Report completion or precise blocker, files changed, commit/PR or patch, next eligible item and "Testing deferred by owner." Stop after this ONE item.
```
