# LIT-SRC-T3 — Literature

```text
Implement exactly LIT-SRC-T3 for SS1 Literature.
Repository: PDS-David/sts-school-app
Subject slug: literature
Start from latest origin/master, not a fixed old commit.
Reviewed base: e98ac3fd0aa6aa012997b1fb81d76128340efc45

START
Fetch master, read applicable AGENTS.md and check open PRs for this exact item. Use an isolated branch/worktree. If completed on master, report evidence and stop without repeating it. If another worker owns an open PR, do not overwrite it. Prerequisites: LIT-SRC-T1; confirm their implementation states. Deferred testing is not successful verification.

QUEUE
docs/ss1/work/microtasks/literature/QUEUE.json

OBJECTIVE
Register the 3rd Term Literature source: open the document, read its exact opening heading and teaching content, confirm the subject from the header (not from the filename), and add its sources[] entry (source_id, sha256, archive_member verbatim, term, canonical_subject, uniquely occurring header_text, header_evidence). The package file is created by LIT-SRC-T1; add only this source's entry and rules.

EXISTING EVIDENCE
No literature package exists on master (backend/src/db/ss1/subjects lists only english, french, mathematics, further-mathematics). SOURCE_ASSIGNMENTS.csv/sourceRegistry.json row: source_id=SS1-SRC-2422e423a240, sha256=319a4898820bc98f19f48a592404baa0b54527b704fadddbd9484277fa91e9c3, 56647 bytes, member 'SSS 1/3rd Term SS1_/LITERATURE.docx', worker A, mapping_status FILENAME_ASSIGNMENT_VERIFY_DOCUMENT_HEADER: this is a filename-based assignment, NOT a verified document header. The SS1-02 checkpoint says the T3 scheme and opening were read only; no package was created. Not registered. The canonical name must come from the header: SS1-02's draft authoring script (docs/ss1/work/SS1-02/author_packages.py) uses the label "Literature-in-English", but that script produced no package and its label is not evidence. The 2nd and 3rd Term members have different SHA-256 values and sizes (57389 and 56647 bytes) but the SS1-02 checkpoint calls them near-identical extracts; see LIT-FACT-T2-T3-RELATIONSHIP. The current contract has no cross-term duplicate exclusion, so neither is excluded here.

COMPLETION CONDITION
Package file exists; this source's entry is added and no other source touched; no lessons, coverage, corrections or assets are invented. If the header names a different subject (for example English Language), record an explicit handoff open item; do not delete or silently reassign. The package stays PENDING; the 'source without coverage' blocker remains until indexing. Registration is not performed by the queue-building task.

ATTACHMENT — ONE STANDALONE ORIGINAL IS SUFFICIENT
File: LITERATURE.docx
Term: 3rd Term
Source ID: SS1-SRC-2422e423a240
Manifest member: SSS 1/3rd Term SS1_/LITERATURE.docx
SHA-256: 319a4898820bc98f19f48a592404baa0b54527b704fadddbd9484277fa91e9c3

Verify exact document bytes before conversion. Accept this standalone file, or identical member bytes extracted from any supplied archive. Do not demand the full ZIP or original folder structure when the member hash matches. Record actual input/container and checks performed; never claim a composite archive hash was verified when it was not. Retain the manifest archive_member verbatim in the package.
If the full original ZIP is supplied, its expected SHA-256 is 024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e. A filename/size match alone never substitutes for the member hash. If the named source is truly missing, identify this exact file; do not invent its content.

READ
- docs/ss1/work/microtasks/literature/QUEUE.json
- docs/ss1/contracts/CONTRACT.md
- backend/src/db/ss1/subjectPackageSchema.ts
- docs/ss1/IMPLEMENTATION_20261026/SOURCE_ASSIGNMENTS.csv
- backend/src/db/ss1/compiler.ts
- docs/ss1/IMPLEMENTATION_20261026/02_WORKER_A_LANGUAGES.md
- docs/ss1/work/SS1-02/CHECKPOINT.md
- backend/src/db/ss1/subjects/literature.json
Use the existing task evidence and subject notes; do not rerun unrelated audits. A historical note that a package did not exist is not current authority to recreate/overwrite it.

ALLOWED WRITE PATHS
- backend/src/db/ss1/subjects/literature.json
- docs/ss1/work/microtasks/literature/QUEUE.json
- docs/ss1/work/microtasks/literature/LIT-SRC-T3.md
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
Update only the assigned queue item honestly, refresh counts and eligible next_runnable, and record short evidence at docs/ss1/work/microtasks/literature/LIT-SRC-T3.md. Do not edit shared NEXT_ASSIGNMENTS.md or other subjects' prompts. Do not claim the subject complete.

DELIVERY
Commit and push a unique subject/item branch; open a PR to master with LIT-SRC-T3 in its title; do not merge. If pushing fails, supply a downloadable binary-capable patch with exact base SHA. Never request a token in chat. Report task outcome, changed files, commit/PR or patch, actual blockers and next eligible item. State "Testing deferred by owner." Stop after ONE task.
```
