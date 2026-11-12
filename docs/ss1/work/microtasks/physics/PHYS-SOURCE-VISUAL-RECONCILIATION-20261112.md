# Physics original-source and visual reconciliation — 2026-11-12

## Evidence chain

The Physics verification workflow preserved the exact registered original .doc members in artifact `physics-original-source-evidence` from run [43122782413](https://github.com/PDS-David/sts-school-app/actions/runs/43122782413). The artifact contains the original .doc members plus full `word-extractor` body/header/footer text.

The three .doc SHA-256 hashes were recomputed locally from the downloaded artifact and match the package's source manifest:

| Term | Archive member | SHA-256 | Rendered PDF pages | Rendered PDF SHA-256 |
|---|---|---|---:|---|
| First | `SSS 1/1st Term SS1_/1ST TERM S1 PHYSICS.doc` | `cb61f336ac93a3fbbb820d6c9b4adc0703e7363aff7659b7953a75bdb92f2206` | 37 | `7b7ac33e2769b744c2d0c97565df2ff203e386bdd18550b6b3e7b63479074309` |
| Second | `SSS 1/2nd Term SS1_/2ND TERM S1 PHYSICS.doc` | `3941deccd3f4c68065a496ede3752784d2535e3c03608450a12b2a7c4a0b9fa7` | 22 | `8449178536ae1b4c729e582d6ce31811531dbd098a9536211d488a6dfbe065f7` |
| Third | `SSS 1/3rd Term SS1_/3RD TERM S1 PHYSICS.doc` | `bcd7daab57432b5c2b74a29e4afc1f162276e5fe360fab50345426fc3503e688` | 14 | `bcf6a54661738d773ae6c004a4d5da95dc9b1a8f6b0cdd307d914c69a80ec4cd` |

Rendering used LibreOffice headless on the exact hash-verified .doc files. PDF page numbers below refer to the rendered PDFs, not to the Word page footer. This matters because the first and second source documents use some week labels that do not align neatly with the scheme/week IDs; the original source-row IDs and labels are retained.

## Source-row page map and reconciliation

### First Term

| Package week/task | Original source label | Rendered pages | Reconciled content and visual evidence |
|---|---|---:|---|
| T1-W01 | WEEK ONE | 2–6 | Introduction to Physics; fundamental/derived quantities; SI units; dimensions and dimensional analysis. Page 4 shows the density, velocity and acceleration derivations as embedded equation images; page 5 shows complete dimensional equations for density, velocity, acceleration and force. These were omitted by text-only extraction but are visible in the rendered source. |
| T1-W02 | WEEK TWO | 6–10 | Length, time, mass, weight, volume, vernier callipers and micrometer screw gauge. Pages 8–10 contain vernier and micrometer figures. Example 3.2 adds 17.00 mm and 0.11 mm (=17.11 mm) but prints “17.1 mm or 1.711 cm”; the latter pair is inconsistent. The 20 m table-tennis-board example is implausible. The figures exist in the original rendered source, but several later assessment figures are low-resolution and not reliable enough to key without a clearer replacement. |
| T1-W03 | WEEK THREE | 10–14 | Motion in nature, types of motion, relative motion, circular motion, centripetal acceleration and force. Pages 11–13 show translational/random/rotational motion and circular-motion content, including `a = v²/r` and `F = mv²/r`; page 13 carries a 14-item weekend assignment. |
| T1-W04 | WEEK FOUR | 14–17 | Friction, normal reaction, static/dynamic cases, horizontal and inclined-plane force resolution, advantages/disadvantages and reduction of friction. Pages 15–16 contain free-body and inclined-plane diagrams and equations. |
| T1-W05-W06 | WEEK FIVE AND SIX | 17–26 | Combined source row covering scalar/vector ideas and motion/graph work. Graphs and vector/kinematics figures appear across pages 18–24. The combined source-row identity is preserved; no parser split is applied. |
| T1-W06 | WEEK SEVEN | 26–28 | Density and relative density. The source's printed week label is WEEK SEVEN while the package task maps the scheme objective as T1-W06; this source/scheme numbering distinction is recorded, not silently rewritten. |
| T1-W07 | WEEK 8 | 28–32 | Pressure, pressure in liquids, hydraulic press, Archimedes' principle, upthrust, apparent loss of weight and relative density. Pages 29–30 contain hydraulic-press and submerged-body/upthrust diagrams. |
| T1-W08 | WEEK 9 | 32–34 | Work, energy and power; source examples and evaluation. The source label is retained as WEEK 9. |
| T1-W09 | WEEK TEN | 34–37 | Viscosity, viscosity coefficient, terminal velocity experiment, steel ball in glycerine, velocity-time graph, Stokes' law, factors/effects/applications. Pages 35–36 contain the apparatus and terminal-velocity graph. |

**First-term visual inventory:** the rendered PDF contains 52 raster image objects. These include repeated branding/header material, embedded equation fragments and the instructional figure clusters listed above. The rendered pages also contain vector-drawn figures that are not counted as raster images. Formulae that appear missing in `getBody()` were visually recovered from pages 4–5; the lesson uses properly typeset equations rather than relying on flattened text.

### Second Term

| Package week/task | Original source label | Rendered pages | Reconciled content and visual evidence |
|---|---|---:|---|
| T2-W01 | WEEK ONE | 1–2 | Heat and temperature, effects and uses of heat. |
| T2-W02 | WEEK TWO | 2–5 | Thermometers, thermometric properties, evaporation and boiling. Page 5 contains the clinical thermometer figure. |
| T2-W03 | WEEK THREE | 5–7 | Expansion of solids, effects and applications. |
| T2-W04 | WEEK FOUR | 7–9 | Linear, area and volume expansivity and anomalous expansion of water. The text extraction emits X where α is defined, Y for volume expansivity, and an incomplete ratio; page rendering confirms the notation/layout issue in the source text layer. The lesson consistently uses α, β and γ. The 2 m brass-rod example uses ΔT = 100 K and α = 18×10⁻⁶ K⁻¹, so the final 2.0036 m is correct; the intermediate values printed as 0.00018 and 1.00018 should be 0.0018 and 1.0018. The later evaluation uses 1.8×10⁻⁶ K⁻¹, a tenfold mismatch with the example. |
| T2-W05 | WEEK FIVE | 9–12 | Heat transfer by conduction, convection and radiation, plus applications. Page 10 contains a conduction-rod figure. The source does not contain a clear vacuum-flask figure; the lesson's vacuum-flask SVG is an original teaching aid. |
| T2-W06 | WEEK SIX | 12–14 | Electric charge: production, types, distribution and storage. Page 13 contains the charge-concentration-at-a-sharp-point illustration. |
| T2-W07 | WEEK SEVEN | 14–16 | Gold-leaf electroscope, charging by induction and lightning protection. Page 14 contains the electroscope figure; page 15 contains induction stages. The source explanation of lightning protection is oversimplified; the lesson uses the modern grounded-air-terminal/strike-path explanation and does not claim that a lightning rod reliably discharges a cloud to prevent a strike. |
| T2-W08 | WEEK 8 | 16–18 | Field concept/types, gravitational and magnetic fields. Page 18 contains magnetic field lines. |
| T2-W09 | WEEK NINE | 18–20 | Electric field, lines of force and field properties. Page 19 contains the source field-pattern diagrams. |
| T2-W10 | WEEK TEN | 20–22 | Production of continuous electric current from chemical, heat, mechanical and solar sources. The source assessment asks for diagrams but the rendered source provides no complete source diagrams for all four methods; original explanatory SVGs have been added. |

**Second-term visual inventory:** the rendered PDF contains 28 raster image objects, including repeated header branding and embedded figure material. The rendered pages additionally show vector-drawn diagrams for conduction (p.10), charge concentration (p.13), induction (p.15) and electric-field patterns (p.19). The clinical thermometer (p.5), electroscope (p.14) and magnetic-field illustration (p.18) are visible in the rendered document. New original teaching assets have been added for the main clusters; they are explicitly described as original replacements, not recovered copies.

### Third Term

| Package week/task | Original source label | Rendered pages | Reconciled content and visual evidence |
|---|---|---:|---|
| T3-W01 | WEEK 1 | 1–3 | DC circuit, components, electrical quantities and verification of Ohm's law. The source says “circuit diagram below” but the rendered pages contain no diagram; a new labelled circuit schematic has been authored. |
| T3-W02 | WEEK 2 | 3–5 | Resistors and cells in series/parallel. The source provides the relations and examples but no clear connection diagrams; original resistor and cell diagrams have been added. |
| T3-W03 | WEEK 3 | 5–6 | Electrical energy and power, equations, energy units and electricity-cost calculation. |
| T3-W04 | WEEK 4 | 6–7 | Safety devices/fuse. The assignment contains an unrelated tuning-fork motion question; it remains excluded from the fuse assessment and is recorded as a non-blocking teacher disposition. |
| T3-W05 | WEEK 5 | 7–9 | Matter, atomic structure, states, diffusion, osmosis and Brownian motion. The source's Brownian-motion section contains only two brief statements; the supplement supplies an independently authored particle-collision explanation. An original states-of-matter diagram has been added. |
| T3-W06 | WEEK 6 | 9–10 | Crystal structure, crystalline and amorphous solids. Original crystal-cell diagram is registered. |
| T3-W07 | WEEK 7 | 10–11 | Surface tension and applications. Original surface-tension diagram is registered. |
| T3-W08 | WEEK 8 | 11–12 | Capillarity and menisci. Original capillary-meniscus diagram is registered. |
| T3-W09 | WEEK 9 | 12–13 | Elasticity, Hooke's law, stress, strain and Young's modulus. Original force-extension/stress-strain diagrams are registered. |
| T3-W10 | WEEK 10 | 13–14 | Energy stored in elastic material and restrained thermal force. Source line 530 has a garbled intermediate substitution; line 531 gives the correct final relation. The lesson supplies a clean derivation and worked example. |

**Third-term visual inventory:** no raster image objects were found in the rendered 14-page PDF. The source text references at least one missing circuit diagram; other scheme topics also need instructional diagrams for clear teaching. Original diagrams have been authored for the circuit, series/parallel networks, matter particles and the previously registered fuse/crystal/surface-tension/capillarity/elasticity topics.

## New original visual assets

The package now registers 29 SVG teaching assets. The 19 newly authored assets are original replacements/explanatory diagrams; they are not represented as recovered source images:

- First Term: micrometer, volume displacement, density, motion/circular motion, friction/free-body diagrams, motion graphs, hydraulic pressure/upthrust and viscosity/terminal velocity.
- Second Term: clinical thermometer, conduction/convection/radiation, charge distribution, charging by induction, magnetic field, additional electric-field patterns and continuous-current sources.
- Third Term: DC circuit, resistor/cell series-parallel networks and particle arrangements in matter.

The earlier assets for vernier callipers, vacuum flask, gold-leaf electroscope, electric fields, fuse, crystal structure, surface tension, capillarity and elasticity remain registered. Every new asset has a content hash, byte count, source locator, original-art provenance and a separate pending content-approval/deferred-verification state.

## Disposition

- The original archive members remain unchanged.
- Original equation/diagram images are not silently converted into false source text.
- Source diagrams that are low-resolution or missing are replaced only by clearly labelled original instructional equivalents.
- The combined T1 Week Five/Six source row is not split; its content-bound identity and coverage links remain stable.
- Source content approval remains PENDING and lesson verification remains DEFERRED. This audit proves original-source identity and visual review, not teacher approval, production import, database acceptance or student-device acceptance.
