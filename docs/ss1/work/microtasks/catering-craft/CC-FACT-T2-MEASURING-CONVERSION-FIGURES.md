# CC-FACT-T2-MEASURING-CONVERSION-FIGURES — factual dependency review

Status: **IMPLEMENTED_TESTING_DEFERRED**. The table's values are reviewed and classified as supported, ambiguous or unsupported for general use. The source table remains unchanged; this task does not write corrected conversions.

## Exact source and visual locator

- Source: `SS1-SRC-f433169ca25c`; 2nd Term member SHA-256 `fd8115ff99dd3c370b86b4b5a326fe647e49328bc83f2d041c73f29b1b84ad59`.
- Full getBody() SHA-256: `371aa91970bceb96c354a002a3ac7a5384ca597c1c2f404f51f13096b7324c8a`.
- Table: lines 1337–1375; private LibreOffice render pages 33–34; two-column local/standard table, continued across the page break.
- Visual disposition: `CC-VIS-T2-W10-TBL6.md`.

## Findings by row group

| Source value | Finding | Evidence / qualification |
|---|---|---|
| ½ tsp = 2.5 mL; 1 tsp = 5 mL; ½ tbsp = 7.5 mL; 1 tbsp = 15 mL | **Supported as metric cooking measures** | FDA guidance defines 1 tbsp as 15 mL and 1 tsp as 5 mL for nutrition-labeling household measures. NIST's Metric Kitchen also lists 2.5 mL = ½ tsp, 5 mL = 1 tsp and 15 mL = 1 tbsp. |
| 15 mL = 60 drops | **Not universal** | Drop size depends on the liquid and dispensing device. The source gives no dropper or liquid specification. Do not use as a general conversion. |
| 1 cup (milk tin) = 150 mL | **Container-specific / unverified** | A named milk tin is not a standard cup. NIST's common US cooking cup is approximately 240 mL; a metric cup is 250 mL. A 150 mL tin may be a local container, but its exact product/size is not specified. |
| ½ cup = 75 mL | **Depends on the preceding 150 mL local cup definition** | It is arithmetically half of 150 mL, but it is not half of a standard 240/250 mL cup. Label the measure explicitly if retained. |
| 1 L = 1000 mL; ½ L = 500 mL | **Supported** | Exact metric relationships. |
| 4.5 L = 1 gallon | **Ambiguous; approximate Imperial only** | NIST gives 1 Imperial gallon = 4.54609 L and 1 US gallon = 3.785412 L. 4.5 L is a rounded approximation to an Imperial gallon, not a general gallon conversion. The source does not identify the gallon system. |
| 1 beer bottle = 750 mL | **Container-specific / unverified** | No bottle brand, product or bottle standard is identified. A bottle is not a universal volume unit; verify the exact container or remove this as a general conversion. |
| 1 heaped tbsp flour/cocoa/custard powder = 25 g | **Not a universal grouped conversion** | Ingredient bulk density and heap size vary; flour, cocoa and custard powder cannot be assumed to share one mass per heaped spoon without product-specific measurement. |
| 1 level tbsp rice/sugar/salt = 25 g; 1 heaped tbsp rice/sugar/salt = 30 g | **Unsupported as one grouped conversion** | Rice, sugar and salt have different bulk densities; level/heaped definitions also matter. FDA guidance treats metric equivalents as product-specific measurements, not a generic weight for unlike ingredients. |
| 2 heaped tbsp bread crumbs = 25 g | **Product/crumb-specific** | Crumb size, compaction and heap size affect mass; source does not define them. |
| ½ derica cup = 400 g; 1 big derica cup = 850 g | **Local container and commodity unspecified** | Nigeria's NBS household survey records large, medium and small derica as separate local measurement categories, not as a single universal capacity. A weight conversion also requires a named commodity and measured container. The source gives neither. |
| 1 large egg = 50 g | **Ambiguous shell-on vs edible portion** | USDA large eggs have a minimum net weight of 24 oz per dozen (about 56.7 g per egg in shell). The American Egg Board's guide lists about 50 g of contents per large egg. The source does not say whether 50 g means shell-on or edible portion, so it is not necessarily wrong but is underspecified. |

## Authoritative references

1. U.S. FDA, *Guidance for Industry: Guidelines for Determining Metric Equivalents of Household Measures*: 1 cup = 240 mL, 1 tbsp = 15 mL, 1 tsp = 5 mL; product-specific equivalents are measured rather than inferred from unlike ingredient densities. https://www.fda.gov/regulatory-information/search-fda-guidance-documents/guidance-industry-guidelines-determining-metric-equivalents-household-measures
2. NIST, *Metric Kitchen: Cooking Measurement Equivalencies*: common cooking spoon and cup equivalents, including ½ tsp = 2.5 mL, 1 tsp = 5 mL, 1 tbsp = 15 mL, and 1 cup = 240 mL. https://www.nist.gov/pml/owm/metric-si/metric-kitchen/metric-kitchen-cooking-measurement-equivalencies
3. NIST, *Guide to the SI, Appendix B.8*: 1 Imperial gallon = 4.54609 L; 1 US gallon = 3.785412 L. https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors/nist-guide-si-appendix-b8
4. World Bank Microdata catalog, Nigeria General Household Survey, Wave 2 (producer: Nigeria National Bureau of Statistics): local measures are recorded as separate categories—large, medium and small derica, milk cup, cigarette cup, mudu and others—supporting that these are locally distinguished containers rather than one universal standardized unit. https://microdata.worldbank.org/catalog/1952/variable/F81/V2548?name=s10bq5b
5. USDA Food Safety and Inspection Service, *How is the weight of a carton of eggs determined?*: egg size classes are minimum net weights per dozen, not a fixed individual egg dimension. https://ask.fsis.usda.gov/article/How-is-the-weight-of-a-carton-of-eggs-determined
6. USDA Agricultural Marketing Service, *Shell Egg Specification Guide for Volume Buyers*: Large is a 24 oz minimum per dozen, about 50 g edible content per egg in the guide. https://www.ams.usda.gov/sites/default/files/media/S01ShellEggSpecGuideforVolumeBuyers.pdf

## Disposition

- The review identifies supported metric spoon and litre relationships, but the table as a whole is **not safe to teach as a universal conversion chart**.
- Package open item `CC-T2-LOCAL-MEASUREMENT-CONVERSIONS` blocks delivery until the local containers, gallon system, ingredient weights and egg basis are specified or omitted from authored teaching.
- Original source values and their order remain unchanged. No correction, answer or replacement lesson is authored in this task.
- No tests, importer, database or device runs were performed.
