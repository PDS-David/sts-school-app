# YO-SRC-T3 — Yoruba

```text
Implement exactly YO-SRC-T3 for SS1 Yoruba.
Repository: PDS-David/sts-school-app
Subject slug: yoruba
Start from latest origin/master, not a fixed old commit.
Reviewed base: e98ac3fd0aa6aa012997b1fb81d76128340efc45

START
Fetch master, read applicable AGENTS.md and check open PRs for this exact item. Use an isolated branch/worktree. If completed on master, report evidence and stop without repeating it. If another worker owns an open PR, do not overwrite it. Prerequisites: YO-SRC-T1; confirm their implementation states. Deferred testing is not successful verification.

QUEUE
docs/ss1/work/microtasks/yoruba/QUEUE.json

OBJECTIVE
Register the 3rd Term Yoruba source in yoruba.json with a header-verified source entry (and source_alias rule only if its heading requires it).

EXISTING EVIDENCE
backend/src/db/ss1/sourceRegistry.json and docs/ss1/IMPLEMENTATION_20261026/SOURCE_ASSIGNMENTS.csv both list SS1-SRC-4cc6aae9ed7d with member 'SSS 1/3rd Term SS1_/3RD TERM S1 YORUBA.docx', sha256 a057f7f70d7e99fc34acdb6e725f3d44a426d96f756039bf6f3e6216767416e3, 68373 bytes, term '3rd Term', slug 'yoruba', worker A, mapping_status FILENAME_ASSIGNMENT_VERIFY_DOCUMENT_HEADER (the two copies were compared statically and are equal). This is REGISTERED METADATA ONLY: the document heading has not been recorded as verified in the repository. Depends on YO-SRC-T1 only because that item creates yoruba.json. If YO-SRC-T2 and YO-SRC-T3 are run concurrently they edit the same file: rebase, do not overwrite the other's source entry.

COMPLETION CONDITION
Archive and member SHA-256 verified. A single sources[] entry for this source is added with fields equal to the CSV row; the open item YORUBA-OBJECTIVE-INDEXING affected_ids gains this source ID. Open the member, read its exact opening heading and record it as sources[].header_text (exact, uniquely occurring in the unmodified extracted text; follow the convention in author_packages.py source()). Confirm canonical_subject from that heading ('Yoruba' is only the name author_packages.py uses for the slug, not evidence). If the heading differs from canonical_subject beyond case/whitespace (for example by Yoruba diacritics), add a source_alias rule with a unique exact anchor and honest evidence; approval_reference must state only that the assigned-subject mapping is supported by this heading, not teacher approval. If the heading shows a different subject, do NOT register: record the specific discrepancy as a FACT open item/queue note and stop. Also record whether Yoruba diacritics/subdots survive the extraction unchanged (no normalisation of anchors or text). Do not repeat T1 registration, author lessons or invent approval. Testing deferred by owner.

ATTACHMENT — ONE STANDALONE ORIGINAL IS SUFFICIENT
File: 3RD TERM S1 YORUBA.docx
Term: 3rd Term
Source ID: SS1-SRC-4cc6aae9ed7d
Manifest member: SSS 1/3rd Term SS1_/3RD TERM S1 YORUBA.docx
SHA-256: a057f7f70d7e99fc34acdb6e725f3d44a426d96f756039bf6f3e6216767416e3

Verify exact document bytes before conversion. Accept this standalone file, or identical member bytes extracted from any supplied archive. Do not demand the full ZIP or original folder structure when the member hash matches. Record actual input/container and checks performed; never claim a composite archive hash was verified when it was not. Retain the manifest archive_member verbatim in the package.
If the full original ZIP is supplied, its expected SHA-256 is 024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e. A filename/size match alone never substitutes for the member hash. If the named source is truly missing, identify this exact file; do not invent its content.

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
- backend/src/db/ss1/subjects/yoruba.json
Use the existing task evidence and subject notes; do not rerun unrelated audits. A historical note that a package did not exist is not current authority to recreate/overwrite it.

ALLOWED WRITE PATHS
- backend/src/db/ss1/subjects/yoruba.json
- docs/ss1/work/microtasks/yoruba/QUEUE.json
- docs/ss1/work/microtasks/yoruba/YO-SRC-T3.md
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
Update only the assigned queue item honestly, refresh counts and eligible next_runnable, and record short evidence at docs/ss1/work/microtasks/yoruba/YO-SRC-T3.md. Do not edit shared NEXT_ASSIGNMENTS.md or other subjects' prompts. Do not claim the subject complete.

DELIVERY
Commit and push a unique subject/item branch; open a PR to master with YO-SRC-T3 in its title; do not merge. If pushing fails, supply a downloadable binary-capable patch with exact base SHA. Never request a token in chat. Report task outcome, changed files, commit/PR or patch, actual blockers and next eligible item. State "Testing deferred by owner." Stop after ONE task.
```
