# BIO-FACT-T1-W05-EQUATIONS — photosynthesis equations review and remaining gate

Status: **BLOCKED — PARTIAL FACT REVIEW COMPLETED**. The photosynthesis portion is reviewed; the separate chemosynthesis equation at block 713 is not reviewed here and remains gated for qualified teacher review. Original source forms are unchanged.

## Source identity and exact photosynthesis forms

- Source: `SS1-SRC-422e0e6ddde9`, 1st Term SS1 Biology.
- Exact member: `SSS 1/1st Term SS1_/BIOLOGY 1 alfa term - Copy.docx`; SHA-256 `936fb6374ca206d17275d6e9be6ff0947219af221b144aafc162bb1f78087ce8` (verified).
- The existing visual disposition `BIO-VIS-T1-PHOTOSYNTHESIS-SCHEME` records 13 DrawingML arrows and 13 VML fallbacks; its private render of pages 25-26 confirms the direction of the source flow. No source drawing was changed.

| Block | Exact source form / label | Evidence-based disposition |
|---|---|---|
| 683 | `6CO2 + 6H2O → C6H12O6 + 6CO2`, with sunlight energy and chlorophyll | Product-side `6CO2` is inconsistent with the source prose identifying oxygen as the by-product and with the standard photosynthesis equation. The glucose-specific corrected form is `6CO2 + 6H2O → C6H12O6 + 6O2`, using light energy. |
| 689 | `2H2O → 2OH− + 2H+`; `ADP + PI → ATP` | The source presents a simplified ion/intermediate scheme. Modern descriptions of the light reactions explain that water oxidation supplies electrons and protons and releases oxygen; ATP is formed from ADP and inorganic phosphate using the light-generated proton gradient. Use standard `Pi` notation in a supplement, while retaining the source form in the source record. |
| 693 | `2H+ + 2e− → 2H` | This is the source's simplified hydrogen-atom shorthand. Modern photosynthetic electron transport describes electrons being transferred through the photosystems and used in NADP reduction; do not present the source shorthand as a complete modern pathway. |
| 695 | `2H + NADP → NADPH2` | This is older shorthand. OpenStax describes the oxidized carrier as NADP+ and its reduced form as NADPH. A delivery supplement should use the modern carrier notation and preserve this original source expression separately. |
| 697 | `4OH → 2H2O + O2` | The source does not visibly show the negative charge on hydroxide or the electrons in the standalone expression. A balanced hydroxide-oxidation half-reaction includes the electron products; the source's adjacent prose discusses electron transfer separately. Do not use the displayed line as a complete standalone balanced equation. |
| 700 | `CO2 + 2H2O → (CH2O) + H2O + O2`, with light/chlorophyll and sugar/water/oxygen labels | This is a balanced generic carbohydrate-unit representation. It differs from block 683 because it uses `(CH2O)` rather than a glucose formula; it is not itself the same typo. After cancelling water on both sides, it expresses the general form `CO2 + H2O → CH2O + O2`. |

## Authoritative evidence

1. **OpenStax Biology 2e, 8.1 “Overview of Photosynthesis”**  
   https://openstax.org/books/biology-2e/pages/8-1-overview-of-photosynthesis  
   Confirms sunlight, carbon dioxide and water as photosynthesis inputs, identifies chlorophyll as the light-absorbing pigment in thylakoid membranes, and describes carbohydrate production with oxygen release.

2. **OpenStax Biology, 8.2 “The Light-Dependent Reactions of Photosynthesis”**  
   https://openstax.org/books/biology/pages/8-2-the-light-dependent-reactions-of-photosynthesis  
   Explains that water splitting supplies electrons and protons and releases oxygen; the light reactions produce ATP and reduce NADP+ to NADPH. It describes ATP formation from ADP and inorganic phosphate using the proton gradient.

## Safe scope boundary and unresolved item

The separate chemosynthesis equation at source block 713 is not reviewed or corrected in this report. It involves a hazardous chemical reaction, so it remains outside the assistance provided here and must be reviewed by a qualified Biology teacher using an approved reference. No practical handling, preparation or use instructions are provided.

The queue task remains **BLOCKED** until that qualified review is recorded. No correction is bound to the source, no source wording is changed, and no student-facing approval is claimed.

## Verification boundary

- Source member hash and original visual report reference: verified.
- Photosynthesis source forms and visual flow: inspected.
- OpenStax references: opened and compared for the stated photosynthesis claims.
- Separate block 713 chemosynthesis equation: not reviewed.
- Importer/compiler, package tests, typecheck, database rehearsal and application/device rendering: not run; testing remains deferred by owner.
