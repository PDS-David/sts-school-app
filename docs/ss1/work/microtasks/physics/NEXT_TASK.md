# PHYS-PRE-T3 Physics

Execute ONE task: PHYS-PRE-T3. Repository PDS-David/sts-school-app. Reviewed base 23927131f0a75d4832a6a6163ae03d15752b4012.
Fetch latest master, read applicable AGENTS.md and inspect open PRs. Use an isolated branch. Re-read this queue item and dependency evidence. If already implemented, report its exact evidence and stop; do not repeat it or choose another task without assignment. If another PR owns this subject package/queue, do not overwrite it. This task is not completion of the whole subject.

## Read these repository files
- docs/ss1/work/microtasks/physics/QUEUE.json
- docs/ss1/contracts/CONTRACT.md
- backend/src/db/ss1/subjectPackageSchema.ts
- backend/src/db/ss1/compiler.ts
- backend/src/db/ss1/subjects/physics.json
- docs/ss1/IMPLEMENTATION_20261026/SOURCE_ASSIGNMENTS.csv
- docs/ss1/work/SS1-03/CHECKPOINT.md
- docs/ss1/work/SS1-03/evidence/parsed_rows.json

## Boundary
Kind: SOURCE_PREAMBLE_INDEXING
Term: 3rd Term
Locator: text outside the parsed week rows (opening text, scheme table, revision/examination lines)
Prerequisites: PHYS-SRC-T3.

Inventory all 3rd Term text outside the parsed week rows and record each block as a mapped scheme objective, a marker, or an explicit open item. Record which scheme weeks have no teaching body.

## Exact source inputs
- Standalone file: `3RD TERM S1 PHYSICS.doc`
  Archive member: `SSS 1/3rd Term SS1_/3RD TERM S1 PHYSICS.doc`
  Member SHA-256: `bcd7daab57432b5c2b74a29e4afc1f162276e5fe360fab50345426fc3503e688`
Accept matching bytes from a standalone file or any supplied container. The full ZIP is optional. If Library is available, find SSS 1-20260507T072431Z-3-001 (1).zip there before requesting another upload. Hash the original before conversion. Keep the manifest archive_member unchanged. Do not claim verification of the outer archive unless actually checked. If unavailable, state only the exact missing member; never infer content/headings from its name.

## Permitted writes
- backend/src/db/ss1/subjects/physics.json
- docs/ss1/work/microtasks/physics/QUEUE.json
- docs/ss1/work/microtasks/physics/PHYS-PRE-T3.md

Do not change other subjects, JSS3, UI, shared schemas/compiler, database or production. All subject packages exist: historical claims that a package or all coverage is absent are obsolete. Preserve current content and stable IDs. Historical locators are leads; reproduce or explain method differences without silently rewriting evidence.

## Completion condition
Every non-week text block hash-accounted and mapped (MARKER with a SCHEME_ONLY rule id where the schema supports it) or recorded as an open item; the list of scheme weeks without a parsed row is stated explicitly. Per-week objectives belong to the PHYS-WK items.

## Implementation rules
For inventory: inspect only the assigned source; list sections/weeks, substantive revision material and visual groups; append small follow-ups with exact locators and dependencies. Do not author the entire subject or implement rules that the task only requests as findings.
For indexing: implement objective-level coverage/classification under the existing schema within this boundary. Check every assigned objective and exercise. Record precise remaining gaps and small follow-up tasks; do not fabricate missing text or teacher answers. A marker cannot erase teaching.
For an assigned lesson: deliver actual explanations, worked examples, original answered practice, marks that add up, provenance and exact UTF-8 body hash. Label equivalents honestly. Never infer reuse permission from a citation alone. For other task kinds, follow the exact objective and condition above; do not turn them into an unrequested broad audit.
Keep content approval PENDING unless actual approval evidence exists, and verification DEFERRED. Basic JSON parsing, unique-ID/reference inspection, file/body hashing, marking arithmetic and diff review are permitted authoring checks. Testing remains deferred: do not run typechecks, suites, importer, database or device validation. Do not label authoring checks as tests.

## Finish and publish
Mark this item IMPLEMENTED_TESTING_DEFERRED only when its completion condition is met; otherwise record the precise blocker. Preserve all unrelated queue items. Recompute counts and status_counts from items. Write the allowed task evidence note with input hashes, reproducible locators, exact changes and remaining gaps. Keep original documents, full extracts, private renders and secrets out of Git.
Commit and push the isolated branch, then open one PR to master. Do not merge other agents' PRs. If write access fails, finish the local work and provide a binary-capable patch, base/commit SHA and changed-path list; never request a pasted token. Report publication accurately. Stop after this item; name the next eligible item without executing it. Do not update shared assignment indexes; the coordinator regenerates them after merges.
