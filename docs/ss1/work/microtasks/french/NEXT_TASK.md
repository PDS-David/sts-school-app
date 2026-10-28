# FR-WK-T1-W02 — French

```text
Implement exactly FR-WK-T1-W02 for SS1 French.
Repository: PDS-David/sts-school-app
Subject slug: french
Start from latest origin/master, not a fixed old commit.
Reviewed base: e98ac3fd0aa6aa012997b1fb81d76128340efc45

START
Fetch master, read applicable AGENTS.md and check open PRs for this exact item. Use an isolated branch/worktree. If completed on master, report evidence and stop without repeating it. If another worker owns an open PR, do not overwrite it. Prerequisites: FR-SRC-T1; confirm their implementation states. Deferred testing is not successful verification.

QUEUE
docs/ss1/work/microtasks/french/QUEUE.json

OBJECTIVE
Index 1st Term Week 2 at objective level: list each scheme objective for the week, bind it to exact source rows and/or supplements with reproducible locators, and confirm the replacement's scope against every exercise in the row it displaces.

EXISTING EVIDENCE
Existing row-level coverage FRENCH-BODY-002 (status IMPLEMENTED_EQUIVALENT) -> SUP-SS1-FRENCH-COUNTRIES-T1; correction SS1-02-french-COR-002 binds body 970d1e7a3d6d98a9953ce01c9180cd1c077c2fd1c61f3b9d60e6d8868856a7e5 to the same replacement. Row-level association only; the coverage entry itself states it is not exhaustive scheme-objective certification. No objective-level entry exists yet.

COMPLETION CONDITION
Every objective of the week has its own coverage entry with exact locator and evidence; scheme rows are classified; any PARTIAL/UNRESOLVED entry has an OPEN open item and, where content is missing, a separate small PENDING queue item. No lesson is authored in this item. Original source must be read: attach the member listed in required_attachments.

ATTACHMENT — ONE STANDALONE ORIGINAL IS SUFFICIENT
File: FRENCH Ss1.docx
Term: 1st Term
Source ID: SS1-SRC-945dfb24eaf6
Manifest member: SSS 1/1st Term SS1_/FRENCH Ss1.docx
SHA-256: 2bedee524a17700d40d81dc1df8d10f529b49d4a918f38a83914ce7b0c43e864

Verify exact document bytes before conversion. Accept this standalone file, or identical member bytes extracted from any supplied archive. Do not demand the full ZIP or original folder structure when the member hash matches. Record actual input/container and checks performed; never claim a composite archive hash was verified when it was not. Retain the manifest archive_member verbatim in the package.
If the full original ZIP is supplied, its expected SHA-256 is 024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e. A filename/size match alone never substitutes for the member hash. If the named source is truly missing, identify this exact file; do not invent its content.

READ
- docs/ss1/work/microtasks/french/QUEUE.json
- docs/ss1/contracts/CONTRACT.md
- backend/src/db/ss1/subjectPackageSchema.ts
- docs/ss1/IMPLEMENTATION_20261026/SOURCE_ASSIGNMENTS.csv
- backend/src/db/ss1/subjects/french.json
- backend/src/db/ss1/compiler.ts
- docs/ss1/work/SS1-02/CHECKPOINT.md
- docs/ss1/work/SS1-02/FRENCH_SOURCE_NOTES.md
Use the existing task evidence and subject notes; do not rerun unrelated audits. A historical note that a package did not exist is not current authority to recreate/overwrite it.

ALLOWED WRITE PATHS
- backend/src/db/ss1/subjects/french.json
- docs/ss1/work/microtasks/french/QUEUE.json
- docs/ss1/work/microtasks/french/FR-WK-T1-W02.md
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
Update only the assigned queue item honestly, refresh counts and eligible next_runnable, and record short evidence at docs/ss1/work/microtasks/french/FR-WK-T1-W02.md. Do not edit shared NEXT_ASSIGNMENTS.md or other subjects' prompts. Do not claim the subject complete.

DELIVERY
Commit and push a unique subject/item branch; open a PR to master with FR-WK-T1-W02 in its title; do not merge. If pushing fails, supply a downloadable binary-capable patch with exact base SHA. Never request a token in chat. Report task outcome, changed files, commit/PR or patch, actual blockers and next eligible item. State "Testing deferred by owner." Stop after ONE task.
```
