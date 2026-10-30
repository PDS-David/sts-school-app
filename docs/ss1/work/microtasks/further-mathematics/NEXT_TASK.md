# FM-WK-T1-W02 Further Mathematics

Execute ONE task: FM-WK-T1-W02. Repository PDS-David/sts-school-app. Reviewed base 23927131f0a75d4832a6a6163ae03d15752b4012.
Fetch latest master, read applicable AGENTS.md and inspect open PRs. Use an isolated branch. Re-read this queue item and dependency evidence. If already implemented, report its exact evidence and stop; do not repeat it or choose another task without assignment. If another PR owns this subject package/queue, do not overwrite it. This task is not completion of the whole subject.

## Read these repository files
- docs/ss1/work/microtasks/further-mathematics/QUEUE.json
- docs/ss1/contracts/CONTRACT.md
- backend/src/db/ss1/subjectPackageSchema.ts
- backend/src/db/ss1/compiler.ts
- backend/src/db/ss1/subjects/further-mathematics.json
- docs/ss1/IMPLEMENTATION_20261026/SOURCE_ASSIGNMENTS.csv
- docs/ss1/work/SS1-03/CHECKPOINT.md
- docs/ss1/work/SS1-03/evidence/parsed_rows.json

## Boundary
Kind: SOURCE_WEEK_INDEXING
Term: 1st Term
Locator: Week 02 (source label 'WEEK TWO')
Prerequisites: FM-SRC-T1, FM-PRE-T1.

Index 1st Term Week 02 at objective level: list each scheme objective for the week (from the scheme table recorded by FM-PRE-T1), bind it to exact source rows with reproducible locators, review the row for factual defects and lost notation, and record whether the row needs a replacement or can stand.

## Exact source inputs
- Standalone file: `1ST TERM S1 FURTHER MATHEMATICS.doc`
  Archive member: `SSS 1/1st Term SS1_/1ST TERM S1 FURTHER MATHEMATICS.doc`
  Member SHA-256: `995cba8c37479850ffa65824ad90df34c3294c970f091c8a576d7831a7839145`
Accept matching bytes from a standalone file or any supplied container. The full ZIP is optional. If Library is available, find SSS 1-20260507T072431Z-3-001 (1).zip there before requesting another upload. Hash the original before conversion. Keep the manifest archive_member unchanged. Do not claim verification of the outer archive unless actually checked. If unavailable, state only the exact missing member; never infer content/headings from its name.

## Permitted writes
- backend/src/db/ss1/subjects/further-mathematics.json
- docs/ss1/work/microtasks/further-mathematics/QUEUE.json
- docs/ss1/work/microtasks/further-mathematics/FM-WK-T1-W02.md

Do not change other subjects, JSS3, UI, shared schemas/compiler, database or production. All subject packages exist: historical claims that a package or all coverage is absent are obsolete. Preserve current content and stable IDs. Historical locators are leads; reproduce or explain method differences without silently rewriting evidence.

## Completion condition
Every objective of the week has its own coverage entry with exact locator and evidence; scheme rows are classified; factual defects and notation loss are listed; any PARTIAL/UNRESOLVED entry has an OPEN open item and, where content is missing or defective, a separate small PENDING queue item (a lesson item only for a specifically named uncovered objective). No lesson is authored in this item. Original source must be read: attach the member listed in required_attachments.

## Implementation rules
For inventory: inspect only the assigned source; list sections/weeks, substantive revision material and visual groups; append small follow-ups with exact locators and dependencies. Do not author the entire subject or implement rules that the task only requests as findings.
For indexing: implement objective-level coverage/classification under the existing schema within this boundary. Check every assigned objective and exercise. Record precise remaining gaps and small follow-up tasks; do not fabricate missing text or teacher answers. A marker cannot erase teaching.
For an assigned lesson: deliver actual explanations, worked examples, original answered practice, marks that add up, provenance and exact UTF-8 body hash. Label equivalents honestly. Never infer reuse permission from a citation alone. For other task kinds, follow the exact objective and condition above; do not turn them into an unrequested broad audit.
Keep content approval PENDING unless actual approval evidence exists, and verification DEFERRED. Basic JSON parsing, unique-ID/reference inspection, file/body hashing, marking arithmetic and diff review are permitted authoring checks. Testing remains deferred: do not run typechecks, suites, importer, database or device validation. Do not label authoring checks as tests.

## Finish and publish
Mark this item IMPLEMENTED_TESTING_DEFERRED only when its completion condition is met; otherwise record the precise blocker. Preserve all unrelated queue items. Recompute counts and status_counts from items. Write the allowed task evidence note with input hashes, reproducible locators, exact changes and remaining gaps. Keep original documents, full extracts, private renders and secrets out of Git.
Commit and push the isolated branch, then open one PR to master. Do not merge other agents' PRs. If write access fails, finish the local work and provide a binary-capable patch, base/commit SHA and changed-path list; never request a pasted token. Report publication accurately. Stop after this item; name the next eligible item without executing it. Do not update shared assignment indexes; the coordinator regenerates them after merges.
