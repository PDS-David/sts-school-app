# DP-INV-T1 — Data Processing, 1st Term week inventory

Status: **IMPLEMENTED_TESTING_DEFERRED** (inventory only; not approved, not verified). Testing deferred by owner.

## Inputs and checks performed
- Base: `origin/master` `c09969a` (fetched at start; open PRs #178 CIV-INV-T1 and #179 COM-INV-T1 touch other subjects; no Data Processing PR). No `AGENTS.md` on master. `DP-SRC-T1` is `IMPLEMENTED_TESTING_DEFERRED` and the 1st Term source is registered in `backend/src/db/ss1/subjects/data-processing.json` as `SS1-SRC-a92792eaa7ef`.
- Source: manifest member `SSS 1/1st Term SS1_/1ST TERM S1 DATA PROCESSING.docx`, 1,056,355 bytes, SHA-256 `a74e8492e632dc43368c7fc49e34389ae034381d4da3617b78824998e29e854b` **verified** from the supplied composite archive `SSS 1-20260507T072431Z-3-001 (1).zip`, whose SHA-256 **was checked** this session: `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e` (equal to the prompt and `SOURCE_ASSIGNMENTS.csv`). `archive_member` kept verbatim.
- Text read with mammoth 1.12.2 `extractRawText`: 39,578 characters, 1,773 lines (699 non-blank), SHA-256 `2f3f7c4c1165bff1d58a62d7cf2cf2ad793ceffbdf16d71fa0e85f74d8b5d375`. Private scratch copy only; nothing from the source is committed.
- Structure on the same bytes: 809 body children; **3** `w:tbl` (a 1 × 1 empty shell at child 2; a 6 × 6 table at child 294; a 6 × 5 table at child 457), **2** pictures (`w:drawing`/`a:blip`), **5** VML `w:pict` shapes in two paragraphs, **1** empty `w:txbxContent`, **10** page breaks, **334** auto-numbered paragraphs (`w:numPr`), **8** superscript runs, **15** `w:tab`, 0 `w:object`/`w:oleObject`, 0 charts, 0 `m:oMath`, 0 `w:sym`, 0 `mc:AlternateContent`. Relationships: 2 images, 3 headers, 3 footers (no header/footer images). One section.
- Media (2 JPEGs, both publisher branding, no teaching image): `word/media/image1.jpeg` 870,389 bytes, 3,306 × 2,515, SHA-256 `b334a0e127cb7f94bf10dd46672a8545fe303971ba10d0dc9a50600962ddea9a` — the cover-page advertisement (identical bytes to the Commerce footer advert); `word/media/image2.jpeg` 106,321 bytes, 949 × 359, SHA-256 `e0c6cda049555ab6…` — the tutor logo strip beside the title. Both carry a phone number and e-mail address and must not be committed or reproduced in lessons.
- Footers: `footer2.xml` text `MR OSHO/1ST TERM/DATA PROCESSING/SS1Page 2`; headers and the other two footers are empty. Document properties: creator `Blessing Ayedun`, last modified by `tosyno`, created 2016-10-04, modified 2019-08-28, revision 126, last printed 2018-07-17.
- Nothing run: no tests, typechecks, importer, database, device or deployment. No credential or password occurs in the text; no click-by-click or executable procedure appears (the "three steps" at 191 are the conceptual input stages, not instructions to execute).

## Locator method
Line numbers are 1-based over the `extractRawText` output split on `\n`. A range runs from the `WEEK …` marker line to the last non-blank line before the next marker (document end for Week Ten); the SHA-256 is over those lines joined with `\n`, UTF-8. Labels and topic lines are quoted exactly; `\t` denotes a literal tab.

## Inventory
Unlabelled opening: lines 1–81, SHA-256 `07f34cdccb656a70155d2a989ffc5a737c39292a710d37021c16e7e6307c1d54`. It holds the cover advertisement and blank space (1–34), `FIRST TERM E-LEARNING NOTE` (35) with the logo strip, the subject/class line `SUBJECT:  DATA PROCESSING\t\t\t\t\t\tCLASS:  SSS1` (39), `SCHEME OF WORK` (43), `WEEK\tTOPIC` (47), twelve auto-numbered scheme rows (49–71), and `REFERENCES` (75) with three numbered entries (77–81: `Data Processing forSenior Secondary Education by Hiit Plc.`, `A Handbook on Computer Studies by NiyiAdekolegan.`, `On-line Materials.`). The scheme's numbers are Word list numbering: the extracted text contains the twelve labels without their numbers.

| Week | Marker line (exact) | TOPIC line (exact) | Lines | SHA-256 |
|---|---|---|---|---|
| 1 | `WEEK ONE` | `TOPIC: INTRODUCTION TO DATA PROCESSING` | 87-281 | `836f73d0570e28df4dca685d5e34818d0de10e41ee72d8226e422ace997b6567` |
| 2 | `WEEK TWO` | `TOPIC: HISTORY OF COMPUTING` | 287-429 | `c5d048b437c13cff6b205906da399d2bed18f01bc0cadc0503d8fc346ac5366b` |
| 3 | `WEEK THREE` | `TOPIC:  GENERATIONS OF COMPUTERS` | 435-581 | `23f33f0dfe418f06a5570aa13bc045679fcc1dab8de099cd55d87f70dd832c65` |
| 4 | `WEEK FOUR` | `TOPIC:  HISTORY OF COMPUTERS` | 585-725 | `210e0a92f9873777c7b9ffe98c3ca60de11c8e6b05a89344fd7c1b4fa35440cd` |
| 5 | `WEEK FIVE` | `TOPIC: CLASSIFICATION OF COMPUTER BY TYPES` | 729-827 | `83265555dcb256a4cd41958b45dd22a1618be77da7fc2b6384229abf0ead1a54` |
| 6 | `WEEK SIX` | `TOPIC:  CLASSIFICATION OF COMPUTERS BY SIZE` | 833-955 | `f5baab600d56c2f882b56fe1ba4cc979b80be57cf0379e0080e371b1c27dc020` |
| 7 | `WEEK SEVEN` | `TOPIC: DIGITALIZATION OF DATAI` | 961-1193 | `217a893e0cb0aa5333726149e6d6a1d02bf70bff44646d49aa5b0813cda519fc` |
| 8 | `WEEK EIGHT` | `TOPIC: DIGITALIZATION OF DATA II.` | 1197-1455 | `ee64f1ac95194f79236dd14b516909f92668b6b3987ddf26bf7f246b31912685` |
| 9 | `WEEK NINE` | `TOPIC:  ICT APPLICATION IN EVERYDAY LIFE` | 1459-1607 | `7c54fd0952ff030b07ba5ee999adb19c57fc586ff569525d6fb5579b893fe89b` |
| 10 | `WEEK TEN` | `TOPIC:  DATA AND INFORMATION` | 1613-1771 | `e581a7b51abd74f527a8f2b59a11cf64fc385346bf20a586dddf01cf946b3901` |

Week count: **ten** teaching weeks, each with a body. The file ends at line 1,773 (blank); the last content line is 1,771 under Week Ten's `THEORY`.

## Scheme-to-body mapping
| Scheme item (line) | Body | Note |
|---|---|---|
| Introduction to Data Processing (49) | Week One | — |
| History of Computing (51) | Week Two | body adds `NUMBER SYSTEM (REVISION)` (379–392) |
| History of Computer I. (53) | Week Three (nominal) | body topic is `GENERATIONS OF COMPUTERS`, which no scheme row names |
| History of Computer II. (55) | Week Four | body topic `HISTORY OF COMPUTERS` and the generations table (589 onwards) |
| Classification of Computers I. (57) | Week Five | types and functionality |
| Classification of Computers II. (59) | Week Six | by size |
| Digitalization of Data I. (61) | Week Seven | body adds early counting devices and the information-age table |
| Digitalization of Data II. (63) | Week Eight | components, hardware, software, peopleware |
| ICT Application in Everyday Life (65) | Week Nine | — |
| Data and Information (67) | Week Ten | — |
| Revision (69) | none | auto-numbered row 11; no `WEEK ELEVEN` marker, no body |
| Examination (71) | none | auto-numbered row 12; no `WEEK TWELVE` marker, no body |

The scheme and the body drift: Week Three teaches generations of computers that the scheme does not name, and rows 3–4 both say "History of Computer" while the bodies split into generations (W3) and a history table (W4). Recorded, not corrected.

## Assessment blocks inside the weeks (all preserved, none answered)
- `EVALUATION`: 179–186, 337–344, 497–504, 527–534, 761–768, 871–878, 1075–1082, 1277–1284, 1307–1314, 1325–1336, 1349–1356, 1563–1570, 1661–1670.
- `GENERAL EVALUATION`: 233–246, 393–404, 535–546, 689–700, 791–802, 913–924, 1155–1166, 1419–1430, 1571–1582, 1727–1740.
- `READING ASSIGNMENT`: 247–252, 405–410, 547–552, 701–706, 803–808, 925–930, 1169–1174, 1431–1436, 1583–1588, 1741–1746. They cite Hiit Plc's *Data Processing for Senior Secondary Education* and *A Handbook on Computer Studies* by Niyi Adekolegan.
- `WEEKEND ASSIGNMENT` (one space-trailing at 1747): 253–276, 411–424, 553–566, 707–720, 809–822, 931–948, 1175–1188, 1437–1450, 1589–1602, 1747–1766.
- `THEORY`: 277–281, 425–429, 567–580, 721–724, 823–826, 949–955, 1189–1193, 1451–1455, 1603–1607, 1767–1771.
- Week Four has **no** `EVALUATION` block (its assessment is only GENERAL EVALUATION 689–700); Week Eight has four EVALUATION blocks; Week Three has two. Week Seven's GENERAL EVALUATION (1155–1166) asks about computer sizes and mainframes, i.e. Week Six content, and repeats the Week Six question at 919.
- No answer key, marking scheme, mark allocation or rubric appears (searched `answer`, `marking`, `marks`, `score`, `rubric`). Multiple-choice blanks are printed as runs of the ellipsis character U+2026 (93 occurrences).

## Tables
- Child 294, inside Week Four after `Consider the table below:` (589): **6 rows × 6 columns** — Generations Of computers / Year of development / The TechnologyUsed / Characteristics / SoftwareInstruction / StorageCapacity; data rows First 1951–1958, Second 1959–1964, Third 1965–1975, Fourth 1975–1982, Fifth 1982 and above.
- Child 457, inside Week Seven under `TECHNOLOGY OF DIFFERENT INFORMATION AGE` (995): **6 rows × 5 columns** — Information age / Tools used / Purpose / Time period / Examples of tools in that age; rows Stone, Iron, Middle, Industrial, Electronic age.
- Child 2 is a 1 × 1 empty table shell at the top (no cell text).
- mammoth flattens each cell into its own paragraph and splits wrapped cells (`Generations ` / `Of computers` at 591–593; `Year of ` / `development` at 595–597), so the tables survive only as a loose cell sequence. Both tables need a visual/structural disposition: `DP-VIS-T1-W04-TBL-GENERATIONS` and `DP-VIS-T1-W07-TBL-AGES`.

## Diagrams
Two copies of the same input → processing → output flow, each drawn with two VML straight connectors (`w:pict`, shape type `#_x0000_t32`) and plain-text labels:
- Week One, line 105: `INPUT\t\tPROCESSING\t\t\tOUTPUT` (paragraph child 51, two arrow shapes, page break follows).
- Week One, line 169: `INPUT                               PROCESSINGOUTPUT` (paragraph child 83, two arrow shapes) under `Element of data processing;`.
The arrows are not images and cannot be extracted as pictures; the labels survive as text, the arrow geometry does not. Disposition item: `DP-VIS-T1-W01-CYCLE`. No flowchart, screenshot or other diagram appears anywhere else.

## Embedded media
Both JPEGs are publisher branding, not teaching content: the cover advertisement (3,306 × 2,515; bytes identical to the Commerce footer advert) and the tutor logo strip beside the title (949 × 359). Both contain a telephone number and an e-mail address, so they must not be committed, rendered into lessons or treated as curriculum content. Disposition item: `DP-VIS-T1-PUBLISHER-MEDIA`. The headers are empty and the working footer carries only `MR OSHO/1ST TERM/DATA PROCESSING/SS1Page 2`.

## Findings for the importer's parser (findings only; no rules added)
- `split_before` candidate: exactly ten `WEEK <WORD>` lines (87, 287, 435, 585, 729, 833, 961, 1197, 1459, 1613), upper case, single space, alone on the line. No tab-prefixed or numbered form occurs in the body. The scheme rows (49–71) are list-numbered paragraphs and must not split.
- `attach_stranded_label` candidate: every `TOPIC: …` line (89, 289, 437, 587, 731, 835, 963, 1199, 1461, 1615) must attach to the preceding `WEEK` label. Week Four opens with a table (589 `Consider the table below:`) before any heading, so the topic line is the only anchor. Week Seven's topic is printed `DIGITALIZATION OF DATAI` (no space before `I`), Week Three and Week Four use a double space after `TOPIC:`, and Week Ten's topic is followed directly by `DEFINITION OF DATA` (1617).
- `classify_marker` candidate: scheme rows 11–12 are `REVISION` (69) and `EXAMINATION` (71); they are auto-numbered list items without a visible number in the text and have no body. `NUMBER SYSTEM (REVISION)` (379–392) is the opposite case: a revision heading with substantive teaching inside Week Two, which must be classified by body, not as a calendar marker. `GENERAL EVALUATION`/`EVALUATION`/`WEEKEND ASSIGNMENT`/`THEORY` are assessment blocks; `WEEKEND ASSIGNMENT ` at 1747 has a trailing space.
- Numbering and script flattening: 334 auto-numbered paragraphs lose their numbers in `extractRawText` (the twelve scheme rows, the three references, and every numbered content list such as the properties of data at 131–147); 8 superscript runs lose their formatting, producing `10`+`6` as `106chips` in the second table's Fifth generation row and century markers as `12th`, `13th`, `18th`, `19th`. The docx contains 13 non-breaking spaces, 93 ellipsis fills, 16 right single quotes, 3 en dashes and 2 curly double quotes that must survive re-authoring.
- Page breaks (10) do not line up with week markers except before Weeks Four, Five, Eight and Nine; they are typographic and must not be treated as section boundaries.

## Content issues recorded (not corrected here)
- Scheme/body drift described above; `GENERATIONS OF COMPUTERS` is absent from the scheme and rows 3–4 overlap.
- Week Seven's GENERAL EVALUATION mixes Week Six questions (sizes, mainframe, mini computers) with its own, duplicating 919 at 1163.
- Table wording is compressed: `100-1000Chips`, `1000 above`, `VLSIC` (for VLSI), `MultiprogrammingFacilities`, `Expertsystem`, `soeed.Timeliness`, `12thcentury`, `106chips` (10⁶ chips).
- Misspellings and spacing: `Robort` in a Week Three option (559), `Data Processing forSenior…` (77), `NiyiAdekolegan` (79), `DATAI` (963).
- The two cycle diagrams are duplicates of the same flow (105 and 169).

## Factual, safety and neutrality flags (later correction work; nothing corrected here)
- The generations table (W4, child 294) and the generation prose (W3, 439–572) carry specific years and technology claims (First 1951–1958 vacuum tube; Fifth 1982 and above `AI and Expertsystem`; `10⁶ chips`) and the Week Three statement that electronic machines `evolved about 1945` with `UNIVAC` as example. These are dated historical claims that need authoritative sources with dates, kept distinct from the source's wording.
- Obsolete or dated hardware examples: `PDP  II, VAX 750/6000, NCR 9300, DEC, HP 3000` (883), mainframe/supercomputer claims (857–861), and the Week Seven/Weeks Nine–Ten references to `CD-ROM, Internet, Intranet and extranets` (981). Any lesson needs current, dated examples rather than these models presented as current.
- Dated technical claims to verify: `A computer does not understand English or any of the Nigerian languages` (1397) and the fifth-generation `AI and Expert system` claim (511–519), plus the ICT impact/negative-effect lists (1535–1562) where they assert current social or economic effects. Cite dated sources, keep the original wording separate, and stay neutral on contested social claims.
- No password, credential, or unsafe executable instruction was found; practical steps are conceptual (the three input stages at 191–205). No step may be turned into a required live execution.

## Edits made by this item
- Appended to `docs/ss1/work/microtasks/data-processing/QUEUE.json`, with dependencies `DP-INV-T1` + `DP-SRC-T1` and status `PENDING`: `DP-PRE-T1` (opening/scheme/references indexing), `DP-WK-T1-W01` … `DP-WK-T1-W10`, `DP-MARK-T1-REVEXAM` (scheme rows 11–12 and the in-body revision section), `DP-VIS-T1-W01-CYCLE`, `DP-VIS-T1-W04-TBL-GENERATIONS`, `DP-VIS-T1-W07-TBL-AGES`, `DP-VIS-T1-PUBLISHER-MEDIA`, `DP-PRES-T1-NUMBERING`, `DP-PRES-T1-SUPERSCRIPT`, `DP-FACT-T1-GENERATIONS`, `DP-FACT-T1-HARDWARE-MODELS`, `DP-FACT-T1-DIGITALIZATION-CLAIMS`.
- Set `DP-INV-T1` to `IMPLEMENTED_TESTING_DEFERRED` with the evidence above; recomputed `counts`, `status_counts` and `next_runnable`; appended a queue note.
- No lesson, coverage entry, correction, asset or parser rule was written; no other subject, shared file, package or test file was touched.

## Not done
No tests, typechecks, importer/plan run, database/device check, migration, import or deployment (deferred by owner). No merge. Data Processing stays a separate subject (not renamed Computer Studies or ICT). Week count and labels above are what the document itself contains.
