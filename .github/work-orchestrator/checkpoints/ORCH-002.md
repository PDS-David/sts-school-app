# Checkpoint — ORCH-002

- **Task:** Integrate agent-platform worker launch and recovery adapter
- **Status:** blocked
- **Reason:** No actual agent execution platform, supported API endpoint/schema, or authentication contract is identified in the repository or available tool interface.
- **Safety:** Do not invent API endpoints, accept arbitrary webhook URLs, or store agent credentials in the repository. Do not claim GitHub Actions can revive an expired ChatGPT session by itself.
- **Required input:** Platform/provider name, documented launch/resume/status API, authorized secret name and permitted scopes, and idempotency/concurrency guarantees.
- **Resume:** Once the supported contract is supplied, implement an adapter with mocked contract tests first, then a guarded opt-in integration test.
