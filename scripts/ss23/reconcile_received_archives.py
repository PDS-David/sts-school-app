#!/usr/bin/env python3
"""Reconcile re-issued combined SS2/SS3 ZIPs against the original member register.

The comparison is content-based: the re-issued ZIPs use different outer archive
names and member path prefixes, so archive SHA and member path are not identity.
Class, term, member SHA-256 and byte count must all agree, including duplicates.
"""
from __future__ import annotations

import argparse
import csv
import hashlib
import json
import re
import sys
import zipfile
from collections import Counter
from pathlib import PurePosixPath
from typing import Iterable

TERM_NAMES = {"1st": "1st Term", "2nd": "2nd Term", "3rd": "3rd Term"}


def classify_member(member: str) -> tuple[str, str] | None:
    """Return canonical class and term from the member's folder path."""
    parts = PurePosixPath(member).parts
    if len(parts) < 2:
        return None
    class_match = re.search(r"\bSSS?\s*([23])\b", parts[0], re.IGNORECASE)
    term_match = re.search(r"\b(1st|2nd|3rd)\s+Term\b", "/".join(parts[1:]), re.IGNORECASE)
    if not class_match or not term_match:
        return None
    return f"SS{class_match.group(1)}", TERM_NAMES[term_match.group(1).lower()]


def archive_members(archive_path: str, expected_class: str) -> tuple[list[dict], list[str]]:
    rows: list[dict] = []
    errors: list[str] = []
    try:
        with zipfile.ZipFile(archive_path) as archive:
            for info in archive.infolist():
                if info.is_dir():
                    continue
                classified = classify_member(info.filename)
                if classified is None:
                    errors.append(f"{archive_path}:{info.filename}: cannot infer class/term from member path")
                    continue
                class_name, term = classified
                if class_name != expected_class:
                    errors.append(f"{archive_path}:{info.filename}: expected {expected_class}, found {class_name}")
                    continue
                if info.flag_bits & 0x1:
                    errors.append(f"{archive_path}:{info.filename}: encrypted member is not readable")
                    continue
                with archive.open(info) as stream:
                    digest = hashlib.sha256()
                    size = 0
                    for chunk in iter(lambda: stream.read(1024 * 1024), b""):
                        digest.update(chunk)
                        size += len(chunk)
                rows.append({
                    "class": class_name,
                    "term": term,
                    "sha256": digest.hexdigest(),
                    "bytes": size,
                    "archive_member": info.filename,
                })
    except (OSError, zipfile.BadZipFile) as error:
        errors.append(f"{archive_path}: {error}")
    return rows, errors


def expected_members(assignments_path: str) -> list[dict]:
    with open(assignments_path, newline="", encoding="utf-8-sig") as stream:
        reader = csv.DictReader(stream)
        required = {"class", "term", "sha256", "bytes"}
        missing = required - set(reader.fieldnames or [])
        if missing:
            raise ValueError(f"assignment CSV missing columns: {', '.join(sorted(missing))}")
        rows = []
        for line, row in enumerate(reader, start=2):
            try:
                size = int(row["bytes"])
            except (TypeError, ValueError):
                raise ValueError(f"assignment CSV line {line}: invalid byte count") from None
            if not re.fullmatch(r"[a-fA-F0-9]{64}", row["sha256"]):
                raise ValueError(f"assignment CSV line {line}: invalid SHA-256")
            rows.append({
                "class": row["class"].strip(),
                "term": row["term"].strip(),
                "sha256": row["sha256"].lower(),
                "bytes": size,
            })
    return rows


def reconcile(actual: Iterable[dict], expected: Iterable[dict]) -> dict:
    """Compare multisets so identical duplicate documents cannot disappear."""
    def key(row: dict) -> tuple:
        return row["class"], row["term"], row["sha256"], row["bytes"]

    actual_rows, expected_rows = list(actual), list(expected)
    actual_counts, expected_counts = Counter(map(key, actual_rows)), Counter(map(key, expected_rows))
    missing = list((expected_counts - actual_counts).elements())
    unexpected = list((actual_counts - expected_counts).elements())
    return {
        "valid": not missing and not unexpected,
        "expected_members": len(expected_rows),
        "actual_members": len(actual_rows),
        "matched_members": len(actual_rows) - len(unexpected),
        "missing": [
            {"class": c, "term": t, "sha256": h, "bytes": size}
            for c, t, h, size in missing
        ],
        "unexpected": [
            {"class": c, "term": t, "sha256": h, "bytes": size}
            for c, t, h, size in unexpected
        ],
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--ss2", required=True, help="re-supplied combined SS2 ZIP")
    parser.add_argument("--ss3", required=True, help="re-supplied combined SS3 ZIP")
    parser.add_argument("--assignments", required=True, help="authoritative SOURCE_ASSIGNMENTS.csv")
    parser.add_argument("--json", action="store_true", help="emit machine-readable JSON")
    args = parser.parse_args()

    try:
        expected = expected_members(args.assignments)
    except (OSError, ValueError) as error:
        print(f"source register error: {error}", file=sys.stderr)
        return 2

    ss2, err2 = archive_members(args.ss2, "SS2")
    ss3, err3 = archive_members(args.ss3, "SS3")
    errors = err2 + err3
    report = reconcile(ss2 + ss3, expected)
    report["archive_errors"] = errors
    report["valid"] = report["valid"] and not errors

    if args.json:
        print(json.dumps(report, indent=2))
    else:
        print(f"Member reconciliation: {'PASS' if report['valid'] else 'FAIL'}")
        print(f"Matched {report['matched_members']} of {report['expected_members']} expected members")
        print(f"Received members: {report['actual_members']}")
        print(f"Missing identities: {len(report['missing'])}; unexpected identities: {len(report['unexpected'])}")
        for error in errors:
            print(f"ARCHIVE ERROR: {error}")
        for row in report["missing"]:
            print(f"MISSING: {row}")
        for row in report["unexpected"]:
            print(f"UNEXPECTED: {row}")
    return 0 if report["valid"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
