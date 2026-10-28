# FM-PORT-D3-L001 — Further Mathematics

```text
Implement exactly FM-PORT-D3-L001 for SS1 Further Mathematics.
Repository: PDS-David/sts-school-app
Subject slug: further-mathematics
Start from latest origin/master, not a fixed old commit.
Reviewed base: e98ac3fd0aa6aa012997b1fb81d76128340efc45

START
Fetch master, read applicable AGENTS.md and check open PRs for this exact item. Use an isolated branch/worktree. If completed on master, report evidence and stop without repeating it. If another worker owns an open PR, do not overwrite it. Prerequisites: FM-SRC-T1, FM-WK-T1-W01; confirm their implementation states. Deferred testing is not successful verification.

QUEUE
docs/ss1/work/microtasks/further-mathematics/QUEUE.json

OBJECTIVE
Compare PR71 lesson SUP-SS1-FMATHS-001 "Laws of indices and their applications" with the 1st Term Week 01 source row and port it into master's schema if the week item finds that the row needs a replacement; otherwise record that it is not needed.

EXISTING EVIDENCE
On PR71 only (head b5ced7ebb0efe22df2351baa140266fbf40cbf41), not on master: lessons[id=SUP-SS1-FMATHS-001] in backend/src/db/ss1/subjects/further-mathematics.json (blob 2a5849ac9566caebd8051af526e492d983f3a3ee), objective FMATHS-1-001; 1 PR71 lesson for this row, no master lesson exists. PR71 provenance cites open textbooks (OpenStax pages) whose pages were listed by a web search and not opened (PR71 OI-FMATHS-007); the references and the lesson accuracy are unchecked. Authored in PR71's incompatible schema, so it cannot be copied verbatim. | FM-WK-T1-W01 finding: the row needs a replacement (OI-FM-T1-W01-FACT-DEFECTS, -NOTATION-LOSS, -ASSESSMENT-GAPS). The PR71 lesson, if ported, must be checked against that defect list, and only one replacement may be bound to the row by FM-COR-T1-W01.

COMPLETION CONDITION
Read and compare the preserved lesson at immutable SHA b5ced7ebb0efe22df2351baa140266fbf40cbf41 against the recorded Week 1 objectives and defect list. If reusable, port and correct ONE supplement under master's schema, with original answered practice, accurate notation, checked references, exact body hash and pending approval/deferred verification; update objective coverage with evidence. If unsuitable, document exact reasons for the authoring fallback. Do not add a delivery correction here: FM-COR-T1-W01 owns the binding after scope closure. Do not copy the alternate schema or blindly adopt its claims.

PRESERVED WORK TO REUSE
Read https://github.com/PDS-David/sts-school-app/blob/b5ced7ebb0efe22df2351baa140266fbf40cbf41/backend/src/db/ss1/subjects/further-mathematics.json and select SUP-SS1-FMATHS-001. Read docs/ss1/work/microtasks/further-mathematics/FM-WK-T1-W01.md and its three recorded defect/notation/assessment open items on master. Check the cited references rather than trusting branch claims. Port only ONE corrected indices lesson into master's schema; do not merge the old foundation. FM-COR-T1-W01 separately owns binding; do not add it here. If the existing candidate cannot be reused, record why, leaving the authoring fallback actionable. Do not redo the whole term audit.

ATTACHMENT — ONE STANDALONE ORIGINAL IS SUFFICIENT
File: 1ST TERM S1 FURTHER MATHEMATICS.doc
Term: 1st Term
Source ID: SS1-SRC-e9efc9a976ed
Manifest member: SSS 1/1st Term SS1_/1ST TERM S1 FURTHER MATHEMATICS.doc
SHA-256: 995cba8c37479850ffa65824ad90df34c3294c970f091c8a576d7831a7839145

Verify exact document bytes before conversion. Accept this standalone file, or identical member bytes extracted from any supplied archive. Do not demand the full ZIP or original folder structure when the member hash matches. Record actual input/container and checks performed; never claim a composite archive hash was verified when it was not. Retain the manifest archive_member verbatim in the package.
If the full original ZIP is supplied, its expected SHA-256 is 024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e. A filename/size match alone never substitutes for the member hash. If the named source is truly missing, identify this exact file; do not invent its content.

READ
- docs/ss1/work/microtasks/further-mathematics/QUEUE.json
- docs/ss1/contracts/CONTRACT.md
- backend/src/db/ss1/subjectPackageSchema.ts
- docs/ss1/IMPLEMENTATION_20261026/SOURCE_ASSIGNMENTS.csv
- backend/src/db/ss1/subjects/further-mathematics.json
- docs/ss1/work/FOUNDATION_RECONCILIATION.md
Use the existing task evidence and subject notes; do not rerun unrelated audits. A historical note that a package did not exist is not current authority to recreate/overwrite it.

ALLOWED WRITE PATHS
- backend/src/db/ss1/subjects/further-mathematics.json
- docs/ss1/work/microtasks/further-mathematics/QUEUE.json
- docs/ss1/work/microtasks/further-mathematics/FM-PORT-D3-L001.md
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
Update only the assigned queue item honestly, refresh counts and eligible next_runnable, and record short evidence at docs/ss1/work/microtasks/further-mathematics/FM-PORT-D3-L001.md. Do not edit shared NEXT_ASSIGNMENTS.md or other subjects' prompts. Do not claim the subject complete.

DELIVERY
Commit and push a unique subject/item branch; open a PR to master with FM-PORT-D3-L001 in its title; do not merge. If pushing fails, supply a downloadable binary-capable patch with exact base SHA. Never request a token in chat. Report task outcome, changed files, commit/PR or patch, actual blockers and next eligible item. State "Testing deferred by owner." Stop after ONE task.
```
