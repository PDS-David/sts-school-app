"""B_PREP tests. Synthetic fixtures only. The SQL tests need a disposable loopback PostgreSQL:
set JSS3_LOCAL_TEST_DATABASE_URL=postgresql://...@127.0.0.1:PORT/jss3_test_x with backend/schema.sql loaded;
without it they are reported SKIPPED (documented skip, not a pass)."""
import json, os, re, subprocess, sys, tempfile, unittest
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
import validate_export as v  # noqa: E402

REPO = HERE.parents[2]


def row(i, **kw):
    r = {"id": i, "school_code": "primary", "subject_id": 1, "subject_name": "Synthetic", "class_name": "Primary 1",
         "term_label": "1st Term", "title": f"t{i}", "description": None, "source_reference": "ref",
         "source_file": "f.docx", "order_index": i}
    r.update(kw)
    return r


class Validate(unittest.TestCase):
    def run_v(self, rows, kind="release-snapshot", prov=None):
        with tempfile.TemporaryDirectory() as d:
            e, o = Path(d) / "e.json", Path(d) / "r.json"
            e.write_text(json.dumps(rows))
            args = ["--export", str(e), "--kind", kind, "--output", str(o)]
            if prov is not None:
                pf = Path(d) / "p.json"
                prov = dict(prov)
                if prov.get("sha256") == "SELF":
                    import hashlib
                    prov["sha256"] = hashlib.sha256(e.read_bytes()).hexdigest()
                pf.write_text(json.dumps(prov)); args += ["--provenance", str(pf)]
            code = v.main(args)
            return code, json.loads(o.read_text())

    GOOD = {"origin": "synthetic", "export_taken_utc": "2026-01-02T00:00:00Z", "data_as_of_utc": "2025-12-01T00:00:00Z",
            "scope": "synthetic", "approval_record": "SYN-1", "export_method": "synthetic", "sha256": "SELF"}

    def test_ok_and_never_certifies(self):
        code, r = self.run_v([row(1), row(2)], "certified-baseline", self.GOOD)
        self.assertEqual((code, r["result"], r["certification_claimed"]), (0, "OK", False))
        self.assertFalse(r["protected_count_matches_2179"])

    def test_missing_provenance_not_ready(self):
        code, r = self.run_v([row(1)])
        self.assertEqual((code, r["result"]), (1, "NOT_READY"))

    def test_current_export_is_not_historical(self):
        p = dict(self.GOOD, data_as_of_utc="2026-01-02T09:00:00Z")
        code, r = self.run_v([row(1)], "certified-baseline", p)
        self.assertEqual(code, 1)
        self.assertTrue(any("not historical" in x for x in r["provenance_problems"]))

    def test_sha_mismatch_and_placeholders(self):
        p = dict(self.GOOD, sha256="0" * 64, approval_record="TBD")
        code, r = self.run_v([row(1)], "certified-baseline", p)
        self.assertEqual(code, 1)
        self.assertEqual(len(r["provenance_problems"]), 2)

    def test_null_subject_duplicate_and_legacy_flagged_without_values(self):
        rows = [row(1, subject_name=None), row(2), row(3, order_index=2), row(4, class_name="Grade 3")]
        code, r = self.run_v(rows, "release-snapshot", dict(self.GOOD))
        self.assertEqual(code, 1)
        self.assertEqual(r["rows_with_blank_identity"], 1)
        self.assertEqual(r["duplicate_identity_rows"], 1)
        self.assertEqual(r["non_current_class_names"], {"Grade 3": 1})
        self.assertNotIn("t1", json.dumps({k: r[k] for k in ("structural_problems",)}))

    def test_missing_required_field_and_blocked_inputs(self):
        bad = row(1); del bad["source_file"]
        code, r = self.run_v([bad])
        self.assertTrue(any("source_file" in x for x in r["structural_problems"]))
        with tempfile.TemporaryDirectory() as d:
            self.assertEqual(v.main(["--export", f"{d}/no.json", "--kind", "release-snapshot", "--output", f"{d}/o.json"]), 2)
            (Path(d) / "x.dump").write_text("[]")
            self.assertEqual(v.main(["--export", f"{d}/x.dump", "--kind", "release-snapshot", "--output", f"{d}/o.json"]), 2)


URL = os.environ.get("JSS3_LOCAL_TEST_DATABASE_URL", "")


@unittest.skipUnless(re.match(r"^postgres(ql)?://[^/]*@?(127\.0\.0\.1|localhost)[:/].*/jss3_test_\w+$", URL),
                     "SKIPPED: set JSS3_LOCAL_TEST_DATABASE_URL (loopback, jss3_test_* database, schema.sql loaded)")
class Sql(unittest.TestCase):
    def psql(self, setup, f):
        cmd = ["psql", "-X", "-qAt", "--set", "ON_ERROR_STOP=1", URL]
        if setup:
            subprocess.run(cmd + ["-c", setup], check=True, capture_output=True)
        return subprocess.run(cmd + ["--file", str(REPO / "scripts/jss3" / f)], check=True, capture_output=True, text=True).stdout

    SEED = """
    TRUNCATE topics, subjects RESTART IDENTITY CASCADE;
    INSERT INTO schools(code,name) VALUES ('primary','S1'),('secondary','S2') ON CONFLICT DO NOTHING;
    INSERT INTO subjects(school_code,name) VALUES ('primary','M'),('secondary','E');
    INSERT INTO topics(school_code,subject_id,class_name,term_label,title,order_index)
      SELECT 'primary',1,c,'1st Term','x',1 FROM unnest(ARRAY['Primary 1','PRY 2','Grade 3','Primary 7']) c;
    INSERT INTO topics(school_code,subject_id,class_name,term_label,title,order_index)
      SELECT 'secondary',2,c,'1st Term','x',1 FROM unnest(ARRAY['JSS 1','JSS1','JSS 2','JSS 3']) c;
    INSERT INTO topics(school_code,subject_id,class_name,term_label,title,order_index) VALUES ('primary',NULL,'Primary 1','2nd Term','o',1);
    """

    def test_export_keeps_legacy_names_and_excludes_out_of_scope(self):
        rows = json.loads(self.psql(self.SEED, "export_protected_curriculum.sql"))
        self.assertEqual(sorted(r["class_name"] for r in rows),
                         sorted(["Primary 1", "Primary 1", "PRY 2", "Grade 3", "JSS 1", "JSS1", "JSS 2"]))
        self.assertEqual({f for r in rows for f in r}, v.SQL_EXPORT_FIELDS)

    def test_preflight_counts(self):
        d = json.loads(self.psql(self.SEED, "preflight_protected_curriculum.sql"))
        self.assertEqual((d["in_scope_rows"], d["rows_with_null_subject_name"], d["legacy_class_name_rows"]), (7, 1, 3))
        self.assertEqual({o["class_name"] for o in d["out_of_scope_class_names"]}, {"Primary 7", "JSS 3"})

    def test_export_validates_as_structurally_flawed_exactly_where_expected(self):
        rows = json.loads(self.psql(self.SEED, "export_protected_curriculum.sql"))
        info, problems = v.check_rows(rows)
        self.assertEqual(info["rows_with_blank_identity"], 1)
        self.assertEqual(set(info["non_current_class_names"]), {"PRY 2", "Grade 3", "JSS1"})


if __name__ == "__main__":
    unittest.main()
