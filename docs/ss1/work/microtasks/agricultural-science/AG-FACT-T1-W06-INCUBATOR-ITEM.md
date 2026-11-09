# AG-FACT-T1-W06-INCUBATOR-ITEM — Agricultural Science, First Term Week Six

Status: **IMPLEMENTED_TESTING_DEFERRED**. Authoritative Nigerian and international classifications establish that a poultry incubator is agricultural/livestock machinery. The original “not a farm machine” item is ambiguous and should be corrected or withdrawn.

## Source integrity and exact item
- Composite archive SHA-256: `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e` — verified.
- Exact First Term DOCX member: `SSS 1/1st Term SS1_/1ST TERM S1 AGRICULTURAL SCIENCE.docx`; SHA-256 `df1b516cdd8855d069a329d7aa627dbd0dcd3612dd10d254c53af9cb93a56526` — verified.
- Week Six Weekend Assignment Q1, block 519: “Which of these is not a farm machine? A. planter B. incubator C. sowing machine D. plough”.
- The source does not define “farm machine”, distinguish machinery from implements, or specify crop-field versus livestock/poultry machinery.

## Nigerian curriculum evidence
- The National e-Agriculture Portal identifies itself as a collaboration of Nigeria's Federal Ministry of Agriculture and Rural Development and NITDA.
- Its SS1 lesson “Farm Machinery and Implements” explicitly lists **incubators** among farm machines (along with tractors, bulldozers, shellers, dryers and milking machines).
- In the same lesson, it separately lists **ploughs and planters** among tractor-coupled implements.
- This directly contradicts a key that treats an incubator as categorically not a farm machine. It also shows why the question needs a clear distinction between a machine and an implement.
- Source: [National e-Agriculture Portal — Agriculture Machineries](https://eagriculture.gov.ng/PrimaryProduction/AgricMachineries.aspx), Federal Ministry of Agriculture and Rural Development in collaboration with NITDA. The portal page was accessible in search indexing but timed out on direct open; the indexed page content identifies the two lists.

## FAO classification evidence
- FAO's World Census of Agriculture classification uses a broad definition of machinery/equipment for the agricultural census: machinery, equipment and implements used as inputs to agricultural production.
- Under its crop machinery/equipment category, FAO lists **ploughs**, **planters**, and **seed/fertilizer drills** (a type of sowing machine).
- Under its livestock machinery/equipment category, FAO lists **incubators** alongside milking machines, milk coolers and cream separators.
- Thus all four options belong to agricultural machinery/equipment when the scope is the whole farm. They serve different operations and branches of agriculture.
- Sources:
  - [FAO — Methods and Standards: Classification of machinery and equipment for the agricultural census](https://www.fao.org/statistics/methods-and-standards/agriculture/en), lines 153–170 (purpose and broad scope).
  - [FAO — System of Integrated Agricultural Censuses and Surveys, Appendix 6](https://www.fao.org/4/a0135e/A0135E10.htm), lines 763–835: plough/seed drill/planter under crop machinery and incubator under livestock machinery.

## United Nations statistical classification evidence
- The UN Statistics Division's CPC Version 2 classifies **poultry incubators and brooders** as subclass 44193 under class 4419, “Other agricultural machinery”, group 441, “Agricultural or forestry machinery and parts thereof”.
- The UN's HS 2017 heading 8436 is titled “Agricultural, horticultural, forestry, poultry-keeping, bee-keeping machinery” and explicitly includes poultry incubators and brooders; subheading 843621 is “Poultry incubators and brooders”.
- These are formal international classifications, not informal school terminology.
- Sources:
  - [UNSD CPC 44193 — Poultry incubators and brooders](https://unstats.un.org/unsd/classifications/Econ/Detail/EN/1073/44193), lines 12–35.
  - [UNSD HS 8436 — Agricultural and poultry-keeping machinery](https://unstats.un.org/unsd/classifications/Econ/Detail/EN/2089/8436), lines 12–36.

## Finding
- **An incubator is a farm machine/equipment item** when “farm machinery” is used broadly. It is specifically poultry/livestock machinery, used to provide controlled conditions for artificial egg incubation and hatching.
- A planter, sowing machine/seed drill and plough are crop-production machinery or implements. FAO's broad agricultural-census category includes both machinery and implements.
- If “farm machine” is being used narrowly to mean a powered field machine, the question still lacks a consistent definition: the planter and plough may be classified as tractor-coupled implements, while the incubator is a machine used in livestock production.
- Consequently, **incubator is not a defensible categorical exception**. The options mix crop-field and poultry/livestock machinery and the stem does not define the category boundary.

## Recommendation — no teacher decision presumed
**Correct the item or withdraw it; do not key “incubator” as simply “not a farm machine”.**

If the intended distinction is crop-field versus poultry/livestock equipment, use a precise stem such as:

> Which of the following is a poultry/livestock machine rather than a crop-field machine?
> A. Planter
> B. Incubator
> C. Sowing machine
> D. Plough

For that revised question, **B. Incubator** is the clear answer.

If the intended question is about farm machinery broadly, replace the stem with a question that tests the function of one machine rather than asking for a false exception. No answer key has been changed and no teacher/owner decision is presumed.

## Repository disposition and verification
- Marked `AG-FACT-T1-W06-INCUBATOR-ITEM` `IMPLEMENTED_TESTING_DEFERRED` and appended the sourced finding/recommendation to the Agricultural Science queue.
- The task's `allowed_write_paths` permit only the queue and this task note. The package open item remains unchanged pending owner action.
- Verified archive and exact First Term DOCX member hashes; inspected source block 519.
- Reviewed the Nigerian National e-Agriculture Portal, FAO agricultural machinery classification and UN Statistics Division CPC/HS classifications.
- Importer, TypeScript checks, database, learner rendering and tests were not run; testing remains deferred.
- No source bytes, lesson content, package data, schema/compiler or other subject files were changed.
