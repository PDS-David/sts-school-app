# GOV-INV-T1 — Government, 1st Term inventory

Status: **IMPLEMENTED_TESTING_DEFERRED** (inventory only; not approved, not verified). Testing deferred by owner.

## Inputs
- Starting SHA `451369d`; master advanced to `4159336` (merge of the Geography inventory PR #187) before publishing, and no Government file differs between the two. The only remote branches naming this subject are the older `ss1/gov-src-t1-20261027`, `ss1/government-gov-src-t2`, `ss1/government-gov-src-t3` and `ss1/government-queue`; no Government inventory branch or PR exists, so this task is not owned elsewhere.
- Source `SS1-SRC-40ce7dcaf672`, manifest member `SSS 1/1st Term SS1_/1ST TERM S1 GOVERNMENT.doc`; composite archive SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e` **verified**; member SHA-256 `50508a226b21bc5862b1f814d14a3d6bf2a56ff9d29867116931f5a7e58c9c1a` **verified**, 1,163,776 bytes. That size equals the 1st Term Geography member's size while the hash differs, so identity was settled by hash, not by size.
- Method (all private, outside Git): (1) `word-extractor` 1.0.4 `getBody()` — the importer's legacy `.doc` call — giving 865 lines / 52,506 characters, plus `getHeaders({includeFooters:true})`; (2) a direct OLE decode of `WordDocument` + `1Table` (one piece, so no piece seams) giving 52,612 characters, so control characters are counted rather than dropped; (3) `antiword -x db` as an independent structure check; (4) a signature scan of the `Data` and `WordDocument` streams plus Pillow dimensions for embedded images; (5) `olefile` metadata and section structure. The importer, compiler, schema and tests were not run.
- Block convention: the SHA-256 of the stated 1-based `getBody()` lines, joined with `\n`, UTF-8, no trailing newline. Trailing blank lines are trimmed from every span. Whole body 1–865: `aba29e495ff118d32f662c4e378c89a47ed6792053b48d5e1c3260281fd603b5` (52,507 bytes).

## Scheme of work
`SCHEME OF WORK` (21), header row 23 `WEEK<TAB>TOPIC`, rows 24–42; block 21–42 SHA-256 `7282181eb168ae114a2311b961108afe4a7111d2211eabe8e0139a97d38bb0a8` (753 bytes). Tabs are shown as `<TAB>`.

| Wk | Scheme wording (verbatim) | Lines | Body label |
|---|---|---|---|
| 1 | `1.<TAB>The Meaning and the Scope of the Subject Matter: Government`; sub-lines `Government as an Institution of the State`, `Government as an Art of Governing`, `Government as an Academic Field of Study` | 24–27 | `WEEK ONE` 45 |
| 2 | `2.<TAB>Features/Characteristics of government;`; sub-lines `Features of Government`, `Functions of Government`, `Why we Study Government` | 28–31 | `WEEK TWO` 105 |
| 3 | `3.<TAB>Basic Concepts of Government:`; sub-lines `Power`, `Authority` | 32–34 | `WEEK THREE` 179 |
| 4 | `4.<TAB>i) Legitimacy<TAB>ii) Sovereignty<TAB>iii) Democracy` | 35 | `WEEK FOUR` 257 |
| 5 | `5.<TAB>i) Communalism<TAB>ii) Feudalism` | 36 | `WEEK FIVE` 378 |
| 6 | `6.<TAB>i) Socialism<TAB>(ii) Communism<TAB>(iii) Capitalism` | 37 | `WEEK SIX` 463 |
| 7 | `7.<TAB>i) Fascism<TAB>ii) Nazism<TAB>iii) Totalitarianism` | 38 | `WEEK SEVEN` 553 |
| 8 | `8.<TAB>State and Nation; Political Culture` | 39 | `WEEK EIGHT` 635 |
| 9 | `9.<TAB>Political Socialization` | 40 | `WEEK NINE` 703 |
| 10 | `10.<TAB>Characteristics of government: (i) Unitary government (ii) Federal government.` | 41 | `WEEK TEN` 750 |
| 11 | `11.<TAB>Revision/examination` | 42 | **no body row anywhere** |

The scheme is plain paragraphs, not a Word table (`antiword` reports no table here). Rows 1–3 continue on line-start sub-lines (25–27, 29–31) that must not be read as new week rows. Rows 4–9 pack their sub-topics onto one line with tabs and mix `i)`, `ii)` and `(ii)` forms. Row 1 begins `1.` followed by ten spaces then a tab; the other rows begin `n.<TAB>` or `n.<TAB><TAB>`. There is no row 12.

## Week inventory (getBody)
| Item | Label | Subtitle and section headings (lines) | Span | Block SHA-256 | Markers (lines) |
|---|---|---|---|---|---|
| W01 | `WEEK ONE` 45 | `TOPIC: THE MEANING AND SCOPE OF THE SUBJECT MATTER: GOVERNMENT` 46; `CONTENT` 47; sections 52, 62, 69 | 45–102 | `cbce46f8555ccf042f113c0d5694daeb0e617e2cb7dfdb915fe1c7b939990e04` | `EVALUATION QUESTION` 58, 74; `GENERAL EVALUATION/REVISION QUESTIONS` 78; `READING ASSIGNMENT` 84; `WEEKEND ASSINGMENT` 88; `THEORY` 100 |
| W02 | `WEEK TWO` 105 | `TOPIC: FEATURES/CHARACTERISTICS OF GOVERNMENT` 106; `CONTENT` 107; sections 112, 124, 136 | 105–176 | `7033a59e217a778fa0e5d8008fab1a1c9fa348e77b8b85ebcc6b3e573336f6dd` | `EVALUATION QUESTION` 121; `EVALUATION QUESTIONS` 147; `GENERAL EVALUATION/REVISION QUESTIONS` 151; `READING ASSIGNMENT` 158; `WEEKEND ASSINGMENT` 162; `THEORY ` 174 |
| W03 | `WEEK THREE` 179 | `TOPIC: BASIC CONCEPTS OF GOVERNMENT` 180; `CONTENT` 181; sections 186, 189, 195, 207, 212, 218 | 179–254 | `ca5d9266b095cb44c896e4bef54d55d2c71a5a87d085ca1ee710d076ce1220d4` | `EVALUATION QUESTION` 203; `EVALUATION QUESTIONS` 226; `GENERAL EVALUATION/REVISION QUESTIONS` 230; `READING ASSIGNMENT` 236; `WEEKEND ASSINGMENT` 240; `THEORY` 252 |
| W04 | `WEEK FOUR` 257 | `TOPIC: BASIC CONCEPTS IN GOVERNMENT` 258; `CONTENT` 259; sections 264, 269, 286, 291, 303, 315, 320, 325, 339 | 257–375 | `4600502e06ee8281ddb70919d0632d20da79425322fc2ae7bf795b372cecfe14` | `EVALUATION QUESTION` 282, 311; `EVALUATION QUESTIONS` 347; `GENERAL EVALUATION/REVISION QUESTIONS` 351; `READING ASSIGNMENT:` 357; `WEEKEND ASSINGNMENT` 361; `THEORY` 373 |
| W05 | `WEEK FIVE` 378 | `TOPIC: BASIC CONCEPTS OF GOVERNMENT` 379; `CONTENT` 380; sections 384, 388, 403, 408, 418, 425 | 378–460 | `df5ed63115006e7219e10b98a3a5be0710360ba8a104d7956e51ea09d86639d3` | `EVALUATION QUESTION` 399; `EVALUATION QUESTIONS` 432; `GENERAL EVALUATION/REVISION QUESTIONS` 436; `READING ASSIGNMENT` 442; `WEEKEND ASSINGMENT` 446; `THEORY` 458 |
| W06 | `WEEK SIX` 463 | `TOPIC: BASIC CONCEPTS IN GOVERNMENT` 464; `CONTENT` 465; sections 470, 475, 483, 488, 499, 504 | 463–551 | `8227531375c147ea6c7e79e4c09e0c301d46ae3c8049c19143afd15e5588ef16` | bare `EVALUATION` 495; `EVALUATION QUESTIONS` 523; `GENERAL EVALUATION/REVISION QUESTIONS` 527; `READING ASSIGNMENT` 533; `WEEKEND ASSIGNMENT` 537; `THEORY ` 549 |
| W07 | `WEEK SEVEN` 553 | `TOPIC: BASIC CONCEPTS IN GOVERNMENT` 554; `CONTENT` 555; sections 560, 565, 578, 583, 594, 599 | 553–633 | `fc675359774f5f136d0e2590c7224937fe30ac56d2ffaee4343b4eb24f5437d8` | `GENERAL EVALUATION` 574 (mid-week); `EVALUATION QUESTIONS` 607; `GENERAL EVALUATION/REVISION QUESTIONS` 611; `READING ASSIGNMENT:` 617; `WEEKEND ASSIGNMENT` 621; `THEORY` 631 |
| W08 | `WEEK EIGHT` 635 | `TOPIC: BASIC CONCEPTS IN GOVERNMENT` 636; `CONTENT` 637; sections 642, 645, 655, 660, 663, 668 | 635–701 | `18f42d69b8171e73a693a0f6e333706ccdf511bfa42e1074dd577fec0d01dbca` | `EVALUATION QUESTIONS` 675; `GENERAL EVALUATION/REVISION QUESTIONS` 679; `READING ASSIGNMENT` 685; `WEEKEND ASSIGNMENT` 689; `THEORY` 699 |
| W09 | `WEEK NINE` 703 | `TOPIC: POLITICAL SOCIALIZATION` 704; `CONTENT` 705; sections 709, 714 | 703–747 | `86deb98f3e2a279c5b0db3740445df80f6791965cb44d496702e2e34ed3046f2` | `EVALUATION QUESTIONS` 723; `GENERAL EVALUATION/REVISION QUESTIONS` 727; `READING ASSIGNMENT` 731; `WEEKEND ASSINGMENT` 735; `THEORY` 745 |
| W10 | `WEEK TEN` 750 | `TOPIC: TYPES AND CHARACTERISTICS OF GOVERNMENT` 751; `CONTENT` 752; sections 756, 759, 769, 777, 786, 800, 803, 813, 821, 830 | 750–864 | `ee1e05d99499ee072b0f55cda5a1e30fce140fbf305e42be956fe61b468f14b1` | bare `EVALUATION` 796, 840; `GENERAL EVALUATION/REVISION QUESTIONS` 844; `READING ASSIGNMENT` 850; `WEEKEND ASSIGNMENT` 854; `THEORY` 862 |

Labels occur exactly once each. Marker totals: `EVALUATION QUESTION` 7; `EVALUATION QUESTIONS` 8; bare `EVALUATION` 3 (495, 796, 840); `GENERAL EVALUATION/REVISION QUESTIONS` 10 plus `GENERAL EVALUATION` 1 (574); `READING ASSIGNMENT` 10 (two with a colon, 357 and 617); `WEEKEND` 10 as `ASSINGMENT` 5 (88, 162, 240, 446, 735), `ASSINGNMENT` 1 (361), `ASSIGNMENT` 4 (537, 621, 689, 854); `THEORY` 10 (trailing space at 174 and 549).

## Non-week blocks (hash-accounted)
- 1–16 blank cover paragraphs; 17 `FIRST TERM E-LEARNING NOTE`; 18 blank; 19 `SUBJECT:  GOVERNMENT<TAB>…<TAB>       CLASS:  SS1` — line 19 equals the registered `header_text` exactly and occurs once; block 17–20 SHA-256 `f75dff4d596cd843cf2c4edc3e7521087aad9269eedb7972b91f5a4a362d2496`.
- 21–42 scheme (above); 43–44 blank.
- Page breaks (0x0C in the text stream) at full-text paragraphs 3, 84, 630, 697: before the title (page 1 cover), before Week 1 `WEEKEND ASSINGMENT` (line 88), before `WEEK EIGHT` (635) and before `WEEK NINE` (703). Character offsets 6, 4,119, 38,499 and 43,826.
- Page header/footer: one section (PlcfSed, 1 section), and the only running text is `mr osho/1ST TERM/GOVERNMENT/SS1<TAB><TAB>Page ` followed by a `PAGE \* MERGEFORMAT` field, once in the trailing story region (full-text paragraph 874); a separate `PAGE` field sits at 871 and a single inline picture character (0x01) at 881. Vendor contact details are deliberately not reproduced here.
- Metadata: title `Scheme of work`, author `user`, last saved by `tosyno`, created 2018-07-10, last saved 2019-08-28, code page 1252, cached page count 12 and word count 7,837 (stale caches, not a render).

## Substantive unlabelled / irregular sections
- Week 1 has two `EVALUATION QUESTION` blocks (58, 74); the first (59) asks about the academic field of study before that section is taught (69+), and the second (75) repeats it.
- Week 3's body adds `Forms of power` (189), `Sources of Political Authority` (212) and `Types of Authority` (218) beyond its `CONTENT` list (182–184, which names only Power, Sources of Power, Authority).
- Week 6 uses a bare `EVALUATION` (495) mid-week after Socialism, and its capitalism class list breaks numbering: `The Peasants` (511), `ii)  The Bourgeoisie` (512), `c)   The Petit Bourgeoisie` (516), unnumbered `Proletariat` (517).
- Week 7 has a mid-week `GENERAL EVALUATION` (574) after Fascism and then the standard `EVALUATION QUESTIONS` (607) and `GENERAL EVALUATION/REVISION QUESTIONS` (611).
- Week 8 adds `Components` (663) and `Determinants` (668) of political culture beyond its `CONTENT` list (638–640).
- Week 9's agents list has one indented entry, ` Religious Groups` (720, leading space).
- Week 10 has two bare `EVALUATION` markers (796 after unitary, 840 after federal), no `EVALUATION QUESTIONS`, and the reading assignment (852) ends `pages` with no page numbers.
- Weeks 4, 6, 7 and 8 share the identical `TOPIC: BASIC CONCEPTS IN GOVERNMENT` (258, 464, 554, 636), and Weeks 3 and 5 share `TOPIC: BASIC CONCEPTS OF GOVERNMENT` (180, 379), so a TOPIC line cannot serve as a unique anchor.

## Parser rule findings (findings only; no rule is written by this task)
- **`split_before`**: not needed and unsafe here. All ten teaching weeks already begin with a `WEEK <WORD>` label (45, 105, 179, 257, 378, 463, 553, 635, 703, 750), while the compiler's operation inserts a numeric `WEEK n` line before a line-start anchor, so targeting `TOPIC:` would duplicate the label. Anchor uniqueness would also fail: `TOPIC: BASIC CONCEPTS IN GOVERNMENT` occurs four times (258, 464, 554, 636), `TOPIC: BASIC CONCEPTS OF GOVERNMENT` twice (180, 379) and `CONTENT` ten times (47, 107, 181, 259, 380, 465, 555, 637, 705, 752). A future split would need a per-week unique line and must not be the `TOPIC` or `CONTENT` line.
- **`attach_stranded_label`**: not required. No evaluation, reading, weekend or theory label is glued to the end of a content paragraph; every such label begins its own line. The only label variants are a trailing colon (357, 617) and the misspellings listed above, which are classification, not attachment. The operation's precondition (a label immediately followed by a `following_anchor`) has no candidate in this document.
- **`classify_marker`**: required for the marker vocabulary — the three evaluation forms (singular, plural, bare), the `GENERAL EVALUATION` vs `GENERAL EVALUATION/REVISION QUESTIONS` split, the three `WEEKEND` spellings, the colon variants and the two trailing-space `THEORY` lines — and for a scheme-only disposition of row 42 `Revision/examination`, which occurs once (42) and nowhere in the body. One hazard: the word `THEORY` also occurs inside a Week 1 multiple-choice option line (91, `The THEORY of  a primitive society was initiated by`), so a marker must be classified by a whole line, not by a substring. `WEEK<TAB>TOPIC` (23) is the scheme header, not a week row.

## Factual, legal and neutrality findings (later correction work; nothing adjudicated here)
Each needs a primary authoritative text with an effective or reference date, and the source's original wording must stay distinct from the corrected fact.
- 473: `Karl Marx, a German (1816 - 1883)` — the birth year needs an authoritative check (the commonly cited years are 1818–1883) before it is repeated or corrected.
- 53–54: Hobbes's "primitive society" and the quotation `solitary, poor, wicked and short` — needs the primary wording (Leviathan, chapter 13) before any quotation is used.
- 486: `No country has ever practiced Communism.` — an absolute historical claim that needs a dated, sourced statement and cannot stand as written.
- 502: `practiced in nearly all countries of the world after the fall of Socialism in the 1900s` — vague and date-free.
- 563: Fascism `started as a movement in Italy in 1922 and came to an end in 1943 under Benito Mussolini`; 579: Nazism `practised in Germany under Adolf Hitler between 1933 and 1945` — both date ranges need authoritative references.
- 757: unitary examples `Britain, France, Italy`; 801: federal examples `Nigeria, U.S.A, India, Russia` — classifications change with constitutional reform (UK devolution, Russia's constitutional order); each requires a dated citation rather than a bare list.
- 764–765: `The constitution is flexible.` and `The parliamentary is supreme in a unitary form of government.` — true of some unitary states and not others; must not be taught as a rule of law in force.
- 306: sovereignty `gives order to all and receives order from none` — a doctrinal position contested in international law; present as the source's exposition (Bodin), not as current law.
- 318: democracy `is regarded as the best form of government` and 144: `The ultimate aim of government is to make us political scientists` — evaluative claims; teaching must present them as attributed opinion, not fact.
- 658: `A nation possesses all attributes of a state except sovereignty` — contested definitional claim.
- 848 and 864 ask for `Federal Character` while the document never defines it — a content gap for the Week 10 item, which needs a dated Nigerian constitutional authority.
- Neutrality: ideological systems (socialism, communism, capitalism, fascism, nazism, totalitarianism) and claims about democracy and sovereignty are contested political questions; lessons must attribute positions and endorse none.
- Boundary: Government stays its own package and is not merged into Civic Education; concepts that overlap (power, authority, legitimacy, democracy, human rights) keep their own slug and their own sources.

## Visual groups (for `GOV-VIS-T1`)
1. **Page-1 cover.** One JPEG, 3306×2515 px, 870,389 bytes, at `Data` stream offset 432 (runs to the stream end), SHA-256 `b334a0e127cb7f94bf10dd46672a8545fe303971ba10d0dc9a50600962ddea9a` — byte-identical to the Geography 1st Term cover. It is a subject-agnostic vendor template (its vision statement is about mathematics) carrying personal phone numbers and e-mail; layout not inspected.
2. **Page header letterhead.** One JPEG, 949×359 px, 106,941 bytes, at `WordDocument` stream offset 96,337, SHA-256 `edd416d4bec3d9f5c64d7907a1407ff3e04981018c613f0cf551e2a1e1078c14` — byte-identical to the Further Mathematics 2nd Term and Geography 1st Term header images. It is the only image in the `WordDocument` stream and is referenced from the header story (0x01 at paragraph 881). Whether it prints on every page or the first page only needs a render.
3. **Layout table and absent figures.** The only table structure is an empty row above the cover (two cell marks in paragraph 2; `antiword` reports 1 column, 1 row, frame none) with no content. The body contains no other table, diagram, map or figure, and no PNG, WMF, GIF or EMF header in any stream; Week 7 `THEORY` (632) asks students to build a democratic/fascist comparison table that the document does not print, so neither the empty row nor a missing figure may be invented.
- Both images carry vendor branding and personal contact details. They must not be committed or redistributed; `GOV-VIS-T1` records the permission open item before any asset binding.

## Queue items appended (14, all PENDING, each depends on `GOV-INV-T1` + `GOV-SRC-T1`)
- `GOV-PRE-T1` (SOURCE_PREAMBLE_INDEXING): lines 1–44 — cover, title, subject header and scheme of work rows 1–11.
- `GOV-REV-T1` (SOURCE_MARKER_DISPOSITION): scheme row 42 `Revision/examination`, the only revision or examination marker, with no Week 11 body.
- `GOV-MARK-T1` (SOURCE_MARKER_DISPOSITION): the recurring marker vocabulary and the irregular sections listed above.
- `GOV-WK-T1-W01` … `GOV-WK-T1-W10` (SOURCE_WEEK_INDEXING): one item per week span in the table above.
- `GOV-VIS-T1` (VISUAL_DISPOSITION): the three visual groups above.

## Edits
- `docs/ss1/work/microtasks/government/QUEUE.json`: GOV-INV-T1 → IMPLEMENTED_TESTING_DEFERRED with this evidence; 14 items appended; counts, status counts, review and `next_runnable` recomputed (`GOV-PRE-T1`).
- No package file, coverage entry, rule, lesson or asset was written. `backend/src/db/ss1/subjects/government.json` is unchanged, as are the three alias approvals and `GOV-FACT-CONTENT-APPROVAL`.

## Remaining
- `GOV-PRE-T1`, `GOV-REV-T1`, `GOV-MARK-T1`, the ten week items and `GOV-VIS-T1` are now eligible; `GOV-INV-T2`/`T3` (2nd/3rd Term inventories) stay eligible in queue order.
- The package remains PENDING with empty lessons and coverage; the alias approvals (`GOVERNMENT-ALIAS-APPROVAL`, `GOVERNMENT-T2-ALIAS-APPROVAL`, `GOVERNMENT-T3-ALIAS-APPROVAL`) are untouched.
