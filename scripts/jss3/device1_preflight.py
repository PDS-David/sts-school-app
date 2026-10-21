#!/usr/bin/env python3
"""DEVICE1 staging preflight: the API-side half of lesson-picture acceptance.

This tool NEVER replaces phone observation. It checks, against an authorised
STAGING backend, everything about the eight DEVICE1 pictures that can be checked
without a screen: they are listed for a JSS3 student, their bytes hash to the
current manifests, the alt text is delivered, the withdrawn prism stays hidden,
and requests without a token or from another class are refused. Readability,
crop, spoken description, sideways navigation, GIF motion and retry UX still
need an actual phone (see docs/jss3/completion/DEVICE1/REPORT.md).

Tokens come only from the environment (JSS3_STUDENT_TOKEN, JSS3_OTHER_CLASS_TOKEN)
and are never printed or written. Redirects are not followed, so a token cannot be
forwarded to another host. Exit: 0 all API checks pass, 1 any FAIL, 2 some check
NOT_PERFORMED (for example no other-class token). 0 is not a device PASS.
"""
import argparse, csv, hashlib, json, os, re, struct, sys, urllib.error, urllib.parse, urllib.request
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
ASSETS = ROOT / 'curriculum-assets' / 'jss3'
TARGET_KEYS = ['V1-DE-02-example1-capital-cash', 'V2-MATH-M1-F03', 'BS-EYE', 'BS-PRISM-CORRECTED',
               'BT-02', 'BT-10', 'BT-12', 'BT-16', 'BS-EYE-SUP', 'BS-PRISM-CORRECTED-SUP']
MUST_BE_HIDDEN = 'BS-PRISM-SOURCE'
REFUSED = (401, 403)
REFUSED_OR_ABSENT = (401, 403, 404)
MIME = {'png': 'image/png', 'jpeg': 'image/jpeg', 'gif': 'image/gif'}


def truthy(v):
    return str(v).strip().lower() == 'true'


def load_manifests(assets=ASSETS):
    """asset_key -> {sha256, displayed, alt_text, caption, note}. Current manifests only."""
    out = {}

    def add(key, row, sha, note=''):
        if key in out:
            raise ValueError(f'duplicate asset key across manifests: {key}')
        out[key] = {'sha256': row[sha].strip().lower(), 'displayed': truthy(row['displayed']),
                    'alt_text': (row.get('alt_text') or '').strip(), 'caption': (row.get('caption') or '').strip(),
                    'note': row.get(note, '') if note else ''}

    for rel in ('supplements/V1_BUSINESS_1ST_MANIFEST.csv', 'v2-math/V2_MATH_1ST_MANIFEST.csv',
                'v3-science/V3_SCIENCE_2ND_MANIFEST.csv'):
        with open(assets / rel, newline='', encoding='utf-8') as f:
            for row in csv.DictReader(f):
                add(row['asset_key'], row, 'sha256')
    with open(assets / 'TASK2_BT_ASSET_MANIFEST.csv', newline='', encoding='utf-8') as f:
        for row in csv.DictReader(f):
            add(row['asset_id'], row, 'sha256_verified', 'note')
    return out


def image_info(b):
    """(format, width, height, gif_frames|None); None when not a PNG/JPEG/GIF."""
    try:
        if b[:8] == b'\x89PNG\r\n\x1a\n':
            w, h = struct.unpack('>II', b[16:24]); return 'png', w, h, None
        if b[:6] in (b'GIF87a', b'GIF89a'):
            w, h = struct.unpack('<HH', b[6:10]); return 'gif', w, h, gif_frames(b)
        if b[:2] == b'\xff\xd8':
            i = 2
            while i + 9 < len(b):
                if b[i] != 0xFF: i += 1; continue
                m = b[i + 1]
                if m == 0xFF: i += 1; continue
                if m in (0xC0, 0xC1, 0xC2):
                    h, w = struct.unpack('>HH', b[i + 5:i + 9]); return 'jpeg', w, h, None
                i += 2 + struct.unpack('>H', b[i + 2:i + 4])[0]
    except (struct.error, IndexError):
        pass
    return None


def gif_frames(b):
    try:
        flags = b[10]; i = 13
        if flags & 0x80: i += 3 * (2 ** ((flags & 7) + 1))
        n = 0
        while i < len(b):
            t = b[i]; i += 1
            if t == 0x3B: return n
            if t == 0x21:
                i += 1
            elif t == 0x2C:
                n += 1; f2 = b[i + 8]; i += 9
                if f2 & 0x80: i += 3 * (2 ** ((f2 & 7) + 1))
                i += 1
            else:
                return None
            while True:
                size = b[i]; i += 1
                if size == 0: break
                i += size
    except IndexError:
        pass
    return None


class _NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *a, **k):
        return None  # a 3xx surfaces as an HTTPError; the token is never re-sent elsewhere


_OPENER = urllib.request.build_opener(_NoRedirect)


def http_get(url, token=None, timeout=60):
    req = urllib.request.Request(url, headers={'Authorization': f'Bearer {token}'} if token else {})
    try:
        with _OPENER.open(req, timeout=timeout) as r:
            return r.status, dict(r.headers), r.read()
    except urllib.error.HTTPError as e:
        return e.code, dict(e.headers), e.read()


def check_base_url(url, staging_confirmed, allow_app_json_host, app_json=ROOT / 'mobile' / 'app.json'):
    if not staging_confirmed:
        raise ValueError('refusing to run without --staging-confirmed (this tool must only target authorised staging)')
    u = urllib.parse.urlsplit(url)
    loopback = u.hostname in ('127.0.0.1', 'localhost', '::1')
    if u.scheme != 'https' and not (u.scheme == 'http' and loopback):
        raise ValueError('base URL must be https (http only for loopback)')
    if u.username or u.password:
        raise ValueError('credentials in the base URL are not accepted')
    try:
        configured = urllib.parse.urlsplit(json.loads(app_json.read_text())['expo']['extra']['apiUrl']).hostname
    except (OSError, KeyError, ValueError):
        configured = None
    if configured and u.hostname == configured and not allow_app_json_host:
        raise ValueError(f'{u.hostname} is the host baked into mobile/app.json (possibly production); '
                         'pass --allow-app-json-host only if it is genuinely staging')
    return f'{u.scheme}://{u.netloc}'


def run(base, student, other, manifest):
    results, table = [], []

    def rec(cid, subject, status, detail=''):
        results.append({'id': cid, 'subject': subject, 'status': status, 'detail': detail})

    def getj(path, token):
        s, _, body = http_get(base + path, token)
        try: return s, json.loads(body or b'null')
        except ValueError: return s, None

    s, data = getj('/learning/topics', student)
    topics = (data or {}).get('topics') if s == 200 and isinstance(data, dict) else None
    if not isinstance(topics, list):
        rec('student.topics', 'student topic list', 'FAIL', f'HTTP {s} or malformed body')
        return results, table
    rec('student.topics', 'student topic list', 'PASS', f'{len(topics)} topics visible')

    found, topic_of = {}, {}
    for t in topics:
        s, d = getj(f"/learning/topics/{int(t['id'])}/assets", student)
        if s != 200 or not isinstance(d, dict) or not isinstance(d.get('assets'), list):
            rec(f"assets.topic.{t['id']}", 'asset list', 'FAIL', f'HTTP {s} or malformed body'); continue
        for a in d['assets']:
            found.setdefault(a.get('asset_key'), []).append(a); topic_of[a.get('id')] = t['id']
    rec('alt_text.column', 'topic_assets.alt_text selectable', 'PASS',
        'every topic asset list answered 200 (the route selects alt_text)' if not any(
            r['status'] == 'FAIL' and r['id'].startswith('assets.topic.') for r in results) else 'see failed lists')

    hidden = sorted(k for k, m in manifest.items() if not m['displayed'])
    if MUST_BE_HIDDEN not in hidden:
        rec('hidden.manifest', MUST_BE_HIDDEN, 'FAIL', 'manifest no longer marks it displayed=false')
    leaked = [k for k in hidden if k in found]
    rec('hidden.absent', f'{len(hidden)} withdrawn assets incl. {MUST_BE_HIDDEN}', 'FAIL' if leaked else 'PASS',
        f'listed for a student: {leaked}' if leaked else 'none appear in any student topic list')

    for key in TARGET_KEYS:
        m = manifest.get(key)
        if m is None:
            rec(f'{key}.manifest', key, 'FAIL', 'not in current manifests'); continue
        listed = found.get(key, [])
        if not listed:
            rec(f'{key}.listed', key, 'FAIL', 'not listed for this student (wrong class/term, not attached, or hidden)'); continue
        for a in listed:
            tag = f"{key}#{a['id']}"
            rec(f'{tag}.listing', key, 'PASS' if (str(a.get('sha256', '')).lower() == m['sha256'] and
                (not m['alt_text'] or (a.get('alt_text') or '').strip() == m['alt_text'])) else 'FAIL',
                f"topic {topic_of[a['id']]}; listing sha256/alt_text compared with current manifest")
            st, hdr, body = http_get(base + a['url'], student)
            hl = {k.lower(): v for k, v in hdr.items()}
            info = image_info(body) if st == 200 else None
            ok = st == 200 and hashlib.sha256(body).hexdigest() == m['sha256'] and info is not None \
                and hl.get('content-type', '').split(';')[0].strip() == MIME.get(info[0]) \
                and hl.get('content-length', str(len(body))) == str(len(body))
            frames_note = re.search(r'(\d+) frames', m['note'] or '')
            if ok and info[0] == 'gif':
                ok = info[3] is not None and info[3] > 1 and (not frames_note or info[3] == int(frames_note.group(1)))
            rec(f'{tag}.bytes', key, 'PASS' if ok else 'FAIL',
                f'HTTP {st}; sha256/type/length/frames vs manifest' + ('' if ok else ' MISMATCH'))
            table.append({'asset_key': key, 'asset_id': a['id'], 'topic_id': topic_of[a['id']], 'http': st,
                          'format': info[0] if info else None, 'width': info[1] if info else None,
                          'height': info[2] if info else None, 'gif_frames': info[3] if info else None,
                          'bytes': len(body), 'alt_text_delivered': bool((a.get('alt_text') or '').strip())})
            s1, _, b1 = http_get(base + a['url'], None)
            s2, _, b2 = http_get(base + a['url'], 'invalid-token')
            rec(f'{tag}.no_token', key, 'PASS' if s1 in REFUSED and s2 in REFUSED else 'FAIL',
                f'no token HTTP {s1}; invalid token HTTP {s2}')
            if other:
                s3, _, _ = http_get(base + a['url'], other)
                sl, dl = getj(f"/learning/topics/{topic_of[a['id']]}/assets", other)
                leaked_list = isinstance(dl, dict) and any(x.get('id') == a['id'] for x in dl.get('assets') or [])
                rec(f'{tag}.other_class', key, 'PASS' if s3 in REFUSED_OR_ABSENT and not leaked_list else 'FAIL',
                    f'other-class bytes HTTP {s3}; other-class list HTTP {sl}, includes asset: {leaked_list}')
            else:
                rec(f'{tag}.other_class', key, 'NOT_PERFORMED', 'JSS3_OTHER_CLASS_TOKEN not supplied')
    return results, table


def main(argv=None, env=None):
    env = os.environ if env is None else env
    p = argparse.ArgumentParser(description=__doc__.split('\n')[0])
    p.add_argument('--base-url', required=True)
    p.add_argument('--output', required=True, help='NEW directory for results.json (must not exist)')
    p.add_argument('--staging-confirmed', action='store_true')
    p.add_argument('--allow-app-json-host', action='store_true')
    a = p.parse_args(argv)
    try:
        base = check_base_url(a.base_url, a.staging_confirmed, a.allow_app_json_host)
    except ValueError as e:
        print(f'REFUSED: {e}', file=sys.stderr); return 3
    student = env.get('JSS3_STUDENT_TOKEN', '').strip()
    if not student:
        print('REFUSED: JSS3_STUDENT_TOKEN is required', file=sys.stderr); return 3
    out = Path(a.output)
    out.mkdir(parents=True, exist_ok=False)
    results, table = run(base, student, env.get('JSS3_OTHER_CLASS_TOKEN', '').strip() or None, load_manifests())
    counts = {s: sum(r['status'] == s for r in results) for s in ('PASS', 'FAIL', 'NOT_PERFORMED')}
    code = 1 if counts['FAIL'] else 2 if counts['NOT_PERFORMED'] else 0
    (out / 'results.json').write_text(json.dumps({
        'tool': 'scripts/jss3/device1_preflight.py', 'utc': datetime.now(timezone.utc).isoformat(timespec='seconds'),
        'base_url': base, 'counts': counts, 'exit_code': code, 'assets': table, 'results': results,
        'not_covered': ['phone observation (readability, crop, spoken description, sideways navigation, GIF motion, retry UX)',
                        'assessments.content_fingerprint column (needs database access)'],
    }, indent=2) + '\n')
    for r in results:
        if r['status'] != 'PASS': print(f"{r['status']:<14} {r['id']}: {r['detail']}")
    print(f"API preflight: {counts['PASS']} PASS, {counts['FAIL']} FAIL, {counts['NOT_PERFORMED']} NOT_PERFORMED. "
          'Device observation: NOT PERFORMED by this tool.')
    return code


if __name__ == '__main__':
    sys.exit(main())
