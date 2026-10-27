# SS1 next assignments

Reviewed master: d01704cd15aa69241a8775c5e072fd2297b1d71b (2026-10-27). All 21 manifest subjects now have queues. Geography's missing queue was added, and English's attachment fields and next-item metadata repaired. This is queue readiness, not curriculum completion.

The 603 queue items were checked for unique IDs within each queue, existing dependency IDs, cycles and count consistency. Source attachment references were compared with the manifest. No curriculum tests, typechecks, importer, database or device checks were run.

PR71 can close without merging: immutable head b5ced7ebb0efe22df2351baa140266fbf40cbf41 and its branch are retained; its useful content has explicit port tasks in the Physics/Mathematics/Further Mathematics queues. Those ports are not complete.

## Use

Attach **SSS 1-20260507T072431Z-3-001 (1).zip** to every worker below. SHA-256: 024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e. Filename variants are acceptable with identical hash. Do not commit originals.

Open one subject's prompt below and execute only that item. Different subjects may run concurrently; same-subject tasks must wait for the preceding PR to merge. No worker edits this shared assignment file. Refresh master before starting; completed items must not be repeated.

| Subject | Item | Prompt |
|---|---|---|
| Agricultural Science | `AG-SRC-T1` | [Run this task](agricultural-science/NEXT_TASK.md) |
| Biology | `BIO-SRC-T1` | [Run this task](biology/NEXT_TASK.md) |
| Bookkeeping | `BK-SRC-T1` | [Run this task](bookkeeping/NEXT_TASK.md) |
| Catering Craft | `CC-SRC-T2` | [Run this task](catering-craft/NEXT_TASK.md) |
| Chemistry | `CHEM-SRC-T1A` | [Run this task](chemistry/NEXT_TASK.md) |
| Civic Education | `CIV-SRC-T1` | [Run this task](civic-education/NEXT_TASK.md) |
| Commerce | `COM-SRC-T1` | [Run this task](commerce/NEXT_TASK.md) |
| Data Processing | `DP-SRC-T1` | [Run this task](data-processing/NEXT_TASK.md) |
| Economics | `ECON-SRC-T1` | [Run this task](economics/NEXT_TASK.md) |
| English Language | `ENG-WK-T1-W02` | [Run this task](english/NEXT_TASK.md) |
| Financial Accounting | `FA-SRC-T1` | [Run this task](financial-accounting/NEXT_TASK.md) |
| Food and Nutrition | `FN-SRC-T1` | [Run this task](food-and-nutrition/NEXT_TASK.md) |
| French | `FR-WK-T1-W01` | [Run this task](french/NEXT_TASK.md) |
| Further Mathematics | `FM-PRE-T1` | [Run this task](further-mathematics/NEXT_TASK.md) |
| Geography | `GEO-SRC-T1` | [Run this task](geography/NEXT_TASK.md) |
| Government | `GOV-SRC-T1` | [Run this task](government/NEXT_TASK.md) |
| Literature | `LIT-SRC-T1` | [Run this task](literature/NEXT_TASK.md) |
| Mathematics | `MATH-FACT-HEADER-T1` | [Run this task](mathematics/NEXT_TASK.md) |
| Physics | `PHYS-SRC-T1` | [Run this task](physics/NEXT_TASK.md) |
| Technical Drawing | `TD-SRC-T2` | [Run this task](technical-drawing/NEXT_TASK.md) |
| Yoruba | `YO-SRC-T1` | [Run this task](yoruba/NEXT_TASK.md) |

## Following round

After these PRs are reviewed and merged, choose one next dependency-satisfied, unclaimed implementation item per subject. Missing sources require registration; unknown weeks require inventory; known weeks require objective indexing; a demonstrated uncovered objective permits lesson authoring. Do not automatically pick the first PENDING item or start tests. Refresh these per-subject task prompts from the then-current queues. Each subsequent worker still implements exactly one item.
