#!/usr/bin/env python3
"""Offline STAGE1 helper: prove which subject/term each JSS3 asset manifest targets and print
the exact attachTopicAssets.ts DRY-RUN commands. Touches no database, network or credentials.

Inputs: the importer's own no-database dry-run output (ingestTopics.ts without --yes, with
--jss3-supplements) and curriculum-assets/jss3. A manifest is accepted only if exactly one
(subject, term) in the planned import has the manifest's expected title at every order_index
and every referenced file exists in ONE folder with a matching sha256. Anything else exits 1.
The importer log holds lesson titles from private sources: keep it out of Git; this tool's
JSON output contains only counts, targets, paths and hashes.
"""
import argparse, csv, hashlib, json, re, sys
from pathlib import Path

LINE = re.compile(r'^  JSS 3 / (.+?) / (\dst Term|\dnd Term|\drd Term) #(\d+): (.*)$')
norm = lambda s: re.sub(r'\s+', ' ', (s or '').strip()).lower()
first = lambda r, *k: next((r[x] for x in k if r.get(x) not in (None, '')), None)


def read_plan(log: Path):
    plan = {}
    for line in log.read_text(encoding='utf8').splitlines():
        m = LINE.match(line)
        if m:
            subject, term, n, rest = m.groups()
            plan[(subject, term, int(n))] = norm(rest.split(' / ')[-1])
    return plan


def sha256(p: Path):
    return hashlib.sha256(p.read_bytes()).hexdigest()


def analyse(manifest: Path, plan, root: Path):
    with manifest.open(encoding='utf-8-sig', newline='') as fh:
        rows = list(csv.DictReader(fh))
    problems, entries = [], []
    if not rows: problems.append('manifest has no rows')
    for r in rows:
        o = first(r, 'topic_order_index', 'destination_order_index', 'order_index')
        f = first(r, 'file', 'original_file')
        h = first(r, 'sha256', 'sha256_verified')
        t = first(r, 'expected_title', 'lesson_title_per_R2_R2V')
        if o is None or f is None or h is None or not norm(t):
            problems.append('row missing order_index/file/sha256/expected_title'); continue
        try:
            index = int(o)
            if index < 1: raise ValueError()
        except ValueError:
            problems.append('invalid positive order_index'); continue
        if Path(f).is_absolute() or '..' in Path(f).parts:
            problems.append('asset path escapes folder'); continue
        entries.append((index, norm(t), f, h.lower()))
    targets = sorted({(s, tm) for (s, tm, _n) in plan
                      if all(plan.get((s, tm, o)) == t for o, t, _f, _h in entries if t)})
    if len(targets) != 1:
        problems.append(f'{len(targets)} candidate subject/term targets (need exactly 1)')
    dirs = [d for d in [manifest.parent, *sorted(p for p in manifest.parent.iterdir() if p.is_dir())]
            if all((d / f).is_file() for _o, _t, f, _h in entries)]
    asset_dir = None
    for d in dirs:
        if all(sha256(d / f) == h for _o, _t, f, h in entries):
            asset_dir = d; break
    if asset_dir is None:
        problems.append('no single folder holds every file with matching sha256')
    return {'manifest': manifest.relative_to(root).as_posix(), 'rows': len(rows),
            'target': targets[0] if len(targets) == 1 else None,
            'assets_dir': asset_dir.relative_to(root).as_posix() if asset_dir else None,
            'titled_rows': sum(1 for e in entries if e[1]), 'problems': problems}


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__.split('\n')[0])
    ap.add_argument('--importer-log', required=True, type=Path)
    ap.add_argument('--assets-root', required=True, type=Path, help='curriculum-assets/jss3')
    ap.add_argument('--class-name', default='JSS 3')
    ap.add_argument('--school-code', default='secondary')
    ap.add_argument('--json-out', type=Path)
    a = ap.parse_args(argv)
    plan = read_plan(a.importer_log)
    if not plan:
        print('No JSS 3 topic lines found in importer log', file=sys.stderr); return 1
    root = a.assets_root.resolve()
    results = [analyse(m, plan, root) for m in sorted(root.rglob('*MANIFEST*.csv'))]
    bad = [r for r in results if r['problems']]
    print(f'{len(results)} manifests, {sum(r["rows"] for r in results)} asset rows, {len(bad)} with problems')
    for r in results:
        t = r['target']
        print(f"{'FAIL' if r['problems'] else 'ok  '} {r['manifest']} rows={r['rows']} "
              f"target={'%s / %s' % t if t else None} assets={r['assets_dir']} {'; '.join(r['problems'])}")
    print('\n# Dry-run commands (run from backend/; DATABASE_URL must be the designated staging DB). '
          'Apply only after review by repeating with --apply.')
    for r in results:
        if r['problems']:
            continue
        subj, term = r['target']
        print(f'node --import tsx src/db/attachTopicAssets.ts --manifest ../curriculum-assets/jss3/{r["manifest"]} '
              f'--assets ../curriculum-assets/jss3/{r["assets_dir"]} --subject "{subj}" '
              f'--class-name "{a.class_name}" --term-label "{term}" --school-code {a.school_code} --dry-run')
    if a.json_out:
        a.json_out.write_text(json.dumps({'plan_topic_lines': len(plan), 'manifests': results}, indent=1,
                                         default=list) + '\n', encoding='utf8')
    return 1 if bad else 0


if __name__ == '__main__':
    sys.exit(main())
