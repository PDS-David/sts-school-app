from pkg import *
import re
def hdr(sid, start='SUBJECT'):
    t = TEXT(sid); m = re.search(start + r'[^\n]*', t); h = m.group(0).rstrip(); once(t, h, sid + ' header'); return h
APPROVAL_PENDING = 'PENDING-OWNER: heading observed in the source document; subject also fixed by SOURCE_ASSIGNMENTS.csv filename assignment; owner confirmation not yet recorded'
def rid(sid, i): return ROWS[sid][i]['id']
def gather(sup_list, sid, slug_unused=None):
    return [(l, i) for (l, i) in sup_list]
def corr_for(sid, lessons_with_idx, why_by_idx, loc_prefix):
    out = []
    for l, i in lessons_with_idx:
        r = ROWS[sid][i]
        out.append(correction(f"CORR-{l['id'][len('SUP-SS1-'):]}", sid, REG[sid]['sha256'], r['id'], r['body_sha256'], l['id'], why_by_idx[i],
            f"{loc_prefix}; parsed row {i} (\"{r['title'][:60]}\")", "Original row text is retained unchanged in provenance; the replacement is delivered instead (runtime wiring by SS1-08)."))
    return out
