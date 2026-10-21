#!/usr/bin/env python3
"""MATH3: inventory every superscript/subscript run in the First-Term Mathematics rows BINARY NUMBERS and
APLLICATION OF BINARY NUMBERS, one CSV row per paragraph that holds one, with an independent value check and a
disposition (faithfully delivered / source ambiguity / source error / delivery formatting loss) and the place the
learner receives the correct teaching.
Usage: math3_binary_inventory.py "<.../JSS3 1ST TERM /JSS 3 MATHEMATICS.docx>" OUT.csv
Paragraph index = 0-based position over every w:p in word/document.xml (lxml iter, same convention as the M1/M2 tests).
The source is read only. Nothing here changes the app or any database."""
import csv, re, sys, zipfile
from fractions import Fraction
from lxml import etree

W = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'
M = 'http://schemas.openxmlformats.org/officeDocument/2006/math'
q = lambda t: '{%s}%s' % (W, t)

def render(p):
    out = []
    for e in p.iter(q('r'), '{%s}oMath' % M):
        if e.tag == '{%s}oMath' % M:
            out.append('{MATH:' + ''.join(x.text or '' for x in e.iter('{%s}t' % M)) + '}'); continue
        t = ''.join(x.text or '' for x in e.iter(q('t')))
        va = e.find(q('rPr') + '/' + q('vertAlign'))
        if va is not None and t:
            t = ('^[%s]' if va.get(q('val')) == 'superscript' else '_[%s]') % t
        out.append(t)
    return ''.join(out)

def value(numeral):
    whole, _, frac = numeral.partition('.')
    v = Fraction(0)
    for i, d in enumerate(reversed(whole)): v += int(d) * 2 ** i
    for i, d in enumerate(frac, 1): v += Fraction(int(d), 2 ** i)
    return v

CONV = re.compile(r'(\d+(?:\.\d+)?)_\[(?:10|ten)\s*\]\s*=\s*(\d+(?:\.\d+)?)_\[(?:2|two)\]')   # decimal = binary
def check(text):
    m = CONV.search(text)
    if not m: return ''
    return 'consistent' if Fraction(m.group(1)) == value(m.group(2)) else 'ERROR: %s (base 2) is %s, not %s' % (m.group(2), value(m.group(2)), m.group(1))

# Independent arithmetic for the worked operations (index -> description). Each is computed here, not copied from the note.
b2 = lambda s: int(s, 2)
INDEP = {
    138: 'add: %s (47) + %s (19) = %s = %s' % ('101111', '10011', bin(b2('101111') + b2('10011'))[2:], b2('101111') + b2('10011')),
    139: 'subtract: 101111 (47) - 10011 (19) = %s = %d' % (bin(b2('101111') - b2('10011'))[2:], b2('101111') - b2('10011')),
    140: 'multiply: 1101 (13) x 111 (7) = %s = %d' % (bin(b2('1101') * b2('111'))[2:], b2('1101') * b2('111')),
    141: 'divide: 10010001 (%d) / 101 (5) = %s (%d), remainder %d' % (b2('10010001'), bin(b2('10010001') // 5)[2:], b2('10010001') // 5, b2('10010001') % 5),
    144: 'labels 1/2 are swapped against the examples: 47 - 19 = 28 = 11100 sits under 1., 47 + 19 = 66 = 1000010 under 2. (M1-BIN-LABELS, not edited)',
    145: 'subtraction 11100 and addition 1000010 verified above',
    146: 'multiplication layout: 1101 + 11010 + 110100 = %s' % bin(b2('1101') + b2('11010') + b2('110100'))[2:],
    150: '145 / 5 = 29 = %s' % bin(29)[2:],
    152: 'ERROR: drawn dividend 1001001 is %d, not divisible by 101 (5); the stated 10010001 (145) gives 11101' % b2('1001001'),
    159: 'add: 100110 (38) + 101010 (42) + 111011 (59) = %s = %d' % (bin(b2('100110') + b2('101010') + b2('111011'))[2:], b2('100110') + b2('101010') + b2('111011')),
    160: 'multiply: 10011 (19) x 11 (3) = %s = %d' % (bin(b2('10011') * 3)[2:], b2('10011') * 3),
    161: 'subtract: 1011010 (90) - 100111 (39) = %s = %d' % (bin(b2('1011010') - b2('100111'))[2:], b2('1011010') - b2('100111')),
    162: 'divide: 1010111 (87) / 111 (7) = %d remainder %d (not exact; the note gives no answer)' % (b2('1010111') // 7, b2('1010111') % 7),
    130: '110 (base 2) = 4 + 2 + 0 = 6, so P = 6',
    134: '11101 = 29; 11.0101 = 3 5/16; 1011001 = 89',
    135: '43 = %s; 1280 = %s; 176 = %s' % (bin(43)[2:], bin(1280)[2:], bin(176)[2:]),
    119: '101 (base 2) = 5', 120: '111 (base 2) = 7', 126: '10.1001 (base 2) = 2 9/16 = 41/16', 123: '10.1001 (base 2) = 2 + 1/2 + 1/16 = 41/16',
    117: '101 (base 2) = 4 + 0 + 1 = 5', 127: '10101 (base 2) = 16 + 0 + 4 + 0 + 1 = 21',
    89: '3/8 = 0.375 = 0.011 (base 2)', 90: '15.125 = 121/8', 109: '121/8 = 1111001/1000 (base 2) = 1111.001 (base 2) = 15.125',
}

FIG = 'V2 figures M1-F01/F02/F03 alt text and SUP-MATH-V2-FIGURES-1'
LOSS_POW = 'delivery formatting loss: the raised exponent is glued to its base in the original text ("1x22", "2 -1"). CONFIRMED GAP, corrected: SUP-MATH-BINARY now writes 1x2^2 explicitly (Notation paragraph, powers 2^0..2^4 and 2^(-1)..2^(-4), four expansions, practice 9)'
GROUPS = [
    ({32, 34, 35, 36, 37}, 'base label (subscript) in worked-example prompt', 'delivery formatting loss in the original text (810, 10710, 3/810 glued); the school prompt is withdrawn with the original; SUP-MATH-BINARY teaches the same conversions with explicit (base 2)/(base 10) (13 -> 1101, 0.375 -> 0.011, 15.125 -> 1111.001), and ' + FIG + ' covers 8, 85, 107, 152, 3/8, 15.125'),
    ({44, 54, 66, 76, 80, 87, 101, 107}, 'base label (subscript) on ladder result', 'delivery formatting loss in the original text ("8510 = 1010101two"); value checked; the delivered figures state base ten / base two for every ladder (' + FIG + ')'),
    ({89, 90, 109, 126}, 'base label (subscript) with recovered equation text', 'delivery formatting loss in the original text; recovered fractions are readable; SUP-MATH-BINARY teaches 0.375 = 0.011 and 15.125 = 1111.001 (base 2); ' + FIG + ' covers 10.1001 = 2 9/16 (not 29/16)'),
    ({114, 117, 120, 123, 127}, 'power (superscript)', LOSS_POW),
    ({115, 119, 122, 129}, 'base label (subscript) in conversion example/result', 'delivery formatting loss in the original text; SUP-MATH-BINARY Notation paragraph writes each as "(base 2)" / "(base 10)"'),
    ({130, 134, 135, 138, 139, 140, 141, 159, 160, 161, 162}, 'base label (subscript) in exercise/assignment prompt', 'delivery formatting loss in the original text; the school exercise is withdrawn with the original; equivalent labelled practice is in SUP-MATH-BINARY (items 1-9); the school items themselves are not re-delivered and no answers are invented for them'),
    ({144, 145, 146, 150, 152}, 'base label (subscript) in column/ladder layout', 'delivery formatting loss in the original text (layout cells glued); the worked values are re-taught in SUP-MATH-V2-FIGURES-1 with the labels corrected by calculation'),
]
SPECIAL = {
    66: ('base label + source error', 'SOURCE ERROR: ladder remainders read upward give 1101011 (107), not 11010011 (211); corrected in SUP-MATH-V2-FIGURES-1 and figure M1-F01 notes; original not edited'),
    122: ('base label + source error', 'SOURCE ERROR: 4 + 2 + 1 = 7, not 9. The importer slip correction M1-BIN-111 already delivers 7 in the audit text; SUP-MATH-BINARY states "7, not 9"'),
    127: ('power + source error context', 'delivery formatting loss (powers) as above; the SOURCE ERROR is on the next line (129): the sum is 21, not 27'),
    129: ('base label + source error', 'SOURCE ERROR: 16 + 0 + 4 + 0 + 1 = 21, not 27. Still 27 in the audit text (no importer correction); SUP-MATH-BINARY states "21 (base 10), not 27"'),
    144: ('base label + source error (labels)', 'SOURCE ERROR (labels swapped, M1-BIN-LABELS, owner-listed open slip, not edited); values and labels re-taught in SUP-MATH-V2-FIGURES-1'),
    152: ('base label + source error (drawn dividend)', 'SOURCE ERROR: the drawn dividend 1001001 (73) is not the stated 10010001 (145); corrected in SUP-MATH-V2-FIGURES-1'),
    91: ('empty vertAlign run (layout only)', 'SOURCE AMBIGUITY (layout): a formatted run with no text; nothing to deliver'),
    109: ('base label + bracket subscript', 'SOURCE AMBIGUITY (layout): the lowered 10 follows a bracketed fraction ("(121/8)10"); its meaning (base ten) is certain from the line above; recovered text reads (121/8)10 = (1111001/1000)2 = 1111.0012'),
}

def main(docx, out):
    ps = list(etree.fromstring(zipfile.ZipFile(docx).read('word/document.xml')).iter(q('p')))
    txt = lambda p: ''.join(x.text or '' for x in p.iter(q('t'))).strip()
    start = lambda title: next(i for i, p in enumerate(ps) if txt(p) == title)
    b, a, e = start('BINARY NUMBERS'), start('APLLICATION OF BINARY NUMBERS'), start('ALGEBRAIC PROCESSES')
    rows = []; missing = []
    for i in range(b, e):
        p = ps[i]
        if not any(r.find(q('rPr') + '/' + q('vertAlign')) is not None for r in p.iter(q('r'))): continue
        r = render(p)
        kind, disp = next(((k, d) for s, k, d in GROUPS if i in s), (None, None))
        if i in SPECIAL: kind, disp = SPECIAL[i]
        if kind is None: missing.append(i); kind, disp = 'UNCLASSIFIED', 'UNCLASSIFIED'
        rows.append([i, 'APLLICATION OF BINARY NUMBERS' if i >= a else 'BINARY NUMBERS', r, kind, check(r) or INDEP.get(i, ''), disp])
    if missing: raise SystemExit('unclassified paragraphs: %s' % missing)
    with open(out, 'w', newline='', encoding='utf-8') as f:
        w = csv.writer(f, lineterminator='\n')
        w.writerow(['w:p_index', 'row', 'run_rendering (^[exponent] _[subscript])', 'notation', 'independent_check', 'disposition_and_delivered_location'])
        w.writerows(rows)
    print(len(rows), 'paragraphs with superscript/subscript runs; APLLICATION rows:', sum(1 for r in rows if r[1].startswith('APLL')))

if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
