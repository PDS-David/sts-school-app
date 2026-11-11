# Agricultural Science SVG asset delivery — implementation checkpoint

Base: `c25c40cd89420d98a990b5ab41beb79873c5e756` (master at branch creation). Branch: `ss1/ag-science-asset-gate-svg-20261111`.

## Implemented in this batch
- SVG ingestion validates strict UTF-8, document size, root element, responsive viewBox, and rejects active content, event handlers, inline styles, DTDs and external references. Existing PNG/JPEG/GIF signature checks remain.
- Authenticated asset delivery retains existing topic visibility checks and sandbox CSP. Agricultural Science assets are rechecked against the exact corrected lesson, package/lesson/asset approval and verification references, provenance rights, and package SHA-256/MIME at both metadata and byte endpoints. Direct asset-ID requests cannot bypass withholding.
- Mobile lesson detail fetches SVG bytes with the same Bearer token and renders them with `react-native-svg` native primitives. Existing raster image handling, labels, captions, attributions, retry and wide-image behaviour are retained.
- Added `scripts/ss1/build_asset_plan.mjs`: joins real compiler `identified_rows` to package lesson/asset IDs; checks file bytes, hashes, MIME and safe SVG content; requires package implementation, lesson+asset approval and verification references, and permitted provenance; emits the existing attachment CSV only when all gates pass. It writes a private JSON report when blocked.
- Added regression tests for SVG ingestion, asset-to-topic identity, approval gating and learner-route integration.

## Explicit gates
- No manual test suite, TypeScript check, importer rehearsal, database write or device check was run. The SS1-08 owner instruction defers test execution until implementation is complete. Regression tests have been added for the later verification stage.
- All 40 Agricultural Science SVG assets remain content-approval PENDING and verification DEFERRED. The manifest generator therefore remains BLOCKED and emits no attachable CSV until qualified review and verification evidence are recorded.
- No assets have been attached to a database and no production operation was performed.
- The subject remains NOT student-release-ready. The remaining work includes the complete SS1-08 asset-plan/handoff integration and any remaining learner-facing runtime paths, followed by the separately authorised SS1-09 verification/release phase.
