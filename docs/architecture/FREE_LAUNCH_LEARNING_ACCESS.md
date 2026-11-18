# Free-launch learning access policy

The initial STS School App launch is free and open for student learning. The backend defaults to free-launch mode unless explicitly disabled.

## Default behaviour

- `FREE_LAUNCH_MODE` defaults to enabled. Student account expiry dates and pending-admin-review gates do not block learning access during this period.
- `TERM_PIN_ENFORCED` and `CURRICULUM_SEQUENCE_ENFORCED` are dormant while free-launch mode is enabled. Students can access all terms and topics without PIN redemption or passing a preceding topic.
- SS1 and SS2 lesson package term access follows the same open-term policy.
- No subscription or payment gate is introduced by curriculum lesson generation.

## Safeguards that remain active

Free access does not mean anonymous or cross-school access. Authentication, manually deactivated-account checks, deleted-student-record checks, student identity, school/class visibility, and role boundaries remain enforced. Source corrections, withheld-source decisions, learner-safe projections, and content validation also remain active. These protect account security and correct curriculum delivery; they are not commercial access restrictions.

## Enabling restrictions later

Set `FREE_LAUNCH_MODE=false` in the backend environment and restart the backend. Then set `TERM_PIN_ENFORCED=true` and/or `CURRICULUM_SEQUENCE_ENFORCED=true` to activate those individual policies. Student account expiry and pending-admin-review gates also resume when free-launch mode is disabled.

This milestone uses environment configuration, not an admin dashboard control. A later admin UI should manage the same policies centrally and audit changes.
