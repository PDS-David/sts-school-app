> 23 October update: Ṣàngó short text study is now implemented from a newly verified source (YT-13). See ../YO_TEXT_IMPLEMENTATION/REPORT.md. The report below records the earlier investigation; its three-genre absence finding is superseded for Ṣàngó only.

# YO-TEXT handoff

Status, kept separate: **teaching implementation: NOT done for any of the three genres (no supportable passage)** · **rights register, requirements and decisions: delivered** · **guard tests: passed locally** · **corpus acceptance: not run (reason below)** · **school approval: none** · **deployment: none** · **legal clearance: none claimed**.

Base: master `6bac4640f7c7f6bc7872824f5d724f863afd8bca` (merge of PR #30; newer than the `f28c119…` in the assignment). Branch `jss3/yo-text-20261022-q4n7`. Head SHA and PR URL are in the PR description (a report cannot contain its own commit hash).

## Result per genre
| Genre | Text-study lesson | Why not | Exact missing item |
|---|---|---|---|
| Ṣàngó pípè | not implemented | no reusable passage found | a named passage with provenance, tone-marked transcription, translation and a reuse basis |
| Ọya pípè | not implemented | no candidate prints Ọya pípè text | same |
| iwì egúngún | not implemented | one genre-matching text exists (Olajubu 1977, via africanpoems.net) with no licence | written permission from its rights holder; owner decision D2 on èsà egúngún |

Nothing was written into a lesson. No verse was invented, completed or copied. `SUP-YO-ORAL-GENRES`, `SUP-YO-ORAL-TEXTS`, their attribution record and the NOUN cover/logo assets are unchanged.

## What was examined (full table: `SOURCE_RIGHTS_REGISTER.json`)
- Ellis (1894), chapters II and VI: Yoruba names and glosses only; chants are English-only. No text to teach.
- Johnson (1921): **unresolved.** Only the first ~100,000 characters of the scan could be read (partway through Chapter I); the religion and Ṣàngó chapters were not seen, and the Wikisource page could not be retrieved. Nothing here shows whether the book prints Yoruba chant text.
- Aransi (2024, CC BY-SA 4.0): prints an èsà excerpt, but gives no performer, place, date or consent, so its origin and the right to reuse it are not established; it does not equate èsà with iwì egúngún. Rejected on provenance.
- Akinbo et al. (2022, CC BY): the four-line example is a poem composed for the experiment, not a traditional text.
- González and Oludare (2022, CC BY): no chant lines for these genres.
- Akinyemi (2026, Palgrave): paywalled, exclusive licence.
- Olajubu (1977) chant on africanpoems.net: genre fits, no licence or translator stated. Text deliberately not copied.
- Kolawole (2023), NOUN YOR 215, Rouget (1952), Beier: carried from earlier records or not opened.

## Limits of this pass (read before relying on it)
1. The shell could not reach source hosts (HTTP 403), so no source file was downloaded or hashed.
2. The fetch tool returns model-summarised page text and would not return chant lines verbatim, so **no transcription was verified word for word**. Verdicts are rights and suitability findings.
3. A passage found later still needs the checks in `PERMISSION_AND_TRANSCRIPTION_REQUIREMENTS.md` against page images or the recording.

## Delivered
- `SOURCE_RIGHTS_REGISTER.json`: 12 sources, three genre records, verdict vocabulary.
- `PERMISSION_AND_TRANSCRIPTION_REQUIREMENTS.md`: exact fields a passage needs. Nobody was contacted.
- `OWNER_DECISION.md`: D1 (which routes to try), D2 (èsà as iwì), D3 (optional Èṣù pípè stand-in). The YO-LICENSE distribution choice (A, B or C) stays open and applies to any quoted text.
- `tests/jss3-yo-text.test.mts` (5 tests) and one CI list entry. The gate rejects a genre marked supported unless its lesson is delivered, has an attribution record with a current body hash, has Practice and Answers sections, and is bound to a verified source with a SHA-256. It also keeps YO-SL-089 and YO-SL-094 PARTIAL while no genre is supported.

## Commands and results (local, Node 22.22.0; CI pins 24.19.0, which was not available here)
- `npm ci --ignore-scripts`: ok.
- `node --import tsx --test tests/jss3-yo-text.test.mts tests/jss3-yo-license.test.mts tests/jss3-supplements.test.mts`: 25 pass, 0 fail, 1 skip (existing source-dependent importer test).
- `node --import tsx --test tests/jss3*.test.mts` (no database variables): 337 tests, 276 pass, 0 fail, 61 skipped (database and source-archive suites without their inputs).
- `tsc --noEmit` backend and mobile: clean.
- **Not run:** `run_acceptance.py` (no JSS3 ZIP available, and no lesson, importer or runtime behaviour changed), the eight database suites, regeneration of `IMPLEMENTED_LESSONS.csv` and the teacher schedule (no lesson changed; originals trivially identical), any device or practical observation.

## For the integrator
- Not edited, to avoid shared-file collisions: `OPEN_BLOCKERS.csv` OB-03 (could add: Ellis ch. II and VI read, Aransi 2024 and Akinbo 2022 rejected, Johnson still unread beyond ~100,000 characters), `SCHOOL_DECISIONS_REQUIRED.md` D2 (could point to `YO_TEXT/OWNER_DECISION.md`), coverage and schedule CSVs.
- Performance observation stays separate from teaching completeness and is not evidenced.

## Remaining prerequisites
1. Owner answers D1 and D2 (and the YO-LICENSE choice).
2. For Ṣàngó and Ọya: a chanter's or teacher's own text with consent, or a verified Johnson passage.
3. For iwì egúngún: the Olajubu rights holder's permission, then a transcription and translation checked against the book.
