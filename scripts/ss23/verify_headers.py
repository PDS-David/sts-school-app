"""SS23-S1: compare each source document's own header (subject/class/term) with the filename mapping.

usage: python3 -I verify_headers.py <inventory.csv> <txt_root> <src_root> <out.csv>
  txt_root/<dir>/<basename>.txt   plain-text conversions (soffice)
  src_root/<dir>/<member path>    extracted originals (used only for .pptx)
<dir> is the first 8 hex chars of the attachment name, mapped from (class, term) below.
Header text = first 1500 characters. Result is a screen: HEADER_VERIFIED needs subject AND class
to be stated and to agree; a missing term label is recorded, never assumed.
"""
import csv, os, re, sys

inv, txt_root, src_root, out = sys.argv[1:5]
DIRS = {('SS2', '1st Term'): 'c900f36d', ('SS2', '2nd Term'): 'c3c825d1', ('SS2', '3rd Term'): '5e392735',
        ('SS3', '1st Term'): '165fa4c6', ('SS3', '2nd Term'): 'c35f4011'}
SUBJ = [('further-mathematics', r'further\s*math'), ('financial-accounting', r'financial'),
        ('bookkeeping', r'book[\s\-]*keeping'), ('catering-craft', r'catering'),
        ('food-and-nutrition', r'foods?\s*(and|&)\s*nutrition'), ('data-processing', r'data\s*processing|relational database'),
        ('a-literature-guard', r'english literature'), ('literature', r'literature'), ('english', r'english'), ('chemistry', r'\bchem'), ('physics', r'physics'),
        ('biology', r'biology'), ('civic-education', r'civic'), ('economics', r'economics|asian tigers'),
        ('geography', r'geograph'), ('french', r'french|semaine|schema du|trimestre|le scheme|schéma'),
        ('commerce', r'commerce'), ('government', r'government'), ('mathematics', r'mathematics|maths'),
        ('yoruba', r'yoruba|ilaana|ilana|ede yoruba'), ('agricultural-science', r'agric'),
        ('technical-drawing', r'technical drawing')]
TERM = [(1, r'first term|alpha|alha|1st term'), (2, r'second term|scond term|sigma|2nd term|saa keji|deuxi'),
        (3, r'third term|omega|3rd term|saa keta')]
CLS = r'(?:ss|sss|s\.s\.s?\.?|senior secondary school)\s*\.?\s*([23])\b'


def header(dirname, member):
    base = os.path.splitext(os.path.basename(member))[0]
    p = os.path.join(txt_root, dirname, base + '.txt')
    if os.path.exists(p):
        t = open(p, errors='replace').read()
    elif member.lower().endswith('.pptx'):
        from pptx import Presentation
        sp = os.path.join(src_root, dirname, member.lstrip('./'))
        t = ' '.join(sh.text_frame.text for s in list(Presentation(sp).slides)[:2] for sh in s.shapes if sh.has_text_frame)
    else:
        return None
    return re.sub(r'\s+', ' ', t)[:1500]


def first(rules, text):
    hits = [(m.start(), k) for k, rx in rules if (m := re.search(rx, text, re.I))]
    return min(hits)[1] if hits else ''


rows = list(csv.DictReader(open(inv)))
cols = list(rows[0].keys()) + ['header_subject', 'header_class', 'header_term', 'header_status', 'header_snippet']
with open(out, 'w', newline='') as f:
    w = csv.DictWriter(f, cols)
    w.writeheader()
    for r in rows:
        d = DIRS.get((r['class'], r['term']))
        h = header(d, r['archive_member']) if d else None
        if h is None:
            r.update(header_subject='', header_class='', header_term='', header_status='NO_TEXT_EXTRACTED', header_snippet='')
        else:
            m = re.search(r'subject\s*:?\s*([^:]{3,40}?)\s*(?:class|$)', h, re.I)
            subj = first(SUBJ, m.group(1) if m else h)
            if subj == 'a-literature-guard': subj = 'literature'
            cm = re.search(CLS, h, re.I)
            wm = re.search(r'(?:s\.s\.s?\.?|ss|sss)\s*(two|three)\b', h, re.I)
            cls = ('SS' + cm.group(1)) if cm else (('SS' + {'two': '2', 'three': '3'}[wm.group(1).lower()]) if wm else '')
            term = first(TERM, h)
            problems = []
            if not subj: problems.append('SUBJECT_NOT_STATED')
            elif subj != r['filename_subject']: problems.append(f'SUBJECT_MISMATCH(header={subj})')
            if not cls: problems.append('CLASS_NOT_STATED')
            elif cls != r['class']: problems.append(f'CLASS_MISMATCH(header={cls})')
            if term and str(term) != r['term'][0]: problems.append(f'TERM_MISMATCH(header={term})')
            if not term: problems.append('TERM_NOT_STATED')
            status = 'HEADER_VERIFIED' if not problems else ('HEADER_VERIFIED_TERM_NOT_STATED' if problems == ['TERM_NOT_STATED'] else 'HEADER_CHECK:' + ';'.join(problems))
            r.update(header_subject=subj, header_class=cls, header_term=term, header_status=status, header_snippet=h[:90])
        w.writerow(r)
