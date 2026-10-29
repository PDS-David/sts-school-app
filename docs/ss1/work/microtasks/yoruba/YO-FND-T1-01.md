# YO-FND-T1-01 — Yoruba, 1st Term, the eight ordinal week labels

Status: **IMPLEMENTED_TESTING_DEFERRED** (analysis and bounded proposal delivered; no schema or compiler edit, no rule added and no parser, compiler or importer run). The raised limitation is **refuted in its main clause**: the document's eight Yoruba ordinal headings are expressible with eight `split_before` rules and no foundation change. What remains is a narrow, optional label question (option B). Testing deferred by owner.

## Inputs
- Base: `ss1/yo-fnd-t1-01`, stacked on `c744687` (the `ss1/yo-vis-t1-03` tip). PR #207 was merged into `ss1/yo-vis-t1-02` on 2026-10-29T23:34:07Z (merge commit `19d550dd`); PRs #199–#206 are also merged into their predecessors and only #199 is on master (`9f745bb`). This PR targets `ss1/yo-vis-t1-02`.
- Prerequisite `YO-SRC-T1` is `IMPLEMENTED_TESTING_DEFERRED`. Source `SS1-SRC-48b641249e3b`, manifest member `SSS 1/1st Term SS1_/YORUBA.docx`, SHA-256 `7403d8243ee646a221bb3d92fe18d202c73be0bde4deb10fa68a3dec0b4a6aef`, re-verified from the supplied archive (SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`). Nothing from the archive or the extract is committed.
- Files read for the audit: `docs/ss1/contracts/CONTRACT.md` (lines 97–107), `backend/src/db/ss1/subjectPackageSchema.ts` (rule union at lines 12–18), `backend/src/db/ss1/compiler.ts` (`once` line 15, `applyRules` lines 17–34, parse line 76, preamble line 78, `NO_PARSED_LESSONS` line 79), `backend/src/db/ingestTopics.ts` (`WEEK_MARKER` lines 314–317, `BARE_NUMBER_LINE` line 333, bare fallback lines 402–414, `return []` line 424), `docs/ss1/work/SS1-02/author_packages.py` (`WEEK` line 11, `SPLITS` lines 15–19, `source()` line 27, label default line 47), `backend/src/db/ss1/subjects/english.json` and `backend/src/db/ss1/subjects/yoruba.json`.
- Method (private, outside Git): mammoth 1.12.2 `extractRawText` text of the member; static application of the two parser regexes to that text; and a private text-level simulation that inserts the eight `WEEK <n>` lines and re-slices by their exact positions. The parser, compiler, importer, database and device were **not** run and no render is committed. Line numbers are 1-based lines of `extractRawText().split('\n')` (1,781 lines).

## What the item asked
`YO-FND-T1-01` was raised with the claim that (a) `WEEK_MARKER` matches only English "week" plus numerals or English number words, so the eight headings yield no parsed rows; (b) `applyRules` accepts only numeric `week_label` values; and therefore (c) "the headings cannot be introduced by `source_rules` either", so a foundation change is required before 1st Term coverage can bind to parsed-row IDs. The item asks for the specific limitation, a reproducible explanation and a bounded proposal, with no schema or compiler edit and no parser run claimed.

## Audit
| Claim | Evidence | Finding |
|---|---|---|
| The source yields no parsed rows today | `WEEK_MARKER` (ingestTopics.ts 314–317) and `BARE_NUMBER_LINE` (333, fallback 402–414) match **0** times; the extract contains no "week" substring and no bare-number line; `parseTopics` returns `[]` (424) | **True** |
| `split_before` accepts only a numeric week label | compiler.ts 23 (numeric regex), subjectPackageSchema.ts 13, CONTRACT.md 103 ("Numeric week or numeric range only") | **True, but not an obstacle**: the inserted label is the week ordinal (1–8), not the source heading |
| The headings cannot be introduced by `source_rules` | `split_before` inserts `WEEK <n>` + newline before any anchor that (i) occurs once (compiler.ts 15, 21) and (ii) starts at a line boundary (25, 30); all eight headings occur once and are line-initial | **False** |

The mechanism is already used at scale: `english.json` holds 47 `split_before` rules, several of them before ordinary content headings (for example `"B. Review of Word Class- Parts of Speech"` with `week_label` `"1"`, and `"C: Spelling: Doubling of Consonants. Rules of Spelling "` also with `"1"`).

## Static checks on the private extract
- The eight headings are exact, unique lines: `OSE KIN-IN-NI` (61), `OSE KEJI` (311), `OSE KETA` (483), `OSE KERIN` (725), `OSE KARUN-UN` (1171), `"\tOSE KEFA\t"` (1285), `OSE KEJE` (1503), `OSE KEJO` (1685). Each begins a line and is followed by a newline.
- Week 6 is tab-wrapped in the extraction (leading and trailing tab). The anchor must therefore keep both tabs: with the leading tab the anchor still starts at a line boundary; without it the anchor would match mid-line and `applyRules` would throw at compiler.ts 25.
- `WEEK_MARKER` and `BARE_NUMBER_LINE` both return zero matches on the unmodified text, which reproduces `NO_PARSED_LESSONS` for this source. Neither result is a parser run; they are the parser's own regexes applied statically to the same extraction.

## Option A — recommended: eight `split_before` rules, no foundation change
Add eight rules to `source_rules` after the existing `R001` (`source_alias`) and `R002` (`classify_marker`, `SCHEME_ONLY`). Each needs its own `evidence` object, as every rule does. Example for Week 1:

```json
{
  "id": "SS1-SRC-48b641249e3b-R003",
  "op": "split_before",
  "source_id": "SS1-SRC-48b641249e3b",
  "source_sha256": "7403d8243ee646a221bb3d92fe18d202c73be0bde4deb10fa68a3dec0b4a6aef",
  "anchor": "OSE KIN-IN-NI",
  "week_label": "1",
  "evidence": { "locator": "...", "explanation": "Structural boundary only; original text retained." }
}
```

| Rule | `week_label` | Anchor (JSON-escaped) | Source line |
|---|---|---|---|
| `SS1-SRC-48b641249e3b-R003` | `1` | `OSE KIN-IN-NI` | 61 |
| `SS1-SRC-48b641249e3b-R004` | `2` | `OSE KEJI` | 311 |
| `SS1-SRC-48b641249e3b-R005` | `3` | `OSE KETA` | 483 |
| `SS1-SRC-48b641249e3b-R006` | `4` | `OSE KERIN` | 725 |
| `SS1-SRC-48b641249e3b-R007` | `5` | `OSE KARUN-UN` | 1171 |
| `SS1-SRC-48b641249e3b-R008` | `6` | `\tOSE KEFA\t` | 1285 |
| `SS1-SRC-48b641249e3b-R009` | `7` | `OSE KEJE` | 1503 |
| `SS1-SRC-48b641249e3b-R010` | `8` | `OSE KEJO` | 1685 |

Effect under the current code: eight `WEEK <n>` lines are inserted; `parseTopics` parses eight blocks; each block's title is the ordinal heading; the text before the first marker becomes a `PREAMBLE_REQUIRES_COVERAGE` disposition (compiler.ts 78) for lines 1–60, where the existing three MARKER coverage entries live. No source character is deleted or rewritten, and the row identity remains `SS1-SRC-48b641249e3b:BODY:<sha256 of block>`.

## Residual gap and option B
`weekLabel` would be stored as `WEEK 1` … `WEEK 8` (the marker text), while the source ordinal survives as the row title and as the first line of the body. If the product must show `OSE KIN-IN-NI` … `OSE KEJO` **as the week label**, that needs option B: a bounded foundation change adding an explicit label to `split_before` (schema field plus compiler and parser support, contract version bump). Option B is not made here and is not required for row identity, coverage binding or delivery order.

## Authoring-helper finding
`docs/ss1/work/SS1-02/author_packages.py` cannot author these rules unchanged. Its `SPLITS` map (lines 15–19) has no entry for `SS1-SRC-48b641249e3b`, and its `source()` loop (line 47) derives each `week_label` from the last preceding `WEEK` match, defaulting to `'1'` when there is none. Applied to eight split lines in this document, all eight labels would become `1` and the seven later weeks would collapse into one row. The rules must therefore be authored directly, or the helper extended first (out of scope for this item).

## Private simulation of option A (not a parser run)
The simulation inserts the eight `WEEK <n>` lines at the exact heading positions and slices between them; titles are the trimmed ordinal headings and body hashes are `SHA-256` over the trimmed block.

| Week | Anchor line | Expected title | Expected body SHA-256 | Body chars |
|---|---|---|---|---|
| 1 | 61 | `OSE KIN-IN-NI` | `a0ea1bd2268c296c5a2f4528b4dd19c31f2e3de5fef8f976fb77fe3508215bb0` | 3884 |
| 2 | 311 | `OSE KEJI` | `555ef55fb4e47a1906062c4be2b8261b21cc1449c31235b05a520072d0a2b35f` | 2782 |
| 3 | 483 | `OSE KETA` | `e7d584928633d50b7bdd59ec0d0f6243d731b7a318fccfad406674012e046fa4` | 5731 |
| 4 | 725 | `OSE KERIN` | `3e5e8d567223f4d5f47d823db212bcf4c6a452dd79b2e2b54b30c0b22bd3ff57` | 5412 |
| 5 | 1171 | `OSE KARUN-UN` | `9a4b5956a381b72a846abf1370497a071de023a4188d9f5ddd21e5e8ae732ed5` | 1825 |
| 6 | 1285 | `OSE KEFA` | `49a9a22512e5011fa766af6b6cc9d373be390454fd4d20941d1553621671f42f` | 2680 |
| 7 | 1503 | `OSE KEJE` | `7944d77809e6d3f1f764fd4ce97f23b11a38f56827d0c31f88ab9ee96ed96b58` | 1515 |
| 8 | 1685 | `OSE KEJO` | `af02badc23c44fe075bf8949d603a0cd65dcdc77e94db7db6e0a41166f71dd4c` | 1774 |

Preamble (lines 1–60, before the first inserted marker): SHA-256 `d867f36a0cefdae1c5a262353768d84c50866267792868ea93fca8c14f612b04`, 60 lines. These are expected values for a later plan-audit run; the real parser must confirm them.

## Package and queue changes
- `backend/src/db/ss1/subjects/yoruba.json`: one open item added, `YORUBA-T1-WEEK-LABELS` (`OWNER_ACTION`, `blocks_delivery: true`), inserted after `YORUBA-T1-TABLES`; it records the audit, option A and option B. The eight `YORUBA-T1-W0x-ROW-IDENTITY` `required_action` texts now point to it instead of asking for a foundation change. Coverage stays 125, open items rise 48 → 49, `source_rules` stays 4, lessons 0, assets 0. No rule is added.
- `docs/ss1/work/microtasks/yoruba/QUEUE.json`: `YO-FND-T1-01` → `IMPLEMENTED_TESTING_DEFERRED` with the audit in `implementation_reference`; note 24 appended; status 19 implemented / 52 pending / 9 blocked; `next_runnable` `["YO-WK-T2-W01"]`.

## Limits
- No rule was added, so the source still yields no parsed rows; the package remains `PENDING` and every 1st Term coverage entry stays `PARTIAL`, `UNRESOLVED` or `MARKER` with empty `lesson_ids`.
- No schema, compiler, parser, importer or helper file was edited; no parser, compiler, importer, database or device run was performed; no render or source text is committed.
- The body hashes above come from a text-level simulation and are not importer output.
- `YO-FND-T2-01` and `YO-FND-T3-01` repeat a similar premise for the 2nd and 3rd Term documents; they need the same audit when reached and were not changed here.

## Handoff
Integrator: choose option A or B. Under A, add `R003`–`R010` exactly as tabulated (week 6 anchor with both tabs) and ask the Week 1 re-binding worker to re-bind the eight week groups to the `BODY` identities produced by a real plan run. Under B, schedule the explicit-label foundation change first. Either way the plan audit is deferred by owner.
