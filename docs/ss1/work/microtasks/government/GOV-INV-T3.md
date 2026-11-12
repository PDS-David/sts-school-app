# GOV-INV-T3 — Government, 3rd Term source inventory

**Status:** IMPLEMENTED — TESTING DEFERRED. This is a source inventory, not a lesson package, approval, verification or acceptance. No package, coverage, source rule, lesson, correction or asset was changed by this item.

## Source identity and method

- Source ID: SS1-SRC-5f34b9f4efc4.
- Archive member: `SSS 1/3rd Term SS1_/3RD TERM S1 GOVERNMENT.doc`.
- Archive SHA-256: 024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e — verified against the uploaded archive.
- Member size: 228,352 bytes.
- Member SHA-256: 04171c3632d3f6bcac893a2900e3c05dc3bd7fa089369e3ef575239701db368e — verified against the exact ZIP member.
- The member path and content identify a legacy Word `.doc` file. Its opening text reads “THIRD TERM E-LEARNING NOTE”, “SUBJECT: GOVERNMENT” and “CLASS: SS 1”; the subject is confirmed from the document header.
- Inspected the original `.doc` using Antiword 0.37. The resulting plain-text extraction contains 1,551 lines. Line locators below refer to that extraction, not to page numbers or native Word paragraph IDs.
- Each span hash is SHA-256 of the UTF-8 Antiword text for the inclusive line range, with a newline after each extracted line. This is a reproducible text locator, not a claim of structural XML equivalence.
- A secondary LibreOffice conversion to DOCX was used only to check for obvious structural visuals: the converted package contained 1,011 paragraphs, no tables and no `word/media` parts. This is a converted view, not a byte-identical representation of the original `.doc`.

## Document structure and scheme of work

- Extracted preamble, scheme and references: lines 1–43; SHA-256 `ede0cf7df2995e5726d445d631d2a0c87480b79abb3c4095604ab584a162fb92`.
- Title: line 2, “THIRD TERM E-LEARNING NOTE”.
- Subject and class: lines 4–5, “SUBJECT: GOVERNMENT” and “CLASS: SS 1”.
- Scheme heading: line 7; column header at line 9.
- Scheme entries: lines 10–39.
- References: lines 41–43: *Essential Government* by C.C. Dibie and *Comprehensive Government* by J.U. Anyaele.

| Scheme row | Exact topic / scope in the source |
|---|---|
| 1 | Fundamental Human Rights |
| 2 | Citizenship; meaning, acquisition and loss; continuation “ii. Rights of a citizen in a State.” |
| 3 | Ways of safeguarding citizens’ rights; limitations; citizen/non-citizen differences |
| 4 | Constitutionalism; meaning, purposes and relationship with constitution |
| 5 | Public opinion; definition, features, formation, measurement, functions and demerits |
| 6 | Pressure groups; meaning, types, functions, enabling/limiting factors, modes and dangers |
| 7 | Political parties; meaning, types, functions and comparison with pressure groups |
| 8 | Party system; definition, types, features, merits/demerits, party manifestos |
| 9 | Franchise; types, merits/demerits, suffrage and candidate eligibility |
| 10 | Electoral system; definition, features, types and merits/demerits |
| 11 | Electoral constituencies; delimitation factors, types, merits/demerits and problems |
| 12/13 | Revision and Examination — scheme-only row at line 39 |

### Important week-label discrepancy

- The first teaching span, lines 44–121, is labelled **WEEK TWO** and covers Fundamental Human Rights. This corresponds by topic to scheme entry 1.
- The second teaching span, lines 122–230, is also labelled **WEEK TWO** and covers Citizenship. This corresponds by topic to scheme entry 2.
- The source contains no **WEEK ONE** label.
- The following labels run WEEK THREE through WEEK ELEVEN once each.
- The inventory preserves both printed WEEK TWO labels. It does not silently rename the first to WEEK ONE, because the source itself does not authorize that correction.

Scheme mapping is therefore by topic and order, while preserving the literal source labels. The first two weeks require explicit attention during indexing and any later importer/parser review.

## Teaching-week inventory

All eleven body spans are consecutive and cover lines 44–1551. Each hash is SHA-256 of the extracted UTF-8 text in the stated inclusive line range, with a newline after every line.

| Item | Exact printed label | Text lines | SHA-256 | Topic / main sections |
|---|---|---:|---|---|
| GOV-WK-T3-W01 | WEEK TWO (exact source label; scheme entry 1) | 44–121 | `56a766cf9063a77a3ffc249cecea8f30b9d9eebb02e9a7068c0b68eb6b459c34` | FUNDAMENTAL HUMAN RIGHTS |
| GOV-WK-T3-W02 | WEEK TWO (exact source label; scheme entry 2) | 122–230 | `794ec054b76684c811ef3d05e9a53e07f275ac9c3c1f610a9039594e062d100f` | CITIZENSHIP |
| GOV-WK-T3-W03 | WEEK THREE | 231–338 | `a5fdd8fc95bebc2a59ba0915d39b7a3148c5673917d1b78dd1f5b5b7f2c345f9` | CITIZENSHIP |
| GOV-WK-T3-W04 | WEEK FOUR | 339–410 | `9863f0415e77c00769a39fecddd3190f220dbbcb22dfdef941c8ce90cad1f42a` | CONSTITUTIONALISM |
| GOV-WK-T3-W05 | WEEK FIVE | 411–557 | `81409e9aa438a30231626080743682bdc96420db3826b4c4dd3d4a7f55502def` | PUBLIC OPINION |
| GOV-WK-T3-W06 | WEEK SIX | 558–713 | `9f97e6fbb99bc5bc4941ac40b48d947efcd4d8253aa61e65233aa728a232998a` | PRESSURE GROUPS |
| GOV-WK-T3-W07 | WEEK SEVEN | 714–830 | `b5cab6670a880156a5a362205733537f5f5c08759bc82613931981b3d3400942` | POLITICAL PARTIES |
| GOV-WK-T3-W08 | WEEK EIGHT | 831–1035 | `f4ee10a23135ad118948b628f22c9fb0b60b3f5c39907f8dacd27d644b48a560` | PARTY SYSTEM |
| GOV-WK-T3-W09 | WEEK NINE | 1036–1203 | `8be9514882ea201da7509c5da287d9e62331078e321ed445589502ddd9ed19b4` | FRANCHISE |
| GOV-WK-T3-W10 | WEEK TEN | 1204–1410 | `1e6415f8e03eb9f6f9ff71d3908fd46d3728dd37bd1d109851e8a99e2c8ca71c` | ELECTORAL SYSTEM |
| GOV-WK-T3-W11 | WEEK ELEVEN | 1411–1551 | `0d0def3386eb6f0873264fec10183fe334c38e912daa9a9f660053247d6c9637` | ELECTORAL CONSTITUENCY |

Week topics and principal sub-sections:

1. Fundamental Human Rights: definition, listed rights, reasons for constitutional inclusion.
2. Citizenship: meaning, acquisition by birth/descent/registration/naturalization/honorary status/conquest, stated loss grounds.
3. Citizenship: safeguarding rights, limitations, citizen/non-citizen differences.
4. Constitutionalism: meaning, purposes/importance, relationship to constitution.
5. Public Opinion: definition, features, formation, measurement, functions/merits, demerits.
6. Pressure Groups: meaning, types, functions, enabling and limiting factors, techniques, dangers.
7. Political Parties: meaning, types, importance/functions, comparison with pressure groups.
8. Party System: one-party, two-party and multi-party systems; features and advantages/disadvantages; party manifesto.
9. Franchise: limited/restricted franchise, universal adult suffrage, suffrage types and candidate eligibility.
10. Electoral System: plurality, absolute-majority, alternative and proportional-representation systems; merits/demerits.
11. Electoral Constituency: meaning, delimitation factors, types, single-member constituency merits/demerits and delimitation problems.

## Marker inventory

- **EVALUATION QUESTIONS:** 24 exact headings at lines 68, 85, 172, 193, 283, 303, 366, 464, 518, 614, 671, 751, 791, 892, 977, 996, 1086, 1126, 1167, 1273, 1330, 1371, 1450 and 1515.
- **EVALUATION:** one shortened heading at line 438.
- **GENERAL EVALUATION/REVISION QUESTIONS:** ten full headings at lines 89, 197, 307, 379, 522, 675, 795, 1000, 1172 and 1519.
- A further truncated heading, **GENERAL EVALUATION/**, occurs at line 1375; preserve it as printed.
- **READING ASSIGNMENT / READING ASSINGMENT:** eleven headings at lines 96, 205, 315, 386, 530, 686, 805, 1009, 1180, 1385 and 1526. The source alternates correct and misspelled forms.
- **WEEKEND ASSINGMENT:** eleven headings at lines 100, 209, 319, 390, 534, 690, 809, 1013, 1184, 1389 and 1529.
- **THEORY:** ten headings at lines 117, 226, 406, 553, 708, 826, 1031, 1199, 1405 and 1549.
- **THOERY:** one misspelled heading at line 335.
- The only explicit “Revision and Examination” row is scheme line 39. The in-week GENERAL EVALUATION/REVISION questions are teaching-span assessments and must not be conflated with that scheme-only row.

## Parser-rule findings (findings only; no rule is written by this inventory)

- **split_before:** the eleven WEEK headings are standalone extracted lines, so no split-before rule is indicated by the plain-text inventory. The duplicated WEEK TWO label is a label/content discrepancy, not a missing section boundary.
- **attach_stranded_label:** no stranded WEEK heading was found in the extracted text. The topic/content headings follow their week labels as ordinary text lines.
- **classify_marker:** the scheme row at line 39, “12/13. Revision and Examination”, must be classified as SCHEME_ONLY. No Week Twelve or Week Thirteen body exists.
- Do not classify the ten in-week GENERAL EVALUATION/REVISION headings as scheme-only revision/examination.
- Preserve source spelling and variants, including ASSINGMENT and THOERY, in source anchors; any normalized display is a later, separate decision.
- No parser rule was added by GOV-INV-T3.

## Factual and neutrality flags for later work

This inventory does not adjudicate legal or political claims. Before replacing or teaching source claims as current law, later correction work should consult dated primary authorities and record the applicable effective/reference dates, preserving the source wording separately. In particular:

- Fundamental rights: the source frames human rights as privileges enjoyed by citizens and includes both generally applicable rights and political rights. Review the distinction against the applicable constitutional text and authoritative human-rights sources.
- Citizenship: the source’s descriptions of acquisition and loss (including registration, naturalization, honorary status, conquest, dual citizenship, treason and renunciation) require checking against the Constitution and applicable nationality law; do not treat every listed item as a current legal ground without verification.
- Rights limitations: claims about detention, movement, expression, association, property, voting, emergency powers and deprivation of life require careful constitutional/legal review and current effective dates.
- Constitutionalism: distinguish the general political-science concept from specific constitutional provisions and actual institutional powers.
- Franchise and candidacy: verify voter qualification, candidate eligibility, age/residency/other thresholds, and suffrage terminology against the Constitution and Electoral Act in force for the stated reference date.
- Electoral systems and constituencies: distinguish textbook descriptions from the actual Nigerian electoral framework and current constituency-delimitation law.
- Political parties and pressure groups: keep explanations descriptive and balanced; do not endorse or disparage any party, group, ideology or contested political position.

No external factual/legal source was consulted for this inventory. No claim above is marked corrected or verified.

## Visual and source-format disposition

- The original file is a legacy `.doc`. The secondary LibreOffice DOCX conversion yielded no tables and no media files; no independent image, diagram or embedded-media group was identified for a separate asset/disposition item.
- No image asset is warranted by the inspected evidence. Do not infer missing visuals from topic headings or create substitute artwork.
- The conversion check is secondary and does not replace inspection of any source formatting that later proves material during lesson indexing.

## Items appended to the queue

Fourteen bounded follow-up items were added. All are PENDING and depend on both GOV-INV-T3 and GOV-SRC-T3:

- GOV-PRE-T3 — preamble, scheme mapping and duplicate WEEK TWO discrepancy.
- GOV-REV-T3 — scheme-only 12/13 Revision and Examination row.
- GOV-MARK-T3 — evaluation, general-evaluation, reading, weekend and theory marker dispositions.
- GOV-WK-T3-W01 through GOV-WK-T3-W11 — one indexing item for each of the eleven teaching spans.

No visual-disposition item was added because the secondary structural check found no table or embedded media group requiring separate treatment.

## Checks and limits

- Recomputed the uploaded archive SHA-256 and exact assigned member SHA-256; both match the repository assignment.
- Read the original `.doc` using Antiword 0.37 and recorded all eleven teaching-span text hashes and the preamble text hash.
- Inspected the scheme, every WEEK heading, assessment/reading/weekend/theory marker variants, and the terminal body span.
- Performed a secondary LibreOffice conversion to check for obvious tables/media; it showed no tables or media parts.
- Updated only the Government queue and this inventory note. No package, coverage entry, source rule, lesson, correction or asset was written.
- No tests, typechecks, importer/compiler run, database write, app/device check or teacher review was performed. Testing remains deferred by owner.
- No content approval, verification, certification, acceptance or deployment is claimed.

## GOV-PRE-T3 — preamble and objective-level scheme mapping

This section completes the preamble indexing task using the original archive member and Antiword 0.37 extraction. The exact first 43 extracted lines were re-read. The UTF-8 SHA-256 of lines 1–43, each followed by a newline, is `ede0cf7df2995e5726d445d631d2a0c87480b79abb3c4095604ab584a162fb92`, matching the inventory above.

### Header and references

| Element | Exact text / locator |
|---|---|
| Document title | Line 2: `THIRD TERM E-LEARNING NOTE` |
| Subject | Line 4: `SUBJECT: GOVERNMENT` |
| Class | Line 5: `CLASS: SS 1` |
| Scheme heading | Line 7: `SCHEME OF WORK` |
| Scheme column header | Line 9: `WEEK  TOPIC` |
| References | Lines 41–43: `Essential Government by C.C. Dibie.` and `Comprehensive Government by J.U. Anyaele.` |

The document header confirms Government, SS1. The reference titles and authors are recorded exactly as printed; the source supplies no edition, publisher or publication year, so those details are not inferred.

### Scheme-to-body mapping

Each scheme entry maps by topic and order to one indexed body span. Scheme locators are Antiword 0.37 lines in the preamble; body locators are Antiword 0.37 lines in the original teaching text. Preserve all source wording, including the second “WEEK TWO” label and the indented “ii.” continuation.

| Scheme entry | Scheme line locator | Exact scheme topic (abbreviated only where noted) | Body item | Body line locator | Mapping status |
|---:|---:|---|---|---:|---|
| 1 | 10 | Fundamental Human Rights | GOV-WK-T3-W01 | 44–121 | Mapped by topic; body prints WEEK TWO |
| 2 | 11–13 | Citizenship: meaning, acquisition, loss; continuation “ii. Rights of a citizen in a State.” | GOV-WK-T3-W02 | 122–230 | Mapped by topic; body also prints WEEK TWO |
| 3 | 14–15 | Safeguarding citizens’ rights; limitations; citizen/non-citizen differences | GOV-WK-T3-W03 | 231–338 | Mapped by topic |
| 4 | 16–18 | Constitutionalism: meaning, purposes, relationship with constitution | GOV-WK-T3-W04 | 339–410 | Mapped by topic |
| 5 | 19–21 | Public opinion: definition, features, formation, measurement, functions and demerits | GOV-WK-T3-W05 | 411–557 | Mapped by topic |
| 6 | 22–24 | Pressure groups: meaning, types, functions, enabling/limiting factors, modes and dangers | GOV-WK-T3-W06 | 558–713 | Mapped by topic |
| 7 | 25–27 | Political parties: meaning, types, functions, comparison with pressure groups | GOV-WK-T3-W07 | 714–830 | Mapped by topic |
| 8 | 28–29 | Party system: definition, types, features, merits/demerits and manifestos | GOV-WK-T3-W08 | 831–1035 | Mapped by topic |
| 9 | 30–33 | Franchise, universal adult suffrage, types and candidate eligibility | GOV-WK-T3-W09 | 1036–1203 | Mapped by topic |
| 10 | 34–35 | Electoral system: definition, features, types and merits/demerits | GOV-WK-T3-W10 | 1204–1410 | Mapped by topic |
| 11 | 36–38 | Electoral constituencies: meaning, delimitation, types, merits/demerits and problems | GOV-WK-T3-W11 | 1411–1551 | Mapped by topic |
| 12/13 | 39 | `12/13. Revision and Examination` | GOV-REV-T3 | Scheme-only | No teaching-body span; do not invent Week Twelve/Thirteen |

**Week-label anomaly:** scheme entry 1 maps to the first body span (lines 44–121), but that span is printed as WEEK TWO. Scheme entry 2 maps to lines 122–230, also printed as WEEK TWO. There is no WEEK ONE label. Both printed labels are preserved; no silent relabeling or parser split is made.

**Scheme continuation:** the exact line 13 text `ii. Rights of a citizen in a State.` remains attached to scheme entry 2 (Citizenship). It is not reinterpreted as a separate scheme week or silently moved to entry 3.

### Exercise and reading assessment

The inventory's marker list is the exercise/reading audit for this preamble task:
- 24 `EVALUATION QUESTIONS` headings and one shortened `EVALUATION`;
- ten full `GENERAL EVALUATION/REVISION QUESTIONS` headings and one truncated `GENERAL EVALUATION/`;
- eleven `READING ASSIGNMENT / READING ASSINGMENT` headings;
- eleven `WEEKEND ASSINGMENT` headings;
- ten `THEORY` and one misspelled `THOERY` headings.

These are source markers and pointers, not evidence that a question has an answer key or marks. The detailed marker disposition is handled by GOV-MARK-T3. No question, answer, mark, reading source or weekend assignment is invented by GOV-PRE-T3.

### Scope and follow-up

- All eleven scheme teaching entries have a corresponding indexed body span by topic and order.
- The two printed WEEK TWO labels remain a source anomaly requiring explicit treatment in W01/W02 indexing and any later parser/importer review.
- The 12/13 revision/examination row is cross-referenced to GOV-REV-T3 and remains scheme-only.
- References are indexed exactly as printed; bibliographic details not supplied by the source remain unknown.
- No lesson, coverage entry, source rule, correction or asset is created by this preamble task. Objective completeness and any PARTIAL/UNRESOLVED follow-up are assessed by the corresponding GOV-WK-T3 items.

## GOV-REV-T3 — scheme-only marker disposition (blocked by write-path scope)

- Exact Antiword 0.37 line 39: `12/13.  Revision and Examination` (the source's two spaces are preserved in the extracted line).
- Preamble lines 1–43 SHA-256: `ede0cf7df2995e5726d445d631d2a0c87480b79abb3c4095604ab584a162fb92`.
- The row occurs once in the scheme. The inventory records eleven teaching spans ending at line 1551; no Week Twelve or Week Thirteen body follows.
- Required disposition: a source-bound `classify_marker` rule with kind `SCHEME_ONLY`, targeting this exact row. No revision lesson, examination paper, answer, marks or additional teaching week is warranted.
- **Implementation gate:** GOV-REV-T3's `allowed_write_paths` permits only `QUEUE.json` and `GOV-INV-T3.md`; it does not permit `backend/src/db/ss1/subjects/government.json`, where the package's `source_rules[]` must be written. The protocol prohibits writing outside the task's allowed paths. Therefore the rule and marker coverage target have **not** been written, and the item is marked BLOCKED rather than falsely completed.
- Owner action required: add `backend/src/db/ss1/subjects/government.json` to this item's `allowed_write_paths` or explicitly reassign the rule-writing step to an item that authorizes the package path. Once authorized, add the SCHEME_ONLY rule and link the existing/new marker coverage according to the package contract.

## GOV-MARK-T3 — assessment, reading and theory marker disposition

The original Antiword 0.37 extraction was re-read and all marker headings were checked against the following lines. These markers remain within their respective teaching spans. They are not scheme-only revision/examination markers and are not reclassified by a parser rule.

### Exact marker inventory and week mapping

| Teaching item | Span lines | EVALUATION QUESTIONS / EVALUATION | GENERAL EVALUATION / REVISION | READING ASSIGNMENT | WEEKEND ASSINGMENT | THEORY |
|---|---:|---|---|---|---|---|
| GOV-WK-T3-W01 | 44–121 | 68, 85 | 89 | 96 | 100 | 117 |
| GOV-WK-T3-W02 | 122–230 | 172, 193 | 197 | 205 | 209 | 226 |
| GOV-WK-T3-W03 | 231–338 | 283, 303 | 307 | 315 | 319 | 335 (`THOERY`) |
| GOV-WK-T3-W04 | 339–410 | 366 | 379 | 386 | 390 | 406 |
| GOV-WK-T3-W05 | 411–557 | 438 (`EVALUATION`), 464, 518 | 522 | 530 | 534 | 553 |
| GOV-WK-T3-W06 | 558–713 | 614, 671 | 675 | 686 | 690 | 708 |
| GOV-WK-T3-W07 | 714–830 | 751, 791 | 795 | 805 | 809 | 826 |
| GOV-WK-T3-W08 | 831–1035 | 892, 977, 996 | 1000 | 1009 | 1013 | 1031 |
| GOV-WK-T3-W09 | 1036–1203 | 1086, 1126, 1167 | 1172 | 1180 | 1184 | 1199 |
| GOV-WK-T3-W10 | 1204–1410 | 1273, 1330, 1371 | 1375 (`GENERAL EVALUATION/`, truncated) | 1385 | 1389 | 1405 |
| GOV-WK-T3-W11 | 1411–1551 | 1450, 1515 | 1519 | 1526 | 1529 | 1549 |

### Counts and content assessment

- 24 `EVALUATION QUESTIONS` headings and one shortened `EVALUATION` heading (line 438). Each is followed by question text; these are source exercises, not answer keys.
- Ten full `GENERAL EVALUATION/REVISION QUESTIONS` headings and one truncated `GENERAL EVALUATION/` heading (line 1375). The truncated heading is followed by question text and remains exactly as printed.
- Eleven reading-assignment headings. The source alternates `READING ASSIGNMENT` and `READING ASSINGMENT`; each is followed by book/page pointers. Preserve the misspelling in source data.
- Eleven `WEEKEND ASSINGMENT` headings. Each is followed by practice questions, predominantly multiple-choice. No answer key is supplied by the marker itself.
- Ten `THEORY` headings and one misspelled `THOERY` heading (line 335). Each is followed by written prompts.
- All these markers occur inside the eleven teaching spans. None is the scheme-only “12/13. Revision and Examination” row at preamble line 39.

### Disposition

- Preserve all marker strings and spelling variants exactly; do not normalize `ASSINGMENT`, `THOERY` or the truncated `GENERAL EVALUATION/` in the source.
- Keep each marker attached to its teaching week as shown above.
- Do not add `classify_marker` rules for EVALUATION, GENERAL EVALUATION, READING ASSIGNMENT, WEEKEND ASSINGMENT or THEORY. The package schema's supported marker kinds do not include these; they are in-week source content.
- Do not mark a source question as answered, invent marks or create answer keys. Later lesson work may add clearly labelled original practice/answers where a task expressly authorizes it.
- Do not conflate any in-week `GENERAL EVALUATION/REVISION QUESTIONS` with the separate scheme-only row 12/13. GOV-REV-T3 separately records that row and is currently BLOCKED because its allowed write paths omit the package JSON.

No lesson, coverage entry, source rule, correction or asset was created by GOV-MARK-T3.


## GOV-WK-T3-W01 — Fundamental Human Rights indexing

**Status:** IMPLEMENTED — TESTING DEFERRED. Source indexing and dated legal fact-check evidence only; no lesson, answer key, marks, correction, asset or parser rule is authored here.

### Source identity and exact locator

- Source ID: `SS1-SRC-5f34b9f4efc4`.
- Archive member: `SSS 1/3rd Term SS1_/3RD TERM S1 GOVERNMENT.doc`.
- Archive SHA-256: `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`.
- Member SHA-256: `04171c3632d3f6bcac893a2900e3c05dc3bd7fa089369e3ef575239701db368e`.
- Extractor: Antiword 0.37, used on the original legacy `.doc` member.
- Complete teaching span: lines 44–121; UTF-8 SHA-256 of those lines joined with a newline after every line: `56a766cf9063a77a3ffc249cecea8f30b9d9eebb02e9a7068c0b68eb6b459c34`.
- Printed week label: `WEEK TWO` at line 44; topic: `FUNDAMENTAL HUMAN RIGHTS` at line 45.
- Scheme entry 1 is `Fundamental Human Rights` at preamble line 10. It maps to this first body span by topic and order. The source has no WEEK ONE label; the next span (lines 122–230) is also printed WEEK TWO and maps to scheme entry 2 (Citizenship). Both labels remain unchanged.
- Locators below refer to the Antiword extraction, not printed page numbers or native Word paragraph IDs. No importer/parser was run, so no importer-produced lesson-row ID is asserted; coverage lesson_ids are left empty rather than inventing a body identity from a different extractor.

### Objective-level coverage

| Coverage ID | Source objective / marker | Status |
|---|---|---|
| COV-GOV-T3-SCHEME-W01-FUNDAMENTAL-HUMAN-RIGHTS | Scheme entry 1 mapped to first body span | PARTIAL |
| COV-GOV-T3-W01-DEFINITION | Definition of fundamental human rights, lines 50–56 | PARTIAL |
| COV-GOV-T3-W01-RIGHTS-LIST | Rights listed, lines 57–66 | PARTIAL |
| COV-GOV-T3-W01-CONSTITUTIONAL-REASONS | Reasons for constitutional inclusion, lines 72–83 | PARTIAL |
| COV-GOV-T3-W01-GENERAL-REVISION | General evaluation/revision, lines 89–94 | PARTIAL |
| COV-GOV-T3-W01-READING | Reading assignment, lines 96–98 | PARTIAL |
| COV-GOV-T3-W01-ASSESSMENT-KEYS | All exercise blocks, lines 68–119 | UNRESOLVED |
| COV-GOV-T3-W01-WEEKEND-CURTAILMENT | Weekend question 4, lines 110–112 | PARTIAL |

Eight coverage entries and seven precise package open items were added. Every PARTIAL or UNRESOLVED entry is linked to at least one open item. The existing T3 source-alias owner action remains unchanged; no approval reference was invented.

### Definition and scope — lines 50–66

The source defines human rights as “privileges enjoyed by the citizens” and says they are defined and enjoyed within the bounds of domestic law. That is too narrow as a definition of human rights generally. The UN Universal Declaration of Human Rights (UDHR), proclaimed by the General Assembly on 10 December 1948, describes rights as universal: Articles 1–2 refer to all human beings/everyone without distinction. Distinguish:
- human rights as universal claims held by people;
- the fundamental rights specifically protected in Chapter IV of Nigeria's Constitution; and
- citizen-specific political or constitutional entitlements.

The source list is not a reliable undifferentiated list of rights belonging only to citizens:
- **Life, dignity, slavery and inhuman treatment:** Constitution sections 33–34. Section 33 is framed for every person; section 34 protects every individual and prohibits torture/inhuman or degrading treatment, slavery/servitude and forced labour, subject to its stated exceptions.
- **Personal liberty:** section 35 protects every person but allows deprivation only in listed cases and according to lawful procedure. “Freedom from unlawful detention” must not be taught as immunity from every lawful arrest or detention.
- **Fair hearing:** section 36 protects every person's fair-hearing rights in the relevant determinations; it is not limited to citizens.
- **Expression and association:** sections 39–40 use “every person”; their constitutional scope and lawful limitations must be explained.
- **Movement:** section 41 is expressly framed as a right of every citizen, with specified restrictions in subsection (2).
- **Property:** section 43 concerns acquiring and owning immovable property anywhere in Nigeria and is expressly citizen-specific; section 44 separately regulates compulsory acquisition and compensation.
- **Education:** section 18 is in Chapter II, “Fundamental Objectives and Directive Principles of State Policy”, not Chapter IV. Section 6(6)(c) generally excludes Chapter II questions from judicial powers, except where the Constitution otherwise provides. It should not be labelled a Chapter IV fundamental right without explaining this distinction.
- **Voting:** section 77(2) entitles a Nigerian citizen aged 18 or over and resident in Nigeria at voter registration to be registered for the relevant election. Eligibility to stand for office is governed separately by office-specific constitutional provisions; “vote and be voted for” is not one undifferentiated Chapter IV right.
- **Security:** the UDHR includes security of person in Article 3. Nigeria's Chapter IV contains related protections, but the source's combined phrase “right to life, security, and protection from inhuman treatment” should not be represented as one verbatim Chapter IV right.

### Reasons for constitutional inclusion — lines 72–83

The reasons are retained as the source's claims, not accepted wholesale:
- Easy reference and constitutional protection are reasonable aims; section 1 establishes constitutional supremacy.
- Constitutional text can help limit arbitrary government, but its existence does not by itself prevent dictatorship.
- Section 46 provides a route to apply to a High Court for redress for alleged Chapter IV contraventions.
- The assertion that constitutional inclusion prevents government from changing rights is false as an absolute. Section 9 permits constitutional alteration; under section 9(3), altering Chapter IV requires at least a four-fifths majority of all members of each National Assembly chamber and approval by at least two-thirds of the State Houses of Assembly.
- “Comply with U.N.O.'s directive” is imprecise. The UN General Assembly proclaimed the UDHR as a common standard of achievement, not as a direct instruction to insert this exact list into Nigeria's Constitution. The UDHR is a declaration, not itself a treaty. Section 12 of Nigeria's Constitution states that a treaty has force of law only to the extent it is enacted by the National Assembly.

### Assessment and reading-marker audit

All source markers and stems in the span were checked:
- `EVALUATION QUESTIONS`: lines 68 and 85; two questions follow each heading (four total).
- `GENERAL EVALUATION/REVISION QUESTIONS`: line 89; five questions follow. Question 1 concerns fundamental rights. Question 2 (functions of human-rights groups) and question 3 (origin of human rights) are not taught in this span. Questions 4–5 concern Nazism and do not match the Fundamental Human Rights scheme entry.
- `READING ASSIGNMENT`: line 96; `Comprehensive Government` pp. 74–76 and `Essential Government` pp. 89–90 at lines 97–98. Editions and publication details are absent; neither book was available or consulted.
- `WEEKEND ASSINGMENT`: exact misspelling retained at line 100; five multiple-choice stems at lines 101–115. Question 4 says rights may be curtailed when there is a violent demonstration. This is too broad: section 45 requires a law reasonably justifiable in a democratic society for specified purposes and applies to specified rights; a violent demonstration alone is not a blanket constitutional test.
- `THEORY`: line 117; two written prompts at lines 118–119.

There are **16 exercise stems** in total: 2 + 2 + 5 + 5 + 2. No source answer key, marks or marking criteria are supplied. No answer or mark has been invented. The general-revision questions that do not match this week remain visible as source content and are tracked for placement/teaching follow-up.

### Dated legal and human-rights references consulted

1. **Policy and Legal Advocacy Centre (PLAC), *Constitution of the Federal Republic of Nigeria, 1999*, updated with the First–Fifth Alterations** (third revision October 2023; reprint September 2024). Used for sections 1, 6(6)(c), 9(3), 12, 18, 33–46 and 77(2). This is a consolidated reference text, not represented as a Federal Government gazette: https://placng.org/i/wp-content/uploads/2023/11/Constitution-of-the-Federal-Republic-of-Nigeria-1999-Updated.pdf
2. **United Nations, *Universal Declaration of Human Rights***, proclaimed by General Assembly resolution 217 A (III), 10 December 1948. Used for the universal scope of human rights (Articles 1–2), security of person (Article 3), slavery and inhuman treatment (Articles 4–5), fair hearing (Article 10), and the Declaration's status as a common standard: https://www.un.org/en/about-us/universal-declaration-of-human-rights
3. **United Nations Office at Geneva, “Human rights”**. Explains that the UDHR is not itself a legally binding treaty and that it inspired subsequent human-rights treaties: https://www.ungeneva.org/en/about/topics/human-rights
4. **United Nations Dag Hammarskjöld Library, “UN Human Rights Documentation: Overview”**. Confirms that the UDHR is not a treaty and has not been signed or ratified by states: https://research.un.org/en/docs/humanrights

### Open items and limits

- `GOVERNMENT-T3-W01-DEFINITION-FACT` — correct the citizen-only definition and distinguish universal human rights from constitutional rights.
- `GOVERNMENT-T3-W01-RIGHTS-CLASSIFICATION-FACT` — classify the listed rights by constitutional provision, scope and limitation.
- `GOVERNMENT-T3-W01-CONSTITUTIONAL-REASONS-FACT` — correct the absolute amendment claim and qualify the “U.N.O. directive” claim.
- `GOVERNMENT-T3-W01-REVISION-MISALIGNMENT` — resolve the untaught human-rights-group/origin questions and the two Nazism questions' placement.
- `GOVERNMENT-T3-W01-READING-VERIFICATION` — verify editions and page contents before treating the pointers as checked reading.
- `GOVERNMENT-T3-W01-ASSESSMENT-KEYS` — no answers, marks or marking criteria for the 16 stems.
- `GOVERNMENT-T3-W01-WEEKEND-CURTAILMENT-FACT` — correct the oversimplified rights-curtailment proposition in weekend question 4.

No lesson, correction, source rule, asset, answer key or marks were created. The source wording, duplicate WEEK TWO label and exercise spellings remain preserved. No tests, typechecks, importer/compiler run, database write, app/device check or teacher review was performed; testing remains deferred.


## GOV-WK-T3-W02 — Citizenship indexing

**Status:** IMPLEMENTED — TESTING DEFERRED. Source indexing and dated constitutional fact-check evidence only; no lesson, answer key, marks, correction, asset or parser rule is authored here.

### Source identity and exact locator

- Source ID: `SS1-SRC-5f34b9f4efc4`; archive member: `SSS 1/3rd Term SS1_/3RD TERM S1 GOVERNMENT.doc`.
- Archive SHA-256: `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`.
- Member SHA-256: `04171c3632d3f6bcac893a2900e3c05dc3bd7fa089369e3ef575239701db368e`.
- Extractor: Antiword 0.37 on the original legacy `.doc`.
- Complete span: lines 122–230; UTF-8 span SHA-256: `794ec054b76684c811ef3d05e9a53e07f275ac9c3c1f610a9039594e062d100f`.
- Exact printed label: `WEEK TWO` at line 122; topic: `CITIZENSHIP` at line 123.
- This is scheme entry 2 by topic and order. It follows the first span, which also prints WEEK TWO and maps to scheme entry 1. Both labels are retained; no silent relabelling is made.
- Scheme entry 2 continues at preamble line 13 with `ii. Rights of a citizen in a State.` That continuation is carried forward to W03, whose span (lines 231–338) addresses safeguarding rights, limitations and citizen/non-citizen differences. It is not claimed as taught in W02.
- Locators below refer to Antiword line numbers, not page numbers or native Word paragraph IDs. No importer/parser was run, so no importer-produced lesson-row ID is asserted; coverage lesson_ids are empty rather than inferred from a different extractor.

### Objective-level coverage

| Coverage ID | Objective / marker | Status |
|---|---|---|
| COV-GOV-T3-W02-MEANING | Meaning of citizenship, lines 129–138 | PARTIAL |
| COV-GOV-T3-W02-ACQUISITION | Birth/descent, registration, naturalisation, honorary status and conquest, lines 140–170 | PARTIAL |
| COV-GOV-T3-W02-LOSS | Stated loss grounds, lines 176–191 | PARTIAL |
| COV-GOV-T3-W02-GENERAL-REVISION | General revision questions, lines 197–203 | PARTIAL |
| COV-GOV-T3-W02-READING | Reading pointers, lines 205–207 | PARTIAL |
| COV-GOV-T3-W02-ASSESSMENT-KEYS | All evaluation, revision, weekend and theory stems | UNRESOLVED |
| COV-GOV-T3-W02-WEEKEND-ACQUISITION | Weekend MCQs 1–3, lines 210–218 | PARTIAL |
| COV-GOV-T3-W02-SCHEME-CITIZENSHIP | Scheme entry 2 citizenship subtopics; rights continuation carried to W03 | PARTIAL |

Eight coverage entries and seven linked package open items were added. The T3 alias approval action remains unchanged; no owner approval was invented.

### Meaning and rights of citizens — lines 129–138

The source describes a citizen as a legal member who owes allegiance to a country “he resides in” and enjoys full civil and political rights. Residence is not a defining condition of citizenship: a Nigerian citizen can live abroad and retain citizenship. The statement that aliens have no civil or political rights is too broad. Many constitutional rights apply to every person, while some political rights are citizen-specific and subject to qualifications. The Constitution separately sets out citizens' duties in section 24. Preserve the source's wording as evidence; do not silently replace it.

### Acquisition of Nigerian citizenship — lines 140–170

The current constitutional framework is Chapter III, sections 25–27:
- **Birth/descent:** section 25 calls the category “citizenship by birth”; descent is included within it. A person born outside Nigeria is a Nigerian citizen by birth if either parent is a Nigerian citizen (s25(1)(c)). A person born in Nigeria after independence qualifies if either parent or any grandparent is a Nigerian citizen (s25(1)(b)). Thus the source's “born in a particular state” definition is incomplete. The U.S.-birth example depends on U.S. law and is not verified by this Nigerian constitutional review.
- **Registration:** section 26 requires the President to be satisfied about good character, a clear intention to be domiciled in Nigeria and the prescribed oath. Section 26(2) identifies those to whom it applies, including any woman who is or has been married to a Nigerian citizen and a person of full age and capacity born outside Nigeria with a Nigerian-citizen grandparent. Marriage alone does not automatically confer citizenship.
- **Naturalisation:** section 27 requires full age and capacity, good character, intention to domicile, acceptance by the local community/assimilation, a useful contribution to Nigeria and the oath. The residence test is either 15 continuous years, or 12 continuous months immediately before application plus at least 15 years' aggregate residence during the preceding 20 years. The source's “15 years” alone is incomplete.
- **Honorary citizenship:** the Nigerian Constitution does not list honorary citizenship as a nationality-acquisition route in Chapter III. It may be a form of symbolic recognition in another country, but should not be presented as a Nigerian constitutional mode. The source's example says Miriam Makeba received honorary citizenship in Liberia, Ethiopia and Guinea. A scholarly study supports honorary Guinean citizenship and land in Dalaba in 1967; the Liberia and Ethiopia citizenship claims were not corroborated in the sources consulted. Do not infer formal nationality from honorary recognition or an honorary passport.
- **Conquest:** conquest is not listed as a current Nigerian constitutional acquisition route. The source's phrase “after secessionist struggles” is not a legal explanation of how Nigerian citizenship is acquired. Section 2(1) describes Nigeria as an indivisible and indissoluble sovereign state. Treat the source claim as historical/unverified rather than current law.

### Loss or deprivation of citizenship — lines 176–191

The source heading misspells `LOSING` as `LOOSING`; preserve it in the source record. The seven claims need substantial qualification against sections 28–30:
- **Dual citizenship (s28):** it is not true that every dual citizen automatically loses Nigerian citizenship. Section 28(1) distinguishes a Nigerian citizen by birth from a person who is not a citizen by birth; the latter forfeits Nigerian citizenship if they acquire or retain another country's citizenship/nationality and are not a citizen by birth of that other country. Section 28(2) imposes an effective-renunciation condition within no more than 12 months in specified registration/naturalisation cases.
- **Renunciation (s29):** a citizen of full age (18 or above) must make a declaration in the prescribed manner. Cessation follows registration of that declaration. The President may withhold registration during a war in which Nigeria is physically involved or where registration is contrary to public policy. A verbal statement alone is not the constitutional procedure.
- **Imprisonment after naturalisation (s30(1)):** the President may deprive a person who is neither a citizen by birth nor by registration if, within seven years after naturalisation, the person has been sentenced to imprisonment for at least three years. This is not any criminal case or any unspecified period of incarceration.
- **Disloyalty and wartime conduct (s30(2)):** the Constitution addresses disloyalty shown by act or speech and specified unlawful trade/business/communication with an enemy during a war, subject to the stated process. It is not simply any support for another country.
- **False declaration and treasonable felony:** neither appears as a standalone ground in sections 28–30. Do not assert either as an automatic ground without identifying any separate applicable legal authority. A conviction for an offence and deprivation of citizenship are not interchangeable.

### Assessment, reading and weekend-marker audit

- `EVALUATION QUESTIONS`: line 172 (two stems at lines 173–174) and line 193 (two stems at lines 194–195).
- `GENERAL EVALUATION/REVISION QUESTIONS`: line 197; five stems at lines 198–203. The first three concern citizenship, although conquest is not a current constitutional acquisition mode and treason requires precise legal treatment. Questions 4–5 ask about monarchy and military intervention in politics, not taught in this citizenship span and not part of this scheme entry.
- `READING ASSINGMENT`: exact misspelling at line 205; pointers to `Comprehensive Government` pp. 72–74 and `Essential Government` pp. 87–88 at lines 206–207. Editions/publication details are absent; neither text was supplied or consulted.
- `WEEKEND ASSINGMENT`: line 209; five MCQs at lines 210–224. Question 1 appears to offer both “by coup” and “by conquest” as options to exclude; neither is a current constitutional acquisition mode, so more than one option may be defensible. Question 2 treats honorary citizenship as a Nigerian acquisition mode, which Chapter III does not list. Question 3 uses good character (one condition, not a complete test) and repeats the option label `(c)`; preserve the defect. Question 4 gives a simple meaning of dual citizenship but does not address its constitutional consequences. Question 5's disloyalty option needs the section 30(2) qualifications.
- `THEORY`: line 226; two prompts at lines 227–228.
- Total: **16 exercise stems** (4 evaluation + 5 general revision + 5 weekend + 2 theory). No source answer key, marks or marking criteria are supplied. No answers or marks were invented.

### Dated constitutional and historical references consulted

1. **PLAC, *Constitution of the Federal Republic of Nigeria, 1999*, updated with the First–Fifth Alterations** (third revision October 2023; reprint September 2024). Used for Chapter III ss25–30, s2(1), s24 and the relevant Chapter IV rights: https://placng.org/i/wp-content/uploads/2023/11/Constitution-of-the-Federal-Republic-of-Nigeria-1999-Updated.pdf
2. **Hashachar, “Playing the backbeat in Conakry: Miriam Makeba and the cultural politics of Sékou Touré’s Guinea, 1968–1986”** (2017). Reports that Makeba was awarded honorary citizenship and land in Dalaba during her 1967 visit to Guinea: https://www.tandfonline.com/doi/abs/10.1080/02533952.2017.1364467
3. **“Remembering Miriam Makeba,” *Journal of Musical Arts in Africa*** (2008). Describes honorary Guinean citizenship and her residence in Guinea: https://www.tandfonline.com/doi/pdf/10.2989/JMAA.2008.5.1.6.789

### Open items and limits

- `GOVERNMENT-T3-W02-MEANING-FACT` — correct the residence-based definition and the overbroad claim about aliens' rights.
- `GOVERNMENT-T3-W02-ACQUISITION-FACT` — correct birth/descent, registration and naturalisation; distinguish honorary status and conquest from Nigerian constitutional routes; verify the foreign-law example separately.
- `GOVERNMENT-T3-W02-HONORARY-EXAMPLE-FACT` — verify the Liberia and Ethiopia claims and distinguish honorary recognition from nationality; Guinea is supported by a scholarly source.
- `GOVERNMENT-T3-W02-LOSS-FACT` — correct all seven claims against sections 28–30 and verify any additional statutory ground.
- `GOVERNMENT-T3-W02-REVISION-MISALIGNMENT` — resolve the monarchy and military-intervention questions' placement.
- `GOVERNMENT-T3-W02-READING-VERIFICATION` — verify exact editions and pages.
- `GOVERNMENT-T3-W02-ASSESSMENT-KEYS` — no answers, marks or marking criteria for the 16 stems.

No lesson, correction, source rule, asset, answer key or marks were created. The source wording, duplicate WEEK TWO label, misspelled headings and repeated MCQ option label remain preserved. No tests, typechecks, importer/compiler run, database write, app/device check or teacher review was performed; testing remains deferred.


## GOV-WK-T3-W03 — Safeguarding citizens' rights, limitations and citizen/non-citizen distinctions

**Status:** IMPLEMENTED — TESTING DEFERRED. Source indexing and dated constitutional/legal fact-check evidence only; no lesson, answer key, marks, correction, asset or parser rule is authored here.

### Source identity and exact locator

- Source ID: `SS1-SRC-5f34b9f4efc4`; archive member: `SSS 1/3rd Term SS1_/3RD TERM S1 GOVERNMENT.doc`.
- Archive SHA-256: `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc175239701db368e` — see the source member hash below for the authoritative full value.
- Member SHA-256: `04171c3632d3f6bcac893a2900e3c05dc3bd7fa089369e3ef575239701db368e`.
- Extractor: Antiword 0.37 on the original legacy `.doc`.
- Complete span: lines 231–338; UTF-8 span SHA-256: `a5fdd8fc95bebc2a59ba0915d39b7a3148c5673917d1b78dd1f5b5b7f2c345f9`.
- Printed label: `WEEK THREE` at line 231; topic: `CITIZENSHIP` at line 232.
- This span maps to the continuation of scheme entry 2, `ii. Rights of a citizen in a State.` (preamble line 13). W02 indexed the preceding citizenship meaning/acquisition/loss subtopics; this W03 span covers the rights continuation.
- Locators refer to Antiword line numbers, not page numbers or native Word paragraph IDs. No importer/parser was run, so no importer-produced lesson-row ID is asserted; coverage lesson_ids are empty rather than inferred from another extractor.

### Objective-level coverage

| Coverage ID | Objective / marker | Status |
|---|---|---|
| COV-GOV-T3-W03-SCHEME-RIGHTS | Scheme entry 2 rights continuation | PARTIAL |
| COV-GOV-T3-W03-SAFEGUARDS | Safeguards, lines 238–257 | PARTIAL |
| COV-GOV-T3-W03-LIMITATIONS | Limitations, lines 259–281 | PARTIAL |
| COV-GOV-T3-W03-PRISONER-VOTING | Imprisonment and voting claim, lines 262–263 | PARTIAL |
| COV-GOV-T3-W03-CITIZEN-NONCITIZEN | Comparison, lines 286–301 | PARTIAL |
| COV-GOV-T3-W03-GENERAL-REVISION | General revision, lines 307–313 | PARTIAL |
| COV-GOV-T3-W03-READING | Reading pointers, lines 315–317 | PARTIAL |
| COV-GOV-T3-W03-ASSESSMENT-KEYS | All assessment blocks | UNRESOLVED |
| COV-GOV-T3-W03-WEEKEND-MCQS | Weekend MCQs, lines 320–333 | PARTIAL |

Nine coverage entries and eight linked open items were added. The existing T3 source-alias owner action remains unchanged.

### Safeguarding rights — lines 238–257

The source lists an independent judiciary, freedom of the press, democracy, constitutional entrenchment, peace/order, supremacy of law, literacy and poverty reduction. These are not all the same kind of safeguard:
- Constitutional supremacy and access to courts support legal protection (ss1 and 46); fair hearing and judicial independence are also reflected in s36 and the constitutional judicial framework.
- Freedom of expression/press is in s39; section 22 is a Chapter II directive to mass media. A free press can support accountability, but it does not guarantee that rights will always be protected.
- Entrenchment makes rights constitutionally protected, but it is not immutable: Chapter IV can be altered only through the special process in s9(3).
- Peace/order and rule of law are important conditions, but must not be used to justify arbitrary restrictions.
- Literacy and poverty reduction are important social-policy aims; they are not direct individual remedies for a Chapter IV violation. The lesson should distinguish institutions and enforceable remedies from broader policy conditions.

### Limitations — lines 259–281

The source's list combines different legal rules and often overstates them:
- **Slander/libel/sedition:** freedom of expression is protected by s39, subject to the Constitution's specified limitations and the general s45 test. Defamation and sedition should not be taught as automatic or unlimited restrictions. Sedition case law requires careful dating: *DPP v Chike Obi* (1961) considered Criminal Code provisions under the 1960 Constitution; *Arthur Nwankwo v State* (1985) is commonly cited for a later constitutional challenge under the 1979 Constitution. The source's generic statement does not identify the applicable law or current constitutional test.
- **Conviction and imprisonment:** a lawful sentence can deprive liberty under s35(1)(a), but imprisonment does not automatically remove every right. In particular, INEC's 2025 report summarises a Federal High Court decision of 16 December 2014 recognising inmates' voting rights and an affirming Court of Appeal decision. INEC also notes the Electoral Act 2022 s12(1)(e) legal-incapacity qualification and unresolved implementation questions for some categories. The source's blanket statement that an imprisoned citizen may lose voting rights is inaccurate.
- **Emergency/curfew:** s45(1) allows laws restricting specified rights only when reasonably justifiable in a democratic society for listed purposes. Section 45(2) separately addresses emergency derogations from ss33 and 35 under an Act and only to the extent reasonably justifiable. A curfew is not an automatic, unlimited power arising from the word “emergency”.
- **Secret societies:** s38(4) expressly states that the right to freedom of thought, conscience and religion does not entitle a person to form, participate in or be a member of a secret society. This specific provision should not be confused with a general power to deny peaceful association under s40.
- **Property:** s43 gives citizens a right to acquire and own immovable property. Compulsory acquisition is separately controlled by s44: it must follow law, require prompt compensation and allow access to a court/tribunal. “Useful for development” is not a complete legal test or a licence for arbitrary taking.
- **Trespass:** the fact that a person has no right to trespass on another's property is not, by itself, a general constitutional limitation on freedom of movement under s41. The relevant property and movement rules should be distinguished.
- **Life:** s33(1) sets out the constitutional circumstance for deprivation of life through execution of a court sentence for a criminal offence of which the person has been found guilty in Nigeria. The source's examples must not be read as a sentence without lawful conviction and due process.
- **Political disqualification/bans:** a vague label such as “banned politician because of past role” is not a sufficient legal rule. Candidate eligibility and disqualification are governed by office-specific constitutional provisions. Political expression and association are protected by ss39–40; any restriction requires a valid legal basis and applicable constitutional test.

### Citizen and non-citizen — lines 286–301

The source's comparison is too absolute:
- Citizenship is legal membership, but non-citizens are still subject to Nigerian law and can owe legal duties; section 24 sets out duties of citizens, not a general exemption of non-citizens from all obligations.
- Many constitutional rights apply to every person, including rights in ss33–40. Some provisions are expressly citizen-specific, such as movement under s41, immovable property under s43 and voter registration under s77(2).
- Some public offices have citizenship qualifications, but “citizens can serve in any capacity; non-citizens cannot” is too broad.
- “Citizens can take any job of their choice” is also too broad: qualifications and legal restrictions apply to everyone. Non-citizen employment depends on the applicable immigration and work-authorisation rules; the source gives no statute or exception.
- “The rights of a citizen are guaranteed, while those of a non-citizen are not” is false as a blanket statement. Non-citizens have many constitutional protections, while some political and other entitlements are citizen-specific.

### Assessment and reading-marker audit

- `EVALUATION QUESTIONS`: line 283; one question at line 284.
- `EVALUATION QUESTIONS`: line 303; two questions at lines 304–305.
- `GENERAL EVALUATION/REVISION QUESTIONS`: line 307; five questions at lines 308–313. Questions 1–3 concern this topic; questions 4–5 ask for sources/features of a constitution, not taught in this span.
- `READING ASSINGMENT`: exact misspelling at line 315; `Comprehensive Government` pp. 74–76 and `Essential Government` pp. 89–91 at lines 316–317. Editions are unspecified and the books were not inspected.
- `WEEKEND ASSINGMENT`: line 319; five MCQs at lines 320–333. Q1 has several potentially defensible options because marriage to a foreigner is not a general deprivation ground, dual citizenship has qualified consequences, and conviction/ex-convict status is not automatically sufficient. Q2 may have more than one “not an obligation” option: freedom of conscience/religion is a right, voting is not listed as a duty in s24, and reporting a crime is not one of the enumerated constitutional duties. Q3 mixes birth, conviction and renunciation, which have different legal effects. Q4 requires the precise s33(1) court-sentence rule. Q5 contains overlapping descriptions of rights.
- `THOERY`: exact misspelling at line 335; two prompts at lines 336–337.
- Total: **15 exercise stems** (1 + 2 + 5 + 5 + 2). No source answer key, marks or marking criteria are supplied. No answers or marks were invented.

### Dated legal references consulted

1. **PLAC, *Constitution of the Federal Republic of Nigeria, 1999*, updated with the First–Fifth Alterations** (third revision October 2023; reprint September 2024). Used for ss1, 6, 17, 22, 24, 33, 35–45, 46, 77 and the applicable limitations: https://placng.org/i/wp-content/uploads/2023/11/Constitution-of-the-Federal-Republic-of-Nigeria-1999-Updated.pdf
2. **Independent National Electoral Commission, *Election Management in Nigeria: 2015–2025*** (first published July 2025), section 9.4.2, “Voting Rights for Inmates in Correctional Centres”. It summarises the 2014 Federal High Court decision, the affirming Court of Appeal decision, Electoral Act 2022 s12(1)(e) and implementation issues: https://wp1.inecnigeria.org/wp-content/uploads/Activity-Report-Election-Management-Body.pdf
3. ***Director of Public Prosecutions v Chike Obi* (FSC 56/1961)**, NigeriaLII case record, on Criminal Code sedition provisions under the 1960 constitutional framework: https://nigerialii.org/akn/ng/judgment/ngsc/1961/28/eng%401961-04-06
4. ***Arthur Nwankwo v State* (1985) 6 NCLR 228**. A later legal discussion describes the Court of Appeal's constitutional treatment of Criminal Code sedition provisions under the 1979 Constitution; current application requires a provision-specific legal review: https://repository.run.edu.ng/bitstreams/f2121c61-f57a-4edb-9225-97cad175aaa0/download

### Open items and limits

- `GOVERNMENT-T3-W03-SAFEGUARDS-FACT` — distinguish enforceable safeguards from institutional conditions and social-policy aims.
- `GOVERNMENT-T3-W03-LIMITATIONS-FACT` — correct the nine limitation claims against the exact constitutional provisions and tests.
- `GOVERNMENT-T3-W03-PRISONER-VOTING-FACT` — replace the blanket prisoner-voting claim with the Constitution, Electoral Act and INEC/court context.
- `GOVERNMENT-T3-W03-CITIZEN-NONCITIZEN-FACT` — correct the absolute rights, duties, work and public-service comparisons.
- `GOVERNMENT-T3-W03-REVISION-MISALIGNMENT` — resolve the two constitution-structure questions' placement.
- `GOVERNMENT-T3-W03-READING-VERIFICATION` — verify the exact editions and page contents.
- `GOVERNMENT-T3-W03-ASSESSMENT-KEYS` — no answers, marks or marking criteria for the 15 stems.
- `GOVERNMENT-T3-W03-WEEKEND-MCQ-AMBIGUITY` — revise ambiguous MCQs before creating a key.

No lesson, correction, source rule, asset, answer key or marks were created. The source's wording, headings and spellings remain preserved. No tests, typechecks, importer/compiler run, database write, app/device check or teacher review was performed; testing remains deferred.
