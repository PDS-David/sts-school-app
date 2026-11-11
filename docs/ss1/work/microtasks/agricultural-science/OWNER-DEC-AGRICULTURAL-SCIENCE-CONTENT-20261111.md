# Agricultural Science SS1 owner content-approval decision

- Decision ID: `DEC-AG-SS1-MILESTONE-2026-11-11`
- Decision date: 2026-11-11
- Decision-maker: PDS-David (repository owner)
- Decision basis: the repository owner's explicit project instruction that required approvals and permissions are granted and implementation should proceed without further routine approval pauses.
- Scope: the 47 authored SS1 Agricultural Science lesson records and 40 registered lesson assets in the current subject package.

## Decision

**Owner content approval is granted for all 47 authored lessons and all 40 registered assets** for the purpose of proceeding with SS1 implementation and staged student-release preparation.

This is a repository-owner/project content-acceptance decision. It is not a representation that the owner is a credentialed Agricultural Science, veterinary, animal-science, geology or legal reviewer.

All assets covered by this decision already have package provenance marked `reuse_status: PERMITTED`. This decision does not create third-party licences, change provenance, or authorise reuse of excluded/unlicensed source-document images.

## Required boundaries

1. Record this decision as the `approval_reference` for lessons/assets that do not already have a more specific owner decision reference.
2. Preserve existing more-specific approval references, including the Week 9 farmstead/forestry decision.
3. Do not change any lesson or asset `verification` state. Verification remains `DEFERRED` until the relevant checks actually pass.
4. Do not set the package to `IMPLEMENTED` or claim student-ready status on the strength of this owner decision alone.
5. Keep independent specialist review gates open where the package explicitly requires qualified review. In particular, the sheep embryo/normal lamb-presentation supplement must not be released until a qualified veterinary reviewer signs it off. Other animal anatomy, reproduction, physiology, crop-science and legal claims remain subject to their recorded factual-review dispositions.
6. Keep production database import, authenticated learner-route checks, visual device acceptance and classroom-dependent practical verification as separate evidence gates.
7. Agents must continue all work that does not depend on a specific outstanding specialist or runtime gate. A pending external review must not stop unrelated package implementation, testing or release preparation.

## Implementation reference

`backend/src/db/ss1/subjects/agricultural-science.json` records this decision on the 47 lessons and 40 assets. The package remains fail-closed for unverified delivery until the remaining evidence gates are satisfied.
