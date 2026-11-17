# SMM-004 — Student badges and achievements checkpoint

Task ID: SMM-004
Status: IMPLEMENTED AND MERGED — threshold and authorization tests merged in PR #894
Merged implementation: PR #766

## Scope delivered
- Adds student-only `GET /learning/achievements/me`.
- Derives badges from passed topic completions and assessment submissions; no duplicate badge ledger.
- Awards first/10th/25th topic milestones, first assessment, 80%+ fully graded assessment and perfect-score badges.
- Score-based badges require `fully_graded=true` and reject submissions with answer grading status `ai_graded` or `ai_unavailable`.
- Resolves the active student row from authenticated identity; no caller-supplied student ID.
- Adds student achievements screen with earned/in-progress state, progress and earned dates; linked from Profile.
- Failed refreshes show a retry warning and preserve the last successful view.

## Verification
- PR #766 merged on 2026-11-13; mobile TypeScript passed in run `43457559359`.
- Current master validation on commit `209a960ace30a8026e722e71e1b7f727347fef0c` passed package integrity and curriculum contract gates.
- PR #894 adds DB-backed checks for 10-topic milestone thresholds, fully graded 80%/perfect scores and student-only authorization. The route suite passed in run `43941196109`; all five required workflows passed on PR #894 head `434111153ae1aafcfedfa85ae7d6240f48468cb2`. PR #894 merged to master as `554688b372f6b9f1b74adf64dd4fcf817ca690e2`.
- No physical-device acceptance has been performed.

## Remaining
- Verify loading/error/empty states and navigation on student devices/accounts.

## Exact next action
Test the achievements screen using a real student staging account and verify loading, error, empty and earned states.