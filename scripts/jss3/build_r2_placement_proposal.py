#!/usr/bin/env python3
"""R2 placement proposal builder (deterministic).

Reads, from Git:   docs/jss3/completion/S_PREP/PLACEMENT_PROPOSAL.csv  (bucket counts, S-PREP anchors)
                   docs/jss3/completion/R2_SEQUENCING/R2_RELATION_DECISIONS.csv  (reviewed relations)
                   backend/src/db/data/jss3Supplements.json
Reads, from the PRIVATE archive (never copied into Git):
                   portable_verification/capture/original-rows.json
Writes:            PLACEMENT_PROPOSAL_R2.csv, BUCKET_ASSESSMENT_ROWS.csv  (titles + 12-hex source hashes only)

  python3 scripts/jss3/build_r2_placement_proposal.py --archive /path/JSS3_NEXT_STAGE_INPUTS_20261016.zip
  python3 scripts/jss3/build_r2_placement_proposal.py --check          # no archive: validates committed files

Nothing here approves a placement. Every row has owner_approval_status NOT_APPROVED.
"""
import argparse, collections, csv, hashlib, json, re, sys, unicodedata, zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'docs/jss3/completion/R2_SEQUENCING'
SPREP = ROOT / 'docs/jss3/completion/S_PREP/PLACEMENT_PROPOSAL.csv'
DECISIONS = OUT / 'R2_RELATION_DECISIONS.csv'
SUPPS = ROOT / 'backend/src/db/data/jss3Supplements.json'
ARCHIVE_SHA256 = '0a5b0d929e1dc61801cde43f8a85235d2e236ced334d2091583f5fa16524ea3c'
CAPTURE_MEMBER = 'JSS3_NEXT_STAGE_INPUTS/portable_verification/capture/original-rows.json'
TIERS = {'TOPIC_MATCH', 'PARTIAL_MATCH', 'STRAND_ONLY', 'NO_ORIGINAL_MATCH'}
ASSESS_RE = re.compile(r'revision|\bexam(?:ination)?s?\b|\bexamen\b|review|recapitulation', re.I)

COLS = ['supplement_id', 'class_name', 'subject', 'term', 'title', 'current_order_index',
        'current_original_count', 'current_supplement_count', 'relation_tier',
        'related_original_indices', 'related_original_titles', 'related_original_source_sha256_12',
        'range_low', 'range_high', 'proposed_after_original_index', 'confidence', 'evidence_basis',
        'body_overlap_top3', 'overlap_supports_relation', 'evidence_note', 'sprep_proposed_after',
        'change_vs_sprep', 'revision_or_exam_rows_in_bucket', 'timetable_status',
        'verified_against_private_archive', 'owner_approval_status', 'approved_after_original_index',
        'approved_by', 'approved_at']


def norm(s):
    return unicodedata.normalize('NFD', s.lower()).encode('ascii', 'ignore').decode()


def toks(s):
    return set(re.findall(r'[a-z]{5,}', norm(s)))


def sha256_file(p):
    h = hashlib.sha256()
    with open(p, 'rb') as f:
        for b in iter(lambda: f.read(1 << 20), b''):
            h.update(b)
    return h.hexdigest()


def load_decisions(supp_ids):
    rows = list(csv.DictReader(open(DECISIONS, encoding='utf-8')))
    ids = [r['supplement_id'] for r in rows]
    assert len(ids) == len(set(ids)), 'duplicate decision ids'
    assert set(ids) == supp_ids, 'decision ids differ from jss3Supplements.json: %s / %s' % (
        sorted(supp_ids - set(ids))[:5], sorted(set(ids) - supp_ids)[:5])
    return {r['supplement_id']: r for r in rows}


def validate_decision(d, count):
    t = d['relation_tier']
    assert t in TIERS, (d['supplement_id'], t)
    rel, k = d['related_originals'], d['proposed_after_original_index']
    if t in ('TOPIC_MATCH', 'PARTIAL_MATCH'):
        idx = [int(x) for x in rel.split(';')]
        assert idx == sorted(set(idx)) and 1 <= idx[0] and idx[-1] <= count, (d['supplement_id'], rel)
        assert k and int(k) == idx[-1], (d['supplement_id'], 'k must equal last related original')
        assert d['confidence'] in ('HIGH', 'MEDIUM', 'LOW'), d['supplement_id']
    elif t == 'STRAND_ONLY':
        lo, hi = [int(x) for x in rel.split('-')]
        assert 1 <= lo <= hi <= count and not k and d['confidence'] == 'NONE', d['supplement_id']
    else:
        assert not rel and not k and d['confidence'] == 'NONE', d['supplement_id']


def build(archive):
    got = sha256_file(archive)
    if got != ARCHIVE_SHA256:
        sys.exit('archive SHA-256 mismatch: %s' % got)
    with zipfile.ZipFile(archive) as z:
        originals = json.loads(z.read(CAPTURE_MEMBER).decode('utf-8'))
    assert len(originals) == 313, len(originals)
    supps = {s['id']: s for s in json.load(open(SUPPS, encoding='utf-8'))}
    assert len(supps) == 170
    dec = load_decisions(set(supps))
    sprep = {r['supplement_id']: r for r in csv.DictReader(open(SPREP, encoding='utf-8'))}
    assert set(sprep) == set(supps)

    buckets = collections.defaultdict(list)
    for r in originals:
        buckets[(r['termLabel'], r['subjectName'])].append(r)
    for rows in buckets.values():  # order_index equals list position within the bucket
        assert [int(r['orderIndex']) for r in rows] == list(range(1, len(rows) + 1))
    counts = {k: len(v) for k, v in buckets.items()}
    assert sum(counts.values()) == 313

    assess_rows = []
    assess_by_bucket = {}
    for (term, subj), rows in sorted(buckets.items()):
        hits = [(i, r['title'].strip()) for i, r in enumerate(rows, 1) if ASSESS_RE.search(r['title'])]
        assess_by_bucket[(term, subj)] = hits
        for i, t in hits:
            assess_rows.append([term, subj, i, t, 'EXAMINATION' if re.search(r'\bexam', t, re.I) else 'REVISION_OR_REVIEW'])

    out = []
    for sid, s in supps.items():
        p = sprep[sid]
        key = (p['term'], p['subject'])
        rows = buckets[key]
        n = len(rows)
        assert n == int(p['current_original_count']), (sid, n, p['current_original_count'])
        d = dec[sid]
        validate_decision(d, n)
        tier, rel = d['relation_tier'], d['related_originals']
        titles = shas = ''
        lo = hi = ''
        related = []
        if tier in ('TOPIC_MATCH', 'PARTIAL_MATCH'):
            related = [int(x) for x in rel.split(';')]
        elif tier == 'STRAND_ONLY':
            lo, hi = rel.split('-')
            related = list(range(int(lo), int(hi) + 1))
        if tier in ('TOPIC_MATCH', 'PARTIAL_MATCH'):
            titles = ' | '.join(rows[i - 1]['title'].strip()[:80] for i in related)
            shas = ';'.join(hashlib.sha256(rows[i - 1]['sourceReference'].encode('utf-8')).hexdigest()[:12] for i in related)
        # deterministic keyword-overlap evidence (same algorithm for every row)
        ot = [toks(r['title'] + ' ' + r['sourceReference']) for r in rows]
        df = collections.Counter(w for t in ot for w in t)
        st = toks(s['title'] + ' ' + s['body'][:600])
        sc = sorted(((sum(1.0 / df[w] for w in st & t if df[w] <= 2), i + 1) for i, t in enumerate(ot)), reverse=True)
        top3 = [i for v, i in sc[:3] if v > 0]
        supports = 'YES' if related and set(top3) & set(related) else ('NO' if related else '')
        k = d['proposed_after_original_index']
        sp = p['proposed_after_original_index'] if p['proposed_status'] == 'PROPOSED' else ''
        if k and sp:
            chg = 'SAME' if k == sp else 'CHANGED %s->%s' % (sp, k)
        elif k:
            chg = 'NEW'
        elif sp:
            chg = 'DROPPED (S-PREP proposed %s)' % sp
        else:
            chg = 'STILL_UNRESOLVED'
        ah = ';'.join('%d:%s' % (i, t[:40]) for i, t in assess_by_bucket[key])
        out.append([sid, p['class_name'], p['subject'], p['term'], s['title'], p['current_order_index'], n,
                    p['current_supplement_count'], tier, rel if tier in ('TOPIC_MATCH', 'PARTIAL_MATCH') else '',
                    titles, shas, lo, hi, k, d['confidence'],
                    ';'.join([t for t in d['evidence_basis'].split(';') if t] + (['OVERLAP'] if supports == 'YES' else [])),
                    ';'.join(map(str, top3)), supports, d['note'], sp, chg, ah,
                    'PROPOSED' if k else 'UNRESOLVED', 'YES', 'NOT_APPROVED', '', '', ''])
    termo = {'1st Term': 1, '2nd Term': 2}
    out.sort(key=lambda r: (termo[r[3]], r[2], int(r[5])))
    OUT.mkdir(parents=True, exist_ok=True)
    with open(OUT / 'PLACEMENT_PROPOSAL_R2.csv', 'w', newline='', encoding='utf-8') as f:
        w = csv.writer(f, lineterminator='\n'); w.writerow(COLS); w.writerows(out)
    with open(OUT / 'BUCKET_ASSESSMENT_ROWS.csv', 'w', newline='', encoding='utf-8') as f:
        w = csv.writer(f, lineterminator='\n')
        w.writerow(['term', 'subject', 'original_index', 'title', 'kind']); w.writerows(assess_rows)
    summarize(out)


def summarize(rows):
    c = collections.Counter((r[COLS.index('timetable_status')], r[COLS.index('confidence')]) for r in rows)
    t = collections.Counter(r[COLS.index('relation_tier')] for r in rows)
    ch = collections.Counter(r[COLS.index('change_vs_sprep')].split(' ')[0] for r in rows)
    sup = collections.Counter(r[COLS.index('overlap_supports_relation')] for r in rows)
    print(len(rows), 'rows;', dict(c)); print('tiers', dict(t)); print('vs S-PREP', dict(ch)); print('overlap supports', dict(sup))


def check():
    supps = {s['id'] for s in json.load(open(SUPPS, encoding='utf-8'))}
    dec = load_decisions(supps)
    rows = list(csv.DictReader(open(OUT / 'PLACEMENT_PROPOSAL_R2.csv', encoding='utf-8')))
    assert [list(r.keys()) for r in rows[:1]] == [COLS], 'column drift'
    assert {r['supplement_id'] for r in rows} == supps and len(rows) == 170
    for r in rows:
        n = int(r['current_original_count'])
        d = dec[r['supplement_id']]
        validate_decision(d, n)
        assert r['proposed_after_original_index'] == d['proposed_after_original_index']
        assert r['owner_approval_status'] == 'NOT_APPROVED' and not r['approved_after_original_index']
        assert (r['timetable_status'] == 'PROPOSED') == bool(r['proposed_after_original_index'])
    per = collections.defaultdict(list)
    for r in rows:
        per[(r['term'], r['subject'])].append(int(r['current_order_index']))
    for key, v in per.items():
        n = int(next(r for r in rows if (r['term'], r['subject']) == key)['current_original_count'])
        assert sorted(v) == list(range(n + 1, n + len(v) + 1)), key
    summarize([[r[c] for c in COLS] for r in rows])
    print('R2 CHECK OK')


if __name__ == '__main__':
    ap = argparse.ArgumentParser()
    ap.add_argument('--archive'); ap.add_argument('--check', action='store_true')
    a = ap.parse_args()
    if a.check:
        check()
    elif a.archive:
        build(a.archive)
    else:
        ap.error('give --archive ZIP or --check')
