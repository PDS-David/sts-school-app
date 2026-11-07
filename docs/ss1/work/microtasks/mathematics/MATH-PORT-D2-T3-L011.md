# MATH-PORT-D2-T3-L011

**Ported lesson:** `SUP-SS1-MATHS-011` → `SUP-SS1-MATHEMATICS-T3-W03-W04-GEOMETRICAL-CONSTRUCTIONS`  
**Source:** `SS1-SRC-ca00ca94afb9` — `SSS 1/3rd Term SS1_/3RD TERM S1 MATHEMATICS.docx`  
**Source member SHA-256:** `9cc003bfd8d06f7da212d0586a44b04749a312c4759cc3422eae2290e2ec84f2`  
**Prior branch:** `ss1/SS1-01-20261026-claude`, commit `b5ced7ebb0efe22df2351baa140266fbf40cbf41`, package blob `1ebbdcf076b5a6e35f855e6b5593a523e27561c8`  
**Source week locator(s):** WEEK THREE  
**New body SHA-256:** `4025814cbda25e80d26d7d88fb3dcc8e5a078a077cb9d578aa648d83e3c28d6c`

## Port mapping

- `term_label` → master `term`; `class_name`, `subject`, `title`, `objectives` and `body` retained.
- Prior `content_hash` was not reused as the master body digest; SHA-256 was recomputed over the final UTF-8 body.
- `practice[].prompt` → `practice[].question`.
- Each prior marking string was retained as a master marking criterion, with an explicit positive integer mark allocation. Practice count: 4; total marks: 14.
- Prior branch `source_ids` and `source_locators` were mapped to the matching master source-registry record.
- Generic OpenStax preface URLs in the prior draft were not copied as topic-specific references.

## Review

The worked formulas, calculations, units and answer keys were manually reviewed against the lesson content. The lesson remains unapproved and unverified: `content_approval=PENDING`, `verification=DEFERRED`. No automated test, importer, database or learner-delivery check was run.

## Unresolved source decision

The source lists 57½°. The port does not assume that this is a typo for 67½°. The lesson explains 67½° only as a separate valid construction and leaves the source's 57½° item unresolved in package open item `OI-MATH-T3-W03-ANGLE-57-5`. Teacher confirmation is still required.

**Integration:** This task is recorded as IMPLEMENTED_TESTING_DEFERRED on the work branch; final integration is subject to PR review and merge to `master`.
