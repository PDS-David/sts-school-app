#!/usr/bin/env python3
"""BASELINE2: capture the rows a checkout's OWN curriculum importer generates.

Runs `backend/src/db/ingestTopics.ts` of the given checkout (so the importer and
every helper module are that checkout's own versions) against a source root in
dry-run mode, with no database and no --yes. A temporary instrumented copy of
the importer is written beside it, writes the post-ordering `normalRows` to a
file, and is always removed. The original importer is never edited.

Output (private, keep OUTSIDE Git): rows.json, importer.log, capture_meta.json.
"""
import argparse, hashlib, json, os, re, subprocess, sys
from pathlib import Path

NEEDLE = "  // Compare topic bodies only within the SAME class/subject/term."


def sha256(p: Path) -> str:
    return hashlib.sha256(p.read_bytes()).hexdigest()


def git(cwd: Path, *a: str) -> str:
    return subprocess.check_output(["git", *a], cwd=cwd, text=True).strip()


def helper_closure(dbdir: Path, entry: str):
    """Transitive local ./x imports of the importer, with sha256 each."""
    seen, todo = {}, [entry]
    while todo:
        name = todo.pop()
        if name in seen:
            continue
        f = dbdir / name
        if not f.exists():
            seen[name] = None
            continue
        seen[name] = sha256(f)
        for m in re.finditer(r"from\s+'\./([^']+?)(?:\.js)?'", f.read_text(encoding="utf-8")):
            todo.append(m.group(1) + ".ts")
    return dict(sorted(seen.items()))


def main():
    a = argparse.ArgumentParser(description=__doc__)
    a.add_argument("--checkout", type=Path, required=True, help="git checkout (workspace root) with node_modules installed")
    a.add_argument("--sources", type=Path, required=True, help="private source root passed to --root")
    a.add_argument("--school-code", choices=["primary", "secondary"], required=True)
    a.add_argument("--output", type=Path, required=True, help="fresh private output folder (outside Git)")
    a.add_argument("--label", required=True)
    args = a.parse_args()

    co, src, out = args.checkout.resolve(), args.sources.resolve(), args.output.resolve()
    if out.exists() and any(out.iterdir()):
        sys.exit(f"refusing non-empty output folder {out}")
    if out.is_relative_to(co):
        sys.exit("output folder must be outside the checkout (private exports never go in Git)")
    out.mkdir(parents=True, exist_ok=True)

    db = co / "backend/src/db"
    imp = db / "ingestTopics.ts"
    tmp = db / "ingestTopics.baseline2-capture.ts"
    if tmp.exists():
        sys.exit("temporary capture file already exists; refusing to overwrite")
    s = imp.read_text(encoding="utf-8")
    if s.count(NEEDLE) != 1:
        sys.exit("instrumentation anchor not found exactly once; importer layout changed")
    s = "import { writeFileSync as __b2Write } from 'fs';\n" + s
    s = s.replace(NEEDLE, "  __b2Write(process.env.BASELINE2_CAPTURE!, JSON.stringify(normalRows));\n" + NEEDLE)
    tmp.write_text(s, encoding="utf-8")

    drop = ("DATABASE_URL", "PGHOST", "PGUSER", "PGPASSWORD", "PGDATABASE", "PGPORT", "JSS3_LOCAL_TEST_DATABASE_URL")
    env = {k: v for k, v in os.environ.items() if k not in drop}
    env["BASELINE2_CAPTURE"] = str(out / "raw_rows.json")
    try:
        with (out / "importer.log").open("w") as log:
            r = subprocess.run(["node", "--import", "tsx", str(tmp), "--root", str(src), "--school-code", args.school_code],
                               cwd=co, env=env, stdout=log, stderr=subprocess.STDOUT)
    finally:
        tmp.unlink(missing_ok=True)

    raw = out / "raw_rows.json"
    if not raw.exists():
        sys.exit(f"importer produced no row capture (exit {r.returncode}); see {out/'importer.log'}")
    export = []
    for x in json.loads(raw.read_text(encoding="utf-8")):
        fp = Path(x["filePath"])
        rel = fp.resolve().relative_to(src).as_posix() if fp.is_absolute() else fp.as_posix()
        export.append({
            "school_code": args.school_code, "class_name": x["className"], "subject_name": x["subjectName"], "term_label": x["termLabel"],
            "order_index": x["orderIndex"], "title": x["title"], "week_label": x["weekLabel"],
            "source_file": fp.name, "source_path": rel, "source_reference": x["sourceReference"],
        })
    (out / "rows.json").write_text(json.dumps(export, ensure_ascii=False, indent=1), encoding="utf-8")
    raw.unlink()

    def ver(p):
        f = co / "node_modules" / p / "package.json"
        return json.loads(f.read_text())["version"] if f.exists() else None

    meta = {
        "label": args.label, "school_code": args.school_code,
        "checkout_commit": git(co, "rev-parse", "HEAD"),
        "checkout_dirty": bool(git(co, "status", "--porcelain", "--", "backend", "package.json", "package-lock.json")),
        "importer_sha256": sha256(imp), "package_lock_sha256": sha256(co / "package-lock.json"),
        "helper_modules_sha256": helper_closure(db, "ingestTopics.ts"),
        "dependency_versions": {p: ver(p) for p in ["mammoth", "word-extractor", "jszip", "tsx", "typescript"]},
        "node": subprocess.check_output(["node", "-v"], text=True).strip(),
        "importer_exit_code": r.returncode,
        "importer_exit_note": "non-zero means the dry-run audit reported blockers; rows are generated candidates captured BEFORE audit acceptance",
        "row_count": len(export), "rows_json_sha256": sha256(out / "rows.json"),
        "importer_log_sha256": sha256(out / "importer.log"),
        "source_root_files": sum(1 for p in src.rglob("*") if p.is_file()),
        "database_connection": "none (DB env vars removed from subprocess)",
    }
    (out / "capture_meta.json").write_text(json.dumps(meta, indent=1), encoding="utf-8")
    print(json.dumps({k: meta[k] for k in ("label", "checkout_commit", "row_count", "importer_exit_code", "rows_json_sha256")}))


if __name__ == "__main__":
    main()
