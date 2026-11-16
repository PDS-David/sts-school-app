# SS2 Agricultural Science — Draft Correction and Assessment Structure Audit

**Package examined:** `backend/src/db/ss23/subjects/agricultural-science.json`  
**Package blob examined:** `a35166244ce1a16c52aa2054be717ec8ccc5c70a`  
**Audit date:** 2026-11-16  
**Purpose:** Help the subject lead and specialists review corrections already present in the draft, without implying that any open item is approved or closed.

## 1. Assessment structure and provenance checks

A deterministic inspection of the merged package produced the following results:

| Check | Result |
|---|---:|
| Units | 19 |
| Practice/assessment records | 195 |
| Unique question IDs | 195 |
| Missing question, answer or explanation | 0 |
| Missing question locator or answer locator | 0 |
| Missing provenance records | 0 |
| Provenance IDs absent from package source registers | 0 |
| Marking totals that differ from the question mark value | 0 |
| Answers mislabelled as original-source answers | 0 |

Question-origin breakdown:

| Term | Total | Original-source questions | Authored supplements |
|---|---:|---:|---:|
| First Term | 150 | 128 | 22 |
| Second Term | 24 | 0 | 24 |
| Third Term | 21 | 0 | 21 |
| **Total** | **195** | **128** | **67** |

All 24 Second-Term and all 21 Third-Term practice records are labelled `AUTHORED_SUPPLEMENT`; neither term currently has a structured practice question labelled `ORIGINAL_SOURCE`. Their provenance points to the school source as topic/context evidence, not as proof that the question text was transcribed. The draft answers/marking criteria apply to these authored supplements only. The original source assessment prompts for T2 Weeks 1–9 and T3 Weeks 1–10 still need a page-by-page inventory, exact locators, one-to-one mapping and checked answer/marking guide. Until that work is done, do not describe the 45 authored questions or their answers as completed source-assessment reconciliation.

These checks establish structural completeness and arithmetic consistency only. They do not establish that an answer is factually correct, that the question is a faithful transcription, or that a teacher has approved the marking scheme.

### Repeated First-Term prompt wording

Four repeated prompt groups were found at distinct locators:

| Prompt wording | Locations |
|---|---|
| “What is weathering?” | Week One, Theory Q2(b); Week Two, General Evaluation Q3 |
| “What is farm machinery?” | Week Three, Evaluation 1 / Section B Q2(a); Week Six, General Evaluation Q4 |
| “What is crop rotation?” | Week Ten Crop Rotation Evaluation Q1; Week Ten General Evaluation Q3 |
| “List five principles of crop rotation.” | Week Ten Crop Rotation Evaluation Q2; Week Ten General Evaluation Q4 |

The records have different IDs and source locators. Do not delete or merge them solely because their wording repeats. Confirm against the original assessment pages whether each is intentionally repeated, whether the second is a cumulative review, or whether there is a transcription/assignment error. The supplied ZIP members could not be read through the current Library text interface during this audit; no new page-level verification is claimed.

## 2. Draft corrections already present — reviewer verification still required

The following points were checked directly against the merged package's lesson bodies and assessment answer records. They are **draft corrections already present**, not approvals or closures. The item IDs remain open until the required subject-lead/specialist evidence is recorded.

| Open item | Draft state found in package | Required human review still outstanding |
|---|---|---|
| `AG2-T1-SOIL-COMPOSITION` | Lesson identifies source discrepancy between 5% “living organisms” and a commonly used mineral-soil composition model. | Decide the class convention and how the source discrepancy is taught. |
| `AG2-T1-SOIL-TEXTURE-RANGE` | Lesson records that particle-size conventions differ; supplementary classification is identified. | Confirm convention to use for the class and assessment. |
| `AG2-T1-SOIL-LIMING` / `AG2-T1-W10-LIMING-GYPSUM` | Lesson and answers distinguish agricultural lime from gypsum; gypsum is not presented as an acidity-neutralising substitute. | Confirm the source annotation/correction and expected answer. |
| `AG2-T1-W03-TECHNICAL-REVIEW` | Lesson distinguishes PTO rotary-power transfer from drawbar/hitch pulling and distinguishes diesel compression ignition from petrol spark ignition. | Specialist must approve the source correction and the expected assessment response. |
| `AG2-T1-W04-05-HECTARE-CORRECTION` | Lesson says one hectare is 10,000 m²; the hectare answer selects 10,000 m². No wrong 100,000 m² answer was found in the package's teaching body or answer record. | Confirm correction for the class and ensure the source discrepancy is recorded accurately. |
| `AG2-T1-W04-05-SITING-REVIEW` | Lesson rejects a universal “poorest soil” rule and discusses stability, drainage, access and suitability. | Agriculture specialist must review and approve the siting guidance. |
| `AG2-T1-W06-IRRIGATION-CLASSIFICATION` | Lesson identifies drip as micro-irrigation, not overhead sprinkler irrigation. | Confirm the source comparison and expected answer wording. |
| `AG2-T1-W06-SURFACE-IRRIGATION-DRAINAGE-CONFLATION` | Lesson distinguishes irrigation water application from removal of excess water by drainage. | Approve the correction and assessment response. |
| `AG2-T1-W06-SALINITY-MANAGEMENT` / `AG2-T1-W06-DRIP-SALINE-WATER` | Lesson qualifies irrigation-water salinity, leaching and drainage rather than treating all water as salt-free or automatically suitable. | Specialist must review water-quality and drip-system qualifications. |
| `AG2-T1-W07-CLIMATE-ELEMENTS` | Drought is described as a climate-related hazard/water-shortage condition, not a basic climatic element. | Subject specialist to approve classification and assessment response. |
| `AG2-T1-W07-RELATIVE-HUMIDITY` | Relative humidity is defined as actual water-vapour pressure relative to saturation pressure at the same temperature, expressed as a percentage. | Subject lead to approve level of detail and marking expectation. |
| `AG2-T1-W07-TOPOGRAPHY-CLASSIFICATION` | Lesson describes topography as a physical/physiographic site factor while noting the school source's classification. | Decide how to teach the source convention versus technical classification. |
| `AG2-T1-W07-SOIL-TYPE-ABSOLUTES` | Sandy and clayey soil claims are qualified by structure, management, crop, water and drainage; no universal “cannot support plants” statement is taught. | Subject specialist to approve the qualifications. |
| `AG2-T1-W07-SOLAR-RADIATION` | Lesson distinguishes solar radiation, sunshine duration and heat. | Subject specialist to review terms and expected response. |
| `AG2-T1-W08-09-NITROGEN-CYCLE-TERMINOLOGY` | Lesson separates nitrogen inputs, transformations, plant uptake and loss pathways. | Specialist approval of the corrected cycle terminology remains open. |
| `AG2-T1-W08-09-CARBON-CYCLE-ACCURACY` | Lesson includes carbon storage and qualifies carbonate/leaching pathways. | Subject specialist to approve the cycle explanation. |
| `AG2-T1-W08-09-WATER-CYCLE-ACCURACY` | Lesson includes evaporation, condensation, precipitation, infiltration, percolation, groundwater and transpiration; it distinguishes principal from minor atmospheric pathways. | Subject specialist to approve the corrected sequence. |
| `AG2-T1-W10-BUSH-BURNING-MERITS` | Lesson does not teach soil sterilisation as a general benefit of bush burning and identifies soil-health risks. | Specialist to approve the correction and any source-linked assessment answer. |
| `AG2-T1-W10-ZERO-TILLAGE-DEFINITION` | An authored definition of zero tillage and its distinction from conservation agriculture principles is present. | Teacher review of the supplement and marking guide remains outstanding. |
| `AG2-T1-W10-TILLAGE-ORGANIC-MATTER` | Lesson distinguishes residue mixing from long-term organic-matter increase and notes risks from intensive tillage. | Specialist to approve the explanation. |
| `AG2-T1-W10-CROP-ROTATION-NITROGEN` | Lesson qualifies nitrogen fixation as dependent on suitable legumes and compatible microorganisms. | Subject specialist to approve the qualification. |
| `AG2-T1-W10-FACTOR-LOSS-CATEGORIES` | Lesson separates availability modifiers, transformations and actual nutrient-loss pathways. | Subject specialist to confirm and approve terminology. |
| `AG2-T1-W10-FLOODING-DEFINITION` | Lesson defines flooding as prolonged accumulation/inundation and relates it to waterlogging/drainage. | Subject lead to approve the definition and assessment response. |
| `AG2-T2-FLORICULTURE-SPECIES` | The body includes supplements that distinguish balsam as an herbaceous annual, cauliflower as a vegetable, and *Panicum maximum* as a grass/taxonomic synonym. “Carnality” remains unresolved and is not silently changed. | Verify original spelling from the source page and subject-lead review of the plant list. |
| `AG2-T2-DISEASE-TAXONOMY` | The body distinguishes disease symptoms from pathogen signs and identifies *Phytophthora* as an oomycete; several crop/pathogen examples are supported by external references. | Specialist must verify the entire causal-agent/vector/species table and control guidance. |
| `AG2-T2-PEST-TABLE` | The lesson uses integrated pest-management principles and makes pesticide use conditional on current Nigerian registration, label and safe-use checks. | Specialist must verify each pest identity, damage description and any retained control option against current sources. |
| `AG2-T3-ACCOUNTING-EXAMPLE` | Lesson and answer identify ₦2,000 as egg sales in the source data list and flag the table's “spent layers” wording as a likely transcription mismatch. | Teacher must confirm against the original page before approving the model solution. |
| `AG2-T3-FEED-THRESHOLD-ANTIBIOTICS` | Lesson distinguishes nutrients/feeds from veterinary medicines and does not teach antibiotics as nutrients or routine growth-promoting feed additives. | Subject lead must decide whether the source antibiotic section is omitted or moved into a separate veterinary-medicine context; review the feed classification basis. |

The table is a map to corrections already in the package. It does not update any open-item status or confer approval.

## 3. Items not resolved by this package scan

The following still require direct evidence/authority:

- Original document page for malformed First-Term General Evaluation Q5 (“List five factors coupled implements”).
- Whether the First-Term Week Eight source body covers both Weeks 8–9.
- Whether Second-Term examination event in Weeks 11–12 has a separate timetable/assessment record.
- Original source assessment question-by-question reconciliation for T2 and T3: inventory every original prompt and external textbook/WAEC task, preserve exact locators, verify answer/marking evidence, and inspect the Third-Term input-output table from its original page image. The structured 24 T2 and 21 T3 questions are authored supplements, not source transcriptions.
- Exact “carnality” wording from the original printed assessment.
- Weed nomenclature against the actual school source table.
- Verify the new school-authored farmstead layout schematic as a rights-safe substitute for the watermarked source farmstead image; confirm teacher acceptance and the formula figures' text equivalents. Other figure-to-paragraph mappings and reproduction/replacement decisions for source images, screenshots and watermarked assets remain open.
- Five newly drafted soil investigation procedures and the jar-test method: school apparatus, safety, actual procedure, expected observations, mark-by-mark guides and teacher approval.
- Owner's formal approval and reuse decision for the adapted source content.
- Specialist approval of the corrected factual content and assessment expectations.

## 4. Release and status boundary

- Keep all 47 Agriculture open items as recorded unless a specific source/evidence and required approval are added and the package is revalidated.
- Keep package status `PENDING`, units `DRAFT`, verification `DEFERRED` and student delivery blocked while any blocking item remains.
- The asset API must continue to reject unresolved `source-extract://` placeholders. The five local authored SVGs remain subject to their own approval/verification state.
- Do not infer that a question is source-verbatim simply because it has source provenance. The `question_origin` field controls this distinction.
- Do not deduplicate repeated source prompts without source-page confirmation.
- Do not move to SS2 Biology until the project's Agriculture gate is genuinely satisfied.

**This audit is a structural and draft-text review. It is not curriculum certification, teacher approval, owner acceptance or permission to release lessons to students.**
