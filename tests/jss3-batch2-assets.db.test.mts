// Batch 2 F integration — REAL asset resolution against the combined importer capture.
// Needs a LOCAL Postgres (refuses non-local hosts) and JSS3_CAPTURE_DIR = capture_rows.py output of THIS tree.
//   JSS3_ASSET_TEST_DATABASE_URL=postgres://postgres:pw@127.0.0.1:5432/f_test JSS3_CAPTURE_DIR=/tmp/cap node --import tsx --test tests/jss3-batch2-assets.db.test.mts
// Loads every captured row (originals + supplements) as a topic in a throw-away school, then attaches EVERY JSS3 manifest
// (existing recovered Music 16, Basic Technology 13, three earlier supplement figures, A's shorthand chart, E's ten figures)
// through the real attachTopicAssets code with --apply semantics, title guards ON. Cleans up and proves zero residue.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test, { after, before } from 'node:test';

const URL_ = process.env.JSS3_ASSET_TEST_DATABASE_URL, CAP = process.env.JSS3_CAPTURE_DIR;
const here = path.dirname(fileURLToPath(import.meta.url)), root = path.resolve(here, '..');
if (!URL_ || !CAP) {
  test('batch2 real asset resolution (skipped: set JSS3_ASSET_TEST_DATABASE_URL to a LOCAL Postgres and JSS3_CAPTURE_DIR)', { skip: true }, () => {});
} else {
  assert.ok(['localhost', '127.0.0.1', '::1', '[::1]'].includes(new URL(URL_).hostname), 'refusing non-local database host');
  process.env.DATABASE_URL = URL_; process.env.NODE_ENV = 'development';
  const SC = 'zz_f_assets';
  const { query } = await import('../backend/src/db/pool.js');
  const attach = await import('../backend/src/db/attachTopicAssets.js');
  const rows: any[] = JSON.parse(readFileSync(path.join(CAP, 'supplemented-rows.json'), 'utf8'));
  const sha = (b: Buffer) => createHash('sha256').update(b).digest('hex');
  const A = path.join(root, 'curriculum-assets/jss3'), S = path.join(A, 'supplements');
  const manifests: Array<{ file: string; dir: string; subject?: string; term?: string }> = [
    { file: `${A}/MUSIC_ASSET_MANIFEST.csv`, dir: `${A}/music`, subject: 'Music', term: '1st Term' },
    { file: `${A}/TASK2_BT_ASSET_MANIFEST.csv`, dir: `${A}/bt`, subject: 'Basic Technology', term: '2nd Term' },
    ...readdirSync(S).filter(f => f.endsWith('_MANIFEST.csv')).sort().map(f => ({ file: `${S}/${f}`, dir: S })),
  ];
  const cleanup = async () => {
    await query('DELETE FROM topics WHERE school_code=$1', [SC]); await query('DELETE FROM subjects WHERE school_code=$1', [SC]); await query('DELETE FROM schools WHERE code=$1', [SC]);
  };
  before(async () => {
    await query(readFileSync(path.join(root, 'backend/schema.sql'), 'utf8')); await cleanup();
    await query('INSERT INTO schools(code,name) VALUES($1,$2)', [SC, 'F ASSET TEST (delete me)']);
    const subj: Record<string, number> = {};
    for (const r of rows) {
      subj[r.subjectName] ??= (await query('INSERT INTO subjects(school_code,name) VALUES($1,$2) RETURNING id', [SC, r.subjectName])).rows[0].id;
      await query(`INSERT INTO topics(school_code,subject_id,class_name,term_label,title,description,source_reference,source_file,order_index) VALUES($1,$2,$3,$4,$5,$6,$7,'f-test',$8)`,
        [SC, subj[r.subjectName], r.className, r.termLabel, r.title, `LESSON ${r.title}`, r.sourceReference, Number(r.orderIndex)]);
    }
  });
  after(async () => { await cleanup(); const n = (await query('SELECT (SELECT count(*) FROM topics WHERE school_code=$1) t,(SELECT count(*) FROM subjects WHERE school_code=$1) s,(SELECT count(*) FROM schools WHERE code=$1) c', [SC])).rows[0]; assert.deepEqual([+n.t, +n.s, +n.c], [0, 0, 0]); });

  const norm = (s: string) => s.replace(/\s+/g, ' ').trim().toLowerCase();
  test('every JSS3 manifest resolves to exactly one real topic with its title guard ON, and attaches byte-identically', async () => {
    let total = 0; const perTopic = new Map<string, string[]>();
    for (const m of manifests) {
      const prepared = attach.prepareAssets(attach.loadManifest(m.file), m.dir); // sha256 checked against bytes
      // group by (subject, term): given for the recovered manifests, resolved from the capture for supplement manifests
      const groups = new Map<string, typeof prepared>();
      for (const a of prepared) {
        let subject = m.subject, term = m.term;
        if (!subject) {
          const hit = rows.filter(r => r.className === 'JSS 3' && Number(r.orderIndex) === a.order_index && norm(r.title) === norm(a.expected_title ?? '\u0000'));
          assert.equal(hit.length, 1, `${a.asset_key}: title+order must identify exactly one captured row (got ${hit.length})`);
          subject = hit[0].subjectName; term = hit[0].termLabel;
        }
        const k = `${subject}|${term}`; groups.set(k, [...(groups.get(k) ?? []), a]);
      }
      for (const [k, items] of groups) {
        const [subject, term] = k.split('|');
        const r = await attach.attachAssets(items, { schoolCode: SC, subject, className: 'JSS 3', termLabel: term, apply: true, skipTitleCheck: false });
        assert.equal(r.inserted, items.length, `${m.file} ${k}`); total += items.length;
        for (const a of items) perTopic.set(`${k}|${a.order_index}`, [...(perTopic.get(`${k}|${a.order_index}`) ?? []), a.asset_key]);
      }
    }
    assert.equal(total, 16 + 13 + 3 + 11, 'recovered Music 16 + Basic Technology 13 + earlier supplement figures 3 + A 1 + E 10');
    assert.equal((await query('SELECT count(*)::int n FROM topic_assets a JOIN topics t ON t.id=a.topic_id WHERE t.school_code=$1', [SC])).rows[0].n, total);
  });

  test('stored bytes equal the committed files; new figures sit on SUPPLEMENT topics; earlier art is not overwritten', async () => {
    const db = (await query(`SELECT a.asset_key,a.sha256,a.bytes,a.mime,t.title,t.order_index,t.source_reference,s.name subject,t.term_label FROM topic_assets a JOIN topics t ON t.id=a.topic_id JOIN subjects s ON s.id=t.subject_id WHERE t.school_code=$1`, [SC])).rows;
    for (const r of db) { assert.equal(sha(r.bytes), r.sha256, r.asset_key); assert.ok(['image/png', 'image/jpeg', 'image/gif'].includes(r.mime), r.asset_key); }
    const byKey = Object.fromEntries(db.map((r: any) => [r.asset_key, r]));
    const sup = JSON.parse(readFileSync(path.join(root, 'backend/src/db/data/jss3Supplements.json'), 'utf8')) as any[];
    const ids = ['SUP-BUS-SHORTHAND-shorthand-compounds', 'SUP-MUSIC-HARMONIC-MINOR-harmonic-minor-d-e-g', 'SUP-MUSIC-RELATIVE-KEYS-key-signatures-sharps', 'SUP-MUSIC-RELATIVE-KEYS-key-signatures-flats', 'SUP-MUSIC-WORDS-MELODY-words-melody-example', 'SUP-MUSIC-CADENCES-cadences-c-major', 'SUP-MUSIC-STAFF-TO-SOLFA-staff-to-solfa-example', 'SUP-MUSIC-TRANSPOSE-DOMINANT-transposition-c-to-g', 'SUP-MUSIC-TRANSPOSE-DOMINANT-transposition-f-to-c', 'SUP-MUSIC-TRANSPOSE-DOMINANT-transposition-f-sharp-example', 'SUP-MUSIC-PRACTICAL-practical-model-melody'];
    for (const key of ids) {
      const r = byKey[key]; assert.ok(r, key);
      const lesson = sup.find(s => key.startsWith(s.id + '-'))!; assert.equal(r.title, lesson.title, key); assert.equal(r.subject, lesson.subjectName); assert.equal(r.term_label, lesson.termLabel);
      assert.ok(r.source_reference.includes(lesson.title), `${key} is on the supplement's own topic`);
    }
    // A's shorthand figure is NOT on the proofreading topic's slot (previously order 12), and the proofreading art is still there
    assert.notEqual(byKey['SUP-BUS-SHORTHAND-shorthand-compounds'].order_index, byKey['SUP-BUSINESS'].order_index);
    assert.equal(byKey['SUP-BUSINESS'].title, 'Proofreading and speed development');
    assert.ok(byKey['SUP-BASIC_TECH'] && byKey['SUP-MUSIC-TIME'] && db.filter((r: any) => /^W\d-/.test(r.asset_key)).length === 16 && db.filter((r: any) => /^BT-/.test(r.asset_key)).length === 13);
  });

  test('re-attaching is idempotent and a shifted order_index is refused by the title guard', async () => {
    const [m] = manifests.filter(x => x.file.endsWith('BATCH2_BUSINESS_2ND_MANIFEST.csv'));
    const items = attach.prepareAssets(attach.loadManifest(m.file), m.dir);
    const opt = { schoolCode: SC, subject: 'Business Studies', className: 'JSS 3', termLabel: '2nd Term', apply: true, skipTitleCheck: false };
    const again = await attach.attachAssets(items, opt); assert.equal(again.inserted, 0); assert.equal(again.alreadyPresent, items.length);
    await assert.rejects(attach.attachAssets(items.map(a => ({ ...a, order_index: a.order_index - 1 })), opt), /Title guard/);
  });
}
