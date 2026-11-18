# Free-launch learning access policy

The initial STS School App launch is free and open for curriculum learning. Access restrictions are opt-in and remain disabled unless an administrator explicitly configures them.

## Defaults

- `TERM_PIN_ENFORCED` defaults to off. Term PINs may still be redeemed and recorded, but do not gate lesson access unless the environment variable is explicitly set to `true`.
- `CURRICULUM_SEQUENCE_ENFORCED` defaults to off. Students may open curriculum topics without first passing the preceding topic. Set it to `true` only when sequence restrictions are intentionally activated.
- SS1 and SS2 lesson package term access follows the same Term PIN default: all terms are available while enforcement is off.
- No subscription or payment gate is introduced by the curriculum lesson-generation feature.

## Safeguards that remain active

Free access does not mean anonymous or cross-school access. Authentication, active account checks, student identity, school/class visibility, and role boundaries remain enforced. Source corrections, withheld-source decisions, learner-safe projections, and content validation also remain active. These protect correct curriculum delivery and must not be treated as commercial restrictions.

## Enabling restrictions later

Set `TERM_PIN_ENFORCED=true` and/or `CURRICULUM_SEQUENCE_ENFORCED=true` in the backend environment, then restart the backend. Leave either unset or set to `false` for free-launch behaviour. These flags are independent so an administrator can enable one policy without enabling the other.

This is an environment-level switch in this milestone, not yet an admin dashboard control. A later admin UI should manage the same policy centrally and audit changes.
