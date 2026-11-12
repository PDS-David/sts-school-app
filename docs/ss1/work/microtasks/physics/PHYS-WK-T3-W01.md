# PHYS-WK-T3-W01 — Third Term Week One: DC electric circuits

Status: **IMPLEMENTED_TESTING_DEFERRED** — the exact registered source row and rendered pages 1–3 have been inspected. Source indexing and answer keys are complete; a plotted V–I graph remains a delivery-blocking visual item.

## Registered source identity

- Source ID: `SS1-SRC-bed91bb4ef0e`
- Archive member: `SSS 1/3rd Term SS1_/3RD TERM S1 PHYSICS.doc`
- Member SHA-256: `bcd7daab57432b5c2b74a29e4afc1f162276e5fe360fab50345426fc3503e688`
- Parsed row: index 0, WEEK 1, “ELECTRIC CIRCUIT”
- Parsed body ID: `SS1-SRC-bed91bb4ef0e:BODY:9f8307d972fbe53ef0930e1c6650615116513e515c52e1d125560f0a9887c231`
- Parsed body length: 4,257 characters
- Parsed body SHA-256: `9f8307d972fbe53ef0930e1c6650615116513e515c52e1d125560f0a9887c231`
- Original member recovered in CI artifact 13902689395 from workflow run 43126374868; archive and member hashes were checked against the registered manifest.

## Source content inventory

The original row covers:
- Conductors, semiconductors and insulators.
- DC circuit definition and functions of cells, switch/key, ammeter, voltmeter, rheostat and resistor.
- Electric current `I=Q/t` and `Q=It`.
- Potential difference `V=W/Q` and `W=QV`.
- Emf as open-circuit terminal p.d.
- Internal resistance and the relation between emf, external resistance, internal resistance and current.
- Resistance `R=V/I`.
- Ohm's law, its constant-temperature condition, experimental verification with ammeter, voltmeter, rheostat and test conductor, and the V–I graph gradient.
- Two evaluation prompts, five weekend MCQs and two theory prompts. The theory repeats the definitions and experiment in the second evaluation.

## Source corrections

Correction record: `CORR-PHYSICS-T3-W01-INTERNAL-RESISTANCE`.
- The source narrows internal resistance to the electrolyte alone. The lesson explains that internal resistance arises from the electrolyte, electrodes and other internal parts of a real source.
- The original rendered relation appears as `I=E/R+r=V/R` without clear denominator grouping. The lesson writes `ε=I(R+r)` and `V=IR=ε−Ir` so the intended total resistance is unambiguous.
- The source uses E for emf; the lesson uses ε to distinguish emf from electric-field intensity.

## Source assessments and answer keys

The existing lesson already keyed the circuit definition, component functions, Ohm's law experiment, and four weekend MCQs. Two source gaps were added as Q19–Q20:
- Q19: SI unit of potential difference (volt).
- Q20: definitions of current, potential difference and internal resistance.

The lesson's Q12 is the source experiment prompt; Q01 and Q04 cover the source circuit-definition and component-function prompts. Q15–Q19 now cover all five source weekend MCQs. The repeated theory prompts are not duplicated. The lesson now has 20 questions with complete answers and marking.

## Rendered-source and visual disposition

The original .doc was rendered privately to PDF. WEEK ONE occupies pages 1–3:
- The source says a circuit diagram follows, but no circuit diagram appears in the rendered pages. Registered original asset `PHYS-ASSET-T3-W01-DC-CIRCUIT` supplies the missing circuit schematic, with ammeter in series and voltmeter in parallel.
- Page 3 labels a V–I graph, but the graph area is blank. The lesson explains the graph and gradient; a separate original graph asset task `PHYS-ASSET-T3-W01-OHMS-LAW-GRAPH` and open item `PHYSICS-T3-W01-OHMS-LAW-GRAPH` have been added and block delivery until completed.
- The recurring provider logo is a watermark, not a teaching asset.

## Package mapping

- Coverage entries `COV-PHYS-T3-W01-OBJ-1` through `OBJ-5` remain `IMPLEMENTED_EQUIVALENT` and now cite exact original-row evidence.
- Lesson: `SUP-SS1-PHYSICS-T3-W01-ELECTRIC-CIRCUITS`
- Practice: 20 questions.
- `content_approval=PENDING`; `verification=DEFERRED`.

## Checks

- Original row and rendered pages 1–3 inspected.
- Original archive member hash verified in source-staging workflow run 43126374868.
- JSON parse, unique practice IDs, answer presence, marking totals, coverage references and queue recount checked before commit.
- Full package tests, importer and SVG safety for this commit: pending CI.
