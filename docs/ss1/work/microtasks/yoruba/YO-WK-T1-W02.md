# YO-WK-T1-W02 — Yoruba, 1st Term, Week 2 objective indexing

Status: **IMPLEMENTED_TESTING_DEFERRED** (implemented; not approved, not verified). Testing deferred by owner. Week 2 is **not delivered**: all 15 coverage entries are PARTIAL and three lesson items plus one factual-dependency item are appended.

## Inputs
- Base: origin/master `4159336c7068d2235209221f5f14adc4986acec5` when work started. PRs #193–#196 (the three Term inventories and Week 1) were merged to master while this item was in progress (merge commits `df40b6a`, `8f355ff`, `992249b`, `376e03d`, 22:14–22:15 UTC), so this branch's only difference from master is the three Week 2 files.
- Prerequisite `YO-SRC-T1` is `IMPLEMENTED_TESTING_DEFERRED` on master. `YO-WK-T1-W01` was the previous `next_runnable` and was executed immediately before this item. No open PR owned YO-WK-T1-W02 when work started.
- Source `SS1-SRC-48b641249e3b`, manifest member `SSS 1/1st Term SS1_/YORUBA.docx`, 55,974 bytes, SHA-256 `7403d8243ee646a221bb3d92fe18d202c73be0bde4deb10fa68a3dec0b4a6aef` **re-verified this run** from the supplied archive (SHA-256 `02448712…65c9a3e`), matching the prompt and the package.
- Method (private, outside Git): mammoth 1.12.2 `extractRawText({path})`: 26,329 characters, 1,781 lines; `word/document.xml` (341,791 characters, SHA-256 `d304cd2c4dba474e73534237df225ec72a461202f57265c1bdc17adcf481fb08`) parsed into top-level body elements to locate tables, automatic numbering, drawings and objects. Line numbers are 1-based lines of `extractRawText().split('\n')`; hashes are SHA-256 over the stated lines joined with `\n`, edge blanks trimmed, UTF-8. The importer, parser and compiler were not run.

## Scheme mapping
- The opening list (lines 9–51, 22 topic paragraphs, SHA-256 `afccd54e…b4f6af6`) carries **no week numbers and no week markers**. Week 2 is topics 4–6, identified by position and by heading match against the three `AKOLE ISE` lines:

| Scheme topic | Line | Hash (1 line) | Matches |
|---|---|---|---|
| `Itesiwaju lori eko nipa iro ede` | 15 | `68048e40…ce414d56` | EDE heading line 315, which adds `Yoruba` and a full stop |
| `Ise abinibi` | 17 | `8e1f3e70…d3506eac` | ASA heading line 409, word for word |
| `Eko lori igbadun ti o wa ninu litireso alohun` | 19 | `61e2d470…daf547ab` | LITIRESO heading line 447, in capitals |

- Position is the only reliable discriminator. Line 21 repeats topic 4 byte for byte (same hash `68048e40…ce414d56`); line 25 repeats topic 6 with a trailing space; line 27 varies topic 4 again for a later week; and `Ise abinibi` recurs at line 49 for the final week. The inference is recorded as open item `YORUBA-T1-W02-SCHEME-MAPPING`; hash-accounting and classification of the whole list belong to `YO-PRE-T1-1` (PENDING).

## Section
- Teaching label `OSE KEJI`, line 311, SHA-256 `a22da429…b1211409`; section lines 311–482, of which the trimmed section 311–477 has SHA-256 `8d9ce15f7d4ac50c2b45dd5da5c7c16d9c6bb30ea7156e62e94550dc95d3365c`, equal to the YO-INV-T1 value.
- Parts: `EKA ISE: EDE` 313–405 (`ea328905…b7706189`), `EKA ISE: ASA` 407–443 (`5026c9da…829fdf7d`), `EKA ISE: LITIRESO` 445–463 (`4fab8b0b…63c0c34d`), `Igbelewon` 465–475 (`11815f8b…66606f0c`), `Ise asetilewa` 477 (`75d19f8d…9da42a3a`).
- The parser produces **no rows** for this source (Yoruba ordinal headings; `YO-FND-T1-01`), so no `SS1-SRC-48b641249e3b:BODY:<sha256>` identity exists. Every coverage entry therefore cites exact line ranges and UTF-8 block hashes, with `lesson_ids: []`.

## Coverage entries added (15, all PARTIAL)
| ID | Objective | Lines | Block SHA-256 |
|---|---|---|---|
| `YO-T1-W02-SCHEME-EDE` | Scheme topic 4 bound to the EDE part | 15; 313–405 | `68048e40…ce414d56; ea328905…b7706189` |
| `YO-T1-W02-SCHEME-ASA` | Scheme topic 5 bound to the ASA part | 17; 407–443 | `8e1f3e70…d3506eac; 5026c9da…829fdf7d` |
| `YO-T1-W02-SCHEME-LIT` | Scheme topic 6 bound to the LITIRESO part | 19; 445–463 | `61e2d470…daf547ab; 4fab8b0b…63c0c34d` |
| `YO-T1-W02-EDE-01` | Speech sound defined (317); three classes named (319–325) | 319–325 | `21f651ec…45dd5b6b` |
| `YO-T1-W02-EDE-02` | Consonants defined; eighteen-consonant inventory | 327 | `5b052810…4e9c5214` |
| `YO-T1-W02-EDE-03` | Consonant IPA transcription, 18 rows | 329–365 | `98eff70e…54579d49` |
| `YO-T1-W02-EDE-04` | Vowels defined; oral and nasal sets; twelve total | 369–377 | `0c2e3dba…5943c11d` |
| `YO-T1-W02-EDE-05` | Vowel IPA transcription, 11 rows | 381–403 | `d8f5f82f…50e0a589` |
| `YO-T1-W02-ASA-01` | Ise abinibi defined as inherited occupation | 411–413 | `5fbf10b7…2cf7dabe` |
| `YO-T1-W02-ASA-02` | Attitude to work behind the inheritance | 413 | `00c2cfcb…f38b731f` |
| `YO-T1-W02-ASA-03` | Thirteen named traditional occupations | 415–441 | `38c83502…7d6a5b7f` |
| `YO-T1-W02-LIT-01` | Pleasure of linguistic artistry (heading 447) | 449–457 | `3cd58544…ccbd0497` |
| `YO-T1-W02-LIT-02` | Pleasure of a sweet voice | 459 | `032901ba…1ed3cdf7` |
| `YO-T1-W02-LIT-03` | Pleasure of drum, song and dance | 461 | `f6c5904b…086cf533` |
| `YO-T1-W02-ASSESS` | Five Igbelewon questions and one practical task, no key | 465–475; 477 | `11815f8b…66606f0c; 75d19f8d…9da42a3a` |

Full values are reproducible with the method above. All 15 are PARTIAL: the source teaches each objective, but no deliverable lesson exists, the row identity gap blocks parsed delivery, and the defects below must be corrected before teaching.

## Source defects (open item `YORUBA-T1-W02-SOURCE-DEFECTS`)
| # | Line | Defect |
|---|---|---|
| 1 | 321–325 | The three sound classes are lettered `a.`, `b.`, `d.`; `c` is omitted |
| 2 | 327 | The eighteen-consonant inventory writes `s` twice (`… r s s t w y`), so the eighteenth consonant is missing; `fig be` and `apepo` are garbled |
| 3 | 377 | `Apapo iro faweli Yoruba je mejia (12)`; `mejia` should read `mejila` |
| 4 | 381–403 | The vowel IPA table has 11 rows for the twelve vowels counted at 377; `A` is transcribed `/an/` and `An` `/a/`, i.e. the two rows are swapped; the nasal rows carry plain oral symbols |
| 5 | 415–441 | Thirteen occupations with no gloss; `Ise owo bii,` (421) is truncated and is not a trade name; `Eni hihu` (425) is not a recognisable occupation; `ise isegun` and `ise gbenagbena` are unexplained |
| 6 | 413 | `gbagbp` for `gbagbo`; `iran kookan`; `iwa imele` left unexplained |
| 7 | 449–459 | Garbled: `onworan`, `onkowe`, `ewi tunwi`, `afiwe ela loo`, `litireso atenudanu`, `awon eniya gbadu re to bee gee`, `yoo maa ho yee`, `ko gbeyi ebun`; line 451 opens with a stray space and no first word |
| 8 | 461 | One 70-word run-on: `odun sango odun obatala,lasiko` is unspaced, `lasiko` is unexplained, and `ni a n li si orin yii ti a si n jo si` is garbled |
| 9 | 465–477 | Five Igbelewon tasks, one of them garbled (`Fun iro ede loriki`, 467), and one drawing task; no answers, model responses, marks or completion standard |

No correction wording is authored here; the lessons must not copy the uncorrected text.

## Notation (open item `YORUBA-T1-W02-NOTATION`)
- Lines 311–477 contain **no** tone-marked or sub-dot character: the only non-ASCII characters in the whole week are an en dash, a pound sign and curly quotes (2,775 characters checked; 0 in U+00C0–U+024F and 0 combining marks). This is the same document-wide condition as `YORUBA-T1-W01-NOTATION`, but it is fatal here because the week is a lesson on speech sounds: the oral vowels are printed `a e e I o o u` so e/ẹ and o/ọ cannot be told apart; the consonant inventory writes `s` twice so s/ṣ cannot be told apart; the proverb at 413 loses its meaning without tone.
- The IPA transcriptions use ASCII substitutes typed in the source: `>` for the open-o vowel (391, 401), `£` for the open-e vowel (397), and the digit `3` inside `/d3/` (343). `P` and `Gb` are given as two-letter forms `/kp/` and `/gb/`; the nasal vowels are written `an en in on un` and their IPA rows repeat the oral symbols. No marks or symbols were added or normalised.

## Assessment and visuals
- `Igbelewon` (465–475) has five questions and `Ise asetilewa` (477) one drawing task (vowel chart on plain cardboard); `airanmupe` is a typo for `airamupe`. Neither has answers, marking or completion criteria (open item `YORUBA-T1-W02-ASSESSMENT-GAPS`).
- Week 2 contains **no** Word table, drawing, picture, text box, OLE object, equation or media file: the two IPA transcriptions are tab-separated everyday paragraphs (tabs survive extraction), and the 18 consonant pairs and 11 vowel pairs are not structurally aligned. 23 paragraphs carry Word automatic numbering (two vowel classes, thirteen occupation names, three named pleasures, five Igbelewon questions); `extractRawText` drops their numbers and letters. No `YO-VIS` item covers Week 2; document tables 3–6 fall in Week 3, not here.

## Queue changes
- YO-WK-T1-W02 → `IMPLEMENTED_TESTING_DEFERRED`; previous `next_runnable` value consumed.
- Appended 4 PENDING/BLOCKED items after YO-WK-T1-W02:
  - `YO-LES-T1-W02-EDE`, `YO-LES-T1-W02-ASA`, `YO-LES-T1-W02-LIT` (LESSON, PENDING, depending on `YO-SRC-T1`, `YO-WK-T1-W02` and `YO-FACT-T1-W02-DEFECTS`) — one small replacement lesson per strand.
  - `YO-FACT-T1-W02-DEFECTS` (FACTUAL_DEPENDENCY, BLOCKED, depending on `YO-SRC-T1` and `YO-WK-T1-W02`) — one recorded expert decision on the nine defects and the notation.
- Also removed a self-reference that the Week 1 run had left in `YO-FACT-T1-W01-DEFECTS.depends_on` (the item listed itself); its real dependencies `YO-SRC-T1` and `YO-WK-T1-W01` are unchanged.
- Counts: 57 items, kinds add LESSON 3 and FACTUAL_DEPENDENCY 1; status 8 implemented / 47 pending / 2 blocked; `next_runnable` → `YO-WK-T1-W03`, the first eligible PENDING item in queue order. `YO-SCOPE-OBJECTIVE-INDEXING.depends_on` was not changed (44).

## Limits
- Indexing only: no lesson authored, no asset, no package delivery change, no schema or compiler edit, no parser/importer run. `yoruba.json` was edited only to add coverage and open items.
- Not approved and not verified. The scheme mapping is inferred and flagged; no objective was invented beyond the source text.
