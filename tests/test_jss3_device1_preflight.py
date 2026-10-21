"""DEVICE1 preflight tool against a local mock 'staging' server serving the REAL asset bytes.
No phone, no database, no network beyond loopback. This verifies the tool, not the app on a device."""
import contextlib, csv, importlib.util, io, json, tempfile, threading, unittest
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('pf', REPO / 'scripts/jss3/device1_preflight.py')
pf = importlib.util.module_from_spec(spec); spec.loader.exec_module(pf)

A = REPO / 'curriculum-assets/jss3'
FILES = {}  # asset_key -> path (current manifests, not row numbers)
for rel, d, keycol, filecol in (('supplements/V1_BUSINESS_1ST_MANIFEST.csv', 'supplements', 'asset_key', 'file'),
                                ('v2-math/V2_MATH_1ST_MANIFEST.csv', 'v2-math', 'asset_key', 'file'),
                                ('v3-science/V3_SCIENCE_2ND_MANIFEST.csv', 'v3-science', 'asset_key', 'file'),
                                ('TASK2_BT_ASSET_MANIFEST.csv', 'bt', 'asset_id', 'original_file')):
    with open(A / rel, newline='', encoding='utf-8') as f:
        for r in csv.DictReader(f):
            FILES[r[keycol]] = A / d / r[filecol]
MANIFEST = pf.load_manifests()
BYTES = {k: FILES[k].read_bytes() for k in pf.TARGET_KEYS + [pf.MUST_BE_HIDDEN]}
MIMES = {'.png': 'image/png', '.jpeg': 'image/jpeg', '.gif': 'image/gif'}
TOPICS = {1: ['V1-DE-02-example1-capital-cash'], 2: ['V2-MATH-M1-F03'], 3: ['BS-EYE', 'BS-PRISM-CORRECTED'],
          4: ['BS-EYE-SUP', 'BS-PRISM-CORRECTED-SUP'], 5: ['BT-02'], 6: ['BT-10', 'BT-12', 'BT-16'], 7: []}
IDS = {k: 100 + i for i, k in enumerate(pf.TARGET_KEYS + [pf.MUST_BE_HIDDEN])}
TOKENS = ('tok-student', 'tok-other')


class Staging:
    def __init__(self, leak_source=False, open_access=False, tamper=None, redirect=None):
        self.leak_source, self.open_access, self.tamper, self.redirect = leak_source, open_access, tamper, redirect
        st = self

        class H(BaseHTTPRequestHandler):
            def log_message(self, *a): pass

            def send(self, code, body=b'', ctype='application/json', extra=None):
                self.send_response(code); self.send_header('Content-Type', ctype)
                self.send_header('Content-Length', str(len(body)))
                for k, v in (extra or {}).items(): self.send_header(k, v)
                self.end_headers(); self.wfile.write(body)

            def do_GET(self):
                auth = self.headers.get('Authorization', '')
                tok = auth[7:] if auth.startswith('Bearer ') else None
                path = self.path
                if path.startswith('/learning/assets/'):
                    aid = int(path.rsplit('/', 1)[1]); key = next((k for k, v in IDS.items() if v == aid), None)
                    if tok not in TOKENS and not st.open_access: return self.send(401, b'{"error":"auth"}')
                    if tok == 'tok-other' or key is None: return self.send(404, b'{"error":"Asset not found"}')
                    if st.redirect == key and tok: return self.send(302, b'', extra={'Location': st.redirect_target})
                    body = BYTES[key]
                    if st.tamper == key: body = bytes([body[0] ^ 1]) + body[1:]
                    return self.send(200, body, MIMES[FILES[key].suffix])
                if tok not in TOKENS: return self.send(401, b'{"error":"auth"}')
                if path == '/learning/topics':
                    return self.send(200, json.dumps({'topics': [{'id': t} for t in TOPICS] if tok == 'tok-student' else []}).encode())
                tid = int(path.split('/')[3])
                keys = list(TOPICS.get(tid, [])) if tok == 'tok-student' else []
                if st.leak_source and tid == 3 and tok == 'tok-student': keys.append(pf.MUST_BE_HIDDEN)
                assets = [{'id': IDS[k], 'asset_key': k, 'kind': 'image', 'sha256': MANIFEST[k]['sha256'],
                           'caption': MANIFEST[k]['caption'], 'alt_text': MANIFEST[k]['alt_text'],
                           'sort_order': 1, 'url': f'/learning/assets/{IDS[k]}'} for k in keys]
                return self.send(200, json.dumps({'assets': assets}).encode())

        self.httpd = ThreadingHTTPServer(('127.0.0.1', 0), H)
        self.url = f'http://127.0.0.1:{self.httpd.server_address[1]}'
        threading.Thread(target=self.httpd.serve_forever, daemon=True).start()

    def close(self): self.httpd.shutdown(); self.httpd.server_close()


class Capture:  # a second host that must never receive a token
    def __init__(self):
        self.hits = []; c = self

        class H(BaseHTTPRequestHandler):
            def log_message(self, *a): pass
            def do_GET(self):
                c.hits.append(self.headers.get('Authorization')); self.send_response(200); self.end_headers()

        self.httpd = ThreadingHTTPServer(('127.0.0.1', 0), H)
        self.url = f'http://127.0.0.1:{self.httpd.server_address[1]}/x'
        threading.Thread(target=self.httpd.serve_forever, daemon=True).start()

    def close(self): self.httpd.shutdown(); self.httpd.server_close()


def run_tool(server, tokens, extra=()):
    with tempfile.TemporaryDirectory() as d:
        out = Path(d) / 'out'; buf = io.StringIO()
        with contextlib.redirect_stdout(buf), contextlib.redirect_stderr(buf):
            code = pf.main(['--base-url', server.url, '--output', str(out), '--staging-confirmed', *extra], tokens)
        rf = out / 'results.json'
        text = rf.read_text() if rf.exists() else ''
        return code, buf.getvalue(), (json.loads(text) if text else None), text


BOTH = {'JSS3_STUDENT_TOKEN': 'tok-student', 'JSS3_OTHER_CLASS_TOKEN': 'tok-other'}


class Preflight(unittest.TestCase):
    def setUp(self): self.addCleanup(lambda: None)

    def server(self, **kw):
        s = Staging(**kw); self.addCleanup(s.close); return s

    def test_happy_path_passes_and_reproduces_a2_pixel_sizes_and_gif_frames(self):
        code, out, rep, _ = run_tool(self.server(), BOTH)
        self.assertEqual(code, 0, out)
        self.assertEqual(rep['counts']['FAIL'], 0); self.assertEqual(rep['counts']['NOT_PERFORMED'], 0)
        self.assertEqual({a['asset_key'] for a in rep['assets']}, set(pf.TARGET_KEYS))
        size = {a['asset_key']: (a['width'], a['height'], a['gif_frames']) for a in rep['assets']}
        for key, want in {'V1-DE-02-example1-capital-cash': (1080, 855, None), 'V2-MATH-M1-F03': (1142, 673, None),
                          'BS-EYE': (334, 250, None), 'BS-PRISM-CORRECTED': (900, 550, None),
                          'BT-02': (1280, 921, None), 'BT-10': (578, 484, 58), 'BT-12': (742, 582, 89),
                          'BT-16': (594, 748, 66)}.items():
            self.assertEqual(size[key], want, key)
        self.assertTrue(all(a['alt_text_delivered'] for a in rep['assets']))
        self.assertIn('phone observation', ' '.join(rep['not_covered']))

    def test_missing_other_class_token_is_not_performed_never_a_pass(self):
        code, _, rep, _ = run_tool(self.server(), {'JSS3_STUDENT_TOKEN': 'tok-student'})
        self.assertEqual(code, 2)
        self.assertEqual(rep['counts']['FAIL'], 0); self.assertEqual(rep['counts']['NOT_PERFORMED'], 10)

    def test_withdrawn_prism_source_visible_to_student_fails(self):
        code, out, rep, _ = run_tool(self.server(leak_source=True), BOTH)
        self.assertEqual(code, 1)
        self.assertIn('hidden.absent', [r['id'] for r in rep['results'] if r['status'] == 'FAIL'])

    def test_bytes_served_without_a_token_fail(self):
        code, _, rep, _ = run_tool(self.server(open_access=True), BOTH)
        self.assertEqual(code, 1)
        self.assertTrue(any(r['id'].endswith('.no_token') and r['status'] == 'FAIL' for r in rep['results']))

    def test_altered_bytes_fail_hash_check(self):
        code, _, rep, _ = run_tool(self.server(tamper='V2-MATH-M1-F03'), BOTH)
        self.assertEqual(code, 1)
        bad = [r['id'] for r in rep['results'] if r['status'] == 'FAIL']
        self.assertEqual(bad, [f"V2-MATH-M1-F03#{IDS['V2-MATH-M1-F03']}.bytes"])

    def test_redirect_is_not_followed_so_the_token_never_leaves_the_host(self):
        cap = Capture(); self.addCleanup(cap.close)
        s = self.server(redirect='BT-02'); s.redirect_target = cap.url
        code, _, rep, _ = run_tool(s, BOTH)
        self.assertEqual(code, 1); self.assertEqual(cap.hits, [])
        self.assertTrue(any(r['id'].startswith('BT-02#') and r['id'].endswith('.bytes') and r['status'] == 'FAIL'
                            for r in rep['results']))

    def test_tokens_never_appear_in_output_or_results(self):
        for kw in ({}, {'leak_source': True}):
            _, out, _, text = run_tool(self.server(**kw), BOTH)
            for t in TOKENS: self.assertNotIn(t, out + text)

    def test_target_url_guards(self):
        app = json.loads((REPO / 'mobile/app.json').read_text())['expo']['extra']['apiUrl']
        for url, flags in [('https://staging.example.org', dict(staging_confirmed=False)),
                           ('http://staging.example.org', {}), ('https://u:p@staging.example.org', {}),
                           (app, {})]:
            with self.assertRaises(ValueError, msg=url):
                pf.check_base_url(url, **{'staging_confirmed': True, 'allow_app_json_host': False, **flags})
        self.assertEqual(pf.check_base_url(app, True, True), app.rstrip('/'))
        self.assertEqual(pf.check_base_url('http://127.0.0.1:9', True, False), 'http://127.0.0.1:9')

    def test_requires_student_token_and_fresh_output_dir(self):
        with tempfile.TemporaryDirectory() as d:
            self.assertEqual(pf.main(['--base-url', 'http://127.0.0.1:9', '--output', str(Path(d) / 'o'),
                                      '--staging-confirmed'], {}), 3)
            with self.assertRaises(FileExistsError):
                pf.main(['--base-url', 'http://127.0.0.1:9', '--output', d, '--staging-confirmed'],
                        {'JSS3_STUDENT_TOKEN': 'x'})

    def test_gif_frame_counter_matches_pillow(self):
        from PIL import Image
        for key in ('BT-10', 'BT-12', 'BT-16'):
            with Image.open(FILES[key]) as im: self.assertEqual(pf.gif_frames(BYTES[key]), im.n_frames, key)


if __name__ == '__main__':
    unittest.main()
