"""Build all new Music figures for Prompt E. Run: python3 build_assets.py <assets_dir>"""
import sys, os, hashlib, json
from PIL import Image, ImageDraw, ImageFont
from notation import Score, render_png

OUT = sys.argv[1] if len(sys.argv) > 1 else '../assets'
os.makedirs(OUT + '/musicxml', exist_ok=True)
FONT = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
FB = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'


def N(p, d, l=None):
    return ('n', [p] if isinstance(p, str) else p, d, l)


def scale8(fifths, pitches, syl):
    ms = [[N(p, 2, s) for p, s in zip(pitches[:4], syl[:4])], [N(p, 2, s) for p, s in zip(pitches[4:], syl[4:])]]
    return Score(fifths, 4, 4, ms)


SOL_MIN = ['l', 't', 'd', 'r', 'm', 'f', 'se', 'l']
FIG = {}  # name -> (list of (label, Score))

FIG['harmonic-minor-d-e-g'] = [
    ('D harmonic minor  (key signature: 1 flat, B\u266d; raised 7th: C\u266f)', scale8(-1, ['D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C#5', 'D5'], SOL_MIN)),
    ('E harmonic minor  (key signature: 1 sharp, F\u266f; raised 7th: D\u266f)', scale8(1, ['E4', 'F4', 'G4', 'A4', 'B4', 'C5', 'D#5', 'E5'], SOL_MIN)),
    ('G harmonic minor  (key signature: 2 flats, B\u266d E\u266d; raised 7th: F\u266f)', scale8(-2, ['G4', 'A4', 'B4', 'C5', 'D5', 'E5', 'F#5', 'G5'], SOL_MIN)),
]
# F4 note in E minor is written 'F4' -> key signature supplies F#; E minor 2nd degree is F#.
rest = lambda: Score(0, 4, 4, [[('r', 8)]])


def keysig(f):
    return Score(f, 4, 4, [[('r', 8)]])


FIG['key-signatures-sharps'] = [
    ('G major / E minor  (1 sharp)', keysig(1)), ('D major / B minor  (2 sharps)', keysig(2)),
    ('A major / F\u266f minor  (3 sharps)', keysig(3)), ('E major / C\u266f minor  (4 sharps)', keysig(4))]
FIG['key-signatures-flats'] = [
    ('F major / D minor  (1 flat)', keysig(-1)), ('B\u266d major / G minor  (2 flats)', keysig(-2)),
    ('E\u266d major / C minor  (3 flats)', keysig(-3)), ('A\u266d major / F minor  (4 flats)', keysig(-4))]

FIG['words-melody-example'] = [('"I am coming home"  \u2013  2/4, C major (doh = C). Stressed syllables COM and HOME fall on beat 1.',
    Score(0, 2, 4, [[N('E4', 1, 'I'), N('F4', 1, 'am')], [N('G4', 2, 'com'), N('E4', 2, 'ing')], [N('C4', 4, 'home')]], pickup=True))]

def chord(ps, d, l): return ('n', ps, d, l)
C = lambda r, a, b, c, l: chord([a, b, c], 4, l)
FIG['cadences-c-major'] = [
    ('Perfect (authentic) cadence: V \u2192 I', Score(0, 4, 4, [[chord(['G4', 'B4', 'D5'], 4, 'V'), chord(['C4', 'E4', 'G4'], 4, 'I')]])),
    ('Imperfect (half) cadence: I \u2192 V', Score(0, 4, 4, [[chord(['C4', 'E4', 'G4'], 4, 'I'), chord(['G4', 'B4', 'D5'], 4, 'V')]])),
    ('Plagal cadence: IV \u2192 I  ("Amen")', Score(0, 4, 4, [[chord(['F4', 'A4', 'C5'], 4, 'IV'), chord(['C4', 'E4', 'G4'], 4, 'I')]])),
    ('Interrupted (deceptive) cadence: V \u2192 vi', Score(0, 4, 4, [[chord(['G4', 'B4', 'D5'], 4, 'V'), chord(['A4', 'C5', 'E5'], 4, 'vi')]])),
]

FIG['staff-to-solfa-example'] = [('Worked example: G major (doh = G), 4/4, starts with a one-beat upbeat (pick-up)',
    Score(1, 4, 4, [[N('D4', 2, 's,')],
                    [N('G4', 2, 'd'), N('G4', 2, 'd'), N('A4', 2, 'r'), N('B4', 2, 'm')],
                    [N('B4', 2, 'm'), N('A4', 2, 'r'), N('G4', 2, 'd'), N('A4', 2, 'r')],
                    [N('B4', 2, 'm'), N('A4', 2, 'r'), N('F#4', 2, 't,'), N('A4', 2, 'r')],
                    [N('G4', 6, 'd')]], pickup=True, short_last=True))]

def two(a, b, la, lb):
    return [(la, a), (lb, b)]

def tune(fifths, pit, syl, last2=None):
    return Score(fifths, 2, 4, [[N(pit[0], 2, syl[0]), N(pit[1], 1, syl[1]), N(pit[2], 1, syl[2])], [N(pit[3], 2, syl[3]), N(pit[4], 2, syl[4])]])

SY = ['m', 'r', 'd', 'r', 's']
FIG['transposition-c-to-g'] = two(tune(0, ['E4', 'D4', 'C4', 'D4', 'G4'], SY), tune(1, ['B4', 'A4', 'G4', 'A4', 'D5'], SY),
    'Question: tune in C major (doh = C)', 'Answer: the same tune in G major, the dominant key (doh = G), a perfect 5th higher')
FIG['transposition-f-to-c'] = two(tune(-1, ['A4', 'G4', 'F4', 'G4', 'C5'], SY), tune(0, ['E4', 'D4', 'C4', 'D4', 'G4'], SY),
    'Question: tune in F major (doh = F; one flat, B\u266d)', 'Answer: the same tune in C major, the dominant key (doh = C), a perfect 4th lower')
def t2(fifths, pit):
    return Score(fifths, 4, 4, [[N(p, 2, s) for p, s in zip(pit[:4], ['d', 'm', 's', 'l'])], [N(pit[4], 2, 't'), N(pit[5], 6, "d'")]])
FIG['transposition-f-sharp-example'] = two(t2(0, ['C4', 'E4', 'G4', 'A4', 'B4', 'C5']), t2(1, ['G4', 'B4', 'D5', 'E5', 'F#5', 'G5']),
    'Worked example: C major, 4/4', 'Answer: G major, a perfect 5th higher (F\u266f in the key signature, so ti is F\u266f)')

def prac(fifths, root):  # root = list of 7 pitches for degrees d..t plus d'
    d, r, m, f, s, l = root[:6]
    b = [[N(d, 2, 'd'), N(r, 2, 'r'), N(m, 2, 'm'), N(d, 2, 'd')],
         [N(m, 2, 'm'), N(f, 2, 'f'), N(s, 4, 's')],
         [N(s, 2, 's'), N(f, 2, 'f'), N(m, 2, 'm'), N(f, 2, 'f')],
         [N(m, 2, 'm'), N(r, 2, 'r'), N(s, 4, 's')],
         [N(d, 2, 'd'), N(r, 2, 'r'), N(m, 2, 'm'), N(d, 2, 'd')],
         [N(m, 2, 'm'), N(f, 2, 'f'), N(s, 4, 's')],
         [N(f, 2, 'f'), N(m, 2, 'm'), N(r, 4, 'r')],
         [N(d, 8, 'd')]]
    return Score(fifths, 4, 4, b)

FIG['practical-model-melody'] = [
    ('Model melody in C major (doh = C): 8 bars, 4/4, no note below doh or above soh', prac(0, ['C4', 'D4', 'E4', 'F4', 'G4', 'A4'])),
    ('The same melody in G major (doh = G): 8 bars, 4/4, F\u266f in the key signature (not needed in the melody)', prac(1, ['G4', 'A4', 'B4', 'C5', 'D5', 'E5'])),
]


def stack(items, path, width=1500, scale=48, breaks='none'):
    f = ImageFont.truetype(FONT, 30); pad = 20
    tiles = []
    for i, (label, sc) in enumerate(items):
        tmp = f'/tmp/_t{i}.png'
        xml = render_png(sc, tmp, width=width, scale=scale, breaks=breaks)
        tiles.append((label, Image.open(tmp).convert('RGB'), xml))
    W = max(max(t[1].size[0] for t in tiles) + 2 * pad, int(max(f.getlength(t[0]) for t in tiles)) + 2 * pad, 900)
    H = sum(t[1].size[1] + 56 for t in tiles) + pad
    im = Image.new('RGB', (W, H), 'white'); d = ImageDraw.Draw(im); y = pad // 2
    for label, img, _ in tiles:
        d.text((pad, y), label, fill='black', font=f); y += 44
        im.paste(img, (pad, y)); y += img.size[1] + 12
    im.save(path, optimize=True)
    return [t[2] for t in tiles]


manifest = {}
for name, items in FIG.items():
    path = f'{OUT}/{name}.png'
    xmls = stack(items, path, width=720 if name == 'practical-model-melody' else 1500, breaks='auto' if name == 'practical-model-melody' else 'none')
    for i, x in enumerate(xmls):
        open(f'{OUT}/musicxml/{name}-{i+1}.musicxml', 'w', encoding='utf-8').write(x)
    manifest[name] = {'file': f'{name}.png', 'sha256': hashlib.sha256(open(path, 'rb').read()).hexdigest(),
                      'size': Image.open(path).size, 'staves': len(items)}
json.dump(manifest, open(f'{OUT}/_built.json', 'w'), indent=1)
print(json.dumps(manifest, indent=1))
