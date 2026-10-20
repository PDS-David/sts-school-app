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
import argparse, csv, hashlib, json, sys
from pathlib import Path

EXPECTED_COUNT = 2179


def load_rows(path):
    text = Path(path).read_text(encoding="utf-8-sig")
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
    return list(csv.DictReader(text.splitlines()))


def norm(v):
    return "" if v is None else str(v).replace("\r\n", "\n")


def digest(row, fields):
    blob = json.dumps({f: norm(row.get(f)) for f in fields}, sort_keys=True, ensure_ascii=False)
    return hashlib.sha256(blob.encode("utf-8")).hexdigest()


def index(rows, key):
    idx, dups = {}, []
    for r in rows:
        missing = [k for k in key if k not in r]
        if missing:
            raise ValueError(f"row lacks identity column(s): {missing}")
        ident = tuple(norm(r[k]) for k in key)
        if ident in idx:
            dups.append(ident)
        else:
            idx[ident] = r
    return idx, dups


def compare(baseline, snapshot, key, content=None, expected=EXPECTED_COUNT):
    b, bd = index(baseline, key)
    s, sd = index(snapshot, key)
    fields = content or sorted({f for r in baseline for f in r} - set(key))
    changed = []
    for ident in sorted(set(b) & set(s)):
        if digest(b[ident], fields) != digest(s[ident], fields):
            diff = [f for f in fields if norm(b[ident].get(f)) != norm(s[ident].get(f))]
            changed.append({"identity": list(ident), "differing_fields": diff})
    res = {
        "baseline_rows": len(baseline), "snapshot_rows": len(snapshot),
        "expected_baseline_rows": expected, "identity_columns": list(key),
        "compared_fields": fields,
        "missing_from_snapshot": [list(i) for i in sorted(set(b) - set(s))],
        "unexpected_in_snapshot": [list(i) for i in sorted(set(s) - set(b))],
        "content_mismatches": changed,
        "duplicate_identities_baseline": [list(i) for i in bd],
        "duplicate_identities_snapshot": [list(i) for i in sd],
    }
    res["count_ok"] = len(baseline) == expected
    res["result"] = "PASS" if (res["count_ok"] and not any(
        res[k] for k in ("missing_from_snapshot", "unexpected_in_snapshot", "content_mismatches",
                         "duplicate_identities_baseline", "duplicate_identities_snapshot"))) else "FAIL"
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
    a.output.write_text(json.dumps(res, indent=2, ensure_ascii=False))
    print(res["result"], {k: res[k] for k in ("baseline_rows", "snapshot_rows")})
    return 0 if res["result"] == "PASS" else 1


if __name__ == "__main__":
    sys.exit(main())
