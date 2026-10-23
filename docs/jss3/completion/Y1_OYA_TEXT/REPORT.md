# Y1 — Ọya pípè text study — 23 October 2026

Base master: 8d46e8390d3e404565a69a7c6ee580bac1d14c22 (PR35). Branch: `jss3/oya-text-20261023-y1`.

## Result: NOT IMPLEMENTED — no supportable Ọya pípè passage found. Status preserved as open.

No lesson `SUP-YO-OYA-TEXT` was created. No verse was written, adapted or substituted, and no profile or description of Ọya was presented as text study. The Ṣàngó work (`SUP-YO-ORAL-GENRES`, its attribution record and `SANGO_EXCERPT.json`) is untouched; all existing Ṣàngó tests still pass. iwì egúngún (Y2) is untouched.

## What was examined (see register rows YT-14 to YT-16)
- **YT-14** Láyadé and Ògúnyẹmí (2025), full PDF text re-read for Ọya: the article prints only Ṣàngó praise lines. Ọya is not mentioned in the body. Nothing to teach.
- **YT-15** Elebuibon, *Orisa Songs* (Scribd copy marked ©2015): prints Ọya lines, but it is a copyrighted songbook with inconsistent tone marks, no named transcriber or checked translation, and an upload of unestablished authority. Not reusable.
- **YT-16** Lindon, *Oríkì Òrìsà: the Yoruba prayer of praise*, J. Religion in Africa 20(2): prints one complete hymn, but the òrìṣà was not visible in the preview and there is no open licence. Unverified lead.
- Earlier register rows (Ellis 1894, Kolawole 2023, Aransi 2024, etc.) already record no Ọya text; they were not re-opened.

## Method limit (important)
The shell in this environment can resolve only an allowlist of hosts (GitHub, npm, PyPI, etc.). DNS fails for scielo, letterkunde.africa, doi.org, archive.org, wikisource and gutenberg. Source text was read through the fetch tool, which returns extracted text, **not source bytes**, so nothing new could be hashed and no `source_sha256` is recorded. Even a good passage could not have met the "download actual bytes and record SHA256" requirement here without either host access or the file supplied privately.

## Repository changes
- `SOURCE_RIGHTS_REGISTER.json`: only the `oya-pipe` entry (`best_lead`, `missing`; status stays `NOT_SUPPORTED`) and three appended source rows YT-14..16. No other genre or row changed.
- `tests/jss3-yo-text.test.mts`: two tests. (1) Ọya stays NOT_SUPPORTED, states its missing inputs, no Ọya-checked source is usable, no `SUP-YO-OYA-TEXT` lesson or attribution exists. (2) Negative controls: marking Ọya SUPPORTED without a lesson fails; promoting a source to USABLE_VERIFIED without hash fails; an unsupported genre naming a lesson fails; an empty `missing` fails.
- No lesson, attribution, coverage CSV, IMPLEMENTED_LESSONS.csv or teacher schedule changed, so no regeneration was needed or performed.

## Observed checks
Node 24.19.0 (local npm install of `node@24.19.0`), `npm ci --ignore-scripts` at root and backend.
`node --import tsx --test tests/jss3-yo-text.test.mts tests/jss3-yo-license.test.mts`: 18 pass, 0 fail.
Wider non-DB subset (topic-assets-metadata, topic-assets-loading, jss3-supplements, jss3-delivery-correction, jss3-closeout-content, yo-license, yo-text): 58 tests, 55 pass, 0 fail, 3 skipped (skips are pre-existing tests in those files; not investigated further).
Not run: DB/PostgreSQL suites (no lesson or route changed), full source acceptance with the private ZIP (not available; no lesson content changed), mobile/backend type checks.

## Exact remaining inputs
One named Ọya pípè / oríkì Ọya passage (≥3 lines) with: tone-marked Yoruba one performed line per line; a named translator and line-aligned English; a named collector/transcriber or published locator (title, year, page/line range); a reuse basis covering that passage (open licence printed on a work whose licensor owns the passage, or written permission naming the passage and display to enrolled students in the school app); and either shell access to the source host or the source file supplied privately so its SHA-256 and locator can be recorded. Concretely useful: written permission from Ifayemisi Elebuibon for one named Ọya passage, or the full Lindon (1990) article checked for an Ọya hymn plus Brill/author permission. Nobody was contacted.

PR: see the pull request for this branch. Not merged.
