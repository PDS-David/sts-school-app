# YO-WK-T1-W04 — Yoruba, 1st Term, Week 4 objective indexing

Status: **IMPLEMENTED_TESTING_DEFERRED** (implemented; not approved, not verified). Testing deferred by owner. Week 4 is **not delivered**: all 19 coverage entries are PARTIAL and three lesson items plus one factual-dependency item are appended.

## Inputs
- Base: origin/master `f4f0719d57b11fba39b499501060da59efe6532b` (the merge of PR #198, Week 3). PR #198 was merged before this item started, so this branch's only difference from master is the three Week 4 files.
- Prerequisite `YO-SRC-T1` is `IMPLEMENTED_TESTING_DEFERRED` on master. `YO-WK-T1-W04` was the previous `next_runnable` and no open PR owned it when work started.
- Source `SS1-SRC-48b641249e3b`, manifest member `SSS 1/1st Term SS1_/YORUBA.docx`, 55,974 bytes, SHA-256 `7403d8243ee646a221bb3d92fe18d202c73be0bde4deb10fa68a3dec0b4a6aef` **re-verified this run** from the supplied archive (SHA-256 `02448712…65c9a3e`).
- Method (private, outside Git): mammoth 1.12.2 `extractRawText({path})`: 26,329 characters, 1,781 lines; `word/document.xml` (341,791 characters, SHA-256 `d304cd2c4dba474e73534237df225ec72a461202f57265c1bdc17adcf481fb08`) parsed into top-level body elements to locate tables, automatic numbering, drawings and objects. Line numbers are 1-based lines of `extractRawText().split('\n')`; hashes are SHA-256 over the stated lines joined with `\n`, edge blanks trimmed, UTF-8. The importer, parser and compiler were not run.

## Scheme mapping
- The opening list (lines 9–51, 22 topic paragraphs, SHA-256 `afccd54e…b4f6af6`) carries **no week numbers and no week markers**. Week 4 is topics 10–12:

| Scheme topic | Line | Hash (1 line) | Matches |
|---|---|---|---|
| `Itesiwaju lori eko nipa iro ede ` | 27 | `2642e28a…fe8fa06b` | EDE heading line 729, in capitals and without `nipa` |
| `Sise ounje awujo Yoruba` | 29 | `654a6c5a…2b00b2f7` | ASA heading line 1099, word for word (trailing space aside) |
| `Ogbon itopinpin litireso ede Yoruba` | 31 | `8eeec8c9…c9cba778` | LITIRESO heading line 1131, in capitals and prefixed `LITIRESO: ` |

- As in Weeks 2 and 3, the three topics appear in the same order as the three body strands (EDE, ASA, LITIRESO). Topic 10 (line 27) still needs position: it differs from line 15, Week 2 topic 4, only by one trailing space, and heading 729 drops `nipa` from the scheme title. Topic 12 (line 31) matches heading 1131 apart from the `LITIRESO: ` prefix and a double space after the colon. The heading at 1131 is **not** written in the `EKA ISE: LITIRESO` form used by Weeks 1–3, which is why the YO-INV-T1 reference recorded no LITIRESO heading for Week 4; the heading exists (defect 8).
- The next topic, line 33 `Itesiwaju lori eko lori iro ede (iro ohun )`, is Week 5: the week label `OSE KARUN-UN` is at 1171 and the heading at 1175 reads `AKOLE ISE: ITESIWAJU LORI EKO IRO EDE YORUBA (ILO OHUN).`, which does not match the scheme's parenthetical. The inference is recorded as open item `YORUBA-T1-W04-SCHEME-MAPPING`; hash-accounting and classification of the whole list belong to `YO-PRE-T1-1` (PENDING).

## Section
- Teaching label `OSE KERIN`, line 725, SHA-256 `bab8696…72c4c14b`; section lines 725–1170 as recorded by YO-INV-T1, of which the trimmed section 725–1167 has SHA-256 `237de99a8e8fd2a31bd829d116d0b731d3c1200a53e632f90ca0979e4d0ec5b7`, equal to the YO-INV-T1 value (the extra lines are the three blanks before Week 5 at 1171).
- Parts: `EKA ISE: EDE` 727–1079 (`701da6bd…f64a2620`), `EKA ISE: ASA` 1097–1119 (`ff92bdf9…3bb16c61`), `LITIRESO` 1131–1147 (`b66ad1ab…faf03136`), `Igbelewon` 1149–1159 (`79355717…085b9163`), `Ise asetilewa` 1161–1167 (`21f3e180…db49f553`).
- Week 4 contains **four Word tables**: table 3 (`IBI ISENUPE`, 3 x 9) at 749–801 (`3dde3ebd…cc109f2e`), table 4 (`ONA ISENUPE`, 3 x 8) at 815–861 (`6df126d2…0c256c8f`), table 5 (`IRO KONSONANTI`, 3 x 3) at 871–885 (`f566899a…250eea30`) and table 6 (`ATE IRO KONSONANTI`, 10 x 9) at 889–1079 (`65d31d3c…f8275942`). There is no drawing, picture, text box, OLE object, equation, media file or VML shape in the week.
- The parser produces **no rows** for this source (Yoruba ordinal headings; `YO-FND-T1-01`), so no `SS1-SRC-48b641249e3b:BODY:<sha256>` identity exists. Every coverage entry therefore cites exact line ranges and UTF-8 block hashes, with `lesson_ids: []`.

## Coverage entries added (19, all PARTIAL)
| ID | Objective | Lines | Block SHA-256 |
|---|---|---|---|
| `YO-T1-W04-SCHEME-EDE` | Scheme topic 10 bound to the EDE part | 27; 727–1079 | `2642e28a…fe8fa06b; 701da6bd…f64a2620` |
| `YO-T1-W04-SCHEME-ASA` | Scheme topic 11 bound to the ASA part | 29; 1097–1119 | `654a6c5a…2b00b2f7; ff92bdf9…3bb16c61` |
| `YO-T1-W04-SCHEME-LIT` | Scheme topic 12 bound to the LITIRESO part | 31; 1131–1147 | `8eeec8c9…c9cba778; b66ad1ab…faf03136` |
| `YO-T1-W04-EDE-01` | Consonant defined; three classification criteria named | 731–733; 735–741 | `3901ffd1…346f9183; 8e6295cb…b6188849` |
| `YO-T1-W04-EDE-02` | Place of articulation defined; eight place classes tabulated | 743; 749–801 | `d1b485f6…87e4eee6; 3dde3ebd…cc109f2e` |
| `YO-T1-W04-EDE-03` | Manner of articulation defined; seven manner classes tabulated | 805; 815–861 | `7970c617…0030ae4b; 6df126d2…0c256c8f` |
| `YO-T1-W04-EDE-04` | Glottis state defined; voiced and voiceless classes tabulated | 865; 871–885 | `03435158…2715d5a5; f566899a…250eea30` |
| `YO-T1-W04-EDE-05` | ATE IRO KONSONANTI chart (10 x 9 Word table) | 889–1079 | `65d31d3c…f8275942` |
| `YO-T1-W04-ASA-01` | Ounje defined; the proverb on food and work | 1101–1103 | `156e16fe…5227cee0` |
| `YO-T1-W04-ASA-02` | Farming named as the leading occupation; food crops listed | 1105 | `76f796be…9474d38c` |
| `YO-T1-W04-ASA-03` | Iyan prepared from yam | 1107–1111 | `7a07c64e…8b463cad` |
| `YO-T1-W04-ASA-04` | Amala prepared from plantain | 1113–1115 | `84d2d7c7…b47af563` |
| `YO-T1-W04-ASA-05` | Aadun prepared from maize | 1117–1119 | `92a8fe45…d772a9d9` |
| `YO-T1-W04-LIT-01` | Theme (koko-oro) | 1135–1137 | `ed10fe48…7081ce0e` |
| `YO-T1-W04-LIT-02` | Use of language (ilo-ede) and the named devices | 1139 | `d91ebbf2…e16d0cc1` |
| `YO-T1-W04-LIT-03` | Yoruba culture (asa) as a source element | 1141 | `ded73f75…5fff64d7` |
| `YO-T1-W04-LIT-04` | Character (eda itan) and the protagonist | 1143–1145 | `16c6d8d3…70b3103c` |
| `YO-T1-W04-LIT-05` | Setting (ibudo itan) | 1147 | `f2acba2d…f6bb6c2e` |
| `YO-T1-W04-ASSESS` | Five Igbelewon questions and three practical items, no key | 1149–1159; 1161–1167 | `79355717…085b9163; 21f3e180…db49f553` |

Full values are reproducible with the method above. All 19 are PARTIAL: the source teaches each objective, but no deliverable lesson exists, the row identity gap blocks parsed delivery, and the defects below must be corrected before teaching.

## Source defects (open item `YORUBA-T1-W04-SOURCE-DEFECTS`)
| # | Line | Defect |
|---|---|---|
| 1 | 731–733 | The heading `Apejuwe  iro konsonanti` has a double space and the definition (`idiwo maa n wa fun eemi`, `ti a fi gbe won jade`) does not parse cleanly |
| 2 | 735–741 | The three classification criteria are only named; `Ipo alafo tan-an-na` is never explained and is renamed `Ipo tan-an-na` at 865 |
| 3 | 749–801 | Table 3: the bilabial row `B, m` omits `p`, `J,s` writes `s` for `ṣ`, so 18 tokens give only 17 distinct consonants; the gloss column is garbled and `Afitan - an-na – pe` is spaced with the week's only en dash |
| 4 | 815–861 | Table 4: `Afegbe-enu-pe` lists capital `I` where `l` is meant, `Asesi` lists `J` although table 6 writes `Dz`, the Asenupe gloss ends at `nigba ti a si`, and the Afunnupe gloss is garbled |
| 5 | 871–885 | Table 5: the voiced list `D,j,gb,m,n,r,l,y,w` omits `b` and `g`; the voiceless list `P,k,f,s,s,h,t` writes `s` twice, so 16 tokens cover 15 distinct consonants; both glosses are garbled |
| 6 | 889–1079 | Table 6: 10 x 9 chart omits `P` and `Y`, writes `Dz` where `J` belongs while `J` appears in the Aseesetan row with `W`, uses `II` for `l`, spells `Akinyun` in three rows, splits four place headers across two paragraphs and garbles `Afafaseu`/`Fetepe`; no cell is merged, so the row header is carried by blanks |
| 7 | 1097–1119 | ASA: `Ouje` for `Ounje` and `aranko` for `eranko` (1101); the proverb at 1103 opens a curly quote with no closing quote and is garbled; 1105 has `on pese`, `ire-oko`, `eso lorisirisi bii,`; 1115/1119 have `omi hiho`, `omorogun`, `egeere`, `eree`, `Aadun de niyen` and no final stops |
| 8 | 1131–1147 | LITIRESO: the heading at 1131 is not in `EKA ISE:` form and has a double space; `kogbon` (1137), `batani`, `faran`, `afiwe eleloo` (1139), `ajumohu` and a repeated `ogun jije` (1141), `onirunru` and `olu ede itan` (1143), a leading space at 1147 |
| 9 | 1149–1167 | Five questions and three practical items lose their automatic numbers in extraction; no answers, model responses or marks; `Fun iro konsonanti loriki` (1151) is garbled; the practical asks for gbegiri, ekuru and ikokore, none of which the ASA part teaches |

No correction wording is authored here; the lessons must not copy the uncorrected text.

## Notation (open item `YORUBA-T1-W04-NOTATION`)
- Lines 725–1167 contain **no** tone-marked or sub-dot character: 0 characters in U+00C0–U+024F and 0 combining marks across the week. The only non-ASCII characters are one en dash (797) and one opening curly quote (1103).
- This is the same document-wide condition as `YORUBA-T1-W01/W02/W03-NOTATION`, but it is fatal here because the week classifies consonants: the place table writes `s` twice (769, 775), the manner table twice (829) and the voicing table twice (883), so `s` and `ṣ` cannot be told apart; the lateral is written capital `I` in table 4 (853) and twice in table 6 (1049, 1051); the voicing terms are `akunyun`/`aikunyun` in table 5 and `Akinyun` in table 6; the proverb at 1103 is tone-dependent. Week 4 uses no IPA at all, unlike Week 2. No marks or symbols were added or normalised.

## Assessment and visuals
- `Igbelewon` (1149–1159) has five questions and `Ise asetilewa` (1161–1167) three items (gbegiri, ekuru, ikokore). Neither has answers, marking or completion criteria (open item `YORUBA-T1-W04-ASSESSMENT-GAPS`), and the practical foods are not taught in the ASA part.
- Week 4 has four Word tables (3–6) and **no** drawing, picture, text box, OLE object, equation, media file or VML shape. 19 paragraphs carry Word automatic numbering - 3 criteria, 3 recipe titles, 5 LITIRESO elements, 5 Igbelewon questions, 3 practical foods - and `extractRawText` drops their markers. Table 6 uses no merged cells, so its two-level row header extracts as blank cells.

## Queue changes
- YO-WK-T1-W04 → `IMPLEMENTED_TESTING_DEFERRED`; previous `next_runnable` value consumed.
- Appended 4 PENDING/BLOCKED items directly after YO-WK-T1-W04:
  - `YO-LES-T1-W04-EDE`, `YO-LES-T1-W04-ASA`, `YO-LES-T1-W04-LIT` (LESSON, PENDING, depending on `YO-SRC-T1`, `YO-WK-T1-W04` and `YO-FACT-T1-W04-DEFECTS`) - one replacement lesson per strand.
  - `YO-FACT-T1-W04-DEFECTS` (FACTUAL_DEPENDENCY, BLOCKED, depending on `YO-SRC-T1` and `YO-WK-T1-W04`) - one recorded expert decision on the nine defects and the notation.
- Counts: 65 items, kinds add LESSON 3 and FACTUAL_DEPENDENCY 1; status 10 implemented / 51 pending / 4 blocked; `next_runnable` → `YO-WK-T1-W05`, the first eligible PENDING item in queue order.
- `YORUBA-OBJECTIVE-INDEXING` updated to Weeks 1–4 (15/15/23/19) and its required action now starts at `YO-WK-T1-W05`. The YO-INV-T1 claim that Week 4 has no LITIRESO heading was corrected in this item's implementation reference: a heading exists at 1131, but not in `EKA ISE:` form.

## Limits
- Indexing only: no lesson authored, no asset, no package delivery change, no schema or compiler edit, no parser/importer run. `yoruba.json` was edited only to add coverage and open items.
- Not approved and not verified. The scheme mapping is inferred and flagged; no objective was invented beyond the source text.
