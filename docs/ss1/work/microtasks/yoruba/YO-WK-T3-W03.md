# YO-WK-T3-W03 — Yoruba, 3rd Term, Week 3 objective indexing

Status: **IMPLEMENTED_TESTING_DEFERRED** (implemented; not approved, not verified). Testing deferred by owner. Week 3 is **not delivered**: 14 coverage entries are PARTIAL and 12 are UNRESOLVED, and three lesson items plus one factual-dependency item are appended.

## Inputs
- Base: `origin/master` `b6fef5e0` (merge of PR #259, which carries `YO-WK-T3-W02`), the master the queue lists as `next_runnable: YO-WK-T3-W03`. No open PR touched the Yoruba package or queue when work started (#260 adds one documentation file only).
- Prerequisite `YO-SRC-T3` and predecessors `YO-WK-T3-W01`/`W02` are `IMPLEMENTED_TESTING_DEFERRED`.
- Source `SS1-SRC-4cc6aae9ed7d`, manifest member `SSS 1/3rd Term SS1_/3RD TERM S1 YORUBA.docx`, 68,373 bytes, SHA-256 `a057f7f70d7e99fc34acdb6e725f3d44a426d96f756039bf6f3e6216767416e3`, **re-verified this run** against the supplied archive (SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`). Nothing from the archive or the extract is committed.
- Method (private, outside Git): mammoth 1.12.2 `extractRawText` of the member: 63,445 characters, 2,463 lines, whole-file SHA-256 `4def7729a08d67235d5a7c6fbbcb19a15a93ffdacb96cafc6e477a14edb4d726`, identical to the YO-INV-T3 measurement. Line numbers are 1-based lines of `extractRawText().split('\n')`; hashes are SHA-256 over the stated lines joined with `\n`, edge blanks trimmed, UTF-8. The importer, parser and compiler were not run; the parser's own regexes were applied statically to the same extraction.

## Scheme mapping
- The scheme is flat and unnumbered: line 5 is only `Ose: ` and the eleven groups at 7–83 are separated only by position and the repeated `EDE:`/`ASA:`/`LIT:` prefixes. Week 3 is the third triple, lines 19–23, SHA-256 `cc19fa12f31f31016663e2b334bfd926f6372c81b4d7c13e968c299a6d87ea48` (160 characters). The mapping is documentary by position, confirmed by the teaching label `OSE KETA` at line 679.

| Scheme item | Line | Line SHA-256 | Body binding |
|---|---|---|---|
| `EDE:\tOro-Ise: Agbabo, Alaigbabo, elela, Alailela.` | 19 | `0f4035ea2a3c7d577a7e0c10fb8e08c7f3b7cba72d0b6072feb3788d91cae519` | EDE part 681–849, `dd9527e4f598fc2803b86324926012e957bb1398955a31d9cc8e0d487a2f0967` |
| `ASA:\tEre Idaraya: Ere Osupa, aojoojumo, Ita gbangba, abele.` | 21 | `a3dd7d77d791938ca769ca7e518518f5c97523fd4fc88b663792b475a70d5cdd` | ASA part 869–893, `1e44de8bc037fbd63234b89ef486ac988464dc3b16aea2ab694e641615691157` |
| `LIT:\tItupale iwe asayan ti ijoba yan. WAEC/NECO.` | 23 | `877c508bb10a799b4103aff69547f7f9171524e212c5aeb6c5a975ab1e721547` | LITIRESO part 913–923, `c51db3623f86ebc26ae8409d82a4c843f757611ba6b5216c12d2bd2485e42706` (title and citation only) |

- The EDE row names four types. The body teaches `agbabo` (739) and `elela` (767) and seven further types the row does not name; the words `alaigbabo` and `alailela` occur **zero times** in the section.
- The ASA row names four categories and spells the second `aojoojumo`; the body heading at 877 reads `Ere Ojoojumo` and has no body beneath it.
- The LIT row is the generic `WAEC/NECO` pointer; the body names `Iya Atata` chapters three and four with no text.
- Whether Week 3 is the third triple and how far the extra verb types are in scope is recorded as `YORUBA-T3-W03-SCHEME-MAPPING`; term-wide classification stays with `YO-PRE-T3-1` and `YO-FND-T3-01` (both PENDING).

## Section
- Teaching label `OSE KETA`, line 679, 8 characters, SHA-256 `4ed1dfb73c9327f8b8bfae03213768c47008e9a68b38f1190a6cecc15012d83b`, char offset 13,249; section lines 679–962, SHA-256 `ac42a651d7eec9ae181071b7b7b9141417cee0637953e9ebe1d34fc040a44df5`, 5,056 characters, equal to the YO-INV-T3 value.
- Parts: `ORO ISE` 681–849 (`dd9527e4…2f0967`) with the sub-topic list 683–689 (`b1f27c18…9a41540d`), `AKOONU` 691–699 (`40de7d81…ed281c3f`), the positional tests 703–733 (`da9f0bbc…1bcdfb10`) and `ISORI ORO ISE` 735–849 (`0f14d1c2…0eb760ab2`); `IGBELEWON` 853–857 (`7e77af40…c2777da2`); `IWE AKATILEWA` 863–867 (`e6850745…7f4f06c1`); `ERE IDARAYA` 869–893 (`1e44de8b…15691157`) with `Ere Osupa` 871–873 (`33800acf…59192952`), `Ere Ojoojumo` 877 (`9bfa7023…cb65855b`), `Ere Ita Gbangba` 881–883 (`7efc1c59…c770f855`) and `Ere Abele` 887–893 (`d684ee04…d4f0c0`); `IGBELEWON` 897–903 (`cb409f2f…8d83856b8`); `IWE AKATILEWA` 907–909 (`81aaad3c…edef3c78`); `LITIRESO APILEKO` 913–923 (`c51db362…85e42706`); `APAPO IGBELEWON` 927–935 (`5a9e5bd5…587622b3`); `ISE ASETILEWA` 943–953 (`3bf430a2…125d49b5b`); `APA KEJI` 955–959 (`4d850cba…5e543f13e34`). Lines 960–962 are whitespace only.
- The parser still produces **no rows** for this source (zero `week` substrings, `WEEK_MARKER` 0, `BARE_NUMBER_LINE` 0). `OSE KETA` occurs exactly once and is line-initial. The nine `isori` headings at 739–849 are unnumbered paragraphs. Every entry therefore cites line ranges and block hashes with `lesson_ids: []`; row identity stays with `YO-FND-T3-01`.

## Coverage entries added (26)
| ID | Objective | Lines | Status |
|---|---|---|---|
| `YO-T3-W03-SCHEME-EDE` | Scheme EDE row: oro ise - agbabo, alaigbabo, elela, alailela | 19; 681–849 | PARTIAL |
| `YO-T3-W03-SCHEME-ASA` | Scheme ASA row: ere idaraya - Osupa, ojoojumo, ita gbangba, abele | 21; 869–893 | PARTIAL |
| `YO-T3-W03-SCHEME-LIT` | Scheme LIT row: itupale iwe asayan (WAEC/NECO) | 23; 913–923 | UNRESOLVED |
| `YO-T3-W03-EDE-01` | Definition of oro ise with examples and a removal test | 691–699 | PARTIAL |
| `YO-T3-W03-EDE-02` | Four positional tests for identifying a verb | 703–733 | PARTIAL |
| `YO-T3-W03-EDE-03` | Nine isori oro ise | 735–849 | PARTIAL |
| `YO-T3-W03-EDE-04` | Oriki oro ise (named sub-topic) | 683 | UNRESOLVED |
| `YO-T3-W03-EDE-05` | Iwulo oro ise (named sub-topic) | 685 | UNRESOLVED |
| `YO-T3-W03-EDE-06` | Scheme term alaigbabo | 19 only | UNRESOLVED |
| `YO-T3-W03-EDE-07` | Scheme term alailela | 19 only | UNRESOLVED |
| `YO-T3-W03-EDE-08` | Abuda oro ise asked for by two exercises | 855; 959 | UNRESOLVED |
| `YO-T3-W03-ASA-01` | Ere Osupa with its twelve examples | 871–873 | PARTIAL |
| `YO-T3-W03-ASA-02` | Ere Ojoojumo | 877 | UNRESOLVED |
| `YO-T3-W03-ASA-03` | Ere Ita Gbangba with examples | 881–883 | PARTIAL |
| `YO-T3-W03-ASA-04` | Ere Abele with ayo tita described | 887–893 | PARTIAL |
| `YO-T3-W03-ASA-05` | Ewu inu ere idaraya (asked at 903) | 897–903 | UNRESOLVED |
| `YO-T3-W03-ASA-06` | Oriki ere idaraya (asked at 957) | 955–959 | UNRESOLVED |
| `YO-T3-W03-LIT-01` | Analysis of chapters three and four | 913–923 | UNRESOLVED |
| `YO-T3-W03-LIT-02` | The Iya Atata citation | 919 | UNRESOLVED |
| `YO-T3-W03-LIT-03` | Koko ewi keta ati ekerin (asked at 935) | 927–935 | UNRESOLVED |
| `YO-T3-W03-ASSESS-01` | Igbelewon EDE: six abuda; six verbs with two examples | 853–857 | PARTIAL |
| `YO-T3-W03-ASSESS-02` | Igbelewon ASA: one outdoor play, one indoor play, three dangers | 897–903 | PARTIAL |
| `YO-T3-W03-ASSESS-03` | Igbelewon LITIRESO: analyse chapters three and four | 921–923 | PARTIAL |
| `YO-T3-W03-ASSESS-04` | Apapo igbelewon: four combined items | 927–935 | PARTIAL |
| `YO-T3-W03-ASSESS-05` | Ise asetilewa: five MCQs with four options each | 943–953 | PARTIAL |
| `YO-T3-W03-ASSESS-06` | Apa keji: oriki for a play; five abuda | 955–959 | PARTIAL |

Full hashes are in `yoruba.json` and reproducible with the method above. PARTIAL means the source teaches the objective (or sets the exercise) but no deliverable lesson exists, row identity is unresolved and the defects below must be corrected first. UNRESOLVED means the objective is named in the scheme, the sub-topic list or an exercise but the body supplies no content.

## What each part teaches
| Part | Definition | Teaching blocks | Exercise |
|---|---|---|---|
| Oro ise | 693 (one sentence, two examples, removal test at 699) | — | none before 853 |
| How a verb is identified | 703–705 | Word after subject 705–711; after `n` 713–717; after `yoo/maa/fi/ti` 719–725; after `ko/o` 727–733 | none |
| Isori | 737 | Nine types, one sentence each, unnumbered: agbabo 739, asebeere 749, asokunfa 757, elela 767, akanmoruko 779, asapejuwe 789, asoluwadabo 799, alapepada 815, asinpo 827 | Apapo 929–931 |
| Ere Osupa | 873 | Twelve games in one run-on list | none |
| Ere Ojoojumo | none | Heading only at 877 | none |
| Ere Ita Gbangba | 883 | Okoto, Arin Tita, Ijakadi | IGBELEWON 899 |
| Ere Abele | 889 | Alo Pipa, ayo Tita; ayo described at 891–893 (two players, ope/ota, twelve holes) | IGBELEWON 901 |
| LITIRESO | none | Title 917 and citation 919 only | Igbelewon 923; Apapo 933–935 |

## Source defects (open item `YORUBA-T3-W03-SOURCE-DEFECTS`)
| # | Line | Defect |
|---|---|---|
| 1 | 691 | Opens with three literal backticks: `` ```AKOONU : - `` |
| 2 | 693, 707, 713, 721, 729 | The abbreviation `Ap.`/`ap` is never defined |
| 3 | 709–733, 747, 755, 797, 813 | Quotation marks open without a closing mark or close without an opening one |
| 4 | 693 | Definition, examples and removal test run together with no space after `gbolohun.` |
| 5 | 703 | Heading `ONA TI A FI LE DA ORO-ISE MO.` disagrees with the list wording at 687 |
| 6 | 719 | `yoo,maa,fi ati ti` runs four words together |
| 7 | 727 | `atoka iyisodi` is used with no explanation |
| 8 | 739, 757 | `Oro –ise` uses an en dash where other headings use a hyphen or space |
| 9 | 749, 757 | `da` is listed both as an asebeere and among the asokunfa |
| 10 | 771 | `bawi,reje,pada,danu` is unglossed and `bawi` is unattested elsewhere |
| 11 | 787, 807, 809 | Bracket gloss `[la owo]` unmarked; `mo ti oju.` against `Oju ti mi.` |
| 12 | 819–821 | `Iwo ni o ku mi ku.` and `E rowa  ro ire.` (double space) are garbled |
| 13 | 835, 867 | `Tope ji eran je..` double full stop; line 867 is a lone `.` |
| 14 | 873, 883, 889, 891, 899 | `ile bas u`; `tomode-tagba`; `a bile` for `ni ile`; garbled ope/ota sentence; `gbanagba` for `Gbangba` |
| 15 | 855, 959 | Six abuda asked at 855, five at 959, and no abuda list anywhere in the week |
| 16 | 947, 951 | `o maa n tle oluwa`; MCQ option `lakanlaka` is never taught |
| 17 | 869 | The ASA part has no `ASA` heading |
| 18 | 877 | `Ere Ojoojumo` is a heading with no body |

No correction wording is authored here; the lessons must not copy the uncorrected text.

## Notation (open item `YORUBA-T3-W03-NOTATION`)
- Week 3 (lines 679–962) contains **exactly 21 non-ASCII characters**: five U+2018 and fourteen U+2019 quotation marks, and two en dashes U+2013 at 739 and 757 in `Oro –ise`.
- The curly marks double as apostrophes on verb forms (`ro’`, `nko’`, `ga’`, `ja’`, `de’`) and are unbalanced in the runs at 709–733, 747, 755, 797 and 813.
- There is no precomposed diacritic, combining mark or soft hyphen anywhere in the section. e/ẹ and o/ọ cannot be distinguished and no tone is marked, although the headwords depend on both. No marks were added or normalised.

## Assessment, visuals and references
- Six exercise sets, none with an answer, model or mark allocation: Igbelewon 853–857, Igbelewon 897–903, Igbelewon 921–923, Apapo 927–935, Ise asetilewa 943–953 and Apa keji 955–959. Recorded as `YORUBA-T3-W03-ASSESSMENT-GAPS`.
- This is the first 3rd Term week whose multiple-choice items carry four options (A)–(D); Weeks 1 and 2 omit `(c)`. Two of the five still turn on untaught content (947, 949).
- `IWE AKATILEWA` 865 cites Adewoyin S.Y (2006), *Imo, Ede, Asa Ati Litireso fun ile Sekondiri Agba*, pages 115–162; the ASA reference at 909 cites pages 256–299. No edition statement or ISBN is given and the pages are not supplied.
- The document contains no Word table, drawing, picture, OLE object, equation or media file (YO-INV-T3); the ayo board is described in prose at 893. No VISUAL_DISPOSITION item is raised.

## Queue changes
- `YO-WK-T3-W03` → `IMPLEMENTED_TESTING_DEFERRED`; its `Not yet indexed…` reference replaced.
- Appended 4 items depending on `YO-SRC-T3` and `YO-WK-T3-W03`: `YO-LES-T3-W03-EDE`, `-ASA`, `-LIT` (LESSON, PENDING, also depending on `YO-FACT-T3-W03-DEFECTS`) and `YO-FACT-T3-W03-DEFECTS` (FACTUAL_DEPENDENCY, BLOCKED).
- Counts: items 128 → 132; LESSON 58 → 61 and FACTUAL_DEPENDENCY 20 → 21; coverage 319 → 345; open items 126 → 132; source_rules 7; lessons 0; status 36 implemented / 74 pending / 22 blocked; `next_runnable` → `YO-WK-T3-W04`.

## Limits
- Indexing only: no lesson authored, no source rule added, no asset, no package delivery change, no schema, compiler, parser or importer edit, no importer or plan run. `yoruba.json` was edited only to add coverage and open items and to update `YORUBA-OBJECTIVE-INDEXING`. Testing deferred by owner.
- Not approved and not verified. Twelve objectives have no taught content, and the scheme's two negative verb terms, the `ewu` item and the `oriki` item cannot be answered from this document at all.
- The six open items opened by this task are `YORUBA-T3-W03-SCHEME-MAPPING`, `YORUBA-T3-W03-ROW-IDENTITY`, `YORUBA-T3-W03-SOURCE-DEFECTS`, `YORUBA-T3-W03-NOTATION`, `YORUBA-T3-W03-ASSESSMENT-GAPS` and `YORUBA-T3-W03-CONTENT-GAPS`. None is closed by this note.
