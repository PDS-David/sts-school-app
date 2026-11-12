# Consolidated SS1 Further Mathematics review — PR #639

The consolidated package includes 24 lesson packages, 84 coverage records, 30 open review items and 18 registered assets. It carries the current First Term repairs, the full Second Term lesson set, and the existing Third Term material.

Before this PR can merge:
1. Confirm stored lesson body hashes using the repository's canonical integrity script.
2. Confirm all registered asset SHA-256 hashes and byte counts.
3. Run package schema validation, SVG safety tests, the all-subject compiler and subject-specific checks.
4. Classify failures as Further Mathematics package defects or unrelated cross-subject blockers. Do not edit other subjects or global workflows to hide a failure.
5. Keep content approval PENDING and verification DEFERRED until the authorised teacher/owner reviews and approves the content.
6. Do not claim the whole subject is student-ready: Third Term coverage still has open week/source gaps.

Local structural preflight already performed on the current branch:
- All 24 lesson body hashes match their stored values.
- All practice marking subtotals reconcile.
- All 18 registered asset files exist and match their stored SHA-256 and UTF-8 byte counts.

Master-targeted CI is pending. No merge is authorised until required checks pass.
