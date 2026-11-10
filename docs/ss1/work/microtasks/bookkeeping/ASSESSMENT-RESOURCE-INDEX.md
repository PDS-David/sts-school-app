# SS1 Bookkeeping — revision and examination resource index

This index lists project-authored resources added to complete the scheduled revision/examination slots. They supplement the subject package; they are not recovered original DOCX pages. For the complete week-by-week lesson order and objectives, see [BOOKKEEPING-TEACHER-DELIVERY-GUIDE.md](./BOOKKEEPING-TEACHER-DELIVERY-GUIDE.md).

| Term | Scheme week | Resource | Assessment scope |
|---|---:|---|---|
| First | 1 | [Week 1 revision](ASSESSMENT-T1-W01-REVISION.md) | Cash book, contra, double entry, ledger |
| First | 11 | [Week 11 revision](ASSESSMENT-T1-W11-REVISION.md) | Cumulative first-term content |
| First | 12 | [Week 12 examination](ASSESSMENT-T1-W12-EXAM.md) | First-term assessed outcomes |
| Second | 11 | [Week 11 revision](ASSESSMENT-T2-W11-REVISION.md) | Reconstructed second-term content |
| Second | 12 | [Week 12 examination](ASSESSMENT-T2-W12-EXAM.md) | Reconstructed second-term outcomes |
| Third | 1 | Existing package lesson: `SUP-SS1-BOOKKEEPING-T3-W01-REVISION` | Retrieval revision of Bookkeeping foundations |
| Third | 11 | [Week 11 revision](ASSESSMENT-T3-W11-REVISION.md) | Cumulative third-term content |
| Third | 12 | [Week 12 examination](ASSESSMENT-T3-W12-EXAM.md) | Third-term assessed outcomes |

## Use and provenance

- The second-term papers assess the project-authored Bookkeeping reconstruction in `BK-T2-RECONSTRUCTION-PLAN.md`. The supplied second-term DOCX is preserved as evidence of the duplicate-source problem and is not treated as a valid second-term teaching source.
- The first-term revision/examination papers assess the delivered first-term sequence, including approved project-authored replacement lessons and Weeks 5–10 extensions. The original source's missing pages remain a provenance issue.
- The third-term Week 11 revision and Week 12 examination papers fill scheme slots for which the original source supplied markers but no actual worksheet or exam paper.
- Each assessment contains its own answer key and marking allocations. Monetary calculations use naira and are independently checked in the companion review note.
- These documents do not change `bookkeeping.json` lesson bodies, source hashes, source rules or coverage statuses.

## Remaining acceptance boundary

Package-level tests and lesson-state verification are recorded in `bookkeeping.json`. The assessment regression suite is merged into the main CI workflow. PR #444 added package-baseline and paper section-total checks; dedicated Bookkeeping run 42785278714 and main workflow run 42785279054 both passed. The suite checks resource presence, provenance, answer keys, section totals, package lesson/coverage counts and arithmetic review values. Teacher moderation, original-source full parser/compiler execution, safe importer/database release, and student-device/end-to-end delivery acceptance remain separate gates. See `ASSESSMENT-RESOURCE-REVIEW.md` for evidence and prerequisites.
