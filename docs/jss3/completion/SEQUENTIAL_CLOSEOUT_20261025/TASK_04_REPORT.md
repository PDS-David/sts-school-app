# Task 04 — Ọya pípè text study

**TASK 04: BLOCKED.** No eligible Ọya pípè passage was found, so `SUP-YO-OYA-TEXT` was not created and the Ọya objective (YO-SL-094) stays open.

Base master `4077291b27d573b3befb15d59cee9ae6adc11b32` at start; re-fetched before publication, master had moved to `a4012d08beec5ed014525fcc0fa0fa6c8bf54739` (PR #56, Task 03). Task 04 shares no file with it; branch rebased onto it. Tested tree `525ed3ae09f83150c4b688abba79fc244bfa2fc6`; the head is this report on top (read it from the PR). Branch `jss3/task04-20261025-oya`. No `AGENTS.md` exists.

## What was done
1. Read the prior record first: `Y1_OYA_TEXT`, `OYA_SOURCE_ACQUISITION`, `R1_YORUBA_TEXTS`, `YO_TEXT/SOURCE_RIGHTS_REGISTER.json`. Leads YT-14, YT-15, YT-16 were not searched again.
2. Checked the leads those rounds left unread, by search and fetched page text only:

| ID | Source | Result |
|---|---|---|
| YT-R1-01 (recheck) | Oladosu 2024, *Oya religious group in Oyo*, Zenodo 12574511, CC BY 4.0 | Page text is English prose on Ọya's role, myths and worship; only proper names and the festival name Ìṣẹ̀ṣe in Yoruba; no oríkì or chant lines. PDF bytes not downloaded, so verdict stays NOT_EXAMINED. |
| YT-R2-01 | Beier, *Yorùbá Oral Poems*, Bolarinwa's Yoruba translation, Delos 33(2) 2018, pp. 225–251 | Paywalled (USD 10), copyright with translator; unknown whether any Ọya poem is printed; a translation into Yoruba of English renderings, not a transcription of performance. UNVERIFIED_LEAD. |
| YT-R2-02 | Akinyemi page, UT African Studies database | Ṣàngó praise names only; no licence statement. NO_TEXT_TO_TEACH. |
| YT-R2-03 | africanpoems.net, "Onikoyi the warrior king" (credited to Beier 1970) | Praise of a king, not Ọya; no licence statement. NO_TEXT_TO_TEACH. |

3. Searches for Ọya oríkì / pípè with open licences returned only sources already in the register (Kolawole 2023, Aransi 2024) plus the pages above.

## Method limit (unchanged from earlier rounds)
Shell connections to zenodo.org, archive.org, gutenberg.org, en.wikisource.org, brill.com, letterkunde.africa and doi.org all failed (curl status 000). No source bytes were downloaded, so **no SHA-256 exists for any Ọya lead** and no transcription was compared. Findings are rights/suitability findings from page text.

## Repository changes (records and test only)
- `docs/jss3/completion/YO_TEXT/SOURCE_RIGHTS_REGISTER.json`: three new rows (YT-R2-01..03), an `r2_recheck` note on YT-R1-01, a method-note sentence, and a Task 04 paragraph in the `oya-pipe` `best_lead`. Genre status stays `NOT_SUPPORTED`; `missing` unchanged.
- `tests/jss3-yo-text.test.mts`: one test. Every Ọya lead stays recorded with a stated unblock; no Ọya lead carries a hash it could not have; the Zenodo verdict cannot be upgraded without bytes; no `SUP-YO-OYA-TEXT` lesson or attribution exists; YO-SL-094 is not closed.
- No lesson, attribution, runtime, schema, coverage CSV, `IMPLEMENTED_LESSONS.csv` or teacher schedule changed, so nothing was regenerated. Original rows, completions, assets and Third Term untouched.

## Observed checks
Node 24.19.0 (npm package `node@24.19.0`), `npm ci --ignore-scripts`.
- `node --import tsx --test tests/jss3-yo-text.test.mts tests/jss3-yo-license.test.mts tests/jss3-yo-iwi.test.mts`: 27 tests, 27 pass, 0 fail.
- After rebase, plus `jss3-lit-exercise` and `jss3-supplement-revision`: 37 tests, 37 pass, 0 fail, 0 skipped.
- Negative control: setting a fabricated `source_sha256` on YT-R2-02 makes the new test fail; register restored afterwards.
- `tsc --noEmit` backend: exit 0. Mobile: exit 0.
- `node --import tsx --test tests/jss3*.test.mts` (before rebase): 388 tests, 326 pass, 0 fail, 62 skipped (DB/corpus-dependent). One earlier run failed `checked-in revision registry is exactly reproducible…` because my clone was shallow; after `git fetch --depth=200` it passed 5/5. Environment, not a code change.
- A tracked `.pyc` was modified by running the suite; it was reverted and not committed.

**Not run:** PostgreSQL route suites and `run_acceptance.py` with the private corpus. No lesson, route or lesson-affecting data changed, so neither exercises anything this task touched. Not tested: any device behaviour.

## Remaining input: one action unblocks this
Best named source: Ifayemisi Elebuibon, *Orisa Songs / Canciones para los Òrìṣà* (YT-15), the Ọya oríkì whose English-script first line begins "A sere dun ni oko" (seen only in a search extract; edition and page unknown). The owner opens the authorised copy, then obtains **the rights holder's written permission naming that one oríkì for display to enrolled students in the school app**, with a tone-marked copy and a named translator. An equally valid alternative is a Yoruba teacher or performer supplying one passage (≥3 lines) with a checked transcription, named translation, provenance and written consent, as listed in `OYA_SOURCE_ACQUISITION/REPORT.md`, which also holds an unsent permission request. Either way the passage file or consent letter must be supplied privately so its SHA-256 can be recorded. **Nobody was contacted.**

## Status
IMPLEMENTED: acquisition record and guard test only; the Ọya lesson is not implemented. VERIFIED: tests above. PUBLISHED: see PR. MERGED: no. DEPLOYED: no. Master may auto-deploy; this branch is not merged here, and the integrator must check release configuration first. A written answer would not certify an authentic practical performance, which still needs actual observation.
