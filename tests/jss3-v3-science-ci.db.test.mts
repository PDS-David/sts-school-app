// CI: local PostgreSQL + canonical identity fixtures; set JSS3_CAPTURE_DIR for full real-source guard checks.
// V3 Basic Science figures — REAL resolution against the importer capture, through the real attach code and the real
// authenticated route. Needs a LOCAL Postgres and JSS3_CAPTURE_DIR (capture_rows.py output of THIS tree):
//   JSS3_V3_TEST_DATABASE_URL=postgres://postgres@127.0.0.1:55432/v2_test JSS3_CAPTURE_DIR=/tmp/cap node --import tsx --test tests/jss3-v2-math-assets.db.test.mts
// Everything lives under one throw-away school code; cleanup is asserted to leave zero residue.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test, { after, before } from 'node:test';
import type { AddressInfo } from 'node:net';

const URL_ = process.env.JSS3_V3_TEST_DATABASE_URL, CAP = process.env.JSS3_CAPTURE_DIR;
const root = path.resolve(import.meta.dirname, '..');
if (!URL_) {
  test('V3 Science real asset resolution (skipped: set JSS3_V3_TEST_DATABASE_URL to a LOCAL Postgres ; JSS3_CAPTURE_DIR additionally enables real source-body guards)', { skip: true }, () => {});
} else {
  assert.ok(['localhost', '127.0.0.1', '::1', '[::1]'].includes(new URL(URL_).hostname), 'refusing non-local database host');
  process.env.DATABASE_URL = URL_; process.env.NODE_ENV = 'development';
  const SC = 'zz_v3_science', sha = (b: Buffer) => createHash('sha256').update(b).digest('hex');
  const { pool, query } = await import('../backend/src/db/pool.js');
  const attach = await import('../backend/src/db/attachTopicAssets.js');
  await import('express-async-errors');
  const { default: express } = await import('express');
  const { default: learningRouter } = await import('../backend/src/routes/learning.js');
  const { signAccess } = await import('../backend/src/utils/jwt.js');
  const A = path.join(root, 'curriculum-assets/jss3/v3-science');
  const bindings: any[] = JSON.parse(readFileSync(path.join(A, 'V3_BINDINGS.json'), 'utf8'));
  // CI uses canonical binding identities and synthetic text. Real-source mode additionally proves body guards.
  const rows: any[] = CAP ? JSON.parse(readFileSync(path.join(CAP, 'supplemented-rows.json'), 'utf8')).filter((r: any) => r.subjectName === 'Basic Science')
    : [...new Map(bindings.map(b=>[`${b.term}|${b.order_index}`,{className:'JSS 3',subjectName:'Basic Science',termLabel:b.term,title:b.title,orderIndex:b.order_index,sourceReference:'SYNTHETIC DATABASE FIXTURE; not source content'}])).values()];
  const M: Record<string, string> = { '1st Term': 'V3_SCIENCE_1ST_MANIFEST.csv', '2nd Term': 'V3_SCIENCE_2ND_MANIFEST.csv' };
  const opt = (term: string, extra: object = {}) => ({ schoolCode: SC, subject: 'Basic Science', className: 'JSS 3', termLabel: term, apply: true, skipTitleCheck: false, ...extra });
  const prepared = (term: string, dir = A) => attach.prepareAssets(attach.loadManifest(path.join(dir, M[term])), dir);
  let server: any, base = '', tokenA = '', tokenB = ''; const userIds: string[] = [];
  const cleanup = async () => {
    await query('DELETE FROM topics WHERE school_code=$1', [SC]); await query('DELETE FROM subjects WHERE school_code=$1', [SC]); await query('DELETE FROM students WHERE school_code=$1', [SC]);
    await query("DELETE FROM users WHERE school_code=$1 OR username LIKE 'zz_v3_science_%'", [SC]); await query('DELETE FROM schools WHERE code=$1', [SC]);
  };
  const topics = async () => (await query('SELECT id,order_index,term_label,title,source_reference FROM topics WHERE school_code=$1 ORDER BY id', [SC])).rows;
  before(async () => {
    await query(readFileSync(path.join(root, 'backend/schema.sql'), 'utf8')); await cleanup();
    await query('INSERT INTO schools(code,name) VALUES($1,$2)', [SC, 'V3 SCIENCE TEST (delete me)']);
    const sid = (await query('INSERT INTO subjects(school_code,name) VALUES($1,$2) RETURNING id', [SC, 'Basic Science'])).rows[0].id;
    for (const r of rows) await query(`INSERT INTO topics(school_code,subject_id,class_name,term_label,title,description,source_reference,source_file,order_index) VALUES($1,$2,$3,$4,$5,$6,$7,'v3-test',$8)`, [SC, sid, r.className, r.termLabel, r.title, `LESSON ${r.title}`, r.sourceReference, Number(r.orderIndex)]);
    const mk = async (tag: string, cls: string) => {
      const u = await query(`INSERT INTO users(username,password_hash,role,school_code,full_name) VALUES($1,'x','student',$2,$3) RETURNING id`, [`zz_v3_science_${tag}`, SC, `V3 ${tag}`]); userIds.push(u.rows[0].id);
      await query(`INSERT INTO students(school_code,admission_number,full_name,class_name,user_id) VALUES($1,$2,$3,$4,$5)`, [SC, `ZZV3-${tag}`, `V3 ${tag}`, cls, u.rows[0].id]);
      return signAccess({ id: u.rows[0].id, username: `zz_v3_science_${tag}`, role: 'student', school_code: SC, assigned_class: null, assigned_subject_ids: [] });
    };
    tokenA = await mk('A', 'JSS 3'); tokenB = await mk('B', 'JSS 1');
    const app = express(); app.use(express.json()); app.use('/learning', learningRouter); server = app.listen(0, '127.0.0.1'); await new Promise(r => server.once('listening', r));
    base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  });
  after(async () => {
    await new Promise(r => server?.close(r)); await cleanup();
    const n = (await query('SELECT (SELECT count(*) FROM topics WHERE school_code=$1) t,(SELECT count(*) FROM subjects WHERE school_code=$1) s,(SELECT count(*) FROM users WHERE username LIKE $2) u,(SELECT count(*) FROM schools WHERE code=$1) c', [SC, 'zz_v3_science_%'])).rows[0];
    assert.deepEqual([n.t, n.s, n.u, n.c].map(Number), [0, 0, 0, 0], 'no residue'); await pool.end();
  });

  test('all manifest identities match the capture; when supplied, every real source-body guard matches', () => {
    for (const b of bindings) {
      const hit = rows.filter(r => r.termLabel===b.term && r.orderIndex===b.order_index && r.title===b.title);
      assert.equal(hit.length,1,b.asset_key);
      if (CAP) assert.equal(sha(Buffer.from(hit[0].sourceReference)),b.body_sha256,b.asset_key);
    }
    console.log(CAP ? 'V3 REAL CAPTURE GUARDS VERIFIED' : 'V3 SYNTHETIC IDENTITY FIXTURES: source-body evidence is separate');
  });
  test('dry run writes nothing, then 17 assets attach with identity guards; 13 displayed, four audit-only', async () => {
    const before = await topics(); let total = 0;
    for (const term of Object.keys(M)) {
      const items=prepared(term);await attach.attachAssets(items,opt(term,{apply:false}));
    }
    assert.equal(Number((await query('SELECT count(*) n FROM topic_assets a JOIN topics t ON t.id=a.topic_id WHERE t.school_code=$1',[SC])).rows[0].n),0);
    for (const term of Object.keys(M)) {const items=prepared(term);const r=await attach.attachAssets(items,opt(term));assert.equal(r.inserted,items.length);total+=items.length;}
    assert.equal(total,17);
    const db=(await query('SELECT a.*,t.title,t.term_label FROM topic_assets a JOIN topics t ON t.id=a.topic_id WHERE t.school_code=$1',[SC])).rows;
    assert.equal(db.length,17);assert.equal(db.filter(r=>r.displayed).length,13);
    for(const r of db){
      const a=prepared(r.term_label).find(x=>x.asset_key===r.asset_key)!;assert.ok(a);
      assert.equal(sha(r.bytes),a.sha256);assert.equal(r.mime,a.mime);assert.equal(r.alt_text,a.alt_text);assert.equal(r.caption,a.caption);assert.equal(r.title,a.expected_title);assert.equal(r.displayed,a.displayed);
    }
    assert.deepEqual(await topics(),before,'attachment does not modify lessons');
  });
  test('idempotent re-attach; metadata drift is refused, then applied only with --update-metadata; bytes never overwritten', async () => {
    const items = prepared('2nd Term'); const again = await attach.attachAssets(items, opt('2nd Term')); assert.equal(again.inserted, 0); assert.equal(again.alreadyPresent, items.length);
    const drift = items.map((a, i) => i === 0 ? { ...a, alt_text: a.alt_text + ' (edited)' } : a);
    await assert.rejects(attach.attachAssets(drift, opt('2nd Term')), /Metadata conflict/);
    const up = await attach.attachAssets(drift, opt('2nd Term', { updateMetadata: true })); assert.equal(up.metadataUpdated, 1);
    assert.match((await query('SELECT alt_text FROM topic_assets WHERE asset_key=$1', [items[0].asset_key])).rows[0].alt_text, /\(edited\)$/);
    await attach.attachAssets(items, opt('2nd Term', { updateMetadata: true })); // restore
    const tmp = mkdtempSync(path.join(tmpdir(), 'v3db-')); try {
      cpSync(A, tmp, { recursive: true }); const p = path.join(tmp, 'bs-prism-corrected.png'); const b = readFileSync(p); b[b.length - 30] ^= 0xff; writeFileSync(p, b);
      assert.throws(() => prepared('2nd Term', tmp), /sha256 mismatch/);
      const otherBytes = prepared('2nd Term').map(a => a.asset_key === 'BS-PRISM-CORRECTED' ? { ...a, bytes: b, sha256: sha(b) } : a);
      await assert.rejects(attach.attachAssets(otherBytes, opt('2nd Term')), /different sha256/);
    } finally { rmSync(tmp, { recursive: true, force: true }); }
  });
  test('wrong-row rejection: a shifted order_index, a wrong title and a wrong term all fail before any write', async () => {
    const items = prepared('1st Term'); const n0 = Number((await query('SELECT count(*) n FROM topic_assets a JOIN topics t ON t.id=a.topic_id WHERE t.school_code=$1', [SC])).rows[0].n);
    await assert.rejects(attach.attachAssets(items.map(a => ({ ...a, order_index: a.order_index + 1, asset_key: a.asset_key + '-x' })), opt('1st Term')), /Title guard|Topic not found/);
    await assert.rejects(attach.attachAssets(items.map(a => ({ ...a, expected_title: 'NOT A SCIENCE LESSON', asset_key: a.asset_key + '-y' })), opt('1st Term')), /Title guard/);
    await assert.rejects(attach.attachAssets(prepared('2nd Term').map(a => ({ ...a, asset_key: a.asset_key + '-z' })), opt('1st Term')), /Title guard|Topic not found/);
    assert.equal(Number((await query('SELECT count(*) n FROM topic_assets a JOIN topics t ON t.id=a.topic_id WHERE t.school_code=$1', [SC])).rows[0].n), n0, 'nothing written');
  });
  test('authenticated routes return displayed metadata and exact bytes; hidden sources and cross-class requests cannot retrieve assets', async () => {
    const t=(await topics()).find((x:any)=>x.title==='LIGHT ENERGY')!;
    const get=(p:string,tok?:string)=>fetch(base+p,{headers:tok?{Authorization:`Bearer ${tok}`}:{}});
    assert.equal((await get(`/learning/topics/${t.id}/assets`)).status,401);
    const ok=await get(`/learning/topics/${t.id}/assets`,tokenA);assert.equal(ok.status,200);
    const body:any=await ok.json();assert.equal(body.assets.length,4);assert.ok(body.assets.every((a:any)=>a.alt_text&&a.caption));
    assert.ok(!body.assets.some((a:any)=>a.asset_key==='BS-PRISM-SOURCE'));
    const asset=body.assets.find((a:any)=>a.asset_key==='BS-PRISM-CORRECTED');assert.ok(asset);
    const img=await get(asset.url,tokenA);assert.equal(img.status,200);assert.equal(sha(Buffer.from(await img.arrayBuffer())),sha(readFileSync(path.join(A,'bs-prism-corrected.png'))));
    assert.equal((await get(asset.url)).status,401);
    const other:any=await (await get(`/learning/topics/${t.id}/assets`,tokenB)).json();assert.deepEqual(other.assets,[]);
    assert.notEqual((await get(asset.url,tokenB)).status,200);
    const hidden=(await query('SELECT a.id FROM topic_assets a JOIN topics t ON t.id=a.topic_id WHERE t.school_code=$1 AND a.asset_key=$2',[SC,'BS-PRISM-SOURCE'])).rows[0];
    assert.equal((await get(`/learning/assets/${hidden.id}`,tokenA)).status,404);
  });
}
