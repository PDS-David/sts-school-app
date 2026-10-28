# DP-SRC-T2 — Data Processing, 2nd Term source registration

Status: **IMPLEMENTED_TESTING_DEFERRED** (implemented; not approved, not verified). Testing deferred by owner.

## Inputs
- Starting SHA: `967972e1aa8d6c59e42403bccc1323d6d2b7156c` (origin/master). Prerequisite DP-SRC-T1 is implemented on master; no `dp-src-t2` branch exists on origin. Open-PR listing via the GitHub API was not available in this session, so the absence of an open PR was checked by branch name only.
- Source `SS1-SRC-6880a598b05b`, manifest member `SSS 1/2nd Term SS1_/Data processing.docx`.
- Member SHA-256 `83221771b598f2ccfe1199bfc6f72c5ca9f09f6d899c0479cd128f59564500b4` **verified**; equals `SOURCE_ASSIGNMENTS.csv` (193,094 bytes).
- Container supplied: a "2nd Term SS1" zip (SHA-256 `94a32a4ec4af7d492d26feecdf06cedfedf846d3c65c27a5473a1693d0d33c0a`), member path `2nd Term SS1 /Data processing.docx`. The composite archive hash (`024487…c9a3e`) was **not** checked; no composite check is claimed.
- Method: member extracted unchanged with `unzip` and hashed; a separate working copy read with `mammoth.extractRawText({path})` (mammoth 1.12.2, scratch directory). Two non-blocking mammoth warnings (unrecognised `v:fill`, `office-word:anchorlock`). Nothing from the source is committed.

## Findings
- The first non-empty paragraph is `Data processing` (16 leading spaces, 2 trailing). Next is `WEEK 2<6 tabs>TOPIC: information processing`. The document has no SUBJECT, CLASS or term label and starts at Week 2.
- `Data processing` occurs once (case-insensitive, whitespace-tolerant search also gives one), so it is the unique header_text. It equals "Data Processing" apart from case, so the compiler needs no alias: no rule and no open item added. No Computer Studies or ICT wording appears; no mapping is made.
- Content seen in the opening and week labels (information processing, transmission, computer ethics, safety, operating systems) is consistent with Data Processing. The full week inventory belongs to DP-INV-T2 and is not recorded here. Weeks seen as labels: 2, 3-4, 5, 6, 7, 8, 9, 10 (not an inventory).

## Edits
- `data-processing.json`: added `sources[1]` only; rules, open items and all other arrays unchanged; package stays PENDING.
- `QUEUE.json`: DP-SRC-T2 → IMPLEMENTED_TESTING_DEFERRED; status counts and `next_runnable` recomputed.

## Remaining
- Source has no coverage until indexing (DP-INV-T2).
- The existing owner alias approval (DATA-PROCESSING-ALIAS-APPROVAL) concerns the 1st Term source only.
