import importlib.util, unittest
from pathlib import Path

spec = importlib.util.spec_from_file_location("combine_exports", Path(__file__).resolve().parent / "combine_exports.py")
ce = importlib.util.module_from_spec(spec)
spec.loader.exec_module(ce)


def row(school, order=1, **extra):
    r = {"school_code": school, "class_name": "C", "subject_name": "S", "term_label": "1st Term", "order_index": order, "title": "t"}
    r.update(extra)
    return r


class Combine(unittest.TestCase):
    def test_ok_preserves_rows_unchanged(self):
        a, b = [row("primary", 1), row("primary", 2)], [row("secondary", 1)]
        out = ce.combine([("p", a), ("s", b)])
        self.assertEqual(out, a + b)

    def test_rejects_field_mismatch(self):
        with self.assertRaises(ValueError):
            ce.combine([("p", [row("primary")]), ("s", [row("secondary", extra="x")])])

    def test_rejects_mixed_or_repeated_school(self):
        with self.assertRaises(ValueError):
            ce.combine([("p", [row("primary"), row("secondary", 2)])])
        with self.assertRaises(ValueError):
            ce.combine([("p", [row("primary")]), ("q", [row("primary", 2)])])

    def test_rejects_duplicate_identity_and_missing_key(self):
        with self.assertRaises(ValueError):
            ce.combine([("p", [row("primary"), row("primary")])])
        bad = row("primary"); del bad["term_label"]
        with self.assertRaises(ValueError):
            ce.combine([("p", [bad])])

    def test_rejects_empty(self):
        with self.assertRaises(ValueError):
            ce.combine([])
        with self.assertRaises(ValueError):
            ce.combine([("p", [])])


if __name__ == "__main__":
    unittest.main()
