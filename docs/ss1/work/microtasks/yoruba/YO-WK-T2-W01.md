# YO-WK-T2-W01 — Yoruba, 2nd Term, Week 1 objective indexing

Status: **IMPLEMENTED_TESTING_DEFERRED** (implemented; not approved, not verified). Testing deferred by owner. Week 1 is **not delivered**: 12 coverage entries are PARTIAL and 2 UNRESOLVED, and three lesson items plus one factual-dependency item are appended.

## Inputs
- Base: `a2b1320` (the `ss1/yo-fnd-t1-01` tip; PR #209 open against `ss1/yo-vis-t1-02`), stacked on the merged #199–#207 chain. `origin/master` is still `9f745bb` and carries only PR #199. This item's PR targets `ss1/yo-fnd-t1-01`.
- Prerequisite `YO-SRC-T2` is `IMPLEMENTED_TESTING_DEFERRED`. No open PR owned YO-WK-T2-W01 when work started.
- Source `SS1-SRC-ec4a5095420d`, manifest member `SSS 1/2nd Term SS1_/2ND TERM S1 YORUBA.docx`, 66,197 bytes, SHA-256 `73bfb9760a678e113e9a44c4d5073c5d59eb463d0846e384483726fc94bcc9ac` **re-verified this run** from the supplied archive (SHA-256 `02448712…65c9a3e`), matching the prompt, the package and YO-SRC-T2.
- Method (private, outside Git): mammoth 1.12.2 `extractRawText` of the member: 53,525 characters, 2,433 lines. Line numbers are 1-based lines of `extractRawText().split('\n')`; hashes are SHA-256 over the stated lines joined with `\n`, edge blanks trimmed, UTF-8. Importer, parser and compiler were not run; the parser regexes were applied statically to the same extraction, as noted below.

## Scheme mapping
- The 2nd Term scheme is a paragraph list headed `ILANA ISE OSOOSE FUN SAA KEJI` (line 7). Week 1 is **explicitly labelled** (unlike the 1st Term list): `Ose  kinni- Ede-Atunyewo awon isori oro` (line 9), with five EDE sub-topics (lines 11–19), `Asa- Oge sise` (line 21) and `  Litireso-Itupale asayan iwe litireso` (line 23). The whole row is lines 9–23, SHA-256 `1d57865591bfc8d86e0690f5806f73279f4f89dc8ee1f64c979a0d278ddc3d51`.

| Scheme item | Line | Line SHA-256 | Body binding |
|---|---|---|---|
| `Ose  kinni- Ede-Atunyewo awon isori oro` | 9 | `4738cd57…c08625f0` | ORI-ORO heading, line 151 |
| `oro aropo oruko` | 11 | `375188e5…e2b9304d` | Part at 157–323 |
| `oro aropo afarajoruko` | 13 | `b40d362e…110de2da` | Part at 329–403 |
| `oro  atokun` | 15 | `c19a1d54…15ad5bd5` | Part at 659–727 |
| `oro asopo` | 17 | `39041cc5…3098a8f7` | Part at 569–655 |
| `oro-ise` | 19 | `27ca69ad…8ddb3b2a` | Part at 501–563 |
| `Asa- Oge sise` | 21 | `48233c58…b8e8de3b` | **No teaching body** |
| `  Litireso-Itupale asayan iwe litireso` | 23 | `52f8f3bb…c60283c1` | Pointer 405–407 only |

- The body teaches **seven** EDE parts: the five listed plus `oro aponle` (411–497) and `oro apejuwe` (737–783), which fall under the row general heading `Atunyewo awon isori oro` although the sub-list omits them. `oro-asopo` and `oro-atokun` appear in the body in the reverse of the scheme order.
- Line 153 announces `-Oro-oruko` under the ORI-ORO heading, but no oro-oruko section follows; the scheme places oro-oruko in Week 10 (line 125). The announcement is recorded in `YORUBA-T2-W01-CONTENT-GAPS`.
- The mapping inference and the extra parts are recorded as `YORUBA-T2-W01-SCHEME-MAPPING`; classification of the whole 12-row scheme belongs to `YO-PRE-T2-1` (PENDING).

## Section
- Teaching label `OSE KINNI`, line 149, SHA-256 `b7e9218db066e7bbdddb0fb05a076de376ecb45fe31923e958c4f8133f2d6989`; section lines 149–854, SHA-256 `53462d0b7dc26f243193177332b13216518a3aa3ad4949fa10cb3454169a1190`, equal to the YO-INV-T2 value.
- Parts: `ORI-ORO-;ATUNYEWO AWON ISORI ORO` 151–783 (`5d1ea2ce…a00e406`), `LITIRESO.` 405–407 (`2ea3db94…c154a3`), `Igbelewon` 785–793 (`33aa4b42…df09152`), `Igbelewon` 795–803 (`96e6e4ad…f2713f1a`), `IWE AKATILEWA` 805–809 (`e8b6f1be…58e341d`), `-ISE  ASETILEWA` 811–841 (`cf47123e…63fc42cd`), `Apa keji` 843–853 (`aafd4aed…85161a11`).
- There is **no ASA part**. `Oge sise` occurs in Week 1 only inside the Igbelewon questions at 797 and 799.
- The parser produces **no rows** for this source: the extraction contains no `week` substring and no bare-number line, so `WEEK_MARKER` and `BARE_NUMBER_LINE` match zero times and `parseTopics` returns `[]` (`NO_PARSED_LESSONS`). These are the parser's own regexes applied statically to the same extraction, not a parser run. No `SS1-SRC-ec4a5095420d:BODY:<sha256>` identity exists; every coverage entry cites exact line ranges and UTF-8 block hashes, with `lesson_ids: []`.

## Coverage entries added (14)
| ID | Objective | Lines | Block SHA-256 | Status |
|---|---|---|---|---|
| `YO-T2-W01-SCHEME-EDE` | Scheme EDE objective bound to the EDE part | 9–23; 151–783 | `1d578655…`; `5d1ea2ce…` | PARTIAL |
| `YO-T2-W01-SCHEME-ASA` | Scheme ASA objective: Oge sise | 21; none | `48233c58…` | UNRESOLVED |
| `YO-T2-W01-SCHEME-LIT` | Scheme LITIRESO objective: Itupale asayan iwe litireso | 23; 405–407 | `52f8f3bb…`; `2ea3db94…` | UNRESOLVED |
| `YO-T2-W01-EDE-01` | Oro aropo oruko: definition, six abuda, three irisi | 157–323 | `3a8a876e…` | PARTIAL |
| `YO-T2-W01-EDE-02` | Oro aropo afarajoruko: definition, five abuda, irisi | 329–403 | `008e6aaa…` | PARTIAL |
| `YO-T2-W01-EDE-03` | Oro aponle: definition, two types, examples (extra to sub-list) | 411–497 | `0e6cdff6…` | PARTIAL |
| `YO-T2-W01-EDE-04` | Oro-ise: definition, four tests, nine isori, asinpo example | 501–563 | `b5350e2f…` | PARTIAL |
| `YO-T2-W01-EDE-05` | Oro-asopo: definition, function, uses of ati/pelu/oun and sugbon/tabi/amo | 569–655 | `d04ad84a…` | PARTIAL |
| `YO-T2-W01-EDE-06` | Oro-atokun: definition and the three uses si, ti, ni | 659–727 | `3dd6d3a3…` | PARTIAL |
| `YO-T2-W01-EDE-07` | Oro apejuwe: definition, examples, two types (extra to sub-list) | 737–783 | `b22615f4…` | PARTIAL |
| `YO-T2-W01-ASSESS-ADJ` | Igbelewon: identify the adjective in three sentences | 785–793 | `33aa4b42…` | PARTIAL |
| `YO-T2-W01-ASSESS-REVISION` | Igbelewon: four revision questions (oge sise, oro-ise, oro-oruko) | 795–803 | `96e6e4ad…` | PARTIAL |
| `YO-T2-W01-ASSESS-ISE` | Ise asetilewa: five MCQs; reading list | 805–841 | `e8b6f1be…`; `cf47123e…` | PARTIAL |
| `YO-T2-W01-ASSESS-APA` | Apa keji: three explain-with-three-examples tasks | 843–853 | `aafd4aed…` | PARTIAL |

Full values are reproducible with the method above. The 12 PARTIAL entries mean the source teaches the objective (or sets the exercise) but no deliverable lesson exists, the row identity gap blocks parsed delivery, and the defects below must be corrected before teaching. The 2 UNRESOLVED entries mean the objective is in the scheme but the body teaches nothing.

## What each EDE part teaches
| Part | Definition | Teaching blocks | Exercise |
|---|---|---|---|
| Oro aropo oruko | 169–177 | Six abuda 179–235 (number, person, case, no coordination, da/nko/ni/ko, eyan); three irisi 237–317 (oluwa, abo, eyan) with person/number tables | Igbelewon 319–323 (two questions) |
| Oro aropo afarajoruko | 337–343 | Five abuda 345–395 (number and person, coordination, da/nko/ko, two syllables, eyan; ni-fronting at 391); irisi 397–403 (subject only) | none |
| Oro aponle | 419–437 | Two types 441–473 (aiseda; aseda by reduplication); five derived examples 477–497 | none |
| Oro-ise | 515–531 | Four positional tests 523–531; nine isori 533–553; asinpo worked example 555–563 | none |
| Oro-asopo | 583–601 | Function 605; ati/pelu/oun for nouns 609–621 and pronouns 625–643; sugbon/tabi/amo for clauses 647–655 | none |
| Oro-atokun | 671–677 | Destination si 687–697; origin ti 703–713; location ni 717–727 | none |
| Oro apejuwe | 739–761 | Two types 765–783 (ipile; iseda by apetunpe) | Igbelewon 785–793 (three sentences) |

## Source defects (open item `YORUBA-T2-W01-SOURCE-DEFECTS`)
| # | Line | Defect |
|---|---|---|
| 1 | 187 | Second of the six abuda of oro aropo oruko is unnumbered while items 1 and 3–6 are numbered |
| 2 | 447–449, 461 | The two-item oro aponle list carries no numbers while the aseda definition at 461 is numbered `2.` |
| 3 | 609, 625, 635, 647 | Oro-asopo items run `(a)`, `(b)`, `(d)`, `(e)`; `c` is omitted |
| 4 | 799–803 | Igbelewon Q2–Q4 carry no number although Q1 at 797 is numbered `1.` |
| 5 | 817–839 | Every MCQ option list is `(a)`, `(b)`, `(d)`; Q3 option `(d)` at 829 is empty |
| 6 | 431, 469 | `ituom` for `itumo`; `peleple` for `pelepele` |
| 7 | 515 | `gbolohunoro-ise` joins two terms without a space; `opomulero` |
| 8 | 535, 549, 553 | `Orisiirisii`; `Eyi nip e a le si`; `ti a le ri fayo` |
| 9 | 601 | Particle list runs together: `ati pelu, oun afi sugbon nigba ti, ayafi, abi, amo, bee ni, yala, tabi anbosi bosi abbl` |
| 10 | 627, 635 | `apeeere`; `oro-aropo` for `oro aropo` |
| 11 | 739 | `Oro-apejuwe-;` and `ohun ti a n soro ba ninu iso` |
| 12 | 779–783 | Closing reduplication example garbled: `nla- ile nlanla ni won fun wa` |
| 13 | 789, 827, 831, 837 | `Sile mefamefa ni oluko fun wa`; unclosed quote and `lau je je`; stray dot in `4.   .`; `Iwo oun Deinde kii segbe` |
| 14 | 279, 151 | `faweli` in the singular cell of the abo table; `ORI-ORO-;ATUNYEWO` run together |
| 15 | 371, 391, 575, 671, 703 | `wunren` where the particle term is normally written `iwunren` |
| 16 | 687, 717; 769 vs 461 | `atoka` beside `atokun`; `iseda` against `aseda` for the derived class |

No correction wording is authored here; the lessons must not copy the uncorrected text.

## Notation (open item `YORUBA-T2-W01-NOTATION`)
- Week 1 (lines 149–854) contains **no precomposed diacritic and no combining mark**. Its only non-ASCII characters are 80 curly quotes, 12 en dashes and one ellipsis. The 133 precomposed diacritics counted document-wide by YO-INV-T2 all lie outside Week 1.
- Consequently e/ẹ and o/ọ cannot be distinguished anywhere in this week and no tone is marked, although the pronominal person forms, the aponle tone patterns and the minimal-pair examples depend on both. No marks were added or normalised.

## Assessment, visuals and references
- Five exercise sets, none with an answer, solution or marking scheme: Igbelewon 319–323 (two questions), Igbelewon 785–793 (identify the adjective in three unnumbered sentences), Igbelewon 795–803 (four revision questions, only Q1 numbered), Ise asetilewa 811–841 (five MCQs) and Apa keji 843–853 (three explain-with-three-examples tasks). Recorded as `YORUBA-T2-W01-ASSESSMENT-GAPS`.
- `IWE AKATILEWA` 805–809 lists two references (`Imo, ede, asa ati litireso fun ile-eko sekondiri agba i.o. 163`; `Eko ede Yoruba titun i. o.105`). The abbreviation `i.o.` is undefined and its spacing differs between the lines; no edition or author is given.
- The document contains **no Word table, drawing, picture, OLE object, equation or media file** (YO-INV-T2). The `Ate` lists are tab-aligned paragraphs, so their column structure is flattened in the extraction but recoverable from the tabs; no VISUAL_DISPOSITION item is raised.

## Queue changes
- YO-WK-T2-W01 → `IMPLEMENTED_TESTING_DEFERRED`; previous `next_runnable` value consumed.
- Appended 4 items, all depending on `YO-SRC-T2` and `YO-WK-T2-W01`:
  - `YO-LES-T2-W01-EDE`, `YO-LES-T2-W01-ASA`, `YO-LES-T2-W01-LIT` (LESSON, PENDING, also depending on `YO-FACT-T2-W01-DEFECTS`) — replacement lessons for the EDE strand and for the two untaught objectives.
  - `YO-FACT-T2-W01-DEFECTS` (FACTUAL_DEPENDENCY, BLOCKED) — one recorded expert decision on the defects and the notation.
- Counts: items 80 → 84; kinds add LESSON 3 and FACTUAL_DEPENDENCY 1; status 20 implemented / 54 pending / 10 blocked; `counts` sums to 84. `next_runnable` → `YO-WK-T2-W02`, the first eligible PENDING item in queue order.

## Limits
- Indexing only: no lesson authored, no source rule added, no asset, no package delivery change, no schema, compiler, parser or importer edit, no importer or plan run. `yoruba.json` was edited only to add coverage and open items and to update `YORUBA-OBJECTIVE-INDEXING`. Testing deferred by owner.
- Not approved and not verified. The row identity gap is recorded, not resolved: whether the nine 2nd Term section labels can be introduced by `split_before` belongs to `YO-FND-T2-01` (PENDING). The ASA and LITIRESO gaps and the scheme mapping are recorded as open items; no objective was invented beyond the text.
