import contextlib, hashlib, io, json, sys, tempfile, unittest
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'scripts' / 'jss3'))
import staging_attach_plan as plan

LOG = ("Found 1 candidate file(s)\n"
       "  JSS 3 / Music / 1st Term #3: a.json / ORIGINAL / Staff notation\n"
       "  JSS 3 / Music / 2nd Term #3: b.json / ORIGINAL / Staff notation\n"
       "  JSS 3 / Music / 2nd Term #4: b.json / ORIGINAL / Cadences\n")


def build(tmp: Path, title='Cadences', digest=None, subdir=True):
    root = tmp / 'assets'; d = root / 'm' if subdir else root; d.mkdir(parents=True)
    data = b'synthetic-bytes'; (d / 'x.png').write_bytes(data)
    (root / 'T_MANIFEST.csv').write_text(
        'asset_key,file,sha256,order_index,expected_title\n'
        f'k1,x.png,{digest or hashlib.sha256(data).hexdigest()},4,{title}\n', encoding='utf8')
    (tmp / 'log.txt').write_text(LOG, encoding='utf8')
    return root


def run(tmp, root, *extra):
    out = io.StringIO()
    with contextlib.redirect_stdout(out), contextlib.redirect_stderr(io.StringIO()):
        code = plan.main(['--importer-log', str(tmp / 'log.txt'), '--assets-root', str(root), *extra])
    return code, out.getvalue()


class AttachPlan(unittest.TestCase):
    def test_unique_target_and_dry_run_command(self):
        with tempfile.TemporaryDirectory() as t:
            t = Path(t); root = build(t)
            code, text = run(t, root, '--json-out', str(t / 'o.json'))
            self.assertEqual(code, 0)
            self.assertIn('--subject "Music"', text); self.assertIn('--term-label "2nd Term"', text)
            self.assertIn('--dry-run', text); self.assertFalse([l for l in text.splitlines() if l.startswith('node ') and '--apply' in l])
            self.assertEqual(json.loads((t / 'o.json').read_text())['manifests'][0]['target'], ['Music', '2nd Term'])

    def test_title_mismatch_fails(self):
        with tempfile.TemporaryDirectory() as t:
            t = Path(t); code, text = run(t, build(t, title='Other title'))
            self.assertEqual(code, 1); self.assertIn('0 candidate', text)

    def test_hash_mismatch_fails(self):
        with tempfile.TemporaryDirectory() as t:
            t = Path(t); code, text = run(t, build(t, digest='0' * 64))
            self.assertEqual(code, 1); self.assertIn('matching sha256', text)

    def test_ambiguous_target_fails(self):
        with tempfile.TemporaryDirectory() as t:
            t = Path(t); root = build(t, title='Staff notation')
            (t / 'log.txt').write_text(LOG.replace('Cadences', 'Staff notation'), encoding='utf8')
            text = (root / 'T_MANIFEST.csv').read_text().replace(',4,', ',3,')
            (root / 'T_MANIFEST.csv').write_text(text)
            code, out = run(t, root)
            self.assertEqual(code, 1); self.assertIn('2 candidate', out)


if __name__ == '__main__':
    unittest.main()
