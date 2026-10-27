"""SS1 source staging tests. WRITTEN, NOT EXECUTED (testing deferred by owner).
Run later:  python3 -m unittest discover -s tests -p "test_ss1_prepare_sources.py"
Uses only synthetic archives and a synthetic 2-source manifest; never touches real school documents.
"""
import hashlib, json, os, stat, subprocess, sys, tempfile, unittest, zipfile
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]
SCRIPT = REPO / 'scripts/ss1/prepare_sources.py'


def run(args):
    return subprocess.run([sys.executable, '-I', str(SCRIPT), *args], capture_output=True, text=True)


class PrepareSources(unittest.TestCase):
    def setUp(self):
        self.tmp = Path(tempfile.mkdtemp(prefix='ss1-prep-'))
        self.a, self.b = b'synthetic document A', b'synthetic document B'
        sources = [
            {'source_id': 'SS1-SRC-aaaaaaaaaaaa', 'archive_member': 'SSS 1/1st Term SS1_/A.docx', 'sha256': hashlib.sha256(self.a).hexdigest(), 'bytes': len(self.a), 'term_label': '1st Term', 'assigned_subject_slug': 'geography', 'worker': 'C', 'mapping_status': 'x'},
            {'source_id': 'SS1-SRC-bbbbbbbbbbbb', 'archive_member': 'SSS 1/2nd Term SS1_/B.docx', 'sha256': hashlib.sha256(self.b).hexdigest(), 'bytes': len(self.b), 'term_label': '2nd Term', 'assigned_subject_slug': 'geography', 'worker': 'C', 'mapping_status': 'x'},
        ]
        self.manifest = self.tmp / 'manifest.json'
        self.manifest.write_text(json.dumps({'authoritative_archive': {'sha256': '0' * 64}, 'sources': sources}))

    def zip(self, name, members, symlink=None):
        p = self.tmp / name
        with zipfile.ZipFile(p, 'w') as z:
            for n, d in members:
                z.writestr(n, d)
            if symlink:
                info = zipfile.ZipInfo(symlink)
                info.external_attr = (stat.S_IFLNK | 0o777) << 16
                z.writestr(info, 'target')
        return p

    def test_complete_staging_uses_manifest_paths_not_member_names(self):
        z = self.zip('ok.zip', [('1st Term SS1 /anything-at-all.docx', self.a), ('2nd Term SS1 /other.docx', self.b)])
        out = self.tmp / 'out'
        r = run(['--archive', str(z), '--output', str(out), '--manifest', str(self.manifest)])
        self.assertEqual(r.returncode, 0, r.stderr)
        self.assertEqual((out / 'SSS 1/1st Term SS1_/A.docx').read_bytes(), self.a)
        self.assertEqual(oct((out / 'SSS 1/1st Term SS1_/A.docx').stat().st_mode & 0o777), '0o600')

    def test_traversal_symlink_and_repo_output_are_refused(self):
        out = self.tmp / 'o1'
        self.assertEqual(run(['--archive', str(self.zip('t.zip', [('../evil.docx', self.a)])), '--output', str(out), '--manifest', str(self.manifest)]).returncode, 2)
        self.assertEqual(run(['--archive', str(self.zip('s.zip', [('x/a.docx', self.a)], symlink='x/link.docx')), '--output', str(self.tmp / 'o2'), '--manifest', str(self.manifest)]).returncode, 2)
        self.assertEqual(run(['--archive', str(self.zip('r.zip', [('a.docx', self.a)])), '--output', str(REPO / 'ss1-private-out'), '--manifest', str(self.manifest)]).returncode, 2)
        self.assertFalse((REPO / 'ss1-private-out').exists())

    def test_different_bytes_are_incomplete_and_never_staged_without_allow_partial(self):
        z = self.zip('d.zip', [('1st Term SS1 /A.docx', self.a), ('2nd Term SS1 /B.docx', b'same name, different bytes')])
        out = self.tmp / 'o3'
        r = run(['--archive', str(z), '--output', str(out), '--manifest', str(self.manifest)])
        self.assertEqual(r.returncode, 3); self.assertFalse(out.exists())
        r = run(['--archive', str(z), '--output', str(out), '--manifest', str(self.manifest), '--allow-partial'])
        self.assertEqual(r.returncode, 3)
        report = json.loads((out / 'STAGING_REPORT.json').read_text())
        self.assertEqual(report['status'], 'INCOMPLETE'); self.assertEqual(len(report['present_with_different_bytes']), 1)
        self.assertTrue((out / 'SSS 1/1st Term SS1_/A.docx').exists()); self.assertFalse((out / 'SSS 1/2nd Term SS1_/B.docx').exists())

    def test_non_empty_output_refused_and_nested_archives_never_opened(self):
        out = self.tmp / 'o4'; out.mkdir(); (out / 'keep').write_text('x')
        z = self.zip('n.zip', [('a.docx', self.a), ('inner.zip', b'PK-not-opened')])
        self.assertEqual(run(['--archive', str(z), '--output', str(out), '--manifest', str(self.manifest)]).returncode, 2)


if __name__ == '__main__':
    unittest.main()
