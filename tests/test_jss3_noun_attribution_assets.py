import csv, hashlib, json, subprocess, sys, tempfile, unittest
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]; S = ROOT / 'scripts/jss3/v4/build_noun_attribution_assets.py'
try:
    import pymupdf
except ImportError:  # CI installs it from acceptance-requirements.txt; a missing module is a failure, not a skip
    pymupdf = None

def png(color):
    from PIL import Image; import io
    b = io.BytesIO(); Image.new('RGB', (40, 30), color).save(b, 'PNG'); return b.getvalue()

class T(unittest.TestCase):
    def setUp(self):
        self.assertIsNotNone(pymupdf, 'pymupdf must be installed (scripts/jss3/acceptance-requirements.txt)')
        self.tmp = Path(tempfile.mkdtemp()); d = pymupdf.open(); p = d.new_page()
        p.insert_image(pymupdf.Rect(10, 10, 110, 80), stream=png('red')); p.insert_image(pymupdf.Rect(10, 100, 110, 170), stream=png('blue'))
        self.pdf = self.tmp / 'x.pdf'; d.save(self.pdf)
        self.cap = self.tmp / 'cap.json'
        self.cap.write_text(json.dumps([{'weekLabel': 'SUPPLEMENT SUP-YO-ORAL-TEXTS', 'className': 'JSS 3', 'orderIndex': 77, 'title': 'T title for guard'}]))
    def run_(self, *a): return subprocess.run([sys.executable, '-I', str(S), *a], capture_output=True, text=True)
    def test_refuses_unrecorded_hash(self):
        r = self.run_('inspect', '--pdf', str(self.pdf)); self.assertNotEqual(r.returncode, 0); self.assertIn('REFUSED', r.stderr + r.stdout)
    def test_inspect_lists_images_when_hash_change_is_explicit(self):
        r = self.run_('inspect', '--pdf', str(self.pdf), '--accept-new-hash'); self.assertEqual(r.returncode, 0, r.stderr)
        j = json.loads(r.stdout); self.assertEqual(len(j['images']), 2); self.assertEqual(j['pdf_sha256'], hashlib.sha256(self.pdf.read_bytes()).hexdigest())
    def test_build_binds_to_capture_row_with_exact_hashes(self):
        xs = [i['xref'] for i in json.loads(self.run_('inspect', '--pdf', str(self.pdf), '--accept-new-hash').stdout)['images']]
        out = self.tmp / 'o'
        r = self.run_('build', '--pdf', str(self.pdf), '--accept-new-hash', '--cover-xref', str(xs[0]), '--logo-xref', str(xs[1]), '--capture', str(self.cap), '--out', str(out))
        self.assertEqual(r.returncode, 0, r.stderr)
        rows = list(csv.DictReader((out / 'NOUN_ATTRIBUTION_2ND_MANIFEST.csv').open()))
        self.assertEqual([x['asset_key'] for x in rows], ['NOUN-ENG105-M2-COVER', 'NOUN-ENG105-M2-LOGO'])
        for x in rows:
            self.assertEqual(hashlib.sha256((out / x['file']).read_bytes()).hexdigest(), x['sha256']); self.assertEqual(x['order_index'], '77')
            self.assertEqual(x['expected_title'], 'T title for guard'); self.assertGreaterEqual(len(x['alt_text']), 120)
    def test_rejects_non_image_xref_same_xref_and_missing_lesson(self):
        base = ['build', '--pdf', str(self.pdf), '--accept-new-hash', '--capture', str(self.cap)]
        self.assertNotEqual(self.run_(*base, '--cover-xref', '9999', '--logo-xref', '9998').returncode, 0)
        xs = [i['xref'] for i in json.loads(self.run_('inspect', '--pdf', str(self.pdf), '--accept-new-hash').stdout)['images']]
        self.assertNotEqual(self.run_(*base, '--cover-xref', str(xs[0]), '--logo-xref', str(xs[0])).returncode, 0)
        self.cap.write_text('[]'); self.assertNotEqual(self.run_(*base, '--cover-xref', str(xs[0]), '--logo-xref', str(xs[1])).returncode, 0)
if __name__ == '__main__': unittest.main()
