#!/usr/bin/env python3
"""Private, atomic, hash-bound staging; does not execute archive members."""
import argparse
import csv
import hashlib
import json
import os
from pathlib import Path, PurePosixPath
import shutil
import stat
import tempfile
import zipfile

ARCHIVE_SHA256 = '024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e'
REPO = Path(__file__).resolve().parents[2]

def digest(path):
    with path.open('rb') as f:
        return hashlib.file_digest(f, 'sha256').hexdigest()

def prepare(archive, output):
    archive, output = Path(archive).resolve(), Path(output).absolute()
    if output.exists() or output.is_symlink():
        raise ValueError('Output must be a new directory')
    if digest(archive) != ARCHIVE_SHA256:
        raise ValueError('Wrong SS1 archive hash')
    with (REPO / 'docs/ss1/IMPLEMENTATION_20261026/SOURCE_ASSIGNMENTS.csv').open(newline='') as f:
        records = list(csv.DictReader(f))
    expected = {r['archive_member']: r for r in records}
    output.parent.mkdir(parents=True, exist_ok=True)
    stage = Path(tempfile.mkdtemp(prefix='.ss1-stage-', dir=output.parent))
    os.chmod(stage, 0o700)
    try:
        with zipfile.ZipFile(archive) as z:
            names = set()
            actual = set()
            for item in z.infolist():
                p = PurePosixPath(item.filename)
                mode = item.external_attr >> 16
                if (p.is_absolute() or '..' in p.parts or '\\' in item.filename or ':' in item.filename
                        or item.filename in names or stat.S_ISLNK(mode)
                        or (stat.S_IFMT(mode) not in (0, stat.S_IFREG, stat.S_IFDIR))):
                    raise ValueError(f'Unsafe or duplicate member: {item.filename}')
                names.add(item.filename)
                if not item.is_dir():
                    actual.add(item.filename)
            if actual != set(expected):
                raise ValueError(f'Manifest membership mismatch: missing={set(expected)-actual}, extra={actual-set(expected)}')
            for name, record in expected.items():
                item = z.getinfo(name)
                if item.file_size != int(record['bytes']):
                    raise ValueError(f'Size mismatch: {name}')
                target = stage.joinpath(*PurePosixPath(name).parts)
                target.parent.mkdir(parents=True, exist_ok=True)
                with z.open(item) as src, target.open('xb') as dst:
                    shutil.copyfileobj(src, dst, length=1024*1024)
                os.chmod(target, 0o600)
                if digest(target) != record['sha256']:
                    raise ValueError(f'Hash mismatch: {name}')
        (stage / 'STAGING.json').write_text(json.dumps({'archive_sha256': ARCHIVE_SHA256, 'sources': records}, indent=2)+'\n')
        if output.exists():
            raise ValueError('Output appeared during staging')
        stage.rename(output)
        return output
    except BaseException:
        shutil.rmtree(stage, ignore_errors=True)
        raise

if __name__ == '__main__':
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('--archive', required=True, type=Path)
    p.add_argument('--output', required=True, type=Path)
    a = p.parse_args()
    print(prepare(a.archive, a.output))
