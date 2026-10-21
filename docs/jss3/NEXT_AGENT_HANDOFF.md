> Current worker/publication rules and remaining assignments: [completion/NEXT_AGENT_TASKS/README.md](completion/NEXT_AGENT_TASKS/README.md). Read the linked EXECUTION_CONTRACT.md; older self-merge instructions are superseded.

> **Current routing (21 October):** read [completion/IMPLEMENTATION_STATUS_20261021.md](completion/IMPLEMENTATION_STATUS_20261021.md) and [completion/NEXT_AGENT_TASKS/README.md](completion/NEXT_AGENT_TASKS/README.md) first. RELEASE-DB R2, MATH3 and owner-directed TEACHER1 have subsequent completion records. BASELINE2 now requires the agent to generate both exports. The older handoff below remains historical context.

# JSS3 handoff — portable successor authority

Updated 16 October 2026. **Start with [NEXT_STAGE_EXECUTION_PROMPT.md](NEXT_STAGE_EXECUTION_PROMPT.md).** It is the complete execution prompt, including permissions, input-to-task mapping, commands, acceptance criteria, safe publication and subsequent handoff requirements.

The successor is authorised to implement, test, commit and push the owner's JSS3 corrections. That authority is not reserved to the previous agent. Use an isolated worktree and coordinate non-force publication against current master. Production import/deployment remains a separately authorised operation.

## Inputs

Provide **JSS3_NEXT_STAGE_INPUTS_20261016.zip** with repository access. It contains all 39 original staged sources, their hash inventory, the scheme manifest, the original Music RTF outside the importer roots, and historical row/log evidence. Do not commit private source documents to this repository. No previous scratch workspace is needed.

Run `npm ci --ignore-scripts`, then:

```bash
python3 scripts/jss3/verify_handoff.py --inputs /absolute/path/JSS3_NEXT_STAGE_INPUTS --output /absolute/path/new-evidence
```

See the full prompt for dependencies and interpretation. The certified 2,179-row database baseline is a distinct missing proof; neither these JSS3 sources nor the 2,233-row raw protected-source comparison identifies that subset.

## Assessed state

Reviewed head: `afdf22a9493d0a5de864cf0295c7bc5c8367d594`; CI run 38852226702 successful. Fetch latest master before editing. Implementation at 557f453 has 41 supplements: 354 planned rows (170 First, 184 Second, zero Third), preserving the original 313. Full real-source verification reported 151/151 with zero skips. Later commits add semantic cross-reference leads, a teacher schedule and oral-performance review, not new executable lessons.

Remaining work is substantive semantic closure (328 review candidates within a 585-candidate register), Yoruba oral scope and five mapping entries, executable lesson/assessment sequencing, supported-app asset acceptance, and authoritative protected-row proof. Keyword matches, a teacher schedule and green tests do not alone close these gates. The full prompt explains how to implement and verify each stage without repeating settled audits.

Historical STATUS.md sections remain dated evidence. Use CURRENT_COVERAGE.csv and the full prompt for the current implementation baseline. No production import or deployment is claimed.
