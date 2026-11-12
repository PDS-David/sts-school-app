#!/usr/bin/env python3
"""Extract faithful Technical Drawing source figures and register them in the SS1 package.

Raster PNG/JPEG parts are copied byte-for-byte. WMF previews are rendered through
LibreOffice Draw and cropped to their drawing bounds with Inkscape. Two documented
cross-row repeats reuse the existing Week Three triangle derivative.
"""
from __future__ import annotations
import argparse, hashlib, json, re, subprocess, tempfile, zipfile
from pathlib import Path

ARCHIVE_SHA256 = '024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e'
SOURCE_ID = 'SS1-SRC-af4868d2c026'
ARCHIVE_MEMBER = 'SSS 1/2nd Term SS1_/2ND TERM S1 TECHNICAL DRAWING.docx'
SOURCE_MEMBER_SHA256 = '69198ac66432c31717d084b8a736741065119b14b1622c2f494c8575294e095d'
LESSON_IDS = {
    'W01': 'SUP-SS1-TECHNICAL-DRAWING-T2-W01-KEYED-CONSTRUCTIONS',
    'W02': 'SUP-SS1-TECHNICAL-DRAWING-T2-W02-KEYED-CONSTRUCTIONS',
    'W03': 'SUP-SS1-TECHNICAL-DRAWING-T2-W03-POLYGON-CONSTRUCTIONS',
    'W04': 'SUP-SS1-TECHNICAL-DRAWING-T2-W04-PLAIN-SCALES',
    'W05': 'SUP-SS1-TECHNICAL-DRAWING-T2-W05-DIAGONAL-CHORDAL-SCALES',
    'W06': 'SUP-SS1-TECHNICAL-DRAWING-T2-W06-ENLARGEMENT',
    'W07': 'SUP-SS1-TECHNICAL-DRAWING-T2-W07-REDUCTION',
    'W08-W09': 'SUP-SS1-TECHNICAL-DRAWING-T2-W08-W09-EQUAL-AREA',
    'W10': 'SUP-SS1-TECHNICAL-DRAWING-T2-W10-TANGENCY'
}
TASK_PREFIX_WEEK = {
    'TD-ASSET-W01': 'W01', 'TD-ASSET-W02': 'W02', 'TD-ASSET-W03': 'W03',
    'TD-ASSET-W04': 'W04', 'TD-ASSET-W05': 'W05', 'TD-ASSET-W08-W09': 'W08-W09',
    'TD-ASSET-W10': 'W10'
}
W06_W07_WEEK_BY_FIGURE = {
    1: 'W07', 2: 'W07', 3: 'W07', 4: 'W06', 5: 'W06',
    6: 'W07', 7: 'W06', 8: 'W06', 9: 'W06', 10: 'W06', 11: 'W07', 12: 'W07'
}
REUSE_MEDIA = {'TD-ASSET-W06-W07-F12', 'TD-ASSET-W08-W09-F20'}
REUSE_TARGET_TASK = 'TD-ASSET-W03-F13'

def sha(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()

def convert_wmf(media_name: str, data: bytes, temp_root: Path) -> bytes:
    src_dir = temp_root / 'wmf-in'
    svg_dir = temp_root / 'wmf-svg'
    png_dir = temp_root / 'wmf-png'
    profile = temp_root / 'lo-profile'
    for directory in (src_dir, svg_dir, png_dir, profile):
        directory.mkdir(parents=True, exist_ok=True)
    src = src_dir / media_name
    src.write_bytes(data)
    proc = subprocess.run([
        'soffice', '--headless', f'-env:UserInstallation={profile.resolve().as_uri()}',
        '--convert-to', 'svg', '--outdir', str(svg_dir), str(src)
    ], capture_output=True, text=True)
    svg = svg_dir / (Path(media_name).stem + '.svg')
    if proc.returncode or not svg.exists():
        raise RuntimeError(f'LibreOffice WMF conversion failed for {media_name}: {proc.stdout}\n{proc.stderr}')
    out = png_dir / (Path(media_name).stem + '.png')
    proc = subprocess.run([
        'inkscape', str(svg), '--export-area-drawing', '--export-width=2400',
        f'--export-filename={out}'
    ], capture_output=True, text=True)
    if proc.returncode or not out.exists():
        raise RuntimeError(f'Inkscape WMF crop failed for {media_name}: {proc.stdout}\n{proc.stderr}')
    return out.read_bytes()

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--archive', required=True, type=Path)
    ap.add_argument('--package', required=True, type=Path)
    ap.add_argument('--queue', required=True, type=Path)
    ap.add_argument('--repo-root', required=True, type=Path)
    ap.add_argument('--manifest', type=Path)
    args = ap.parse_args()
    if sha(args.archive.read_bytes()) != ARCHIVE_SHA256:
        raise SystemExit('SS1 source archive SHA-256 mismatch')
    with zipfile.ZipFile(args.archive) as archive:
        docx_bytes = archive.read(ARCHIVE_MEMBER)
    if sha(docx_bytes) != SOURCE_MEMBER_SHA256:
        raise SystemExit('Technical Drawing DOCX member SHA-256 mismatch')
    with zipfile.ZipFile(__import__('io').BytesIO(docx_bytes)) as docx:
        media_members = {Path(name).name: name for name in docx.namelist() if name.startswith('word/media/')}
        media_bytes = {name: docx.read(member) for name, member in media_members.items()}
    package = json.loads(args.package.read_text(encoding='utf-8'))
    queue = json.loads(args.queue.read_text(encoding='utf-8'))
    lesson_ids = {lesson['id'] for lesson in package['lessons']}
    for lesson_id in LESSON_IDS.values():
        if lesson_id not in lesson_ids:
            raise SystemExit(f'Missing target lesson: {lesson_id}')
    tasks = [item for item in queue['items'] if item['id'].startswith('TD-ASSET-')]
    if len(tasks) != 104:
        raise SystemExit(f'Expected 104 bounded figure tasks, found {len(tasks)}')
    source_dir = args.repo_root / 'backend/src/db/ss1/assets/technical-drawing/source'
    source_dir.mkdir(parents=True, exist_ok=True)
    for file in source_dir.glob('image*'):
        if file.is_file():
            file.unlink()
    package['assets'] = [asset for asset in package.get('assets', []) if not asset.get('id', '').startswith('TD-ASSET-')]
    manifest_rows = []
    for task in tasks:
        task_id = task['id']
        combined = task.get('implementation_reference', '') + ' ' + task.get('objective', '')
        match = re.search(r'word/media/(image\d+\.(?:png|jpeg|jpg|wmf))', combined, re.I)
        if not match:
            raise SystemExit(f'No exact source media locator for {task_id}')
        media_name = match.group(1)
        original = media_bytes.get(media_name)
        if original is None:
            raise SystemExit(f'Missing source media member {media_name} for {task_id}')
        expected_match = re.search(r'(?:SHA-256|sha256)[: ]+([0-9a-f]{64})', combined, re.I)
        if not expected_match:
            raise SystemExit(f'No recorded original media hash for {task_id}')
        original_sha = sha(original)
        if original_sha != expected_match.group(1):
            raise SystemExit(f'Original media hash mismatch for {task_id}: {original_sha} != {expected_match.group(1)}')
        prefix = task_id.rsplit('-F', 1)[0]
        figure_number = int(task_id.rsplit('-F', 1)[1])
        week_code = W06_W07_WEEK_BY_FIGURE[figure_number] if prefix == 'TD-ASSET-W06-W07' else TASK_PREFIX_WEEK.get(prefix)
        if not week_code:
            raise SystemExit(f'No week mapping for {task_id}')
        lesson_id = LESSON_IDS[week_code]
        reuse = task_id in REUSE_MEDIA
        if reuse:
            target_task = next((item for item in tasks if item['id'] == REUSE_TARGET_TASK), None)
            target_match = re.search(r'word/media/(image\d+\.(?:png|jpeg|jpg))', target_task.get('implementation_reference', '') + ' ' + target_task.get('objective', '')) if target_task else None
            if not target_match:
                raise SystemExit('Week Three reuse target is missing its media locator')
            target_name = target_match.group(1)
            output_bytes = media_bytes[target_name]
            out_name = target_name
            media_ext = Path(target_name).suffix.lower()
            media_type = 'image/jpeg' if media_ext in ('.jpg', '.jpeg') else 'image/png'
            conversion = f'reused {target_name} byte-for-byte; source figure {media_name} visually reconciled in TD-VIS-W06-W07.md / TD-VIS-W08-W09.md'
        elif Path(media_name).suffix.lower() == '.wmf':
            with tempfile.TemporaryDirectory(prefix='td-wmf-') as temp:
                output_bytes = convert_wmf(media_name, original, Path(temp))
            out_name = Path(media_name).stem + '.png'
            media_type = 'image/png'
            conversion = 'LibreOffice Draw WMF-to-SVG then Inkscape drawing-area PNG render at 2400px width'
        else:
            output_bytes = original
            out_name = media_name
            media_ext = Path(media_name).suffix.lower()
            media_type = 'image/jpeg' if media_ext in ('.jpg', '.jpeg') else 'image/png'
            conversion = 'original embedded raster copied byte-for-byte'
        output_sha = sha(output_bytes)
        output_path = source_dir / out_name
        if not output_path.exists() or sha(output_path.read_bytes()) != output_sha:
            output_path.write_bytes(output_bytes)
        relpath = output_path.relative_to(args.repo_root).as_posix()
        description = task.get('objective', '').split(':', 1)[-1].split(' Preserve ', 1)[0].split(' Do not ', 1)[0].strip().rstrip('.')
        locator = f'{SOURCE_ID}; {ARCHIVE_MEMBER}; original part word/media/{media_name}; original SHA-256 {original_sha}; {task.get("implementation_reference", "").strip()}; {conversion}'
        package['assets'].append({
            'id': task_id, 'lesson_id': lesson_id, 'path': relpath,
            'sha256': output_sha, 'bytes': len(output_bytes), 'media_type': media_type,
            'alt': (description or f'Original source drawing {media_name} for Technical Drawing {week_code}.')[:500],
            'order': figure_number, 'source_locator': locator,
            'provenance': {
                'title': 'Original embedded Technical Drawing source figure',
                'locator': locator,
                'rights': 'Original figure from the user-supplied SS1 Technical Drawing source archive. Reuse/redistribution approval remains pending.',
                'reuse_status': 'PENDING',
                'attribution': 'User-supplied SS1 Technical Drawing, Second Term source DOCX.'
            },
            'state': {
                'content_approval': 'PENDING', 'approval_reference': None,
                'implementation': 'IMPLEMENTED', 'verification': 'DEFERRED', 'verification_reference': None
            }
        })
        task['status'] = 'IMPLEMENTED_TESTING_DEFERRED'
        task['implementation_reference'] = f'Committed {relpath}; original source part word/media/{media_name}; original SHA-256 {original_sha}; derivative SHA-256 {output_sha}; {len(output_bytes)} bytes; {conversion}. Visual review and student rendering remain deferred; source reuse approval remains pending.'
        manifest_rows.append({
            'task_id': task_id, 'lesson_id': lesson_id, 'source_media': media_name,
            'source_sha256': original_sha, 'path': relpath, 'sha256': output_sha,
            'bytes': len(output_bytes), 'media_type': media_type, 'conversion': conversion
        })
    queue['status_counts'] = {}
    for item in queue['items']:
        queue['status_counts'][item['status']] = queue['status_counts'].get(item['status'], 0) + 1
    note = 'Source figure extraction: 104 bounded TD-ASSET tasks registered against the original archive. PNG/JPEG parts copied byte-for-byte; 16 WMF previews rendered to cropped 2400px PNG; two cross-row duplicates reuse the Week Three triangle source asset. Figure verification and reuse rights approval remain deferred/pending.'
    queue.setdefault('notes', [])
    if note not in queue['notes']:
        queue['notes'].append(note)
    args.package.write_text(json.dumps(package, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    args.queue.write_text(json.dumps(queue, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    manifest = {
        'source_id': SOURCE_ID, 'archive_sha256': ARCHIVE_SHA256, 'member_sha256': SOURCE_MEMBER_SHA256,
        'source_figure_tasks': len(tasks), 'registered_asset_bindings': len(manifest_rows),
        'unique_output_files': len({item['path'] for item in manifest_rows}),
        'wmf_conversions': sum('WMF-to-SVG' in item['conversion'] for item in manifest_rows),
        'cross_row_reuses': sum('reused ' in item['conversion'] for item in manifest_rows),
        'assets': manifest_rows
    }
    manifest_path = args.manifest or (args.repo_root / 'docs/ss1/work/microtasks/technical-drawing/TD-SOURCE-ASSET-MANIFEST.json')
    manifest_path.parent.mkdir(parents=True, exist_ok=True)
    manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(json.dumps({key: value for key, value in manifest.items() if key != 'assets'}, indent=2))

if __name__ == '__main__':
    main()
