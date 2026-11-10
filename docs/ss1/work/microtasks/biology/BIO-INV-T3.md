# BIO-INV-T3 — Biology, 3rd Term week inventory

Status: **IMPLEMENTED_TESTING_DEFERRED** (inventory only; not approved, not verified). Testing deferred by owner.

## Inputs
- Base: origin/master `9971e56` (fetched). Agent A2. Claim held on `biology` for the whole item.
- Prerequisite BIO-SRC-T3 is `IMPLEMENTED_TESTING_DEFERRED`; `backend/src/db/ss1/subjects/biology.json` has the 3rd Term source registered and no lessons or coverage.
- Archive `docs/ss1/sources/SSS1-original.zip` SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e` — verified equal to the task.
- Member `SSS 1/3rd Term SS1_/3RD TERM S1 BIOLOGY.docx` SHA-256 `1e9a758cdd07bd13511059b6d8ef6db0f618f99b14cdf11d20d33c183cb1bca4` — extracted to private scratch and verified equal to the task. It is a native .docx, so no conversion was used.
- Method: `word/document.xml` read with lxml; header, footer, relationships and all four media files inspected; all four images viewed. The importer was not run, so parser findings below are unverified. Nothing from the document is committed.

## Locator rule (reproducible)
Block = direct child of `w:body` in `word/document.xml` of the verified member (blocks 0-801; block 802 is `w:sectPr`), 0-based. Block 28 is a `w:permEnd`, not a paragraph. Block text = concatenation of its `w:t` runs, UTF-8, no normalisation; text inside drawings counts toward the block that holds them. Range hash = SHA-256 of the block texts first..last inclusive joined with `\n`, empty blocks included.

## Week inventory (7 labelled sections, 8 scheme topics)
The scheme (blocks 4-12) has a header `WEEKS                  TOPIC` and eight rows with no week numbers in the text (numbers inferred). Seven `WEEK …` labels exist, so scheme rows 6 and 7 share one section. **The labels are out of order and two do not match their scheme position**; they are recorded exactly as written and must not be corrected here.

| Scheme row (inferred) | Item ID | Exact label (whitespace collapsed) | Label block | Blocks | Label sha256 | Range sha256 | Topic line |
|---|---|---|---|---|---|---|---|
| 1 | BIO-WK-T3-W01 | `WEEK ONE DATE: ……………………………` | 25 | 25-109 | `95035b774fa79cba584a3293bfc6dcb0df22dc8e14bf9b934f8172bff079eb35` | `68cdbeec7e7e1e84882216467bc5c4aaf8964defb7abb1940c18f8f2f00350a2` | 27 MICRO-ORGANISMS AROUND US |
| 2 | BIO-WK-T3-W02 | `WEEK TWO DATE: ……………………………` | 110 | 110-174 | `76f11e6f549d493bb970870a93138143bdb2c49cbec52c22a1c2563aec98d58d` | `7c5e4bfd7c750a8ebd47065d4c3fd2720d0ee4f4a8163aba15791e71f7ef761e` | 112 MICRO-ORGANISMS IN ACTION |
| 3 | BIO-WK-T3-W03 | `WEEK SEVEN DATE ……………………………….` | 175 | 175-215 | `e43a5742583e8a8ba386bade0de387b049a94a50485144d8443fbc82e136ed11` | `3e25575a5318d1b1efb11d9e15e9a689b9e1a7de2209728bd1b6b9c4fb7138cd` | 177 SEXUALLY TRANSMITTED INFECTIONS |
| 4 | BIO-WK-T3-W04 | `WEEK FOUR DATE …………………………` | 216 | 216-326 | `c9fad62e4fc82300a6da196d52f9c65bd950f3027a4c048c9d904b11a9f9d933` | `40674987f567df1a082f175d4af63e68ec164781c64998a8f91235a2bbf06e80` | 218 TOWARDS BETTER HEALTH |
| 5 | BIO-WK-T3-W05 | `WEEK FIVE DATE …………………………………` | 327 | 327-473 | `90f6fe7477e2fc785f6ed6babdf240ad6cea2cf7d35e4e48fef447c755a3295d` | `104006510a30c7891efa6cefce8563c2c5741bdc91c51e5f5f5dc737f1b6873f` | 328 RELEVANCE OF BIOLOGY TO AGRICULTURE |
| 6 and 7 | BIO-WK-T3-W06-W07 | `WEEK SIX& SEVEN` (no DATE field) | 474 | 474-668 | `8c37b1a31117541cb5c6ff0f2bf356b03f859edb820de4b7a003e9af74b88ce2` | `7bac1633f75a0650a074e59d61e47c14f6d4e4ce76bc22f5c2c63e299264fc1d` | 475 PEST AND DISEASES OF CROPS AND LIVESTOCK |
| 8 | BIO-WK-T3-W08 | `WEEK THREE DATE ………….` | 669 | 669-801 | `e791c34f727e46a2b601cf2875bfca87b52f862637654cb7b21421d66efc6976` | `b72e95dd984d339182364ed02c5ec739cc9db1bce9cd30c048158ad88a940491` | 672 FOOD PRODUCTION AND STORAGE |

Scheme rows (exact): 5 `Micro-Organisms Around Us and the Concept of Culturing.`; 6 `Micro-Organisms in Action.`; 7 `Sexually Transmitted Infections (STI)`; 8 `Towards BetterHealth`; 9 `Relevance of Biology to Agriculture`; 10 `Pests and Diseases of Plants.`; 11 `Pests and Diseases of Animals.`; 12 `Food Storage and Production.` The pairing of rows to sections is by topic text, not by label number.

Label findings: document order of labels is ONE, TWO, SEVEN, FOUR, FIVE, SIX& SEVEN, THREE. Block 175 says SEVEN but carries scheme row 3; block 669 says THREE but carries scheme row 8; SEVEN therefore appears twice (175 and inside 474). Section W06-W07 covers scheme rows 6 and 7 together; the plant/livestock split inside it starts at block 591 (`PestsandParasitesofLivestockandtheirEffects`).

Per-section structure (heading blocks): each section ends with `GENERAL EVALUATION` (91, 156, 199 as `GENERALEVALUATION/REVISIONAL QUESTIONS`, 308, 449, 643, none in W08) then `WEEKEND ASSIGNMENT` (97, 165, 206, 315, 456, 652, 783; spelled `ASSSIGNMENT` at 165, 206, 315) with a `THEORY` block (103, 171, 212, 321, 462, 661, 794). W08 has no `GENERAL EVALUATION` heading; a `Reading Assignment` line (782) precedes its `Weekend Assignment`.

## Other sections and objects
- Blocks 0-24: `THIRD TERM E-LEARNING NOTE` (0), SUBJECT/CLASS line (1), `SCHEME OF WORK` (2), scheme (4-12), `REFERENCES` (14-22: eight lines, the last `Biology practical text`), blank blocks. Range sha256 `2a9906ba5a26582ec0545cd973ba0d2179e209b6abb61a4759099223a122b874`.
- No scheme row for revision or examination, no unlabelled section and no stray label were found; no marker item is needed. The in-body heading `GENERALEVALUATION/REVISIONAL QUESTIONS` (199) is a section heading, not a scheme marker.
- Tables (plain-text extraction concatenates cells with no separator): 84 vectors (5 x 3), 151 diseases (21 x 5, eight hyperlinks), 183 STIs (5 x 4), 584 crop pests (9 x 3), 595 livestock parasites (6 x 4), 614 crop diseases (8 x 4), 621 livestock diseases (6 x 4). Block sha256: 84 `41b3dd72df3e9f92f0505586554f78cb7cd5de26a9842043b4da31eddc74a4a0`; 151 `781a2ddb44d6167e3e2956d4c26ba46fdb5a267edf56387cc17b5d4fdc179f5c`; 183 `0582a55b1abc45343de967bc1fe916bb0744cd94bafbb144af7a54b350de8c44`; 584 `4adf3ba8954ae272ca10341350945c30f7fc9cbf8aca4af25a679628c9cf9d18`; 595 `639490ecce6becdc9d9e039a4c17f021671dee7214360513fd6947c97e557e9a`; 614 `8efb2438f9684f936134d0f44f641d131c6daae06fd49d932e512ff41f171092`; 621 `7da8b2be37d612d45533d879fe022efab04c03e0b1859864b39144a67bd31b1f`.
- Figures (viewed directly; no text in the block, so extraction drops them): block 55 `media/image1.png` 649x599 sha256 `3150bccfa985db5e26f851cec90b8d66b442a1db104c514d70c342f697d613ba` (inline; shapes of bacteria, heading at block 56); block 515 `media/image2.jpeg` 350x453 sha256 `8b1970555ff8d7ed75bdbe95d7bc39f0579be458cc75e48f83cf5782648f5e56` (anchored; grasshopper life cycle with a visible third-party copyright line); block 545 `media/image3.jpeg` 300x240 sha256 `b8be588c24d7a7161e74842ac3c3ea7de776c5f688b3bb34704ed9ff3bf81fdd` (anchored; mealybug life cycle, caption spellings are the source's).
- Shape drawing: blocks 350-355 hold nine VML shapes lettered A-I for the plant classification chart; blocks 345-348 define the letters and 357-358 are the chart heading and key. Range 350-355 sha256 `050aad2b5ea0d4374eeb6aa0680c2bef70bffa9ee0b8316ee745bdeea0ac852f`.
- Header/footer (not teaching): `word/header1.xml` carries `media/image4.jpeg` 949x359 sha256 `edd416d4bec3d9f5c64d7907a1407ff3e04981018c613f0cf551e2a1e1078c14`, a third-party tutor letterhead with a personal phone number and email address; `word/footer1.xml` text is `MR OSHO`. Neither is source teaching; the contact details must not enter lessons.
- No equations (`m:oMath` 0), no OLE objects, no comments part, no tracked changes, no footnote or endnote references.
- Practical/observation content: no procedure with quantities. Culturing is described only in words (blocks 63-66, 73-74); petri dishes are sterilised "by heating" in a pressure cooker, autoclave or oven with no temperature or time (73). Later items must not invent media recipes, temperatures, reagents or doses.
- External links in the source (unchecked, not opened by this item): block 151 links symptom words to `https://www.nhlbi.nih.gov/health/health-topics/topics/cough/` and seven `http://health.nytimes.com/health/guides/symptoms/…` pages (depression, stress-and-anxiety, swollen-glands, abdominal-pain, agitation, bloody-or-tarry-stools, confusion).
- Source errors to keep as written: `GROUS` (35), `EVALUTION` (237), `MAINTAINANCE` (263), `Vibro cholera` (84), `Treponemapallidium` (183), and the `ASSSIGNMENT` spellings.

## Statements to check against authoritative primary sources in later correction work (source wording unaltered)
- History: Leeuwenhoek and his dates (block 38). WHO "established in 1964 and became operational in 1948" (280): the two dates are internally inconsistent.
- Medical and health: HIV named "Acquired immune deficiency virus" (186) but "Human immune – deficiency virus (HIV)" in the table (183); AIDS called a sexually transmitted disease and transmission routes (186-194); STI table content including a vaccine age range (183); the disease table symptoms and controls (151, including smallpox, rabies, polio, malaria); vaccination and drug statements (153, 287, 293); antibiotic and antiseptic names (229-230); `Use of drugs` (250).
- Agricultural chemicals and doses: 0.1% ultracide dip for one minute (538); gammalin 20, aldrin, kokotine, 0.1% rogor (584); fungicide and pesticide statements (440-445, 614); copper sulphate for pools (595).
- Food science: pasteurisation at 72 °C for about 10 minutes (755), smoking (746), "harmless chemicals" (761-762).
- Regional and seasonal claims: yam beetle calendar by month (573); the biggest factor affecting food production in Africa (792); Nigerian crop and pest examples throughout W05 to W08.
- Rights (findings only, no decision): the grasshopper figure's visible copyright line, the tutor branding in the header, the reference titles (15-22) and the linked pages are not reuse permission.

## Structural rule findings (findings only; no rule written)
- `split_before`: labels are uppercase `WEEK <WORD>` with wide spacing; six end with a `DATE …` field (blocks 25, 110, 175, 216, 327, 669), `WEEK SIX& SEVEN` has none, and `&` joins two weeks. `WEEKEND ASSIGNMENT` lines (97, 165, 206, 315, 456, 652, 783) and the scheme header `WEEKS TOPIC` (4) also begin with `WEEK`. Ordinal-based numbering would give weeks 1, 2, 7, 4, 5, 6-7, 3 (SEVEN twice); position-based numbering would give 1-8. Which the importer uses is **unverified**.
- `attach_stranded_label`: no stranded label observed; block 28 (`w:permEnd`) sits inside the week one lead-in and has no text.
- `classify_marker`: no scheme-only revision or examination row exists. `GENERAL EVALUATION` and `GENERALEVALUATION/REVISIONAL QUESTIONS` must not be classified as markers.
- Extraction hazards: figure blocks 55, 515, 545 have no text; the lettered chart blocks 350-355 yield stray letters; table cells concatenate without separators.

## Edits
- `QUEUE.json`: BIO-INV-T3 -> `IMPLEMENTED_TESTING_DEFERRED`; 20 PENDING items appended (BIO-PRE-T3, BIO-WK-T3-W01, W02, W03, W04, W05, W06-W07, W08, BIO-VIS-T3-FIG-BACTERIA-SHAPES, -FIG-GRASSHOPPER, -FIG-MEALYBUG, -SHP-PLANT-CLASS-CHART, -TBL-VECTORS, -TBL-DISEASES, -TBL-STI, -TBL-CROP-PESTS, -TBL-LIVESTOCK-PARASITES, -TBL-CROP-DISEASES, -TBL-LIVESTOCK-DISEASES, -HDR-BRANDING), each depending on BIO-INV-T3 and BIO-SRC-T3; counts, status_counts and `next_runnable` recomputed; one note appended. No existing ID otherwise changed.
- This file. No package, lesson, coverage, rule, correction, asset, shared schema/compiler or other-subject file touched.
- Authoring checks only (JSON parse, unique IDs, dependency resolution, git diff); no tests, importer, typecheck or database.

## Remaining
`BIOLOGY-ALIAS-APPROVAL-T3` is still an owner open item. The 1st and 2nd Term items remain as queued. Next eligible in this subject: the BIO-PRE, BIO-WK and BIO-VIS items above and earlier; the subject shares one package file, so they run sequentially. Visual dispositions need a fresh private render; none was made here. This does not claim the subject or class complete.
