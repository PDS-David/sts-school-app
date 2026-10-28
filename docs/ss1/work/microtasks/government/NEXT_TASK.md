# GOV-INV-T1 — Government

```text
Execute ONE task: GOV-INV-T1. Repository PDS-David/sts-school-app, latest master.
Reviewed base 0ee6033d585098bbb418be5b8fbda3ac7809f67a; fetch current master, read AGENTS.md if present, inspect this task and open PRs. If already done, report its evidence and stop. If another PR owns it, do not duplicate it. Use a unique branch from master.

READ THESE REPOSITORY FILES
- docs/ss1/work/microtasks/government/QUEUE.json
- docs/ss1/contracts/CONTRACT.md
- backend/src/db/ss1/subjectPackageSchema.ts
- docs/ss1/IMPLEMENTATION_20261026/SOURCE_ASSIGNMENTS.csv
- backend/src/db/ss1/compiler.ts
- docs/ss1/IMPLEMENTATION_20261026/06_WORKER_E_CIVIC_GOVERNMENT_DATA.md
- backend/src/db/ss1/subjects/government.json

PREREQUISITES
GOV-SRC-T1. Confirm each is implemented; deferred verification is not a test pass.

OBJECTIVE
Discover the 1st Term week inventory from the original document and append the resulting small items to this queue: one SOURCE_WEEK_INDEXING item per teaching week (with its exact label and a reproducible locator), plus items for any substantive opening/scheme/unlabelled section, revision or examination marker, and each table, diagram or embedded media group that needs a separate visual disposition. Also record which structural source rules (split_before, attach_stranded_label, classify_marker) the importer's parser needs, as findings only; do not add rules here. Note statements about institutions, constitutional powers, laws, officeholders and dates that may be outdated or that treat a proposal or historical arrangement as law in force: later correction work needs primary authoritative texts with effective/reference dates and must keep the source's original wording distinct from the corrected fact. Teaching must stay neutral on contested political questions. Do not merge Government into Civic Education.

EXISTING EVIDENCE (historical descriptions must be checked against current files)
No week inventory exists in the repository for this source: no package, checkpoint, source notes or parsed-row evidence. Week count is unknown and must not be guessed.

COMPLETION CONDITION
A short inventory record lists every week/section with exact labels and a hash-or-anchor locator, and the new indexing/visual items are appended with unique IDs, real dependencies (this item plus its registration) and PENDING status. No lesson, coverage entry or rule is written.

EXACT ATTACHMENTS
- Standalone original: 1ST TERM S1 GOVERNMENT.doc
  Manifest member: SSS 1/1st Term SS1_/1ST TERM S1 GOVERNMENT.doc
  SHA-256: 50508a226b21bc5862b1f814d14a3d6bf2a56ff9d29867116931f5a7e58c9c1a
Accept standalone matching bytes or that member from any supplied container. Do not demand the full ZIP. Hash before conversion; retain archive_member verbatim. If a source is absent, request only the exact file above. Never invent its headings. The full ZIP, if used, has SHA-256 024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e; claim its verification only if actually checked.

WRITE SCOPE
- docs/ss1/work/microtasks/government/QUEUE.json
- docs/ss1/work/microtasks/government/GOV-INV-T1.md
No other subject, JSS3, UI, shared schema/compiler, or shared next-assignment index changes. This prompt explicitly permits the task evidence note. Do not recreate an existing package from a historical 'package absent' note.

IMPLEMENT
- Preserve unrelated data and stable IDs. Keep original documents/full extracts/private renders out of Git.
- Inventory tasks: inspect ONE document; commit exact section/week inventory and bounded follow-up items, including unlabelled teaching, markers and visual groups. Do not write every resulting lesson. Append IDs without changing existing ones; dependency on this inventory is allowed only after it is marked implemented.
- Indexing tasks: implement actual objective-level coverage/rules under the existing schema, not just a prose recommendation. Read all objectives/exercises within the assigned section. Missing content gets a precise open item and a small lesson task. An exam/revision heading cannot erase teaching.
- Lesson tasks: write teaching, worked examples, original answered practice and marking whose marks sum; precise objective coverage, provenance and exact UTF-8 body hash. Verify disputed factual claims against authoritative sources. Keep approval PENDING and verification DEFERRED. Do not copy unavailable textbook pages or infer whole-row coverage from one objective.
- Preserve current holds and approvals; no invented owner/teacher response. Missing approval does not prevent writing a pending implementation. Unsupported schema needs a precise separate dependency, not a silent schema edit.
- Testing deferred by owner: NO tests, typechecks, importer/plan runs, database/device checks, migration, import or deployment. Source extraction/rendering, hashes, JSON syntax, ID/reference checks and diff review are allowed.

FINISH AND PUBLISH
Record what changed and exact evidence in docs/ss1/work/microtasks/government/GOV-INV-T1.md; update this queue item honestly, counts and eligible next_runnable. Mark only completed scope IMPLEMENTED_TESTING_DEFERRED. Fetch master again before publishing; preserve other agents' edits and resolve only your overlap. Commit/push a unique branch and open a PR to master titled with GOV-INV-T1; do not merge. If push is unavailable, deliver a binary-capable patch with base SHA, do not request a token. Report PR/commit or patch, actual blockers and next eligible task. Stop after this ONE task; do not claim the subject or class complete.
```
