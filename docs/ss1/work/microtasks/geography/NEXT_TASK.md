# GEO-INV-T1 — Geography

```text
Execute ONE task: GEO-INV-T1. Repository PDS-David/sts-school-app, latest master.
Reviewed base 0ee6033d585098bbb418be5b8fbda3ac7809f67a; fetch current master, read AGENTS.md if present, inspect this task and open PRs. If already done, report its evidence and stop. If another PR owns it, do not duplicate it. Use a unique branch from master.

READ THESE REPOSITORY FILES
- docs/ss1/work/microtasks/geography/QUEUE.json
- docs/ss1/contracts/CONTRACT.md
- backend/src/db/ss1/subjectPackageSchema.ts
- docs/ss1/IMPLEMENTATION_20261026/SOURCE_ASSIGNMENTS.csv
- backend/src/db/ss1/compiler.ts
- docs/ss1/IMPLEMENTATION_20261026/04_WORKER_C_SCIENCE_AGRICULTURE_GEOGRAPHY.md
- backend/src/db/ss1/subjects/geography.json

PREREQUISITES
GEO-SRC-T1. Confirm each is implemented; deferred verification is not a test pass.

OBJECTIVE
Inventory the 1st Term document's explicit scheme/week headings and substantive unlabelled sections, recording reproducible locators. Append one small indexing task per evidenced week/section. List maps, diagrams and tables needing separate visual inspection; do not recover or interpret all assets in this task. Do not add lessons or source rules.

EXISTING EVIDENCE (historical descriptions must be checked against current files)
Manifest assignment SS1-SRC-1c1c1bdcecb4, SSS 1/1st Term SS1_/1ST TERM S1 GEOGRAPHY.doc, 4220757cb96c6d6ac5153f7a862b45725a7d87c8e64be5b11ec39a843ca1491c. No Geography subject package exists at d01704cd15aa69241a8775c5e072fd2297b1d71b; original header and week inventory not inspected.

COMPLETION CONDITION
A short inventory record lists every week/section with exact labels and a hash-or-anchor locator, and the new indexing/visual items are appended with unique IDs, real dependencies (this item plus its registration) and PENDING status. No lesson, coverage entry or rule is written.

EXACT ATTACHMENTS
- Standalone original: 1ST TERM S1 GEOGRAPHY.doc
  Manifest member: SSS 1/1st Term SS1_/1ST TERM S1 GEOGRAPHY.doc
  SHA-256: 4220757cb96c6d6ac5153f7a862b45725a7d87c8e64be5b11ec39a843ca1491c
Accept standalone matching bytes or that member from any supplied container. Do not demand the full ZIP. Hash before conversion; retain archive_member verbatim. If a source is absent, request only the exact file above. Never invent its headings. The full ZIP, if used, has SHA-256 024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e; claim its verification only if actually checked.

WRITE SCOPE
- docs/ss1/work/microtasks/geography/QUEUE.json
- docs/ss1/work/microtasks/geography/GEO-INV-T1.md
No other subject, JSS3, UI, shared schema/compiler, or shared next-assignment index changes. This prompt explicitly permits the task evidence note. Do not recreate an existing package from a historical 'package absent' note.

IMPLEMENT
- Preserve unrelated data and stable IDs. Keep original documents/full extracts/private renders out of Git.
- Inventory tasks: inspect ONE document; commit exact section/week inventory and bounded follow-up items, including unlabelled teaching, markers and visual groups. Do not write every resulting lesson. Append IDs without changing existing ones; dependency on this inventory is allowed only after it is marked implemented.
- Indexing tasks: implement actual objective-level coverage/rules under the existing schema, not just a prose recommendation. Read all objectives/exercises within the assigned section. Missing content gets a precise open item and a small lesson task. An exam/revision heading cannot erase teaching.
- Lesson tasks: write teaching, worked examples, original answered practice and marking whose marks sum; precise objective coverage, provenance and exact UTF-8 body hash. Verify disputed factual claims against authoritative sources. Keep approval PENDING and verification DEFERRED. Do not copy unavailable textbook pages or infer whole-row coverage from one objective.
- Preserve current holds and approvals; no invented owner/teacher response. Missing approval does not prevent writing a pending implementation. Unsupported schema needs a precise separate dependency, not a silent schema edit.
- Testing deferred by owner: NO tests, typechecks, importer/plan runs, database/device checks, migration, import or deployment. Source extraction/rendering, hashes, JSON syntax, ID/reference checks and diff review are allowed.

FINISH AND PUBLISH
Record what changed and exact evidence in docs/ss1/work/microtasks/geography/GEO-INV-T1.md; update this queue item honestly, counts and eligible next_runnable. Mark only completed scope IMPLEMENTED_TESTING_DEFERRED. Fetch master again before publishing; preserve other agents' edits and resolve only your overlap. Commit/push a unique branch and open a PR to master titled with GEO-INV-T1; do not merge. If push is unavailable, deliver a binary-capable patch with base SHA, do not request a token. Report PR/commit or patch, actual blockers and next eligible task. Stop after this ONE task; do not claim the subject or class complete.
```
