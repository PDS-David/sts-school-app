import hashlib, importlib.util, json, tempfile, unittest, zipfile
from pathlib import Path

spec = importlib.util.spec_from_file_location("b3", Path(__file__).with_name("build_baseline3_evidence.py"))
b3 = importlib.util.module_from_spec(spec)
spec.loader.exec_module(b3)


def row(cls="Primary 1", subj="Maths", term="1st Term", idx=1, src="a.docx", title="T"):
    return {"school_code": "primary", "class_name": cls, "subject_name": subj, "term_label": term,
            "order_index": idx, "title": title, "source_file": src}


def make_r6(d: Path, report=b"x\n4. **Exact preservation of the 2,179 protected rows.** The only supplied mention is "
                          b"R5V's \"not done, by scope\"; no attachment defines or lists them.\n", tamper=False):
    z = d / "r6.zip"
    other = b"decisions"
    sums = f"{hashlib.sha256(report).hexdigest()}  REPORT.md\n{hashlib.sha256(other).hexdigest()}  OWNER_DECISIONS.md\n"
    with zipfile.ZipFile(z, "w") as f:
        f.writestr("R6/REPORT.md", report + (b"!" if tamper else b""))
        f.writestr("R6/OWNER_DECISIONS.md", other)
        f.writestr("R6/SHA256SUMS", sums)
    return z, hashlib.sha256(report).hexdigest()


class B3Tests(unittest.TestCase):
    def test_class_of_folder_handles_space_and_underscore(self):
        self.assertEqual(b3.class_of_folder("BASIC FIVE-2026-3-001(1).zip"), 5)
        self.assertEqual(b3.class_of_folder("BASIC_SIX-2026"), 6)
        self.assertIsNone(b3.class_of_folder("JSS 1-2026"))

    def test_parse_duplicates_stops_at_blank_and_keeps_pairs(self):
        log = "x\nExact byte duplicate source files ignored (non-blocking): 2\n  a/b_1.doc → canonical a/b.doc\n  c/d_1.doc → canonical c/d.doc\n\nother\n"
        self.assertEqual(b3.parse_duplicates(log), [("a/b_1.doc", "a/b.doc"), ("c/d_1.doc", "c/d.doc")])
        self.assertEqual(b3.parse_duplicates("nothing"), [])

    def test_parse_content_duplicates(self):
        log = "DUPLICATE normalized content: P4 / Maths / 1st Term / Frac\n  f1.doc\n  f2.docx\n\nAUDIT BLOCKED\n"
        r = b3.parse_content_duplicates(log)
        self.assertEqual(r, [{"content": "P4 / Maths / 1st Term / Frac", "files": ["f1.doc", "f2.docx"]}])

    def test_row_delta_reports_identities_only(self):
        a = [row(idx=1), row(idx=2)]
        b = [row(idx=1), row(idx=2, title="changed"), row(idx=3)]
        only_a, only_b, changed = b3.row_delta(a, b)
        self.assertEqual((len(only_a), len(only_b), len(changed)), (0, 1, 1))
        self.assertEqual(only_b[0]["order_index"], 3)

    def test_combined_counts_never_forces_protected_total(self):
        c = b3.combined_counts(1450, 741)
        self.assertEqual((c["total"], c["difference_from_protected"], c["equals_protected_count"]), (2191, 12, False))
        self.assertTrue(b3.combined_counts(1438, 741)["equals_protected_count"])  # arithmetic only, no subset chosen

    def test_verify_r6_passes_and_is_never_a_certification_source(self):
        with tempfile.TemporaryDirectory() as t:
            z, rh = make_r6(Path(t))
            r = b3.verify_r6(z, b3.sha_file(z), rh)
            self.assertTrue(r["zip_sha256_matches"] and r["report_sha256_matches_expected"] and r["internal_checksums_all_pass"])
            self.assertTrue(r["section5_item4_states_no_attachment_defines_or_lists_them"])
            self.assertFalse(r["is_certification_or_export_source"])

    def test_verify_r6_detects_wrong_hash_and_tamper(self):
        with tempfile.TemporaryDirectory() as t:
            z, rh = make_r6(Path(t), tamper=True)
            r = b3.verify_r6(z, "0" * 64, rh)
            self.assertFalse(r["zip_sha256_matches"])
            self.assertFalse(r["internal_checksums_all_pass"])
            self.assertFalse(r["report_sha256_matches_expected"])

    def test_nested_zip_analysis_flags_entries_without_identical_copy(self):
        with tempfile.TemporaryDirectory() as t:
            root = Path(t)
            (root / "T1").mkdir()
            (root / "T1" / "same.doc").write_bytes(b"same")
            (root / "T1" / "diff.doc").write_bytes(b"on-disk")
            with zipfile.ZipFile(root / "T1-001.zip", "w") as z:
                z.writestr("T1/same.doc", b"same")
                z.writestr("T1/diff.doc", b"in-zip")
            res = {r["entry"]: r["identical_copy_beside"] for r in b3.nested_zip_analysis(root)}
            self.assertEqual(res, {"T1/same.doc": "yes", "T1/diff.doc": "no"})

    def test_grouped_archives_counts_files_per_class_against_inventory(self):
        with tempfile.TemporaryDirectory() as t:
            zp = Path(t) / "g.zip"
            with zipfile.ZipFile(zp, "w") as z:
                for i in range(2):
                    z.writestr(f"x/BASIC_FIVE-1/BASIC FIVE/f{i}.doc", b"a")
                z.writestr("x/BASIC_FIVE-1/", b"")
            inv = [{"file": "BASIC FIVE-1.zip", "sha256": "h", "file_count": 3}]
            c = b3.grouped_archives([zp], inv)[0]["classes"][0]
            self.assertEqual((c["class"], c["files_in_grouped_zip"], c["count_matches_inventory"]), (5, 2, False))


if __name__ == "__main__":
    unittest.main()
