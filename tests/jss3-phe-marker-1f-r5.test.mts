// Agent 1F-R5 — Third-Term PHE: the "WEEKS SEVEN AND EIGHT / REVISON AND EXAMINATION" source marker.
//
// Defect (after patches 01-07): PHE.docx's last block "WEEK SIX / DRUG EDUCATION" swallowed the
// separate source heading "WEEKS SEVEN AND EIGHT" + "REVISON AND EXAMINATION", because the generic
// parser only reads WEEK<number> markers and "WEEKS ..." (plural) is not one. Patch 08 inserts one
// structural "WEEK 7&8" line in front of that heading (heading lines and spelling untouched) and
// accounts for the resulting block in the Third-Term disposition manifest as a non-instructional
// examination marker.
//
// Synthetic tests always run. Source-backed tests need the ORIGINAL Third-Term PHE.docx via ONE of:
//   JSS3_THIRD_TERM_ROOT  folder containing "JSS3 3RD TERM "   (preferred)
//   JSS3_ALL_ROOT         folder containing "JSS3 3RD TERM " (and, optionally, the 1st/2nd-Term folders)
// Run from the repo root:  node --import tsx --test tests/jss3-phe-marker-1f-r5.test.mts
// The importer is only ever run as a dry run (no database, never --yes).
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import test from 'node:test';
import mammoth from 'mammoth';
import ts from 'typescript';
import { applyJss3SourceTextResolution, canonicalJss3Week, resolveJss3ParsedTopic } from '../backend/src/db/jss3CurriculumResolutions.js';
import { applyJss3SecondTermSourceTextResolution, resolveJss3SecondTermParsedTopic } from '../backend/src/db/jss3SecondTermResolutions.js';
import {
  JSS3_THIRD_TERM_MANIFEST, applyJss3ThirdTermSourceTextResolution as applyRule, hasJss3ThirdTermSourceResolution as hasRule,
  redistributeJss3ThirdTermTopics as redistribute,
} from '../backend/src/db/jss3ThirdTermRedistribution.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const backendDir = path.join(here, '..', 'backend');
const sha = (s: string) => createHash('sha256').update(s).digest('hex');
const T3 = '3rd Term', PHE = 'PHE.docx', SUBJ = 'Physical & Health Education';
const MARKER_TITLE = 'REVISON AND EXAMINATION';       // source spelling (sic)
const MARKER_WEEK_HEADING = 'WEEKS SEVEN AND EIGHT';  // the week heading, NOT the parsed title
const collapse = (s: string) => s.replace(/\s+/g, ' ').trim();

function loadParseTopics(): (t: string) => Array<{ weekLabel: string; title: string; body: string }> {
  const src = readFileSync(path.join(backendDir, 'src', 'db', 'ingestTopics.ts'), 'utf8');
  const excerpt = src.slice(src.indexOf('const WEEK_NUMBER_WORD'), src.indexOf('// ── Main'));
  const code = ts.transpileModule(`${excerpt}\nglobalThis.parseTopics=parseTopics;`, { compilerOptions: { target: ts.ScriptTarget.ES2022 } }).outputText;
  const ctx: any = {}; vm.runInNewContext(code, ctx);
  return (t: string) => Array.from(ctx.parseTopics(t)) as Array<{ weekLabel: string; title: string; body: string }>;
}
const parseTopics = loadParseTopics();
const tp = (weekLabel: string, title: string, body = `${weekLabel}\n${title}\ntext`) => ({ weekLabel, title, body });

// ── Facts pinned from the ORIGINAL attached Third-Term PHE.docx (extracted with mammoth.extractRawText, as the importer does) ──
const PHE_DOCX_SHA256 = 'c3a954a2bd96572d18d5eb450e2d54c01c130a34907323da46c9a0ab740984b3';
// importer parse after patches 01-07 (no PHE rule): 6 blocks. Body SHA-256 of each block, before patch 08.
const BEFORE = {
  'WEEK ONE': 'c96e5e633d38069ff64a18b7f2f59b19297db7fd2278785bc337c391aeaecdd5',
  'WEEK TWO': 'e45ca157733b4f6e0d6ba3049a0b8d1e658a485df28551ec0714e449efeeee09',
  'WEEK THREE': '25b806030a988571249e583f9e48515f622c8f2c2f34995d05fce8cee59a7dbf',
  'WEEK FOUR': '5e5c36a4ea5139114e1ced535888eeb2cc28344d3d811dff5d0b6bbb4c684659',
  'WEEK FIVE': '2f78d4582b66f7d1f4bc245c7510f30100a22c19f7c0d0b75aacaf32ed4cf8d2',
  'WEEK SIX': '3914054ad1fcc63aa21788d86ed6119fe2fcf68f3d013769d27c242874e26951', // 2261 chars, includes the marker
} as const;
// after patch 08
const AFTER_DRUG_SHA = '5718ae6c22d5e61b8ff19061c53f444008115284f60db84bd07fc4959c33a036'; // 2196 chars, marker removed
const AFTER_MARKER_SHA = '97c06472f3255c88a75fb5604b7c8a257d316009486d80d4ddb7d310097e8d38'; // 57 chars
const EXPECTED_MARKER_BODY = `WEEK 7&8\n${MARKER_WEEK_HEADING}\n\n\n\n${MARKER_TITLE}`;

// ── Manifest (synthetic; always runs) ───────────────────────────────────────────────────────────
test('manifest: the PHE marker is accounted for exactly once, as a non-instructional parsed examination marker with the actual parsed title', () => {
  const marker = JSS3_THIRD_TERM_MANIFEST.filter(e => e.basename === PHE && /EXAMINATION/i.test(e.title));
  assert.equal(marker.length, 1);
  const m = marker[0];
  assert.equal(m.title, MARKER_TITLE, 'source spelling "REVISON" preserved; title is the parsed title, not the week heading');
  assert.notEqual(m.title, MARKER_WEEK_HEADING);
  assert.equal(m.week, '7&8');
  assert.equal(m.kind, 'parsed');
  assert.equal(m.classification, 'examination');
  assert.equal(m.destination, undefined, 'non-instructional: no destination term');
  assert.equal(m.subject, SUBJ);
  assert.ok(!JSS3_THIRD_TERM_MANIFEST.some(e => e.title === MARKER_WEEK_HEADING), 'the week heading must not be a manifest title');
});

test('manifest: PHE entries are the original six plus the marker; no new instructional row; Taekwondo / Akanlo Ede stay held', () => {
  const phe = JSS3_THIRD_TERM_MANIFEST.filter(e => e.basename === PHE);
  assert.deepEqual(phe.map(e => `${e.week}|${e.title}|${e.classification}|${e.destination ?? ''}`), [
    '1|Family Health|instructional|1st Term', '2|TAEKWONDO|instructional|2nd Term', '3|Practical on Taekwondo|held|',
    '4|Sexually Transmitted Diseases (STDs)|instructional|1st Term', '5|BOXING|instructional|2nd Term',
    '6|DRUG EDUCATION|instructional|1st Term', `7&8|${MARKER_TITLE}|examination|`,
  ]);
  const by = (f: (e: (typeof JSS3_THIRD_TERM_MANIFEST)[number]) => boolean) => JSS3_THIRD_TERM_MANIFEST.filter(f).length;
  // manifest blocks (not executable rows): 73 -> 74; 24 not imported (9 revision, 7 examination, 6 exact duplicate, 2 held)
  assert.equal(JSS3_THIRD_TERM_MANIFEST.length, 74);
  assert.equal(by(e => e.classification === 'instructional'), 50, 'executable instructional rows unchanged');
  assert.equal(by(e => e.classification === 'instructional' && e.destination === '1st Term'), 20);
  assert.equal(by(e => e.classification === 'instructional' && e.destination === '2nd Term'), 30);
  assert.equal(by(e => e.classification === 'revision'), 9);
  assert.equal(by(e => e.classification === 'examination'), 7);
  assert.equal(by(e => e.classification === 'exact-duplicate'), 6);
  assert.equal(by(e => e.classification === 'held'), 2);
  assert.deepEqual(JSS3_THIRD_TERM_MANIFEST.filter(e => e.classification === 'held').map(e => `${e.basename}|${e.title}`).sort(),
    ['OMEGA TERM YORUBA JS3.docx|AKANLO EDE', 'PHE.docx|Practical on Taekwondo']);
});

// ── Text rule (synthetic; always runs) ──────────────────────────────────────────────────────────
const SYN_TAIL = ['WEEK SIX', '', 'TOPIC: DRUG EDUCATION', '', 'DRUG ABUSE', '', 'Drug Abuse.:This is improper use of drug.', '',
  '5.\tline five of the assignment', '', '', '   ', '', '', MARKER_WEEK_HEADING, '', '', '', MARKER_TITLE].join('\n');
const synHead = ['SCHEME OF WORK', '', 'WEEKS\tTOPICS', '7& 8.  Revision and Examination ', '', 'WEEK FIVE', '', 'TOPIC: BOXING', 'boxing body', '', ''].join('\n');

test('rule: PHE.docx carries a 3rd-Term-only text rule; only the structural marker line is added, the source lines are untouched', () => {
  assert.equal(hasRule(PHE, T3), true);
  assert.equal(hasRule(PHE, '1st Term'), false);
  assert.equal(hasRule(PHE, '2nd Term'), false);
  const src = `${synHead}${SYN_TAIL}`;
  const out = applyRule(PHE, T3, src);
  assert.equal(out.replace('WEEK 7&8\n', ''), src, 'removing the one inserted line restores the source byte-for-byte');
  assert.equal(out.split('\n').length, src.split('\n').length + 1);
  assert.ok(out.endsWith(`WEEK 7&8\n${MARKER_WEEK_HEADING}\n\n\n\n${MARKER_TITLE}`));
  assert.equal(applyRule(PHE, '1st Term', src), src);
  assert.equal(applyRule(PHE, '2nd Term', src), src);
});

test('rule: parsing the synthetic tail separates the marker and keeps every Drug Education line', () => {
  const rows = parseTopics(applyRule(PHE, T3, SYN_TAIL));
  assert.deepEqual(rows.map(r => `${r.weekLabel}|${canonicalJss3Week(r.weekLabel)}|${r.title}`), ['WEEK SIX|6|DRUG EDUCATION', `WEEK 7&8|7&8|${MARKER_TITLE}`]);
  assert.ok(!rows[0].body.includes(MARKER_TITLE) && !rows[0].body.includes(MARKER_WEEK_HEADING));
  for (const l of ['TOPIC: DRUG EDUCATION', 'DRUG ABUSE', 'Drug Abuse.:This is improper use of drug.', '5.\tline five of the assignment']) assert.ok(rows[0].body.includes(l), l);
  assert.equal(rows[1].body, EXPECTED_MARKER_BODY);
  // without the rule the marker is swallowed (the original defect)
  const bad = parseTopics(SYN_TAIL);
  assert.equal(bad.length, 1);
  assert.ok(bad[0].body.includes(MARKER_TITLE));
});

test('rule: fails closed when the anchor is missing or ambiguous', () => {
  assert.throws(() => applyRule(PHE, T3, 'WEEK SIX\nDRUG EDUCATION\n'), /anchor missing/);
  assert.throws(() => applyRule(PHE, T3, `WEEK SIX\nx\n${MARKER_WEEK_HEADING}\n\n${MARKER_TITLE}\n\ny\n${MARKER_WEEK_HEADING}\n\n${MARKER_TITLE}\n`), /anchor ambiguous/);
  // a heading with a different second line is not the reviewed marker
  assert.throws(() => applyRule(PHE, T3, `${MARKER_WEEK_HEADING}\n\nREVISION AND EXAMINATION\n`), /anchor missing/);
});

// ── Gate (synthetic; always runs) ───────────────────────────────────────────────────────────────
const PHE_TOPICS = [
  tp('WEEK ONE', 'Family Health'), tp('WEEK TWO', 'TAEKWONDO'), tp('WEEK THREE', 'Practical on Taekwondo'),
  tp('WEEK FOUR', 'Sexually Transmitted Diseases (STDs)'), tp('WEEK FIVE', 'BOXING'), tp('WEEK SIX', 'DRUG EDUCATION'),
];
test('gate: the disposition check accepts the actual parsed marker (week 7&8, title REVISON AND EXAMINATION) and imports nothing for it', () => {
  const r = redistribute(PHE, T3, SUBJ, [...PHE_TOPICS, tp('WEEK 7&8', MARKER_TITLE)]);
  assert.deepEqual(r.kept.map(k => `${k.title}→${k.destinationTerm}`),
    ['Family Health→1st Term', 'TAEKWONDO→2nd Term', 'Sexually Transmitted Diseases (STDs)→1st Term', 'BOXING→2nd Term', 'DRUG EDUCATION→1st Term']);
  const rec = r.records.filter(x => x.title === MARKER_TITLE);
  assert.equal(rec.length, 1);
  assert.equal(rec[0].classification, 'examination');
  assert.equal(rec[0].destination, '');
  assert.equal(rec[0].week, '7&8');
  assert.equal(r.claims.length, 0);
});

test('gate: negative controls — the week heading as the title, a missing marker block, or a swallowed marker all fail', () => {
  // the failed, undelivered attempt used the week heading as the manifest title; the parsed title is the body heading
  assert.throws(() => redistribute(PHE, T3, SUBJ, [...PHE_TOPICS, tp('WEEK 7&8', MARKER_WEEK_HEADING)]), /manifest mismatch/);
  assert.throws(() => redistribute(PHE, T3, SUBJ, PHE_TOPICS), /manifest mismatch/);                                  // marker swallowed: 6 blocks
  assert.throws(() => redistribute(PHE, T3, SUBJ, [...PHE_TOPICS, tp('WEEK 7&8', MARKER_TITLE), tp('WEEK 9', 'EXTRA')]), /manifest mismatch/);
  assert.throws(() => redistribute(PHE, T3, SUBJ, [...PHE_TOPICS, tp('WEEK SEVEN', MARKER_TITLE)]), /manifest mismatch/); // wrong canonical week
});

// ── Source-backed (original PHE.docx) ───────────────────────────────────────────────────────────
const ROOT = process.env.JSS3_THIRD_TERM_ROOT ?? process.env.JSS3_ALL_ROOT;
const PHE_FILE = ROOT ? path.join(ROOT, 'JSS3 3RD TERM ', PHE) : '';
const real = { skip: ROOT && existsSync(PHE_FILE) ? false : 'set JSS3_THIRD_TERM_ROOT (or JSS3_ALL_ROOT) to the folder containing "JSS3 3RD TERM "' } as const;

let cache: { raw: string; noRule: ReturnType<typeof parseTopics>; rows: ReturnType<typeof parseTopics> } | undefined;
async function sourceParse() {
  if (cache) return cache;
  const raw: string = (await mammoth.extractRawText({ path: PHE_FILE })).value;   // the importer's extractText() for .docx
  let text = applyJss3SourceTextResolution(PHE, T3, raw);
  text = applyJss3SecondTermSourceTextResolution(PHE, T3, text);
  const noRule = parseTopics(text).map(t => resolveJss3SecondTermParsedTopic(PHE, T3, resolveJss3ParsedTopic(PHE, T3, t))).filter(Boolean) as ReturnType<typeof parseTopics>;
  const ruled = applyRule(PHE, T3, text);
  const rows = parseTopics(ruled).map(t => resolveJss3SecondTermParsedTopic(PHE, T3, resolveJss3ParsedTopic(PHE, T3, t))).filter(Boolean) as ReturnType<typeof parseTopics>;
  return (cache = { raw, noRule, rows });
}

test('source: the attached original PHE.docx has the pinned SHA-256 and the marker as two lines at the very end of the Week Six text', real, async () => {
  assert.equal(createHash('sha256').update(readFileSync(PHE_FILE)).digest('hex'), PHE_DOCX_SHA256);
  const { raw } = await sourceParse();
  assert.equal(raw.match(/^[ \t]*WEEKS SEVEN AND EIGHT[ \t]*$/gm)?.length, 1);
  assert.equal(raw.match(/^[ \t]*REVISON AND EXAMINATION[ \t]*$/gm)?.length, 1);
  assert.ok(raw.trimEnd().endsWith(`${MARKER_WEEK_HEADING}\n\n\n\n${MARKER_TITLE}`));
  assert.match(raw, /^7& 8\.  Revision and Examination[ \t]*$/m, 'scheme-of-work row names the same weeks');
});

test('source: without the rule the marker is inside the Drug Education body (patches 01-07 behaviour, the defect)', real, async () => {
  const { noRule } = await sourceParse();
  assert.equal(noRule.length, 6);
  const drug = noRule[5];
  assert.equal(drug.title, 'DRUG EDUCATION');
  assert.ok(drug.body.includes(MARKER_WEEK_HEADING) && drug.body.includes(MARKER_TITLE));
  assert.equal(sha(drug.body), BEFORE['WEEK SIX']);
  for (const r of noRule) assert.equal(sha(r.body), BEFORE[r.weekLabel as keyof typeof BEFORE], r.weekLabel);
});

test('source: with patch 08 the marker is its own block, exactly once, and nothing else is a new block', real, async () => {
  const { rows } = await sourceParse();
  assert.deepEqual(rows.map(r => `${r.weekLabel}|${canonicalJss3Week(r.weekLabel)}|${r.title}`), [
    'WEEK ONE|1|Family Health', 'WEEK TWO|2|TAEKWONDO', 'WEEK THREE|3|Practical on Taekwondo', 'WEEK FOUR|4|Sexually Transmitted Diseases (STDs)',
    'WEEK FIVE|5|BOXING', 'WEEK SIX|6|DRUG EDUCATION', `WEEK 7&8|7&8|${MARKER_TITLE}`,
  ]);
  const holders = rows.filter(r => r.body.includes(MARKER_TITLE) || r.body.includes(MARKER_WEEK_HEADING));
  assert.equal(holders.length, 1, 'the marker text occurs in exactly one block');
  assert.equal(holders[0].title, MARKER_TITLE);
  assert.equal(holders[0].body, EXPECTED_MARKER_BODY);
  assert.equal(sha(holders[0].body), AFTER_MARKER_SHA);
});

test('source: Drug Education keeps every substantive line, in order; the only text that left it is the marker', real, async () => {
  const { noRule, rows } = await sourceParse();
  const before = noRule[5].body, after = rows[5].body, marker = rows[6].body;
  assert.equal(sha(after), AFTER_DRUG_SHA);
  const beforeLines = before.split('\n').map(l => l.trim()).filter(Boolean);
  const afterLines = after.split('\n').map(l => l.trim()).filter(Boolean);
  assert.deepEqual(beforeLines.slice(0, -2), afterLines, 'all but the last two non-blank lines of the old body are the new body');
  assert.deepEqual(beforeLines.slice(-2), [MARKER_WEEK_HEADING, MARKER_TITLE]);
  assert.ok(afterLines.length >= 40, `substantive line count (${afterLines.length})`);
  assert.equal(collapse(`${after} ${marker.replace(/^WEEK 7&8\s+/, '')}`), collapse(before), 'body + marker == old body (whitespace-insensitive)');
  // the lesson's own substantive text, spot-pinned from the source excerpt
  for (const needle of ['TOPIC: DRUG EDUCATION', 'SUB-TOPIC: USE, MIS USE AND ABUSE, DEFINATION, TYPES, SELF MEDICATION E.TC', 'DRUG ABUSE', 'TYPES OF DRUGS', 'Stimulants',
    'Prescription drugs', 'SELF MEDICATION', 'DRUG ADDICTION', 'WITHDRAWAL', 'TOLERANCE', 'RESONS WHY PEOPLE ABUSE DRUGS', 'Evaluation', 'ASSIGNMENT',
    'Highlight two dangers of self medication']) {
    assert.ok(afterLines.some(l => l.includes(needle)), needle);
  }
  assert.ok(after.startsWith('WEEK SIX'), 'week label / provenance line unchanged');
});

test('source: unrelated PHE lesson bodies are byte-identical to the pre-patch parse; destinations unchanged; nothing new is instructional', real, async () => {
  const { noRule, rows } = await sourceParse();
  for (let i = 0; i < 5; i++) {
    assert.equal(rows[i].body, noRule[i].body, rows[i].weekLabel);
    assert.equal(sha(rows[i].body), BEFORE[rows[i].weekLabel as keyof typeof BEFORE]);
    assert.equal(rows[i].title, noRule[i].title);
  }
  const red = redistribute(PHE, T3, SUBJ, rows);
  assert.deepEqual(red.kept.map(k => `${k.weekLabel}|${k.title}→${k.destinationTerm}`), [
    'WEEK ONE|Family Health→1st Term', 'WEEK TWO|TAEKWONDO→2nd Term', 'WEEK FOUR|Sexually Transmitted Diseases (STDs)→1st Term',
    'WEEK FIVE|BOXING→2nd Term', 'WEEK SIX|DRUG EDUCATION→1st Term',
  ]);
  assert.equal(red.kept.length, 5, 'no new instructional rows');
  assert.ok(red.kept.every(k => (k.destinationTerm as string) !== '3rd Term'));
  assert.equal(red.kept[4].body, rows[5].body, 'Drug Education provenance: same block, same week label');
  const taekwondo = red.records.filter(r => /Practical on Taekwondo/i.test(r.title));
  assert.equal(taekwondo.length, 1); assert.equal(taekwondo[0].classification, 'held');
  const marker = red.records.filter(r => r.title === MARKER_TITLE);
  assert.equal(marker.length, 1);
  assert.equal(marker[0].classification, 'examination');
  assert.equal(marker[0].bodyForHash, EXPECTED_MARKER_BODY);
  assert.equal(red.records.length, 7);
});

// ── Importer dry run on the 11 Third-Term sources (First/Second-Term inputs are NOT needed for this check) ──
function dryRun(root: string): { code: number; out: string } {
  const r = spawnSync('npx', ['tsx', 'src/db/ingestTopics.ts', '--root', root, '--school-code', 'secondary'], { cwd: backendDir, encoding: 'utf8', maxBuffer: 128 * 1024 * 1024 });
  return { code: r.status ?? -1, out: `${r.stdout}${r.stderr}` };
}
function csvRows(o: string): string[][] {
  const start = o.indexOf('JSS3 THIRD-TERM SOURCE -> DESTINATION MAP (csv)'); const end = o.indexOf('END JSS3 THIRD-TERM MAP');
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

test('importer dry run (all 11 Third-Term sources): the marker is accepted by the gate, mapped once, imported nowhere; only the Civic duplicate proofs lack First-Term inputs', real, () => {
  const tmp = mkdtempSync(path.join(os.tmpdir(), 'jss3-phe-r5-'));
  try {
    cpSync(path.join(ROOT!, 'JSS3 3RD TERM '), path.join(tmp, 'JSS3 3RD TERM '), { recursive: true });
    const { out } = dryRun(tmp);
    assert.match(out, /Found 11 candidate file\(s\)/);
    assert.match(out, /Parsed 50 topic row\(s\) from 10 file\(s\)\./);
    assert.doesNotMatch(out, /manifest mismatch|subject mismatch|failed to read|\d+ (?:file|section)\(s\) BLOCKED|has not been reviewed|is missing from this run|suspicious|DUPLICATE normalized/i);
    // "AUDIT BLOCKED" is expected here: it is caused solely by the six Civic duplicate proofs asserted below, which need First-Term rows
    // gate: with no First-Term inputs the ONLY failures are the six Civic exact-duplicate proofs; PHE contributes none
    const gate = /JSS3 Third-Term reconciliation gate FAILED: (\d+)\n((?:  .*\n)+)/.exec(out);
    assert.ok(gate, 'expected the (First-Term-dependent) Civic duplicate proofs to be reported');
    assert.equal(gate![1], '6');
    for (const l of gate![2].trim().split('\n')) assert.match(l, /Claimed exact duplicate is not identical to its 1st Term row: JSS3 3RD TERM \/CIVIC\.docx/);
    assert.doesNotMatch(gate![2], /PHE/);
    // map: marker mapped exactly once, as a non-instructional examination marker with no destination
    const csv = csvRows(out);
    assert.equal(csv.length, JSS3_THIRD_TERM_MANIFEST.length);
    assert.equal(csv.length, 74);
    const pheMap = csv.filter(c => c[1] === PHE);
    assert.deepEqual(pheMap.map(c => `${c[3]}|${c[4]}|${c[5]}|${c[6]}|${c[7]}`), [
      '1|Family Health|parsed|instructional|1st Term', '2|TAEKWONDO|parsed|instructional|2nd Term', '3|Practical on Taekwondo|parsed|held|',
      '4|Sexually Transmitted Diseases (STDs)|parsed|instructional|1st Term', '5|BOXING|parsed|instructional|2nd Term',
      '6|DRUG EDUCATION|parsed|instructional|1st Term', `7&8|${MARKER_TITLE}|parsed|examination|`,
    ]);
    assert.ok(pheMap.every(c => /^[0-9a-f]{64}$/.test(c[9])), 'every parsed PHE row has a content hash');
    assert.equal(csv.filter(c => c[4] === MARKER_TITLE).length, 1);
    // imported rows: five PHE rows, same order and week labels as before; the marker and Taekwondo are not among them
    const pheRows = [...out.matchAll(/^ {2}JSS 3 \/ Physical & Health Education \/ (1st|2nd) Term #(\d+): JSS3 3RD TERM \/PHE\.docx \/ (.+?) \/ (.*)$/gm)].map(m => `${m[1]}|${m[3]}|${m[4]}`);
    assert.deepEqual(pheRows, ['1st|WEEK ONE|Family Health', '2nd|WEEK TWO|TAEKWONDO', '1st|WEEK FOUR|Sexually Transmitted Diseases (STDs)', '2nd|WEEK FIVE|BOXING', '1st|WEEK SIX|DRUG EDUCATION']);
    assert.doesNotMatch(out, /JSS 3 \/ [^\n]* \/ 3rd Term/);
    const imported = out.split('\n').filter(l => /^ {2}JSS 3 \/ .* #\d+: /.test(l)).join('\n');
    assert.doesNotMatch(imported, /Practical on Taekwondo|AKANLO EDE|REVISON AND EXAMINATION/i, 'held items and the marker are not imported');
  } finally { rmSync(tmp, { recursive: true, force: true }); }
});
