# AG-CORR-T2-W06-ECOLOGY-TERMINOLOGY — Agricultural Science, Second Term Week Six

Status: **IMPLEMENTED — approval and verification deferred**. The source row is bound to a complete authored replacement; original source bytes are unchanged.

## Immutable source identity

- Source ID: `SS1-SRC-956594d97094`
- Archive member: `SSS 1/2nd Term SS1_/2ND TERM S1 AGRICULTRAL SCIENCE.docx`
- Composite archive SHA-256: `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`
- Member SHA-256: `e9706d69cbb41e7149e2fe62a202ec21143e827fb78c46cb92efe142f9d7e042`
- Actual parser/compiler row: `SS1-SRC-956594d97094:BODY:5e12e6d75046c73227b73e5a70eb56fd6a83ccbaf4d206b9dc3d4cc609e008f6`
- Original terminology locators: blocks 366, 368 and 370.
- Recomputed block hashes:
  - Block 366: `a3df9be988ad1f9219daddccaa057acff69739d033323b3f3b1cc1563dae63f3`
  - Block 368: `569b77efdc680a8ef604bacf699fae0da797cc83593aebda0ac7b55279bf03c8`
  - Block 370: `09b29fe0eda9de5f2a8e864b6dd10d418cd3ad0797bbf64f1ba5ff444ca6dfe8`

The row identity is reproduced in CI using the hash-pinned source archive, Mammoth extraction, actual `parseTopics` and `compilePackages`. The test pins all 30 original teaching-row IDs.

## Findings and corrections

The source labels organism groups “Autotrophism” and “Heterotrophism”. Use **autotrophs** and **heterotrophs** for organisms; use **autotrophic nutrition** and **heterotrophic nutrition** for nutritional modes. Photosynthesis uses light energy; chemosynthesis uses chemical energy. The replacement lesson makes this distinction explicit.

The source's Week Six MCQ 408 asks which listed animal is not polygastric. Cattle, sheep and goats are ruminants with four stomach compartments. Rabbit is a hindgut fermenter, not a ruminant or polygastric animal. The replacement lesson explains this and retains rabbit as the correct answer.

## Learner-delivery correction

Added `CORR-AG-T2-W06-AGRICULTURAL-ECOLOGY-REPLACEMENT`:

- Original row: `SS1-SRC-956594d97094:BODY:5e12e6d75046c73227b73e5a70eb56fd6a83ccbaf4d206b9dc3d4cc609e008f6`
- Replacement: `SUP-SS1-AGRICULTURAL-SCIENCE-T2-W06-AGRICULTURAL-ECOLOGY`
- The replacement covers ecology, autecology, synecology, ecosystems, biotic/abiotic components, producers/consumers/decomposers, food chains/webs, mono-cropping, mixed cropping, mixed farming, fish ponds, forests and savannas.
- Existing `SUP-SS1-AGRICULTURAL-SCIENCE-T2-W06-ECOSYSTEM-INTERACTIONS` remains as a focused companion supplement.
- Source bytes remain unchanged.

## Evidence

- OpenStax, *Biology 2e*, ecology chapter: https://openstax.org/details/books/biology-2e
- FAO, *Manual on Polyculture and Integrated Fish Farming*: https://www.fao.org/4/x5744e/x5744e00.htm
- University of Florida IFAS, *Dissolved Oxygen for Fish Production*: https://edis.ifas.ufl.edu/publication/FA002
- Merck Veterinary Manual, *Biology and Diseases of Rabbits*: https://www.merckvetmanual.com/exotic-and-laboratory-animals/rabbits/biology-of-rabbits

## Release gate

The replacement lesson remains `content_approval: PENDING` and `verification: DEFERRED`. The learner route withholds the original source row until the subject package and replacement lesson pass genuine approval and verification. No production import or authenticated learner-route observation is claimed.
