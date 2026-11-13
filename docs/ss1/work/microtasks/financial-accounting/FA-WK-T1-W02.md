# FA-WK-T1-W02 — Financial Accounting, 1st Term Week Two indexing

Status: **IMPLEMENTED_TESTING_DEFERRED**. Source indexing and objective-level coverage only; not approved, not verified, and not a completed student lesson. No answer key is invented in this task.

## Inputs and hashes
- Source: `SS1-SRC-cf77df509ac3`, member `SSS 1/1st Term SS1_/1ST TERM S1 FINANCIAL ACCOUNT.docx`.
- Owner-supplied archive SHA-256: `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`.
- Member SHA-256: `c6d4a1b32ff8eb5377f8e7f1014cccfc4345a706bbeb333131a5d50afa6a3edb` (1,166,213 bytes; verified against the uploaded archive and registered source).
- Mammoth 1.12.2 inventory locator: lines 269–347; section/body SHA-256 `6bcefda712dc427ebb06d9a36e94486f9487f8829cad683a6b1cdf5f744cdab4`.
- Line numbers are 1-based over the existing Mammoth raw-text inventory. Original DOCX paragraph text was inspected in the supplied archive; no source file or full-document extract is committed.
- The task prompt's weekend locator ends at line 345, but the exact tenth source transaction (Jan 31) is at line 347; the complete indexed range is therefore 325–347 within the verified week range.

## Week Two section index

| Section | Lines | Indexed content |
|---|---:|---|
| WEEK TWO marker and topic | 269–271 | `WEEK TWO`; `TOPIC: TRANSACTIONS – MEANING AND CLASSIFICATION`. |
| CONTENT outline | 273–279 | Meaning of Transaction; Classification of Transactions. |
| Meaning of transaction | 281–287 | Heading and definition; recordable accounting transactions must be quantifiable in monetary terms. |
| Classifications of transactions | 289–295 | Cash and credit definitions, including immediate versus deferred payment. |
| Classification diagram | 299–307 | Introductory sentence and surviving labels “Transactions”, “Cash Transactions” and “Credit Transactions”; two drawn diagonal connectors are not preserved in text extraction. Disposition belongs to `FA-VIS-T1-W02-T03-DIAGRAMS`. |
| EVALUATION | 311–315 | Two written questions, no answer or marks printed. |
| READING ASSIGNMENT | 319–321 | External pointer to *Simplified and Amplified Financial Accounting*, pages 16–17; book not supplied. |
| WEEKEND ASSIGNMENT | 325–347 | Instruction and ten dated January transactions to classify as cash or credit; no answer key printed. |

## Objective-level coverage

Six coverage entries were added to `financial-accounting.json`. Every entry has `lesson_ids: []`; no source lesson identity is inferred.

1. **Transaction meaning and monetary quantifiability** — lines 281–287. PARTIAL: the source gives a definition and the monetary condition, but no worked distinction between financial and non-financial events.
2. **Cash and credit classification** — lines 289–295. PARTIAL: the source defines immediate payment and deferred payment and names cash, cheque, bank drafts and postal orders; the practice remains unkeyed.
3. **Classification diagram** — lines 299–307. UNRESOLVED: only the labels survive text extraction. The two diagonal connectors and their exact geometry are delegated to `FA-VIS-T1-W02-T03-DIAGRAMS`; no connector relationship is guessed here.
4. **Evaluation** — lines 311–315. UNRESOLVED: both questions are recorded below; no model answer or mark allocation is printed.
5. **Reading assignment** — lines 319–321. UNRESOLVED: the referenced book was not supplied. The existing `FA-FACT-T1-EXTERNAL-MATERIALS` task owns the no-claim boundary.
6. **Weekend assignment** — lines 325–347. UNRESOLVED: ten transactions are printed, but there is no answer key or marking scheme.

## Exact question and sub-item census

**EVALUATION (lines 311–315)**
- Line 313: “Differentiate between Cash Transactions and Credit Transactions.”
- Line 315: “Give three examples of business transactions that are not financial in nature.”

Neither question has a printed answer, sub-item, mark or marking scheme.

**READING ASSIGNMENT (lines 319–321)**
- Line 321: “Simplified and Amplified Financial Accounting Page 16 – 17”.
- The textbook was not supplied; no author, edition, publisher or page content is inferred.

**WEEKEND ASSIGNMENT (lines 325–347)**
- Line 327: “Identify whether the transactions below are cash transactions or credit transactions”.
- Line 329: “Jan 2: Started business with N10, 000 cash”.
- Line 331: “Jan 3: Paid N7, 000 of the business money into the bank”.
- Line 333: “Jan 7: Paid rent of shop by cash N600”.
- Line 335: “Jan 12: Bought goods for cash N1, 200”.
- Line 337: “Jan 14: Bought goods on credit from Ayodele N30, 000”.
- Line 339: “Jan 15: Sold goods and received cheque in payment N14, 000”.
- Line 341: “Jan 20: Bought Motor vehicle paying by cheque N9, 000”.
- Line 343: “Jan 25: Paid salary of shop assistants by cheque N1, 000”.
- Line 345: “Jan 28: Sold goods to Akinyemi N7, 000”.
- Line 347: “Jan 31: Bought furniture for cash N3, 000”.

The ten items are recorded exactly as source prompts; no cash/credit answer has been inserted in this index. In particular, the Jan 2 capital-introduction transaction is only a cash/credit classification prompt. It is not treated as coverage of capital injection or double-entry posting, which the source introduces in Weeks Four–Five.

## Follow-up task and open items
- Added `FA-LES-T1-W02-TRANSACTION-CLASSIFICATION` as a small bounded lesson task. It must teach transaction meaning and the financial/non-financial distinction, explain cash/credit classification, answer both evaluation questions and provide a reasoned key for all ten weekend transactions with marking criteria. It must not teach double entry ahead of Weeks Four–Five or claim the missing external textbook pages.
- Added blocking content item `FINANCIAL-ACCOUNTING-T1-W02-ASSESSMENT-NO-KEY`.
- Added blocking external-reading item `FINANCIAL-ACCOUNTING-T1-W02-READING-EXTERNAL`, linked to `FA-FACT-T1-EXTERNAL-MATERIALS`.
- The diagram remains assigned to `FA-VIS-T1-W02-T03-DIAGRAMS`; no asset or recreated diagram was added.

## Package and queue changes
- Added six coverage records: two PARTIAL and four UNRESOLVED.
- Added two precise open items and one follow-up lesson task.
- Updated `FA-WK-T1-W02` to `IMPLEMENTED_TESTING_DEFERRED`.
- Package remains `PENDING`; the Week Two work is not approved or verified.
- No source rule, lesson, correction, asset, answer key, source edit or database change was made.

## Authoring checks (not tests)
- Verified the uploaded archive and registered source member hashes.
- Checked exact source wording and line locators for both evaluation questions and all ten weekend transactions.
- Checked new coverage and task IDs for uniqueness and JSON syntax before commit.
- Not run: package test, TypeScript, importer/compiler, database, device or deployment checks. Testing remains deferred by owner.

## Exact next action
Implement `FA-LES-T1-W02-TRANSACTION-CLASSIFICATION` with a fully reasoned cash/credit key and marking scheme; keep external reading pages 16–17 unavailable until resolved by `FA-FACT-T1-EXTERNAL-MATERIALS`. Then continue Week Three indexing.
