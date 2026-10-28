# YO-INV-T1 — Yoruba

```text
Execute ONE task: YO-INV-T1. Repository PDS-David/sts-school-app, latest master.
Reviewed base 0ee6033d585098bbb418be5b8fbda3ac7809f67a; fetch current master, read AGENTS.md if present, inspect this task and open PRs. If already done, report its evidence and stop. If another PR owns it, do not duplicate it. Use a unique branch from master.

READ THESE REPOSITORY FILES
- docs/ss1/work/microtasks/yoruba/QUEUE.json
- docs/ss1/contracts/CONTRACT.md
- backend/src/db/ss1/subjectPackageSchema.ts
- docs/ss1/IMPLEMENTATION_20261026/SOURCE_ASSIGNMENTS.csv
- backend/src/db/ss1/compiler.ts
- docs/ss1/work/SS1-02/CHECKPOINT.md
- docs/ss1/work/SS1-02/author_packages.py
- docs/ss1/work/SS1-02/extract_sources.cjs
- scripts/ss1/prepare_sources.py
- backend/src/db/ss1/subjects/yoruba.json
- docs/ss1/work/microtasks/french/QUEUE.json
- backend/src/db/ingestTopics.ts

PREREQUISITES
YO-SRC-T1. Confirm each is implemented; deferred verification is not a test pass.

OBJECTIVE
Discover from the original 1st Term Yoruba document how many week/teaching sections it has and what each is, then append the resulting small indexing items to this queue. The week inventory for this document is NOT known to the repository.

EXISTING EVIDENCE (historical descriptions must be checked against current files)
No week list, scheme text or opening-section finding for this document exists in the repository (CHECKPOINT.md records only that initial schemes/opening sections were read). Do not take week counts from other subjects. Repository hints only, NOT findings for this document: (a) ingestTopics.ts documents that a scheme table and the real teaching body can both use WEEK markers, so the generic parser may ingest both as separate rows; (b) docs/ss1/work/SS1-03/author/parse_topics_copy.cjs records that some of this school's Yoruba-language files flatten the week table so the label appears as a bare number on its own line after the Yoruba word for week; whether that applies here must be read from the source; (c) master's week labels are numeric only (split_before / attach_stranded_label), see FOUNDATION_RECONCILIATION.md R-12.

COMPLETION CONDITION
Archive/member hashes verified. YO-INV-T1.md (no extract, no render, no document text beyond short week labels/headings needed as anchors) records: every week/teaching section with its verbatim label and a reproducible locator; whether each row is a scheme-table entry or a teaching body, and whether any week holds more than one teaching section; every substantive opening/preamble/unlabelled section with a locator; embedded objects (drawings, images, tables, equations) and whether Yoruba diacritics survive extraction. Then append to QUEUE.json, with the same field set as this queue and real dependency IDs (each depending on YO-SRC-T1): one SOURCE_WEEK_INDEXING item per established week (ID YO-WK-T1-Wnn), one SOURCE_PREAMBLE_INDEXING item (YO-PRE-T1-n) per substantive non-week section, one VISUAL_DISPOSITION item per object needing inspection, and a separate foundation-request item for any structure the current schema cannot express (state the specific limitation; do not change schema or compiler). Add every appended ID to YO-SCOPE-OBJECTIVE-INDEXING.depends_on and refresh counts. Do not index objectives, author lessons or edit yoruba.json in this item. Testing deferred by owner.

EXACT ATTACHMENTS
- Standalone original: YORUBA.docx
  Manifest member: SSS 1/1st Term SS1_/YORUBA.docx
  SHA-256: 7403d8243ee646a221bb3d92fe18d202c73be0bde4deb10fa68a3dec0b4a6aef
Accept standalone matching bytes or that member from any supplied container. Do not demand the full ZIP. Hash before conversion; retain archive_member verbatim. If a source is absent, request only the exact file above. Never invent its headings. The full ZIP, if used, has SHA-256 024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e; claim its verification only if actually checked.

WRITE SCOPE
- docs/ss1/work/microtasks/yoruba/QUEUE.json
- docs/ss1/work/microtasks/yoruba/YO-INV-T1.md
No other subject, JSS3, UI, shared schema/compiler, or shared next-assignment index changes. This prompt explicitly permits the task evidence note. Do not recreate an existing package from a historical 'package absent' note.

IMPLEMENT
- Preserve unrelated data and stable IDs. Keep original documents/full extracts/private renders out of Git.
- Inventory tasks: inspect ONE document; commit exact section/week inventory and bounded follow-up items, including unlabelled teaching, markers and visual groups. Do not write every resulting lesson. Append IDs without changing existing ones; dependency on this inventory is allowed only after it is marked implemented.
- Indexing tasks: implement actual objective-level coverage/rules under the existing schema, not just a prose recommendation. Read all objectives/exercises within the assigned section. Missing content gets a precise open item and a small lesson task. An exam/revision heading cannot erase teaching.
- Lesson tasks: write teaching, worked examples, original answered practice and marking whose marks sum; precise objective coverage, provenance and exact UTF-8 body hash. Verify disputed factual claims against authoritative sources. Keep approval PENDING and verification DEFERRED. Do not copy unavailable textbook pages or infer whole-row coverage from one objective.
- Preserve current holds and approvals; no invented owner/teacher response. Missing approval does not prevent writing a pending implementation. Unsupported schema needs a precise separate dependency, not a silent schema edit.
- Testing deferred by owner: NO tests, typechecks, importer/plan runs, database/device checks, migration, import or deployment. Source extraction/rendering, hashes, JSON syntax, ID/reference checks and diff review are allowed.

FINISH AND PUBLISH
Record what changed and exact evidence in docs/ss1/work/microtasks/yoruba/YO-INV-T1.md; update this queue item honestly, counts and eligible next_runnable. Mark only completed scope IMPLEMENTED_TESTING_DEFERRED. Fetch master again before publishing; preserve other agents' edits and resolve only your overlap. Commit/push a unique branch and open a PR to master titled with YO-INV-T1; do not merge. If push is unavailable, deliver a binary-capable patch with base SHA, do not request a token. Report PR/commit or patch, actual blockers and next eligible task. Stop after this ONE task; do not claim the subject or class complete.
```
