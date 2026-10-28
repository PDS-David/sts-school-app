# FM-WK-T1-W01 — Further Mathematics, 1st Term Week 01 objective indexing

Status: **IMPLEMENTED_TESTING_DEFERRED** (implemented; not approved, not verified). Testing deferred by owner. Week 01 is **not fully covered**: both objectives are PARTIAL and the row needs a replacement, which this item does not author.

## Inputs
- Starting SHA: `38a2a05ee3093f1c861656d57b64641f77c1952b` (origin/master). No open branch or PR for this item was found (remote branches listed; the PR list API was not available to this session). Prerequisites FM-SRC-T1 and FM-PRE-T1 were IMPLEMENTED_TESTING_DEFERRED on master, not verified. No `AGENTS.md`.
- Original member `1ST TERM S1 FURTHER MATHEMATICS.doc`, SHA-256 `995cba8c37479850ffa65824ad90df34c3294c970f091c8a576d7831a7839145` **verified** against the prompt, QUEUE.json and `SOURCE_ASSIGNMENTS.csv` (source `SS1-SRC-e9efc9a976ed`, 1,460,736 bytes).
- Supplied container: a partial ZIP named `1st_Term_SS1_-20230730T171406Z-001.zip`, SHA-256 `8055d852938afa44d20b03139af9958b0c9f7da6874419aa667174854895e636`, member path `1st Term SS1 /1ST TERM S1 FURTHER MATHEMATICS.doc`. It is **not** the composite archive; the composite hash `02448712…9c3e` was **not** checked. `archive_member` in the package stays as the manifest value.
- Method, all private and outside Git: word-extractor 1.0.4 `getBody()` (the importer's call) for line numbers; a LibreOffice 41-page PDF render, page images viewed; an ODT conversion to count superscript runs, drawings and embedded objects inside the row. The importer, compiler and parser were not run. Line numbers are 1-based lines of `getBody().split('\n')`.
- Row identity re-derived: SHA-256 of lines 65–144 joined by `\n` is `621448ae265154b2df510f38fd61d342b29b0b93e742aa7e53c2d93bc1b74cc2`, equal to the registered id. Lines 145–172 are blank; Week 2 starts at line 173.

## Scheme rows and row classification
- Scheme line 23: `1 Indices: Basic Laws & Application of indices` (the week-1 objective source, mapped by FM-PRE-T1 block PRE-04). Line 24 is a blank tab.
- Body row 0 (`WEEK ONE`, `TOPIC: INDICES`, lines 65–144) is an ordinary **teaching row**: not REVISION, EXAMINATION or SCHEME_ONLY, so no `classify_marker` rule was added. Its heading lines 65–67 hash to `8188b507…6ff5`.
- The row's own CONTENT bullets (lines 68–69, hash `786624df…fe66`) split the scheme topic into two objectives, so there are two coverage entries.

## Coverage entries added (both PARTIAL, `lesson_ids` = the row id)
| Id | Objective | Source lines | Block SHA-256 |
|---|---|---|---|
| `COV-FM-T1-W01-OBJ-1` | basic concept and eight laws of indices | 70–108 (definition 71–72, laws 73–105, evaluation 107–108) | `ad52a073…de57` |
| `COV-FM-T1-W01-OBJ-2` | application of the laws | 110–144 (examples 112–128, general evaluation 130–131, reading 133, weekend 135–140, theory 142–144) | `35d60c52…7e60` |

Per-law hashes (lines): law 1 73–76 `7d4d3c0f…4e88`; law 2 78–79 `0c16faa7…a8d2`; law 3 81–83 `58a05f74…6243`; law 4 85–90 `4add6e0a…d09c`; law 5 92–93 `48a56c0c…ce73`; law 6 95–96 `0e0e5a52…d86e`; law 7 98–100 `2862a62f…1d56`; law 8 102–105 `89c5a642…ea716`. Full values are reproducible with the method above.

`COV-FM-T1-R00` keeps status PARTIAL and gains a second evidence entry pointing at the two objective entries. PR71's `SUP-SS1-FMATHS-001` is not on master, was not read at its SHA here, and is not bound.

## Factual defects (open item `OI-FM-T1-W01-FACT-DEFECTS`)
Reviewer values recomputed for the check only; they are not an answer key.

| # | Line | Defect |
|---|---|---|
| 1 | 88, 85–87 | "Any number raised to power of zero is 1" is false for 0; derivation needs a ≠ 0 |
| 2 | 100 | "27^(1/3) = ∛27 = 3 ie (3)^3 = 3": last equality false, 3^3 = 27 |
| 3 | 105 | "27^(2/3) = ∛27 = 3^2 = 9": ∛27 = 3, the 2 belongs outside the root; 9 is right |
| 4 | 71 | "a is multiplied by itself m times" (m factors of a); sentence ends on a comma; no restriction on m |
| 5 | 78, 95, 98 | a ≠ 0 and non-negative base for even roots omitted |
| 6 | 103 | skips ⁿ√(a^m) between (a^m)^(1/n) and (ⁿ√a)^m |
| 7 | 114, 125 | example iv printed "0.001" but solved as (0.001)^3; "(0.001)^3 = (1/100)^3" is wrong, 0.001 = 1/1000 (final 10^-9 right) |
| 8 | 120, 123 | unbalanced brackets; 4^2 never evaluated to 16 |
| 9 | 86, 90 | zero exponent typed as letter o |
| 10 | 113 | "Solve" used for evaluation items |
| 11 | 131 | (f) 625^(3/8) × 25 = 125√5 as printed; 625^(3/4) × 25 = 3125; intent unconfirmed |
| 12 | 137 | weekend item 2 is in r, three options in p/P |

Stand (correct values): laws 1–3, 5, 6 apart from the conditions in 5; examples i (8), ii (49), v (1); weekend options 1: −4, 2: 18r^8, 3: −5, 4: −2/5, 5: 10^−8 are all present.

## Lost notation (open item `OI-FM-T1-W01-NOTATION-LOSS`)
No equation objects, pictures, text boxes or subscripts exist in lines 65–144 (ODT conversion: zero drawings or objects in the row; the 11 embedded objects all sit after the Week 2 label; the only picture on those pages is the page-2 letterhead already in OI-FM-007). About 121 superscript runs are flattened to baseline. Worst cases: line 108 item 2 is 1000000000 with a superscript 0 but extracts as `10000000000`; lines 100, 105, 119 `3√27` reads as 3 × √27; line 136 `3 x = 1/81` and line 138 `3-y = 243` read as products and differences; line 140 `10-8`; lines 143–144 stacked fractions and `163/2`. Unicode ½, ¾, √ and ÷ survive.

## Assessment gaps (open item `OI-FM-T1-W01-ASSESSMENT-GAPS`)
No answers, solutions or marking for 16 practice items. Weekend items 1, 3, 4 need exponential equations, which scheme week 2 teaches. Reading assignment cites "Further Mathematics project book 1 (New third edition), Chapter 2 pg. 4–6"; the scheme names "Further Mathematics project 1 by Tuttuh Adegun et al"; the page range was not checked.

## Queue changes
- FM-WK-T1-W01 → IMPLEMENTED_TESTING_DEFERRED.
- Added PENDING `FM-LES-T1-W01-INDICES` (one replacement for both objectives, only if `FM-PORT-D3-L001` does not port an acceptable one) and `FM-COR-T1-W01` (binds the row to that single replacement); added BLOCKED `FM-FACT-T1-W01-GEN-EVAL-F` (teacher or owner confirms the exponent in item (f)). The three are added to `FM-SCOPE-OI-FM-002.depends_on`.
- `FM-PORT-D3-L001` gained a note that the row needs a replacement and that the PR71 lesson must pass the defect list.
- Counts recomputed (85 items: 19 implemented, 59 pending, 7 blocked). `next_runnable` is the first dependency-satisfied PENDING item in queue order, `FM-PRE-T2`; the previous value `FM-WK-T1-W01` was inconsistent with the FM-PRE-T1 note and is superseded.

## Not done
No lesson, correction or asset authored; no source row changed; no hash or rule guessed; nothing run. Testing deferred by owner.
