# PHYS-PRE-T3 — Physics: 3rd Term preamble inventory

Status: `IMPLEMENTED_TESTING_DEFERRED`. One task only. Nothing was run from the deferred list (no schema parse, compiler/plan, test, typecheck, importer, database, device, migration, import or deployment). Base: master `679ab8b4edf311c2c376d978f220a75071792cdf` (fetched 2026-11-07). Branch `agent/physics-technical-drawing-ss1`.

## Inputs

- Archive `docs/ss1/sources/SSS1-original.zip`: SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e` — verified.
- Member `SSS 1/3rd Term SS1_/3RD TERM S1 PHYSICS.doc`: 107,008 bytes, SHA-256 `bcd7daab57432b5c2b74a29e4afc1f162276e5fe360fab50345426fc3503e688` — verified against the registry before extraction. Extracted to private scratch outside the repository; not committed.
- Extraction: word-extractor 1.0.4 `getBody()` (the importer's legacy `.doc` call, no rule applied): 30,301 characters, 563 lines, 436 non-blank, LF-only.
- A legacy `.doc` body stream is all `getBody()` exposes: page headers/footers (which the registered alias evidence reads as `WKLAS/SS1/3rd term/Physics`), footnotes and drawings were not inventoried. Figures belong to `PHYS-VIS-T3`.
- Line numbers are 1-based lines of that extract. Block hashes are SHA-256 over the stated lines joined with `\n`, UTF-8.

## Non-week region (lines 1-16; first body label `WEEK 1` at line 17, offset 534)

| Lines | Content | SHA-256 | Disposition |
| --- | --- | --- | --- |
| 1 | `THIRD TERM E-LEARNING NOTE` (32 leading, 2 trailing spaces) | `df2e2fb3dcf8d357918dab27232e12faed4a2fda3f65323e9d9a160ca69f74a0` | registered `header_text` and anchor of the existing alias `-R001`; `COV-PHYS-T3-TITLE` |
| 2 | `THIRD TERM SCHEME OF WORK` (6 leading, 1 trailing space) | `3e16283db28dabc0f502992ff1da36fa1b79e56bf47b6d0b5c10a7ebb0ea3ead` | new `SS1-SRC-bed91bb4ef0e-R002` (SCHEME_ONLY); `COV-PHYS-T3-TITLE` |
| 1-2 | title and scheme heading | `316e63ba468875d30722f508a71ff6bd4a3438cf9378f3185eda45d7c94f603a` | `COV-PHYS-T3-TITLE` |
| 3-14 | twelve scheme rows (next table) | `021cd16f786beddcb531e23b62fd9e96692cb2ce062772e7d344ac317642593f` | rows 1-10 to `PHYS-WK-T3-W01..W10`; rows 11-12 to `-R003` |
| 13-14 | `11.  Revision` + `12.  Examination` | `a092161e02e11a8718c9ab8ae14e36d0d574e23d48f7fd93cb63dc92803af02d` | new `SS1-SRC-bed91bb4ef0e-R003` (SCHEME_ONLY); `COV-PHYS-T3-SCHEME-REVISION-EXAM` |
| before line 17 | `text.slice(0, index of "WEEK 1")`, offset 534 | `8e25e51ec2fd802c25deedcaa28bd2a169a1cf5ca989d02574594e13cda0c62d` | value the compiler's `PREAMBLE_REQUIRES_COVERAGE` detail should hold; computed by slicing, importer not run |

Lines 15 (two spaces) and 16 (47 spaces) are whitespace-only separators. The source has no `SUBJECT:`/`CLASS:` line and **no reference-book list** (a case-insensitive search for `reference` finds none in the preamble).

## Scheme rows (lines 3-14)

Unlike the 2nd Term scheme, rows carry typed numbers (`1`, `2`, `3.`, ... `10.`, `11.`, `12.`), preserved as typed.

| Line | Hash of the line | Queue item | Scheme text (verbatim) | Parsed body topic |
| --- | --- | --- | --- | --- |
| 3 | `7c60b82b35f38ee77c25c8d0712da6d8e459e8e358afd376a04611c55786a3bf` | `PHYS-WK-T3-W01` | `1     Electric Circuit (DC).` | `ELECTRIC CIRCUIT` |
| 4 | `e9c5093aab0fd1e0225945ba46854032fbd72ba3f79a6d8211e0c2b65e5007b1` | `PHYS-WK-T3-W02` | `2     Resistors and Cells in Series and Parallel.` | `RESISTORS & CELLS  CONNECTED IN SERIES & PARALLEL` |
| 5 | `8981a91e2a908c05c7a9fcb1b6866b838ab2ee1b3a4560e8407438bc3cecc793` | `PHYS-WK-T3-W03` | `3.    Electrical Energy and Power` | `ELECTRICAL ENERGY AND POWER` |
| 6 | `e1e4e926c43028b7eb570e3ed193d7adce231419da968adfa8fda7cda9a82409` | `PHYS-WK-T3-W04` | `4.    Safety Device - Fuse` | `SAFETY DEVICE - FUSE` |
| 7 | `1046ec74f64fdc454ae4a0fbbf34e6cfdfe518b6a88899b2a1390bb86b68cae5` | `PHYS-WK-T3-W05` | `5.    Atomic Structure, Diffusion and Osmosis` | `MATTER, ATOMIC STRUCTURE, STATES OF MATTER,` (first of two TOPIC lines) |
| 8 | `a4978c597598c0ed8314f9b7b70bd2b456a137966b146d06eb01bc25fb49f1ce` | `PHYS-WK-T3-W06` | `6.    Crystal Structure of Matter - Amorphous and Crystalline Substances` | `CRYSTAL STRUCTURE OF MATTER- AMORPHOUS AND` (first of two lines) |
| 9 | `08ef0778c6fe4cdd69cf2ab0ffa5ce66b40b019e8582bf747c55a0fe0be3e1f1` | `PHYS-WK-T3-W07` | `7.    Surface Tension` | `SURFACE TENSION` |
| 10 | `ebb51c440d21c9bf0696a1a8e5bff9ce8b4cae2be27ed62763c7ff4738a5fda2` | `PHYS-WK-T3-W08` | `8.    Capillarity` | `CAPILIARITY` (sic) |
| 11 | `4039025138704e04f553180ba096ceb7254cefa552028f5f99a65aef565f5877` | `PHYS-WK-T3-W09` | `9     Elasticity` | `ELASTICITY` |
| 12 | `8e69c4779a0c4d3fedf88d09f25fc2e3b37079de16d3d58693f1d37d2d7f0558` | `PHYS-WK-T3-W10` | `10.  Energy Stored in an Elastic Material` | `ENERGY STORED IN AN ELASTIC MATERIAL` |
| 13 | `d22d8ae00059f183066c148f0ce1be09ef5cacdc696dc7b316208967498606a3` | none — `-R003` | `11.  Revision` | no body |
| 14 | `df80b41b61c18f7b7a8a6c573c5f3408ea7009fec6d5b5640c047034c138ffca` | none — `-R003` | `12.  Examination` | no body |

## Scheme weeks with no parsed body (explicit)

**Scheme weeks 11 (Revision) and 12 (Examination).** The scheme has 12 rows; the extract has exactly **10** `WEEK` markers (`WEEK 1` line 17 ... `WEEK 10` line 516) and re-slicing with the importer's `WEEK_MARKER` pattern and `.trim()` (plain string slicing, importer not run) gives 10 bodies whose SHA-256 values all equal `docs/ss1/work/SS1-03/evidence/parsed_rows.json`. No text follows the last body (last non-blank line is Week 10 theory question 2, a steel-wire extension calculation). Case-insensitive `revis`/`exam` also matches lines 287, 301 and 341, which are body text (`examples of fuse except`, `theory except`), not revision or examination material. Nothing was invented for weeks 11-12.

## Package changes

`backend/src/db/ss1/subjects/physics.json` only: added `SS1-SRC-bed91bb4ef0e-R002` and `-R003` (`classify_marker` / `SCHEME_ONLY`; anchors `THIRD TERM SCHEME OF WORK` at offset 67 and `11.  Revision\n12.  Examination` at offset 452, each occurring once, both before offset 534 and so in no parsed row); source rules 7 → 9. Added `COV-PHYS-T3-TITLE` and `COV-PHYS-T3-SCHEME-REVISION-EXAM` (both `MARKER`, targeting the new rule IDs); coverage 34 → 36. Alias rule `-R001`, `header_text` and the open items are unchanged.

`docs/ss1/work/microtasks/physics/QUEUE.json`: `PHYS-PRE-T3` set to `IMPLEMENTED_TESTING_DEFERRED`; `status_counts` 8 / 9 / 58 (75 total); `runnable_now` recomputed; review date/base and a note added. `next_runnable` is unchanged.

## Authoring checks performed (not tests)

- Archive and member SHA-256 verified; `json.loads` on both changed JSON files; 2-space indent, `ensure_ascii=False`, trailing newline preserved.
- New rule and coverage IDs unique; each MARKER target is an existing SCHEME_ONLY rule of the same source; each new anchor occurs exactly once in the raw extract and before offset 534; ten body hashes equal `parsed_rows.json`.
- Queue item IDs unchanged, status vocabulary respected; diff limited to the three allowed paths.

Not run (deferred by owner): zod schema parse, compiler/plan, tests/typechecks, importer, database/device checks, migration, import, deployment.

## Findings for later work

- **Week 5 title truncation (for `PHYS-FACT-T3-W05-SCHEME-MISMATCH`).** The Week 5 `TOPIC` spans two lines (295-296). The importer keeps only the first (`MATTER, ATOMIC STRUCTURE, STATES OF MATTER,`); the second reads `DIFFUSION, OSMOSIS, BROWNIAN MOTION`. The body contains a `Diffusion and Osmosis` section (a `Diffusion:` definition, factors affecting the rate, Graham's law, an `Osmosis:` definition). The earlier recorded mismatch (scheme says Diffusion and Osmosis, body is matter/atomic structure/states) therefore looks like a title-truncation artefact, not missing content. That item should confirm and also check whether Brownian motion is actually taught. Week 6 has the same two-line title split.
- The scheme does not name Week 4's fuse, resistivity or internal-resistance content beyond `Safety Device - Fuse`; the fact items for the fuse rating and `E/(R+r)` remain open.
- A revision/examination plan for SS1 Third Term is an owner decision (`PHYS-OWNER-REVISION-PLAN`, blocked).
- Alias approval for this source is still `PHYSICS-T3-ALIAS-APPROVAL` / `PHYS-OWNER-ALIAS-T3` (blocked on the owner).
