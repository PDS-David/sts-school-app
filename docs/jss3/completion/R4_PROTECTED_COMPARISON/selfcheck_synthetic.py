#!/usr/bin/env python3
"""R4 tooling self-check on SYNTHETIC rows only (never protected data, never a database).

Proves, through the real compare_baseline.py CLI, that with the protected-gate flags
(--key school_code,class_name,subject_name,term_label,order_index --exclude id,subject_id)
a changed, removed, extra or duplicated row is detected and that excluding the surrogate
columns does not hide content drift. It says nothing about the real 2,179 rows.
Usage: python3 selfcheck_synthetic.py --output results_selfcheck.json   (stdlib only)
"""
import argparse, copy, hashlib, json, subprocess, sys, tempfile
from pathlib import Path

CMP = Path(__file__).resolve().parents[1] / "P1_BASELINE" / "compare_baseline.py"
KEY = "school_code,class_name,subject_name,term_label,order_index"
N = 50


def base_rows():
    return [{"id": i, "school_code": "primary", "subject_id": i % 5, "subject_name": f"SYNTH-SUBJ-{i % 5}",
             "class_name": "Primary 1", "term_label": "First Term", "title": f"SYNTHETIC TITLE {i}",
             "description": None, "source_reference": f"SYNTH-REF-{i}", "source_file": f"synthetic_{i}.docx",
             "order_index": i} for i in range(1, N + 1)]


def variants():
    b = base_rows()
    v = {"identical": copy.deepcopy(b)}
    r = copy.deepcopy(b)
    for x in r:
        x["id"] += 1000; x["subject_id"] += 77
    v["surrogate_ids_only_differ"] = r
    for name, field, val in [("title_changed", "title", "CHANGED"), ("source_reference_changed", "source_reference", "CHANGED"),
                             ("source_file_changed", "source_file", "other.docx"), ("description_changed", "description", "CHANGED")]:
        r = copy.deepcopy(b); r[9][field] = val; v[name] = r
    r = copy.deepcopy(b); r[9]["order_index"] = 9999; v["identity_field_changed"] = r
    r = copy.deepcopy(b); del r[29]; v["row_removed"] = r
    r = copy.deepcopy(b); r.append({**b[0], "id": 999, "order_index": 999}); v["row_added"] = r
    r = copy.deepcopy(b); d = copy.deepcopy(b[5]); d["id"] = 998; r.append(d); v["duplicate_identity_added"] = r
    return b, v


def run(base, snap, tmp, name, extra):
    bp, sp, op = tmp / "base.json", tmp / f"{name}.json", tmp / f"out_{name}.json"
    bp.write_text(json.dumps(base)); sp.write_text(json.dumps(snap))
    p = subprocess.run([sys.executable, str(CMP), "--baseline", str(bp), "--snapshot", str(sp), "--key", KEY,
                        "--expected-count", str(N), "--output", str(op)] + extra, capture_output=True, text=True)
    rep = json.loads(op.read_text()) if op.exists() else {}
    return p.returncode, rep


def main():
    ap = argparse.ArgumentParser(); ap.add_argument("--output", required=True); a = ap.parse_args()
    base, vs = base_rows(), variants()[1]
    expect = {"identical": 0, "surrogate_ids_only_differ": 0}
    results, ok = [], True
    with tempfile.TemporaryDirectory() as t:
        tmp = Path(t)
        for name, snap in vs.items():
            code, rep = run(base, snap, tmp, name, ["--exclude", "id,subject_id"])
            want = expect.get(name, 1)
            good = code == want
            ok &= good
            results.append({"case": name, "flags": "--exclude id,subject_id", "exit": code, "expected_exit": want, "ok": good,
                            "missing": len(rep.get("missing_from_snapshot", [])), "unexpected": len(rep.get("unexpected_in_snapshot", [])),
                            "content_mismatch_rows": len(rep.get("content_mismatches", [])),
                            "duplicates": len(rep.get("duplicate_identities_baseline", [])) + len(rep.get("duplicate_identities_snapshot", []))})
        code, _ = run(base, vs["surrogate_ids_only_differ"], tmp, "noexcl", [])
        results.append({"case": "surrogate_ids_only_differ", "flags": "(no --exclude)", "exit": code, "expected_exit": 1, "ok": code == 1}); ok &= code == 1
    out = {"task": "R4", "kind": "synthetic tooling self-check", "synthetic_rows": N, "applies_to_real_protected_rows": False,
           "certification_claimed": False, "comparer_sha256": hashlib.sha256(CMP.read_bytes()).hexdigest(), "all_expected": ok, "cases": results}
    Path(a.output).write_text(json.dumps(out, indent=2) + "\n")
    print(json.dumps({"all_expected": ok, "cases": len(results)}))
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
