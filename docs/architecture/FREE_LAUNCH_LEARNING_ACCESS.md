# Free-launch learning access policy

The initial STS School App launch is free and open for student learning. The backend defaults to free-launch mode unless explicitly disabled.

## Default behaviour

- `FREE_LAUNCH_MODE` defaults to enabled. Student account expiry dates and pending-admin-review gates do not block learning access during this period.
- `TERM_PIN_ENFORCED` and `CURRICULUM_SEQUENCE_ENFORCED` are dormant while free-launch mode is enabled. Students can access all terms and topics without PIN redemption or passing a preceding topic.
- SS1 and SS2 lesson package term access follows the same open-term policy.
- No subscription or payment gate is introduced by curriculum lesson generation.

## Safeguards that remain active

Free access does not mean anonymous or cross-school access. Authentication, manually deactivated-account checks, deleted-student-record checks, student identity, school/class visibility, and role boundaries remain enforced. Source corrections, withheld-source decisions, learner-safe projections, and content validation also remain active. These protect account security and correct curriculum delivery; they are not commercial access restrictions.

## Global admin controls

Migration `0008_learning_access_settings.sql` adds one global policy row with the same free-launch defaults. After that migration is applied, a **global administrator** can open **More → Learning Access** to manage:

- Free launch mode.
- Term PIN enforcement.
- Curriculum topic-sequence enforcement.

School-bound administrators cannot change this deployment-wide policy. Changes are persisted and written to the tamper-evident audit log. The API reads the persisted policy during authentication, so changes take effect without an API restart.

When free launch is enabled, the two curriculum restrictions remain inactive even if their switches are prepared for later. Turning free launch off resumes student account-expiry and pending-admin-review gates and activates whichever of the two curriculum restrictions are enabled.

## Environment overrides and migration

Explicit backend environment values take precedence over the saved admin settings. If an override is active, the admin screen warns that the saved setting will not become effective until the corresponding environment variable is removed. This preserves an operator-controlled emergency override.

Fresh installs receive the settings table and free-launch row from `backend/schema.sql`. Existing databases must apply numbered migration 0008 through the reviewed migration procedure; do not use `--fresh` on an existing database or bypass the OPS-05 schema-drift review. Until migration 0008 is applied, authentication falls back to the previous environment/default behaviour and the admin endpoint reports that the migration is required.
