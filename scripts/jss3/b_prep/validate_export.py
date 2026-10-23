#!/usr/bin/env python3
"""B_PREP: validate the SHAPE and PROVENANCE COMPLETENESS of a protected-curriculum export.

NEW OUTPUT NAMES: this script and its report are new; nothing here certifies content.
Checks an export produced by scripts/jss3/export_protected_curriculum.sql (psql JSON array,
or a CSV with the same columns) before it is passed to P1_BASELINE/compare_baseline.py.
Writes counts, field names and identity-free summaries only; never lesson text or row values.

Exit: 0 structure OK and provenance complete; 1 structural problem or provenance incomplete;
2 BLOCKED (file missing/unreadable). certification_claimed is always false.
"""
import argparse, hashlib, json, re, sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[3] / "docs/jss3/completion/P1_BASELINE"))
import compare_baseline as cb  # noqa: E402

KEY = ["school_code", "class_name", "subject_name", "term_label", "order_index"]
REQUIRED = KEY + ["title", "source_reference", "source_file"]
SQL_EXPORT_FIELDS = {"id", "school_code", "subject_id", "subject_name", "class_name", "term_label",
                     "title", "description", "source_reference", "source_file", "order_index"}
CURRENT_CLASS = re.compile(r"^(Primary [1-6]|JSS 1|JSS 2)$")
PROVENANCE_KEYS = ["origin", "export_taken_utc", "data_as_of_utc", "scope", "approval_record",
                   "export_method", "sha256"]
PLACEHOLDER = re.compile(r"^\s*(|todo|tbd|unknown|n/?a|<.*>)\s*$", re.I)


def check_rows(rows):
    problems, info = [], {}
    fields = sorted({f for r in rows for f in r})
    info["row_count"] = len(rows)
    info["fields"] = fields
    info["fields_match_sql_export"] = set(fields) == SQL_EXPORT_FIELDS
    miss = [f for f in REQUIRED if any(f not in r for r in rows)]
    if miss:
        problems.append(f"required field(s) missing from some/all rows: {miss}")
    blank = 0
    seen, dup = set(), 0
    for r in rows:
        vals = [r.get(k) for k in KEY]
        if any(v is None or (isinstance(v, str) and not v.strip()) for v in vals):
            blank += 1
            continue
        ident = tuple(cb.canonical(v) for v in vals)
        dup += ident in seen
        seen.add(ident)
    info["rows_with_blank_identity"] = blank
    info["duplicate_identity_rows"] = dup
    if blank:
        problems.append(f"{blank} row(s) have a null/blank identity value (null subject_name = row without a matching subjects row)")
    if dup:
        problems.append(f"{dup} duplicate identity row(s)")
    cls = {}
    for r in rows:
        c = r.get("class_name")
        cls[str(c)] = cls.get(str(c), 0) + 1
    info["rows_by_class_name"] = dict(sorted(cls.items()))
    legacy = {c: n for c, n in cls.items() if not CURRENT_CLASS.match(c)}
    info["non_current_class_names"] = legacy
    if legacy:
        problems.append("class names not in current form (legacy or out of scope); do NOT rewrite the export - see ACQUISITION.md section 'Legacy class names'")
    info["rows_by_school_code"] = {k: sum(1 for r in rows if r.get("school_code") == k) for k in sorted({str(r.get("school_code")) for r in rows})}
    info["protected_count_matches_2179"] = len(rows) == cb.EXPECTED_COUNT
    return info, problems


def check_provenance(prov, file_sha, kind):
    problems = []
    for k in PROVENANCE_KEYS:
        v = prov.get(k)
        if v is None or (isinstance(v, str) and PLACEHOLDER.match(v)) or (isinstance(v, dict) and not v):
            problems.append(f"provenance.{k} missing or placeholder")
    if prov.get("sha256") and prov["sha256"] != file_sha:
        problems.append("provenance.sha256 does not match the export file")
    if kind == "certified-baseline":
        t, a = prov.get("export_taken_utc"), prov.get("data_as_of_utc")
        if isinstance(t, str) and isinstance(a, str) and t[:10] == a[:10]:
            problems.append("data_as_of_utc equals export_taken_utc: a current export is not historical; "
                            "data_as_of_utc must be the date the approval record certifies")
    return problems


def main(argv=None):
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("--export", required=True)
    p.add_argument("--kind", required=True, choices=["certified-baseline", "release-snapshot"])
    p.add_argument("--provenance", help="provenance JSON (see INPUT_CHECKLIST.json / ACQUISITION.md)")
    p.add_argument("--output", type=Path, required=True)
    a = p.parse_args(argv)
    a.output.parent.mkdir(parents=True, exist_ok=True)
    try:
        path = Path(a.export)
        if not path.is_file():
            raise ValueError("export file not found")
        if not str(path).lower().endswith((".json", ".csv")):
            raise ValueError("export filename must end .json or .csv (comparer chooses the parser by suffix)")
        rows = cb.load_rows(path)
        file_sha = hashlib.sha256(path.read_bytes()).hexdigest()
        prov = None
        if a.provenance:
            prov = json.loads(Path(a.provenance).read_text(encoding="utf-8"))
            if not isinstance(prov, dict):
                raise ValueError("provenance must be a JSON object")
    except (ValueError, OSError, json.JSONDecodeError) as e:
        res = {"result": "BLOCKED", "reason": str(e), "certification_claimed": False}
        a.output.write_text(json.dumps(res, indent=2)); print("BLOCKED", e)
        return 2
    info, problems = check_rows(rows)
    prov_problems = ["no --provenance supplied"] if prov is None else check_provenance(prov, file_sha, a.kind)
    res = {"kind": a.kind, "export_sha256": file_sha, **info, "structural_problems": problems,
           "provenance_problems": prov_problems,
           "result": "OK" if not problems and not prov_problems else "NOT_READY",
           "note": "Shape/provenance completeness only. Not certification; not the protected gate.",
           "certification_claimed": False}
    a.output.write_text(json.dumps(res, indent=2))
    print(res["result"], {"rows": len(rows), "sha256": file_sha})
    return 0 if res["result"] == "OK" else 1


if __name__ == "__main__":
    sys.exit(main())
