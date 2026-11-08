#!/usr/bin/env python3
"""Recompute the SHA-256 of every line-range row in a worker's item note and compare with the recorded value.
  python3 docs/ss1/work/tester/verify-sections.py <extracted.txt> <ITEM.md>
Hash rule used by the workers: SHA-256 of the UTF-8 lines [a..b] (1-based, inclusive) joined with "\\n".
Handles table rows shaped like:  | name | 621-695 | `hash` |   and   | 25 | `hash` |  (single line).
Rows it cannot parse are listed as UNPARSED, never counted as verified."""
import sys, re, hashlib
txt, md = sys.argv[1], sys.argv[2]
L = open(txt, encoding='utf8').read().split('\n')
H = lambda a, b: hashlib.sha256('\n'.join(L[a-1:b]).encode('utf8')).hexdigest()
tot = ok = 0; bad = []; unparsed = []
for line in open(md, encoding='utf8'):
    if not line.startswith('|') or not re.search(r'`[0-9a-f]{64}`', line): continue
    cells = [c.strip() for c in line.strip().strip('|').split('|')]
    hashes = [re.fullmatch(r'`([0-9a-f]{64})`', c) for c in cells]
    hi = next((i for i, m in enumerate(hashes) if m), None)
    # Prefer an explicit a-b range; accept a bare integer only when it is the only integer cell (so a '#' or count column is never mistaken for a line).
    rng = next((re.fullmatch(r'(\d+)(?:-(\d+))?', c) for c in cells if re.fullmatch(r'\d+-\d+', c)), None)
    if rng is None:
        ints = [c for c in cells if re.fullmatch(r'\d+', c)]
        rng = re.fullmatch(r'(\d+)(?:-(\d+))?', ints[0]) if len(ints) == 1 else None
    if hi is None or rng is None: unparsed.append(cells[0][:40]); continue
    a = int(rng.group(1)); b = int(rng.group(2) or a); tot += 1
    if H(a, b) == hashes[hi].group(1): ok += 1
    else: bad.append((cells[0][:40], a, b))
print(f'rows checked {tot}, match {ok}, mismatch {len(bad)}, unparsed {len(unparsed)}')
for b in bad: print('  MISMATCH', b)
for u in unparsed[:10]: print('  UNPARSED', u)
sys.exit(1 if bad else 0)
