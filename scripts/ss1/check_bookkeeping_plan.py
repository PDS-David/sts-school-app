#!/usr/bin/env python3
"""Check the real SS1 compiler plan for the Bookkeeping source package only.

The source archive, staged DOCX files and full compiler plan stay in the runner's
private temporary directory. This script prints counts and IDs, never lesson text.
"""
import json
import sys
from pathlib import Path

plan_path = Path(sys.argv[1])
plan = json.loads(plan_path.read_text(encoding="utf-8"))
assert plan.get("version") == "ss1-plan-v1", "unexpected SS1 plan version"

expected_sources = {
    "SS1-SRC-62b02f2adcb3": {
        "sha256": "9b24550136a914c0056299abdb8aeed897244929a2c330ff3892d1fa07efdce0",
        "member": "SSS 1/1st Term SS1_/book keeping.docx",
        "compiled_rows": 4,
    },
    "SS1-SRC-97c1db5b1eb0": {
        "sha256": "c8c75f55e327d7d3e6ece6b3caca2ea841d3d3a45d324ceb221843c265157af3",
        "member": "SSS 1/2nd Term SS1_/Book keeping.docx",
        "compiled_rows": 0,
    },
    "SS1-SRC-97f226215927": {
        "sha256": "343c428b86364be8e1784c814fdd7ca3d02836f508e7eff289af0e139447fd7d",
        "member": "SSS 1/3rd Term SS1_/BOOK KEEPING_.docx",
        "compiled_rows": 8,
    },
}

previews = {item["source_id"]: item for item in plan.get("source_previews", [])}
rows = plan.get("rows", [])
dispositions = {item["id"]: item["status"] for item in plan.get("dispositions", [])}

for source_id, expected in expected_sources.items():
    preview = previews.get(source_id)
    assert preview is not None, f"missing actual parser preview for {source_id}"
    assert preview["sha256"] == expected["sha256"], f"source hash mismatch for {source_id}"

    compiled = [
        row for row in rows
        if row.get("subjectName") == "Bookkeeping"
        and row.get("filePath", "").replace("\\", "/").endswith(expected["member"])
    ]
    assert len(compiled) == expected["compiled_rows"], (
        f"{source_id}: expected {expected['compiled_rows']} compiled original rows, got {len(compiled)}"
    )

assert dispositions.get("SS1-SRC-97c1db5b1eb0") == "PROVEN_DUPLICATE", (
    "second-term duplicate must be proven by parsed teaching-body comparison"
)

for marker_id in (
    "RULE-BK-T3-REVISION-1",
    "RULE-BK-T3-REVISION-11",
    "RULE-BK-T3-EXAM-12",
):
    assert dispositions.get(marker_id) == "SCHEME_ONLY", (
        f"third-term scheme marker was not preserved as SCHEME_ONLY: {marker_id}"
    )

supplements = [
    row for row in rows
    if row.get("subjectName") == "Bookkeeping"
    and row.get("filePath", "").replace("\\", "/").startswith("__ss1_supplements__/bookkeeping/")
]
assert len(supplements) == 32, f"expected 32 Bookkeeping supplements, got {len(supplements)}"

bookkeeping_blockers = [
    blocker for blocker in plan.get("blockers", [])
    if "BOOKKEEPING" in blocker.upper() or "bookkeeping" in blocker.lower()
]
assert not bookkeeping_blockers, (
    "Bookkeeping-specific compiler blockers remain: " + "; ".join(bookkeeping_blockers)
)

print(json.dumps({
    "bookkeeping_source_compiler": "PASS",
    "source_members_hash_checked": len(expected_sources),
    "compiled_original_rows": {
        "1st Term": 4,
        "2nd Term": 0,
        "3rd Term": 8,
    },
    "second_term_duplicate": dispositions["SS1-SRC-97c1db5b1eb0"],
    "third_term_scheme_markers": "3 preserved as SCHEME_ONLY",
    "project_authored_supplements": len(supplements),
    "bookkeeping_specific_blockers": len(bookkeeping_blockers),
    "overall_plan_ready": bool(plan.get("ready")),
    "overall_plan_blocker_count": len(plan.get("blockers", [])),
}, indent=2))
