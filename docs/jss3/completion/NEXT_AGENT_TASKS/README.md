# Next assignments — complete individual prompt files

Give an agent ONE numbered Markdown file below. Each includes its own execution contract, required files, commands, implementation scope, checks, publication rules and blocked-state handling. It does not require knowing what another agent is doing. Fetch current master before starting.

| Order | Prompt | Start condition |
|---|---|---|
| 1 | [DB1](01_DB1_REAL_DATABASE_ACCEPTANCE.md) | Source ZIP + disposable local PostgreSQL |
| 2 | [MATH3](06_MATH3_BINARY_FORMATTING_ONLY.md) | Source ZIP; can run beside DB1 on separate branch |
| 3 | [DEVICE1](02_DEVICE1_PHONE_ACCEPTANCE.md) | Authorised staging build/session and phone |
| 4 | [TEACHER1](03_TEACHER1_APPLY_THREE_MATH_DECISIONS.md) | Dated teacher answers; do not ask an agent to invent them |
| 5 | [BASELINE1](04_BASELINE1_COMPARE_CERTIFIED_EXPORT.md) | Certified export + release snapshot; filenames not yet known |
| 6 | [SEQUENCE2](05_SEQUENCE2_IMPLEMENT_APPROVED_POLICY.md) | Explicit Batch 3/policy approval and placement decisions |

M1 and M2 recovery have been integrated; do not assign them again. A2 observation, D1 answers and P1 real-data comparison are not completed by their documents. S1 is a design, not an implemented sequence. “Blocked” is an honest result when an external prerequisite is absent; it is never a substitute for finishing implementable code.

Remaining broader school items (Yoruba verse/text permissions, English set texts/symbols, practical observations and school project guidelines) remain in OPEN_BLOCKERS.csv and SCHOOL_DECISIONS_REQUIRED.md. These prompts do not waive them. Production release is a later, separately approved operation after integration, staging, protected-row and schema checks.
