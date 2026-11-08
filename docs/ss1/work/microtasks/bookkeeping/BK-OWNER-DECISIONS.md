# Bookkeeping — consolidated owner and subject-expert decisions

Status: **Updated 8 November 2026. Second-term source disposition and first-term Week 1–4 delivery replacement approval are resolved. Final content approval and technical verification remain open.**

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

## First-term delivery replacement — owner approved 8 November 2026

The owner approved the recommendation: **use the project-authored Week 1–4 supplements as the teaching versions in delivery**, while retaining the original source documents unchanged for audit/history and retaining every original defect note.

Four exact delivery-correction links are now registered in `bookkeeping.json`, each binding the parsed original lesson identity and body SHA-256 to its project-authored replacement:
- Week 1 → `SUP-SS1-BOOKKEEPING-T1-W01-CASH-BOOK`
- Week 2 → `SUP-SS1-BOOKKEEPING-T1-W02-DOUBLE-CASH-BOOK`
- Week 3 → `SUP-SS1-BOOKKEEPING-T1-W03-CONTRA`
- Week 4 → `SUP-SS1-BOOKKEEPING-T1-W04-DOUBLE-ENTRY` (with the separate authored posting exercise retained as supporting practice).

All Week 1–4 source-defect and missing-content items are now nonblocking **for delivery only**, with the approval recorded against each item. The original source figures, wording and omissions have not been edited or silently corrected. In particular, no missing figure has been guessed and the source's N20 motor-van figure is not represented as resolved.

This approval does **not** constitute teacher/subject-expert content approval, technical verification, or a claim that the original source is correct. Authored lessons remain `content_approval=PENDING` and `verification=DEFERRED`; package status remains `PENDING`. The separate term-scope item `BOOKKEEPING-T1-SCHEME-VS-BODY` and source-heading alias reviews are not covered by this decision.

### Specific boundaries preserved in the replacement lessons

- **Week 1:** the printed single-column cash-book solutions contain wrong totals/figures and the bank example is incomplete. The replacement lesson uses an independent, balanced example; it does not guess the missing June 7 amount.
- **Week 2:** the source's nine April transactions have no solution and use the placeholder year `19x9`. The replacement lesson uses a fully stated independent example and now defers contra entries to the formal Week 3 lesson.
- **Week 3:** the source definition reverses the debit/credit treatment used by its own table, and its N710 transfer cannot be funded by the stated N300 cash balance. The replacement lesson teaches the standard two-direction contra treatment with new, internally consistent figures.
- **Week 4:** the source's N20 motor-van figure is not guessed, the personal withdrawal is not treated as a contra entry, and the source's unsolved twenty-transaction list is not falsely presented as solved. A separate, independently authored twenty-transaction exercise is fully worked and posted.

## External textbook assignment — handled under the owner's standing instruction

The Week 4 source cites an external textbook page that was not supplied. No passage has been copied. A complete original practice replacement is present in `BK-LES-T1-W04-POSTING.md`. This follows the owner's standing instruction to self-generate a suitable resource where an external resource is unavailable. No further textbook upload is required.

## Subject-heading aliases — owner-confirmed 8 November 2026

The owner confirmed the canonical subject identity is **Bookkeeping**, distinct from Financial Accounting. The three observed source headings are accepted as metadata aliases for the registered Bookkeeping sources:
- First term: “SUBJECT: BOOK-KEEPING” / “CLASS: SS 1”
- Second term: “SUBJECT: BOOK-KEEPING” / “CLASS: SS 1”
- Third term: “SS 1 OMEGA TERM BOOK- KEEPING”

The package records the owner confirmation on each `source_alias` rule and closes the corresponding alias open items. This is a subject-identity/metadata decision only; it is not teacher approval of lesson content or technical verification.

## Standing handling rule for analogous source defects

For similar cases elsewhere in this Bookkeeping implementation, preserve the original source and its defect evidence; author a clearly labelled project replacement or equivalent teaching resource; bind the exact original lesson identity to the replacement with a delivery-correction record; and mark the defect nonblocking only for delivery once the replacement actually covers it. Do not guess missing source figures, rewrite original documents, or claim the original was corrected. Keep teacher/content approval and technical verification as separate gates. If an issue cannot be genuinely resolved by the replacement, leave it blocking and ask for the required on-the-spot subject decision without holding up unrelated work.

## Content approval versus technical verification

All authored lessons remain `content_approval=PENDING` and `verification=DEFERRED`. Package status remains `PENDING`. The owner must review the teaching content and record approval or requested changes. Technical verification is separate and requires actual tests, typecheck, importer/compiler, database, device and delivery checks. No approval or verification is presumed.

## Remaining source dispositions

- The erroneous second-term source and its repeated week/marker tasks remain quarantined as forensic evidence; the old T2 week-indexing and marker tasks are superseded and must not be executed against the duplicate as valid curriculum.
- First-term source defects remain recorded unchanged. The four first-term defect-decision tasks are superseded for delivery by the owner-approved independent W01-W04 replacement lessons; no original source figure or wording has been corrected or guessed.
- The only unresolved first-term scope question is `BOOKKEEPING-T1-SCHEME-VS-BODY`: the source has four labelled week bodies and no Week 5-12 body despite twelve numbered scheme entries. The owner must confirm whether another assigned source contains Weeks 5-12 or whether the four-week body is the complete first-term source scope. Do not invent weeks or assume scope.
- No source correction, missing figure, external textbook content or expert decision is invented.

## Queue references

- Second-term source disposition: owner-confirmed; duplicate excluded under `RULE-BK-T2-EXCLUDE-DUPLICATE`.
- First-term source decisions: `BK-FACT-T1-W01-DEFECTS`, `BK-FACT-T1-W02-DEFECTS`, `BK-FACT-T1-W03-DEFECTS`, `BK-FACT-T1-W04-BRIEF`.
- Package content approval: `BK-FACT-CONTENT-APPROVAL`.
- Source-heading aliases: pending metadata owner review.


## Queue reconciliation — 8 November 2026

The four first-term factual-decision queue items (`BK-FACT-T1-W01-DEFECTS` through W04) are now `IMPLEMENTED_TESTING_DEFERRED`, because their original prerequisite decisions were superseded by the owner's approval to use the independently authored W01-W04 delivery replacements. This does not assert that every original-source defect was corrected. The queue now records 82 `IMPLEMENTED_TESTING_DEFERRED` items and 7 `BLOCKED` items. The remaining blocked items comprise the content-approval/verification gate and superseded second-term source-indexing/marker tasks retained as forensic history; there are no pending runnable items.


## First-term duration clarification — 8 November 2026

The owner clarified that every term was expected to contain at least ten teaching weeks, but cannot explain why the supplied first-term document contains only four week-labelled teaching bodies. The source's scheme preamble itself contains the ten-week topic sequence (entries 2–10) followed by revision and examination. A matching public SS1 **Book-Keeping** first-term scheme reproduces the same sequence; it is corroborative, not proof of the centre's missing pages. The original source is preserved unchanged and its provenance gap remains recorded.

To meet the owner's minimum delivery expectation, six **project-authored extensions** have been added to the package as first-term Weeks 5–10: double-column cash-book layout; double-column cash-book preparation and balancing; contra-entry practice; double-entry foundation; debit/credit account identification; and cash-book-to-ledger posting practice. These extend the surviving scheme objectives and do not claim to recover missing original notes. The term now has ten teaching lessons in the package. Content approval remains pending and technical verification remains deferred.


## Third-term minimum-week check — 8 November 2026

The third-term scheme contains Week 1 revision, nine teaching-topic slots in Weeks 2–10, Week 11 revision and Week 12 examination. The supplied source has no Week 1 revision body. A project-authored Week 1 revision lesson has therefore been added using first-term Bookkeeping foundations. The original Week 1 source marker remains `SCHEME_ONLY`; the supplement is not represented as recovered original content. The third-term twelve-week schedule is represented (Week 1 revision, Weeks 2–10 topic sequence, Week 11 revision and Week 12 examination); content approval remains pending and verification deferred.


## Term-duration correction — 8 November 2026

The owner's clarification is a **minimum**, not a fixed ten-week cap: every term must contain at least ten weeks, and schedules longer than ten weeks must be retained. The supplied first- and third-term schemes each enumerate twelve scheduled weeks (Week 1 revision; Weeks 2–10 topic teaching; Week 11 revision; Week 12 examination). The second-term reconstruction plan also explicitly assigns Weeks 1–10 to teaching, Week 11 to revision and Week 12 to examination. Therefore the intended Bookkeeping term schedule is twelve weeks in all three terms. Do not truncate any term at Week 10. Revision and examination are scheduled weeks and remain visible in the term sequence; they are not to be relabelled as ordinary topic lessons. The existing first-term W01–W10 lesson IDs are implementation identifiers, not permission to overwrite or omit the source's twelve-week scheme numbering. The first-term source/body alignment must remain explicitly documented as a provenance/mapping issue.


## Third-term lesson coverage completion — 8 November 2026

Four project-authored third-term lessons were added to complete the previously partial Week 2, 3, 4 and 6 scheme objectives: petty cash/imprest; trial-balance meaning and purpose; trial-balance extraction and preparation; and suspense-account correction. The existing Week 5 errors lesson was linked to its meaning/types/affect objectives. All third-term teaching objectives now have project-authored lesson coverage; the three revision/examination markers remain scheme-only.

These are independently authored delivery supplements, not recovered missing source pages. The original third-term DOCX, figures and defective worked answers remain unchanged. The petty-cash, Mr Odili trial-balance and Fashola suspense source arithmetic findings remain separately recorded in their correction notes.

The Bookkeeping regression test has been extended and wired into GitHub Actions in PR #390. Technical verification is pending the actual workflow result. All lessons remain content approval pending. The assistant's editorial review is not a substitute for the curriculum owner's or teacher's formal approval; no approval reference has been fabricated.
