# PHYS-PORT-D1-COV-T1 — PR #71 first-term coverage comparison

**Status:** IMPLEMENTED — TESTING DEFERRED BY OWNER. No coverage status was promoted from PR #71. No duplicate broad coverage rows were added to the master package.

## Compared source

- Retained PR #71 head: `b5ced7ebb0efe22df2351baa140266fbf40cbf41`
- Branch: `ss1/SS1-01-20261026-claude`
- Source package blob: `5b4010a8db081ddcafafd5bf98bfcbd7b31c09f3`
- PR: [#71 — closed without merge](https://github.com/PDS-David/sts-school-app/pull/71)
- PR #71 supplied eleven first-term coverage rows, `PHYS-1-001` through `PHYS-1-011`, and marked most of them SUPPORTED based on extracted text.
- Master has since developed a more granular objective-level inventory in `physics.json`, with explicit unresolved and partial states. Those master records, not PR #71's broad status labels, govern.

## Disposition of all eleven PR #71 entries

| PR #71 ID | PR #71 claim | Master comparison | Disposition |
|---|---|---|---|
| PHYS-1-001 | Introduction to Physics; fundamental quantities, units and dimensions — SUPPORTED | Master Week 1 is split into 14 objective-level entries. Meaning/branches, quantities, units, dimensions and force work are PARTIAL; laboratory familiarisation, density/velocity/acceleration dimensional working and several assessment objectives are UNRESOLVED. | **Do not carry.** Broad SUPPORTED claim is contradicted by the detailed master evidence. Keep COV-PHYS-T1-W01-OBJ-1..14 unchanged. |
| PHYS-1-002 | Measurement of mass, weight, length, time and volume — SUPPORTED | Master Week 2 has 16 objective-level entries. Many are PARTIAL or UNRESOLVED because reading rules, figures, assessment keys and extraction issues remain. The micrometer reading supplement is now authored, but the source-row correction binding remains open. | **Do not carry.** Broad SUPPORTED claim is overstated; keep COV-PHYS-T1-W02-OBJ-1..16 and their current statuses. |
| PHYS-1-003 | Motion in nature, force, circular motion, centripetal acceleration and force — SUPPORTED | Master Week 3 already has four objective-level entries, each IMPLEMENTED_EQUIVALENT and linked to the authored Week 3 supplement. | **No new row.** Master coverage is more precise and already records the evidence. |
| PHYS-1-004 | Friction: laws, advantages, disadvantages and reduction — SUPPORTED | Master Week 4 already has four objective-level entries, each IMPLEMENTED_EQUIVALENT and linked to the Week 4 supplement. | **No new row.** Existing master coverage supersedes the broad branch entry. |
| PHYS-1-005 | Scalars/vectors, distance/displacement, speed/velocity, acceleration and equations — SUPPORTED | Master's combined Week 5–6 row has objective-level entries for these skills, marked IMPLEMENTED_EQUIVALENT. A separate section-boundary objective remains PARTIAL. | **No new row.** Do not promote the combined source row to wholly SUPPORTED while its section boundary remains unresolved. |
| PHYS-1-006 | Distance-time and velocity-time graphs — SUPPORTED | Master has objective-level graph entries linked to the Week 5–6 supplement, but the original combined row's section split remains PARTIAL and its source drawings were not established by the branch's extracted-text claim. | **No new row.** Retain the granular master graph entries and the separate PARTIAL boundary/visual evidence. |
| PHYS-1-007 | Density and relative density — SUPPORTED | Master has six density/relative-density objective entries linked to the authored density supplement. The source-week label reconciliation remains PARTIAL. | **No new row.** Existing objective-level coverage is stronger; preserve the source-row reconciliation issue. |
| PHYS-1-008 | Pressure, Archimedes' principle, upthrust and floatation — SUPPORTED | Master has six objective-level entries linked to the authored pressure/floatation supplement. The source-week label reconciliation remains PARTIAL. | **No new row.** Existing granular coverage supersedes the broad entry; preserve reconciliation. |
| PHYS-1-009 | Work, energy and power — SUPPORTED | Master has six objective-level entries linked to the authored work/energy/power supplement. Source-row reconciliation remains PARTIAL. | **No new row.** Existing coverage is retained; do not erase the row-mapping issue. |
| PHYS-1-010 | Viscosity and terminal velocity — SUPPORTED | Master has five objective-level entries linked to the authored viscosity supplement. | **No new row.** Existing master entries already cover the subject objective-by-objective. |
| PHYS-1-011 | Revision (scheme Week 11) — UNRESOLVED | Master evidence records no Week 11 body in the source and retains the unresolved revision open item `OI-PHYS-003`. | **Do not carry as supported.** Retain the unresolved source gap. |

## Master evidence consulted

- `PHYS-WK-T1-W01.md`: detailed source/member and row evidence; fourteen objective-level entries, including unresolved laboratory and dimensional-analysis gaps.
- `PHYS-WK-T1-W02.md`: detailed source/member and row evidence; sixteen objective-level entries, including unresolved figure, micrometer, and assessment gaps.
- Current `backend/src/db/ss1/subjects/physics.json`: master objective coverage and linked supplements for Weeks 3–10, including the remaining PARTIAL source-row reconciliation and Week 5–6 section-boundary items.
- Current `docs/ss1/work/SS1-03/evidence/parsed_rows.json`: source row identities and body hashes.

## Outcome

All eleven PR #71 first-term rows were compared. None was copied into master because the master already has finer objective-level entries; where master has unresolved or partial evidence, the PR #71 SUPPORTED label would overstate what can be delivered. No objective was upgraded, no source row was edited, and no coverage was duplicated.

**Verification boundary:** The master source evidence records prior member/hash verification. The original binary source member was not rehashed or rendered again during this comparison. No tests, compiler, importer, typecheck, database or device check was run; testing remains deferred by the owner.
