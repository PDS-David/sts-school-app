import { Router } from 'express';
import { createHash } from 'node:crypto';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { query, withTransaction } from '../db/pool.js';
import {
  ingestionBatchSchema,
  questionBankRightsSchema,
  questionBankSourceBoardSchema,
  rightsGate,
} from '../utils/questionBankValidation.js';

const router = Router();
const router = Router();

// Subject-teacher review is intentionally separate from global question-bank
// administration. Teachers can review only subjects assigned to their account;
// they cannot ingest sources or change licensing metadata.
router.get('/review-queue', requireAuth, requireRole('teacher'), async (req, res) => {
  const { rows } = await query(`
    SELECT q.id,q.board,q.exam_year,q.paper,q.question_number,q.question_type,
           q.stem,q.options,q.correct_answer,q.explanation,q.marks,q.content_origin,
           q.rights_status,q.review_status,s.code AS subject_code,s.name AS subject,
           t.name AS topic,src.source_name,src.source_url,src.rights_evidence,
           (SELECT r.decision FROM question_bank_question_reviews r
             WHERE r.question_id=q.id AND r.reviewer_user_id=$1
             ORDER BY r.reviewed_at DESC LIMIT 1) AS my_decision,
           (SELECT r.notes FROM question_bank_question_reviews r
             WHERE r.question_id=q.id AND r.reviewer_user_id=$1
             ORDER BY r.reviewed_at DESC LIMIT 1) AS my_notes
      FROM question_bank_questions q
      JOIN question_bank_subjects s ON s.id=q.subject_id
      JOIN question_bank_topics t ON t.id=q.topic_id AND t.subject_id=q.subject_id
      JOIN question_bank_sources src ON src.id=q.source_id
     WHERE q.review_status='reviewed'
       AND EXISTS (
         SELECT 1 FROM teacher_subjects ts
         JOIN subjects assigned ON assigned.id=ts.subject_id
         WHERE ts.user_id=$1
           AND lower(trim(assigned.name))=lower(trim(s.name))
       )
     ORDER BY s.name,q.board,q.created_at
     LIMIT 200
  `, [req.user!.id]);
  return res.json({ questions: rows });
});

router.post('/questions/:id/review', requireAuth, requireRole('teacher'), async (req, res) => {
  const decision=req.body?.decision;
  const notes=typeof req.body?.notes==='string'?req.body.notes.trim():'';
  if(!['approved','rejected'].includes(decision)||notes.length<10||notes.length>2000)
    return res.status(400).json({error:'Provide an approve/reject decision and 10–2,000 characters of subject-review notes.'});
  const result=await withTransaction(async client=>{
    const {rows}=await client.query(
      'SELECT id,subject_id,review_status FROM question_bank_questions WHERE id=$1 FOR UPDATE',[req.params.id]);
    const question=rows[0];
    if(!question) return {status:404,error:'Question not found.'};
    if(question.review_status!=='reviewed') return {status:409,error:'Only reviewed draft questions can enter subject-teacher approval.'};
    const {rows:assigned}=await client.query(`
      SELECT 1 FROM teacher_subjects ts
      JOIN subjects assigned ON assigned.id=ts.subject_id
      JOIN question_bank_subjects qb ON lower(trim(qb.name))=lower(trim(assigned.name))
      WHERE ts.user_id=$1 AND qb.id=$2 LIMIT 1
    `,[req.user!.id,question.subject_id]);
    if(!assigned.length) return {status:403,error:'You are not assigned to this question-bank subject.'};
    await client.query(`
      INSERT INTO question_bank_question_reviews(question_id,subject_id,reviewer_user_id,decision,notes)
      VALUES($1,$2,$3,$4,$5)
    `,[question.id,question.subject_id,req.user!.id,decision,notes]);
    if(decision==='approved')
      await client.query("UPDATE question_bank_questions SET review_status='approved',updated_at=now() WHERE id=$1",[question.id]);
    return {status:200,question_id:question.id,decision,review_status:decision==='approved'?'approved':'reviewed'};
  });
  if('error' in result) return res.status(result.status).json({error:result.error});
  return res.json(result);
});

router.use(requireAuth, requireRole('admin'), (req, res, next) => {
  // The question bank is a global online-learning resource, not a school-scoped
  // physical assessment tool. Only global administrators may manage its corpus.
  if (req.user?.role !== 'admin' || req.user?.can_manage_all_schools !== true) {
    return res.status(403).json({ error: 'Only a global administrator can manage the online question bank.' });
  }
  next();
});

router.get('/summary', async (_req, res) => {
  const { rows } = await query(`
    SELECT
      (SELECT count(*)::int FROM question_bank_sources) AS sources,
      (SELECT count(*)::int FROM question_bank_questions) AS questions,
      (SELECT count(*)::int FROM question_bank_questions WHERE review_status='approved') AS approved_questions,
      (SELECT count(*)::int FROM question_bank_questions WHERE review_status='reviewed') AS reviewed_questions,
      (SELECT count(*)::int FROM question_bank_source_gaps WHERE gap_status <> 'resolved') AS open_source_gaps,
      (SELECT count(*)::int FROM question_bank_questions WHERE content_origin='past_question') AS licensed_past_questions
  `);
  return res.json({ summary: rows[0] });
});

router.get('/subjects', async (_req, res) => {
  const { rows } = await query(`
    SELECT s.id,s.code,s.name,
           COALESCE(jsonb_agg(jsonb_build_object('id',t.id,'slug',t.slug,'name',t.name)
             ORDER BY t.name) FILTER (WHERE t.id IS NOT NULL),'[]'::jsonb) AS topics
    FROM question_bank_subjects s
    LEFT JOIN question_bank_topics t ON t.subject_id=s.id
    GROUP BY s.id ORDER BY s.name
  `);
  return res.json({ subjects: rows });
});

router.get('/sources', async (_req, res) => {
  const { rows } = await query(`
    SELECT id,board,source_name,source_url,access_method,rights_status,
           rights_evidence,rights_checked_at,is_active,created_at
    FROM question_bank_sources ORDER BY board,source_name
  `);
  return res.json({ sources: rows });
});

router.post('/sources', async (req, res) => {
  const body = req.body ?? {};
  const board = questionBankSourceBoardSchema.safeParse(body.board);
  const rights = questionBankRightsSchema.safeParse(body.rights_status);
  const methods = ['official_portal','licensed_partner','author_uploaded','original_generated','other'];
  if (!board.success || !rights.success ||
      typeof body.source_name !== 'string' || !body.source_name.trim() || body.source_name.trim().length > 200 ||
      (body.source_url != null && (typeof body.source_url !== 'string' || body.source_url.length > 2000)) ||
      !methods.includes(body.access_method) ||
      typeof body.rights_evidence !== 'string' || body.rights_evidence.trim().length < 12) {
    return res.status(400).json({ error: 'Provide a valid board, source name, URL, access method, rights status and rights evidence.' });
  }
  const sourceUrl = typeof body.source_url === 'string' && body.source_url.trim() ? body.source_url.trim() : null;
  if (sourceUrl) {
    let parsed: URL;
    try { parsed = new URL(sourceUrl); } catch { return res.status(400).json({ error: 'source_url must be a valid HTTP(S) URL.' }); }
    if (!['http:', 'https:'].includes(parsed.protocol)) return res.status(400).json({ error: 'Only HTTP(S) source URLs are allowed.' });
  }
  if (['licensed','public_domain','original_generated'].includes(rights.data) && body.rights_evidence.trim().length < 12) {
    return res.status(400).json({ error: 'Reusable rights require evidence.' });
  }
  if (rights.data === 'original_generated' && (body.access_method !== 'original_generated' || board.data !== 'GENERAL')) {
    return res.status(400).json({ error: 'Original-generated sources must use access_method original_generated and board GENERAL.' });
  }
  const { rows } = await query(`
    INSERT INTO question_bank_sources(board,source_name,source_url,access_method,rights_status,rights_evidence,created_by)
    VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING id,board,source_name,source_url,access_method,rights_status,rights_evidence
  `, [board.data,body.source_name.trim(),sourceUrl,body.access_method,rights.data,body.rights_evidence.trim(),req.user!.id]);
  return res.status(201).json({ source: rows[0] });
});

router.get('/gaps', async (_req, res) => {
  const { rows } = await query(`
    SELECT g.id,g.board,g.gap_type,s.code AS subject_code,s.name AS subject,g.gap_status,
           g.reason,g.next_action,g.source_id,g.updated_at
    FROM question_bank_source_gaps g
    JOIN question_bank_subjects s ON s.id=g.subject_id
    ORDER BY g.board,s.name
  `);
  return res.json({ gaps: rows });
});

router.get('/questions', async (req, res) => {
  const board = typeof req.query.board === 'string' ? req.query.board : null;
  const subject = typeof req.query.subject_code === 'string' ? req.query.subject_code : null;
  const status = typeof req.query.review_status === 'string' ? req.query.review_status : null;
  const { rows } = await query(`
    SELECT q.id,q.board,q.exam_year,q.paper,q.question_number,q.question_type,
           q.stem,q.options,q.correct_answer,q.explanation,q.marks,q.content_origin,
           q.rights_status,q.review_status,s.code AS subject_code,s.name AS subject,
           t.slug AS topic_slug,t.name AS topic,src.source_name,src.source_url,
           src.rights_evidence
    FROM question_bank_questions q
    JOIN question_bank_subjects s ON s.id=q.subject_id
    JOIN question_bank_topics t ON t.id=q.topic_id AND t.subject_id=q.subject_id
    JOIN question_bank_sources src ON src.id=q.source_id
    WHERE ($1::text IS NULL OR q.board=$1)
      AND ($2::text IS NULL OR s.code=$2)
      AND ($3::text IS NULL OR q.review_status=$3)
    ORDER BY q.board,s.name,q.question_number
    LIMIT 500
  `, [board,subject,status]);
  return res.json({ questions: rows });
});

router.post('/ingest', async (req, res) => {
  const parsed = ingestionBatchSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid ingestion payload.', details: parsed.error.issues });
  }
  const payload = parsed.data;
  const payloadHash = createHash('sha256').update(JSON.stringify(payload.questions)).digest('hex');

  type IngestResult =
    | { ok: true; batch_id: string; imported_count: number; payload_sha256: string }
    | { ok: false; status: number; error: string };
  let result: IngestResult;
  try {
    result = await withTransaction(async client => {
    const { rows: sourceRows } = await client.query(
      'SELECT id,board,rights_status,rights_evidence,is_active FROM question_bank_sources WHERE id=$1 FOR SHARE',
      [payload.source_id],
    );
    const source = sourceRows[0];
    if (!source) return { ok: false as const, status: 404, error: 'Question-bank source not found.' };
    const prior = await client.query(
      'SELECT id FROM question_bank_ingestion_batches WHERE batch_key=$1',
      [payload.batch_key],
    );
    if (prior.rows[0]) return { ok: false as const, status: 409, error: 'This batch_key has already been used.' };

    const prepared: Array<{ q: any; subjectId: number; topicId: number }> = [];
    for (const q of payload.questions) {
      const rightsError = rightsGate(source, q);
      if (rightsError) return { ok: false as const, status: 403, error: rightsError };
      const { rows: subjectRows } = await client.query(
        'SELECT id FROM question_bank_subjects WHERE code=$1',
        [q.subject_code],
      );
      if (!subjectRows[0]) return { ok: false as const, status: 400, error: `Unknown question-bank subject: ${q.subject_code}.` };
      const { rows: topicRows } = await client.query(
        'SELECT id FROM question_bank_topics WHERE subject_id=$1 AND slug=$2',
        [subjectRows[0].id,q.topic_slug],
      );
      if (!topicRows[0]) return { ok: false as const, status: 400, error: `Topic ${q.topic_slug} is not mapped to ${q.subject_code}.` };
      prepared.push({ q, subjectId: subjectRows[0].id, topicId: topicRows[0].id });
    }

    const { rows: batchRows } = await client.query(`
      INSERT INTO question_bank_ingestion_batches(source_id,batch_key,payload_sha256,imported_count,created_by)
      VALUES($1,$2,$3,0,$4) RETURNING id
    `, [payload.source_id,payload.batch_key,payloadHash,req.user!.id]);
    const batchId = batchRows[0].id;
    let imported = 0;
    for (const item of prepared) {
      const q = item.q;
      const { rows } = await client.query(`
        INSERT INTO question_bank_questions
          (board,exam_year,subject_id,paper,question_number,question_type,stem,options,
           correct_answer,explanation,marks,topic_id,source_id,batch_id,source_locator,
           content_origin,rights_status,review_status,created_by)
        VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9::jsonb,$10,$11,$12,$13,$14,$15,$16,$17,'draft',$18)
        ON CONFLICT DO NOTHING RETURNING id
      `, [
        q.board,q.exam_year ?? null,item.subjectId,q.paper,q.question_number,q.question_type,
        q.stem,q.options ? JSON.stringify(q.options) : null,JSON.stringify(q.correct_answer),
        q.explanation,q.marks,item.topicId,payload.source_id,batchId,q.source_locator ?? null,
        q.content_origin,source.rights_status,req.user!.id,
      ]);
      if (!rows[0]) {
        throw Object.assign(new Error(`Duplicate question identity: ${q.board} / ${q.question_number}.`), { status: 409 });
      }
      imported++;
    }
    await client.query('UPDATE question_bank_ingestion_batches SET imported_count=$1 WHERE id=$2',[imported,batchId]);
    return { ok: true as const, batch_id: batchId, imported_count: imported, payload_sha256: payloadHash };
    });
  } catch (error: any) {
    if (error?.status === 409 || error?.code === '23505') {
      return res.status(409).json({ error: error.message ?? 'A question in this batch already exists.' });
    }
    throw error;
  }

  if (!result.ok) return res.status(result.status).json({ error: result.error });
  return res.status(201).json(result);
});

export default router;
