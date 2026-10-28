# CC-INV-T2 — Catering Craft

```text
Implement exactly CC-INV-T2 for SS1 Catering Craft.
Repository: PDS-David/sts-school-app
Subject slug: catering-craft
Start from latest origin/master, not a fixed old commit.
Reviewed base: e98ac3fd0aa6aa012997b1fb81d76128340efc45

START
Fetch master, read applicable AGENTS.md and check open PRs for this exact item. Use an isolated branch/worktree. If completed on master, report evidence and stop without repeating it. If another worker owns an open PR, do not overwrite it. Prerequisites: CC-SRC-T2; confirm their implementation states. Deferred testing is not successful verification.

QUEUE
docs/ss1/work/microtasks/catering-craft/QUEUE.json

OBJECTIVE
Discover the 2nd Term week inventory from the original document and append the resulting small items to this queue: one SOURCE_WEEK_INDEXING item per teaching week (with its exact label and a reproducible locator), plus items for any substantive opening/scheme/unlabelled section, revision or examination marker, and each table, equipment illustration, drawing or embedded media group that needs a separate visual disposition. Also record which structural source rules (split_before, attach_stranded_label, classify_marker) the importer's parser needs, as findings only; do not add rules here. Note food preparation processes, nutrition tables, equipment illustrations and practical assessment rubrics for separate preservation items, and any food hygiene, allergy, burns/fire or chemical statements that may be unsafe or outdated: later correction work needs authoritative primary sources and must keep the source's original wording distinct from the corrected fact. Do not prescribe treatment or doses, and do not record any classroom practical observation that was not made. Do not merge Catering Craft into Food and Nutrition.

EXISTING EVIDENCE
No week inventory exists in the repository for this source: no package, checkpoint, source notes or parsed-row evidence. Week count is unknown and must not be guessed.

COMPLETION CONDITION
A short inventory record lists every week/section with exact labels and a hash-or-anchor locator, and the new indexing/visual items are appended with unique IDs, real dependencies (this item plus its registration) and PENDING status. No lesson, coverage entry or rule is written.

INVENTORY BOUNDARY
List this document's scheme/week/section headings and reproducible locators; append small follow-up tasks. Identify visual groups for later recovery. Do not perform all week reviews, recover every image, or author lessons in this inventory task.

ATTACHMENT — ONE STANDALONE ORIGINAL IS SUFFICIENT
File: 2ND TERM S1 CATERING CRAFT PRACTICES.doc
Term: 2nd Term
Source ID: SS1-SRC-f433169ca25c
Manifest member: SSS 1/2nd Term SS1_/2ND TERM S1 CATERING CRAFT PRACTICES.doc
SHA-256: fd8115ff99dd3c370b86b4b5a326fe647e49328bc83f2d041c73f29b1b84ad59

Verify exact document bytes before conversion. Accept this standalone file, or identical member bytes extracted from any supplied archive. Do not demand the full ZIP or original folder structure when the member hash matches. Record actual input/container and checks performed; never claim a composite archive hash was verified when it was not. Retain the manifest archive_member verbatim in the package.
If the full original ZIP is supplied, its expected SHA-256 is 024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e. A filename/size match alone never substitutes for the member hash. If the named source is truly missing, identify this exact file; do not invent its content.

READ
- docs/ss1/work/microtasks/catering-craft/QUEUE.json
- docs/ss1/contracts/CONTRACT.md
- backend/src/db/ss1/subjectPackageSchema.ts
- docs/ss1/IMPLEMENTATION_20261026/SOURCE_ASSIGNMENTS.csv
- backend/src/db/ss1/compiler.ts
- docs/ss1/IMPLEMENTATION_20261026/07_WORKER_F_FOOD_CATERING.md
- backend/src/db/ss1/subjects/catering-craft.json
Use the existing task evidence and subject notes; do not rerun unrelated audits. A historical note that a package did not exist is not current authority to recreate/overwrite it.

ALLOWED WRITE PATHS
- docs/ss1/work/microtasks/catering-craft/QUEUE.json
- docs/ss1/work/microtasks/catering-craft/CC-INV-T2.md
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
Update only the assigned queue item honestly, refresh counts and eligible next_runnable, and record short evidence at docs/ss1/work/microtasks/catering-craft/CC-INV-T2.md. Do not edit shared NEXT_ASSIGNMENTS.md or other subjects' prompts. Do not claim the subject complete.

DELIVERY
Commit and push a unique subject/item branch; open a PR to master with CC-INV-T2 in its title; do not merge. If pushing fails, supply a downloadable binary-capable patch with exact base SHA. Never request a token in chat. Report task outcome, changed files, commit/PR or patch, actual blockers and next eligible item. State "Testing deferred by owner." Stop after ONE task.
```
