#!/usr/bin/env python3
"""Evidence-driven Markdown dashboard for the STS work queue."""
import argparse, json
from collections import Counter, defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
QUEUE = ROOT / ".github/work-orchestrator" / "tasks.json"
GATES = ("curriculum", "application", "verification", "release", "operations")
ACTIVE = {"in_progress", "stalled", "blocked", "review"}

def verified(task):
    checks = task.get("verification", [])
    return task.get("status") == "completed" and isinstance(checks, list) and any(
        isinstance(x, dict) and x.get("result") == "passed"
        and isinstance(x.get("evidence"), str) and x["evidence"].strip() for x in checks)

def render(data):
    tasks = data["tasks"]
    grouped = defaultdict(list)
    for task in tasks:
        grouped[task.get("gate", "unassigned")].append(task)
    counts = Counter(t.get("status", "invalid") for t in tasks)
    lines = [
        "# STS Completion-Gate Dashboard", "",
        "Registry updated: " + str(data.get("updated_at", "not recorded")), "",
        "**Tasks:** " + str(len(tasks)) + " | **Evidence-verified:** " + str(sum(verified(t) for t in tasks)),
        "**In progress:** " + str(counts["in_progress"]) + " | **Stalled:** " + str(counts["stalled"]) +
        " | **Blocked:** " + str(counts["blocked"]) + " | **In review:** " + str(counts["review"]), "",
        "> A task is verified only when status is completed and at least one passing verification record includes evidence. Status labels alone never establish completion.", "",
        "| Gate | Total | Verified | In progress | Stalled | Blocked | Review | Backlog/ready |",
        "|---|---:|---:|---:|---:|---:|---:|---:|"
    ]
    for gate in GATES:
        items = grouped.get(gate, [])
        vals = [len(items), sum(verified(t) for t in items)] + [
            sum(t.get("status") == s for t in items) for s in
            ("in_progress", "stalled", "blocked", "review")]
        vals.append(sum(t.get("status") in {"backlog", "ready"} for t in items))
        lines.append("| " + gate.title() + " | " + " | ".join(map(str, vals)) + " |")
    lines += ["", "## Work requiring attention", ""]
    attention = [t for t in tasks if t.get("status") in ACTIVE]
    if not attention:
        lines.append("No active, stalled, blocked or review tasks are recorded.")
    for t in attention:
        lines.append("- **" + str(t.get("id", "UNKNOWN")) + " — " + str(t.get("title", "Untitled")) +
                     "** (" + str(t.get("status")) + "); owner: " + str(t.get("owner") or "unassigned"))
        for key, label in (("pull_request", "PR"), ("blocker", "Blocker"), ("checkpoint", "Checkpoint")):
            if t.get(key):
                lines.append("  - " + label + ": " + str(t[key]))
    lines += ["", "## Verification evidence", ""]
    found = False
    for t in tasks:
        for item in t.get("verification", []) if isinstance(t.get("verification"), list) else []:
            if isinstance(item, dict):
                found = True
                lines.append("- **" + str(t.get("id")) + "** — " + str(item.get("result", "unrecorded")) +
                             ": " + str(item.get("evidence", "no evidence reference")))
    if not found:
        lines.append("No verification evidence has been recorded.")
    return "\n".join(lines) + "\n"

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--queue", type=Path, default=QUEUE)
    parser.add_argument("--output", type=Path)
    args = parser.parse_args()
    try:
        data = json.loads(args.queue.read_text(encoding="utf-8"))
        if not isinstance(data, dict) or not isinstance(data.get("tasks"), list):
            raise ValueError("registry must be an object with a tasks array")
        report = render(data)
    except Exception as exc:
        print("ERROR: cannot build dashboard: " + str(exc))
        return 2
    if args.output:
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(report, encoding="utf-8")
    else:
        print(report, end="")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
