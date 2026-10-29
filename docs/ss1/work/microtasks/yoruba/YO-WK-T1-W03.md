# YO-WK-T1-W03 — Yoruba, 1st Term, Week 3 objective indexing

Status: **IMPLEMENTED_TESTING_DEFERRED** (implemented; not approved, not verified). Testing deferred by owner. Week 3 is **not delivered**: all 23 coverage entries are PARTIAL and three lesson items plus one factual-dependency item are appended.

## Inputs
- Base: origin/master `bf2bbf23164abc5ad0dd58472147a75c4c5e6e46` (the merge of PR #196, Week 1, and #197, Week 2). Both earlier Week items were merged before this item started, so this branch's only difference from master is the three Week 3 files.
- Prerequisite `YO-SRC-T1` is `IMPLEMENTED_TESTING_DEFERRED` on master. `YO-WK-T1-W03` was the previous `next_runnable` and no open PR owned it when work started.
- Source `SS1-SRC-48b641249e3b`, manifest member `SSS 1/1st Term SS1_/YORUBA.docx`, 55,974 bytes, SHA-256 `7403d8243ee646a221bb3d92fe18d202c73be0bde4deb10fa68a3dec0b4a6aef` **re-verified this run** from the supplied archive (SHA-256 `02448712…65c9a3e`).
- Method (private, outside Git): mammoth 1.12.2 `extractRawText({path})`: 26,329 characters, 1,781 lines; `word/document.xml` (341,791 characters, SHA-256 `d304cd2c4dba474e73534237df225ec72a461202f57265c1bdc17adcf481fb08`) parsed into top-level body elements to locate tables, automatic numbering, drawings and objects. Line numbers are 1-based lines of `extractRawText().split('\n')`; hashes are SHA-256 over the stated lines joined with `\n`, edge blanks trimmed, UTF-8. The importer, parser and compiler were not run.

## Scheme mapping
- The opening list (lines 9–51, 22 topic paragraphs, SHA-256 `afccd54e…b4f6af6`) carries **no week numbers and no week markers**. Week 3 is topics 7–9:

| Scheme topic | Line | Hash (1 line) | Matches |
|---|---|---|---|
| `Itesiwaju lori eko nipa iro ede` | 21 | `68048e40…ce414d56` | EDE heading line 487, in capitals and without `nipa` (worded as Week 2's heading at 315) |
| `Owe` | 23 | `9ae5c149…545a3767` | ASA heading line 577, word for word |
| `Eko lori igbadun ti o wa ninu litireso alohun` | 25 | `fdf72ff3…e31543ff` | LITIRESO heading line 685, in capitals (typed `AKoLE`) |

- Position is the only reliable discriminator for two of the three. Line 21 is byte-identical to line 15, Week 2 topic 4 (same hash `68048e40…ce414d56`), and the Week 3 heading at 487 differs from Week 2's at 315 only in case and the full stop. Line 25 repeats Week 2 topic 6 with one trailing space, and heading 685 repeats 447 except for `AKoLE`. The bare title `Owe` is unique in the list, but the word recurs at lines 35 and 41 in other topics. Only the body content separates the weeks. The inference is recorded as open item `YORUBA-T1-W03-SCHEME-MAPPING`; hash-accounting and classification of the whole list belong to `YO-PRE-T1-1` (PENDING).

## Section
- Teaching label `OSE KETA`, line 483, SHA-256 `4ed1dfb7…5012d83b`; section lines 483–724, of which the trimmed section 483–719 has SHA-256 `ddc960d351bbb3dc644d42b56fcf6c23e1a449df0bc65c11e65f3f6c7d8b0d13`, equal to the YO-INV-T1 value.
- Parts: `EKA ISE: EDE` 485–573 (`3ee35b93…5ac1566c`), `EKA ISE: ASA` 575–679 (`d6937ab7…89eaa840`), `EKA ISE: LITIRESO` 683–697 (`aed54e20…eece39fb`), `Igbelewon` 701–709 (`27295f96…c2c80522`), `Ise asetilewa` 713–719 (`53783803…5fc86e69`). The ATE FAWELI chart sits inside the EDE part at 551–569 (`2710e096…58489cc0`).
- The parser produces **no rows** for this source (Yoruba ordinal headings; `YO-FND-T1-01`), so no `SS1-SRC-48b641249e3b:BODY:<sha256>` identity exists. Every coverage entry therefore cites exact line ranges and UTF-8 block hashes, with `lesson_ids: []`.

## Coverage entries added (23, all PARTIAL)
| ID | Objective | Lines | Block SHA-256 |
|---|---|---|---|
| `YO-T1-W03-SCHEME-EDE` | Scheme topic 7 bound to the EDE part | 21; 485–573 | `68048e40…ce414d56; 3ee35b93…5ac1566c` |
| `YO-T1-W03-SCHEME-ASA` | Scheme topic 8 bound to the ASA part | 23; 575–679 | `9ae5c149…545a3767; d6937ab7…89eaa840` |
| `YO-T1-W03-SCHEME-LIT` | Scheme topic 9 bound to the LITIRESO part | 25; 683–697 | `fdf72ff3…e31543ff; aed54e20…eece39fb` |
| `YO-T1-W03-EDE-01` | Four ways of describing a vowel announced | 489–511 | `3410db9a…5bba3264` |
| `YO-T1-W03-EDE-02` | Tongue criteria: part raised and height | 493–497; 507–509 | `7b079652…9dba8592; 405999ff…28d8e72f` |
| `YO-T1-W03-EDE-03` | Lip criteria: spread and rounded posture | 499; 511–515 | `a16eaaea…286dcdc8; 345b143d…e317e1da` |
| `YO-T1-W03-EDE-04` | Oral and nasal vowels defined | 503–505 | `6c9467a2…96daff01` |
| `YO-T1-W03-EDE-05` | Seven oral vowels described (a and i numbered, not written) | 519–533 | `da46e6b8…807299e7` |
| `YO-T1-W03-EDE-06` | Five nasal vowels described | 535–545 | `0968e263…3eb6f1a4` |
| `YO-T1-W03-EDE-07` | ATE FAWELI chart (one VML drawing) | 551–569 | `2710e096…58489cc0` |
| `YO-T1-W03-ASA-01` | Owe defined; elders' vehicle of speech | 579–583 | `720751ec…9147f310` |
| `YO-T1-W03-ASA-02` | Five categories named | 587–589 | `c8a75a1f…5a636487` |
| `YO-T1-W03-ASA-03` | OWE FUN IBAWI: three proverbs and glosses | 591–603 | `1dca61e4…1fe8dfe7` |
| `YO-T1-W03-ASA-04` | OWE FUN IKILO: three proverbs and glosses | 607–619 | `6d318a37…7ec2f6f0` |
| `YO-T1-W03-ASA-05` | OWE FUN IMORAN: three proverbs and glosses | 623–635 | `b1c4c79b…c44f1785` |
| `YO-T1-W03-ASA-06` | OWE FUN ALAYE: two proverbs and glosses | 639–647 | `f24b277a…fc3577c2` |
| `YO-T1-W03-ASA-07` | OWE FUN ISIRI: two proverbs and glosses | 651–659 | `d24eb4dc…7112a90d` |
| `YO-T1-W03-ASA-08` | IWULO OWE: seven uses | 663–677 | `b9ce3213…40c030c4` |
| `YO-T1-W03-LIT-01` | Forms named: ere onise, egungun chant, ijala | 687 | `d5cb8a63…e83cdcb8` |
| `YO-T1-W03-LIT-02` | Oriki and etiological narratives | 689; 693 | `1aa48cb7…80ccccd1; 13f1457b…a0190dd0` |
| `YO-T1-W03-LIT-03` | Recitation and chanting | 691–693 | `4737c403…e87bc213` |
| `YO-T1-W03-LIT-04` | Lessons, entertainment and social cohesion | 695–697 | `00e60fc3…40a328d7` |
| `YO-T1-W03-ASSESS` | Four Igbelewon questions and one practical task, no key | 701–709; 713–719 | `27295f96…c2c80522; 53783803…5fc86e69` |

Full values are reproducible with the method above. All 23 are PARTIAL: the source teaches each objective, but no deliverable lesson exists, the row identity gap blocks parsed delivery, and the defects below must be corrected before teaching.

## Source defects (open item `YORUBA-T1-W03-SOURCE-DEFECTS`)
| # | Line | Defect |
|---|---|---|
| 1 | 489–511 | `Ona merin` is announced (491) but the eight numbered paragraphs give no four distinct criteria: `Ipo ti afase wa` appears twice (493, 501), `Ipo ti ete wa` (499) and `Ipo ete` (511) are two labels for one criterion, `Ipo ahon` (507) is a fifth label, 499 has no description and 507 is truncated at `Bi apa` |
| 2 | 503–515 | The lip-posture lists mix oral and nasal vowels under one heading (513 `a e e I an en in`; 515 `o, u, o, un, on`), and no sub-dot distinguishes the two e or the two o |
| 3 | 521–533 | Seven oral-vowel rows, but the `a` row (521) and the `i` row (527) carry Word automatic numbering instead of a written letter, so extraction shows no symbol; the other five print `e-`, `o-`, `u-`; no IPA is given |
| 4 | 551–569 | The ATE FAWELI chart is one VML drawing (16 connectors, 2 groups, no text boxes, no media) whose tab-positioned labels collapse in extraction: axis header repeated (553), stray capital `U` (555), `an` under `Ayanudiepe` (567) |
| 5 | 579–583 | The definition is garbled (`afo`, `iriir`); 581 is quoted without a gloss; 583 is repeated at 677 with different wording (`yaju`/`fi yaju`, `takoko`/`ta koko`) |
| 6 | 591–659 | Seven example–gloss pairs are garbled or unreadable (601–603, 625–627, 629–631, 633–635, 641–643, 645–647, 653–657); 595 glosses a maxim rather than the proverb at 593; the fifth category name `isiri` (651) is unexplained |
| 7 | 687–697 | The LITIRESO part opens with a verbless fragment (687); `atenudenu` is used on five lines and never defined; `isedele`, `isedale` and `isedala` are inconsistent; `kiki ati kike` is undefined; `leti orirun` (691), `onirunru` (695), `tita-opolo` and `ji po jatirere` (697) are garbled; no oral text is quoted |
| 8 | 701–719 | Four questions, one misspelt (`faweeli`, 703) and one running two topics together with no conjunction (709), plus a practical task requiring two examples of each of three proverb types; no answers, model responses, marks or completion standard |

No correction wording is authored here; the lessons must not copy the uncorrected text.

## Notation (open item `YORUBA-T1-W03-NOTATION`)
- Lines 483–719 contain **no** tone-marked or sub-dot character: the only non-ASCII character in the whole week is the en dash, three times (687, 689, 697). This is the same document-wide condition as `YORUBA-T1-W01-NOTATION` and `YORUBA-T1-W02-NOTATION`, and it is fatal here because the week teaches vowels and proverbs: the oral set is printed `a e e I o o u` (503) and the lip sets `a e e I an en in` / `o, u, o, un, on` (513, 515), so e/ẹ and o/ọ cannot be told apart; the seven oral rows (521–533) repeat the same vowels; the nasal set is written `an en in on un` (505) with no tilde; the chart carries no mark; and the thirteen proverbs (591–659) and the LITIRESO terms (687–697) depend on tone for their meaning. Week 3 uses no IPA at all, unlike Week 2.
- No marks or symbols were added or normalised. The notation decision is required before the EDE sets and the ASA examples can be verified.

## Assessment and visuals
- `Igbelewon` (701–709) has four questions and `Ise asetilewa` (713–719) one practical task with three proverb types (owe imoran, Owe ibawi, Owe ikilo), two examples each. Neither has answers, marking or completion criteria (open item `YORUBA-T1-W03-ASSESSMENT-GAPS`).
- Week 3 contains **no** Word table: document tables 3–6 follow the section and belong to Week 4, and the two earlier tables sit before the first week heading `OSE KIN-IN-NI`. It contains **one** drawing: the ATE FAWELI chart, a VML object with 16 straight connectors in two groups, no text boxes and no media file, whose labels are ordinary tab-separated paragraphs. 47 paragraphs carry Word automatic numbering — the eight criteria paragraphs (493–511), two vowel rows (521, 527), 25 proverb paragraphs (five headings, thirteen proverbs, seven uses), five LITIRESO paragraphs, four Igbelewon questions and three task types — and `extractRawText` drops their markers. `YO-VIS-T1-01` owns the structural capture; no `YO-VIS` item covers Week 3.

## Queue changes
- YO-WK-T1-W03 → `IMPLEMENTED_TESTING_DEFERRED`; previous `next_runnable` value consumed.
- Appended 4 PENDING/BLOCKED items after YO-WK-T1-W03:
  - `YO-LES-T1-W03-EDE`, `YO-LES-T1-W03-ASA`, `YO-LES-T1-W03-LIT` (LESSON, PENDING, depending on `YO-SRC-T1`, `YO-WK-T1-W03` and `YO-FACT-T1-W03-DEFECTS`) — one small replacement lesson per strand.
  - `YO-FACT-T1-W03-DEFECTS` (FACTUAL_DEPENDENCY, BLOCKED, depending on `YO-SRC-T1` and `YO-WK-T1-W03`) — one recorded expert decision on the eight defects and the notation.
- Also corrected the objective of `YO-FACT-T1-W02-DEFECTS` from `eight` to `nine` Week 2 defects, matching the nine defects recorded by `YO-WK-T1-W02`.
- Counts: 61 items, kinds add LESSON 3 and FACTUAL_DEPENDENCY 1; status 9 implemented / 49 pending / 3 blocked; `next_runnable` → `YO-WK-T1-W04`, the first eligible PENDING item in queue order. `YO-SCOPE-OBJECTIVE-INDEXING.depends_on` was not changed (44).

## Limits
- Indexing only: no lesson authored, no asset, no package delivery change, no schema or compiler edit, no parser/importer run. `yoruba.json` was edited only to add coverage and open items.
- Not approved and not verified. The scheme mapping is inferred and flagged; no objective was invented beyond the source text.

