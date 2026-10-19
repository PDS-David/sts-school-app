"""Reproducible music notation for JSS3 Music/CCA (Prompt E).

Notes are written as data, converted to MusicXML, engraved with Verovio and
rasterised with cairosvg. No AI image generation is involved. Durations use
divisions=2 per crotchet: quaver=1, crotchet=2, minim=4, dotted minim=6,
semibreve=8.
"""
import re
from xml.sax.saxutils import escape

STEPS = {'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11}
SHARP_ORDER = ['F', 'C', 'G', 'D', 'A', 'E', 'B']
FLAT_ORDER = ['B', 'E', 'A', 'D', 'G', 'C', 'F']
TYPE = {1: ('eighth', 0), 2: ('quarter', 0), 3: ('quarter', 1), 4: ('half', 0),
        6: ('half', 1), 8: ('whole', 0)}


def key_alters(fifths):
    out = {s: 0 for s in STEPS}
    if fifths > 0:
        for s in SHARP_ORDER[:fifths]:
            out[s] = 1
    elif fifths < 0:
        for s in FLAT_ORDER[:-fifths]:
            out[s] = -1
    return out


def parse_pitch(p):
    m = re.fullmatch(r'([A-G])(#|b|n)?(\d)', p)
    if not m:
        raise ValueError('bad pitch ' + p)
    step, acc, octv = m.group(1), m.group(2), int(m.group(3))
    alter = {'#': 1, 'b': -1, None: None, 'n': 0}[acc]
    return step, alter, octv  # alter None = "as the key signature says"


def midi(step, alter, octv):
    return 12 * (octv + 1) + STEPS[step] + alter


class Score:
    """events per measure: ('n', [pitches], dur, lyric) or ('r', dur)."""

    def __init__(self, fifths, beats, beat_type, measures, clef='G', pickup=False,
                 final_bar=True, short_last=False):
        self.fifths, self.beats, self.beat_type = fifths, beats, beat_type
        self.measures, self.clef, self.pickup, self.final_bar = measures, clef, pickup, final_bar
        self.short_last = short_last

    @property
    def capacity(self):
        return self.beats * 8 // self.beat_type

    def resolved(self):
        """Return measures with explicit sounding alter for every pitch."""
        ka = key_alters(self.fifths)
        res = []
        for m in self.measures:
            seen = {}
            out = []
            for ev in m:
                if ev[0] == 'r':
                    out.append(ev)
                    continue
                notes = []
                for p in ev[1]:
                    step, alter, octv = parse_pitch(p)
                    shown = None
                    if alter is None:
                        alter = seen.get((step, octv), ka[step])
                    else:
                        cur = seen.get((step, octv), ka[step])
                        if alter != cur:
                            shown = {1: 'sharp', -1: 'flat', 0: 'natural'}[alter]
                        seen[(step, octv)] = alter
                    notes.append((step, alter, octv, shown))
                out.append(('n', notes, ev[2], ev[3] if len(ev) > 3 else None))
            res.append(out)
        return res

    def check_bars(self):
        for i, m in enumerate(self.measures):
            total = sum(ev[1] if ev[0] == 'r' else ev[2] for ev in m)
            if i == 0 and self.pickup:
                assert total < self.capacity, 'pickup must be short'
                continue
            if self.short_last and i == len(self.measures) - 1:
                assert 0 < total <= self.capacity
                continue
            assert total == self.capacity, f'bar {i} has {total} not {self.capacity}'

    def musicxml(self):
        self.check_bars()
        x = ['<?xml version="1.0" encoding="UTF-8"?>',
             '<score-partwise version="3.1"><part-list><score-part id="P1"><part-name></part-name></score-part></part-list>',
             '<part id="P1">']
        for i, m in enumerate(self.resolved()):
            attrs = ''
            if i == 0:
                attrs = (f'<attributes><divisions>2</divisions><key><fifths>{self.fifths}</fifths></key>'
                         f'<time><beats>{self.beats}</beats><beat-type>{self.beat_type}</beat-type></time>'
                         + ('<clef><sign>G</sign><line>2</line></clef>' if self.clef == 'G'
                            else '<clef><sign>F</sign><line>4</line></clef>') + '</attributes>')
            num = 0 if (i == 0 and self.pickup) else (i if self.pickup else i + 1)
            imp = ' implicit="yes"' if (i == 0 and self.pickup) else ''
            x.append(f'<measure number="{num}"{imp}>{attrs}')
            for ev in m:
                if ev[0] == 'r':
                    t, dot = TYPE[ev[1]]
                    x.append(f'<note><rest/><duration>{ev[1]}</duration><type>{t}</type>{"<dot/>" if dot else ""}</note>')
                    continue
                _, notes, dur, lyric = ev
                t, dot = TYPE[dur]
                for j, (step, alter, octv, shown) in enumerate(notes):
                    s = '<note>' + ('<chord/>' if j else '')
                    s += f'<pitch><step>{step}</step>' + (f'<alter>{alter}</alter>' if alter else '') + f'<octave>{octv}</octave></pitch>'
                    s += f'<duration>{dur}</duration><type>{t}</type>' + ('<dot/>' if dot else '')
                    if shown:
                        s += f'<accidental>{shown}</accidental>'
                    if lyric and j == 0:
                        s += f'<lyric><syllabic>single</syllabic><text>{escape(lyric)}</text></lyric>'
                    s += '</note>'
                    x.append(s)
            if i == len(self.measures) - 1 and self.final_bar:
                x.append('<barline location="right"><bar-style>light-heavy</bar-style></barline>')
            x.append('</measure>')
        x.append('</part></score-partwise>')
        return ''.join(x)


def render_png(score, path, width=1500, scale=48, breaks='none'):
    import verovio, cairosvg
    tk = verovio.toolkit()
    tk.setOptions({'pageWidth': width * 100 // scale, 'pageHeight': 2000, 'scale': scale,
                   'adjustPageHeight': True, 'header': 'none', 'footer': 'none',
                   'breaks': breaks, 'lyricSize': 5.0, 'pageMarginLeft': 40, 'pageMarginRight': 40,
                   'pageMarginTop': 40, 'pageMarginBottom': 40})
    xml = score.musicxml()
    assert tk.loadData(xml), 'verovio could not load score'
    svg = tk.renderToSVG(1)
    cairosvg.svg2png(bytestring=svg.encode('utf-8'), write_to=path, background_color='white', scale=3)
    return xml
