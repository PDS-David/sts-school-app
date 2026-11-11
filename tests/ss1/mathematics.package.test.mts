// DEFERRED BY OWNER (SS1-03, mathematics). Do not run before SS1-09.
// Static tests need no inputs. Source-dependent tests need:
//   SS1_PLAN=/private/ss1-plan.json  (from scripts/ss1/build_subject_packages.py; contains source_previews)
// and skip with an explicit message when it is absent. A skipped test is NOT a pass.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import JSZip from 'jszip';
import mammoth from 'mammoth';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { packageSchema } from '../../backend/src/db/ss1/subjectPackageSchema.ts';
import { compilePackages, applyRules, registry, sha256, originalLessonId } from '../../backend/src/db/ss1/compiler.ts';
import { parseTopics } from '../../backend/src/db/ingestTopics.ts';
import { isSafeSvg } from '../../backend/src/db/attachTopicAssets.ts';
const here = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(here, '../..');
const SLUG = 'mathematics';
const pkg = packageSchema.parse(JSON.parse(readFileSync(path.join(repo, `backend/src/db/ss1/subjects/${SLUG}.json`), 'utf8')));
const expected = registry.filter(r => r.assigned_subject_slug === SLUG);
const archiveBytes = readFileSync(path.join(repo, 'docs/ss1/sources/SSS1-original.zip'));

test('package accounts for exactly the assigned sources with manifest hashes', () => {
  assert.deepEqual(pkg.sources.map(s => s.source_id).sort(), expected.map(s => s.source_id).sort());
  for (const s of pkg.sources) { const r = expected.find(e => e.source_id === s.source_id)!; assert.equal(s.sha256, r.sha256); assert.equal(s.archive_member, r.archive_member); assert.equal(s.term, r.term_from_folder); assert.equal(s.canonical_subject, pkg.canonical_subject); }
});
test('every source has coverage; PARTIAL/UNRESOLVED are blockers, never hidden', () => {
  for (const s of pkg.sources) assert.ok(pkg.coverage.some(c => c.source_id === s.source_id), s.source_id);
  const incomplete = pkg.coverage.filter(c => c.status === 'PARTIAL' || c.status === 'UNRESOLVED');
  if (incomplete.length) assert.ok(pkg.package_status === 'PENDING' && pkg.open_items.some(o => o.blocks_delivery), 'incomplete coverage requires a PENDING package and a blocking open item');
});
test('lesson completeness: objectives, body, practice with full answers and exact mark totals', () => {
  for (const l of pkg.lessons) {
    assert.equal(sha256(l.body), l.body_sha256, l.id); assert.ok(l.id.startsWith(`SUP-SS1-${SLUG.toUpperCase()}-`), l.id);
    assert.ok(l.objectives.length > 0 && l.practice.length > 0 && l.provenance.length > 0, l.id);
    for (const q of l.practice) { assert.ok(q.answer.trim().length > 0, `${l.id}/${q.id}`); assert.equal(q.marks, q.marking.reduce((n, m) => n + m.marks, 0), `${l.id}/${q.id}`); }
    assert.notEqual(l.state.verification, 'VERIFIED', 'no verification may be claimed before SS1-09');
    if (l.state.content_approval === 'PENDING') assert.equal(l.state.approval_reference, null);
  }
});
test('no invented approval or verification references', () => {
  for (const x of [...pkg.lessons.map(l => l.state), ...pkg.assets.map(a => a.state)]) { if (x.content_approval === 'PENDING') assert.equal(x.approval_reference, null); assert.equal(x.verification_reference, null); }
});
test('asset ids/positions unique, paths contained, MIME allowed', () => {
  assert.equal(new Set(pkg.assets.map(a => a.id)).size, pkg.assets.length);
  assert.equal(new Set(pkg.assets.map(a => `${a.lesson_id}:${a.order}`)).size, pkg.assets.length);
  for (const a of pkg.assets) { assert.ok(a.path.startsWith(`backend/src/db/ss1/assets/${SLUG}/`) && !a.path.includes('..')); assert.ok(a.alt.trim().length >= 10, a.id); }
});
test('asset bytes, hashes and SVG safety match the registered package metadata', () => {
  assert.equal(pkg.assets.length, 12);
  for (const a of pkg.assets) {
    const bytes = readFileSync(path.join(repo, a.path));
    assert.equal(bytes.length, a.bytes, a.id);
    assert.equal(sha256(bytes), a.sha256, a.id);
    if (a.media_type === 'image/svg+xml') assert.equal(isSafeSvg(bytes), true, a.id);
    assert.equal(a.state.content_approval, 'APPROVED', a.id);
    assert.equal(a.state.implementation, 'IMPLEMENTED', a.id);
    assert.equal(a.state.verification, 'DEFERRED', a.id);
  }
});
test('anchors are exact, bound to one source SHA, and repeated anchors are rejected (negative control)', () => {
  const rule = pkg.source_rules.find(r => r.op === 'split_before' || r.op === 'attach_stranded_label');
  const s = expected[0];
  const input = { source_id: s.source_id, sha256: s.sha256, filePath: s.archive_member, text: 'AAA\nBBB\nBBB' };
  const synthetic = { id: 'SYN', op: 'split_before' as const, source_id: s.source_id, source_sha256: s.sha256, anchor: 'BBB', week_label: '2', evidence: { locator: 'x', explanation: 'x' } };
  assert.throws(() => applyRules(input, [synthetic]));
  assert.throws(() => applyRules({ ...input, text: 'AAA\nBBB' }, [{ ...synthetic, source_sha256: 'f'.repeat(64) }]));
  void rule;
});
test('wrong-source hash is rejected by the compiler (negative control)', () => {
  const s = pkg.sources[0];
  assert.throws(() => compilePackages([pkg], [{ source_id: s.source_id, sha256: '0'.repeat(64), filePath: s.archive_member, text: 'x' }], () => []));
});
test('package never targets another class or subject', () => {
  for (const l of pkg.lessons) { assert.equal(l.class_name, 'SS 1'); assert.equal(l.subject, pkg.canonical_subject); }
  for (const s of pkg.sources) assert.equal(s.class_name, 'SS 1');
});
test('original source ZIP passes the real Mathematics parser/compiler and every correction binds to an exact source row', async () => {
  const archive = await JSZip.loadAsync(archiveBytes);
  const inputs = [];
  for (const source of pkg.sources) {
    const member = archive.file(source.archive_member);
    assert(member, `missing original source member: ${source.archive_member}`);
    const bytes = await member.async('nodebuffer');
    assert.equal(sha256(bytes), source.sha256, `source hash mismatch: ${source.source_id}`);
    const extracted = await mammoth.extractRawText({ buffer: bytes });
    inputs.push({ source_id: source.source_id, sha256: source.sha256, filePath: source.archive_member, text: extracted.value });
  }
  const plan = compilePackages([pkg], inputs, parseTopics);
  const identified = new Map(plan.identified_rows.map((row: any) => [row.id, row]));
  for (const correction of pkg.delivery_corrections) {
    assert(identified.has(correction.source_lesson_id), `unidentified correction source: ${correction.id}`);
    assert.equal((identified.get(correction.source_lesson_id) as any).body_sha256, correction.body_sha256, correction.id);
    assert(pkg.lessons.some(lesson => lesson.id === correction.replacement_id), `missing replacement: ${correction.id}`);
  }
  for (const coverage of pkg.coverage) for (const id of coverage.lesson_ids) {
    assert(identified.has(id) || pkg.source_rules.some(rule => rule.id === id) || pkg.lessons.some(lesson => lesson.id === id) || pkg.delivery_corrections.some(correction => correction.id === id),
      `unresolved coverage target: ${coverage.id} -> ${id}`);
  }
  for (const asset of pkg.assets) {
    const lesson = pkg.lessons.find(item => item.id === asset.lesson_id)!;
    const [memberAndOrder, title] = asset.source_locator.split(' — ');
    const member = memberAndOrder.split(', order_index ')[0];
    const order = Number(memberAndOrder.split(', order_index ')[1]);
    const sourceRow = plan.identified_rows.find((row: any) =>
      row.row.filePath === member && row.row.termLabel === lesson.term && row.row.title === title);
    assert(sourceRow, `asset source row not identified: ${asset.id}`);
    assert.equal(sourceRow.row.orderIndex, order, `asset topic order mismatch: ${asset.id}`);
  }
  assert.equal(inputs.length, 3);
});

test('key SS1 Mathematics worked calculations are independently recomputed', () => {
  const baseValue = (digits: string, base: number) => {
    const [whole, fraction = ''] = digits.split('.');
    const wholeValue = [...whole].reduce((sum, digit) => sum * base + parseInt(digit, base), 0);
    return wholeValue + [...fraction].reduce((sum, digit, i) => sum + parseInt(digit, base) / base ** (i + 1), 0);
  };
  const toBase = (value: number, base: number) => {
    const digits = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let n = value, out = '';
    while (n > 0) { out = digits[n % base] + out; n = Math.floor(n / base); }
    return out || '0';
  };
  assert.equal(baseValue('1011.01', 2), 11.25);
  assert.equal(baseValue('2311', 4) - baseValue('213', 4), baseValue('2032', 4));
  assert.equal(toBase(1007, 8), '1757');
  assert.equal(toBase(761, 12), '535');
  assert.equal(toBase(761, 16), '2F9');
  assert.equal(Number(Math.log10(8615).toFixed(4)), 3.9353);
  assert.equal((7 / 36) * 360, 70);
  assert(Math.abs((5000 - 5000 / 27) - 130000 / 27) < 1e-10);
});
