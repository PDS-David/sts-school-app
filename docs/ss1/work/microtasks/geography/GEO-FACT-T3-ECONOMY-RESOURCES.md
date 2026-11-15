# GEO-FACT-T3-ECONOMY-RESOURCES — Nigeria transport, industry, population, agriculture, minerals and power findings

Status: **IMPLEMENTED_TESTING_DEFERRED** (dated fact audit and source map; source text unchanged).

## Source scope and locators
- Source: Third Term SS1 Geography; line inventory in `GEO-INV-T3.md`.
- Transport/industry: lines 606-992.
- Population: lines 993-1138.
- Agriculture: lines 1139-1285.
- Minerals: lines 1286-1430.
- Power projects/plants: lines 1431-1493.

## Findings register
| Topic / source span | Finding and required review |
|---|---|
| Transportation, lines 606-760 | Road, rail, water and air networks change over time. Any route, line length, port, airport or project status must be dated and checked against the responsible agency. Distinguish planned, under construction, operational and discontinued projects. |
| Industries, lines 761-992 | Industrial locations and production claims need dates and sources. Distinguish a historical industrial centre from a currently operating plant; avoid implying that all listed factories remain active. |
| Population, lines 993-1138 | Population figures tied to the 2006 census are historical. Current state/LGA population claims require a newer official projection or census; label projections and their base year clearly. |
| Agriculture, lines 1139-1285 | Crop distribution depends on agro-ecological zone, season, soil, irrigation and market. State-level crop lists are broad patterns, not exclusive production zones. Any yield/production number must be dated and sourced to NBS, FAO or an agricultural agency. |
| Minerals/mining, lines 1286-1430 | Mineral occurrences are not proof of commercial reserves or active mining. NGSA's Nigerian Mineral Resources Decision Support System provides geoscience/geoeconomic occurrence data; Ministry of Solid Minerals Development and Mining Cadastre records are needed for licences/operating status. Do not present an occurrence as a currently producing mine. |
| Power, lines 1431-1493 | Plant names, fuels, locations, ownership, capacity and operating status are time-sensitive. The earlier thermal-power list has a separate fact record in `GEO-VIS-T3-THERMAL-PLANT-LIST.md`; remaining hydro-project claims require project-specific official evidence. Do not use a plant's installed capacity as its actual generation. |
| Oil/gas and mining | Distinguish crude oil/natural gas extraction from solid-mineral mining. USGS's 2024 Nigeria mineral summary reports mineral commodities and the mining/quarrying sector; it notes that crude petroleum and natural gas dominate that sector's GDP contribution. Do not quote “mining GDP” without clarifying the statistical sector definition. |

## Evidence sources
- National Bureau of Statistics, *Annual Abstract of Statistics 2023*: https://microdata.nigerianstat.gov.ng/index.php/catalog/180/download/1354/Annual_Abstract_2023.pdf
- Nigeria Geological Survey Agency, Nigerian Mineral Resources Decision Support System: https://ngsa.gov.ng/decision-support-system/
- Nigeria Geological Survey Agency, geological/mineral maps: https://ngsa.gov.ng/geological-maps/
- Ministry of Solid Minerals Development, mining data and regulatory documents: https://www.msmd.gov.ng/
- U.S. Geological Survey, Nigeria 2024 mineral industry summary: https://www.usgs.gov/centers/national-minerals-information-center/nigeria
- National Population Commission, 2006 census history: https://2023census.gov.ng/pages/history-of-census
- Energy Commission of Nigeria, energy and power context: https://energy.gov.ng/releases/Energy%20Requirement%20for%20Vision%202020%20III%20_%20Revised%20Ed.pdf
- Nigerian Electricity Regulatory Commission: https://nerc.gov.ng/

## Disposition
The source claims are grouped by their exact line spans and each data family has a responsible official source lead. Historical and current status are separated; no plant, mineral, population or production figure is silently updated. The separate thermal-power record remains in force. No approval or verification is claimed.
