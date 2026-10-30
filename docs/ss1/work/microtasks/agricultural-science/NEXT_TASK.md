# AG-INV-T3 Agricultural Science

Execute ONE task: AG-INV-T3. Repository PDS-David/sts-school-app. Reviewed base 23927131f0a75d4832a6a6163ae03d15752b4012.
Fetch latest master, read applicable AGENTS.md and inspect open PRs. Use an isolated branch. Re-read this queue item and dependency evidence. If already implemented, report its exact evidence and stop; do not repeat it or choose another task without assignment. If another PR owns this subject package/queue, do not overwrite it. This task is not completion of the whole subject.

## Read these repository files
- docs/ss1/work/microtasks/agricultural-science/QUEUE.json
- docs/ss1/contracts/CONTRACT.md
- backend/src/db/ss1/subjectPackageSchema.ts
- backend/src/db/ss1/compiler.ts
- docs/ss1/IMPLEMENTATION_20261026/SOURCE_ASSIGNMENTS.csv
- docs/ss1/IMPLEMENTATION_20261026/04_WORKER_C_SCIENCE_AGRICULTURE_GEOGRAPHY.md
- backend/src/db/ss1/subjects/agricultural-science.json

## Boundary
Kind: SOURCE_WEEK_INVENTORY
Term: 3rd Term
Locator: whole document
Prerequisites: AG-SRC-T3.

Discover the 3rd Term week inventory from the original document and append the resulting small items to this queue: one SOURCE_WEEK_INDEXING item per teaching week (with its exact label and a reproducible locator), plus items for any substantive opening/scheme/unlabelled section, revision or examination marker, and each drawing, table, equation or embedded media group that needs a separate visual disposition. Also record which structural source rules (split_before, attach_stranded_label, classify_marker) the importer's parser needs, as findings only; do not add rules here. Note practical observation/recording sections and any safe-chemical-handling content so later items neither invent doses nor omit them.

## Exact source inputs
- Standalone file: `3RD TERM S1 AGRICULTURAL SCIENCE.docx`
  Archive member: `SSS 1/3rd Term SS1_/3RD TERM S1 AGRICULTURAL SCIENCE.docx`
  Member SHA-256: `9e920bff3769d9d977c4b2849cc77c769b6033be9176f4f6b35c27935999e12a`
Accept matching bytes from a standalone file or any supplied container. The full ZIP is optional. If Library is available, find SSS 1-20260507T072431Z-3-001 (1).zip there before requesting another upload. Hash the original before conversion. Keep the manifest archive_member unchanged. Do not claim verification of the outer archive unless actually checked. If unavailable, state only the exact missing member; never infer content/headings from its name.

## Permitted writes
- docs/ss1/work/microtasks/agricultural-science/QUEUE.json
- docs/ss1/work/microtasks/agricultural-science/AG-INV-T3.md

Do not change other subjects, JSS3, UI, shared schemas/compiler, database or production. All subject packages exist: historical claims that a package or all coverage is absent are obsolete. Preserve current content and stable IDs. Historical locators are leads; reproduce or explain method differences without silently rewriting evidence.

## Completion condition
A short inventory record lists every week/section with exact labels and a hash-or-anchor locator, and the new indexing/visual items are appended with unique IDs, real dependencies (this item plus its registration) and PENDING status. No lesson, coverage entry or rule is written.

## Implementation rules
For inventory: inspect only the assigned source; list sections/weeks, substantive revision material and visual groups; append small follow-ups with exact locators and dependencies. Do not author the entire subject or implement rules that the task only requests as findings.
For indexing: implement objective-level coverage/classification under the existing schema within this boundary. Check every assigned objective and exercise. Record precise remaining gaps and small follow-up tasks; do not fabricate missing text or teacher answers. A marker cannot erase teaching.
For an assigned lesson: deliver actual explanations, worked examples, original answered practice, marks that add up, provenance and exact UTF-8 body hash. Label equivalents honestly. Never infer reuse permission from a citation alone. For other task kinds, follow the exact objective and condition above; do not turn them into an unrequested broad audit.
Keep content approval PENDING unless actual approval evidence exists, and verification DEFERRED. Basic JSON parsing, unique-ID/reference inspection, file/body hashing, marking arithmetic and diff review are permitted authoring checks. Testing remains deferred: do not run typechecks, suites, importer, database or device validation. Do not label authoring checks as tests.

## Finish and publish
Mark this item IMPLEMENTED_TESTING_DEFERRED only when its completion condition is met; otherwise record the precise blocker. Preserve all unrelated queue items. Recompute counts and status_counts from items. Write the allowed task evidence note with input hashes, reproducible locators, exact changes and remaining gaps. Keep original documents, full extracts, private renders and secrets out of Git.
Commit and push the isolated branch, then open one PR to master. Do not merge other agents' PRs. If write access fails, finish the local work and provide a binary-capable patch, base/commit SHA and changed-path list; never request a pasted token. Report publication accurately. Stop after this item; name the next eligible item without executing it. Do not update shared assignment indexes; the coordinator regenerates them after merges.
