# PHYS-PRE-T2 — Physics: 2nd Term preamble inventory

Status: `IMPLEMENTED_TESTING_DEFERRED`. One task only; nothing was run (no schema parse, compiler/plan, test, typecheck, importer, database, device, migration, import or deployment). Base: master `e60b1fe7ac28c2fd94841cd67a2f3622b42f09f9` (fetched 2026-10-30; local HEAD equals `origin/master`). Open PRs at start: none.

## Inputs

- Source copy: standalone `2nd Term SS1 /2ND TERM S1 PHYSICS.doc` from the supplied partial archive `2nd_Term_SS1_-20230730T171417Z-001.zip`; the member `SSS 1/2nd Term SS1_/2ND TERM S1 PHYSICS.doc` hash was matched against it: 466,432 bytes, SHA-256 `3941deccd3f4c68065a496ede3752784d2535e3c03608450a12b2a7c4a0b9fa7` (equals the task's Member SHA-256 and the registered source). The composite archive hash `024487129a86…` was not checked.
- Extraction: word-extractor 1.0.4 `getBody()` (the importer's legacy `.doc` call, no rule application): 39,284 characters, 750 lines, 569 non-blank, LF-only.
- A legacy `.doc` body stream is all `getBody()` exposes: page headers/footers and footnotes were not inventoried; equation loss was not measured.
- Line numbers are 1-based lines of that extract. Block hashes are SHA-256 over the stated lines joined with `\n`, UTF-8, edge blank lines trimmed.

## Non-week region (lines 1-23)

| Lines | Content | SHA-256 | Disposition |
| --- | --- | --- | --- |
| 1 | `SECOND TERM E-LEARNING NOTE` | `c3a8dc39c250fd530499bc2d27d4d50ed829835a1e586e85165d2d16dad0edd9` | `SS1-SRC-2c924c964660-R002` (SCHEME_ONLY) and `COV-PHYS-T2-TITLE` |
| 3 | `SUBJECT:  PHYSICS` + tabs/spaces + `CLASS: SS 1` | `0af0e588285c1f96b726f3452960f957292bae0e709b313f2e57133e75fc89c3` | `COV-PHYS-T2-TITLE`; also the registered `header_text` and anchor of existing alias `-R001` |
| 5 | `SCHEME OF WORK ` (one trailing space) | `9a1edea67fde0bc46713614fa571eb74549f90b179095fdf807589ea65c1badd` | `COV-PHYS-T2-TITLE` |
| 7 | `WEEK` + 13 spaces + `TOPIC` | `c09d3f0079f8525eaf2ac0acf598d26d4bd3fecea8f4f19b32a60579be22e910` | `COV-PHYS-T2-TITLE` |
| 1-7 | title, subject line, scheme heading | `1788510fd400cc6bcc3248268c52b6b4ec87b00bda963bb5b815d48ea4c5cbb3` | `-R002` / `COV-PHYS-T2-TITLE` |
| 8-17 | ten scheme rows (next table) | `ac6f7082c378add615d1c5cd0ec6accb5dc4e22621455e22baa7b4b3770f828f` | mapped to `PHYS-WK-T2-W01..W10` |
| 19-21 | `REFERENCE BOOK` and two titles | `91493c91b29b7ba7402d3a3c1c8299fcac404b27ee417dee4fb0bfa3c86c8560` | `-R003` / `COV-PHYS-T2-REFERENCES` |
| before line 24 | `text.slice(0, index of "WEEK ONE")`, offset 958 | `c4096b4540e348f01df78a6bc9eb5b92d2035fc171c91b0634bb5c55cb0c2358` | exact value of the compiler's `PREAMBLE_REQUIRES_COVERAGE` detail; computed by slicing, importer not run |

Lines 2, 4, 6, 18, 22 and 23 are blank separators. Line 24 is `WEEK ONE`, the first parsed body label.

## Scheme rows (lines 8-17) mapped to the week items

The scheme rows carry no typed week numbers (unlike the 1st Term scheme), so rows map to bodies by order. No scheme line has trailing whitespace.

| Row | Line | Hash of the line | Queue item | Scheme topic (verbatim) | Parsed body |
| --- | --- | --- | --- | --- | --- |
| 1 | 8 | `f33016dd94ea7e677946308e1b62100a75284a85a889bf9532e65c5da0aec02b` | `PHYS-WK-T2-W01` | `Heat Energy, Concept of Heat and Temperature, Effects of Heat and Uses` | `WEEK ONE` (line 24) |
| 2 | 9 | `9b0adf35f675f40a564d599c70ceffd85b4e1b97390031aa8bfb047c749dff90` | `PHYS-WK-T2-W02` | `Thermometer and Its Type, Evaporation and Boiling` | `WEEK TWO` (line 70) |
| 3 | 10 | `c9ace27138e6f4907e6c5598939bdc20d3570777094d2107b7348a78fbe67a76` | `PHYS-WK-T2-W03` | `Expansion of Solid, Effect and Applications of Expansion` | `WEEK THREE` (line 180) |
| 4 | 11 | `83b1304ece2af0f79af9840a8c5d01a4bac76613370ed7c4b7af7c5b6aeba465` | `PHYS-WK-T2-W04` | `Expansivity and Its Application - Linear, Area and Volume. Anomalous Expansion of Water. Real and Apparent Expansivity` | `WEEK FOUR` (line 231) |
| 5 | 12 | `00dd86225f06a7814cf735753f3d67d3b4a592f959ebf372da95206bc6bfe28b` | `PHYS-WK-T2-W05` | `Heat Transfer - Conduction, Convection, Radiation and Their Applications` | `WEEK FIVE` (line 324) |
| 6 | 13 | `34c1eac62d4be034d420cc49163461d9e7320aa17e6a57c3b9fbfa2600fb2d97` | `PHYS-WK-T2-W06` | `Electric Charges - Production, Types, Distribution and Storage` | `WEEK SIX` (line 424) |
| 7 | 14 | `d717ccdc1611897d9aa1c89b210a0cf192d3761cd4621f49359ebdb686e9c87c` | `PHYS-WK-T2-W07` | `Gold Leaf Electroscope and its Uses. Lighting and Lighting Conductor` | `WEEK SEVEN` (line 488) |
| 8 | 15 | `aa958410e6f7476536eaea7a2ecb60111ba0b3ba46fefe90c0ae6b69467d5872` | `PHYS-WK-T2-W08` | `Fields - Concept and Types of Field. Gravitational and Magnetic Field, Force of Gravity` | `WEEK 8` (line 560) |
| 9 | 16 | `cc905ca9972c07fafc213c54282a465ba32ef76aed54921ebdab56d47f71972a` | `PHYS-WK-T2-W09` | `Electric Field - Line of Forces, Properties of Line of Force, Description and Properties of Force Field` | `WEEK NINE` (line 626) |
| 10 | 17 | `f9e30ac1607382baeaac4c0356129eab888a5efc9eb5053077ff9832aa106e5e` | `PHYS-WK-T2-W10` | `Production of Continuous Electric Current` | `WEEK TEN` (line 705) |

## Scheme weeks with no parsed body (explicit)

None. The scheme has **10 rows** and `docs/ss1/work/SS1-03/evidence/parsed_rows.json` has **10 parsed rows** for this source (index 0-9). I re-sliced the extract with the importer's `WEEK_MARKER` pattern and `.trim()` (plain string slicing, importer not run): 10 matches, and all ten SHA-256 values equal `parsed_rows.json`. `WEEKEND ASSIGNMENT` lines do not match the pattern. There is **no revision row, no examination row and no week 11** in the scheme or the body; a case-insensitive search found no `revision` and no `exam` other than `Examples` (lines 448-449). Nothing was invented for them. No text follows the last body (the last non-blank line is the final week-ten assignment question).

## Reference-book list (lines 19-21)

`REFERENCE BOOK` (singular, unlike the 1st Term `REFERENCE BOOKS`), `New School Physics By M.W Anyakoha`, `Senior Secondary School Physics By P.N Okeke`. No edition, publisher or year is stated and none is added. These titles differ from the 1st Term list; recorded, not reconciled.

## Package changes

`backend/src/db/ss1/subjects/physics.json` only: added `SS1-SRC-2c924c964660-R002` and `-R003` (both `classify_marker` / `SCHEME_ONLY`, anchors unique, before the first body, no parsed row); source rules 5 → 7. Added `COV-PHYS-T2-TITLE` and `COV-PHYS-T2-REFERENCES` (both `MARKER`); coverage 2 → 4. The three alias open items are unchanged.

`docs/ss1/work/microtasks/physics/QUEUE.json`: `PHYS-PRE-T2` set to `IMPLEMENTED_TESTING_DEFERRED` with this evidence; counts recomputed; `runnable_now` recomputed; a note added. `next_runnable` is unchanged.

## Validation performed (authoring checks only)

- `json.loads` on both changed JSON files; both re-serialise byte-for-byte with 2-space indent, `ensure_ascii=False` and a trailing newline (the repository convention).
- Rule IDs unique and coverage IDs unique; each MARKER target is a rule that exists; each new anchor occurs exactly once in the raw extract and before offset 958.
- Registered `header_text` unchanged; pre-body slice length equals the recorded offset.
- Queue item IDs unique, every `depends_on` resolves, status vocabulary respected; diff reviewed and limited to the three allowed paths.

Not run (deferred by owner): zod schema parse, compiler/plan, tests/typechecks, importer, database/device checks, migration, import, deployment.

## Findings for later work

- Scheme text versus parsed body titles, quoted as found and not harmonised:
- Scheme row 1 (line 8) reads `Heat Energy, Concept of Heat and Temperature, Effects of Heat and Uses`; the parsed body WEEK ONE is titled `Heat Energy, Concept of Heat and Temperature and Effects of Heat`.
- Scheme row 2 (line 9) reads `Thermometer and Its Type, Evaporation and Boiling`; the parsed body WEEK TWO is titled `Thermometer and Its Type. Evaporation and Boiling`.
- Scheme row 4 (line 11) reads `Expansivity and Its Application - Linear, Area and Volume. Anomalous Expansion of Water. Real and Apparent Expansivity`; the parsed body WEEK FOUR is titled `Expansivity and Its Application - Linear, Area and Volume. Anomalous`.
- Scheme row 6 (line 13) reads `Electric Charges - Production, Types, Distribution and Storage`; the parsed body WEEK SIX is titled `ELECTRIC CHARGES→ Production, Types, Distribution and Storage`.
- Scheme row 7 (line 14) reads `Gold Leaf Electroscope and its Uses. Lighting and Lighting Conductor`; the parsed body WEEK SEVEN is titled `Gold Leaf Electroscope and Its Uses. Lighting and Lighting Conductor.`.
- Scheme row 8 (line 15) reads `Fields - Concept and Types of Field. Gravitational and Magnetic Field, Force of Gravity`; the parsed body WEEK 8 is titled `FIELD - CONCEPT AND TYPES OF FIELD. GRAVITATIONAL AND MAGNETIC FIELD. FORCE OF GRAVITY`.
- Scheme row 9 (line 16) reads `Electric Field - Line of Forces, Properties of Line of Force, Description and Properties of Force Field`; the parsed body WEEK NINE is titled `Electric Field - Line of Forces, Properties of Line of Force, Description and     Properties of Force Field`.
- Scheme row 10 (line 17) reads `Production of Continuous Electric Current`; the parsed body WEEK TEN is titled `PRODUCTION OF CONTINUOUS ELECTRIC CURRENT`.
- Scheme rows are untyped-number lines, so row-to-week mapping is by order only; a later rule must not assume week numbers in the scheme.
- Each body ends with a `WEEKEND ASSIGNMENT` line (week 8 reads `WEEKEND ASSIGNMENT (THEORY)`); these stay inside their parsed bodies for the `PHYS-WK-T2-*` items.
- Legacy `.doc` extraction exposes the body only; drawings, graphs and diagrams belong to `PHYS-VIS-T2`.
- The preamble will still surface as `PREAMBLE_REQUIRES_COVERAGE` in a compiler plan until the recorded slice hash is checked by a later run.

## Remaining

`PHYS-PRE-T2` is complete with testing deferred. Still open: `PHYS-PRE-T3`, the T1/T2/T3 week items, `PHYS-VIS-T2`, and the other pending, blocked and port items. No subject or class completion is claimed.
