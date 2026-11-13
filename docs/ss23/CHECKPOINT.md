# SS2 / SS3 curriculum readiness — checkpoint

Task: SS23-00 baseline inspection. Date: 2026-11-13. Base: master @ 982c1d2.
Status: **BLOCKED — no SS2/SS3 source material in repository.** Nothing implemented; no content authored.

## Evidence (live repository, not assumed)
| Check | Result |
|---|---|
| SS2/SS3 source archive under `docs/` | None. Only `docs/ss1/sources/SSS1-original.zip` (SSS1 members only; no SS2/SS3 member names) |
| SS2/SS3 subject packages (`backend/src/db/ss1/subjects/`) | None. 22 SS1 packages only |
| Source registry (`sourceRegistry.json`) / `SOURCE_ASSIGNMENTS.csv` | 61 rows, all SS1 |
| SS2/SS3 branches / PRs | None (400 branches listed, none SS2/SS3-named) |
| Class registration | `SS 2`, `SS 3` exist as class names (`seed.ts`, `bootstrap.ts`) only |
| SS 3 ingestion | `ingestTopics.ts` treats SS 3 as **audit-only, excluded from normal curriculum and subject creation** |
| SS1 tooling reusable for SS2/SS3 | `validateSubjectPackages.ts`, `refreshIntegrityHashes.ts`, `compiler.ts`, `studentDelivery.ts` are SS1-scoped; extending needs a decision on schema/class scope |

Not run: `npm run validate:ss1` (no code changed; SS1 status is not evidence for SS2/SS3).

## Why no content was written
Required inputs (original SS2/SS3 term documents) are absent. Per project rules, source text must not be fabricated and authored supplementary content must be separate from original source. Registered SS2/SS3 subjects, terms and weeks cannot be audited because none exist in master.

## Owner inputs needed (one message)
1. Upload the SS2 and SS3 source archives (same layout as `SSS 1/…`), or confirm their location.
2. Confirm SS 3 policy: keep audit-only (WAEC/NECO exam preparation), or deliver as normal curriculum?
3. If no sources exist for some subjects: authorise NERDC-syllabus-based authored content, labelled as supplementary with no original-source claim?

## Exact next action on resumption
Once archives exist: verify archive SHA-256, build `docs/ss23/sources/SOURCE_ASSIGNMENTS.csv` (mirror SS1 format), then start with SS2 subjects alphabetically (one subject per PR), generalising the SS1 validator to SS2/SS3 first (task SS23-01).
