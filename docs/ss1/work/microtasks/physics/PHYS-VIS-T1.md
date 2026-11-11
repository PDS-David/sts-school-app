# PHYS-VIS-T1 — First Term source visual inventory

Status: `IMPLEMENTED_TESTING_DEFERRED`.

## Source identity and rendered evidence

- Source member: `SSS 1/1st Term SS1_/1ST TERM S1 PHYSICS.doc`.
- Member SHA-256: `cb61f336ac93a3fbbb820d6c9b4adc0703e7363aff7659b7953a75bdb92f2206`.
- Archive SHA-256: `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`.
- Rendered PDF: 35 pages. The original source archive was hash-verified before rendering.
- Binary inspection in `PHYS-WK-T1-W01.md`: 76 embedded PNG images and 4 JPEG streams in the .doc package. The rendered PDF contains 52 raster image objects on pages 1, 2, 4, 5, 9, 11, 12, 14, 16, 18, 20, 21, 22, 27, 28, 29, 33 and 34. PDF raster counts are not the same as original .doc image counts: LibreOffice composites some items and renders some figures as vector shapes.

## Page/parsed-week inventory

| PDF pages | Parsed week / source region | Visual content and disposition |
|---|---|---|
| 1 | Cover | Tutor logo/branding and contact details. Identified as advertising/page furniture; not copied into the student package or Git. |
| 2 | Scheme of work | Scheme table and page branding; scheme is indexed in the package. |
| 3–5 | Week One | Tables of fundamental/derived quantities, SI units, dimensions and formulae; embedded equation/table images. Corrected text/formula equivalents are in `SUP-SS1-PHYSICS-T1-W01-CONSOLIDATED`; original images are not copied. |
| 6–9 | Week Two | Measurement instruments; vernier and micrometer examples; theory diagrams. The source Fig. 3.3 vernier figure is partly cut by the page break; Fig. 3.4 micrometer is visible. Theory micrometer readings are 3.67 mm and 3.25 mm; theory vernier readings are 1.95 cm and 1.68 cm. Weekend assignment diagrams 3, 7 and 10 are absent from the rendered PDF; original replacement SVGs are supplied in the consolidated lesson. |
| 10–12 | Week Three | Motion and circular-motion illustrations/figures; vector and force representations. Follow-up original diagram task appended. |
| 13–15 | Week Four | Friction diagrams and force/surface interaction illustrations. Follow-up original diagram task appended. |
| 16–24 | Weeks Five and Six | Scalar/vector representations, distance/displacement and speed/velocity-time graph groups, graph axes and compass/gradient text-box content. Follow-up graph/vector task appended. |
| 25–26 | Week Seven | Density and relative-density teaching illustrations/tables. Follow-up task appended. |
| 27–29 | Week Eight | Pressure, upthrust, Archimedes' principle and floatation diagrams/illustrations. Follow-up task appended. |
| 30–32 | Week Nine | Work, energy, power and energy-conversion teaching blocks; associated formula/diagram content. Follow-up task appended. |
| 33–35 | Week Ten | Viscosity/flow and terminal-velocity diagrams. Follow-up task appended. |

The source's text-box stream includes graph labels `V(m/s)`, `t(s)`, `20m/s`, a gradient note and a compass rose; these are not all present in the WordExtractor body stream. They are mapped to the Weeks Five/Six graph cluster above. The original source's header/footer branding names an individual tutor and includes contact information; those details are deliberately not transcribed or reproduced.

## Asset disposition

- Week One: corrected tables, symbols and derivations are supplied in the consolidated replacement; no tutor image is copied.
- Week Two: the existing vernier asset plus three original replacement practice diagrams are registered; original missing weekend figures are not claimed as recovered.
- Weeks Three–Ten: the source figures are inventoried by page/week cluster but have not all been replaced by authored equivalents. Follow-up tasks below own those clusters.

## Follow-up tasks

- `PHYS-VIS-T1-MOTION-FRICTION`: original motion/circular-motion and friction diagrams, PDF pages 10–15 (Weeks Three/Four).
- `PHYS-VIS-T1-GRAPHS-VECTORS`: original vector and distance/displacement/speed/velocity graph set, pages 16–24 (Weeks Five/Six).
- `PHYS-VIS-T1-DENSITY-PRESSURE`: density/relative-density, pressure, upthrust and floatation diagrams, pages 25–29 (Weeks Seven/Eight).
- `PHYS-VIS-T1-WORK-VISCOSITY`: work/energy/power and viscosity/terminal-velocity diagrams, pages 30–35 (Weeks Nine/Ten).

## Validation boundary

All 35 pages were rendered and reviewed as page images/contact sheets; selected measurement and equation pages were inspected at higher resolution. Raster-object counts were obtained with `pdfimages -list`. This is a visual inventory, not a claim that every figure has been recreated or that original tutor artwork may be redistributed. Original sources remain unchanged. Formal package tests, importer and device verification remain DEFERRED.
