# FM-INV-T3 Further Mathematics

Execute only FM-INV-T3 in PDS-David/sts-school-app. Reviewed master: 9f745bb896f2a2430269fdc491ad2eaf74874513 on 30 October 2026.

Fetch current master, read applicable AGENTS.md, and inspect open PRs. Create an isolated branch. Re-read this task's current QUEUE.json record. If it is now implemented, cite that evidence and stop; do not repeat it or pick another task without assignment. If another PR owns this subject/package, coordinate or wait rather than overwrite it. This is one small task, not completion of the whole subject.

## Read
- docs/ss1/work/microtasks/further-mathematics/QUEUE.json
- docs/ss1/contracts/CONTRACT.md
- backend/src/db/ss1/subjectPackageSchema.ts
- backend/src/db/ss1/compiler.ts
- backend/src/db/ss1/subjects/further-mathematics.json
- docs/ss1/IMPLEMENTATION_20261026/SOURCE_ASSIGNMENTS.csv
- docs/ss1/work/SS1-03/CHECKPOINT.md
- docs/ss1/work/SS1-03/evidence/parsed_rows.json

## Scope
Type: SOURCE_WEEK_INVENTORY
Term and locator: 3rd Term / whole document
Dependencies: FM-SRC-T3. Check their committed implementation evidence; testing deferred is not verified.

Verify the 3rd Term document inventory from the original: confirm that it has no scheme of work, confirm the six week headings already parsed (Weeks 2, 3, 4, 5, 6, 8), establish whether any further week heading, unlabelled teaching section, cover or letterhead page, figure object group or textbook-reference block exists, and record the header evidence. Append one small SOURCE_WEEK_INDEXING item per newly found week and a preamble/visual item for each further unlabelled substantive section.

## Exact input
- Attach standalone `3RD TERM S1 FURTHER MATHEMATICS.docx` or extract `SSS 1/3rd Term SS1_/3RD TERM S1 FURTHER MATHEMATICS.docx` from a supplied container. Member SHA-256: `83af98556a1b01fa0811df6274e7cca3bec978d1e7b411c17994613b2a34a2c5`.
The full archive is optional. If Library access exists, retrieve SSS 1-20260507T072431Z-3-001 (1).zip there before asking for another upload; validate the member hash. Accept matching bytes regardless of filename. Do not require the full ZIP or assert its hash unless checked. Do not infer source headings from filenames. If inaccessible, state the exact missing member and checkpoint any independent work; never invent evidence.

## Permitted writes
- docs/ss1/work/microtasks/further-mathematics/QUEUE.json
- docs/ss1/work/microtasks/further-mathematics/FM-INV-T3.md

No UI, JSS3, other subject, shared compiler/schema, runtime, production data or shared assignment-index changes. Existing packages are present: ignore historical prose saying otherwise. Preserve stable IDs and all unrelated entries.

## Implementation and completion
Week and unlabelled-section inventory written to FM-INV-T3.md with locators; absence of weeks 1, 7 and 9-12 either confirmed or refuted with evidence; new indexing items appended for any week not already in this queue; no week is invented.

For INVENTORY: inspect this document and append bounded indexing/visual tasks with real locators; no lesson authoring or structural rule implementation. For INDEXING: implement supported coverage/rules under the existing schema within the named section; preserve source wording, distinguish markers from teaching, and record precise remaining gaps plus small follow-up items. Unsupported schema operations become an explicit blocker, not a silent skip or shared-schema change. Never discard teaching under a revision heading.

Use exact UTF-8 body hashes and unique source anchors where the contract requires them. Do not label citations as reuse permission. Keep approval PENDING without actual approval evidence and verification DEFERRED. A factual uncertainty can remain open without preventing honest implementation of established content.

Testing is deferred by the owner: do not run typechecks, unit suites, importer, database, device or full-corpus validation. Basic JSON parsing, hash calculation, checking references/IDs, and inspecting the diff are permitted authoring checks; report them as such, not tests. Do not install/run the application merely to produce a task note.

Update only this queue item to IMPLEMENTED_TESTING_DEFERRED when its completion condition is met, recording the exact evidence file; otherwise use BLOCKED with the precise reason. Recompute queue counts/status_counts from items. Do not mark the whole subject complete. Commit a concise evidence note with source hashes, locators, changes and remaining work. Never commit original documents, full private extracts, renders or credentials.

Commit and push your branch and open one PR to master. Do not merge other agents' PRs. If GitHub write access fails, finish the local implementation and deliver a binary-capable patch plus commit/base SHA and changed paths; do not ask for a pasted token. State exactly whether publication succeeded. Stop after this item; name the next eligible item without executing it.
