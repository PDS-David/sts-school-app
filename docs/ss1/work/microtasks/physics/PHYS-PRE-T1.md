# PHYS-PRE-T1 — Physics: 1st Term preamble inventory

Status: `IMPLEMENTED_TESTING_DEFERRED`. One task only; nothing was run (no schema parse, compiler/plan, test, typecheck, importer, database, device, migration, import or deployment). Base: master `4159336c7068d2235209221f5f14adc4986acec5` (fetched 2026-10-29; local HEAD equals `origin/master`). Open PRs at start: #188 (Government), #189 (Literature), #190 (Mathematics); none touches Physics.

## Inputs

- Archive `SSS 1-20260507T072431Z-3-001 (1).zip`, SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e` (verified).
- Member `SSS 1/1st Term SS1_/1ST TERM S1 PHYSICS.doc`, 8,479,232 bytes, SHA-256 `cb61f336ac93a3fbbb820d6c9b4adc0703e7363aff7659b7953a75bdb92f2206` (re-verified this task).
- Extraction: word-extractor 1.0.4 `getBody()` (the importer's own legacy `.doc` call, no rule application): 69,817 characters, 1,288 lines, 971 non-blank, LF-only line endings. Line 3 is a lone tab; lines 1-16 are otherwise blank.
- A legacy `.doc` body stream is all `getBody()` exposes: page headers/footers and footnotes were not available in this extraction and were not inventoried. Equation-recovery loss was not measured; the extract contains no equation objects.
- Line numbers below are 1-based lines of that extract. Block hashes are SHA-256 over the stated lines joined with `\n`, UTF-8, no trailing newline, leading/trailing blank lines trimmed. Lines keep their trailing spaces and tabs unless stated otherwise. `<TAB>` in quoted text marks a tab character.

## Non-week region (lines 1-40)

| Lines | Content | SHA-256 | Disposition |
| --- | --- | --- | --- |
| 1-16 | blank except line 3, a lone tab | — | separator (trimmed before hashing) |
| 17 | `FIRST TERM E-LEARNING NOTE` | `a85bde6fd6d2022b18ecfd09c17b8f7561ddecd2bfc198ba2c0bbdccb98ccb29` | `SS1-SRC-5c0149cda71d-R002` (SCHEME_ONLY) and `COV-PHYS-T1-TITLE` |
| 18 | blank | — | — |
| 19 | `SUBJECT: PHYSICS` + 8 tabs + 12 spaces + `CLASS: SS 1` | `7bd29fab80379ce82a02d5bbf22bfe83fc00b60f635a31e1380616ff619d38fd` | `COV-PHYS-T1-TITLE`; also the registered `header_text` and the anchor of the existing `SS1-SRC-5c0149cda71d-R001` alias |
| 20 | blank | — | — |
| 21 | `SCHEME OF WORK ` (one trailing space) | `9a1edea67fde0bc46713614fa571eb74549f90b179095fdf807589ea65c1badd` | `COV-PHYS-T1-TITLE` |
| 22 | blank | — | — |
| 23 | `WEEK<TAB>TOPICS` | `4dd89118d23a0e86029fca78c2f62a7cd887376cb87d09517465313d0466fd0f` | `COV-PHYS-T1-TITLE` |
| 17-23 | title, subject line and scheme heading | `ff33782b1b272afe24347702dd16fc2546d643763a662a068002381c7c0ddaa4` | `SS1-SRC-5c0149cda71d-R002` / `COV-PHYS-T1-TITLE` |
| 24-34 | eleven scheme rows (next table) | `30ced6e49564dacf976545cf2c495b9ed251d589252a5dbc2c26c37109417a3f` | scheme weeks 1-10 map to the `PHYS-WK-T1-*` items; week 11 (Revision) belongs to `PHYS-RULE-T1-REVISION-SCHEME` |
| 35 | blank | — | — |
| 36-38 | `REFERENCE BOOKS` and two titles | `dced20d64f822d9d06ced2c4000816c03743ac1cc536f9bb6fad7b9048009bcd` | `SS1-SRC-5c0149cda71d-R003` / `COV-PHYS-T1-REFERENCES` |
| 39-40 | blank | — | — |
| 1-40 | whole non-week region | `dfcf419b461a6b13b30b4965b301a5981f8b074422c8e2004af089dcf1c9745d` | accounted by `R002`, `R003` and the scheme-row mapping |
| before line 41 | `text.slice(0, index of "WEEK ONE")`, offset 916 | `7f060b51b9406b1bc2d0386a8b044bb64e277980d0dc1e7ba38c6957a72c8ede` | exact value the compiler's `PREAMBLE_REQUIRES_COVERAGE` detail will hold; computed by slicing, the importer was not run |

Lines 18, 20, 22, 35, 39 and 40 are blank separators. Line 41 is `WEEK ONE`, the first parsed body label.

## Scheme rows (lines 24-34) mapped to the week items

Topic text is quoted after the leading week number and tab; the line itself starts with the literal number (`1`, `2     `, `3.   ` … `10.  `, `11.  `), which is typed text, not Word auto-numbering. Line 24 and line 25 end with one trailing space and line 32 with five; hashes cover those spaces.

| Scheme week | Line | Hash of the line | Queue item | Topic text (verbatim) |
| --- | --- | --- | --- | --- |
| 1 | 24 | `107871e4a26a044a789c101b4fd1778fddfe046ce599b8cdcbee1f19fece62cc` | `PHYS-WK-T1-W01` | `Introduction to Physics; Familiarization of Physics Laboratory ` |
| 2 | 25 | `18bb82f110afd09fa9e504a5c737c6e3f57d2dd2d5a9e235d51e5e613a1849a3` | `PHYS-WK-T1-W02` | `Measurement of Mass, Weight, Length and Time; ` |
| 3 | 26 | `396e98becb6a81c3fac370f6e6251256b82108788b8cc17201d3482b273a964d` | `PHYS-WK-T1-W03` | `Motion in Nature, Force, Circular Motion, Centripetal and Centrifugal Forces` |
| 4 | 27 | `208bf1e7d18fe2a27d253e1e84fcc3a27e60a7ad1d232e85fd287d1704d80385` | `PHYS-WK-T1-W04` | `Frictions` (sic) |
| 5 | 28 | `7a22606ef1c59d10d50187287a47b6deff5311130d57f0344981dd6e0d869432` | `PHYS-WK-T1-W05-W06` | `Vector and Scalar Quantity, Distance/Displacement, Speed/Velocity, Acceleration, Distance/Displacement-Time Graph, Speed/Velocity-Time Graph, equations of uniformly acceleration` (sic) |
| 6 | 29 | `97b069349434e63bb66e307b2758c3a47b46576d813bc9cec2fa102618e6f22d` | `PHYS-WK-T1-W05-W06` (shared parsed row) | `Calculations on velocity-time graph.` |
| 7 | 30 | `1a67dd5c67d77c498374741a0e1430c46faa23bb22cd84b9e77d0368b2e9bcc2` | `PHYS-WK-T1-W06` | `Density and Relative Density` |
| 8 | 31 | `3f2a44dc6bcd0b71f554ff8033fe500edac48b8db4786872ca7c7ce169a83e5d` | `PHYS-WK-T1-W07` | `Upthrust, Archimedes Principle, Law of floatation, Pressure` (sic) |
| 9 | 32 | `8f5dd1dc3648d4eb4bc7da624ec32c22189f7532ff594a319ebd4690723a40a5` | `PHYS-WK-T1-W08` | `Work, Energy and power. Work Done in a Force Field, Types of Energy and Energy Conversion.     ` |
| 10 | 33 | `750020fd5400f2ae994b996c6685c497b40350b0eb8e142194dbfbf1234b04e0` | `PHYS-WK-T1-W09` | `Viscosity` |
| 11 | 34 | `8f045eb8ee1a46d1552147f1ca773c0cd6726709ab0ca6a309507c58072b6ef4` | none — `PHYS-RULE-T1-REVISION-SCHEME` | `Revision` |

The existing queue item IDs are offset after the combined week: `PHYS-WK-T1-W06`, `W07`, `W08` and `W09` are the items for WEEK SEVEN, WEEK 8, WEEK 9 and WEEK TEN respectively (each item's `week_or_locator` and objective name its week). The IDs are not renamed here because `PHYS-SCOPE-AUTHORING-FINISH` depends on all four; the mismatch is recorded as a finding. No lesson task is appended: the scheme rows name per-week objectives that the `PHYS-WK-T1-*` items already own.

## Scheme weeks with no parsed row (explicit)

- The scheme has **11 rows**; `docs/ss1/work/SS1-03/evidence/parsed_rows.json` has **9 T1 rows** (index 0-8) with body labels at extract offsets: `WEEK ONE` 41, `WEEK TWO` 194, `WEEK THREE` 343, `WEEK FOUR` 454, `WEEK FIVE AND SIX` 590, `WEEK SEVEN` 882, `WEEK 8` 986, `WEEK 9` 1095, `WEEK TEN` 1208. The last non-blank line is 1287 (`NB: ...`), so no text follows the last parsed body.
- **Scheme week 11 (Revision, line 34) has no parsed row and no teaching body.** It is the only scheme week without a parsed row. It is assigned to `PHYS-RULE-T1-REVISION-SCHEME`, which depends on this task and must either bind it to a SCHEME_ONLY rule with a unique anchor or record with evidence that no rule is possible.
- **Scheme weeks 5 and 6 share one parsed row.** The parsed body is labelled `WEEK FIVE AND SIX` (line 590) and contains the teaching for both; there is no separate `WEEK SIX` heading. Week 6's scheme text (`Calculations on velocity-time graph.`, line 29) therefore has a body inside that merged row, not a row of its own.
- Nine parsed bodies for eleven scheme rows, not ten or eleven. All nine parsed bodies are teaching content; none is a marker, and no examination or revision body is invented.

## Reference-book list (lines 36-38)

- Block hash `dced20d64f822d9d06ced2c4000816c03743ac1cc536f9bb6fad7b9048009bcd`. Heading is `REFERENCE BOOKS` (no doubled space, unlike the Mathematics source). Line 37 ends with one space, kept verbatim in the anchor.
- New `SS1-SRC-5c0149cda71d-R003` (classify_marker, kind `SCHEME_ONLY`) uses the exact 104-character anchor of lines 36-38; it occurs exactly once and matches no parsed row. New `COV-PHYS-T1-REFERENCES` (MARKER) maps it.
- Titles verbatim: `New School Physics. By Prof. M.W Anyakoha`; `New System Physics. By Dr. Charles Chow et.al`. No edition, publisher or year is stated in the source, and none is added.

## Title and scheme header (lines 17-23)

- New `SS1-SRC-5c0149cda71d-R002` (classify_marker, kind `SCHEME_ONLY`) anchors on line 17 `FIRST TERM E-LEARNING NOTE` (26 characters). The anchor occurs exactly once and matches no parsed row.
- New `COV-PHYS-T1-TITLE` (MARKER) records line 17 `a85bde6f…`, line 19 `7bd29fab…`, line 21 `9a1edea6…`, line 23 `4dd89118…`, lines 17-23 `ff33782b…` and the pre-body slice `7f060b51…`.
- Line 19 is both the registered `header_text` (verified under `PHYS-SRC-T1`) and the anchor of the existing alias rule `-R001`; `-R002` anchors on the line above, so the two rules cannot bind the same text.
- The scheme numbers are literal text with inconsistent separators (`1`, `2     `, `3.   ` … `10.  `, `11.  `), unlike the Mathematics source's auto-numbered list. They are preserved as typed.

## Package changes

`backend/src/db/ss1/subjects/physics.json` only:

- Added `SS1-SRC-5c0149cda71d-R002` and `-R003` (both `classify_marker` / `SCHEME_ONLY`), inserted after the T1 alias rule; source rules 3 → 5.
- Added `COV-PHYS-T1-TITLE` and `COV-PHYS-T1-REFERENCES` (both `MARKER`); coverage 0 → 2.
- Unchanged: 3 sources, 0 lessons, 0 delivery corrections, 0 assets, 3 open items, `package_status` `PENDING`; all 2nd/3rd Term rules untouched.
- Consequence recorded honestly: T2 and T3 still have no coverage, so a compiler plan would still report `SOURCE_WITHOUT_COVERAGE` for them; `PHYS-PRE-T2`/`T3` own that work. The three open alias items still block delivery (pre-existing, owner action).

`docs/ss1/work/microtasks/physics/QUEUE.json`: `PHYS-PRE-T1` set to `IMPLEMENTED_TESTING_DEFERRED` with this evidence and `week_or_locator` pinned to extracted lines 1-40; `status_counts` now 4 implemented / 55 pending / 7 blocked (66 total); `review` date 2026-10-29 and master SHA updated; `next_runnable` is `PHYS-RULE-T1-REVISION-SCHEME`; `runnable_now` recomputed to the 45 pending items whose dependencies are implemented. A note records the change; notes 1-7 remain the queue-generation snapshot.

## Validation performed

- `JSON.parse` on both changed JSON files; both round-trip byte-for-byte at 2-space indentation with CRLF line endings.
- Rule IDs unique (5) and coverage IDs unique (2); each 1st Term `classify_marker` anchor occurs exactly once in the raw extract (plain string count, not the importer) and is absent from lines 41 onward, so no parsed body can bind it.
- Every `MARKER` target is a `SCHEME_ONLY` rule whose anchor matches no parsed row, so the compiler would emit its `SCHEME_ONLY` disposition; coverage lesson lists and evidence are non-empty.
- The registered `header_text` still occurs exactly once; the first-body offset (916) equals the recorded pre-body slice length; scheme line and block hashes were recomputed from the extract.
- The nine parsed bodies were re-sliced from the extract with the parser's own `WEEK_MARKER` pattern and `.trim()` (plain string slicing, the importer was not run): all nine SHA-256 values equal `parsed_rows.json`, and the first body starts at offset 916, so `sha256(text.slice(0, 916))` is exactly the compiler's `PREAMBLE_REQUIRES_COVERAGE` detail.
- Diff reviewed; only the three allowed paths are touched.

Not run (deferred by owner): zod schema parse, compiler/plan, tests/typechecks, importer, database/device checks, migration, import, deployment.

## Findings for later work

- Queue ID numbering is offset after the merged item: `PHYS-WK-T1-W06`..`W09` label WEEK SEVEN..WEEK TEN. Recorded, not renamed (dependents exist).
- Scheme week 11 has no body and no parsed row; `PHYS-RULE-T1-REVISION-SCHEME` owns binding or evidence-based rejection.
- Scheme weeks 5-6 are one parsed body; both scheme objectives live there.
- Source wording is quoted, not corrected: `Frictions` (scheme week 4), `equations of uniformly acceleration` (week 5), `Law of floatation` (week 8), the `2     ` separator and trailing spaces on lines 24, 25 and 32.
- The scheme orders week 8 as `Upthrust, Archimedes Principle, Law of floatation, Pressure` while the parsed WEEK 8 objective title starts with `Pressure`; both are quoted as found and nothing is reordered.
- Legacy `.doc` extraction exposes the body only; page furniture and footnotes are not recoverable through `getBody()`, and equation loss is unmeasured (already flagged for Physics in the queue).
- Marker bodies are retained; nothing is discarded, and no revision/examination lesson is invented.
- The preamble will still surface as `PREAMBLE_REQUIRES_COVERAGE` in a compiler plan; the recorded slice hash `7f060b51…` lets a later run check it without guessing.

## Remaining

`PHYS-PRE-T1` is complete with testing deferred. Next runnable: `PHYS-RULE-T1-REVISION-SCHEME`. Still open in this queue: `PHYS-PRE-T2`/`T3`, 29 `SOURCE_WEEK_INDEXING` items (including the 9 T1 items), 2 `SOURCE_RULE`, 2 `OWNER_APPROVAL`, 2 `OWNER_DECISION`, 4 `FACTUAL_DEPENDENCY`, 3 `VISUAL_DISPOSITION`, 13 `BRANCH_PORT`, 2 `BRANCH_COMPARISON`, 1 `SCOPE_DECOMPOSITION` and 2 `TEST` items. Seven items are `BLOCKED`: `PHYS-OWNER-ALIAS-T3`, `PHYS-OWNER-REVISION-PLAN`, `PHYS-OWNER-EXTRACTION-STRATEGY`, `PHYS-APPROVAL-CONTENT`, `PHYS-TEST-PACKAGE-NEW`, `PHYS-CMP-D4-TESTS`, `PHYS-TEST-FULL-SOURCE-REGRESSION`. No subject or class completion is claimed.
