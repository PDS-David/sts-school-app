# GEO-PRE-T1 — Geography First Term preamble and scheme indexing

Status: IN_PROGRESS. Content approval remains pending; verification is not complete.

## Source evidence
- Source ID: SS1-SRC-1c1c1bdcecb4
- Source: SSS 1/1st Term SS1_/1ST TERM S1 GEOGRAPHY.doc
- Member SHA-256: 4220757cb96c6d6ac5153f7a862b45725a7d87c8e64be5b11ec39a843ca1491c (1,163,776 bytes), verified in GEO-INV-T1.md against the composite archive SHA-256 024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e.
- Text locator convention: 1-based word-extractor 1.0.4 getBody() lines; range hashes are SHA-256 over lines joined with LF, UTF-8.
- Identity block lines 18-19 SHA-256 b4bda78d8bcc62f32bf49f1faf55a1b47a57fd530b8401d064053c266ec74372. Line 19 equals the registered header_text exactly and occurs once.
- Scheme block lines 21-37 SHA-256 3cee63d55e00222de2a7520b1e078e8f0b51ea4ab0d6e159f7313ea246c0d032; scheme rows lines 23-37 SHA-256 bf7374729b4b8a317a0cd991497ec32d8f29e5233ab41301707033e1ac135611.
- Reference entry line 40 SHA-256 af634813ec13a3bece122248b9baf7c6ef8bea0f597f6ba596c323de4a9cb16a.

## Scheme-to-body mapping

| Row | Scheme wording | Line(s) | Bound body | Body SHA-256 |
|---|---|---:|---|---|
| 1 | Introduction to Geography: Meaning, Nature, Scope and Value of Geography. | 24 | WEEK ONE, 43-89 | 52f0cbe7b5b1c8c618b747159993961a1d1c96e2c2f6560a88ac156192e11aa5 |
| 2 | The Solar System: The Universe, The Planets, The Earth. | 25 | WEEK TWO, 92-180 | 2a30150d4cb0d3991540598cfe3ee7437dbd35a2f7692b041e10cb4911e98603 |
| 3 | The Earth as a Planet; Shape and Size of the Earth, Proof of the Earth’s Sphericity. The Movement of the Earth: Rotation & Revolution. | 26-27 | WEEK THREE, 183-268 | 5bbc2357e24a5ef6139bc99bc1351c119dc4f7188345e35c5f12bf001a452d25 |
| 4 | Latitude and Longitude: Definition, Uses, Similarities & Differences, Great and Small Circles. | 28-29 | WEEK FOUR, 271-349 | f4dcfa072ca8e066e081d015463d1f147bd5f61fdd7c54d311c5284e0d44ea64 |
| 5 | Latitude and Longitude: Standard Time Zone, Calculation of Distances, Local Time, International Date Line (IDL). | 30-31 | WEEK FIVE, 352-413 | aaf418295fc5be4a720a35f23d1a45efb9bed91b3319ee1a2ae3e56141dbde17 |
| 6 | The Structure of the Earth: The Outer Zone. | 32 | WEEK SIX, 416-492 | 3463c9b15cac38935748f50afe5be4eb28595f45901afa1bb3f0dea9a997ca70 |
| 7 | The Structure of the Earth: The Interior Zone. | 33 | WEEK SEVEN, 495-537 | b35a7a8bd9a2bd1c71d08933e7cba684d9865e12c69fa52a985ddc14e395aee7 |
| 8 | Rocks of the Earth: Types and Characteristics. | 34 | WEEK EIGHT, 540-604 | d09e611390ae4688a763220f81b050507e313dc45735a92e9e39c53ef5df7e8f |
| 9 | Basic Concept of Geographic Information System (GIS). | 35 | WEEK NINE, 607-636 | ede7fe0e59c1fb969cb80844d5c87954546007346d762f4812110f37ff678b3e |
| 10 | Major Land Form Features: Types of Land Forms, Mountain. | 36 | WEEK TEN, 639-707 | 5b6c935769ac6e9fee6360e672ac636c6d18beeaefaf0e38a27b5655e7724080 |
| 11 | Revision. | 37 | No body row | Scheme-only marker |

Rows 1–3 have no printed numerals. Their binding to Weeks One–Three follows their order in the scheme and the explicit body labels. Rows 4–10 have numerals. There is no examination row and no Week Eleven body. Row 11 is represented as a MARKER coverage entry and a source-bound WHOLE_LINE SCHEME_ONLY rule; it does not create a teaching week.

## Reference list
The reference section is lines 39-40. It names Essential Geography for Senior Secondary Schools by O.A. Iwena. The book was not supplied or consulted. Week One's reading pointer at line 78 says pages 1-2, but the pages and their contents are unverified. The reference coverage remains UNRESOLVED and existing fact-check/permission gates remain open.

## Implementation
- Added source identity coverage for lines 18-19.
- Added ten scheme-to-body coverage mappings. Row 1 is PARTIAL because the scheme includes Nature, which the Week One body does not teach; rows 2-10 remain UNRESOLVED pending their week-specific objective indexing.
- Added row 11 as MARKER and the exact source-bound classify_marker rule with anchor Revision. and WHOLE_LINE matching.
- Added the reference-list coverage as UNRESOLVED; no textbook content or reuse permission is inferred.
- Preserved all existing objective coverage and open items, including the unresolved Nature, state-capital and answer-key gaps.

## Validation and limits
- Parsed the pre-change package and queue as JSON; checked all new coverage/rule IDs for uniqueness; confirmed each new body identifier is source-bound to the inventory's exact week hash.
- Recomputed queue status counts for the one task transition and removed only GEO-PRE-T1 from next_runnable.
- Tests, TypeScript, importer/compiler, database and device checks were not run; owner protocol defers these gates. No approval or verification is claimed.

## Checkpoint
- Task: GEO-PRE-T1
- Status: IMPLEMENTED_TESTING_DEFERRED
- Changed files: backend/src/db/ss1/subjects/geography.json, docs/ss1/work/microtasks/geography/QUEUE.json, docs/ss1/work/microtasks/geography/GEO-PRE-T1.md.
- Next eligible item: GEO-MARK-T1, subject to current-master refresh and branch-ownership check.

## Compiler validation correction
- PR #693 check run 131950210888 failed in the registered-subject compiler at the scheme-only marker rule: the loader could not match the whole-line anchor "Revision.".
- The inventory's visible source token remains "Revision." at scheme line 37. The rule now uses the exact visible substring "Revision" with SUBSTRING matching; compiler uniqueness validation is retained. This is not a fabricated approval or a relaxation of uniqueness.
- Task status is IN_PROGRESS until the compiler workflow is rerun and passes. If it still fails, the rule will remain unverified and be revised from actual source evidence.
