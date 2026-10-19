# E_MUSIC_CCA - JSS3 Batch 2 close, Music and Cultural & Creative Arts

Worker branch: `jss3/b2-close-e-20261018-music-cca`. Base: master `86a1a6195f47370ebbdecbc806e06d4661fbef58` (clean tree, no AGENTS.md; 90 supplements). Date: 18 Oct 2026.

## Status levels
- **Prepared:** all 13 lessons, 10 figures, decisions, evidence, corrections, assets, blockers, tests (this directory).
- **Staged-tested (disposable copy of master, not pushed to master):** lessons composed with the code delta and validated by the importer's own validator, the repo supplement test and `tsc --noEmit`.
- **Integrated on master:** none. Integration worker F applies the deltas.

## Inputs verified
Inner ZIP SHA-256 matched `0a5b0d92...ea3c`; all 61 inner checksums passed; the five Music/CCA sources match the worklist hashes. 24 worklist entries; 14 mandatory (SL-060, 064, 294, 296, 422, 423, 424, 425, 427, 521, 523, 559, 560, 562), all decided here.

## What changed (IDs)
Replace (1): `SUP-MUSIC-PRACTICAL` (hash of old lesson from Node: `0c1b2e2b509c7ce20483f505b5e7439e9d0faa90a05422a75d862acd259dd3a9`).
Add (12): Music - `SUP-MUSIC-HARMONIC-MINOR` (SL-423), `SUP-MUSIC-RELATIVE-KEYS` (SL-424), `SUP-MUSIC-WORDS-MELODY` (SL-425), `SUP-MUSIC-CADENCES` (SL-427), `SUP-MUSIC-STAFF-TO-SOLFA` (SL-561), `SUP-MUSIC-TRANSPOSE-DOMINANT` (SL-562), `SUP-MUSIC-REVISION-OMEGA` (SL-559). CCA - `SUP-CCA-VISUAL-UNITY` (SL-521), `SUP-CCA-BATIK-PRACTICAL` (SL-523), `SUP-CCA-LETTERING-PRACTICAL` (SL-294), `SUP-CCA-EMBROIDERY-PRACTICAL` (SL-063), `SUP-CCA-EXHIBITION-PRACTICAL` (SL-062).
Decisions (19 rows): SL-060, 064, 294, 296, 422, 423, 424, 425, 427, 521, 523, 559, 560, 562 (mandatory) plus changed SL-561, 566, 567, 062, 063.
Delivery corrections (5): plagal "fah - me"; unsupervised hot-wax batik; flats lost from the minor-scale row; flats lost from the relative-keys row; "le (taw)". `source_body_sha256` is SHA-256 of the packaged capture's row body; F must confirm it against a fresh capture.
Code delta (`code.patch`, one shared file): `backend/src/db/jss3Supplements.ts` - registers 12 new `WG-` gap ids in the existing allowlist. Applies cleanly to the base (`git apply --check`).
Overlaps: `SUP-MUSIC-CADENCES` overlaps `SUP-CCA-CADENCES` (different subject). The replaced `SUP-MUSIC-PRACTICAL` keeps its gap ids.

## Findings that changed the work
1. The Music DOCX files hold drawn staves (vector shapes), not images. I rendered both through LibreOffice and checked them. The drawn scales (F, D minor, E minor, B-flat, G minor; C major, A minor) are correct pitch by pitch; the **text layer** loses every flat, the G minor label row ends on "A" where the drawn note is G, and flat keys read as B/E/A.
2. The earlier SL-561 limitation ("source docx has no embedded images") was wrong in its premise; the decision is replaced.
3. SL-562: the source examples go F major to G major (a tone up) and an octave down into the bass clef; the dominant of F is C, so the scheme title was not demonstrated.
4. SL-427: plagal given as "fah - me"; correct is IV to I (fah, doh).
5. "le (taw)": raised lah is `le`; `ta` is the lowered ti (checked against Wikipedia's Tonic sol-fa page).
6. SL-559: the automatic match pointed to a revision row of a different file (`same_source_file=no`); the Omega Week 1 exercise has no captured row. It has a drawn chord item whose instruction line is missing; the fifth chord is ambiguous and is not answered.
7. The old practical model put a note below doh with no octave given; the new eight-bar model stays within doh-soh.
8. Source Example 2 (transcription): the quaver beam renders on the label row, so bar 1 looks like five crotchets; this may be a LibreOffice anchoring artefact and is not certified either way.
9. Batik source: hot wax at 220-230 F in a pot or old frying pan, soda ash, boiling and ironing, no supervision; replaced for pupils by paste-resist with teacher-only heat.
10. Lettering "practical" is a history passage; embroidery and exhibition rows have no tasks. The Unity row is about national and religious unity, not design.

## Tests actually run
- `python3 -m unittest discover -s tests`: 24 tests OK (notation re-parsed with music21 against independently typed pitches, intervals, bar lengths, key signatures, ranges; marks totals; anchors; asset hashes; corrections; negative controls such as the source's wrong G minor label, the F-to-G example as "dominant", and an old-practical low note).
- Importer gate (`tests/validate_composed.mts`) in a disposable worktree of the base with `code.patch` and the upserts: validated 102 lessons (13 from this delivery); 5 negative controls rejected. Same gate on unpatched master fails with `Unregistered wider-workstream gap: WG-MUSIC-SL423`.
- `node --import tsx --test tests/jss3-supplements.test.mts` on the composed data: 12 tests, 11 pass, 1 skipped, 0 fail.
- `tsc -p backend/tsconfig.json --noEmit` on the patched copy: exit 0, no output.

## Environment and what was NOT done
- Node was **v22.22.2**, not 24.19.0; rerun on 24.19.0 is required. The first `npm ci --ignore-scripts` was killed before finishing (found when `tsx` was empty); a second run completed (759 packages) before any Node test.
- I did **not** run `scripts/jss3/capture_rows.py`; anchors and body hashes were checked against the packaged capture. I did not run the full original-source audit.
- The original RTF was not opened; the visual evidence is the LibreOffice render of the staged DOCX files. `OPTIONAL_UNPUBLISHED_DRAFTS` were not opened or used.
- No device/phone testing. A desktop reading of the figures is not phone acceptance. Practical performance (voice, piano, recorder, stitching, lettering, batik, exhibition) is not certified by any of this.
- No production connection, no `--apply`, no push to master, no existing asset overwritten.

## For integration worker F
1. Apply `code.patch`; compose `SUPPLEMENT_UPSERTS.json` (check each `expected_old_sha256`).
2. Merge `DECISIONS.csv`; implement and test `DELIVERY_CORRECTIONS.json` (confirm body hashes on a fresh capture).
3. Attach `assets/*.png` to the target lesson ids in `ASSETS.json` and assign `order_index` after the combined capture; the figure placements are described in each lesson body ("Figure" / "worked example (figure)").
4. Terms: lessons from Third-Term sources sit in the First or Second Term per the importer's current buckets; confirm.
5. Open items: `BLOCKERS.csv`.
