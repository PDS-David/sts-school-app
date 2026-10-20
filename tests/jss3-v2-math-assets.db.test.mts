// V2 Mathematics figures — REAL resolution against the importer capture, through the real attach code and the real
// authenticated route. Needs a LOCAL Postgres and JSS3_CAPTURE_DIR (capture_rows.py output of THIS tree):
//   JSS3_V2_TEST_DATABASE_URL=postgres://postgres@127.0.0.1:55432/v2_test JSS3_CAPTURE_DIR=/tmp/cap node --import tsx --test tests/jss3-v2-math-assets.db.test.mts
// Everything lives under one throw-away school code; cleanup is asserted to leave zero residue.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test, { after, before } from 'node:test';
import type { AddressInfo } from 'node:net';

const URL_ = process.env.JSS3_V2_TEST_DATABASE_URL, CAP = process.env.JSS3_CAPTURE_DIR;
const root = path.resolve(import.meta.dirname, '..');
if (!URL_ || !CAP) {
  test('V2 math real asset resolution (skipped: set JSS3_V2_TEST_DATABASE_URL to a LOCAL Postgres and JSS3_CAPTURE_DIR)', { skip: true }, () => {});
} else {
  assert.ok(['localhost', '127.0.0.1', '::1', '[::1]'].includes(new URL(URL_).hostname), 'refusing non-local database host');
  process.env.DATABASE_URL = URL_; process.env.NODE_ENV = 'development';
  const SC = 'zz_v2_math', sha = (b: Buffer) => createHash('sha256').update(b).digest('hex');
  const { query } = await import('../backend/src/db/pool.js');
  const attach = await import('../backend/src/db/attachTopicAssets.js');
  await import('express-async-errors');
  const { default: express } = await import('express');
  const { default: learningRouter } = await import('../backend/src/routes/learning.js');
  const { signAccess } = await import('../backend/src/utils/jwt.js');
  const A = path.join(root, 'curriculum-assets/jss3/v2-math');
  const rows: any[] = JSON.parse(readFileSync(path.join(CAP, 'supplemented-rows.json'), 'utf8')).filter((r: any) => r.subjectName === 'Mathematics');
  const guards = readFileSync(path.join(A, 'V2_MATH_ROW_GUARDS.csv'), 'utf8').trim().split('\n').slice(1).map(l => l.split(','));
  const M: Record<string, string> = { '1st Term': 'V2_MATH_1ST_MANIFEST.csv', '2nd Term': 'V2_MATH_2ND_MANIFEST.csv' };
  const opt = (term: string, extra: object = {}) => ({ schoolCode: SC, subject: 'Mathematics', className: 'JSS 3', termLabel: term, apply: true, skipTitleCheck: false, ...extra });
  const prepared = (term: string, dir = A) => attach.prepareAssets(attach.loadManifest(path.join(dir, M[term])), dir);
  let server: any, base = '', tokenA = '', tokenB = ''; const userIds: string[] = [];
  const cleanup = async () => {
    await query('DELETE FROM topics WHERE school_code=$1', [SC]); await query('DELETE FROM subjects WHERE school_code=$1', [SC]); await query('DELETE FROM students WHERE school_code=$1', [SC]);
    await query("DELETE FROM users WHERE school_code=$1 OR username LIKE 'zz_v2_math_%'", [SC]); await query('DELETE FROM schools WHERE code=$1', [SC]);
  };
  const topics = async () => (await query('SELECT id,order_index,term_label,title,source_reference FROM topics WHERE school_code=$1 ORDER BY id', [SC])).rows;
  before(async () => {
    await query(readFileSync(path.join(root, 'backend/schema.sql'), 'utf8')); await cleanup();
    await query('INSERT INTO schools(code,name) VALUES($1,$2)', [SC, 'V2 MATH TEST (delete me)']);
    const sid = (await query('INSERT INTO subjects(school_code,name) VALUES($1,$2) RETURNING id', [SC, 'Mathematics'])).rows[0].id;
    for (const r of rows) await query(`INSERT INTO topics(school_code,subject_id,class_name,term_label,title,description,source_reference,source_file,order_index) VALUES($1,$2,$3,$4,$5,$6,$7,'v2-test',$8)`, [SC, sid, r.className, r.termLabel, r.title, `LESSON ${r.title}`, r.sourceReference, Number(r.orderIndex)]);
    const mk = async (tag: string, cls: string) => {
      const u = await query(`INSERT INTO users(username,password_hash,role,school_code,full_name) VALUES($1,'x','student',$2,$3) RETURNING id`, [`zz_v2_math_${tag}`, SC, `V2 ${tag}`]); userIds.push(u.rows[0].id);
      await query(`INSERT INTO students(school_code,admission_number,full_name,class_name,user_id) VALUES($1,$2,$3,$4,$5)`, [SC, `ZZV2-${tag}`, `V2 ${tag}`, cls, u.rows[0].id]);
      return signAccess({ id: u.rows[0].id, username: `zz_v2_math_${tag}`, role: 'student', school_code: SC, assigned_class: null, assigned_subject_ids: [] });
    };
    tokenA = await mk('A', 'JSS 3'); tokenB = await mk('B', 'JSS 1');
    const app = express(); app.use(express.json()); app.use('/learning', learningRouter); server = app.listen(0, '127.0.0.1'); await new Promise(r => server.once('listening', r));
    base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  });
  after(async () => {
    await new Promise(r => server?.close(r)); await cleanup();
    const n = (await query('SELECT (SELECT count(*) FROM topics WHERE school_code=$1) t,(SELECT count(*) FROM subjects WHERE school_code=$1) s,(SELECT count(*) FROM users WHERE username LIKE $2) u,(SELECT count(*) FROM schools WHERE code=$1) c', [SC, 'zz_v2_math_%'])).rows[0];
    assert.deepEqual([n.t, n.s, n.u, n.c].map(Number), [0, 0, 0, 0], 'no residue');
  });

  test('guards file matches the captured ORIGINAL rows (title, order_index, body hash) — no drift since the manifests were built', () => {
    for (const [term, title, order, hash] of guards) {
      const hit = rows.filter(r => r.termLabel === term && r.title === title && !String(r.weekLabel).startsWith('SUPPLEMENT'));
      assert.equal(hit.length, 1, `${term}/${title}`); assert.equal(String(hit[0].orderIndex), order); assert.equal(sha(Buffer.from(hit[0].sourceReference)), hash, `${title} body changed`);
    }
  });
  test('all 18 assets attach with title guards ON to the intended original lessons, byte-identical, with caption and alt text stored', async () => {
    const before = await topics(); let total = 0;
    for (const term of Object.keys(M)) {
      const items = prepared(term); const r = await attach.attachAssets(items, opt(term)); assert.equal(r.inserted, items.length); total += items.length;
    }
    assert.equal(total, 18);
    const db = (await query(`SELECT a.asset_key,a.sha256,a.bytes,a.mime,a.caption,a.alt_text,a.displayed,t.title,t.term_label,t.order_index FROM topic_assets a JOIN topics t ON t.id=a.topic_id WHERE t.school_code=$1`, [SC])).rows;
    assert.equal(db.length, 18);
    for (const r of db) {
      assert.equal(sha(r.bytes), r.sha256, r.asset_key); assert.equal(r.mime, 'image/png'); assert.ok(r.displayed); assert.ok(r.alt_text.length >= 120 && r.caption.length > 20);
      const f = JSON.parse(readFileSync(path.join(root, 'scripts/jss3/v2/v2_math_figures.json'), 'utf8')).figures.find((x: any) => 'V2-MATH-' + x.id === r.asset_key);
      assert.equal(r.title, f.row_title); assert.equal(r.term_label, f.term); assert.equal(r.alt_text, f.alt_text);
      assert.equal(sha(readFileSync(path.join(A, f.file))), r.sha256);
    }
    assert.deepEqual(await topics(), before, 'lesson rows are untouched by attaching');
  });
  test('idempotent re-attach; metadata drift is refused, then applied only with --update-metadata; bytes never overwritten', async () => {
    const items = prepared('2nd Term'); const again = await attach.attachAssets(items, opt('2nd Term')); assert.equal(again.inserted, 0); assert.equal(again.alreadyPresent, items.length);
    const drift = items.map((a, i) => i === 0 ? { ...a, alt_text: a.alt_text + ' (edited)' } : a);
    await assert.rejects(attach.attachAssets(drift, opt('2nd Term')), /Metadata conflict/);
    const up = await attach.attachAssets(drift, opt('2nd Term', { updateMetadata: true })); assert.equal(up.metadataUpdated, 1);
    assert.match((await query('SELECT alt_text FROM topic_assets WHERE asset_key=$1', [items[0].asset_key])).rows[0].alt_text, /\(edited\)$/);
    await attach.attachAssets(items, opt('2nd Term', { updateMetadata: true })); // restore
    const tmp = mkdtempSync(path.join(tmpdir(), 'v2db-')); try {
      cpSync(A, tmp, { recursive: true }); const p = path.join(tmp, 'v2-m2-compass-eight-points.png'); const b = readFileSync(p); b[b.length - 30] ^= 0xff; writeFileSync(p, b);
      assert.throws(() => prepared('2nd Term', tmp), /sha256 mismatch/);
      const otherBytes = prepared('2nd Term').map(a => a.asset_key === 'V2-MATH-M2-F07' ? { ...a, bytes: b, sha256: sha(b) } : a);
      await assert.rejects(attach.attachAssets(otherBytes, opt('2nd Term')), /different sha256/);
    } finally { rmSync(tmp, { recursive: true, force: true }); }
  });
  test('wrong-row rejection: a shifted order_index, a wrong title and a wrong term all fail before any write', async () => {
    const items = prepared('1st Term'); const n0 = Number((await query('SELECT count(*) n FROM topic_assets a JOIN topics t ON t.id=a.topic_id WHERE t.school_code=$1', [SC])).rows[0].n);
    await assert.rejects(attach.attachAssets(items.map(a => ({ ...a, order_index: a.order_index + 1, asset_key: a.asset_key + '-x' })), opt('1st Term')), /Title guard|Topic not found/);
    await assert.rejects(attach.attachAssets(items.map(a => ({ ...a, expected_title: 'BEARINGS', asset_key: a.asset_key + '-y' })), opt('1st Term')), /Title guard/);
    await assert.rejects(attach.attachAssets(prepared('2nd Term').map(a => ({ ...a, asset_key: a.asset_key + '-z' })), opt('1st Term')), /Title guard|Topic not found/);
    assert.equal(Number((await query('SELECT count(*) n FROM topic_assets a JOIN topics t ON t.id=a.topic_id WHERE t.school_code=$1', [SC])).rows[0].n), n0, 'nothing written');
  });
  test('authenticated delivery through the existing route: JSS 3 student sees metadata and identical bytes; no token and other-class student do not', async () => {
    const t = (await topics()).find((x: any) => x.title === 'BEARINGS')!;
    const get = (p: string, tok?: string) => fetch(base + p, { headers: tok ? { Authorization: `Bearer ${tok}` } : {} });
    assert.equal((await get(`/learning/topics/${t.id}/assets`)).status, 401);
    const ok = await get(`/learning/topics/${t.id}/assets`, tokenA); assert.equal(ok.status, 200);
    const body: any = await ok.json(); assert.equal(body.assets.length, 3); assert.ok(body.assets.every((a: any) => a.alt_text && a.caption && a.url));
    const compass = body.assets.find((a: any) => a.asset_key === 'V2-MATH-M2-F07'); const img = await get(compass.url, tokenA); assert.equal(img.status, 200); assert.equal(img.headers.get('content-type'), 'image/png');
    assert.equal(sha(Buffer.from(await img.arrayBuffer())), JSON.parse(JSON.stringify(compass)).sha256 ?? (await query('SELECT sha256 FROM topic_assets WHERE asset_key=$1', ['V2-MATH-M2-F07'])).rows[0].sha256);
    assert.equal((await get(compass.url)).status, 401);
    const other: any = await (await get(`/learning/topics/${t.id}/assets`, tokenB)).json(); assert.deepEqual(other.assets, []);
  });
}
