import json
import re
import unittest
from pathlib import Path

MAP = Path(__file__).resolve().parents[1] / "docs" / "ss23" / "subjects" / "agricultural-science" / "SOURCE_MAP.json"


class AgriculturalScienceSourceMapTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.data = json.loads(MAP.read_text(encoding="utf-8"))

    def test_source_ids_match_member_hashes_and_are_unique(self):
        sources = self.data["sources"]
        ids = [source["source_id"] for source in sources]
        self.assertEqual(len(ids), len(set(ids)))
        for source in sources:
            self.assertRegex(source["sha256"], r"^[a-f0-9]{64}$")
            self.assertRegex(source["archive_sha256"], r"^[a-f0-9]{64}$")
            self.assertEqual(source["source_id"], "SS23-SRC-" + source["sha256"][:12])
            self.assertGreater(source["bytes"], 0)

    def test_ss2_has_three_instructional_terms_and_ss3_two_exam_prep_terms(self):
        ss2 = {(s["class"], s["term"]) for s in self.data["sources"] if s["class"] == "SS2"}
        ss3 = {(s["class"], s["term"]) for s in self.data["sources"] if s["class"] == "SS3"}
        self.assertEqual(ss2, {("SS2", "1st Term"), ("SS2", "2nd Term"), ("SS2", "3rd Term")})
        self.assertEqual(ss3, {("SS3", "1st Term"), ("SS3", "2nd Term")})
        self.assertEqual(self.data["policy"]["ss3_mode"], "EXAM_PREPARATION_ONLY")
        self.assertEqual(self.data["policy"]["ss3_examination_targets"], ["WAEC", "NECO", "JAMB"])

    def test_ss2_third_term_farm_records_is_separated_from_week_five_six(self):
        source = next(s for s in self.data["sources"] if s["source_id"] == "SS23-SRC-6abb32818845")
        mapping = next(m for m in source["body_mapping"] if m["weeks"] == "7-8")
        self.assertEqual(mapping["status"], "BODY_PRESENT_HEADING_MISSING")
        self.assertIn("Balance Sheet or Networth Statement", mapping["anchors"][0])
        self.assertIn("distinct Week 7-8 mapping", mapping["decision"])

    def test_ss3_second_term_preparation_gaps_remain_explicit(self):
        source = next(s for s in self.data["sources"] if s["source_id"] == "SS23-SRC-b12f41490179")
        unresolved = [m["weeks"] for m in source["body_mapping"] if m["status"] == "UNRESOLVED_SCHEME_ONLY"]
        self.assertEqual(unresolved, ["9", "10", "11-12"])
        self.assertEqual(self.data["completion_boundary"]["subject_status"], "NOT_READY_FOR_STUDENT_RELEASE")

    def test_every_scheme_week_has_a_body_mapping_decision(self):
        for source in self.data["sources"]:
            scheme_weeks = {entry["weeks"] for entry in source["scheme"]}
            mapped_weeks = {entry["weeks"] for entry in source["body_mapping"]}
            self.assertEqual(scheme_weeks, mapped_weeks, source["source_id"])
            for entry in source["body_mapping"]:
                self.assertTrue(entry["status"])
                self.assertTrue(entry["topic"])


if __name__ == "__main__":
    unittest.main()
