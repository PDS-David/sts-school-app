# LIT-INV-T1 — Literature

```text
Execute ONE task: LIT-INV-T1. Repository PDS-David/sts-school-app, latest master.
Reviewed base 0ee6033d585098bbb418be5b8fbda3ac7809f67a; fetch current master, read AGENTS.md if present, inspect this task and open PRs. If already done, report its evidence and stop. If another PR owns it, do not duplicate it. Use a unique branch from master.

READ THESE REPOSITORY FILES
- docs/ss1/work/microtasks/literature/QUEUE.json
- docs/ss1/contracts/CONTRACT.md
- backend/src/db/ss1/subjectPackageSchema.ts
- docs/ss1/IMPLEMENTATION_20261026/SOURCE_ASSIGNMENTS.csv
- backend/src/db/ss1/compiler.ts
- docs/ss1/IMPLEMENTATION_20261026/02_WORKER_A_LANGUAGES.md
- docs/ss1/work/SS1-02/CHECKPOINT.md
- backend/src/db/ss1/subjects/literature.json

PREREQUISITES
LIT-SRC-T1. Confirm each is implemented; deferred verification is not a test pass.

OBJECTIVE
Discover the 1st Term week inventory from the original document and append the resulting small items to this queue: one SOURCE_WEEK_INDEXING item per teaching week (with its exact label and a reproducible locator), plus items for any substantive opening/scheme/unlabelled section, revision or examination marker, and each table, image or embedded media group that needs a separate visual disposition. Also record which structural source rules (split_before, attach_stranded_label, classify_marker) the importer's parser needs, as findings only; do not add rules here. Determine the actual book, play, poem or extract the document names or quotes, with the exact wording that names it, and record whether the document supplies the text itself or only refers to it. Do not invent titles, authors, page numbers or editions; a modern equivalent must be labelled, never presented as the school's prescribed text. Note any quoted passage whose reuse permission or attribution would need checking, and any literary-term definition or biographical/historical statement that may be inaccurate, so that later correction work keeps the source's original wording distinct from the corrected fact. Keep any drama, prose and poetry strands distinct without a target count.

EXISTING EVIDENCE (historical descriptions must be checked against current files)
No week inventory exists in the repository for this source: no package, parsed-row evidence or source notes. The SS1-02 checkpoint says the T1 opening was read only; no package was created. Week count and the named text are unknown and must not be guessed.

COMPLETION CONDITION
A short inventory record lists every week/section with exact labels and a hash-or-anchor locator, states what text/book/extract each section names (or that none is named), and the new indexing/visual items are appended with unique IDs, real dependencies (this item plus its registration) and PENDING status. No lesson, coverage entry or rule is written.

EXACT ATTACHMENTS
- Standalone original: LIT. IN ENGLISH.docx
  Manifest member: SSS 1/1st Term SS1_/LIT. IN ENGLISH.docx
  SHA-256: 732deed1d3e0c4e3c2218cde0d2e3fce1678f39c8730633b20af9fdc4d602dea
Accept standalone matching bytes or that member from any supplied container. Do not demand the full ZIP. Hash before conversion; retain archive_member verbatim. If a source is absent, request only the exact file above. Never invent its headings. The full ZIP, if used, has SHA-256 024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e; claim its verification only if actually checked.

WRITE SCOPE
- docs/ss1/work/microtasks/literature/QUEUE.json
- docs/ss1/work/microtasks/literature/LIT-INV-T1.md
No other subject, JSS3, UI, shared schema/compiler, or shared next-assignment index changes. This prompt explicitly permits the task evidence note. Do not recreate an existing package from a historical 'package absent' note.

IMPLEMENT
- Preserve unrelated data and stable IDs. Keep original documents/full extracts/private renders out of Git.
- Inventory tasks: inspect ONE document; commit exact section/week inventory and bounded follow-up items, including unlabelled teaching, markers and visual groups. Do not write every resulting lesson. Append IDs without changing existing ones; dependency on this inventory is allowed only after it is marked implemented.
- Indexing tasks: implement actual objective-level coverage/rules under the existing schema, not just a prose recommendation. Read all objectives/exercises within the assigned section. Missing content gets a precise open item and a small lesson task. An exam/revision heading cannot erase teaching.
- Lesson tasks: write teaching, worked examples, original answered practice and marking whose marks sum; precise objective coverage, provenance and exact UTF-8 body hash. Verify disputed factual claims against authoritative sources. Keep approval PENDING and verification DEFERRED. Do not copy unavailable textbook pages or infer whole-row coverage from one objective.
- Preserve current holds and approvals; no invented owner/teacher response. Missing approval does not prevent writing a pending implementation. Unsupported schema needs a precise separate dependency, not a silent schema edit.
- Testing deferred by owner: NO tests, typechecks, importer/plan runs, database/device checks, migration, import or deployment. Source extraction/rendering, hashes, JSON syntax, ID/reference checks and diff review are allowed.

FINISH AND PUBLISH
Record what changed and exact evidence in docs/ss1/work/microtasks/literature/LIT-INV-T1.md; update this queue item honestly, counts and eligible next_runnable. Mark only completed scope IMPLEMENTED_TESTING_DEFERRED. Fetch master again before publishing; preserve other agents' edits and resolve only your overlap. Commit/push a unique branch and open a PR to master titled with LIT-INV-T1; do not merge. If push is unavailable, deliver a binary-capable patch with base SHA, do not request a token. Report PR/commit or patch, actual blockers and next eligible task. Stop after this ONE task; do not claim the subject or class complete.
```
