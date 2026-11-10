#!/usr/bin/env python3
"""Invoke the real importer/parser; emit a private SS1 plan. Never passes --yes."""
import argparse
import os
from pathlib import Path
import subprocess

if __name__ == '__main__':
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('--root', required=True, type=Path)
    p.add_argument('--output', required=True, type=Path)
    p.add_argument('--subject-slug', help='Compile only one registered SS1 subject package')
    a = p.parse_args()
    if a.output.exists():
        raise SystemExit('Use a new output path; private plans are never overwritten')
    repo = Path(__file__).resolve().parents[2]
    env = {k:v for k,v in os.environ.items() if not k.startswith('PG') and 'DATABASE_URL' not in k}
    command = ['node', '--import', 'tsx', 'backend/src/db/ingestTopics.ts', '--root', str(a.root.resolve()), '--school-code', 'secondary', '--ss1-reviewed', '--ss1-plan', str(a.output.absolute())]
    if a.subject_slug:
        command += ['--ss1-subject-slug', a.subject_slug]
    result = subprocess.run(command, cwd=repo, env=env)
    raise SystemExit(result.returncode)
