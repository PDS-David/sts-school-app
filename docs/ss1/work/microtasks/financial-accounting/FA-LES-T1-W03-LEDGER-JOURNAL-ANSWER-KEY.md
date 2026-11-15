# FA-LES-T1-W03-LEDGER-JOURNAL-ANSWER-KEY — original Week Three supplement

Status: **IMPLEMENTED_TESTING_DEFERRED**. Content approval remains **PENDING** and verification remains **DEFERRED**. The source document is not edited and the unavailable textbook page 41 is not reproduced.

## Source evidence
- Source: `SS1-SRC-cf77df509ac3`, `SSS 1/1st Term SS1_/1ST TERM S1 FINANCIAL ACCOUNT.docx`.
- Owner-supplied archive SHA-256: `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`.
- Member SHA-256: `c6d4a1b32ff8eb5377f8e7f1014cccfc4345a706bbeb333131a5d50afa6a3edb`.
- Week Three source lines: 353–517; section SHA-256 `ceeb81718319d69d21106826a24d61b37019705f3c03069fd7620e14219c403e`.
- Lesson ID: `SUP-SS1-FINANCIAL-ACCOUNTING-T1-W03-LEDGER-JOURNAL`.
- Lesson body SHA-256: `227666f08e99f746064688224f256710cff0ff06cfcfd8e72e0e19d2f2f9bb1f` (9,222 characters).

## Implementation
- Teaches books of accounts, the ledger as principal book, the journal as book of original entry, ledger account sides/fields, debit and credit, double entry and posting.
- Explicitly corrects the source's misleading line 461 in separate original teaching: journal entries do follow the double-entry principle. The source wording itself remains unchanged and is tracked by `FA-PRES-T1-SOURCE-WORDING`.
- Explains the source's cash/credit routing sentence as a simplified model; complete accounting systems record transactions in suitable journals/special journals and post to ledger accounts.
- Answers both source evaluation questions (ledger format; three differences between ledger and journal), all five MCQs and both theory questions.
- The ledger-format answer explains the two sides and four fields, but the ruled drawing remains with `FA-VIS-T1-W03-FORMATS`; no replacement visual is created here.
- Does not reproduce page 41 of *Simplified and Amplified Financial Accounting*.
- Six original practice questions have complete answers and criterion-level marking, totalling 21 marks.
- Linked nine coverage entries as `IMPLEMENTED_EQUIVALENT`; ledger and journal format entries remain PARTIAL pending the visual asset; reading page 41 remains UNRESOLVED.
- The assessment open item remains blocking until owner/teacher review is actually recorded; external reading remains a separate blocker.
- Lesson state: content approval PENDING; implementation IMPLEMENTED; verification DEFERRED.

## Technical provenance
1. OpenStax, *Principles of Accounting, Volume 1: Financial Accounting*, Section 3.3, journal and ledger steps in the accounting cycle: https://openstax.org/books/principles-financial-accounting/pages/3-3-define-and-describe-the-initial-steps-in-the-accounting-cycle
2. OpenStax, *Principles of Accounting, Volume 1: Financial Accounting*, Section 3.5, journal entries, equal debits/credits and posting to T-accounts: https://openstax.org/books/principles-financial-accounting/pages/3-5-use-journal-entries-to-record-transactions-and-post-to-t-accounts
3. OpenStax, *Principles of Accounting, Volume 1: Financial Accounting*, Section 7.2, special journals and posting totals to the general ledger: https://openstax.org/books/principles-financial-accounting/pages/7-2-describe-and-explain-the-purpose-of-special-journals-and-their-importance-to-stakeholders
4. Institute of Chartered Accountants of Nigeria, *Financial Accounting Study Text* (2021), Section 2.2, rules of debits and credits, page 80: https://icanig.org/students/pro-study-texts-2021/FA.pdf

OpenStax is CC BY-NC-SA 4.0; only factual concepts are paraphrased and attributed. ICAN retains copyright; no ICAN text, table or example wording is reproduced. All lesson prose, examples and questions are original.

## Authoring checks (not tests)
- Package and queue JSON parsed before commit.
- Six practice-question mark totals checked against their criteria (21 marks).
- Coverage links, provenance fields and approval/verification states checked.
- The five MCQ answer choices and both theory prompts were checked against the source wording.
- Not run: package tests, TypeScript, importer/compiler, database, device or deployment checks. Testing remains deferred by owner.

## Exact next action
Run Financial Accounting package validation and the registered-subject compiler workflow; fix actual errors without weakening checks. Complete `FA-VIS-T1-W03-FORMATS`, `FA-PRES-T1-SOURCE-WORDING` and the external-reading resolution before marking Week Three student-ready. Then continue Week Four–Five.
