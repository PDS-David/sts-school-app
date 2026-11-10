#!/usr/bin/env python3
"""Check English source parsing against the real SS1 importer plan.

The source archive, extracted documents and complete plan remain in the runner's
private temporary directory. This checker emits counts and IDs, never lesson text.
"""
import csv
import json
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
plan = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
package = json.loads((REPO / "backend/src/db/ss1/subjects/english.json").read_text(encoding="utf-8"))
manifest_path = REPO / "docs/ss1/IMPLEMENTATION_20261026/SOURCE_ASSIGNMENTS.csv"
with manifest_path.open(newline="", encoding="utf-8") as handle:
    manifest = list(csv.DictReader(handle))
assigned = {row["source_id"]: row for row in manifest if row["assigned_subject_slug"] == "english"}
sources = {source["source_id"]: source for source in package["sources"]}

assert plan.get("version") == "ss1-plan-v1", "unexpected SS1 plan version"
assert set(sources) == set(assigned), "English package sources differ from the assigned manifest"

previews = {item["source_id"]: item for item in plan.get("source_previews", [])}
rows = plan.get("rows", [])
dispositions = {item["id"]: item["status"] for item in plan.get("dispositions", [])}

compiled_counts = {}
for source_id, source in sources.items():
    record = assigned[source_id]
    assert source["sha256"] == record["sha256"], f"manifest hash mismatch: {source_id}"
    assert source["archive_member"] == record["archive_member"], f"manifest member mismatch: {source_id}"
    assert source["term"] == record["term_from_folder"], f"manifest term mismatch: {source_id}"
    preview = previews.get(source_id)
    assert preview is not None, f"missing real parser preview: {source_id}"
    assert preview["sha256"] == source["sha256"], f"parser source hash mismatch: {source_id}"

    expected_rows = sum(
        1 for coverage in package["coverage"]
        if coverage["source_id"] == source_id and coverage["id"].startswith("ENGLISH-BODY-")
    )
    compiled = [
        row for row in rows
        if row.get("subjectName") == "English Language"
        and row.get("filePath", "").replace("\\", "/").endswith(source["archive_member"])
    ]
    assert len(compiled) == expected_rows, (
        f"{source_id}: expected {expected_rows} original rows from the indexed package, got {len(compiled)}"
    )
    compiled_counts[source["term"]] = len(compiled)

marker_rules = [
    rule for rule in package["source_rules"]
    if rule["op"] == "classify_marker" and rule["kind"] == "SCHEME_ONLY"
]
for rule in marker_rules:
    assert dispositions.get(rule["id"]) == "SCHEME_ONLY", (
        f"scheme-only marker was not preserved: {rule['id']}"
    )

supplements = [
    row for row in rows
    if row.get("subjectName") == "English Language"
    and row.get("filePath", "").replace("\\", "/").startswith("__ss1_supplements__/english/")
]
assert len(supplements) == len(package["lessons"]), (
    f"expected {len(package['lessons'])} English supplements, got {len(supplements)}"
)
supplement_ids = {row["filePath"].replace("\\", "/").rsplit("/", 1)[-1] for row in supplements}
assert supplement_ids == {lesson["id"] for lesson in package["lessons"]}, (
    "the real compiler's English supplement set differs from english.json"
)

expected_blockers = set()
if package["package_status"] == "PENDING":
    expected_blockers.add("PENDING_PACKAGE:english")
for lesson in package["lessons"]:
    state = lesson["state"]
    if (
        state["implementation"] != "IMPLEMENTED"
        or state["content_approval"] != "APPROVED"
        or not state["approval_reference"]
        or any(source["reuse_status"] != "PERMITTED" for source in lesson["provenance"])
    ):
        expected_blockers.add(f"LESSON_NOT_APPROVED:{lesson['id']}")
for asset in package["assets"]:
    state = asset["state"]
    if (
        state["content_approval"] != "APPROVED"
        or not state["approval_reference"]
        or state["implementation"] != "IMPLEMENTED"
        or asset["provenance"]["reuse_status"] != "PERMITTED"
    ):
        expected_blockers.add(f"ASSET_NOT_APPROVED:{asset['id']}")
for coverage in package["coverage"]:
    if coverage["status"] in ("PARTIAL", "UNRESOLVED"):
        expected_blockers.add(f"INCOMPLETE_COVERAGE:{coverage['id']}")
for item in package["open_items"]:
    if item["blocks_delivery"]:
        expected_blockers.add(f"OPEN_ITEM:{item['id']}:{item['required_action']}")

english_blockers = {
    blocker for blocker in plan.get("blockers", [])
    if "english" in blocker.lower()
}
assert english_blockers == expected_blockers, (
    "English-specific compiler blockers differ from the explicit approval/coverage gates; "
    f"unexpected={sorted(english_blockers - expected_blockers)}, "
    f"missing={sorted(expected_blockers - english_blockers)}"
)

print(json.dumps({
    "english_source_compiler": "PASS",
    "source_members_hash_checked": len(sources),
    "compiled_original_rows": compiled_counts,
    "scheme_only_markers": len(marker_rules),
    "project_authored_supplements": len(supplements),
    "english_specific_blockers": len(english_blockers),
    "expected_owner_gates_only": True,
    "overall_plan_ready": bool(plan.get("ready")),
    "overall_plan_blocker_count": len(plan.get("blockers", [])),
}, indent=2))
