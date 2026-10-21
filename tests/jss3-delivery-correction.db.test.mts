// Route-level tests for JSS3 delivery correction against a LOCAL Postgres (real express router, real SQL).
//   JSS3_DELIVERY_TEST_DATABASE_URL=postgres://postgres:pw@127.0.0.1:5432/f_test \
//   JSS3_CAPTURE_DIR=<capture_rows.py output> node --import tsx --test tests/jss3-delivery-correction.db.test.mts
// AI is a local stub (AI_AGENT_SERVICE_URL) that records every prompt, so tests can prove original text never reaches grounding.
// Everything lives under one throw-away school_code and is removed afterwards (residue asserted zero).
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import test, { after, before } from 'node:test';
import { fileURLToPath } from 'node:url';
import type { AddressInfo } from 'node:net';

const URL_ = process.env.JSS3_DELIVERY_TEST_DATABASE_URL; const CAP = process.env.JSS3_CAPTURE_DIR;
const here = path.dirname(fileURLToPath(import.meta.url));
if (!URL_ || !CAP || !existsSync(path.join(CAP, 'original-rows.json'))) {
  test('delivery-correction DB tests (skipped: set JSS3_DELIVERY_TEST_DATABASE_URL to a LOCAL Postgres and JSS3_CAPTURE_DIR)', { skip: true }, () => {});
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

  const { pool, query } = await import('../backend/src/db/pool.js');
  await import('express-async-errors');
  const { default: express } = await import('express');
  const { default: learningRouter } = await import('../backend/src/routes/learning.js');
  const { signAccess } = await import('../backend/src/utils/jwt.js');
  const { default: corrections } = await import('../backend/src/db/data/jss3DeliveryCorrections.json', { with: { type: 'json' } });
  const { resolveDelivery, JSS3_CORRECTION_MARKER } = await import('../backend/src/utils/jss3DeliveryCorrection.js');

  const SC = 'secondary'; // class/school identity is part of the match, so the fixtures must use the real pair; isolation is by unique subject/user/title prefix + exact cleanup
  const TAG = 'zz_fdelivery';
  const sha = (s: string) => createHash('sha256').update(s, 'utf8').digest('hex');
  const rows = JSON.parse(readFileSync(path.join(CAP, 'original-rows.json'), 'utf8')) as any[];
  const C = corrections as unknown as any[];
  const rowFor = (id: string) => { const c = C.find(x => x.id === id)!; return { c, r: rows.find(x => sha(x.sourceReference) === c.source_body_sha256)! }; };
  const created = { topics: [] as number[], assessments: [] as string[], subjects: [] as number[], users: [] as string[], students: [] as string[] };
  let server: any, base = '', token = '', studentId = '', subjectId = 0;
  const schemaSql = readFileSync(path.resolve(here, '../backend/schema.sql'), 'utf-8');

  const api = async (m: string, p: string, body?: unknown) => { const r = await fetch(base + '/learning' + p, { method: m, headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` }, body: body ? JSON.stringify(body) : undefined }); let j: any = null; try { j = await r.json(); } catch {} return { status: r.status, body: j }; };
  const mkTopic = async (title: string, source: string, o: { summary?: string | null; term?: string } = {}) => {
    const t = (await query(`INSERT INTO topics(school_code,subject_id,class_name,term_label,title,source_reference,summary) VALUES($1,$2,'JSS 3',$3,$4,$5,$6) RETURNING id`, [SC, subjectId, o.term ?? '1st Term', title, source, o.summary ?? null])).rows[0].id; created.topics.push(t); return t as number;
  };
  const mkLegacyAssessment = async (topicId: number, fingerprint: string | null = null) => {
    const a = (await query(`INSERT INTO assessments(school_code,subject_id,class_name,title,total_marks,status,content_fingerprint) VALUES($1,$2,'JSS 3',$3,2,'open',$4) RETURNING id`, [SC, subjectId, `${TAG} legacy`, fingerprint])).rows[0].id; created.assessments.push(a);
    for (let i = 0; i < 2; i++) { const q = (await query(`INSERT INTO questions(school_code,subject_id,class_name,type,stem,options,correct_keys,marks) VALUES($1,$2,'JSS 3','mcq',$3,$4,$5,1) RETURNING id`, [SC, subjectId, `${TAG} stale stem ${i}`, JSON.stringify([{ key: 'A', text: 'x' }, { key: 'B', text: 'y' }]), ['A']])).rows[0].id; await query('INSERT INTO assessment_questions(assessment_id,question_id,points,order_index) VALUES($1,$2,1,$3)', [a, q, i]); }
    await query('UPDATE topics SET generated_assessment_id=$1 WHERE id=$2', [a, topicId]); return a as string;
  };
  const one = async (sql: string, p: unknown[] = []) => (await query(sql, p)).rows[0];

  before(async () => {
    await query(schemaSql);
    // A previous aborted run must not leak: remove only rows carrying our tag.
    await query(`DELETE FROM topics WHERE title LIKE $1`, [`${TAG}%`]);
    subjectId = (await query(`INSERT INTO subjects(school_code,name) VALUES($1,$2) RETURNING id`, [SC, `${TAG}_subject`])).rows[0].id; created.subjects.push(subjectId);
    const u = (await query(`INSERT INTO users(username,password_hash,role,school_code,full_name) VALUES($1,'x','student',$2,$3) RETURNING id`, [`${TAG}_stu`, SC, `${TAG} student`])).rows[0].id; created.users.push(u);
    studentId = (await query(`INSERT INTO students(school_code,admission_number,full_name,class_name,user_id) VALUES($1,$2,$3,'JSS 3',$4) RETURNING id`, [SC, `${TAG}-1`, `${TAG} student`, u])).rows[0].id; created.students.push(studentId);
    token = signAccess({ id: u, username: `${TAG}_stu`, role: 'student', school_code: SC, assigned_class: null, assigned_subject_ids: [] });
    const app = express(); app.use(express.json()); app.use('/learning', learningRouter);
    server = app.listen(0, '127.0.0.1'); await new Promise(r => server.once('listening', r)); base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  });
  after(async () => {
    await new Promise(r => server?.close(r as any)); await new Promise(r => stub.close(r as any));
    await query('DELETE FROM submissions WHERE student_id=ANY($1)', [created.students]);
    await query('DELETE FROM topic_completions WHERE student_id=ANY($1)', [created.students]);
    await query('DELETE FROM topics WHERE id=ANY($1)', [created.topics]);
    await query(`DELETE FROM assessments WHERE subject_id=ANY($1)`, [created.subjects]);
    await query(`DELETE FROM questions WHERE subject_id=ANY($1)`, [created.subjects]);
    await query('DELETE FROM students WHERE id=ANY($1)', [created.students]); await query('DELETE FROM users WHERE id=ANY($1)', [created.users]); await query('DELETE FROM subjects WHERE id=ANY($1)', [created.subjects]);
    const left = { topics: (await one('SELECT count(*)::int n FROM topics WHERE id=ANY($1)', [created.topics])).n, assessments: (await one('SELECT count(*)::int n FROM assessments WHERE subject_id=ANY($1)', [created.subjects])).n, users: (await one('SELECT count(*)::int n FROM users WHERE id=ANY($1)', [created.users])).n };
    console.log('TEST-DATA CLEANUP COUNTS (rows remaining):', JSON.stringify(left)); await pool.end(); assert.deepEqual(left, { topics: 0, assessments: 0, users: 0 });
  });

  // One real correction per originating package, plus A's re-pointed Maths row.
  const SAMPLES = ['HOME-CHILD-CARE-CONTD-ORT-HONEY', C.find(c => c.package === 'A' && c.previous_source_body_sha256)!.id, C.find(c => c.package === 'D')!.id, C.find(c => c.package === 'E')!.id, ...C.filter(c => c.package === 'V3').map(c => c.id)];
  for (const id of SAMPLES) {
    test(`[${id}] old cache + direct assessment id cannot bypass corrected delivery; history preserved`, async () => {
      const { c, r } = rowFor(id); const body: string = r.sourceReference; const marker = body.replace(/\s+/g, ' ').trim().slice(0, 70);
      const topic = await mkTopic(r.title, body, { summary: 'OLD AI SUMMARY BUILT FROM UNSAFE TEXT', term: r.termLabel });
      // subject name drives the title fallback only; hash match works regardless. Align it anyway for realism:
      await query('UPDATE subjects SET name=$1 WHERE id=$2', [c.subject_name, subjectId]);
      const stale = await mkLegacyAssessment(topic, null);
      const sub = (await one(`INSERT INTO submissions(assessment_id,student_id,total_score) VALUES($1,$2,2) RETURNING id`, [stale, studentId])).id;
      await query(`INSERT INTO topic_completions(topic_id,student_id,passed,score_percent) VALUES($1,$2,true,100)`, [topic, studentId]);

      // 1. topic list: corrected text, original absent, stale link hidden
      const list = await api('GET', `/topics?class_name=${encodeURIComponent('JSS 3')}`); const t = list.body.topics.find((x: any) => x.id === topic);
      assert.ok(t.source_reference.startsWith(JSS3_CORRECTION_MARKER)); assert.ok(t.summary.startsWith(JSS3_CORRECTION_MARKER)); assert.equal(t.generated_assessment_id, null);
      assert.ok(!JSON.stringify(t).includes(marker), 'original text leaked in topic list'); assert.ok(!JSON.stringify(t).includes('OLD AI SUMMARY'));
      // 2. assessments list hides the stale open assessment; direct read and submit are refused; it is retired, not deleted
      const al = await api('GET', '/assessments'); assert.ok(!al.body.assessments.some((a: any) => a.id === stale), 'stale assessment listed');
      const readStale = await api('GET', `/assessments/${stale}/questions`); assert.equal(readStale.status, 403);
      const submitStale = await api('POST', `/assessments/${stale}/submit`, { answers: {} }); assert.equal(submitStale.status, 403);
      assert.equal((await one('SELECT status FROM assessments WHERE id=$1', [stale])).status, 'closed');
      assert.equal((await one('SELECT generated_assessment_id g FROM topics WHERE id=$1', [topic])).g, null);
      // 3. history intact
      assert.equal((await one('SELECT count(*)::int n FROM submissions WHERE id=$1', [sub])).n, 1);
      assert.equal((await one('SELECT passed FROM topic_completions WHERE topic_id=$1 AND student_id=$2', [topic, studentId])).passed, true);
      assert.equal((await one('SELECT count(*)::int n FROM assessment_questions WHERE assessment_id=$1', [stale])).n, 2);
      // 4. completion path: corrected grounding only
      prompts.length = 0; const done = await api('POST', `/topics/${topic}/complete`);
      assert.equal(done.status, 200); assert.ok(done.body.summary.startsWith(JSS3_CORRECTION_MARKER)); assert.equal(done.body.delivery_correction.status, 'corrected');
      assert.ok(prompts.length >= 2, 'practice + assessment prompts expected'); for (const p of prompts) { assert.ok(!p.includes(marker), 'original text reached AI grounding'); assert.ok(p.includes(JSS3_CORRECTION_MARKER)); }
      const fp = resolveDelivery({ school_code: SC, class_name: 'JSS 3', subject_name: c.subject_name, term_label: r.termLabel, title: r.title, source_reference: body })!.fingerprint;
      const link = await one(`SELECT a.id, a.status, a.content_fingerprint FROM topics t JOIN assessments a ON a.id=t.generated_assessment_id WHERE t.id=$1`, [topic]);
      assert.equal(link.status, 'open'); assert.equal(link.content_fingerprint, fp); assert.notEqual(link.id, stale);
      assert.equal((await api('GET', `/assessments/${link.id}/questions`)).status, 200);
      // 5. repeat completion reuses the one assessment
      await api('POST', `/topics/${topic}/complete`); assert.equal((await one(`SELECT count(*)::int n FROM assessments WHERE title LIKE $1 AND status='open'`, [`${r.title}%`])).n, 1);
      // 6. an open assessment with a WRONG fingerprint linked later is rejected by id even though status is open
      const forged = await mkLegacyAssessment(topic, 'f'.repeat(64)); assert.equal((await api('GET', `/assessments/${forged}/questions`)).status, 403);
      assert.equal((await api('POST', `/assessments/${forged}/submit`, { answers: {} })).status, 403);
    });
  }

  test('FIRST contact by direct submission (no prior read/list/complete) is refused even though the stale assessment is still open', async () => {
    for (const fp of [null, 'e'.repeat(64)]) {
      const { c, r } = rowFor(SAMPLES[0]); await query('UPDATE subjects SET name=$1 WHERE id=$2', [c.subject_name, subjectId]);
      const topic = await mkTopic(r.title, r.sourceReference, { term: r.termLabel }); const stale = await mkLegacyAssessment(topic, fp);
      assert.equal((await one('SELECT status FROM assessments WHERE id=$1', [stale])).status, 'open');
      const before = (await one('SELECT count(*)::int n FROM submissions WHERE assessment_id=$1', [stale])).n;
      const res = await api('POST', `/assessments/${stale}/submit`, { answers: {} });
      assert.equal(res.status, 403, `fingerprint ${fp}`); assert.match(res.body.error, /withdrawn/);
      assert.equal((await one('SELECT count(*)::int n FROM submissions WHERE assessment_id=$1', [stale])).n, before, 'no submission may be recorded');
      assert.equal((await one('SELECT passed FROM topic_completions WHERE topic_id=$1', [topic]))?.passed ?? null, null, 'no pass recorded for a withdrawn assessment');
    }
  });

  test('concurrent first completions of a corrected topic create exactly one open linked assessment', async () => {
    const { c, r } = rowFor(SAMPLES[0]); await query('UPDATE subjects SET name=$1 WHERE id=$2', [c.subject_name, subjectId]);
    const topic = await mkTopic(r.title, r.sourceReference, { term: r.termLabel });
    const openCount = async () => (await one(`SELECT count(*)::int n FROM assessments WHERE subject_id=$1 AND title=$2 AND status='open'`, [subjectId, `${r.title} — Topic Assessment`])).n;
    const before = await openCount(); // earlier tests in this file leave their own open assessment under the same title
    const res = await Promise.all([1, 2, 3, 4].map(() => api('POST', `/topics/${topic}/complete`))); assert.ok(res.every(x => x.status === 200));
    const linked = (await one('SELECT generated_assessment_id g FROM topics WHERE id=$1', [topic])).g;
    assert.equal(await openCount() - before, 1, 'duplicate open assessments'); assert.equal((await one('SELECT status FROM assessments WHERE id=$1', [linked])).status, 'open');
  });

  test('changed-source topic with a known audited title is WITHHELD: no teaching, no AI call, no assessment, no completion row', async () => {
    const { c, r } = rowFor(SAMPLES[0]); await query('UPDATE subjects SET name=$1 WHERE id=$2', [c.subject_name, subjectId]);
    const topic = await mkTopic(r.title, 'RE-IMPORTED TEXT THAT NO LONGER MATCHES THE AUDITED HASH', { term: r.termLabel, summary: 'stale ai summary' });
    const stale = await mkLegacyAssessment(topic, null); prompts.length = 0;
    const done = await api('POST', `/topics/${topic}/complete`); assert.equal(done.status, 200); assert.equal(done.body.delivery_correction.status, 'withheld'); assert.equal(prompts.length, 0);
    assert.equal(done.body.assessment_status, null); assert.ok(!done.body.summary.includes('RE-IMPORTED'));
    assert.equal((await one('SELECT count(*)::int n FROM topic_completions WHERE topic_id=$1', [topic])).n, 0);
    assert.equal((await one('SELECT status FROM assessments WHERE id=$1', [stale])).status, 'closed');
    const t = (await api('GET', '/topics?class_name=JSS%203')).body.topics.find((x: any) => x.id === topic); assert.equal(t.source_reference, null);
  });

  test('negative control: an uncorrected topic keeps normal AI summary + assessment, null fingerprint, untouched legacy assessment', async () => {
    await query('UPDATE subjects SET name=$1 WHERE id=$2', ['Mathematics', subjectId]);
    const topic = await mkTopic(`${TAG} ordinary topic`, 'Perfectly ordinary lesson text.'); const legacy = await mkLegacyAssessment(topic, null);
    assert.equal((await api('GET', `/assessments/${legacy}/questions`)).status, 200, 'uncorrected legacy assessment must stay readable');
    const done = await api('POST', `/topics/${topic}/complete`); assert.equal(done.body.summary, 'AI STUDY NOTES (uncorrected topic)'); assert.equal(done.body.delivery_correction, undefined);
    assert.equal((await one('SELECT status FROM assessments WHERE id=$1', [legacy])).status, 'open');
    assert.equal((await one('SELECT generated_assessment_id g FROM topics WHERE id=$1', [topic])).g, legacy);
  });
}
