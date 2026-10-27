# GOV-SRC-T1 — Government, 1st Term source registration

Status: **IMPLEMENTED_TESTING_DEFERRED** (implemented; not approved, not verified). Testing deferred by owner.

## Inputs
- Starting SHA: `5e312b099aa5bebc4e3bbdff7d915beb80c43f3b` (origin/master); no open PR or branch touched this item and no Government package existed.
- Source `SS1-SRC-40ce7dcaf672`, manifest member `SSS 1/1st Term SS1_/1ST TERM S1 GOVERNMENT.doc`.
- Composite archive SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e` **verified** (supplied as `SSS_1-20260507T072431Z-3-001.zip`; the hash decides).
- Member SHA-256 `50508a226b21bc5862b1f814d14a3d6bf2a56ff9d29867116931f5a7e58c9c1a` **verified**; equals `SOURCE_ASSIGNMENTS.csv` (1,163,776 bytes).
- Method: member extracted unchanged with `unzip` and hashed; a separate working copy read with `word-extractor` 1.0.4 `extract(path).getBody()` (the importer's legacy .doc call), in a scratch directory. Nothing from the source is committed.

## Findings
- Opening text: `FIRST TERM E-LEARNING NOTE`, `SUBJECT: GOVERNMENT … CLASS: SS1` (line 19), `SCHEME OF WORK` and an 11-item topic list (meaning and scope of government through unitary/federal government, revision/examination). Teaching starts at `WEEK ONE`, "The Meaning and Scope of the Subject Matter: Government".
- Subject confirmed from the header as Government. The file is not misfiled Geography: it shares a byte size with the 1st Term Geography member but has a different SHA-256 and different content. No handoff needed.
- The subject line occurs once (`GOVERNMENT` alone occurs 24 times), so it is the unique header_text (trailing whitespace excluded). It differs from "Government" by the labels, so a `source_alias` is declared. No week inventory recorded here.

## Edits
- Created `backend/src/db/ss1/subjects/government.json` (PENDING; one source; alias rule with `PENDING-OWNER`; blocking open item `GOVERNMENT-ALIAS-APPROVAL`; other arrays empty).
- `QUEUE.json`: GOV-SRC-T1 → IMPLEMENTED_TESTING_DEFERRED; status counts and `next_runnable` recomputed.

## Remaining
- Owner alias approval (none invented). The source has no coverage until indexing.
- GOV-SRC-T2, GOV-SRC-T3 and GOV-INV-T1 edit the same package file; run them one at a time.

Checks run: hashes, JSON syntax, reference consistency, diff inspection only. Testing deferred by owner.
