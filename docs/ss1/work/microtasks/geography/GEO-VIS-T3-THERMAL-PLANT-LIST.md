# GEO-VIS-T3-THERMAL-PLANT-LIST — thermal plant/state/fuel verification

Status: **IMPLEMENTED — SOURCE STRUCTURE PRESERVED AND PLANT FACTS VERIFIED**. The original source wording is retained; this is a separate normalized verification view.

## Source structure
- Source: `SS1-SRC-74a10d374306`
- Archive member SHA-256: `54931bac00bfde6b2ff5d32e2b645872af74dc32d8e0f69d0585f40e443726c6`
- Week Ten: antiword lines 1431–1493; block SHA-256 `5d33e30e1276f887f88a50c80c5a5ed6ececb87aa70b692dc791e5f0eb7dead1`
- The four named entries are Egbin, Ijora, Sapele and Oji.
- The original is tab-aligned text, not a Word table. The source list remains unchanged. The normalized table below preserves the requested plant/state/fuel fields and adds a dated status note.

## Verified table

| Plant | State | Fuel type | Status / qualification |
|---|---|---|---|
| Egbin | Lagos | Gas (NERC grid-plant record); operator also identifies dual-fuel natural gas and high-pour fuel oil | Listed by NERC as an operational licensed grid-connected plant as of December 2025. NERC reported 49.62% plant availability factor for 2025; “operational” does not mean every unit runs continuously. |
| Ijora | Lagos | Historical gas-turbine / natural-gas phase; earlier site phases had different fuels | Historical generation site, not listed among NERC's 30 operational licensed grid-connected plants as of December 2025. UNIDO's site investigation records generation ending at Site A in 1978 and Site B in 1990. Site A was a transformer-repair station and Site B housed offices/laboratory in the report's 2009/2012 context. |
| Sapele | Delta | Gas | Listed by NERC as operational licensed grid-connected plant(s) as of December 2025: Sapele Steam_1 and Sapele_2. NERC reported 3.85% availability for Sapele Steam_1 and 18.87% for Sapele_2 in 2025. |
| Oji River | Enugu | Coal (historical) | Historical coal-fired station; not listed among NERC's 30 operational licensed grid-connected plants as of December 2025. The Federal Ministry of Works states that no coal power was being produced and that the old Oji River coal plant had been dismantled. |

## Evidence and date handling

1. **NERC 2025 Annual Report**, Table 8, pp. 71–72: as of December 2025, NERC lists 30 operational licensed grid-connected plants. Egbin is listed in Lagos with gas fuel; Sapele Steam and Sapele GT NIPP are listed in Delta with gas fuel. Table 23, p. 142, records 2025 plant availability factors: Egbin 49.62%, Sapele_2 18.87%, Sapele Steam_1 3.85%. The report distinguishes licensed operational status from actual availability.
   - https://nerc.gov.ng/media/nerc-2025-annual-report/
   - Report copy: https://docs.publicnow.com/viewDoc?filename=78337%5CEXT%5C759F931F93682FEEC404831798CE6729AE88305D_6B5C02E5BE2BB5D5F61F723042F2346880604481.PDF
2. **Energy Commission of Nigeria**, Director-General Prof. E. J. Bala, “Energy and Sustainable Development in Nigeria: Issues and Prospects”, presentation to National Defence College, 10 November 2015, p. 10 / report lines 1029–1044: records the pre-reform stations, including Egbin (thermal steam/natural gas/HPFO), Sapele I and II (gas turbine/natural gas), Ijora (gas turbine/natural gas) and Oji (coal). This is historical context, not current operating status.
   - https://energy.gov.ng/papers/Energy%20and%20Sustainable%20Devt%20in%20Nigeria_Issues%20and%20Prospects%2C%20Defence%20College_Nov_2015.pdf
3. **UNIDO**, *Persistent Organic Pollutants: Contaminated Site Investigation and Management Toolkit*, Ijora case study, pp. 70–72 / lines 2550–2564: identifies Ijora in Lagos, records generation cessation at Site A in 1978 and Site B in 1990, and describes the later site uses.
   - https://downloads.unido.org/ot/46/95/4695930/TYRKKO_ENV_SCD_NIR_2012_104061.pdf
4. **Federal Ministry of Works**, “Power Sector Reforms — Challenges and the Way Forward”, Federal Minister's 2017 public lecture, lines 221–224: states that no coal power was being produced at the time and that the former Oji River coal power plant in Enugu had been dismantled.
   - https://www.fmw.gov.ng/read/254
5. **NERC 2025 Annual Report**, Table 8 absence: Ijora and Oji do not appear in the list of 30 operational licensed grid-connected plants as of December 2025. Absence from that table alone is not used as proof of closure; the historical status is supported by UNIDO and the Federal Ministry of Works evidence above.

## Interpretation rules

- Do not label Ijora or Oji as currently operating power stations.
- Do not present Ijora as having one fuel across its entire history; the 2015 Energy Commission table describes its gas-turbine/natural-gas phase, while the site's earlier stages used other fuels.
- Do not state that Egbin or Sapele runs continuously. NERC's availability data shows plant output availability changes.
- Keep capacities, fuel and status time-stamped. Do not copy the 2015 installed capacities into a current table.
- The original tab-aligned source list is preserved as source evidence; this verification table is a separate normalized view.

## Release state
- Source structure: preserved and documented
- Plant names, states, fuel context and historical/current status: verified against the dated sources above
- Content approval: PENDING
- Verification/testing of the application importer and rendered lesson: DEFERRED
- No test, importer, database or device run was performed.
