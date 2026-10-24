# Source-verified iwì equivalent: implementation, 24 October 2026

Base master: `3678e0e04e873d9f1f181cc64987db937e5f2e5f`.

The previously drafted `SUP-YO-IWI-TEXT` is now part of the executable supplement catalogue, with First-Term destination, an attribution record bound to the exact body, seven written questions and a 15-mark guide. It is a **labelled modern equivalent**, not an inherited egúngún chant. The owner's existing authority to use clearly labelled internet equivalents covers this implementation. No new owner approval was invented.

The complete publisher HTML was downloaded, hashed and checked with `verify_iwi_candidate.py`. All five content checks pass; `SOURCE_CHECK.json` records the exact byte hash. The publisher's CC BY 4.0 hyperlink was inspected. The complete corrigendum (DOI 10.3389/fcomm.2022.1127007) was also downloaded and reviewed; its hash and findings are in `IWI_CANDIDATE.json`. It changes genre diacritics, repetition of the vibrato signal for measurement, and the concluding description of vocal features. It does not change the selected lines, translation or material taught here. PR #51's text-only check is retained as historical evidence and superseded by this byte verification, not discarded.

`YO-SL-094` stays partial: Ọya text remains unresolved. Written study does not certify practical performance. Historical rejection of the same poem as an inherited chant is preserved; this implementation makes no such claim.

## Fresh corpus evidence

The private archive was recovered; it need not be requested again in this workspace:
`JSS3_NEXT_STAGE_INPUTS_20261016.zip`, SHA-256 `0a5b0d929e1dc61801cde43f8a85235d2e236ced334d2091583f5fa16524ea3c`.
All 39 inventory entries were checked while staging. Source documents and full captures remain outside Git.

The new importer capture contains 313 original rows, all objects exactly equal before/after supplementation. It contains 484 supplemented rows: 235 First Term, 249 Second Term, zero Third Term, zero Computer Studies. `IMPLEMENTED_LESSONS.csv` was regenerated from that capture and the teacher schedule was regenerated with the repository generator. The eight pending entries and existing holds were not released. This is **not** evidence for the unrelated historical 2,179-row certification baseline.

The coverage generator also erased a historical conflict report when no new rows were added. That unrelated side effect was restored; no historical conflict was silently declared resolved.

## Reproduction

Use Node 24.19.0, `npm ci --ignore-scripts`, and the Python requirements in `scripts/jss3/acceptance-requirements.txt`.

```bash
curl -L --fail 'https://www.frontiersin.org/journals/communication/articles/10.3389/fcomm.2022.1029400/full' -o /tmp/iwi-full.html
python3 scripts/jss3/yo_text/verify_iwi_candidate.py /tmp/iwi-full.html
node --import tsx --test tests/jss3-yo-r1.test.mts tests/jss3-yo-iwi.test.mts tests/jss3-yo-text.test.mts
python3 scripts/jss3/run_acceptance.py --archive /path/to/JSS3_NEXT_STAGE_INPUTS_20261016.zip --output /tmp/jss3-fresh-acceptance --without-db --tsx-no-ipc
```

A newly fetched publisher page may have a different byte hash; compare the actual selected content and licence, never copy an old hash onto new bytes. `--tsx-no-ipc` is required in this workspace because ordinary tsx attempts to create a Unix socket denied by the environment. It is the existing documented adapter, not a test bypass.

Database acceptance requires a disposable loopback PostgreSQL 16 database named `jss3_test_*`; set `JSS3_LOCAL_TEST_DATABASE_URL` and omit `--without-db` in a fresh output directory. Installation here unpacked PostgreSQL 16.15 but could not configure its service user because the container disallows the required UID operations. No database pass is claimed.

No production connection, import, deployment or practical certification was performed. Repository publication and production delivery remain distinct.

## Observed final checks

- Corpus: 379 tests, 372 pass, 0 fail, 7 database-only skips.
- Backend and mobile TypeScript: pass.
- Static and asset checks: pass.
- Protected-comparer unit tests and acceptance-runner tests: pass. These are synthetic checks, not a comparison of the missing certified export.
- Acceptance status: INCOMPLETE, solely because database acceptance was deliberately not run. No skipped source tests.
- Focused source/attribution suite: 30/30 pass, no skips. Negative controls still reject absent sources, incorrect hashes and unsupported claims.
