# SS1 Mathematics student assets

The 12 original SVG assets are part of the Mathematics subject package under `backend/src/db/ss1/assets/mathematics`. They include:
- Four zoomable four-figure common logarithm and antilogarithm table pages.
- Construction diagrams for perpendicular/angle bisectors, special angles, triangle construction and loci.
- Frustum, right-triangle trigonometry, circle, statistical graph and 3-D solids diagrams.

## Student delivery

Mathematics assets are served directly from the hash-verified subject package. The authenticated endpoint `GET /learning/topics/:id/assets` returns only assets whose exact topic identity matches the package source file, term, title and order index. Each asset is fetched through `GET /learning/topics/:topicId/assets/:assetKey`; the backend verifies the registered SHA-256 and byte length before returning SVG bytes.

No `topic_assets` database attachment is required for Mathematics. The CSV manifests remain in this folder as an optional migration record for a future database-backed asset catalogue; do not run the old attachment command as part of normal release.

## Release checks

Before changing package assets:
1. Keep each SVG inside `backend/src/db/ss1/assets/mathematics`.
2. Update the package asset path, SHA-256, byte length, alt text, exact source locator and state.
3. Run `npm run test:ss1:mathematics --workspace=backend` from the repository root.
4. Confirm the SS1 Mathematics verification workflow passes its safe-SVG, exact-source/order, route utility and TypeScript checks.
5. Keep lesson verification deferred to the global SS1-09 phase; SVG verification is a separate asset-level check.
