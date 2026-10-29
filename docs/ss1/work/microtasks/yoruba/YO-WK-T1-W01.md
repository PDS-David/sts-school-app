# YO-WK-T1-W01 — Yoruba, 1st Term, Week 1 objective indexing

Status: **IMPLEMENTED_TESTING_DEFERRED** (implemented; not approved, not verified). Testing deferred by owner. Week 1 is **not delivered**: all 15 coverage entries are PARTIAL and three lesson items plus one factual-dependency item are appended.

## Inputs
- Base: origin/master `4159336c7068d2235209221f5f14adc4986acec5`. This item is stacked on `ss1/yo-inv-t3-20261029` (PR #195, unmerged) because PRs #193–#195 all edit the same `QUEUE.json`; their queue edits are carried unchanged.
- Prerequisite `YO-SRC-T1` is `IMPLEMENTED_TESTING_DEFERRED` on master. No open PR owned YO-WK-T1-W01 when work started.
- Source `SS1-SRC-48b641249e3b`, manifest member `SSS 1/1st Term SS1_/YORUBA.docx`, 55,974 bytes, SHA-256 `7403d8243ee646a221bb3d92fe18d202c73be0bde4deb10fa68a3dec0b4a6aef` **re-verified this run** from the supplied archive (SHA-256 `02448712…65c9a3e`), matching the prompt and the package.
- Method (private, outside Git): a separate copy read with `mammoth` 1.12.2 `extractRawText({path})`: 26,329 characters, 1,781 lines; `word/document.xml` inspected for tables and objects. Line numbers are 1-based lines of `extractRawText().split('\n')`; hashes are SHA-256 over the stated lines joined with `\n`, edge blanks trimmed, UTF-8. Importer, parser and compiler were not run.

## Scheme mapping
- The opening list (lines 9–51, 22 topic paragraphs, SHA-256 `afccd54e…b4f6af6`) carries **no week numbers and no week markers**. Week 1 is the first three topics, identified by position and by exact heading match against the three `AKOLE ISE` lines:

| Scheme topic | Line | Hash (1 line) | Matches |
|---|---|---|---|
| `Atunyewo awon eya ara ifo` | 9 | `72850693…84d17d6b` | EDE heading line 65 |
| `Atunyewo Eko ile- asa ikini ` (trailing space) | 11 | `dace5d13…9ff56d0c` | ASA heading line 107 |
| `Atunyewo orisirisi eya litireso ` (trailing space) | 13 | `53aa8bdd…51fe7763` | LITIRESO heading line 239 |

- The mapping inference is recorded as open item `YORUBA-T1-W01-SCHEME-MAPPING`; hash-accounting and classification of the whole list belong to `YO-PRE-T1-1` (PENDING).
- The list has 22 topics but the body has 21 strand parts. Topic 12 (`Ogbon itopinpin litireso ede Yoruba`, line 31) sits where the Week 4 LITIRESO objective would be and has no matching body part; that observation belongs to `YO-WK-T1-W04` and was not indexed here.

## Section
- Teaching label `OSE KIN-IN-NI`, line 61, SHA-256 `3dbfebf0…5bbebcee3`; section lines 61–310, SHA-256 `953d3f997edbec82be8ffbe9ccfa54e09fd174edd15dd2779d0fd9362eacc940`.
- Parts: `EKA ISE: EDE` 63–101 (`5e55d860…0ff644ee`), `EKA ISE: ASA` 105–233 (`1fee1829…f9abb400`), `EKA ISE: LITIRESO` 237–279 (`16a4aa75…d2073df106f97d`), `Igbelewon` 281–293 (`44282742…47c0ae11`), `Ise asetilewa` 295–307 (`08d0f669…0ad1ed15`).
- The parser produces **no rows** for this source (Yoruba ordinal headings; `YO-FND-T1-01`), so no `SS1-SRC-48b641249e3b:BODY:<sha256>` identity exists. Every coverage entry therefore cites exact line ranges and UTF-8 block hashes, with `lesson_ids: []`.

## Coverage entries added (15, all PARTIAL)
| ID | Objective | Lines | Block SHA-256 |
|---|---|---|---|
| `YO-T1-W01-SCHEME-EDE` | Scheme topic 1 bound to the EDE part | 9; 63–101 | `72850693…`; `5e55d860…` |
| `YO-T1-W01-SCHEME-ASA` | Scheme topic 2 bound to the ASA part | 11; 105–233 | `dace5d13…`; `1fee1829…` |
| `YO-T1-W01-SCHEME-LIT` | Scheme topic 3 bound to the LITIRESO part | 13; 237–279 | `53aa8bdd…`; `16a4aa75…` |
| `YO-T1-W01-EDE-01` | Speech organs defined and their function | 65–67 | `9316a3f2…` |
| `YO-T1-W01-EDE-02` | Visible and invisible organ classes with examples | 69–73 | `c649f234…` |
| `YO-T1-W01-EDE-03` | Afipe: asunsi and akanmole classes with examples | 77–83 | `58a1bf0f…` |
| `YO-T1-W01-EDE-04` | Tongue position: front, central, back vowel sets | 85–95 | `a6668cfd…` |
| `YO-T1-W01-EDE-05` | Lip position: spread and rounded vowel sets | 97–101 | `a8e7c684…` |
| `YO-T1-W01-ASA-01` | Home training as moral upbringing; greeting obligation | 107–113 | `e23f07dc…` |
| `YO-T1-W01-ASA-02` | Seven time-of-day greetings (table 0) | 117–165 | `7d14e249…` |
| `YO-T1-W01-ASA-03` | Seven occupation greetings and responses (table 1) | 169–233 | `877987fb…` |
| `YO-T1-W01-LIT-01` | Literature defined; two broad types | 239–247 | `88c3ab93…` |
| `YO-T1-W01-LIT-02` | Litireso alohun and three sub-types | 249–265 | `a6205bc4…` |
| `YO-T1-W01-LIT-03` | Litireso apileko and three sub-types | 267–279 | `50ab3768…` |
| `YO-T1-W01-ASSESS` | Six Igbelewon questions and six greeting tasks, no key | 281–293; 295–307 | `44282742…`; `08d0f669…` |

Full values are reproducible with the method above. All 15 are PARTIAL: the source teaches each objective, but no deliverable lesson exists, the row identity gap blocks parsed delivery, and the defects below must be corrected before teaching.

## Source defects (open item `YORUBA-T1-W01-SOURCE-DEFECTS`)
| # | Line | Defect |
|---|---|---|
| 1 | 93 | Central vowel set `Awon ni, a, en.` should be `a, an`; `en` duplicates the front nasal set at 91 and the 5+2+5 = 12 inventory does not close otherwise |
| 2 | 71, 83 | `evigi` at 71 vs `erigi` at 83; `iwaju a lo n` and `aarin lion` for *iwaju ahon* / *aarin ahon*; `e yin isale` spaced; both `aja enu` and `aja-enu` listed |
| 3 | 81 | `Eju isale` where line 71 has `eyin isale` (lower teeth) |
| 4 | 199 | Babalawo greeting/response `Aboru boye, sboye bo sise` is garbled; response column is `Amin` |
| 5 | 253 | Explanatory sentence garbled: `Litireso alohun kun fun o gbon imo ati oye agba, nigba ti imo moo ko moo-ke ko ti de ile wa ohun ni awon baba nla wa n lo ninu igbo ke gbodo won.` |
| 6 | 269 | `Litireso yin je litireso alakosile.` (*yin* for *yi*) |
| 7 | 261–265, 275–279 | Sub-type lists use the letters `a.`, `b.`, `d.`; `c` is omitted |
| 8 | 143–165 | Time-table numerals mix case (`I, Ii, Iii, Iv, V, Vi, Vii`); `Iv` should read `IV` |
| 9 | 299 | `Ontayo` in the greeting task is unexplained; it is not the name of a known greeting addressee |

No correction wording is authored here; the lessons must not copy the uncorrected text.

## Notation (open item `YORUBA-T1-W01-NOTATION`)
- The document contains no tone-marked or sub-dot letters at all (confirmed by `YO-INV-T1`: 0 characters in U+1E00–U+1EFF, 0 combining marks, 0 accented Latin-1 letters). Week 1 writes every vowel with plain `e`/`o`, so e/ẹ and o/ọ cannot be distinguished and the EDE-04/EDE-05 sets cannot be verified; greetings also lose tone, which changes meaning and orthography. No marks were added or normalised.

## Assessment and visuals
- `Igbelewon` (281–293) has six questions; all six paragraphs carry Word automatic numbering (`w:numPr`), so `extractRawText` shows no numbers. `Ise asetilewa` (295–307) has six greeting tasks. Neither has answers or marking (open item `YORUBA-T1-W01-ASSESSMENT-GAPS`).
- Week 1 contains Word tables 0 and 1 (`IGBA / AKOKO`, 8 rows × 24 cells; `ISE / IKINI / IDAHUN`, 8 rows × 32 cells) whose structure is flattened in the extraction; `YO-VIS-T1-03` owns the structural capture. No drawing, picture, OLE object, equation or media file occurs in the Week 1 lines.

## Queue changes
- YO-WK-T1-W01 → `IMPLEMENTED_TESTING_DEFERRED`; previous `next_runnable` value consumed.
- Appended 4 PENDING/BLOCKED items, all depending on `YO-SRC-T1` and `YO-WK-T1-W01`:
  - `YO-LES-T1-W01-EDE`, `YO-LES-T1-W01-ASA`, `YO-LES-T1-W01-LIT` (LESSON, PENDING, also depending on `YO-FACT-T1-W01-DEFECTS`) — one small replacement lesson per strand.
  - `YO-FACT-T1-W01-DEFECTS` (FACTUAL_DEPENDENCY, BLOCKED) — one recorded expert decision on the nine defects and the notation.
- Counts: 53 items, kinds add LESSON 3 and FACTUAL_DEPENDENCY 1; status 7 implemented / 45 pending / 1 blocked; `next_runnable` → `YO-WK-T1-W02`, the first eligible PENDING item in queue order. `YO-SCOPE-OBJECTIVE-INDEXING.depends_on` was not changed (44).

## Limits
- Indexing only: no lesson authored, no asset, no package delivery change, no schema or compiler edit, no parser/importer run. `yoruba.json` was edited only to add coverage and open items. Testing deferred by owner.
- Not approved and not verified. The scheme mapping is inferred and flagged; no objective was invented beyond the source text.
