# MATH-FACT-HEADER-T3 — Mathematics

```text
Implement exactly MATH-FACT-HEADER-T3 for SS1 Mathematics.
Repository: PDS-David/sts-school-app
Subject slug: mathematics
Start from latest origin/master, not a fixed old commit.
Reviewed base: e98ac3fd0aa6aa012997b1fb81d76128340efc45

START
Fetch master, read applicable AGENTS.md and check open PRs for this exact item. Use an isolated branch/worktree. If completed on master, report evidence and stop without repeating it. If another worker owns an open PR, do not overwrite it. Prerequisites: MATH-SRC-T3; confirm their implementation states. Deferred testing is not successful verification.

QUEUE
docs/ss1/work/microtasks/mathematics/QUEUE.json

OBJECTIVE
Verify against the original 3rd Term document the exact header/title text, class line and subject wording recorded in mathematics.json, and record whether it names Mathematics (and not Further Mathematics or another subject). Inspection of the document only; no owner decision is needed for what the header says.

EXISTING EVIDENCE
Recorded: header_text="SUBJECT: MATHEMATICS\t\t\t\t\t\t\tCLASS: SSS 1"; header_evidence.locator="line 2 \"SUBJECT: ... CLASS: SSS 1\"". mapping_status in the CSV is FILENAME_ASSIGNMENT_VERIFY_DOCUMENT_HEADER, i.e. assignment by filename with document-header verification still required.

COMPLETION CONDITION
Exact header lines (verbatim, short) and their locator recorded in the item note and in the source's header_evidence where they differ; any mismatch with Mathematics recorded as an open item and reported. The alias approval_reference is NOT changed here (see MATH-APPROVAL-ALIASES).

ATTACHMENT — ONE STANDALONE ORIGINAL IS SUFFICIENT
File: 3RD TERM S1 MATHEMATICS.docx
Term: 3rd Term
Source ID: SS1-SRC-ca00ca94afb9
Manifest member: SSS 1/3rd Term SS1_/3RD TERM S1 MATHEMATICS.docx
SHA-256: 9cc003bfd8d06f7da212d0586a44b04749a312c4759cc3422eae2290e2ec84f2

Verify exact document bytes before conversion. Accept this standalone file, or identical member bytes extracted from any supplied archive. Do not demand the full ZIP or original folder structure when the member hash matches. Record actual input/container and checks performed; never claim a composite archive hash was verified when it was not. Retain the manifest archive_member verbatim in the package.
If the full original ZIP is supplied, its expected SHA-256 is 024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e. A filename/size match alone never substitutes for the member hash. If the named source is truly missing, identify this exact file; do not invent its content.

READ
- docs/ss1/work/microtasks/mathematics/QUEUE.json
- docs/ss1/contracts/CONTRACT.md
- backend/src/db/ss1/subjectPackageSchema.ts
- docs/ss1/IMPLEMENTATION_20261026/SOURCE_ASSIGNMENTS.csv
- backend/src/db/ss1/subjects/mathematics.json
- docs/ss1/work/SS1-03/CHECKPOINT.md
Use the existing task evidence and subject notes; do not rerun unrelated audits. A historical note that a package did not exist is not current authority to recreate/overwrite it.

ALLOWED WRITE PATHS
- backend/src/db/ss1/subjects/mathematics.json
- docs/ss1/work/microtasks/mathematics/QUEUE.json
- docs/ss1/work/microtasks/mathematics/MATH-FACT-HEADER-T3.md
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
Update only the assigned queue item honestly, refresh counts and eligible next_runnable, and record short evidence at docs/ss1/work/microtasks/mathematics/MATH-FACT-HEADER-T3.md. Do not edit shared NEXT_ASSIGNMENTS.md or other subjects' prompts. Do not claim the subject complete.

DELIVERY
Commit and push a unique subject/item branch; open a PR to master with MATH-FACT-HEADER-T3 in its title; do not merge. If pushing fails, supply a downloadable binary-capable patch with exact base SHA. Never request a token in chat. Report task outcome, changed files, commit/PR or patch, actual blockers and next eligible item. State "Testing deferred by owner." Stop after ONE task.
```
