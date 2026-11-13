"""Unit tests for scripts/validate_work_queue.py."""
import importlib.util
import unittest
from datetime import datetime, timezone
from pathlib import Path

MODULE_PATH = Path(__file__).resolve().parents[1] / "scripts" / "validate_work_queue.py"
SPEC = importlib.util.spec_from_file_location("validate_work_queue", MODULE_PATH)
MODULE = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(MODULE)


def task(task_id="OPS-001", **overrides):
    value = {
        "id": task_id, "title": "A valid task", "gate": "operations",
        "status": "backlog", "priority": "P1",
        "created_at": "2026-11-13T10:00:00Z", "updated_at": "2026-11-13T10:00:00Z",
        "depends_on": [], "files": ["scripts/**"],
        "acceptance_criteria": ["A verifiable outcome exists"], "verification": [],
        "heartbeat_at": None, "lease_expires_at": None, "owner": None, "checkpoint": None,
        "pull_request": None,
    }
    value.update(overrides)
    return value


class WorkQueueValidationTests(unittest.TestCase):
    def test_valid_backlog_task(self):
        errors, warnings = MODULE.validate({"version": 1, "tasks": [task()]})
        self.assertEqual(errors, [])
        self.assertEqual(warnings, [])

    def test_review_task_accepts_https_pull_request_url_containing_s(self):
        review = task(
            status="review",
            checkpoint=".github/work-orchestrator/checkpoints/ORCH-001.md",
            pull_request="https://github.com/PDS-David/sts-school-app/pull/683",
        )
        errors, warnings = MODULE.validate({"version": 1, "tasks": [review]})
        self.assertEqual(errors, [])
        self.assertEqual(warnings, [])

    def test_review_task_rejects_non_https_pull_request_url(self):
        review = task(
            status="review",
            checkpoint=".github/work-orchestrator/checkpoints/ORCH-001.md",
            pull_request="http://github.com/PDS-David/sts-school-app/pull/683",
        )
        errors, _ = MODULE.validate({"version": 1, "tasks": [review]})
        self.assertTrue(any("review task requires an https pull_request URL" in item for item in errors))

    def test_pull_request_url_rejects_embedded_whitespace(self):
        review = task(
            status="review",
            checkpoint=".github/work-orchestrator/checkpoints/ORCH-001.md",
            pull_request="https://github.com/PDS-David/sts-school-app/pull/ 683",
        )
        errors, _ = MODULE.validate({"version": 1, "tasks": [review]})
        self.assertTrue(any("review task requires an https pull_request URL" in item for item in errors))
    def test_non_object_root_is_reported_not_crashed(self):
        errors, _ = MODULE.validate([])
        self.assertIn("registry root must be a JSON object", errors)

    def test_duplicate_ids_and_dependency_cycle_are_rejected(self):
        first = task("OPS-001", depends_on=["OPS-002"])
        second = task("OPS-002", depends_on=["OPS-001"])
        errors, _ = MODULE.validate({"version": 1, "tasks": [first, second, task("OPS-001")]})
        self.assertTrue(any("duplicate task ID" in item for item in errors))
        self.assertTrue(any("dependency cycle" in item for item in errors))

    def test_active_task_requires_owner_heartbeat_lease_and_checkpoint(self):
        errors, _ = MODULE.validate({"version": 1, "tasks": [task(status="in_progress")]})
        self.assertTrue(any("in_progress requires owner" in item for item in errors))
        self.assertTrue(any("in_progress requires checkpoint" in item for item in errors))

    def test_expired_lease_is_warning_not_automatic_reassignment(self):
        active = task(
            status="in_progress", owner="worker-a", checkpoint=".checkpoints/OPS-001.md",
            heartbeat_at="2026-11-13T10:00:00Z", lease_expires_at="2026-11-13T10:45:00Z",
        )
        errors, warnings = MODULE.validate(
            {"version": 1, "lease_policy": {"recovery_grace_minutes": 15}, "tasks": [active]},
            now=datetime(2026, 11, 13, 12, 0, tzinfo=timezone.utc),
        )
        self.assertEqual(errors, [])
        self.assertTrue(any("verify worker inactivity" in item for item in warnings))

    def test_completed_task_requires_passing_evidence_and_completed_dependencies(self):
        dependency = task("OPS-002")
        completed = task(
            "OPS-001", status="completed", depends_on=["OPS-002"],
            verification=[{"result": "passed", "evidence": "workflow run 123"}],
        )
        errors, _ = MODULE.validate({"version": 1, "tasks": [dependency, completed]})
        self.assertTrue(any("cannot be completed while dependency" in item for item in errors))

    def test_same_worker_cannot_own_two_active_tasks(self):
        active = {
            "status": "in_progress", "owner": "worker-a", "checkpoint": ".checkpoints/task.md",
            "heartbeat_at": "2026-11-13T10:00:00Z", "lease_expires_at": "2026-11-13T11:00:00Z",
        }
        errors, _ = MODULE.validate({"version": 1, "tasks": [
            task("OPS-001", **active), task("OPS-002", **active)
        ]})
        self.assertTrue(any("already holds active task" in item for item in errors))



class CompletionDashboardTests(unittest.TestCase):
    def test_dashboard_does_not_count_status_without_evidence(self):
        import importlib.util
        path = Path(__file__).resolve().parents[1] / "scripts" / "build_completion_dashboard.py"
        spec = importlib.util.spec_from_file_location("completion_dashboard", path)
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)
        data = {"updated_at": "2026-11-13T00:00:00Z", "tasks": [
            task("OPS-010", status="completed", verification=[]),
            task("OPS-011", status="completed", verification=[
                {"result": "passed", "evidence": "CI run #123"}
            ])
        ]}
        report = module.render(data)
        self.assertIn("Evidence-verified:** 1", report)
        self.assertIn("No active, stalled, blocked or review tasks", report)


if __name__ == "__main__":
    unittest.main()
