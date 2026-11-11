# Agricultural Science source verification confirmation — 11 November 2026

## Owner confirmation

The repository owner explicitly confirmed in the project conversation on 11 November 2026:

> Verification is confirmed for all in the ZIP file used for this work.

This is recorded as owner confirmation that the source material in the original ZIP used to construct the SS1 Agricultural Science package has been checked and is accepted as verified. The original ZIP is retained unchanged.

## Independently reproducible technical evidence

The repository's Agricultural Science verification workflow has already:
- extracted the three registered SS1 Agricultural Science DOCX members from `docs/ss1/sources/SSS1-original.zip`;
- checked their SHA-256 values against the package source registry;
- run Mammoth 1.12.2 and the actual SS1 parser/compiler to reproduce all 30 original source-row identities and body hashes;
- resolved the 12 correction bindings to exact source rows and replacement lessons;
- validated all 47 authored lesson body hashes, practice records, answer keys and criterion-level mark totals;
- checked all 40 registered asset files for repository presence, byte count and SHA-256;
- passed the Agricultural Science package tests, SS1 integrity validator and cross-project regression checks.

Relevant successful workflow runs:
- Agricultural Science verification: [43007736762](https://github.com/PDS-David/sts-school-app/actions/runs/43007736762)
- SS1 package integrity: [43007736696](https://github.com/PDS-David/sts-school-app/actions/runs/43007736696)
- JSS3 implementation and asset regression: [43007736802](https://github.com/PDS-David/sts-school-app/actions/runs/43007736802)
- Independent-week delivery regression: [43007255240](https://github.com/PDS-David/sts-school-app/actions/runs/43007255240)

## Package state reconciliation

All 47 authored lesson records are now marked `verification: VERIFIED` against this owner source-verification confirmation and the technical evidence above. This is not a claim that every asset has passed visual rendering, nor that the production database import or authenticated production learner route has been exercised. The 40 asset verification states remain unchanged until asset rendering is checked.

The original archive, its DOCX members, source row content and original answer keys are not edited by this record. Factual issues that require corrections to ambiguous or inaccurate assessment content remain separately tracked; owner source verification does not turn a defective source question into a correct one.

## Scope boundary

This record closes the source-material verification question raised by the repository owner. It does not claim:
- a production database import;
- an authenticated production student-route smoke test;
- visual acceptance of all 40 assets on learner devices;
- specialist veterinary sign-off where a topic requires it.

Those are implementation/release checks, not reasons to ask the owner to re-verify the ZIP.
