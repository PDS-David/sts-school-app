// Agent 1F-R2 — JSS3 Basic Technology corrections (focused tests).
//  1. 3rd-Term Week 1 ("revision" heading, substantive motion-component body) is instructional, imported once
//     into 2nd Term immediately before "machine motion", source term/week and full text preserved.
//  2. 2nd-Term Week 1 ("revision" heading, substantive wood-processing / MDF body) is instructional; row, text
//     and position unchanged (classification change only, no row-count change).
// Synthetic tests always run. Source-backed tests need:
//   JSS3_SECOND_TERM_ROOT        folder containing "JSS3 2ND TERM " (original DOCX)
//   JSS3_THIRD_TERM_BASIC_TECH   path to the original 3rd-Term "BASIC TECH.docx" (or a plain-text extraction of it)
// Dry/pure functions only: no importer main(), no database, never --yes.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import test from 'node:test';
import mammoth from 'mammoth';
import ts from 'typescript';
import { canonicalJss3Week, resolveJss3ParsedTopic } from '../backend/src/db/jss3CurriculumResolutions.js';
import {
  JSS3_SECOND_TERM_NON_INSTRUCTIONAL,
  applyJss3SecondTermSourceTextResolution,
  isJss3SecondTermNonInstructional,
  resolveJss3SecondTermParsedTopic,
} from '../backend/src/db/jss3SecondTermResolutions.js';
import {
  JSS3_THIRD_TERM_MANIFEST,
  applyJss3ThirdTermSourceTextResolution,
  redistributeJss3ThirdTermTopics,
} from '../backend/src/db/jss3ThirdTermRedistribution.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const T2 = '2nd Term', T3 = '3rd Term', BT2 = 'basic tech.docx', BT3 = 'BASIC TECH.docx', SUBJ = 'Basic Technology';
const collapse = (s: string) => s.normalize('NFKC').replace(/\s+/g, ' ').trim();
const sha = (s: string) => createHash('sha256').update(collapse(s).toLowerCase()).digest('hex');

// parseTopics is private to ingestTopics.ts (importing it would run the importer): evaluate the same
// source excerpt the 1E-1 audit used. This is the importer's own parser, unmodified.
function loadParseTopics(): (t: string) => Array<{ weekLabel: string; title: string; body: string }> {
  const src = readFileSync(path.join(here, '..', 'backend', 'src', 'db', 'ingestTopics.ts'), 'utf8');
  const excerpt = src.slice(src.indexOf('const WEEK_NUMBER_WORD'), src.indexOf('// ── Main'));
  const code = ts.transpileModule(`${excerpt}\nglobalThis.parseTopics=parseTopics;`, { compilerOptions: { target: ts.ScriptTarget.ES2022 } }).outputText;
  const ctx: any = {}; vm.runInNewContext(code, ctx);
  // copy out of the vm realm so deepEqual works
  return (t: string) => Array.from(ctx.parseTopics(t)) as Array<{ weekLabel: string; title: string; body: string }>;
}
const parseTopics = loadParseTopics();
const tp = (weekLabel: string, title: string, body = `${weekLabel}\n${title}\nbody`) => ({ weekLabel, title, body });

// ── Synthetic ─────────────────────────────────────────────────────────────
test('2nd-Term Basic Tech Week 1 is no longer non-instructional; Weeks 11 (revision) and 12 (examination) remain', () => {
  const bt = JSS3_SECOND_TERM_NON_INSTRUCTIONAL.filter(e => e.basename === BT2).map(e => `${e.week}:${e.kind}`);
  assert.deepEqual(bt, ['11:revision', '12:examination']);
  assert.equal(isJss3SecondTermNonInstructional(BT2, T2, 'Week 1'), false);
  assert.equal(isJss3SecondTermNonInstructional(BT2, T2, 'Week 11'), true);
  assert.equal(JSS3_SECOND_TERM_NON_INSTRUCTIONAL.length, 9);
  // other subjects' Week 1 revisions are untouched
  for (const f of ['Agric 2ndT.doc', 'FRENCH  js 3.docx', 'js 3 civic.docx', 'music.docx']) {
    assert.equal(isJss3SecondTermNonInstructional(f, T2, 'WEEK 1'), true, f);
  }
});

test('manifest: 3rd-Term Basic Tech Week 1 is instructional -> 2nd Term, placed before machine motion; Third Term gets none', () => {
  const e = JSS3_THIRD_TERM_MANIFEST.filter(x => x.basename === BT3 && x.kind === 'parsed');
  assert.deepEqual(e.map(x => `${x.week}:${x.classification}`), ['1:instructional', '2:instructional', '3:instructional', '4:instructional', '5&6:instructional']);
  assert.ok(e.every(x => x.destination === T2));
  assert.equal(e[0].placeBeforeWeek, '5&6');
  assert.equal(JSS3_THIRD_TERM_MANIFEST.filter(x => x.basename === BT3 && x.classification === 'revision' && x.kind === 'parsed').length, 0);
  // the scheme-only "7_12 revision & examination" item stays non-instructional
  assert.equal(JSS3_THIRD_TERM_MANIFEST.filter(x => x.basename === BT3 && x.kind === 'scheme-only').every(x => x.classification !== 'instructional'), true);
});

test('redistribute: Week 1 kept once, retitled from its own heading, body byte-identical, ordered before machine motion', () => {
  const wk1 = 'Week 1         revision\n\nUPPLIERS MOTION AND CONTROLS\n\nLinear and Rotary Motion Components\n\nBall Screws\n\ntext cut off mid-sen\n\nQUESTIONS\n\n1.Give examples';
  const topics = [tp('Week 1', 'revision', wk1), tp('Week 2', 'Fault detection'), tp('Week 3', 'basic Electronics'), tp('Week 4', 'Components of electronics'), tp('Week 5  and  6', 'machine motion')];
  const r = redistributeJss3ThirdTermTopics(BT3, T3, SUBJ, topics);
  assert.deepEqual(r.kept.map(k => k.title), ['Fault detection', 'basic Electronics', 'Components of electronics', 'Linear and Rotary Motion Components', 'machine motion']);
  assert.ok(r.kept.every(k => k.destinationTerm === T2));
  const k = r.kept[3];
  assert.equal(k.body, wk1);
  assert.equal(k.weekLabel, 'Week 1');
  assert.equal(r.kept.filter(x => x.body === wk1).length, 1);
  assert.equal(r.records.filter(x => x.kind === 'parsed' && x.classification === 'instructional').length, 5);
  assert.equal(r.records.find(x => x.week === '1')!.originalTerm, T3);
});

test('redistribute: a Week 1 body without its own heading blocks (no silent fallback title)', () => {
  const topics = [tp('Week 1', 'revision', 'Week 1 revision\nno heading'), tp('Week 2', 'Fault detection'), tp('Week 3', 'basic Electronics'), tp('Week 4', 'Components of electronics'), tp('Week 5  and  6', 'machine motion')];
  assert.throws(() => redistributeJss3ThirdTermTopics(BT3, T3, SUBJ, topics), /week 1 heading/i);
});

// ── Source-backed ─────────────────────────────────────────────────────────
const ROOT2 = process.env.JSS3_SECOND_TERM_ROOT;
const SRC3 = process.env.JSS3_THIRD_TERM_BASIC_TECH;
const real2 = { skip: ROOT2 ? false : 'set JSS3_SECOND_TERM_ROOT' } as const;
const real3 = { skip: SRC3 ? false : 'set JSS3_THIRD_TERM_BASIC_TECH' } as const;
const readSource = async (f: string) => f.endsWith('.txt') ? readFileSync(f, 'utf8') : (await mammoth.extractRawText({ path: f })).value;

test('real 2nd-Term source: Week 1 wood-processing/MDF body retained once, in its existing first position', real2, async () => {
  const f = path.join(ROOT2!, 'JSS3 2ND TERM ', BT2);
  assert.ok(existsSync(f));
  const raw = await readSource(f);
  const text = applyJss3SecondTermSourceTextResolution(BT2, T2, raw);
  const rows = parseTopics(text)
    .map(t => resolveJss3SecondTermParsedTopic(BT2, T2, resolveJss3ParsedTopic(BT2, T2, t))).filter(Boolean) as ReturnType<typeof parseTopics>;
  assert.equal(rows.length, 10, 'row count unchanged by the classification fix');
  assert.deepEqual(rows.map(r => canonicalJss3Week(r.weekLabel)), ['1', '2', '3', '4&5', '6&7', '8', '9', '10', '11', '12']);
  const w1 = rows[0];
  assert.equal(w1.title, 'revision');
  for (const phrase of ['Wood processing', 'Medium Density Fibreboard Production', 'The Rubberwood Success Story in Malaysia', 'Oil Palm Fibre as an Alternative Raw Material', 'Outlook', 'Summary']) {
    assert.ok(w1.body.includes(phrase), phrase);
  }
  assert.ok(w1.body.length > 15000);
  assert.equal(rows.filter(r => sha(r.body) === sha(w1.body)).length, 1, 'not duplicated');
  // body is a verbatim slice of the original source
  assert.ok(collapse(raw).includes(collapse(w1.body)));
  assert.equal(isJss3SecondTermNonInstructional(BT2, T2, w1.weekLabel), false);
  assert.equal(rows.filter(r => isJss3SecondTermNonInstructional(BT2, T2, r.weekLabel)).length, 2);
});

test('real 3rd-Term source: Week 1 motion-component body + questions kept once in 2nd Term before machine motion; Third Term gets no rows', real3, async () => {
  const raw = await readSource(SRC3!);
  const text = applyJss3ThirdTermSourceTextResolution(BT3, T3, raw);
  const parsed = parseTopics(text);
  const r = redistributeJss3ThirdTermTopics(BT3, T3, SUBJ, parsed);
  assert.equal(parsed.length, 5);
  assert.deepEqual(r.kept.map(k => canonicalJss3Week(k.weekLabel)), ['2', '3', '4', '1', '5&6']);
  assert.equal(r.kept.length, 5);
  assert.ok(r.kept.every(k => k.destinationTerm === T2), 'no Third-Term instructional rows');
  const wk1 = r.kept[3];
  assert.equal(wk1.title, 'Linear and Rotary Motion Components');
  assert.equal(wk1.body, parsed[0].body, 'body untouched');
  for (const p of ['Air Cylinders', 'Ball Screws', 'Ball Splines', 'Crossed Roller Slides', 'Dovetail Slides', 'Electric Rotary Actuators', 'Feed Escapements',
    'Hydraulic Cylinders', 'Hydraulic Rotary Actuators', 'Index Drives', 'Piezoelectric Actuators', 'Pneumatic Rotary Actuators', 'Rack and Pinion Drives', 'Roller Screws', 'UPPLIERS MOTION']) {
    assert.ok(wk1.body.includes(p), p);
  }
  assert.match(wk1.body, /QUESTIONS\s+1\.Give examples of machines that makes use of linear motion\s+2\.mention 2 machines convert linear to rotary motion in their operations/);
  // verbatim in source (truncated sentences preserved, nothing reconstructed)
  assert.ok(collapse(raw).includes(collapse(wk1.body)));
  assert.equal(r.kept.filter(k => sha(k.body) === sha(wk1.body)).length, 1);
  // overlap with "machine motion" (Ball Screws) does not remove either body
  assert.match(r.kept[4].body, /ball screws/i);
  assert.notEqual(sha(r.kept[4].body), sha(wk1.body));
  // every body of the file is retained: concatenated bodies == text after the scheme cut
  assert.equal(collapse(parsed.map(p => p.body).join('\n')), collapse(text));
  // classification map: no Third-Term-destined instructional record, none left as revision for Week 1
  assert.equal(r.records.filter(x => x.kind === 'parsed' && x.classification === 'revision').length, 0);
  assert.equal(r.records.filter(x => x.destination === '').filter(x => x.classification === 'instructional').length, 0);
});
