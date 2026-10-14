// Run (unit tests only):
//   cd backend && npx tsx --test ../tests/jss3-second-term.test.mts
// Run with the real-source dry-run audit (no database is touched; --yes is never passed):
//   cd backend && JSS3_SECOND_TERM_ROOT=/path/to/root npx tsx --test ../tests/jss3-second-term.test.mts
// where the root is the folder that CONTAINS "JSS3 2ND TERM " (note the trailing space) with
// the 14 Second-Term source files. Optional manifest cross-check:
//   JSS3_SCHEME_MANIFEST=/path/to/scheme_only_integration_manifest.csv
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  JSS3_SECOND_TERM_NON_INSTRUCTIONAL,
  JSS3_SECOND_TERM_REVIEWED_SOURCES,
  JSS3_SECOND_TERM_SCHEME_ONLY_HEADINGS,
  applyJss3SecondTermSourceTextResolution as apply,
  hasJss3SecondTermSourceResolution as hasRule,
  isJss3SecondTermNonInstructional as isNonInstructional,
  resolveJss3SecondTermParsedTopic as resolveTopic,
} from '../backend/src/db/jss3SecondTermResolutions.ts';
import {
  JSS3_FIRST_TERM_REVIEWED_SOURCES,
  canonicalJss3Week,
  hasJss3SourceResolution as hasFirstTermRule,
  resolveJss3ParsedTopic as resolveFirstTermTopic,
} from '../backend/src/db/jss3CurriculumResolutions.ts';

const here = path.dirname(fileURLToPath(import.meta.url));
const backendDir = path.resolve(here, '..', 'backend');
const T2 = '2nd Term';
const EN = '\u2013';
const NB = '\u00a0';

// 1F-R4C: 'js 3 english.docx' moved from NO_RULE to RULED. Patches 02-04 gave it the reviewed Second-Term English
// text rule (splitJss3EnglishLessons, '2nd Term'); it is registered in RULES in jss3SecondTermResolutions.ts.
const RULED = [
  'Basic science.docx', 'basic tech.docx', 'music.docx', 'YORUBA  JS 3.docx',
  'JS 3 FINE ART.docx', 'business_studies JSS3.docx', 'BASIC 9 MATHEMATICS E-NOTE.docx',
  'js 3 english.docx',
];
const NO_RULE = [
  'Agric 2ndT.doc', 'P H E JS_3.docx', 'home econs.docx', 'js 3 civic.docx',
  'social studies.docx', 'FRENCH  js 3.docx',
];
const FIRST_TERM_RULED = ['BASIC SCIENCE.docx', 'BASIC TECH.docx', 'PHE JS 3.docx', 'js 3 english.doc', 'JS3 YORUBA.docx'];

// ── Fixtures (synthetic, structure-only; lesson text is placeholder) ───────
const BASIC_SCIENCE = [
  'JSS3 SIGMA TERM E-NOTE', 'SCHEME OF WORK',
  'WEEK 1-RESOURCES FROM LIVING THINGS ', 'WEEK2-ECONOMIC IMPORTANCE', `WEEK3 ${EN}RESOURCES FROM  NON-LIVING THINGS`,
  'WEEK7 /8-MAGNETISM', 'WEEK 10- SKILL ACQUISITION', '',
  'Wk1-Resources from living things.', 'a',
  'WK2-Economic importance of plant and animal resources.', 'b',
  'WK3\u2014Resources from non-living things (solid material)', 'c',
  'WK4', '', 'Resources from non-living things and their Location', 'd',
  `WEEK 5${EN}LIGHT ENERGY`, 'e',
  'WK6- SOUND ENERGY', 'f',
  'WK7/8-Magnetism-', 'g',
  'WK9 Electrical Energy.', 'h',
  'WEEK 11', 'SKILL ACQUISITION', 'i', '',
].join('\n');

const BASIC_TECH = [
  '      Scheme of work for jss3', 'Week 1; revision of last terms work', 'Week 2; building components  [foundation]', '',
  'Week 1; revision ', '', 'Wood processing', 'body one',
  'Week 2; building components [foundation]', 'body two', 'Week 4&5 ; wood work project', 'body four',
  'Week 11; revision ', 'Week 12; examination', '',
].join('\n');

const MUSIC = [
  'SIGMA TERM   E- NOTE', 'SCHEME OF WORKS', 'WEEK ONE    -            REVISION', 'WEEK TWO  -           Singing  pattern', '',
  '                 WEEK ONE                 ', 'body one', '          WEEK TWO', 'body two', '',
].join('\n');

const YORUBA = [
  'SIGMA TERM ILAANA', 'YORUBA LANGUAGE', 'OSE', 'AKORI EKO', '1', `EDE ${EN} a`, '13', 'Idanwo',
  'OSE KINNI', 'AKORI EKO: x', 'text one', 'OSE KEJI', 'AKORI EKO: y', 'text two', 'OSE KETA', 'AKORI EKO: z', 'text three', '',
].join('\n');

const FINE_ART = [
  'SIGMA TERM E Note CLASS : J S S 3', '', 'SUBJECT; CULTURAL AND CREATIVE ARTS', '', 'SCHEME OF WORK', 'WEEK\t\t\tTOPICS', '1.', 'MOTIFS', '',
  'SUBJECT;CULTURAL AND CREATIVE ARTS',
  '                                     CLASS; JSS3  WEEK 1   TOPIC; MOTIFS', 'body 1',
  'CLASS;JSS3  WEEK  2       TOPIC; BASIC HARMONY IN MUSIC COMPOSITION ', 'body 2',
  'CLASS;JSS3 WEEK  3   TOPIC; CHOREOGRAPHY', 'body 3',
  'CLASS;JSS3 WEEK  4     TOPIC; KNITTING', 'body 4',
  'CLASS; J S S 3        WEEK 5                 TOPIC; SINGING IN PARTS AND ', '', 'CADENCE IDENTIFICATION', 'body 5',
  'SUBJECT;CULTURAL AND CREATIVE ARTS',
  `CLASS ; J S S 3   WEEK  6    TOPIC; LETTERING${NB} . ${NB} `, 'body 6',
  'CLASS: J S S 3     WEEK  7        TOPIC: minor scale', 'body 7',
  'CLASS: JSS3 WEEK8     TOPIC:LETTERING  (practical)', 'body 8',
  'CLASS; JSS3 WEEK  9      TOPIC; MUSIC FORMS', 'body 9', '',
].join('\n');

const BUSINESS = [
  'SIGMA TERM SCHEME OF WORK FOR JSS3', 'BUSINESS STUDIES', 'WEEKS', 'TOPICS',
  '1', '', 'Revision of last term\u2019s work', `2 ${EN} 3 `, '', 'Personal finance ',
  '4', '', `Book ${EN} keeping ethnics `, '5', '', 'Trading, profit and loss account ',
  '6', 'Shorthand principle, speed development in shorthand', '7', 'Applied keyboarding',
  '8', '', 'Display ', '9', '', 'Types of Display ', '10', '', 'Printers correction signs / speed development ',
  `11 ${EN} 12 `, 'REVISION / EXAMINATION ', '',
  `WEEK TWO ${EN} THREE `, 'TOPIC: PERSONAL FINANCE', 'body two-three',
  'WEEK FIVE', 'TOPIC: TRADING', 'body five',
  'WEEK SIX', 'TOPIC: SHORTHAND', 'body six',
  'WEEK SEVEN', 'TOPIC: APPLIED KEYBOARDING', 'Display the following menu vertically on A5 paper.', '', '',
].join('\n');

const STAT_SUB = [
  'Application of measure of central tendency on relevant current issues',
  'Data collection from info on drug Abuse, voters Register, Producers (workers), consumers (children, aged etc)',
  'Importance of data on drug.  Abuse, HIV patients, Voters Register, Producers, consumers etc',
  'The use of the statistical tools such as measures of central tendency in Drug abuse, voting and other related activities.',
];
const MATH = [
  '1ST WEEK', 'MATHEMATICS', 'SCHEME OF WORK SECOND TERM BASIC 9', 'Revision of First term\u2019s work',
  'Graphical Method continued', 'Statistics II', ...STAT_SUB, 'Variation', 'Concept and meaning', '',
  'WEEK 2', 'SOLVING OF SIMULTANEOUS LINEAR EQUATIONS', 'x',
  '                    WEEK 4', 'SOLVING SIMULTANEOUS EQUATION GRAPHICALLY', 'y',
  '            WEEK 5', 'VARIATION', 'z', 'WEEK 6', 'JOINT VARIATION', '',
].join('\n');

const markers = (s: string) => s.split('\n').map(l => l.trim()).filter(l => /^WEEK\b/.test(l));

// ── Scope guards ───────────────────────────────────────────────────────────
test('exactly the eight reviewed 2nd-Term files carry a text rule, and only in 2nd Term', () => {
  for (const f of RULED) {
    assert.equal(hasRule(f, T2), true, f);
    assert.equal(hasRule(f, '1st Term'), false, `${f} must not resolve in 1st Term`);
    assert.equal(hasRule(f, '3rd Term'), false, `${f} must not resolve in 3rd Term`);
  }
  for (const f of NO_RULE) assert.equal(hasRule(f, T2), false, `${f} needs no text rule`);
  assert.equal(hasRule('SOMETHING ELSE.docx', T2), false);
});

test('1st/3rd Term and unreviewed inputs are returned unchanged (text byte-for-byte, topics by reference)', () => {
  for (const term of ['1st Term', '3rd Term']) {
    for (const f of [...RULED, ...NO_RULE]) assert.equal(apply(f, term, 'not a real source'), 'not a real source', `${f} / ${term}`);
    assert.equal(apply('business_studies JSS3.docx', term, BUSINESS), BUSINESS);
    assert.equal(apply('BASIC 9 MATHEMATICS E-NOTE.docx', term, MATH), MATH);
    for (const f of ['FRENCH  js 3.docx', 'JS 3 FINE ART.docx']) {
      const topic = { weekLabel: 'WEEK 2', title: ';Les dates', body: 'WEEK 2\n\nno heading here' };
      assert.strictEqual(resolveTopic(f, term, topic), topic, `${f} / ${term}`);
    }
  }
  assert.equal(apply('SOMETHING ELSE.docx', T2, 'x'), 'x');
  const topic = { weekLabel: 'WEEK 2', title: '-X', body: 'b' };
  assert.strictEqual(resolveTopic('SOMETHING ELSE.docx', T2, topic), topic);
});

test('null (dropped by an earlier per-class stage) passes through in every scope', () => {
  for (const term of ['1st Term', T2, '3rd Term']) {
    for (const f of [...JSS3_SECOND_TERM_REVIEWED_SOURCES, 'SOMETHING ELSE.docx']) assert.equal(resolveTopic(f, term, null), null);
  }
});

test('14 reviewed Second-Term sources, no duplicates, all ruled files included', () => {
  assert.equal(JSS3_SECOND_TERM_REVIEWED_SOURCES.length, 14);
  assert.equal(new Set(JSS3_SECOND_TERM_REVIEWED_SOURCES).size, 14);
  for (const f of [...RULED, ...NO_RULE]) assert.ok(JSS3_SECOND_TERM_REVIEWED_SOURCES.includes(f), f);
  assert.equal(JSS3_SECOND_TERM_REVIEWED_SOURCES.some(f => /comput|\.rtf$/i.test(f)), false);
});

test("Agent 1B's five First-Term basenames do not collide with any 2nd-Term rule or source", () => {
  for (const f of FIRST_TERM_RULED) {
    assert.equal(hasRule(f, T2), false, `${f} must not resolve in 2nd Term`);
    assert.equal(hasRule(f, '1st Term'), false, `${f} must not resolve in 1st Term here`);
    assert.equal(JSS3_SECOND_TERM_REVIEWED_SOURCES.includes(f), false, `${f} must not be a 2nd-Term source`);
    assert.equal(hasFirstTermRule(f, '1st Term'), true, `${f} still carries Agent 1B's rule`);
  }
  // Conversely no 2nd-Term basename picks up a First-Term rule in any term, and (case-sensitive
  // keys!) none is also a First-Term reviewed source.
  for (const f of JSS3_SECOND_TERM_REVIEWED_SOURCES) {
    for (const term of ['1st Term', T2, '3rd Term']) assert.equal(hasFirstTermRule(f, term), false, `${f} / ${term}`);
    assert.equal(JSS3_FIRST_TERM_REVIEWED_SOURCES.includes(f), false, f);
  }
});

// ── Basic Science ──────────────────────────────────────────────────────────
test('Basic Science: scheme cut; the seven body markers rewritten exactly once each', () => {
  const out = apply('Basic science.docx', T2, BASIC_SCIENCE);
  assert.ok(out.startsWith('WEEK 1-Resources from living things.'));
  assert.doesNotMatch(out, /SCHEME OF WORK|WEEK2-ECONOMIC|WEEK 10- SKILL/);
  assert.deepEqual(markers(out), [
    'WEEK 1-Resources from living things.', 'WEEK 2-Economic importance of plant and animal resources.',
    'WEEK 3\u2014Resources from non-living things (solid material)', 'WEEK 4',
    `WEEK 5${EN}LIGHT ENERGY`, 'WEEK 6- SOUND ENERGY', 'WEEK 7&8-Magnetism-', 'WEEK 9 Electrical Energy.', 'WEEK 11',
  ]);
  assert.doesNotMatch(out, /\bW[Kk]\d/);
  // Only marker tokens changed: same number of lines, every other line identical.
  const before = BASIC_SCIENCE.slice(BASIC_SCIENCE.indexOf('Wk1-')).split('\n');
  const after = out.split('\n');
  assert.equal(after.length, before.length);
  const diff = after.filter((l, i) => l !== before[i]);
  assert.equal(diff.length, 7);
});
test('Basic Science: throws on missing, ambiguous, or unreviewed anchors', () => {
  const run = (s: string) => apply('Basic science.docx', T2, s);
  assert.throws(() => run(BASIC_SCIENCE.replace('Wk1-Resources from living things.', 'Wk1-Other')), /anchor missing: Basic Science body start/);
  assert.throws(() => run(`${BASIC_SCIENCE}\nWk1-Resources from living things.`), /ambiguous.*Basic Science body start/);
  assert.throws(() => run(BASIC_SCIENCE.replace('WK6- SOUND ENERGY', 'WEEK 6- SOUND ENERGY')), /anchor missing: Basic Science marker WK6/);
  assert.throws(() => run(BASIC_SCIENCE.replace('WK4\n', 'WK4 x\n')), /anchor missing: Basic Science marker bare WK4/);
  assert.throws(() => run(`${BASIC_SCIENCE}\nWK2-another`), /ambiguous.*WK2/);
  assert.throws(() => run(`${BASIC_SCIENCE}\nWK5-unreviewed`), /unreviewed Basic Science WK marker/);
});

// ── Basic Technology / Music ───────────────────────────────────────────────
test('Basic Technology: starts at the body "Week 1; revision"; throws if absent or ambiguous', () => {
  const out = apply('basic tech.docx', T2, BASIC_TECH);
  assert.ok(out.startsWith('Week 1; revision \n'));
  assert.doesNotMatch(out, /Scheme of work|revision of last terms work/);
  assert.equal(out, BASIC_TECH.slice(BASIC_TECH.indexOf('Week 1; revision \n')));
  assert.throws(() => apply('basic tech.docx', T2, BASIC_TECH.replace('Week 1; revision \n', 'Week 1; revision of x\n')), /anchor missing/);
  assert.throws(() => apply('basic tech.docx', T2, `${BASIC_TECH}\nWeek 1; revision`), /ambiguous/);
});
test('Music: starts at the bare "WEEK ONE" body marker; throws if absent or ambiguous', () => {
  const out = apply('music.docx', T2, MUSIC);
  assert.equal(out.split('\n')[0].trim(), 'WEEK ONE');
  assert.doesNotMatch(out, /REVISION|SCHEME/);
  assert.throws(() => apply('music.docx', T2, MUSIC.replace('                 WEEK ONE                 ', 'WEEK 1')), /anchor missing/);
  assert.throws(() => apply('music.docx', T2, `${MUSIC}\nWEEK ONE`), /ambiguous/);
});

// ── Yoruba ─────────────────────────────────────────────────────────────────
test('Yoruba: scheme cut; KINNI/KEJI/KETA translated to weeks 1/2/3 exactly once each', () => {
  const out = apply('YORUBA  JS 3.docx', T2, YORUBA);
  assert.ok(out.startsWith('WEEK 1\n'));
  assert.deepEqual(out.split('\n').filter(l => /^WEEK/.test(l)), ['WEEK 1', 'WEEK 2', 'WEEK 3']);
  assert.doesNotMatch(out, /OSE|Idanwo/);
});
test('Yoruba: throws on a missing/ambiguous ordinal or any other OSE heading', () => {
  const run = (s: string) => apply('YORUBA  JS 3.docx', T2, s);
  assert.throws(() => run(YORUBA.replace('OSE KINNI', 'OSE KINI')), /anchor missing: Yoruba body start/);
  assert.throws(() => run(YORUBA.replace('OSE KETA', 'OSE KETAA')), /anchor missing: Yoruba heading OSE KETA/);
  assert.throws(() => run(`${YORUBA}OSE KEJI\nextra`), /ambiguous.*OSE KEJI/);
  assert.throws(() => run(`${YORUBA}OSE KERIN\nextra`), /unreviewed Yoruba OSE/);
});

// ── Fine Art ───────────────────────────────────────────────────────────────
test('Fine Art: nine CLASS/WEEK/TOPIC header lines become WEEK n / CLASS / TOPIC; scheme and SUBJECT lines stay', () => {
  const out = apply('JS 3 FINE ART.docx', T2, FINE_ART);
  assert.deepEqual(out.split('\n').filter(l => /^WEEK \d+$/.test(l)), ['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(n => `WEEK ${n}`));
  assert.match(out, /^WEEK 1\nCLASS; JSS3\nTOPIC; MOTIFS\nbody 1$/m);
  assert.match(out, /^WEEK 2\nCLASS;JSS3\nTOPIC; BASIC HARMONY IN MUSIC COMPOSITION\nbody 2$/m);
  assert.match(out, /^WEEK 5\nCLASS; J S S 3\nTOPIC; SINGING IN PARTS AND\n\nCADENCE IDENTIFICATION\nbody 5$/m);
  assert.match(out, /^WEEK 6\nCLASS ; J S S 3\nTOPIC; LETTERING {2}\.\nbody 6$/m);
  assert.match(out, /^WEEK 8\nCLASS: JSS3\nTOPIC:LETTERING {2}\(practical\)\nbody 8$/m);
  assert.doesNotMatch(out, /\u00a0/);
  assert.equal(out.match(/^SUBJECT[;:]/gm)?.length, 3, 'SUBJECT lines must stay (the scheme is not cut)');
  assert.match(out, /^SCHEME OF WORK\nWEEK\t\t\tTOPICS\n1\.\nMOTIFS$/m);
  assert.equal(out.split('\n').length, FINE_ART.split('\n').length + 18, 'each header line becomes exactly three lines');
});
test('Fine Art: throws unless exactly nine header lines with weeks 1..9', () => {
  const run = (s: string) => apply('JS 3 FINE ART.docx', T2, s);
  assert.throws(() => run(FINE_ART.replace('CLASS;JSS3 WEEK  3   TOPIC; CHOREOGRAPHY', 'CHOREOGRAPHY')), /expected exactly 9 .* found 8/);
  assert.throws(() => run(`${FINE_ART}\nCLASS; JSS3  WEEK 9   TOPIC; EXTRA`), /expected exactly 9 .* found 10/);
  assert.throws(() => run(FINE_ART.replace('WEEK  9', 'WEEK  10')), /weeks must be 1\.\.9/);
  assert.throws(() => run(FINE_ART.replace('WEEK  9', 'WEEK  8')), /weeks must be 1\.\.9/);
});

// ── Business Studies (scheme-only weeks 4, 8, 9, 10) ───────────────────────
test('Business Studies: order 2-3, 4, 5, 6, 7, 8, 9, 10; titles verbatim incl. U+2013; "TWO - THREE" ASCII', () => {
  const out = apply('business_studies JSS3.docx', T2, BUSINESS);
  assert.deepEqual(markers(out.slice(out.indexOf('WEEK TWO'))), [
    'WEEK TWO - THREE', 'WEEK 4', 'WEEK FIVE', 'WEEK SIX', 'WEEK SEVEN', 'WEEK 8', 'WEEK 9', 'WEEK 10',
  ]);
  assert.match(out, /^WEEK TWO - THREE \nTOPIC: PERSONAL FINANCE$/m);
  assert.doesNotMatch(out, /WEEK TWO \u2013/);
  assert.match(out, /body two-three\nWEEK 4\n\nBook \u2013 keeping ethnics\n\nWEEK FIVE\n/);
  assert.ok(out.endsWith('\n\nWEEK 8\n\nDisplay\n\nWEEK 9\n\nTypes of Display\n\nWEEK 10\n\nPrinters correction signs / speed development\n'));
  const titles = JSS3_SECOND_TERM_SCHEME_ONLY_HEADINGS.filter(h => h.basename === 'business_studies JSS3.docx').map(h => h.title);
  assert.deepEqual(titles, ['Book \u2013 keeping ethnics', 'Display', 'Types of Display', 'Printers correction signs / speed development']);
  assert.ok(out.includes(titles[0]) && titles[0].includes('\u2013'), 'en dash in "Book \u2013 keeping ethnics" preserved');
});
test('Business Studies: throws on a missing/ambiguous scheme row, an existing body week, or a missing marker', () => {
  const run = (s: string) => apply('business_studies JSS3.docx', T2, s);
  assert.throws(() => run(BUSINESS.replace('Display \n', 'Show \n')), /anchor missing: Business Studies scheme row 8/);
  assert.throws(() => run(BUSINESS.replace(`Book ${EN} keeping ethnics `, 'Book - keeping ethnics ')), /anchor missing: Business Studies scheme row 4/);
  assert.throws(() => run(`${BUSINESS}\nDisplay`), /ambiguous.*scheme row 8/);
  for (const m of ['WEEK 8', 'Week 10', 'WEEK FOUR', 'week: 9', 'WEEK TEN']) {
    assert.throws(() => run(`${BUSINESS}\n${m}\nbody`), /no longer applies/, m);
  }
  assert.throws(() => run(BUSINESS.replace('WEEK FIVE', 'WEEK FIV')), /anchor missing: Business Studies WEEK FIVE/);
  assert.throws(() => run(`${BUSINESS}\nWEEK FIVE`), /ambiguous.*WEEK FIVE/);
  assert.throws(() => run(BUSINESS.replace(`WEEK TWO ${EN} THREE `, 'WEEK TWO - THREE ')), /anchor missing: Business Studies WEEK TWO/);
});

// ── Mathematics (scheme-only Statistics II) ────────────────────────────────
test('Mathematics: Statistics II sits between WEEK 4 and WEEK 5, sub-lines verbatim', () => {
  const out = apply('BASIC 9 MATHEMATICS E-NOTE.docx', T2, MATH);
  assert.deepEqual(markers(out), ['WEEK 2', 'WEEK 4', 'WEEK 4', 'WEEK 5', 'WEEK 6']);
  const block = ['WEEK 4', '', 'Statistics II', ...STAT_SUB, '', '            WEEK 5'].join('\n');
  assert.ok(out.includes(`y\n${block}\nVARIATION`), 'inserted block is after body WEEK 4 and before WEEK 5');
  const inserted = out.lastIndexOf('Statistics II\nApplication'); // the scheme's own copy comes first
  assert.ok(out.indexOf('SOLVING SIMULTANEOUS EQUATION GRAPHICALLY') < inserted);
  assert.ok(inserted < out.indexOf('            WEEK 5'));
  assert.equal(out.split('Statistics II\n').length - 1, 2, 'scheme row kept, plus exactly one inserted copy');
  assert.ok(STAT_SUB[2].includes('drug.  Abuse'), 'double space in the source sub-line is preserved');
  // The scheme itself is untouched (the insert is purely additive).
  assert.ok(out.startsWith(MATH.slice(0, MATH.indexOf('            WEEK 5'))));
  assert.equal(out.length, MATH.length + `WEEK 4\n\nStatistics II\n${STAT_SUB.join('\n')}\n\n`.length);
});
test('Mathematics: throws on missing/ambiguous Statistics II, Variation or WEEK 5, or no sub-lines', () => {
  const run = (s: string) => apply('BASIC 9 MATHEMATICS E-NOTE.docx', T2, s);
  assert.throws(() => run(MATH.replace('Statistics II', 'Statistics III')), /anchor missing: Mathematics scheme line Statistics II/);
  assert.throws(() => run(`${MATH}\nStatistics II`), /ambiguous.*Statistics II/);
  assert.throws(() => run(MATH.replace('\nVariation\n', '\nVariations\n')), /anchor missing: Mathematics scheme line Variation/);
  assert.throws(() => run(`${MATH}\nVariation`), /ambiguous.*Variation/);
  assert.throws(() => run(MATH.replace('            WEEK 5', '            WEEK 55')), /anchor missing: Mathematics WEEK 5/);
  assert.throws(() => run(`${MATH}\nWEEK 5`), /ambiguous.*WEEK 5/);
  assert.throws(() => run(MATH.replace(STAT_SUB.join('\n'), '')), /no sub-lines/);
});

test('every scheme-only inserted line exists verbatim in the original text (nothing invented)', () => {
  const NEW_MARKERS = /^WEEK (4|8|9|10)$/;
  const cases: Array<[string, string, string[]]> = [
    ['business_studies JSS3.docx', BUSINESS, ['WEEK TWO - THREE']],
    ['BASIC 9 MATHEMATICS E-NOTE.docx', MATH, []],
  ];
  for (const [file, src, structural] of cases) {
    const original = new Set(src.split('\n').map(l => l.trim()));
    const out = apply(file, T2, src);
    const outLines = out.split('\n').map(l => l.trim()).filter(Boolean);
    for (const l of outLines) assert.ok(original.has(l) || NEW_MARKERS.test(l) || structural.includes(l), `${file}: invented line "${l}"`);
    const markerCount = (s: string) => s.split('\n').map(l => l.trim()).filter(l => NEW_MARKERS.test(l)).length;
    assert.equal(markerCount(out) - markerCount(src), file.startsWith('business') ? 4 : 1, `${file}: structural WEEK markers added`);
  }
  // And the heading text of the five scheme-only rows is copied from the source, not typed:
  for (const h of JSS3_SECOND_TERM_SCHEME_ONLY_HEADINGS) {
    const src = h.basename.startsWith('business') ? BUSINESS : MATH;
    assert.ok(src.split('\n').some(l => l.trim() === h.title), `${h.title} must exist as a scheme line in the source`);
  }
});

// ── Title-only resolver ────────────────────────────────────────────────────
test('Titles: French week 2 and Fine Art week 5 recovered; weeks and bodies untouched', () => {
  const fr = { weekLabel: 'WEEK 2', title: 'Les dates qui est plus importante', body: 'WEEK 2\n\nDater et mesurer le temp\n\nLes dates qui est plus importante' };
  const f = resolveTopic('FRENCH  js 3.docx', T2, fr);
  assert.deepEqual([f?.title, f?.weekLabel, f?.body], ['Dater et mesurer le temp', 'WEEK 2', fr.body]);
  const fa = {
    weekLabel: 'WEEK 5', title: 'SINGING IN PARTS AND',
    body: 'WEEK 5\nCLASS; J S S 3\nTOPIC; SINGING IN PARTS AND\n\nCADENCE IDENTIFICATION\nSinging "in parts"',
  };
  const a = resolveTopic('JS 3 FINE ART.docx', T2, fa);
  assert.deepEqual([a?.title, a?.weekLabel, a?.body], ['SINGING IN PARTS AND CADENCE IDENTIFICATION', 'WEEK 5', fa.body]);
  // Other weeks of the same files are only separator-stripped.
  const f3 = resolveTopic('FRENCH  js 3.docx', T2, { weekLabel: 'WEEK 3', title: 'Raconter sa journee', body: 'x' });
  assert.equal(f3?.title, 'Raconter sa journee');
  assert.equal(resolveTopic('JS 3 FINE ART.docx', T2, { weekLabel: 'WEEK 7', title: 'minor scale', body: 'no anchor needed' })?.title, 'minor scale');
});
test('Titles: leading separators stripped for every reviewed file; trailing punctuation and typos kept', () => {
  for (const f of JSS3_SECOND_TERM_REVIEWED_SOURCES) {
    const t = resolveTopic(f, T2, { weekLabel: 'WEEK 9', title: ` ;:-\u2013\u2014 Magnetism-`, body: 'b' });
    assert.equal(t?.title, 'Magnetism-', f);
    assert.deepEqual([t?.weekLabel, t?.body], ['WEEK 9', 'b']);
  }
  assert.equal(resolveTopic('Basic science.docx', T2, { weekLabel: 'WEEK 1', title: '-Resources from living things.', body: 'b' })?.title, 'Resources from living things.');
  // An all-separator title is never emptied.
  assert.equal(resolveTopic('music.docx', T2, { weekLabel: 'WEEK 1', title: '---', body: 'b' })?.title, '---');
});
test('Titles: throws if the French week 2 / Fine Art week 5 heading anchor is missing', () => {
  assert.throws(() => resolveTopic('FRENCH  js 3.docx', T2, { weekLabel: 'WEEK 2', title: 't', body: 'no heading' }), /anchor missing: French Week 2/);
  assert.throws(() => resolveTopic('JS 3 FINE ART.docx', T2, { weekLabel: 'WEEK 5', title: 't', body: 'TOPIC; SINGING IN PARTS AND' }), /anchor missing: Fine Art Week 5/);
});
test("Titles: Agent 1B's First-Term resolver leaves 2nd-Term topics untouched (by reference)", () => {
  for (const f of JSS3_SECOND_TERM_REVIEWED_SOURCES) {
    const topic = { weekLabel: 'WEEK 2', title: '-X', body: 'b' };
    assert.strictEqual(resolveFirstTermTopic(f, T2, topic), topic, f);
  }
});

// ── Pinned expectations (also used by the real-source tests) ───────────────
type Pinned = [subject: string, order: number, file: string, week: string, title: string];
const PINNED: Pinned[] = [
  ['Agricultural Science', 1, 'Agric 2ndT.doc', 'WEEK 1', 'Revision'],
  ['Agricultural Science', 2, 'Agric 2ndT.doc', 'WEEK 2', 'Farm Records'],
  ['Agricultural Science', 3, 'Agric 2ndT.doc', 'WEEK 3', 'BOOKKEEPING'],
  ['Agricultural Science', 4, 'Agric 2ndT.doc', 'WEEK 4 and 5', 'Types of Farm records'],
  ['Agricultural Science', 5, 'Agric 2ndT.doc', 'WEEK 6', 'AGRICULTURE IN STOCK EXCHANGE'],
  ['Agricultural Science', 6, 'Agric 2ndT.doc', 'WEEK 7', 'PEOPLE INVOLVED IN STOCK EXCHANGE'],
  ['Agricultural Science', 7, 'Agric 2ndT.doc', 'WEEK 8', 'TYPES OF STOCK EXCHANGE'],
  ['Agricultural Science', 8, 'Agric 2ndT.doc', 'WEEK 9', 'IMPORTANCE OF STOCK EXCHANGE IN AGRICULTURE'],
  ['Mathematics', 1, 'BASIC 9 MATHEMATICS E-NOTE.docx', 'WEEK 2', 'SOLVING OF SIMULTANEOUS LINEAR EQUATIONS'],
  ['Mathematics', 2, 'BASIC 9 MATHEMATICS E-NOTE.docx', 'WEEK 3', 'ELIMINATION METHOD'],
  ['Mathematics', 3, 'BASIC 9 MATHEMATICS E-NOTE.docx', 'WEEK 4', 'SOLVING SIMULTANEOUS EQUATION GRAPHICALLY'],
  ['Mathematics', 4, 'BASIC 9 MATHEMATICS E-NOTE.docx', 'WEEK 5', 'VARIATION'],
  ['Mathematics', 5, 'BASIC 9 MATHEMATICS E-NOTE.docx', 'WEEK 6', 'JOINT VARIATION'],
  ['Mathematics', 6, 'BASIC 9 MATHEMATICS E-NOTE.docx', 'WEEK SEVEN', 'MID TERM EXAMINATION'],
  ['Mathematics', 7, 'BASIC 9 MATHEMATICS E-NOTE.docx', 'WEEK 8', 'THE TRIGONOMETRIC RATIOS'],
  ['Mathematics', 8, 'BASIC 9 MATHEMATICS E-NOTE.docx', 'WEEK NINE', 'APPLICATION OF TRIGONOMETRIC RATIOS'],
  ['Mathematics', 9, 'BASIC 9 MATHEMATICS E-NOTE.docx', 'WEEK 10', 'BEARINGS'],
  ['Basic Science', 1, 'Basic science.docx', 'WEEK 1', 'Resources from living things.'],
  ['Basic Science', 2, 'Basic science.docx', 'WEEK 2', 'Economic importance of plant and animal resources.'],
  ['Basic Science', 3, 'Basic science.docx', 'WEEK 3', 'Resources from non-living things (solid material)'],
  ['Basic Science', 4, 'Basic science.docx', 'WEEK 4', 'Resources from non-living things and their Location of solid mineral in Nigeria'],
  ['Basic Science', 5, 'Basic science.docx', 'WEEK 5', 'LIGHT ENERGY'],
  ['Basic Science', 6, 'Basic science.docx', 'WEEK 6', 'SOUND ENERGY'],
  ['Basic Science', 7, 'Basic science.docx', 'WEEK 7&8', 'Magnetism-'],
  ['Basic Science', 8, 'Basic science.docx', 'WEEK 9', 'Electrical Energy.'],
  ['Basic Science', 9, 'Basic science.docx', 'WEEK 11', 'SKILL ACQUISITION'],
  ['French', 1, 'FRENCH  js 3.docx', 'WEEK 1', 'La revision et la correction des questions de l\u2019examen du dernier trimester'],
  ['French', 2, 'FRENCH  js 3.docx', 'WEEK 2', 'Dater et mesurer le temp'],
  ['French', 3, 'FRENCH  js 3.docx', 'WEEK 3', 'Raconter sa journee'],
  ['French', 4, 'FRENCH  js 3.docx', 'WEEK 4', 'RACOTER SA JOURNEE'],
  ['French', 5, 'FRENCH  js 3.docx', 'WEEK 5', 'Relater un evenement pass\u00e9 le marriage de Busayo'],
  ['French', 6, 'FRENCH  js 3.docx', 'WEEK 6', 'Relatex une evenement pass\u00e9'],
  ['French', 7, 'FRENCH  js 3.docx', 'WEEK 8', 'RAPPORTER UN FAIT RECENT GRAMMAIRE'],
  ['French', 8, 'FRENCH  js 3.docx', 'WEEK 9', 'Ecrire son journal'],
  ['Cultural & Creative Arts', 1, 'JS 3 FINE ART.docx', 'WEEK 1', 'MOTIFS'],
  ['Cultural & Creative Arts', 2, 'JS 3 FINE ART.docx', 'WEEK 2', 'BASIC HARMONY IN MUSIC COMPOSITION'],
  ['Cultural & Creative Arts', 3, 'JS 3 FINE ART.docx', 'WEEK 3', 'CHOREOGRAPHY'],
  ['Cultural & Creative Arts', 4, 'JS 3 FINE ART.docx', 'WEEK 4', 'KNITTING'],
  ['Cultural & Creative Arts', 5, 'JS 3 FINE ART.docx', 'WEEK 5', 'SINGING IN PARTS AND CADENCE IDENTIFICATION'],
  ['Cultural & Creative Arts', 6, 'JS 3 FINE ART.docx', 'WEEK 6', 'LETTERING .'],
  ['Cultural & Creative Arts', 7, 'JS 3 FINE ART.docx', 'WEEK 7', 'minor scale'],
  ['Cultural & Creative Arts', 8, 'JS 3 FINE ART.docx', 'WEEK 8', 'LETTERING  (practical)'],
  ['Cultural & Creative Arts', 9, 'JS 3 FINE ART.docx', 'WEEK 9', 'MUSIC FORMS'],
  ['Physical & Health Education', 1, 'P H E JS_3.docx', 'WEEK ONE', 'COMBINED EVENTS'],
  ['Physical & Health Education', 2, 'P H E JS_3.docx', 'WEEK TWO', 'Officials, Equipments, Facilities,and Safety Rules in Combined events'],
  ['Physical & Health Education', 3, 'P H E JS_3.docx', 'WEEK THREE', 'NIGERIAN SPORTS HEROES AND HEROINE'],
  ['Physical & Health Education', 4, 'P H E JS_3.docx', 'WEEK FOUR', 'CONTRIBUTIONS OF SOME PROFESSIONALS TO PHYSICAL AND HEALTH EDUCATION IN NIGERIA'],
  ['Physical & Health Education', 5, 'P H E JS_3.docx', 'WEEK FIVE', 'Puberty.'],
  ['Physical & Health Education', 6, 'P H E JS_3.docx', 'WEEK SIX & SEVEN', 'Career Guidance in physical and health education'],
  ['Physical & Health Education', 7, 'P H E JS_3.docx', 'WEEK 8', 'The basic swimming strokes.'],
  ['Physical & Health Education', 8, 'P H E JS_3.docx', 'WEEK NINE', 'Gymnastics'],
  ['Physical & Health Education', 9, 'P H E JS_3.docx', 'WEEK  TEN', 'Officials of gymnastics and their duties'],
  ['Yoruba', 1, 'YORUBA  JS 3.docx', 'WEEK 1', 'AKORI EKO: IHUN ORISIIRISII AWE GBOLOHUN PO DI ODIDI GBOLOHUN'],
  ['Yoruba', 2, 'YORUBA  JS 3.docx', 'WEEK 2', 'AKORI EKO: ATUNYENWO LETA AIGBEFE (INFORMAL LETTER)'],
  ['Yoruba', 3, 'YORUBA  JS 3.docx', 'WEEK 3', 'AKORI EKO: EYAN'],
  ['Basic Technology', 1, 'basic tech.docx', 'Week 1', 'revision'],
  ['Basic Technology', 2, 'basic tech.docx', 'Week 2', 'building components [foundation]'],
  ['Basic Technology', 3, 'basic tech.docx', 'Week 3', 'windows'],
  ['Basic Technology', 4, 'basic tech.docx', 'Week 4&5', 'wood work project'],
  ['Basic Technology', 5, 'basic tech.docx', 'Week 6&7', 'metal joining'],
  ['Basic Technology', 6, 'basic tech.docx', 'Week 8', 'motion in engineering'],
  ['Basic Technology', 7, 'basic tech.docx', 'Week 9', 'electrical house wiring'],
  ['Basic Technology', 8, 'basic tech.docx', 'Week 10', 'tools and materials for house wiring'],
  ['Basic Technology', 9, 'basic tech.docx', 'Week 11', 'revision'],
  ['Basic Technology', 10, 'basic tech.docx', 'Week 12', 'examination'],
  ['Business Studies', 1, 'business_studies JSS3.docx', 'WEEK TWO - THREE', 'PERSONAL FINANCE'],
  ['Business Studies', 2, 'business_studies JSS3.docx', 'WEEK FIVE', 'TRADING, PROFIT AND LOSS ACCOUNT.'],
  ['Business Studies', 3, 'business_studies JSS3.docx', 'WEEK SIX', 'SPEED DEVELOPMENT IN SHORTHAND'],
  ['Business Studies', 4, 'business_studies JSS3.docx', 'WEEK SEVEN', 'APPLIED KEYBOARDING'],
  ['Home Economics', 1, 'home econs.docx', 'WEEK ONE', 'SCIENTIFIC STUDY OF FOOD'],
  ['Home Economics', 2, 'home econs.docx', 'WEEK TWO', 'BUDGETING'],
  ['Home Economics', 3, 'home econs.docx', 'WEEK THREE', 'FEEDING THE FAMILY'],
  ['Home Economics', 4, 'home econs.docx', 'WEEK FOUR AND FIVE', 'NUTRITIONAL NEEDS OF DIFFERENT PEOPLE IN THE FAMILY.'],
  ['Home Economics', 5, 'home econs.docx', 'WEEK SIX', 'BUYING, PRESERVATION AND STORAGE OF FOOD'],
  ['Home Economics', 6, 'home econs.docx', 'WEEK SEVEN & EIGHT', 'FOOD PREPARATION'],
  ['Home Economics', 7, 'home econs.docx', 'WEEK 9 & 10', 'FOOD PREPARATION (CONTD.)'],
  ['Civic Education', 1, 'js 3 civic.docx', 'WEEK ONE', 'Reviewed of last Term\u2019s work'],
  ['Civic Education', 2, 'js 3 civic.docx', 'WEEK TWO', 'VOTER EDUCATION'],
  ['Civic Education', 3, 'js 3 civic.docx', 'WEEK THREE', 'VOTER EDUCATION'],
  ['Civic Education', 4, 'js 3 civic.docx', 'WEEK FOUR', 'MEANING OF ELECTION'],
  ['Civic Education', 5, 'js 3 civic.docx', 'WEEK FIVE', 'ELECTORAL BODIES IN NIGERIA'],
  ['Civic Education', 6, 'js 3 civic.docx', 'WEEK SIX', 'FREE AND FAIR ELECTION'],
  ['Civic Education', 7, 'js 3 civic.docx', 'WEEK SEVEN', 'Electoral Malpractice'],
  ['Civic Education', 8, 'js 3 civic.docx', 'WEEK EIGHT', 'Planning for Results'],
  ['Civic Education', 9, 'js 3 civic.docx', 'WEEK NINE', 'The Current Nigerian constitution.'],
  ['Civic Education', 10, 'js 3 civic.docx', 'WEEK TEN', 'FEATURES OF THE 1999 CONSTITUTION'],
  ['English Language', 1, 'js 3 english.docx', 'WEEK TWO', 'CONSONANT CONTRAST /t/ and /s/'],
  ['English Language', 2, 'js 3 english.docx', 'WEEK TWO', 'CONJUNCTION'],
  ['English Language', 3, 'js 3 english.docx', 'WEEK THREE', 'COMPOSITION (ARTICLE WRITING)'],
  ['English Language', 4, 'js 3 english.docx', 'WEEK THREE', 'GRAMMAR: TOPIC PREFIXES AND SUFFIXES'],
  ['English Language', 5, 'js 3 english.docx', 'WEEK THREE', 'CONSONANT CONTRAST /Z/ AND /S/'],
  ['English Language', 6, 'js 3 english.docx', 'WEEK   FOUR', 'GRAMMAR: QUESTION TAGS'],
  ['English Language', 7, 'js 3 english.docx', 'WEEK   FOUR', 'VOWEL CONTRAST /\u1d27/ AND /a:/'],
  ['English Language', 8, 'js 3 english.docx', 'WEEK   FOUR', 'INFORMAL LETTER'],
  ['English Language', 9, 'js 3 english.docx', 'WEEK 5', 'NASAL SOUND / m n, \u0273/'],
  ['English Language', 10, 'js 3 english.docx', 'WEEK 5', 'PERSONAL AND POSSESSIVES PRONOUN'],
  ['English Language', 11, 'js 3 english.docx', 'WEEK 5', 'FORMAL LETTER'],
  ['English Language', 12, 'js 3 english.docx', 'WEEK 6', 'VOWEL /\u04d5/  and /\u04e1:/'],
  ['English Language', 13, 'js 3 english.docx', 'WEEK 6', 'READING AND ANSWERING QUESTION IN NEW OXFORD ENGLISH FOR JUNIOR SECONDARY SCHOOLS  3'],
  ['English Language', 14, 'js 3 english.docx', 'WEEK 6', 'REFLEXIVE AND RELATIVE PRONOUNS'],
  ['English Language', 15, 'js 3 english.docx', 'WEEK 6', 'EXPOSITORY ESSAY'],
  ['English Language', 16, 'js 3 english.docx', 'WEEK 7', 'SYNONYMS'],
  ['English Language', 17, 'js 3 english.docx', 'WEEK 7', 'EXPOSITORY'],
  ['English Language', 18, 'js 3 english.docx', 'WEEK 7', 'VOWEL /\u1d10:/ AND /\u1d10/'],
  ['English Language', 19, 'js 3 english.docx', 'WEEK 7', 'Reading a passage in New Oxford course for J S S 3'],
  ['English Language', 20, 'js 3 english.docx', 'WEEK 8', 'VOWELS /U/ AND /U:/'],
  ['English Language', 21, 'js 3 english.docx', 'WEEK 8', 'Reading and answering questions on acomprehension passage'],
  ['English Language', 22, 'js 3 english.docx', 'WEEK 8', 'DEMONSTRATIVE PRONOUNS'],
  ['English Language', 23, 'js 3 english.docx', 'WEEK 8', 'ARGUMENTATIVE ESSAY'],
  ['English Language', 24, 'js 3 english.docx', 'Week 9', 'SPEECH WORK: VOWEL /\u04d8/'],
  ['English Language', 25, 'js 3 english.docx', 'Week 9', 'ACTIVE AND PASSIVE VOICE'],
  ['English Language', 26, 'js 3 english.docx', 'Week 9', 'Reading and answer questions in a passage in new oxford course for junior secondary school 3.'],
  ['English Language', 27, 'js 3 english.docx', 'WEEK 10', 'REVISION'],
  ['English Language', 28, 'js 3 english.docx', 'WEEK 11', 'EXAMINATION.'],
  ['Music', 1, 'music.docx', 'WEEK ONE', 'REVISION EXERCISE'],
  ['Music', 2, 'music.docx', 'WEEK TWO', 'SINGING PATTERN'],
  ['Music', 3, 'music.docx', 'WEEK THREE', 'MINOR SCALE WTH KEY SIGNATURE D, E AND G MINOR (HARMONIC)'],
  ['Music', 4, 'music.docx', 'WEEK FOUR', 'RELATIVE MINOR KEYS WITH FOUR SHARPS AND FLATS'],
  ['Music', 5, 'music.docx', 'WEEK FIVE', 'ADDING SHORT MELODY TO GIVEN WORDS'],
  ['Music', 6, 'music.docx', 'WEEK SIX', 'NIGERIAN HIGHLIFE MUSICIANS'],
  ['Music', 7, 'music.docx', 'WEEK SEVEN', 'CADENCES'],
  ['Music', 8, 'music.docx', 'WEEK EIGHT', 'INVERSION OF TRIADS'],
  ['Music', 9, 'music.docx', 'WEEK NINE', 'TRANSPOSITION'],
  ['Social Studies', 1, 'social studies.docx', 'WEEK TWO', 'CONFLICTS'],
  ['Social Studies', 2, 'social studies.docx', 'WEEK THREE', 'POPULATION CENSUS'],
  ['Social Studies', 3, 'social studies.docx', 'WEEK FOUR', 'SELF \u2013 ESTEEM'],
  ['Social Studies', 4, 'social studies.docx', 'WEEK FIVE', 'NATIONAL ECONOMY'],
  ['Social Studies', 5, 'social studies.docx', 'WEEK SIX', 'SECTORS OF THE NIGERIAN ECONOMY'],
  ['Social Studies', 6, 'social studies.docx', 'WEEK SEVEN', 'MINERAL RESOURCES'],
  ['Social Studies', 7, 'social studies.docx', 'WEEK EIGHT', 'ECONOMIC REFORM MEASURES I'],
  ['Social Studies', 8, 'social studies.docx', 'WEEK NINE', 'ECONOMIC REFORM MEASURES II'],
  ['Social Studies', 9, 'social studies.docx', 'WEEK TEN', 'ECONOMIC INSTITUTIONS'],
];
// 1F-R4C reconciliation (evidence: AGENT_1F-R4B full-source run, Second-only dry run = 132 rows):
//   English Language 9 -> 28   patches 02-04: 26 body activities + Revision + Examination (also pinned by jss3-english-1f-r1)
//   Business Studies 8 -> 4    patch 06 holds weeks 4, 8, 9, 10 (four scheme-only headings)
//   Mathematics 10 -> 9        patch 06 holds week 4 "Statistics II"
// 118 + 19 - 4 - 1 = 132. Every other subject is unchanged. Basic Technology stays 10 (patch 05 only reclassifies week 1).
const EXPECTED: Record<string, number> = {
  'Agricultural Science': 8, 'Basic Science': 9, 'Basic Technology': 10, 'Business Studies': 4,
  'Civic Education': 10, 'Cultural & Creative Arts': 9, 'English Language': 28, 'French': 8,
  'Home Economics': 7, 'Mathematics': 9, 'Music': 9, 'Physical & Health Education': 9,
  'Social Studies': 9, 'Yoruba': 3,
};

test('pinned table: 132 rows, per-subject counts, gap-free order, unique (subject, week, title)', () => {
  assert.equal(PINNED.length, 132);
  const bySubject = new Map<string, Pinned[]>();
  for (const r of PINNED) (bySubject.get(r[0]) ?? bySubject.set(r[0], []).get(r[0])!).push(r);
  assert.deepEqual(Object.fromEntries([...bySubject].map(([s, l]) => [s, l.length]).sort()), Object.fromEntries(Object.entries(EXPECTED).sort()));
  assert.equal(Object.values(EXPECTED).reduce((a, b) => a + b, 0), 132);
  for (const [subject, list] of bySubject) list.forEach((r, i) => assert.equal(r[1], i + 1, `${subject}: order gap at #${i + 1}`));
  const keys = PINNED.map(r => `${r[0]}\u0000${canonicalJss3Week(r[3])}\u0000${r[4]}`);
  assert.equal(new Set(keys).size, keys.length, 'duplicate (subject, canonical week, title)');
  for (const r of PINNED) assert.ok(JSS3_SECOND_TERM_REVIEWED_SOURCES.includes(r[2]), `${r[2]} is a reviewed source`);
  assert.equal(new Set(PINNED.map(r => r[2])).size, 14, 'rows come from all 14 files');
});
// 1F-R4C / 1F-R3: the five scheme-only headings are pending (manifest: "do not import") and are HELD, so the pinned
// import table must NOT contain them. This test previously asserted they were present (pre-patch-06 behaviour).
test('pinned table: the five scheme-only headings are held, absent from the import table, and the rows around them are intact', () => {
  assert.equal(JSS3_SECOND_TERM_SCHEME_ONLY_HEADINGS.length, 5);
  for (const h of JSS3_SECOND_TERM_SCHEME_ONLY_HEADINGS) {
    const hits = PINNED.filter(r => r[0] === h.subject && r[2] === h.basename && canonicalJss3Week(r[3]) === h.week && r[4] === h.title);
    assert.equal(hits.length, 0, `${h.subject} / week ${h.week} / ${h.title} must not be an import row`);
  }
  const math = PINNED.filter(r => r[0] === 'Mathematics');
  assert.deepEqual(math.slice(2, 4).map(r => [r[3], r[4]]), [['WEEK 4', 'SOLVING SIMULTANEOUS EQUATION GRAPHICALLY'], ['WEEK 5', 'VARIATION']]);
  const bus = PINNED.filter(r => r[0] === 'Business Studies').map(r => canonicalJss3Week(r[3]));
  assert.deepEqual(bus, ['2-3', '5', '6', '7']);
});
test('non-instructional: 9 entries (Basic Tech Week 1 is instructional, 1F-R2), each matches exactly one row', () => {
  assert.equal(JSS3_SECOND_TERM_NON_INSTRUCTIONAL.length, 9);
  assert.equal(new Set(JSS3_SECOND_TERM_NON_INSTRUCTIONAL.map(e => `${e.basename}|${e.week}`)).size, 9);
  for (const e of JSS3_SECOND_TERM_NON_INSTRUCTIONAL) {
    assert.ok(JSS3_SECOND_TERM_REVIEWED_SOURCES.includes(e.basename), e.basename);
    const hits = PINNED.filter(r => r[0] === e.subject && r[2] === e.basename && canonicalJss3Week(r[3]) === e.week);
    assert.equal(hits.length, 1, `${e.subject} week ${e.week} must match exactly one row`);
    assert.match(hits[0][4], /revi|exam/i, `${e.subject} week ${e.week}: "${hits[0][4]}"`);
  }
  const flagged = PINNED.filter(r => isNonInstructional(r[2], T2, r[3]));
  assert.equal(flagged.length, 9);
  assert.equal(PINNED.length - flagged.length, 123);
  // Same rows in other terms or via other weeks are never flagged.
  assert.equal(isNonInstructional('music.docx', '1st Term', 'WEEK ONE'), false);
  assert.equal(isNonInstructional('music.docx', T2, 'WEEK TWO'), false);
  assert.equal(isNonInstructional('music.docx', T2, 'week 1'), true);
  assert.equal(isNonInstructional('BASIC 9 MATHEMATICS E-NOTE.docx', T2, 'WEEK SEVEN'), true);
});

// ── Wiring: additive only; Agent 1B's pinned lines intact ──────────────────
test('ingestTopics.ts: 2nd-Term wiring is additive and Agent 1B\'s pinned wiring still matches', () => {
  const s = readFileSync(path.join(backendDir, 'src/db/ingestTopics.ts'), 'utf8');
  // Agent 1B's own assertions, verbatim (tests/jss3-first-term.test.mts):
  assert.match(s, /text = applyJss1SourceTextResolution\(path\.basename\(filePath\), termLabel, text\);/);
  assert.match(s, /text = applyJss2SourceTextResolution\(path\.basename\(filePath\), termLabel, text\);/);
  assert.match(s, /\} else if \(validClassNames\.includes\('JSS 3'\)\) \{\s*text = applyJss3SourceTextResolution\(path\.basename\(filePath\), termLabel, text\);/);
  assert.match(s, /className === 'JSS 1'\s*\? resolveJss1ParsedTopic\(path\.basename\(filePath\), termLabel, topic\)\s*: className === 'JSS 3'\s*\? resolveJss3ParsedTopic/);
  // (a) import
  assert.match(s, /import \{\s*applyJss3SecondTermSourceTextResolution,\s*resolveJss3SecondTermParsedTopic,\s*\} from '\.\/jss3SecondTermResolutions\.js';/);
  // (b) statement after 1B's line, inside the same JSS 3 branch
  assert.match(s, /text = applyJss3SourceTextResolution\(path\.basename\(filePath\), termLabel, text\);\s*text = applyJss3SecondTermSourceTextResolution\(path\.basename\(filePath\), termLabel, text\);\s*\}/);
  // (c) separate .map stage directly before the existing .filter, gated on JSS 3
  assert.match(s, /: topic\)\s*\.map\(topic => className === 'JSS 3'\s*\? resolveJss3SecondTermParsedTopic\(path\.basename\(filePath\), termLabel, topic\)\s*: topic\)\s*\.filter\(\(topic\): topic is ParsedTopic => topic !== null\);/);
  assert.equal(s.match(/applyJss3SecondTermSourceTextResolution\(/g)?.length, 1);
  assert.equal(s.match(/resolveJss3SecondTermParsedTopic\(/g)?.length, 1);
  assert.equal(s.match(/applyJss3SourceTextResolution\(/g)?.length, 1);
  assert.equal(s.match(/resolveJss3ParsedTopic\(/g)?.length, 1);
});

// ── Optional: scheme-only manifest cross-check ─────────────────────────────
const MANIFEST = process.env.JSS3_SCHEME_MANIFEST;
test('manifest: the five 2nd-Term scheme-only titles equal the exported list', { skip: MANIFEST ? false : 'set JSS3_SCHEME_MANIFEST to cross-check the manifest' }, () => {
  assert.ok(MANIFEST && existsSync(MANIFEST), 'JSS3_SCHEME_MANIFEST must exist');
  const [head, ...lines] = readFileSync(MANIFEST!, 'utf8').split(/\r?\n/).filter(Boolean);
  const cols = head.split(',');
  const rows = lines.map(l => Object.fromEntries(l.split(',').map((v, i) => [cols[i], v])));
  const second = rows.filter(r => r.destination_term === '2nd Term');
  assert.equal(second.length, 5);
  assert.deepEqual(second.map(r => r.title), JSS3_SECOND_TERM_SCHEME_ONLY_HEADINGS.map(h => h.title));
  assert.deepEqual(second.map(r => `${r.subject}|${r.source_file}`), JSS3_SECOND_TERM_SCHEME_ONLY_HEADINGS.map(h => `${h.subject}|${h.basename}`));
  for (const r of second) assert.equal(r.original_term, '2nd Term');
});

// ── Real-source dry-run audit (only when a root is supplied) ───────────────
const ROOT = process.env.JSS3_SECOND_TERM_ROOT;
const real = { skip: ROOT ? false : 'set JSS3_SECOND_TERM_ROOT to run the real-source audit' } as const;

function audit(): string {
  assert.ok(ROOT && existsSync(ROOT), 'JSS3_SECOND_TERM_ROOT must exist');
  assert.ok(existsSync(path.join(ROOT!, 'JSS3 2ND TERM ')), 'JSS3_SECOND_TERM_ROOT must contain the folder "JSS3 2ND TERM " (trailing space)');
  // Dry run only: --yes is intentionally never passed, so no DB connection is opened.
  // execFileSync throws on a non-zero exit, so a returned string means exit 0.
  return execFileSync('npx', ['tsx', 'src/db/ingestTopics.ts', '--root', ROOT!, '--school-code', 'secondary'], {
    cwd: backendDir, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024,
  });
}
let cached: string | undefined;
const out = () => (cached ??= audit());
const ROW = /^  JSS 3 \/ (.+?) \/ 2nd Term #(\d+): JSS3 2ND TERM \/([^\n]+?) \/ ([^/\n]+?) \/ (.*)$/gm;
const rowsOf = (o: string): Pinned[] => [...o.matchAll(ROW)].map(m => [m[1], Number(m[2]), m[3], m[4], m[5]]);

test('real sources: exit 0, FILE AUDIT PASSED, 14 files, 132 rows, exact per-subject counts', real, () => {
  const o = out();
  assert.match(o, /Parsed 132 topic row\(s\) from 14 file\(s\)\./);
  assert.match(o, /FILE AUDIT PASSED/);
  assert.match(o, /Dry run only — no database connection or changes\./);
  assert.doesNotMatch(o, /BLOCKED|read error|Unsupported source format/i);
  for (const [subject, n] of Object.entries(EXPECTED)) {
    assert.ok(o.includes(`  JSS 3 / ${subject} / 2nd Term: ${n}\n`), `${subject} should have ${n} rows`);
  }
  assert.equal(o.match(/^  JSS 3 \/ .+ \/ 2nd Term: \d+$/gm)?.length, 14);
});
test('real sources: all rows are 2nd Term (no 1st/3rd Term rows, no other class)', real, () => {
  const o = out();
  assert.doesNotMatch(o, /JSS 3 \/ [^\n]* \/ (1st|3rd) Term/);
  assert.doesNotMatch(o, /^  (JSS [12]|SSS|Primary|PRY)[^\n]* \/ (1st|2nd|3rd) Term/m);
  assert.equal(rowsOf(o).length, 132);
});
test('real sources: deterministic — two independent runs are identical', real, () => {
  assert.equal(audit(), out());
});
test('real sources: the full ordered (subject, order, file, week, title) table is pinned', real, () => {
  assert.deepEqual(rowsOf(out()), PINNED);
});
test('real sources: unique (subject, canonical week, title); gap-free order; weeks never go backwards', real, () => {
  const rows = rowsOf(out());
  const keys = rows.map(r => `${r[0]}\u0000${canonicalJss3Week(r[3])}\u0000${r[4]}`);
  assert.equal(new Set(keys).size, rows.length);
  const bySubject = new Map<string, Pinned[]>();
  for (const r of rows) (bySubject.get(r[0]) ?? bySubject.set(r[0], []).get(r[0])!).push(r);
  for (const [subject, list] of bySubject) {
    list.forEach((r, i) => assert.equal(r[1], i + 1, `${subject}: order gap at #${i + 1}`));
    const wk = (r: Pinned) => Number(canonicalJss3Week(r[3]).match(/^\d+/)?.[0] ?? NaN);
    list.forEach((r, i) => {
      assert.ok(Number.isFinite(wk(r)), `${subject}: unparseable week "${r[3]}"`);
      if (i > 0) assert.ok(wk(r) >= wk(list[i - 1]), `${subject}: week order regresses at #${r[1]}`);
    });
  }
});
// 1F-R3: the manifest marks these five "pending parser and plan integration; do not import" and no approval was
// supplied, so they are HELD (visible in the audit report) and must not be rows of the import plan.
test('real sources: the five scheme-only headings are held in the audit report and are not import rows (1F-R3)', real, () => {
  const o = out();
  const rows = rowsOf(o);
  assert.match(o, /JSS3 PENDING ENTRIES — HELD, NOT IMPORTED .*: 5\n/);
  for (const h of JSS3_SECOND_TERM_SCHEME_ONLY_HEADINGS) {
    const hits = rows.filter(r => r[0] === h.subject && r[2] === h.basename && canonicalJss3Week(r[3]) === h.week && r[4] === h.title);
    assert.equal(hits.length, 0, `${h.subject} week ${h.week} ${h.title} must not be an import row`);
    assert.ok(o.includes(`HELD: JSS 3 / ${h.subject} / original term 2nd Term / JSS3 2ND TERM /${h.basename} / `), `${h.title} held`);
  }
  const math = rows.filter(r => r[0] === 'Mathematics').map(r => r[4]);
  assert.deepEqual(math.slice(2, 4), ['SOLVING SIMULTANEOUS EQUATION GRAPHICALLY', 'VARIATION']);
});
test('real sources: 9 non-instructional rows each match exactly one row (Basic Tech Week 1 reclassified, row count unchanged)', real, () => {
  const rows = rowsOf(out());
  for (const e of JSS3_SECOND_TERM_NON_INSTRUCTIONAL) {
    assert.equal(rows.filter(r => r[0] === e.subject && r[2] === e.basename && canonicalJss3Week(r[3]) === e.week).length, 1, `${e.subject} week ${e.week}`);
  }
  const flagged = rows.filter(r => isNonInstructional(r[2], T2, r[3]));
  assert.equal(flagged.length, 9);
});
test('real sources: the defects found in review are gone', real, () => {
  const o = out();
  const rows = rowsOf(o);
  assert.doesNotMatch(o, /\(untitled\)/);
  assert.equal(rows.filter(r => /^[\s;:\-\u2013\u2014]/.test(r[4])).length, 0, 'no title starts with a separator');
  assert.equal(rows.filter(r => /^\W*$/.test(r[4])).length, 0, 'no empty/punctuation-only titles');
  assert.ok(rows.some(r => r[2] === 'FRENCH  js 3.docx' && r[3] === 'WEEK 2' && r[4] === 'Dater et mesurer le temp'));
  assert.ok(rows.some(r => r[2] === 'JS 3 FINE ART.docx' && r[3] === 'WEEK 5' && r[4] === 'SINGING IN PARTS AND CADENCE IDENTIFICATION'));
  assert.doesNotMatch(o, /Basic Science \/ 2nd Term #\d+: [^\n]*\/ (WK|Wk)/);
  assert.doesNotMatch(o, /Yoruba \/ 2nd Term #\d+: [^\n]*\/ Week \d/);
  assert.equal(rows.filter(r => r[2] === 'basic tech.docx').length, 10);
  assert.equal(rows.filter(r => r[2] === 'music.docx').length, 9);
});
