# YO-PRE-T3-1 — Yoruba, 3rd Term preamble and scheme index

Status: **IMPLEMENTED_TESTING_DEFERRED** (implemented; not teacher-approved, not verified). Testing remains deferred by the owner.

## Inputs and evidence boundary

- Source: `SS1-SRC-4cc6aae9ed7d`, manifest member `SSS 1/3rd Term SS1_/3RD TERM S1 YORUBA.docx`.
- Registered member SHA-256: `a057f7f70d7e99fc34acdb6e725f3d44a426d96f756039bf6f3e6216767416e3`.
- Used the previously recorded source-opening and inventory evidence in `YO-SRC-T3.md` and `YO-INV-T3.md`. Those records state that the member and outer archive hashes were verified during the earlier inventory. This task did not independently re-extract the archive.
- Locator convention: 1-based lines from Mammoth 1.12.2 `extractRawText().split('\\n')`; hashes are SHA-256 over exact UTF-8 source lines as recorded by the inventory. No source text, normalization, or original document was changed.

## Hash-accounting

| Block | Locator | Length / contents | SHA-256 |
|---|---|---|---|
| Document title / registered header | Line 1 | 60 characters; exact registered `header_text` | `cd75f590d1060a7b6cefbd92ba58e0bf42064f11a9439b9f0db209a4a1d87504` |
| Scheme heading and all scheme groups | Lines 3–83 | 2,396 characters; heading at 3, blank/un-numbered `Ose: ` at 5, eleven groups at 7–83 | `e01907be4a3a91ab933ac6a10b39b9a21f93e2cb43cb979686e5540f4e87736e` |
| Full preamble through bibliography | Lines 1–113 | Includes title, scheme and the separate `IWE ITOKASI` list | `d2054cef3116d98e5bfc049a5a407b1f81dd2c7c4876ba5b0b263ffbbbcbc165` |
| Scheme heading alone | Line 3: `ILANA ISE OSOOSE FUN SAA KETA` | One unique line | `7bd5ada94688eadae2f86aa9c645ef97bcc4c5c36351f9779f62e7f75490f4f7` |

The scheme is not a Word table: its rows are paragraphs containing tabs. The source inventory records 198 automatically numbered paragraphs whose numbering is not emitted by `extractRawText`; this is an extraction limitation, not evidence that the source has no list numbering.

## Scheme-group mapping

The source gives no week numbers or per-week labels in the scheme. Line 5 contains only `Ose: `; the groups are distinguished by order and the repeated EDE/ASA/LIT prefixes. The mapping below is positional and cross-checked against the matching Yoruba ordinal teaching heading in the body. Group hashes are the exact hashes recorded in `YO-INV-T3.md`.

| Scheme group | Source lines | Group SHA-256 | Mapping |
|---|---:|---|---|
| 1 — EDE / ASA / LIT | 7–11 | `62d8c558c9d8d7d25842a84a51e4c20d27b5e3922b26c39a310fb62ce891aa8e` | `YO-T3-W01`; body heading `OSE KINNI` at line 121 |
| 2 — EDE / ASA / LIT | 13–17 | `12b984e154f5bab69dc520e5c609e3606ce32be1a4a9e437068aead476c6bc60` | `YO-T3-W02`; `OSE KEJI` at line 427 |
| 3 — EDE / ASA / LIT | 19–23 | `cc19fa12f31f31016663e2b334bfd926f6372c81b4d7c13e968c299a6d87ea48` | `YO-T3-W03`; `OSE KETA` at line 679 |
| 4 — EDE / ASA / LIT | 25–33 | `492122e7e9364f09531ddd3db93cbac832506d6c43a8e9d7db0215edba8ba501` | `YO-T3-W04`; `OSE KERIN` at line 963 |
| 5 — EDE / ASA / LIT | 35–39 | `50c7df0b38e40a9016b0a6508d7587ad6db802a9767bdf8edba8cbdb3bb3442b` | `YO-T3-W05`; `OSE KARUN-UN` at line 1281 |
| 6 — EDE / ASA / LIT | 41–51 | `2b25d4918221876232c76035fb4c089525bd48c4195f5567c0c6aa1e6f52807c` | `YO-T3-W06`; tab-indented `OSE KEFA` at line 1357 |
| 7 — EDE / ASA / LIT | 53–59 | `bc4ea6d4912b5e8e8835e851182c143dc8b67dfcc12bdb6a444b4cbe32ef9676` | `YO-T3-W07`; `OSE KEJE` at line 1625 |
| 8 — EDE / ASA / LIT | 61–67 | `33511c69113dda8efe27fc0fcae84dae663a74c7258cc7e19689af787454b9f5` | `YO-T3-W08`; `OSE KEJO` at line 1879 |
| 9 — EDE / ASA / LIT | 69–73 | `a15ef24840b5fdfd282028fa7f03210b94a9a475c53a98fe406811d2b98de9f7` | `YO-T3-W09`; `OSE KESAN-AN` at line 2161 |
| 10 — EDE / ASA / LIT | 75–79 | `7f35470f95d25014ad35320f48879f0be4db9c3e0a380f3b7a5ea3e0bf78eb08` | `YO-T3-W10`; `OSE KEWAA` at line 2313 |
| 11 — revision / test pair | 81–83 | `a8579d59815b77e42e64ccf1a8134d8ba38ca3a2620e47a3df08c1224f3934c3` | `YO-T3-W11-SCHEME-REVISION-TEST`; no Week 11 teaching body exists |

The ten teaching labels occur once each. The eleventh scheme group is a revision/test pair only; no teaching section, examination row, or lesson was invented. The revision/test pair already has a `SCHEME_ONLY` source rule and MARKER coverage.

## Header and footer parts outside text extraction

- `word/header1.xml`: blank Name/Class fill-in line; not teaching content.
- `word/footer1.xml`, `word/footnotes.xml`, `word/endnotes.xml`: empty.
- `word/footer2.xml`: `1GSCHS/3RD TERM/YOR/SS1`, corroborating the class, term and subject registration; not a lesson.
- The bibliography at lines 91–113 is outside this task's title/scheme mapping and is separately handled by `YO-PRE-T3-2`.

## Package and queue changes

- Added source rule `SS1-SRC-4cc6aae9ed7d-R003` (`classify_marker`, `SCHEME_ONLY`) for the unique line-3 scheme heading.
- Added MARKER coverage `YO-T3-PREAMBLE-SCHEME-HEADER` pointing to that rule. The ten teaching scheme groups remain represented by their week-specific coverage entries; the revision/test pair remains represented by its existing marker entry.
- Marked `YO-PRE-T3-1` as `IMPLEMENTED_TESTING_DEFERRED`; recomputed queue status/kind counts and next-runnable tasks.
- No lesson, objective, answer, or teacher approval was invented. Package status remains PENDING; all content approval and verification states remain unchanged.
- No schema, compiler, importer, route, database, UI, or other subject file was changed.

Authoring checks: evidence and reference review only. No test suite, typecheck, importer, database or device validation was run.
