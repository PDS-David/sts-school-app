#!/usr/bin/env python3
"""BASELINE3: combine per-school capture exports (rows.json) into one export.

Refuses unless the exports are compatible: identical field sets, exactly one
school_code per input, no school_code repeated across inputs, and no duplicate
identity. Rows are concatenated unchanged (no value normalisation). Output goes
outside Git. Prints counts and the sha256 of the combined file only.
"""
import argparse, hashlib, json, sys
from pathlib import Path

KEY = ("school_code", "class_name", "subject_name", "term_label", "order_index")


def combine(parts):
    """parts: list of (label, rows). Returns combined rows or raises ValueError."""
    if not parts:
        raise ValueError("no inputs")
    fields, seen_schools, seen_ids, out = None, {}, set(), []
    for label, rows in parts:
        if not rows:
            raise ValueError(f"{label}: no rows")
        f = frozenset(rows[0])
        if any(frozenset(r) != f for r in rows):
            raise ValueError(f"{label}: rows have differing field sets")
        if fields is None:
            fields = f
        elif f != fields:
            raise ValueError(f"{label}: field set differs from first input: {sorted(f ^ fields)}")
        missing = [k for k in KEY if k not in f]
        if missing:
            raise ValueError(f"{label}: missing identity fields {missing}")
        schools = {r["school_code"] for r in rows}
        if len(schools) != 1:
            raise ValueError(f"{label}: expected one school_code, found {sorted(map(str, schools))}")
        (sc,) = schools
        if sc in seen_schools:
            raise ValueError(f"{label}: school_code {sc!r} already supplied by {seen_schools[sc]}")
        seen_schools[sc] = label
        for r in rows:
            ident = tuple(r[k] for k in KEY)
            if ident in seen_ids:
                raise ValueError(f"{label}: duplicate identity {ident}")
            seen_ids.add(ident)
            out.append(r)
    return out


def main():
    a = argparse.ArgumentParser(description=__doc__)
    a.add_argument("--input", type=Path, nargs="+", required=True)
    a.add_argument("--output", type=Path, required=True)
    args = a.parse_args()
    try:
        rows = combine([(str(p), json.loads(p.read_text(encoding="utf-8"))) for p in args.input])
    except ValueError as e:
        sys.exit(f"INCOMPATIBLE: {e}")
    args.output.write_text(json.dumps(rows, ensure_ascii=False, indent=1), encoding="utf-8")
    print(json.dumps({"rows": len(rows), "sha256": hashlib.sha256(args.output.read_bytes()).hexdigest()}))


if __name__ == "__main__":
    main()
