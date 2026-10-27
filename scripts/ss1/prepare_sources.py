#!/usr/bin/env python3
"""SS1 source staging: build a private, hash-bound extraction of the 61 SS1 source documents.

    python3 scripts/ss1/prepare_sources.py --archive PATH [--archive PATH ...] --output NEW_DIR [--allow-partial]

What it does (and nothing more):
  * reads one or more ZIP archives (the authoritative composite `SSS 1-20260507T072431Z-3-001.zip`, or the separate
    per-term ZIPs exported from it) WITHOUT executing, converting, re-encoding or renaming any document;
  * matches every .doc/.docx/.docm member to backend/src/db/ss1/data/sourceManifest.json by SHA-256 of its bytes
    (a filename is never evidence) and writes it to the manifest's canonical path under NEW_DIR;
  * refuses unsafe archives: absolute/`..`/backslash/drive member names, symlink entries, oversized members;
    destination paths come only from the manifest, never from an archive member name, so traversal is impossible;
  * never opens nested archives, never runs macros/scripts, never writes inside the git repository;
  * writes STAGING_REPORT.json + SOURCE_INVENTORY.csv (hash, size, status) next to the extraction.

Exit codes: 0 = all 61 manifest sources staged; 3 = INCOMPLETE (some manifest sources missing or present with
different bytes; only with --allow-partial are the matching files written); 2 = unsafe input / usage error.
Private output only: keep NEW_DIR out of Git. This script is NOT a curriculum audit.
"""
import argparse, csv, hashlib, json, os, stat, sys, zipfile
from pathlib import Path, PurePosixPath

REPO = Path(__file__).resolve().parents[2]
MANIFEST = REPO / 'backend/src/db/ss1/data/sourceManifest.json'
DOC_RE = ('.doc', '.docx', '.docm')
MAX_MEMBER = 512 * 1024 * 1024
MAX_TOTAL = 2 * 1024 * 1024 * 1024
BLOCKED_MEMBER_PREFIXES = ('__MACOSX/',)


class Unsafe(Exception):
    pass


def sha256_file(path):
    h = hashlib.sha256()
    with open(path, 'rb') as f:
        for chunk in iter(lambda: f.read(1 << 20), b''):
            h.update(chunk)
    return h.hexdigest()


def check_member_name(name):
    if not name or '\\' in name or name.startswith('/') or (len(name) > 1 and name[1] == ':'):
        raise Unsafe(f'unsafe member name: {name!r}')
    parts = PurePosixPath(name).parts
    if any(p == '..' for p in parts):
        raise Unsafe(f'path traversal member name: {name!r}')


def is_symlink(info):
    return stat.S_ISLNK(info.external_attr >> 16)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--archive', action='append', required=True, type=Path)
    ap.add_argument('--output', required=True, type=Path, help='NEW or empty directory outside the git repository')
    ap.add_argument('--manifest', type=Path, default=MANIFEST)
    ap.add_argument('--allow-partial', action='store_true', help='write the hash-matching files even when some manifest sources are missing/different')
    a = ap.parse_args()

    manifest = json.loads(a.manifest.read_text(encoding='utf-8'))
    by_sha = {s['sha256']: s for s in manifest['sources']}
    authoritative = manifest['authoritative_archive']['sha256']
    out = a.output.resolve()
    if REPO == out or REPO in out.parents:
        print('REFUSED: --output must be outside the git repository (source bytes never go into Git).', file=sys.stderr)
        return 2
    if out.exists() and any(out.iterdir()):
        print('REFUSED: --output must be a new or empty directory.', file=sys.stderr)
        return 2

    matched = {}        # source_id -> (data, member, archive)
    unmatched = []      # members whose bytes are not in the manifest
    ignored = []
    archives = []
    total = 0
    try:
        for arch in a.archive:
            arch = arch.resolve()
            if not arch.is_file() or arch.is_symlink():
                raise Unsafe(f'archive is not a regular file: {arch}')
            digest = sha256_file(arch)
            archives.append({'path': arch.name, 'sha256': digest, 'authoritative_composite': digest == authoritative})
            with zipfile.ZipFile(arch) as z:
                for info in z.infolist():
                    if info.is_dir():
                        continue
                    check_member_name(info.filename)
                    if is_symlink(info):
                        raise Unsafe(f'symlink member refused: {info.filename!r}')
                    if info.filename.startswith(BLOCKED_MEMBER_PREFIXES) or os.path.basename(info.filename).startswith('~$'):
                        ignored.append({'member': info.filename, 'archive': arch.name, 'reason': 'lock/metadata file'})
                        continue
                    if not info.filename.lower().endswith(DOC_RE):
                        ignored.append({'member': info.filename, 'archive': arch.name, 'reason': 'not a .doc/.docx/.docm document (never opened)'})
                        continue
                    if info.file_size > MAX_MEMBER:
                        raise Unsafe(f'member too large: {info.filename!r} ({info.file_size} bytes)')
                    total += info.file_size
                    if total > MAX_TOTAL:
                        raise Unsafe('archive set exceeds the total size limit')
                    data = z.read(info)
                    h = hashlib.sha256(data).hexdigest()
                    src = by_sha.get(h)
                    if src is None:
                        unmatched.append({'member': info.filename, 'archive': arch.name, 'bytes': len(data), 'sha256': h})
                    elif src['source_id'] in matched:
                        ignored.append({'member': info.filename, 'archive': arch.name, 'reason': f"exact byte copy of already staged {src['source_id']}"})
                    else:
                        matched[src['source_id']] = (data, info.filename, arch.name)
    except (Unsafe, zipfile.BadZipFile, OSError) as e:
        print(f'REFUSED: {e}', file=sys.stderr)
        return 2

    missing = [s for s in manifest['sources'] if s['source_id'] not in matched]
    complete = not missing and not unmatched
    report = {
        'tool': 'scripts/ss1/prepare_sources.py',
        'status': 'COMPLETE' if complete else 'INCOMPLETE',
        'archives': archives,
        'authoritative_composite_supplied': any(x['authoritative_composite'] for x in archives),
        'manifest_sources': len(manifest['sources']),
        'staged': len(matched) if (complete or a.allow_partial) else 0,
        'matched_by_hash': len(matched),
        'missing_from_archives': [{'source_id': s['source_id'], 'archive_member': s['archive_member'], 'sha256': s['sha256']} for s in missing],
        'present_with_different_bytes': unmatched,
        'ignored': ignored,
        'note': ('The separate per-term ZIPs are NOT the authoritative composite unless their member bytes match the manifest hashes; '
                 'members listed under present_with_different_bytes must be re-supplied from SSS 1-20260507T072431Z-3-001.zip.'),
    }
    if not complete and not a.allow_partial:
        print(json.dumps({k: report[k] for k in ('status', 'matched_by_hash', 'manifest_sources')}, indent=2))
        print(f'INCOMPLETE: {len(missing)} manifest source(s) missing, {len(unmatched)} member(s) with different bytes. Nothing written. '
              'Re-run with --allow-partial to stage only the hash-matching files.', file=sys.stderr)
        return 3

    out.mkdir(parents=True, exist_ok=True, mode=0o700)
    os.chmod(out, 0o700)
    rows = []
    for s in manifest['sources']:
        if s['source_id'] in matched:
            data, member, arch = matched[s['source_id']]
            dest = (out / PurePosixPath(s['archive_member'])).resolve()
            if out not in dest.parents:  # defence in depth: manifest paths are trusted, still verify containment
                print(f"REFUSED: manifest path escapes output: {s['archive_member']!r}", file=sys.stderr)
                return 2
            dest.parent.mkdir(parents=True, exist_ok=True, mode=0o700)
            dest.write_bytes(data)
            os.chmod(dest, 0o600)
            status = 'STAGED'
        else:
            status = 'MISSING'
        rows.append({'source_id': s['source_id'], 'archive_member': s['archive_member'], 'sha256': s['sha256'], 'bytes': s['bytes'], 'status': status})
    with open(out / 'SOURCE_INVENTORY.csv', 'w', newline='', encoding='utf-8') as f:
        w = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
        w.writeheader()
        w.writerows(rows)
    (out / 'STAGING_REPORT.json').write_text(json.dumps(report, indent=2) + '\n', encoding='utf-8')
    print(json.dumps({k: report[k] for k in ('status', 'staged', 'manifest_sources')}, indent=2))
    print(f'Staged under {out}. Use --root {out}/"SSS 1" with ingestTopics.ts (the folder name must keep "SS"/"SSS 1" so the class is recognised).')
    return 0 if complete else 3


if __name__ == '__main__':
    sys.exit(main())
