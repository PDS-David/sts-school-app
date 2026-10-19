# G4 — Music/CCA figures and remaining visual-content gaps (19 Oct 2026)

Base: master after G3. The original JSS3 .docx/RTF files and the private corpus were **not available** to this run, so everything that needs an original render is open.

## Done
- **Ten E figures verified (CI-safe, `tests/jss3-g4-figures.test.mts`)**: each PNG's bytes match `ASSETS.json` and its manifest row, caption equal, manifest `expected_title` equals the target lesson's title, the lesson body refers to its figure, PNG dimensions match, composed-not-recovered provenance recorded.
- **Legibility at a 360 pt phone width**: staff space is 26 px in every figure. Eight figures show 6.3 to 10.4 pt staff spaces at full width. Two (`staff-to-solfa-example` 2008 px wide, `practical-model-melody` 2200 px wide) would show 4.7 and 4.3 pt, and the instruction lines inside the practical figure about 3 pt.
- **Fix**: `TopicDetailScreen.tsx` now shows pictures at least 1500 px wide at 0.45 of their width inside a horizontal scroll (staff space about 11.7 pt), with a "Swipe sideways" line; the 1500 px threshold leaves earlier recovered Music art (1424-1492 px) and the 1492 px words-melody figure unchanged. Mobile `tsc --noEmit` is clean.
- **Inventory tool** `scripts/jss3/inventory_drawings.py` lists pictures, text boxes and vector shapes per paragraph with the nearest heading and the text before and after, and marks only tiny unlabeled shapes as `review=low`. Tested on a synthetic docx only.
- **SL-559 content re-checked**: the lesson's answers (cadence names, intervals, relative keys, bass clef lines, chords F, A, G and Eb major) are correct.

## Not done (needs originals or a decision)
- **SL-559 fifth chord and the clef question stay indeterminate.** Teacher questions: (1) In the Omega Week 1 chord row, is the fifth chord's top note F or G above C and E? If G, the answer is C major (C E G); if F, it is not a triad and the item needs correcting. What is the instruction line? (2) Item 10 says "fifth line": does the class expect A (fifth line of the bass staff) or F (the fixed line, fourth)?
- **Mathematics, Business Studies, Basic Science drawn objects** were not inventoried or traced to lessons (RG-32).
- **Original RTF/Word render of the sharp-row key-signature table (SL-424)** not compared.
- **Alt text is not delivered in the app** (RG-33); **no device check** (RG-08, RG-34).
- Practical performance (voice, piano, recorder, embroidery, lettering, batik, exhibition) is not certified by any written lesson or figure.
