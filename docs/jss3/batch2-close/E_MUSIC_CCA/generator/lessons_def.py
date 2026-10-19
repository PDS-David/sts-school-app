# -*- coding: utf-8 -*-
"""Lesson definitions (pupil-facing text uses ASCII Bb / F# so every device shows them)."""

AUTH = ("New teaching material prepared under the owner's authorisation to complete JSS3 Batch 2 (Batch 2 close pack, "
        "18 Oct 2026). ")
NOTRECOVERED = " This lesson is new teaching material, not recovered school-source text, and it does not certify performance."

WIKI = lambda t, u: {'title': t, 'url': u}

LESSONS = []


def add(**kw):
    LESSONS.append(kw)


# ---------------------------------------------------------------- MUSIC
add(op='add', id='SUP-MUSIC-HARMONIC-MINOR', gapIds=['WG-MUSIC-SL423'], subjectName='Music', termLabel='2nd Term',
    title='Harmonic minor scales of D, E and G with their key signatures (flats and sharps written out)',
    sources=[WIKI('Wikipedia - Minor scale (natural, harmonic and melodic forms)', 'https://en.wikipedia.org/wiki/Minor_scale'),
             WIKI('Wikipedia - Key signature', 'https://en.wikipedia.org/wiki/Key_signature'),
             WIKI('Wikipedia - Tonic sol-fa (la-based minor, se)', 'https://en.wikipedia.org/wiki/Tonic_sol-fa')],
    origin=AUTH + "The Second-Term (Sigma) Music note, Week 3, teaches D, E and G harmonic minor with staves that are drawn shapes in the document; when the note is read as plain text the flat signs are lost (B-flat reads as B) and the G minor letter row ends on A although the drawn last note is G. This lesson restates the three scales with every flat and sharp written out and with newly engraved notation. The original drawn staves are not reproduced." + NOTRECOVERED,
    body="""Objectives: write the harmonic minor scales of D, E and G with their key signatures, name the notes in letters and sol-fa, and find each relative major.
Link to your notes: Week 3 of your Second-Term music note draws F major with D minor, G major with E minor, and Bb major with G minor. In a copy or a plain-text view the flat signs can disappear, so Bb may look like B. This lesson writes every flat (b) and sharp (#) in words and shows the scales on the staff.
Teaching:
1. A minor scale starts on the 6th note (lah) of its relative major. D minor comes from F major, E minor from G major and G minor from Bb major. A minor key uses the key signature of its relative major.
2. The harmonic minor scale raises the 7th note by a semitone. The steps are: tone, semitone, tone, tone, semitone, tone-and-a-half (three semitones, called an augmented second), semitone. In la-based sol-fa the scale is l t d r m f se l, where se is soh raised by a semitone.
3. The raised 7th is not in the key signature. Write its sharp as an accidental every time that note appears.
The three scales (sol-fa for all three: l t d r m f se l):
D harmonic minor - key signature one flat (Bb): D E F G A Bb C# D. Accidental: C#.
E harmonic minor - key signature one sharp (F#): E F# G A B C D# E. Accidental: D#.
G harmonic minor - key signature two flats (Bb and Eb): G A Bb C D Eb F# G. Accidental: F#.
The three-semitone step is always between the 6th and 7th notes: Bb to C# in D minor, C to D# in E minor, Eb to F# in G minor.
Figure: three staves in treble clef, each with its key signature, eight crotchets from the minor key note up to the next octave, the raised 7th marked with a sharp, and the sol-fa under every note.
Check yourself: the scale ends on the note it began on; each of the seven letter names is used once; the flats or sharp from the key signature are present; the raised 7th has its sharp.
Common slips: writing D minor as D E F G A B C# D (the flat is missing); ending G minor on A instead of G; putting the sharp of the raised 7th into the key signature.
Practice (questions):
1. Write the D harmonic minor scale in letters. State its key signature and the accidental.
2. Give the relative major of E minor, G minor and D minor.
3. Which two notes of G harmonic minor are three semitones apart?
4. What is the sol-fa name of the raised 7th note, and which letter is it in E minor?
5. A pupil writes G minor as G A B C D E F# A. Find three mistakes and write the correct scale.
Answers and marking guide:
1 (4 marks): key signature Bb (1); D E F G A Bb C# D (2); C# is an accidental and not in the key signature (1).
2 (3 marks): G major, Bb major, F major (1 each).
3 (2 marks): Eb and F# (1 each).
4 (2 marks): se (1); D# (1).
5 (3 marks): B must be Bb (1); E must be Eb (1); the last note must be G (1). Correct scale: G A Bb C D Eb F# G.
Assessment and feedback: 14 marks. 12-14 secure; 8-11 developing (rewrite each scale from the semitone pattern); below 8 reteach the relative major method. Written work only; singing the scales is checked by the teacher.
""")

add(op='add', id='SUP-MUSIC-RELATIVE-KEYS', gapIds=['WG-MUSIC-SL424'], subjectName='Music', termLabel='2nd Term',
    title='Relative major and minor keys with up to four sharps and four flats',
    sources=[WIKI('Wikipedia - Relative key', 'https://en.wikipedia.org/wiki/Relative_key'),
             WIKI('Wikipedia - Key signature (order of sharps and flats)', 'https://en.wikipedia.org/wiki/Key_signature')],
    origin=AUTH + "The Second-Term (Sigma) Music note, Week 4, gives a table of key signatures and relative minors drawn as shapes on the staff. In plain text the flat signs are lost, so flat keys appear as 'B major', 'E major', 'A major' and their minors as 'B minor', 'E minor', 'A minor'; in the rendered drawing the sharp row is also partly unreadable. This lesson supplies a checked, newly engraved table for keys up to four sharps and four flats. The original drawings are not reproduced." + NOTRECOVERED,
    body="""Objectives: name the relative minor of a major key and the relative major of a minor key; read key signatures with up to four sharps or four flats.
Link to your notes: Week 4 of your note lists major keys and their relative minors with the signatures drawn on the staff. If your copy shows a flat key as 'B major' or 'E minor', a flat sign has been lost: the flat keys are Bb, Eb and Ab. This lesson gives the table with every sign written out.
Teaching:
1. The relative minor starts on the 6th note (lah) of the major scale, three semitones below the major key note. Both keys share one key signature. C major and A minor have no sharps or flats.
2. Sharps are added in this order: F C G D A E B. Flats are added in the opposite order: B E A D G C F.
3. Keys with sharps (major / relative minor): G / E minor (F#); D / B minor (F# C#); A / F# minor (F# C# G#); E / C# minor (F# C# G# D#).
4. Keys with flats: F / D minor (Bb); Bb / G minor (Bb Eb); Eb / C minor (Bb Eb Ab); Ab / F minor (Bb Eb Ab Db).
5. To find the major key from a signature with sharps: the last sharp is ti, so doh is the next note up (four sharps, last sharp D#, doh = E, so E major). With two or more flats, the second-last flat is doh (three flats Bb Eb Ab, second-last Eb, so Eb major). One flat is F major. Then count down three semitones (or take lah) for the relative minor.
Figures: two engraved pages, one with the sharp signatures and one with the flat signatures, each labelled with its major and relative minor.
Practice (questions):
1. Write the relative minor of D major, Bb major and Ab major.
2. Write the relative major of C# minor, G minor and F minor.
3. A signature has F#, C# and G#. Name the major key and its relative minor.
4. A signature has Bb, Eb and Ab. Name the major key and its relative minor.
5. How many sharps does E major have? Name them in order.
Answers and marking guide:
1 (3 marks): B minor, G minor, F minor (1 each).
2 (3 marks): E major, Bb major, Ab major (1 each).
3 (2 marks): A major (1) and F# minor (1).
4 (2 marks): Eb major (1) and C minor (1).
5 (2 marks): four (1); F#, C#, G#, D# (1).
Assessment and feedback: 12 marks. 10-12 secure; 6-9 developing (use the table and the order of sharps and flats again); below 6 reteach the relative-minor step (lah). Written work only.
""")

add(op='add', id='SUP-MUSIC-WORDS-MELODY', gapIds=['WG-MUSIC-SL425'], subjectName='Music', termLabel='2nd Term',
    title='Adding a short melody to given words: speech rhythm, stress and a worked example',
    sources=[WIKI('Wikipedia - Word stress', 'https://en.wikipedia.org/wiki/Stress_(linguistics)'),
             WIKI('Wikipedia - Anacrusis (upbeat or pick-up)', 'https://en.wikipedia.org/wiki/Anacrusis'),
             WIKI('Wikipedia - Tone (linguistics)', 'https://en.wikipedia.org/wiki/Tone_(linguistics)')],
    origin=AUTH + "The Second-Term (Sigma) Music note, Week 5, explains speech rhythm with the Yoruba phrase 'Joo fun wa lorin' and the sentence 'Cake and biscuits are on sale', each drawn as note values over the words, and then sets the exercises 'I am coming home' and 'I will come again tomorrow'. The note gives no worked answer to an exercise. This lesson adds a complete worked answer for 'I am coming home' with newly engraved notation and a marking guide for the second exercise. The original drawn rhythms are not reproduced. No traditional tune or tone pattern is invented." + NOTRECOVERED,
    body="""Objectives: set a short sentence to a melody so that the stressed words fall on strong beats, write it on the staff and in sol-fa, and end it correctly.
Link to your notes: Week 5 says every language has its own rhythm and that the accents of the words must fall on the accented beats. Your exercises are 'I am coming home' and 'I will come again tomorrow'. This lesson shows one finished answer and the steps to build the second.
Teaching - five steps:
1. Say the words naturally and clap them. Find the stressed syllables (louder or longer): I am COM-ing HOME.
2. Choose a time signature. In 2/4 beat 1 is strong; in 4/4 beats 1 and 3 are strong. Put stressed syllables on strong beats. Weak words at the start can be an upbeat (pick-up) before the first bar line.
3. Give one note to each syllable. Stressed syllables may be longer or higher; the last word usually gets a long note.
4. Choose the key and the notes. Move mostly by step, end on doh.
5. Check: every full bar adds up; the upbeat plus the last bar make one full bar; sing it and make sure the words sound natural.
Worked example (figure): 'I am coming home' in 2/4, C major, doh = C. The upbeat is two quavers (I am) = one beat; bar 1 is two crotchets (COM-ing); bar 2 is one minim (HOME).
Letters: E F | G E | C. Sol-fa: m f | s m | d. The stressed syllables COM and HOME fall on beat 1 of their bars, and the tune ends on doh.
Languages such as Yoruba are tone languages: the rise and fall of the voice changes meaning. When you set words from your own language, say them aloud first and ask a fluent speaker to check that your melody does not change the meaning. This lesson notates English words.
Practice (questions):
1. Underline the stressed syllables in 'I am coming home'.
2. How many notes does 'I will come again tomorrow' need if each syllable has one note?
3. A pupil sets to-MOR-row with MOR on a short note on a weak beat. What is wrong?
4. Write a melody for 'I will come again tomorrow' in C major (2/4 or 4/4). Put COME, GAIN and MOR on strong beats and end on doh. Show the staff, letters and sol-fa.
Answers and marking guide:
1 (2 marks): COM and HOME.
2 (2 marks): 8 (I-will-come-a-gain-to-mor-row).
3 (2 marks): the stressed syllable falls on a weak beat (1), so the word sounds wrong when sung (1).
4 (9 marks): eight syllables each have a note (2); COME, GAIN and MOR on strong beats (3); every full bar adds up and any upbeat plus last bar make one full bar (2); correct key and sol-fa or letters (1); ends on doh (1). Many answers are correct.
Assessment and feedback: 15 marks. 12-15 secure; 8-11 developing (clap the words again and mark the stress); below 8 reteach with the five steps. Written work only; singing the melody is checked by the teacher.
""")

add(op='add', id='SUP-MUSIC-CADENCES', gapIds=['WG-MUSIC-SL427'], subjectName='Music', termLabel='2nd Term',
    title='Cadences: perfect, imperfect, plagal and interrupted, with the chords',
    sources=[WIKI('musictheory.net - Cadences (half, authentic, plagal and deceptive cadences)', 'https://musictheory.net/lessons/55'),
             WIKI('Music Theory for the 21st-Century Classroom - Cadences', 'https://musictheory.pugetsound.edu/mt21c/cadences.html')],
    origin=AUTH + "The Second-Term (Sigma) Music note, Week 7, names four cadences but gives the plagal example as 'fah - me'; a plagal cadence is the chord IV to chord I, whose root notes are fah and doh. The note has no notation of the chords. This lesson gives the chord identities with newly engraved chords. It overlaps the existing Cultural and Creative Arts lesson SUP-CCA-CADENCES, which serves pupils of that subject; this is the Music-subject lesson." + NOTRECOVERED,
    body="""Objectives: name the four cadences, say which chords make each one, and write them in C major and G major.
Link to your notes: Week 7 says a cadence is two chords that end a phrase, like a comma or full stop in language. It names the perfect, imperfect, plagal and interrupted cadences. This lesson shows the chords.
Teaching (roman numerals: I tonic, ii supertonic, IV subdominant, V dominant, vi submediant):
Perfect cadence (also authentic, full close, closed cadence): V to I. Sol-fa roots: soh then doh. It sounds finished.
Imperfect cadence (also half close): any chord to V, for example I to V (doh then soh) or ii to V (ray then soh). It sounds unfinished, like a comma.
Plagal cadence (the 'Amen' cadence): IV to I. Sol-fa roots: fah then doh. Take care: fah to me is not the cadence; me is the third of chord I, not its root.
Interrupted cadence (also deceptive or surprise): V to vi. Sol-fa roots: soh then lah. The ear expects I and hears vi instead.
Chords in C major: I C-E-G; ii D-F-A; IV F-A-C; V G-B-D; vi A-C-E.
Chords in G major: I G-B-D; ii A-C-E; IV C-E-G; V D-F#-A; vi E-G-B.
Figure: four engraved cadences in C major with the chord numerals under each chord.
Practice (questions):
1. Name the cadence: V to I; I to V; IV to I; V to vi.
2. Write the chords V and vi in G major.
3. Which two cadences end on chord I?
4. In C major, which sol-fa root notes make a plagal cadence?
5. A pupil says a plagal cadence is fah - me. Correct the statement.
Answers and marking guide:
1 (4 marks): perfect (authentic); imperfect (half); plagal (Amen); interrupted (deceptive) - 1 each.
2 (2 marks): V = D F# A (1); vi = E G B (1).
3 (2 marks): perfect and plagal.
4 (2 marks): fah then doh (F then C).
5 (2 marks): a plagal cadence is chord IV to chord I (1); its roots are fah then doh, not fah then me (1).
Assessment and feedback: 12 marks. 10-12 secure; 6-9 developing (replay the chords and say the numerals); below 6 reteach V to I first. Written work only.
""")

add(op='add', id='SUP-MUSIC-STAFF-TO-SOLFA', gapIds=['WG-MUSIC-SL561'], subjectName='Music', termLabel='1st Term',
    title='Transcribing from the staff to tonic sol-fa: key, doh, octave marks and a complete worked example',
    sources=[WIKI('Wikipedia - Tonic sol-fa (syllables, octave marks, chromatic names)', 'https://en.wikipedia.org/wiki/Tonic_sol-fa'),
             WIKI('Wikipedia - Key signature', 'https://en.wikipedia.org/wiki/Key_signature')],
    origin=AUTH + "The Third-Term (Omega) Music note, Week 3, defines transcription and shows two examples drawn as shapes on the staff with the sol-fa answer beneath; the answers give pitch letters only, with no bar lines or note lengths, and the quaver beam in Example 2 is displaced when the document is rendered. It also describes raised lah as 'le (taw)'; 'ta' (said 'taw') is the lowered ti, while raised lah is 'le'. This lesson gives a complete newly engraved worked example with beats, the key method and corrected chromatic names. Third-Term instruction is placed in the First Term. The original drawn staves are not reproduced." + NOTRECOVERED,
    body="""Objectives: change music from the staff into tonic sol-fa, finding the key and doh first, showing the beats and the octave marks.
Link to your notes: your Week 3 note says that to transcribe you must know the clef and the line and space names, the key signature, and the note values. This lesson adds a method and a finished example.
Teaching:
1. Find the key from the key signature. No sharps or flats: C major. One sharp (F#): G major. Two sharps: D major. One flat (Bb): F major.
2. Find doh. In C major doh is C: middle C is on the ledger line below the treble staff, and the C in the third space is doh an octave higher. In G major doh is G: the second line is G, and the next G is in the space above the top line.
3. Name every note by its distance from doh. C major: C d, D r, E m, F f, G s, A l, B t. G major: G d, A r, B m, C f, D s, E l, F# t.
4. Octave marks: a comma after the letter means the note is in the octave below doh (t, is ti below doh); an apostrophe means above (d' is the next doh up).
5. Show the beats: a bar line | between bars, a colon : between beats, and a dash for a note held across a beat.
6. Accidentals: a raised note takes the names de, re, fe, se, le; a lowered note takes ta, la, sa, ma, ra. In C major, F# is fe and Bb is ta ('taw'). Raised lah is le; ta is the lowered ti and is not another name for le.
Worked example (figure): G major, 4/4, one-beat upbeat. Notes: D | G G A B | B A G A | B A F# A | G (dotted minim).
Sol-fa with beats: s, | d : d : r : m | m : r : d : r | m : r : t, : r | d : - : -
Why: the key signature is one sharp, so G major and doh is G. The upbeat D is below doh, so s,. F# below G is ti below doh, so t,. The upbeat is one beat and the last bar is three, together one full bar.
Practice (questions):
1. A staff has one sharp (F#) in its signature. Name the key and doh.
2. In G major, write the sol-fa for G, B, D (above G), C and F# (below G).
3. In C major, write the sol-fa for C, E, G, A and B.
4. In C major, name the sol-fa syllables for F# and Bb.
5. Why is a row of sol-fa letters with no bar lines or beats not a complete transcription?
Answers and marking guide:
1 (2 marks): G major (1); doh is G (1).
2 (5 marks): d, m, s, f, t, (1 each).
3 (5 marks): d, m, s, l, t (1 each).
4 (2 marks): fe and ta.
5 (2 marks): it does not show how long each note lasts or where the bars and beats fall (2).
Assessment and feedback: 16 marks. 13-16 secure; 9-12 developing (redo the letter-to-sol-fa table for the key); below 9 reteach key and doh. Written work only; the transcription is not a sung performance.
""")

add(op='add', id='SUP-MUSIC-TRANSPOSE-DOMINANT', gapIds=['WG-MUSIC-SL562'], subjectName='Music', termLabel='2nd Term',
    title='Transposing a tune to its dominant key: method and worked examples',
    sources=[WIKI('Wikipedia - Transposition (music)', 'https://en.wikipedia.org/wiki/Transposition_(music)'),
             WIKI('Wikipedia - Dominant (music)', 'https://en.wikipedia.org/wiki/Dominant_(music)'),
             WIKI('Wikipedia - Tonic sol-fa', 'https://en.wikipedia.org/wiki/Tonic_sol-fa')],
    origin=AUTH + "The Third-Term (Omega) Music note, Week 4, is titled 'Transposition from one key to its dominant'. Its drawn examples move a tune an octave lower into the bass clef and then from F major to G major, which is a tone higher; the dominant of F major is C major, so the scheme title is not demonstrated, and the bass clef in the drawn answer is only partly drawn. This lesson teaches transposition to the dominant with newly engraved, checked examples. Third-Term instruction is placed in the Second Term. The original drawn staves are not reproduced." + NOTRECOVERED,
    body="""Objectives: transpose a short tune into its dominant key, writing the new key signature and the notes correctly.
Link to your notes: Week 4 says a good knowledge of intervals is needed to transpose a tune. Its title is 'transposition from one key to its dominant'. This lesson shows that exact move.
Teaching:
1. Transposing means writing the same tune at a different pitch. The tune keeps its sol-fa; only doh moves.
2. The dominant key has its doh on the 5th note (soh) of the old key. C major to G major; F major to C major; G major to D major; D major to A major.
3. The move is up a perfect 5th (7 semitones) or down a perfect 4th (5 semitones). Both give the same key.
Method: (a) name the key and doh; (b) write the sol-fa of each note; (c) name the new key and write its key signature; (d) write each sol-fa syllable on the new doh; (e) check the accidentals; (f) check the rhythm is unchanged.
Worked example 1 (figure): C major, 2/4, sol-fa m r d | r s. Notes E D C | D G. Dominant key G major (one sharp, F#). New notes B A G | A D, a perfect 5th higher.
Worked example 2 (figure): F major (one flat, Bb), 2/4, the same sol-fa m r d | r s. Notes A G F | G C. The dominant of F major is C major. New notes E D C | D G, a perfect 4th lower.
Moving a tune a tone higher (F major to G major) is also a transposition, but G is not the dominant of F; the dominant of F is C.
A worked example with F# (figure): C major, 4/4, d m s l | t d'. Notes C E G A | B C. In G major the notes are G B D E | F# G and the key signature has F#, because ti in G major is F#.
Practice (questions):
1. Name the dominant key of D major, of Bb major and of G major.
2. By what interval is a tune moved to the dominant key (up and down)?
3. Transpose this C major tune to G major: G E C B | A B C (s m d' t | l t d'), 4/4, rhythm four crotchets | crotchet, crotchet, minim. Write the key signature and the notes. (The notes G E C B are G4 E4 C5 B4.)
4. Transpose the F major tune A G F | G C to C major (rhythm crotchet, quaver, quaver | crotchet, crotchet).
5. A pupil transposes a C major tune to G major and writes the key signature as no sharps. What goes wrong?
Answers and marking guide:
1 (3 marks): A major; F major; D major (1 each).
2 (2 marks): up a perfect 5th (1); down a perfect 4th (1).
3 (9 marks): key signature F# (1); D B G F# | E F# G, one mark for each of the seven notes (7); rhythm unchanged (1). The notes are D5 B4 G5 F#5 | E5 F#5 G5.
4 (4 marks): key signature none (1); E D C | D G (2); rhythm unchanged (1).
5 (2 marks): every F must be F# (1), so the ti of G major is written a semitone too low (1).
Assessment and feedback: 20 marks. 16-20 secure; 11-15 developing (write the sol-fa first); below 11 reteach the dominant and the key signatures. Written work only.
""")

add(op='replace', id='SUP-MUSIC-PRACTICAL', gapIds=['WG-MUSIC-SL566', 'WG-MUSIC-SL567'], subjectName='Music', termLabel='2nd Term',
    title='Preparing the music practical: C and G major, at least eight bars, on voice, piano or recorder',
    sources=[WIKI('Piano and Synth - How to play the C major scale on a piano keyboard (fingering)', 'https://pianoandsynth.com/how-to-play-c-major-scale-piano-keyboard/'),
             WIKI('Anselmo Academy - G major piano scale (notes and fingering)', 'https://www.anselmoacademy.org/learn-all-about-the-g-major-piano-scale/'),
             WIKI('Dolmetsch - Baroque/English fingerings for the recorder (text chart)', 'https://dolmetsch.com/textfingeringchart.htm')],
    origin="New teaching material prepared under the owner's authorisation (16 Oct 2026) to provide a lesson where no body exists, revised under the Batch 2 close pack (18 Oct 2026). The Third-Term (Omega) Music scheme states that 'All practical must be in C & G major scale not less than 8 bars' and lists 'Practicals: voice, piano & recorder'; no source body teaches how to prepare or perform a practical. The previous model melody did not state its octave and its seventh bar stepped below doh; the revised model stays between doh and soh so it can be sung or played in any comfortable octave. Third-Term instruction is placed in the Second Term. The lesson is new teaching material, not recovered school-source text. It does not copy any published tune and does not certify performance.",
    body="""Objectives: write and play or sing the scales of C major and G major; build an eight-bar melody that ends properly; and prepare a voice, piano or recorder practical using a checklist.
Link to your notes: your Omega-term scheme says every practical must be in C or G major and be at least eight bars long, on voice, piano or recorder. Your earlier notes teach melody writing (a melody begins, moves and ends), solo singing (pitch, breath control, clear words), key signatures and sol-fa. This lesson joins them for the practical.
Teaching - the two keys:
C major: C D E F G A B C. No sharps or flats. Sol-fa: d r m f s l t d'.
G major: G A B C D E F# G. One sharp (F#, the leading note, sol-fa t). The sol-fa names are the same: d r m f s l t d', with doh = G.
Tonic chords: C major C-E-G; G major G-B-D. Dominant chords: in C, G-B-D; in G, D-F#-A.
Choosing your octave: write the key note (doh) at a pitch that is comfortable for your voice or instrument. The model melody below never goes lower than doh or higher than soh, a range of only a fifth, so it can be moved up or down by octaves without any note becoming too high or too low. For voices, sing the melody where its highest note (soh) is comfortable; if it is too high or too low, move the whole melody up or down by an octave or start from another doh the teacher gives you.
How to build an eight-bar melody: write two phrases of four bars. Phrase 1 asks a question and ends on soh (the half-cadence note). Phrase 2 answers and ends on doh (the authentic cadence note), which gives a proper ending. In 4/4 every bar must add up to four crotchet beats. Keep most movement by step, use a few small leaps, repeat a rhythm to give shape, and end on a long note.
Model (4/4, key note doh; crotchet = 1 beat, minim = 2, semibreve = 4). Eight bars, every bar four beats:
Bar 1: d r m d | Bar 2: m f s (minim) | Bar 3: s f m f | Bar 4: m r s (minim) | Bar 5: d r m d | Bar 6: m f s (minim) | Bar 7: f m r (minim) | Bar 8: d (semibreve).
In C major the letters are: C D E C | E F G(2) | G F E F | E D G(2) | C D E C | E F G(2) | F E D(2) | C(4).
In G major the letters are: G A B G | B C D(2) | D C B C | B A D(2) | G A B G | B C D(2) | C B A(2) | G(4).
Figure: the model melody engraved in C major and in G major, eight bars each, with the sol-fa under every note. The F# of G major is in the key signature; the melody itself does not use F#, so practise the full G major scale as well.
Preparing each instrument:
Voice: sing the scale and then the melody on sol-fa, then on a vowel. Check pitch against the home note, breathe at the end of phrases, keep a steady pulse, and sing from memory if you can.
Piano: the usual right-hand scale fingering for both C major and G major is 1-2-3-1-2-3-4-5 going up (left hand 5-4-3-2-1-3-2-1). In G major the F# is the black key just above F. Play slowly with an even pulse.
Recorder (soprano/descant): learn each note from a standard fingering chart. G major needs F#, which uses a special fingering shown on the chart. Practise slow, clean tonguing and steady breath. Choose the octave in which the notes of the melody are comfortable on your recorder.
Practical checklist (teacher or partner observes): correct key and notes; steady pulse; at least eight bars; clear ending on doh; good tone, posture and breath (voice and recorder) or even touch (piano).
Source note: the scale fingering and recorder chart references are in the sources; the melody, exercises and rubric are new. This written lesson prepares for the practical but cannot certify singing or playing; only an observed performance can.
Practice (questions):
1. Write the notes of the C major and G major scales and their sol-fa names.
2. Which sharp is in the key signature of G major? Which sol-fa note is it?
3. A bar in 4/4 holds crotchet, crotchet, minim and crotchet. Is it correct? Explain.
4. Write your own eight-bar melody in G major (4/4). End the first phrase on soh and the last note on doh.
5. Choose voice, piano or recorder. Perform your melody (or the model) and check yourself against the checklist.
Answers and marking guide:
1 (4 marks): C D E F G A B C and G A B C D E F# G (1 each); d r m f s l t d' for both (1 each).
2 (2 marks): F# (1); the leading note t (1).
3 (2 marks): No (1): 1 + 1 + 2 + 1 = 5 beats, but a 4/4 bar holds 4 (1).
4 (8 marks): key G major with F# where needed (1); eight bars (1); every bar adds to 4 beats (2); first phrase ends on D (soh) (1); last note is G (doh) (1); mostly stepwise with sensible shape (2).
5 (observed practical, 20 marks, scored by the teacher): notes and key 5; pulse and rhythm 5; length of at least eight bars and ending 3; tone, breath or touch 3; confidence and memory 2; presentation 2.
Assessment and feedback: written marks 16 (questions 1-4); practical marks 20 (question 5). Written: 14-16 secure; 10-13 developing (redo question 3 with beat counts); below 10 reteach with clapped bars. The practical mark is for the teacher and is separate.
""")

add(op='add', id='SUP-MUSIC-REVISION-OMEGA', gapIds=['WG-MUSIC-SL559'], subjectName='Music', termLabel='1st Term',
    title='Music revision exercise: answers and explanations (instruments, intervals, cadences, note values, clefs, keys)',
    sources=[WIKI('Wikipedia - Hornbostel-Sachs (instrument families)', 'https://en.wikipedia.org/wiki/Hornbostel%E2%80%93Sachs'),
             WIKI('Wikipedia - Interval (music)', 'https://en.wikipedia.org/wiki/Interval_(music)'),
             WIKI('Wikipedia - Triad (music)', 'https://en.wikipedia.org/wiki/Triad_(music)'),
             WIKI('Wikipedia - Clef', 'https://en.wikipedia.org/wiki/Clef')],
    origin=AUTH + "The Third-Term (Omega) Music note, Week 1, is a revision exercise with ten fill-in questions, a drawn item of five chords whose instruction line is missing from the document (only the example 'F major' survives), and questions on highlife musicians, duet and trio, relative keys, intervals and triads. The note gives no answers and the earlier automatic closure matched it to a different first-term revision row from another file. This lesson supplies the answers and short explanations. The fifth drawn chord is ambiguous and is not answered. Third-Term instruction is placed in the First Term." + NOTRECOVERED,
    body="""Objectives: check your answers to the Week 1 revision exercise and learn the reason for each answer.
Link to your notes: Week 1 of your Omega-term note is a revision exercise. It has ten fill-in questions, a row of drawn chords headed 'e.g. F major', and questions 3, 4 and 5.
Answers with reasons (questions in short form):
1. African musical instruments are grouped into four families: idiophones (struck or shaken, such as bells and rattles), membranophones (drums), aerophones (flutes and horns) and chordophones (strings).
2. G to D is a perfect fifth.
3. A diminished fifth has 6 semitones (a perfect fifth has 7).
4. In a duet the voices must blend.
5. The cadence that moves from tonic to dominant (I to V) is the imperfect cadence.
6. The perfect cadence is popularly called the closed cadence (V to I).
7. The plagal cadence is generally known as the Amen cadence (IV to I).
8. Four quavers are worth one minim.
9. The American name for a crotchet is a quarter note.
10. The F (bass) clef fixes F on the fourth line. The question says 'fifth line'; the fifth (top) line of the bass staff is A. Ask your teacher which answer your class expects.
Chord item (the instruction line is missing; the example 'F major' shows the task is to name the chord): F major is F A C. The next chords read: A major (A, C#, E - the sharp is drawn on the middle note), G major (G B D), and Eb major (Eb G Bb - flats on the top and bottom notes). The fifth chord is drawn with its top two notes touching and cannot be read with certainty; ask your teacher.
3. (a) Five Nigerian highlife musicians, for example Victor Olaiya, Bobby Benson, Rex Lawson, Celestine Ukwu and Osita Osadebe, or any five from your Week 6 list. (b) A duet is music for two performers; a trio is music for three.
4. Relative minor or major: G major - E minor; C major - A minor; F major - D minor; A minor - C major; Eb major - C minor. In the note the last key is Eb major: the flat sign is printed beside the E and is lost in a plain-text copy.
5. (a) An interval is the distance in pitch between two notes. A triad is a three-note chord made of a root, a third and a fifth. (b) Four qualities of interval: major, minor, perfect, augmented, diminished (any four).
Practice (questions) - try these new ones before looking at the answers:
A. Which family is a talking drum in?
B. How many semitones in a perfect fifth?
C. Name the triad G B D.
D. Give the relative minor of Bb major.
Answers and marking guide:
A (1 mark): membranophone.
B (1 mark): 7.
C (1 mark): G major.
D (1 mark): G minor.
Assessment and feedback: 4 marks for the new questions, plus the exercise above marked 1 mark per correct answer. Written revision only; it does not replace the teacher's marking of your own answers.
""")

# ---------------------------------------------------------------- CCA
add(op='add', id='SUP-CCA-VISUAL-UNITY', gapIds=['WG-CCA-SL521'], subjectName='Cultural & Creative Arts', termLabel='2nd Term',
    title='Unity in art and design: visual unity, design tasks and criteria',
    sources=[WIKI('Arizona State University School of Art - Unity (proximity, continuation, Gestalt)', 'https://www.asu.edu/cfa/wwwcourses/art/SOACore/unitymain.htm'),
             WIKI('Oak National Academy - The principles of art: unity (proximity, repetition, simplicity)', 'https://www.thenational.academy/pupils/lessons/principles-of-art-unity/video')],
    origin=AUTH + "The Third-Term (Omega) Fine Art/CCA note, Week 3, 'Unity', is an essay about unity among people and in a nation, with religious content. The scheme belongs to a Cultural and Creative Arts course where unity is also a principle of design; the note does not teach visual unity and has no design task. This lesson teaches visual unity, with design tasks and criteria. The original essay is left in place as its own content. Third-Term instruction is placed in the Second Term." + NOTRECOVERED,
    body="""Objectives: explain unity as a principle of design; use proximity, repetition, continuation and simplicity to make a design look unified; and judge a design for unity.
Link to your notes: your Week 3 note on unity is about people living together as one nation. In art and design the word unity has a second meaning: the parts of a picture, pattern or poster look as if they belong together as one whole. This lesson is about that visual unity.
Teaching:
1. Visual unity means the separate elements of a work (lines, shapes, colours, patterns, words) work together so that the whole looks complete and ordered, not scattered.
2. Four ways to make unity: proximity (put related things close together); repetition (repeat a shape, line, colour or pattern); continuation (let the eye follow a line or edge from one part to the next); simplicity (use a small number of colours and shapes).
3. Unity needs variety. If everything is exactly the same the design is dull. Repeat some things and change others: for example repeat the same shape in different sizes, or keep one colour set but change the pattern.
4. Look at cloth, tiles or posters near you. Notice which of the four ways the maker used.
Design tasks (use pencil, ruler, paper and coloured pencils or paints; if you cut paper, cut only with the teacher's permission and always away from your body):
Task A - motif repeat: draw four simple motifs of your own, for example from leaves, fruit or tools you see every day. Arrange them in a square 12 cm by 12 cm using repetition and proximity, with no more than three colours.
Task B - poster: design a poster for a school event with a picture, a title and one line of text. Use proximity to group the text, repetition of one shape or colour, and one line that leads the eye from the picture to the title.
Criteria (20 marks, teacher or partner): repetition used clearly (4); related parts grouped by proximity (4); a limited colour set (4); some variety or a clear centre of interest (4); neat, finished work (4).
Practice (questions):
1. What does unity mean in a design?
2. Name four ways of creating unity.
3. How is the unity of a design different from the unity of a nation, as your note describes it?
4. A pattern repeats one shape in one colour only. Is it unified? What could you add?
Answers and marking guide:
1 (2 marks): the parts work together to look like one whole (2).
2 (4 marks): proximity, repetition, continuation, simplicity (1 each).
3 (2 marks): design unity is about how the parts of a picture look together (1); national unity is about people living together as one country (1).
4 (2 marks): yes, it is unified (1); but it needs a little variety, such as a second size or a small change of colour (1).
Assessment and feedback: written 10 marks; practical tasks 20 marks scored by the teacher with the criteria. 8-10 and 16-20 secure; below that, look again at examples and redo one task. Design tasks are marked by an observer; this written lesson alone does not show the pupil can design.
""")

add(op='add', id='SUP-CCA-BATIK-PRACTICAL', gapIds=['WG-CCA-SL523'], subjectName='Cultural & Creative Arts', termLabel='2nd Term',
    title='Resist dyeing in class: paste-resist (adire eleko style) and supervised batik, with safety rules',
    sources=[WIKI('Cooper Hewitt - Adire eleko: hand-drawn cassava paste resist, indigo-dyed (Ibadan)', 'https://collection.cooperhewitt.org/objects/18497703'),
             WIKI('Smarthistory - Ibadandun woman\'s wrapper (Yoruba paste-resist adire)', 'https://smarthistory.org/ibadandun-womans-wrapper-unrecorded-yoruba-artist/'),
             WIKI('NHS - Burns and scalds: first aid', 'https://www.nhs.uk/conditions/burns-and-scalds/')],
    origin=AUTH + "The Third-Term (Omega) Fine Art/CCA note, Week 5, 'Batik', is an instruction page taken from a craft-supply shop: it has pupils melt wax in a pot or old electric frying pan, tub-dye with soda ash, boil the wax out of the cloth and iron it, with no supervision or safety rules, and it names commercial products. This lesson keeps the idea of wax-resist batik but makes the paste-resist method used by Yoruba adire eleko the pupil activity, with adults handling heat and chemicals, and adds safety, design criteria and first aid. It supersedes the original row's procedure for pupils. Third-Term instruction is placed in the Second Term." + NOTRECOVERED,
    body="""Objectives: explain how resist dyeing works; make a resist-dyed cloth safely; and judge your cloth against clear criteria.
Link to your notes: Week 5 describes batik: wax is put on cloth to stop the dye, the cloth is dyed, and the wax is removed. Yoruba adire cloth uses the same idea with another resist, a cassava paste. In this class the pupil activity uses paste. Hot wax and boiling water are for the teacher only.
Teaching:
1. Resist dyeing: a material stops the dye reaching part of the cloth. After dyeing, the resist is removed and that part stays undyed. Batik uses wax as the resist.
2. Adire eleko is a Yoruba method in which a thick starch paste made from cassava is painted on cotton with a brush, a feather or a palm rib, allowed to dry, dyed (traditionally with indigo), and then the dried paste is cracked and washed off to show a light pattern on a dark ground. Ibadan was a centre of adire production, and named patterns such as Ibadandun are known.
3. Plan a design first. Plain, bold shapes work best; fine lines may crack or spread.
Class activity - paste resist (pupils):
a. Draw your design on paper. Use clean, pre-washed cotton cloth taped flat on a board covered with newspaper.
b. The teacher (an adult) prepares the paste by cooking cassava starch or flour with water to a thick paste and lets it cool until it is no longer hot. Some traditional recipes add alum; alum can irritate the skin, so only an adult handles it.
c. Pupils paint the paste thickly on the parts that must stay light. Work slowly, do not rush.
d. Let the paste dry completely.
e. The teacher prepares a dye bath using a cold-water fabric dye that is safe for school use, following the maker's instructions. Pupils wear gloves and old clothes and dip the cloth as shown.
f. Let the cloth dry, then crack the dried paste off and rinse it away.
Hot-wax batik (teacher demonstration only): pupils watch from a safe distance. They do not melt wax, handle hot wax or pot, or handle boiling water.
Safety rules for everyone: tie back long hair; closed shoes; work in a ventilated room; no running; keep food and drink away; wear gloves for dye; do not touch your face with dyed hands; wash hands afterwards. Hot wax is only for an adult, heated in a thermostat-controlled pot or double boiler, never left alone and never heated over an open flame without protection; keep water away from hot wax; keep a fire blanket or damp cloth and a bucket of sand or a suitable extinguisher near. Soda ash and some dye powders irritate eyes and skin and are handled by adults only. Traditional indigo vats can contain caustic chemicals and are for trained adults only.
First aid for a burn: cool the burn under cool running water for 20 minutes, remove jewellery or clothing near it unless stuck, cover loosely with cling film or a clean non-fluffy cloth, and get an adult and medical help quickly for anything more than a small burn.
Criteria (20 marks): clear, bold design (4); paste applied evenly and kept inside the design (4); clean dyeing without muddy patches (4); clear contrast between dyed and undyed parts (4); safe working and tidy-up (4).
Practice (questions):
1. What is a resist in dyeing? Name two resists.
2. Describe the steps of adire eleko in order.
3. Why is paste safer for a class than hot wax?
4. A pupil spills hot wax on a hand. What do you do first?
Answers and marking guide:
1 (3 marks): a material that stops dye reaching part of the cloth (1); wax and cassava paste (1 each; tying or stitching are also acceptable).
2 (4 marks): paint paste, dry, dye, remove the paste (1 each).
3 (2 marks): it is not heated to a dangerous temperature (1); it washes off with water and no melting pot is needed (1).
4 (3 marks): cool the burn under cool running water (1) for 20 minutes (1) and call an adult and medical help (1).
Assessment and feedback: written 12 marks; practical 20 marks scored by the teacher with the criteria. A pupil who cannot state the safety rules does not take part in the dyeing step until they can. The written lesson does not certify practical skill.
""")

add(op='add', id='SUP-CCA-LETTERING-PRACTICAL', gapIds=['WG-CCA-SL294'], subjectName='Cultural & Creative Arts', termLabel='2nd Term',
    title='Lettering: letter parts, spacing and layout, with practical tasks and criteria',
    sources=[WIKI('Wikipedia - Lettering', 'https://en.wikipedia.org/wiki/Lettering'),
             WIKI('Wikipedia - Typeface anatomy (baseline, x-height, serif, ascender, descender)', 'https://en.wikipedia.org/wiki/Typeface_anatomy')],
    origin=AUTH + "The Second-Term Fine Art/CCA note has a 'Lettering' theory topic and a 'Lettering (practical)' topic. The theory topic is an encyclopaedia article defining lettering and calligraphy, and the practical topic is an encyclopaedia passage on the history of Western calligraphy; neither gives the pupil a task, steps or criteria. This lesson supplies letter parts, spacing, a layout method, practical tasks and criteria. The original passages are left in place." + NOTRECOVERED,
    body="""Objectives: name the parts of letters; space letters and words so they look even; and plan and make a short piece of hand lettering.
Link to your notes: your lettering notes explain that lettering is the making of hand-drawn letters and that calligraphy is beautiful writing, and they describe the history of Western calligraphy. This lesson turns that into practice.
Teaching:
1. Letter parts: the baseline is the line the letters stand on; capital height is the top of capital letters; x-height is the height of small letters such as x, a and o; an ascender goes above x-height (b, d, h); a descender goes below the baseline (g, p, y); a serif is a small foot or finishing stroke, and a sans-serif letter has none.
2. Guidelines: rule light pencil lines for the baseline and the top of the capitals before you letter. Keep all letters the same height.
3. Spacing: leave equal space between letters by eye, not equal gaps between edges. Round letters such as O can sit slightly closer; straight letters such as I and H need a little more space. Leave a space between words about the width of a letter O. Leave a clear space between lines.
4. Layout: choose centred or left-aligned text and keep to it. Keep margins even. Put the most important word in the largest or boldest letters. Use strong contrast between letters and background so they can be read from a distance.
Practical tasks (pencils, markers or brush pens; if you use a dip pen, use ink in a stable pot on a covered desk and keep it away from clothes and faces; no knives or blades are needed):
Task 1 - block capitals: rule a baseline and a capital line 3 cm apart. Draw the alphabet in block capitals, then fill them in.
Task 2 - your name and school: letter your name and the school name on two lines. Check the spacing by eye.
Task 3 - notice: design a notice for a class exhibition with a title, a date and a place, using a clear layout.
Criteria (20 marks): letters the same height on guidelines (4); even spacing between letters and words (4); clear layout and margins (4); readable from a distance, with good contrast (4); neat finished work (4).
Practice (questions):
1. Name the parts of a letter: the line it stands on, a stroke above x-height, a stroke below the line.
2. What is a serif?
3. Why should you rule guidelines before lettering?
4. A notice has the date in tiny letters and the title in the same size as everything else. What should you change?
Answers and marking guide:
1 (3 marks): baseline; ascender; descender (1 each).
2 (2 marks): a small foot or finishing stroke on a letter (2).
3 (2 marks): so the letters are the same height and sit on one line (2).
4 (3 marks): make the title the largest or boldest (1); keep the date readable (1); keep spacing and alignment clear (1).
Assessment and feedback: written 10 marks; practical 20 marks scored by the teacher. 8-10 and 16-20 secure; below that, redo Task 1 using guidelines. The practical is marked by an observer.
""")

add(op='add', id='SUP-CCA-EMBROIDERY-PRACTICAL', gapIds=['WG-CCA-SL063'], subjectName='Cultural & Creative Arts', termLabel='1st Term',
    title='Embroidery in class: running stitch, back stitch and satin stitch, with safe needle use and criteria',
    sources=[WIKI('Wikipedia - Embroidery', 'https://en.wikipedia.org/wiki/Embroidery'),
             WIKI('Wikipedia - Running stitch', 'https://en.wikipedia.org/wiki/Running_stitch'),
             WIKI('Wikipedia - Backstitch', 'https://en.wikipedia.org/wiki/Backstitch')],
    origin=AUTH + "The First-Term Cultural and Creative Arts note, Week 10, 'Embroidery', defines embroidery, names stitches (chain, blanket, running, satin, cross), and classifies free, counted and canvas work; it gives no step-by-step stitching, safety rules or criteria. This lesson supplies a first practical on running stitch, back stitch and satin stitch with safe needle use and marking criteria. The original row is left in place." + NOTRECOVERED,
    body="""Objectives: make running stitch, back stitch and satin stitch neatly, use needles and scissors safely, and finish a small design.
Link to your notes: your embroidery note names the stitches and the kinds of embroidery. This lesson shows how to make three of them.
Materials: plain cotton cloth about 15 cm square, an embroidery hoop, blunt-tipped needles (tapestry or chenille needles are easier and safer for beginners), cotton thread, small scissors with rounded tips, a pincushion, a pencil.
Safety rules: count the needles out and count them back at the end; keep needles in the pincushion when you are not using them; never put a needle or pin in your mouth; hold the scissors closed when walking and pass them handle first; sit with good light; tell the teacher at once if anyone is pricked; sweep up loose threads and pins.
Steps:
1. Draw a simple design in pencil on the cloth, such as a leaf, a flower or a pattern line. Put the cloth in the hoop and pull it flat.
2. Thread the needle with a thread about the length of your arm from hand to elbow. Tie a small knot at the end.
3. Running stitch: bring the needle up from the back, take it down a short way along the line, and come up again at the same distance. Keep the stitches and the gaps the same size.
4. Back stitch: bring the needle up, go back to the end of the last stitch, and come up one stitch length ahead. This makes a solid line with no gaps and is good for outlines.
5. Satin stitch: fill a small shape with straight stitches laid side by side, close together, from edge to edge. Keep the edge neat by drawing the outline first.
6. Finish by passing the needle through the back of several stitches and cutting the thread close.
Criteria (20 marks): stitches even in size (4); lines follow the drawing (4); satin stitch fills the shape without gaps and keeps a neat edge (4); the back of the work is tidy (4); safe use of needle and scissors (4).
Practice (questions):
1. What is the difference between running stitch and back stitch?
2. Which stitch fills a shape?
3. Give two safety rules for needles.
4. Why should the cloth be in a hoop?
Answers and marking guide:
1 (2 marks): running stitch has gaps between stitches (1); back stitch makes a continuous line (1).
2 (1 mark): satin stitch.
3 (2 marks): any two of: count needles out and in; keep them in a pincushion; never put them in the mouth; pass scissors handle first.
4 (2 marks): it keeps the cloth flat and the stitches even (2).
Assessment and feedback: written 7 marks; practical 20 marks scored by the teacher. A pupil who breaks a safety rule stops stitching until the rule is repeated. The practical is marked by an observer; the written lesson alone does not show stitching skill.
""")

add(op='add', id='SUP-CCA-EXHIBITION-PRACTICAL', gapIds=['WG-CCA-SL062'], subjectName='Cultural & Creative Arts', termLabel='1st Term',
    title='Planning a class art exhibition: labels, layout, safe display and criteria',
    sources=[WIKI('Wikipedia - Art exhibition', 'https://en.wikipedia.org/wiki/Art_exhibition'),
             WIKI('Wikipedia - Curator', 'https://en.wikipedia.org/wiki/Curator')],
    origin=AUTH + "The First-Term Cultural and Creative Arts note, Week 3, 'Exhibition and display techniques', explains exhibition types, ways to display bound and unbound materials, and security, but gives no task for planning a display. This lesson supplies a class exhibition task with label content, layout rules, safe display and criteria. The original row is left in place." + NOTRECOVERED,
    body="""Objectives: plan a small class exhibition, write labels, arrange the works so they can be seen and understood, and display them safely.
Link to your notes: your note describes types of exhibition (for example solo, group, juried and open), ways of displaying works, and security. This lesson turns those ideas into a plan you can carry out.
Teaching:
1. Choose a theme and a name for the exhibition. Select works that fit the theme. A curator chooses and arranges works.
2. Each work needs a label: the title, the artist's name and class, the materials (the medium) and the year.
3. Layout: group related works together; hang flat works with their centres at about eye level, roughly 145 to 150 cm from the floor; leave equal gaps; keep a clear path and clear exits.
4. Display: use clips, string, stands or tape that will not damage the work; mount works on card so the edges are neat; place small or fragile objects on a stable table out of the walkway.
5. Safety and security: only adults use ladders or tall steps; do not stand on chairs or desks; keep cables out of walkways; keep fire exits clear; do not display valuable items without a teacher present; assign two pupils as guides for each session.
Class task: in a group of four, plan an exhibition of eight works. Draw a floor plan on paper showing where each work goes, write the eight labels, and list the safety checks. If the teacher allows, put the display up for a day.
Criteria (20 marks): a clear theme and title (4); complete, readable labels (4); sensible layout with works grouped and at eye level (4); safe display plan (4); neat, finished presentation (4).
Practice (questions):
1. What information goes on an exhibition label?
2. At about what height should the centre of a hung work be?
3. Give two safety checks before opening an exhibition.
4. What does a curator do?
Answers and marking guide:
1 (4 marks): title, artist's name (and class), materials, year (1 each).
2 (1 mark): about eye level, roughly 145 to 150 cm.
3 (2 marks): any two of: only adults use ladders; clear exits and walkways; cables out of the way; stable tables for objects; a teacher present for valuable items.
4 (2 marks): chooses and arranges works for display (2).
Assessment and feedback: written 9 marks; the group task 20 marks scored by the teacher. 7-9 and 16-20 secure; below that, redo the floor plan and labels. The practical is marked by an observer.
""")
