# Agricultural Science CI verification report — 11 November 2026

## Scope and source integrity

This report records technical verification performed by GitHub Actions for the current Agricultural Science subject package. It does not claim subject-expert approval, production database import, authenticated learner-route verification, teacher sign-off or release authorization.

The package has 3 registered term source documents, 30 compiler-identified original lesson rows, 47 authored lesson records, 77 coverage records, 12 delivery corrections and 40 registered assets.

## Successful workflow evidence

All three workflows associated with PR #557 head commit `8ee492ee761b43e19e42abc0895ba2443817fffe` completed successfully:

| Workflow | Run | Result |
|---|---:|---|
| SS1 Agricultural Science verification | [42998363165](https://github.com/PDS-David/sts-school-app/actions/runs/42998363165) | success |
| SS1 package integrity gate | [42998362935](https://github.com/PDS-David/sts-school-app/actions/runs/42998362935) | success |
| JSS3 implementation and asset checks (cross-project regression) | [42998362973](https://github.com/PDS-David/sts-school-app/actions/runs/42998362973) | success |

The Agricultural Science workflow executed:
- `node --import tsx --test tests/ss1/agricultural-science.package.test.mts`
- `node --import tsx --test tests/topic-assets.svg.test.mts`
- `node --import tsx backend/src/db/ss1/validateSubjectPackages.ts agricultural-science`

## What passed

1. **Schema and package structure:** the complete Agricultural Science JSON passed the frozen SS1 package schema.
2. **Archive integrity:** the test extracted all three assigned DOCX members from `docs/ss1/sources/SSS1-original.zip` and verified each member SHA-256 against the package and source registry.
3. **Real parser/compiler identities:** Mammoth 1.12.2 and the repository's actual `parseTopics`/SS1 compiler reproduced all 30 expected original row IDs and body hashes.
4. **Coverage references:** all source-body coverage references resolved to actual compiler-identified rows or registered package lessons/corrections.
5. **Delivery-correction bindings:** all 12 corrections resolved to their exact source row and replacement lesson; source titles were asserted against actual parser output. The Week 9 environmental-factors title was corrected to the exact parsed source title, including its archived source typo, while the replacement lesson retains corrected learner-facing wording.
6. **Lesson integrity:** all 47 lesson body hashes, non-empty practice sets, unique practice IDs, complete answers and criterion-level mark totals passed.
7. **Asset integrity:** all 40 registered asset paths were present inside the repository, with byte counts and SHA-256 values matching the package. The asset plan confirmed mapping to exact compiler rows.
8. **Delivery adapter safety:** the package test exercised fail-closed withholding, source-fingerprint mismatch handling, scope isolation and the synthetic approved positive path. Static route-wiring assertions passed.
9. **SVG safety:** the SVG safety and manifest-preparation tests passed.
10. **Cross-project regression:** the JSS3 implementation/asset workflow that had failed earlier because the adapter could not initialise passed after the correction-title registry was fixed.

## Remaining release gates — not passed or not executed

- 45 of 47 lessons still have `content_approval: PENDING`; the two Week 9 supplements have repository-owner approval only.
- All 47 lessons remain `verification: DEFERRED`.
- All 40 assets remain pending content approval and learner-view verification.
- The package has 90 blocking open items: 56 verification, 26 factual-review and 8 content/structure items.
- The production database import and authenticated student route have not been exercised for this Agricultural Science package.
- Asset display, alt text and responsive rendering have not been visually confirmed on authenticated learner devices.
- One Second-Term selected-crops coverage record remains PARTIAL because the source's “dried loamy soil” entry and sweet/bitter cassava mapping require a qualified decision.
- The sheep embryo/normal lamb presentation supplement requires independent veterinary review; the repository test cannot substitute for that qualification.
- No package-wide subject-expert approval or release authorization is recorded.

## Correct interpretation

The package's structural, parser/compiler, hash, marking and static delivery-integrity checks are now evidenced as passing. This is a material technical milestone, but it is **not** a student-ready certification. The remaining blockers are intentionally retained so the fail-closed learner adapter cannot expose unapproved or unverified corrected content.
