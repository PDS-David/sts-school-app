"""Lesson/contract consistency tests. Run from the delivery root: python3 -m unittest discover -s tests -v"""
import json, csv, os, re, hashlib, unittest

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
J = lambda n: json.load(open(os.path.join(ROOT, n), encoding='utf-8'))
UPS = J('SUPPLEMENT_UPSERTS.json')
BY = {u['id']: u['lesson'] for u in UPS}
TOTALS = {'SUP-MUSIC-HARMONIC-MINOR': 14, 'SUP-MUSIC-RELATIVE-KEYS': 12, 'SUP-MUSIC-WORDS-MELODY': 15, 'SUP-MUSIC-CADENCES': 12,
          'SUP-MUSIC-STAFF-TO-SOLFA': 16, 'SUP-MUSIC-TRANSPOSE-DOMINANT': 20, 'SUP-MUSIC-PRACTICAL': 16, 'SUP-MUSIC-REVISION-OMEGA': 4,
          'SUP-CCA-VISUAL-UNITY': 10, 'SUP-CCA-BATIK-PRACTICAL': 12, 'SUP-CCA-LETTERING-PRACTICAL': 10,
          'SUP-CCA-EMBROIDERY-PRACTICAL': 7, 'SUP-CCA-EXHIBITION-PRACTICAL': 9}


class Lessons(unittest.TestCase):
    def test_shape(self):
        self.assertEqual(len(UPS), 13)
        self.assertEqual(sum(u['op'] == 'replace' for u in UPS), 1)
        for u in UPS:
            l = u['lesson']
            self.assertEqual(sorted(l), sorted(['id', 'gapIds', 'subjectName', 'termLabel', 'title', 'body', 'sources', 'origin']))
            self.assertIn(l['subjectName'], ('Music', 'Cultural & Creative Arts'))
            self.assertIn(l['termLabel'], ('1st Term', '2nd Term'))
            self.assertIn('not recovered', l['origin'])
            self.assertTrue(all(s['url'].startswith('https://') for s in l['sources']))
            self.assertNotIn('...', l['body'])
            self.assertTrue(re.search('practice|questions|assessment', l['body'], re.I) and re.search('answers|marking|assessment|feedback', l['body'], re.I))
            if u['op'] == 'add':
                self.assertIsNone(u['expected_old_sha256'])
            else:
                self.assertRegex(u['expected_old_sha256'], r'^[0-9a-f]{64}$')

    def test_marks_add_up(self):
        for lid, total in TOTALS.items():
            b = BY[lid]['body']
            ans = b.split('Answers and marking guide:')[1].split('Assessment and feedback:')[0]
            got = sum(int(x) for x in re.findall(r'\((\d+) marks?\)', ans))
            self.assertEqual(got, total, lid)
            self.assertIn(str(total), b.split('Assessment and feedback:')[1].split('\n')[0], lid)

    def test_negative_control_marks_check_detects_error(self):
        b = BY['SUP-MUSIC-CADENCES']['body'].replace('(4 marks)', '(5 marks)')
        ans = b.split('Answers and marking guide:')[1].split('Assessment and feedback:')[0]
        self.assertNotEqual(sum(int(x) for x in re.findall(r'\((\d+) marks?\)', ans)), TOTALS['SUP-MUSIC-CADENCES'])


class Contract(unittest.TestCase):
    def test_decision_anchors_in_supplement_bodies(self):
        rows = list(csv.DictReader(open(os.path.join(ROOT, 'DECISIONS.csv'), encoding='utf-8')))
        self.assertEqual(list(rows[0]), ['candidate_id', 'disposition', 'support_kind', 'row_filter', 'anchor_regex', 'rationale', 'limitation'])
        self.assertEqual(len(rows), 19)
        for r in rows:
            if r['support_kind'] == 'supplement':
                self.assertIn(r['anchor_regex'], BY[r['row_filter']]['body'], r['candidate_id'])
            self.assertTrue(r['rationale'])

    def test_negative_control_bad_anchor(self):
        self.assertNotIn('fah - me is correct', BY['SUP-MUSIC-CADENCES']['body'])

    def test_mandatory_fourteen_all_decided(self):
        got = {r['candidate_id'] for r in csv.DictReader(open(os.path.join(ROOT, 'DECISIONS.csv'), encoding='utf-8'))}
        mandatory = 'SL-060 SL-064 SL-294 SL-296 SL-422 SL-423 SL-424 SL-425 SL-427 SL-521 SL-523 SL-559 SL-560 SL-562'.split()
        self.assertEqual(set(mandatory) - got, set())

    def test_assets_map_to_lessons_and_hash(self):
        for a in J('ASSETS.json'):
            self.assertIn(a['target_lesson_id'], BY)
            data = open(os.path.join(ROOT, a['file']), 'rb').read()
            self.assertEqual(hashlib.sha256(data).hexdigest(), a['sha256'])
            self.assertIsNone(a['order_index'])
            self.assertTrue(a['alt_text'] and a['caption'] and a['provenance'] and a['licence'])
            self.assertFalse(a['source_recovered_graphic'])

    def test_every_figure_lesson_names_its_figure(self):
        for lid in {a['target_lesson_id'] for a in J('ASSETS.json')}:
            self.assertRegex(BY[lid]['body'], r'[Ff]igure')

    def test_corrections_point_at_real_replacements(self):
        for c in J('DELIVERY_CORRECTIONS.json'):
            self.assertEqual((c['class_name'], c['school_code']), ('JSS 3', 'secondary'))
            self.assertRegex(c['source_body_sha256'], r'^[0-9a-f]{64}$')
            for rid in c['replacement_lesson_ids']:
                self.assertIn(rid, BY)

    def test_plagal_correction_present_in_replacement(self):
        self.assertIn('fah to me is not the cadence', BY['SUP-MUSIC-CADENCES']['body'])
        self.assertIn('Plagal cadence (the \'Amen\' cadence): IV to I', BY['SUP-MUSIC-CADENCES']['body'])

    def test_batik_replacement_keeps_heat_with_teacher(self):
        b = BY['SUP-CCA-BATIK-PRACTICAL']['body']
        for s in ('teacher demonstration only', 'cool the burn under cool running water for 20 minutes', 'Hot wax is only for an adult'):
            self.assertIn(s, b)

    def test_transposition_q3_answer_arithmetic(self):
        from music21 import pitch
        q = 'G4 E4 C5 B4 A4 B4 C5'.split()
        got = [pitch.Pitch(p).midi + 7 for p in q]
        self.assertEqual([pitch.Pitch(p).midi for p in 'D5 B4 G5 F#5 E5 F#5 G5'.split()], got)
        self.assertIn('D5 B4 G5 F#5 | E5 F#5 G5', BY['SUP-MUSIC-TRANSPOSE-DOMINANT']['body'])


if __name__ == '__main__':
    unittest.main()
