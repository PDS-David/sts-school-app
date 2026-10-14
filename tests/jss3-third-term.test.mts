// Run (unit tests only):
//   cd backend && npx tsx --test ../tests/jss3-third-term.test.mts
// Run with the real-source dry-run audit (no database is touched; --yes is never passed):
//   cd backend && JSS3_ALL_ROOT=/path/to/root npx tsx --test ../tests/jss3-third-term.test.mts
// where the root CONTAINS the three original term folders ("JSS3 1ST TERM ", "JSS3 2ND TERM ",
// "JSS3 3RD TERM " - note the trailing spaces), with First-Term Music supplied as the converted
// "JSS3 Alpha term music Enote.docx" (and no .rtf). Needs python3 + python-docx for the
// tampered-duplicate negative control (skipped when unavailable).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdtempSync, readdirSync, readFileSync, rmSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  JSS3_EXCLUDED_SUBJECTS,
  JSS3_THIRD_TERM_MANIFEST,
  JSS3_THIRD_TERM_REVIEWED_SOURCES,
  applyJss3ThirdTermSourceTextResolution as apply,
  hasJss3ThirdTermSourceResolution as hasRule,
  redistributeJss3ThirdTermTopics as redistribute,
} from '../backend/src/db/jss3ThirdTermRedistribution.ts';

const here = path.dirname(fileURLToPath(import.meta.url));
const backendDir = path.resolve(here, '..', 'backend');
const T3 = '3rd Term';
const NB = '\u00a0';

// 1F-R5: PHE.docx now carries a text rule (the WEEKS SEVEN AND EIGHT / REVISON AND EXAMINATION boundary).
const RULED = ['Basic science.docx', 'BASIC TECH.docx', 'MUSIC.docx', 'OMEGA TERM YORUBA JS3.docx', 'Fine art.docx', 'ENGLISH.docx', 'PHE.docx'];
const NO_RULE = [
  'Agriculture science  Book 3.docx', 'BUSINESS STUDIES FOR JSS3.docx', 'CIVIC.docx', 'HOME ECONS.docx',
];

// ── Manifest integrity ─────────────────────────────────────────────────────
test('manifest: eleven reviewed sources, every manifest file reviewed, no Computer Studies', () => {
  assert.equal(JSS3_THIRD_TERM_REVIEWED_SOURCES.length, 11);
  assert.equal(new Set(JSS3_THIRD_TERM_REVIEWED_SOURCES).size, 11);
  assert.deepEqual([...new Set(JSS3_THIRD_TERM_MANIFEST.map(e => e.basename))].sort(), [...JSS3_THIRD_TERM_REVIEWED_SOURCES].sort());
  for (const s of JSS3_EXCLUDED_SUBJECTS) assert.ok(!JSS3_THIRD_TERM_MANIFEST.some(e => e.subject === s), s);
  assert.ok(JSS3_EXCLUDED_SUBJECTS.includes('Computer Studies'));
  assert.ok(!JSS3_THIRD_TERM_MANIFEST.some(e => /computer/i.test(e.subject + e.basename + e.title)));
});

test('manifest: classification, destination and duplicate fields are internally consistent', () => {
  for (const e of JSS3_THIRD_TERM_MANIFEST) {
    const id = `${e.basename} / ${e.week} / ${e.title}`;
    assert.ok(['instructional', 'exact-duplicate', 'revision', 'examination', 'held'].includes(e.classification), id);
    if (e.classification === 'instructional') {
      assert.ok(e.destination === '1st Term' || e.destination === '2nd Term', `${id}: destination must be 1st/2nd Term`);
      assert.equal(e.kind, 'parsed', id);
    } else {
      assert.equal(e.destination, undefined, `${id}: only instructional rows have a destination`);
    }
    if (e.classification === 'exact-duplicate') {
      assert.ok(e.duplicateOf && e.duplicateOf.term === '1st Term', id);
      assert.equal(e.kind, 'parsed', id);
    } else {
      assert.equal(e.duplicateOf, undefined, id);
    }
    if (e.kind === 'scheme-only') assert.ok(e.sourcePhrase, `${id}: scheme-only rows need a sourcePhrase`);
    assert.ok(e.note.length > 10, `${id}: rationale required`);
    assert.notEqual((e as { destination?: string }).destination, '3rd Term');
  }
});

test('manifest: no duplicate mapping keys', () => {
  const keys = JSS3_THIRD_TERM_MANIFEST.map(e => JSON.stringify([e.basename, e.kind, e.week, e.title]));
  assert.equal(new Set(keys).size, keys.length);
});

test('manifest: classification totals (63 parsed Third-Term rows + 11 scheme-only items)', () => {
  const by = (pred: (e: (typeof JSS3_THIRD_TERM_MANIFEST)[number]) => boolean) => JSS3_THIRD_TERM_MANIFEST.filter(pred).length;
  assert.equal(by(e => e.kind === 'parsed'), 63); // 1F-R5: +1 non-instructional PHE marker block (was 62)
  assert.equal(by(e => e.kind === 'scheme-only'), 11);
  assert.equal(by(e => e.classification === 'instructional'), 50);
  assert.equal(by(e => e.classification === 'instructional' && e.destination === '1st Term'), 20);
  assert.equal(by(e => e.classification === 'instructional' && e.destination === '2nd Term'), 30);
  assert.equal(by(e => e.classification === 'exact-duplicate'), 6);
  assert.equal(by(e => e.classification === 'held'), 2);
  assert.deepEqual(
    JSS3_THIRD_TERM_MANIFEST.filter(e => e.classification === 'held').map(e => `${e.basename}|${e.title}`).sort(),
    ['OMEGA TERM YORUBA JS3.docx|AKANLO EDE', 'PHE.docx|Practical on Taekwondo'],
  );
});

// ── Text rules ─────────────────────────────────────────────────────────────
test('exactly the seven reviewed Third-Term files carry a text rule, and only in 3rd Term', () => {
  for (const f of RULED) { assert.equal(hasRule(f, T3), true, f); assert.equal(hasRule(f, '1st Term'), false, f); assert.equal(hasRule(f, '2nd Term'), false, f); }
  for (const f of NO_RULE) assert.equal(hasRule(f, T3), false, f);
  assert.equal([...RULED, ...NO_RULE].length, 11);
});

test('First/Second-Term text and unreviewed files are returned unchanged', () => {
  const sample = 'WEEK 1\nanything\n';
  for (const f of RULED) {
    assert.equal(apply(f, '1st Term', sample), sample);
    assert.equal(apply(f, '2nd Term', sample), sample);
  }
  assert.equal(apply('not-reviewed.docx', T3, sample), sample);
  for (const f of NO_RULE) assert.equal(apply(f, T3, sample), sample);
});

const BSC = ['JSS 3 OMEGA TERM E-NOTE', 'SCHEME OF WORK', 'WEEK 1-Family life Education One', 'WEEK 2-Family life Education Two', '', 'WEEK 1- FAMILY LIFE EDUCATION [i]', 'a', 'WEEK 2- FAMILY LIFE EDUCATION [ii].', 'b', ''].join('\n');
test('Basic Science: scheme cut, lessons kept', () => {
  const out = apply('Basic science.docx', T3, BSC);
  assert.ok(out.startsWith('WEEK 1- FAMILY LIFE EDUCATION [i]'));
  assert.ok(!out.includes('Family life Education One'));
  assert.ok(out.includes('WEEK 2- FAMILY LIFE EDUCATION [ii].'));
  assert.throws(() => apply('Basic science.docx', T3, 'WEEK 1-x'), /anchor missing/);
  assert.throws(() => apply('Basic science.docx', T3, `${BSC}\n${BSC}`), /ambiguous/);
});

test('Basic Technology: scheme cut at the body "Week 1   revision"', () => {
  const t = ['JSS3', 'Week 1: revision of last term’s work', 'Week2: fault detection', '', 'Week 1         revision', 'x', 'Week 2.           Fault detection', 'y'].join('\n');
  const out = apply('BASIC TECH.docx', T3, t);
  assert.ok(out.startsWith('Week 1         revision'));
  assert.ok(!out.includes('Week2: fault detection'));
  assert.throws(() => apply('BASIC TECH.docx', T3, 'Week 1: revision'), /anchor missing/);
});

test('Music: scheme cut at the bare WEEK ONE line', () => {
  const t = ['MUSIC HANDOUT', 'WEEK ONE      ------- REVISION & REVISION EXERCISE', '', `${NB}`, 'WEEK ONE', 'REVISION EXERCISE', 'WEEK TWO', 'PERIODS'].join('\n');
  const out = apply('MUSIC.docx', T3, t);
  assert.ok(out.startsWith('WEEK ONE\nREVISION EXERCISE'));
  assert.throws(() => apply('MUSIC.docx', T3, 'nothing here'), /anchor missing/);
});

test('Yoruba: scheme cut; exactly KINNI..KAUN become WEEK 1..5; unreviewed ordinal throws', () => {
  const body = (ords: string[]) => ords.map(o => `OSE ${o}\nAKORI EKO: X\ntext`).join('\n');
  const t = `OSE\n1\nLETA GBEFE\n2\nEYAN\n${body(['KINNI', 'KEJI', 'KETA', 'KERIN', 'KAUN'])}`;
  const out = apply('OMEGA TERM YORUBA JS3.docx', T3, t);
  assert.ok(out.startsWith('WEEK 1\nAKORI EKO: X'));
  assert.deepEqual([...out.matchAll(/^WEEK (\d)$/gm)].map(m => m[1]), ['1', '2', '3', '4', '5']);
  assert.ok(!/OSE KINNI/.test(out));
  assert.throws(() => apply('OMEGA TERM YORUBA JS3.docx', T3, `${t}\nOSE KEFA\nx`), /unreviewed Yoruba OSE heading/);
  assert.throws(() => apply('OMEGA TERM YORUBA JS3.docx', T3, `OSE\n1\n${body(['KINNI', 'KEJI', 'KETA', 'KERIN'])}`), /anchor missing/);
});

const FA_HEAD = (n: string) => `CLASS;  J S S 3   WEEK ${n}        `;
const FINE_ART = [
  'OMEGA TERM E-Note \t\tCLASS; J SS 3', 'SUBJECT; CULTURAL AND CREATIVE ARTS', 'SCHEME OF WORK', 'WEEK  1.  \tMODULATION.', '',
  FA_HEAD('1'), 'TOPIC; MODULATION.', 'a', FA_HEAD('2'), 'TOPIC; MAKETING OF ART WORKS.', 'b', FA_HEAD('3'), 'TOPIC; UNITY.', 'c',
  FA_HEAD('4'), 'TOPIC; PRACTICAL: BREATH CONTROL VOICE TRAINIG AND', '\t\tINSTRUMENTALS.', 'd', FA_HEAD('5'), 'TOPIC; BATIK', 'e', FA_HEAD('6- 8'), 'TOPIC; REVITIONS ON PREVIOUS WORKS.', 'f', '',
].join('\n');
test('Fine Art: six CLASS/WEEK headers split to WEEK-first lines; SUBJECT preamble kept; scheme WEEK row dropped', () => {
  const out = apply('Fine art.docx', T3, FINE_ART);
  assert.ok(out.includes('SUBJECT; CULTURAL AND CREATIVE ARTS'));
  assert.ok(!out.includes('WEEK  1.  \tMODULATION.'));
  assert.deepEqual([...out.matchAll(/^WEEK (\S+)$/gm)].map(m => m[1]), ['1', '2', '3', '4', '5', '6-8']);
  assert.ok(out.includes('WEEK 4\nCLASS; J S S 3\n'));
  assert.throws(() => apply('Fine art.docx', T3, FINE_ART.replace(FA_HEAD('5'), 'CLASS; J S S 3')), /expected exactly 6/);
  assert.throws(() => apply('Fine art.docx', T3, FINE_ART.replace('SCHEME OF WORK', 'SCHEME')), /SCHEME OF WORK/);
});

const ENGLISH = [
  'SCHEME OF WORK FOR ENGLISH LANGUAGE', 'OMEGA TERM JSS THREE', 'Revision of 2nd Terms examination.', '11            EXAMINATION.',
  '   WEEK TWO', 'REVISION', 'SPEECH WORK ', 'TOPIC: THE VOWEL SOUNDS', 'v',
  'REVISION', 'GRAMMAR', '', 'TOPIC: MEANING AND TYPES OF NOUN', 'n',
  'REVISION', 'COMPOSITION', 'TOPIC: ESSAY WRITING', 'e',
  '   WEEK THREE', 'REVISION', 'SPEECH WORK ', 'TOPIC: VOWEL SOUNDS', 'SUB-TOPIC: DIPHTHONGS', 'd',
  'REVISION', 'LITERATURE', 'TOPIC: LITERARY TERMS', 'l',
  '   WEEK THREE ', 'REVISION', 'GRAMMAR ', 'TOPIC: ARTICLE', 'a',
  'REVISION', 'GRAMMAR', 'TOPIC: PART OF SPEECH', 'p', '',
].join('\n');
test('English: scheme cut; every TOPIC block gets exactly one WEEK line under the right heading', () => {
  const out = apply('ENGLISH.docx', T3, ENGLISH);
  assert.ok(out.startsWith('   WEEK TWO'));
  assert.ok(!out.includes('11            EXAMINATION.'));
  assert.deepEqual([...out.matchAll(/^[ \t]*WEEK[ \t]+(TWO|THREE)[ \t]*$/gm)].map(m => m[1]), ['TWO', 'TWO', 'TWO', 'THREE', 'THREE', 'THREE', 'THREE']);
  assert.equal(out.match(/^[ \t]*TOPIC:/gm)?.length, 7);
  // the inserted marker sits immediately before the REVISION caption of its block
  assert.match(out, /WEEK TWO\nREVISION\nGRAMMAR\n\nTOPIC: MEANING AND TYPES OF NOUN/);
  assert.throws(() => apply('ENGLISH.docx', T3, 'REVISION\nGRAMMAR\nTOPIC: X'), /anchor missing/);
});

// ── Redistribution function ────────────────────────────────────────────────
const tp = (weekLabel: string, title: string, body = `${weekLabel}\n${title}\ntext`) => ({ weekLabel, title, body });
const PHE_TOPICS = [
  tp('WEEK ONE', 'Family Health'), tp('WEEK TWO', 'TAEKWONDO'), tp('WEEK THREE', 'Practical on Taekwondo'),
  tp('WEEK FOUR', 'Sexually Transmitted Diseases (STDs)'), tp('WEEK FIVE', 'BOXING'), tp('WEEK SIX', 'DRUG EDUCATION'),
  tp('WEEK 7&8', 'REVISON AND EXAMINATION'), // 1F-R5: parsed marker block (title is the body's first heading line, not the week heading)
];
test('redistribute: instructional rows get their manifest destination; held row is not imported', () => {
  const r = redistribute('PHE.docx', T3, 'Physical & Health Education', PHE_TOPICS);
  assert.deepEqual(r.kept.map(k => `${k.title}→${k.destinationTerm}`), [
    'Family Health→1st Term', 'TAEKWONDO→2nd Term', 'Sexually Transmitted Diseases (STDs)→1st Term', 'BOXING→2nd Term', 'DRUG EDUCATION→1st Term',
  ]);
  assert.equal(r.claims.length, 0);
  assert.equal(r.records.filter(x => x.classification === 'held').length, 1);
  assert.ok(r.kept.every(k => k.destinationTerm !== ('3rd Term' as string)));
});
test('redistribute: leading separators are cleaned from titles; week/body untouched', () => {
  const r = redistribute('BUSINESS STUDIES FOR JSS3.docx', T3, 'Business Studies', [
    tp('WEEK 2', ': ERASING TECHNIQUES'), tp('WEEK 3', ': MEMORANDUM'), tp('WEEK 4', ':\tBUSINESS LETTER'),
    tp('WEEK 5', ':\tBUSINESS LETTER (CONTINUATION)'), tp('WEEK 6', ':\tSIMPLE TABULATION'),
  ]);
  assert.deepEqual(r.kept.map(k => k.title), ['ERASING TECHNIQUES', 'MEMORANDUM', 'BUSINESS LETTER', 'BUSINESS LETTER (CONTINUATION)', 'SIMPLE TABULATION']);
  assert.deepEqual(r.kept.map(k => k.weekLabel), ['WEEK 2', 'WEEK 3', 'WEEK 4', 'WEEK 5', 'WEEK 6']);
  assert.ok(r.kept.every(k => k.destinationTerm === '2nd Term'));
});
test('redistribute: a missing, extra, renamed or reordered topic fails (unaccounted topic cannot pass)', () => {
  const sub = 'Physical & Health Education';
  assert.throws(() => redistribute('PHE.docx', T3, sub, PHE_TOPICS.slice(0, 5)), /manifest mismatch/);
  assert.throws(() => redistribute('PHE.docx', T3, sub, [...PHE_TOPICS, tp('WEEK SEVEN', 'NEW UNCLASSIFIED TOPIC')]), /manifest mismatch/);
  assert.throws(() => redistribute('PHE.docx', T3, sub, PHE_TOPICS.map((t, i) => (i === 4 ? tp('WEEK FIVE', 'KICKBOXING') : t))), /manifest mismatch/);
  const swapped = [...PHE_TOPICS]; [swapped[1], swapped[4]] = [swapped[4], swapped[1]];
  assert.throws(() => redistribute('PHE.docx', T3, sub, swapped), /manifest mismatch/);
  assert.throws(() => redistribute('PHE.docx', T3, sub, PHE_TOPICS.map((t, i) => (i === 0 ? tp('WEEK TWO', 'Family Health') : t))), /manifest mismatch/);
});
test('redistribute: wrong subject, unreviewed source and non-3rd-term all throw', () => {
  assert.throws(() => redistribute('PHE.docx', T3, 'Music', PHE_TOPICS), /subject mismatch/);
  assert.throws(() => redistribute('Computer studies.docx', T3, 'Computer Studies', [tp('WEEK 1', 'Intro')]), /has not been reviewed/);
  assert.throws(() => redistribute('PHE.docx', '2nd Term', 'Physical & Health Education', PHE_TOPICS), /called for term/);
});
test('redistribute: Civic weeks 2-7 become exact-duplicate claims on the First-Term Civic rows; weeks 1, 8, 9 are BECE preparation', () => {
  const topics = [
    tp('WEEK ONE', 'Review of last term work'), tp('WEEK TWO', 'The role of citizen in constitutional developments'), tp('WEEK THREE', 'National Security'),
    tp('WEEK FOUR', 'State Security Service'), tp('WEEK FIVE', 'Self-Employment'), tp('WEEK SIX', 'Self Employment II'),
    tp('WEEK SEVEN', 'Managing For Results.'), tp('WEEK EIGHT', 'General Revision.'), tp('WEEK NINE', 'Practice past AKWA'),
  ];
  const r = redistribute('CIVIC.docx', T3, 'Civic Education', topics);
  assert.equal(r.kept.length, 0);
  assert.equal(r.claims.length, 6);
  assert.deepEqual(r.claims.map(c => c.week), ['2', '3', '4', '5', '6', '7']);
  assert.ok(r.claims.every(c => c.duplicateOf.basename === 'JSS 3 CIVIC (E NOTE).docx' && c.duplicateOf.term === '1st Term' && c.duplicateOf.week === c.week));
  assert.deepEqual(r.records.filter(x => x.classification === 'revision' || x.classification === 'examination').map(x => x.week), ['1', '8', '9']);
});
test('redistribute: Music week 6 and Fine Art week 4 titles are recovered from the body', () => {
  const music = redistribute('MUSIC.docx', T3, 'Music', [
    tp('WEEK ONE', 'REVISION EXERCISE'), tp('WEEK TWO', 'PERIODS IN MUSIC: BAROUQE, CLASSICAL & ROMANTIC'), tp('WEEK THREE', 'TRANSCRIPTION FROM STAFF TO SOLFA-NOTATION'),
    tp('WEEK FOUR', 'TRANSPOSITION'), tp('WEEK FIVE', 'MODULATION'),
    tp('WEEK SIX', 'Anon ---------- unknown', 'WEEK SIX\n  TERMS & SIGNS\nAnon ---------- unknown\n'),
  ]);
  assert.equal(music.kept.at(-1)!.title, 'TERMS & SIGNS');
  assert.equal(music.kept.at(-1)!.destinationTerm, '1st Term');
  const fa = redistribute('Fine art.docx', T3, 'Cultural & Creative Arts', [
    tp('WEEK 1', 'MODULATION.'), tp('WEEK 2', 'MAKETING OF ART WORKS.'), tp('WEEK 3', 'UNITY.'),
    tp('WEEK 4', 'PRACTICAL: BREATH CONTROL VOICE TRAINIG AND', 'WEEK 4\nCLASS; J S S 3\n\nTOPIC; PRACTICAL: BREATH CONTROL VOICE TRAINIG AND\n\n\t\tINSTRUMENTALS.\n\nBreathing'),
    tp('WEEK 5', 'BATIK'), tp('WEEK 6-8', 'REVITIONS ON PREVIOUS WORKS.'),
  ]);
  assert.ok(fa.kept.some(k => k.title === 'PRACTICAL: BREATH CONTROL VOICE TRAINIG AND INSTRUMENTALS.'));
  assert.throws(() => redistribute('MUSIC.docx', T3, 'Music', [
    tp('WEEK ONE', 'REVISION EXERCISE'), tp('WEEK TWO', 'PERIODS IN MUSIC: BAROUQE, CLASSICAL & ROMANTIC'), tp('WEEK THREE', 'TRANSCRIPTION FROM STAFF TO SOLFA-NOTATION'),
    tp('WEEK FOUR', 'TRANSPOSITION'), tp('WEEK FIVE', 'MODULATION'), tp('WEEK SIX', 'Anon', 'WEEK SIX\nnothing'),
  ]), /anchor missing/);
});
test('importer wiring is gated on JSS 3 and 3rd Term and redistributes only through the module', () => {
  const s = readFileSync(path.join(backendDir, 'src/db/ingestTopics.ts'), 'utf8');
  assert.match(s, /if \(validClassNames\.includes\('JSS 3'\)\) \{\s*text = applyJss3ThirdTermSourceTextResolution\(path\.basename\(filePath\), termLabel, text\);\s*\}/);
  assert.match(s, /if \(className === 'JSS 3' && termLabel === '3rd Term' && parsedAll\.length > 0\) \{/);
  assert.equal(s.match(/applyJss3ThirdTermSourceTextResolution\(/g)?.length, 1);
  assert.equal(s.match(/redistributeJss3ThirdTermTopics\(/g)?.length, 1);
  assert.match(s, /termLabel: t\.destinationTerm \?\? termLabel/);
  // the three audit gates are present and feed the blocker count
  for (const needle of ['must have zero instructional rows', 'is excluded but has a row', 'Claimed exact duplicate is not identical', 'is missing from this run']) {
    assert.ok(s.includes(needle), needle);
  }
  assert.match(s, /subjectConflicts\.size \+ suspiciousTopics\.size \+ jss3Gate\.length;/);
});

// ── Real-source dry-run audit (only when a root is supplied) ───────────────
const ROOT = process.env.JSS3_ALL_ROOT;
const real = { skip: ROOT ? false : 'set JSS3_ALL_ROOT to run the real-source audit' } as const;
const FOLDERS = ['JSS3 1ST TERM ', 'JSS3 2ND TERM ', 'JSS3 3RD TERM '];

function run(root: string): { code: number; out: string } {
  // Dry run only: --yes is intentionally never passed, so no DB connection is opened.
  const r = spawnSync('npx', ['tsx', 'src/db/ingestTopics.ts', '--root', root, '--school-code', 'secondary'], {
    cwd: backendDir, encoding: 'utf8', maxBuffer: 128 * 1024 * 1024,
  });
  return { code: r.status ?? -1, out: `${r.stdout}${r.stderr}` };
}
let full: { code: number; out: string } | undefined;
const fullRun = () => (full ??= run(ROOT!));

function rowsOf(o: string): Array<{ subject: string; term: string; n: number; src: string; file: string; week: string; title: string }> {
  return [...o.matchAll(/^ {2}JSS 3 \/ (.+?) \/ (1st|2nd|3rd) Term #(\d+): (.+?) \/ (.+?) \/ (.*)$/gm)]
    .map(m => ({ subject: m[1], term: `${m[2]} Term`, n: Number(m[3]), src: m[4], file: m[4].split('/').pop()!, week: m[5], title: m[6] }));
}
function mapCsv(o: string): string[][] {
  const start = o.indexOf('JSS3 THIRD-TERM SOURCE -> DESTINATION MAP (csv)');
  const end = o.indexOf('END JSS3 THIRD-TERM MAP');
  assert.ok(start >= 0 && end > start, 'importer must print the source→destination map');
  return o.slice(start, end).split('\n').slice(2).filter(Boolean).map(l => {
    const cells: string[] = []; let cur = ''; let q = false;
    for (let i = 0; i < l.length; i++) {
      const c = l[i];
      if (q) { if (c === '"' && l[i + 1] === '"') { cur += '"'; i++; } else if (c === '"') q = false; else cur += c; }
      else if (c === '"') q = true; else if (c === ',') { cells.push(cur); cur = ''; } else cur += c;
    }
    cells.push(cur); return cells;
  });
}

test('real sources: 39 originals, audit passes, 313 rows, no gate failure', real, () => {
  assert.ok(ROOT && FOLDERS.every(f => existsSync(path.join(ROOT, f))), 'JSS3_ALL_ROOT must contain the three term folders');
  const all = readdirSync(ROOT!, { recursive: true }).map(String).filter(f => /\.(docx?|rtf)$/i.test(f));
  assert.equal(all.length, 39);
  assert.equal(all.filter(f => /\.rtf$/i.test(f)).length, 0);
  const { code, out } = fullRun();
  assert.equal(code, 0, out.slice(-3000));
  assert.match(out, /Found 39 candidate file\(s\)/);
  assert.match(out, /Parsed 313 topic row\(s\) from 38 file\(s\)\./);
  assert.match(out, /FILE AUDIT PASSED/);
  assert.doesNotMatch(out, /gate FAILED|AUDIT BLOCKED|failed to read|DUPLICATE normalized content/);
});

test('real sources: Third Term has zero rows; Computer Studies has zero rows or files; terms 1/2 hold 151/162', real, () => {
  const { out } = fullRun();
  const rows = rowsOf(out);
  assert.equal(rows.filter(r => r.term === '3rd Term').length, 0);
  assert.doesNotMatch(out, /JSS 3 \/ [^\n]* \/ 3rd Term/);
  // 1F-R4C: 143/148/291 -> 151/162/313 (R4B combined dry run). 151 = First-only 131 + 20 redistributed Third-Term topics;
  // 162 = Second-only 132 + 30 redistributed Third-Term topics; 313 = 151 + 162. Third-Term map (73 rows before 1F-R5): 20 -> 1st,
  // 30 -> 2nd, 23 not imported (9 revision, 6 examination, 6 exact duplicate, 2 held).
  // 1F-R5 manifest-block count (not executable rows): 73 -> 74 map rows; 24 not imported (9 revision, 7 examination, 6 exact duplicate, 2 held).
  // Executable rows are unchanged: 151 / 162 / 313.
  assert.equal(rows.filter(r => r.term === '1st Term').length, 151);
  assert.equal(rows.filter(r => r.term === '2nd Term').length, 162);
  assert.equal(rows.length, 313);
  assert.equal(rows.filter(r => /computer/i.test(r.subject)).length, 0);
  assert.doesNotMatch(out, /Computer/i);
  assert.equal(readdirSync(ROOT!, { recursive: true }).some(f => /comput|ict/i.test(String(f))), false);
});

test('real sources: every manifest instructional topic is imported once, in its destination, with its source file', real, () => {
  const rows = rowsOf(fullRun().out);
  const instr = JSS3_THIRD_TERM_MANIFEST.filter(e => e.classification === 'instructional');
  assert.equal(instr.length, 50);
  const norm = (s: string) => s.replace(/\s+/g, ' ').trim().toLowerCase();
  const third = rows.filter(r => r.src.startsWith('JSS3 3RD TERM '));
  for (const e of instr) {
    const hits = third.filter(r => r.file === e.basename && r.term === e.destination && norm(r.title) === norm(e.title));
    assert.equal(hits.length, 1, `${e.basename} / ${e.week} / ${e.title} → ${e.destination}`);
    assert.ok(!third.some(r => r.file === e.basename && norm(r.title) === norm(e.title) && r.term !== e.destination), `${e.title} must not appear in another term`);
  }
  const thirdFiles = third;
  assert.equal(thirdFiles.length, 50);
  // nothing that is revision/examination/held/duplicate leaked in
  for (const e of JSS3_THIRD_TERM_MANIFEST.filter(x => x.kind === 'parsed' && x.classification !== 'instructional')) {
    assert.equal(thirdFiles.filter(r => r.file === e.basename && norm(r.title) === norm(e.title)).length, 0, `${e.basename} / ${e.title} must not be imported`);
  }
});

test('real sources: map covers every Third-Term source and item once, hashes present, duplicates proven', real, () => {
  const csv = mapCsv(fullRun().out);
  assert.equal(csv.length, JSS3_THIRD_TERM_MANIFEST.length);
  const keys = csv.map(c => JSON.stringify([c[1], c[5], c[3], c[4]]));
  assert.equal(new Set(keys).size, keys.length, 'duplicate mapping keys');
  assert.deepEqual([...new Set(csv.map(c => c[1]))].sort(), [...JSS3_THIRD_TERM_REVIEWED_SOURCES].sort());
  for (const c of csv) {
    assert.equal(c[2], '3rd Term');
    if (c[5] === 'parsed') assert.match(c[9], /^[0-9a-f]{64}$/, `${c[1]} / ${c[3]}`); else assert.equal(c[9], '');
    if (c[6] === 'instructional') assert.ok(c[7] === '1st Term' || c[7] === '2nd Term');
    else assert.equal(c[7], '');
  }
  assert.equal(csv.filter(c => c[6] === 'exact-duplicate').length, 6);
  assert.ok(csv.filter(c => c[6] === 'exact-duplicate').every(c => c[8].startsWith('1st Term / JSS 3 CIVIC (E NOTE).docx / week ')));
});

test('real sources: every scheme-only phrase and every parsed heading really occurs in its source file', real, async () => {
  const mammoth = (await import('mammoth')).default as { extractRawText(o: { path: string }): Promise<{ value: string }> };
  const dir = path.join(ROOT!, 'JSS3 3RD TERM ');
  const collapse = (s: string) => s.replace(/\s+/g, ' ').toLowerCase();
  const texts = new Map<string, string>();
  for (const f of JSS3_THIRD_TERM_REVIEWED_SOURCES) {
    assert.ok(existsSync(path.join(dir, f)), `missing source ${f}`);
    texts.set(f, collapse((await mammoth.extractRawText({ path: path.join(dir, f) })).value));
  }
  for (const e of JSS3_THIRD_TERM_MANIFEST) {
    const t = texts.get(e.basename)!;
    if (e.kind === 'scheme-only') assert.ok(t.includes(collapse(e.sourcePhrase!)), `${e.basename}: "${e.sourcePhrase}" not in source`);
    else if (e.title !== 'revision') assert.ok(t.includes(collapse(e.title.replace(/^AKORI?N? EKO: /, '').replace(/\.$/, ''))) || e.basename === 'Fine art.docx', `${e.basename}: heading "${e.title}" not in source`);
  }
});

test('real sources: existing First/Second-Term rows are an exact prefix of the run without Third Term', real, () => {
  const tmp = mkdtempSync(path.join(os.tmpdir(), 'jss3-no3rd-'));
  try {
    for (const f of FOLDERS.slice(0, 2)) cpSync(path.join(ROOT!, f), path.join(tmp, f), { recursive: true });
    const base = run(tmp);
    assert.equal(base.code, 0, base.out.slice(-2000));
    assert.match(base.out, /Parsed 263 topic row\(s\)/);
    const before = rowsOf(base.out); const after = rowsOf(fullRun().out);
    assert.equal(before.length, 263);
    for (const term of ['1st Term', '2nd Term']) {
      for (const subject of new Set(before.map(r => r.subject))) {
        const b = before.filter(r => r.term === term && r.subject === subject).map(r => `${r.n}|${r.file}|${r.week}|${r.title}`);
        const a = after.filter(r => r.term === term && r.subject === subject).map(r => `${r.n}|${r.file}|${r.week}|${r.title}`);
        assert.deepEqual(a.slice(0, b.length), b, `${subject} ${term}: existing rows changed`);
      }
    }
  } finally { rmSync(tmp, { recursive: true, force: true }); }
});

test('negative control: a missing reviewed Third-Term source fails the audit', real, () => {
  const tmp = mkdtempSync(path.join(os.tmpdir(), 'jss3-missing-'));
  try {
    for (const f of FOLDERS) cpSync(path.join(ROOT!, f), path.join(tmp, f), { recursive: true });
    rmSync(path.join(tmp, 'JSS3 3RD TERM ', 'PHE.docx'));
    const r = run(tmp);
    assert.notEqual(r.code, 0);
    assert.match(r.out, /Reviewed JSS 3 Third-Term source is missing from this run: PHE\.docx/);
    assert.match(r.out, /AUDIT BLOCKED/);
  } finally { rmSync(tmp, { recursive: true, force: true }); }
});

test('negative control: an extra, unreviewed Third-Term source fails the audit', real, () => {
  const tmp = mkdtempSync(path.join(os.tmpdir(), 'jss3-extra-'));
  try {
    for (const f of FOLDERS) cpSync(path.join(ROOT!, f), path.join(tmp, f), { recursive: true });
    cpSync(path.join(ROOT!, 'JSS3 3RD TERM ', 'PHE.docx'), path.join(tmp, 'JSS3 3RD TERM ', 'Social studies.docx'));
    const r = run(tmp);
    assert.notEqual(r.code, 0);
    assert.match(r.out, /AUDIT BLOCKED/);
  } finally { rmSync(tmp, { recursive: true, force: true }); }
});

const hasPyDocx = spawnSync('python3', ['-c', 'import docx'], { encoding: 'utf8' }).status === 0;
test('negative control: a tampered "duplicate" Civic body is rejected, not silently dropped', { skip: !ROOT ? 'set JSS3_ALL_ROOT' : !hasPyDocx ? 'python-docx unavailable' : false }, () => {
  const tmp = mkdtempSync(path.join(os.tmpdir(), 'jss3-tamper-'));
  try {
    for (const f of FOLDERS) cpSync(path.join(ROOT!, f), path.join(tmp, f), { recursive: true });
    const target = path.join(tmp, 'JSS3 3RD TERM ', 'CIVIC.docx');
    const py = [
      'import sys, docx',
      'd = docx.Document(sys.argv[1])',
      'for p in d.paragraphs:',
      '    if "Citizen vote to elect" in p.text:',
      '        p.runs[0].text = p.runs[0].text + " TAMPERED"; break',
      'else: raise SystemExit("anchor not found")',
      'd.save(sys.argv[1])',
    ].join('\n');
    execFileSync('python3', ['-c', py, target]);
    const r = run(tmp);
    assert.notEqual(r.code, 0);
    assert.match(r.out, /Claimed exact duplicate is not identical to its 1st Term row/);
  } finally { rmSync(tmp, { recursive: true, force: true }); }
});
