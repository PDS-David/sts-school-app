# -*- coding: utf-8 -*-
"""Build the Prompt E contract files. Run from E_OUT/generator: python3 build_contract.py <inputs_dir> <repo_dir>"""
import sys, os, json, csv, hashlib, zipfile, re, subprocess
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from lessons_def import LESSONS

INPUTS = sys.argv[1]   # .../JSS3_NEXT_STAGE_INPUTS
REPO = sys.argv[2]
OUT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sha = lambda b: hashlib.sha256(b if isinstance(b, bytes) else b.encode('utf-8')).hexdigest()

rows = json.load(open(f'{INPUTS}/portable_verification/capture/original-rows.json', encoding='utf-8'))
BYID = {l['id']: l for l in LESSONS}


def find(file_end, term, order, subj):
    for r in rows:
        if (r['filePath'].strip().endswith(file_end) and r['termLabel'] == term and str(r['orderIndex']) == str(order)
                and r['subjectName'] == subj and r['className'] == 'JSS 3'):
            return r
    raise SystemExit(f'row not found {file_end} {term} {order}')


def find_body(contains, subj):
    hits = [r for r in rows if r['subjectName'] == subj and r['className'] == 'JSS 3' and contains in r['sourceReference']]
    assert len(hits) == 1, (contains, len(hits))
    return hits[0]


# ---------------------------------------------------------------- upserts
old = json.load(open(f'{REPO}/backend/src/db/data/jss3Supplements.json', encoding='utf-8'))
old_by = {x['id']: x for x in old}
node_hash = subprocess.check_output(['node', '-e', f"""
const fs=require('fs'),c=require('crypto');
const d=JSON.parse(fs.readFileSync('{REPO}/backend/src/db/data/jss3Supplements.json','utf8'));
const l=d.find(x=>x.id==='SUP-MUSIC-PRACTICAL');
console.log(c.createHash('sha256').update(JSON.stringify(l),'utf8').digest('hex'));"""]).decode().strip()
ups = []
for l in LESSONS:
    lesson = {k: l[k] for k in ('id', 'gapIds', 'subjectName', 'termLabel', 'title', 'body', 'sources', 'origin')}
    if l['op'] == 'replace':
        assert l['id'] in old_by
        ups.append({'op': 'replace', 'id': l['id'], 'expected_old_sha256': node_hash, 'lesson': lesson})
    else:
        assert l['id'] not in old_by, l['id']
        ups.append({'op': 'add', 'id': l['id'], 'expected_old_sha256': None, 'lesson': lesson})
json.dump(ups, open(f'{OUT}/SUPPLEMENT_UPSERTS.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)

# ---------------------------------------------------------------- decisions
SRC = {  # source file hashes from the worklist
    'music2': ('JSS3 2ND TERM /music.docx', '', 'Music'),
}
ORIG = [
    # id, disposition, kind, row_filter, anchor, rationale, limitation
    ('SL-060', 'ORIGINAL_LESSON_COVERS_OBJECTIVE', 'original', 'Cultural & Creative Arts|1st Term|1',
     'Igbo-Ukwu is notable for three',
     "Read: the row is a Week 1 body on Nigerian traditional art that covers the Igbo-Ukwu, Ife, Benin, Nupe, Owo, Esie, Ibibio and Ikom traditions (all eight names occur in the body). Decision: covered at topic level; the automatic match to this row is accepted after reading.",
     "Encyclopaedic art history with no pupil task, exercise or practical; dating wording is the source's and is not re-verified; read against the captured row body; not teacher-certified."),
    ('SL-064', 'STRUCTURAL_MARKER', 'marker', '', '', "First-Term CCA scheme line 'Revision/Examination'; the source names no content.", ''),
    ('SL-296', 'STRUCTURAL_MARKER', 'marker', '', '', "Second-Term CCA scheme line 'Examination'; the source names no content.", ''),
    ('SL-294', 'REPLACEMENT_IMPLEMENTED', 'supplement', 'SUP-CCA-LETTERING-PRACTICAL', 'x-height is the height of small letters',
     "Read: the Lettering (Theory) row defines lettering and calligraphy from an encyclopaedia article and the Lettering (practical) row is a passage on the history of Western calligraphy; neither gives letter parts, spacing, a layout method, a task or criteria. New attributed lesson supplies them.",
     "New teaching not recovered school text; owner-authorised; practical is scored by an observer and no performance is certified."),
    ('SL-422', 'ORIGINAL_LESSON_COVERS_OBJECTIVE', 'original', 'Music|2nd Term|2', 'A solo is a piece of music for one performer',
     "Read: the Week 2 row defines solo, duet, trio and quartet, gives what each needs (pitch, breath, clear words, blend, balance of parts) and sets exercises on solo and duet. Decision: covered at topic level.",
     "Exercises cover solo and duet only (none on trio or quartet); singing is not assessed by a written row; the trio sentence 'possibly the bass part' is loose; not teacher-certified."),
    ('SL-423', 'REPLACEMENT_IMPLEMENTED', 'supplement', 'SUP-MUSIC-HARMONIC-MINOR', 'D harmonic minor - key signature one flat',
     "Checked: the drawn D, E and G harmonic minor staves in the Week 3 document are correct when rendered (D E F G A Bb C# D; E F# G A B C D# E; G A Bb C D Eb F# G) but the text layer loses the flats, and the G minor letter row ends on A where the drawn last note is G. New lesson restates the three scales with every accidental written out and newly engraved, independently re-parsed notation.",
     "Original drawings are shapes read from a LibreOffice render, not from the RTF; singing the scales is not assessed; not teacher-certified."),
    ('SL-424', 'REPLACEMENT_IMPLEMENTED', 'supplement', 'SUP-MUSIC-RELATIVE-KEYS', 'Keys with flats: F / D minor',
     "Checked: the Week 4 key-signature table is drawn; in plain text the flats are lost (flat keys read as B, E and A major and minor) and in the LibreOffice render several sharp signatures lack crossbars so the sharp row cannot be certified. New lesson gives engraved, checked tables for up to four sharps and four flats and the method.",
     "The original drawn table is not certified either way; new lesson covers up to four sharps and flats as the scheme states; written only."),
    ('SL-425', 'REPLACEMENT_IMPLEMENTED', 'supplement', 'SUP-MUSIC-WORDS-MELODY', 'Worked example (figure)',
     "Read: the Week 5 row explains speech rhythm and shows two rhythm drawings but gives no worked answer to either set exercise. New lesson gives steps, a complete engraved answer for 'I am coming home' and a marking guide for 'I will come again tomorrow'.",
     "Exercise 2 has no single model answer (marking guide only); tone patterns of Nigerian languages are not invented; singing not assessed."),
    ('SL-427', 'REPLACEMENT_IMPLEMENTED', 'supplement', 'SUP-MUSIC-CADENCES', 'Take care: fah to me is not the cadence',
     "Read: the Week 7 row names four cadences and gives sol-fa examples for perfect, imperfect and interrupted, but its plagal example 'fah - me' is wrong (plagal is chord IV to I, roots fah and doh) and it has no chord notation. New lesson gives chords, engraved cadences in C major, and G major chords. Overlaps SUP-CCA-CADENCES (CCA subject).",
     "Chord identities only in C and G major; written only; the original row stays in the plan unless the delivery correction is applied."),
    ('SL-521', 'REPLACEMENT_IMPLEMENTED', 'supplement', 'SUP-CCA-VISUAL-UNITY', 'Four ways to make unity',
     "Read: the Unity row is an essay on unity among people and a nation with religious content; it does not teach unity as a principle of design. New lesson teaches visual unity (proximity, repetition, continuation, simplicity), with design tasks and criteria.",
     "Design tasks are marked by an observer; the original essay stays as its own content; not teacher-certified."),
    ('SL-523', 'REPLACEMENT_IMPLEMENTED', 'supplement', 'SUP-CCA-BATIK-PRACTICAL', 'Hot-wax batik (teacher demonstration only)',
     "Read: the Batik row is a craft-shop page that has pupils melt wax in a pot or an old frying pan, tub-dye with soda ash, boil the wax out and iron it, with no supervision or safety rules. New lesson makes paste-resist (adire eleko style) the pupil task, keeps hot wax to the teacher, and adds safety, burn first aid and criteria; delivery correction proposed for the original procedure.",
     "Dye products and quantities are not specified; the teacher must follow the dye maker's safety sheet; practical scored by an observer."),
    ('SL-559', 'REPLACEMENT_IMPLEMENTED_PARTIAL', 'supplement', 'SUP-MUSIC-REVISION-OMEGA', 'G to D is a perfect fifth',
     "Checked: the automatic match pointed at a first-term revision row from a different source file (same_source_file=no), so it is not evidence. The Omega Week 1 revision exercise has no captured original row. New lesson answers its fill-ins, the three readable chords, and questions 3 to 5.",
     "The fifth drawn chord is ambiguous (top two notes touch) and is not answered; the chord instruction line is missing from the document; item 10 says 'fifth line' where the F clef fixes the fourth; answers need teacher confirmation."),
    ('SL-560', 'ORIGINAL_LESSON_COVERS_OBJECTIVE', 'original', 'Music|1st Term|9', 'The baroque period flourished from 1600 to 1750',
     "Read: the Week 2 row covers the Baroque, Classical and Romantic periods with dates, forms, composers and exercises; the dates and composer dates checked as correct. Decision: covered.",
     "Spelling slips in the source (Vilvadi for Vivaldi, Fredrick, Mendelsohn) are left as is; read against the captured row body; not teacher-certified."),
    ('SL-561', 'REPLACEMENT_IMPLEMENTED', 'supplement', 'SUP-MUSIC-STAFF-TO-SOLFA', 'Sol-fa with beats: s, | d : d : r : m',
     "Checked: the source does have drawn staves (no images, but vector drawings). Example 1 pitches match its sol-fa answer but the answers give pitch only, Example 2's quaver beam is displaced in the render, and the note calls raised lah 'le (taw)' ('ta' is the lowered ti). New lesson gives method, corrected chromatic names and a complete engraved example with beats.",
     "Supersedes the earlier statement that no staff example could be checked; original drawings read from a LibreOffice render; written only."),
    ('SL-562', 'REPLACEMENT_IMPLEMENTED', 'supplement', 'SUP-MUSIC-TRANSPOSE-DOMINANT', 'The dominant key has its doh on the 5th note',
     "Checked: the Week 4 worked examples go an octave lower into the bass clef and from F major to G major (a tone higher); the drawn answers are correct but the dominant of F is C, so transposition to the dominant is not shown. New lesson teaches the method with engraved C to G and F to C examples and an F# example.",
     "Written only; bass-clef transposition is not re-taught because the scheme objective is the dominant key."),
    ('SL-566', 'REPLACEMENT_IMPLEMENTED', 'supplement', 'SUP-MUSIC-PRACTICAL', 'never goes lower than doh',
     "Changed: the previous model put a note below doh (bar 7, low t) with no octave stated; the model now stays between doh and soh, has eight complete 4/4 bars in C and in G major (independently re-parsed), and states how to choose the octave.",
     "Written lesson and rubric only; an observed practical is needed; no performance claimed."),
    ('SL-567', 'REPLACEMENT_IMPLEMENTED', 'supplement', 'SUP-MUSIC-PRACTICAL', 'Choose the octave in which the notes of the melody are comfortable',
     "Changed with SL-566: instrument preparation text now leaves the octave to the performer and keeps the checklist and rubric.",
     "Instrument fingering references are the existing sources; no performance claimed."),
    ('SL-062', 'REPLACEMENT_IMPLEMENTED', 'supplement', 'SUP-CCA-EXHIBITION-PRACTICAL', 'Layout: group related works together',
     "Read: the original row covers exhibition types, display methods and security but gives no planning task; the existing decision stays valid for the theory. New lesson adds a class exhibition task, labels, layout, safe display and criteria.",
     "The display itself is observed by the teacher; hanging height is a common gallery guideline, not a rule."),
    ('SL-063', 'REPLACEMENT_IMPLEMENTED', 'supplement', 'SUP-CCA-EMBROIDERY-PRACTICAL', 'Back stitch: bring the needle up',
     "Read: the original row names stitches and kinds of embroidery but has no step-by-step stitching; the existing decision stays valid for the theory. New lesson adds running, back and satin stitch steps, safe needle use and criteria.",
     "Stitching skill is observed by the teacher; chain, blanket and cross stitch are not taught."),
]
# verify anchors literally
for cid, disp, kind, filt, anchor, rat, lim in ORIG:
    if kind == 'original':
        subj, term, order = filt.split('|')
        fe = {'Music': 'music.docx' if (term == '2nd Term') else 'MUSIC.docx', 'Cultural & Creative Arts': 'CCA jss3 ALP 2018.docx'}[subj]
        r = find(fe, term, order, subj)
        assert anchor in r['sourceReference'], (cid, anchor)
    elif kind == 'supplement':
        assert anchor in BYID[filt]['body'], (cid, anchor)
with open(f'{OUT}/DECISIONS.csv', 'w', encoding='utf-8', newline='') as f:
    w = csv.writer(f, lineterminator='\n')
    w.writerow(['candidate_id', 'disposition', 'support_kind', 'row_filter', 'anchor_regex', 'rationale', 'limitation'])
    for r in ORIG:
        w.writerow(r)

# ---------------------------------------------------------------- delivery corrections
cad = find('music.docx', '2nd Term', 7, 'Music')
bat = find_body('Synthrapol', 'Cultural & Creative Arts')
trn = find_body('le (taw)', 'Music') if any('le (taw)' in r['sourceReference'] for r in rows if r['subjectName'] == 'Music') else None
m3 = find('music.docx', '2nd Term', 3, 'Music')
m4 = find('music.docx', '2nd Term', 4, 'Music')
corr = [
    {'id': 'JSS3-MUSIC-CADENCES-PLAGAL-FAH-ME', 'class_name': 'JSS 3', 'school_code': 'secondary', 'source_body_sha256': sha(cad['sourceReference']),
     'source_title': cad['title'], 'replacement_lesson_ids': ['SUP-MUSIC-CADENCES'],
     'reason': "The row gives 'e.g fah- me' as the plagal cadence. A plagal cadence is chord IV to chord I (roots fah and doh); 'me' is the third of chord I. Pupils would learn a wrong example and AI grounding would repeat it.",
     'affected_summary_and_question_paths': ["topic summary: sentence containing 'e.g fah- me' under the plagal cadence", "any generated question or answer that uses 'fah - me' as the plagal cadence"]},
    {'id': 'JSS3-CCA-BATIK-UNSUPERVISED-HOT-WAX', 'class_name': 'JSS 3', 'school_code': 'secondary', 'source_body_sha256': sha(bat['sourceReference']),
     'source_title': bat['title'], 'replacement_lesson_ids': ['SUP-CCA-BATIK-PRACTICAL'],
     'reason': "The row tells the reader to melt wax in a pot or old electric frying pan at about 220-230 F, tub-dye with soda ash, boil the wax out and iron it, with no adult supervision or safety rules and with product names from a craft shop. For JSS3 pupils this is unsafe as an unsupervised procedure; the replacement keeps the batik idea, makes paste-resist the pupil activity and keeps heat and chemicals with the teacher.",
     'affected_summary_and_question_paths': ["topic summary: Steps 3, 6 and 9 (melting wax, soda ash dye bath, boiling and ironing the wax out)", "any generated question or step list that tells a pupil to heat wax or boil fabric"]},
    {'id': 'JSS3-MUSIC-MINOR-SCALES-FLATS-LOST', 'class_name': 'JSS 3', 'school_code': 'secondary', 'source_body_sha256': sha(m3['sourceReference']),
     'source_title': m3['title'], 'replacement_lesson_ids': ['SUP-MUSIC-HARMONIC-MINOR'],
     'reason': "The drawn staves are correct but the text layer loses the flat signs (B-flat reads as B, E-flat as E) and the G minor letter row ends on A; a text-only summary or AI grounding would state wrong scales.",
     'affected_summary_and_question_paths': ["topic summary: the letter rows under D minor, E minor and G minor", "any generated question or answer listing D, E or G minor notes without flats"]},
    {'id': 'JSS3-MUSIC-RELATIVE-KEYS-FLATS-LOST', 'class_name': 'JSS 3', 'school_code': 'secondary', 'source_body_sha256': sha(m4['sourceReference']),
     'source_title': m4['title'], 'replacement_lesson_ids': ['SUP-MUSIC-RELATIVE-KEYS'],
     'reason': "The key-signature table is drawn; in plain text the flats are lost so flat keys read 'B major, E major, A major' with minors 'B minor, E minor, A minor'.",
     'affected_summary_and_question_paths': ["topic summary: the lists of flat major keys and their relative minors", "any generated question or answer naming relative minors of flat keys"]},
]
if trn is not None:
    corr.append({'id': 'JSS3-MUSIC-SOLFA-LE-TAW', 'class_name': 'JSS 3', 'school_code': 'secondary', 'source_body_sha256': sha(trn['sourceReference']),
                 'source_title': trn['title'], 'replacement_lesson_ids': ['SUP-MUSIC-STAFF-TO-SOLFA'],
                 'reason': "The row says raised lah becomes 'le (taw)'. In tonic sol-fa raised lah is 'le'; 'ta' (said 'taw') is the lowered ti.",
                 'affected_summary_and_question_paths': ["topic summary: the chromatic names list ending 'le (taw)'"]})
json.dump(corr, open(f'{OUT}/DELIVERY_CORRECTIONS.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)

# ---------------------------------------------------------------- source hashes for evidence
ws = {r['candidate_id']: r for r in csv.DictReader(open(sys.argv[3], encoding='utf-8'))}
ev = []
SUPPLIED = {
    'SL-423': 'Supplied: engraved D/E/G harmonic minor scales with key signatures, relative majors, semitone pattern, marked questions. Inferred: none. Source facts checked by reading the rendered drawn staves.',
    'SL-424': 'Supplied: engraved sharp and flat key-signature tables to four, method for finding keys, marked questions. Inferred: none.',
    'SL-425': 'Supplied: five-step method, engraved worked answer for one exercise, marking guide for the other.',
    'SL-427': 'Supplied: chord identities, engraved cadences in C major, G major chords, correction of the plagal example.',
    'SL-561': 'Supplied: method, corrected chromatic names, complete engraved example with beats, marked questions.',
    'SL-562': 'Supplied: dominant-key method, engraved C to G, F to C and F# examples, marked questions.',
    'SL-559': 'Supplied: answers and reasons for revision items except the ambiguous fifth chord. Inferred: that the chord task is to name triads (from the example F major).',
    'SL-521': 'Supplied: visual-unity teaching, two design tasks, criteria. Source essay untouched.',
    'SL-523': 'Supplied: safe paste-resist class activity, safety rules, burn first aid, criteria. Source procedure superseded for pupils.',
    'SL-294': 'Supplied: letter parts, spacing, layout, three practical tasks, criteria.',
    'SL-062': 'Supplied: exhibition planning task, label content, layout and safety, criteria.',
    'SL-063': 'Supplied: three stitches, safe needle use, criteria.',
    'SL-566': 'Supplied: octave-neutral eight-bar model in C and G major, rubric unchanged.',
    'SL-567': 'Supplied: octave-neutral instrument preparation.',
}
LIMITS = 'Written/prepared teaching only; no practical performance or teacher certification claimed; delivery order indexes to be resolved by integration.'
for cid, disp, kind, filt, anchor, rat, lim in ORIG:
    w = ws[cid] if cid in ws else None
    e = {'candidate_id': cid, 'disposition': disp,
         'objective': w['objective_text'] if w else None,
         'source_document': w['source_document'] if w else None, 'source_sha256': w['source_sha256'] if w else None,
         'source_locator': (f"source_text_line={w['source_text_line']}" if w else None),
         'components': [], 'supporting': ({'type': kind, 'selector': filt, 'anchor': anchor} if kind != 'marker' else {'type': 'marker'}),
         'supplied_vs_inferred': SUPPLIED.get(cid, 'Read-only decision; nothing supplied.'), 'remaining_limits': (lim + ' ' + LIMITS).strip()}
    ev.append(e)
COMP = {
    'SL-423': ['D harmonic minor with key signature', 'E harmonic minor with key signature', 'G harmonic minor with key signature'],
    'SL-424': ['relative minors of major keys to four sharps', 'relative minors of major keys to four flats'],
    'SL-425': ['stress and speech rhythm', 'setting words to a melody', 'worked answer'],
    'SL-427': ['perfect', 'imperfect', 'plagal', 'interrupted'],
    'SL-561': ['find key and doh', 'name notes in sol-fa', 'octave marks', 'beats and rhythm in the answer'],
    'SL-562': ['identify dominant key', 'new key signature', 'rewrite notes', 'check accidentals'],
    'SL-559': ['ten fill-in items', 'chord naming item', 'highlife, duet and trio', 'relative keys', 'interval and triad'],
    'SL-521': ['visual unity meaning', 'ways to create unity', 'design task', 'criteria'],
    'SL-523': ['resist idea', 'procedure', 'supervision and safety', 'criteria'],
    'SL-294': ['letter parts', 'spacing', 'layout', 'practical task', 'criteria'],
    'SL-062': ['label content', 'layout', 'safe display', 'class task'],
    'SL-063': ['running stitch', 'back stitch', 'satin stitch', 'safe needle use'],
    'SL-566': ['eight complete bars', 'C and G major', 'playable pitch range'],
    'SL-567': ['voice', 'piano', 'recorder'],
    'SL-060': ['Nigerian traditional art traditions'], 'SL-422': ['solo', 'duet', 'trio', 'quartet'], 'SL-560': ['Baroque', 'Classical', 'Romantic'],
}
for e in ev:
    e['components'] = COMP.get(e['candidate_id'], ['structural marker'])
json.dump(ev, open(f'{OUT}/OBJECTIVE_EVIDENCE.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)

# ---------------------------------------------------------------- assets
built = json.load(open(f'{OUT}/assets/_built.json'))
import verovio
ver = verovio.toolkit().getVersion()
ALT = {
 'harmonic-minor-d-e-g': ('SUP-MUSIC-HARMONIC-MINOR', 'D, E and G harmonic minor scales on the treble staff with sol-fa',
   'Three treble-clef staves in 4/4. D harmonic minor, one flat: D E F G A Bb C# D. E harmonic minor, one sharp: E F# G A B C D# E. G harmonic minor, two flats: G A Bb C D Eb F# G. Sol-fa under each: l t d r m f se l.'),
 'key-signatures-sharps': ('SUP-MUSIC-RELATIVE-KEYS', 'Key signatures with one to four sharps',
   'Four treble staves, each with a key signature and a rest: G major or E minor (F#); D major or B minor (F# C#); A major or F# minor (F# C# G#); E major or C# minor (F# C# G# D#).'),
 'key-signatures-flats': ('SUP-MUSIC-RELATIVE-KEYS', 'Key signatures with one to four flats',
   'Four treble staves, each with a key signature and a rest: F major or D minor (Bb); Bb major or G minor (Bb Eb); Eb major or C minor (Bb Eb Ab); Ab major or F minor (Bb Eb Ab Db).'),
 'words-melody-example': ('SUP-MUSIC-WORDS-MELODY', 'Melody for the words I am coming home',
   '2/4, C major. Upbeat E F (I am), bar 1 G E (com-ing) as crotchets, bar 2 C as a minim (home). Sol-fa m f | s m | d.'),
 'cadences-c-major': ('SUP-MUSIC-CADENCES', 'Four cadences in C major',
   'Four staves of two chords each as minims: V to I is G-B-D then C-E-G; I to V is C-E-G then G-B-D; IV to I is F-A-C then C-E-G; V to vi is G-B-D then A-C-E.'),
 'staff-to-solfa-example': ('SUP-MUSIC-STAFF-TO-SOLFA', 'Worked staff to sol-fa example in G major',
   'G major, 4/4, one-beat upbeat. Notes D | G G A B | B A G A | B A F# A | G dotted minim. Sol-fa: s, | d : d : r : m | m : r : d : r | m : r : t, : r | d : - : -.'),
 'transposition-c-to-g': ('SUP-MUSIC-TRANSPOSE-DOMINANT', 'Tune transposed from C major to G major',
   'Question in C major, 2/4: E D C | D G (m r d | r s). Answer in G major, one sharp, a perfect 5th higher: B A G | A D.'),
 'transposition-f-to-c': ('SUP-MUSIC-TRANSPOSE-DOMINANT', 'Tune transposed from F major to C major',
   'Question in F major, one flat, 2/4: A G F | G C (m r d | r s). Answer in C major, a perfect 4th lower: E D C | D G.'),
 'transposition-f-sharp-example': ('SUP-MUSIC-TRANSPOSE-DOMINANT', 'Worked example with F-sharp: C major to G major',
   'Question in C major, 4/4: C E G A | B C. Answer in G major, one sharp: G B D E | F# G.'),
 'practical-model-melody': ('SUP-MUSIC-PRACTICAL', 'Eight-bar model melody in C major and G major',
   'Eight 4/4 bars each. C major: C D E C | E F G(minim) | G F E F | E D G(minim) | C D E C | E F G(minim) | F E D(minim) | C(semibreve). G major: the same melody a perfect 5th higher, G A B G | B C D | D C B C | B A D | G A B G | B C D | C B A | G.'),
}
assets = []
for name, meta in built.items():
    lid, cap, alt = ALT[name]
    assets.append({'file': f'assets/{meta["file"]}', 'sha256': meta['sha256'], 'mime': 'image/png', 'width': meta['size'][0], 'height': meta['size'][1],
                   'target_lesson_id': lid, 'occurrence': 'after the paragraph that begins "Figure" or "A worked example" in the lesson body',
                   'caption': cap, 'alt_text': alt, 'order_index': None,
                   'provenance': 'Newly composed exercise notation, not a recovered source graphic. Source data in assets/musicxml/. Generated by generator/build_assets.py with generator/notation.py (MusicXML -> Verovio %s SVG -> cairosvg PNG); labels set in DejaVu Sans. No AI image generation.' % ver,
                   'licence': 'Original work prepared for the STS School App project under the owner\'s authorisation; engraved with Verovio (LGPL-3.0, Leipzig music font under the SIL Open Font Licence per Verovio documentation) and DejaVu Sans (free licence). Licence terms not independently audited.',
                   'generator': 'generator/build_assets.py', 'source_recovered_graphic': False})
json.dump(assets, open(f'{OUT}/ASSETS.json', 'w', encoding='utf-8'), indent=1, ensure_ascii=False)

# ---------------------------------------------------------------- blockers
B = [
 ['SL-559', "Fifth chord of the Omega Week 1 revision exercise", "Rendered drawing: C and E on the staff with a third note touching E, at F or G; instruction line for the item is absent from the document", "Which note is drawn (C-E-G gives C major) and the intended instruction", "The drawn pitch cannot be read with certainty from the render and the document text lacks the stem; an Alpha or Word render by the owner or teacher would settle it"],
 ['SL-559', "Revision item 10 'fifth line'", "The F (bass) clef fixes F on the fourth line; the fifth line is A", "Which answer the school expects", "Teacher decision; the lesson states both facts"],
 ['SL-424', "Original drawn key-signature table (sharp row)", "LibreOffice render shows several sharp signatures without crossbars, so counts and positions cannot be certified", "A Word render or the original RTF view of the table", "The new lesson does not depend on it; this only affects whether the original drawing can be called correct"],
 ['ALL-MUSIC', "Original RTF as visual authority", "The pack's RTF is the Alpha (First-Term) Music note; this worker rendered the Second- and Third-Term DOCX drawings with LibreOffice and did not open the RTF", "Confirmation that no Second- or Third-Term RTF exists", "Not supplied in the pack"],
 ['ALL', "Real importer capture", "Row hashes and anchors were checked against the packaged capture (portable_verification/capture/original-rows.json), not a fresh scripts/jss3/capture_rows.py run", "Run capture_rows.py on Node 24.19.0 and compare", "Sandbox has Node 22.22.2; rerun requirement preserved"],
 ['ALL', "Order indexes and term buckets of the new lessons", "Lessons carry stable IDs and term labels but no final order index", "Combined capture and assignment of order_index in the asset manifest", "Owned by the integration worker"],
 ['ALL-PRACTICAL', "Observed practical performance", "Voice, piano, recorder, embroidery, lettering, batik and exhibition tasks are scored by an observer", "Teacher-observed performances", "A written test cannot certify practical competence"],
]
with open(f'{OUT}/BLOCKERS.csv', 'w', encoding='utf-8', newline='') as f:
    w = csv.writer(f, lineterminator='\n'); w.writerow(['objective', 'what', 'evidence', 'missing_item_or_decision', 'why_authority_or_sources_cannot_resolve'])
    for b in B: w.writerow(b)

# ---------------------------------------------------------------- vector-drawing scan of all 39 sources (cross-subject finding)
scan = []
base = f'{INPUTS}/ALL'
for root, _, fs in os.walk(base):
    for fn in fs:
        if fn.endswith('.docx'):
            pth = os.path.join(root, fn)
            try:
                x = zipfile.ZipFile(pth).read('word/document.xml').decode('utf8', 'ignore')
            except Exception:
                continue
            scan.append((os.path.relpath(pth, base), x.count('<w:drawing'), x.count('<v:shape') + x.count('<v:line') + x.count('<wps:wsp'), x.count('<w:object'), x.count('<m:oMath')))
scan.sort(key=lambda t: -(t[2] + t[1]))
json.dump(scan, open(f'{OUT}/tests/vector_drawing_scan.json', 'w'), indent=1)
print('ok', len(ups), 'upserts;', len(ORIG), 'decisions;', len(corr), 'corrections;', len(assets), 'assets;', 'verovio', ver)
print(scan[:8])
