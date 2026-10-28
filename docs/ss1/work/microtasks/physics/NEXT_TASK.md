# PHYS-SRC-T3 — Physics

```text
Implement exactly PHYS-SRC-T3 for SS1 Physics.
Repository: PDS-David/sts-school-app
Subject slug: physics
Start from latest origin/master, not a fixed old commit.
Reviewed base: e98ac3fd0aa6aa012997b1fb81d76128340efc45

START
Fetch master, read applicable AGENTS.md and check open PRs for this exact item. Use an isolated branch/worktree. If completed on master, report evidence and stop without repeating it. If another worker owns an open PR, do not overwrite it. Prerequisites: PHYS-SRC-T1; confirm their implementation states. Deferred testing is not successful verification.

QUEUE
docs/ss1/work/microtasks/physics/QUEUE.json

OBJECTIVE
Register the 3rd Term Physics source with manifest hash, member, term, canonical subject and verified header_text/header_evidence read from the original document.

EXISTING EVIDENCE
NOT registered on master: backend/src/db/ss1/subjects/ has no physics.json (loader would report MISSING_PACKAGE) and docs/ss1/work/SS1-03/CHECKPOINT.md lists Physics as NOT STARTED. Manifest row: sha256=bcd7daab57432b5c2b74a29e4afc1f162276e5fe360fab50345426fc3503e688, 107008 bytes, legacy binary .doc, mapping_status FILENAME_ASSIGNMENT_VERIFY_DOCUMENT_HEADER (assignment by filename, header verification required). PR #71 records that the document has NO subject header (it opens 'THIRD TERM E-LEARNING NOTE') and that assignment rests on the archive path and manifest; that is an unverified branch claim, not registered or verified metadata. Branch-only (NOT on master): b5ced7ebb0efe22df2351baa140266fbf40cbf41 (PR #71 head, branch ss1/SS1-01-20261026-claude), path backend/src/db/ss1/subjects/physics.json, blob 5b4010a8db081ddcafafd5bf98bfcbd7b31c09f3 (identical blob at 2985d57, branch ss1/SS1-03-20261027-B).

COMPLETION CONDITION
Source entry added with sha256, archive_member and term equal to the CSV row, canonical_subject from the document, exact uniquely occurring header_text and a reproducible header_evidence locator; if the document names no subject, record that fact and a source_alias need as an open item rather than guessing. The package file is created by PHYS-SRC-T1; this item only appends this source entry. Do not author lessons, rules or coverage here.

ATTACHMENT — ONE STANDALONE ORIGINAL IS SUFFICIENT
File: 3RD TERM S1 PHYSICS.doc
Term: 3rd Term
Source ID: SS1-SRC-bed91bb4ef0e
Manifest member: SSS 1/3rd Term SS1_/3RD TERM S1 PHYSICS.doc
SHA-256: bcd7daab57432b5c2b74a29e4afc1f162276e5fe360fab50345426fc3503e688

Verify exact document bytes before conversion. Accept this standalone file, or identical member bytes extracted from any supplied archive. Do not demand the full ZIP or original folder structure when the member hash matches. Record actual input/container and checks performed; never claim a composite archive hash was verified when it was not. Retain the manifest archive_member verbatim in the package.
If the full original ZIP is supplied, its expected SHA-256 is 024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e. A filename/size match alone never substitutes for the member hash. If the named source is truly missing, identify this exact file; do not invent its content.

READ
- docs/ss1/work/microtasks/physics/QUEUE.json
- docs/ss1/contracts/CONTRACT.md
- backend/src/db/ss1/subjectPackageSchema.ts
- docs/ss1/IMPLEMENTATION_20261026/SOURCE_ASSIGNMENTS.csv
- backend/src/db/ss1/subjects/physics.json
Use the existing task evidence and subject notes; do not rerun unrelated audits. A historical note that a package did not exist is not current authority to recreate/overwrite it.

ALLOWED WRITE PATHS
- backend/src/db/ss1/subjects/physics.json
- docs/ss1/work/microtasks/physics/QUEUE.json
- docs/ss1/work/microtasks/physics/PHYS-SRC-T3.md
The task note above is explicitly authorised. No other subject, JSS3, UI or shared foundation/schema/compiler/importer changes.

IMPLEMENTATION RULES
- Make the requested scoped implementation, not just a recommendation. Preserve unrelated entries, stable IDs and original source text.
- Registration adds one source with exact verified heading and manifest metadata. Keep package PENDING; don't invent alias/content approval or release existing holds. Report actual subject ambiguity, not a filename-based guess.
- Inventory/indexing implements exact mappings and bounded follow-up items. Do not author all follow-ups. Source markers cannot discard instructional bodies.
- Authoring/porting must include actual teaching, examples, original answered practice and marking whose marks sum, objective-level coverage, provenance and exact UTF-8 body SHA-256. Keep approval PENDING, implementation IMPLEMENTED where earned and verification DEFERRED. Check current/uncertain factual claims against authoritative sources; never put unverified claims into an answer key.
- Source extraction and private rendering are permitted. Do not guess parser identities or claim importer validation. Unsupported representation becomes a precise foundation dependency, not an undeclared schema change.
- Missing external pages or approvals stay open. Complete independent in-scope work; do not pretend a partial objective is fully covered.
- Tests, typechecks, importer/plan runs, database, device, deployment and production import are deferred/prohibited here. Only source reading/extraction, hashes, JSON syntax, reference and diff checks. Do not commit originals, full extracts, private renders or secrets.

FINISH
Update only the assigned queue item honestly, refresh counts and eligible next_runnable, and record short evidence at docs/ss1/work/microtasks/physics/PHYS-SRC-T3.md. Do not edit shared NEXT_ASSIGNMENTS.md or other subjects' prompts. Do not claim the subject complete.

DELIVERY
Commit and push a unique subject/item branch; open a PR to master with PHYS-SRC-T3 in its title; do not merge. If pushing fails, supply a downloadable binary-capable patch with exact base SHA. Never request a token in chat. Report task outcome, changed files, commit/PR or patch, actual blockers and next eligible item. State "Testing deferred by owner." Stop after ONE task.
```
