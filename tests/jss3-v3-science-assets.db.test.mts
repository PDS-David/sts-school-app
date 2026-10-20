// V3 Science assets + delivery — REAL resolution against the importer capture, through the real attach code and the
// real authenticated routes. Needs a LOCAL Postgres and JSS3_CAPTURE_DIR (capture_rows.py output of THIS tree):
//   JSS3_V3_TEST_DATABASE_URL=postgres://postgres@127.0.0.1:55432/v3_test JSS3_CAPTURE_DIR=/tmp/cap node --import tsx --test tests/jss3-v3-science-assets.db.test.mts
// Asset/identity tests live under one throw-away school code. The delivery tests must use the real school_code
// 'secondary' (corrections are keyed on it), so they refuse to run if that school already has a 'Basic Science' subject,
// track every row they create by id, and assert zero residue. Identity is checked per record (key, title, term,
// order_index, body hash, bytes, alt text, caption, displayed) — never by totals alone.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import http from 'node:http';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test, { after, before } from 'node:test';
import type { AddressInfo } from 'node:net';

const URL_ = process.env.JSS3_V3_TEST_DATABASE_URL, CAP = process.env.JSS3_CAPTURE_DIR;
const root = path.resolve(import.meta.dirname, '..');
if (!URL_ || !CAP) {
  test('V3 science real asset resolution (skipped: set JSS3_V3_TEST_DATABASE_URL to a LOCAL Postgres and JSS3_CAPTURE_DIR)', { skip: true }, () => {});
} else {
  assert.ok(['localhost', '127.0.0.1', '::1', '[::1]'].includes(new URL(URL_).hostname), 'refusing non-local database host');
  process.env.DATABASE_URL = URL_; process.env.NODE_ENV = 'development';
  const prompts: string[] = [];
  const stub = http.createServer((req, res) => { let b = ''; req.on('data', d => b += d); req.on('end', () => {
    const p = String(JSON.parse(b).prompt); prompts.push(p);
    const q = (n: number) => JSON.stringify(Array.from({ length: n }, (_, i) => ({ stem: `Q${i + 1}?`, options: ['A', 'B', 'C', 'D'].map(k => ({ key: k, text: `opt ${k}` })), correct_keys: ['A'], marks: 1 })));
    const text = /Draft 5 multiple/.test(p) ? q(5) : /Draft 3 multiple/.test(p) ? q(3) : 'AI STUDY NOTES (uncorrected topic)';
    res.setHeader('content-type', 'application/json'); res.end(JSON.stringify({ text }));
  }); });
  await new Promise<void>(r => stub.listen(0, '127.0.0.1', r));
  process.env.AI_AGENT_SERVICE_URL = `http://127.0.0.1:${(stub.address() as AddressInfo).port}`;

  const SC = 'zz_v3_science', SC_B = 'zz_v3_science_b', SD = 'secondary', TAG = 'zz_v3_delivery';
  const sha = (b: Buffer | string) => createHash('sha256').update(b).digest('hex');
  const { pool, query } = await import('../backend/src/db/pool.js');
  const attach = await import('../backend/src/db/attachTopicAssets.js');
  await import('express-async-errors');
  const { default: express } = await import('express');
  const { default: learningRouter } = await import('../backend/src/routes/learning.js');
  const { signAccess } = await import('../backend/src/utils/jwt.js');
  const { default: corrections } = await import('../backend/src/db/data/jss3DeliveryCorrections.json', { with: { type: 'json' } });
  const { JSS3_SUPPLEMENTS } = await import('../backend/src/db/jss3Supplements.js');
  const { resolveDelivery, JSS3_CORRECTION_MARKER, JSS3_WITHHELD_MARKER } = await import('../backend/src/utils/jss3DeliveryCorrection.js');

  const A = path.join(root, 'curriculum-assets/jss3/v3-science');
  const defs: any[] = JSON.parse(readFileSync(path.join(root, 'scripts/jss3/v3/science_assets.json'), 'utf8'));
  const bindings: any[] = JSON.parse(readFileSync(path.join(A, 'V3_BINDINGS.json'), 'utf8'));
  const supplemented: any[] = JSON.parse(readFileSync(path.join(CAP, 'supplemented-rows.json'), 'utf8'));
  const original: any[] = JSON.parse(readFileSync(path.join(CAP, 'original-rows.json'), 'utf8'));
  const sciRows = supplemented.filter(r => r.subjectName === 'Basic Science');
  const btRows = supplemented.filter(r => r.subjectName === 'Basic Technology');
  const C = corrections as unknown as any[];
  const M: Record<string, string> = { '1st Term': 'V3_SCIENCE_1ST_MANIFEST.csv', '2nd Term': 'V3_SCIENCE_2ND_MANIFEST.csv' };
  const REPLACEMENT: Record<string, string> = { 'FAMILY TRAITS': 'SUP-BS-FAMILY-TRAITS-V3', 'LIGHT ENERGY': 'SUP-BS-LIGHT-V3' };
  const HELD = ['BS-GEN-SOURCE-1', 'BS-GEN-SOURCE-2', 'BS-GEN-SOURCE-3', 'BS-PRISM-SOURCE'];
  const opt = (term: string, extra: object = {}) => ({ schoolCode: SC, subject: 'Basic Science', className: 'JSS 3', termLabel: term, apply: true, skipTitleCheck: false, ...extra });
  const prepared = (term: string, dir = A) => attach.prepareAssets(attach.loadManifest(path.join(dir, M[term])), dir);
  const manifestRows = (term: string) => attach.loadManifest(path.join(A, M[term]));

  // ── expected identities, derived independently from definitions + capture (NOT from the manifests) ──────────────
  const isSupplement = (r: any) => String(r.weekLabel).startsWith('SUPPLEMENT');
  const expected: any[] = [];
  for (const d of defs) {
    const orig = sciRows.filter(r => r.termLabel === d.term && r.title === d.title && !isSupplement(r));
    assert.equal(orig.length, 1, `original identity ${d.asset_key}`);
    assert.equal(sha(orig[0].sourceReference), d.body_sha256, `${d.asset_key}: original body drifted from the definition`);
    expected.push({ key: d.asset_key, def: d, identity: 'original', row: orig[0], displayed: d.displayed });
    const lid = REPLACEMENT[d.title];
    if (d.displayed && lid) {
      const sup = sciRows.filter(r => r.weekLabel === `SUPPLEMENT ${lid}` && r.termLabel === d.term);
      assert.equal(sup.length, 1, `replacement identity ${lid}`);
      assert.ok(JSS3_SUPPLEMENTS.find((l: any) => l.id === lid), `${lid} is an executable lesson`);
      expected.push({ key: `${d.asset_key}-SUP`, def: d, identity: lid, row: sup[0], displayed: d.displayed });
    }
  }
  const defOf = (key: string) => expected.find(e => e.key === key)!;

  const cleanup = async () => {
    await query('DELETE FROM topics WHERE school_code = ANY($1)', [[SC, SC_B]]); await query('DELETE FROM subjects WHERE school_code = ANY($1)', [[SC, SC_B]]);
    await query('DELETE FROM students WHERE school_code = ANY($1)', [[SC, SC_B]]);
    await query("DELETE FROM users WHERE school_code = ANY($1) OR username LIKE 'zz_v3_science_%'", [[SC, SC_B]]); await query('DELETE FROM schools WHERE code = ANY($1)', [[SC, SC_B]]);
  };
  const created = { topics: [] as number[], subjects: [] as number[], users: [] as string[], students: [] as string[] };
  const one = async (sql: string, p: unknown[] = []) => (await query(sql, p)).rows[0];
  const assetCount = async () => Number((await one('SELECT count(*) n FROM topic_assets a JOIN topics t ON t.id=a.topic_id WHERE t.school_code=$1', [SC])).n);
  const sciTopic = async (term: string, order: number) => (await one(`SELECT t.id,t.title,t.source_reference FROM topics t JOIN subjects s ON s.id=t.subject_id WHERE t.school_code=$1 AND s.name='Basic Science' AND t.term_label=$2 AND t.order_index=$3`, [SC, term, order]));
  const dbAssets = async () => (await query(`SELECT a.id,a.asset_key,a.sha256,a.bytes,a.mime,a.kind,a.caption,a.alt_text,a.displayed,a.sort_order,t.title,t.term_label,t.order_index,t.source_reference FROM topic_assets a JOIN topics t ON t.id=a.topic_id WHERE t.school_code=$1 ORDER BY a.asset_key`, [SC])).rows;
  const meta = (r: any) => ({ id: r.id, key: r.asset_key, sha: r.sha256, bytes: sha(r.bytes), mime: r.mime, kind: r.kind, caption: r.caption, alt: r.alt_text, displayed: r.displayed, sort: r.sort_order, topic: `${r.term_label}|${r.order_index}|${r.title}` });

  let server: any, base = '', tokenA = '', tokenB = '', tokenC = '', tokenD = '', n0 = 0, dSubject = 0;
  const mkStudent = async (school: string, tag: string, cls: string, track = false) => {
    const u = await query(`INSERT INTO users(username,password_hash,role,school_code,full_name) VALUES($1,'x','student',$2,$3) RETURNING id`, [`zz_v3_science_${tag}`, school, `V3 ${tag}`]);
    const st = await query(`INSERT INTO students(school_code,admission_number,full_name,class_name,user_id) VALUES($1,$2,$3,$4,$5) RETURNING id`, [school, `ZZV3-${tag}`, `V3 ${tag}`, cls, u.rows[0].id]);
    if (track) { created.users.push(u.rows[0].id); created.students.push(st.rows[0].id); }
    return { token: signAccess({ id: u.rows[0].id, username: `zz_v3_science_${tag}`, role: 'student', school_code: school, assigned_class: null, assigned_subject_ids: [] }), studentId: st.rows[0].id as string };
  };
  before(async () => {
    await query(readFileSync(path.join(root, 'backend/schema.sql'), 'utf8')); await cleanup();
    n0 = Number((await one('SELECT count(*) n FROM topic_assets')).n);
    // Delivery fixtures use the REAL school code: refuse to touch a database that already holds that subject.
    assert.equal((await query('SELECT id FROM subjects WHERE school_code=$1 AND name=$2', [SD, 'Basic Science'])).rows.length, 0, `refusing: school '${SD}' already has a Basic Science subject — use a fresh disposable database`);
    await query('INSERT INTO schools(code,name) VALUES($1,$2)', [SC, 'V3 SCIENCE TEST (delete me)']); await query('INSERT INTO schools(code,name) VALUES($1,$2)', [SC_B, 'V3 SCIENCE TEST B (delete me)']);
    for (const [name, rows] of [['Basic Science', sciRows], ['Basic Technology', btRows]] as const) {
      const sid = (await query('INSERT INTO subjects(school_code,name) VALUES($1,$2) RETURNING id', [SC, name])).rows[0].id;
      for (const r of rows) await query(`INSERT INTO topics(school_code,subject_id,class_name,term_label,title,description,source_reference,source_file,order_index) VALUES($1,$2,$3,$4,$5,$6,$7,'v3-test',$8)`, [SC, sid, r.className, r.termLabel, r.title, `LESSON ${r.title}`, r.sourceReference, Number(r.orderIndex)]);
    }
    tokenA = (await mkStudent(SC, 'A', 'JSS 3')).token; tokenB = (await mkStudent(SC, 'B', 'JSS 1')).token; tokenC = (await mkStudent(SC_B, 'C', 'JSS 3')).token;
    dSubject = (await query('INSERT INTO subjects(school_code,name) VALUES($1,$2) RETURNING id', [SD, 'Basic Science'])).rows[0].id; created.subjects.push(dSubject);
    const d = await mkStudent(SD, 'D', 'JSS 3', true); tokenD = d.token;
    const app = express(); app.use(express.json()); app.use('/learning', learningRouter); server = app.listen(0, '127.0.0.1'); await new Promise(r => server.once('listening', r));
    base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  });
  after(async () => {
    await new Promise(r => server?.close(r)); await new Promise(r => stub.close(r as any));
    await query('DELETE FROM topic_completions WHERE student_id=ANY($1)', [created.students]); await query('DELETE FROM submissions WHERE student_id=ANY($1)', [created.students]);
    await query('DELETE FROM topics WHERE id=ANY($1)', [created.topics]); await query('DELETE FROM assessments WHERE subject_id=ANY($1)', [created.subjects]); await query('DELETE FROM questions WHERE subject_id=ANY($1)', [created.subjects]);
    await query('DELETE FROM students WHERE id=ANY($1)', [created.students]); await query('DELETE FROM users WHERE id=ANY($1)', [created.users]); await query('DELETE FROM subjects WHERE id=ANY($1)', [created.subjects]);
    await cleanup();
    const n = (await one(`SELECT (SELECT count(*) FROM topics WHERE school_code=ANY($1)) t,(SELECT count(*) FROM subjects WHERE school_code=ANY($1)) s,(SELECT count(*) FROM users WHERE username LIKE 'zz_v3_science_%') u,(SELECT count(*) FROM schools WHERE code=ANY($1)) c,
      (SELECT count(*) FROM topics WHERE id=ANY($2)) dt,(SELECT count(*) FROM assessments WHERE subject_id=ANY($3)) da,(SELECT count(*) FROM topic_assets) a`, [[SC, SC_B], created.topics, created.subjects]));
    await pool.end();
    assert.deepEqual([n.t, n.s, n.u, n.c, n.dt, n.da].map(Number), [0, 0, 0, 0, 0, 0], 'no residue'); assert.equal(Number(n.a), n0, 'topic_assets back to its starting count');
  });

  const get = (p: string, tok?: string, h: Record<string, string> = {}) => fetch(base + p, { headers: { ...(tok ? { Authorization: `Bearer ${tok}` } : {}), ...h } });
  const listFor = async (topicId: number, tok?: string) => { const r = await get(`/learning/topics/${topicId}/assets`, tok); return { status: r.status, body: r.status === 200 ? await r.json() as any : null }; };

  test('definitions, bindings and both manifests agree record-by-record with the captured identities (17 records / 13 displayed / 12 unique)', () => {
    assert.equal(defs.length, 12); assert.equal(new Set(defs.map(d => d.sha256)).size, 12);
    assert.equal(expected.length, 17); assert.equal(expected.filter(e => e.displayed).length, 13);
    assert.equal(new Set(expected.filter(e => e.displayed).map(e => e.def.sha256)).size, 8, 'eight unique displayed images');
    assert.deepEqual(expected.filter(e => !e.displayed).map(e => e.key).sort(), HELD);
    for (const e of expected) assert.equal(sha(readFileSync(path.join(A, e.def.file))), e.def.sha256, e.key);
    // bindings file: exactly the expected records, with identity, order_index, title and body hash taken from the capture
    assert.deepEqual(bindings.map(b => b.asset_key).sort(), expected.map(e => e.key).sort());
    for (const e of expected) {
      const b = bindings.find(x => x.asset_key === e.key);
      assert.deepEqual({ identity: b.identity, term: b.term, title: b.title, order_index: b.order_index, body_sha256: b.body_sha256, displayed: b.displayed },
        { identity: e.identity, term: e.def.term, title: e.row.title, order_index: Number(e.row.orderIndex), body_sha256: sha(e.row.sourceReference), displayed: e.displayed }, e.key);
    }
    // manifests: one row per expected record, exact file/hash/order/title/caption/alt/displayed
    const rows = Object.keys(M).flatMap(t => manifestRows(t).map(r => ({ ...r, term: t })));
    assert.equal(rows.length, 17); assert.equal(new Set(rows.map(r => r.asset_key)).size, 17);
    for (const e of expected) {
      const r = rows.find(x => x.asset_key === e.key)!; assert.ok(r, e.key);
      assert.deepEqual({ file: r.file, sha256: r.sha256, order_index: r.order_index, expected_title: r.expected_title, caption: r.caption, alt_text: r.alt_text, displayed: r.displayed, term: r.term },
        { file: e.def.file, sha256: e.def.sha256, order_index: Number(e.row.orderIndex), expected_title: e.row.title, caption: e.def.caption, alt_text: e.def.alt_text, displayed: e.displayed, term: e.def.term }, e.key);
    }
  });

  test('wrong-identity rejection: every wrong target fails with the right guard before ANY write (mixed batches included)', async () => {
    assert.equal(await assetCount(), 0, 'starts empty');
    const first = prepared('1st Term'); const second = prepared('2nd Term');
    const realOther = sciRows.find(r => r.termLabel === '1st Term' && !isSupplement(r) && r.title !== 'FAMILY TRAITS')!;
    // a) shifted onto a REAL but different Science lesson in the same term -> title guard
    await assert.rejects(attach.attachAssets(first.map(a => ({ ...a, order_index: Number(realOther.orderIndex) })), opt('1st Term')), /Title guard/);
    // b) shifted to an order_index that does not exist -> no such topic
    await assert.rejects(attach.attachAssets(first.map(a => ({ ...a, order_index: a.order_index + 1000 })), opt('1st Term')), /Topic not found/);
    // c) mixed batch: valid items followed by ONE wrong title -> whole run rejected, valid items not written
    const idx = first.length - 1;
    await assert.rejects(attach.attachAssets(first.map((a, i) => i === idx ? { ...a, expected_title: 'BEARINGS' } : a), opt('1st Term')), /Title guard/);
    // d) 2nd-term manifest aimed at 1st Term: order 5 exists there with a different title (precondition proven, not assumed)
    const t5 = sciRows.find(r => r.termLabel === '1st Term' && Number(r.orderIndex) === 5)!; assert.notEqual(t5.title, 'LIGHT ENERGY');
    await assert.rejects(attach.attachAssets(second, opt('1st Term')), /Title guard/);
    // e) wrong subject: Basic Technology; guard path depends on whether BT has a row at the first order (proven from the capture)
    const btHas = btRows.some(r => r.termLabel === '1st Term' && Number(r.orderIndex) === Math.min(...first.map(a => a.order_index)));
    await assert.rejects(attach.attachAssets(first, opt('1st Term', { subject: 'Basic Technology' })), btHas ? /Title guard/ : /Topic not found/);
    // f) wrong class and g) wrong school: the topic identity includes both
    await assert.rejects(attach.attachAssets(first, opt('1st Term', { className: 'JSS 1' })), /Topic not found/);
    await assert.rejects(attach.attachAssets(first, opt('1st Term', { schoolCode: SC_B })), /Topic not found/);
    assert.equal(await assetCount(), 0, 'nothing written by any rejected run');
    // dry run never writes either
    const dry = await attach.attachAssets(first, opt('1st Term', { apply: false })); assert.equal(dry.planned, first.length); assert.equal(dry.inserted, 0); assert.equal(await assetCount(), 0);
  });

  test('both V3 manifests attach with title guards ON: 17 records, each on its intended lesson, exact bytes, alt text, caption and held flags', async () => {
    const before = (await query(`SELECT id,title,source_reference,order_index,term_label FROM topics WHERE school_code=$1 ORDER BY id`, [SC])).rows;
    let inserted = 0;
    for (const term of Object.keys(M)) { const items = prepared(term); const r = await attach.attachAssets(items, opt(term)); assert.equal(r.inserted, items.length); inserted += r.inserted; }
    assert.equal(inserted, 17);
    const db = await dbAssets(); assert.equal(db.length, 17); assert.equal(db.filter(r => r.displayed).length, 13);
    assert.deepEqual(db.map(r => r.asset_key).sort(), expected.map(e => e.key).sort());
    for (const e of expected) {
      const r = db.find(x => x.asset_key === e.key)!; const file = readFileSync(path.join(A, e.def.file));
      assert.equal(r.title, e.row.title, `${e.key} title`); assert.equal(r.term_label, e.def.term, `${e.key} term`); assert.equal(r.order_index, Number(e.row.orderIndex), `${e.key} order`);
      assert.equal(sha(r.source_reference), sha(e.row.sourceReference), `${e.key} lands on the captured body`);
      assert.ok(Buffer.compare(r.bytes, file) === 0, `${e.key} bytes identical to the file`); assert.equal(r.sha256, e.def.sha256); assert.equal(sha(r.bytes), e.def.sha256);
      assert.equal(r.mime, /\.jpe?g$/.test(e.def.file) ? 'image/jpeg' : 'image/png', `${e.key} mime`);
      assert.equal(r.alt_text, e.def.alt_text); assert.ok(r.alt_text.length > 30); assert.equal(r.caption, e.def.caption); assert.equal(r.displayed, e.displayed, `${e.key} displayed`);
    }
    assert.deepEqual(db.filter(r => !r.displayed).map(r => r.asset_key).sort(), HELD, 'only the four withdrawn source figures are held');
    assert.deepEqual((await query(`SELECT id,title,source_reference,order_index,term_label FROM topics WHERE school_code=$1 ORDER BY id`, [SC])).rows, before, 'lesson rows are untouched by attaching');
  });

  test('idempotent re-attach: zero inserts, same row ids, bytes and metadata untouched', async () => {
    const snap = (await dbAssets()).map(meta);
    for (const term of Object.keys(M)) { const items = prepared(term); const r = await attach.attachAssets(items, opt(term)); assert.equal(r.inserted, 0); assert.equal(r.alreadyPresent, items.length); assert.equal(r.metadataUpdated, 0); }
    assert.deepEqual((await dbAssets()).map(meta), snap);
  });

  test('metadata-update consent: drift is refused, previewed without apply, applied only with --update-metadata, and touches only the named field of the named record', async () => {
    const items = prepared('1st Term'); const key = 'BS-GENETICS-CORRECTED'; const def = defOf(key).def;
    const drift = items.map(a => a.asset_key === key ? { ...a, alt_text: a.alt_text + ' (edited)' } : a);
    const snap = (await dbAssets()).map(meta);
    await assert.rejects(attach.attachAssets(drift, opt('1st Term')), /Metadata conflict.*alt_text/);
    assert.deepEqual((await dbAssets()).map(meta), snap, 'refusal leaves everything untouched');
    const dry = await attach.attachAssets(drift, opt('1st Term', { updateMetadata: true, apply: false })); assert.equal(dry.metadataPlanned, 1); assert.equal(dry.metadataUpdated, 0);
    assert.deepEqual((await dbAssets()).map(meta), snap, 'consent without --apply still writes nothing');
    const up = await attach.attachAssets(drift, opt('1st Term', { updateMetadata: true })); assert.equal(up.metadataUpdated, 1); assert.equal(up.inserted, 0);
    const after = (await dbAssets()).map(meta);
    for (const [i, b] of snap.entries()) { if (b.key === key) assert.deepEqual({ ...after[i], alt: '' }, { ...b, alt: '' }); else assert.deepEqual(after[i], b, `${b.key} unchanged`); }
    assert.equal(after.find(r => r.key === key)!.alt, def.alt_text + ' (edited)');
    assert.equal(after.find(r => r.key === key)!.bytes, snap.find(r => r.key === key)!.bytes, 'bytes never change with metadata');
    await attach.attachAssets(items, opt('1st Term', { updateMetadata: true })); // restore
    assert.deepEqual((await dbAssets()).map(meta), snap);
  });

  test('bytes are never overwritten: tampered file, different sha under an existing key and a MIME change are all refused', async () => {
    const snap = (await dbAssets()).map(meta);
    const tmp = mkdtempSync(path.join(tmpdir(), 'v3db-')); try {
      cpSync(A, tmp, { recursive: true }); const p = path.join(tmp, 'bs-prism-corrected.png'); const b = readFileSync(p); b[b.length - 30] ^= 0xff; writeFileSync(p, b);
      assert.throws(() => prepared('2nd Term', tmp), /sha256 mismatch.*BS-PRISM-CORRECTED/s);
      const swapped = prepared('2nd Term').map(a => a.asset_key === 'BS-PRISM-CORRECTED' ? { ...a, bytes: b, sha256: sha(b) } : a);
      await assert.rejects(attach.attachAssets(swapped, opt('2nd Term')), /BS-PRISM-CORRECTED.*different sha256/);
      await assert.rejects(attach.attachAssets(swapped, opt('2nd Term', { updateMetadata: true })), /different sha256/, 'consent to metadata never permits new bytes');
    } finally { rmSync(tmp, { recursive: true, force: true }); }
    await assert.rejects(attach.attachAssets(prepared('2nd Term').map(a => a.asset_key === 'BS-EYE' ? { ...a, mime: 'image/png' } : a), opt('2nd Term', { updateMetadata: true })), /BS-EYE.*different MIME/);
    assert.deepEqual((await dbAssets()).map(meta), snap, 'nothing changed');
  });

  test('authenticated delivery: every displayed record is listed on its own lesson with exact metadata and identical bytes; held figures are absent', async () => {
    const shown = expected.filter(e => e.displayed); const heldIds = new Map((await dbAssets()).filter(r => !r.displayed).map(r => [r.asset_key, r.id]));
    const sortOf = new Map(Object.keys(M).flatMap(t => manifestRows(t).map(r => [r.asset_key, r.sort_order] as const)));
    const byTopic = new Map<string, any[]>(); for (const e of shown) { const k = `${e.def.term}|${e.row.orderIndex}`; byTopic.set(k, [...(byTopic.get(k) ?? []), e]); }
    let seen = 0;
    for (const [k, list] of byTopic) {
      const [term, order] = k.split('|'); const t = await sciTopic(term, Number(order)); assert.equal(t.title, list[0].row.title);
      assert.equal((await get(`/learning/topics/${t.id}/assets`)).status, 401, 'no token');
      const { status, body } = await listFor(t.id, tokenA); assert.equal(status, 200);
      assert.deepEqual(body.assets.map((a: any) => a.asset_key), list.map(e => e.key).sort((x, y) => sortOf.get(x)! - sortOf.get(y)!), `${k} listing and order`);
      assert.ok(!body.assets.some((a: any) => HELD.includes(a.asset_key)), 'held figures are never listed');
      for (const a of body.assets) {
        const e = defOf(a.asset_key); assert.equal(a.alt_text, e.def.alt_text); assert.equal(a.caption, e.def.caption); assert.equal(a.sha256, e.def.sha256); assert.equal(a.url, `/learning/assets/${a.id}`);
        const img = await get(a.url, tokenA); assert.equal(img.status, 200); assert.equal(img.headers.get('content-type'), /\.jpe?g$/.test(e.def.file) ? 'image/jpeg' : 'image/png');
        assert.match(img.headers.get('cache-control') ?? '', /private/); assert.equal(img.headers.get('x-content-type-options'), 'nosniff');
        assert.ok(Buffer.compare(Buffer.from(await img.arrayBuffer()), readFileSync(path.join(A, e.def.file))) === 0, `${a.asset_key} served bytes`);
        assert.equal((await get(a.url)).status, 401, 'bytes need a token'); seen++;
      }
    }
    assert.equal(seen, 13);
    const all = (await dbAssets()); const ft = await sciTopic('1st Term', Number(defOf('BS-GEN-SOURCE-1').row.orderIndex));
    for (const key of HELD) { const r = await get(`/learning/assets/${heldIds.get(key)}`, tokenA); assert.equal(r.status, 404, `${key} held by id`); await r.arrayBuffer(); }
    assert.ok(all.filter(r => !r.displayed).length === 4 && ft.title === 'FAMILY TRAITS');
  });

  test('cross-class and cross-school rejection: a JSS 1 student and another school see no list, no bytes and no ETag oracle for any of the 17 records', async () => {
    const db = await dbAssets();
    for (const tok of [tokenB, tokenC]) {
      for (const [term, order] of new Set(expected.map(e => `${e.def.term}|${e.row.orderIndex}`)).values().map(k => k.split('|') as [string, string])) {
        const t = await sciTopic(term, Number(order)); const { status, body } = await listFor(t.id, tok); assert.equal(status, 200); assert.deepEqual(body.assets, [], `${term}/${order}`);
      }
      for (const r of db) { const x = await get(`/learning/assets/${r.id}`, tok, { 'If-None-Match': `"${r.sha256}"` }); assert.equal(x.status, 404, `${r.asset_key} bytes/304 must not leak`); await x.arrayBuffer(); }
    }
    const shown = db.find(r => r.asset_key === 'BS-EYE')!; const ok = await get(`/learning/assets/${shown.id}`, tokenA, { 'If-None-Match': `"${shown.sha256}"` }); assert.equal(ok.status, 304, 'the JSS 3 owner gets a conditional 304');
  });

  test('held-source hiding is consent-gated: releasing a withdrawn figure needs --update-metadata, is visible only then, and is restored', async () => {
    const items = prepared('1st Term'); const key = 'BS-GEN-SOURCE-1'; const row = (await dbAssets()).find(r => r.asset_key === key)!; const t = await sciTopic('1st Term', row.order_index);
    const visible = async () => (await listFor(t.id, tokenA)).body.assets.some((a: any) => a.asset_key === key);
    assert.equal(await visible(), false); assert.equal((await get(`/learning/assets/${row.id}`, tokenA)).status, 404);
    const flipped = items.map(a => a.asset_key === key ? { ...a, displayed: true } : a);
    await assert.rejects(attach.attachAssets(flipped, opt('1st Term')), /Metadata conflict.*displayed/); assert.equal(await visible(), false);
    await attach.attachAssets(flipped, opt('1st Term', { updateMetadata: true })); assert.equal(await visible(), true);
    const served = await get(`/learning/assets/${row.id}`, tokenA); assert.equal(served.status, 200); assert.equal(sha(Buffer.from(await served.arrayBuffer())), defOf(key).def.sha256);
    await attach.attachAssets(items, opt('1st Term', { updateMetadata: true })); assert.equal(await visible(), false); assert.equal((await get(`/learning/assets/${row.id}`, tokenA)).status, 404);
    assert.equal((await dbAssets()).filter(r => !r.displayed).length, 4);
  });

  // ── Delivery: the two V3 Science replacements through the real routes, school_code 'secondary' ─────────────────────
  const dapi = async (m: string, p: string) => { const r = await fetch(base + '/learning' + p, { method: m, headers: { 'content-type': 'application/json', authorization: `Bearer ${tokenD}` } }); let j: any = null; try { j = await r.json(); } catch {} return { status: r.status, body: j }; };
  const mkTopic = async (title: string, source: string, term: string, summary: string | null = null) => {
    const id = (await one(`INSERT INTO topics(school_code,subject_id,class_name,term_label,title,source_reference,summary) VALUES($1,$2,'JSS 3',$3,$4,$5,$6) RETURNING id`, [SD, dSubject, term, title, source, summary])).id; created.topics.push(id); return id as number;
  };
  const norm = (s: string) => s.replace(/\s+/g, ' ').trim();
  const flaw = { 'FAMILY TRAITS': /height/i, 'LIGHT ENERGY': /refract/i } as Record<string, RegExp>;
  for (const title of Object.keys(REPLACEMENT)) {
    const c = C.find(x => x.package === 'V3' && x.source_title === title)!; const lesson: any = JSS3_SUPPLEMENTS.find((l: any) => l.id === REPLACEMENT[title])!; const orig = original.find(r => r.subjectName === 'Basic Science' && r.title === title)!;
    const body = norm(orig.sourceReference); const m = flaw[title].exec(body)!; const markers = [body.slice(0, 70), body.slice(Math.max(0, m.index - 20), m.index + 50)];
    test(`[${c.id}] replacement delivery: list and completion are taught from ${lesson.id} only; original text and stale cache never reach the student or the AI`, async () => {
      assert.equal(c.source_body_sha256, sha(orig.sourceReference)); for (const mk of markers) { assert.ok(mk.length >= 50); assert.ok(!norm(lesson.body).includes(mk), 'marker is original-only'); }
      const topic = await mkTopic(title, orig.sourceReference, orig.termLabel, 'OLD AI SUMMARY BUILT FROM ORIGINAL TEXT');
      const list = await dapi('GET', '/topics?class_name=JSS%203'); const t = list.body.topics.find((x: any) => x.id === topic);
      assert.ok(t.source_reference.startsWith(`${JSS3_CORRECTION_MARKER} ${c.id}`)); assert.equal(t.summary, t.source_reference);
      assert.ok(t.source_reference.includes(lesson.title)); assert.ok(t.source_reference.includes(norm(lesson.body).slice(0, 60)) || t.source_reference.includes(lesson.body.slice(0, 60)));
      assert.deepEqual({ id: t.delivery_correction.id, status: t.delivery_correction.status }, { id: c.id, status: 'corrected' }); assert.equal(t.generated_assessment_id, null);
      const wire = JSON.stringify(t); for (const mk of markers) assert.ok(!norm(wire.replace(/\\n/g, ' ')).includes(mk), `original text leaked: ${mk}`); assert.ok(!wire.includes('OLD AI SUMMARY'));
      assert.equal(sha((await one('SELECT source_reference s FROM topics WHERE id=$1', [topic])).s), c.source_body_sha256, 'stored original row is immutable');
      prompts.length = 0; const done = await dapi('POST', `/topics/${topic}/complete`);
      assert.equal(done.status, 200); assert.equal(done.body.delivery_correction.status, 'corrected'); assert.ok(done.body.summary.startsWith(JSS3_CORRECTION_MARKER));
      assert.ok(prompts.length >= 2, 'practice + assessment prompts'); for (const p of prompts) { assert.ok(p.includes(JSS3_CORRECTION_MARKER)); assert.ok(p.includes(lesson.title)); for (const mk of markers) assert.ok(!norm(p).includes(mk), 'original text reached AI grounding'); }
      const fp = resolveDelivery({ school_code: SD, class_name: 'JSS 3', subject_name: 'Basic Science', term_label: orig.termLabel, title, source_reference: orig.sourceReference })!.fingerprint;
      const link = await one(`SELECT a.status,a.content_fingerprint FROM topics t JOIN assessments a ON a.id=t.generated_assessment_id WHERE t.id=$1`, [topic]); assert.deepEqual({ ...link }, { status: 'open', content_fingerprint: fp });
    });
    test(`[${c.id}] changed source is WITHHELD: no teaching, no AI call, no assessment, no completion row; the changed row is not rewritten`, async () => {
      const changed = orig.sourceReference + '\nRE-IMPORTED EDIT THAT NO LONGER MATCHES THE AUDITED HASH'; assert.notEqual(sha(changed), c.source_body_sha256);
      const topic = await mkTopic(title, changed, orig.termLabel, 'stale ai summary');
      const list = await dapi('GET', '/topics?class_name=JSS%203'); const t = list.body.topics.find((x: any) => x.id === topic);
      assert.equal(t.source_reference, null); assert.ok(t.summary.startsWith(`${JSS3_WITHHELD_MARKER} ${c.id}`)); assert.equal(t.delivery_correction.status, 'withheld');
      const wire = JSON.stringify(t); assert.ok(!wire.includes('RE-IMPORTED') && !wire.includes('stale ai summary') && !wire.includes(lesson.title));
      prompts.length = 0; const done = await dapi('POST', `/topics/${topic}/complete`);
      assert.equal(done.status, 200); assert.equal(done.body.delivery_correction.status, 'withheld'); assert.equal(done.body.assessment_status, null); assert.equal(prompts.length, 0, 'no AI call');
      assert.ok(!done.body.summary.includes('RE-IMPORTED')); assert.equal((await one('SELECT count(*)::int n FROM topic_completions WHERE topic_id=$1', [topic])).n, 0);
      assert.equal((await one('SELECT generated_assessment_id g FROM topics WHERE id=$1', [topic])).g, null); assert.equal((await one('SELECT source_reference s FROM topics WHERE id=$1', [topic])).s, changed);
    });
  }
  test('identity scoping control: the V3 entries do not capture the same audited body in another class or school', () => {
    const orig = original.find(r => r.subjectName === 'Basic Science' && r.title === 'FAMILY TRAITS')!;
    const t = { school_code: SD, class_name: 'JSS 3', subject_name: 'Basic Science', term_label: orig.termLabel, title: 'FAMILY TRAITS', source_reference: orig.sourceReference };
    assert.equal(resolveDelivery(t)!.kind, 'corrected', 'control: the exact identity IS corrected');
    assert.equal(resolveDelivery({ ...t, class_name: 'JSS 1' }), null, 'other class untouched');
    assert.equal(resolveDelivery({ ...t, school_code: SC_B }), null, 'other school untouched');
  });
}
