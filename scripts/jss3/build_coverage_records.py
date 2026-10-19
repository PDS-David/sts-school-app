#!/usr/bin/env python3
"""Generate the missing rows of CURRENT_COVERAGE.csv and WIDER_WORKSTREAMS.csv from
the supplement JSON + merged SEMANTIC_DECISIONS.csv + SEMANTIC_CLOSURE.csv (source
file/sha/line) + worker evidence. Existing rows keep file order and content (only
supplement_ids is refreshed when more supplements now cite the gap); new rows are
appended. A gap with no evidence source raises: nothing is guessed.
Status precedence: C RECORD_DELTAS row -> SEMANTIC_DECISIONS disposition (SL-nnn)
-> A OBJECTIVE_EVIDENCE (supplement-supported source lines) -> error."""
import csv, json, re, sys, collections, os

R = os.path.join(os.path.dirname(__file__), '..', '..')
D = os.path.join(R, 'docs', 'jss3')
REP = os.path.join(D, 'replacements')
BOILER = 'Implementation coverage, not independent pedagogical certification or a production import.'

def rows(p):
    with open(p, encoding='utf-8', newline='') as f:
        return list(csv.DictReader(f))

def write(p, cols, data):
    with open(p + '.tmp', 'w', encoding='utf-8', newline='') as f:
        w = csv.DictWriter(f, fieldnames=cols, lineterminator='\n')
        w.writeheader(); w.writerows(data)
    os.replace(p + '.tmp', p)

def rank(s):
    # lower = more conservative claim
    return 0 if s.startswith('OWNER_INPUT') else (1 if 'PARTIAL' in s else 2)

def sl(g):
    m = re.search(r'SL-?(\d+)', g)
    return f'SL-{int(m.group(1)):03d}' if m and re.search(r'SL-?\d+$', g) else None

POS = re.compile(r"^[\W_]*(\d+|I{1,3}|IV|V)(?:\s*(?:e|eme|\u00e8me|ere|\u00e8re)\b)?(?:\s*&\s*\d+e?)?\s*[.)\u2013:-]?\s+\S", re.I)
WEEKWORD = re.compile(r'(week|wk|ose|item)s?\s*(\d+|one|two|three|four|five|six|seven|eight|nine|ten)', re.I)

def locator(line, objective):
    """Evidence-only locator. If the scheme line itself carries no week keyword but starts
    with the school's own list number/ordinal, record that as a scheme LIST ITEM position
    (the existing convention; not a week). Otherwise leave the line text unanchored."""
    m = POS.match(objective)
    if m and not WEEKWORD.search(objective):
        n = m.group(1)
        if not n.isdigit():
            n = {'I': 1, 'II': 2, 'III': 3, 'IV': 4, 'V': 5}[n.upper()]
        return f'scheme list item {int(n)} (leading number/ordinal of the source line; source_text_line {line}): {objective}'
    return f'source_text_line {line}: {objective}'

def main():
    supp = json.load(open(os.path.join(R, 'backend/src/db/data/jss3Supplements.json'), encoding='utf-8'))
    by_gap = collections.OrderedDict()
    for s in supp:
        g = s['gapIds']; g = [g] if isinstance(g, str) else g
        for x in g:
            by_gap.setdefault(x, []).append(s['id'])
    dec = {r['candidate_id']: r for r in rows(os.path.join(REP, 'SEMANTIC_DECISIONS.csv'))}
    clo = {r['candidate_id']: r for r in rows(os.path.join(D, 'SEMANTIC_CLOSURE.csv'))}
    cdelta = {r['id']: r for r in rows(os.path.join(D, 'batch2-close/C_ENGLISH_YORUBA/RECORD_DELTAS/CURRENT_COVERAGE_ROWS.csv'))}
    aev = {e['candidate_id']: e for e in json.load(open(os.path.join(D, 'batch2-close/A_MATH_TECH_BUSINESS/OBJECTIVE_EVIDENCE.json'), encoding='utf-8'))}

    cov_p = os.path.join(REP, 'CURRENT_COVERAGE.csv'); ww_p = os.path.join(REP, 'WIDER_WORKSTREAMS.csv')
    cov = rows(cov_p); ww = rows(ww_p)
    cov_ids = {r['id'] for r in cov}; ww_ids = {r['id'] for r in ww}
    refreshed = 0
    for r in cov:
        if r['id'] in by_gap:
            want = '; '.join(by_gap[r['id']])
            if r['supplement_ids'] != want:
                r['supplement_ids'] = want; refreshed += 1

    status = {}; limit = {}; src = {}; conflicts = []
    for g, ids in by_gap.items():
        need_ww = g.startswith('WG-') and g not in ww_ids
        if g in cov_ids and not need_ww: continue
        k = sl(g)
        if g in cdelta:
            status[g] = cdelta[g]['current_status']; limit[g] = cdelta[g]['note']
            if k in dec and dec[k]['disposition'] != status[g]:
                # Two delivered records disagree: record the more conservative one.
                a, b = status[g], dec[k]['disposition']
                pick = b if rank(b) < rank(a) else a
                conflicts.append({'gap_id': g, 'candidate_id': k, 'c_coverage_row': a,
                                  'merged_decision': b, 'recorded': pick})
                if pick == b:
                    status[g] = b; limit[g] = dec[k]['limitation']
        elif k in dec:
            status[g] = dec[k]['disposition']; limit[g] = dec[k]['limitation']
        elif k in aev and aev[k]['support_kind'] == 'supplement':
            status[g] = 'REPLACEMENT_IMPLEMENTED'; limit[g] = aev[k]['limits']
        else:
            raise SystemExit(f'No evidence source for gap {g}')
        if k in clo:
            c = clo[k]; src[g] = (c['source_document'], c['source_sha256'], locator(c['source_text_line'], c['objective_text']))
        elif k in aev:
            e = aev[k]; src[g] = (e['source_document'], e['source_sha256'], f"{e['source_locator']}: {e['objective']}")

    added_cov = 0
    for g, ids in by_gap.items():
        if g in cov_ids: continue
        st = status[g]
        note = (cdelta[g]['note'] if g in cdelta else
                ('Explicitly new teaching and assessment available through --jss3-supplements. ' + BOILER
                 if st.startswith('REPLACEMENT_IMPLEMENTED') and 'PARTIAL' not in st else
                 f'Mirrors SEMANTIC_DECISIONS.csv disposition {st}; see its rationale and limitation. ' + BOILER)
                if g not in cdelta else '')
        if g not in cdelta and 'PARTIAL' in st:
            note = 'New teaching and assessment available through --jss3-supplements; partial, see SEMANTIC_DECISIONS.csv limitation. ' + BOILER
        cov.append({'id': g, 'current_status': st, 'supplement_ids': '; '.join(ids), 'note': note}); added_cov += 1

    added_ww = 0
    for g, ids in by_gap.items():
        if not g.startswith('WG-') or g in ww_ids: continue
        if g not in src: raise SystemExit(f'No source locator for {g}')
        f_, h_, loc = src[g]
        ww.append({'id': g, 'source_file': f_, 'source_sha256': h_, 'locator': loc,
                   'supplement_id': '; '.join(ids), 'status': status[g], 'limit': limit[g]})
        added_ww += 1
    cp = os.path.join(D, 'batch2-close/F_INTEGRATION/COVERAGE_STATUS_CONFLICTS.csv')
    write(cp, ['gap_id', 'candidate_id', 'c_coverage_row', 'merged_decision', 'recorded'], conflicts)
    write(cov_p, ['id', 'current_status', 'supplement_ids', 'note'], cov)
    write(ww_p, ['id', 'source_file', 'source_sha256', 'locator', 'supplement_id', 'status', 'limit'], ww)
    print(json.dumps({'coverage_added': added_cov, 'coverage_supplement_ids_refreshed': refreshed,
                      'wider_added': added_ww, 'status_conflicts': len(conflicts), 'coverage_total': len(cov), 'wider_total': len(ww)}))

if __name__ == '__main__':
    main()
