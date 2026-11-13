#!/usr/bin/env python3
"""Validate the STS durable multi-agent task queue (Python standard library only)."""
from __future__ import annotations

import argparse
import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
QUEUE = ROOT / ".github" / "work-orchestrator" / "tasks.json"
STATUSES = {"backlog", "ready", "in_progress", "blocked", "stalled", "review", "completed", "cancelled"}
GATES = {"curriculum", "application", "verification", "release", "operations"}
PRIORITIES = {"P0", "P1", "P2", "P3"}
ID_RE = re.compile(r"^[A-Z][A-Z0-9]+-[0-9]{3,}$")
URL_RE = re.compile(r"^https://\\S+$")


def parse_time(value: Any, field: str) -> datetime:
    if not isinstance(value, str):
        raise ValueError(f"{field} must be a string")
    try:
        parsed = datetime.fromisoformat(value.replace("Z", "+00:00"))
        if parsed.tzinfo is None or parsed.utcoffset() is None:
            raise ValueError("timezone required")
        return parsed.astimezone(timezone.utc)
    except Exception as exc:
        raise ValueError(f"{field} must be timezone-aware ISO-8601: {value!r}") from exc


def validate(data: Any, now: datetime | None = None) -> tuple[list[str], list[str]]:
    errors: list[str] = []
    warnings: list[str] = []
    if not isinstance(data, dict):
        return ["registry root must be a JSON object"], warnings
    if data.get("version") != 1:
        errors.append("registry version must equal 1")
    tasks = data.get("tasks")
    if not isinstance(tasks, list):
        return errors + ["registry tasks must be an array"], warnings

    policy = data.get("lease_policy", {})
    if not isinstance(policy, dict):
        errors.append("lease_policy must be an object")
        policy = {}
    grace = policy.get("recovery_grace_minutes", 15)
    if not isinstance(grace, int) or isinstance(grace, bool) or grace < 0:
        errors.append("lease_policy.recovery_grace_minutes must be a non-negative integer")
        grace = 15
    now = now or datetime.now(timezone.utc)
    by_id: dict[str, dict[str, Any]] = {}
    active_owners: dict[str, str] = {}

    for index, task in enumerate(tasks):
        prefix = f"tasks[{index}]"
        if not isinstance(task, dict):
            errors.append(f"{prefix}: expected object")
            continue
        required = ("id", "title", "gate", "status", "priority", "created_at", "updated_at",
                    "depends_on", "files", "acceptance_criteria", "verification")
        for field in required:
            if field not in task:
                errors.append(f"{prefix}: missing {field}")

        tid = task.get("id")
        valid_id = isinstance(tid, str) and ID_RE.fullmatch(tid) is not None
        if not valid_id:
            errors.append(f"{prefix}: invalid task ID {tid!r}")
        elif tid in by_id:
            errors.append(f"{prefix}: duplicate task ID {tid}")
        else:
            by_id[tid] = task

        for field, allowed in (("status", STATUSES), ("gate", GATES), ("priority", PRIORITIES)):
            if task.get(field) not in allowed:
                errors.append(f"{prefix}: invalid {field}")
        for field in ("title",):
            if not isinstance(task.get(field), str) or not task[field].strip():
                errors.append(f"{prefix}: {field} must be a non-empty string")
        for field in ("files", "acceptance_criteria"):
            value = task.get(field)
            if not isinstance(value, list) or not value or any(not isinstance(x, str) or not x.strip() for x in value):
                errors.append(f"{prefix}: {field} must be a non-empty array of non-empty strings")
        deps = task.get("depends_on")
        if not isinstance(deps, list) or any(not isinstance(x, str) for x in deps):
            errors.append(f"{prefix}: depends_on must be an array of task ID strings")
            deps = []
        verification = task.get("verification")
        if not isinstance(verification, list):
            errors.append(f"{prefix}: verification must be an array")
            verification = []
        for field in ("created_at", "updated_at"):
            try:
                parse_time(task.get(field), field)
            except ValueError as exc:
                errors.append(f"{prefix}: {exc}")

        status = task.get("status")
        if status == "in_progress":
            for field in ("owner", "heartbeat_at", "lease_expires_at", "checkpoint"):
                if not isinstance(task.get(field), str) or not task[field].strip():
                    errors.append(f"{prefix}: in_progress requires non-empty {field}")
            owner = task.get("owner")
            if isinstance(owner, str) and owner:
                if owner in active_owners:
                    errors.append(f"{prefix}: owner {owner!r} already holds active task {active_owners[owner]}")
                else:
                    active_owners[owner] = str(tid)
            try:
                heartbeat = parse_time(task.get("heartbeat_at"), "heartbeat_at")
                lease = parse_time(task.get("lease_expires_at"), "lease_expires_at")
                if lease <= heartbeat:
                    errors.append(f"{prefix}: lease must expire after heartbeat")
                elif (now - lease).total_seconds() > grace * 60:
                    warnings.append(f"{tid}: lease expired beyond recovery grace; verify worker inactivity before reassignment")
            except ValueError as exc:
                errors.append(f"{prefix}: {exc}")
        else:
            if task.get("lease_expires_at") is not None or task.get("heartbeat_at") is not None:
                warnings.append(f"{tid}: non-active task retains heartbeat/lease metadata")
        if status == "completed":
            passed = any(
                isinstance(item, dict)
                and item.get("result") == "passed"
                and isinstance(item.get("evidence"), str)
                and item["evidence"].strip()
                for item in verification
            )
            if not passed:
                errors.append(f"{prefix}: completed task requires passing verification evidence")
        if status == "blocked" and (not isinstance(task.get("blocker"), str) or not task["blocker"].strip()):
            errors.append(f"{prefix}: blocked task requires blocker description")
        if status == "review" and (not isinstance(task.get("pull_request"), str) or not URL_RE.fullmatch(task["pull_request"])):
            errors.append(f"{prefix}: review task requires an https pull_request URL")
        if task.get("pull_request") is not None and (
            not isinstance(task.get("pull_request"), str) or not URL_RE.fullmatch(task["pull_request"])
        ):
            errors.append(f"{prefix}: pull_request must be null or an https URL")
        checkpoint = task.get("checkpoint")
        if status in {"in_progress", "stalled", "blocked", "review"} and (
            not isinstance(checkpoint, str) or not checkpoint.strip()
        ):
            warnings.append(f"{tid}: operational task has no checkpoint path")

    for tid, task in by_id.items():
        deps = task.get("depends_on", [])
        if not isinstance(deps, list):
            continue
        for dep in deps:
            if dep not in by_id:
                errors.append(f"{tid}: unknown dependency {dep}")
            elif dep == tid:
                errors.append(f"{tid}: task cannot depend on itself")
            elif task.get("status") == "completed" and by_id[dep].get("status") not in {"completed", "cancelled"}:
                errors.append(f"{tid}: cannot be completed while dependency {dep} is {by_id[dep].get('status')}")

    visiting: set[str] = set()
    visited: set[str] = set()

    def visit(tid: str) -> None:
        if tid in visiting:
            errors.append(f"dependency cycle detected at {tid}")
            return
        if tid in visited:
            return
        visiting.add(tid)
        deps = by_id[tid].get("depends_on", [])
        if isinstance(deps, list):
            for dep in deps:
                if dep in by_id:
                    visit(dep)
        visiting.remove(tid)
        visited.add(tid)

    for tid in by_id:
        visit(tid)
    return errors, warnings


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--strict", action="store_true", help="fail on operational warnings")
    parser.add_argument("--queue", type=Path, default=QUEUE, help="registry path (used by tests and tooling)")
    args = parser.parse_args()
    try:
        data = json.loads(args.queue.read_text(encoding="utf-8"))
    except Exception as exc:
        print(f"ERROR: cannot read task registry: {exc}")
        return 2
    errors, warnings = validate(data)
    print(f"STS work queue: {len(data.get('tasks', [])) if isinstance(data, dict) and isinstance(data.get('tasks'), list) else 0} task(s), {len(errors)} error(s), {len(warnings)} warning(s)")
    for item in warnings:
        print(f"WARNING: {item}")
    for item in errors:
        print(f"ERROR: {item}")
    if args.strict and warnings:
        print("STRICT: operational warnings cause failure")
        return 1
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
