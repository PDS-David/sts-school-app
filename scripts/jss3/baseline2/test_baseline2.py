"""Tests for the BASELINE2 capture/evidence scripts. Synthetic fixtures only; no source documents."""
import importlib.util, json, subprocess, sys, tempfile, unittest
from pathlib import Path

HERE = Path(__file__).resolve().parent


def load(name):
    spec = importlib.util.spec_from_file_location(name, HERE / f"{name}.py")
    m = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(m)
    return m


cap = load("capture_importer_rows")
ev = load("build_sanitized_evidence")


class HelperClosure(unittest.TestCase):
    def test_follows_local_imports_and_records_missing(self):
        with tempfile.TemporaryDirectory() as t:
            d = Path(t)
            (d / "a.ts").write_text("import { x } from './b.js';\nimport y from 'mammoth';\n")
            (d / "b.ts").write_text("import { z } from './c.js';\n")
            r = cap.helper_closure(d, "a.ts")
            self.assertEqual(sorted(r), ["a.ts", "b.ts", "c.ts"])
            self.assertIsNone(r["c.ts"])
            self.assertIsNotNone(r["a.ts"])


class CaptureGuards(unittest.TestCase):
    def run_cli(self, *a):
        return subprocess.run([sys.executable, "-I", str(HERE / "capture_importer_rows.py"), *a], capture_output=True, text=True)

    def test_refuses_output_inside_checkout(self):
        with tempfile.TemporaryDirectory() as t:
            co = Path(t)
            r = self.run_cli("--checkout", str(co), "--sources", t, "--school-code", "secondary", "--output", str(co / "out"), "--label", "x")
            self.assertNotEqual(r.returncode, 0)
            self.assertIn("outside the checkout", r.stderr)

    def test_refuses_non_empty_output(self):
        with tempfile.TemporaryDirectory() as t, tempfile.TemporaryDirectory() as o:
            (Path(o) / "f").write_text("x")
            r = self.run_cli("--checkout", t, "--sources", t, "--school-code", "secondary", "--output", o, "--label", "x")
            self.assertIn("non-empty", r.stderr)

    def test_refuses_when_anchor_missing_and_leaves_no_temp_file(self):
        with tempfile.TemporaryDirectory() as t, tempfile.TemporaryDirectory() as o:
            db = Path(t) / "backend/src/db"
            db.mkdir(parents=True)
            (db / "ingestTopics.ts").write_text("// no anchor here\n")
            out = Path(o) / "fresh"
            r = self.run_cli("--checkout", t, "--sources", t, "--school-code", "secondary", "--output", str(out), "--label", "x")
            self.assertIn("anchor not found", r.stderr)
            self.assertEqual([p.name for p in db.iterdir()], ["ingestTopics.ts"])


class Evidence(unittest.TestCase):
    LOG = (
        "2 file(s) failed to read:\n  A/b.docx: JSS2 resolution anchor missing: X\n  A/c.docx: bad zip\n\n"
        "Exact byte duplicate source files ignored (non-blocking): 3\n  d → canonical e\n\n"
        "Unsupported source format — convert/review before import: 1\n  A/m.rtf\n\nAUDIT BLOCKED — resolve\n"
    )

    def test_blocker_parser(self):
        b = ev.blockers(self.LOG)
        self.assertEqual([x["file"] for x in b["failed_to_read"]], ["A/b.docx", "A/c.docx"])
        self.assertEqual(b["unsupported_format"], ["A/m.rtf"])
        self.assertEqual(b["byte_duplicates_ignored"], 3)
        self.assertEqual(b["audit_result"], "BLOCKED")

    def test_passed_log(self):
        self.assertEqual(ev.blockers("FILE AUDIT PASSED — x\n")["audit_result"], "PASSED")

    def test_summary_rejects_tampered_rows(self):
        with tempfile.TemporaryDirectory() as t:
            d = Path(t)
            rows = [{"class_name": "JSS 1", "term_label": "1st Term", "source_path": "p"}]
            (d / "rows.json").write_text(json.dumps(rows))
            (d / "importer.log").write_text("FILE AUDIT PASSED\n")
            (d / "capture_meta.json").write_text(json.dumps({"rows_json_sha256": "0" * 64}))
            with self.assertRaises(SystemExit):
                ev.summarise(d)
            (d / "capture_meta.json").write_text(json.dumps({"rows_json_sha256": ev.sha(d / "rows.json")}))
            s = ev.summarise(d)
            self.assertEqual(s["rows_by_class_term"], {"JSS 1 | 1st Term": 1})


if __name__ == "__main__":
    unittest.main()
