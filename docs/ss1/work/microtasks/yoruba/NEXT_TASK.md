# YO-WK-T3-W01 Yoruba

Execute ONE task: YO-WK-T3-W01. Repository PDS-David/sts-school-app. Reviewed base 23927131f0a75d4832a6a6163ae03d15752b4012.
Fetch latest master, read applicable AGENTS.md and inspect open PRs. Use an isolated branch. Re-read this queue item and dependency evidence. If already implemented, report its exact evidence and stop; do not repeat it or choose another task without assignment. If another PR owns this subject package/queue, do not overwrite it. This task is not completion of the whole subject.

## Read these repository files
- docs/ss1/work/microtasks/yoruba/QUEUE.json
- docs/ss1/contracts/CONTRACT.md
- backend/src/db/ss1/subjectPackageSchema.ts
- backend/src/db/ss1/compiler.ts
- docs/ss1/IMPLEMENTATION_20261026/SOURCE_ASSIGNMENTS.csv
- docs/ss1/work/SS1-02/CHECKPOINT.md
- docs/ss1/work/SS1-02/author_packages.py
- docs/ss1/work/SS1-02/extract_sources.cjs
- scripts/ss1/prepare_sources.py
- backend/src/db/ss1/subjects/yoruba.json
- docs/ss1/work/microtasks/yoruba/YO-INV-T3.md
- backend/src/db/ingestTopics.ts

## Boundary
Kind: SOURCE_WEEK_INDEXING
Term: 3rd Term
Locator: Week 1 (scheme group lines 7-11, no week label; leading EDE text "Isori oro;Oro Oruko: Oriki, Orisii Oruko, Ise Oro-Oruko ninu Gbolohun"; teaching label "OSE KINNI" at extractRawText line 121, char offset 2970; section lines 121-426)
Prerequisites: YO-SRC-T3.

Index 3rd Term Week 1 at objective level: read every EDE, ASA and LITIRESO objective and every exercise in section lines 121-426 (scheme group lines 7-11, which carries no week label), list each objective, bind it to exact source rows or supplements with reproducible locators, and record any scheme objective or exercise the body does not teach as a precise PENDING open item plus, where content is missing, a small lesson item.

## Exact source inputs
- Standalone file: `3RD TERM S1 YORUBA.docx`
  Archive member: `SSS 1/3rd Term SS1_/3RD TERM S1 YORUBA.docx`
  Member SHA-256: `a057f7f70d7e99fc34acdb6e725f3d44a426d96f756039bf6f3e6216767416e3`
Accept matching bytes from a standalone file or any supplied container. The full ZIP is optional. If Library is available, find SSS 1-20260507T072431Z-3-001 (1).zip there before requesting another upload. Hash the original before conversion. Keep the manifest archive_member unchanged. Do not claim verification of the outer archive unless actually checked. If unavailable, state only the exact missing member; never infer content/headings from its name.

## Permitted writes
- backend/src/db/ss1/subjects/yoruba.json
- docs/ss1/work/microtasks/yoruba/QUEUE.json
- docs/ss1/work/microtasks/yoruba/YO-WK-T3-W01.md

Do not change other subjects, JSS3, UI, shared schemas/compiler, database or production. All subject packages exist: historical claims that a package or all coverage is absent are obsolete. Preserve current content and stable IDs. Historical locators are leads; reproduce or explain method differences without silently rewriting evidence.

## Completion condition
Every scheme objective and every body exercise for the week is enumerated with an exact locator and hash; an objective or exercise the body does not teach becomes a precise PENDING open item and, where content is missing, a small lesson item; no lesson is authored, no objective is invented, and no schema or compiler edit is made here.

## Implementation rules
For inventory: inspect only the assigned source; list sections/weeks, substantive revision material and visual groups; append small follow-ups with exact locators and dependencies. Do not author the entire subject or implement rules that the task only requests as findings.
For indexing: implement objective-level coverage/classification under the existing schema within this boundary. Check every assigned objective and exercise. Record precise remaining gaps and small follow-up tasks; do not fabricate missing text or teacher answers. A marker cannot erase teaching.
For an assigned lesson: deliver actual explanations, worked examples, original answered practice, marks that add up, provenance and exact UTF-8 body hash. Label equivalents honestly. Never infer reuse permission from a citation alone. For other task kinds, follow the exact objective and condition above; do not turn them into an unrequested broad audit.
Keep content approval PENDING unless actual approval evidence exists, and verification DEFERRED. Basic JSON parsing, unique-ID/reference inspection, file/body hashing, marking arithmetic and diff review are permitted authoring checks. Testing remains deferred: do not run typechecks, suites, importer, database or device validation. Do not label authoring checks as tests.

## Finish and publish
Mark this item IMPLEMENTED_TESTING_DEFERRED only when its completion condition is met; otherwise record the precise blocker. Preserve all unrelated queue items. Recompute counts and status_counts from items. Write the allowed task evidence note with input hashes, reproducible locators, exact changes and remaining gaps. Keep original documents, full extracts, private renders and secrets out of Git.
Commit and push the isolated branch, then open one PR to master. Do not merge other agents' PRs. If write access fails, finish the local work and provide a binary-capable patch, base/commit SHA and changed-path list; never request a pasted token. Report publication accurately. Stop after this item; name the next eligible item without executing it. Do not update shared assignment indexes; the coordinator regenerates them after merges.
