# SS1 Bookkeeping — assessment resource review

**Date:** 10 November 2026  
**Merged to:** `master` via PR #439; assessment CI extended by merged PR #441  
**Scope:** Seven new project-authored revision/examination resources.

## Resource inventory

- First Term: Week 1 revision, Week 11 revision, Week 12 examination.
- Second Term: Week 11 revision, Week 12 examination.
- Third Term: Week 11 revision, Week 12 examination.
- Third Term Week 1 revision already exists as `SUP-SS1-BOOKKEEPING-T3-W01-REVISION`.

All seven new resources contain question papers/worksheets, answer keys and marking allocations. Each is explicitly labelled project-authored. None is presented as recovered original school material.

## Independent arithmetic spot-checks

| Resource | Calculation checked | Recomputed result |
|---|---|---:|
| T1 W01 revision | Cash: 18,000 + 12,000 − 5,000 − 10,000 | ₦15,000 |
| T1 W01 revision | Bank: 42,000 + 10,000 + 15,000 − 9,000 | ₦58,000 |
| T1 W11 revision | Cash: 20,000 + 14,000 − 6,000 − 8,000 | ₦20,000 |
| T1 W11 revision | Bank: 60,000 + 8,000 + 12,000 − 15,000 | ₦65,000 |
| T1 W12 exam | Cash: 25,000 + 18,000 − 7,000 − 12,000 + 5,000 | ₦29,000 |
| T1 W12 exam | Bank: 80,000 + 12,000 + 20,000 − 16,000 − 5,000 | ₦91,000 |
| T2 W11 revision | Invoice ₦80,000 less 10% trade discount; then 5% cash discount on ₦72,000 | ₦68,400 received |
| T2 W11 revision | Bank reconciliation: 35,000 + 8,000 − 5,000 | ₦38,000 |
| T2 W12 exam | Invoice ₦120,000 less 15%; then 2% cash discount on ₦102,000 | ₦99,960 paid |
| T2 W12 exam | Adjusted cash book 52,000 − 500; then +11,000 −7,000 | ₦55,500 statement |
| T3 W11 revision | Petty cash vouchers total: 4,000 + 1,500 + 2,500 + 3,000 | ₦11,000 |
| T3 W11 revision | COGS: 30,000 + (120,000 − 5,000) + 4,000 − 25,000 | ₦124,000 |
| T3 W11 revision | Gross profit: 180,000 − 124,000 | ₦56,000 |
| T3 W11 revision | Net profit: 55,000 − (18,000 + 8,000 + 3,000) + 2,000 | ₦28,000 |
| T3 W11 revision | Capital: (12,000 + 28,000 + 20,000 + 60,000 + 10,000) − (25,000 + 30,000) | ₦75,000 |
| T3 W12 exam | Petty cash expenditure and reimbursement | ₦8,500 |
| T3 W12 exam | Gross profit: (240,000 − 8,000) − (40,000 + 150,000 − 10,000 + 5,000 − 35,000) | ₦82,000 |
| T3 W12 exam | Net profit: 72,000 − (20,000 + 9,000 + 4,000 + 3,000) + 2,000 | ₦38,000 |
| T3 W12 exam | Capital: 145,000 − 50,000 | ₦95,000 |

The answer-key calculations shown above reconcile. Automated regression also checks that each paper's three section totals equal its declared maximum. This does not replace teacher moderation.

## Marking and presentation checks

- The papers state class, term, scheduled week, duration and maximum marks.
- Objective answer keys are included.
- Structured questions have point-based marking guidance.
- Worked numerical answers show formulas or intermediate totals.
- Questions distinguish trade discount from cash discount and distinguish cash-book entries from settlement of personal ledger accounts.
- Bank reconciliation questions state whether the starting balance is favourable and identify the direction of timing adjustments.
- All money amounts are expressed in naira.

## Automated verification completed

- PR #439 merged the assessment resources and assessment regression suite into `master`.
- PR #441 merged the assessment regression suite into the main `JSS3 implementation and asset checks` workflow.
- Main workflow run [42783833613](https://github.com/PDS-David/sts-school-app/actions/runs/42783833613) completed successfully on PR #441 head `b2ae64664910104c554c383ba2104e0c5c7f1453`.
- The workflow ran Bookkeeping package and assessment tests alongside backend/mobile TypeScript checks, static regressions and configured PostgreSQL/asset integration tests.

## Remaining release gates

1. **Teacher moderation:** a Bookkeeping teacher/curriculum reviewer must approve terminology, level, balance, exam fairness and answer-key presentation before classroom use.
2. **Original-source full parser/compiler:** stage the exact original composite archive (SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`). Verify all three registered DOC/DOCX member hashes and sizes, run Mammoth/WordExtractor extraction, apply source rules, parse lessons and review the generated plan. The archive is not present in the repository's `curriculum-assets` tree.
3. **Database integration/release:** the importer currently rejects `--ss1-reviewed --yes` by design. Keep that guard. Complete plan review, snapshot compatibility and authenticated retrieval tests against disposable PostgreSQL before designing an explicitly approved release path.
4. **Student-device and end-to-end delivery:** verify lesson listing, objectives, practice questions, answer/marking visibility, progress persistence and offline/low-bandwidth behaviour with synthetic student/teacher accounts on supported devices.
5. **Source provenance:** first-term source has four teaching-week bodies despite a twelve-week scheme; second-term source duplicates first-term teaching and remains excluded from reconstruction; third-term source has no Week 1 revision body. Authored replacements fill delivery slots but do not erase these facts.

No production database was modified and no original DOC/DOCX source was altered.
