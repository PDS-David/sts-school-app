#!/usr/bin/env python3
"""Compare two snapshot_release_state.sql outputs taken before/after the release.

PASS (exit 0) only if: no pre-existing topic row disappeared; every pre-existing row's content digest is unchanged
(ALL classes); topic_completions/submissions/students counts did not fall; every added row lies in an --allow-add-class
and has an order_index strictly greater than every pre-existing row in its bucket (append-only, original identities
untouched). Cache digest changes are reported (INFO) not failed: students legitimately generate summaries.
Exit 1 FAIL, 2 BLOCKED (unreadable/malformed input). Output JSON contains counts and bucket names only.
"""
import argparse, collections, json, sys

def load(p):
    try:
        d = json.load(open(p, encoding="utf-8"))
        if d.get("format") != "r7-release-state-v1" or not isinstance(d.get("topics"), list):
            raise ValueError("not an r7-release-state-v1 snapshot")
        for r in d["topics"]:
            for k in ("school_code", "class_name", "term_label", "content_sha256", "cache_sha256"):
                if k not in r:
                    raise ValueError(f"row missing {k}")
        return d
    except Exception as e:
        print(f"BLOCKED: {p}: {e}", file=sys.stderr); sys.exit(2)

key = lambda r: (r["school_code"], r["class_name"], r.get("subject_name"), r["term_label"], r.get("order_index"))
bucket = lambda r: key(r)[:4]

def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--before", required=True); ap.add_argument("--after", required=True)
    ap.add_argument("--allow-add-class", action="append", default=[], help='class_name where additions are expected, e.g. "JSS 3"')
    ap.add_argument("--output")
    a = ap.parse_args()
    b, f = load(a.before), load(a.after)
    def group(rows):
        g = collections.defaultdict(list)
        for r in rows: g[key(r)].append(r)
        return g
    gb, ga = group(b["topics"]), group(f["topics"])
    fails = []
    for k, rows in gb.items():
        after = ga.get(k, [])
        if len(after) < len(rows):
            fails.append(f"removed/missing {len(rows)-len(after)} row(s) at {k[:4]} #{k[4]}")
        missing = collections.Counter(r["content_sha256"] for r in rows) - collections.Counter(r["content_sha256"] for r in after)
        if missing:
            fails.append(f"content changed at {k[:4]} #{k[4]}")
        if sum(r["completions"] for r in after) < sum(r["completions"] for r in rows):
            fails.append(f"completions fell at {k[:4]} #{k[4]}")
    max_before = collections.defaultdict(lambda: -1)
    for r in b["topics"]:
        if r.get("order_index") is not None:
            max_before[bucket(r)] = max(max_before[bucket(r)], r["order_index"])
    added = collections.Counter()
    for k, rows in ga.items():
        extra = len(rows) - len(gb.get(k, []))
        if extra <= 0:
            continue
        bk = k[:4]; added[bk] += extra
        if k[1] not in a.allow_add_class:
            fails.append(f"unexpected addition in class {k[1]}: {bk} #{k[4]}")
        if k in gb:
            fails.append(f"duplicate identity created at {bk} #{k[4]}")
        elif k[4] is None or k[4] <= max_before.get(bk, -1):
            fails.append(f"added row not appended after existing rows: {bk} #{k[4]}")
    for t in ("topic_completions", "submissions", "students"):
        if f["table_counts"].get(t, 0) < b["table_counts"].get(t, 0): fails.append(f"table count fell: {t}")
    cache_changed = collections.Counter()
    for k, rows in gb.items():
        if k in ga and sorted(r["cache_sha256"] for r in rows) != sorted(r["cache_sha256"] for r in ga[k][:len(rows)]): cache_changed[k[1]] += 1
    res = {"verdict": "FAIL" if fails else "PASS", "failures": fails[:50], "failure_count": len(fails),
           "rows_before": len(b["topics"]), "rows_after": len(f["topics"]),
           "added_by_bucket": {" | ".join(map(str, k)): n for k, n in sorted(added.items(), key=str)},
           "info_cache_digest_changed_rows_by_class": dict(cache_changed),
           "table_counts_before": b["table_counts"], "table_counts_after": f["table_counts"]}
    out = json.dumps(res, indent=2, ensure_ascii=False); print(out)
    if a.output: open(a.output, "w", encoding="utf-8").write(out + "\n")
    sys.exit(1 if fails else 0)

if __name__ == "__main__": main()
