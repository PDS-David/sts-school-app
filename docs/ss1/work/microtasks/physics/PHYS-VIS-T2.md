# PHYS-VIS-T2 — Second Term source visual inventory

Status: `IMPLEMENTED_TESTING_DEFERRED`.

## Source identity and rendered evidence

- Source member: `SSS 1/2nd Term SS1_/2ND TERM S1 PHYSICS.doc`.
- Member SHA-256: `3941deccd3f4c68065a496ede3752784d2535e3c03608450a12b2a7c4a0b9fa7`.
- Archive SHA-256: `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`.
- Rendered PDF: 24 pages. `pdfimages -list` reports 30 raster image objects across pages 1–24, plus vector drawings/shapes.

## Page/parsed-week inventory

| PDF pages | Parsed week / source region | Visual content and disposition |
|---|---|---|
| 1 | Cover | Tutor logo/branding and contact details; identified as page furniture, not copied. |
| 2 | Scheme of work | Scheme table; indexed in the package. |
| 3–7 | Temperature and thermometry | Temperature measurement, thermometer diagrams/scales and fixed-point material. No dedicated authored thermometer-scale set yet; follow-up task appended. |
| 8–10 | Expansivity | Linear/area/volume expansivity equations and anomalous-water content. Page 8 visibly prints X where α is required; page 9 uses Y for cubical expansivity and leaves the ratio incomplete. Page 9 asks for an anomalous-water diagram but supplies none. The replacement lesson corrects the notation and adds original graph asset `PHYS-ASSET-T2-W04-ANOMALOUS-WATER-GRAPH`. |
| 11–13 | Heat transfer | Conduction, convection and radiation illustrations; the original authored vacuum-flask SVG supports part of this cluster. Additional heat-transfer diagrams remain a follow-up. |
| 14–18 | Electrostatics | Charging, electroscope and electric-field diagrams. Existing gold-leaf electroscope and electric-field-pattern assets cover key concepts; charging-method illustrations remain a follow-up. |
| 19–24 | Gravitation | Gravitational field/field-line and potential-related diagrams. No complete original equivalent set yet; follow-up task appended. |

The source has tutor branding/contact information in its page furniture. No name, phone number, email or logo has been copied into the package.

## Asset disposition

- Week Three thermal expansion: original particle-spacing SVG exists.
- Week Four anomalous water: new original graph exists; source notation defect is corrected by `CORR-PHYSICS-T2-W04-EXPANSIVITY`.
- Week Five heat transfer: vacuum-flask SVG exists; other heat-transfer diagrams still need original equivalents.
- Week Seven electrostatics: gold-leaf electroscope SVG exists; charging-method diagrams still need original equivalents.
- Week Nine electric field: original field-pattern SVG exists.
- Gravitation pages 19–24: original equivalent diagrams still needed.

## Follow-up tasks

- `PHYS-VIS-T2-THERMOMETRY`: thermometer types, fixed points and temperature-scale diagrams, pages 3–7.
- `PHYS-VIS-T2-HEAT-TRANSFER`: conduction/convection/radiation diagrams, pages 11–13.
- `PHYS-VIS-T2-ELECTROSTATICS`: charging methods and induction diagrams, pages 14–18.
- `PHYS-VIS-T2-GRAVITATION`: gravitational field lines and potential diagrams, pages 19–24.

## Validation boundary

All 24 pages were rendered and reviewed as page images/contact sheets; expansivity pages 8–9 were inspected at higher resolution. Raster-object counts were obtained with `pdfimages -list`; vector shapes are not included in that count. This is a visual inventory, not a claim that every source figure has been recreated. Original source bytes and tutor branding remain untouched. Formal package tests, importer and device verification remain DEFERRED.


## Completion update — original equivalents registered

The four bounded visual tasks are now implemented with original SVG assets registered in physics.json: `PHYS-ASSET-T2-THERMOMETRY`, `PHYS-ASSET-T2-HEAT-TRANSFER`, `PHYS-ASSET-T2-ELECTROSTATICS` and `PHYS-ASSET-T2-GRAVITATION`. Together with the earlier thermal-expansion, anomalous-water, vacuum-flask, electroscope and electric-field assets, the inventoried teaching clusters now have original equivalents. These are not copies of source art. Content approval remains PENDING and verification DEFERRED.
