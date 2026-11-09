# AG-FACT-T3-W03-CROP-MECHANIZATION — Agricultural Science, Third Term Week Three

Status: **IMPLEMENTED_TESTING_DEFERRED**. The claim that “very few crops like maize, rice etc can be mechanized” is inaccurate as a general statement. Mechanization is available across many crop groups and operations, although its extent and suitability vary by crop, operation, farm size, terrain, equipment availability and cost.

## Source integrity and locators
- Composite archive SHA-256: `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e` — verified.
- Exact Third Term DOCX member `SSS 1/3rd Term SS1_/3RD TERM S1 AGRICULTURAL SCIENCE.docx`, SHA-256 `9e920bff3769d9d977c4b2849cc77c769b6033be9176f4f6b35c27935999e12a` — verified.
- Disadvantage block 315 SHA-256: `000cfd8cc5ad884db9b26aae10f72adad17daf71cadfbf4b164314f8ef170d62`.
- Weekend MCQ block 363 SHA-256: `e2ad98a182497e2212e5aaf6b35669b2857d4be2a897000b3c5a9fc58206604b`.
- Block 315 reads: “Very few crops like maize, rice etc can be mechanized.”
- Block 363 asks: “Which crop is best cultivated by mechanical means? A. Cassava B. Cocoa C. Maize D. Oil palm”.

## Evidence that mechanization is not limited to a few crops
- FAO defines sustainable agricultural mechanization broadly: it covers hand tools through motorized equipment and supports land preparation, seeding/planting, weed control, integrated pest management, precise fertilizer application, harvesting, storage preparation, on-farm processing, transport and marketing. The FAO framework is operation-based, not restricted to maize and rice.
- The International Institute of Tropical Agriculture (IITA) documents a commercially available mechanized cassava production system with purpose-designed two-row/four-row planters and harvesters. Its Nigeria/Africa-focused ProPAS entry reports mechanical planting and harvesting as available technologies and describes the crop-specific equipment. This is direct counter-evidence to the suggestion that mechanization is limited to maize and rice.
- FAO's post-harvest mechanization guidance gives further examples across crop groups: mechanized threshing/dehulling/milling for maize, rice and other cereals; root/tuber processing machinery for cassava and sweet potatoes; and solar dryers for horticultural produce such as fruits and vegetables.
- These examples demonstrate that mechanization is possible for a range of crops, even though the equipment, economic viability and degree of mechanization differ.

### Authoritative sources
- FAO, “What is sustainable mechanization?” Describes the broad range of operations covered by mechanization. https://www.fao.org/sustainable-agricultural-mechanization/overview/what-is-sustainable-mechanization/en/
- International Institute of Tropical Agriculture (IITA), ProPAS, “Mechanized Cassava Planting and Harvesting”. Describes commercially available cassava planters and harvesters and their use in African cassava production. https://propas.iita.org/en/solutions/mechanized-cassava-planting-and-harvesting/14/details/
- FAO, “On farm postharvest and value addition”. Describes mechanized grain processing, cassava/sweet-potato processing and horticultural crop drying. https://www.fao.org/sustainable-agricultural-mechanization/guidelines-operations/on-farm-postharvest-and-value-addition/en/

## Recommended correction to block 315
Replace the absolute and misleading statement with:

> Mechanization can be applied to many crops, but the degree of mechanization varies according to the crop, the farm operation, farm size, terrain, availability and cost of suitable machinery, and the suitability of the crop for machine operations. Maize and rice have well-developed mechanized operations, but they are not the only crops that can be mechanized. Cassava, for example, has purpose-designed mechanical planters and harvesters.

This retains the useful point that crop and context affect mechanization while removing the unsupported “very few crops” generalization.

## Related MCQ 363 — “Which crop is best cultivated by mechanical means?”
- The printed options are cassava, cocoa, maize and oil palm.
- The word **“best”** has no defined measure: it could mean the crop with the widest range of mechanized operations, the greatest adoption, the highest economic return, or the easiest planting/harvesting operation.
- Maize is a familiar mechanized cereal crop, but IITA documents purpose-designed mechanical planting and harvesting for cassava too. Therefore the item cannot be keyed uniquely from the general claim that only a few crops are mechanizable.
- If the intended answer is **C. maize**, make the stem operation- and crop-specific, for example:
  > Which of the following cereal crops is commonly grown using mechanized planting and harvesting?
  With the current options, maize is the only cereal crop. Alternatively, ask about a named implement or operation and choose options that produce one clearly defensible answer.
- Until revised, do not treat “best cultivated by mechanical means” as a uniquely answerable general question. This is an evidence-based recommendation; no key or source text was changed.

## Finding and disposition
- Block 315 is an overgeneralization and should be corrected in future learner-facing delivery.
- MCQ 363 is ambiguous because “best” is undefined and mechanization applies to both maize and cassava, among other crops.
- Recommend the qualified block-315 wording above and revise MCQ 363 to specify a crop group or farm operation. Do not silently change the source or infer teacher/owner approval.

## Changes and verification
- Added this evidence note and marked `AG-FACT-T3-W03-CROP-MECHANIZATION` `IMPLEMENTED_TESTING_DEFERRED`.
- Verified archive/member hashes; inspected blocks 315 and 363 directly in the DOCX XML and recomputed their hashes.
- Compared the source claim with FAO's current mechanization framework and IITA's documented cassava planting/harvesting technology.
- No source bytes, package content, lesson body, answer key, correction binding, asset, shared schema/compiler or other subject was changed.
- No tests, importer, TypeScript checks, DB, learner rendering or device checks were run; testing remains deferred.
