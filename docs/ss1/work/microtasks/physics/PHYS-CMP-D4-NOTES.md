# PHYS-CMP-D4-NOTES

Compared the Physics section of PR #71's checkpoint and handoff with the master's SS1-03 notes. No master checkpoint or handoff file was overwritten.

**Branch evidence**
- Checkpoint: blob f2c37bd28e06d0fa3f1424b27fcdfbc1675ef96c, line 9: Physics marked IMPLEMENTED — TESTING DEFERRED, with three sources, five equivalent lessons and split rule PHYS-R01.
- Handoff: blob f3ee7c4559931744ab679bc6f8975fd7091c0710, lines 55-68: Physics subject object and open items OI-PHYS-001 through OI-PHYS-005.
- Master checkpoint: blob 3fc668a75bab4ce097022e4b5e28a1f3440dbb71, line 36: Physics NOT STARTED.
- Master handoff: blob 1d9838eb33a3f0e26ec712f6aff08f71cc3597e5, line 8: physics status NOT_STARTED.

## Branch-only facts and routing

| Branch fact | Master route / disposition |
|---|---|
| Five equivalent lessons: heat/temperature, solid expansion, fuse, surface tension, capillarity | Now ported on this work branch by PHYS-PORT-D1-T2-L001/L002 and PHYS-PORT-D1-T3-L003/L004/L005. Coverage tasks PHYS-PORT-D1-COV-T2/T3 added only the five lesson-backed objectives. The master checkpoint's NOT STARTED statement is stale; it is deliberately not overwritten. |
| PHYS-R01 split of T1 Week Five and Six at the GRAPHS heading | Routed to PHYS-PORT-D1-RULE-SPLIT; it depends on PHYS-WK-T1-W05-W06 and has not been applied yet. |
| OI-PHYS-001: flattened superscripts/subscripts, fractions and figures | Already tracked by the T1 notation/extraction open items and PHYS-OWNER-EXTRACTION-STRATEGY; visual inventory remains in PHYS-VIS-T1/T2/T3. |
| OI-PHYS-002: T1 W5 fraction, T2 W1 heat definition/photoelectric claim, T3 W10 garbled formula and expansivity X | Routed to PHYS-PORT-D1-FACT-T1-W05, PHYS-PORT-D1-FACT-T2-W01, PHYS-PORT-D1-FACT-T3-W10 and PHYS-PORT-D1-FACT-EXPANSIVITY. |
| OI-PHYS-003: revision/examination weeks have no body | Routed to PHYS-OWNER-REVISION-PLAN and PHYS-RULE-T1-REVISION-SCHEME / PHYS-RULE-T3-REVISION-EXAM. The T3 marker remains scheme-only; no lesson invented. |
| OI-PHYS-004: source figures not extracted | Routed to PHYS-VIS-T1/T2/T3 and the extraction-strategy task; no source figure was fabricated. |
| OI-PHYS-005: teacher review and source-week answer keys | Recorded in PHYSICS-T2-T3-LESSON-REVIEW and PHYS-APPROVAL-CONTENT. The five supplements remain content_approval=PENDING. |

## Disposition

The branch-only five-lesson implementation is now represented in the work branch and its coverage records. All other branch findings are routed to existing master tasks or open items. Source-week indexing, fact checks, figures, approvals and testing remain outstanding. No tests were run.