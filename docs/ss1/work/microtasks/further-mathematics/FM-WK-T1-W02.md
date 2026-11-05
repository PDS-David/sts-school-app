# FM-WK-T1-W02 — Further Mathematics, 1st Term Week 02 objective indexing

Status: **IMPLEMENTED_TESTING_DEFERRED** (implemented; not approved, not verified). Testing deferred by owner. Week 02 is **not fully covered**: both objectives are PARTIAL and the row needs a replacement, which this item does not author. "Indexed" is not "certified" and not "taught".

## Inputs
- Starting SHA: `6801bba6fd45576153ea50996abb20ec610e3918` (origin/master, re-fetched this session). Work done on branch `ss1/fm-wk-t1-w02`. The open-PR list was queried through the GitHub API (`repos/PDS-David/sts-school-app/pulls?state=open`) and returned an empty array, so no open PR or branch touches the three allowed paths; `origin/ss1/further-mathematics-fm-wk-t1-w01` and the other FM branches are already merged. No `AGENTS.md` or `QODER.md` exists in the repository. Prerequisites FM-SRC-T1 and FM-PRE-T1 are IMPLEMENTED_TESTING_DEFERRED on master, not verified.
- Original member `1ST TERM S1 FURTHER MATHEMATICS.doc`, SHA-256 `995cba8c37479850ffa65824ad90df34c3294c970f091c8a576d7831a7839145` **verified**, both as the standalone supplied file and as the member extracted from `SSS 1-20260507T072431Z-3-001.zip` at `SSS 1/1st Term SS1_/1ST TERM S1 FURTHER MATHEMATICS.doc`; source `SS1-SRC-e9efc9a976ed`. The standalone member was sufficient, so the composite archive hash `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e` was **not** checked. `archive_member` in the package is unchanged.
- Method, all private and outside Git: (1) word-extractor 1.0.4 `extract()` then `getBody()` — the importer's own call — for the text and the line numbers (1-based lines of `getBody().split('\n')`, 2,152 lines in this member); (2) a superscript/subscript reader written for this session on a private patched copy of word-extractor's OLE body extractor: it walks the CHPX character-format spans of the WordDocument stream and maps the sprm operands back onto the piece table (this corpus stores superscript/subscript as sprm `0x2a48`, operand 1 = superscript, 2 = subscript, not the documented `spmd`/`sprmCSupSub` pair), and it marks the object-anchor characters that word-extractor's `clean()` strips (0x00–0x07) with their character positions. Its output reproduces `getBody()` line for line (2,152/2,152), so the recorded numbering was not changed. (3) the OLE directory of the member was enumerated to count and hash the embedded equation streams. No LibreOffice or Word render was used (the attempts in this session were abandoned; nothing was killed). The importer, compiler, parser, tests and type checks were **not** run.

## Row identity re-derived
SHA-256 of `getBody()` lines 173–287 joined by `\n` is `5afb4090baf876604503aa80e92f0e7c6537967652d9a11f004b0d4520e1aa7c`, 4,831 characters — equal to the parsed row 1 id in `docs/ss1/work/SS1-03/evidence/parsed_rows.json`. Lines 145–172 are the blank gap after Week 1; `WEEK TWO` starts at line 173 and `WEEK THREE` at line 333.

## Scheme rows and row classification
- Scheme line 25: `2 Indicial and Exponential Equations` — one topic, **no sub-objectives listed** (line 26 is a blank tab). The week's objectives therefore come from the row's own CONTENT bullets, as FM-PRE-T1 recorded for week 1.
- Body row 1 (`WEEK TWO`, `TOPIC: INDICIAL AND EXPONENTIAL EQUATIONS`, lines 173–287) is an ordinary **teaching row**: not REVISION, EXAMINATION or SCHEME_ONLY, and its `WEEK TWO` label is not stranded, so **no source rule was added** (no `classify_marker`, no `attach_stranded_label`, no `split_before`).
- Heading and framing lines: 173 label, 174 topic, 175 `CONTENT`, 176 and 177 the two bullets (block 173–179, SHA-256 `6765599a146a790a8eaa271163f03be4623b6e6c7e01c1f3a251ce4e581ec6f6`).

## Coverage entries added (both PARTIAL, `lesson_ids` = the row id)
| Id | Objective (row's own bullet) | Source lines | Block SHA-256 |
|---|---|---|---|
| `COV-FM-T1-W02-OBJ-1` | exponential equation of **linear** form: the equal-base principle, five worked examples a)–e), three-item Evaluation, weekend items 1, 2, 5 | 176, 178–210, 212–214, 279–280, 283 | examples 181–210 `b33800c01a6ba53698fc66e086079f2c51e1d578e32f30658367c6c2f34f13b3`; evaluation 212–214 `ff933853a3dd0677d4cfda7fac1b5cc98275b3238b04b3c87f8f428cbc41549e` |
| `COV-FM-T1-W02-OBJ-2` | exponential equation of **quadratic** form: substitution, three worked examples a)–c) with the negative branch rejected, two-item Evaluation, general evaluation, weekend items 3–4, theory | 177, 216–222, 224–266, 268–269, 271–274, 281–282, 285–287 | 216–222 `f0536b2ba8c377c5ef4beb6dc93623743dd9adf7a2ce4f9b86c670ea0ea07c35`; 224–266 `26265e09909cadeecfc777d256fc46b5760a46d6517c2fe61a186d0fef4bcf99`; 268–269 `1885c441af3fc49d2d24c083beb0b9917f076858a71cad96e238cf195b32cc4b`; 271–274 `09f492e60a0ef42730a00e6bc5213f7286875c7c943a558ea78a112be71841c8`; 285–287 `45ddc9049e808173c4b07fe0c2f02ba08797fafb95755ac59d4debc693e886f8` |

`COV-FM-T1-R01` keeps status PARTIAL and gains a second evidence entry pointing at the two objective entries; it is a row-level association, not a certification. Reading assignment (line 276, hash `9787f52cd74cfaac56451295141ea6af1accd77e6593e257fec5d86fd74c7f5f`) and weekend block 278–283 (`a05bfafbee60b8f62059422cb0e9523e2480dc86240c5784abcec179942c0a57`) are cited inside those entries. PR71's `SUP-SS1-FMATHS-002` is not on master, was not read at its immutable SHA by this item, and is not bound: the port decision belongs to FM-PORT-D3-L002.

## Work recalculated (reviewer values, for the accuracy check only — not an answer key)
Every worked line was recomputed on 2026-11-05 with decimal evaluation; the row's own arithmetic stands everywhere.

| Line | Item | Row's answer | Recomputed |
|---|---|---|---|
| 183/185–189 a) | (1/2)^x = 8 | −3 | −3 (0.5^−3 = 8) — correct |
| 183/185–193 b) | (0.25)^(x+1) = 16 | −3 | −3 (0.25^−2 = 16) — correct |
| 183/195–198 c) | 3^x = 1/81 | −4 | 3^−4 = 0.012345… = 1/81 — correct |
| 183/195–199 d) | 10^x = 1/0.001 | 3 | 1000 = 1/0.001 — correct |
| 183/200–210 e) | 4/2^x = 64^x | 2/7 | both sides 3.281341424030552 — correct |
| 214 a) | 2^x = 0.125 | — | −3 (unanswered in the row) |
| 214 b) | 25^(5x) = 625 | — | 2/5 (25^2 = 625) |
| 214 c) | 10^x = 1/100000 | — | −5 |
| 220/225–235 a) | 2^(2x) − 6(2^x) + 8 = 0 | 1 and 2 | y^2 − 6y + 8 = (y−2)(y−4); x = 1, 2 — correct |
| 221/237–251 b) | 5^(2x) + 4·5^(x+1) − 125 = 0 | 1 | p^2 + 20p − 125 = (p−5)(p+25); 25 + 100 − 125 = 0 — correct |
| 222/253–265 c) | 3^(2x) − 9 = 0 | 1 | a = ±3; 3^x = 3 → x = 1 — correct |
| 269 a) | 3(2^(2x+3)) − 5(2^(x+2)) − 156 = 0 | — | 24y^2 − 20y − 156 = 0 → 6y^2 − 5y − 39 = 0 → y = 3 → 2^x = 3 → x = log2 3 ≈ 1.585; residual at that x is 5.7e−14 |
| 269 b) | 9^(2x+1) = 81^(x−2)/3^x | — | x = −10 (both sides 3^−38 ≈ 7.4027e−19) |
| 273 a) | 2^(2x+1) − 5(2^x) + 2 = 0 | — | x = 1 and x = −1 |
| 274 b) | 3^(2x) − 4(3^(x+1)) + 27 = 0 | — | x = 1 and x = 2 |
| 279 | (0.25)^(x+1) = 16 | — | −3, option (a) — the same equation as example b) at 183 |
| 280 | 3(3)^x = 27 | — | 2, option (c) |
| 281 | 2^(2x) + 2^(x+1) − 8 = 0 | — | 1, option (a); y^2 + 2y − 8 = (y+4)(y−2), y = −4 rejected |
| 282 | "second value of x in question 3" | — | no second value exists; only (d) No solution is defensible |
| 283 | 10^(−x) = 0.000001 | — | 6, option (b) |
| 287 1) | ((3^x))^2 + 2(3^x) − 3 = 0 | — | 0 (y = 1; the zero index is a week-1 result) |
| 287 2) | 5^(2x+1) − 26(5^x) + 5 = 0 | — | 1 and −1 |

## Factual defects (open item `OI-FM-T1-W02-FACT-DEFECTS`)
| # | Line | Defect |
|---|---|---|
| 1 | 179 | principle stated unconditionally and its converse claimed: a^x = a^y → x = y needs a > 0 and a ≠ 1; "vice versa" is false (4^2 = 2^4) |
| 2 | 183, 185, 193, 279, 280 | unknown is x in the question, X in the working |
| 3 | 197–198 | `10^x = 10^3` written twice |
| 4 | 183 vs 221, 238 | x serves as both the unknown and the multiplication sign; indistinguishable once flattened |
| 5 | 246–251, 264–265 | the negative branch is dropped ("Since 5^x = p, p = 5") with no stated reason |
| 6 | 225–235 | two-column working interleaved by the extractor; conclusions right, reading order broken |
| 7 | 251–252, 265–266 | both rejected-branch conclusions are embedded objects, so the text is missing entirely |
| 8 | 269 | Evaluation item (a) needs x = log2 3 — a week-3 (Logarithms) method this row does not teach |
| 9 | 282 | asks for a "second value" that question 3 does not have |

Everything else stands, as the table above shows.

## Lost notation (open item `OI-FM-T1-W02-NOTATION-LOSS`)
Census measured on this member with the CHPX reader: parsed row 1 carries **268 superscript groups over 51 lines and no subscript groups**; the whole document carries 1,105 superscript and 229 subscript groups. word-extractor flattens all of them, so line 220 arrives as `22x - 6 (2x) + 8 = 0` and line 214 as `25 (5x) = 625`. Three object anchors inside the row are deleted by the extractor's `clean()`: character positions 7711 and 7714 (line 252) and 7924 (line 266). The OLE directory of the member holds exactly **two** `Equation Native` (Microsoft Equation 3.0) streams, 41 bytes each, byte-identical, content SHA-256 `90cd4ff61eb943baef83b6d8a5d4509cca596be6e9a4bd5e49c9cf2d339b0655`; the payload was not decoded here (an inflate of the compressed tail failed at every offset), and the anchor-to-pool mapping was not established — it needs the ObjectLocation FSPA table. Doc-wide, `getBody()` shows 18 object anchors at lines 252, 266, 1051, 1476, 1478, 1483, 1493, 1997 and 2021 (several lines carry more than one), which **corrects** the sentence in `FM-WK-T1-W01.md` that all of the document's embedded objects sit after the Week 2 label: three of them sit inside Week 2. Unicode that survives includes the en dash used as a minus (187, 189, 220) and `÷` (201–202). No picture, text box or subscript occurs in the row. The per-row census across the term and the extractor decision remain with FM-FACT-EQUATION-LOSS-T1 and OI-FM-001; this item measured Week 2 only and claims no term-wide equation-loss figure.

## Assessment gaps and the Week 1 linkage (open item `OI-FM-T1-W02-ASSESSMENT-GAPS`)
Thirteen practice items across five blocks (Evaluation 212–214 ×3, quadratic Evaluation 268–269 ×2, General Evaluation 271–274 ×2, Weekend 278–283 ×5, Theory 285–287 ×2) have **no** answer, solution or marking anywhere in the row; only the eight examples are worked. Reading assignment (276) names "Further Mathematics Project Book 1(New third edition).Chapter 2 pg. 6- 10" while the scheme references (46–48) name "Further Mathematics project 1 by Tuttuh Adegun et al"; the page range was not checked against the book.

**Does Week 2 support the exponential-equation questions carried in Week 1? Established from the text, not from the titles: yes in method, no in delivery.**
- Week 1 Weekend item 1 (line 136, `Evaluate 3^{x} = 1/81`) is the *identical* equation to Week 2 example c) (line 183), and Week 2 solves it literally at lines 195–198: `3^x = 1/3^4`, `3^x = 3^-4`, `x = -4` — which is Week 1's option (b).
- Week 1 item 3 (line 138, `3^{-y} = 243`) and item 4 (line 140, `25^{-5n} = 625`) are linear-form applications of the principle Week 2 states at line 179 and works in the one-base pattern of lines 186–193; they evaluate to y = −5 (Week 1 option (a)) and n = −2/5 (option (d)).
- Caveats recorded with the finding: Week 2 teaches this *after* the questions are set in Week 1; neither row supplies a key; Week 2's own linear Evaluation b) (`25^(5x) = 625`, line 214) is the same shape and is itself unanswered; and the Week 1 supplement `SUP-SS1-FURTHER-MATHEMATICS-T1-W01-INDICES` deliberately did not reproduce those three items, so its `COV-FM-T1-W01-OBJ-2` entry still reads "pending FM-WK-T1-W02 confirmation". That entry and `OI-FM-T1-W01-ASSESSMENT-GAPS` were **not** edited by this item — this record and `COV-FM-T1-W02-OBJ-1` are the confirmation they ask for, and the Week 1 gate items stay OPEN and blocking. Week 1 delivery stays unbound (`FM-COR-T1-W01` is PENDING).

## Queue changes
- `FM-WK-T1-W02` → IMPLEMENTED_TESTING_DEFERRED with the findings above.
- Added PENDING `FM-LES-T1-W02-EQUATIONS` (one replacement for both objectives, only if `FM-PORT-D3-L002` does not port an acceptable one), `FM-COR-T1-W02` (binds the row to that single replacement) and `FM-FACT-T1-W02-EQ-OBJECTS` (what the two lost equation objects displayed). The three are added to `FM-SCOPE-OI-FM-002.depends_on`, matching what FM-WK-T1-W01 did for Week 1.
- `counts` recomputed (89 items; LESSON 7→8, CORRECTION_BINDING 7→8, FACTUAL_DEPENDENCY 10→11) and `status_counts` recomputed (IMPLEMENTED_TESTING_DEFERRED 24, PENDING 58, BLOCKED 7).
- `next_runnable` is **unchanged** at `FM-SEC-T3-W08-PERIOD3`: it is still PENDING and still dependency-satisfied, and repointing it would re-plan the 3rd-Term chain another worker left there (the same choice FM-LES-T1-W01-INDICES recorded). For the record, the first dependency-satisfied PENDING item in array order is now `FM-FACT-T1-W02-EQ-OBJECTS`, followed by `FM-WK-T1-W03`.
- Duplicate-ID, dependency-integrity and reference checks were run over the whole queue and package: no duplicate item or entry id, every `depends_on` target exists, every new `affected_ids`/`lesson_ids` value resolves to a registered source id, a parsed-row body hash, an existing coverage entry or an existing lesson.
- The package JSON was validated against a line-by-line reimplementation of `backend/src/db/ss1/subjectPackageSchema.ts` (strict key sets, enums, non-blank text, 64-hex digests, `SUP-SS1-…` lesson id regex). A real Zod parse could not be run: the repository's `node_modules` is not installed in this environment and installing/running it is part of the deferred testing.

## Not done
No lesson, correction, asset or source rule authored; no source row changed; no approval, verification, teacher decision, rights or source fact invented; nothing run (tests, type checks, importer, compiler, database, device) — deferred by owner. `package_status` stays PENDING and Week 2 is not certified or delivered. `FM-PORT-D3-L002` (PR71 `SUP-SS1-FMATHS-002`) was deliberately not read at its immutable SHA or ported here: that is its own item, and its candidate must now be checked against `OI-FM-T1-W02-FACT-DEFECTS`.
