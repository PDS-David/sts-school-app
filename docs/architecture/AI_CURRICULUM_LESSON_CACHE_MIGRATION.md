# AI-generated curriculum lesson cache — migration impact

## Purpose

Persist the validated AI lesson generated from a canonical curriculum topic or an approved SS1/SS2/SS3 package unit. The cached object contains the teaching introduction, ordered teaching sections, recap, and the associated practice questions with answer keys and explanations. This is learner practice content, not the formal assessment bank.

## Proposed additive schema

Add `curriculum_generated_lessons` as a standalone table. It has a stable `cache_key`, optional FK to a canonical `topics.id`, class/subject/term/topic metadata, a SHA-256 fingerprint of the exact generation context, validated lesson JSONB, generator version, and timestamps.

- Canonical topic keys use `topic:<topic-id>`.
- Approved package keys use `ss1:<package-lesson-id>` or `ss23:<package-unit-id>`.
- The context fingerprint includes class, subject, term, approved topic title, learning objectives, and the safe approved source material. A changed curriculum context invalidates the old cache automatically.
- No student ID, account data, or per-student answer record is stored. The same canonical curriculum lesson is shared across students who are authorised to access that curriculum.
- Deleting a canonical topic cascades only its cache row. Package cache rows are independent of topic rows.

## Impact and safety

This is an additive table only. It does not alter existing topic, completion, assessment, question, student, teacher, school, or report-roster rows. It does not backfill old summaries or convert formal assessments. It does not mark topics complete.

The API validates cached JSON against the same strict lesson schema before returning it. A context hash mismatch or invalid cached object causes regeneration. If the migration has not yet been applied, the API continues to generate and return a lesson without caching; it does not fail student learning because the cache table is absent.

Formal assessment endpoints remain separate and must never expose the answer keys in this practice cache. Brainee remains a separate conversational tutor.

## Deployment

Migration: `0007_curriculum_generated_lessons.sql`.

The migration runner applies this as a numbered, transactional migration after the existing ledger. Do not run it manually against production or use `--fresh`. Use the repository's approved production migration workflow after backup/preflight approval. Fresh-install `backend/schema.sql` is kept in sync.

## Verification

- Migration is additive and idempotent.
- Context hash changes invalidate old generated lessons.
- Valid cache hits avoid a model call.
- Malformed cache entries are not delivered.
- Missing cache table degrades to uncached generation.
- Generating/opening a lesson does not insert `topic_completions` or create a formal assessment.
