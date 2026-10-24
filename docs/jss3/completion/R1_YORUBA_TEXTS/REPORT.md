# R1 — Ọya pípè and iwì egúngún text studies — 24 October 2026

**Overall status: EVIDENCE-ONLY for both genres. No lesson was delivered. Yoruba text study is NOT complete.**
Kept separate: implementation (runtime lessons): none · source evidence: updated · tests: pass locally · corpus/DB acceptance: not run · capture/regeneration: not done · PR: see end · merge/deploy/production: none.

Base master `1de0bcab5b04edaaa05dc11d046e2c6d86dc3609` (PR #43). Branch `jss3/r1-yoruba-texts-20261024-a1`. No `AGENTS.md` exists. Nobody was contacted.

## Why nothing was delivered
The repository gate (`jss3-yo-text`, `jss3-yo-iwi`) lets a genre be SUPPORTED only when a source row is `USABLE_VERIFIED` with a 64-hex `source_sha256` of the real source bytes. In this environment the shell cannot resolve `www.frontiersin.org` or `zenodo.org` (curl exit 6), and the fetch tool returns extracted text or binary, not hashable page bytes. A hash of extracted text would not be a source hash, so none was recorded and the gate was not loosened.

## Ọya pípè — NOT SUPPORTED (no passage)
- Kolawole (2023, YT-04) re-read in full (PDF text). It names Oya pípè and èsà egúngún as forms but prints only incantation, Èsù, ìjálá, oríkì Oníkòyí and Ifá lines. No Ọya lines. Verdict unchanged.
- New lead YT-R1-01 (Oladosu 2024, Zenodo, CC BY 4.0): a religion-history article; its description has no chant text; PDF returned binary and could not be read. Verdict NOT_EXAMINED.
- Searches for an openly licensed Ọya pípè / oríkì Ọya with a stated collector and translator found only: copyrighted songbooks (Elebuibon, YT-15), unlicensed Scribd uploads, and encyclopaedic pages. None was copied.
- **One acquisition action:** the owner opens the printed/authorised *Orisa Songs* (Elebuibon), finds the Ọya oríkì whose script first line begins "A sere dun ni oko" (seen only in a search extract; page unknown) and obtains that rights holder's written permission naming that one oríkì for display to enrolled students, with a tone-marked copy and a named translator. The earlier unsent request in `OYA_SOURCE_ACQUISITION/REPORT.md` can be filled for it. This replaces the broad questionnaire.

## iwì egúngún — labelled modern equivalent drafted, NOT delivered
- Candidate YT-R1-IWI-01: the four-line original poem in Akinbo, Samuel, Alaga and Akingbade (2022), *Frontiers in Communication* 7:1029400 (CC BY; poem composed by co-author Iyabode B. Alaga; chanted in ẹ̀sà style by one unnamed trained student). Earlier work rejected it as "not a traditional text". Re-assessed under the R1 brief: it is not an inherited iwì chant and the draft says so, but the study documents the features that distinguish ẹ̀sà/iwì (no vibrato, inserted and lengthened vowels, [ooo] at the first line, higher pitch than ìjálá; text alone does not identify a genre). That is what the lesson teaches, with a short oríkì read closely.
- Draft lesson `ready/SUP-YO-IWI-TEXT.body.txt`: First Term, gap `YO-SL-094`, lines 1, 2 and 4 plus printed translation, objectives, school notes, 7 questions, 15 written marks, answer key, attribution wording. It carries a "MODERN EQUIVALENT" label and never calls the text a handed-down chant. Line 3 (a description of the addressee's body) is omitted as a classroom selection; the owner may restore it. The printed spelling "Ọmọladùṇ" is kept and flagged for the teacher.
- Not done: delivery into `jss3Supplements.json`, an attribution record, genre status change. The register keeps `iwi-egungun` NOT_SUPPORTED; YT-06 stays NOT_SUITABLE as an inherited text; YT-R1-IWI-01 is `UNVERIFIED_LEAD`.
- Limits: poem read through the fetch tool as text, not compared with page images or bytes; one chanter; pilot study; no audio is available to pupils, so performance is not marked.
- **One acquisition action:** on a machine that can reach frontiersin.org, save the article `/full` page and run `python3 scripts/jss3/yo_text/verify_iwi_candidate.py SAVED.html`. It prints `source_sha256` and five checks (Yoruba lines, printed English, composer statement, CC BY statement, ẹ̀sà feature statements). Send that output; delivery is then mechanical (supplement, attribution with `attributionBodyHash`, register `USABLE_VERIFIED` + `text_kind labelled_modern_equivalent`, status SUPPORTED, regenerate records) and the existing gate checks it.
- Owner decision to confirm: whether a labelled modern equivalent that teaches delivery features is acceptable for YO-SL-094 at all. It does not close the mixed objective.

## Changes
- `SOURCE_RIGHTS_REGISTER.json`: Ọya and iwì `best_lead`/`missing` (existing required phrases kept), `r1_recheck` on YT-04 and YT-06, new rows YT-R1-01 and YT-R1-IWI-01. No row removed or replaced.
- `docs/jss3/completion/R1_YORUBA_TEXTS/`: this report, `IWI_CANDIDATE.json`, `ready/SUP-YO-IWI-TEXT.body.txt`.
- `scripts/jss3/yo_text/verify_iwi_candidate.py`; `tests/jss3-yo-r1.test.mts` (5 tests); one entry added to `.github/workflows/jss3-assets.yml`.
- Untouched: all lessons, Ṣàngó, the marriage lesson, attributions, coverage CSVs, `IMPLEMENTED_LESSONS.csv`, teacher schedule.

## Checks (Node 24.19.0 via local npm install, `npm ci --ignore-scripts`)
- `node --import tsx --test tests/jss3-yo-r1 yo-text yo-iwi yo-license jss3-supplements`: 51 tests, 50 pass, 0 fail, 1 existing skip.
- `tests/jss3*.test.mts` (no DB variables): 372 tests, 311 pass, 0 fail, 61 skipped (database and private-archive suites).
- `tsc --noEmit` backend and mobile: exit 0.
- Negative controls (run, then restored): marking YT-R1-IWI-01 `USABLE_VERIFIED` without a hash fails 2 tests; changing the draft body or its marks fails 2 tests. In-test controls: delivering the draft with no byte-verified source is rejected by the real `iwiClaimProblems`; an altered Yoruba line makes the verifier exit 1. The verifier's positive case uses a **synthetic** HTML fixture built in the test; it is not a capture of the article.
- Not run: `run_acceptance.py` and fresh capture/regeneration (private archive `JSS3_NEXT_STAGE_INPUTS_20261016.zip` not available; no lesson changed), PostgreSQL suites, any device check. Full-source capture is **unverified**.

## Overlap
Shared file `SOURCE_RIGHTS_REGISTER.json` (also edited by Y1/Y2 and possibly Y3): merge by stable IDs. This task adds only the fields and two rows above.
