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

if __name__ == "__main__":
    unittest.main()
