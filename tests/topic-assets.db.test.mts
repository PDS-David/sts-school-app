// Task 2 — live-database tests for lesson assets (topic_assets).
//
// Needs a LOCAL Postgres. Skipped unless TOPIC_ASSETS_TEST_DATABASE_URL is set,
// and it refuses any host that is not localhost (never point this at Render).
//   TOPIC_ASSETS_TEST_DATABASE_URL=postgres://postgres@127.0.0.1:54329/t2test \
//     node --import tsx --test tests/topic-assets.db.test.mts
// Optional: T2_REAL_ASSETS=<folder holding MUSIC_ASSET_MANIFEST.csv, TASK2_BT_ASSET_MANIFEST.csv,
//   music/ and bt/ (original media)> additionally attaches and byte-checks the REAL Task 2 assets.
//
// Everything this file creates lives under one throw-away school_code
// (TEST_SC) plus its users; the `after` hook deletes all of it and asserts
// that zero rows remain, printing the counts.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test, { after, before } from 'node:test';
import type { AddressInfo } from 'node:net';

const URL_ = process.env.TOPIC_ASSETS_TEST_DATABASE_URL;
const here = path.dirname(fileURLToPath(import.meta.url));
const REAL = process.env.T2_REAL_ASSETS;

if (!URL_) {
  test('topic assets DB tests (skipped: set TOPIC_ASSETS_TEST_DATABASE_URL to a LOCAL Postgres)', { skip: true }, () => {});
} else {
  const host = new URL(URL_).hostname;
  assert.ok(['localhost', '127.0.0.1', '::1', '[::1]'].includes(host), `refusing non-local database host: ${host}`);
  process.env.DATABASE_URL = URL_;
  process.env.NODE_ENV = 'development';

  const TEST_SC = 'zz_t2test';
  const sha = (b: Buffer) => createHash('sha256').update(b).digest('hex');

  // Tiny but signature-valid images.
  const PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64');
  const GIF = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');
  const JPG = Buffer.concat([Buffer.from([0xff, 0xd8, 0xff, 0xe0]), Buffer.from('synthetic-jpeg-body-for-signature-test'), Buffer.from([0xff, 0xd9])]);

  const { pool, query } = await import('../backend/src/db/pool.js');
  const attach = await import('../backend/src/db/attachTopicAssets.js');
  await import('express-async-errors');
  const { default: express } = await import('express');
  const { default: learningRouter } = await import('../backend/src/routes/learning.js');
  const { signAccess } = await import('../backend/src/utils/jwt.js');

  const work = mkdtempSync(path.join(tmpdir(), 't2assets-'));
  const created = { userIds: [] as string[], studentIds: [] as string[] };
  let server: ReturnType<ReturnType<typeof express>['listen']>;
  let base = '';
  let tokenA = '', tokenB = '';
  const topicId: Record<string, number> = {}; // "Music|2" → id
  let topicSnapshot: any[] = [];

  const schemaSql = readFileSync(path.resolve(here, '../backend/schema.sql'), 'utf-8');
  const count = async (sql: string, p: unknown[] = []) => Number((await query(sql, p)).rows[0].n);
  const assetRows = () => count('SELECT count(*) n FROM topic_assets a JOIN topics t ON t.id=a.topic_id WHERE t.school_code=$1', [TEST_SC]);

  const MUSIC = [[2, 'CONSTRUCTION OF SCALE A FLAT, D FLAT AND G FLAT'], [3, 'Minor, Augmented and Diminished interval'], [4, 'SIMPLE AND COMPOUND TIME'], [7, 'MELODY WRITING']] as const;
  const BT = [[12, 'basic Electronics'], [13, 'Components of electronics'], [15, 'machine motion']] as const;

  async function snapshot() {
    return (await query(
      `SELECT id, school_code, subject_id, class_name, term_label, order_index, title, description, summary, source_reference, source_file
         FROM topics WHERE school_code=$1 ORDER BY id`, [TEST_SC])).rows;
  }

  async function cleanup() {
    await query('DELETE FROM topics WHERE school_code=$1', [TEST_SC]);            // cascades topic_assets
    await query('DELETE FROM subjects WHERE school_code=$1', [TEST_SC]);
    await query('DELETE FROM students WHERE school_code=$1', [TEST_SC]);
    await query('DELETE FROM users WHERE school_code=$1 OR username LIKE $2', [TEST_SC, 'zz_t2test_%']);
    await query('DELETE FROM schools WHERE code=$1', [TEST_SC]);
  }

  async function residue() {
    return {
      topic_assets: await assetRows(),
      topics: await count('SELECT count(*) n FROM topics WHERE school_code=$1', [TEST_SC]),
      subjects: await count('SELECT count(*) n FROM subjects WHERE school_code=$1', [TEST_SC]),
      students: await count('SELECT count(*) n FROM students WHERE school_code=$1', [TEST_SC]),
      users: await count("SELECT count(*) n FROM users WHERE school_code=$1 OR username LIKE 'zz_t2test_%'", [TEST_SC]),
      schools: await count('SELECT count(*) n FROM schools WHERE code=$1', [TEST_SC]),
    };
  }

  before(async () => {
    // CI starts with an empty database; initialize before querying test residue.
    await query(schemaSql);
    await cleanup(); // clear any residue from an earlier aborted run
    // Same statement migrate.ts sends — run twice below in the first test.
    await query('INSERT INTO schools(code, name) VALUES($1,$2)', [TEST_SC, 'T2 TEST SCHOOL (delete me)']);
    const subj: Record<string, number> = {};
    for (const name of ['Music', 'Basic Technology']) {
      subj[name] = (await query('INSERT INTO subjects(school_code, name) VALUES($1,$2) RETURNING id', [TEST_SC, name])).rows[0].id;
    }
    const ins = async (subject: string, term: string, order: number, title: string) => {
      const r = await query(
        `INSERT INTO topics(school_code, subject_id, class_name, term_label, title, description, source_reference, source_file, order_index)
         VALUES($1,$2,'JSS 3',$3,$4,$5,$6,'t2-test.docx',$7) RETURNING id`,
        [TEST_SC, subj[subject], term, title, `LESSON TEXT ${title}`, `SOURCE ${title}`, order]);
      topicId[`${subject}|${order}`] = r.rows[0].id;
    };
    for (const [o, t] of MUSIC) await ins('Music', '1st Term', o, t);
    for (const [o, t] of BT) await ins('Basic Technology', '2nd Term', o, t);

    // Two students (login accounts): A is in JSS 3, B in JSS 1.
    const mk = async (tag: string, cls: string) => {
      const u = await query(
        `INSERT INTO users(username, password_hash, role, school_code, full_name) VALUES($1,'x','student',$2,$3) RETURNING id`,
        [`zz_t2test_${tag}`, TEST_SC, `T2 TEST ${tag}`]);
      created.userIds.push(u.rows[0].id);
      const s = await query(
        `INSERT INTO students(school_code, admission_number, full_name, class_name, user_id) VALUES($1,$2,$3,$4,$5) RETURNING id`,
        [TEST_SC, `ZZT2-${tag}`, `T2 TEST ${tag}`, cls, u.rows[0].id]);
      created.studentIds.push(s.rows[0].id);
      return signAccess({ id: u.rows[0].id, username: `zz_t2test_${tag}`, role: 'student', school_code: TEST_SC, assigned_class: null, assigned_subject_ids: [] });
    };
    tokenA = await mk('A', 'JSS 3');
    tokenB = await mk('B', 'JSS 1');
    topicSnapshot = await snapshot();

    const app = express();
    app.use(express.json());
    app.use('/learning', learningRouter);
    server = app.listen(0, '127.0.0.1');
    await new Promise((r) => server.once('listening', r));
    base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  });

  after(async () => {
    await new Promise((r) => server?.close(r as any));
    await cleanup();
    const left = await residue();
    console.log('TEST-DATA CLEANUP COUNTS (rows remaining):', JSON.stringify(left));
    // Reminder of what this run created, for the report.
    console.log(`TEST-DATA CREATED: 1 school, 2 subjects, ${MUSIC.length + BT.length} topics, ${created.userIds.length} users, ${created.studentIds.length} students, topic_assets rows (deleted by cascade)`);
    await pool.end();
    for (const [k, v] of Object.entries(left)) assert.equal(v, 0, `residue in ${k}`);
  });

  // ── helpers to write a synthetic manifest + files ──────────────────────────
  type Row = { key: string; file: string; bytes: Buffer; order: number; title: string; displayed?: boolean; caption?: string };
  function writeSet(name: string, rows: Row[], opts: { corruptHash?: string } = {}) {
    const dir = path.join(work, name); // asset dir
    const csv = ['asset_id,file,topic_order_index,expected_title,sha256,displayed,caption'];
    mkdirSync(dir, { recursive: true });
    for (const r of rows) {
      writeFileSync(path.join(dir, r.file), r.bytes);
      let h = sha(r.bytes);
      if (opts.corruptHash === r.key) h = (h[0] === 'a' ? 'b' : 'a') + h.slice(1);
      csv.push([r.key, r.file, r.order, `"${r.title}"`, h, r.displayed === false ? 'false' : 'true', r.caption ?? ''].join(','));
    }
    const manifest = path.join(work, `${name}.csv`);
    writeFileSync(manifest, csv.join('\n') + '\n');
    return { dir, manifest };
  }

  const music = (rows: Array<[string, number, Buffer, boolean?]>): Row[] =>
    rows.map(([key, order, bytes, displayed]) => ({
      key, file: `${key}.${bytes === GIF ? 'gif' : bytes === JPG ? 'jpg' : 'png'}`, bytes, order,
      title: MUSIC.find((m) => m[0] === order)![1], displayed,
    }));
  const SYN: Array<[string, number, Buffer, boolean?]> = [
    ['W2-1', 2, PNG], ['W2-2', 2, PNG], ['W3-1', 3, JPG], ['W4-1', 4, GIF], ['W4-4', 4, PNG, false], ['W7-1', 7, PNG],
  ];
  const opt = (apply: boolean, extra: Partial<import('../backend/src/db/attachTopicAssets.js').AttachOptions> = {}) =>
    ({ schoolCode: TEST_SC, subject: 'Music', className: 'JSS 3', termLabel: '1st Term', apply, skipTitleCheck: false, ...extra });
  const get = async (p: string, token?: string, headers: Record<string, string> = {}) =>
    fetch(`${base}${p}`, { headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}), ...headers } });

  // ── tests ──────────────────────────────────────────────────────────────────
  test('DDL: running schema.sql twice (as migrate.ts does) is idempotent', async () => {
    const tables = () => count("SELECT count(*) n FROM information_schema.tables WHERE table_schema='public'");
    await query(schemaSql);
    const t1 = await tables();
    await query(schemaSql);
    assert.equal(await tables(), t1, 'table count unchanged by a second run');
    assert.equal(await count("SELECT count(*) n FROM information_schema.tables WHERE table_name='topic_assets'"), 1);
    // Seeded topics survive a migration re-run unchanged.
    assert.deepEqual(await snapshot(), topicSnapshot);
  });

  test('attach: dry-run (default) writes nothing', async () => {
    const { dir, manifest } = writeSet('syn1', music(SYN));
    const assets = attach.prepareAssets(attach.loadManifest(manifest), dir);
    const r = await attach.attachAssets(assets, opt(false));
    assert.deepEqual(r, { planned: 6, inserted: 0, alreadyPresent: 0, metadataPlanned: 0, metadataUpdated: 0 });
    assert.equal(await assetRows(), 0);
  });

  test('attach: sha256 mismatch aborts the whole run with nothing written', async () => {
    const { dir, manifest } = writeSet('syn-bad', music(SYN), { corruptHash: 'W3-1' });
    assert.throws(() => attach.prepareAssets(attach.loadManifest(manifest), dir), /sha256 mismatch.*W3-1/s);
    assert.equal(await assetRows(), 0);
    // And a file whose bytes changed after the manifest was made:
    const good = writeSet('syn-tamper', music(SYN));
    writeFileSync(path.join(good.dir, 'W2-1.png'), Buffer.concat([PNG, Buffer.from([0])]));
    assert.throws(() => attach.prepareAssets(attach.loadManifest(good.manifest), good.dir), /sha256 mismatch.*W2-1/s);
    assert.equal(await assetRows(), 0);
  });

  test('attach: unknown topic fails loudly and writes nothing (even for the rows that did resolve)', async () => {
    const rows = music(SYN);
    rows.push({ key: 'W9-1', file: 'W9-1.png', bytes: PNG, order: 99, title: 'NO SUCH TOPIC' });
    const { dir, manifest } = writeSet('syn-missing', rows);
    const assets = attach.prepareAssets(attach.loadManifest(manifest), dir);
    await assert.rejects(attach.attachAssets(assets, opt(true)), /Topic not found.*order_index 99/);
    assert.equal(await assetRows(), 0);
  });

  test('attach: title guard stops a shifted order_index; --skip-title-check overrides', async () => {
    const rows = music([['W2-1', 2, PNG]]);
    rows[0].title = 'SOME OTHER LESSON';
    const { dir, manifest } = writeSet('syn-title', rows);
    const assets = attach.prepareAssets(attach.loadManifest(manifest), dir);
    await assert.rejects(attach.attachAssets(assets, opt(true)), /Title guard/);
    assert.equal(await assetRows(), 0);
    const r = await attach.attachAssets(assets, opt(false, { skipTitleCheck: true }));
    assert.equal(r.planned, 1); // dry run only
  });

  test('attach: --apply inserts once; a second --apply adds 0 rows (no duplicates)', async () => {
    const { dir, manifest } = writeSet('syn1', music(SYN));
    const assets = attach.prepareAssets(attach.loadManifest(manifest), dir);
    const first = await attach.attachAssets(assets, opt(true));
    assert.deepEqual(first, { planned: 6, inserted: 6, alreadyPresent: 0, metadataPlanned: 0, metadataUpdated: 0 });
    assert.equal(await assetRows(), 6);
    const second = await attach.attachAssets(assets, opt(true));
    assert.deepEqual(second, { planned: 0, inserted: 0, alreadyPresent: 6, metadataPlanned: 0, metadataUpdated: 0 });
    assert.equal(await assetRows(), 6);
    // third time, via a freshly parsed manifest, same result
    const third = await attach.attachAssets(attach.prepareAssets(attach.loadManifest(manifest), dir), opt(true));
    assert.equal(third.inserted, 0);
    assert.equal(await assetRows(), 6);
    assert.equal(await count('SELECT count(*) n FROM (SELECT topic_id, asset_key FROM topic_assets GROUP BY 1,2 HAVING count(*)>1) d'), 0);
  });

  test('attach: metadata changes require explicit permission, preview without writes, then update without changing bytes', async () => {
    const { dir, manifest } = writeSet('syn-meta', music(SYN));
    const assets = attach.prepareAssets(attach.loadManifest(manifest), dir);
    const original = assets.find(a => a.asset_key === 'W4-4')!;
    const changed = { ...original, displayed: true, caption: 'Reviewed caption', sort_order: 99 };
    const inspect = async () => (await query(
      'SELECT sha256, bytes, displayed, caption, sort_order FROM topic_assets WHERE topic_id=$1 AND asset_key=$2',
      [topicId['Music|4'], 'W4-4'],
    )).rows[0];
    const before = await inspect();
    await assert.rejects(attach.attachAssets([changed], opt(true)), /Metadata conflict/);
    assert.deepEqual(await inspect(), before);
    const dry = await attach.attachAssets([changed], opt(false, { updateMetadata: true }));
    assert.equal(dry.metadataPlanned, 1);
    assert.equal(dry.metadataUpdated, 0);
    assert.deepEqual(await inspect(), before);
    const applied = await attach.attachAssets([changed], opt(true, { updateMetadata: true }));
    assert.equal(applied.metadataUpdated, 1);
    assert.deepEqual(await inspect(), { ...before, displayed: true, caption: 'Reviewed caption', sort_order: 99 });
    assert.equal((await attach.attachAssets([changed], opt(true, { updateMetadata: true }))).metadataUpdated, 0);
    await attach.attachAssets([original], opt(true, { updateMetadata: true }));
    assert.deepEqual(await inspect(), before);
    assert.deepEqual(await snapshot(), topicSnapshot);
  });

  test('attach: same asset_key with different bytes is a conflict, never an overwrite', async () => {
    const rows = music([['W2-1', 2, JPG]]); // W2-1 already stored as PNG
    const { dir, manifest } = writeSet('syn-conflict', rows);
    const assets = attach.prepareAssets(attach.loadManifest(manifest), dir);
    await assert.rejects(attach.attachAssets(assets, opt(true)), /Conflict: W2-1/);
    assert.equal(await assetRows(), 6);
  });

  test('stored mime comes from the file signature, not the extension', async () => {
    const { rows } = await query(
      `SELECT a.asset_key, a.mime FROM topic_assets a JOIN topics t ON t.id=a.topic_id WHERE t.school_code=$1 ORDER BY a.asset_key`, [TEST_SC]);
    const m = Object.fromEntries(rows.map((r: any) => [r.asset_key, r.mime]));
    assert.equal(m['W2-1'], 'image/png'); assert.equal(m['W3-1'], 'image/jpeg'); assert.equal(m['W4-1'], 'image/gif');
  });

  test('endpoint: auth required; invalid ids rejected', async () => {
    assert.equal((await get(`/learning/topics/${topicId['Music|2']}/assets`)).status, 401);
    assert.equal((await get('/learning/topics/abc/assets', tokenA)).status, 400);
    assert.equal((await get('/learning/assets/abc', tokenA)).status, 400);
    assert.equal((await get('/learning/assets/0', tokenA)).status, 400);
  });

  test('endpoint: student in the right class sees ordered, displayed assets (metadata only, no bytes)', async () => {
    const r = await get(`/learning/topics/${topicId['Music|4']}/assets`, tokenA);
    assert.equal(r.status, 200);
    const body: any = await r.json();
    assert.deepEqual(body.assets.map((a: any) => a.asset_key), ['W4-1']); // W4-4 is displayed=false
    for (const a of body.assets) {
      assert.equal('bytes' in a, false);
      assert.match(a.url, /^\/learning\/assets\/\d+$/);
      assert.ok(a.sha256 && a.mime);
    }
    const two: any = await (await get(`/learning/topics/${topicId['Music|2']}/assets`, tokenA)).json();
    assert.deepEqual(two.assets.map((a: any) => a.asset_key), ['W2-1', 'W2-2']);
    const none: any = await (await get(`/learning/topics/${topicId['Basic Technology|12']}/assets`, tokenA)).json();
    assert.deepEqual(none.assets, []);
  });

  test('endpoint: bytes are identical to the source, with Content-Type and ETag; 304 on revalidation', async () => {
    const meta: any = await (await get(`/learning/topics/${topicId['Music|4']}/assets`, tokenA)).json();
    const a = meta.assets[0];
    const r = await get(a.url, tokenA);
    assert.equal(r.status, 200);
    assert.equal(r.headers.get('content-type'), 'image/gif');
    assert.equal(r.headers.get('etag'), `"${a.sha256}"`);
    assert.equal(r.headers.get('x-content-type-options'), 'nosniff');
    assert.equal(sha(Buffer.from(await r.arrayBuffer())), sha(GIF));
    const again = await get(a.url, tokenA, { 'If-None-Match': `"${a.sha256}"` });
    assert.equal(again.status, 304);
  });

  test('endpoint: a hidden (displayed=false) asset is not listed and not served', async () => {
    const id = (await query(`SELECT a.id FROM topic_assets a JOIN topics t ON t.id=a.topic_id WHERE t.school_code=$1 AND a.asset_key='W4-4'`, [TEST_SC])).rows[0].id;
    assert.equal((await get(`/learning/assets/${id}`, tokenA)).status, 404);
  });

  test('endpoint: a student in another class gets nothing (empty list / 404 bytes)', async () => {
    const list: any = await (await get(`/learning/topics/${topicId['Music|2']}/assets`, tokenB)).json();
    assert.deepEqual(list.assets, []);
    const id = (await query(`SELECT a.id FROM topic_assets a JOIN topics t ON t.id=a.topic_id WHERE t.school_code=$1 AND a.asset_key='W2-1'`, [TEST_SC])).rows[0].id;
    assert.equal((await get(`/learning/assets/${id}`, tokenA)).status, 200);
    assert.equal((await get(`/learning/assets/${id}`, tokenB)).status, 404);
  });

  test('endpoint: GET /learning/topics response shape is unchanged (no asset fields leak in)', async () => {
    const r = await get(`/learning/topics?school_code=${TEST_SC}`, tokenA);
    assert.equal(r.status, 200);
    const body: any = await r.json();
    assert.ok(body.topics.length >= 1);
    for (const t of body.topics) { assert.equal('bytes' in t, false); assert.equal('assets' in t, false); }
  });

  test('lesson text, provenance and order are unchanged after all attach operations', async () => {
    assert.deepEqual(await snapshot(), topicSnapshot);
  });

  test('deleting a topic cascades its assets', async () => {
    const before = await assetRows();
    const n = await count('SELECT count(*) n FROM topic_assets WHERE topic_id=$1', [topicId['Music|7']]);
    assert.equal(n, 1);
    await query('DELETE FROM topics WHERE id=$1', [topicId['Music|7']]);
    assert.equal(await assetRows(), before - 1);
  });

  // ── Real Task 2 assets (optional) ──────────────────────────────────────────
  test('REAL assets: music + basic-tech attach, byte-identical download, GIFs identical, idempotent', { skip: !REAL }, async () => {
    // Fresh topics for this check: the synthetic run above deleted Music|7.
    await query('DELETE FROM topic_assets WHERE topic_id IN (SELECT id FROM topics WHERE school_code=$1)', [TEST_SC]);
    const sid = (await query("SELECT id FROM subjects WHERE school_code=$1 AND name='Music'", [TEST_SC])).rows[0].id;
    const r7 = await query(
      `INSERT INTO topics(school_code, subject_id, class_name, term_label, title, description, source_reference, source_file, order_index)
       VALUES($1,$2,'JSS 3','1st Term','MELODY WRITING','LESSON TEXT MELODY WRITING','SOURCE MELODY WRITING','t2-test.docx',7) RETURNING id`, [TEST_SC, sid]);
    topicId['Music|7'] = r7.rows[0].id;
    topicSnapshot = await snapshot();

    const runs = [
      { manifest: 'MUSIC_ASSET_MANIFEST.csv', dir: 'music', subject: 'Music', term: '1st Term', expect: 16 },
      { manifest: 'TASK2_BT_ASSET_MANIFEST.csv', dir: 'bt', subject: 'Basic Technology', term: '2nd Term', expect: 13 },
    ];
    for (const run of runs) {
      const m = path.join(REAL!, run.manifest), d = path.join(REAL!, run.dir);
      const rows = attach.loadManifest(m);
      assert.equal(rows.length, run.expect);
      const assets = attach.prepareAssets(rows, d);
      const o = { schoolCode: TEST_SC, subject: run.subject, className: 'JSS 3', termLabel: run.term, skipTitleCheck: false };
      const dry = await attach.attachAssets(assets, { ...o, apply: false });
      assert.equal(dry.planned, run.expect);
      const a1 = await attach.attachAssets(assets, { ...o, apply: true });
      assert.equal(a1.inserted, run.expect);
      const a2 = await attach.attachAssets(assets, { ...o, apply: true });
      assert.equal(a2.inserted, 0, 'second apply adds 0 rows');
    }
    // Download every displayed asset as the right student; each must equal its manifest hash byte-for-byte.
    let checked = 0, gifs = 0;
    for (const run of runs) {
      const rows = attach.loadManifest(path.join(REAL!, run.manifest));
      for (const row of rows) {
        const key = `${run.subject}|${row.order_index}`;
        const list: any = await (await get(`/learning/topics/${topicId[key]}/assets`, tokenA)).json();
        const meta = list.assets.find((a: any) => a.asset_key === row.asset_key);
        if (!row.displayed) { assert.equal(meta, undefined, `${row.asset_key} hidden`); continue; }
        assert.ok(meta, `${row.asset_key} listed`);
        const buf = Buffer.from(await (await get(meta.url, tokenA)).arrayBuffer());
        assert.equal(sha(buf), row.sha256, `${row.asset_key} bytes identical to manifest`);
        assert.equal(sha(buf), sha(readFileSync(path.join(REAL!, run.dir, row.file))), `${row.asset_key} identical to file`);
        if (meta.mime === 'image/gif') gifs++;
        checked++;
      }
    }
    assert.equal(gifs, 3, 'three animated GIFs served byte-identical');
    // Display order within a topic follows the manifest.
    const mm: any = await (await get(`/learning/topics/${topicId['Basic Technology|15']}/assets`, tokenA)).json();
    assert.deepEqual(mm.assets.map((a: any) => a.asset_key), ['BT-08','BT-09','BT-10','BT-11','BT-12','BT-13','BT-14','BT-15','BT-16','BT-17']);
    console.log(`REAL ASSETS: ${checked} displayed assets downloaded byte-identical (${gifs} GIFs); hidden icon not served`);
    assert.deepEqual(await snapshot(), topicSnapshot, 'lesson rows unchanged by real attach');
    // The other-class student gets nothing for the real assets too.
    const other: any = await (await get(`/learning/topics/${topicId['Basic Technology|15']}/assets`, tokenB)).json();
    assert.deepEqual(other.assets, []);
  });
}
