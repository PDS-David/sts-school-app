# FR-WK-T1-W04 French

Execute only FR-WK-T1-W04 in PDS-David/sts-school-app. Reviewed master: 9f745bb896f2a2430269fdc491ad2eaf74874513 on 30 October 2026.

Fetch current master, read applicable AGENTS.md, and inspect open PRs. Create an isolated branch. Re-read this task's current QUEUE.json record. If it is now implemented, cite that evidence and stop; do not repeat it or pick another task without assignment. If another PR owns this subject/package, coordinate or wait rather than overwrite it. This is one small task, not completion of the whole subject.

## Read
- docs/ss1/work/microtasks/french/QUEUE.json
- docs/ss1/contracts/CONTRACT.md
- backend/src/db/ss1/subjectPackageSchema.ts
- backend/src/db/ss1/compiler.ts
- backend/src/db/ss1/subjects/french.json
- docs/ss1/IMPLEMENTATION_20261026/SOURCE_ASSIGNMENTS.csv
- docs/ss1/work/SS1-02/CHECKPOINT.md
- docs/ss1/work/SS1-02/FRENCH_SOURCE_NOTES.md

## Scope
Type: SOURCE_WEEK_INDEXING
Term and locator: 1st Term / Week 4 (source label '4')
Dependencies: FR-SRC-T1. Check their committed implementation evidence; testing deferred is not verified.

Index 1st Term Week 4 at objective level: list each scheme objective for the week, bind it to exact source rows and/or supplements with reproducible locators, and confirm the replacement's scope against every exercise in the row it displaces.

## Exact input
- Attach standalone `FRENCH Ss1.docx` or extract `SSS 1/1st Term SS1_/FRENCH Ss1.docx` from a supplied container. Member SHA-256: `2bedee524a17700d40d81dc1df8d10f529b49d4a918f38a83914ce7b0c43e864`.
The full archive is optional. If Library access exists, retrieve SSS 1-20260507T072431Z-3-001 (1).zip there before asking for another upload; validate the member hash. Accept matching bytes regardless of filename. Do not require the full ZIP or assert its hash unless checked. Do not infer source headings from filenames. If inaccessible, state the exact missing member and checkpoint any independent work; never invent evidence.

## Permitted writes
- backend/src/db/ss1/subjects/french.json
- docs/ss1/work/microtasks/french/QUEUE.json
- docs/ss1/work/microtasks/french/FR-WK-T1-W04.md

No UI, JSS3, other subject, shared compiler/schema, runtime, production data or shared assignment-index changes. Existing packages are present: ignore historical prose saying otherwise. Preserve stable IDs and all unrelated entries.

## Implementation and completion
Every objective of the week has its own coverage entry with exact locator and evidence; scheme rows are classified; any PARTIAL/UNRESOLVED entry has an OPEN open item and, where content is missing, a separate small PENDING queue item. No lesson is authored in this item. Original source must be read: attach the member listed in required_attachments.

For INVENTORY: inspect this document and append bounded indexing/visual tasks with real locators; no lesson authoring or structural rule implementation. For INDEXING: implement supported coverage/rules under the existing schema within the named section; preserve source wording, distinguish markers from teaching, and record precise remaining gaps plus small follow-up items. Unsupported schema operations become an explicit blocker, not a silent skip or shared-schema change. Never discard teaching under a revision heading.

Use exact UTF-8 body hashes and unique source anchors where the contract requires them. Do not label citations as reuse permission. Keep approval PENDING without actual approval evidence and verification DEFERRED. A factual uncertainty can remain open without preventing honest implementation of established content.

Testing is deferred by the owner: do not run typechecks, unit suites, importer, database, device or full-corpus validation. Basic JSON parsing, hash calculation, checking references/IDs, and inspecting the diff are permitted authoring checks; report them as such, not tests. Do not install/run the application merely to produce a task note.

Update only this queue item to IMPLEMENTED_TESTING_DEFERRED when its completion condition is met, recording the exact evidence file; otherwise use BLOCKED with the precise reason. Recompute queue counts/status_counts from items. Do not mark the whole subject complete. Commit a concise evidence note with source hashes, locators, changes and remaining work. Never commit original documents, full private extracts, renders or credentials.

Commit and push your branch and open one PR to master. Do not merge other agents' PRs. If GitHub write access fails, finish the local implementation and deliver a binary-capable patch plus commit/base SHA and changed paths; do not ask for a pasted token. State exactly whether publication succeeded. Stop after this item; name the next eligible item without executing it.
