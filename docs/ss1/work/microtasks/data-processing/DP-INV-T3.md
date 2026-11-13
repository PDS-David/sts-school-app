# DP-INV-T3 — Data Processing (3rd Term)

Status: IMPLEMENTED — TESTING DEFERRED BY OWNER. Source inventory only. No lesson, coverage entry, parsing rule, correction, asset, test, typecheck, importer run, database check, deployment or student-device check was performed.

## Input and identity

| Field | Value |
|---|---|
| Source | `SS1-SRC-6763fdc397c3` |
| Archive member | `SSS 1/3rd Term SS1_/3RD TERM S1 DATA PROCESSING.docx` |
| Member SHA-256 | `09e34afd68c595dc5da1e8d067d4f299f7114990aab0f71883488d2853167804` (matches `SOURCE_ASSIGNMENTS.csv`) |
| Member size | 1,493,833 bytes |
| Container | Supplied composite archive, SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e` (verified) |
| Header | Paragraph 3: `SUBJECT: DATA PROCESSING`; `CLASS: SS1` |
| Subject boundary | Retain canonical subject `Data Processing`; do not rename it Computer Studies or ICT. |

## Method and structure

- Extracted the exact member from the hash-verified ZIP without modifying original bytes.
- Inspected DOCX paragraphs and structure with `python-docx 1.2.0`; locators are 1-based Word body paragraph positions, including blank paragraphs.
- Week-block digests are SHA-256 of UTF-8 paragraph text from inclusive start/end positions joined by newline, including blank paragraphs and without a trailing newline. These are structural text digests, not Mammoth digests or original DOCX hashes.
- Document contains 588 body paragraphs, no Word tables, 10 inline images / `word/media` parts, no equations or hyperlinks. The 10 images are software-interface screenshots, not ten separate teaching tables.
- No macros or embedded programs were executed. No source rendering, app importer, database or device test was performed.

## Opening scheme (paragraphs 1–24)

- Paragraph 1: `THIRD TERM E-LEARNING NOTE`.
- Paragraph 3: `SUBJECT: DATA PROCESSING`, `CLASS: SS1`.
- Paragraph 5: `SCHEME OF WORK`; paragraph 7: `WEEK / TOPIC`.
- Scheme rows (paragraphs 8–19): Revision; Word Processing I; Word Processing II; Word Processing III; Spreadsheet I; Spreadsheet II; Spreadsheet III; Database Management I; Database Management II; Database Management III; Revision; Examination.
- Paragraphs 21–24 list three reference books. They are bibliographic pointers only; the referenced textbooks are not included in this archive.
- The scheme is paragraph-based, not a Word table. It maps to nine actual body weeks; the two revision rows and examination row do not have corresponding standalone teaching bodies.

## Teaching-body inventory

| Week | Body label | Paragraphs | SHA-256 | Content and assessment sections |
|---:|---|---:|---|---|
| 1 | `WEEK ONE` | 27–79 | `e5e5026b566151169e7c204f95a37791ee6f25d1ff67b020855b19f390d7fee8` | Word Processing I: definition (29), basic features (31–41), Microsoft Word heading (43), uses (49–55), evaluation (45–47), general evaluation (57–60), reading assignment (63–64), weekend assignment (66–73), theory (75–77). |
| 2 | `WEEK TWO` | 80–118 | `07340d83a61c12d922b5bb8bfdd996a334be2d600f16170361706e9b1ecda0a1` | Word Processing II: examples of word processors (82–86), text editors and differences (92–95), evaluation (88–90), general evaluation (97–101), reading assignment (103–104), weekend assignment (106–112), theory (114–116). |
| 3 | `WEEK THREE` | 119–163 | `63a942512c4db8611b49f20b6182b868e6c9a2fcae42744bd52daef0fc968728` | Word Processing III: creating a document (121–122), saving (124–130), saving formats (133–134), opening documents (136–140), general evaluation (142–146), reading assignment (148–149), weekend assignment (151–157), theory (159–161). |
| 4 | `WEEK FOUR` | 164–216 | `712b2472116302173792c1df0ae76cd8fb264f2d14d1d58736e6606b76aeeb50` | Spreadsheet I: definition (166), values/labels/formulas (171–175), evaluation (177–179), uses (183–193), general evaluation (195–199), reading assignment (201), weekend assignment (202–210), theory (212–214). |
| 5 | `WEEK FIVE` | 217–285 | `6b6ed6038d5ff54fd05fbbb427d25c3b0e04094267b8b2dca9416e2452b256ae` | Spreadsheet II: package examples (219–224), Excel (226–231), starting Excel (233–238), arithmetic operators/PEMDAS (244–254), formula examples (256–262), general evaluation (264–268), reading assignment (270–271), weekend assignment (273–279), theory (281–283). |
| 6 | `WEEK SIX` | 286–372 | `6a461834def301482588b5ffc9bd598b9665832d70d397de6ecf573a7b31a188` | Spreadsheet III: loading Excel (288–289), creating workbook/document (291–297), entering worksheet data (300–317), evaluation (319–321), editing (323–331), saving (333–340), retrieving (342–347), general evaluation (349–352), reading assignment (354–355), weekend assignment (357–366), theory (368–370). |
| 7 | `WEEKSEVEN` (source spelling; no space) | 373–430 | `a90e7a1042ed8587e585e367f2f2dff41f3a0ecbdb62014a7fa6cdfcb361a8f9` | Database Management I: database/DBMS definitions (375–377), DBMS functions (379–384), evaluation (386–388), package examples (390–396), terminology (398–403), general evaluation (405–409), reading assignment (411–412), weekend assignment (414–422), theory (425–428). |
| 8 | `WEEK EIGHT` | 431–518 | `031bfa22b01bc92b1ae777f72aa292726fbd4671570a1ed0517c3bee85ac4d8f` | Database Management II: DBMS/Access introduction (433–434), loading Access (436–442), creating database (447–450), creating table/file (453–459), records/fields (460–463), evaluation (465–467), field names/data types (469–473), unique identifier/primary key (475–478), database creation steps (480–495), general evaluation (498–500), reading assignment (503–504), weekend assignment (506–510), theory (513–516). |
| 9 | `WEEK NINE` | 519–588 | `0a6e6809bc8c0116c010f9d4a0a3e4f0e351962942481607129ff8a02711bf85` | Database Management III: inputting records (521–525), basic operations (526–531), searching (533–540), evaluation (541–543), sorting (545–558), modifying/editing records (560–567), general evaluation (569–572), reading assignment (574–575), weekend assignment (576–584), theory (586–588). |

## Embedded screenshot inventory

All ten image relations were mapped to their containing paragraph and inspected as screenshots. The document provides no useful descriptive alternative text for most images.

| Image | Paragraph | Dimensions | Visible subject / disposition requirement |
|---|---:|---:|---|
| `image1.png` | 42 | 1366×768 | Blank Microsoft Word window; Word Processing I. Confirm whether this adds instructional value beyond the text. |
| `image2.png` | 131 | 1366×768 | Word Save As dialog; saving procedure. Check legibility and version relevance. |
| `image3.png` | 168 | 539×357 | Spreadsheet worksheet grid and sheet tabs; spreadsheet introduction. |
| `image4.png` | 302 | 412×267 | Excel interface/worksheet; entering data. |
| `image5.png` | 444 | 1366×768 | Microsoft Access Getting Started screen. |
| `image6.png` | 446 | 1305×408 | Access Getting Started/template screen. |
| `image7.png` | 458 | 1366×768 | Access menu showing table-creation/design workflow. |
| `image8.png` | 461 | 1366×768 | Access Student Table datasheet with visible student-like names and ID values. **Do not reuse these records; replace with synthetic values or redact.** |
| `image9.png` | 472 | 1069×497 | Access field Data Type dropdown. |
| `image10.png` | 477 | 1366×768 | Access primary-key context menu. |

The ten screenshots are clustered as follows: Word processing (images 1–2), spreadsheets (images 3–4), Access/database management (images 5–10). They depict older Windows/Microsoft Office interface generations. Each needs an independent instructional-value, accuracy, accessibility, version and reuse-rights decision before learner-facing delivery. Inclusion in the source document does not establish permission to republish the screenshot.

## Source-quality, safety and factual flags

- The procedural steps use legacy Start / All Programs / Microsoft Office navigation and Office 2003/2007-era menu paths. Preserve them as historical source wording; do not teach them as universal current instructions. A later lesson needs a clearly version-labelled current workflow.
- The sample Access datasheet screenshot at paragraph 461 exposes student-like names and ID values. Treat as privacy-sensitive example data; do not copy it into the package, assets or generated teaching materials. Use synthetic records.
- Product/package claims (WordPerfect, MS Word/Office, Corel, OpenOffice, Lotus 1-2-3, Starview, Supercal, FileMaker, MySQL, Oracle, SQL Server and Access) need current status/version checks before presenting as current software recommendations.
- The formula `=AVERAGE(C4...C9)` at paragraph 262 appears to use an invalid range separator. Validate against the source context and a real spreadsheet engine before proposing a correction; retain the original string in source evidence.
- DBMS/Access terminology and procedures (tables, records, fields, data types, primary keys, searching, sorting and modifying) require accurate modern examples and safe synthetic data.
- No passwords, API keys or credentials were identified in the inspected text or screenshots. No executable content was run.

## Structural/parser findings (findings only; no rule written)

- The body has nine actual teaching markers. Eight are conventional spaced word labels; Week Seven is the literal source spelling `WEEKSEVEN` with no separating space.
- The scheme contains paragraph-based headings and must not be mistaken for teaching-week markers. Body begins at paragraph 27.
- The importer rule schema currently requires numeric `week_label` values for `split_before` and `attach_stranded_label`; these source headings are written as words. Do not invent numeric mappings or add unsupported rules. Record a versioned foundation requirement if the compiler cannot preserve the original labels.
- There are no Word tables, math equations or hyperlinks. The ten screenshots are the only embedded media group identified.

## Edits made

- This inventory record and its bounded follow-up tasks are the only intended changes for `DP-INV-T3`.
- No subject package content, lesson, coverage, parsing rule, correction, asset or approval state changed.
- Testing remains deferred; this is not approval, verification or student-readiness certification.
