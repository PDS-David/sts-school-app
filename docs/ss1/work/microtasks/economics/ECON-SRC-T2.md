# ECON-SRC-T2 — Economics, 2nd Term source registration

Status: **IMPLEMENTED_TESTING_DEFERRED** (implemented; not approved, not verified). Testing deferred by owner.

## Inputs
- Starting SHA: `4d5269fe09e008a0247303669e12172b0c9c0d4e` (origin/master). Prerequisite ECON-SRC-T1 is implemented on master; no open PR or branch for this item was found by branch name.
- Source `SS1-SRC-03d0cac39679`, manifest member `SSS 1/2nd Term SS1_/ECONOMICS.docx`.
- Member SHA-256 `7f353ce448daaeb3de68f9f40fc1deb0694e9a0c998d8ad5759eb0b87927020e` **verified**; equals `SOURCE_ASSIGNMENTS.csv` (88,680 bytes).
- Container supplied: a "2nd Term SS1" zip (SHA-256 `94a32a4ec4af7d492d26feecdf06cedfedf846d3c65c27a5473a1693d0d33c0a`), member path `2nd Term SS1 /ECONOMICS.docx`. The composite archive hash (`024487…c9a3e`) was **not** checked; no composite check is claimed.
- Method: member extracted unchanged with `unzip` and hashed; a separate working copy read with `mammoth.extractRawText({path})` (mammoth 1.12.2, scratch directory). Three non-blocking warnings (unrecognised `v:line`, `v:stroke`, `v:path`). Nothing from the source is committed.

## Findings
- The first non-empty paragraph is `SSS ONE ECONOMICS`, then `SCHEMES OF WORK`, then `WEEK 1: CAPITAL AS A FACTOR OF PRODUCTION`. Subject confirmed from the header as Economics; no handoff needed. No Commerce, Computer Studies or ICT mapping is made.
- The heading occurs once, so it is the unique header_text. It differs from "Economics" by the words "SSS ONE", so a `source_alias` rule is declared with `PENDING-OWNER` approval.
- Observed only (not an inventory): scheme weeks 1–12, with "WEEK 7" appearing twice in the scheme (Co-operation society; Public Enterprises) and a "WEEK: 11" scheme entry with no topic text on the same line. The full inventory belongs to ECON-INV-T2.

## Edits
- `economics.json`: added `sources[1]`, rule `SS1-SRC-03d0cac39679-R001` and blocking open item `ECONOMICS-ALIAS-APPROVAL-T2`; the 1st Term entries and other arrays are unchanged; package stays PENDING.
- `QUEUE.json`: ECON-SRC-T2 → IMPLEMENTED_TESTING_DEFERRED; status counts and `next_runnable` recomputed.

## Remaining
- Owner alias approval for this rule (and the 1st Term one). Source has no coverage until indexing (ECON-INV-T2).
