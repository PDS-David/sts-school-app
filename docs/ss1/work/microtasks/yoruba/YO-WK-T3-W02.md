# YO-WK-T3-W02 — Yoruba, 3rd Term, Week 2 objective indexing

Status: **IMPLEMENTED_TESTING_DEFERRED** (implemented; not approved, not verified). Testing deferred by owner. Week 2 is **not delivered**: 8 coverage entries are PARTIAL and 8 are UNRESOLVED, and three lesson items plus one factual-dependency item are appended.

## Inputs
- Base: `origin/master` `8ffcd12b4b4067072787268b8de3ef1dd1eaabef` (merge of PR #256), the master on which the refreshed assignment index `docs/ss1/work/NEXT_ASSIGNMENTS_20261030.md` assigns `YO-WK-T3-W02`. Master advanced only by the PR #257 docs merge (`1b0ac1a`) before this branch was cut; `backend/src/db/ss1/subjects/yoruba.json` and `docs/ss1/work/microtasks/yoruba/QUEUE.json` are byte-identical between `c21ad4d` and `origin/master`, so the branch was opened from `origin/master` with no rebase and no conflict.
- Prerequisite `YO-SRC-T3` and predecessor `YO-WK-T3-W01` are `IMPLEMENTED_TESTING_DEFERRED`. The only open PR at the time of writing was #258 (English UNR-01, read-only register), which does not touch the Yoruba package or queue.
- Source `SS1-SRC-4cc6aae9ed7d`, manifest member `SSS 1/3rd Term SS1_/3RD TERM S1 YORUBA.docx`, 68,373 bytes, SHA-256 `a057f7f70d7e99fc34acdb6e725f3d44a426d96f756039bf6f3e6216767416e3`, **re-verified this run** against the supplied archive (SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`). Nothing from the archive or the extract is committed.
- Method (private, outside Git): mammoth 1.12.2 `extractRawText` of the member: 63,445 characters, 2,463 lines, whole-file SHA-256 `4def7729a08d67235d5a7c6fbbcb19a15a93ffdacb96cafc6e477a14edb4d726` — identical to the YO-INV-T3 and YO-WK-T3-W01 measurement. Line numbers are 1-based lines of `extractRawText().split('\n')`; hashes are SHA-256 over the stated lines joined with `\n`, edge blanks trimmed, UTF-8. The importer, parser and compiler were not run; the parser's own regexes were applied statically to the same extraction.

## Scheme mapping
- The scheme is flat and unnumbered: line 5 is only `Ose: ` and the eleven groups at 7–83 are separated only by position and the repeated `EDE:`/`ASA:`/`LIT:` prefixes. Week 2 is the second triple, lines 13–17, SHA-256 `12b984e154f5bab69dc520e5c609e3606ce32be1a4a9e437068aead476c6bc60` (141 characters). The mapping is documentary by position, confirmed by the teaching label `OSE KEJI` at line 427.

| Scheme item | Line | Line SHA-256 | Body binding |
|---|---|---|---|
| `EDE:\tOro Aropo-Oruko` | 13 | `8fc7b7c25a47192dce095d4604ffbef7305c955e046c7fb7c350beb147483ed8` | EDE part 429–591, `9041f3c35f5557e8a74088746af989d9fb611ae84795048a6c9c196862305c37` |
| `ASA:\tIpolowo Oja: iwulo ati pataki, orisii ona ti a n gba polowo oja.` | 15 | `0b550bf09a710537a233a9d671f4ec974aed98a6781be2f66f70708165314000` | ASA part 603–607, `a426e87b3fc97e252944d22c0ddd1ffd27b1050360166b3145a386f099333078` (heading only) |
| `LIT:\tItupale iwe asayan ti ijoba yan. WAEC/NECO.` | 17 | `877c508bb10a799b4103aff69547f7f9171524e212c5aeb6c5a975ab1e721547` | LITIRESO part 617–623, `684a68029efcc5744f7c5e0da4469ab7ed2d2fa756ae9d8c2cbee177b410bf74` (title and citation only) |

- The EDE row names one term, `Oro Aropo-Oruko`, and the body teaches it under four sub-headings (`Oriki` 431, `Abuda` 433, `Ate` 435, `Irisi` 437) but develops only two of them.
- The ASA row names `iwulo ati pataki` and `orisii ona`; the body prints the topic name twice and no content at all.
- The LIT row names `itupale iwe asayan ti ijoba yan` with the `WAEC/NECO` pointer; the body gives a second-poem title and one citation.
- Whether Week 2 is the second triple and whether the scheme terms are satisfied by the body wording is recorded as `YORUBA-T3-W02-SCHEME-MAPPING`; classification of the whole flat scheme belongs to `YO-PRE-T3-1` and `YO-FND-T3-01` (both PENDING).

## Section
- Teaching label `OSE KEJI`, line 427, 8 characters, SHA-256 `a22da429bb21ce15cdb9daf531aebe39dbae2143a01bad8841d6ff34b1211409`, char offset 10,299; section lines 427–678, SHA-256 `4e9c5de3a0d9b20e958f97b3178a968e84002c7b7a8b6025c6e1b810bb657083`, 2,932 characters, equal to the YO-INV-T3 value.
- Parts: `ORO AROPO ORUKO.` 429–591 (`9041f3c35f5557e8a74088746af989d9fb611ae84795048a6c9c196862305c37`) with the sub-heading list 431–437, `AKOONU` 439, definition 441–449 (`cd76b38ee3b51ec9f111312168df81dee845b8619f9237e5625a0279d15d3d0e`), abuda 451–505 (`2d0951a414239019dde308196e6f1104b3e801802355d1c0ab4e3ddca11bfeab`) and irisi 509–591 (`6344d86fe001ca4e6870e54c21f10ba15d803e907a97d83e8f8defbcc6bf0ad1`) with oluwa 519–541 (`713d92ec7fa1640dbbb0a2b9d2e5c00c336785e9788f37a11ba91c8c8b5b2ae2`), abo 543–565 (`b1b2d463d08a1d92a023b36e97db88496753129ca72b889da3cec932f64bf9f2`) and eyan 567–591 (`1e389abf1baeaefe391349b09305c4cc4c6f00b8fefd03432489536c2860228b`); `IGBELEWON` 595–599 (`339bc53d16f7ad3b18d809fc24b1eba52bf62323b822b7128d31c7b8bf4d2d03`); `ASA` 603–607 (`a426e87b3fc97e252944d22c0ddd1ffd27b1050360166b3145a386f099333078`, 29 characters); `IWE AKATILEWA` 611–613 (`c394056506d8597c41bfa04fa6f3d92889b4ec834b298f52ec6a37178211241b`); `LITIRESO` 617–623 (`684a68029efcc5744f7c5e0da4469ab7ed2d2fa756ae9d8c2cbee177b410bf74`, 87 characters); `APAPO IGBELEWON` 627–635 (`b3405577dbeb17f46dd8882c32966284918be84e0964c1ecc10281dabb5cfa5f`, 167 characters); `ISE AMURELE` 639–649 (`5f29f03bfe8eb667618f804561e1dd05b6fd2c6629a376bb293cfd71e9e0a784`, 454 characters); `APA KEJI` 651–661 (`5a853c1bbc1e153a252dc5e6f019096a747155ee3fc6cb596d5bc9a86a4977e7`, 230 characters). Lines 663–678 are whitespace only.
- The parser produces **no rows** for this source: the extraction contains zero `week` substrings, `WEEK_MARKER` and `BARE_NUMBER_LINE` both match zero times, and `parseTopics` returns `[]` (`NO_PARSED_LESSONS`). These are the parser's own regexes applied statically to the same extraction, not a parser run.
- No `SS1-SRC-4cc6aae9ed7d:BODY:<sha256>` identity exists, so every coverage entry cites exact line ranges and UTF-8 block hashes with `lesson_ids: []`. Static check this run: `OSE KEJI` occurs exactly once in the extraction and line 427 is line-initial; the ten ordinal labels `OSE KINNI`…`OSE KEWAA` are each unique (YO-WK-T3-W01 check). Row identity is left to `YO-FND-T3-01`.

## Coverage entries added (16)
| ID | Objective | Lines | Block SHA-256 | Status |
|---|---|---|---|---|
| `YO-T3-W02-SCHEME-EDE` | Scheme EDE row: oro aropo-oruko | 13; 429–591 | `8fc7b7c2…7483ed8`; `9041f3c3…62305c37` | PARTIAL |
| `YO-T3-W02-SCHEME-ASA` | Scheme ASA row: ipolowo oja - iwulo ati pataki, orisii ona | 15; 603–607 | `0b550bf0…65314000`; `a426e87b…99333078` | UNRESOLVED |
| `YO-T3-W02-SCHEME-LIT` | Scheme LIT row: itupale iwe asayan ti ijoba yan (WAEC/NECO) | 17; 617–623 | `877c508b…1e721547`; `684a6802…b410bf74` | UNRESOLVED |
| `YO-T3-W02-EDE-01` | Oro aropo oruko definition with four examples | 441–449 | `cd76b38e…d15d3d0e` | PARTIAL |
| `YO-T3-W02-EDE-02` | Abuda oro aropo oruko: the six properties | 451–505 | `2d0951a4…11bfeab` | PARTIAL |
| `YO-T3-W02-EDE-03` | Ate oro aropo oruko (tonal pattern) | 435 only | `9041f3c3…62305c37` | UNRESOLVED |
| `YO-T3-W02-EDE-04` | Irisi: oluwa, abo and eyan with their pronoun sets | 509–591 | `6344d86f…c6bf0ad1` | PARTIAL |
| `YO-T3-W02-EDE-05` | Oriki as a named sub-topic of oro aropo oruko | 431 only | `…` (heading list 429–437) | UNRESOLVED |
| `YO-T3-W02-ASA-01` | Iwulo ati pataki ipolowo oja | 603–607 | `a426e87b…99333078` | UNRESOLVED |
| `YO-T3-W02-ASA-02` | Orisii ona ti a n gba polowo oja, past and present | 603–607; 653–657 | `a426e87b…99333078`; `5a853c1b…86a4977e` | UNRESOLVED |
| `YO-T3-W02-LIT-01` | Itupale iwe asayan ti ijoba yan | 617–623 | `684a6802…b410bf74` | UNRESOLVED |
| `YO-T3-W02-LIT-02` | Ewi keji ninu iwe ti ijoba yan and the Iya Atata citation | 619, 623 | `684a6802…b410bf74` | UNRESOLVED |
| `YO-T3-W02-ASSESS-01` | Igbelewon: define oro aropo oruko; explain the pronouns with examples | 595–599 | `339bc53d…4d2d03` | PARTIAL |
| `YO-T3-W02-ASSESS-02` | Apapo igbelewon: definition; examples; five abuda; six akanlo ede ayaworan | 627–635 | `b3405577…b5cfa5f` | PARTIAL |
| `YO-T3-W02-ASSESS-03` | Ise amurele: five multiple-choice questions | 639–649 | `5f29f03b…e9e0a784` | PARTIAL |
| `YO-T3-W02-ASSESS-04` | Apa keji: five past and five present advertising methods; advertise gari, oole and eja; five abuda; four devices | 651–661 | `5a853c1b…86a4977e` | PARTIAL |

Full values are reproducible with the method above. The 8 PARTIAL entries mean the source teaches the objective (or sets the exercise) but no deliverable lesson exists, the row identity gap blocks parsed delivery, and the defects below must be corrected before teaching. The 8 UNRESOLVED entries mean the objective is in the scheme or the sub-heading list but the body teaches nothing.

## What each part teaches
| Part | Definition | Teaching blocks | Exercise |
|---|---|---|---|
| Oro aropo oruko | 441 (one sentence, four examples at 443–449) | Four sub-headings are named at 431–437; only `Abuda` and `Irisi` are developed | Igbelewon 595–599 |
| Abuda | 451 | Six properties: iye 453–457, eni 459–471, ipo 473–481, no two pronouns joined 485–489, no pronoun with `da`/`nko`/`ni`/`ko` 493–499, no `eyan` with a pronoun 501–505 | none |
| Irisi | 509–511 | O two meta announced at 511 and split into bare fragments 513–517; oluwa table and five examples 519–541; abo table and five examples 543–565; eyan table and five examples 567–591 | Apapo 633 asks for five abuda; Apa keji 659 asks for the same five |
| Ipolowo oja | none | Heading 603, topic name repeated 605 and 607; no paragraph | Ise amurele 649; Apa keji 653–657 |
| Ewi keji / Iya Atata | none | Title 619 and one citation 623 | none |

## Source defects (open item `YORUBA-T3-W02-SOURCE-DEFECTS`)
| # | Line | Defect |
|---|---|---|
| 1 | 453–501 | The abuda list numbers 1, leaves the person property at 459 unnumbered, then continues 3 at 473 to 6 at 501 |
| 2 | 553 | The abo grid row reads `Eniketa\tfaweli\t\ttwon`, where the eyo cell should hold a possessive pronoun |
| 3 | 575–577 | The eyan grid gives `re/e` for both enikeji and eniketa |
| 4 | 511–517 | Three ways are announced at 511 but arrive as the bare fragments `O le sise oluwa`, `Abo` and `Eyan ninu gbolohun.` |
| 5 | 555 | The stray line `Oro-ise.` sits inside the abo grid |
| 6 | 525, 549, 573 | `Enikin-ni` at 525 and 573 against `Enikin-in` at 549 |
| 7 | 567 | `o eyan : -` begins the third irisi in lowercase where the other two are `Ipo oluwa` and `Ipo abo` |
| 8 | 441 | No space before `apeere`; the sentence ends `oruko.apeere` |
| 9 | 443, 447 | The name is `Bolu` in the first example and `Bola` in the third |
| 10 | 495–499 | Three questions (`mo n ko?`, `E da?`, `O ko?`) illustrate a prohibition with no stated answer |
| 11 | 509 | `IRISI ORO AROPO – ORUKO.` uses an en dash where the other headings use a plain hyphen or space |
| 12 | 613 | The reference cites `S.S.S. 2` for an SS1 class and misspells `Corpromutt Publihers` with a double space before `Oju iwe` |
| 13 | 641–649 | Every option list is `[a]`, `[b]`, `[d]` with c omitted; `647` labels `E` a pronoun where the items are the pronoun letters of the tables |
| 14 | 649 | The stem `..... ni agunmu owo.` has a blank that none of the options `ipolowo oja`, `ate`, `awin` fits grammatically |
| 15 | 653, 655 | The same task is repeated for past and present with no model or answer |

No correction wording is authored here; the lessons must not copy the uncorrected text.

## Notation (open item `YORUBA-T3-W02-NOTATION`)
- Week 2 (lines 427–678) contains **exactly nine non-ASCII characters**: five U+2018 and three U+2019 quotation marks around the four definition examples at 443–449 and the MCQ letter at 647, and one en dash U+2013 at 509.
- There is no precomposed diacritic, combining mark or soft hyphen anywhere in the section. e/ẹ and o/ọ cannot be distinguished and no tone is marked, although the pronoun tables distinguish `eyo` from `opo` by vowel quality and the `ate` heading names tone. No marks were added or normalised.

## Assessment, visuals and references
- Four exercise sets, none with an answer, solution or marking scheme: Igbelewon 595–599, Apapo igbelewon 627–635, Ise amurele 639–649 and Apa keji 651–661. Recorded as `YORUBA-T3-W02-ASSESSMENT-GAPS`.
- Apapo 635 asks for six `akanlo ede ayaworan` examples, a Week 1 LITIRESO topic, and Apa keji 661 asks for four of the same devices; neither is taught in Week 2.
- `IWE AKATILEWA` 613 cites Adewoyin S.Y (2014), *Imo, Ede, Asa Ati Litireso fun ile Sekondiri Agba*, pages 101–119 — the same pages cited for Week 1 ASA at 357–359. No edition statement or ISBN is given and the pages themselves are not supplied.
- The document contains no Word table, drawing, picture, OLE object, equation or media file (YO-INV-T3); the pronoun tables at 475–481, 523–529, 547–553 and 571–577 are tab-aligned paragraphs whose column structure is flattened in the extraction. No VISUAL_DISPOSITION item is raised.

## Queue changes
- `YO-WK-T3-W02` → `IMPLEMENTED_TESTING_DEFERRED`; its previous `implementation_reference` (`Not yet indexed…`) replaced.
- Appended 4 items, all depending on `YO-SRC-T3` and `YO-WK-T3-W02`:
  - `YO-LES-T3-W02-EDE`, `YO-LES-T3-W02-ASA`, `YO-LES-T3-W02-LIT` (LESSON, PENDING, also depending on `YO-FACT-T3-W02-DEFECTS`).
  - `YO-FACT-T3-W02-DEFECTS` (FACTUAL_DEPENDENCY, BLOCKED) - one recorded expert decision on the defects, the notation and whether the ASA and LITIRESO strands may be taught from an approved external text.
- Counts: items 124 → 128; kinds LESSON 55 → 58 and FACTUAL_DEPENDENCY 19 → 20; coverage 303 → 319; open items 120 → 126; source_rules 7; lessons 0; status 35 implemented / 72 pending / 21 blocked; `next_runnable` → `YO-WK-T3-W03`, the next PENDING item in queue order.

## Limits
- Indexing only: no lesson authored, no source rule added, no asset, no package delivery change, no schema, compiler, parser or importer edit, no importer or plan run. `yoruba.json` was edited only to add coverage and open items and to update `YORUBA-OBJECTIVE-INDEXING`. Testing deferred by owner.
- Not approved and not verified. The row identity gap is recorded, not resolved: the scheme carries no week numbers, so whether `split_before` rules can bind this term belongs to `YO-FND-T3-01` (PENDING).
- The ASA part is a heading with no content and the LITIRESO part is a title with one citation; both are recorded as UNRESOLVED rather than filled from memory, and the textbook they name is not in the source archive, so the lessons cannot be authored from this document.
- The six open items opened by this task are `YORUBA-T3-W02-SCHEME-MAPPING`, `YORUBA-T3-W02-ROW-IDENTITY`, `YORUBA-T3-W02-SOURCE-DEFECTS`, `YORUBA-T3-W02-NOTATION`, `YORUBA-T3-W02-ASSESSMENT-GAPS` and `YORUBA-T3-W02-CONTENT-GAPS`. Each names its own follow-up; none is closed by this note.
