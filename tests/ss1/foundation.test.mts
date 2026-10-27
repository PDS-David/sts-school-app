// SS1 foundation regression/negative-control tests. WRITTEN, NOT EXECUTED (testing deferred by owner until all SS1 source code is implemented).
// Run later (from repo root, Node 24.19.0, lockfile-resolved tooling):
//   node --import tsx --test tests/ss1/foundation.test.mts
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import {
  SS1_SUBJECTS, applyTopicRules, canonicalWeekLabel, compareToSnapshot, compileSs1, lessonContentHash, loadSourceManifest, loadSs1Registry,
  normalizedBodyHash, parseSubjectPackage, rawBodyHash, validatePackageStatic, ss1SupplementReference,
  type Ss1OriginalRecord, type Ss1Registry, type Ss1SourceRule, type Ss1SubjectPackage,
} from '../../backend/src/db/ss1/index.js';

const here = path.dirname(new URL(import.meta.url).pathname);
const example = () => JSON.parse(readFileSync(path.join(here, '../../docs/ss1/contracts/example-subject-package.json'), 'utf8'));
const manifest = loadSourceManifest();
const GEO1 = manifest.sources.find(s => s.source_id === 'SS1-SRC-1c1c1bdcecb4')!;
const geoReg = SS1_SUBJECTS.find(s => s.slug === 'geography')!;

const orig = (o: Partial<Ss1OriginalRecord> = {}): Ss1OriginalRecord => {
  const body = o.body ?? 'WEEK 1\nContour lines join places of equal height.\nSYNTHETIC SCHEME LINE: map reading';
  return {
    sourceId: GEO1.source_id, sourceSha256: GEO1.sha256, sourceIdentity: 'SSS 1/1st Term SS1_/x.doc', sourceBasename: 'x.doc',
    termLabel: '1st Term', subjectName: 'Geography', weekLabel: 'WEEK 1', title: 'Contours', rawBodySha256: rawBodyHash(body),
    normalizedBodySha256: normalizedBodyHash(body), bodyChars: body.length, disposition: 'ORIGINAL', ruleIds: [], body, row: { orderIndex: 1 }, ...o,
  };
};
const registryWith = (...packages: Ss1SubjectPackage[]): Ss1Registry => ({
  manifest, errors: [], packages,
  statuses: SS1_SUBJECTS.map(s => ({ slug: s.slug, canonicalSubject: s.canonicalSubject, worker: s.worker, state: packages.some(p => p.subject_slug === s.slug) ? 'PACKAGE_IMPLEMENTED' : 'PACKAGE_MISSING', file: null, manifestSourceIds: [], contentApproval: null, verification: null, errors: [] })),
});
const baseInput = (registry: Ss1Registry, originals: Ss1OriginalRecord[]) => ({
  registry, originals, excluded: [], ruleMatches: new Map<string, number>(), aliasUses: [], sourcesSeen: new Set<string>(), root: '/r',
  options: { allowPartialSources: true, requireAllPackages: false },
});
const implemented = (mut: (p: any) => void = () => {}): Ss1SubjectPackage => {
  const p = example(); p.package_status.implementation = 'IMPLEMENTED'; mut(p); return parseSubjectPackage(p);
};

test('manifest: 61 unique sources, 21 registered slugs, authoritative archive hash pinned', () => {
  assert.equal(manifest.sources.length, 61);
  assert.equal(new Set(manifest.sources.map(s => s.sha256)).size, 61);
  assert.equal(new Set(manifest.sources.map(s => s.assigned_subject_slug)).size, 21);
  assert.equal(SS1_SUBJECTS.length, 21);
  assert.equal(manifest.authoritative_archive.sha256, '024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e');
});

test('schema: the synthetic example parses and its content hash is the canonical lesson hash', () => {
  const p = parseSubjectPackage(example());
  assert.equal(p.lessons[0].content_hash, lessonContentHash(p.lessons[0]));
  assert.deepEqual(validatePackageStatic(p, geoReg, manifest).filter(e => !/does not account|not confirmed/.test(e)), []);
});

test('schema negative controls: unknown key, unknown op, bad id, short anchor, lesson in PENDING package', () => {
  const a = example(); a.surprise = 1; assert.throws(() => parseSubjectPackage(a));
  const b = example(); b.source_rules[0].op = 'run_script'; assert.throws(() => parseSubjectPackage(b));
  const c = example(); c.lessons[0].id = 'SUP-JSS3-GEO-001'; assert.throws(() => parseSubjectPackage(c));
  const d = example(); d.source_rules[0].anchor = 'short'; assert.throws(() => parseSubjectPackage(d));
  const e = example(); e.package_status.implementation = 'PENDING';
  assert.ok(validatePackageStatic(parseSubjectPackage(e), geoReg, manifest).some(m => /PENDING package must not contain lessons/.test(m)));
  const f = example(); f.lessons[0].content_hash = '1'.repeat(64);
  assert.ok(validatePackageStatic(parseSubjectPackage(f), geoReg, manifest).some(m => /content_hash/.test(m)));
  const g = example(); g.coverage[0].status = 'SUPPORTED'; g.coverage[0].open_item_ids = []; assert.throws(() => parseSubjectPackage(g), /SUPPORTED/);
});

test('identity: week labels canonicalise; hashes are stable and distinguish raw from normalised', () => {
  assert.equal(canonicalWeekLabel('WEEK 3'), '3'); assert.equal(canonicalWeekLabel('Week: Three'), '3'); assert.equal(canonicalWeekLabel('week 9 and 10'), '9&10');
  assert.notEqual(rawBodyHash('A  b'), rawBodyHash('A b')); assert.equal(normalizedBodyHash('A  b'), normalizedBodyHash('a B'));
  assert.match(ss1SupplementReference({ id: 'SUP-SS1-GEO-001', title: 'T', termLabel: '1st Term', subjectName: 'Geography', objectives: ['o'], body: 'b', practice: [{ id: 'Q01', prompt: 'p', answer: 'a', marking: 'm' }], originStatement: 'x', references: [], credits: [] }), /Practice questions:[\s\S]*Answers and marking guide:/);
});

const ctx = { sourceId: GEO1.source_id, sourceSha256: GEO1.sha256, subjectName: 'Geography' };
const rule = (r: Record<string, unknown>) => ({ rule_id: 'GEO-R09', source_id: GEO1.source_id, source_sha256: GEO1.sha256, reason: 'synthetic test reason', ...r }) as unknown as Ss1SourceRule;
const T = (weekLabel: string, body: string) => ({ weekLabel, title: weekLabel, body });

test('rules: split keeps every original line in order; anchor must match exactly once', () => {
  const body = 'WEEK 2\nPart one text\nSECOND PART STARTS HERE\nPart two text';
  const out = applyTopicRules([rule({ op: 'split_before_anchor', week_label: 'WEEK 2', anchor: 'SECOND PART STARTS HERE' })], [T('WEEK 2', body)], ctx);
  assert.equal(out.errors.length, 0); assert.equal(out.topics.length, 2);
  assert.equal(`${out.topics[0].body}\n${out.topics[1].body}`, body);
  const twice = applyTopicRules([rule({ op: 'split_before_anchor', week_label: 'WEEK 2', anchor: 'repeat' })], [T('WEEK 2', 'repeat then repeat')], ctx);
  assert.equal(twice.topics.length, 1); assert.match(twice.errors[0], /exactly once/);
  const wrongHash = applyTopicRules([rule({ op: 'classify_marker', source_sha256: 'f'.repeat(64), week_label: 'WEEK 2', anchor: 'Part one text', classification: 'SCHEME_ONLY' })], [T('WEEK 2', body)], ctx);
  assert.match(wrongHash.errors[0], /hash-scoped/);
});

test('rules: stranded label attaches; marker classifies; duplicate exclusion needs matching hash', () => {
  const attach = applyTopicRules([rule({ op: 'attach_stranded_label', week_label: 'WEEK 4', label_anchor: 'TOPIC: Rivers', direction: 'NEXT', use_label_as_title: true })],
    [T('WEEK 4', 'WEEK 4\nTOPIC: Rivers'), T('WEEK 5', 'WEEK 5\nBody of rivers lesson')], ctx);
  assert.equal(attach.topics.length, 1); assert.match(attach.topics[0].body, /TOPIC: Rivers\nWEEK 5/); assert.equal(attach.topics[0].ss1?.merged, true);
  const mark = applyTopicRules([rule({ op: 'classify_marker', week_label: 'WEEK 1', anchor: 'scheme line one', classification: 'SCHEME_ONLY' })], [T('WEEK 1', 'scheme line one')], ctx);
  assert.equal(mark.topics[0].ss1?.marker, 'SCHEME_ONLY'); assert.equal(mark.topics.length, 1);
  const h = normalizedBodyHash('same words here');
  const ok = applyTopicRules([rule({ op: 'exclude_proven_duplicate', week_label: 'WEEK 6', anchor: 'same words', normalized_body_sha256: h, duplicate_of: { source_id: GEO1.source_id, week_label: 'WEEK 7', normalized_body_sha256: h } })], [T('WEEK 6', 'same words here')], ctx);
  assert.equal(ok.topics.length, 0); assert.equal(ok.excluded.length, 1);
  const bad = applyTopicRules([rule({ op: 'exclude_proven_duplicate', week_label: 'WEEK 6', anchor: 'same words', normalized_body_sha256: 'a'.repeat(64), duplicate_of: { source_id: GEO1.source_id, week_label: 'WEEK 7', normalized_body_sha256: 'a'.repeat(64) } })], [T('WEEK 6', 'same words here')], ctx);
  assert.equal(bad.topics.length, 1); assert.match(bad.errors[0], /not the proven-duplicate hash/);
});

test('loader: with no packages all 21 subjects are explicit PACKAGE_MISSING and every manifest source is assigned', () => {
  const dir = mkdtempSync(path.join(tmpdir(), 'ss1-empty-'));
  const reg = loadSs1Registry({ subjectsDir: dir });
  assert.equal(reg.statuses.length, 21); assert.ok(reg.statuses.every(s => s.state === 'PACKAGE_MISSING')); assert.deepEqual(reg.errors, []);
  assert.equal(reg.statuses.reduce((n, s) => n + s.manifestSourceIds.length, 0), 61);
});

test('loader: unregistered file and invalid package are errors, never skipped', () => {
  const dir = mkdtempSync(path.join(tmpdir(), 'ss1-bad-'));
  writeFileSync(path.join(dir, 'astrology.json'), '{}'); writeFileSync(path.join(dir, 'geography.json'), '{"schema_version":"nope"}');
  const reg = loadSs1Registry({ subjectsDir: dir });
  assert.ok(reg.errors.some(e => /unregistered subject package file: astrology\.json/.test(e)));
  assert.equal(reg.statuses.find(s => s.slug === 'geography')!.state, 'PACKAGE_INVALID');
});

test('compile: pending package => originals only, explicit note; no lessons fabricated', () => {
  const out = compileSs1(baseInput(registryWith(), [orig()]));
  assert.equal(out.supplementRows.length, 0); assert.ok(out.notes.some(n => /geography\] PACKAGE_MISSING/.test(n)));
  assert.equal(out.subjects.find(s => s.slug === 'geography')!.teachingComplete, false);
});

test('compile: implemented package appends supplement rows; destination bucket must exist; completeness is never claimed with an open blocker', () => {
  const ok = compileSs1(baseInput(registryWith(implemented()), [orig()]));
  assert.equal(ok.supplementRows.length, 1); assert.match(ok.supplementRows[0].filePath, /__ss1_supplements__\/SUP-SS1-GEO-001\.json$/);
  assert.equal(ok.subjects.find(s => s.slug === 'geography')!.teachingComplete, false);
  const none = compileSs1(baseInput(registryWith(implemented()), [orig({ termLabel: '2nd Term' })]));
  assert.ok(none.errors.some(e => /absent from the original-source plan/.test(e)));
});

test('compile: delivery correction binds exact source+hash; same title alone / ambiguity / missing replacement fail closed', () => {
  const body = 'WEEK 3\nunsafe text';
  const dc = (o: Record<string, unknown> = {}) => ({ id: 'DC-SS1-GEO-001', source_id: GEO1.source_id, source_sha256: GEO1.sha256, class_name: 'SS 1', term_label: '1st Term', canonical_subject: 'Geography', source_title: 'Contours', source_week_label: 'WEEK 3', source_body_sha256: rawBodyHash(body), replacement_lesson_ids: ['SUP-SS1-GEO-001'], severity: 'INCORRECT', reason: 'synthetic reason for test only', ...o });
  const pkg = (o: Record<string, unknown>) => implemented(p => { p.delivery_corrections = [dc(o)]; });
  const good = compileSs1(baseInput(registryWith(pkg({})), [orig(), orig({ weekLabel: 'WEEK 3', body, rawBodySha256: rawBodyHash(body), row: { orderIndex: 2 } })]));
  assert.equal(good.corrections.length, 1); assert.deepEqual(good.errors, []);
  const sameTitleOtherBody = compileSs1(baseInput(registryWith(pkg({})), [orig(), orig({ weekLabel: 'WEEK 3', body: 'different', rawBodySha256: rawBodyHash('different') })]));
  assert.ok(sameTitleOtherBody.errors.some(e => /must be exactly 1/.test(e)));
  const twice = compileSs1(baseInput(registryWith(pkg({})), [orig({ weekLabel: 'WEEK 3', body, rawBodySha256: rawBodyHash(body) }), orig({ weekLabel: 'Week: Three', body, rawBodySha256: rawBodyHash(body) })]));
  assert.ok(twice.errors.some(e => /must be exactly 1/.test(e)));
});

test('compile: coverage — marker rows are not teaching; locators must resolve; ambiguous week needs an anchor', () => {
  const sup = implemented(p => {
    p.coverage[0].status = 'SUPPORTED'; p.coverage[0].open_item_ids = []; p.coverage[0].evidence = [{ kind: 'SOURCE_LESSON', source_id: GEO1.source_id, week_label: 'WEEK 1' }];
  });
  const asMarker = compileSs1(baseInput(registryWith(sup), [orig({ disposition: 'MARKER', marker: 'SCHEME_ONLY' })]));
  assert.ok(asMarker.errors.some(e => /is a marker row/.test(e)));
  const ambiguous = compileSs1(baseInput(registryWith(sup), [orig(), orig({ row: { orderIndex: 2 }, body: 'WEEK 1\nsecond block' })]));
  assert.ok(ambiguous.errors.some(e => /exact anchor is required/.test(e)));
});

test('compile: unapproved subject alias and unmatched rules block', () => {
  const noRule = compileSs1({ ...baseInput(registryWith(), [orig()]), aliasUses: [{ sourceId: GEO1.source_id, inferredSubject: 'Computer Studies', canonicalSubject: 'Data Processing', ruleId: null }] });
  assert.ok(noRule.errors.some(e => /unapproved subject alias/.test(e)));
  const unmatched = compileSs1({ ...baseInput(registryWith(implemented()), [orig()]), sourcesSeen: new Set([GEO1.source_id]) });
  assert.ok(unmatched.errors.some(e => /GEO-R01.*matched 0 times/.test(e)));
});

test('snapshot compatibility fails closed on any changed/missing existing row and on insertion inside the sequence', () => {
  const row = (n: number, title: string, hash = 'h') => ({ kind: 'ORIGINAL', className: 'SS 1', subjectName: 'Geography', termLabel: '1st Term', orderIndex: n, identityKey: JSON.stringify(['secondary', 'SS 1', 'Geography', '1st Term', n]), title, sourceFile: 'x.doc', weekLabel: `WEEK ${n}`, rawBodySha256: hash, sourceId: 's', lessonId: null, disposition: 'ORIGINAL', ruleIds: [] }) as any;
  const snap = (n: number, title: string, hash = 'h') => ({ subject_name: 'Geography', term_label: '1st Term', order_index: n, title, source_file: 'x.doc', source_reference_sha256: hash });
  assert.deepEqual(compareToSnapshot([row(1, 'A'), row(2, 'B'), row(3, 'new')], [snap(1, 'A'), snap(2, 'B')]), []);
  assert.ok(compareToSnapshot([row(1, 'A')], [snap(1, 'A'), snap(2, 'B')]).some(e => /missing from plan/.test(e)));
  assert.ok(compareToSnapshot([row(1, 'A2')], [snap(1, 'A')]).some(e => /title differs/.test(e)));
  assert.ok(compareToSnapshot([row(1, 'A', 'other')], [snap(1, 'A')]).some(e => /body differs/.test(e)));
  assert.ok(compareToSnapshot([row(1, 'A'), row(2, 'inserted'), row(3, 'B')], [snap(1, 'A'), snap(3, 'B')]).some(e => /inside existing sequence/.test(e)));
});

test('importer wiring is SS1-only: the hooks exist and JSS3 guards were not widened', () => {
  const src = readFileSync(path.join(here, '../../backend/src/db/ingestTopics.ts'), 'utf8');
  for (const needle of ['./ss1/importerHooks.js', 'ss1Session().bindSource', 'ss1Session().resolveSubject', 'ss1Session().applyTopicRules', 'ss1.compile()', 'ss1.finalize(normalRows)']) assert.ok(src.includes(needle), needle);
  assert.ok(src.includes("r.className !== 'SS 3'") && src.includes('SS 3 audit-only'), 'SS3 audit-only exception unchanged');
  assert.ok(src.includes("if (r.className !== 'JSS 3') continue;") && src.includes("JSS 3 Third Term must have zero instructional rows"), 'JSS3 third-term gate unchanged');
  assert.ok(!/SS 1[^\n]*3rd Term[^\n]*zero instructional/.test(src));
});
