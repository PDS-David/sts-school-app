// YO-LICENSE: attribution as actually delivered by the authenticated learner route, against a LOCAL PostgreSQL.
//   JSS3_YO_TEST_DATABASE_URL=postgres://postgres@127.0.0.1:55433/jss3_test_yo node --import tsx --test tests/jss3-yo-license.db.test.mts
// Synthetic topic rows carry the real lesson identity (subject/term/title) only; no lesson text is stored. One throw-away school; residue asserted zero.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import test, { after, before } from 'node:test';
import type { AddressInfo } from 'node:net';

const URL_ = process.env.JSS3_YO_TEST_DATABASE_URL;
const root = path.resolve(import.meta.dirname, '..');
if (!URL_) {
  test('YO-LICENSE route attribution (skipped: set JSS3_YO_TEST_DATABASE_URL to a LOCAL Postgres)', { skip: true }, () => {});
} else {
  assert.ok(['localhost', '127.0.0.1', '::1', '[::1]'].includes(new URL(URL_).hostname), 'refusing non-local database host');
  process.env.DATABASE_URL = URL_; process.env.NODE_ENV = 'development';
  const SC = 'zz_yo_license', sha = (b: Buffer) => createHash('sha256').update(b).digest('hex');
  const { pool, query } = await import('../backend/src/db/pool.js');
  const attach = await import('../backend/src/db/attachTopicAssets.js');
  await import('express-async-errors');
  const { default: express } = await import('express');
  const { default: learningRouter } = await import('../backend/src/routes/learning.js');
  const { signAccess } = await import('../backend/src/utils/jwt.js');
  const { JSS3_SUPPLEMENTS } = await import('../backend/src/db/jss3Supplements.js');
  const lesson = JSS3_SUPPLEMENTS.find(s => s.id === 'SUP-YO-ORAL-TEXTS')!;
  let server: any, base = '', tokA = '', tokB = '', topicId = 0, otherId = 0, subjectId = 0; const png = Buffer.from('89504e470d0a1a0a0000000d49484452', 'hex');
  const cleanup = async () => {
    await query('DELETE FROM topics WHERE school_code=$1', [SC]); await query('DELETE FROM subjects WHERE school_code=$1', [SC]); await query('DELETE FROM students WHERE school_code=$1', [SC]);
    await query("DELETE FROM users WHERE school_code=$1 OR username LIKE 'zz_yo_license_%'", [SC]); await query('DELETE FROM schools WHERE code=$1', [SC]);
  };
  const get = (p: string, tok?: string) => fetch(base + p, { headers: tok ? { Authorization: `Bearer ${tok}` } : {} });
  before(async () => {
    await query(readFileSync(path.join(root, 'backend/schema.sql'), 'utf8')); await cleanup();
    await query('INSERT INTO schools(code,name) VALUES($1,$2)', [SC, 'YO LICENSE TEST (delete me)']);
    subjectId = (await query('INSERT INTO subjects(school_code,name) VALUES($1,$2) RETURNING id', [SC, lesson.subjectName])).rows[0].id;
    const ins = async (title: string, term: string, cls: string, ord: number) => (await query(`INSERT INTO topics(school_code,subject_id,class_name,term_label,title,description,source_reference,source_file,order_index) VALUES($1,$2,$3,$4,$5,'x','SYNTHETIC; not lesson text','yo-test',$6) RETURNING id`, [SC, subjectId, cls, term, title, ord])).rows[0].id;
    const manifest=attach.loadManifest(path.join(root,'curriculum-assets/jss3/v4-attribution/NOUN_ATTRIBUTION_2ND_MANIFEST.csv'));
    topicId = await ins(lesson.title, lesson.termLabel, 'JSS 3', manifest[0].order_index); otherId = await ins('A different Yoruba lesson', lesson.termLabel, 'JSS 3', 15);
    const mk = async (tag: string, cls: string) => {
      const u = await query(`INSERT INTO users(username,password_hash,role,school_code,full_name) VALUES($1,'x','student',$2,$3) RETURNING id`, [`zz_yo_license_${tag}`, SC, `YO ${tag}`]);
      await query(`INSERT INTO students(school_code,admission_number,full_name,class_name,user_id) VALUES($1,$2,$3,$4,$5)`, [SC, `ZZYO-${tag}`, `YO ${tag}`, cls, u.rows[0].id]);
      return signAccess({ id: u.rows[0].id, username: `zz_yo_license_${tag}`, role: 'student', school_code: SC, assigned_class: null, assigned_subject_ids: [] });
    };
    tokA = await mk('A', 'JSS 3'); tokB = await mk('B', 'JSS 1');
    const app = express(); app.use(express.json()); app.use('/learning', learningRouter); server = app.listen(0, '127.0.0.1'); await new Promise(r => server.once('listening', r));
    base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  });
  after(async () => {
    await new Promise(r => server?.close(r)); await cleanup();
    const n = (await query('SELECT (SELECT count(*) FROM topics WHERE school_code=$1) t,(SELECT count(*) FROM subjects WHERE school_code=$1) s,(SELECT count(*) FROM users WHERE username LIKE $2) u,(SELECT count(*) FROM schools WHERE code=$1) c', [SC, 'zz_yo_license_%'])).rows[0];
    assert.deepEqual([n.t, n.s, n.u, n.c].map(Number), [0, 0, 0, 0], 'no residue'); await pool.end();
  });

  test('401 without a token; the JSS3 student receives the credit record with the lesson', async () => {
    assert.equal((await get(`/learning/topics/${topicId}/assets`)).status, 401);
    const r = await get(`/learning/topics/${topicId}/assets`, tokA); assert.equal(r.status, 200);
    const b: any = await r.json(); assert.deepEqual(b.assets, []); assert.equal(b.attributions.length, 1);
    const a = b.attributions[0]; assert.equal(a.supplement_id, 'SUP-YO-ORAL-TEXTS');
    const n = a.credits.find((c: any) => c.id === 'noun-eng105-m2');
    assert.equal(n.required_credit, 'First produced by the National Open University of Nigeria'); assert.equal(n.licence, 'CC BY-SA 4.0');
    assert.match(n.download_line, /nouonline\.net/); assert.deepEqual(n.visuals.map((v: any) => [v.role, v.displayed]), [['cover', false], ['logo', false]]);
    assert.ok(a.credits.some((c: any) => c.id === 'kolawole-2023'));
  });
  test('a different lesson, and a student of another class, get no credit record', async () => {
    assert.deepEqual(await (await get(`/learning/topics/${otherId}/assets`, tokA)).json(), { assets: [], attributions: [] });
    assert.deepEqual(await (await get(`/learning/topics/${topicId}/assets`, tokB)).json(), { assets: [], attributions: [] });
  });
  test('when cover and logo are attached through the real attach path, the route delivers them, their bytes, and marks them displayed', async () => {
    const dir=path.join(root,'curriculum-assets/jss3/v4-attribution');
    const assets=attach.prepareAssets(attach.loadManifest(path.join(dir,'NOUN_ATTRIBUTION_2ND_MANIFEST.csv')),dir);
    await attach.attachAssets(assets, { schoolCode: SC, subject: lesson.subjectName, className: 'JSS 3', termLabel: lesson.termLabel, apply: true, skipTitleCheck: false });
    const b: any = await (await get(`/learning/topics/${topicId}/assets`, tokA)).json();
    assert.deepEqual(b.assets.map((a: any) => a.asset_key), ['NOUN-ENG105-M2-COVER', 'NOUN-ENG105-M2-LOGO']);
    const n = b.attributions[0].credits.find((c: any) => c.id === 'noun-eng105-m2');
    assert.ok(n.visuals.every((v: any) => v.displayed), 'register marks both displayed once bound');
    const img = await get(b.assets[0].url, tokA); assert.equal(img.status, 200); assert.equal(sha(Buffer.from(await img.arrayBuffer())), sha(assets[0].bytes));
    assert.equal((await get(b.assets[0].url)).status, 401);
  });
}
