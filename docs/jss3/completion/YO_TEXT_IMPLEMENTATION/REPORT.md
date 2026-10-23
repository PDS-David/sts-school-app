# Ṣàngó text-study implementation — 23 October 2026

Base master: df6372bbbafb045668a7ca6fede0577a17e35ec3.
Implemented in the existing First-Term `SUP-YO-ORAL-GENRES` lesson, not a detached draft and not a new row.

## What is now taught

A short published Ṣàngó passage, its printed English translation, close reading of repeated prohibitions, four questions and an eight-mark answer key. The source credits Mama Ṣàngódeyi and identifies the authors, publication and reuse licence. The excerpt is explicitly a selection, not the complete chant or the school's missing original. No ritual participation, observed performance or scientific rainmaking claim is required or asserted.

This implements one bounded text-study example. It does not close every objective associated with YO-SL-089/094, nor supply Ọya or iwì texts. Combined coverage remains PARTIAL. The source-rights register now supports the Ṣàngó example only.

Two existing defects were also corrected: the blanket claim that chants have no drum accompaniment (the documented Ṣàngó example uses Bàtá); and an incorrect 23-mark written subtotal (it is 19). The new eight-mark section makes 27 written marks, or 35 including the separate eight-mark observation. Question 6 can use the supplied profiles when observation is unavailable; no fictitious observation sheet is required.

## Source evidence and rights

Láyadé and Ògúnyẹmí (2025), *Gods, music and rainmaking in Yorùbáland*, Tydskrif vir Letterkunde 62(3):88–96, DOI https://doi.org/10.17159/tl.v62i3.18622.

Actual HTML was downloaded, rather than relying on a search summary. `SANGO_EXCERPT.json` records hashes of the source and publisher licence page and the exact DOM locator. Its three Yoruba lines and three translation lines match the later quotation exactly. The earlier full-chant version differs in spacing/diacritics; it was not conflated with the selected version. The publisher explicitly states CC BY-SA 4.0. The selected teaching section carries that licence and records the added notes and selection. This does not claim the owner has answered the separate production-distribution question.

Run `python3 scripts/jss3/yo_text/verify_sango_excerpt.py SOURCE_HTML LICENCE_HTML` on downloaded pages to verify the transcript and licence link. Exact outer-HTML hash comparison is reported separately because host markup can change.

`jss3Attributions.json` adds a body-hash-bound record for the exact First-Term lesson identity. The existing authenticated asset route and mobile attribution renderer consume it. The DB regression checks actual route delivery, unauthenticated denial and cross-class isolation. No cover/logo requirements belong to this article; NOUN's existing record/assets remain unchanged.

## Verification and publication limits

See VALIDATION.json. The source-backed capture preserves all 313 original objects, keeps 170 supplements and produces 483 rows (234 First, 249 Second, zero Third); Computer Studies remains zero. Only SUP-YO-ORAL-GENRES changes among lesson objects. IMPLEMENTED_LESSONS.csv is regenerated; the teacher schedule is unchanged.

Local Node 24.19.0 checks use the private input ZIP with SHA256 `0a5b0d929e1dc61801cde43f8a85235d2e236ced334d2091583f5fa16524ea3c`. Full source documents/captures are not committed. A local --without-db acceptance is deliberately INCOMPLETE for database acceptance; the PR must pass CI's real PostgreSQL checks before merge. An interrupted pre-restoration run is not evidence.

No production import, deployment or cache refresh was performed. Publishing a supplement-body change does not update an already imported production row. The release plan must reconcile body hashes and generated content before learner use.

## Still requires resolution

Ọya pípè and iwì egúngún text study; specific Yoruba source ambiguities/prescribed texts; historical protected-baseline provenance; sequencing-policy/placement approval; distribution choice; staging access and device observations; production release approval. Existing practical teaching/rubrics are implemented; actual pupil performance is a separate school activity, not a claim this software change makes.
