# LIT-PRE-T1 — Literature: 1st Term preamble and scheme

Status: `IMPLEMENTED_TESTING_DEFERRED`. One task only; nothing was run (no schema parse, compiler/plan, importer, test, typecheck, database or device). Base: master `4bdb581` (fetched 2026-10-30). Open PRs at start: #251 (Physics); none touches Literature.

## Inputs
- Member `LIT. IN ENGLISH.docx`, SHA-256 `732deed1d3e0c4e3c2218cde0d2e3fce1678f39c8730633b20af9fdc4d602dea` (re-verified from the supplied partial archive `1st_Term_SS1_-20230730T171406Z-001.zip`; composite hash not checked).
- mammoth 1.12.2 `extractRawText`: 609 lines. Line numbers are 1-based; hashes are SHA-256 of the stated lines joined with `\n`, UTF-8, edge blank lines trimmed.

## Preamble (lines 1-6)
- Line 1 `LIT-IN-ENGLISH` `b938ac4ead0d8bdb6d4b2e83012aabc7259e2341eddd8ff35e9924415ef7199e`; line 3 `SCHEME OF WORK FOR LITERATURE-IN-ENGLISH, SS1 CLASS ` (trailing space) `ab61972eb72894694b63c0bd8c0b8b2deabd42eee07fc56735a7f05bc9eeb47e`; lines 1-3 `7ed027225877f6e1512d601bb0ff744494ebe64b279ea8e3f1a6d18ea4a2006d`; text before the first parsed row (line 7, offset 72) `fec129311ed1d9d38c17f41fcfb738eb0569a1ca3e25a4ee240dd173a27c3b68` (the compiler's `PREAMBLE_REQUIRES_COVERAGE` detail, computed by slicing).
- Rule `-R002` (SCHEME_ONLY) anchors on line 1; line 3 stays the registered header_text and the anchor of alias `-R001`. Coverage `COV-LIT-T1-TITLE` (MARKER).

## Scheme rows (lines 7-23)
Block SHA-256 `9b3c5dbd7a64cc0808c0bfcce734295b3b07d7ba4edffc7d4c68210e67943b03` (equals the queue value). Each row begins `WEEK n`, so each is its own parsed row (re-sliced with the importer's `WEEK_MARKER` pattern: 18 rows, the nine scheme rows at lines 7-23 and nine body rows from line 37). Each row has one SCHEME_ONLY rule `-R003`..`-R011` whose anchor is the whole row text, occurring once and only in its own row.

| Row | Line | Text (verbatim) | Row body SHA-256 | Item | Body lines |
| --- | --- | --- | --- | --- | --- |
| 1 | 7 | `WEEK 1:INTRODUCTION TO THE STUDY OF LITERATURE` | `c378ffb2cfeb1e2d8ddecb5c3b56e6c61c84a53cffeff5d74c3f6349bfc85a3f` | `LIT-WK-T1-W01` | 37-99 |
| 2 | 9 | `WEEK 2: GENRES OF LITERATURE-DRAMA,PROSE AND POETRY` | `1590c09f1c73346aca15559716267d35b7abd1d92afd9c3106af6b9268c60e3b` | `LIT-WK-T1-W02` | 107-181 |
| 3 | 11 | `WEEK 3: FICTION AND NON FICTION` | `f6202f0dc32606d4ba8294a5bf26930b5b3c874a26c4532ea09ff3da5d0f9f8f` | `LIT-WK-T1-W03` | 187-243 |
| 4 | 13 | `WEEK 4: ELEMENT OF PROSE FICTION-PLOT,SETTING, NARRATIVE TECHNIQUE` | `d6a66d3bddba8548419231e36ca88906dc26f7c51c9d62a4e7eb82d19aa5dd5e` | `LIT-WK-T1-W04` | 249-283 |
| 5 | 15 | `WEEK 5&6: WHAT IS PROSE? TYPES OF PROSE` | `09dba8da0f7a954eeb087c770fb0f00c0fde93c4694f5b0ce965523dfebc1a1f` | `LIT-WK-T1-W05-W06` | 289-369 |
| 6 | 17 | `WEEK 7: WHAT IS POETRY? FEATURES OF   POETRY.` | `5d84364af526751416d36a0a2ed12a14135d06c5505e5b1b0d6f34004bc55196` | `LIT-WK-T1-W07` | 377-429 |
| 7 | 19 | `WEEK 8: DIFFERENT FORMS OF POETRY AND TYPES OF POETRY` | `afd5b6f2689a836829f18103b2716b0a49f41114d58877291d91af9873a88cd0` | `LIT-WK-T1-W08` | 437-465 |
| 8 | 21 | `WEEK 9: WHAT IS DRAMA? FEATURES OF DRAMA.` | `1fb1aee72950db15ac15f2c94ad2ff32365882adcbae572afa3f75bdc84a54cf` | `LIT-WK-T1-W09` | 471-569 |
| 9 | 23 | `WEEK 10: ORAL FORMS OF LITERATURE.` | `13ee029ceb7c39aa29b397a9fc67959d00b28b9427de2eca2d8c087e54da86c5` | `LIT-WK-T1-W10` | 575-603 |

Coverage `COV-LIT-T1-SCHEME` (MARKER) lists the nine row IDs. Row 5 packs two weeks and points at `LIT-WK-T1-W05-W06`. There is no revision or examination row and no week 11.

## Divergences recorded, not harmonised
- row 1 (line 7) has no space after the colon
- row 2 (line 9) says `GENRES OF LITERATURE-DRAMA,PROSE AND POETRY` while the body heading (line 111) says `GENRE OF LITERATURE – PROSE, POETRY AND DRAMA`
- row 4 (line 13) says `ELEMENT OF PROSE FICTION-PLOT,SETTING, NARRATIVE TECHNIQUE` while the body heading (line 253) says `ELEMENT OF PROSE`
- row 6 (line 17) has `FEATURES OF   POETRY.` (three spaces) while the body says `Characteristics of poetry` (line 393)
- row 8 (line 21) says `FEATURES OF DRAMA.` while the body says `Features of Drama` (line 481)
- row 9 (line 23) says `ORAL FORMS OF LITERATURE.` while the body heading (line 579) says `ORAL TRADITION OF LITERATURE`

## Findings
- The queue's earlier block 1-3 hash `e4939af2…` could not be reproduced under the stated convention (computed `7ed027225877f6e1512d601bb0ff744494ebe64b279ea8e3f1a6d18ea4a2006d`, and no trailing-space variant matched); the other queue hashes used here (scheme block) reproduced. Flagged, not adjudicated.
- Rules are one per scheme row because each row is a parsed row and a marker rule must bind exactly one row. Coverage binds MARKER entries to the row IDs because the week items (`LIT-WK-T1-*`) own the teaching rows and are still PENDING.
- No set text is named or supplied in this region; nothing was copied or invented.

## Validation (authoring checks only)
JSON parse and byte round trip of both changed files; rule and coverage IDs unique; each anchor occurs once in the extract and in one parsed row; coverage targets resolve to rule/row IDs; queue IDs unique; diff limited to the three allowed paths. Not run: zod parse, compiler/plan, importer, tests, typecheck, database, device.

## Remaining
Next eligible: `LIT-MARK-T1`. The three alias open items still block delivery. No subject or class completion is claimed.
