# CC-IDX-T2-W01 Catering Craft

Execute only CC-IDX-T2-W01 in PDS-David/sts-school-app. Reviewed master: 9f745bb896f2a2430269fdc491ad2eaf74874513 on 30 October 2026.

Fetch current master, read applicable AGENTS.md, and inspect open PRs. Create an isolated branch. Re-read this task's current QUEUE.json record. If it is now implemented, cite that evidence and stop; do not repeat it or pick another task without assignment. If another PR owns this subject/package, coordinate or wait rather than overwrite it. This is one small task, not completion of the whole subject.

## Read
- docs/ss1/work/microtasks/catering-craft/QUEUE.json
- docs/ss1/contracts/CONTRACT.md
- backend/src/db/ss1/subjectPackageSchema.ts
- backend/src/db/ss1/compiler.ts
- backend/src/db/ss1/subjects/catering-craft.json
- docs/ss1/work/microtasks/catering-craft/CC-INV-T2.md

## Scope
Type: SOURCE_WEEK_INDEXING
Term and locator: 2nd Term / WEEK ONE / TOPIC: FOOD COMMODITIES / getBody lines 26-223 / sha256 364cab63782211430375a9bb7bc524e31cffb050f98dbae6fce6cb893b254c70
Dependencies: CC-INV-T2, CC-SRC-T2. Check their committed implementation evidence; testing deferred is not verified.

Index WEEK ONE (TOPIC: FOOD COMMODITIES): record its sections, evaluation/reading/weekend-assignment/theory blocks and objective candidates by line number against the locator, and add this week's source-coverage index entry to the package only where the contract allows. Contains a 10-row Animal Source/Name table (lines 57-66), meat/poultry/game preparation, preservation and storage passages and a week-closing assignment block. Locator: word-extractor 1.0.4 extract(path).getBody() of the verified member; text split on "\n"; line numbers 1-based; range ends at last non-blank line before the next marker; sha256 over the UTF-8 lines joined with "\n". Full getBody() SHA-256 371aa91970bceb96c354a002a3ac7a5384ca597c1c2f404f51f13096b7324c8a. Preserve the source's original wording exactly; do not author lessons, coverage, rules, corrections or answers here beyond what this one item names. No tests, importer, database or device runs (testing deferred by owner).

## Exact input
- Attach standalone `2ND TERM S1 CATERING CRAFT PRACTICES.doc` or extract `SSS 1/2nd Term SS1_/2ND TERM S1 CATERING CRAFT PRACTICES.doc` from a supplied container. Member SHA-256: `fd8115ff99dd3c370b86b4b5a326fe647e49328bc83f2d041c73f29b1b84ad59`.
The full archive is optional. If Library access exists, retrieve SSS 1-20260507T072431Z-3-001 (1).zip there before asking for another upload; validate the member hash. Accept matching bytes regardless of filename. Do not require the full ZIP or assert its hash unless checked. Do not infer source headings from filenames. If inaccessible, state the exact missing member and checkpoint any independent work; never invent evidence.

## Permitted writes
- backend/src/db/ss1/subjects/catering-craft.json
- docs/ss1/work/microtasks/catering-craft/QUEUE.json
- docs/ss1/work/microtasks/catering-craft/CC-IDX-T2-W01.md

No UI, JSS3, other subject, shared compiler/schema, runtime, production data or shared assignment-index changes. Existing packages are present: ignore historical prose saying otherwise. Preserve stable IDs and all unrelated entries.

## Implementation and completion
The week's sections and assignment blocks are listed with line locators matching sha256 364cab63782211430375a9bb7bc524e31cffb050f98dbae6fce6cb893b254c70; no lesson body is discarded; no coverage is claimed beyond what is indexed; package stays PENDING.

For INVENTORY: inspect this document and append bounded indexing/visual tasks with real locators; no lesson authoring or structural rule implementation. For INDEXING: implement supported coverage/rules under the existing schema within the named section; preserve source wording, distinguish markers from teaching, and record precise remaining gaps plus small follow-up items. Unsupported schema operations become an explicit blocker, not a silent skip or shared-schema change. Never discard teaching under a revision heading.

Use exact UTF-8 body hashes and unique source anchors where the contract requires them. Do not label citations as reuse permission. Keep approval PENDING without actual approval evidence and verification DEFERRED. A factual uncertainty can remain open without preventing honest implementation of established content.

Testing is deferred by the owner: do not run typechecks, unit suites, importer, database, device or full-corpus validation. Basic JSON parsing, hash calculation, checking references/IDs, and inspecting the diff are permitted authoring checks; report them as such, not tests. Do not install/run the application merely to produce a task note.

Update only this queue item to IMPLEMENTED_TESTING_DEFERRED when its completion condition is met, recording the exact evidence file; otherwise use BLOCKED with the precise reason. Recompute queue counts/status_counts from items. Do not mark the whole subject complete. Commit a concise evidence note with source hashes, locators, changes and remaining work. Never commit original documents, full private extracts, renders or credentials.

Commit and push your branch and open one PR to master. Do not merge other agents' PRs. If GitHub write access fails, finish the local implementation and deliver a binary-capable patch plus commit/base SHA and changed paths; do not ask for a pasted token. State exactly whether publication succeeded. Stop after this item; name the next eligible item without executing it.
