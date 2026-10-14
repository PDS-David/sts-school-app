// Agent 1F-R1 — JSS3 Second-Term English correction (focused regression tests).
// Synthetic tests always run. Real-source tests run when JSS3_SECOND_TERM_ROOT is set to a folder containing
// "JSS3 2ND TERM " (dry-run importer only; --yes is never passed, no database connection).
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import mammoth from 'mammoth';
import { splitJss3EnglishLessons } from '../backend/src/db/jss3EnglishLessonSplit.js';
import {
  JSS3_SECOND_TERM_ENGLISH_ACTIVITY_NOTES,
  JSS3_SECOND_TERM_NON_INSTRUCTIONAL,
  getJss3SecondTermEnglishActivityNote,
  isJss3SecondTermNonInstructional,
} from '../backend/src/db/jss3SecondTermResolutions.js';

const backendDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'backend');
const WEEK_LINE = /^[ \t]*WEEK[ \t]+(?:ONE[ \t]*\(1\)|TWO|THREE|FOUR|FIVE|SIX|SEVEN|EIGHT|NINE|\d+)[ \t]*:?[ \t]*\r?$/gim;
const STRAND = /^[ \t]*(?:GRAMMAR|SPEECH\s+WORK|COMPOSITION|COMPREHENSION)[ \t]*:?[ \t]*$/i;
const norm = (s: string) => s.replace(WEEK_LINE, '').replace(/\s+/g, ' ').trim();

function strandedLabels(out: string): string[] {
  const lines = out.split('\n');
  const hits: string[] = [];
  lines.forEach((l, i) => {
    WEEK_LINE.lastIndex = 0;
    if (!/^[ \t]*WEEK[ \t]/i.test(l) || !/^[ \t]*WEEK[ \t]+(?:ONE|TWO|THREE|FOUR|FIVE|SIX|SEVEN|EIGHT|NINE|\d+)/i.test(l)) return;
    let k = i - 1;
    while (k >= 0 && lines[k].trim() === '') k--;
    if (k >= 0 && STRAND.test(lines[k])) hits.push(`${i + 1}:${lines[k].trim()}`);
  });
  return hits;
}

const PRE = 'SCHEME OF WORK\nWEEK 1 Revision\nTOPIC : CONSONANT CONTRAST /t/ and /s/\n';
const W3 = 'WEEK THREE\nTOPIC: Z\nOriginal Z\n'; // the splitter requires its WEEK THREE anchor

test('1: bare strand label moves with the lesson it introduces (incl. Week 2)', () => {
  const src = `${PRE}Original A\nGRAMMAR\nTOPIC: CONJUNCTION\nOriginal B\nWEEK THREE\nTOPIC: COMPOSITION (ARTICLE WRITING)\nOriginal C\nSPEECH WORK:\n\nGRAMMAR: TOPIC PREFIXES AND SUFFIXES\nOriginal D\nCOMPOSITION :\nTOPIC: X\nOriginal E\n`;
  const out = splitJss3EnglishLessons(src, '2nd Term');
  assert.deepEqual(strandedLabels(out), []);
  assert.match(out, /Original A\s*\nWEEK TWO\nGRAMMAR\nTOPIC: CONJUNCTION/);
  assert.match(out, /Original C\s*\nWEEK THREE\nSPEECH WORK:/);
  assert.match(out, /Original D\s*\nWEEK THREE\nCOMPOSITION :\nTOPIC: X/);
});

test('2: COMPREHENSION:- and bare COMPREHENSION + CONTENT become separate activities, exact text kept', () => {
  const src = `${PRE}Original A\n${W3}WEEK 7\nTOPIC: VOWEL\nOriginal B\nCOMPREHENSION:- Reading a passage in New Oxford course for J S S 3\n\nWEEK 9\nTOPIC: ACTIVE AND PASSIVE VOICE\nOriginal C\nCOMPREHENSION\n\nCONTENT: Reading and answer questions in a passage in new oxford course for junior secondary school 3.\n\nWEEK 10\nREVISION\n`;
  const out = splitJss3EnglishLessons(src, '2nd Term');
  assert.match(out, /Original B\s*\nWEEK 7\nCOMPREHENSION:- Reading a passage in New Oxford course for J S S 3/);
  assert.match(out, /Original C\s*\nWeek 9\nCOMPREHENSION\n\nCONTENT: Reading and answer/i);
  assert.equal(out.match(/^WEEK 7$/gm)?.length, 2);
});

test('3: COMPREHENSION directly followed by TOPIC is one lesson (not split twice)', () => {
  const src = `${PRE}Original A\n${W3}WEEK 6\nTOPIC: VOWEL\nOriginal B\nCOMPREHENSION\n\nTOPIC: READING AND ANSWERING QUESTION IN NEW OXFORD\nOriginal C\n`;
  const out = splitJss3EnglishLessons(src, '2nd Term');
  assert.equal(out.match(/^WEEK 6$/gm)?.length, 2, 'exactly one split inside Week 6');
  assert.match(out, /Original B\s*\nWEEK 6\nCOMPREHENSION\n\nTOPIC: READING/);
});

test('4: "TOPIC: for article..." guidance is not a lesson start', () => {
  const src = `${PRE}Original A\nWEEK THREE\nTOPIC: COMPOSITION (ARTICLE WRITING)\nOriginal B\nTOPIC :  for article call for expository prose\nOriginal C\n`;
  const out = splitJss3EnglishLessons(src, '2nd Term');
  assert.equal(out.match(/^WEEK THREE$/gm)?.length, 1);
  assert.match(out, /Original B\s*\nTOPIC :  for article call/);
});

test('5: every original character is preserved in order (only WEEK header lines are inserted)', () => {
  const src = `${PRE}Original A\nGRAMMAR\nTOPIC: CONJUNCTION\nOriginal B\n${W3}WEEK 7\nTOPIC: V\nOriginal C\nCOMPREHENSION:- Reading x\nWEEK 9\nGRAMMAR\nTOPIC: Y\nOriginal D\nCOMPREHENSION\nCONTENT: z\n`;
  const out = splitJss3EnglishLessons(src, '2nd Term');
  const expected = `WEEK TWO\n${src.slice(src.indexOf('TOPIC : CONSONANT'))}`;
  assert.equal(norm(out), norm(expected));
});

test('6: First-Term splitting is unchanged by the Second-Term correction', () => {
  const src = 'WEEK ONE (1)\nGrammar: Parts of speech\nOriginal A\nCOMPREHENSION\nLiterature in English:\nOriginal B\n';
  const out = splitJss3EnglishLessons(src, '1st Term');
  assert.equal(out.match(/^WEEK ONE \(1\)$/gm)?.length, 3);
});

test('7: Week 11 is an examination (not revision); Week 10 stays revision', () => {
  const e = JSS3_SECOND_TERM_NON_INSTRUCTIONAL.filter(x => x.basename === 'js 3 english.docx');
  assert.deepEqual(e.map(x => [x.week, x.kind]), [['10', 'revision'], ['11', 'examination']]);
  assert.ok(isJss3SecondTermNonInstructional('js 3 english.docx', '2nd Term', 'WEEK 11'));
});

test('8: Weeks 6–9 textbook references are flagged textbook-dependent; Week 7 EXPOSITORY is explicitly incomplete', () => {
  const n = (w: string, t: string) => getJss3SecondTermEnglishActivityNote('js 3 english.docx', '2nd Term', w, t)?.completeness;
  assert.equal(n('WEEK 6', 'READING AND ANSWERING QUESTION IN NEW OXFORD ENGLISH FOR JUNIOR SECONDARY SCHOOLS  3'), 'textbook-dependent');
  assert.equal(n('WEEK 7', 'Reading a passage in New Oxford course for J S S 3'), 'textbook-dependent');
  assert.equal(n('WEEK 8', 'Reading and answering questions on acomprehension passage'), 'textbook-dependent');
  assert.equal(n('Week 9', 'Reading and answer questions in a passage in new oxford course for junior secondary school 3.'), 'textbook-dependent');
  assert.equal(n('WEEK 7', 'EXPOSITORY'), 'heading-only-incomplete');
  assert.equal(n('WEEK 6', 'EXPOSITORY ESSAY'), undefined);
  assert.equal(n('WEEK 7', 'SYNONYMS'), undefined);
  assert.equal(JSS3_SECOND_TERM_ENGLISH_ACTIVITY_NOTES.length, 5);
});

// ── Real source ───────────────────────────────────────────────────────────
const ROOT = process.env.JSS3_SECOND_TERM_ROOT;
const real = { skip: ROOT ? false : 'set JSS3_SECOND_TERM_ROOT to run real-source English checks' } as const;
const DOCX = ROOT ? path.join(ROOT, 'JSS3 2ND TERM ', 'js 3 english.docx') : '';

test('real source: splitter preserves all source text in order and leaves no stranded strand labels', real, async () => {
  assert.ok(existsSync(DOCX), `missing ${DOCX}`);
  const raw = (await mammoth.extractRawText({ path: DOCX })).value;
  const out = splitJss3EnglishLessons(raw, '2nd Term');
  const afterPreamble = `WEEK TWO\n${raw.slice(/^\s*TOPIC\s*:\s*CONSONANT CONTRAST\s*\/t\/\s*and\s*\/s\//im.exec(raw)!.index)}`;
  assert.equal(norm(out), norm(afterPreamble), 'source text (after the scheme preamble) must be preserved exactly in order');
  assert.deepEqual(strandedLabels(out), []);
});

function importerRows(): string[] {
  const o = execFileSync('npx', ['tsx', 'src/db/ingestTopics.ts', '--root', ROOT!, '--school-code', 'secondary'], {
    cwd: backendDir, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024,
  });
  assert.match(o, /Dry run only — no database connection or changes\./);
  return [...o.matchAll(/^  JSS 3 \/ English Language \/ 2nd Term #(\d+): JSS3 2ND TERM \/js 3 english\.docx \/ ([^/\n]+?) \/ (.*)$/gm)].map(m => `${m[1]}|${m[2]}|${m[3]}`);
}

test('real source: importer dry-run English rows = 26 body activities + Revision + Examination, in source order', real, () => {
  const rows = importerRows();
  assert.equal(rows.length, 28);
  const t = rows.map(r => r.split('|').slice(2).join('|'));
  assert.deepEqual(t.slice(15, 26), [
    'SYNONYMS', 'EXPOSITORY', 'VOWEL /\u1d10:/ AND /\u1d10/', 'Reading a passage in New Oxford course for J S S 3',
    'VOWELS /U/ AND /U:/', 'Reading and answering questions on acomprehension passage', 'DEMONSTRATIVE PRONOUNS', 'ARGUMENTATIVE ESSAY',
    'SPEECH WORK: VOWEL /\u018e/'.replace('\u018e', '\u04d8'), 'ACTIVE AND PASSIVE VOICE',
    'Reading and answer questions in a passage in new oxford course for junior secondary school 3.',
  ]);
  assert.equal(t[26], 'REVISION');
  assert.equal(t[27], 'EXAMINATION.');
  // COMPREHENSION followed by TOPIC (Week 6) stays a single row
  assert.equal(t.filter(x => /^READING AND ANSWERING QUESTION IN NEW OXFORD/.test(x)).length, 1);
  // every Week 6–9 comprehension/textbook row has an audit note; Week 7 EXPOSITORY is the one incomplete heading
  const noted = rows.filter(r => { const [, w, ...ti] = r.split('|'); return getJss3SecondTermEnglishActivityNote('js 3 english.docx', '2nd Term', w, ti.join('|')); });
  assert.equal(noted.length, 5);
});
