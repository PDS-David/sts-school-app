# TD-SCH-W01 — Technical Drawing

```text
Implement exactly TD-SCH-W01 for SS1 Technical Drawing.
Repository: PDS-David/sts-school-app
Subject slug: technical-drawing
Start from latest origin/master, not a fixed old commit.
Reviewed base: e98ac3fd0aa6aa012997b1fb81d76128340efc45

START
Fetch master, read applicable AGENTS.md and check open PRs for this exact item. Use an isolated branch/worktree. If completed on master, report evidence and stop without repeating it. If another worker owns an open PR, do not overwrite it. Prerequisites: TD-SRC-T2, TD-PRE-T2; confirm their implementation states. Deferred testing is not successful verification.

QUEUE
docs/ss1/work/microtasks/technical-drawing/QUEUE.json

OBJECTIVE
Record the scheme objective in WEEK 1 (parsed row 0, 79 characters: "Revision of the work for last term. Inscribed and circumscribed"), bind it to the teaching row that covers it, and classify this row as scheme-only with a SCHEME_ONLY rule whose anchor is unique, or record why none is possible.

EXISTING EVIDENCE
Parsed row 0 (label 'WEEK 1', body sha256 08c316219062202674404113758809456aaa229a8faaabbb1ca19dcbab0cc889, 79 characters) from parsed_rows.json; CHECKPOINT.md identifies rows 0-10 as scheme-table lines. No rule, coverage entry or package exists on master.

COMPLETION CONDITION
Row hash-accounted, objective stated with locator, classification rule or open item recorded; nothing discarded.

ATTACHMENT — ONE STANDALONE ORIGINAL IS SUFFICIENT
File: 2ND TERM S1 TECHNICAL DRAWING.docx
Term: 2nd Term
Source ID: SS1-SRC-af4868d2c026
Manifest member: SSS 1/2nd Term SS1_/2ND TERM S1 TECHNICAL DRAWING.docx
SHA-256: 69198ac66432c31717d084b8a736741065119b14b1622c2f494c8575294e095d

Verify exact document bytes before conversion. Accept this standalone file, or identical member bytes extracted from any supplied archive. Do not demand the full ZIP or original folder structure when the member hash matches. Record actual input/container and checks performed; never claim a composite archive hash was verified when it was not. Retain the manifest archive_member verbatim in the package.
If the full original ZIP is supplied, its expected SHA-256 is 024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e. A filename/size match alone never substitutes for the member hash. If the named source is truly missing, identify this exact file; do not invent its content.

READ
- docs/ss1/work/microtasks/technical-drawing/QUEUE.json
- docs/ss1/contracts/CONTRACT.md
- backend/src/db/ss1/subjectPackageSchema.ts
- docs/ss1/IMPLEMENTATION_20261026/SOURCE_ASSIGNMENTS.csv
- backend/src/db/ss1/subjects/technical-drawing.json
- backend/src/db/ss1/compiler.ts
- docs/ss1/work/SS1-03/CHECKPOINT.md
- docs/ss1/work/SS1-03/HANDOFF.json
- docs/ss1/work/SS1-03/evidence/parsed_rows.json
Use the existing task evidence and subject notes; do not rerun unrelated audits. A historical note that a package did not exist is not current authority to recreate/overwrite it.

ALLOWED WRITE PATHS
- backend/src/db/ss1/subjects/technical-drawing.json
- docs/ss1/work/microtasks/technical-drawing/QUEUE.json
- docs/ss1/work/microtasks/technical-drawing/TD-SCH-W01.md
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
Update only the assigned queue item honestly, refresh counts and eligible next_runnable, and record short evidence at docs/ss1/work/microtasks/technical-drawing/TD-SCH-W01.md. Do not edit shared NEXT_ASSIGNMENTS.md or other subjects' prompts. Do not claim the subject complete.

DELIVERY
Commit and push a unique subject/item branch; open a PR to master with TD-SCH-W01 in its title; do not merge. If pushing fails, supply a downloadable binary-capable patch with exact base SHA. Never request a token in chat. Report task outcome, changed files, commit/PR or patch, actual blockers and next eligible item. State "Testing deferred by owner." Stop after ONE task.
```
