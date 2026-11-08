# Bookkeeping — consolidated owner and subject-expert decisions

Status: **Updated 8 November 2026. Second-term source disposition is resolved. First-term source replacement approval and final content approval remain open.**

## Decisions already given by the owner

1. **The second-term file was not supposed to be identical to first term.** The owner confirmed that no other original second-term resource is currently available.
2. **Proceed without waiting for another original.** Build a project-authored reconstruction using Bookkeeping-specific references or original project-authored material. Do not represent it as the recovered original.
3. **Subject identity is Bookkeeping.** Financial Accounting is a different subject. Financial Accounting schemes and materials are not acceptable substitutes for this package; the earlier Financial Accounting references have been withdrawn.
4. **Do not let unavailable external resources halt implementation.** Use a close, subject-appropriate resource or create an original substitute. Do not reproduce unsupplied or unlicensed textbook material.

## Work completed under those decisions

- The registered second-term file is preserved unchanged as evidence and excluded from second-term teaching because its parsed teaching bodies duplicate first term.
- A provisional ten-week second-term Bookkeeping reconstruction plan is recorded in `BK-T2-RECONSTRUCTION-PLAN.md`.
- Ten project-authored second-term lessons W01-W10 are integrated into `bookkeeping.json`, each with separate reconstructed coverage. They cover books of original entry, general journal, sales/purchases day books, returns books, ledger classification, posting, discounts, three-column cash book and bank reconciliation.
- The second-term references used are explicitly Bookkeeping/Book Keeping SS1 sources. The plan records that they are comparative references with differing week orders, not the centre's missing original.
- First-term Week 1–4 supplements have been strengthened with full cash-book layouts, worked examples, contra treatment, double-entry and ledger posting.
- A complete independent twenty-transaction cash-book and ledger-posting exercise has been added for first-term Week 4. It does not claim to correct the source's missing answer.
- All original source documents and defective figures remain preserved; no source document has been edited.
- Static integrity checks recomputed the body hashes and practice mark totals for the 15 affected lessons and checked their coverage links. Automated tests, schema execution, typecheck, importer/compiler, database, device and delivery verification remain deferred and unrun.

## One consolidated first-term delivery decision requested

The original first-term Weeks 1–4 contain material defects and missing solutions. To avoid teaching defective examples, the package now has separately labelled, fully authored replacement teaching and practice. The original source remains unchanged and its defects remain documented.

**Recommended decision:** approve using the project-authored Week 1–4 supplements as the teaching versions in delivery, while retaining the original source documents for audit/history and retaining all defect notes. This does **not** mean the original figures have been corrected, does not approve any guessed replacement value, and does not mark the lessons technically verified.

This approval would allow the project to mark the corresponding source-defect items nonblocking for delivery and create explicit delivery-correction links from the original source lesson identities to the project-authored replacements. If not approved, keep those source items blocking and do not present the defective source bodies as corrected.

### Specific boundaries preserved in the replacement lessons

- **Week 1:** the printed single-column cash-book solutions contain wrong totals/figures and the bank example is incomplete. The replacement lesson uses an independent, balanced example; it does not guess the missing June 7 amount.
- **Week 2:** the source's nine April transactions have no solution and use the placeholder year `19x9`. The replacement lesson uses a fully stated independent example and now defers contra entries to the formal Week 3 lesson.
- **Week 3:** the source definition reverses the debit/credit treatment used by its own table, and its N710 transfer cannot be funded by the stated N300 cash balance. The replacement lesson teaches the standard two-direction contra treatment with new, internally consistent figures.
- **Week 4:** the source's N20 motor-van figure is not guessed, the personal withdrawal is not treated as a contra entry, and the source's unsolved twenty-transaction list is not falsely presented as solved. A separate, independently authored twenty-transaction exercise is fully worked and posted.

## External textbook assignment — handled under the owner's standing instruction

The Week 4 source cites an external textbook page that was not supplied. No passage has been copied. A complete original practice replacement is present in `BK-LES-T1-W04-POSTING.md`. This follows the owner's standing instruction to self-generate a suitable resource where an external resource is unavailable. No further textbook upload is required.

## Subject-heading aliases

The three source documents use variant headings:
- First term: “SUBJECT: BOOK-KEEPING” / “CLASS: SS 1”
- Second term: “SUBJECT: BOOK-KEEPING” / “CLASS: SS 1”
- Third term: “SS 1 OMEGA TERM BOOK- KEEPING”

The package keeps the observed headings and canonical subject name separately. Formal alias approval remains a metadata/owner review item; it must not be confused with teacher approval of lesson content.

## Content approval versus technical verification

All authored lessons remain `content_approval=PENDING` and `verification=DEFERRED`. Package status remains `PENDING`. The owner must review the teaching content and record approval or requested changes. Technical verification is separate and requires actual tests, typecheck, importer/compiler, database, device and delivery checks. No approval or verification is presumed.

## Remaining source dispositions

- The erroneous second-term source and its repeated week/marker tasks remain quarantined as forensic evidence; they are not outstanding requests for the owner to supply a file.
- First-term source defects remain recorded and blocking until the consolidated replacement-delivery decision above is made.
- No source correction, missing figure, external textbook content or expert decision is invented.

## Queue references

- Second-term source disposition: owner-confirmed; duplicate excluded under `RULE-BK-T2-EXCLUDE-DUPLICATE`.
- First-term source decisions: `BK-FACT-T1-W01-DEFECTS`, `BK-FACT-T1-W02-DEFECTS`, `BK-FACT-T1-W03-DEFECTS`, `BK-FACT-T1-W04-BRIEF`.
- Package content approval: `BK-FACT-CONTENT-APPROVAL`.
- Source-heading aliases: pending metadata owner review.
