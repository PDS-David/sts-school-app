// Agent 1F-R3 — JSS3 pending scheme-only entries are held, never imported.
// Synthetic tests always run. Source-backed tests need (all optional, skipped with a reason if unset):
//   JSS3_FIRST_TERM_ROOT   folder containing "JSS3 1ST TERM " (original DOCX/DOC)
//   JSS3_SECOND_TERM_ROOT  folder containing "JSS3 2ND TERM "
//   JSS3_SCHEME_MANIFEST   path to the ORIGINAL scheme_only_integration_manifest.csv (read-only)
//   JSS3_THIRD_TERM_ROOT   folder containing "JSS3 3RD TERM " (only for the Akanlo Ede / Taekwondo source check)
// Run from backend/:  node --import tsx --test ../tests/jss3-pending-entries-1f-r3.test.mts
// Importer is only ever run as a dry run (no database, never --yes).
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import test from 'node:test';
import mammoth from 'mammoth';
import ts from 'typescript';
import {
  applyJss3SourceTextResolution, canonicalJss3Week, resolveJss3ParsedTopic,
} from '../backend/src/db/jss3CurriculumResolutions.js';
import { applyJss3SecondTermSourceTextResolution, resolveJss3SecondTermParsedTopic } from '../backend/src/db/jss3SecondTermResolutions.js';
import {
  JSS3_THIRD_TERM_MANIFEST, applyJss3ThirdTermSourceTextResolution, redistributeJss3ThirdTermTopics,
} from '../backend/src/db/jss3ThirdTermRedistribution.js';
import {
  JSS3_PENDING_ENTRIES, JSS3_PENDING_STATUS, assertJss3PendingRegisterValid, assertNoJss3PendingLeak,
  findJss3PendingLeaks, matchJss3PendingEntry, partitionJss3PendingEntries, pendingEntryKey, unconfirmedJss3PendingEntries,
  type Jss3PendingEntry,
} from '../backend/src/db/jss3PendingEntries.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const backendDir = path.join(here, '..', 'backend');
const sha = (s: string) => createHash('sha256').update(s).digest('hex');
const collapse = (s: string) => s.normalize('NFKC').replace(/\s+/g, ' ').trim();

function loadParseTopics(): (t: string) => Array<{ weekLabel: string; title: string; body: string }> {
  const src = readFileSync(path.join(backendDir, 'src', 'db', 'ingestTopics.ts'), 'utf8');
  const excerpt = src.slice(src.indexOf('const WEEK_NUMBER_WORD'), src.indexOf('// ── Main'));
  const code = ts.transpileModule(`${excerpt}\nglobalThis.parseTopics=parseTopics;`, { compilerOptions: { target: ts.ScriptTarget.ES2022 } }).outputText;
  const ctx: any = {}; vm.runInNewContext(code, ctx);
  return (t: string) => Array.from(ctx.parseTopics(t)) as Array<{ weekLabel: string; title: string; body: string }>;
}
const parseTopics = loadParseTopics();
const tp = (weekLabel: string, title: string, body = `${weekLabel}\n${title}\nbody of ${title}`) => ({ weekLabel, title, body });
const PHE = 'PHE JS 3.docx', PHE_SUBJ = 'Physical & Health Education';
const BIZ = 'business_studies JSS3.docx', MATH = 'BASIC 9 MATHEMATICS E-NOTE.docx', BT1 = 'BASIC TECH.docx';

// ── Register ────────────────────────────────────────────────────────────
test('register: exactly eight unique pending entries, all JSS 3, none approved', () => {
  assert.equal(JSS3_PENDING_ENTRIES.length, 8);
  assert.equal(new Set(JSS3_PENDING_ENTRIES.map(pendingEntryKey)).size, 8);
  assert.doesNotThrow(() => assertJss3PendingRegisterValid());
  for (const e of JSS3_PENDING_ENTRIES) {
    assert.equal(e.className, 'JSS 3');
    assert.equal(e.integrationStatus, 'pending parser and plan integration; do not import');
    assert.equal(e.approval, 'none');
  }
  assert.deepEqual(JSS3_PENDING_ENTRIES.map(e => `${e.originalTerm}|${e.basename}|${e.parsedWeek}|${e.title}`), [
    `2nd Term|${BIZ}|4|Book – keeping ethnics`, `2nd Term|${BIZ}|8|Display`, `2nd Term|${BIZ}|9|Types of Display`,
    `2nd Term|${BIZ}|10|Printers correction signs / speed development`,
    `1st Term|${BT1}|11|scale drawing`, `1st Term|${BT1}|12|simple blue print reading`,
    `2nd Term|${MATH}|4|Statistics II`, `1st Term|${PHE}|5|Practical demonstration of basic skills of hockey`,
  ]);
});

const MANIFEST = process.env.JSS3_SCHEME_MANIFEST;
test('register equals the ORIGINAL supplied manifest (all eight rows pending; nothing approved)', { skip: MANIFEST ? false : 'set JSS3_SCHEME_MANIFEST' }, () => {
  const lines = readFileSync(MANIFEST!, 'utf8').split(/\r?\n/).filter(Boolean);
  const cells = (l: string) => { const out: string[] = []; let cur = '', q = false; for (const ch of l) { if (ch === '"') q = !q; else if (ch === ',' && !q) { out.push(cur); cur = ''; } else cur += ch; } out.push(cur); return out; };
  const [head, ...body] = lines.map(cells);
  const col = (n: string) => head.indexOf(n);
  assert.equal(body.length, 8);
  assert.ok(body.every(r => r[col('integration_status')] === JSS3_PENDING_STATUS), 'every manifest row is pending / do not import');
  const fromManifest = body.map(r => JSON.stringify([r[col('subject')], r[col('original_term')], r[col('source_file')], r[col('source_week')], r[col('title')]])).sort();
  const fromRegister = JSS3_PENDING_ENTRIES.map(e => JSON.stringify([e.subject, e.originalTerm, e.basename, e.manifestWeek, e.title])).sort();
  assert.deepEqual(fromRegister, fromManifest);
});

// ── Partition: identity, order, provenance ──────────────────────────────
test('partition: hockey Week 5 heading held; Week 4 HOCHEY and Week 6 Female Genital Mutilation kept intact and in order', () => {
  const fgm = tp('WEEK 6', 'FEMALE GENITAL MUTILATION', 'WEEK 6\n\nCLASS: J.S.S 3\n\nTOPIC: FEMALE GENITAL MUTILATION\n\nFemale Genital- it refers to ...');
  const topics = [tp('WEEK 3', 'COMBINED EVENTS'), tp('WEEK 4', 'HOCHEY'), tp('WEEK 5', 'PRACTICAL DEMONSTRATION OF BASIC SKILLS OF HOCKEY', 'WEEK 5\n\n   PRACTICAL DEMONSTRATION OF BASIC SKILLS OF HOCKEY'), fgm, tp('WEEK 7 & 8', 'FAMILY LIFE AND SEX EDUCATION')];
  const r = partitionJss3PendingEntries('JSS 3', '1st Term', PHE, PHE_SUBJ, topics);
  assert.deepEqual(r.held.map(h => h.topic.title), ['PRACTICAL DEMONSTRATION OF BASIC SKILLS OF HOCKEY']);
  assert.deepEqual(r.kept.map(k => k.title), ['COMBINED EVENTS', 'HOCHEY', 'FEMALE GENITAL MUTILATION', 'FAMILY LIFE AND SEX EDUCATION']);
  assert.equal(r.kept[2], fgm, 'FGM row is the very same object: text, week label and title untouched');
  assert.equal(r.held[0].weekLabel, 'WEEK 5');
  assert.equal(r.held[0].entry.manifestWeek, 'WEEK 5');
  assert.match(r.held[0].reason, /do not import/);
  assert.equal(r.held[0].bodySha256, sha(collapse('WEEK 5\n\n   PRACTICAL DEMONSTRATION OF BASIC SKILLS OF HOCKEY').toLowerCase()));
});

test('partition: identity is class + subject + original term + file + week + title, never title alone', () => {
  const decoys: Array<[string, string, string, string, string, string]> = [
    // className, term, file, subject, week, title
    ['JSS 3', '2nd Term', BIZ, 'Business Studies', 'WEEK 7', 'Display'],                    // right file/title, wrong week
    ['JSS 3', '3rd Term', BIZ, 'Business Studies', 'WEEK 8', 'Display'],                    // wrong term
    ['JSS 3', '2nd Term', 'other.docx', 'Business Studies', 'WEEK 8', 'Display'],           // wrong file
    ['JSS 3', '2nd Term', BIZ, 'Mathematics', 'WEEK 8', 'Display'],                         // wrong subject
    ['JSS 2', '2nd Term', BIZ, 'Business Studies', 'WEEK 8', 'Display'],                    // wrong class
    ['JSS 3', '3rd Term', BT1, 'Basic Technology', 'Week 11', 'scale drawing'],             // 3rd-Term file of the same name
    ['JSS 3', '2nd Term', MATH, 'Mathematics', 'WEEK 4', 'SOLVING SIMULTANEOUS EQUATION GRAPHICALLY'], // same week, different title
  ];
  for (const [c, term, file, subj, wk, title] of decoys) {
    const r = partitionJss3PendingEntries(c, term, file, subj, [tp(wk, title)]);
    assert.equal(r.held.length, 0, `${c}/${term}/${file}/${subj}/${wk}/${title} must not be held`);
    assert.equal(r.kept.length, 1);
  }
  // each of the eight is held exactly by its full identity (week label spelling varies by source)
  const spell: Record<string, string> = { '4': 'WEEK 4', '8': 'WEEK 8', '9': 'WEEK 9', '10': 'WEEK 10', '11': 'week 11', '12': 'week 12', '5': 'WEEK 5' };
  for (const e of JSS3_PENDING_ENTRIES) {
    const r = partitionJss3PendingEntries('JSS 3', e.originalTerm, e.basename, e.subject, [tp(spell[e.parsedWeek], e.title.toUpperCase())]);
    assert.equal(r.held.length, 1, `${e.title} held (case-insensitive title)`);
  }
});

test('partition: relative order of every other row is preserved around several held rows', () => {
  const t = [tp('WEEK TWO - THREE', 'PERSONAL FINANCE'), tp('WEEK 4', 'Book – keeping ethnics'), tp('WEEK FIVE', 'TRADING'), tp('WEEK SIX', 'SHORTHAND'), tp('WEEK SEVEN', 'KEYBOARDING'),
    tp('WEEK 8', 'Display'), tp('WEEK 9', 'Types of Display'), tp('WEEK 10', 'Printers correction signs / speed development')];
  const r = partitionJss3PendingEntries('JSS 3', '2nd Term', BIZ, 'Business Studies', t);
  assert.deepEqual(r.kept.map(k => k.title), ['PERSONAL FINANCE', 'TRADING', 'SHORTHAND', 'KEYBOARDING']);
  assert.equal(r.held.length, 4);
  for (const k of r.kept) assert.equal(k, t.find(x => x.title === k.title), 'kept rows are untouched objects');
});

// ── Fail-closed on invalid / unknown / contradictory states ─────────────
test('invalid, unknown or contradictory status/approval is rejected, never released', () => {
  const mutate = (i: number, patch: Partial<Record<keyof Jss3PendingEntry, unknown>>) =>
    JSS3_PENDING_ENTRIES.map((e, j) => (j === i ? ({ ...e, ...patch } as Jss3PendingEntry) : e));
  for (const bad of ['approved', 'approved for import', '', 'Pending parser and plan integration; do not import', 'pending parser and plan integration', undefined, null]) {
    const reg = mutate(3, { integrationStatus: bad });
    assert.throws(() => assertJss3PendingRegisterValid(reg), /unknown or contradictory integration status/, String(bad));
    assert.throws(() => partitionJss3PendingEntries('JSS 3', '2nd Term', BIZ, 'Business Studies', [tp('WEEK 10', 'Printers correction signs / speed development')], reg), /unknown or contradictory/, `partition ${String(bad)}`);
  }
  for (const bad of ['approved', 'granted', '', undefined]) {
    assert.throws(() => assertJss3PendingRegisterValid(mutate(0, { approval: bad })), /no approval has been supplied/, String(bad));
  }
  assert.throws(() => assertJss3PendingRegisterValid(JSS3_PENDING_ENTRIES.slice(1)), /exactly 8/);
  assert.throws(() => assertJss3PendingRegisterValid([...JSS3_PENDING_ENTRIES.slice(0, 7), JSS3_PENDING_ENTRIES[0]]), /duplicate identity/);
  assert.throws(() => assertJss3PendingRegisterValid(mutate(0, { destinationTerm: '2nd Term', originalTerm: '1st Term' })), /unexpected class\/destination/);
});

test('an injected pending-entry leak in the import row set is detected and rejected', () => {
  const clean = [{ className: 'JSS 3', termLabel: '2nd Term', basename: BIZ, subjectName: 'Business Studies', weekLabel: 'WEEK FIVE', title: 'TRADING' }];
  assert.deepEqual(findJss3PendingLeaks(clean), []);
  assert.doesNotThrow(() => assertNoJss3PendingLeak(clean));
  const leak = { className: 'JSS 3', termLabel: '2nd Term', basename: MATH, subjectName: 'Mathematics', weekLabel: 'WEEK 4', title: 'Statistics II' };
  assert.equal(findJss3PendingLeaks([...clean, leak]).length, 1);
  assert.throws(() => assertNoJss3PendingLeak([...clean, leak]), /pending entr(y|ies) in the import plan/);
  // every one of the eight is caught as a leak when injected
  for (const e of JSS3_PENDING_ENTRIES) {
    const row = { className: 'JSS 3', termLabel: e.destinationTerm, basename: e.basename, subjectName: e.subject, weekLabel: `WEEK ${e.parsedWeek}`, title: e.title };
    assert.equal(findJss3PendingLeaks([row]).length, 1, e.title);
    assert.throws(() => assertNoJss3PendingLeak([row]));
  }
  // an invalid register also blocks the write-path guard (it cannot pass by being broken)
  assert.throws(() => assertNoJss3PendingLeak(clean, JSS3_PENDING_ENTRIES.slice(1)), /exactly 8/);
});

test('unconfirmed hold: a processed source whose pending heading was not located blocks', () => {
  const seen = new Set([`2nd Term/${BIZ}`]);
  const heldBiz = new Set(JSS3_PENDING_ENTRIES.filter(e => e.basename === BIZ).map(pendingEntryKey));
  assert.deepEqual(unconfirmedJss3PendingEntries(seen, heldBiz), []);
  const missingOne = new Set([...heldBiz].slice(1));
  assert.equal(unconfirmedJss3PendingEntries(seen, missingOne).length, 1);
  assert.deepEqual(unconfirmedJss3PendingEntries(new Set(), new Set()), [], 'files not in this run are not required');
  assert.equal(matchJss3PendingEntry('JSS 3', '2nd Term', BIZ, 'Business Studies', { weekLabel: 'WEEK 8', title: 'Display' })?.title, 'Display');
});

// ── Existing dispositions stay held ─────────────────────────────────────
test('Yoruba Akanlo Ede and PHE Practical on Taekwondo remain held under their existing dispositions', () => {
  const akanlo = JSS3_THIRD_TERM_MANIFEST.filter(e => /AKANLO EDE/i.test(e.title));
  const taekwondo = JSS3_THIRD_TERM_MANIFEST.filter(e => /Practical on Taekwondo/i.test(e.title));
  assert.equal(akanlo.length, 1); assert.equal(taekwondo.length, 1);
  for (const e of [...akanlo, ...taekwondo]) { assert.equal(e.classification, 'held'); assert.ok(!e.destination, 'no destination term'); }
  // they are not part of the new register, and the new hold does not release or alter them
  assert.ok(![...akanlo, ...taekwondo].some(e => JSS3_PENDING_ENTRIES.some(p => p.title === e.title)));
});

// ── Source-backed ───────────────────────────────────────────────────────
const R1 = process.env.JSS3_FIRST_TERM_ROOT, R2 = process.env.JSS3_SECOND_TERM_ROOT, R3 = process.env.JSS3_THIRD_TERM_ROOT;
const real1 = { skip: R1 ? false : 'set JSS3_FIRST_TERM_ROOT' } as const;
const real2 = { skip: R2 ? false : 'set JSS3_SECOND_TERM_ROOT' } as const;
const real3 = { skip: R3 ? false : 'set JSS3_THIRD_TERM_ROOT' } as const;

async function sourceRows(file: string, base: string, term: string) {
  const raw: string = (await mammoth.extractRawText({ path: file })).value;
  let text = applyJss3SourceTextResolution(base, term, raw);
  text = applyJss3SecondTermSourceTextResolution(base, term, text);
  text = applyJss3ThirdTermSourceTextResolution(base, term, text);
  const rows = parseTopics(text).map(t => resolveJss3SecondTermParsedTopic(base, term, resolveJss3ParsedTopic(base, term, t))).filter(Boolean) as ReturnType<typeof parseTopics>;
  return { raw, rows };
}
const sig = (r: { weekLabel: string; title: string; body: string }) => `${r.weekLabel}|${r.title}|${sha(r.body)}`;

async function checkFile(root: string, folder: string, file: string, term: string, subject: string, expectedHeld: string[]) {
  const f = path.join(root, folder, file);
  assert.ok(existsSync(f), `missing ${f}`);
  const { raw, rows } = await sourceRows(f, file, term);
  const r = partitionJss3PendingEntries('JSS 3', term, file, subject, rows);
  assert.deepEqual(r.held.map(h => h.entry.title), expectedHeld, `${file}: held entries`);
  // every held heading is genuinely in the original source text
  for (const h of r.held) assert.ok(collapse(raw).toLowerCase().includes(collapse(h.entry.title).toLowerCase()), `source evidence for ${h.entry.title}`);
  // all other rows: same rows, same text/provenance, same relative order
  assert.deepEqual(r.kept.map(sig), rows.filter(x => !r.held.some(h => h.topic === x)).map(sig));
  assert.equal(r.kept.length + r.held.length, rows.length);
  return { raw, rows, ...r };
}

test('real First-Term sources: Basic Tech weeks 11/12 and PHE Week 5 hockey held; all other rows unchanged', real1, async () => {
  const bt = await checkFile(R1!, 'JSS3 1ST TERM ', BT1, '1st Term', 'Basic Technology', ['scale drawing', 'simple blue print reading']);
  assert.equal(bt.kept.length, 10);
  const phe = await checkFile(R1!, 'JSS3 1ST TERM ', PHE, '1st Term', PHE_SUBJ, ['Practical demonstration of basic skills of hockey']);
  const titles = phe.kept.map(k => k.title);
  assert.ok(titles.includes('HOCHEY') && titles.includes('FEMALE GENITAL MUTILATION'));
  assert.equal(titles.indexOf('FEMALE GENITAL MUTILATION'), titles.indexOf('HOCHEY') + 1, 'FGM directly follows Week 4 once the hockey heading is withheld');
  const fgm = phe.kept.find(k => k.title === 'FEMALE GENITAL MUTILATION')!;
  assert.equal(canonicalJss3Week(fgm.weekLabel), '6');
  assert.ok(fgm.body.includes('TOPIC: FEMALE GENITAL MUTILATION') && fgm.body.includes('Urinary and reproduction tract infections'));
  // the existing PHE rule only inserts the structural "WEEK 6" marker line in front of the lesson block
  assert.ok(fgm.body.startsWith('WEEK 6'));
  assert.ok(collapse(phe.raw).includes(collapse(fgm.body.replace(/^WEEK 6\s*/, ''))), 'FGM lesson text is verbatim original source');
  // the withheld hockey row is the heading only; it never contained the FGM lesson
  assert.ok(!phe.held[0].topic.body.includes('FEMALE GENITAL'));
  assert.equal(phe.held[0].topic.body.length, 84);
});

test('real Second-Term sources: Business Studies weeks 4/8/9/10 and Mathematics Statistics II held; all other rows unchanged', real2, async () => {
  const biz = await checkFile(R2!, 'JSS3 2ND TERM ', BIZ, '2nd Term', 'Business Studies',
    ['Book – keeping ethnics', 'Display', 'Types of Display', 'Printers correction signs / speed development']);
  assert.deepEqual(biz.kept.map(k => canonicalJss3Week(k.weekLabel)), ['2-3', '5', '6', '7']);
  const math = await checkFile(R2!, 'JSS3 2ND TERM ', MATH, '2nd Term', 'Mathematics', ['Statistics II']);
  assert.ok(math.kept.some(k => k.title === 'SOLVING SIMULTANEOUS EQUATION GRAPHICALLY'), 'the other Week-4 row is kept');
});

function dryRun(root: string): { out: string; status: number | null } {
  const p = spawnSync(process.execPath, ['--import', 'tsx', 'src/db/ingestTopics.ts', '--root', root, '--school-code', 'secondary'], {
    cwd: backendDir, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, stdio: ['ignore', 'pipe', 'pipe'],
  });
  return { out: p.stdout, status: p.status };
}
const orderLines = (out: string, bucket: string) => [...out.matchAll(new RegExp(`^  ${bucket.replace(/[.*+?^${}()|[\]\\/&]/g, '\\$&')} #(\\d+): (.*)$`, 'gm'))].map(m => ({ n: Number(m[1]), rest: m[2] }));

test('real importer dry run, Second Term: five held entries reported; none in the import order; indexes recalculated gap-free', real2, async () => {
  const { out, status } = dryRun(R2!);
  assert.equal(status, 0, 'Second-Term root audit still passes');
  assert.match(out, /JSS3 PENDING ENTRIES — HELD, NOT IMPORTED .*: 5\n/);
  for (const e of JSS3_PENDING_ENTRIES.filter(x => x.originalTerm === '2nd Term')) {
    assert.ok(out.includes(`HELD: JSS 3 / ${e.subject} / original term 2nd Term / JSS3 2ND TERM /${e.basename} / `), e.title);
    assert.ok(out.includes(`/ ${e.title}\n`), e.title);
  }
  assert.doesNotMatch(out, /pending-entry control FAILED/);
  const order = out.slice(out.indexOf('Normal curriculum order'));
  for (const e of JSS3_PENDING_ENTRIES.filter(x => x.originalTerm === '2nd Term')) {
    assert.ok(!new RegExp(`#\\d+: JSS3 2ND TERM /${e.basename.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')} / [^/\\n]+ / ${e.title.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&')}$`, 'm').test(order), `${e.title} must not be in the import order`);
  }
  const biz = orderLines(out, 'JSS 3 / Business Studies / 2nd Term');
  assert.deepEqual(biz.map(b => b.n), [1, 2, 3, 4]);
  assert.deepEqual(biz.map(b => b.rest.split(' / ')[1]), ['WEEK TWO - THREE', 'WEEK FIVE', 'WEEK SIX', 'WEEK SEVEN']);
  const math = orderLines(out, 'JSS 3 / Mathematics / 2nd Term');
  assert.deepEqual(math.map(m => m.n), math.map((_, i) => i + 1));
  assert.ok(!math.some(m => /Statistics II$/.test(m.rest)));
  assert.equal(math.length, 9);
  const m = /^Parsed (\d+) topic row/m.exec(out)!; assert.ok(Number(m[1]) > 0);
});

test('real importer dry run, First Term: three held entries reported; none in the import order; FGM intact; no new blocker', real1, async () => {
  const { out, status } = dryRun(R1!);
  assert.match(out, /JSS3 PENDING ENTRIES — HELD, NOT IMPORTED .*: 3\n/);
  for (const e of JSS3_PENDING_ENTRIES.filter(x => x.originalTerm === '1st Term')) {
    assert.ok(out.includes(`HELD: JSS 3 / ${e.subject} / original term 1st Term / JSS3 1ST TERM /${e.basename} / `), e.title);
  }
  assert.doesNotMatch(out, /pending-entry control FAILED/);
  const order = out.slice(out.indexOf('Normal curriculum order'));
  assert.doesNotMatch(order, /BASIC TECH\.docx \/ week 1[12] \//);
  assert.doesNotMatch(order, /PRACTICAL DEMONSTRATION OF BASIC SKILLS OF HOCKEY/);
  const phe = orderLines(out, 'JSS 3 / Physical & Health Education / 1st Term');
  assert.deepEqual(phe.map(p => p.n), phe.map((_, i) => i + 1));
  assert.ok(phe.some(p => /WEEK 6 \/ FEMALE GENITAL MUTILATION$/.test(p.rest)), 'FGM is still labelled Week 6 and present');
  assert.ok(!phe.some(p => /WEEK 5 \//.test(p.rest)));
  const bt = orderLines(out, 'JSS 3 / Basic Technology / 1st Term');
  assert.equal(bt.length, 10);
  // the only blocker in this run is the pre-existing unsupported .rtf Music source (a converted docx is not among the inputs)
  if (status !== 0) {
    const unsupported = /Unsupported source format — convert\/review before import: (\d+)\n  (.*)/.exec(out);
    assert.ok(unsupported && unsupported[1] === '1' && /\.rtf$/.test(unsupported[2]), 'only blocker: unsupported Music .rtf');
    assert.doesNotMatch(out, /gate FAILED|failed to read|DUPLICATE normalized|BLOCKED — (class|no parseable)/);
  }
});

test('real Third-Term sources: Akanlo Ede and Practical on Taekwondo are still held, not kept', real3, async () => {
  const check = async (file: string, subject: string, title: RegExp) => {
    const f = path.join(R3!, 'JSS3 3RD TERM ', file);
    assert.ok(existsSync(f));
    const { rows } = await sourceRows(f, file, '3rd Term');
    const red = redistributeJss3ThirdTermTopics(file, '3rd Term', subject, rows);
    const rec = red.records.filter((x: any) => title.test(x.title));
    assert.equal(rec.length, 1);
    assert.equal(rec[0].classification, 'held');
    assert.ok(!red.kept.some((k: any) => title.test(k.title)));
  };
  await check('PHE.docx', PHE_SUBJ, /Practical on Taekwondo/i);
  await check('OMEGA TERM YORUBA JS3.docx', 'Yoruba', /AKANLO EDE/i);
});
