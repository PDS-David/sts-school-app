# YO-FND-T2-01 — Yoruba, 2nd Term, the nine ordinal week labels and the marker binding

Status: **IMPLEMENTED_TESTING_DEFERRED** (analysis and bounded proposal delivered; no schema or compiler edit, no rule added and no parser, compiler or importer run). The raised limitation is **refuted in its main clause**: the nine Yoruba ordinal headings are expressible with nine `split_before` rules and the scheme rows need no new representation. One true compiler limitation remains — the two REVISION/EXAMINATION markers sit in the preamble and can never bind a parsed row — and it is recorded here with a no-foundation option and a bounded foundation option. Testing deferred by owner.

## Inputs
- Base: `63c58d8`, the `ss1/yo-pre-t2-1` tip published as PR #227 against `ss1/yo-wk-t2-w11`; PR #227 is still open and is not merged here. This branch is stacked and its PR targets `ss1/yo-pre-t2-1`.
- Prerequisite `YO-SRC-T2` is `IMPLEMENTED_TESTING_DEFERRED`. Source `SS1-SRC-ec4a5095420d`, manifest member `SSS 1/2nd Term SS1_/2ND TERM S1 YORUBA.docx`, 66,197 bytes, SHA-256 `73bfb9760a678e113e9a44c4d5073c5d59eb463d0846e384483726fc94bcc9ac`, re-verified from the supplied archive (SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`).
- Files read for the audit: `docs/ss1/contracts/CONTRACT.md` (rules table lines 103-105), `backend/src/db/ss1/subjectPackageSchema.ts` (rule union lines 12-15), `backend/src/db/ss1/compiler.ts` (`once` line 14, `applyRules` lines 17-34, numeric-label check line 23, line-boundary check line 25, insertion line 30, parse line 76, preamble line 78, `NO_PARSED_LESSONS` line 79, marker binding line 85, coverage checks lines 121-131), `backend/src/db/ingestTopics.ts` (`WEEK_MARKER` lines 314-317, `BARE_NUMBER_LINE` line 333, `parseTopics` lines 335-424, `return []` line 424), `docs/ss1/work/SS1-02/author_packages.py` (`SPLITS` lines 15-19, `source()` line 27, split loop lines 41-47), `backend/src/db/ss1/subjects/yoruba.json` and `docs/ss1/work/microtasks/yoruba/QUEUE.json`.
- Method (private, outside Git): the same mammoth 1.12.2 `extractRawText` output as Weeks 1-12 (53,525 characters, 2,433 lines); static application of the parser's own two regexes to that text; and a private text-level simulation that inserts nine `WEEK <n>` lines and re-slices by their exact positions. The method was first calibrated against `YO-FND-T1-01`: it reproduces that note's eight published body hashes and its preamble hash exactly. The parser, compiler, importer, database and device were **not** run and no render is committed.

## What the item asked
`YO-FND-T2-01` was raised with the claim that (a) no English "week" marker or numeral appears on any week or scheme line, so `WEEK_MARKER` and the bare-number fallback never match; (b) the 12-row scheme block and the nine teaching headings therefore cannot be split into per-week rows, and the schema has no representation for a scheme row without a body; and (c) three teaching labels carry leading tabs and the Week 3 label a trailing space, so trimmed exact-match anchors fail. It asks for the specific limitation, a reproducible explanation and a bounded foundation change, with no schema or compiler edit and no parser run claimed.

## Audit
| Claim | Evidence | Finding |
|---|---|---|
| The source yields no parsed rows today | `WEEK_MARKER` (ingestTopics.ts 314-317) and `BARE_NUMBER_LINE` (333) match **0** times on the unmodified extract; there is no "week" substring and no bare-number line; `parseTopics` returns `[]` (424); `NO_PARSED_LESSONS` at compiler.ts 79 | **True** |
| The nine headings cannot be introduced by `source_rules`; trimmed anchors fail | `split_before` inserts `WEEK <n>` before any anchor that occurs once (compiler.ts 14, 21) and starts at a line boundary (25, 30); all nine headings occur once and are line-initial even with their whitespace, and `once` matches the exact text rather than a trimmed form | **False**: exact anchors keep the tabs or spaces and are legal |
| Three teaching labels carry leading tabs and Week 3 a trailing space | Five labels do, not three: lines 149 (three tabs), 1075 (leading and trailing space), 1451 (two tabs), 1611 (four tabs) and 1683 (one tab); `OSE KEJI`, `OSE KERIN`, `OSE KESAN-AN` and `OSE KEWAA` are clean | **Understated, but not an obstacle** |
| A scheme row without a body has no schema representation | Week 8 has no section and is already covered by `UNRESOLVED` entries plus `YORUBA-T2-W08-SCHEME-MAPPING`; rows 11-12 are `MARKER` coverage of the SCHEME_ONLY preamble (CONTRACT.md 105); `UNRESOLVED` coverage needs no row, and SCHEME_ONLY may identify preamble material outside parsed rows | **False** as a schema gap |
| The REVISION and EXAMINATION markers can be classified as they stand | R002 (REVISION, anchor line 139) and R003 (EXAMINATION, anchor line 141) anchor in the preamble; CONTRACT.md 105 says non-SCHEME_ONLY kinds classify "the exact containing parsed row", and compiler.ts 85 requires exactly one parsed match, so a plan run throws before coverage is checked | **True**: this is the one real limitation |

## Static checks on the private extract
- The unmodified text has **0** case-insensitive `week` substrings, **0** `WEEK_MARKER` matches and **0** `BARE_NUMBER_LINE` matches. These are the parser's own regexes applied statically to the same extraction, not a parser run; they reproduce `NO_PARSED_LESSONS`.
- The nine teaching headings, with the whitespace that the anchor must retain:

| Week | Line | Anchor (JSON-escaped) | Leading | Trailing | Occurrences | Expected title |
|---|---|---|---|---|---|---|
| 1 | 149 | `\t\t\tOSE KINNI` | 3 tabs | none | 1 | `OSE KINNI` |
| 2 | 855 | `OSE KEJI` | none | none | 1 | `OSE KEJI` |
| 3 | 1075 | ` OSE KETA ` | 1 space | 1 space | 1 | `OSE KETA` |
| 4 | 1303 | `OSE KERIN` | none | none | 1 | `OSE KERIN` |
| 5 | 1451 | `\t\tOSE  KARUN-UN` | 2 tabs | none | 1 | `OSE  KARUN-UN` |
| 6 | 1611 | `\t\t\t\tOSE KEFA` | 4 tabs | none | 1 | `OSE KEFA` |
| 7 | 1683 | `\tOSE  KEJE` | 1 tab | none | 1 | `OSE  KEJE` |
| 9 | 2017 | `OSE KESAN-AN` | none | none | 1 | `OSE KESAN-AN` |
| 10 | 2221 | `OSE KEWAA` | none | none | 1 | `OSE KEWAA` |

- There is no `OSE KEJO` heading anywhere: Week 8 has no teaching section (its scheme row is 93-105 and its body absence is already recorded). Weeks 11 and 12 have no body either; their scheme rows are 139 and 141.
- The body is lines 149-2423 (SHA-256 `c3123aaff4325becd71368c53f47d732a762342e64faed52963eefc59e474683`), last non-blank line 2423; lines 2424-2433 are blank. The preamble before the first heading is lines 1-148 (2,660 characters, SHA-256 `69ce399e961323e9388b744d18b6fe8be93e7fb5a0448ce830c7d6b5dd03806f`), which contains the title block, the scheme and the whitespace-only lines 142-148.

## Option A — recommended: nine `split_before` rules, no foundation change
Add nine rules after the existing R001 (`source_alias`), R002 (`classify_marker`, REVISION), R003 (`classify_marker`, EXAMINATION) and R004 (`classify_marker`, SCHEME_ONLY). Each needs its own `evidence` object. Example for Week 1:

```json
{
  "id": "SS1-SRC-ec4a5095420d-R005",
  "op": "split_before",
  "source_id": "SS1-SRC-ec4a5095420d",
  "source_sha256": "73bfb9760a678e113e9a44c4d5073c5d59eb463d0846e384483726fc94bcc9ac",
  "anchor": "\t\t\tOSE KINNI",
  "week_label": "1",
  "evidence": { "locator": "...", "explanation": "Structural boundary only; original text retained." }
}
```

| Rule | `week_label` | Anchor (JSON-escaped) | Line |
|---|---|---|---|
| `SS1-SRC-ec4a5095420d-R005` | `1` | `\t\t\tOSE KINNI` | 149 |
| `SS1-SRC-ec4a5095420d-R006` | `2` | `OSE KEJI` | 855 |
| `SS1-SRC-ec4a5095420d-R007` | `3` | ` OSE KETA ` | 1075 |
| `SS1-SRC-ec4a5095420d-R008` | `4` | `OSE KERIN` | 1303 |
| `SS1-SRC-ec4a5095420d-R009` | `5` | `\t\tOSE  KARUN-UN` | 1451 |
| `SS1-SRC-ec4a5095420d-R010` | `6` | `\t\t\t\tOSE KEFA` | 1611 |
| `SS1-SRC-ec4a5095420d-R011` | `7` | `\tOSE  KEJE` | 1683 |
| `SS1-SRC-ec4a5095420d-R012` | `9` | `OSE KESAN-AN` | 2017 |
| `SS1-SRC-ec4a5095420d-R013` | `10` | `OSE KEWAA` | 2221 |

Effect under the current code: nine `WEEK <n>` lines are inserted; `parseTopics` parses nine blocks whose titles are the ordinals; the text before the first marker becomes a `PREAMBLE_REQUIRES_COVERAGE` disposition (compiler.ts 78) for lines 1-148, where the R004 SCHEME_ONLY coverage lives. No source character is deleted or rewritten.

The same option also closes the marker gap without a foundation change: rows 11-12 can be classified under SCHEME_ONLY — either convert R002/R003 from REVISION/EXAMINATION to SCHEME_ONLY, or bind `YO-T2-W11-SCHEME-REVISION` and `YO-T2-W12-SCHEME-EXAMINATION` to the existing R004. The revision and examination semantics then live in the coverage objectives and the W11/W12 notes, not in the disposition kind. Week 8 needs no rule: its `UNRESOLVED` coverage is already the representation. The three 1st Term PRE `MARKER` entries can bind `SS1-SRC-48b641249e3b-R002` under the same compiler rule, since that rule is SCHEME_ONLY and the 1st Term source still yields no parsed rows; they were left untouched here.

## Option B — bounded foundation change
Only needed if the `REVISION` and `EXAMINATION` disposition kinds must survive. Two separable changes, either or both:
- **Preamble marker binding**: extend `classify_marker` so a REVISION/EXAMINATION rule may bind a unique preamble anchor and record a rule-keyed disposition, mirroring SCHEME_ONLY's zero-match path (compiler.ts 83-85) with a contract wording change at CONTRACT.md 105 and a schema note. This preserves the kinds and needs no parser change.
- **Explicit ordinal label**: add an explicit label field to `split_before` so `weekLabel` can be the source ordinal rather than `WEEK 1`-`WEEK 10`; this needs schema, compiler, parser and contract changes and should not be bundled with the preamble fix.

Neither change is made here.

## Option C — not recommended
Split rows 11-12 into parsed blocks with labels 11 and 12. This would turn two non-teaching scheme lines into delivery rows, fragment the front-matter block that R004 and YO-PRE-T2-1 hash-account, and require every downstream marker hash to be re-derived. Recorded only to close the option space.

## Authoring-helper finding
`docs/ss1/work/SS1-02/author_packages.py` cannot author these rules unchanged. Its `SPLITS` map (lines 15-19) has no entry for `SS1-SRC-ec4a5095420d`, and its `source()` loop (line 47) derives each `week_label` from the last preceding `WEEK` match, defaulting to `'1'` when there is none. Applied to nine split lines, all nine labels would become `1`, and the labels must in any case be 1-7, 9 and 10, which the helper's contiguous `WEEK` regex never sees. The rules must be authored directly, or the helper extended first (out of scope for this item).

## Private simulation of option A (not a parser run)
The simulation inserts the nine `WEEK <n>` lines at the exact heading positions and slices between them; titles are the trimmed ordinal headings and body hashes are SHA-256 over the trimmed block. It reproduces `YO-FND-T1-01`'s published values before being applied here.

| Week | Anchor line | Block lines | Expected title | Expected body SHA-256 | Body characters |
|---|---|---|---|---|---|
| 1 | 149 | 149-854 | `OSE KINNI` | `75bf415786ba1675027d7c24ce6d446e40f1ea900f83f0619dd29a24e341a138` | 10,579 |
| 2 | 855 | 855-1074 | `OSE KEJI` | `60aebffda89135471ed929763c5c8ef64f2b903e7119aa7cdae73051de7ec6c9` | 4,159 |
| 3 | 1075 | 1075-1302 | `OSE KETA` | `996bf5428d31a91001cf01aee5bc9371fa3863c2c481cf991f6e613e20edf4bd` | 3,990 |
| 4 | 1303 | 1303-1450 | `OSE KERIN` | `b87fa92a6722bb1ec41d6f5b118eb7497d70bce0faca04918ebff340a1343086` | 5,137 |
| 5 | 1451 | 1451-1610 | `OSE  KARUN-UN` | `5865c65f0ad1e7e1a6cb667cde7028661245a8bd09d38103b8955348ae40bad4` | 3,644 |
| 6 | 1611 | 1611-1682 | `OSE KEFA` | `ce30ad3c328fbd42ac7c42007299d6276f460be846791b550420407c8c09333d` | 2,503 |
| 7 | 1683 | 1683-2016 | `OSE  KEJE` | `be56b89132cd0cb3594bff23bc7b9585b63083d191f87f90ad3b320988fe5cf6` | 11,595 |
| 9 | 2017 | 2017-2220 | `OSE KESAN-AN` | `dc169d9a808d84d0d7b7c16d00bce3f495e8c0d905e1a3c75dc41900f9d35fa2` | 4,125 |
| 10 | 2221 | 2221-2433 | `OSE KEWAA` | `42b0f42240043873bc250b3ea2bceb0e60c626b95ecf1bf66af671c5ddcadc20` | 4,989 |

Preamble (lines 1-148, before the first inserted marker): SHA-256 `69ce399e961323e9388b744d18b6fe8be93e7fb5a0448ce830c7d6b5dd03806f`, 2,660 characters, 148 lines. These are expected values for a later plan-audit run; the real parser must confirm them.

## Package and queue changes
- `backend/src/db/ss1/subjects/yoruba.json`: one open item added, `YORUBA-T2-WEEK-LABELS` (`OWNER_ACTION`, `blocks_delivery: true`), recording the audit, options A, B and C, the marker gap and the expected block hashes. The ten `YORUBA-T2-W01..W10-ROW-IDENTITY` `required_action` texts now point to it; Week 8's also records the no-section default. `YORUBA-OBJECTIVE-INDEXING` records that the 2nd Term foundation audit is delivered. Coverage stays 284, `source_rules` stays 7, open items rise 113 → 114, lessons 0, assets 0. No rule is added and no coverage entry is changed.
- `docs/ss1/work/microtasks/yoruba/QUEUE.json`: `YO-FND-T2-01` → `IMPLEMENTED_TESTING_DEFERRED` with the audit in `implementation_reference`; note 38 appended; status 33 implemented / 68 pending / 19 blocked; `next_runnable` `["YO-WK-T3-W01"]`.

## Limits
- No rule was added, so the source still yields no parsed rows; the package remains blocked by the five empty `MARKER` `lesson_ids` and by the R002/R003 preamble binding described above. No 2nd Term coverage entry was re-bound.
- No schema, compiler, parser, importer or helper file was edited; no parser, compiler, importer, database or device run was performed; no render or source text is committed.
- The body hashes above come from a text-level simulation and are not importer output.
- Not approved and not verified; the option choice, the Week 8 representation and the rows 11-12 binding remain with the integrator and owner.

## Handoff
Integrator: choose option A or B. Under A, add `R005`-`R013` exactly as tabulated (anchors retain every tab and the trailing space on line 1075), bind rows 11-12 under SCHEME_ONLY, bind the three 1st Term PRE entries to their R002, then ask the ten Week re-binding workers to re-bind to the `BODY` identities produced by a real plan run. Under B, schedule the preamble marker binding (and, separately, the explicit ordinal label) before any plan run that needs the REVISION/EXAMINATION kinds. Either way the plan audit is deferred by owner.
