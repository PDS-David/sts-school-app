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
