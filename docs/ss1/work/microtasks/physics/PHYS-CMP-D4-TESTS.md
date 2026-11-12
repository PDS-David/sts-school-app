# PHYS-CMP-D4-TESTS — legacy Physics test comparison

Status: **IMPLEMENTED_TESTING_DEFERRED**. Comparison complete; the old branch test was not copied or executed because it targets a different package API/schema.

## Legacy test source

- PR #71 head: `b5ced7ebb0efe22df2351baa140266fbf40cbf41`
- File: `tests/ss1/physics.test.mts`
- Blob: `29f970835849cf756c585330b80f39866d35aa69`
- Four assertions were written against `parseSubjectPackage`, `lessonContentHash`, `validatePackageStatic` and the old `PHYS-R01` split rule.

## Port decision

| Legacy assertion | Current master equivalent / disposition |
|---|---|
| Package parses under frozen contract | `tests/ss1/physics.package.test.mts` checks v1 package identity and source registration; the workflow runs `validateSubjectPackages.ts` across registered SS1 packages. |
| Lesson content hashes match | Current test recomputes SHA-256 for every lesson body and compares it with `body_sha256`. |
| Week Five/Six split rule is hash-scoped | Not ported: `PHYS-PORT-D1-RULE-SPLIT.md` records why changing the single combined parsed-row identity would require a reviewed import migration and new coverage bindings. Current test checks all active source rules for source/hash binding and rejects missing or ambiguous anchors. |
| Static package validation has no errors | The dedicated workflow runs `backend/src/db/ss1/validateSubjectPackages.ts`; the successful Physics run 43082409860 confirms the validator passed. |

## Verification evidence

The replacement package test has seven checks covering source identity, source coverage, lesson hashes/objectives/marked practice, coverage target resolution, source-rule safety, correction/assets/open-item references and queue consistency.

- Physics workflow: [run 43082409860](https://github.com/PDS-David/sts-school-app/actions/runs/43082409860)
- Result: 7 tests, 7 passed, 0 failed; SS1 package validator passed.

The legacy test was not copied because its API and `PHYS-R01` contract are not the current package contract. No loss of a currently applicable check was identified.

## Boundary

This closes the test-comparison task only. It does not certify importer execution, database loading, runtime delivery or student-device acceptance.
