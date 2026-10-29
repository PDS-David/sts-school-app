# LIT-INV-T2 Literature

Execute only LIT-INV-T2 in PDS-David/sts-school-app. Reviewed master: 9f745bb896f2a2430269fdc491ad2eaf74874513 on 30 October 2026.

Fetch current master, read applicable AGENTS.md, and inspect open PRs. Create an isolated branch. Re-read this task's current QUEUE.json record. If it is now implemented, cite that evidence and stop; do not repeat it or pick another task without assignment. If another PR owns this subject/package, coordinate or wait rather than overwrite it. This is one small task, not completion of the whole subject.

## Read
- docs/ss1/work/microtasks/literature/QUEUE.json
- docs/ss1/contracts/CONTRACT.md
- backend/src/db/ss1/subjectPackageSchema.ts
- backend/src/db/ss1/compiler.ts
- docs/ss1/IMPLEMENTATION_20261026/SOURCE_ASSIGNMENTS.csv
- docs/ss1/IMPLEMENTATION_20261026/02_WORKER_A_LANGUAGES.md
- docs/ss1/work/SS1-02/CHECKPOINT.md
- backend/src/db/ss1/subjects/literature.json

## Scope
Type: SOURCE_WEEK_INVENTORY
Term and locator: 2nd Term / whole document
Dependencies: LIT-SRC-T2. Check their committed implementation evidence; testing deferred is not verified.

Discover the 2nd Term week inventory from the original document and append the resulting small items to this queue: one SOURCE_WEEK_INDEXING item per teaching week (with its exact label and a reproducible locator), plus items for any substantive opening/scheme/unlabelled section, revision or examination marker, and each table, image or embedded media group that needs a separate visual disposition. Also record which structural source rules (split_before, attach_stranded_label, classify_marker) the importer's parser needs, as findings only; do not add rules here. Determine the actual book, play, poem or extract the document names or quotes, with the exact wording that names it, and record whether the document supplies the text itself or only refers to it. Do not invent titles, authors, page numbers or editions; a modern equivalent must be labelled, never presented as the school's prescribed text. Note any quoted passage whose reuse permission or attribution would need checking, and any literary-term definition or biographical/historical statement that may be inaccurate, so that later correction work keeps the source's original wording distinct from the corrected fact. Keep any drama, prose and poetry strands distinct without a target count.

## Exact input
- Attach standalone `LITERATURE.docx` or extract `SSS 1/2nd Term SS1_/LITERATURE.docx` from a supplied container. Member SHA-256: `a12244cb5312680610ab03f8d76aaaf285a0eebdf4fb618491d01e30584dd757`.
The full archive is optional. If Library access exists, retrieve SSS 1-20260507T072431Z-3-001 (1).zip there before asking for another upload; validate the member hash. Accept matching bytes regardless of filename. Do not require the full ZIP or assert its hash unless checked. Do not infer source headings from filenames. If inaccessible, state the exact missing member and checkpoint any independent work; never invent evidence.

## Permitted writes
- docs/ss1/work/microtasks/literature/QUEUE.json
- docs/ss1/work/microtasks/literature/LIT-INV-T2.md

No UI, JSS3, other subject, shared compiler/schema, runtime, production data or shared assignment-index changes. Existing packages are present: ignore historical prose saying otherwise. Preserve stable IDs and all unrelated entries.

## Implementation and completion
A short inventory record lists every week/section with exact labels and a hash-or-anchor locator, states what text/book/extract each section names (or that none is named), and the new indexing/visual items are appended with unique IDs, real dependencies (this item plus its registration) and PENDING status. No lesson, coverage entry or rule is written.

For INVENTORY: inspect this document and append bounded indexing/visual tasks with real locators; no lesson authoring or structural rule implementation. For INDEXING: implement supported coverage/rules under the existing schema within the named section; preserve source wording, distinguish markers from teaching, and record precise remaining gaps plus small follow-up items. Unsupported schema operations become an explicit blocker, not a silent skip or shared-schema change. Never discard teaching under a revision heading.

Use exact UTF-8 body hashes and unique source anchors where the contract requires them. Do not label citations as reuse permission. Keep approval PENDING without actual approval evidence and verification DEFERRED. A factual uncertainty can remain open without preventing honest implementation of established content.

Testing is deferred by the owner: do not run typechecks, unit suites, importer, database, device or full-corpus validation. Basic JSON parsing, hash calculation, checking references/IDs, and inspecting the diff are permitted authoring checks; report them as such, not tests. Do not install/run the application merely to produce a task note.

Update only this queue item to IMPLEMENTED_TESTING_DEFERRED when its completion condition is met, recording the exact evidence file; otherwise use BLOCKED with the precise reason. Recompute queue counts/status_counts from items. Do not mark the whole subject complete. Commit a concise evidence note with source hashes, locators, changes and remaining work. Never commit original documents, full private extracts, renders or credentials.

Commit and push your branch and open one PR to master. Do not merge other agents' PRs. If GitHub write access fails, finish the local implementation and deliver a binary-capable patch plus commit/base SHA and changed paths; do not ask for a pasted token. State exactly whether publication succeeded. Stop after this item; name the next eligible item without executing it.
