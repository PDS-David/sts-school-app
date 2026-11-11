# PHYS-FACT-T3-FUSE-RATING — current rating and Megger terminology

Status: **IMPLEMENTED — testing/verification deferred**.

## Evidence
- Original source identity: `SS1-SRC-bed91bb4ef0e`, member SHA-256 `bcd7daab57432b5c2b74a29e4afc1f162276e5fe360fab50345426fc3503e688`.
- Parsed row: third-term Week Four, body ID `SS1-SRC-bed91bb4ef0e:BODY:87346147325e174b318300a5d1ac5312cd14784201b272138575665519d50d1b`, body SHA-256 `87346147325e174b318300a5d1ac5312cd14784201b272138575665519d50d1b`.
- Repository prior-source checkpoint: `docs/ss1/work/SS1-03/CHECKPOINT.md`, section 3, records that the original .doc was read and that current rating was defined as the MINIMUM current, with the correction being maximum carried indefinitely; it also reports “merger tester”.
- Reproducible close-equivalent text: SchoolGist *Physics SSS 1 Third Term*, Week Four, PDF lines 310–316 and 324–329. The PDF's text is corroborative; its binary is not asserted to be identical to the registered .doc.

## Verbatim short source wording and correction
- PDF line 310 calls current rating the **“minimum current”** carried indefinitely. This is wrong. Current rating is the maximum current the fuse is designed to carry continuously under specified conditions without operating.
- PDF line 312 correctly treats fusing current as the minimum current that melts/blows the fuse element.
- PDF lines 314–316 correctly give fusing factor = fusing current/current rating; the factor is greater than 1.
- PDF line 326 prints **“Merger tester”**. Correct term: **Megger**, an insulation-resistance tester.
- PDF line 328 misprints “impudence” for impedance; line 329 misprints “earthling” for earthing.

The expanded lesson `SUP-SS1-PHYSICS-T3-W04-FUSE` now gives the corrected definitions and terminology, with source assessment keys. Its approval remains PENDING and verification DEFERRED.

Reference: https://schoolgist.ng/storage/postFiles/SS1-Physics-3rd-Term-Lesson-Note-pdf.pdf
