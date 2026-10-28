# FR-WK-T1-W03 — French

```text
Execute ONE task: FR-WK-T1-W03. Repository PDS-David/sts-school-app, latest master.
Reviewed base 0ee6033d585098bbb418be5b8fbda3ac7809f67a; fetch current master, read AGENTS.md if present, inspect this task and open PRs. If already done, report its evidence and stop. If another PR owns it, do not duplicate it. Use a unique branch from master.

READ THESE REPOSITORY FILES
- docs/ss1/work/microtasks/french/QUEUE.json
- docs/ss1/contracts/CONTRACT.md
- backend/src/db/ss1/subjectPackageSchema.ts
- docs/ss1/IMPLEMENTATION_20261026/SOURCE_ASSIGNMENTS.csv
- backend/src/db/ss1/subjects/french.json
- backend/src/db/ss1/compiler.ts
- docs/ss1/work/SS1-02/CHECKPOINT.md
- docs/ss1/work/SS1-02/FRENCH_SOURCE_NOTES.md

PREREQUISITES
FR-SRC-T1. Confirm each is implemented; deferred verification is not a test pass.

OBJECTIVE
Index 1st Term Week 3 at objective level: list each scheme objective for the week, bind it to exact source rows and/or supplements with reproducible locators, and confirm the replacement's scope against every exercise in the row it displaces.

EXISTING EVIDENCE (historical descriptions must be checked against current files)
Existing row-level coverage FRENCH-BODY-003 (status IMPLEMENTED_EQUIVALENT) -> SUP-SS1-FRENCH-GREETINGS-T1; correction SS1-02-french-COR-003 binds body 142d0eb60b9384edcf42f8a302829dc51b7c3277fcda1457c70d19ffcec59f98 to the same replacement. Row-level association only; the coverage entry itself states it is not exhaustive scheme-objective certification. No objective-level entry exists yet.

COMPLETION CONDITION
Every objective of the week has its own coverage entry with exact locator and evidence; scheme rows are classified; any PARTIAL/UNRESOLVED entry has an OPEN open item and, where content is missing, a separate small PENDING queue item. No lesson is authored in this item. Original source must be read: attach the member listed in required_attachments.

EXACT ATTACHMENTS
- Standalone original: FRENCH Ss1.docx
  Manifest member: SSS 1/1st Term SS1_/FRENCH Ss1.docx
  SHA-256: 2bedee524a17700d40d81dc1df8d10f529b49d4a918f38a83914ce7b0c43e864
Accept standalone matching bytes or that member from any supplied container. Do not demand the full ZIP. Hash before conversion; retain archive_member verbatim. If a source is absent, request only the exact file above. Never invent its headings. The full ZIP, if used, has SHA-256 024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e; claim its verification only if actually checked.

WRITE SCOPE
- backend/src/db/ss1/subjects/french.json
- docs/ss1/work/microtasks/french/QUEUE.json
- docs/ss1/work/microtasks/french/FR-WK-T1-W03.md
No other subject, JSS3, UI, shared schema/compiler, or shared next-assignment index changes. This prompt explicitly permits the task evidence note. Do not recreate an existing package from a historical 'package absent' note.

IMPLEMENT
- Preserve unrelated data and stable IDs. Keep original documents/full extracts/private renders out of Git.
- Inventory tasks: inspect ONE document; commit exact section/week inventory and bounded follow-up items, including unlabelled teaching, markers and visual groups. Do not write every resulting lesson. Append IDs without changing existing ones; dependency on this inventory is allowed only after it is marked implemented.
- Indexing tasks: implement actual objective-level coverage/rules under the existing schema, not just a prose recommendation. Read all objectives/exercises within the assigned section. Missing content gets a precise open item and a small lesson task. An exam/revision heading cannot erase teaching.
- Lesson tasks: write teaching, worked examples, original answered practice and marking whose marks sum; precise objective coverage, provenance and exact UTF-8 body hash. Verify disputed factual claims against authoritative sources. Keep approval PENDING and verification DEFERRED. Do not copy unavailable textbook pages or infer whole-row coverage from one objective.
- Preserve current holds and approvals; no invented owner/teacher response. Missing approval does not prevent writing a pending implementation. Unsupported schema needs a precise separate dependency, not a silent schema edit.
- Testing deferred by owner: NO tests, typechecks, importer/plan runs, database/device checks, migration, import or deployment. Source extraction/rendering, hashes, JSON syntax, ID/reference checks and diff review are allowed.

FINISH AND PUBLISH
Record what changed and exact evidence in docs/ss1/work/microtasks/french/FR-WK-T1-W03.md; update this queue item honestly, counts and eligible next_runnable. Mark only completed scope IMPLEMENTED_TESTING_DEFERRED. Fetch master again before publishing; preserve other agents' edits and resolve only your overlap. Commit/push a unique branch and open a PR to master titled with FR-WK-T1-W03; do not merge. If push is unavailable, deliver a binary-capable patch with base SHA, do not request a token. Report PR/commit or patch, actual blockers and next eligible task. Stop after this ONE task; do not claim the subject or class complete.
```
