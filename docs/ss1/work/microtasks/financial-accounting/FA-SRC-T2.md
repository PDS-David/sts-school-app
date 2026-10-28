# FA-SRC-T2 — Financial Accounting, 2nd Term source registration

Status: **IMPLEMENTED_TESTING_DEFERRED** (implemented; not approved, not verified). Testing deferred by owner.

## Inputs
- Starting SHA: `510f53ec67030e5349f02f7b7af0c50ac7a82a66` (origin/master). Prerequisite FA-SRC-T1 is implemented on master; no `fa-src-t2` branch exists on origin (open PRs were checked by branch name only).
- Source `SS1-SRC-167817613690`, manifest member `SSS 1/2nd Term SS1_/Account.docx`.
- Member SHA-256 `422b187f2d81a3f692a4b2e8fcb51932bd6d8e19a3627f59843ad8fd91106f6f` **verified**; equals `SOURCE_ASSIGNMENTS.csv` (144,645 bytes).
- Container supplied: a "2nd Term SS1" zip (SHA-256 `94a32a4ec4af7d492d26feecdf06cedfedf846d3c65c27a5473a1693d0d33c0a`), member path `2nd Term SS1 /Account.docx`. The composite archive hash (`024487…c9a3e`) was **not** checked; no composite check is claimed.
- Method: member extracted unchanged with `unzip` and hashed; a separate working copy read with `mammoth.extractRawText({path})` (mammoth 1.12.2, scratch directory). One non-blocking warning (unrecognised `oMath`). Nothing from the source is committed.

## Findings
- Opening non-empty paragraphs: `SS1`, `FINANCIAL ACCOUNTING`, `SIGMA – TERM`, `SCHEME OF WORK`, then `Revision of 1st term’s work` and partnership accounts. There is no SUBJECT label and no Bookkeeping wording. The filename `Account.docx` was not used as evidence.
- Subject confirmed from the header as Financial Accounting; no handoff. The heading occurs once and equals the canonical name apart from case, so no alias rule or open item was added.
- Observation: the term label reads "SIGMA – TERM", not "2nd Term"; the 2nd Term assignment rests on the manifest folder. Not changed. Body week labels seen (not an inventory): ONE, TWO - THREE, FOUR, FIVE – SIX, SEVEN – TEN.

## Edits
- `financial-accounting.json`: added `sources[1]` only; the 1st Term source, rule and open item are unchanged; package stays PENDING.
- `QUEUE.json`: FA-SRC-T2 → IMPLEMENTED_TESTING_DEFERRED; counts and `next_runnable` recomputed.

## Remaining
- Source has no coverage until indexing (FA-INV-T2). Owner alias approval still concerns the 1st Term source only.
