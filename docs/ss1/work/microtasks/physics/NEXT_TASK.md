# PHYS-SRC-T2 — Physics

```text
Execute PHYS-SRC-T2 ONLY for SS1 Physics.
Repository: PDS-David/sts-school-app
Subject slug: physics
Start from latest origin/master. Reviewed base was d016a10730dac538589e42009ca749de1f9dd4aa.

START
Read applicable AGENTS.md. Fetch master and inspect open PRs for this task. Use an isolated branch/worktree. If this exact item is already complete on master, report the evidence and stop; do not repeat it or silently select another item. If an open PR owns it, do not overwrite that worker.

QUEUE
docs/ss1/work/microtasks/physics/QUEUE.json
Prerequisites: PHYS-SRC-T1.
Confirm each prerequisite's implementation is complete, without treating deferred verification as passed.

OBJECTIVE
Register the 2nd Term Physics source with manifest hash, member, term, canonical subject and verified header_text/header_evidence read from the original document.

EXISTING EVIDENCE
NOT registered on master: backend/src/db/ss1/subjects/ has no physics.json (loader would report MISSING_PACKAGE) and docs/ss1/work/SS1-03/CHECKPOINT.md lists Physics as NOT STARTED. Manifest row: sha256=3941deccd3f4c68065a496ede3752784d2535e3c03608450a12b2a7c4a0b9fa7, 466432 bytes, legacy binary .doc, mapping_status FILENAME_ASSIGNMENT_VERIFY_DOCUMENT_HEADER (assignment by filename, header verification required). PR #71 records header 'SUBJECT: PHYSICS CLASS: SS 1' on document line 2; that is an unverified branch claim, not registered or verified metadata. Branch-only (NOT on master): b5ced7ebb0efe22df2351baa140266fbf40cbf41 (PR #71 head, branch ss1/SS1-01-20261026-claude), path backend/src/db/ss1/subjects/physics.json, blob 5b4010a8db081ddcafafd5bf98bfcbd7b31c09f3 (identical blob at 2985d57, branch ss1/SS1-03-20261027-B).

COMPLETION CONDITION
Source entry added with sha256, archive_member and term equal to the CSV row, canonical_subject from the document, exact uniquely occurring header_text and a reproducible header_evidence locator; if the document names no subject, record that fact and a source_alias need as an open item rather than guessing. The package file is created by PHYS-SRC-T1; this item only appends this source entry. Do not author lessons, rules or coverage here.


ATTACH ONLY THIS ORIGINAL DOCUMENT
Filename: 2ND TERM S1 PHYSICS.doc
Term: 2nd Term
Manifest source ID: SS1-SRC-2c924c964660
Manifest archive member: SSS 1/2nd Term SS1_/2ND TERM S1 PHYSICS.doc
SHA-256: 3941deccd3f4c68065a496ede3752784d2535e3c03608450a12b2a7c4a0b9fa7

A standalone original matching this member hash is AUTHORISED and sufficient. Do NOT ask for the full ZIP or require its folder structure. Hash before conversion; render/extract a separate private working copy. A member extracted from another enclosing ZIP is equally acceptable if its exact bytes match this SHA-256. Record the actual supplied container and whether its hash was checked; never claim a composite hash check not performed. Keep archive_member in the package exactly as the manifest.
If the complete composite ZIP is supplied instead, expected SHA-256 is 024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e. If the document hash differs, report the exact mismatch and do not substitute by name or size.

READ
- docs/ss1/work/microtasks/physics/QUEUE.json
- docs/ss1/contracts/CONTRACT.md
- backend/src/db/ss1/subjectPackageSchema.ts
- docs/ss1/IMPLEMENTATION_20261026/SOURCE_ASSIGNMENTS.csv
- backend/src/db/ss1/subjects/physics.json
Read the subject QUEUE_BUILD.md and relevant task notes where available. They are historical evidence; latest QUEUE.json and this assignment govern current scope. Reuse completed reviews; inspect originals only as needed for this exact task.

ALLOWED WRITE PATHS
- backend/src/db/ss1/subjects/physics.json
- docs/ss1/work/microtasks/physics/QUEUE.json
- docs/ss1/work/microtasks/physics/PHYS-SRC-T2.md
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
Commit and push a unique subject/item branch; open a PR to master with PHYS-SRC-T2 in its title. Do not merge. If push access is unavailable, supply a downloadable binary-capable patch with its exact base SHA. Do not request a token in chat.
Report completion or precise blocker, files changed, commit/PR or patch, next eligible item and "Testing deferred by owner." Stop after this ONE item.
```
