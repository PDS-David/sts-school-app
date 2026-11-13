# FA-PRE-T1 — Financial Accounting (1st Term preamble)

Status: IMPLEMENTED — TESTING DEFERRED. Preamble and scheme indexing only. No scheme row was imported as a lesson and no revision/examination rule was invented.

## Source identity

- Source ID: SS1-SRC-cf77df509ac3
- Member: SSS 1/1st Term SS1_/1ST TERM S1 FINANCIAL ACCOUNT.docx
- Member SHA-256: c6d4a1b32ff8eb5377f8e7f1014cccfc4345a706bbeb333131a5d50afa6a3edb
- Archive SHA-256: 024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e
- Original DOCX inspected directly. Paragraph locators are 1-based Word body paragraph positions. Existing Mammoth 1.12.2 line locators are retained from the task record; Mammoth was not rerun.

## Preamble structure

| Original DOCX paragraph | Mammoth line locator | Exact content / disposition |
|---:|---:|---|
| 15 | 33 | FIRST TERM E-LEARNING NOTE — title, not a lesson |
| 17 | 37 | SUBJECT: FINANCIAL ACCOUNTING ... CLASS: SS1 — registered subject/class header |
| 19 | 41 | SCHEME OF WORK — scheme heading |
| 21 | 43 | WEEK/TOPIC header; literal source text includes a trailing space after TOPIC |
| 22–29 | 45–61 | Seven scheme rows, all outline markers rather than teaching content |

## Seven scheme rows — source wording preserved

1. Introduction to Book-Keeping and Accounting — first row has no literal number.
2. 2 Transactions – Meaning and Classifications.
3. 3 Books of Accounts – Layout and Formats.
4. 4 - 5 Double Entry Principle: Posting of Transactions to Ledger Accounts; followed by paragraph 26: Combinations of Cash and Bank Account.
5. 6 – 7 Balancing of Ledger Accounts; extraction of the Trial Balance.
6. 8 Source Documents: Purpose Characteristics and Functions.
7. 9 -10 Subsidiary Books: Purpose, Characteristics, Functions and Preparations.

The row separators are mixed and are not normalized: 4 - 5 uses a hyphen, 6 – 7 and 9 -10 retain their source forms. The first row has no explicit number. The WEEK/TOPIC header retains its trailing space.

## Body boundary and rule decision

- The first actual teaching marker is original DOCX paragraph 31: WEEK ONE.
- The seven scheme rows appear before the first body week marker and none contains a body marker. The existing week split therefore already keeps them outside teaching bodies.
- No additional classify_marker or preamble rule is needed. Adding one would be redundant.
- The title and scheme anchors occur once each in the original document.
- The source has one empty 1×1 cover table and two publisher JPEGs. Their rights/accessibility/visual disposition belongs to the separate FA-VIS-T1-PUBLISHER-MEDIA task.
- Other content tables (ledger layout and trial balance) are body teaching examples and remain outside this preamble record.

## Revision and examination check

- No REVISION occurrence appears in the document text.
- EXAMINATION occurs twice, but only in ordinary instructional prose (Mammoth line locators 723 and 961; original DOCX paragraphs 347 and 466). Neither occurrence is a revision/examination section or scheme row.
- No classify_marker rule for revision or examination is required.

## Schema/package change

- Added COV-FA-T1-PREAMBLE-SCHEME with status MARKER, no lesson ID and evidence pointing to the title/header/seven-row scheme and first body marker.
- No source_rules change was required.
- No lesson, answer, approval, correction, asset or verification state was invented.
- Package status remains PENDING; test suite remains authored but not run.
