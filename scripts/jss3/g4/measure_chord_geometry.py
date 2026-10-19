#!/usr/bin/env python3
"""Measure the SL-559 chord drawing (Omega Music, Week 1 revision) from a LibreOffice PDF render.
Usage: soffice --headless --convert-to pdf MUSIC.docx ; python3 measure_chord_geometry.py MUSIC.pdf [page_index=2]
Staff lines and ovals are read in absolute page coordinates (pdfplumber). One pitch step = half a staff space."""
import sys, pdfplumber
pdf = sys.argv[1]; pg = pdfplumber.open(pdf).pages[int(sys.argv[2]) if len(sys.argv) > 2 else 2]
staff = sorted({round((l['top']+l['bottom'])/2, 2) for l in pg.lines if l['x1']-l['x0'] > 200})
assert len(staff) == 5, f'expected 5 staff lines, got {staff}'
top, step = staff[0], (staff[-1]-staff[0])/8
names = ['F5','E5','D5','C5','B4','A4','G4','F4','E4','D4','C4']
seen, ovs = set(), []
for c in pg.curves:
    if 12 < c['x1']-c['x0'] < 17 and 4.5 < c['bottom']-c['top'] < 8:
        k = (round((c['x0']+c['x1'])/2), round((c['top']+c['bottom'])/2))
        if k not in seen: seen.add(k); ovs.append(((c['x0']+c['x1'])/2, (c['top']+c['bottom'])/2))
chords = {}
for cx, cy in ovs: chords.setdefault(round(cx/100), []).append((cx, cy))
for k in sorted(chords):
    out = []
    for cx, cy in sorted(chords[k], key=lambda t: t[1]):
        p = (cy-top)/step; i = round(p)
        out.append(f"{names[i] if 0 <= i < len(names) else ('G5' if i == -1 else '?')} (off {(p-i)*step:+.2f}pt)")
    print(f'chord x~{sorted(chords[k])[0][0]:.0f}:', ' | '.join(out))
