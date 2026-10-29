# FM-PRE-T2 — Further Mathematics, 2nd Term preamble indexing

Status: **IMPLEMENTED_TESTING_DEFERRED** (implemented; not approved, not verified). Testing deferred by owner.

## Inputs
- Starting SHA: `20fa3e0eafbf11052611495bcca7d9424adcae4f` (origin/master, after PR #183 merged by owner). Before publishing, master advanced to `75dbb9f9e64b6a94388f21e8e53d73269d28d7a8` when the owner merged PR #184 (Food and Nutrition) and PR #185 (French); neither touches a Further Mathematics file, so this branch is based on the newer master with no overlap. No open PR touched this item at start; no `AGENTS.md`. Prerequisite FM-SRC-T2 is IMPLEMENTED_TESTING_DEFERRED.
- Source `SS1-SRC-43c5ab51b87f`; member `SSS 1/2nd Term SS1_/2ND TERM S1 FURTHER MATHEMATICS.docx`, SHA-256 `3f9b36a0d90af06f9eb82bacd4dbc29a7737290566fd1109f51983537844bb36` **verified**, 420,997 bytes; equals `SOURCE_ASSIGNMENTS.csv` line 25. Composite archive `SSS 1-20260507T072431Z-3-001.zip`, SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e` **verified**.
- Method: member extracted privately outside Git; `word/document.xml`, `header*.xml`, `footer*.xml` and the relationships parsed with Python `lxml`; text-line view and anchor occurrence counts from `mammoth` 1.12.2 `extractRawText` (the importer's docx text path); no importer or compiler run, no PDF/render, and the images were **not viewed**. Locators are 0-based children of `w:body`.
- Hash methods: **child-text** = SHA-256 over UTF-8 of each child's concatenated `w:t` text, joined by `\n`; **table** = SHA-256 over rows joined by `\n`, each row's cells joined by `\t`; **mammoth** = SHA-256 over `extractRawText` lines joined by `\n`.

## Hash-accounted non-week text
| Block | Body children | Content | SHA-256 |
|---|---|---|---|
| PRE-T2-01 | 0 | `SECOND TERM E-LEARNING NOTE` title line | `c3a8dc39c250fd530499bc2d27d4d50ed829835a1e586e85165d2d16dad0edd9` |
| PRE-T2-02 | 1–3 | empty paragraph, `SUBJECT: FURTHER MATHEMATICS `, `CLASS: SS1` line | `6a7ecd725bbfa96fc0a0b1f556401e254ca36d8f7d403bb665c4499e5b1164e2` |
| PRE-T2-03 | 4 | `SCHEME OF WORK` heading | `8104f5ba0f84b6d0bd6c7197460d87d05b526578cebae1ae784ad29a8b48f15e` |
| PRE-T2-04 | 5 | scheme table, 13 rows (header + weeks 1–12), 2 cells per row | table `6b18d95fc63347bc091d1c093cc113dd2b08f60f5e7a256f8571335a53a82b7e` |
| PRE-T2-05 | 6–24 | 19 empty paragraphs | `6d0b4b5b2e80af440defa248dcbdd8b0d8abe38bd8b4cc10d5e60913195cd73f` |
| PRE-T2-06 | 25–28 | `REFERECES` heading and three textbook titles | `ebf260dc0ea8562f776f8a7413dbbcd2c172c59900b161ebb9e2073888b57a85` |
| PRE-T2-07 | 29–30 | 2 empty paragraphs | `01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b` |
| whole preamble | 0–30 | all text before `WEEK ONE` at child 31 | `d2a3512af3f09760a8c5cbeee8a4a5c83bcac2805804108906ee4c623a82d621` |
| mammoth view | — | raw-text lines 1–112 (preamble) | `415f4e0bf6ae6d6104dca88a2c2c9a441eb7747b93111d6fe8c141d898e2f693` |
| mammoth view | — | raw-text lines 101–107 (references) | `1141a68d7fb5df0c0f8bda95e350f156e779c39ce16917882ac0fc275dfb9576` |
| header/footer | — | header1 text (image only) / header2 line | empty / `201e07aa3fa5134bbf9e42e9df7c5148929c25dd9c1c5aa4509dd5397906974c` |
| header/footer | — | footer2 / footer4 lines | `ccf3d78a7830c40ca5498a9fea569e5340c17c0b966778b70ad971d2a2783e08` / `6b7574ed8abae3eba5ab1add968d7f1d967c7d5523f9b15edb7a6329fa1915bb` |

Mapping: PRE-T2-01 is the document title and carries no teaching; it is accounted to the source identity (body child 0, mammoth line 1). PRE-T2-02 maps to source `header_text`/`header_evidence` and `RULE-FM-T2-ALIAS`. PRE-T2-03 and PRE-T2-04 are the scheme; its topic rows 1–10 map to `COV-FM-T2-R00`..`COV-FM-T2-R09` (exact row locator added), and rows 11–12 map to `COV-FM-T2-EXAM` / `RULE-FM-T2-SCHEME-EXAM`. PRE-T2-05 and PRE-T2-07 are empty paragraphs with no content. PRE-T2-06 is now its own marker: `RULE-FM-T2-REFERENCES` (SCHEME_ONLY) and `COV-FM-T2-REFERENCES` (MARKER), because the existing exam marker covers scheme rows 11–12 only. Footnotes and endnotes contain only empty separator entries; there are no tracked changes, comments or text boxes in 0–30.

## Header verification: **matches**
`header_text` is `SUBJECT: FURTHER MATHEMATICS`. Body child 2 reads `SUBJECT: FURTHER MATHEMATICS ` (one trailing space) and equals the registered string once that space is trimmed; the registered string occurs exactly once in the extracted text, so the document, not only the filename, names Further Mathematics. The class is on the next line (body child 3, `CLASS: SS1`) and in the running footer, not inside `header_text`; the title line is `SECOND TERM E-LEARNING NOTE`. The earlier locator "line 2" was not a mammoth line number (the subject is mammoth raw-text line 5). `header_text` and `RULE-FM-T2-ALIAS` were left unchanged because the alias rule's observed heading must equal `header_text` exactly.

## Week-to-scheme-topic list
Verbatim from scheme table cells (row 0 is the `WEEK`/`TOPIC` header; parsed-row titles from SS1-03 `parsed_rows.json`, not recomputed):

| Wk | Scheme topic (verbatim) | Parsed row | Body children |
|---|---|---|---|
| 1 | Arithmetic Progression (AP) | 0 `WEEK ONE` SEQUENCE & SERIES | 31–280 |
| 2 | Geometric Progression (GP) | 1 `WEEK  TWO` SEQUENCE AND SERIES (II) | 281–478 |
| 3 | Linear inequalities in one variable | 2 `WEEK  THREE` LINEAR INEQUALITIES | 479–703 |
| 4 | Inequalities in two variables (Graph of inequalities) | 3 `WEEK  FOUR` LINEAR INEQUALITY (PART TWO) | 704–1062 |
| 5 | Introduction to the concept of functions. | 4 `WEEK  FIVE` MAPPING AND FUNCTIONS | 1063–1240 |
| 6 | Review of half term work. | 5 `WEEK  SIX` Revision of half term work | 1241–1244 |
| 7 | Functions (one – to – one, onto, composite and inverse functions) | 6 `WEEK  SEVEN` Composite Mapping and Inverse Mapping | 1245–1391 |
| 8 | Trigonometric ratio: Graph of Sine, Cosine and tangent of angles, deviation of trigonometric ratio of special angles (30°, 45° and 60°). Application of trigonometric ratios. | 7 `WEEK  EIGHT` TRIGONOMETRIC RATIO | 1392–1794 |
| 9 | Logical reasoning: Simple True and False statement, Negation, Converse and Contra positive of statement, | 8 `WEEK  NINE` LOGIC | 1795–2016 |
| 10 | Logical reasoning continues: Compound statement, connectives and their symbols, conditional statements and symbols. | 9 `WEEK  TEN` Logical reasing continues | 2017–2079 |
| 11 | Revision of Second Term’s lesson | scheme only (no body row) | — |
| 12 | Examination | scheme only (no body row) | — |

Source wording kept as printed: Week 8 says `deviation of trigonometric ratio` (presumably "derivation"); its degree signs are superscript zero digits, so plain-text extraction yields `300, 450 and 600` while the displayed text is 30°, 45° and 60°. Week 9 ends in a comma and Week 10 uses "continues"; the parsed row 9 title is spelled `Logical reasing continues`. These are recorded, not corrected; no lesson is authored here.

## Letterhead and vendor branding: listed for `FM-VIS-T2-BRANDING`
- **No picture occurs in body children 0–30.** The first body picture is in Week One (child 104). No separate full-page cover picture was found; OI-FM-004's "cover page" wording is not matched by a distinct cover image in this source.
- `word/header1.xml` holds one anchored picture: `docPr` name `Picture 1`, description `LOGO 2.jpg`, extent 3,933,825 × 933,450 EMU, embedding `word/media/image1.jpeg` (106,941 bytes, SHA-256 `edd416d4bec3d9f5c64d7907a1407ff3e04981018c613f0cf551e2a1e1078c14`). It is the default header of the first section, whose section break sits at body child 73.
- `word/header2.xml` is the default header of the final section and holds a `Name: … Class: …` worksheet line.
- `word/footer2.xml` reads `MR OSHO/2nd TERM/further mathematics/SS 1Page 2`; `word/footer4.xml` reads `GSS/2ndTERM/further mathematics/SS 1Page 39`; footer1 and footer3 are empty. Both non-empty footers carry a `PAGE \* MERGEFORMAT` field; the digits shown are cached field results, not separate text.
- Contact details are deliberately not reproduced; the image was not rendered or viewed here. Visual disposition remains `FM-VIS-T2-BRANDING`; reuse rights remain `OI-FM-004` / `FM-FACT-VENDOR-PERMISSION`.

## Edits
- `further-mathematics.json`: updated `SS1-SRC-43c5ab51b87f.header_evidence` with the re-read result; added the exact scheme-table row, body child and table hash to `COV-FM-T2-R00`..`COV-FM-T2-R09.objective_locator`; replaced `COV-FM-T2-EXAM`'s locator and evidence with exact rows 11–12 and split the reference list out; added `RULE-FM-T2-REFERENCES` (SCHEME_ONLY, anchor occurs once) and `COV-FM-T2-REFERENCES` (MARKER). No lesson, correction, asset or open item added or changed; all other entries are byte-identical except the listed locators.
- `QUEUE.json`: FM-PRE-T2 → IMPLEMENTED_TESTING_DEFERRED with the exact preamble locator and findings; `FM-VIS-T2-BRANDING.implementation_reference` now records the locations above (its status is unchanged); counts unchanged; `next_runnable` set to the first dependency-satisfied item in queue order (`FM-INV-T3`).
- Nothing was rendered, imported, compiled or tested.

## Remaining
- `FM-VIS-T2-BRANDING` still needs visual inspection of the header image and page 1; `FM-FACT-VENDOR-PERMISSION` still needs the owner's rights decision.
- The ten 2nd Term week items (`FM-WK-T2-W01`..`W10`) and `FM-FACT-EQUATION-LOSS-T2`, `FM-FACT-ALIAS-APPROVAL` and `FM-SCOPE-OI-FM-002` now have satisfied dependencies; 40 PENDING items are eligible.
- Same-file edits should run sequentially: next in queue order is `FM-INV-T3`.
