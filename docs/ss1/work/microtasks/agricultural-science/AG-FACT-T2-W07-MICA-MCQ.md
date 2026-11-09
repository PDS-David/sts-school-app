# AG-FACT-T2-W07-MICA-MCQ — Agricultural Science, Second Term Week Seven

Status: **IMPLEMENTED_TESTING_DEFERRED**. The intended answer is **A. mica**, but option D should be renamed “dolostone” (or “dolomite rock”) to avoid a mineral/rock naming ambiguity.

## Source integrity and exact wording
- Composite archive SHA-256: `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e` — verified.
- Exact Second Term DOCX member `SSS 1/2nd Term SS1_/2ND TERM S1 AGRICULTRAL SCIENCE.docx`, SHA-256 `e9706d69cbb41e7149e2fe62a202ec21143e827fb78c46cb92efe142f9d7e042` — verified.
- Weekend MCQ block 505 SHA-256: `c4e712a6460452cb81f88dca455ae295b45573e3eca724ec621093ddd778e487`; option D block 506 SHA-256: `32edd7977f6a66b01b89fab055649c99250663a155a6aabe372ebecfa420779d`.
- Relevant source examples: block 457 (sandstone) SHA-256 `f21b7acbc3b53cf9cd21f99a8ff0aee48cfb6f571e97bc155d98f115d369504f`; block 458 (limestone) SHA-256 `a2b6fc4e91f20afe96d2b2439ddb7904a271c5deb876ebbd3409307496946681`; block 459 (dolomite) SHA-256 `9cf58ed88264a9cc3647552e870c465281374816e1ca81f459d7f34e11bf234f`.
- Exact MCQ across blocks 505–506: “Which of the following is not a sedimentary rock? A. mica B. sandstone C. limestone D. dolomite”.
- The source's own block 459 explicitly lists “dolomite” among chemically formed sedimentary rocks; blocks 457 and 458 classify sandstone and limestone as sedimentary examples.

## Geological classification of the options

| Option | Classification | Assessment |
|---|---|---|
| A. Mica | Mineral group (sheet silicate/phyllosilicate minerals), not a rock | **Correct exception** |
| B. Sandstone | Sedimentary rock | Valid sedimentary example |
| C. Limestone | Sedimentary rock | Valid sedimentary example |
| D. Dolomite | Can mean the carbonate mineral dolomite or, in older/common usage, the sedimentary rock made mainly of that mineral | Intended as a sedimentary rock in this source, but ambiguous without “rock”/“dolostone” |

### Evidence
- USGS explicitly lists mica among common minerals and distinguishes a mineral from a rock: a mineral is a naturally occurring substance with characteristic composition and structure; a rock is an aggregate of minerals or mineral matter. USGS, “What is the difference between a rock and a mineral?” https://www.usgs.gov/faqs/what-difference-between-a-rock-and-a-mineral
- USGS National Minerals Information Center describes the mica group as 37 phyllosilicate minerals. Mica can occur as a constituent of rocks such as schist, but mica itself is a mineral group, not a sedimentary rock. https://www.usgs.gov/centers/national-minerals-information-center/mica-statistics-and-information
- The British Geological Survey Rock Classification Scheme defines **dolostone** as a sedimentary rock composed dominantly of dolomite or ankerite; its definition notes that the rock was formerly called “dolomite”. https://webapps.bgs.ac.uk/bgsrcs/rcs_details.cfm?code=DOLO
- The Ohio Department of Natural Resources also explains that “dolomite” may refer to the carbonate mineral or to sedimentary carbonate rock composed primarily of that mineral; “dolostone” is the clearer rock name. https://ohiodnr.gov/discover-and-learn/rock-minerals-fossils/common-rocks/dolostone

## Finding and recommended disposition
- **Intended key: A. mica.** It is a mineral group, not a sedimentary rock. Sandstone and limestone are sedimentary rocks. The source itself classifies dolomite as a chemically formed sedimentary rock in block 459, so its intended meaning is clear in the local lesson context.
- **Terminology ambiguity:** “Dolomite” is also the name of a mineral. If a learner interprets option D strictly as the mineral, D is also not a rock, so the question is not fully precise outside the source's convention.
- **Recommended correction:** change option D from “dolomite” to **“dolostone (dolomite rock)”**. The revised options have one clear exception: **A. mica**.
- Add a short teaching note before the assignment: “Mica is a group of sheet-silicate minerals found in many rocks; it is not itself a rock. Dolostone is a sedimentary carbonate rock composed mainly of the mineral dolomite.”
- This is an evidence-based recommendation only. No source wording, answer key or delivery correction was changed or approved.

## Changes and verification
- Added this evidence note and marked `AG-FACT-T2-W07-MICA-MCQ` `IMPLEMENTED_TESTING_DEFERRED`.
- Verified archive/member hashes; inspected blocks 457–459 and 505–506 directly in the DOCX XML and recomputed the relevant block hashes.
- Compared the source's use of “dolomite” with USGS mineral definitions and British Geological Survey/Ohio geological classifications of dolostone.
- No source bytes, package content, lesson body, answer key, correction binding, asset, shared schema/compiler or other subject was changed.
- No tests, importer, TypeScript checks, DB, learner rendering or device checks were run; testing remains deferred.
