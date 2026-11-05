# FR-LES-T1-W02-ANGLOPHONE — French, 1st Term Week 2 Anglophone supplement

Status: **IMPLEMENTED_TESTING_DEFERRED** (implemented; content approval PENDING, verification DEFERRED; not approved or verified). Testing deferred by owner.

## Inputs
- Starting SHA: `a188f910e909d0ee01b25c60b7926158b58d8533` (origin/master fetched 2026-11-05; unchanged from the SHA at which the task was PENDING). Prerequisite FR-WK-T1-W02 is IMPLEMENTED_TESTING_DEFERRED.
- Checked before editing: no `AGENTS.md` in the repository; 0 open PRs; no unmerged remote branch changes a French path (diffed against origin/master); the task was PENDING, so nothing was duplicated.
- Original document not opened. The task is a replacement for DEVOIR 1 (children 48-49) of source `SS1-SRC-945dfb24eaf6`, located by the existing OBJ-2 evidence in `french.json`; no source text was copied.
- All web sources read 2026-11-05.

## Changes
- `french.json`: new lesson `SUP-SS1-FRENCH-ANGLOPHONE-T1` (8 body paragraphs after the label line, 3 objectives, 5 practice items, 14 marks, 6 provenance entries); body SHA-256 `469a249b6596ffdd2b679b17db1551e730d8ff21a5bd05efe4d297facde94611`.
- Coverage `FRENCH-T1-W02-OBJ-2` → IMPLEMENTED_EQUIVALENT, lesson added after `SUP-SS1-FRENCH-COUNTRIES-T1`, evidence appended (earlier entries kept).
- `FRENCH-T1-W02-UNCOVERED-EXERCISES` narrowed to OBJ-3 (still blocking; `FR-LES-T1-W02-DEMONYMS` remains PENDING). New blocking FACT item `FRENCH-T1-W02-ANGLOPHONE-SOURCE-CHECKS`.
- `QUEUE.json`: item → IMPLEMENTED_TESTING_DEFERRED; `status_counts` recomputed (64 / 47 / 4); `next_runnable` untouched.
- Not touched: all original rows, sources, rules, corrections (including `SS1-02-french-COR-002`), OBJ-1/3/4/5, `FRENCH-T1-W02-HEADINGS-INTENT`, `FRENCH-BODY-002`, package status (PENDING).

## Claim-to-source map
| Claim | Statement in lesson | Source (provenance entry) |
|---|---|---|
| NA-1 | In the edition dated May 2018, Art. 3(1) names English as the official language (documentary example, not current law; Art. 3(3) removed from the lesson) | Konrad-Adenauer-Stiftung, The Constitution of the Republic of Namibia (Annotated Edition), 2nd ed. 2018 (reprint 2021), hosted by the Electoral Commission of Namibia (provenance entry replaces the UN Mission page) |
| KE-1 | Kenya Art. 7(1) national language Kiswahili; Art. 7(2) official languages Kiswahili and English | Kenya Law Reform Commission Art. 7 (read in full) |
| KE-2 | Kenya Art. 7(3): State protects language diversity | same |
| KE-3 | Constitution commenced 27 August 2010 | Kenya Law (search extract only) |
| ZA-1 | s. 6(1) lists English among several official languages | gov.za Constitution Chapter 1 (read in full) |
| ZA-2 | that page still shows the older eleven-language list | same |
| ZA-3 | Act 3 of 2023 s. 1(a) substitutes a list with South African Sign Language and English; assented 19 July 2023; GG 49041, 27 July 2023 | gov.za Gazette PDF (read in full) |
| ZA-4 | Act s. 2: operation on a date fixed by proclamation | same |
| ZA-5 | Act page: commencement "to be proclaimed" | gov.za Act page (read in full) |

## Handling of the source grouping
- The source's 15-country list is not reproduced or endorsed. Rows 52-66 stay covered as reference only by the COUNTRIES lesson; the status of countries outside the three taught is not asserted.
- Nigeria is not in the selection: no primary text was read for it here.
- Uganda was considered and left out: only non-government copies of its constitution were found.

## Checks (authoring checks, not tests)
- JSON parses; original rows byte-identical in parsed form (sources, rules, corrections, assets, 28 prior lessons); diff limited to the three allowed paths.
- No duplicate lesson, coverage, open-item or queue IDs; coverage, correction, open-item and `depends_on` references resolve; queue counts match items.
- Body hash recomputed; marks Q1 3, Q2 3, Q3 3, Q4 3, Q5 2 = 14, every marking list sums to its item.
- No typecheck, suite, importer, database or device run.

## Remaining
- `FRENCH-T1-W02-ANGLOPHONE-SOURCE-CHECKS`: **Namibia resolved for the dated educational example only.** Source: *The Constitution of the Republic of Namibia (Annotated Edition)*, second edition, 2018, reprint 2021, Konrad-Adenauer-Stiftung Namibia-Angola, hosted by the Electoral Commission of Namibia, https://www.ecn.na/wp-content/uploads/2024/11/Constitution-of-Namibia-English-2021.pdf; Chapter 1, Article 3(1), p. 23 per the table of contents; accessed 2026-11-05. Title pages read "Windhoek, May 2018" (edition date, distinct from the access date); the copyright page gives only "Second edition, 2018". The file read is the 2021 reprint. It is not a government-published consolidation. The lesson wording is « Dans l’édition de la Constitution namibienne datée de mai 2018, l’article 3(1) désigne l’anglais comme langue officielle. » (not "publiée en mai 2018", because the edition does not state a publication month.) Article 3(3) detail was removed.
- Namibia evidence limits: amending Acts 34 of 1998 (only Art. 134) and 8 of 2014 (GG 5589; no Art. 3) were read; Act 7 of 2010 was read only in part (sections 2-6); amendments after 2014 were not exhaustively checked and no claim about current law is made. Parliament's own PDFs and the UN Mission page could not be fetched.
- **Still OPEN:** South Africa (commencement of the 2023 amendment) and Kenya (dated Kenya Law consolidation).
- Stale outside this task's write paths: `QUEUE.json` still records the earlier body hash `8eca580f…`; it needs the new value.
- Owner content approval and verification.
- OBJ-3 (`FR-LES-T1-W02-DEMONYMS`) and the headings item are unchanged.
