# English completion: RESUME checkpoint

Written 2026-11-07 at a session boundary. Resume from this file and the live queue; do not restart the audit.

## State
- Remote master SHA when this section was written: `7bf9592f746eedf18bdf32238f52d26de8ff3be2` (the commit that adds this file sits on top; fetch before work).
- Completed this session (indexing only, each its own bounded commit, pushed without force): 001 `ENG-WK-T1-W08` (20 coverage entries, rule R035), 002 `ENG-WK-T1-W09` (19, R036), 003 `ENG-WK-T1-W10` (22, R037). Each added 5 blocking open items and 5 PENDING follow-ups to `docs/ss1/work/microtasks/english/QUEUE.json`.
- Setup done once: the supplied patch (two commits) was applied on master. It adds this prompt pack and `docs/ss1/sources/SSS1-original.zip` (SHA256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`, verified).
- Exact next eligible ID: **004 `ENG-WK-T1-W11`**, then 005 `ENG-WK-T2-W01` onward in prompt order.
- Blocked IDs: none newly blocked. The five owner/resource gates 074 to 078 stay gated (need owner-supplied passages, audio, approvals or textbook decisions) and are skipped until reached; all `ENG-FACT-*-EXTERNAL-MATERIALS` and several `ENG-LES-*` follow-ups need owner material or a scope decision recorded in their open items.
- Not done: prompts 005 to 088 (apart from the gates above, which cannot proceed without owner input).

## Totals recomputed from every `docs/ss1/work/microtasks/*/QUEUE.json`
- English: 51 implemented/testing-deferred, 91 pending, 5 blocked (147 tracked, 96 remain).
- All SS1: 329 implemented/testing-deferred, 997 pending, 104 blocked (1430 tracked, 1101 remain). The pack's printed 326/985/104 is stale; pending grows because each indexing task appends follow-ups.

## Method for the next Week-indexing task (reproducible, nothing private is committed)
1. `unzip` only the named member from `docs/ss1/sources/SSS1-original.zip` into scratch; verify the member SHA256 (`1ST TERM S1 ENGLISH LANGUAGE.doc` = `4852226f...ddef`). Terms 2 and 3 use the members named in each prompt.
2. `npm i word-extractor`, then `new WordExtractor().extract(file)` and `getBody()`. Term 1 text SHA256 is `8c3faa97...4a4e` (81,965 chars); the line-hash convention is SHA256 of the UTF-8 lines joined with `\n`, 1-based inclusive (reproduces the Week 7 hashes).
3. Reuse the existing `ENGLISH-BODY-nnn` hashes for `SS1-SRC-...:BODY:<hash>` ids; add `ENGLISH-T1-Wnn-*` entries, one classify_marker/SCHEME_ONLY rule per scheme row (next free rule: R038 for Term 1 row 11), open items for every PARTIAL/UNRESOLVED entry, follow-up queue items, counts, status_counts, next_runnable and a note.
4. Write JSON with indent 2, `ensure_ascii=False` and a trailing newline (round-trips the files byte for byte). Allowed writes are only `english.json` and `QUEUE.json`.
5. Week 11 notes: source line 1534 `WEEK ELEVEN`; body rows ENGLISH-BODY-035 (informal letter; row-level IMPLEMENTED_EQUIVALENT through SUP-SS1-ENGLISH-LETTERS-T1), 036 (articles; PARTIAL) and 037 (more on consonants; row-level IMPLEMENTED_EQUIVALENT through SUP-SS1-ENGLISH-PHONETICS-T1). Check whether those replacements really cover the objective-level content (earlier weeks found them narrower).

## Findings worth carrying forward
- Every source week so far has unkeyed revision/weekend items, external book pages that are not in the archive, and scheme-row objectives the body does not teach. Record, do not infer answers.
- The document was not rendered to PDF in Weeks 8 to 10, so underlining, table layout and option lettering are unchecked; the follow-up revision and affix items say to render first.
- The GitHub token supplied for this job is not stored anywhere in the repo or memory; the owner will revoke it when the job ends.
