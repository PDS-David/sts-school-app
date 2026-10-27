# FA-SRC-T2 — Financial Accounting

```text
Execute FA-SRC-T2 ONLY for SS1 Financial Accounting.
Repository: PDS-David/sts-school-app
Subject slug: financial-accounting
Start from latest origin/master. Reviewed base was d016a10730dac538589e42009ca749de1f9dd4aa.

START
Read applicable AGENTS.md. Fetch master and inspect open PRs for this task. Use an isolated branch/worktree. If this exact item is already complete on master, report the evidence and stop; do not repeat it or silently select another item. If an open PR owns it, do not overwrite that worker.

QUEUE
docs/ss1/work/microtasks/financial-accounting/QUEUE.json
Prerequisites: FA-SRC-T1.
Confirm each prerequisite's implementation is complete, without treating deferred verification as passed.

OBJECTIVE
Register the 2nd Term Financial Accounting source: open the document, read its exact opening heading and teaching content, confirm the subject from the header (not from the filename), and add its sources[] entry (source_id, sha256, archive_member verbatim, term, canonical_subject, uniquely occurring header_text, header_evidence). The package file is created by FA-SRC-T1; add only this source's entry and rules.

EXISTING EVIDENCE
No financial-accounting package exists on master (backend/src/db/ss1/subjects lists only english, french, mathematics, further-mathematics). SOURCE_ASSIGNMENTS.csv/sourceRegistry.json row: source_id=SS1-SRC-167817613690, sha256=422b187f2d81a3f692a4b2e8fcb51932bd6d8e19a3627f59843ad8fd91106f6f, 144645 bytes, member 'SSS 1/2nd Term SS1_/Account.docx', worker D, mapping_status FILENAME_ASSIGNMENT_VERIFY_DOCUMENT_HEADER: this is a filename-based assignment, NOT a verified document header. Not registered; header unread. The filename 'Account.docx' does not name Financial Accounting; the subject (versus Bookkeeping) must be read from the header, not inferred from the filename or folder.

COMPLETION CONDITION
This source's entry is added to the existing package; no other source touched. If the header names a different subject (for example Bookkeeping), record an explicit handoff open item; do not delete, merge into bookkeeping or silently reassign. If the header differs from the canonical subject only by an alias needing an approval_reference, record an open item; do not invent the reference. The package stays PENDING; the 'source without coverage' blocker remains until indexing. Registration is not performed by the queue-building task.


ATTACH ONLY THIS ORIGINAL DOCUMENT
Filename: Account.docx
Term: 2nd Term
Manifest source ID: SS1-SRC-167817613690
Manifest archive member: SSS 1/2nd Term SS1_/Account.docx
SHA-256: 422b187f2d81a3f692a4b2e8fcb51932bd6d8e19a3627f59843ad8fd91106f6f

A standalone original matching this member hash is AUTHORISED and sufficient. Do NOT ask for the full ZIP or require its folder structure. Hash before conversion; render/extract a separate private working copy. A member extracted from another enclosing ZIP is equally acceptable if its exact bytes match this SHA-256. Record the actual supplied container and whether its hash was checked; never claim a composite hash check not performed. Keep archive_member in the package exactly as the manifest.
If the complete composite ZIP is supplied instead, expected SHA-256 is 024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e. If the document hash differs, report the exact mismatch and do not substitute by name or size.

READ
- docs/ss1/work/microtasks/financial-accounting/QUEUE.json
- docs/ss1/contracts/CONTRACT.md
- backend/src/db/ss1/subjectPackageSchema.ts
- docs/ss1/IMPLEMENTATION_20261026/SOURCE_ASSIGNMENTS.csv
- backend/src/db/ss1/compiler.ts
- docs/ss1/IMPLEMENTATION_20261026/05_WORKER_D_BUSINESS.md
- backend/src/db/ss1/subjects/financial-accounting.json
Read the subject QUEUE_BUILD.md and relevant task notes where available. They are historical evidence; latest QUEUE.json and this assignment govern current scope. Reuse completed reviews; inspect originals only as needed for this exact task.

ALLOWED WRITE PATHS
- backend/src/db/ss1/subjects/financial-accounting.json
- docs/ss1/work/microtasks/financial-accounting/QUEUE.json
- docs/ss1/work/microtasks/financial-accounting/FA-SRC-T2.md
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
Commit and push a unique subject/item branch; open a PR to master with FA-SRC-T2 in its title. Do not merge. If push access is unavailable, supply a downloadable binary-capable patch with its exact base SHA. Do not request a token in chat.
Report completion or precise blocker, files changed, commit/PR or patch, next eligible item and "Testing deferred by owner." Stop after this ONE item.
```
