# FA-WK-T1-W03 — Financial Accounting, 1st Term Week Three indexing

Status: **IMPLEMENTED_TESTING_DEFERRED**. This is source indexing and objective-level coverage only. It does not approve the source wording, recreate missing diagram geometry, supply answers or constitute a student-ready lesson.

## Source identity and hashes
- Source: `SS1-SRC-cf77df509ac3`, `SSS 1/1st Term SS1_/1ST TERM S1 FINANCIAL ACCOUNT.docx`.
- Owner-supplied archive SHA-256: `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`.
- Member SHA-256: `c6d4a1b32ff8eb5377f8e7f1014cccfc4345a706bbeb333131a5d50afa6a3edb`.
- Mammoth 1.12.2 inventory locator: lines 353–517; week-body SHA-256 `ceeb81718319d69d21106826a24d61b37019705f3c03069fd7620e14219c403e`.
- Line numbers are 1-based Mammoth raw-text locators from `FA-INV-T1.md`; the existing inventory digest is reused. The original DOCX section was inspected from the uploaded archive; no source file or full-document extract is committed.

## Week Three section index

| Section | Lines | Indexed content |
|---|---:|---|
| WEEK THREE marker and topic | 353–355 | `WEEK THREE`; `TOPIC: BOOKS OF ACCOUNTS`. |
| CONTENT outline | 357–363 | Ledger; Journal. |
| Books of accounts definition and two-book list | 367–371 | Definition and labels: Ledger — Principal book; Journal — Subsidiary book. |
| The Ledger | 375–381 | Principal book; classified permanent records; classified recording using ledger accounts. |
| Ledger account format | 385–415 | One-row eight-cell header: Date, Narration, Folio, Amount, Date, Narration, Folio, Amount; ruled ledger-account frame. |
| Debit/credit sides and double-entry statement | 417–423 | Two sides named Debit and Credit; entries described as debited/credited; ledger recording linked to double entry. |
| The Journal | 427–437 | Journal heading, subsidiary-book description and temporary records of credit transactions. |
| Journal format and associated statements | 431–465 | One-row five-cell header: Date, Narration, Folio, Details, Totals; ruled frame; source statement at 461 about double entry; cash/credit routing sentence at 463. |
| Path diagram | 467–481 | Cash Transactions and Credit Transactions labels at 471; Ledger and Journal labels at 481; three arrow connectors. Geometry belongs to `FA-VIS-T1-W02-T03-DIAGRAMS`. |
| EVALUATION | 485–489 | Two written questions, no answers or marks printed. |
| READING ASSIGNMENT | 493–495 | External pointer to *Simplified and Amplified Financial Accounting*, page 41; book not supplied. |
| WEEKEND ASSIGNMENT | 499–511 | Five multiple-choice questions, no key printed. |
| THEORY | 513–517 | Two short-answer questions, no model answers or marks printed. |

The two ruled formats are delegated to `FA-VIS-T1-W03-FORMATS`. The routing diagram is delegated to `FA-VIS-T1-W02-T03-DIAGRAMS`. No geometry is inferred from text labels alone.

## Objective-level coverage

Twelve coverage records were added to `financial-accounting.json`. Every record has an empty `lesson_ids` array; no original source lesson ID is invented.

1. **Books of accounts** — lines 367–371. PARTIAL: the source defines books of accounts and names the ledger and journal, but does not explain the full distinction or limits of this simplified two-book list.
2. **Ledger role** — lines 375–381. PARTIAL: principal-book and classified-record concepts are present; line 379 contains a wording defect assigned to `FA-PRES-T1-SOURCE-WORDING`.
3. **Ledger format** — lines 385–415. UNRESOLVED: field labels exist, but the ruled frame is visual content assigned to `FA-VIS-T1-W03-FORMATS`.
4. **Debit/credit and double entry** — lines 417–423. PARTIAL: debit/credit sides and the double-entry principle are named, but no worked ledger example is supplied.
5. **Journal role** — lines 427–437. PARTIAL: the journal is described as a subsidiary book and temporary record of credit transactions; accurate distinction and examples need student-facing teaching.
6. **Journal format** — lines 431–465. UNRESOLVED: five field labels are present, but the ruled frame is visual content assigned to `FA-VIS-T1-W03-FORMATS`.
7. **Journal/double-entry claim** — line 461. UNRESOLVED: the source says journal recording does not follow the double-entry principle. This is flagged, not repeated as fact or silently corrected; preservation task `FA-PRES-T1-SOURCE-WORDING` owns source wording.
8. **Cash/credit routing** — lines 463–481. UNRESOLVED: source sentence and diagram are indexed; the text's accuracy and diagram geometry are not approved by this task.
9. **Evaluation** — lines 485–489. UNRESOLVED: two questions have no answer key or marking criteria.
10. **Reading assignment** — lines 493–495. UNRESOLVED: the referenced page 41 was not supplied; `FA-FACT-T1-EXTERNAL-MATERIALS` owns the no-claim boundary.
11. **Weekend MCQs** — lines 499–511. UNRESOLVED: five questions have no answer key or marking criteria.
12. **Theory questions** — lines 513–517. UNRESOLVED: two short-answer questions have no model answers or marks.

## Exact question and sub-item census

**EVALUATION**
- Line 487: “Draw the format of a ledger account.”
- Line 489: “State three differences between the ledger and the journal.”

**READING ASSIGNMENT**
- Line 495: “Simplified and Amplified Financial Accounting Page 41”.
- The book was not supplied; no author, edition, publisher or page content is inferred.

**WEEKEND ASSIGNMENT — five MCQs**
- Line 501: “A book that contains the accounts for the financial transactions of an organisation is the” — A. journal; B. ledger; C. folio; D. register.
- Line 503: “The two fundamental books of accounts are” — A. Cash Book and Petty Cash Book; B. Receipt and Invoice; C. Journal and Ledger; D. Notes and Coins.
- Line 505: “Which of the following is the principal book of account?” — A. General Journal; B. Sales book; C. Purchases book; D. Ledger.
- Line 507: “Which of the following is not contained in the Ledger?” — A. date of transaction; B. description of the transaction; C. folio number of transaction; D. address of the customer.
- Line 509: “The process of entering transactions from one book to another is” — A. reading; B. posting; C. numbering; D. casting.

**THEORY**
- Line 515: “What is a Ledger?”
- Line 517: “State two differences between the ledger and the journal.”

No answer, mark or marking scheme is printed for any of these questions.

## Source wording preservation handoff

The following source wording is preserved exactly and must not be silently corrected in the source:
- Line 379: “The recording into the Ledger are done in classified form using ledger accounts.” (grammar defect)
- Line 461: “The recording of financial transactions into the Journal does not follow the double entry principle” (accounting claim requires explicit factually accurate treatment in original teaching; source wording remains preserved).
- Line 463: “Cash Transactions are recorded directly into the Ledger while Credit Transactions are first recorded into the Journal (i.e. the subsidiary books) before being posted in totals to the ledger.” (routing claim is indexed; no silent rewrite).

The preservation task `FA-PRES-T1-SOURCE-WORDING` owns these source defects. The follow-up lesson must explain the correct accounting treatment transparently rather than copying the inaccurate statement.

## Follow-up tasks and open items
- Added `FA-LES-T1-W03-LEDGER-JOURNAL-ANSWER-KEY` for original teaching, worked examples and full answers/marking for both evaluation questions, five MCQs and two theory questions.
- Added blocking item `FINANCIAL-ACCOUNTING-T1-W03-ASSESSMENT-NO-KEY`.
- Added blocking external-reading item `FINANCIAL-ACCOUNTING-T1-W03-READING-EXTERNAL`, linked to `FA-FACT-T1-EXTERNAL-MATERIALS`.
- Format boxes remain with `FA-VIS-T1-W03-FORMATS`; the path diagram remains with `FA-VIS-T1-W02-T03-DIAGRAMS`.
- Source wording defects remain with `FA-PRES-T1-SOURCE-WORDING`.

## Package and queue changes
- Added twelve objective-level coverage records: three PARTIAL and nine UNRESOLVED.
- Added two precise open items and one follow-up lesson task.
- Updated `FA-WK-T1-W03` to `IMPLEMENTED_TESTING_DEFERRED`.
- Package remains `PENDING`; Week Three is not approved or verified.
- No source rule, lesson, correction, asset, answer key, source edit or database change was made.

## Authoring checks (not tests)
- Verified owner-supplied archive and registered member hashes.
- Checked all listed question wordings and line locators against the original DOCX and the Mammoth inventory.
- Checked new coverage/task IDs for uniqueness and JSON syntax before commit.
- Not run: package tests, TypeScript, importer/compiler, database, device or deployment checks.

## Exact next action
Implement `FA-LES-T1-W03-LEDGER-JOURNAL-ANSWER-KEY` with accurate original teaching and full keyed answers; keep page 41 unavailable until resolved by `FA-FACT-T1-EXTERNAL-MATERIALS`. Complete the separate visual and preservation tasks, then continue Week Four–Five.
