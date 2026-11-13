#!/usr/bin/env python3
"""Validate the STS durable multi-agent task queue (Python standard library only)."""
from __future__ import annotations
import argparse
import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
QUEUE = ROOT / ".github/work-orchestrator" / "tasks.json"
STATUSES = {"backlog", "ready", "in_progress", "blocked", "stalled", "review", "completed", "cancelled"}
GATES = {"curriculum", "application", "verification", "release", "operations"}
PRIORITIES = {"P0", "P1", "P2", "P3"}
ID_RE = re.compile(r"^[A-Z][A-Z0-9]+-[0-9]{3,}$")

def parse_time(value: str, field: str) -> datetime:
    try:
        parsed = datetime.fromisoformat(value.replace("Z", "+00:00"))
        if parsed.tzinfo is None:
            raise ValueError("timezone required")
        return parsed.astimezone(timezone.utc)
    except Exception as exc:
        raise ValueError(f"{field} must be timezone-aware ISO-8601: {value!r}") from exc

def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--strict", action="store_true", help="fail on stalled or incomplete operational records")
    args = parser.parse_args()
    try:
        data = json.loads(QUEUE.read_text(encoding="utf-8"))
    except Exception as exc:
        print(f"ERROR: cannot read task registry: {exc}")
        return 2
    errors: list[str] = []
    warnings: list[str] = []
    tasks = data.get("tasks") if isinstance(data, dict) else None
    if data.get("version") != 1 or not isinstance(tasks, list):
        print("ERROR: registry must have version=1 and a tasks array")
        return 2
    by_id = {}
    for i, task in enumerate(tasks):
        prefix = f"tasks[{i}]"
        if not isinstance(task, dict):
            errors.append(f"{prefix}: expected object")
            continue
        required = ("id", "title", "gate", "status", "priority", "created_at", "updated_at", "depends_on", "files", "acceptance_criteria", "verification")
        for field in required:
            if field not in task:
                errors.append(f"{prefix}: missing {field}")
        tid = task.get("id")
        if not isinstance(tid, str) or not ID_RE.match(tid):
            errors.append(f"{prefix}: invalid task ID {tid!r}")
        elif tid in by_id:
            errors.append(f"{prefix}: duplicate task ID {tid}")
        else:
            by_id[tid] = task
        if task.get("status") not in STATUSES: errors.append(f"{prefix}: invalid status")
        if task.get("gate") not in GATES: errors.append(f"{prefix}: invalid gate")
        if task.get("priority") not in PRIORITIES: errors.append(f"{prefix}: invalid priority")
        if not isinstance(task.get("files"), list) or not task.get("files"): errors.append(f"{prefix}: files must be a non-empty list")
        if not isinstance(task.get("acceptance_criteria"), list) or not task.get("acceptance_criteria"): errors.append(f"{prefix}: acceptance_criteria must be non-empty")
        if not isinstance(task.get("verification"), list): errors.append(f"{prefix}: verification must be an array")
        for field in ("created_at", "updated_at"):
            try: parse_time(task[field], field)
            except Exception as exc: errors.append(f"{prefix}: {exc}")
        active = task.get("status") == "in_progress"
        if active:
            for field in ("owner", "heartbeat_at", "lease_expires_at", "checkpoint"):
                if not task.get(field): errors.append(f"{prefix}: in_progress requires {field}")
            if task.get("heartbeat_at") and task.get("lease_expires_at"):
                try:
                    heartbeat = parse_time(task["heartbeat_at"], "heartbeat_at")
                    lease = parse_time(task["lease_expires_at"], "lease_expires_at")
                    if lease <= heartbeat: errors.append(f"{prefix}: lease must expire after heartbeat")
                    now = datetime.now(timezone.utc)
                    grace = int(data.get("lease_policy", {}).get("recovery_grace_minutes", 15))
                    if (now - lease).total_seconds() > grace * 60:
                        warnings.append(f"{tid}: lease expired beyond recovery grace; mark stalled/reassign after confirming worker is inactive")
                except Exception as exc: errors.append(f"{prefix}: {exc}")
        if task.get("status") == "completed":
            if not task.get("verification") or not any(v.get("result") == "passed" and v.get("evidence") for v in task["verification"] if isinstance(v, dict)):
                errors.append(f"{prefix}: completed task requires passing verification evidence")
        if task.get("status") == "blocked" and not task.get("blocker"):
            errors.append(f"{prefix}: blocked task requires blocker description")
        if task.get("status") == "review" and not task.get("pull_request"):
            errors.append(f"{prefix}: review task requires pull_request URL")
    for tid, task in by_id.items():
        for dep in task.get("depends_on", []):
            if dep not in by_id: errors.append(f"{tid}: unknown dependency {dep}")
            elif dep == tid: errors.append(f"{tid}: task cannot depend on itself")
    # Detect dependency cycles.
    visiting, visited = set(), set()
    def visit(tid: str):
        if tid in visiting:
            errors.append(f"dependency cycle detected at {tid}")
            return
        if tid in visited: return
        visiting.add(tid)
        for dep in by_id[tid].get("depends_on", []):
            if dep in by_id: visit(dep)
        visiting.remove(tid); visited.add(tid)
    for tid in by_id: visit(tid)
    print(f"STS work queue: {len(tasks)} task(s), {len(errors)} error(s), {len(warnings)} warning(s)")
    for item in warnings: print(f"WARNING: {item}")
    for item in errors: print(f"ERROR: {item}")
    if args.strict and warnings:
        print("STRICT: operational warnings cause failure")
        return 1
    return 1 if errors else 0

if __name__ == "__main__":
    sys.exit(main())
