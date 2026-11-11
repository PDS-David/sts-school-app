# PHYS-WK-T3-W04 — Third Term Week Four: safety device (fuse)

Status: **IMPLEMENTED — testing/verification deferred**. The scheme objective is indexed, the fuse lesson has been expanded, source assessment answers are supplied, and source defects are recorded. Content approval remains PENDING.

## Registered source identity

- Source ID: `SS1-SRC-bed91bb4ef0e`
- Archive member: `SSS 1/3rd Term SS1_/3RD TERM S1 PHYSICS.doc`
- Registered member SHA-256: `bcd7daab57432b5c2b74a29e4afc1f162276e5fe360fab50345426fc3503e688`
- Parsed row: index 3, `WEEK 4`, title `SAFETY DEVICE - FUSE`
- Parsed body ID: `SS1-SRC-bed91bb4ef0e:BODY:87346147325e174b318300a5d1ac5312cd14784201b272138575665519d50d1b`
- Parsed body length: 2,393 characters
- Parsed body SHA-256: `87346147325e174b318300a5d1ac5312cd14784201b272138575665519d50d1b`

The repository checkpoint `docs/ss1/work/SS1-03/CHECKPOINT.md`, section 3 (Physics), records that the original third-term Weeks 1–4 were read and specifically reports the fuse-rating and Megger defects. The public SchoolGist PDF reproduces the same week sequence and provides line-level text locators below. The PDF is used as textual corroboration; its bytes are not claimed to match the registered .doc member.

## Scheme objective and lesson

Scheme objective: `Safety Device – Fuse` (source scheme line 6 in the PDF; body row 3 above).

- Lesson: `SUP-SS1-PHYSICS-T3-W04-FUSE`
- Updated lesson body SHA-256: `6843edf84e9873f307485a878d188ee82c1c5e5361dc53250fcc5322e9b2db06`
- Practice: 21 answered questions, 41 marks; all marking rubrics sum to their item totals.

The lesson teaches the fuse and fuse element, current rating, fusing current, fusing factor, selecting a suitable fuse from appliance power/current, rewirable/cartridge/HBC-HRC fuses, continuity/insulation-resistance/polarity/earth-loop tests and electrical safety. The source's three fuse MCQs and both theory prompts have answer coverage in Q17–Q21.

Coverage: `COV-PHYS-T3-W04-OBJ-1` remains `IMPLEMENTED_EQUIVALENT`, with the source row ID/hash and lesson evidence.

## Confirmed defects and exact locators

SchoolGist, *Physics SSS 1 Third Term*, Week Four:
- Lines 310–312 define current rating as the **“minimum current”** a fuse carries indefinitely. This is reversed. Current rating is the maximum current the fuse is designed to carry continuously under specified conditions without operating; fusing current is the minimum current that causes the element to melt.
- Line 314–316 gives fusing factor as fusing current divided by current rating. This ratio is correct; fusing factor is greater than 1.
- Line 322 says **“High breaker capacity fuse”**. Correct terminology is high breaking capacity (HBC/HRC) fuse.
- Line 326 says **“Merger tester”**. Correct instrument name is Megger (insulation-resistance tester).
- Line 328 says “Earth-loop impudence tester” and line 329 says “earthling”. Correct terminology is earth-loop impedance tester and earthing/earth-fault loop test.
- Line 341 repeats “merger” as a supposed fuse option; it is a tester, not a fuse.

The prior repository checkpoint independently reports the original .doc has the current-rating minimum/maximum reversal and “merger tester” typo. The public PDF provides reproducible line-level wording, but the original member's binary bytes were not re-opened in this execution.

Reference: https://schoolgist.ng/storage/postFiles/SS1-Physics-3rd-Term-Lesson-Note-pdf.pdf

## Assignment audit

PDF lines 339–346:
- Section A Q1: fuse is designed to melt — answer B.
- Q2: conductor designed to melt is the fuse element — answer A.
- Q3: “merger” is not a fuse type — answer B; correct word is Megger.
- Section A Q4 at line 342 asks about the motion of a sounding tuning fork. This is unrelated to fuse safety. It is excluded from the fuse lesson/assessment and recorded as non-blocking open item `PHYSICS-T3-W04-UNRELATED-QUESTION`; no destination topic is guessed.
- Section B Q1: list four fault-detection tests — Megger/insulation resistance, test bell/polarity, earth-loop impedance, continuity.
- Section B Q2: fusing factor = fusing current/current rating.

The authored fuse assessment includes the relevant source questions with answer keys. The unrelated tuning-fork item is not presented as a fuse question.

## Checks performed

- Updated lesson body SHA-256 recorded.
- All 21 practice items have answers and marking totals: 41 marks.
- Source assessment mapping and the unrelated item disposition recorded.
- Lesson content approval remains `PENDING`; verification remains `DEFERRED`.
- No importer, database or device test is claimed.
