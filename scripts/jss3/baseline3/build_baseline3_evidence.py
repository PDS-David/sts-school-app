#!/usr/bin/env python3
"""BASELINE3: sanitised evidence for the Primary protected-curriculum reconstruction.

Companion to scripts/jss3/baseline2/{capture_importer_rows,build_sanitized_evidence}.py.
Reads PRIVATE inputs (grouped Primary archives, extracted source roots, capture folders,
the recovered R6 archive) and writes ONLY: hashes, counts, file names, identity columns
and verdicts. No lesson text, titles or row dumps are written.

It never asserts certification. It keeps three questions separate:
  a. historical/current source-output equality (observed here),
  b. preservation of an identified certified database/export (no such artefact exists),
  c. unknown historical certification scope (unresolved).
"""
import argparse, csv, hashlib, io, json, re, sys, zipfile
from pathlib import Path

PROTECTED_COUNT = 2179
CLASS_WORDS = {"ONE": 1, "TWO": 2, "THREE": 3, "FOUR": 4, "FIVE": 5, "SIX": 6}
R6_ITEM = "Exact preservation of the 2,179 protected rows"
ID_COLS = ("school_code", "class_name", "subject_name", "term_label", "order_index")


def sha_bytes(b: bytes) -> str:
    return hashlib.sha256(b).hexdigest()


def sha_file(p: Path) -> str:
    h = hashlib.sha256()
    with p.open("rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


def class_of_folder(name: str):
    m = re.search(r"BASIC[ _]+(ONE|TWO|THREE|FOUR|FIVE|SIX)\b", name, re.I)
    return CLASS_WORDS[m.group(1).upper()] if m else None


def grouped_archives(zips, inventory):
    """Per grouped zip: hash, and per-BASIC-folder file count vs the repo inventory's count."""
    expected = {}
    for e in inventory:
        c = class_of_folder(e["file"])
        if c:
            expected[c] = e
    out = []
    for zp in zips:
        with zipfile.ZipFile(zp) as z:
            counts = {}
            for i in z.infolist():
                if i.is_dir():
                    continue
                parts = i.filename.split("/")
                c = class_of_folder(parts[1]) if len(parts) > 1 else None
                counts[c] = counts.get(c, 0) + 1
        out.append({
            "file": Path(zp).name, "sha256": sha_file(Path(zp)),
            "classes": [{
                "class": c, "files_in_grouped_zip": n,
                "inventory_archive": expected[c]["file"] if c in expected else None,
                "inventory_file_count": expected[c]["file_count"] if c in expected else None,
                "count_matches_inventory": c in expected and expected[c]["file_count"] == n,
            } for c, n in sorted(counts.items(), key=lambda kv: (kv[0] is None, kv[0]))],
        })
    return out


def nested_zip_analysis(root: Path):
    """Each nested zip entry: is a byte-identical file present beside it (the importer never opens zips)."""
    rows = []
    for zp in sorted(root.rglob("*.zip")):
        d = zp.parent
        beside = {}
        for p in d.rglob("*"):
            if p.is_file() and p.suffix.lower() != ".zip":
                beside.setdefault(sha_file(p), []).append(p.relative_to(d).as_posix())
        with zipfile.ZipFile(zp) as z:
            for i in z.infolist():
                if i.is_dir():
                    continue
                h = sha_bytes(z.read(i))
                m = beside.get(h, [])
                rows.append({
                    "nested_zip": zp.relative_to(root).as_posix(), "entry": i.filename, "bytes": i.file_size,
                    "sha256": h, "identical_copy_beside": "yes" if m else "no",
                    "identical_copies": ";".join(sorted(m)),
                })
    return rows


def parse_duplicates(log: str):
    """'Exact byte duplicate' pairs (non-blocking) from an importer log."""
    out, on = [], False
    for line in log.splitlines():
        if line.startswith("Exact byte duplicate source files ignored"):
            on = True
            continue
        if on:
            m = re.match(r"^  (.+?) → canonical (.+)$", line)
            if not m:
                break
            out.append((m.group(1), m.group(2)))
    return out


def parse_content_duplicates(log: str):
    """'DUPLICATE normalized content' blocks (these BLOCK the audit): label + the files involved."""
    out, cur = [], None
    for line in log.splitlines():
        if line.startswith("DUPLICATE normalized content: "):
            cur = {"content": line.split(": ", 1)[1].strip(), "files": []}
            out.append(cur)
        elif cur is not None and line.startswith("  ") and line.strip():
            cur["files"].append(line.strip())
        else:
            cur = None
    return out


def row_delta(a_rows, b_rows):
    """Identity-level delta between two row sets. Identity columns and file names only; never text."""
    key = lambda r: tuple(json.dumps(r[c], ensure_ascii=False) for c in ID_COLS)
    ia, ib = {key(r): r for r in a_rows}, {key(r): r for r in b_rows}
    only_b = [ib[k] for k in sorted(set(ib) - set(ia))]
    only_a = [ia[k] for k in sorted(set(ia) - set(ib))]
    changed = [ib[k] for k in sorted(set(ia) & set(ib)) if ia[k] != ib[k]]
    return only_a, only_b, changed


def verify_r6(zip_path: Path, expect_zip: str, expect_report: str):
    res = {"zip_sha256": sha_file(zip_path), "zip_sha256_expected": expect_zip}
    res["zip_sha256_matches"] = res["zip_sha256"] == expect_zip
    with zipfile.ZipFile(zip_path) as z:
        names = {Path(n).name: n for n in z.namelist() if not n.endswith("/")}
        sums = z.read(names["SHA256SUMS"]).decode()
        checks = {}
        for line in sums.splitlines():
            if not line.strip():
                continue
            h, n = line.split(None, 1)
            n = Path(n.strip().lstrip("*")).name
            checks[n] = n in names and sha_bytes(z.read(names[n])) == h
        report = z.read(names["REPORT.md"])
        text = report.decode("utf-8")
    res["report_sha256"] = sha_bytes(report)
    res["report_sha256_matches_expected"] = res["report_sha256"] == expect_report
    res["internal_checksums"] = checks
    res["internal_checksums_all_pass"] = bool(checks) and all(checks.values())
    hits = [l.strip() for l in text.splitlines() if R6_ITEM in l]
    res["section5_item4_found"] = bool(hits)
    res["section5_item4_states_no_attachment_defines_or_lists_them"] = any(
        "no attachment defines or lists them" in l for l in hits)
    res["archive_entries"] = sorted(names)
    res["is_certification_or_export_source"] = False
    res["conclusion"] = ("R6 records the 2,179 rows only as an item NOT done by scope; it contains no row identities, "
                         "export, backup, approval record or importer commit. Do not request it again as baseline evidence.")
    return res


def combined_counts(primary_rows, secondary_rows):
    total = primary_rows + secondary_rows
    return {
        "primary_rows": primary_rows, "secondary_rows": secondary_rows, "total": total,
        "protected_count": PROTECTED_COUNT, "difference_from_protected": total - PROTECTED_COUNT,
        "equals_protected_count": total == PROTECTED_COUNT,
        "note": "Arithmetic only. No subset is selected and no rows are removed to reach the protected count.",
    }


def write_csv(path: Path, header, rows):
    buf = io.StringIO()
    w = csv.writer(buf, lineterminator="\n")
    w.writerow(header)
    w.writerows(rows)
    path.write_text(buf.getvalue(), encoding="utf-8")


def write_sums(ev: Path):
    names = sorted(p.name for p in ev.iterdir() if p.is_file() and p.name != "SHA256SUMS")
    (ev / "SHA256SUMS").write_text("".join(f"{sha_file(ev / n)}  {n}\n" for n in names), encoding="utf-8")
    return names


def main():
    a = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    a.add_argument("--grouped-zips", type=Path, nargs="+", required=True)
    a.add_argument("--inventory", type=Path, required=True, help="docs/jss3/replacements/INPUT_INVENTORY.json")
    a.add_argument("--source-a", type=Path, required=True, help="as-supplied extraction root (variant A)")
    a.add_argument("--private-out", type=Path, required=True, help="holds primaryA_{hist,cur}, primaryB_{hist,cur}")
    a.add_argument("--r6-zip", type=Path, required=True)
    a.add_argument("--r6-zip-sha256", required=True)
    a.add_argument("--r6-report-sha256", required=True)
    a.add_argument("--secondary-summary", type=Path, required=True, help="committed BASELINE2 capture_summary.json")
    a.add_argument("--evidence", type=Path, required=True)
    args = a.parse_args()
    ev = args.evidence
    ev.mkdir(parents=True, exist_ok=True)

    inv = json.loads(args.inventory.read_text())
    (ev / "grouped_archives.json").write_text(
        json.dumps(grouped_archives(args.grouped_zips, inv), indent=1, ensure_ascii=False), encoding="utf-8")

    nz = nested_zip_analysis(args.source_a)
    write_csv(ev / "nested_zip_vs_extracted.csv",
              ["nested_zip", "entry", "bytes", "sha256", "identical_copy_beside", "identical_copies"],
              [[r[k] for k in ("nested_zip", "entry", "bytes", "sha256", "identical_copy_beside", "identical_copies")] for r in nz])

    dup_rows = []
    for variant in ("primaryA", "primaryB"):
        log = (args.private_out / f"{variant}_cur" / "importer.log").read_text(encoding="utf-8", errors="replace")
        for d, c in parse_duplicates(log):
            f = args.source_a / d if variant == "primaryA" else None
            dup_rows.append([variant, d, c, sha_file(f) if f is not None and f.is_file() else ""])
    write_csv(ev / "exact_byte_duplicates_ignored.csv", ["variant", "duplicate", "canonical", "duplicate_sha256"], dup_rows)

    blk = parse_content_duplicates((args.private_out / "primaryB_cur" / "importer.log").read_text(encoding="utf-8", errors="replace"))
    (ev / "variantB_audit_blocking_content_duplicates.json").write_text(
        json.dumps(blk, indent=1, ensure_ascii=False), encoding="utf-8")

    load = lambda v, s: json.loads((args.private_out / f"{v}_{s}" / "rows.json").read_text(encoding="utf-8"))
    only_a, only_b, changed = row_delta(load("primaryA", "cur"), load("primaryB", "cur"))
    write_csv(ev / "variantA_vs_B_row_delta.csv", ["delta", *ID_COLS, "source_file"],
              [[d, *[r[c] for c in ID_COLS], r["source_file"]]
               for d, rs in (("only_in_A", only_a), ("only_in_B", only_b), ("same_identity_different_body_or_source", changed)) for r in rs])

    (ev / "r6_verification.json").write_text(json.dumps(
        verify_r6(args.r6_zip, args.r6_zip_sha256, args.r6_report_sha256), indent=1), encoding="utf-8")

    sec = json.loads(args.secondary_summary.read_text())["secondary"]["cur"]["meta"]["row_count"]
    cs = json.loads((ev / "capture_summary.json").read_text())
    comb = {v: combined_counts(cs[v]["cur"]["meta"]["row_count"], sec) for v in ("primaryA", "primaryB")}
    comb["row_level_combined_comparison_performed"] = False
    comb["why_not"] = ("The secondary raw rows are private BASELINE2 captures and the JSS 1/JSS 2 archives were not supplied "
                       "to this task, so only the committed counts/hashes of the secondary result are combined. Schemas are "
                       "identical (same 10 columns); source scopes differ (see REPORT.md).")
    comb["certification_claimed"] = False
    (ev / "combined_counts.json").write_text(json.dumps(comb, indent=1), encoding="utf-8")

    print("wrote", len(write_sums(ev)), "evidence files to", ev)


if __name__ == "__main__":
    sys.exit(main())
