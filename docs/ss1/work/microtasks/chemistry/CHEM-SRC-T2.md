# CHEM-SRC-T2 — Chemistry, 2nd Term source registration

Status: **IMPLEMENTED_TESTING_DEFERRED** (implemented; not approved, not verified). Testing deferred by owner.

## Inputs
- Base: `origin/master` `09071425921562518066d04ef59697f6ce12b3d9`. CHEM-SRC-T1A and CHEM-SRC-T1B were already implemented on master. No open PR touched Chemistry (the only open PR was the Catering Craft CC-INV-T2 PR #144).
- Source `SS1-SRC-80b770d18aa8`, manifest member `SSS 1/2nd Term SS1_/CHEMISTRY.docx`.
- Container: the supplied "2nd Term SS1" zip (SHA-256 `94a32a4ec4af7d492d26feecdf06cedfedf846d3c65c27a5473a1693d0d33c0a`), member `2nd Term SS1 /CHEMISTRY.docx`. The composite archive hash (`024487…65c9a3e`) was **not** checked because the composite was not supplied.
- Member SHA-256 `236b1bdb2e752f652dd22e8f2df831279237e669ceeec356825cecc4ef8911e7` **verified** from the extracted bytes (1,973,278 bytes); equals `SOURCE_ASSIGNMENTS.csv`.
- Method: member extracted unchanged with `unzip` and hashed; a private working copy read with `mammoth` 1.12.2 `extractRawText({path})` (the importer's .docx call) in a scratch directory. Nothing from the source is committed.

## Findings
- Opening text: four empty paragraphs, then `  E-NOTE FOR CHEMISTRY  SS1` (two leading spaces), then `SCHEME OF WORK FOR SECOND TERM SS1 CHEMISTRY.` and a WEEKS/TOPICS list (mole concept, Avogadro's constant, empirical and molecular formulae, balancing equations, chemical laws, bonding, kinetic theory, gas laws, Gay-Lussac's law, air and flame), then `WEEK 1` onward.
- Subject confirmed from the document as Chemistry; no handoff needed. `E-NOTE FOR CHEMISTRY  SS1` occurs once (`CHEMISTRY` alone occurs twice), so it is the unique header_text, recorded without the paragraph's leading spaces. It differs from "Chemistry" by label and class text, so a `source_alias` is declared.
- No week inventory, duplication or relationship to the 1st Term files was decided here (CHEM-INV-T2 and CHEM-CMP-T1 own that). The document contains embedded images; not inventoried here.

## Edits
- `backend/src/db/ss1/subjects/chemistry.json`: added sources[2], `source_alias` rule `SS1-SRC-80b770d18aa8-R001` (approval_reference `PENDING-OWNER`; nothing invented) and open item `CHEMISTRY-ALIAS-APPROVAL-T2` (OWNER_ACTION, blocks delivery). Additions only; other sources, rules and items untouched. Package stays PENDING.
- `QUEUE.json`: CHEM-SRC-T2 -> IMPLEMENTED_TESTING_DEFERRED; counts and `next_runnable` recomputed.

## Remaining
- Owner alias approval. The source has no coverage until CHEM-INV-T2.
- Runnable items edit the same package file; run them one at a time.

Checks run: hashes, JSON syntax, reference consistency, diff inspection only. Testing deferred by owner.
