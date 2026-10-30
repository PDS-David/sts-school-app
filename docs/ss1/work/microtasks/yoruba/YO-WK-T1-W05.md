# YO-WK-T1-W05 — Yoruba, 1st Term, Week 5 objective indexing

Status: **IMPLEMENTED_TESTING_DEFERRED** (implemented; not approved, not verified). Testing deferred by owner. Week 5 is **not delivered**: 12 coverage entries are PARTIAL and 2 are UNRESOLVED, three lesson items and one factual-dependency item are appended, and one owner action is raised for the empty LITIRESO strand.

## Inputs
- Base: `ss1/yo-wk-t1-w04` at `3d72c04` (PR #199, Week 4), which sits on master `f4f0719d57b11fba39b499501060da59efe6532b` (the merge of PR #198, Week 3). PR #199 is open and unmerged, so this branch is **stacked** and PR #200 targets `ss1/yo-wk-t1-w04`; it is merged after #199, following the Week 2 precedent recorded in `ceb9a31` ("Stacked on ss1/yo-wk-t1-w01 (PR #196); merge after #193-#196").
- Prerequisite `YO-SRC-T1` is `IMPLEMENTED_TESTING_DEFERRED`. `YO-WK-T1-W05` was the previous `next_runnable` after Week 4 was set to `IMPLEMENTED_TESTING_DEFERRED` in #199.
- Source `SS1-SRC-48b641249e3b`, manifest member `SSS 1/1st Term SS1_/YORUBA.docx`, 55,974 bytes, SHA-256 `7403d8243ee646a221bb3d92fe18d202c73be0bde4deb10fa68a3dec0b4a6aef` **re-verified this run** from the supplied archive (SHA-256 `02448712…65c9a3e`).
- Method (private, outside Git): the same mammoth 1.12.2 `extractRawText` output as Weeks 1–4 (1,781 lines) and a top-level walk of `word/document.xml` to locate tables, automatic numbering, drawings and objects. Line numbers are 1-based lines of `extractRawText().split('\n')`; hashes are SHA-256 over the stated lines joined with `\n`, edge blanks trimmed, UTF-8. The importer, parser and compiler were not run.

## Scheme mapping
- The opening list (lines 9–51, 22 topic paragraphs, SHA-256 `afccd54e…5b4f6af6`) carries **no week numbers and no week markers**. Week 5 is topics 13–15:

| Scheme topic | Line | Hash (1 line) | Matches |
|---|---|---|---|
| `Itesiwaju lori eko lori iro ede (iro ohun )` | 33 | `be9efc1f…e5e69f06` | EDE heading line 1175, which drops the parenthetical and writes `(ILO OHUN)` |
| `Awon owe ti o je mo asa yoruba` | 35 | `6e5735d3…944dd780` | ASA heading line 1239, word for word (case aside) |
| `Itupale asayan iwe itan aroso ti ajo WAEC/NECO yan` | 37 | `255e2ffe…23f6c526` | LITIRESO heading line 1261, which inserts `APILEKO` and writes `WAEC/ NECO` |

- Line 33 differs from line 27 (Week 4 topic 10) by `lori` in place of `nipa` and by the parenthetical. The Week 5 heading at 1175 reads `AKOLE ISE: ITESIWAJU LORI EKO IRO EDE YORUBA (ILO OHUN).`, so the scheme's `iro ohun` becomes `ILO OHUN`, which is the more accurate term. Line 37 matches heading 1261 apart from capitals, the `AKOLE ISE: ` label, an inserted `APILEKO` after `AROSO` and a space after the slash in `WAEC/ NECO`.
- As in Weeks 2–4, the three topics appear in the same order as the three body strands (EDE, ASA, LITIRESO). The next topic, line 39 `Silebu`, is Week 6 and matches its heading at 1289 (`AKOLE ISE: SILEBU`) exactly — the first exact scheme-to-heading match in the list, which supports the position-based reading. The inference is recorded as open item `YORUBA-T1-W05-SCHEME-MAPPING`; hash-accounting and classification of the whole list belong to `YO-PRE-T1-1` (PENDING).

## Section
- Teaching label `OSE KARUN-UN`, line 1171, SHA-256 `c38d7fb8…891e936f`; section lines 1171–1284, trimmed section SHA-256 `07f19f39…9280cd0f`, equal to the YO-INV-T1 value. Week 6 begins at 1285 (`OSE KEFA`).
- Parts: `EKA ISE: EDE` 1173–1233 (`19b0edb4…3f290076`), `EKA ISE: ASA` 1237–1255 (`52304171…7407ebb5`), `EKA ISE: LITIRESO` 1259–1261 (`65a66569…13275eab`), `Igbelewon` 1265–1271 (`dd8a086b…f58404f7`), `Ise asetilewa` 1275 (`c29ed76a…10bc9703`).
- Week 5 contains **no Word table and no visual**: no drawing, picture, text box, OLE object, equation, VML shape or media file occurs anywhere in 1171–1284 (the document's 21 `v:shape`, 7 `w:drawing` and 7 `w:pict` elements all sit outside this range, and `word/media/` is empty).
- The LITIRESO strand is a heading only: 1259 is the label, 1261 the title and 1262–1264 are blank, after which `Igbelewon:` begins at 1265. Nothing is taught in that strand.
- 13 paragraphs carry Word automatic numbering and `extractRawText` drops their markers: the two tone-class names (1181, 1183), the two contour kinds (1219, 1227), the six proverbs (1243, 1245, 1249, 1251, 1253, 1255) and the three questions (1267, 1269, 1271).
- The parser produces **no rows** for this source (Yoruba ordinal headings; `YO-FND-T1-01`), so no `SS1-SRC-48b641249e3b:BODY:<sha256>` identity exists. Every coverage entry therefore cites exact line ranges and UTF-8 block hashes, with `lesson_ids: []`.

## Coverage entries added (14: 12 PARTIAL, 2 UNRESOLVED)
| ID | Objective | Lines | Block SHA-256 |
|---|---|---|---|
| `YO-T1-W05-SCHEME-EDE` | Scheme topic 13 bound to the EDE part | 33; 1173–1233 | `be9efc1f…e5e69f06`; `19b0edb4…3f290076` |
| `YO-T1-W05-SCHEME-ASA` | Scheme topic 14 bound to the ASA part | 35; 1237–1255 | `6e5735d3…944dd780`; `52304171…7407ebb5` |
| `YO-T1-W05-SCHEME-LIT` | Scheme topic 15 bound to the LITIRESO part (UNRESOLVED) | 37; 1259–1261 | `255e2ffe…23f6c526`; `65a66569…13275eab` |
| `YO-T1-W05-EDE-01` | Tone defined; two tone classes named | 1177–1183 | `7b56f1dd…efeb3dd3` |
| `YO-T1-W05-EDE-02` | Level tone defined; three members named with marks | 1185–1193 | `c755b13f…504ded78` |
| `YO-T1-W05-EDE-03` | Examples of the three level tones | 1195–1213 | `30d7e199…d6ed1f53` |
| `YO-T1-W05-EDE-04` | Contour tone defined; two kinds named | 1215–1217 | `d68e452a…6ad67990` |
| `YO-T1-W05-EDE-05` | Rising contour defined, with three examples | 1219–1225 | `21e295a1…116e3bdd` |
| `YO-T1-W05-EDE-06` | Falling contour defined, with two examples | 1227–1231 | `6d6810b0…fa78caf3` |
| `YO-T1-W05-EDE-07` | Contour marks no longer used in present-day orthography | 1233 | `c576f643…72590ad1` |
| `YO-T1-W05-ASA-01` | Marriage custom with two proverbs | 1239–1245 | `4e639fa1…1f0a45f2` |
| `YO-T1-W05-ASA-02` | Mutual-aid custom with four proverbs | 1247–1255 | `558818e5…0eff7706` |
| `YO-T1-W05-LIT-01` | Analysis of the WAEC/NECO prose text (UNRESOLVED) | 1261 | `0100b432…f138cbbe` |
| `YO-T1-W05-ASSESS` | Three questions and one practical item, no key | 1265–1271; 1275 | `dd8a086b…f58404f7`; `c29ed76a…10bc9703` |

Full values are reproducible with the method above. The twelve PARTIAL entries record what the source does teach while no deliverable lesson exists; the two UNRESOLVED entries record that the LITIRESO strand is a title with no body, so the objective is not taught at all. No entry was marked SUPPORTED.

## Source defects (open item `YORUBA-T1-W05-SOURCE-DEFECTS`)
| # | Line | Defect |
|---|---|---|
| 1 | 1177–1183 | The tone definition is compressed (`lilo soke, lilo sodo ohun eniyan`) and the two classes at 1181/1183 are named without saying what separates them |
| 2 | 1185–1193 | `lai ni eyo rara` ends the level-tone definition; the members are lettered `a.`, `b.`, `d.` with `c.` missing; `M`, `D` and `R` are never expanded; the marks are ASCII `/`, `\` and `-` in parentheses, the hyphen colliding with the ordinary hyphen |
| 3 | 1195–1213 | The high-tone block has three examples but the low and mid blocks two each; `Isale` is capitalised mid-list and `abbl` has no stop at 1207 |
| 4 | 1215–1225 | `tire` for `tira` (1215), `eleyo` without the double o (1217), `towa` and a run-on definition (1219), and three dash-separated pairs whose members are spelled identically |
| 5 | 1227–1231 | Only two falling examples, and `Yoo – yoo` and `Naa – naa` are likewise identical pairs |
| 6 | 1239–1255 | The strand is a bare list of six proverbs under two sub-headings with no translation, explanation or teaching text; `owo obe` (1243) is garbled, 1251 writes capital `I` for `l`, and 1253/1255 are garbled and lack final stops |
| 7 | 1259–1261 | The LITIRESO strand is a heading with no body, no text named and no author |
| 8 | 1265–1275 | Three questions and one practical item lose their numbers in extraction; no answers or marks; the practical asks five examples of each contour tone where the text supplies two and three; `eleyoo-rodo`/`eleyoo-roke` are hyphenated unlike 1219/1227 |

No correction wording is authored here; the lessons must not copy the uncorrected text.

## Notation (open item `YORUBA-T1-W05-NOTATION`)
- Lines 1171–1284 contain **no** tone-marked or sub-dot character: 0 characters in U+00C0–U+024F and 0 combining marks. The only non-ASCII characters are ten en dashes (1189, 1191, 1193, 1195, 1203, 1221, 1223, 1225, 1229, 1231).
- This is the same document-wide condition as `YORUBA-T1-W01..W04-NOTATION`, but it is fatal here because the week **is** a lesson on tone. The three level tones are distinguished only by their marks, and the ten example words at 1197–1213 carry none, so high, low and mid are typographically identical. The contour examples at 1221–1231 are dash-separated pairs whose members are spelled the same, so neither the rising nor the falling contrast can be seen. Every proverb at 1243–1255 is tone-dependent.
- Where the text does mark tone it uses ASCII punctuation in parentheses — `( / )`, `( \ )`, `( - )`, `(V)` and `(^)` — never the acute, grave, macron or caron characters. No marks or symbols were added or normalised.

## Assessment and visuals
- `Igbelewon` (1265–1271) has three questions: an account of the tones (1267), the classes with examples (1269) and proverbs on the two customs (1271). `Ise asetilewa` (1275) has one item: five examples each of falling and rising contour tones. Neither has answers, marking or completion criteria (open item `YORUBA-T1-W05-ASSESSMENT-GAPS`), the two tone questions overlap, and the practical demands ten examples where the source gives five.
- The empty LITIRESO strand is raised as `YORUBA-T1-W05-LITIRESO-EMPTY` (OWNER_ACTION): no text is named and the source cannot supply one, so the owner must name the WAEC/NECO prose text before `YO-LES-T1-W05-LIT` can be written.
- Week 5 has no table and no visual element of any kind; the only formatting features are the 13 lost automatic numbers and the widely spaced example headers at 1195, 1203 and 1209.

## Queue changes
- YO-WK-T1-W05 → `IMPLEMENTED_TESTING_DEFERRED`; previous `next_runnable` value consumed.
- Appended 4 PENDING/BLOCKED items directly after YO-WK-T1-W05:
  - `YO-LES-T1-W05-EDE`, `YO-LES-T1-W05-ASA`, `YO-LES-T1-W05-LIT` (LESSON, PENDING, depending on `YO-SRC-T1`, `YO-WK-T1-W05` and `YO-FACT-T1-W05-DEFECTS`) — one replacement lesson per strand; the LIT lesson also depends on the owner naming the set text.
  - `YO-FACT-T1-W05-DEFECTS` (FACTUAL_DEPENDENCY, BLOCKED, depending on `YO-SRC-T1` and `YO-WK-T1-W05`) — one recorded expert decision on the eight defects, the notation and the set text.
- Counts: 69 items, kinds add LESSON 3 and FACTUAL_DEPENDENCY 1; status 11 implemented / 53 pending / 5 blocked; `next_runnable` → `YO-WK-T1-W06`, the first eligible PENDING item in queue order.
- `YORUBA-OBJECTIVE-INDEXING` updated to Weeks 1–5 (15/15/23/19/14) and its required action now starts at `YO-WK-T1-W06`.

## Limits
- Indexing only: no lesson authored, no asset, no package delivery change, no schema or compiler edit, no parser/importer run. `yoruba.json` was edited only to add coverage and open items.
- Not approved and not verified. The scheme mapping is inferred and flagged; no objective was invented beyond the source text, and the LITIRESO objective is left UNRESOLVED rather than filled from general knowledge.

