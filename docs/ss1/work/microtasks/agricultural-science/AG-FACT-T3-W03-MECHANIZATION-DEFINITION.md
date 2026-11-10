# AG-FACT-T3-W03-MECHANIZATION-DEFINITION — Agricultural Science, Third Term Week Three

Status: **IMPLEMENTED_TESTING_DEFERRED**. The first sentence of the source definition is broadly sound, but the second sentence wrongly combines mechanization technology with non-mechanical farm inputs. A precise learner-facing definition is recommended.

## Source integrity and exact wording
- Composite archive SHA-256: `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e` — verified.
- Exact Third Term DOCX member `SSS 1/3rd Term SS1_/3RD TERM S1 AGRICULTURAL SCIENCE.docx`, SHA-256 `9e920bff3769d9d977c4b2849cc77c769b6033be9176f4f6b35c27935999e12a` — verified.
- Definition block 289 SHA-256: `04abe1d6c3c22dbdb706a839def04160a9c5e099692addfa21a0ec29ded779a8`.
- Exact source: “Mechanization refers to the application of engineering principles and technology in agricultural production. It is the use of machines such as tractors, ploughs, harvesters, harrow, planter etc as well as the use of farm inputs such as insecticides, improved seeds, fertilizer etc.”

## Conceptual boundary
- **Mechanization technology:** agricultural tools, implements, equipment and powered machinery used to carry out farm operations. FAO describes agricultural mechanization as the application of tools, implements and powered machinery, using manual, animal or motorized power. It includes tools from basic hand equipment through more sophisticated machines, and covers land development, crop production, harvesting, storage preparation, on-farm processing and rural transport.
- **Other agricultural production inputs:** seeds, fertilizers and crop-protection chemicals (including insecticides) are production inputs, but they are not themselves mechanization equipment or machinery.
- **Important distinction:** a seed drill/planter, fertilizer spreader or pesticide sprayer is mechanization equipment; the seed, fertilizer or insecticide being delivered is the separate farm input. Mechanization can improve the precision and timeliness of applying inputs without turning those inputs themselves into mechanization.
- FAO's 2013 *Agricultural Mechanization in Sub-Saharan Africa: Guidelines for Preparing a Strategy* states that mechanization means tools, implements and powered machinery, with manual, animal and motorized power sources (section 1.2.1). It explicitly distinguishes mechanization from other inputs: it is “not a single input like seed and fertilizer” but a series of production tools used across phases of production. Later it says higher mechanization used together with other inputs such as improved seeds and fertilizers can increase productivity (section 3.2). This is direct evidence that the source's examples have been conflated.
- FAO's 2006 *Farm Power and Mechanization for Small Farms in Sub-Saharan Africa* likewise describes mechanization as tools, implements and machinery applied to improving labour and land productivity, with human, animal and motorized power.

### Authoritative sources
- Houmy, K., Clarke, L.J., Ashburner, J.E. & Kienzle, J. (2013), *Agricultural Mechanization in Sub-Saharan Africa: Guidelines for Preparing a Strategy*, FAO, Integrated Crop Management Vol. 22, Rome. Section 1.2.1, lines/pages 1–2; section 3.2. https://www.fao.org/4/i3349e/i3349e.pdf
- Sims, B.G. & Kienzle, J. (2006), *Farm Power and Mechanization for Small Farms in Sub-Saharan Africa*, FAO Agricultural and Food Engineering Technical Report 3, Rome. https://www.fao.org/4/a0651e/a0651e00.pdf
- FAO, “What is sustainable mechanization?” Current overview confirms that mechanization spans hand tools to motorized equipment and includes operations such as planting, weed control, precise fertilizer application, harvesting and processing. This illustrates the distinction between the equipment/process and the inputs it handles. https://www.fao.org/sustainable-agricultural-mechanization/overview/what-is-sustainable-mechanization/en/

## Recommended learner-facing wording
> **Agricultural mechanization** is the use of tools, implements and powered machinery—using human, animal or motor power—to carry out farm operations such as land preparation, planting, crop protection, harvesting, processing and transport. Seeds, fertilizers and insecticides are separate agricultural inputs; machines such as planters, fertilizer spreaders and sprayers are used to apply them.

This keeps the source's correct engineering/technology idea, clarifies that hand tools and animal power also count, and separates the machinery from the materials applied.

## Finding and disposition
- The source is correct that mechanization applies engineering principles and technology in agricultural production.
- The inclusion of “insecticides, improved seeds, fertilizer” as things used “as well as” machines within the definition is a conceptual error. They are separate production inputs, though mechanized equipment can plant or apply them.
- Recommend the learner-facing wording above. This is an evidence-based recommendation only; no teacher/owner approval is inferred and no source wording or delivery correction was applied.

## Changes and verification
- Added this evidence note and marked `AG-FACT-T3-W03-MECHANIZATION-DEFINITION` `IMPLEMENTED_TESTING_DEFERRED`.
- Verified the composite archive and exact Third Term DOCX member hashes; inspected block 289 directly in the DOCX XML and recomputed its hash.
- Compared the source wording with FAO agricultural-mechanization definitions and explicit distinctions between mechanization, seeds and fertilizers.
- No source bytes, package content, lesson body, answer key, correction binding, asset, shared schema/compiler or other subject was changed.
- No tests, importer, TypeScript checks, DB, learner rendering or device checks were run; testing remains deferred.
