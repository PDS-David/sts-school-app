# PHYS-WK-T3-W03 — Third Term Week Three: electrical energy and power

Status: **IMPLEMENTED_TESTING_DEFERRED** — original registered source member inspected and reconciled; lesson and assessment coverage updated. Content approval remains pending and technical verification remains deferred.

## Registered source identity and integrity

- Source ID: `SS1-SRC-bed91bb4ef0e`
- Archive member: `SSS 1/3rd Term SS1_/3RD TERM S1 PHYSICS.doc`
- Registered member SHA-256: `bcd7daab57432b5c2b74a29e4afc1f162276e5fe360fab50345426fc3503e688`
- Retrieved from Physics CI artifact `physics-original-source-evidence`, artifact ID `13901498110`, run `43122782413`.
- Extracted original member size: 107,008 bytes; independently recomputed SHA-256 matches the registered manifest.
- Parsed row: index 2, `WEEK 3`; source label and task identity preserved.
- Parsed body ID: `SS1-SRC-bed91bb4ef0e:BODY:9fb67621489fdc88ab0f545f52b60d67d36c034d30a0513fe843a3dac9811de1`.
- Parsed body length: 2,352 characters; parsed body SHA-256: `9fb67621489fdc88ab0f545f52b60d67d36c034d30a0513fe843a3dac9811de1`.

## Source reconciliation

The original row contains three teaching sections: electrical energy, electrical power and buying electrical energy.

| Source objective / assessment | Student lesson coverage |
|---|---|
| Energy transferred: W = QV, W = VIt, W = I²Rt, W = V²t/R | Lesson section 1; Q01–Q03 |
| Electrical power: P = W/t = VI = I²R = V²/R | Lesson section 2; Q04–Q06 |
| Commercial unit kWh and conversion 1 kWh = 3.6 × 10⁶ J | Lesson section 3; Q07–Q08, Q14 |
| Appliance energy use and electricity cost at a stated tariff | Lesson sections 4–5; Q09–Q12 |
| Source evaluation: energy from a 12 V, 0.4 A headlamp for five minutes | Q03; answer 1,440 J |
| Source evaluation: four factors affecting wire resistance | New lesson section 6; Q20 |
| Weekend MCQ: current and resistance for 240 V / 60 W lamp | Q15–Q16 |
| Weekend MCQ: conductance of a 10 Ω resistor | Q17; answer 0.1 S |
| Weekend MCQ: SI unit of resistivity | New lesson section 6; Q19; answer Ω·m |
| Source theory: two appliance-billing scenarios | Q10–Q12; both worked with stated 60 currency-units/kWh example |

The original energy and power equations are dimensionally consistent. The source's commercial-cost expression `Cost = Pct/1000` is interpreted using P in watts, c as the tariff per kWh, and t in hours; division by 1,000 converts watts to kilowatts. The source's 1 kWh = 3.6 × 10⁶ J conversion is correct.

The source-week evaluation also asks about factors affecting resistance, and the weekend assignment asks for the SI unit of resistivity. These were not taught explicitly in the earlier supplement. The lesson now includes R = ρL/A, explains length, cross-sectional area, material/resistivity and temperature, and identifies Ω·m as the SI unit. This is assessment support and is not represented as an additional scheme-of-work heading.

The source provides questions but no official answer/marking key. The lesson supplies original keyed practice and worked equivalents; it does not claim to reproduce an official teacher key.

## Student lesson update

- Lesson ID: `SUP-SS1-PHYSICS-T3-W03-ELECTRICAL-ENERGY-POWER`
- Updated body SHA-256: `85d810c8059e1fe948136f8c1124c68d5f8e8ac0659bb5ffd50fcc24bcb5e94b`
- Practice: 20 questions; 45 marks; each question has an answer and marking criteria.
- Added coverage:
  - `COV-PHYS-T3-W03-OBJ-6`: factors affecting resistance — `IMPLEMENTED_EQUIVALENT`.
  - `COV-PHYS-T3-W03-OBJ-7`: SI unit of resistivity — `IMPLEMENTED_EQUIVALENT`.
- All existing lesson content and stable IDs retained.

## Explicit non-blocking source item

The reading assignment says `New school physics`, pages 81–82, but gives no author, publisher, edition or year. The registered source bundle does not contain the book. Package open item `PHYSICS-T3-W03-READING-ASSIGNMENT-EDITION` records this precise bibliographic gap. Do not invent a book edition or add an unverified resource link.

## Status and verification boundary

- Queue item: `PHYS-WK-T3-W03` → `IMPLEMENTED_TESTING_DEFERRED`.
- Package remains `PENDING`; this task does not certify Physics or the lesson for classroom use.
- Lesson content approval remains `PENDING`; verification remains `DEFERRED`.
- Original .doc bytes and source identity remain unchanged.
- Authoring checks: original member SHA-256, lesson body SHA-256 and 20-question marking arithmetic recorded.
- No tests were manually invoked during authoring. After the PR was opened, GitHub Actions automatically ran the standard PR gates: Physics package schema/content/regression tests, SS1 integrity, all-subject source-anchor/compiler audit, Agricultural Science, Catering Craft and Biology package checks all passed. The unrelated JSS3 `verify` job was still in progress at the last status check. No database-backed student acceptance or device validation is claimed.
