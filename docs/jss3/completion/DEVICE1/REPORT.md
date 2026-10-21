# DEVICE1 — lesson-picture usability: STATUS = BLOCKED (observation not performed)

Base master `84d3a632fcf92e5d91155c5fb94a01176d4e625d` (fetched 21 Oct 2026, unchanged at publication time of this branch `jss3/device1-20261021-pf7k`). Final SHA: the PR head / merge commit, recorded in the PR and verified against remote master after merge.

**No phone observation was made. No row of the results table says PASS. No app code was changed.** The task needs an authorised staging backend and build, two student accounts and a phone; none was supplied (only repository access). `mobile/app.json` bakes in `https://sts-school-backend.onrender.com`; nothing was sent to it or to any other host, because it could not be established that it is staging.

## Distinct results

| Label | What |
|---|---|
| IMPLEMENTED | `scripts/jss3/device1_preflight.py`: the API half of the gate against a staging URL (listing, bytes/hash/type/frames vs current manifests, alt text delivered, withdrawn prism hidden, no-token / invalid-token / other-class refused). Tokens from env only, never printed; redirects not followed; refuses missing `--staging-confirmed`, non-https, credentials in URL, and the `app.json` host unless `--allow-app-json-host`. Hooked into CI. |
| VERIFIED (code/static only) | `tests/test_jss3_device1_preflight.py`, 10/10, against a local mock server serving the real asset bytes: pass path, NOT_PERFORMED when the other-class token is absent, failure on leaked `BS-PRISM-SOURCE`, token-less 200, altered bytes, redirect not followed (mutation-checked: with a redirect-following opener the test fails), tokens absent from output, URL guards, GIF frame counter equals Pillow. All 10 target files hash to the current manifests. Sizes re-derived independently match the A2 table. Node 24.19.0: `lesson-image`, assets metadata/loading, V1, V2, V3 and batch2 suites 55 tests, 51 pass, 0 fail, 4 skipped (private-source checks); backend and mobile `tsc --noEmit` clean. |
| BLOCKED | Every observation: readability, complete/no crop, caption, spoken description, sideways navigation or enlargement, GIF motion, retry after network loss, and staging no-token / other-class rejection. Also the staging schema check. |
| NOT PERFORMED | Any app change. Per contract only *reproduced* usability or access defects may be fixed, and none has been reproduced. The A2 concerns (small text once the 1080-1280 px Business/Math/BT-02 diagrams are scaled to phone width with no zoom; the 334 px eye image upscaled) remain hypotheses. Adding tap-to-enlarge without observation would be a speculative UI change. |

Existing behaviour (read from `mobile/src/screens/TopicDetailScreen.tsx`, not observed): authenticated `Image`, `resizeMode="contain"`, height from the picture's ratio, label from `alt_text` then caption, "could not be loaded" + "Retry pictures", sideways scroll only at 1500 px or wider (none of the eight is that wide), no pinch zoom or tap-to-enlarge, GIFs passed through unchanged.

## Results table

`OBSERVATION_RESULTS.csv` lists the eight assets, the two Science supplement bindings and the hidden source. Pixel sizes are verified from repository files; **all device columns read NOT OBSERVED and all rows BLOCKED.** No screenshots exist.

## Exact inputs needed to unblock (not another audit)

1. A staging backend URL and staging PostgreSQL (not production) loaded with the integrated JSS3 capture from a recorded commit (313 originals + 170 supplements = 483), with the V1/V2/V3 and BT manifests attached (`backend/src/db/attachTopicAssets.ts`; dry-run first, `--apply` only after review).
2. Schema evidence on staging: `SELECT table_name, column_name FROM information_schema.columns WHERE (table_name='topic_assets' AND column_name='alt_text') OR (table_name='assessments' AND column_name='content_fingerprint');` must return both rows (the preflight infers `alt_text` only from a 200 list; it cannot see `content_fingerprint`).
3. A staging build of the app with `EXPO_PUBLIC_API_URL` set to that URL at build time and no local `mobile/.env` on the building machine (it would override the URL; see the note in `mobile/src/api/client.ts`), e.g. `eas build --profile preview` (APK); record the build SHA.
4. One JSS3 student account (correct class/term; Business, Mathematics, Basic Science, Basic Technology) and one other-class account. Supply tokens to the person running the tool only, never in chat or Git.
5. A physical phone or owner-operated phone session; record model, OS, viewport and screen-reader mode (TalkBack/VoiceOver).

Run order once those exist:

```bash
export JSS3_STUDENT_TOKEN=...        # staging login; never commit
export JSS3_OTHER_CLASS_TOKEN=...
python3 scripts/jss3/device1_preflight.py --base-url https://<staging-host> \
        --output "$PWD/device1-evidence-api" --staging-confirmed
```

Exit 0 means the API checks passed (not a device pass), 1 a failure, 2 a check not performed. Then observe the table's device columns on the phone, including network off/on for picture and list retry. If detail is unreadable, implement accessible open/close/back enlargement (authenticated image request retained, tests beside `tests/lesson-image.test.mts`), then re-observe every affected case; report LOW_RESOLUTION_SOURCE separately where enlargement cannot recover detail.

## Environment

Linux sandbox, Node 24.19.0 (npm `node` package), Python 3.13 with Pillow, `npm ci --ignore-scripts`. No PostgreSQL, staging, device or LibreOffice used. No production import, migration, deployment or student-data change.
