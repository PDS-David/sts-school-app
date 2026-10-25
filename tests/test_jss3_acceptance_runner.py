"""Acceptance runner safety and staging checks; no DB or private source fixture."""
import importlib.util, tempfile, unittest, zipfile
from pathlib import Path
spec=importlib.util.spec_from_file_location('accept',Path(__file__).resolve().parents[1]/'scripts/jss3/run_acceptance.py')
m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
class Runner(unittest.TestCase):
    def test_only_explicit_disposable_loopback_database(self):
        for value in ['postgres://u:p@127.0.0.1:55432/jss3_test_acceptance','postgresql://localhost/jss3_test_x']:
            self.assertEqual(m.local_url(value),value)
        for value in ['', 'postgres://db.example.org/jss3_test_x','postgres://localhost/production','postgres://localhost/jss3_test_x?host=db.example.org','https://localhost/jss3_test_x']:
            with self.assertRaises(ValueError):m.local_url(value)
    def test_missing_or_duplicate_inventory_rejected(self):
        with tempfile.TemporaryDirectory() as d:
            p=Path(d)/'x.zip'
            with zipfile.ZipFile(p,'w') as z:z.writestr('a/SOURCE_INVENTORY.csv','x');z.writestr('b/SOURCE_INVENTORY.csv','x')
            with self.assertRaisesRegex(ValueError,'exactly one'):m.stage_archive(p,Path(d)/'out')
    def test_path_traversal_rejected_before_any_write(self):
        with tempfile.TemporaryDirectory() as d:
            p=Path(d)/'x.zip';lines=['staged_path,sha256','../escape,none']+[f'file{i},none' for i in range(38)]
            with zipfile.ZipFile(p,'w') as z:z.writestr('SOURCE_INVENTORY.csv','\n'.join(lines))
            with self.assertRaisesRegex(ValueError,'Unsafe'):m.stage_archive(p,Path(d)/'out')
            self.assertFalse((Path(d)/'escape').exists())

class RunnerSuiteRegistryTests(unittest.TestCase):
    """Every real-PostgreSQL suite in tests/ must run in full acceptance or carry a written exclusion."""
    # Excluded on purpose: run in CI with their own disposable databases; owned by later tasks (07 protected baseline, 08 staging).
    EXCLUDED = {'protected-export.db': 'CI-only protected-export check (Task 07 scope)',
                'staging-admin.db': 'creates and drops its own jss3_test_admin_* databases (Task 08 scope)'}

    def test_every_db_suite_is_registered_or_excluded(self):
        import re
        from pathlib import Path
        root = Path(__file__).resolve().parents[1]
        src = (root / 'scripts/jss3/run_acceptance.py').read_text(encoding='utf8')
        registered = set(re.search(r"suites=\[(.*?)\]", src, re.S).group(1).replace("'", '').replace(' ', '').split(','))
        on_disk = {p.name[:-len('.test.mts')] for p in (root / 'tests').glob('*.db.test.mts')}
        self.assertEqual(sorted(on_disk - registered - set(self.EXCLUDED)), [], 'DB suite omitted from run_acceptance.py')
        self.assertEqual(sorted(registered - on_disk), [], 'runner lists a suite that does not exist')
        self.assertIn('jss3-sequence.db', registered)
        self.assertIn('JSS3_SEQ_TEST_DATABASE_URL', src)

if __name__=='__main__':unittest.main()
