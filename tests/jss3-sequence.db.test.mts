// Task 05 — real PostgreSQL + real Express learning router + real apply/rollback tool.
//   JSS3_SEQ_TEST_DATABASE_URL=postgres://postgres@127.0.0.1:55432/jss3_test_x node --import tsx --test tests/jss3-sequence.db.test.mts
// Skipped unless the variable names a LOCAL database. Everything lives under two throw-away school codes and is deleted afterwards.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test, { after, before } from 'node:test';
import type { AddressInfo } from 'node:net';

const URL_ = process.env.JSS3_SEQ_TEST_DATABASE_URL ?? process.env.JSS3_LOCAL_TEST_DATABASE_URL;
const here = path.dirname(fileURLToPath(import.meta.url));

if (!URL_) {
  test('sequencing DB tests (skipped: set JSS3_SEQ_TEST_DATABASE_URL to a LOCAL disposable PostgreSQL)', { skip: true }, () => {});
} else {
  assert.ok(['localhost', '127.0.0.1', '::1', '[::1]'].includes(new URL(URL_).hostname), 'refusing non-local database host');
  assert.match(new URL(URL_).pathname, /^\/jss3_test_/, 'database name must be jss3_test_*');
  process.env.DATABASE_URL = URL_; process.env.NODE_ENV = 'development'; delete process.env.ANTHROPIC_API_KEY;

  const { pool, query } = await import('../backend/src/db/pool.js');
  const { applySequencePlan, rollbackSequencePlan } = await import('../backend/src/db/applyTopicSequence.js');
  const { JSS3_SUPPLEMENTS } = await import('../backend/src/db/jss3Supplements.js');
  const { supplementReference } = await import('../backend/src/db/jss3SupplementReference.js');
  const { validateSequencePlan } = await import('../backend/src/db/jss3SequencePlan.js');
  await import('express-async-errors');
  const { default: express } = await import('express');
  const { default: learningRouter } = await import('../backend/src/routes/learning.js');
  const { signAccess } = await import('../backend/src/utils/jwt.js');

  const SC = 'zz_seq_a', SC2 = 'zz_seq_b';
  const sups = JSS3_SUPPLEMENTS.filter(s => s.subjectName === 'English Language' && s.termLabel === '1st Term').slice(0, 3);
  const [S1, S2, S3] = sups;
  const OT = ['Orig One', 'Orig Two', 'Orig Three', 'Orig Four'];
  const ids: Record<string, Record<string, number>> = { [SC]: {}, [SC2]: {} };   // school → label → topic id
  const subj: Record<string, number> = {};
  const tok: Record<string, string> = {};
  const studentIds: Record<string, string> = {};
  let base = '', server: any;

  const plan = (school: string[] = [SC], extra: any[] = []) => validateSequencePlan({
    plan_version: 'TEST-PLAN-v1', policy: 'test policy (synthetic)', school_codes: school,
    placements: [
      { supplement_id: S1.id, status: 'APPROVED', after_original_order_index: 2, anchor_title: OT[1], approver: 'Test Teacher', approved_on: '2026-10-26', basis: 'synthetic test approval' },
      { supplement_id: S2.id, status: 'APPROVED', after_original_order_index: 2, anchor_title: OT[1], approver: 'Test Teacher', approved_on: '2026-10-26', basis: 'synthetic test approval' },
      { supplement_id: S3.id, status: 'PENDING' }, ...extra],
  });
  const q = (t: string, p?: unknown[]) => query(t, p as any[]);
  const rankOf = async (school: string, label: string) => (await q('SELECT sequence_rank FROM topics WHERE id=$1', [ids[school][label]])).rows[0].sequence_rank;
  const snap = async (school: string) => (await q(`SELECT id, order_index, title, source_reference, source_file, class_name, term_label FROM topics WHERE school_code=$1 ORDER BY id`, [school])).rows;
  const setPassed = async (user: string, labels: string[], passed = true, school = SC) => {
    await q('DELETE FROM topic_completions WHERE student_id=$1', [studentIds[user]]);
    for (const l of labels) await q('INSERT INTO topic_completions(topic_id, student_id, passed) VALUES($1,$2,$3)', [ids[school][l], studentIds[user], passed]);
  };
  const list = async (user: string) => {
    const r = await fetch(`${base}/learning/topics`, { headers: { Authorization: `Bearer ${tok[user]}` } });
    assert.equal(r.status, 200); return (await r.json()).topics as any[];
  };
  const lockMap = async (user: string, school = SC) => {
    const t = await list(user); const byId = new Map(t.map(x => [x.id, x]));
    return Object.fromEntries(Object.entries(ids[school]).map(([l, id]) => [l, byId.get(id)?.locked]));
  };
  const post = (user: string, school: string, label: string) =>
    fetch(`${base}/learning/topics/${ids[school][label]}/complete`, { method: 'POST', headers: { Authorization: `Bearer ${tok[user]}`, 'Content-Type': 'application/json' }, body: '{}' });
  const cleanup = async () => {
    for (const sc of [SC, SC2]) {
      await q('DELETE FROM topics WHERE school_code=$1', [sc]); await q('DELETE FROM subjects WHERE school_code=$1', [sc]);
      await q('DELETE FROM students WHERE school_code=$1', [sc]); await q('DELETE FROM users WHERE school_code=$1', [sc]); await q('DELETE FROM schools WHERE code=$1', [sc]);
    }
  };

  before(async () => {
    await q(readFileSync(path.resolve(here, '../backend/schema.sql'), 'utf8'));
    await cleanup();
    for (const sc of [SC, SC2]) {
      await q('INSERT INTO schools(code, name) VALUES($1,$2)', [sc, `SEQ TEST ${sc}`]);
      subj[sc] = (await q('INSERT INTO subjects(school_code, name) VALUES($1,$2) RETURNING id', [sc, 'English Language'])).rows[0].id;
      const ins = async (label: string, order: number | null, title: string, file: string, body: string, cls = 'JSS 3') => {
        ids[sc][label] = (await q(
          `INSERT INTO topics(school_code, subject_id, class_name, term_label, title, description, source_reference, source_file, order_index)
           VALUES($1,$2,$3,'1st Term',$4,$5,$6,$7,$8) RETURNING id`, [sc, subj[sc], cls, title, `d ${title}`, body, file, order])).rows[0].id;
      };
      for (let i = 0; i < 4; i++) await ins(`O${i + 1}`, i + 1, OT[i], 'orig.docx', `ORIGINAL BODY ${i + 1}`);
      for (const [i, s] of sups.entries()) await ins(`S${i + 1}`, 5 + i, s.title, `${s.id}.json`, supplementReference(s));
      await ins('MANUAL', null, 'Manual teacher topic', 'manual', 'manual body');
      await ins('JSS2', 1, 'Other class topic', 'orig.docx', 'jss2 body', 'JSS 2');
    }
    const mk = async (tag: string, school: string, cls: string) => {
      const u = (await q(`INSERT INTO users(username, password_hash, role, school_code, full_name) VALUES($1,'x','student',$2,$3) RETURNING id`, [`${school}_${tag}`, school, tag])).rows[0].id;
      studentIds[`${school}_${tag}`] = (await q(`INSERT INTO students(school_code, admission_number, full_name, class_name, user_id) VALUES($1,$2,$3,$4,$5) RETURNING id`, [school, `${school}-${tag}`, tag, cls, u])).rows[0].id;
      tok[`${school}_${tag}`] = signAccess({ id: u, username: `${school}_${tag}`, role: 'student', school_code: school, assigned_class: null, assigned_subject_ids: [] });
    };
    await mk('stu', SC, 'JSS 3'); await mk('j2', SC, 'JSS 2'); await mk('stu', SC2, 'JSS 3');
    const app = express(); app.use(express.json()); app.use('/learning', learningRouter);
    server = app.listen(0, '127.0.0.1'); await new Promise(r => server.once('listening', r));
    base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    process.env.TERM_PIN_ENFORCED = 'false';
  });
  after(async () => {
    await new Promise(r => server?.close(r as any));
    await cleanup();
    const left = (await q(`SELECT (SELECT count(*) FROM topics WHERE school_code LIKE 'zz_seq_%') t, (SELECT count(*) FROM users WHERE school_code LIKE 'zz_seq_%') u,
      (SELECT count(*) FROM topic_sequence_audit a WHERE NOT EXISTS (SELECT 1 FROM topics t WHERE t.id=a.topic_id)) a`)).rows[0];
    console.log('TEST-DATA RESIDUE', JSON.stringify(left)); await pool.end();
    assert.deepEqual([left.t, left.u, left.a].map(Number), [0, 0, 0]);
  });

  const CHAIN = ['O1', 'O2', 'O3', 'O4', 'S1', 'S2', 'S3'] as const;
  const openSet = (m: Record<string, boolean>) => Object.entries(m).filter(([l, v]) => v === false && l !== 'JSS2').map(([l]) => l).sort();

  test('pre-migration topics schema: list and direct completion keep legacy locks without sequence_rank', async () => {
    // Dedicated disposable test DB only. No placed ranks exist at this point.
    assert.equal((await q('SELECT count(*) n FROM topics WHERE sequence_rank IS NOT NULL')).rows[0].n, '0');
    process.env.TERM_PIN_ENFORCED = 'true';
    const before = await lockMap(`${SC}_stu`);
    await q('ALTER TABLE topics DROP COLUMN sequence_rank');
    try {
      assert.deepEqual(await lockMap(`${SC}_stu`), before, 'same lock state without the optional column');
      assert.equal((await post(`${SC}_stu`, SC, 'O1')).status, 403, 'missing PIN still blocks first topic');
      assert.equal((await post(`${SC}_stu`, SC, 'O2')).status, 403, 'failed predecessor still blocks direct access');
      process.env.TERM_PIN_ENFORCED = 'false';
      assert.equal((await lockMap(`${SC}_stu`)).O1, false, 'default free access remains available');
      assert.equal((await lockMap(`${SC}_stu`)).O2, true, 'no predecessor bypass');
    } finally {
      await q('ALTER TABLE topics ADD COLUMN IF NOT EXISTS sequence_rank NUMERIC(12,6)');
      process.env.TERM_PIN_ENFORCED = 'true';
    }
    assert.deepEqual(await lockMap(`${SC}_stu`), before, 'adding the nullable column alone changes no access');
  });

  test('M1 schema.sql twice is idempotent; sequence_rank NULL for every row; legacy order and locks before apply', async () => {
    await q(readFileSync(path.resolve(here, '../backend/schema.sql'), 'utf8'));
    assert.equal((await q('SELECT count(*) n FROM topics WHERE sequence_rank IS NOT NULL AND school_code LIKE $1', ['zz_seq_%'])).rows[0].n, '0');
    process.env.TERM_PIN_ENFORCED = 'true';
    const t = (await list(`${SC}_stu`)).filter(x => ids[SC].O1 === x.id || x.school_code === SC).filter(x => x.class_name === 'JSS 3' && x.order_index != null);
    assert.deepEqual(t.map(x => x.order_index), [1, 2, 3, 4, 5, 6, 7]);
    assert.ok(t.every(x => 'sequence_position' in x && 'is_sequence_first' in x));
  });
  test('A2/A3/A4 fresh student: PIN on+redeemed → only O1; PIN on+missing → O1 locked and direct POST 403; PIN off → O1 open', async () => {
    process.env.TERM_PIN_ENFORCED = 'true';
    await setPassed(`${SC}_stu`, []);
    assert.equal((await post(`${SC}_stu`, SC, 'O1')).status, 403);
    await q(`INSERT INTO term_access_pins(student_id, term_label, pin, redeemed_at) VALUES($1,'1st Term','123456',now()) ON CONFLICT DO NOTHING`, [studentIds[`${SC}_stu`]]);
    const m = await lockMap(`${SC}_stu`);
    assert.deepEqual(CHAIN.filter(l => m[l] === false), ['O1']);
    assert.notEqual((await post(`${SC}_stu`, SC, 'O1')).status, 403);
    await q('DELETE FROM term_access_pins WHERE student_id=$1', [studentIds[`${SC}_stu`]]);
    await setPassed(`${SC}_stu`, []);
    process.env.TERM_PIN_ENFORCED = 'false';
    assert.equal((await lockMap(`${SC}_stu`)).O1, false);
  });

  let before_: any[] = [];
  test('M2/U1 dry-run writes nothing; every invalid plan aborts before any write', async () => {
    before_ = await snap(SC);
    const r = await applySequencePlan(q, plan(), { schoolCode: SC, apply: false });
    assert.equal(r.dryRun, true); assert.equal(r.changes.length, 2); assert.equal(r.written, 0);
    assert.deepEqual(r.changes.map(c => c.new_rank), [2.001, 2.002]);
    assert.equal((await q('SELECT count(*) n FROM topics WHERE sequence_rank IS NOT NULL AND school_code=$1', [SC])).rows[0].n, '0');
    const reject = async (p: any, school = SC, re?: RegExp) => { await assert.rejects(applySequencePlan(q, p, { schoolCode: school, apply: true }), re);
      assert.equal((await q('SELECT count(*) n FROM topics WHERE sequence_rank IS NOT NULL AND school_code IN ($1,$2)', [SC, SC2])).rows[0].n, '0'); };
    await reject(plan(), SC2, /not named in plan\.school_codes/);                      // wrong school
    await reject(plan([]), SC, /not named/);                                           // empty school list (D6 unnamed)
    await reject(plan([SC], [{ supplement_id: JSS3_SUPPLEMENTS[5].id, status: 'APPROVED', after_original_order_index: 1, anchor_title: OT[0], approver: 'Test Teacher', approved_on: '2026-10-26', basis: 'synthetic test approval' }]), SC, /expected exactly one supplement row/); // supplement absent in school
    const bad = (k: number, title: string) => ({ ...plan().placements[0], after_original_order_index: k, anchor_title: title });
    for (const [k, title, re] of [[2, 'Wrong title', /anchor title mismatch/], [5, 'x', /not an original/], [9, 'x', /not an original/]] as const)
      await reject(validateSequencePlan({ ...plan(), placements: [bad(k, title)] }), SC, re);
    await q('UPDATE topics SET title=$1 WHERE id=$2', ['Changed title', ids[SC].S1]);
    await reject(plan(), SC, /stored title differs/);
    await q('UPDATE topics SET title=$1 WHERE id=$2', [S1.title, ids[SC].S1]);
    await q('UPDATE topics SET source_reference=source_reference||$1 WHERE id=$2', ['!', ids[SC].S2]);
    await reject(plan(), SC, /stored body differs/);
    await q('UPDATE topics SET source_reference=$1 WHERE id=$2', [supplementReference(S2), ids[SC].S2]);
    assert.deepEqual(await snap(SC), before_);
  });

  test('M3/M4/M7 apply writes only approved ranks + audit; repeat is a no-op; originals/bodies/ids unchanged; pending stays NULL', async () => {
    const r = await applySequencePlan(q, plan(), { schoolCode: SC, apply: true });
    assert.equal(r.written, 2);
    const after = await snap(SC);
    assert.deepEqual(after, before_, 'order_index/title/body/ids identical');
    assert.equal(await rankOf(SC, 'S1'), '2.001000'); assert.equal(await rankOf(SC, 'S2'), '2.002000');
    for (const l of ['O1', 'O2', 'O3', 'O4', 'S3', 'MANUAL', 'JSS2']) assert.equal(await rankOf(SC, l), null, l);
    assert.equal(await rankOf(SC2, 'S1'), null, 'other school untouched');
    const again = await applySequencePlan(q, plan(), { schoolCode: SC, apply: true });
    assert.equal(again.written, 0); assert.ok(again.changes.every(c => c.noop));
    assert.equal((await q('SELECT count(*) n FROM topic_sequence_audit WHERE school_code=$1', [SC])).rows[0].n, '2');
  });

  test('A1 list order and sequence metadata: O1 O2 S1 S2 O3 O4 S3, manual topic last, first only O1, other class separate', async () => {
    const t = await list(`${SC}_stu`);
    const mine = t.filter(x => x.class_name === 'JSS 3' && x.order_index != null);
    assert.deepEqual(mine.map(x => x.id), ['O1', 'O2', 'S1', 'S2', 'O3', 'O4', 'S3'].map(l => ids[SC][l]));
    assert.deepEqual(mine.map(x => x.sequence_position), [1, 2, 3, 4, 5, 6, 7]);
    assert.deepEqual(mine.filter(x => x.is_sequence_first).map(x => x.id), [ids[SC].O1]);
    const manual = t.find(x => x.id === ids[SC].MANUAL);
    assert.equal(manual.locked, false); assert.equal(manual.sequence_position, null); assert.equal(manual.is_sequence_first, false);
    assert.equal(t[t.length - 1].id, ids[SC].MANUAL, 'manual (NULL order_index) topics stay last');
  });

  test('A5-A10 returning students: passed + open frontier stay open; failed predecessor locks; non-gating; GET equals direct POST for every state', async () => {
    process.env.TERM_PIN_ENFORCED = 'false';
    const U = `${SC}_stu`;
    const states: Array<[string, string[], boolean, string[]]> = [
      ['fresh', [], true, ['O1']],
      ['passed O1', ['O1'], true, ['O1', 'O2']],
      ['returning A (passed O1,O2; frontier O3)', ['O1', 'O2'], true, ['O1', 'O2', 'O3', 'S1', 'S2']],
      ['passed O1,O2,O3', ['O1', 'O2', 'O3'], true, ['O1', 'O2', 'O3', 'O4', 'S1', 'S2']],
      ['A + S1 passed: O3 unaffected, S2 still open', ['O1', 'O2', 'S1'], true, ['O1', 'O2', 'O3', 'S1', 'S2']],
      ['all originals', ['O1', 'O2', 'O3', 'O4'], true, ['O1', 'O2', 'O3', 'O4', 'S1', 'S2', 'S3']],
      ['failed O2 (passed=false)', ['O1'], true, ['O1', 'O2']],
    ];
    for (const [name, passed, pass, expectOpen] of states) {
      await setPassed(U, passed, pass);
      if (name.startsWith('failed')) await q('INSERT INTO topic_completions(topic_id, student_id, passed) VALUES($1,$2,false)', [ids[SC].O2, studentIds[U]]);
      const m = await lockMap(U);
      assert.deepEqual(CHAIN.filter(l => m[l] === false), expectOpen, name);
      for (const l of CHAIN) { // A10 parity: the direct route agrees with the list for locked topics
        const open = m[l] === false;
        if (!open) assert.equal((await post(U, SC, l)).status, 403, `${name}: POST ${l} must be 403`);
      }
    }
    // A11 legacy floor on an unreachable state: S3 passed while O4 not (S3 itself was never legacy-open, so only O4 is asserted); every topic open under today's rule stays open
    await setPassed(U, ['O1', 'O2', 'O3', 'S3'], true);
    const m = await lockMap(U); assert.equal(m.O4, false, 'legacy-open frontier stays open');
  });

  test('A9 wrong class / wrong school / cross-school id: direct POST rejected, as before', async () => {
    assert.equal((await post(`${SC}_j2`, SC, 'O1')).status, 403, 'JSS 2 student, JSS 3 topic');
    assert.equal((await post(`${SC2}_stu`, SC, 'O1')).status, 403, 'other school student, this school topic');
  });

  test('R1/R2 rollback is scoped: dry-run no-op; other school untouched; edited rank skipped; restores previous (NULL); GET equals pre-apply', async () => {
    await applySequencePlan(q, plan([SC, SC2]), { schoolCode: SC2, apply: true });
    assert.equal(await rankOf(SC2, 'S1'), '2.001000');
    const dry = await rollbackSequencePlan(q, { schoolCode: SC, planVersion: 'TEST-PLAN-v1', apply: false });
    assert.equal(dry.dryRun, true); assert.equal(dry.restored.length, 2);
    assert.equal(await rankOf(SC, 'S1'), '2.001000', 'dry run wrote nothing');
    await q('UPDATE topics SET sequence_rank=9.5 WHERE id=$1', [ids[SC].S2]);       // a later legitimate edit
    const r = await rollbackSequencePlan(q, { schoolCode: SC, planVersion: 'TEST-PLAN-v1', apply: true });
    assert.deepEqual(r.restored, [ids[SC].S1]); assert.deepEqual(r.skippedEdited, [ids[SC].S2]);
    assert.equal(await rankOf(SC, 'S1'), null); assert.equal(Number(await rankOf(SC, 'S2')), 9.5, 'edited rank preserved');
    assert.equal(await rankOf(SC2, 'S1'), '2.001000', 'other school unaffected');
    assert.equal((await rollbackSequencePlan(q, { schoolCode: SC, planVersion: 'OTHER-PLAN', apply: true })).restored.length, 0, 'other plan version untouched');
    await q('UPDATE topics SET sequence_rank=NULL WHERE id=$1', [ids[SC].S2]);
    await rollbackSequencePlan(q, { schoolCode: SC2, planVersion: 'TEST-PLAN-v1', apply: true });
    const t = (await list(`${SC}_stu`)).filter(x => x.class_name === 'JSS 3' && x.order_index != null);
    assert.deepEqual(t.map(x => x.order_index), [1, 2, 3, 4, 5, 6, 7], 'list order equals the pre-apply order');
    assert.deepEqual(await snap(SC), before_);
    assert.equal((await snap(SC2)).length, 9);
  });

  test('completions and assets are untouched by apply/rollback (counts and ids)', async () => {
    const c0 = (await q('SELECT count(*) n FROM topic_completions WHERE student_id=$1', [studentIds[`${SC}_stu`]])).rows[0].n;
    await applySequencePlan(q, plan(), { schoolCode: SC, apply: true });
    const rolled = await rollbackSequencePlan(q, { schoolCode: SC, planVersion: 'TEST-PLAN-v1', apply: true });
    assert.deepEqual([...rolled.restored].sort((a, b) => a - b), [ids[SC].S1, ids[SC].S2].sort((a, b) => a - b));
    assert.equal(await rankOf(SC, 'S1'), null);
    assert.equal(await rankOf(SC, 'S2'), null);
    // The skipped historical S2 audit from R1/R2 must neither cause a duplicate
    // update above nor resurface after the newest event has been rolled back.
    assert.equal((await rollbackSequencePlan(q, { schoolCode: SC, planVersion: 'TEST-PLAN-v1', apply: true })).restored.length, 0);
    await q('UPDATE topics SET sequence_rank=2.002 WHERE id=$1', [ids[SC].S2]);
    assert.equal((await rollbackSequencePlan(q, { schoolCode: SC, planVersion: 'TEST-PLAN-v1', apply: true })).restored.length, 0);
    assert.equal(await rankOf(SC, 'S2'), '2.002000', 'historical audit cannot overwrite a later edit');
    await q('UPDATE topics SET sequence_rank=NULL WHERE id=$1', [ids[SC].S2]);
    assert.equal((await q('SELECT count(*) n FROM topic_completions WHERE student_id=$1', [studentIds[`${SC}_stu`]])).rows[0].n, c0);
  });
}
