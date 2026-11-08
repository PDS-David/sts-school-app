# SS1 subject claims

One file per subject that an agent is working on right now: `<subject-slug>.json`
(or `role-tester` / `role-owner-brief`). Created, refreshed and removed only by
`docs/ss1/work/claims/claim.sh` (see `docs/ss1/work/AGENT_PROTOCOL.md`). A claim
older than 120 minutes is stale and may be taken over with `--takeover` after
checking `git log` for recent work on that subject. An empty directory means no
one is working. Do not edit these files by hand.

## Static assignments

A claim file with `"static": true` and `"item": "*"` gives a subject to one agent for good. It is
never stale and cannot be taken over, and its owner needs no per-item claiming (so agents that
cannot run `claim.sh` can work). Create with `claim.sh assign <slug> <agent-id> "<note>"`, end with
`claim.sh unassign <slug> <agent-id>`. See section 3A of `docs/ss1/work/AGENT_PROTOCOL.md`.
