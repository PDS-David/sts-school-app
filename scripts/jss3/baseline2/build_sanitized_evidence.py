#!/usr/bin/env python3
"""BASELINE2: build sanitised, committable evidence from PRIVATE capture folders.

Reads the private outputs of capture_importer_rows.py (rows.json, capture_meta.json,
importer.log) and the P1 comparer results. Writes only: hashes, counts, source file
names with sha256, audit blocker file names, and comparer reports (which carry
identities/field NAMES only). No lesson text, titles or row dumps are written.
"""
import argparse, collections, hashlib, json, re, sys
from pathlib import Path


def sha(p: Path) -> str:
    return hashlib.sha256(p.read_bytes()).hexdigest()


def blockers(log: str):
    out, sect = {"failed_to_read": [], "unsupported_format": []}, None
    for line in log.splitlines():
        if re.match(r"^\d+ file\(s\) failed to read", line):
            sect = "failed_to_read"
        elif line.startswith("Unsupported source format"):
            sect = "unsupported_format"
        elif sect and line.startswith("  "):
            item = line.strip()
            if sect == "failed_to_read":
                item = item.split(": ", 1)  # file, reason
                item = {"file": item[0], "reason": item[1][:160] if len(item) > 1 else ""}
            out[sect].append(item)
        else:
            sect = None
    m = re.search(r"Exact byte duplicate source files ignored \(non-blocking\): (\d+)", log)
    out["byte_duplicates_ignored"] = int(m.group(1)) if m else 0
    out["audit_result"] = ("BLOCKED" if "AUDIT BLOCKED" in log else "PASSED" if "FILE AUDIT PASSED" in log else "UNKNOWN")
    return out


def summarise(d: Path):
    meta = json.loads((d / "capture_meta.json").read_text())
    rows = json.loads((d / "rows.json").read_text())
    if sha(d / "rows.json") != meta["rows_json_sha256"]:
        sys.exit(f"{d}: rows.json does not match its recorded hash")
    log = (d / "importer.log").read_text(encoding="utf-8", errors="replace")
    by = collections.Counter(f'{r["class_name"]} | {r["term_label"]}' for r in rows)
    return {
        "meta": meta, "rows_by_class_term": dict(sorted(by.items())),
        "distinct_source_files_with_rows": len({r["source_path"] for r in rows}),
        "audit": blockers(log),
    }


def main():
    a = argparse.ArgumentParser(description=__doc__)
    a.add_argument("--private-out", type=Path, required=True)
    a.add_argument("--sources", type=Path, nargs="+", required=True, help="private source roots (inventory only)")
    a.add_argument("--evidence", type=Path, required=True, help="committable evidence folder")
    a.add_argument("--configs", nargs="+", required=True, help="config names, e.g. secondary variantA")
    a.add_argument("--compare-dir", type=Path, required=True)
    args = a.parse_args()
    ev = args.evidence
    ev.mkdir(parents=True, exist_ok=True)

    summary = {}
    for c in args.configs:
        summary[c] = {side: summarise(args.private_out / f"{c}_{side}") for side in ("hist", "cur")}
        h, u = summary[c]["hist"]["meta"], summary[c]["cur"]["meta"]
        summary[c]["rows_json_identical"] = h["rows_json_sha256"] == u["rows_json_sha256"]
    (ev / "capture_summary.json").write_text(json.dumps(summary, indent=1, ensure_ascii=False), encoding="utf-8")

    for f in sorted(args.compare_dir.glob("*.json")):
        if f.name.startswith("negctl_snapshot"):
            continue  # a private modified copy of the rows; never published
        (ev / f"comparer_{f.name}").write_bytes(f.read_bytes())

    inv = ["root_label,relative_path,bytes,sha256"]
    for root in args.sources:
        for p in sorted(root.rglob("*")):
            if p.is_file():
                inv.append(f'"{root.name}","{p.relative_to(root).as_posix()}",{p.stat().st_size},{sha(p)}')
    (ev / "source_inventory.csv").write_text("\n".join(inv) + "\n", encoding="utf-8")

    names = sorted(p.name for p in ev.iterdir() if p.name != "SHA256SUMS")
    (ev / "SHA256SUMS").write_text("".join(f"{sha(ev / n)}  {n}\n" for n in names), encoding="utf-8")
    print("wrote", len(names), "evidence files to", ev)


if __name__ == "__main__":
    main()
