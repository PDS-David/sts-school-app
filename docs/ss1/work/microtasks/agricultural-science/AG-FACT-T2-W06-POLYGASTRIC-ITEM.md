# AG-FACT-T2-W06-POLYGASTRIC-ITEM — Agricultural Science, Second Term Week Six

Status: **IMPLEMENTED_TESTING_DEFERRED**. The item has one defensible factual answer: **C. rabbit**. The source does not teach this digestive classification in Week Six, so instructional alignment should be checked separately.

## Source integrity and exact wording
- Composite archive SHA-256: `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e` — verified.
- Exact Second Term DOCX member `SSS 1/2nd Term SS1_/2ND TERM S1 AGRICULTRAL SCIENCE.docx`, SHA-256 `e9706d69cbb41e7149e2fe62a202ec21143e827fb78c46cb92efe142f9d7e042` — verified.
- Block 370 SHA-256: `09b29fe0eda9de5f2a8e864b6dd10d418cd3ad0797bbf64f1ba5ff444ca6dfe8`.
- Block 408 SHA-256: `f23310f4b6f5872eab87501e2fa8e0b678664d3711144901111393ea4aa43c68`; block 409 SHA-256: `fae1f928d94e6b231067e8fe3cb22b3b631ccd7a796f848d903c3c5aa80c2a47`.
- Block 408 reads: “All these farm animals are polygastric animals except A. cattle B. goat C. rabbit”; the separate next paragraph (block 409) supplies “D. sheep”.
- Block 370 lists cattle, sheep, goat and rabbit as examples of herbivores/primary consumers. It does not classify their stomachs.

## Animal-by-animal classification

| Option | Classification | Reason |
|---|---|---|
| A. Cattle | Ruminant; four-compartment stomach | Rumen, reticulum, omasum and abomasum |
| B. Goat | Ruminant; four-compartment stomach | Same four compartments and cud-chewing digestion |
| C. Rabbit | Nonruminant, monogastric hindgut fermenter | Simple stomach; microbial fermentation occurs mainly in the enlarged caecum |
| D. Sheep | Ruminant; four-compartment stomach | Rumen, reticulum, omasum and abomasum |

### Evidence
- The University of Alaska Fairbanks Cooperative Extension publication *Gastrointestinal Anatomy and Physiology of Ruminants* explicitly includes cattle, goats and sheep among ruminants and describes their one stomach as divided into four compartments: rumen, reticulum, omasum and abomasum. It also explains rumination/cud chewing and microbial fermentation. Joanne McCrea, Assistant Professor of Large Animal Medicine; publication LPM-00500, new March 2026: https://www.uaf.edu/ces/publications/database/agriculture-livestock/ruminant-gastrointestinal-anatomy.php
- The *Merck Veterinary Manual*, professional article “Nutrition of Rabbits,” reviewed by Joerg Mayer, DVM (University of Georgia College of Veterinary Medicine) and updated July 2026, explicitly describes rabbits as **nonruminant herbivores with an enlarged hindgut (hindgut fermenters)**. Fermentation occurs in the caecum; cecotrophy recycles microbial nutrients. https://www.merckvetmanual.com/exotic-and-laboratory-animals/rabbits/nutrition-of-rabbits
- The University of Illinois College of Veterinary Medicine likewise describes rabbits as monogastric hindgut-fermenting herbivores with a well-developed cecum (Practitioner Update, 4 June 2024): https://vetmed.illinois.edu/2024/06/04/rabbit-gi-stasis/

## Finding and recommendation
- Cattle, goats and sheep are ruminants with four-compartment stomachs; rabbit is a nonruminant, monogastric hindgut fermenter. Hindgut fermentation in the rabbit does not make it a ruminant or a polygastric animal.
- **The unique exception is C. rabbit.** Retain the answer; no competing option is scientifically defensible as the exception.
- For terminology precision, “polygastric” is commonly used in school-level livestock teaching, but the ruminant has **one stomach divided into four compartments**, not four separate stomachs. If the wording is being edited, a clearer stem is: “Which of these animals is not a ruminant with a four-compartment stomach?” The key remains C.
- **Teaching alignment:** a whole-document search of the Second Term DOCX finds “polygastric” only in this MCQ and no occurrence of “ruminant” or “rumen”. Block 370 teaches the animals as herbivores/primary consumers only. The MCQ is factually sound but tests a classification not taught in this source term. Retain it as a scored Week Six item only if the concept is taught elsewhere before the assessment; otherwise provide a short teaching explanation or remove it from that week's scored assignment. This scope issue does not make the answer ambiguous.

## Changes and verification
- Added this evidence note and marked `AG-FACT-T2-W06-POLYGASTRIC-ITEM` `IMPLEMENTED_TESTING_DEFERRED`.
- Verified the archive/member hashes; inspected blocks 370, 408 and 409 directly in the DOCX XML and recomputed their hashes.
- Checked the complete Second Term document text for “polygastric”, “ruminant” and “rumen” to distinguish the answer-key finding from the separate teaching-alignment gap.
- No source wording, answer key, package content, lesson, correction, asset, shared schema/compiler or other subject was changed.
- No tests, importer, TypeScript checks, DB, learner rendering or device checks were run; testing remains deferred.
