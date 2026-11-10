#!/usr/bin/env python3
"""Copy only the manifest-assigned English SS1 source members into a private parser root."""
import argparse
import csv
import hashlib
import json
from pathlib import Path
import shutil

REPO = Path(__file__).resolve().parents[2]
MANIFEST = REPO / "docs/ss1/IMPLEMENTATION_20261026/SOURCE_ASSIGNMENTS.csv"

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", required=True, type=Path, help="verified output from prepare_sources.py")
    parser.add_argument("--output", required=True, type=Path, help="new subject-only staging directory")
    args = parser.parse_args()

    root = args.root.resolve(strict=True)
    output = args.output.resolve()
    if output.exists():
        raise SystemExit("Use a new output directory; subject staging is never overwritten")

    with MANIFEST.open(newline="", encoding="utf-8") as handle:
        rows = [row for row in csv.DictReader(handle) if row["assigned_subject_slug"] == "english"]
    if len(rows) != 3:
        raise SystemExit(f"Expected exactly three assigned English source members, found {len(rows)}")

    output.mkdir(parents=True, exist_ok=False)
    copied = []
    for row in rows:
        member = Path(row["archive_member"])
        source = (root / member).resolve(strict=True)
        target = (output / member).resolve()
        if not source.is_relative_to(root) or not target.is_relative_to(output):
            raise SystemExit(f"Source member escapes the staging root: {row['source_id']}")
        if not source.is_file():
            raise SystemExit(f"Assigned source member is not a file: {row['source_id']}")
        digest = hashlib.sha256(source.read_bytes()).hexdigest()
        if digest != row["sha256"]:
            raise SystemExit(f"Source hash mismatch after staging: {row['source_id']}")
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(source, target)
        copied.append({"source_id": row["source_id"], "archive_member": row["archive_member"], "sha256": digest})

    print(json.dumps({"subject_slug": "english", "staged_source_members": len(copied), "members": copied}, indent=2))

if __name__ == "__main__":
    main()
