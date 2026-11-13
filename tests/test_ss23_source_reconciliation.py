import csv
import hashlib
import os
import sys
import tempfile
import unittest
import zipfile

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "scripts", "ss23"))
from reconcile_received_archives import archive_members, classify_member, reconcile


class SourceReconciliationTests(unittest.TestCase):
    def test_classifies_class_and_term_from_combined_archive_path(self):
        self.assertEqual(
            classify_member("SSS 2/2nd Term SS2_/CHEMISTRY.docx"),
            ("SS2", "2nd Term"),
        )
        self.assertEqual(
            classify_member("SSS 3/1st Term SS3_/BIOLOGY.doc"),
            ("SS3", "1st Term"),
        )

    def test_rejects_paths_without_class_and_term(self):
        self.assertIsNone(classify_member("SSS 2/CHEMISTRY.docx"))
        self.assertIsNone(classify_member("random/2nd Term SS2_/CHEMISTRY.docx"))

    def test_reconciles_content_identity_despite_member_path_change(self):
        payload = b"source lesson"
        digest = hashlib.sha256(payload).hexdigest()
        with tempfile.TemporaryDirectory() as directory:
            archive_path = os.path.join(directory, "combined.zip")
            with zipfile.ZipFile(archive_path, "w") as archive:
                archive.writestr("SSS 2/1st Term SS2_/BIOLOGY.docx", payload)
            actual, errors = archive_members(archive_path, "SS2")
        self.assertEqual(errors, [])
        result = reconcile(actual, [{
            "class": "SS2", "term": "1st Term",
            "sha256": digest, "bytes": len(payload),
        }])
        self.assertTrue(result["valid"])
        self.assertEqual(result["matched_members"], 1)

    def test_preserves_duplicate_multiplicity(self):
        row = {"class": "SS3", "term": "1st Term", "sha256": "a" * 64, "bytes": 12}
        result = reconcile([row], [row, row])
        self.assertFalse(result["valid"])
        self.assertEqual(len(result["missing"]), 1)

    def test_detects_wrong_term_even_when_hash_matches(self):
        actual = [{"class": "SS2", "term": "2nd Term", "sha256": "b" * 64, "bytes": 10}]
        expected = [{"class": "SS2", "term": "1st Term", "sha256": "b" * 64, "bytes": 10}]
        result = reconcile(actual, expected)
        self.assertFalse(result["valid"])
        self.assertEqual(len(result["missing"]), 1)
        self.assertEqual(len(result["unexpected"]), 1)


if __name__ == "__main__":
    unittest.main()
