# GEO-FACT-T3-LOCATION-POPULATION — Nigeria location, area, population and administrative history findings

Status: **IMPLEMENTED_TESTING_DEFERRED** (fact audit and source map; source text unchanged).

## Source scope and locators
- Source: Third Term SS1 Geography; source member and line map in `GEO-INV-T3.md`.
- Country location/size: lines 30-65.
- Political division and administrative chronology: Week One/Two source sections.
- State/capital/title-slogan table: lines 85-132 (37 data rows plus header, 38×4 Word table).

## Findings register
| Topic / source span | Finding |
|---|---|
| Coordinates, lines 30-65 | Published Nigerian government sources do not all use identical extreme coordinate values. The Energy Commission of Nigeria's geography summary gives approximately 4°01′–13°09′N and 2°02′–14°30′E; NACA material gives approximately 4°16′–13°53′N and 2°40′–14°41′E. Do not combine these endpoints into one “exact” coordinate without a defined coastline/boundary dataset and map scale. Treat coordinates as approximate and cite the chosen source. |
| Land area, lines 30-65 | 923,768 km² is widely repeated in Nigerian government reference material. Preserve the source value but state that it is an approximate national area and identify the reference source. |
| Boundaries, lines 30-65 | Nigeria borders Benin to the west, Niger to the north, Chad to the north-east and Cameroon to the east; the Atlantic/Gulf of Guinea lies to the south. Use official boundary mapping for detailed border geometry, not only a text list. |
| Population/census | Any 2006 census figure is historical, not a current population estimate. NPC's census-history pages describe the 2006 exercise and distinguish provisional and published results. Do not label a 2006 figure as Nigeria's current population. If a number is used, specify whether it is provisional or final and cite the relevant NPC publication. |
| Administrative chronology | The standard federal-state sequence to verify against primary government records is 12 states (1967), 19 (1976), 21 (1987), 30 (1991), and 36 (1996), with the FCT established separately. Do not confuse creation of the FCT with relocation of the federal capital to Abuja (1991). |
| Current administrative count | Nigeria has 36 states and the Federal Capital Territory; the country is divided into 774 Local Government Areas. Confirm any table row names and capital spellings against the current National Bureau of Statistics/NPC/official state sources. |
| State capitals/title/slogan table, lines 85-132 | The source's 37 state/FCT rows must remain in a 38×4 table. State/capital spelling can be checked against official government sources; “title/slogan” is not necessarily an official statutory title. Do not present a slogan as an official state motto unless the state government confirms it. The visual/table task `GEO-VIS-T3-STATE-CAPITALS-TABLE` remains separate and blocked pending source rendering/inspection. |

## Evidence sources
- National Population Commission, census history: https://2023census.gov.ng/pages/history-of-census
- National Population Commission, institutional history: https://nationalpopulation.gov.ng/history
- Energy Commission of Nigeria, *Energy Requirement for Vision 2020*, geography/climate section: https://energy.gov.ng/releases/Energy%20Requirement%20for%20Vision%202020%20III%20_%20Revised%20Ed.pdf
- National AIDS and STIs Control Programme / Federal Ministry of Health, *National HIV/AIDS Indicator and Impact Survey* (study area and 2006 census reference): https://naca.gov.ng/wp-content/uploads/2020/11/NAIIS-Report-Final-version_for-printing_03Sept2020.pdf
- Nigeria High Commission, Canberra, country fact file: https://canberra.foreignaffairs.gov.ng/about-nigeria.html

## Disposition
All source claims are flagged with line groups and source leads. Coordinate discrepancies, census-date handling and unofficial slogans remain explicit. No current population estimate, slogan, boundary or chronology correction is silently substituted. Original source text/table is unchanged; no approval or verification is claimed.
