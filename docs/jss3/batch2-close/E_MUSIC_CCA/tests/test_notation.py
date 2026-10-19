"""Independent checks of the generated notation (music21 re-parse, not the generator's own data).
Run from the delivery root:  python3 -m unittest discover -s tests -v
"""
import json, hashlib, os, unittest
from music21 import converter, chord, key as m21key

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
XML = os.path.join(ROOT, 'assets', 'musicxml')


def load(name):
    return converter.parse(os.path.join(XML, name + '.musicxml'))


def seq(s):
    return [n.pitch.nameWithOctave for n in s.flatten().notes]


def fifths(s):
    return s.flatten().getElementsByClass(m21key.KeySignature)[0].sharps


def bars(s):
    return [m.highestTime for m in s.parts[0].getElementsByClass('Measure')]


def check_scale(s, expected, fx):
    assert seq(s) == expected, (seq(s), expected)
    assert fifths(s) == fx


class Scales(unittest.TestCase):
    def test_harmonic_minor_d_e_g(self):
        check_scale(load('harmonic-minor-d-e-g-1'), 'D4 E4 F4 G4 A4 B-4 C#5 D5'.split(), -1)
        check_scale(load('harmonic-minor-d-e-g-2'), 'E4 F#4 G4 A4 B4 C5 D#5 E5'.split(), 1)
        check_scale(load('harmonic-minor-d-e-g-3'), 'G4 A4 B-4 C5 D5 E-5 F#5 G5'.split(), -2)

    def test_harmonic_minor_interval_pattern(self):
        # T s T T s (T+s) s  = 2 1 2 2 1 3 1 semitones
        for i in (1, 2, 3):
            m = [n.pitch.midi for n in load(f'harmonic-minor-d-e-g-{i}').flatten().notes]
            self.assertEqual([b - a for a, b in zip(m, m[1:])], [2, 1, 2, 2, 1, 3, 1])

    def test_negative_control_source_label_error(self):
        # the source label row for G minor ended on A; the drawn and correct final note is G
        with self.assertRaises(AssertionError):
            check_scale(load('harmonic-minor-d-e-g-3'), 'G4 A4 B-4 C5 D5 E-5 F#5 A5'.split(), -2)
        # flats dropped from the text layer (B and E natural) must fail
        with self.assertRaises(AssertionError):
            check_scale(load('harmonic-minor-d-e-g-3'), 'G4 A4 B4 C5 D5 E5 F#5 G5'.split(), -2)

    def test_key_signatures_up_to_four(self):
        for i, f in enumerate([1, 2, 3, 4], 1):
            self.assertEqual(fifths(load(f'key-signatures-sharps-{i}')), f)
        for i, f in enumerate([-1, -2, -3, -4], 1):
            self.assertEqual(fifths(load(f'key-signatures-flats-{i}')), f)


class Melodies(unittest.TestCase):
    def test_words_melody(self):
        s = load('words-melody-example-1')
        self.assertEqual(seq(s), 'E4 F4 G4 E4 C4'.split())
        self.assertEqual([n.duration.quarterLength for n in s.flatten().notes], [.5, .5, 1, 1, 2])
        self.assertEqual(bars(s), [1.0, 2.0, 2.0])  # pick-up beat, then two full 2/4 bars

    def test_staff_to_solfa(self):
        s = load('staff-to-solfa-example-1')
        self.assertEqual(seq(s), 'D4 G4 G4 A4 B4 B4 A4 G4 A4 B4 A4 F#4 A4 G4'.split())
        self.assertEqual(bars(s), [1.0, 4.0, 4.0, 4.0, 3.0])  # pick-up 1 + final 3 = one full bar
        self.assertEqual(fifths(s), 1)

    def test_cadence_chords(self):
        want = {1: ('G4 B4 D5', 'C4 E4 G4'), 2: ('C4 E4 G4', 'G4 B4 D5'), 3: ('F4 A4 C5', 'C4 E4 G4'), 4: ('G4 B4 D5', 'A4 C5 E5')}
        for i, (a, b) in want.items():
            cs = list(load(f'cadences-c-major-{i}').flatten().getElementsByClass(chord.Chord))
            self.assertEqual([[p.nameWithOctave for p in c.pitches] for c in cs], [a.split(), b.split()])

    def test_transpositions(self):
        def midis(n): return [x.pitch.midi for x in load(n).flatten().notes]
        for (q, a, qk, ak) in [('transposition-c-to-g', 7, 0, 1), ('transposition-f-to-c', -5, -1, 0),
                               ('transposition-f-sharp-example', 7, 0, 1)]:
            Q, A = midis(q + '-1'), midis(q + '-2')
            self.assertEqual([y - x for x, y in zip(Q, A)], [a] * len(Q))
            self.assertEqual((fifths(load(q + '-1')), fifths(load(q + '-2'))), (qk, ak))
        self.assertEqual(seq(load('transposition-c-to-g-2')), 'B4 A4 G4 A4 D5'.split())
        self.assertEqual(seq(load('transposition-f-to-c-2')), 'E4 D4 C4 D4 G4'.split())
        self.assertEqual(seq(load('transposition-f-sharp-example-2')), 'G4 B4 D5 E5 F#5 G5'.split())

    def test_negative_control_wrong_direction(self):
        # F->G (the source's worked example) is NOT a move to the dominant: F's dominant is C
        Q = [x.pitch.midi for x in load('transposition-f-to-c-1').flatten().notes]
        A = [x.pitch.midi for x in load('transposition-f-to-c-2').flatten().notes]
        self.assertNotEqual([y - x for x, y in zip(Q, A)], [2] * len(Q))

    def test_practical_eight_bars_and_range(self):
        c = load('practical-model-melody-1'); g = load('practical-model-melody-2')
        for s, lo, hi, f in ((c, 60, 67, 0), (g, 67, 74, 1)):
            self.assertEqual(bars(s), [4.0] * 8)
            m = [n.pitch.midi for n in s.flatten().notes]
            self.assertEqual((min(m), max(m)), (lo, hi))  # nothing below doh, nothing above soh
            self.assertEqual((m[0], m[-1]), (lo, lo))     # starts and ends on doh
            self.assertEqual(fifths(s), f)
        self.assertEqual([x.pitch.midi + 7 for x in c.flatten().notes], [x.pitch.midi for x in g.flatten().notes])
        self.assertEqual([n.duration.quarterLength for n in c.flatten().notes], [n.duration.quarterLength for n in g.flatten().notes])

    def test_negative_control_old_practical_defect(self):
        # old bar 7 'f m r t,' put a note below doh; the new melody must never do that
        c = [n.pitch.midi for n in load('practical-model-melody-1').flatten().notes]
        self.assertFalse(any(x < 60 for x in c))


class Assets(unittest.TestCase):
    def test_png_hashes_match_manifest(self):
        built = json.load(open(os.path.join(ROOT, 'assets', '_built.json')))
        for name, meta in built.items():
            data = open(os.path.join(ROOT, 'assets', meta['file']), 'rb').read()
            self.assertEqual(hashlib.sha256(data).hexdigest(), meta['sha256'], name)
            self.assertTrue(data.startswith(b'\x89PNG'))


if __name__ == '__main__':
    unittest.main()
