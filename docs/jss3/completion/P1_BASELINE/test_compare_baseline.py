"""Synthetic-fixture tests for compare_baseline.py (no real data involved)."""
import json, tempfile, unittest
from pathlib import Path
import compare_baseline as cb

def rows(n):
    return [{"id": f"T{i}", "title": f"t{i}", "body": f"body {i}"} for i in range(n)]

class T(unittest.TestCase):
    def test_pass(self):
        r = cb.compare(rows(5), rows(5), ["id"], expected=5)
        self.assertEqual(r["result"], "PASS")
    def test_content_mismatch_names_fields_only(self):
        s = rows(5); s[2]["body"] = "SECRET CHANGED"
        r = cb.compare(rows(5), s, ["id"], expected=5)
        self.assertEqual(r["result"], "FAIL")
        self.assertEqual(r["content_mismatches"], [{"identity": ["T2"], "differing_fields": ["body"]}])
        self.assertNotIn("SECRET CHANGED", json.dumps(r))
    def test_missing_extra_duplicate(self):
        s = rows(5)[:4] + [{"id": "X", "title": "", "body": ""}, rows(5)[0]]
        r = cb.compare(rows(5), s, ["id"], expected=5)
        self.assertEqual(r["missing_from_snapshot"], [["T4"]])
        self.assertEqual(r["unexpected_in_snapshot"], [["X"]])
        self.assertEqual(r["duplicate_identities_snapshot"], [["T0"]])
        self.assertEqual(r["result"], "FAIL")
    def test_count_gate(self):
        self.assertEqual(cb.compare(rows(5), rows(5), ["id"], expected=2179)["result"], "FAIL")
    def test_missing_input_is_blocked_not_pass(self):
        with tempfile.TemporaryDirectory() as d:
            out = Path(d) / "r.json"
            code = cb.main(["--baseline", f"{d}/nope.json", "--snapshot", f"{d}/nope2.json", "--key", "id", "--output", str(out)])
            self.assertEqual(code, 2)
            self.assertEqual(json.loads(out.read_text())["result"], "BLOCKED")
    def test_end_to_end_files(self):
        with tempfile.TemporaryDirectory() as d:
            b, s, out = Path(d) / "b.json", Path(d) / "s.json", Path(d) / "r.json"
            b.write_text(json.dumps(rows(3))); s.write_text(json.dumps(rows(3)))
            self.assertEqual(cb.main(["--baseline", str(b), "--snapshot", str(s), "--key", "id", "--expected-count", "3", "--output", str(out)]), 0)

class FailClosed(unittest.TestCase):
    def test_null_empty_and_types_are_different(self):
        for a,b in [(None,""),(1,"1"),("a\r\nb","a\nb")]:
            left=[{"id":"x","body":a}];right=[{"id":"x","body":b}]
            self.assertEqual(cb.compare(left,right,["id"],expected=1)["result"],"FAIL")
    def test_missing_column_not_equal_to_empty(self):
        with self.assertRaises(ValueError): cb.compare([{"id":"x","body":""}],[{"id":"x"}],["id"],expected=1)
    def test_empty_key_or_content_rejected(self):
        for keys,fields in [([],None),(["id"],[]),(["id"],["typo"]),(["id"],["id"])]:
            with self.assertRaises(ValueError): cb.compare(rows(1),rows(1),keys,fields,1)
    def test_blank_identity_rejected(self):
        for value in [None,"","   "]:
            with self.assertRaises(ValueError): cb.compare([{"id":value,"body":"x"}],[],["id"],expected=1)
    def test_multiline_csv_preserves_newline(self):
        with tempfile.TemporaryDirectory() as d:
            p=Path(d)/"x.csv";p.write_text('id,body\n1,"line1\nline2"\n')
            self.assertEqual(cb.load_rows(p)[0]["body"],"line1\nline2")
    def test_malformed_csv_rejected(self):
        with tempfile.TemporaryDirectory() as d:
            p=Path(d)/"x.csv"
            for text in ["id,body,body\n1,a,b\n", "id,body\n1\n", "id,body\n1,a,b\n"]:
                p.write_text(text)
                with self.assertRaises(ValueError): cb.load_rows(p)
    def test_diagnostic_subset_is_explicit(self):
        r=cb.compare(rows(2),rows(2),["id"],["title"],2)
        self.assertEqual(r["comparison_scope"],"selected columns only")
        self.assertFalse(r["protected_count_used"])
        self.assertFalse(r["certification_claimed"])

class Exclude(unittest.TestCase):
    """B_PREP: surrogate ids differ between two databases; --exclude drops them from the default set."""
    def mk(self, n, off):
        return [{"k": f"K{i}", "id": i + off, "title": f"t{i}"} for i in range(n)]
    def test_surrogate_id_difference_fails_without_exclude(self):
        self.assertEqual(cb.compare(self.mk(3, 0), self.mk(3, 100), ["k"], None, 3)["result"], "FAIL")
    def test_exclude_passes_and_is_labelled(self):
        r = cb.compare(self.mk(3, 0), self.mk(3, 100), ["k"], None, 3, ["id"])
        self.assertEqual(r["result"], "PASS")
        self.assertEqual(r["excluded_columns"], ["id"])
        self.assertEqual(r["comparison_scope"], "all non-identity columns except excluded")
    def test_exclude_does_not_hide_real_differences(self):
        s = self.mk(3, 100); s[1]["title"] = "changed"
        r = cb.compare(self.mk(3, 0), s, ["k"], None, 3, ["id"])
        self.assertEqual(r["content_mismatches"], [{"identity": ["K1"], "differing_fields": ["title"]}])
    def test_exclude_rejects_unknown_key_and_content_combo(self):
        for args in (dict(exclude=["nope"]), dict(exclude=["k"]), dict(content=["title"], exclude=["id"])):
            with self.assertRaises(ValueError):
                cb.compare(self.mk(3, 0), self.mk(3, 0), ["k"], args.get("content"), 3, args.get("exclude", []))
    def test_cli_exclude(self):
        with tempfile.TemporaryDirectory() as d:
            b, s, out = Path(d) / "b.json", Path(d) / "s.json", Path(d) / "r.json"
            b.write_text(json.dumps(self.mk(3, 0))); s.write_text(json.dumps(self.mk(3, 9)))
            self.assertEqual(cb.main(["--baseline", str(b), "--snapshot", str(s), "--key", "k", "--exclude", "id", "--expected-count", "3", "--output", str(out)]), 0)
            self.assertEqual(cb.main(["--baseline", str(b), "--snapshot", str(s), "--key", "k", "--exclude", "zz", "--expected-count", "3", "--output", str(out)]), 2)


if __name__ == "__main__":
    unittest.main()
