// V1 Business: real attach into a throw-away school (LOCAL Postgres only) using the combined capture.
//   JSS3_ASSET_TEST_DATABASE_URL=postgres://postgres@127.0.0.1:5432/f_test JSS3_CAPTURE_DIR=<capture_rows.py output> node --import tsx --test tests/jss3-v1-business.db.test.mts
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test, { after, before } from 'node:test';

const URL_ = process.env.JSS3_ASSET_TEST_DATABASE_URL, CAP = process.env.JSS3_CAPTURE_DIR;
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
if (!URL_ || !CAP) {
  test('V1 Business DB checks (skipped: set JSS3_ASSET_TEST_DATABASE_URL to a LOCAL Postgres and JSS3_CAPTURE_DIR)', { skip: true }, () => {});
} else {
  assert.ok(['localhost', '127.0.0.1', '::1', '[::1]'].includes(new URL(URL_).hostname), 'refusing non-local database host');
  process.env.DATABASE_URL = URL_; process.env.NODE_ENV = 'development';
  const SC = 'zz_v1_business', S = path.join(root, 'curriculum-assets/jss3/supplements');
  const { query } = await import('../backend/src/db/pool.js');
  const attach = await import('../backend/src/db/attachTopicAssets.js');
  const rows: any[] = JSON.parse(readFileSync(path.join(CAP, 'supplemented-rows.json'), 'utf8')).filter((r: any) => r.subjectName === 'Business Studies');
  const spec: any[] = JSON.parse(readFileSync(path.join(root, 'docs/jss3/completion/V1_BUSINESS/V1_ASSET_SPEC.json'), 'utf8'));
  const cleanup = async () => { await query('DELETE FROM topics WHERE school_code=$1', [SC]); await query('DELETE FROM subjects WHERE school_code=$1', [SC]); await query('DELETE FROM schools WHERE code=$1', [SC]); };
  const MF = [['V1_BUSINESS_1ST_MANIFEST.csv', '1st Term'], ['V1_BUSINESS_2ND_MANIFEST.csv', '2nd Term']] as const;
  before(async () => {
    await query(readFileSync(path.join(root, 'backend/schema.sql'), 'utf8')); await cleanup();
    await query('INSERT INTO schools(code,name) VALUES($1,$2)', [SC, 'V1 BUSINESS TEST (delete me)']);
    const sid = (await query('INSERT INTO subjects(school_code,name) VALUES($1,$2) RETURNING id', [SC, 'Business Studies'])).rows[0].id;
    for (const r of rows) await query(`INSERT INTO topics(school_code,subject_id,class_name,term_label,title,description,source_reference,source_file,order_index) VALUES($1,$2,$3,$4,$5,$6,$7,'v1-test',$8)`,
      [SC, sid, r.className, r.termLabel, r.title, `LESSON ${r.title}`, r.sourceReference, Number(r.orderIndex)]);
  });
  after(async () => { await cleanup(); });
  const opts = (term: string, extra: any = {}) => ({ schoolCode: SC, subject: 'Business Studies', className: 'JSS 3', termLabel: term, apply: true, skipTitleCheck: false, ...extra });

  test('all 19 V1 assets attach to the intended lessons; bytes, MIME, caption and alt text are stored; order is stable', async () => {
    for (const [f, term] of MF) { const items = attach.prepareAssets(attach.loadManifest(path.join(S, f)), S); const r = await attach.attachAssets(items, opts(term)); assert.equal(r.inserted, items.length); }
    const db = (await query(`SELECT a.asset_key,a.sha256,a.bytes,a.mime,a.caption,a.alt_text,a.sort_order,t.title,t.term_label FROM topic_assets a JOIN topics t ON t.id=a.topic_id WHERE t.school_code=$1 AND a.asset_key LIKE ANY(ARRAY['V1-%','SUP-BUS-%-V1-%']) ORDER BY t.term_label,t.order_index,a.sort_order`, [SC])).rows;
    assert.equal(db.length, 19);
    for (const s of spec) {
      const r = db.find((x: any) => x.asset_key === s.asset_key); assert.ok(r, s.asset_key);
      assert.equal(createHash('sha256').update(r.bytes).digest('hex'), r.sha256);
      assert.equal(r.alt_text, s.alt_text); assert.equal(r.caption, s.caption); assert.equal(r.term_label, s.target.term);
      assert.equal(r.title, s.target.kind === 'original' ? s.target.title : rows.find((x: any) => x.weekLabel === 'SUPPLEMENT ' + s.target.lesson_id).title);
    }
    const de = db.filter((x: any) => x.title === 'DOUBLE ENTRY BOOK KEEPING').map((x: any) => x.asset_key);
    assert.deepEqual(de, spec.filter(s => s.target.title === 'DOUBLE ENTRY BOOK KEEPING').map(s => s.asset_key));
  });
  test('re-attach is idempotent; wrong row (shifted order_index) is refused by the title guard', async () => {
    const items = attach.prepareAssets(attach.loadManifest(path.join(S, MF[0][0])), S);
    const again = await attach.attachAssets(items, opts('1st Term')); assert.equal(again.inserted, 0); assert.equal(again.alreadyPresent, items.length);
    await assert.rejects(attach.attachAssets(items.map(a => ({ ...a, order_index: a.order_index + 1 })), opts('1st Term')), /Title guard/);
  });
  test('metadata drift (alt text changed) aborts without --update-metadata and leaves stored alt text untouched', async () => {
    const items = attach.prepareAssets(attach.loadManifest(path.join(S, MF[1][0])), S);
    await assert.rejects(attach.attachAssets(items.map((a, i) => i === 0 ? { ...a, alt_text: 'changed' } : a), opts('2nd Term')));
    const r = (await query(`SELECT alt_text FROM topic_assets a JOIN topics t ON t.id=a.topic_id WHERE t.school_code=$1 AND a.asset_key=$2`, [SC, items[0].asset_key])).rows[0];
    assert.equal(r.alt_text, items[0].alt_text);
  });
  test('a different sha256 under an existing key is refused (never silently overwritten)', async () => {
    const items = attach.prepareAssets(attach.loadManifest(path.join(S, MF[1][0])), S);
    await assert.rejects(attach.attachAssets([{ ...items[0], bytes: Buffer.concat([items[0].bytes, Buffer.from([1])]), sha256: 'f'.repeat(64) }, ...items.slice(1)], opts('2nd Term')));
  });
}
