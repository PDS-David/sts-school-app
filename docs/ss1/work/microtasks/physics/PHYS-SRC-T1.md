# PHYS-SRC-T1 — Physics, 1st Term source registration

Status: **IMPLEMENTED_TESTING_DEFERRED** (implemented; not approved, not verified). Testing deferred by owner.

## Inputs
- Starting SHA: `02e343025a48951652c30ab0d19b7f382dfad4f3` (origin/master); no open PR or branch touched this item and no Physics package existed.
- Source `SS1-SRC-5c0149cda71d`, manifest member `SSS 1/1st Term SS1_/1ST TERM S1 PHYSICS.doc`.
- Composite archive SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e` **verified** (supplied as `SSS_1-20260507T072431Z-3-001.zip`; the hash decides).
- Member SHA-256 `cb61f336ac93a3fbbb820d6c9b4adc0703e7363aff7659b7953a75bdb92f2206` **verified**; equals `SOURCE_ASSIGNMENTS.csv` (8,479,232 bytes).
- Method: member extracted unchanged with `unzip` and hashed; a separate working copy read with `word-extractor` 1.0.4 `extract(path).getBody()` (the importer's legacy .doc call), in a scratch directory. Nothing from the source is committed.

## Findings
- Opening text: `FIRST TERM E-LEARNING NOTE`, `SUBJECT: PHYSICS … CLASS: SS 1` (line 19), `SCHEME OF WORK`, an 11-week topic list (introduction to physics through viscosity, revision) and two reference books. Teaching starts at `WEEK ONE`.
- Subject confirmed from the header as Physics; no handoff needed. The class label is complete on the same line (`CLASS: SS 1`), so the PR #71 note about the class number being on the next line does not apply to this member.
- The subject line occurs once (`PHYSICS` alone occurs 4 times), so it is the unique header_text (trailing whitespace excluded). It differs from "Physics" by the labels, so a `source_alias` is declared. No week inventory recorded here.

## Edits
- Created `backend/src/db/ss1/subjects/physics.json` (PENDING; one source; alias rule with `PENDING-OWNER`; blocking open item `PHYSICS-ALIAS-APPROVAL`; other arrays empty).
- `QUEUE.json`: PHYS-SRC-T1 → IMPLEMENTED_TESTING_DEFERRED; status counts and `next_runnable` recomputed from satisfied dependencies.

## Remaining
- Owner alias approval (none invented). The source has no coverage until indexing.
- Runnable items edit the same package file; run them one at a time.

Checks run: hashes, JSON syntax, reference consistency, diff inspection only. Testing deferred by owner.
