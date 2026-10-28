# FN-SRC-T3 — Food and Nutrition, 3rd Term source registration

Status: **IMPLEMENTED_TESTING_DEFERRED** (implemented; not approved, not verified). Testing deferred by owner.

## Inputs
- Starting SHA: `34639ef9a38476203f9885e31a024b586ddca29f` (origin/master). Prerequisite FN-SRC-T1 is implemented on master (FN-SRC-T2 also). No open PR or `fn-src-t3` branch touched this item (GitHub API check).
- Source `SS1-SRC-136db891415d`, manifest member `SSS 1/3rd Term SS1_/FOOD _ NUTRITION.docx`.
- Member SHA-256 `13f16ea0b3b0456275e9d0841d4725a01fa459da50b12c6e1cfb957dd9415dee` **verified**; equals the prompt, NEXT_TASK.md and `SOURCE_ASSIGNMENTS.csv` (29,286 bytes).
- Container supplied: a "3rd Term SS1" zip (SHA-256 `411c596e24f3ae755326a095478db1d47d52ed3ddb7eff7e95d666d4de2aa445`), member path `3rd Term SS1 /FOOD _ NUTRITION.docx`. The composite archive hash (`024487…c9a3e`) was **not** checked; no composite check is claimed.
- Method: member extracted unchanged with `unzip` and hashed; read with `mammoth.extractRawText({path})` in a scratch directory (no warnings). Nothing from the source is committed.

## Findings
- Opening non-empty paragraphs: `OMEGA TERM E – NOTE FOR SS1 FOODS AND NUTRITION` (en dash), `Scheme of work`, a weeks/topics list (revision/food hygiene and food laws; cooking and heat transfer; moist and dry heat methods; cereals; legumes).
- Header names Food and Nutrition (plural "FOODS"), not Catering Craft; no catering wording in the text and no SUBJECT line. No handoff needed. Filename and the `F _ N` vs `FOOD _ NUTRITION` variation were not used as evidence.
- The heading occurs once (offset 0), so the whole line is the unique header_text. It differs from the canonical name by more than case, so a `source_alias` is declared with `PENDING-OWNER`; no approval reference was invented. The document's term label "OMEGA TERM" is consistent with the 3rd Term folder.

## Edits
- `food-and-nutrition.json`: added `sources[2]`, rule `SS1-SRC-136db891415d-R001` and blocking open item `FOOD-AND-NUTRITION-ALIAS-APPROVAL-3RD-TERM`. Other entries unchanged; package stays PENDING.
- `QUEUE.json`: FN-SRC-T3 → IMPLEMENTED_TESTING_DEFERRED; counts and `next_runnable` recomputed.

## Remaining
- Owner alias approval. The source has no coverage until indexing (FN-INV-T3).
