import { Router } from 'express';
import { randomUUID } from 'node:crypto';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { query, withTransaction } from '../db/pool.js';
import { generateJSON } from '../utils/ai.js';

const router = Router();
router.use(requireAuth);

const EXAM_CLASSES = new Set(['JSS 3','SS 1','SS 2','SS 3']);
const BOARDS = new Set(['WAEC','NECO','JAMB']);
const clean = (v: unknown) => String(v ?? '').trim().toLocaleLowerCase().replace(/\s+/g,' ');

function schoolForAdmin(user: any): string | null {
  return user.selected_school_code || user.school_code || null;
}
function isoDate(value: unknown): Date | null {
  if (typeof value !== 'string' || !value.trim()) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}
function publicQuestion(row: any) {
  const q = row.question_snapshot;
  return {
    id: row.id, section_id: row.section_id, section_title: row.section_title,
    position: Number(row.position), marks: Number(row.marks),
    question: { stem: q.stem, type: q.question_type, options: q.options ?? null },
    provenance: row.provenance,
  };
}

router.post('/admin/exams', requireRole('admin'), async (req, res) => {
  const user = req.user!;
  const schoolCode = schoolForAdmin(user);
  const b = req.body ?? {};
  if (!schoolCode) return res.status(400).json({ error: 'Select a school before creating an examination.' });
  if (!BOARDS.has(b.board) || !EXAM_CLASSES.has(b.class_name) ||
      typeof b.subject_name !== 'string' || !b.subject_name.trim() ||
      typeof b.examination_type !== 'string' || b.examination_type.trim().length < 2 ||
      typeof b.title !== 'string' || b.title.trim().length < 3 ||
      typeof b.instructions !== 'string' || !b.instructions.trim() ||
      !Number.isInteger(b.duration_minutes) || b.duration_minutes < 1 || b.duration_minutes > 600 ||
      !Array.isArray(b.sections) || b.sections.length < 1 || b.sections.length > 20) {
    return res.status(400).json({ error: 'Provide a valid board, examination class, subject, type, title, instructions, duration and 1–20 sections.' });
  }
  const startsAt = isoDate(b.starts_at);
  const endsAt = isoDate(b.ends_at);
  if (!startsAt || !endsAt || endsAt <= startsAt) {
    return res.status(400).json({ error: 'Valid start and end times are required; end must be after start.' });
  }
  if (b.exam_year != null && (!Number.isInteger(b.exam_year) || b.exam_year < 2020 || b.exam_year > 2100)) {
    return res.status(400).json({ error: 'exam_year must be between 2020 and 2100.' });
  }
  const allItems: any[] = [];
  for (let si=0; si<b.sections.length; si++) {
    const section=b.sections[si];
    if (!section || typeof section.title !== 'string' || !section.title.trim() ||
        !Array.isArray(section.questions) || section.questions.length < 1 || section.questions.length > 100) {
      return res.status(400).json({ error: 'Each section requires a title and 1–100 questions.' });
    }
    for (let qi=0; qi<section.questions.length; qi++) {
      const item=section.questions[qi];
      if (!item || typeof item.question_id !== 'string' ||
          (item.marks != null && (!Number.isFinite(Number(item.marks)) || Number(item.marks)<=0 || Number(item.marks)>100))) {
        return res.status(400).json({ error: 'Each question requires a valid question_id and positive marks.' });
      }
      allItems.push({ ...item, sectionIndex:si, questionIndex:qi, sectionTitle:section.title.trim() });
    }
  }
  const ids=allItems.map(x=>x.question_id);
  if (new Set(ids).size !== ids.length) return res.status(400).json({ error: 'A question may appear only once in an examination.' });
  try {
    const result=await withTransaction(async client=>{
      const {rows: subjects}=await client.query(
        'SELECT id,name FROM question_bank_subjects WHERE name=$1 OR code=$1 LIMIT 1',[b.subject_name.trim()]);
      if (!subjects[0]) return {error:'Subject does not exist in the approved online question-bank taxonomy.',status:400};
      const {rows: qs}=await client.query(`
        SELECT q.*,s.board AS source_board,s.source_name,s.source_url,s.rights_status AS source_rights,s.rights_evidence
          FROM question_bank_questions q
          JOIN question_bank_sources s ON s.id=q.source_id
         WHERE q.id=ANY($1::uuid[]) AND q.subject_id=$2
           AND q.review_status IN ('approved','published')
           AND s.is_active=true
         FOR SHARE OF q,s
      `,[ids,subjects[0].id]);
      if (qs.length!==ids.length) return {error:'Every question must exist, match the subject and be approved or published. Unapproved pilot questions cannot be used.',status:400};
      const byId=new Map(qs.map((q:any)=>[q.id,q]));
      for(const item of allItems){
        const q:any=byId.get(item.question_id);
        if(q.board!==b.board || !['licensed','public_domain','original_generated'].includes(q.rights_status) ||
           q.rights_status!==q.source_rights ||
           (q.content_origin==='past_question' && (!['licensed','public_domain'].includes(q.source_rights) || !q.exam_year)) ||
           (q.content_origin!=='past_question' && q.source_rights!=='original_generated')){
          return {error:'Question board/provenance or documented reuse rights are invalid for this examination.',status:400};
        }
      }
      const {rows: created}=await client.query(`
        INSERT INTO online_exams(school_code,subject_id,subject_name,class_name,board,examination_type,exam_year,title,instructions,duration_minutes,starts_at,ends_at,shuffle_questions,created_by)
        VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING id,title,status
      `,[schoolCode,subjects[0].id,subjects[0].name,b.class_name,b.board,b.examination_type.trim(),b.exam_year??null,
        b.title.trim(),b.instructions.trim(),b.duration_minutes,startsAt.toISOString(),endsAt.toISOString(),b.shuffle_questions===true,user.id]);
      const exam=created[0];
      const sectionIds:string[]=[];
      for(let si=0;si<b.sections.length;si++){
        const section=b.sections[si];
        const {rows}=await client.query(
          'INSERT INTO online_exam_sections(exam_id,title,instructions,position) VALUES($1,$2,$3,$4) RETURNING id',
          [exam.id,section.title.trim(),typeof section.instructions==='string'?section.instructions.trim():null,si]);
        sectionIds.push(rows[0].id);
      }
      let total=0;
      for(const item of allItems){
        const q:any=byId.get(item.question_id);
        const marks=Number(item.marks??q.marks);
        total+=marks;
        const provenance={board:q.board,subject:b.subject_name,class_name:b.class_name,examination_type:b.examination_type,
          exam_year:q.exam_year,source_id:q.source_id,source_name:q.source_name,source_url:q.source_url,
          source_locator:q.source_locator,rights_status:q.rights_status,content_origin:q.content_origin,paper:q.paper,question_number:q.question_number};
        const snapshot={stem:q.stem,question_type:q.question_type,options:q.options,correct_answer:q.correct_answer,
          explanation:q.explanation,topic_id:q.topic_id,topic_name:q.topic_name??null};
        await client.query(`
          INSERT INTO online_exam_questions(exam_id,section_id,question_bank_question_id,position,marks,question_snapshot,provenance)
          VALUES($1,$2,$3,$4,$5,$6::jsonb,$7::jsonb)
        `,[exam.id,sectionIds[item.sectionIndex],q.id,item.questionIndex,marks,JSON.stringify(snapshot),JSON.stringify(provenance)]);
      }
      await client.query('UPDATE online_exams SET updated_at=now() WHERE id=$1',[exam.id]);
      await client.query(`
        INSERT INTO online_exam_audit_events(exam_id,actor_user_id,event_type,details)
        VALUES($1,$2,'exam_created',$3::jsonb)
      `,[exam.id,user.id,JSON.stringify({question_count:allItems.length,section_count:b.sections.length,total_marks:total})]);
      return {exam,total_marks:total,question_count:allItems.length};
    });
    if('error' in result) return res.status(result.status).json({error:result.error});
    return res.status(201).json(result);
  } catch(error:any) {
    console.error('[online-exams] create failed',error);
    return res.status(500).json({error:'Could not create examination.'});
  }
});

router.post('/admin/exams/:examId/publish',requireRole('admin'),async(req,res)=>{
  const schoolCode=schoolForAdmin(req.user);
  if(!schoolCode) return res.status(400).json({error:'Select a school before publishing.'});
  const result=await withTransaction(async client=>{
    const {rows}=await client.query('SELECT * FROM online_exams WHERE id=$1 AND school_code=$2 FOR UPDATE',[req.params.examId,schoolCode]);
    const exam=rows[0];
    if(!exam) return {status:404,error:'Examination not found.'};
    if(exam.status!=='draft') return {status:409,error:'Only a draft examination can be published.'};
    const {rows: count}=await client.query('SELECT COUNT(*)::int AS n FROM online_exam_questions WHERE exam_id=$1',[exam.id]);
    if(!count[0]?.n) return {status:409,error:'An examination must contain questions before publishing.'};
    const {rows: candidates}=await client.query(`
      SELECT id,class_name FROM students
       WHERE school_code=$1 AND class_name=$2 AND deleted_at IS NULL
    `,[exam.school_code,exam.class_name]);
    if(!candidates.length) return {status:409,error:'No active candidates are enrolled in this examination class.'};
    for(const candidate of candidates){
      await client.query(`
        INSERT INTO online_exam_candidates(exam_id,student_id,eligible_class)
        VALUES($1,$2,$3) ON CONFLICT DO NOTHING
      `,[exam.id,candidate.id,candidate.class_name]);
    }
    await client.query("UPDATE online_exams SET status='published',published_at=now(),updated_at=now() WHERE id=$1",[exam.id]);
    await client.query(`
      INSERT INTO online_exam_audit_events(exam_id,actor_user_id,event_type,details)
      VALUES($1,$2,'exam_published',$3::jsonb)
    `,[exam.id,req.user!.id,JSON.stringify({eligible_candidates:candidates.length})]);
    return {status:200,exam_id:exam.id,eligible_candidates:candidates.length};
  });
  if('error' in result) return res.status(result.status).json({error:result.error});
  return res.json(result);
});

router.get('/exams',requireRole('student'),async(req,res)=>{
  const {rows: studentRows}=await query(
    'SELECT id,school_code,class_name FROM students WHERE user_id=$1 AND deleted_at IS NULL LIMIT 1',[req.user!.id]);
  const student=studentRows[0];
  if(!student) return res.status(404).json({error:'Student record not found.'});
  const {rows}=await query(`
    SELECT e.id,e.title,e.subject_name,e.class_name,e.board,e.examination_type,e.exam_year,e.instructions,
           e.duration_minutes,e.starts_at,e.ends_at,
           a.id AS attempt_id,a.status AS attempt_status,a.deadline_at,a.submitted_at
      FROM online_exams e
      JOIN online_exam_candidates c ON c.exam_id=e.id AND c.student_id=$1
      LEFT JOIN online_exam_attempts a ON a.exam_id=e.id AND a.student_id=$1
     WHERE e.school_code=$2 AND e.class_name=$3 AND e.status='published'
     ORDER BY e.starts_at ASC
  `,[student.id,student.school_code,student.class_name]);
  return res.json({exams:rows});
});

async function getStudent(req:any) {
  const {rows}=await query('SELECT id,school_code,class_name FROM students WHERE user_id=$1 AND deleted_at IS NULL LIMIT 1',[req.user!.id]);
  return rows[0]??null;
}

router.post('/exams/:examId/start',requireRole('student'),async(req,res)=>{
  const student=await getStudent(req);
  if(!student) return res.status(404).json({error:'Student record not found.'});
  const result=await withTransaction(async client=>{
    const {rows}=await client.query(`
      SELECT e.* FROM online_exams e
      JOIN online_exam_candidates c ON c.exam_id=e.id AND c.student_id=$2
     WHERE e.id=$1 AND e.school_code=$3 AND e.class_name=$4 AND e.status='published'
     FOR SHARE OF e
    `,[req.params.examId,student.id,student.school_code,student.class_name]);
    const exam=rows[0];
    if(!exam) return {status:404,error:'Examination is not available to this candidate.'};
    const now=Date.now();
    if(now<new Date(exam.starts_at).getTime()) return {status:409,error:'This examination has not started yet.'};
    if(now>=new Date(exam.ends_at).getTime()) return {status:409,error:'The examination deadline has passed.'};
    const {rows: existing}=await client.query(
      'SELECT * FROM online_exam_attempts WHERE exam_id=$1 AND student_id=$2 FOR UPDATE',[exam.id,student.id]);
    let attempt=existing[0];
    if(!attempt){
      const {rows: totalRows}=await client.query('SELECT COALESCE(SUM(marks),0) AS total FROM online_exam_questions WHERE exam_id=$1',[exam.id]);
      const {rows: created}=await client.query(`
        INSERT INTO online_exam_attempts(exam_id,student_id,deadline_at,total_marks)
        VALUES($1,$2,LEAST(now()+($3::text||' minutes')::interval,$4),$5) RETURNING *
      `,[exam.id,student.id,exam.duration_minutes,exam.ends_at,totalRows[0].total]);
      attempt=created[0];
      await client.query(`
        INSERT INTO online_exam_audit_events(exam_id,attempt_id,actor_user_id,event_type)
        VALUES($1,$2,$3,'attempt_started')
      `,[exam.id,attempt.id,req.user!.id]);
    }
    if(['submitted','under_review','expired'].includes(attempt.status)) return {status:409,error:'This examination attempt is already closed.',attempt_id:attempt.id};
    if(new Date(attempt.deadline_at).getTime()<=Date.now()){
      await client.query("UPDATE online_exam_attempts SET status='expired' WHERE id=$1",[attempt.id]);
      return {status:409,error:'The server-side examination deadline has passed.',attempt_id:attempt.id};
    }
    const {rows: sections}=await client.query(
      'SELECT * FROM online_exam_sections WHERE exam_id=$1 ORDER BY position',[exam.id]);
    const {rows: questions}=await client.query(`
      SELECT q.*,s.title AS section_title FROM online_exam_questions q
      JOIN online_exam_sections s ON s.id=q.section_id
     WHERE q.exam_id=$1 ORDER BY s.position,q.position
    `,[exam.id]);
    const {rows: responses}=await client.query(
      'SELECT exam_question_id,response,saved_at FROM online_exam_responses WHERE attempt_id=$1',[attempt.id]);
    return {status:200,exam:{id:exam.id,title:exam.title,instructions:exam.instructions,duration_minutes:exam.duration_minutes,
      starts_at:exam.starts_at,ends_at:exam.ends_at,board:exam.board,subject_name:exam.subject_name,examination_type:exam.examination_type},
      attempt:{id:attempt.id,status:attempt.status,started_at:attempt.started_at,deadline_at:attempt.deadline_at,
        server_time:new Date().toISOString(),remaining_seconds:Math.max(0,Math.floor((new Date(attempt.deadline_at).getTime()-Date.now())/1000))},
      sections,questions:questions.map(publicQuestion),saved_responses:responses};
  });
  if(result.status!==200) return res.status(result.status).json({error:result.error,attempt_id:result.attempt_id});
  return res.json(result);
});

router.get('/attempts/:attemptId',requireRole('student'),async(req,res)=>{
  const student=await getStudent(req);
  if(!student) return res.status(404).json({error:'Student record not found.'});
  const {rows}=await query(`
    SELECT a.*,e.title,e.instructions,e.subject_name,e.board,e.examination_type,e.ends_at
      FROM online_exam_attempts a JOIN online_exams e ON e.id=a.exam_id
     WHERE a.id=$1 AND a.student_id=$2
  `,[req.params.attemptId,student.id]);
  const attempt=rows[0];
  if(!attempt) return res.status(404).json({error:'Attempt not found.'});
  if(attempt.status!=='in_progress') return res.status(409).json({error:'This attempt is no longer in progress.',status:attempt.status});
  const {rows: qs}=await query(`
    SELECT q.*,s.title AS section_title FROM online_exam_questions q
    JOIN online_exam_sections s ON s.id=q.section_id WHERE q.exam_id=$1 ORDER BY s.position,q.position
  `,[attempt.exam_id]);
  const {rows: responses}=await query(
    'SELECT exam_question_id,response,saved_at FROM online_exam_responses WHERE attempt_id=$1',[attempt.id]);
  const remaining=Math.max(0,Math.floor((new Date(attempt.deadline_at).getTime()-Date.now())/1000));
  return res.json({exam:{id:attempt.exam_id,title:attempt.title,instructions:attempt.instructions,subject_name:attempt.subject_name,
    board:attempt.board,examination_type:attempt.examination_type},attempt:{id:attempt.id,deadline_at:attempt.deadline_at,
    server_time:new Date().toISOString(),remaining_seconds:remaining},questions:qs.map(publicQuestion),saved_responses:responses});
});

router.put('/attempts/:attemptId/responses/:questionId',requireRole('student'),async(req,res)=>{
  const student=await getStudent(req);
  if(!student) return res.status(404).json({error:'Student record not found.'});
  const response=req.body?.response;
  if(response==null || JSON.stringify(response).length>12000) return res.status(400).json({error:'A response of at most 12,000 characters is required.'});
  const result=await withTransaction(async client=>{
    const {rows}=await client.query(
      'SELECT * FROM online_exam_attempts WHERE id=$1 AND student_id=$2 FOR UPDATE',[req.params.attemptId,student.id]);
    const attempt=rows[0];
    if(!attempt) return {status:404,error:'Attempt not found.'};
    if(attempt.status!=='in_progress') return {status:409,error:'This attempt is not accepting autosaves.'};
    if(new Date(attempt.deadline_at).getTime()<=Date.now()){
      await client.query("UPDATE online_exam_attempts SET status='expired' WHERE id=$1",[attempt.id]);
      await client.query(`INSERT INTO online_exam_audit_events(exam_id,attempt_id,actor_user_id,event_type)
        VALUES($1,$2,$3,'attempt_expired')`,[attempt.exam_id,attempt.id,req.user!.id]);
      return {status:409,error:'The server-side deadline has passed; autosave is closed.'};
    }
    const {rows: q}=await client.query(
      'SELECT id FROM online_exam_questions WHERE id=$1 AND exam_id=$2',[req.params.questionId,attempt.exam_id]);
    if(!q[0]) return {status:404,error:'Question does not belong to this examination.'};
    await client.query(`
      INSERT INTO online_exam_responses(attempt_id,exam_question_id,response,saved_at)
      VALUES($1,$2,$3::jsonb,now())
      ON CONFLICT(attempt_id,exam_question_id) DO UPDATE SET response=EXCLUDED.response,saved_at=now()
    `,[attempt.id,q[0].id,JSON.stringify(response)]);
    await client.query(`INSERT INTO online_exam_audit_events(exam_id,attempt_id,actor_user_id,event_type,details)
      VALUES($1,$2,$3,'response_autosaved',$4::jsonb)`,
    [attempt.exam_id,attempt.id,req.user!.id,JSON.stringify({question_id:q[0].id})]);
    return {status:200,saved_at:new Date().toISOString(),deadline_at:attempt.deadline_at};
  });
  if(result.status!==200) return res.status(result.status).json({error:result.error});
  return res.json({saved:true,...result});
});

router.post('/attempts/:attemptId/submit',requireRole('student'),async(req,res)=>{
  const student=await getStudent(req);
  if(!student) return res.status(404).json({error:'Student record not found.'});
  const claimed=await withTransaction(async client=>{
    const {rows}=await client.query(
      'SELECT * FROM online_exam_attempts WHERE id=$1 AND student_id=$2 FOR UPDATE',[req.params.attemptId,student.id]);
    const attempt=rows[0];
    if(!attempt) return {status:404,error:'Attempt not found.'};
    if(attempt.status==='submitted'||attempt.status==='under_review') return {status:200,already_submitted:true,attempt};
    if(attempt.status==='submitting' && attempt.submission_started_at && Date.now()-new Date(attempt.submission_started_at).getTime()<120000)
      return {status:409,error:'Submission is already being processed.'};
    if(!['in_progress','submitting','expired'].includes(attempt.status)) return {status:409,error:'Attempt cannot be submitted.'};
    if(attempt.status==='in_progress' && new Date(attempt.deadline_at).getTime()>Date.now() && req.body?.confirm!==true)
      return {status:400,error:'Set confirm=true to submit the examination.'};
    await client.query(`UPDATE online_exam_attempts SET status='submitting',submission_started_at=now() WHERE id=$1`,[attempt.id]);
    const {rows: qs}=await client.query(`
      SELECT q.*,s.title AS section_title FROM online_exam_questions q
      JOIN online_exam_sections s ON s.id=q.section_id WHERE q.exam_id=$1 ORDER BY s.position,q.position
    `,[attempt.exam_id]);
    const {rows: answers}=await client.query('SELECT * FROM online_exam_responses WHERE attempt_id=$1',[attempt.id]);
    return {status:202,attempt,questions:qs,answers};
  });
  if(claimed.status===200) return res.json({submitted:true,already_submitted:true,score:claimed.attempt.score,percentage:claimed.attempt.percentage,status:claimed.attempt.status});
  if(claimed.status!==202) return res.status(claimed.status).json({error:claimed.error});
  const answerMap=new Map(claimed.answers.map((a:any)=>[a.exam_question_id,a]));
  let score=0, pending=false;
  const graded:any[]=[];
  for(const q of claimed.questions){
    const saved:any=answerMap.get(q.id);
    if(!saved){graded.push({id:q.id,awarded:0,status:'auto_marked',feedback:null});continue;}
    const snapshot=q.question_snapshot;
    let awarded:number|null=0, marking='auto_marked', feedback:string|null=null;
    if(snapshot.question_type==='mcq'){
      const correct=snapshot.correct_answer;
      const expected=typeof correct==='string'?correct:(correct?.key??correct?.value??'');
      const actual=typeof saved.response==='string'?saved.response:(saved.response?.key??saved.response?.value??'');
      awarded=clean(actual)===clean(expected)?Number(q.marks):0;
      feedback=awarded? 'Correct answer.':'Review this question and its explanation after the examination.';
    } else {
      try{
        const prompt=`Mark this examination response using the question and marking guidance.\nQuestion: ${snapshot.stem}\nCandidate response: ${typeof saved.response==='string'?saved.response:JSON.stringify(saved.response)}\nMaximum marks: ${q.marks}\nReturn JSON: {"points":number,"feedback":"brief evidence-based feedback"}`;
        const marked:any=await generateJSON(prompt,'essay-mark',{userId:req.user!.id,role:req.user!.role});
        awarded=Math.max(0,Math.min(Number(q.marks),Number(marked?.points)||0));
        feedback=typeof marked?.feedback==='string'?marked.feedback:null;
        marking='ai_marked';
      }catch{
        awarded=null; marking='pending_review'; pending=true;
      }
    }
    if(awarded!=null) score+=awarded;
    graded.push({id:q.id,awarded,marking,feedback});
  }
  const final=await withTransaction(async client=>{
    for(const item of graded){
      await client.query(`
        UPDATE online_exam_responses SET awarded_marks=$3,marking_status=$4,feedback=$5
         WHERE attempt_id=$1 AND exam_question_id=$2
      `,[claimed.attempt.id,item.id,item.awarded,item.marking,item.feedback]);
    }
    const status=pending?'under_review':'submitted';
    const {rows}=await client.query(`
      UPDATE online_exam_attempts SET status=$2,score=$3,percentage=$4,submitted_at=now()
       WHERE id=$1 RETURNING id,status,score,total_marks,percentage,submitted_at
    `,[claimed.attempt.id,status,score,pending?null:(Number(claimed.attempt.total_marks)?score/Number(claimed.attempt.total_marks)*100:0)]);
    await client.query(`
      INSERT INTO online_exam_audit_events(exam_id,attempt_id,actor_user_id,event_type,details)
      VALUES($1,$2,$3,'attempt_submitted',$4::jsonb)
    `,[claimed.attempt.exam_id,claimed.attempt.id,req.user!.id,JSON.stringify({status,answered:claimed.answers.length,question_count:claimed.questions.length})]);
    return rows[0];
  });
  return res.json({submitted:true,...final});
});

router.get('/attempts/:attemptId/results',requireRole('student'),async(req,res)=>{
  const student=await getStudent(req);
  if(!student) return res.status(404).json({error:'Student record not found.'});
  const {rows}=await query(`
    SELECT a.id,a.status,a.score,a.total_marks,a.percentage,a.submitted_at,e.title,e.subject_name,e.board,e.examination_type
      FROM online_exam_attempts a JOIN online_exams e ON e.id=a.exam_id
     WHERE a.id=$1 AND a.student_id=$2
  `,[req.params.attemptId,student.id]);
  if(!rows[0]) return res.status(404).json({error:'Result not found.'});
  const {rows: answers}=await query(`
    SELECT q.id,q.question_snapshot->>'stem' AS stem,r.response,r.awarded_marks,r.marking_status,r.feedback,q.marks
      FROM online_exam_questions q LEFT JOIN online_exam_responses r
        ON r.exam_question_id=q.id AND r.attempt_id=$1
     WHERE q.exam_id=(SELECT exam_id FROM online_exam_attempts WHERE id=$1)
     ORDER BY q.position
  `,[req.params.attemptId]);
  return res.json({attempt:rows[0],responses:answers});
});

export default router;
