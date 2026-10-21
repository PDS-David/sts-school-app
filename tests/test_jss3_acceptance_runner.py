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
if __name__=='__main__':unittest.main()
