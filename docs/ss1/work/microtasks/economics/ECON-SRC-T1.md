# ECON-SRC-T1 — Economics, 1st Term source registration

Status: **IMPLEMENTED_TESTING_DEFERRED** (implemented; not approved, not verified). Testing deferred by owner.

## Inputs
- Starting SHA: `5348928b9f0eb66122c330b6f1a36527bb6667b6` (origin/master); no open PR or branch touched this item.
- Source `SS1-SRC-2ab0c50bcab6`, manifest member `SSS 1/1st Term SS1_/1ST TERM S1 ECONOMICS (1) (1).doc`.
- Member SHA-256 `8ad05c78b18edee3d6a011391d6ae057af457ab27f68a1ff05381d9c32e962bc` **verified**; equals `SOURCE_ASSIGNMENTS.csv` (1,264,128 bytes).
- Read from the "1st Term SS1" zip (SHA-256 `8055d852938afa44d20b03139af9958b0c9f7da6874419aa667174854895e636`, member path `1st Term SS1 /1ST TERM S1 ECONOMICS (1) (1).doc`). The same member bytes were also confirmed in the composite archive (SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`, verified).
- Method: member extracted unchanged with `unzip` and hashed; a separate working copy read with `word-extractor` 1.0.4 `extract(path).getBody()` (the importer's legacy .doc call), in a scratch directory. Nothing from the source is committed.

## Findings
- Opening text: `FIRST TERM E-LEARNING NOTE`, `SUBJECT: ECONOMICS … CLASS: SS1`, `SCHEME` and a topic list (meaning of economics through land and labour as factors of production, revision, examination).
- Subject confirmed from the header as Economics, not Commerce; no handoff needed. The "(1) (1)" filename suffix was not treated as evidence of duplication or subject.
- The subject line occurs once (`ECONOMICS` alone occurs 10 times), so it is the unique header_text (trailing whitespace excluded). It differs from "Economics", so a `source_alias` is declared. No week inventory recorded here.

## Edits
- Created `backend/src/db/ss1/subjects/economics.json` (PENDING; one source; alias rule with `PENDING-OWNER`; blocking open item `ECONOMICS-ALIAS-APPROVAL`; other arrays empty).
- `QUEUE.json`: ECON-SRC-T1 → IMPLEMENTED_TESTING_DEFERRED; status counts and `next_runnable` recomputed.

## Remaining
- Owner alias approval. Source has no coverage until indexing.
- Runnable items edit the same package file; run them one at a time.
