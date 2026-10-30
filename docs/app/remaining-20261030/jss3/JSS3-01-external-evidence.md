# JSS3-01 — Collect the outstanding external evidence

Status: BLOCKED (owner/scholar evidence) · Depends: none · Base: `origin/master` (record the SHA)
Writes: `docs/jss3/completion/NO_RESPONSE_CLOSEOUT/OWNER_DECISIONS_20261030.md` (new), `docs/app/remaining-20261030/evidence/JSS3-01.md`

## Why

`docs/jss3/completion/NO_RESPONSE_CLOSEOUT/REMAINING.md` is the authoritative closeout and lists five requirements that code cannot satisfy:

- **C01** — no identified reusable Ọya pípè text-study passage. The Zenodo lead was inspected (PR173) and produced no eligible chant; the questionnaire and a bilingual saying are explicitly not substitutes.
- **E01** — the original intent of *iparoje*, *taki/iwure*, *obese*, *obalale*, Week-3 *ijale* and the *ojo keje* rite is unconfirmed (`SCHOOL_DECISIONS_REQUIRED.md` A1–A7).
- **E02** — original prescribed-book and past-paper identities are absent; equivalents exist and are labelled.
- **E03** — the BY-SA distribution decision is not recorded (`YO_LICENSE/OWNER_DECISION.md`).
- **E05** — no observed practical/performance competence or teacher certification.

Re-doing the completed work (PR172's five lesson fixes, the Ṣàngó/ìwì/Ifá set, the 47-page PDF inspection, the 171-lesson supplement) is explicitly out of scope.

## Do

1. Create the decisions file with one row per item: ID, exact question the owner must answer, the evidence format that would close it (author + locator, title/edition/paper + rights, signed distribution choice, assessor + date), what it blocks, and the fallback if it is never supplied.
2. For E03, restate the licensing options in plain terms (internal use only / public repository / published app) and what each implies for the affected lessons — do not choose for the owner.
3. For C01, record the source-hunt boundary: which archives were checked, which were not, and the rule that a substitute cannot be labelled the chant.
4. Cross-link the existing evidence files (do not copy them).
5. Make no curriculum, code or queue change.

## Acceptance (static)

- Each row names a single decidable question and an evidence format.
- No item is marked resolved.
- The file states that it changes no approval or certification status.

## Do not

- Re-open the Zenodo PDF, re-audit the 171 supplements, or rewrite equivalents as originals.
- Fabricate a teacher, licence or source identity.
- Ask the owner to upload the same PDF again.
