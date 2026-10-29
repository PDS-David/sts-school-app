# LIT-INV-T1 — Literature-in-English, 1st Term inventory

Status: **IMPLEMENTED_TESTING_DEFERRED** (inventory only; not approved, not verified). Testing deferred by owner.

## Inputs
- Starting master `4159336` (merge of the Geography inventory PR #187). The only remote branches naming this subject are `ss1/lit-src-t1-20261027`, `ss1/literature-lit-src-t2`, `ss1/literature-lit-src-t3` and `ss1/literature-queue`; no Literature inventory branch or PR exists, so this task is not owned elsewhere.
- Source `SS1-SRC-470d43e54e5b`, manifest member `SSS 1/1st Term SS1_/LIT. IN ENGLISH.docx`; composite archive SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e` **verified**; member SHA-256 `732deed1d3e0c4e3c2218cde0d2e3fce1678f39c8730633b20af9fdc4d602dea` **verified**, 31,804 bytes.
- Method (all private, outside Git): `mammoth` 1.12.2 `extractRawText`, giving 28,705 characters in 609 lines, 230 of them non-blank; a JSZip part listing plus counts over `word/document.xml` (`w:tbl` 0, `w:drawing` 0, `w:pict` 0, `<w:br` 0, `w:hyperlink` 0, `headerReference` 0, `footerReference` 0, `w:sectPr` 2); `docProps/core.xml` and `docProps/app.xml`. No rendering environment was available (no Word, no LibreOffice), so no claim here depends on a render. The importer, compiler, schema and tests were not run.
- Block convention: the SHA-256 of the stated 1-based extract lines, joined with `\n`, UTF-8, no trailing newline; blank lines at a span's edges are trimmed. Whole extract 1–609: `b21b9f132325f619ca818cdbf6ee55e8bde510fe8644bc30c2a046bc5569dfd7` (28,699 bytes).

## Scheme of work
Line 3 is `SCHEME OF WORK FOR LITERATURE-IN-ENGLISH, SS1 CLASS ` (trailing space; it equals the registered `header_text` exactly). Rows 7–23 are plain paragraphs, one row per line, with no table markup; block 7–23 SHA-256 `9b3c5dbd7a64cc0808c0bfcce734295b3b07d7ba4edffc7d4c68210e67943b03` (422 bytes). There are nine rows for ten weeks, because Week 5 and Week 6 share one row.

| Wk | Scheme wording (verbatim) | Line | Body label |
|---|---|---|---|
| 1 | `WEEK 1:INTRODUCTION TO THE STUDY OF LITERATURE` | 7 | `\tWEEK 1\t` 37 |
| 2 | `WEEK 2: GENRES OF LITERATURE-DRAMA,PROSE AND POETRY` | 9 | `WEEK 2` 107 |
| 3 | `WEEK 3: FICTION AND NON FICTION` | 11 | `WEEK 3` 187 |
| 4 | `WEEK 4: ELEMENT OF PROSE FICTION-PLOT,SETTING, NARRATIVE TECHNIQUE` | 13 | `WEEK 4` 249 |
| 5 & 6 | `WEEK 5&6: WHAT IS PROSE? TYPES OF PROSE` | 15 | `WEEK 5 & 6` 289 |
| 7 | `WEEK 7: WHAT IS POETRY? FEATURES OF   POETRY.` (three spaces before `POETRY`) | 17 | `WEEK 7` 377 |
| 8 | `WEEK 8: DIFFERENT FORMS OF POETRY AND TYPES OF POETRY` | 19 | `WEEK 8` 437 |
| 9 | `WEEK 9: WHAT IS DRAMA? FEATURES OF DRAMA.` | 21 | `WEEK 9` 471 |
| 10 | `WEEK 10: ORAL FORMS OF LITERATURE.` | 23 | `WEEK 10` 575 |

Row 1 has no space after its colon; row 15 has no space around `&`; rows 17, 21 and 23 end with a full stop; row 17 has a triple space. There is **no revision or examination row** and no week 11, so no revision item is appended.

## Week inventory (extract lines)
| Item | Label | Heading and section headings (lines) | Span | Block SHA-256 | Markers (lines) |
|---|---|---|---|---|---|
| W01 | `\tWEEK 1\t` 37 (tab-padded) | `Introduction to the study of Literature-In-English` 41; `What is literature as a subject of study?` 47; `English Literature and Literature-In-English` 53; `Reasons for the study of Literature` 59; `(Aims and Objective)` 61; `What is Literary Appreciation?` 87 | 37–99 | `b4ad59792cac040a9cab42eedeed7f3b2794837bb257e375b297a9a129a78518` | `Class Work` 95 |
| W02 | `WEEK 2` 107 | `GENRE OF LITERATURE – PROSE, POETRY AND DRAMA` 111; `What is Prose?` 117; `Characteristics of Prose` 123; `The Elements of Prose Fiction` 139; `Type of Prose` 157 | 107–181 | `1e5bf5325a56d432b9630af84b6608064fdfe291b17eeb1bf837e339fdec00b2` | `Class Work` 173 |
| W03 | `WEEK 3` 187 | `FICTION AND NON-FICTION` 191; `What is Friction?` 193; `Example of Friction` 197 (Fable 199, Allegory 201, Parables 205, Romance 207, Folktales 209, Novella 211, Short Story 213, Novel 215); `What is Non-Friction?` 219; `Examples of Non-Friction` 227 (Biography 229, Autobiography 231, Essay 233, Criticism 235) | 187–243 | `e37d851557183031e0ce5e9da84d4063403217849e96a98f848155529496566b` | `Class Work     ` 239 (trailing spaces) |
| W04 | `WEEK 4` 249 | `ELEMENT OF PROSE` 253; `Plot` 255; `Setting` 263; `Example` 265; `Narrative Technique` 267; `First person narrative point of view` 269; `Third person narrative essay of view` 271 | 249–283 | `c702dce3f3654c5e65841498fd0757837b02da867ba0c5e1a6567670c4b9eebd` | `Class Work` 275 |
| W05-06 | `WEEK 5 & 6` 289 | `WHAT IS PROSE?` 293; `TYPE OF PROSE` 305; `FICTION AND NON-FICTION` 321; `FEATURES OR CHARACTERISTICS OF PROSE` 329 | 289–369 | `416b3b78cd59923af0277bf91297216978a9e645082849a47cc818e122fb9ea7` | `CLASS – WORK ` 353 (en dash, trailing space); `ASSIGNMENT:` 365 |
| W07 | `WEEK 7` 377 | `WHAT IS POETRY?` 381; `Characteristics of poetry` 393 (Atmosphere 395, Couplet 397, Mood 399, Enjambment 401, Tone 403, Quatrain 405, Triplet 407) | 377–429 | `5aaaf029f1ded1dbe6d8704ea8562e13d305928db13b7a5b9f93e2891e5739c8` | `CLASS-WORK ` 411 (hyphen); `ASSIGNMENT:` 427 |
| W08 | `WEEK 8` 437 | `DIFFERENT FORMS OF POETRY AND TYPES OF POETRY` 441; Ballad 443, Elegy/Dirge 445, Didantic Poem 447, Epic 449, Narrative Poem 451, Ode 453, Chant 455, Incantation 457, Recitation 459 | 437–465 | `ca279c15c5003235e0d684fd7cfd00a0b4c9a2fa4b1c556bd5f91f5cd0a01f36` | `Class Work` 463 |
| W09 | `WEEK 9` 471 | `WHAT IS DRAMA` 475; `Features of Drama` 481 (Local Colour 483, Dialogue 485, Flash back 487, Protagonist 489, Antagonist 491, Suspense 493, Cast 495, Auditor 497, Soliloquies 499); `FORMS OF DRAMA` 503 (Tragedy 505, Comedy 507, Tragic-Comedy 509); `Characterization:` 519; `Types of Character` 525 (Static 527, Dynamic 529, Round 531, Minor-Character 533, Flat 535) | 471–569 | `4528c1a5b375db155daa875ac5123fc97ca1e99516a0cbbf73b337f4b9701270` | `Class Work` 547; `Assignment` 559 |
| W10 | `WEEK 10` 575 | `ORAL TRADITION OF LITERATURE` 579; `Folklore` 583; `A Folklorist` 585 | 575–603 | `d75fcb4a083bab6e067caa95211695fa1f9d9868c9819cca7e40ee95cb6a2b14` | `Class Work` 589; `Assignment ` 599 (trailing space) |

Labels occur exactly once each (`WEEK 1` also occurs as a substring in the scheme row 7, in `WEEK 10` at 23 and in `WEEK 10` at 575). Marker totals: 13 — class work 9 (`Class Work` 95, 173, 275, 463, 547, 589; `Class Work     ` 239; `CLASS – WORK ` 353 with U+2013; `CLASS-WORK ` 411 with a hyphen) and assignment 4 (`ASSIGNMENT:` 365 and 427, both with a trailing space; `Assignment` 559; `Assignment ` 599). No `EVALUATION`, `GENERAL EVALUATION`, `READING ASSIGNMENT`, `THEORY` or `WEEKEND` marker occurs anywhere: every question block in the document is a class work or an assignment.

## Non-week blocks (hash-accounted)
- 1 `LIT-IN-ENGLISH`; 2 blank; 3 the scheme header above; block 1–3 SHA-256 `e4939af27366cab6bee96734ed9cee829995e2e39b9dd4f93fd3018cd6f250b7` (494 bytes).
- 4–6 blank, 7–23 scheme (above), 24–36 blank; no other front matter, foreword, contents list or textbook note exists.
- No page structure can be recovered: `word/document.xml` has no `<w:br`, no `headerReference`, no `footerReference`, and the package has no `word/header*.xml` or `word/footer*.xml` part. It has two `w:sectPr` elements but neither carries a header or footer reference. The 12 package parts contain no `word/media/*` entry.
- Metadata: title and subject empty; creator `oladoyin faasoranti`; last modified by `ADEDOLAPO`; revision 6; created 2015-11-24T20:24:00Z; modified 2020-05-30T10:16:00Z; cached Pages 12, Words 4238, Characters 24163, Lines 201, Paragraphs 56. The caches are not a render and Word's paragraph count does not match the 230 non-blank extract paragraphs.

## Named text, play, poem or extract
**No set text is named.** The document prescribes no book, play, poem or extract, supplies none of the texts it mentions, and has no reading assignment, edition or page reference. Every literary work appears only as an in-sentence example, with this wording:
- 159 `e.g. Adventures of Hucmeberry Finn (1884) by Mark Twain, Daniel Defoe’s Moll Flanwer(1722)`.
- 161 `e.g Richardson’s Pamela (1740-1) and Clamssa. Rousseau’s La nouvelle Heloise`.
- 163 `e.g. Walter Scott Waveley (1814), Victor Hugo’s Notre Dame de Paris (1831)`.
- 165 `e.g Horace Walpole’s The Castle of Otranto (1764), Ann RadclitteMysteries of Udolpho (1794)`.
- 167 `e.g. Mary Miccarthy’s The Groves of Academe (1952), Kingsley Amis’s Lucky Jim (1954)`.
- 199 `e.g George or well’s Animal Farm (1945), Thurber Fable of our Time (1940)`.
- 201 `e.g John Bunjam The Pigrim’s Progress (1678)` (the title is spliced into the sentence at 201).
- 205 `e.g. John Steinbeck’s The Pearl (1948)`.
- 207 `e.g. Edmund spenser’sThe FacrieQueene (1590-6) and Sir Philip Sivney’s prose romance Arcavia (1590)`.
- 211 `e.g Joseph Conraw’sHeart of Darkness  (1902)`.
- 215 `e.g. William Gowing.`
- 229 `e.g. The biography of Byron by Marchland`.
- 233 `e.gFracisBacon,s Essays (1597)`.
- 299 `e.g. Mariama Ba’s “So Long A Letter”`.
- 323 `e.g”Arrow at God” by Chinua Achebe, ‘Mayor of Caster bridge’ by Thomas Hardy`.
- 347 `an example is Defoe’s Robinson Crusoe and Oxara’sThe Voice`.
- 443 `e.g. “The rhyme of the Ancient Mariner” written by Samuel Taylor Coleridge`.
- 445 `E.g. “Lycida” by Milton or “In memoriam” by Tennyson`; `“Elegy written in a Country Church yard” by Thomas Gray`.
- 447 `Alexander Pope’s “Essay an Nlan”`.
- 449 `“milton’s “paradise Lost”, Homer’s Odyssey” or “Wole Soyinka’s” idaure”`.
- 453 `E.g Wordsworth’s “Ode to Duty” Coffin’s “Ode to Evening” and shally’s ode to the West Wind”`.
- 457 `Ogun incantation`.
- 505 `e.g. Macbeth by William Shakespeare, The God’s are not to Blame by Ola-Rotimi`.

The longest piece of literary wording the document actually reproduces is the Wordsworth sentence at 387, `an overflow of spontaneous emotions recaptured in tranquility`, plus the proverbial line `justice delayed is justice denied` (335). No passage long enough to raise a reuse-permission question is reproduced, and no extract is supplied for any named work; the named titles do not make any of them a prescribed text, and none may be presented as one. Attribution still needs checking before teaching: the Wordsworth sentence is a loose rendering of the Preface to *Lyrical Ballads*, and the definitions at 159–167, 211, 235 and 295–299 read like glossary entries whose source is not stated (possibly adapted from a published dictionary of literary terms — unverified).

## Parser rule findings (findings only; no rule is written by this task)
- **`split_before`**: not needed and unsafe. All nine teaching blocks already begin with a `WEEK` label (37, 107, 187, 249, 289, 377, 437, 471, 575), while the compiler's operation inserts a numeric `WEEK n` line before a line-start anchor, so targeting any label would duplicate it. Anchor uniqueness would also fail for a heading-based split: `FICTION AND NON-FICTION` occurs twice as a whole line (191 as the Week 3 title and 321 inside Week 5–6). A future split would need a per-week unique line and must not be a `WEEK` line.
- **`attach_stranded_label`**: not required. No marker is glued to the end of a content paragraph; every `Class Work` and `Assignment` label begins its own paragraph, and every heading in the document stands alone. The operation's precondition (a label immediately followed by a `following_anchor`) has no candidate in this document.
- **`classify_marker`**: required for the marker vocabulary — three class-work byte forms (`Class Work`, `Class Work` with trailing spaces, `CLASS – WORK` with an en dash, `CLASS-WORK` with a hyphen) and three assignment forms (`ASSIGNMENT:`, `ASSIGNMENT:` with a trailing space, `Assignment`, `Assignment` with a trailing space) — and to keep a week's class work distinct from its assignment (W05-06, W07, W09 and W10 carry both). Classification must be by whole line: neither word occurs mid-sentence anywhere in this document (checked), and the tab-padded `\tWEEK 1\t` label is not a marker. A classifier built only for `EVALUATION`/`THEORY`/`WEEKEND` vocabularies would classify nothing here.

## Content and coverage findings (later work; nothing adjudicated here)
- **Week 2 promises three genres and delivers one.** Scheme row 9 names `GENRES OF LITERATURE-DRAMA,PROSE AND POETRY`, but Week 2 (107–181) covers prose only; poetry arrives in Week 7 and drama in Week 9. The heading at 111 also reverses the scheme's order and uses `GENRE` for `GENRES`.
- **Duplication across weeks.** Week 4's `ELEMENT OF PROSE` (253–283: plot, setting, narrative technique) repeats `The Elements of Prose Fiction` at 139–153; Week 5–6's `FICTION AND NON-FICTION` (321–325) repeats Week 3 (187–243); `Characteristics of Prose` (123–135) is restated as `FEATURES OR CHARACTERISTICS OF PROSE` (329–349).
- **Week 5–6 is one span for two scheme weeks.** 289–369 contains no boundary between week 5 and week 6, and none is invented here.
- **Week 10's scheme promise is not met.** Row 23 says `ORAL FORMS OF LITERATURE.`, but 579–603 defines oral tradition, orality and folklore only; no oral form (folktale, folksong, proverb, chant or praise poem) is described, so the item is a coverage gap rather than a complete week.
- **Week 3's own question is wrong.** 243 asks for `the 6 examples of Friction` while the week lists eight (199–215).
- **Exercise types are uneven.** Weeks 2, 3, 4 and 8 have class work only; Weeks 1 and 3 have no assignment; Weeks 5–6, 7, 9 and 10 have both. No evaluation, general-evaluation, reading-assignment, theory or weekend block exists.

## Factual, attribution and terminology findings (later correction work; nothing adjudicated here)
Each needs a primary or authoritative reference before any claim is taught, and the source's original wording must stay distinct from the corrected fact.
- 49 `It minors the society.` (for "mirrors"); 113 `genie` (for genre) and `muter` (for writer); 193/241/243 `Friction`, 219/227/241 `Non-Friction`; 215 `genie`; 337 a literal `\it` control word in the text.
- 55 `English Literature is generally seen as beginning with the epic poem Beowulf that dates from between the 8th to the 11th centuries` and `Literature In English focuses on literary works from other British colonies, including the U.S.` — both need an authoritative check.
- 159–167, 199–233, 443–453 and 505 carry garbled titles and author names: `Hucmeberry Finn`, `Moll Flanwer`, `Clamssa`, `cothic`, `Radclitte`, `Miccarthy`, `sativical`, `Bunjam`, `Pigrim’s Progress`, `FacrieQueene`, `Sivney`, `Arcavia`, `Conraw`, `William Gowing`, `Marchland`, `FracisBacon,s`, `Arrow at God`, `Mayor of Caster bridge`, `Oxara`, `The Voice`, `Lycida`, `Didantic`, `Essay an Nlan`, `idaure`, `Coffin`, `shally`, `gciregorian`, `oew notes`, `The God’s are not to be Blame`/`Ola-Rotimi`. The titles and dates attached to them (1884, 1722, 1740-1, 1590, 1590-6, 1678, 1764, 1794, 1814, 1831, 1902, 1940, 1945, 1948, 1952, 1954) must each be confirmed against a bibliographic source before being taught, and the misspellings must not be silently "corrected" into the source text.
- 201 the definition sentence is interleaved with the example (`…partially hidden behind its literal or The Pigrim’s Progress (1678) visible meaning`); 205 claims `Jesus spoke or gave out 40 parables`; 229 credits a Byron biography to `Marchland`.
- 295 is a single run-on paragraph defining `PROSE MAN`, `PROSAIST`, `AGONIST`, `MARCEAU`, `POT BOILER`, `EXEMPLUM`, `TALL STORY or FAIRY TALE`, `FORESHADOWING`, `SARCASTIC HUMOUR` and `PARODY`; `MARCEAU` is not a standard term and the `POT BOILER` and `EXEMPLUM` definitions differ from standard usage. These must not be taught as settled definitions.
- 387 the Wordsworth definition (see above) needs the exact primary wording; 407 uses `Triplet` for what is usually a tercet; 443 uses `Literacy ballad` for literary ballad; 447 `Didantic`.
- 477 defines drama as `a penetration of life through artificial means` (the standard formulation is imitation or representation of an action); 497 defines `Auditor` as a casting practice (audition); 499 `Soliloquies:When a character is said to be soliloquizing` is an unfinished entry; 533 defines a minor character as one `that features regularly in a novel`.
- 265 the Harry Potter setting example is truncated (`non-magical) wor with the “muggle” folks`); 305–317 offers six "types of prose" (argumentative, discipline, dramatic, expository, narrative, technical) that overlap the essay modes rather than the novel types at 157–167 — the two lists must not be merged as one classification.
- 581 `This is the passing on … of songs, charts, proverbs` (for chants) and `Ballade`; 583 `Folklore:Is a dictations stay …`.
- Strands to keep separate: prose (Weeks 2, 3, 4, 5–6), poetry (Weeks 7, 8), drama (Week 9), oral literature (Week 10). Week 1 is general theory; no strand may absorb another.

## Visual groups
None. `word/document.xml` contains no table (`w:tbl` 0), no drawing or picture (`w:drawing` 0, `w:pict` 0), no explicit line break and no hyperlink; the package has no `word/media/*` part, and there is no header or footer part. There is therefore no visual group to dispose of and no visual item is appended.

## Queue items appended (11, all PENDING, each depends on `LIT-INV-T1` + `LIT-SRC-T1`)
- `LIT-PRE-T1` (SOURCE_PREAMBLE_INDEXING): lines 1–23 — title, scheme header and scheme rows 7–23.
- `LIT-MARK-T1` (SOURCE_MARKER_DISPOSITION): the 13 class-work and assignment markers and their spellings.
- `LIT-WK-T1-W01`, `W02`, `W03`, `W04`, `W05-W06`, `W07`, `W08`, `W09`, `W10` (SOURCE_WEEK_INDEXING): one item per teaching block; `W05-W06` covers both weeks because the document has one span for them.
- No revision/examination item (no such scheme row or marker) and no visual item (no tables, images or media).

## Edits
- `docs/ss1/work/microtasks/literature/QUEUE.json`: LIT-INV-T1 → IMPLEMENTED_TESTING_DEFERRED with this evidence; 11 items appended; counts, status counts, review and `next_runnable` recomputed (`LIT-PRE-T1`).
- No package file, coverage entry, rule, lesson or asset was written. `backend/src/db/ss1/subjects/literature.json` is unchanged, as are the three alias approvals and `LIT-FACT-CONTENT-APPROVAL`.

## Remaining
- `LIT-PRE-T1`, `LIT-MARK-T1` and the nine week items are now eligible; `LIT-INV-T2`/`T3` (2nd/3rd Term inventories), `LIT-FACT-T2-T3-RELATIONSHIP` and `LIT-TEST-PACKAGE` stay eligible in queue order.
- The package remains PENDING with empty lessons and coverage; the alias approvals (`LITERATURE-ALIAS-APPROVAL`, `LITERATURE-T2-ALIAS-APPROVAL`, `LITERATURE-T3-ALIAS-APPROVAL`) are untouched.
