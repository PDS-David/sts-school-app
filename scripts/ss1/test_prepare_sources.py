"""Deferred negative controls. Synthetic archives only; never bypass production hash."""
import hashlib
import importlib.util
from pathlib import Path
import tempfile
import unittest
import zipfile
spec = importlib.util.spec_from_file_location('prepare_sources', Path(__file__).with_name('prepare_sources.py'))
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)
class StagingTests(unittest.TestCase):
    def test_wrong_archive_leaves_no_output(self):
        with tempfile.TemporaryDirectory() as d:
            root = Path(d); z = root/'bad.zip'; z.write_bytes(b'not an archive')
            with self.assertRaises(ValueError): module.prepare(z, root/'output')
            self.assertFalse((root/'output').exists())
    def test_traversal_rejected_even_after_archive_identity_check(self):
        with tempfile.TemporaryDirectory() as d:
            root = Path(d); z = root/'bad.zip'
            with zipfile.ZipFile(z, 'w') as f: f.writestr('../escape', b'bad')
            original = module.ARCHIVE_SHA256
            try:
                module.ARCHIVE_SHA256 = hashlib.sha256(z.read_bytes()).hexdigest()
                with self.assertRaisesRegex(ValueError, 'Unsafe'): module.prepare(z, root/'output')
                self.assertFalse((root/'escape').exists())
            finally: module.ARCHIVE_SHA256 = original
if __name__ == '__main__': unittest.main()
