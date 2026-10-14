// Task 3 — JSS3 First-Term English phonetic-symbol corrections (occurrence-specific).
// Synthetic tests always run. Real-source tests run when JSS3_ENGLISH_SYMBOL_ROOT is set to a folder containing
// "JSS3 1ST TERM /js 3 english.doc" (+ the Second/Third-Term English files for the importer dry run). No database.
//   cd backend && JSS3_ENGLISH_SYMBOL_ROOT=/path/root npx tsx --test ../tests/jss3-english-symbols-task3.test.mts
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { createRequire } from 'node:module';
import {
  JSS3_ENGLISH_SCHEME_ONLY_OCCURRENCES,
  JSS3_ENGLISH_SYMBOL_OCCURRENCES,
  applyJss3EnglishSymbolCorrections,
  describeJss3EnglishSymbolCorrections,
} from '../backend/src/db/jss3EnglishSymbolCorrections.js';
import { applyJss3SourceTextResolution } from '../backend/src/db/jss3CurriculumResolutions.js';
import { splitJss3EnglishLessons } from '../backend/src/db/jss3EnglishLessonSplit.js';

const backendDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'backend');
const APPLIED = JSS3_ENGLISH_SYMBOL_OCCURRENCES.filter(o => o.status === 'APPLIED');
const NOT_APPLIED = JSS3_ENGLISH_SYMBOL_OCCURRENCES.filter(o => o.status !== 'APPLIED');
const count = (s: string, n: string) => s.split(n).length - 1;

/** Synthetic body: every occurrence context once, separated by filler that contains no target characters. */
const synthetic = () => 'WEEK ONE (1)\n' + JSS3_ENGLISH_SYMBOL_OCCURRENCES.map(o => `filler ${o.id}\n${o.before}\n`).join('\n');

test('table integrity: 12 applied, 7 not applied, unique ids, applied entries differ from their original', () => {
  assert.equal(APPLIED.length, 12);
  assert.equal(NOT_APPLIED.length, 7);
  assert.equal(new Set(JSS3_ENGLISH_SYMBOL_OCCURRENCES.map(o => o.id)).size, JSS3_ENGLISH_SYMBOL_OCCURRENCES.length);
  for (const o of APPLIED) { assert.ok(o.after && o.after !== o.before, o.id); assert.ok(o.evidence.length > 20, o.id); }
  for (const o of NOT_APPLIED) assert.equal(o.after, null, o.id);
  assert.deepEqual(NOT_APPLIED.map(o => o.status).sort(), ['HELD', 'HELD', 'HELD', 'OPEN', 'OPEN', 'OPEN', 'OPEN']);
});

test('each applied replacement lands at its exact occurrence and nowhere else (synthetic)', () => {
  const src = synthetic();
  const out = applyJss3EnglishSymbolCorrections(src);
  let expected = src;
  for (const o of APPLIED) {
    assert.equal(count(src, o.before), 1, `${o.id} anchor unique in source`);
    expected = expected.replace(o.before, () => o.after as string);
  }
  assert.equal(out, expected, 'output equals source with only the 12 table replacements applied');
  for (const o of APPLIED) { assert.equal(count(out, o.before), 0, o.id); assert.equal(count(out, o.after as string), 1, o.id); }
});

test('target characters: Cyrillic Ә, ∂ and U+F053 are gone from applied contexts; held glyphs are byte-identical', () => {
  const out = applyJss3EnglishSymbolCorrections(synthetic());
  assert.equal(count(out, 'Ә'), 0);
  assert.equal(count(out, '∂'), 0);
  assert.equal(count(out, ''), 0);
  assert.equal(count(out, 'ə'), 5);
  assert.equal(count(out, 'ᴐ'), 2); // P-W2L-2 context + H-W2L-openo context (ᴐ is held; both copies are synthetic echoes)
  assert.equal(count(out, 'ӡ'), 1);
  for (const o of NOT_APPLIED) assert.equal(count(out, o.before), 1, `${o.id} unchanged`);
  // a replacement only touches its own span: held "water" context keeps U+1D10 exactly
  assert.ok(out.includes('/wᴐ:t'));
  assert.ok(out.includes('/ӡ:/'));
});

test('idempotent: a second application changes nothing', () => {
  const once = applyJss3EnglishSymbolCorrections(synthetic());
  assert.equal(applyJss3EnglishSymbolCorrections(once), once);
  assert.equal(applyJss3EnglishSymbolCorrections(applyJss3EnglishSymbolCorrections(once)), once);
});

test('zero or multiple matches fail loudly (applied and not-applied anchors)', () => {
  const src = synthetic();
  for (const o of JSS3_ENGLISH_SYMBOL_OCCURRENCES) {
    const missing = src.replace(o.before, () => 'REMOVED');
    assert.throws(() => applyJss3EnglishSymbolCorrections(missing), new RegExp(o.id), `${o.id} missing`);
    const doubled = src + `\n${o.before}\n`;
    assert.throws(() => applyJss3EnglishSymbolCorrections(doubled), new RegExp(o.id), `${o.id} ambiguous`);
  }
});

test('no global replacement: a stray look-alike elsewhere is never rewritten', () => {
  const stray = synthetic() + '\nAn unrelated line with /Ә/ and /0/ and /S/ and /J/ stays exactly as typed.\n';
  const out = applyJss3EnglishSymbolCorrections(stray);
  assert.ok(out.endsWith('An unrelated line with /Ә/ and /0/ and /S/ and /J/ stays exactly as typed.\n'));
});

test('OPEN and HELD entries are flagged, carry no replacement, and every applied entry has code-point provenance', () => {
  const rows = describeJss3EnglishSymbolCorrections();
  for (const r of rows.filter(r => r.status !== 'APPLIED')) { assert.equal(r.before, r.after); assert.match(r.evidence, /^(HELD|OPEN):/); }
  const w2 = rows.find(r => r.id === 'P-W2L-3')!;
  assert.match(w2.beforeCodepoints, /U\+04D8/);
  assert.match(w2.afterCodepoints, /U\+0259/);
  const ezh = rows.find(r => r.id === 'P-L7-ezh')!;
  assert.match(ezh.beforeCodepoints, /U\+F053/);
  assert.match(ezh.afterCodepoints, /U\+0292/);
  const ids = JSS3_ENGLISH_SCHEME_ONLY_OCCURRENCES.map(o => o.id);
  assert.deepEqual(ids, ['P-S1-schwce', 'P-W4', 'P-W5', 'P-W6', 'P-W7', 'P-W8', 'P-W9']);
  assert.ok(JSS3_ENGLISH_SCHEME_ONLY_OCCURRENCES.every(o => o.status !== 'APPLIED'));
});

test('Second-Term and other files are not affected by the rule wiring', () => {
  const t = 'WEEK ONE (1)\nSPEECH WORK: VOWEL /Ә/\nCONTENT:- x\n';
  assert.equal(applyJss3SourceTextResolution('js 3 english.docx', '2nd Term', t), t);
  assert.equal(applyJss3SourceTextResolution('js 3 english.doc', '3rd Term', t), t);
});

// ── Real source ───────────────────────────────────────────────────────────
const ROOT = process.env.JSS3_ENGLISH_SYMBOL_ROOT;
const real = { skip: ROOT ? false : 'set JSS3_ENGLISH_SYMBOL_ROOT to run real-source English symbol checks' } as const;
const DOC = ROOT ? path.join(ROOT, 'JSS3 1ST TERM ', 'js 3 english.doc') : '';

async function rawDoc(): Promise<string> {
  assert.ok(existsSync(DOC), `missing ${DOC}`);
  const WordExtractor = createRequire(path.join(backendDir, 'package.json'))('word-extractor');
  return (await new WordExtractor().extract(DOC)).getBody() as string;
}
const BODY_START = /^[ \t]*WEEK[ \t]+ONE[ \t]*\(1\)[ \t]*\r?$/m;

test('real source: every table anchor occurs exactly once in the lesson body; scheme occurrences are outside it', real, async () => {
  const raw = await rawDoc();
  const start = BODY_START.exec(raw)!.index;
  const body = raw.slice(start);
  for (const o of JSS3_ENGLISH_SYMBOL_OCCURRENCES) assert.equal(count(body, o.before), 1, o.id);
  for (const s of ['Schwce', '/3/ and /d3/', '/d/,/0/,/z/', '/3:/ and /c/', '// and // (contrastion)', 'SPEECH WORK: the consonant', 'SPEECH WORKS']) {
    assert.equal(count(body, s), 0, `${s} must not be in the importer body`);
    assert.equal(count(raw.slice(0, start), s), 1, `${s} sits in the discarded scheme preamble`);
  }
});

test('real source: the rule output differs from the previous output only by the 12 table replacements', real, async () => {
  const raw = await rawDoc();
  const body = raw.slice(BODY_START.exec(raw)!.index);
  const previous = splitJss3EnglishLessons(body, '1st Term'); // behaviour before Task 3
  const current = applyJss3SourceTextResolution('js 3 english.doc', '1st Term', raw);
  let expected = previous;
  for (const o of APPLIED) {
    assert.equal(count(expected, o.before), 1, o.id);
    expected = expected.replace(o.before, () => o.after as string);
  }
  assert.equal(current, expected);
  assert.notEqual(current, previous);
  // idempotent on real text
  assert.equal(applyJss3EnglishSymbolCorrections(current), current);
  // held glyphs still present and byte-identical
  assert.equal(count(current, 'ᴐ'), 1);
  assert.equal(count(current, 'ӡ'), 1);
  assert.equal(count(current, 'Ә'), 0);
  assert.equal(count(current, ''), 0);
  for (const o of NOT_APPLIED) assert.equal(count(current, o.before), 1, o.id);
});

test('real source: importer dry run keeps the English row structure; only the Week 2 title symbol changes', real, () => {
  let out: string;
  try {
    out = execFileSync('npx', ['tsx', 'src/db/ingestTopics.ts', '--root', ROOT!, '--school-code', 'secondary'], {
      cwd: backendDir, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024,
    });
  } catch (e) {
    // An English-only staging root exits 1 (AUDIT BLOCKED by the absent non-English sources); the report is still on stdout.
    out = String((e as { stdout?: string }).stdout ?? '');
    assert.match(out, /AUDIT BLOCKED/);
  }
  assert.doesNotMatch(out, /JSS3 English symbol|expected exactly one match/, 'no correction anchor error');
  assert.doesNotMatch(out, /js 3 english\.doc[^\n]*(?:error|Error)/);
  assert.doesNotMatch(out, /Connecting|database connection (?:established|opened)/i);
  const rows = [...out.matchAll(/^  JSS 3 \/ English Language \/ 1st Term #(\d+): JSS3 1ST TERM \/js 3 english\.doc \/ ([^/\n]+?) \/ (.*)$/gm)];
  assert.equal(rows.length, 20, 'First-Term js 3 english.doc rows unchanged (20)');
  const t = Object.fromEntries(rows.map(m => [m[1], m[3]]));
  assert.equal(t['5'], 'Speech Work: SPEECH WORK: VOWEL /ə/');
  assert.equal(t['15'], 'SPEECH WORK:CONSONANT SOUNDS');
  assert.equal(rows.some(m => /[Ә∂]/.test(m[3])), false);
  assert.equal([...out.matchAll(/^  JSS 3 \/ English Language \/ 1st Term #\d+: /gm)].length, 24, 'English 1st Term total (20 + 4 redistributed Third-Term) unchanged');
  assert.equal([...out.matchAll(/^  JSS 3 \/ English Language \/ 2nd Term #\d+: /gm)].length, 31, 'English 2nd Term total unchanged');
  assert.equal(out.includes('/Ә/'), true, 'Second-Term English title /Ә/ (out of scope) is untouched');
});
