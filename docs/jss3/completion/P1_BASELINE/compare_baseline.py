#!/usr/bin/env python3
"""P1 protected-baseline identity/content comparison.

Compares the owner's certified export of the 2,179 Primary/JSS1/JSS2 rows
(--baseline) against the proposed release snapshot (--snapshot).

Exit codes: 0 = PASS, 1 = FAIL (mismatches or count error), 2 = BLOCKED
(an input is missing/unreadable). A BLOCKED run never reports PASS.

The report lists identities and the NAMES of differing fields only. Field
values are never written, so no student data or lesson text reaches the report.
Only the Python standard library is used. No database connection is made.
"""
import argparse, csv, hashlib, json, sys, io
from pathlib import Path

EXPECTED_COUNT = 2179


def load_rows(path):
    with Path(path).open(encoding="utf-8-sig", newline="") as stream:
        text = stream.read()
    if str(path).lower().endswith(".json"):
        data = json.loads(text)
        if isinstance(data, dict):
            for k in ("rows", "data", "items"):
                if isinstance(data.get(k), list):
                    data = data[k]
                    break
        if not isinstance(data, list) or not all(isinstance(r, dict) for r in data):
            raise ValueError("JSON must be a list of row objects")
        return data
    reader = csv.DictReader(io.StringIO(text, newline=""))
    if not reader.fieldnames or len(set(reader.fieldnames)) != len(reader.fieldnames):
        raise ValueError("CSV requires nonduplicate headers")
    rows = list(reader)
    if any(None in r or any(v is None for v in r.values()) for r in rows):
        raise ValueError("CSV row width does not match header")
    return rows


def canonical(v):
    # Exact values: null, empty string and missing fields must not collapse.
    return json.dumps(v, sort_keys=True, ensure_ascii=False, separators=(",", ":"))


def index(rows, key):
    idx, dups = {}, []
    for r in rows:
        missing = [k for k in key if k not in r]
        if missing:
            raise ValueError(f"row lacks identity column(s): {missing}")
        if any(r[k] is None or (isinstance(r[k], str) and not r[k].strip()) for k in key):
            raise ValueError("blank/null identity value")
        ident = tuple(canonical(r[k]) for k in key)
        if ident in idx:
            dups.append(ident)
        else:
            idx[ident] = r
    return idx, dups


def compare(baseline, snapshot, key, content=None, expected=EXPECTED_COUNT):
    if not key or len(set(key)) != len(key) or any(not k.strip() for k in key):
        raise ValueError("nonempty, unique identity columns required")
    if expected < 1:
        raise ValueError("expected row count must be positive")
    b, bd = index(baseline, key)
    s, sd = index(snapshot, key)
    fields = content if content is not None else sorted({f for r in baseline + snapshot for f in r} - set(key))
    if not fields or len(set(fields)) != len(fields) or any(not f.strip() or f in key for f in fields):
        raise ValueError("nonempty, unique content columns separate from identity required")
    for dataset in (baseline, snapshot):
        for row in dataset:
            if any(f not in row for f in fields):
                raise ValueError("row lacks a compared content column")
    changed = []
    for ident in sorted(set(b) & set(s)):
        diff = [f for f in fields if canonical(b[ident][f]) != canonical(s[ident][f])]
        if diff:
            changed.append({"identity": [json.loads(x) for x in ident], "differing_fields": diff})
    res = {
        "baseline_rows": len(baseline), "snapshot_rows": len(snapshot),
        "expected_baseline_rows": expected, "identity_columns": list(key),
        "compared_fields": fields,
        "missing_from_snapshot": [[json.loads(x) for x in i] for i in sorted(set(b) - set(s))],
        "unexpected_in_snapshot": [[json.loads(x) for x in i] for i in sorted(set(s) - set(b))],
        "content_mismatches": changed,
        "duplicate_identities_baseline": [[json.loads(x) for x in i] for i in bd],
        "duplicate_identities_snapshot": [[json.loads(x) for x in i] for i in sd],
    }
    res["count_ok"] = len(baseline) == expected
    res["result"] = "PASS" if (res["count_ok"] and not any(
        res[k] for k in ("missing_from_snapshot", "unexpected_in_snapshot", "content_mismatches",
                         "duplicate_identities_baseline", "duplicate_identities_snapshot"))) else "FAIL"
    res["comparison_scope"] = "selected columns only" if content is not None else "all non-identity columns"
    res["protected_count_used"] = expected == EXPECTED_COUNT
    res["certification_claimed"] = False
    return res


def main(argv=None):
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("--baseline", required=True, help="certified export (.json list of rows, or .csv)")
    p.add_argument("--snapshot", required=True, help="proposed release snapshot (.json or .csv)")
    p.add_argument("--key", required=True, help="comma-separated stable identity columns")
    p.add_argument("--content", help="comma-separated content columns (default: every non-key baseline column)")
    p.add_argument("--expected-count", type=int, default=EXPECTED_COUNT)
    p.add_argument("--output", type=Path, required=True)
    a = p.parse_args(argv)
    a.output.parent.mkdir(parents=True, exist_ok=True)
    for name in ("baseline", "snapshot"):
        if not Path(getattr(a, name)).is_file():
            res = {"result": "BLOCKED", "reason": f"--{name} file not found; gate stays blocked, nothing verified"}
            a.output.write_text(json.dumps(res, indent=2))
            print(res["result"], res["reason"])
            return 2
    key = [k.strip() for k in a.key.split(",") if k.strip()]
    content = [c.strip() for c in a.content.split(",")] if a.content else None
    try:
        res = compare(load_rows(a.baseline), load_rows(a.snapshot), key, content, a.expected_count)
    except (ValueError, OSError, json.JSONDecodeError) as e:
        res = {"result": "BLOCKED", "reason": f"input unreadable or malformed: {e}"}
        a.output.write_text(json.dumps(res, indent=2))
        print(res["result"], res["reason"])
        return 2
    res["baseline_file_sha256"] = hashlib.sha256(Path(a.baseline).read_bytes()).hexdigest()
    res["snapshot_file_sha256"] = hashlib.sha256(Path(a.snapshot).read_bytes()).hexdigest()
    a.output.write_text(json.dumps(res, indent=2, ensure_ascii=False))
    print(res["result"], {k: res[k] for k in ("baseline_rows", "snapshot_rows")})
    return 0 if res["result"] == "PASS" else 1


if __name__ == "__main__":
    sys.exit(main())
