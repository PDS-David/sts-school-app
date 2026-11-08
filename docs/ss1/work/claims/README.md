# SS1 subject claims

One file per subject that an agent is working on right now: `<subject-slug>.json`
(or `role-tester` / `role-owner-brief`). Created, refreshed and removed only by
`docs/ss1/work/claims/claim.sh` (see `docs/ss1/work/AGENT_PROTOCOL.md`). A claim
older than 120 minutes is stale and may be taken over with `--takeover` after
checking `git log` for recent work on that subject. An empty directory means no
one is working. Do not edit these files by hand.
