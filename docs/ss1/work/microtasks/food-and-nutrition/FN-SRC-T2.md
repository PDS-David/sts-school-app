# FN-SRC-T2 — Food and Nutrition, 2nd Term source registration

Status: **IMPLEMENTED_TESTING_DEFERRED** (implemented; not approved, not verified). Testing deferred by owner.

## Inputs
- Starting SHA: `510f53ec67030e5349f02f7b7af0c50ac7a82a66` (origin/master). Prerequisite FN-SRC-T1 is implemented on master; no `fn-src-t2` branch exists on origin (open PRs were checked by branch name only).
- Source `SS1-SRC-0579303326ae`, manifest member `SSS 1/2nd Term SS1_/F _ N.docx`.
- Member SHA-256 `ba05f9778cb70c628fc4743e549191d3270b91cd95f1883419ad050d64e93a20` **verified**; equals `SOURCE_ASSIGNMENTS.csv` (34,932 bytes).
- Container supplied: a "2nd Term SS1" zip (SHA-256 `94a32a4ec4af7d492d26feecdf06cedfedf846d3c65c27a5473a1693d0d33c0a`), member path `2nd Term SS1 /F _ N.docx`. The composite archive hash (`024487…c9a3e`) was **not** checked; no composite check is claimed.
- Method: member extracted unchanged with `unzip` and hashed; a separate working copy read with `mammoth.extractRawText({path})` (mammoth 1.12.2, scratch directory). Nothing from the source is committed.

## Findings
- Opening non-empty paragraphs: `SIGMA TERM (2nd)`, `FOOD AND NUTRITION`, `SSS 1`, `SCHEME OF WORK FOR SIGMA TERM`, then the scheme list (revision of the scientific study of foods, measurement, effects of heat, food tests, composition table, meal planning, reproductive health, malnutrition).
- Subject confirmed from the header as Food and Nutrition, not Catering Craft; no handoff. The heading occurs once (offset 18) and equals the canonical name apart from case, so no alias rule or open item was added. The filename `F _ N` was not used as evidence.
- Unlike the 1st Term source (generic "ALPHA TERM" heading, alias pending owner), this document names the subject. Its term label "SIGMA TERM (2nd)" matches the manifest folder. Week labels seen (not an inventory): WEEK 1–10 and "Week 12 & 13: revision & exams".

## Edits
- `food-and-nutrition.json`: added `sources[1]` only; the 1st Term source, rule and open item are unchanged; package stays PENDING.
- `QUEUE.json`: FN-SRC-T2 → IMPLEMENTED_TESTING_DEFERRED; counts and `next_runnable` recomputed.

## Remaining
- Source has no coverage until indexing (FN-INV-T2). The pending alias approval concerns the 1st Term source only.
