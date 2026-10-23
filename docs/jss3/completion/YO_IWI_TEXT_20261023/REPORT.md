# Y2 — iwì egúngún text study (23 Oct 2026)

**Status, kept separate:** lesson implementation: **NOT DONE (no supportable passage)** · esa = iwi equivalence: **evidenced from scholarship (read via fetch tool, no source bytes)** · guard tests: **pass locally** · corpus and database acceptance: **not run** · PR: see below · merge, deployment, production import: **none**.

Y2 is not complete. `SUP-YO-IWI-TEXT` was not created, because no passage meets the provenance, rights, suitability and byte-check requirements. No verse was copied or invented.

Base master at start: `8d46e8390d3e404565a69a7c6ee580bac1d14c22` (PR #35). Before submitting, master had moved to `3bef89bc370fe751057ea610b1379cb83ea1fde8` (PR #36, Y1 Ọya); it was merged into this branch (automatic, no conflicts) and all checks below were rerun on the merged tree. Branch: `jss3/iwi-text-20261023`. PR: https://github.com/PDS-David/sts-school-app/pull/38 (open, not merged; the PR's head SHA is authoritative, since a report cannot contain its own commit hash).

## Result
1. **Equivalence verified.** Three works say ẹ̀sà and iwì egúngún are one form: Adeduntan 2024 (CC BY), Akinbo et al. 2022 (CC BY), Fámúlẹ̀ footnote 9. Wording, locators and licences are in `IWI_SOURCE_CHECKS.json`. It lets a passage that its source labels ẹ̀sà or iwì be taught as iwì. It does not turn an oríkì or a modern poem into an inherited chant.
2. **Akinbo poem rejected.** It is an original oríkì written for the study and recited in speech, ìjálá and ẹ̀sà modes. It is not an ẹ̀sà text.
3. **Aransi Humour excerpt excluded** as unsuitable for pupils (per the Y2 brief; not re-read) and for unestablished provenance.
4. **Fámúlẹ̀ rejected on provenance.** Its one explicitly iwì-labelled chant (about pp. 17–18) is one printed line. The text read names no performer, collector, earlier source or translator. The article page says CC BY-NC 4.0; the PDF text has no licence line.
5. Olajubu 1977 and africanpoems "Tricks": genre fits, no reuse basis.

## Candidate status (vocabulary: not located / inaccessible / permission unresolved / unsuitable for JSS3)
| Candidate | Status | Note |
|---|---|---|
| Fámúlẹ̀ iwì couplet (YT-IWI-02) | permission unresolved (also inaccessible) | one line, no stated origin or translator, CC BY-NC on page; bytes not readable here |
| Akinbo poem (YT-06) | inaccessible (also unsuitable as iwì) | modern, documented origin, CC BY; fails the objective: a praise poem recited in three modes. Assessed, not dismissed for being modern; not adopted |
| Aransi èsà excerpt (YT-05) | unsuitable for JSS3 (also permission unresolved) | adult content per brief; provenance not established |
| Olajubu 1977, Beier 1970 via africanpoems (YT-09, YT-IWI-03) | permission unresolved | no licence or translator |
| Adeduntan 2024 (YT-IWI-01) | not located | prints no ẹ̀sà/iwì text |
| Drewal, Osogbo thesis, Johnson, Rouget | inaccessible | not opened or unreadable here |

Overall: an open-licence iwì passage with stated origin is **not located**. Source acquisition is open; implementation not done; the curriculum gap is **not closed**.

## Changed
- `docs/jss3/completion/YO_TEXT/SOURCE_RIGHTS_REGISTER.json`: only the `iwi-egungun` entry (still `NOT_SUPPORTED`, `lesson_id` null), plus new rows `YT-IWI-01..03` inserted before `YT-13`.
- `docs/jss3/completion/YO_IWI_TEXT_20261023/IWI_SOURCE_CHECKS.json` and this report.
- `tests/jss3-yo-iwi.test.mts` (7 tests) and one entry in `.github/workflows/jss3-assets.yml`.
- Not touched: lessons, attributions, coverage, CSVs, Ṣàngó and Ọya entries, NOUN assets. YO-SL-094 stays `REPLACEMENT_IMPLEMENTED_PARTIAL`.

## Checks (Node 22.22.0 here; CI pins 24.19.0)
- `npm ci --ignore-scripts`: ok.
- `node --import tsx --test tests/jss3-yo-iwi.test.mts`: 7 pass.
- With `jss3-yo-text` (now including Y1's tests), `jss3-yo-license`, `jss3-supplements`: 37 tests, 36 pass, 0 fail, 1 existing skip.
- `node --import tsx --test tests/jss3*.test.mts` (no database variables): 354 tests, 293 pass, 0 fail, 61 skipped (database and private-archive suites).
- The merged register has no duplicate source IDs: Y1's `YT-14..16` and this task's `YT-IWI-01..03` coexist.
- `tsc --noEmit` in `backend` and `mobile`: exit 0.
- Negative controls: marking iwì supported with no lesson, marking Fámúlẹ̀ usable, and dropping an equivalence source each fail the intended tests. The register and evidence files were restored afterwards. The gate also has a positive control, so a genuine future lesson can satisfy it.

## Not run, and limits
- Shell egress to doi.org, scielo.org.za, frontiersin.org, africanpoems.net, gutenberg.org and archive.org was refused (HTTP 403 on CONNECT). No source file was downloaded or hashed. All source reading was through a summarising fetch tool, not compared with page images.
- Not run: `run_acceptance.py`, disposable PostgreSQL, fresh capture, `IMPLEMENTED_LESSONS.csv` regeneration. No lesson changed and the private ZIP was not available here.
- No device, performance or observation claim. Nobody was contacted.

## Exact remaining input
A short iwì/ẹ̀sà egúngún passage, long enough for comprehension questions, in tone-marked Yoruba with English translation, with its origin and translator stated, under an open licence or permission covering that passage, checked against source bytes or page images.

For the closest lead (Fámúlẹ̀): the PDF supplied; the couplet's origin and translator from a source; more than one line; and the owner's decision on CC BY-NC for this app.

Owner decision D2 (ẹ̀sà as iwì) is no longer what blocks this.

## For the integrator
- `SOURCE_RIGHTS_REGISTER.json` is shared with Y1 (Ọya entry). Merge by stable IDs; do not replace the file.
- Not edited, to avoid collisions: `OPEN_BLOCKERS.csv` OB-03, `OWNER_DECISION.md` D2, `REMAINING_RELEASE_GATES.md`.
