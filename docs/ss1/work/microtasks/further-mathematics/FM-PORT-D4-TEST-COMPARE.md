# FM-PORT-D4-TEST-COMPARE

Static comparison only; neither test file was executed.

**PR #71 test:** `tests/ss1/further-mathematics.test.mts`, blob `b88d3d64b8311d4bab759997b686a7a3cb25d072`.  
**Master test:** `tests/ss1/further-mathematics.package.test.mts`, blob `dd9c8e9dcbfb430d88ccd4e455bcb2a1739926f1`.

| PR #71 guard | Master counterpart | Result |
|---|---|---|
| Package parses under the frozen contract via `parseSubjectPackage` | `packageSchema.parse(...)` | Covered with the current schema API. |
| Every lesson content hash matches its content | `sha256(l.body) === l.body_sha256` inside lesson-completeness test | Covered. |
| Third Term gap is a blocking open item | PARTIAL/UNRESOLVED coverage requires PENDING package and a blocking open item | Equivalent invariant, but more general than asserting the exact `OI-FM-002` ID. |
| `validatePackageStatic(pkg, loadSourceManifest())` reports no errors | No direct `validatePackageStatic` invocation in master test file | **Gap:** master has broader schema/source/lesson/asset/compiler checks, but does not directly call this validator. |

The single gap is routed to `FM-TEST-FULL-SOURCE-REGRESSION` for consideration after its prerequisites. No test was written or run here. A skip or deferred test is not a pass.
