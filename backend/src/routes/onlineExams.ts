import { Router } from 'express';
import { randomUUID, createHash } from 'node:crypto';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { query, withTransaction } from '../db/pool.js';
import { generateJSON } from '../utils/ai.js';
import { listStudentSs1Lessons } from '../db/ss1/studentDelivery.js';
import { listStudentSs23Units } from '../db/ss23/studentDelivery.js';

const router = Router();
router.use(requireAuth);

const EXAM_CLASSES = new Set(['JSS 3','SS 1','SS 2','SS 3']);
const BOARDS = new Set(['WAEC','NECO','JAMB']);
const clean = (v: unknown) => String(v ?? '').trim().toLocaleLowerCase().replace(/\s+/g,' ');

type MarkingRubricCriterion = { id: string; description: string; max_marks: number };

export function validateMarkingRubric(value: unknown, maximum: number): MarkingRubricCriterion[] | null {
  if (!Array.isArray(value) || value.length < 1 || value.length > 20) return null;
  const criteria: MarkingRubricCriterion[] = [];
  const ids = new Set<string>();
  for (const raw of value as any[]) {
    if (!raw || typeof raw.id !== 'string' || !/^[a-z0-9_-]{1,40}$/i.test(raw.id) ||
        ids.has(raw.id) || typeof raw.description !== 'string' ||
        raw.description.trim().length < 5 || raw.description.trim().length > 500 ||
        !Number.isFinite(Number(raw.max_marks)) || Number(raw.max_marks) <= 0 ||
        Number(raw.max_marks) > maximum) return null;
    ids.add(raw.id);
    criteria.push({ id: raw.id, description: raw.description.trim(), max_marks: Number(raw.max_marks) });
  }
  const total = criteria.reduce((sum, item) => sum + item.max_marks, 0);
  return Math.abs(total - maximum) <= 0.01 ? criteria : null;
}

export function validateAiRubricMark(value: any, rubric: MarkingRubricCriterion[], maximum: number) {
  if (!value || !Number.isFinite(Number(value.points)) || Number(value.points) < 0 ||
      Number(value.points) > maximum || !Number.isFinite(Number(value.confidence)) ||
      Number(value.confidence) < 0 || Number(value.confidence) > 1 ||
      typeof value.feedback !== 'string' || value.feedback.trim().length < 5 ||
      !Array.isArray(value.criterion_scores) || value.criterion_scores.length !== rubric.length) return null;
  const scores = new Map<string, { criterion_id: string; points: number; rationale: string }>();
  for (const item of value.criterion_scores) {
    if (!item || typeof item.criterion_id !== 'string' || scores.has(item.criterion_id) ||
        !Number.isFinite(Number(item.points)) || typeof item.rationale !== 'string' ||
        item.rationale.trim().length < 3) return null;
    scores.set(item.criterion_id, { criterion_id: item.criterion_id, points: Number(item.points), rationale: item.rationale.trim() });
  }
  let sum = 0;
  for (const criterion of rubric) {
    const score = scores.get(criterion.id);
    if (!score || score.points < 0 || score.points > criterion.max_marks) return null;
    sum += score.points;
  }
  if (Math.abs(sum - Number(value.points)) > 0.01) return null;
  return { points: Number(value.points), confidence: Number(value.confidence), feedback: value.feedback.trim(),
    criterion_scores: rubric.map(item => scores.get(item.id)!) };
}

function schoolForAdmin(user: any): string | null {
  return user.selected_school_code || user.school_code || null;
}
function isoDate(value: unknown): Date | null {
  if (typeof value !== 'string' || !value.trim()) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}
function ss1LessonKey(lesson:any):string {
  const fingerprint=lesson.body_sha256??createHash('sha256').update(String(lesson.body??'')).digest('hex');
  return 'ss1:'+createHash('sha256').update(['SS 1',lesson.canonical_subject,lesson.term,String(lesson.id),fingerprint,JSON.stringify(lesson.objectives??[])].join('\\0')).digest('hex');
}
function ss23LessonKey(unit:any):string {
  const fingerprint=unit.body_sha256??createHash('sha256').update(String(unit.body??'')).digest('hex');
  return 'ss23:'+createHash('sha256').update([unit.class_name,unit.subject,unit.term,String(unit.id),fingerprint,JSON.stringify(unit.objectives??[])].join('\\0')).digest('hex');
}
function parseLessonLocator(locator:unknown):any|null {
  if(typeof locator!=='string') return null;
  if(locator.startsWith('school-topic:')) return {kind:'school_topic',topic_id:Number(locator.slice('school-topic:'.length))};
  try { const value=JSON.parse(locator); return value&&typeof value==='object'?value:null; } catch { return null; }
}

function publicQuestion(row: any) {
  const q = row.question_snapshot;
  return {
    id: row.id, section_id: row.section_id, section_title: row.section_title,
    position: Number(row.position), marks: Number(row.marks),
    question: { stem: q.stem, type: q.question_type, options: q.options ?? null },
  };
}

router.post('/admin/exams/generate-drafts',requireRole('admin'),async(req,res)=>{
  const schoolCode=schoolForAdmin(req.user);
  const body=req.body??{};
  const topicIds=body.lesson_topic_ids;
  if(!schoolCode) return res.status(400).json({error:'Select a school before generating examination questions.'});
  if(!BOARDS.has(body.board)||!EXAM_CLASSES.has(body.class_name)||
     typeof body.subject_name!=='string'||!body.subject_name.trim()||
     !Array.isArray(topicIds)||topicIds.length<1||topicIds.length>12||
     !topicIds.every((id:any)=>Number.isSafeInteger(id)&&id>0)||
     new Set(topicIds).size!==topicIds.length){
    return res.status(400).json({error:'Provide board, examination class, subject and 1–12 unique lesson topic IDs.'});
  }
  const {rows: lessons}=await query(`
    SELECT t.id,t.title,t.description,t.summary,sub.name AS subject_name,
           COUNT(DISTINCT st.id)::int AS candidate_count,
           COUNT(DISTINCT tc.student_id)::int AS completed_count
      FROM topics t
      JOIN subjects sub ON sub.id=t.subject_id AND sub.school_code=t.school_code
      JOIN students st ON st.school_code=t.school_code AND st.class_name=t.class_name AND st.deleted_at IS NULL
      LEFT JOIN topic_completions tc ON tc.topic_id=t.id AND tc.student_id=st.id
     WHERE t.id=ANY($1::int[]) AND t.school_code=$2 AND t.class_name=$3 AND sub.name=$4
     GROUP BY t.id,t.title,t.description,t.summary,sub.name
  `,[topicIds,schoolCode,body.class_name,body.subject_name.trim()]);
  if(lessons.length!==topicIds.length || lessons.some((l:any)=>!Number(l.candidate_count)||Number(l.completed_count)!==Number(l.candidate_count))){
    return res.status(409).json({error:'Every selected lesson must belong to this school, subject and class, and must be completed by every currently enrolled candidate.'});
  }
  if(lessons.some((l:any)=>![l.summary,l.description].some((v:any)=>typeof v==='string'&&v.trim()))){
    return res.status(409).json({error:'A selected completed lesson has no usable teaching content to ground original examination questions.'});
  }
  const sourceResult=await query(`
    SELECT id,source_name FROM question_bank_sources
     WHERE board='GENERAL' AND access_method='original_generated'
       AND rights_status='original_generated' AND is_active=true
     ORDER BY created_at LIMIT 1
  `);
  if(!sourceResult.rows[0]) return res.status(409).json({error:'The registered original-generated question source is unavailable.'});

  const drafts:any[]=[];
  try{
    for(const lesson of lessons){
      const lessonText=[lesson.summary,lesson.description].filter((v:any)=>typeof v==='string'&&v.trim()).join('\n\n').slice(0,12000);
      const prompt=`Write 3 original ${body.board} examination-standard multiple-choice questions for ${body.class_name} ${body.subject_name} based ONLY on this completed lesson.\nLesson title: ${lesson.title}\nLesson content:\n${lessonText}\nDo not add facts, topics or skills not explicitly taught in this lesson. Do not imitate or quote a past paper. Questions must be age-appropriate, clear and unambiguous, with four plausible options and one correct answer. Return JSON {"questions":[{"stem":"...","options":[{"key":"A","text":"..."},{"key":"B","text":"..."},{"key":"C","text":"..."},{"key":"D","text":"..."}],"correct_key":"A","explanation":"...","marks":1}]}`;
      const generated:any=await generateJSON(prompt,'generate-questions',{userId:req.user!.id,role:req.user!.role});
      if(!Array.isArray(generated?.questions)||generated.questions.length!==3) throw new Error('Question generation returned an incomplete set.');
      for(const q of generated.questions){
        if(!q||typeof q.stem!=='string'||q.stem.trim().length<12||
           !Array.isArray(q.options)||q.options.length!==4||
           !q.options.every((o:any)=>o&&typeof o.key==='string'&&typeof o.text==='string'&&o.text.trim())||
           !q.options.some((o:any)=>o.key===q.correct_key)||
           typeof q.explanation!=='string'||q.explanation.trim().length<10||
           !Number.isFinite(Number(q.marks))||Number(q.marks)<=0||Number(q.marks)>10){
          throw new Error('Generated question failed answer/options/marks validation.');
        }
        drafts.push({lesson,q});
      }
    }
  }catch(error:any){
    return res.status(502).json({error:error?.message??'Could not generate examination questions from the selected lessons.'});
  }

  try{
    const saved=await withTransaction(async client=>{
      const normalized=body.subject_name.trim();
      let {rows: subjectRows}=await client.query('SELECT id FROM question_bank_subjects WHERE name=$1',[normalized]);
      if(!subjectRows[0]){
        const code=normalized.toUpperCase().replace(/[^A-Z0-9]+/g,'_').replace(/^_|_$/g,'').slice(0,35)||'SUBJECT';
        await client.query('INSERT INTO question_bank_subjects(code,name) VALUES($1,$2) ON CONFLICT(code) DO NOTHING',[code,normalized]);
        ({rows:subjectRows}=await client.query('SELECT id FROM question_bank_subjects WHERE name=$1',[normalized]));
        if(!subjectRows[0]) return {error:'Subject code already exists for a different question-bank subject. Admin taxonomy reconciliation is required.'};
      }
      const subjectId=subjectRows[0].id;
      const ids:string[]=[];
      for(const item of drafts){
        const lesson=item.lesson,q=item.q;
        const slug=lesson.title.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,100)||('lesson-'+lesson.id);
        let {rows: topicRows}=await client.query('SELECT id FROM question_bank_topics WHERE subject_id=$1 AND slug=$2',[subjectId,slug]);
        if(!topicRows[0]){
          ({rows:topicRows}=await client.query(`
            INSERT INTO question_bank_topics(subject_id,slug,name,description)
            VALUES($1,$2,$3,$4) RETURNING id
          `,[subjectId,slug,lesson.title,lesson.description??lesson.summary??null]));
        }
        const qno='AI-GEN-'+randomUUID().slice(0,8).toUpperCase();
        const {rows: inserted}=await client.query(`
          INSERT INTO question_bank_questions(board,exam_year,subject_id,paper,question_number,question_type,stem,options,correct_answer,explanation,marks,topic_id,source_id,source_locator,content_origin,rights_status,review_status,created_by)
          VALUES($1,NULL,$2,'Original practice — not a past paper',$3,'mcq',$4,$5::jsonb,$6::jsonb,$7,$8,$9,$10,$11,'ai_generated','original_generated','draft',$12)
          RETURNING id
        `,[body.board,subjectId,qno,q.stem.trim(),JSON.stringify(q.options),JSON.stringify({key:q.correct_key}),
          q.explanation.trim(),Number(q.marks),topicRows[0].id,sourceResult.rows[0].id,'school-topic:'+lesson.id,req.user!.id]);
        ids.push(inserted[0].id);
      }
      return {draft_question_ids:ids,review_status:'draft',count:ids.length,source:sourceResult.rows[0].source_name};
    });
    if('error' in saved) return res.status(409).json({error:saved.error});
    return res.status(201).json({...saved,message:'Questions are saved as drafts. An authorised subject reviewer must approve them before they can be used in an examination.'});
  }catch(error:any){
    console.error('[online-exams] question draft persistence failed',error);
    return res.status(500).json({error:'Could not save generated examination-question drafts.'});
  }
});

router.post('/admin/exams/generate-package-drafts',requireRole('admin'),async(req,res)=>{
  const schoolCode=schoolForAdmin(req.user);
  const body=req.body??{};
  const lessonIds=body.lesson_ids;
  if(!schoolCode) return res.status(400).json({error:'Select a school before generating examination questions.'});
  if(!BOARDS.has(body.board)||!['SS 1','SS 2','SS 3'].includes(body.class_name)||
     typeof body.subject_name!=='string'||!body.subject_name.trim()||
     !Array.isArray(lessonIds)||lessonIds.length<1||lessonIds.length>12||
     !lessonIds.every((id:any)=>typeof id==='string'&&id.length>0&&id.length<=200)||
     new Set(lessonIds).size!==lessonIds.length){
    return res.status(400).json({error:'Provide a supported SS1–SS3 class, board, subject and 1–12 unique package lesson IDs.'});
  }
  const lessons=body.class_name==='SS 1'
    ? listStudentSs1Lessons(body.subject_name).filter((lesson:any)=>lessonIds.includes(lesson.id))
    : listStudentSs23Units(body.class_name,body.subject_name).filter((lesson:any)=>lessonIds.includes(lesson.id));
  if(lessons.length!==lessonIds.length) return res.status(409).json({error:'One or more lessons are not in an implemented, student-deliverable syllabus package for this class and subject.'});
  const candidates=await query('SELECT id FROM students WHERE school_code=$1 AND class_name=$2 AND deleted_at IS NULL',[schoolCode,body.class_name]);
  if(!candidates.rows.length) return res.status(409).json({error:'No active candidates are enrolled in this class.'});
  const candidateIds=candidates.rows.map((r:any)=>r.id);
  const lessonKeys=lessons.map((lesson:any)=>body.class_name==='SS 1'?ss1LessonKey(lesson):ss23LessonKey(lesson));
  const {rows: progress}=await query(`
    SELECT COUNT(DISTINCT (student_id,lesson_key))::int AS completed_pairs
      FROM student_curriculum_lesson_progress
     WHERE student_id=ANY($1::uuid[]) AND lesson_key=ANY($2::text[]) AND class_name=$3
  `,[candidateIds,lessonKeys,body.class_name]);
  if(Number(progress[0]?.completed_pairs)!==candidateIds.length*lessonKeys.length){
    return res.status(409).json({error:'Every selected package lesson must be completed by every currently enrolled candidate before exam questions can be generated.'});
  }
  const {rows: sourceRows}=await query(`
    SELECT id,source_name FROM question_bank_sources
     WHERE board='GENERAL' AND access_method='original_generated'
       AND rights_status='original_generated' AND is_active=true ORDER BY created_at LIMIT 1
  `);
  if(!sourceRows[0]) return res.status(409).json({error:'The registered original-generated question source is unavailable.'});
  const drafts:any[]=[];
  try{
    for(let i=0;i<lessons.length;i++){
      const lesson=lessons[i];
      const contentText=String(lesson.body??'').trim();
      const objectives=Array.isArray(lesson.objectives)?lesson.objectives:[];
      if(contentText.length<80||!objectives.length) throw new Error('A selected syllabus lesson has insufficient approved teaching content or learning objectives.');
      const prompt=`Create 3 original ${body.board} examination-standard multiple-choice questions for ${body.class_name} ${body.subject_name}. Use ONLY the approved lesson text and objectives below. Do not introduce other syllabus topics, general knowledge or copied past-paper wording. Four plausible options, one correct answer, age-appropriate and unambiguous.\nLesson: ${lesson.title}\nObjectives: ${JSON.stringify(objectives)}\nLesson text:\n${contentText.slice(0,14000)}\nReturn JSON {"questions":[{"stem":"...","options":[{"key":"A","text":"..."},{"key":"B","text":"..."},{"key":"C","text":"..."},{"key":"D","text":"..."}],"correct_key":"A","explanation":"...","marks":1}]}`;
      const result:any=await generateJSON(prompt,'generate-questions',{userId:req.user!.id,role:req.user!.role});
      if(!Array.isArray(result?.questions)||result.questions.length!==3) throw new Error('AI returned an incomplete question set.');
      for(const q of result.questions){
        if(!q||typeof q.stem!=='string'||q.stem.trim().length<12||
           !Array.isArray(q.options)||q.options.length!==4||
           !q.options.every((o:any)=>o&&typeof o.key==='string'&&typeof o.text==='string'&&o.text.trim())||
           !q.options.some((o:any)=>o.key===q.correct_key)||
           typeof q.explanation!=='string'||q.explanation.trim().length<10||
           !Number.isFinite(Number(q.marks))||Number(q.marks)<=0||Number(q.marks)>10)
          throw new Error('Generated question failed answer/options/marks validation.');
        drafts.push({lesson,lessonKey:lessonKeys[i],q});
      }
    }
  }catch(error:any){return res.status(502).json({error:error?.message??'Could not generate questions from the selected package lessons.'});}
  try{
    const saved=await withTransaction(async client=>{
      const subjectName=body.subject_name.trim();
      let {rows: subjects}=await client.query('SELECT id FROM question_bank_subjects WHERE name=$1',[subjectName]);
      if(!subjects[0]){
        const code=subjectName.toUpperCase().replace(/[^A-Z0-9]+/g,'_').replace(/^_|_$/g,'').slice(0,35)||'SUBJECT';
        await client.query('INSERT INTO question_bank_subjects(code,name) VALUES($1,$2) ON CONFLICT(code) DO NOTHING',[code,subjectName]);
        ({rows:subjects}=await client.query('SELECT id FROM question_bank_subjects WHERE name=$1',[subjectName]));
        if(!subjects[0]) return {error:'Question-bank subject code collision requires admin taxonomy reconciliation.'};
      }
      const ids:string[]=[];
      for(const item of drafts){
        const lesson=item.lesson;
        const slug=String(lesson.title).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,100)||'package-lesson';
        let {rows: topics}=await client.query('SELECT id FROM question_bank_topics WHERE subject_id=$1 AND slug=$2',[subjects[0].id,slug]);
        if(!topics[0]) ({rows:topics}=await client.query('INSERT INTO question_bank_topics(subject_id,slug,name,description) VALUES($1,$2,$3,$4) RETURNING id',
          [subjects[0].id,slug,lesson.title,lesson.body.slice(0,1000)]));
        const locator=JSON.stringify({kind:'package_lesson',class_name:body.class_name,lesson_key:item.lessonKey,lesson_id:lesson.id,
          lesson_sources:lesson.provenance??[]});
        const {rows: inserted}=await client.query(`
          INSERT INTO question_bank_questions(board,exam_year,subject_id,paper,question_number,question_type,stem,options,correct_answer,explanation,marks,topic_id,source_id,source_locator,content_origin,rights_status,review_status,created_by)
          VALUES($1,NULL,$2,'Original practice — not a past paper',$3,'mcq',$4,$5::jsonb,$6::jsonb,$7,$8,$9,$10,$11,'ai_generated','original_generated','draft',$12)
          RETURNING id
        `,[body.board,subjects[0].id,'AI-GEN-'+randomUUID().slice(0,8).toUpperCase(),item.q.stem.trim(),
          JSON.stringify(item.q.options),JSON.stringify({key:item.q.correct_key}),item.q.explanation.trim(),Number(item.q.marks),
          topics[0].id,sourceRows[0].id,locator,req.user!.id]);
        ids.push(inserted[0].id);
      }
      return {draft_question_ids:ids,count:ids.length,review_status:'draft',source:sourceRows[0].source_name};
    });
    if('error' in saved) return res.status(409).json({error:saved.error});
    return res.status(201).json({...saved,message:'Original questions are saved as drafts and must be subject-approved before use.'});
  }catch(error:any){console.error('[online-exams] package question draft save failed',error);return res.status(500).json({error:'Could not save generated package examination drafts.'});}
});

router.post('/admin/exams', requireRole('admin'), async (req, res) => {
  const user = req.user!;
  const schoolCode = schoolForAdmin(user);
  const b = req.body ?? {};
  if (!schoolCode) return res.status(400).json({ error: 'Select a school before creating an examination.' });
  if (!BOARDS.has(b.board) || !EXAM_CLASSES.has(b.class_name) ||
      typeof b.subject_name !== 'string' || !b.subject_name.trim() || b.subject_name.trim().length>200 ||
      typeof b.examination_type !== 'string' || b.examination_type.trim().length < 2 || b.examination_type.trim().length>80 ||
      typeof b.title !== 'string' || b.title.trim().length < 3 || b.title.trim().length>255 ||
      typeof b.instructions !== 'string' || !b.instructions.trim() || b.instructions.trim().length>8000 ||
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
    if (!section || typeof section.title !== 'string' || !section.title.trim() || section.title.trim().length>120 ||
        !Array.isArray(section.questions) || section.questions.length < 1 || section.questions.length > 100) {
      return res.status(400).json({ error: 'Each section requires a title and 1–100 questions.' });
    }
    for (let qi=0; qi<section.questions.length; qi++) {
      const item=section.questions[qi];
      if (!item || typeof item.question_id !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(item.question_id) ||
          (item.marks != null && (!Number.isFinite(Number(item.marks)) || Number(item.marks)<=0 || Number(item.marks)>100))) {
        return res.status(400).json({ error: 'Each question requires a valid question_id and positive marks.' });
      }
      allItems.push({ ...item, sectionIndex:si, questionIndex:qi, sectionTitle:section.title.trim() });
    }
  }
  const ids=allItems.map(x=>x.question_id);
  if (allItems.length>200) return res.status(400).json({error:'An examination may contain no more than 200 questions.'});
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
        const itemMarks=Number(item.marks??q.marks);
        if(q.question_type!=='mcq'){
          const rubric=validateMarkingRubric(item.marking_rubric,itemMarks);
          if(!rubric) return {error:'Every written-response question requires a marking_rubric whose criterion marks add up exactly to the question marks.',status:400};
          item.marking_rubric=rubric;
        }
        if(q.board!==b.board || !['GENERAL',b.board].includes(q.source_board) ||
           !['licensed','public_domain','original_generated'].includes(q.rights_status) ||
           q.rights_status!==q.source_rights || typeof q.rights_evidence!=='string' || q.rights_evidence.trim().length<12 ||
           (q.content_origin==='past_question' && (!['licensed','public_domain'].includes(q.source_rights) || !q.exam_year)) ||
           (q.content_origin!=='past_question' && q.source_rights!=='original_generated')){
          return {error:'Question board/provenance or documented reuse rights are invalid for this examination.',status:400};
        }
      }
      const {rows: created}=await client.query(`
        INSERT INTO online_exams(school_code,subject_id,subject_name,class_name,board,examination_type,exam_year,title,instructions,duration_minutes,starts_at,ends_at,created_by)
        VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING id,title,status
      `,[schoolCode,subjects[0].id,subjects[0].name,b.class_name,b.board,b.examination_type.trim(),b.exam_year??null,
        b.title.trim(),b.instructions.trim(),b.duration_minutes,startsAt.toISOString(),endsAt.toISOString(),user.id]);
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
          exam_year:q.exam_year,source_id:q.source_id,source_name:q.source_name,source_url:q.source_url,rights_evidence:q.rights_evidence,
          source_locator:q.source_locator,session_exam_year:b.exam_year??null,covered_topic_id:parseLessonLocator(q.source_locator)?.kind==='school_topic'?parseLessonLocator(q.source_locator)?.topic_id:null,covered_lesson_key:parseLessonLocator(q.source_locator)?.kind==='package_lesson'?parseLessonLocator(q.source_locator)?.lesson_key:null,covered_lesson_class:parseLessonLocator(q.source_locator)?.kind==='package_lesson'?parseLessonLocator(q.source_locator)?.class_name:null,lesson_sources:parseLessonLocator(q.source_locator)?.lesson_sources??null,rights_status:q.rights_status,content_origin:q.content_origin,paper:q.paper,question_number:q.question_number};
        const snapshot={stem:q.stem,question_type:q.question_type,options:q.options,correct_answer:q.correct_answer,
          explanation:q.explanation,marking_rubric:item.marking_rubric??null,topic_id:q.topic_id,topic_name:q.topic_name??null};
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
    if('error' in result) return res.status(400).json({error:result.error});
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
    if(new Date(exam.ends_at).getTime()<=Date.now()) return {status:409,error:'An examination whose end time has passed cannot be published.'};
    const {rows: generatedTopics}=await client.query(`
      SELECT DISTINCT (provenance->>'covered_topic_id')::integer AS topic_id
        FROM online_exam_questions
       WHERE exam_id=$1 AND provenance->>'covered_topic_id' IS NOT NULL
    `,[exam.id]);
    const coveredTopicIds=generatedTopics.map((row:any)=>Number(row.topic_id));
    if(coveredTopicIds.length){
      const {rows: coverage}=await client.query(`
        SELECT COUNT(*)::int AS candidates,
               COUNT(*) FILTER (WHERE NOT EXISTS (
                 SELECT 1 FROM unnest($3::int[]) AS required(topic_id)
                  WHERE NOT EXISTS (
                    SELECT 1 FROM topic_completions tc
                     WHERE tc.student_id=st.id AND tc.topic_id=required.topic_id
                  )
               ))::int AS completed
          FROM students st
         WHERE st.school_code=$1 AND st.class_name=$2 AND st.deleted_at IS NULL
      `,[exam.school_code,exam.class_name,coveredTopicIds]);
      if(Number(coverage[0]?.completed)!==Number(coverage[0]?.candidates)){
        return {status:409,error:'One or more current candidates have not completed every lesson used to generate this examination. Update the exam coverage before publishing.'};
      }
    }
    const {rows: packageRefs}=await client.query(`
      SELECT DISTINCT provenance->>'covered_lesson_key' AS lesson_key,
                      provenance->>'covered_lesson_class' AS lesson_class
        FROM online_exam_questions
       WHERE exam_id=$1 AND provenance->>'covered_lesson_key' IS NOT NULL
    `,[exam.id]);
    for(const ref of packageRefs){
      if(ref.lesson_class!==exam.class_name) return {status:409,error:'Generated package lesson class does not match the examination class.'};
      const {rows: coverage}=await client.query(`
        SELECT COUNT(DISTINCT st.id)::int AS completed
          FROM students st
          JOIN student_curriculum_lesson_progress p
            ON p.student_id=st.id AND p.class_name=$2 AND p.lesson_key=$3
         WHERE st.school_code=$1 AND st.class_name=$2 AND st.deleted_at IS NULL
      `,[exam.school_code,exam.class_name,ref.lesson_key]);
      if(Number(coverage[0]?.completed)!==candidates.length)
        return {status:409,error:'Every current candidate must have completed each SS1–SS3 package lesson used for generated questions before publication.'};
    }
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
  if('error' in result) return res.status(400).json({error:result.error});
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
           a.id AS attempt_id,a.status AS attempt_status,a.deadline_at,a.submitted_at,a.score
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
    if(['submitted','under_review'].includes(attempt.status)) return {status:409,error:'This examination attempt is already closed.',attempt_id:attempt.id};
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
  if(!['in_progress','expired','submitting'].includes(attempt.status)) return res.status(409).json({error:'This attempt is no longer in progress.',status:attempt.status});
  if(attempt.status==='submitting' && attempt.submission_started_at && Date.now()-new Date(attempt.submission_started_at).getTime()<120000)
    return res.status(409).json({error:'Submission is still being processed. Retry recovery shortly.',status:attempt.status});
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
  const claimed:any=await withTransaction(async client=>{
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
    const snapshot=q.question_snapshot;
    if(!saved){
      graded.push({id:q.id,awarded:0,marking:'auto_marked',feedback:'No response submitted; zero marks awarded.',
        confidence:1,details:{method:'unanswered',criterion_scores:[]}});
      continue;
    }
    let awarded:number|null=0, marking='auto_marked', feedback:string|null=null, confidence:number|null=null;
    let details:any={method:'objective_key'};
    if(snapshot.question_type==='mcq'){
      const correct=snapshot.correct_answer;
      const expected=typeof correct==='string'?correct:(correct?.key??correct?.value??'');
      const actual=typeof saved.response==='string'?saved.response:(saved.response?.key??saved.response?.value??'');
      const isCorrect=clean(actual)===clean(expected);
      awarded=isCorrect?Number(q.marks):0;
      feedback=(isCorrect?'Correct. ':'Incorrect. ')+String(snapshot.explanation??'Review the lesson and the worked examples.');
      confidence=1;
      details={method:'objective_key',is_correct:isCorrect};
    } else {
      const rubric=Array.isArray(snapshot.marking_rubric)?snapshot.marking_rubric:[];
      try{
        if(!rubric.length) throw new Error('No approved marking rubric is attached to this written-response question.');
        const prompt=[
          'Mark the candidate response strictly against the supplied criterion-by-criterion rubric. Do not award credit for unsupported claims.',
          'The criterion scores must sum to the total points. If evidence is insufficient, set confidence below 0.75.',
          'Question: '+snapshot.stem,
          'Expected answer/reference: '+JSON.stringify(snapshot.correct_answer),
          'Marking guidance: '+snapshot.explanation,
          'Rubric: '+JSON.stringify(rubric),
          'Candidate response: '+(typeof saved.response==='string'?saved.response:JSON.stringify(saved.response)),
          'Maximum marks: '+q.marks,
          'Return JSON: {"points":number,"confidence":number_between_0_and_1,"feedback":"evidence-based feedback","criterion_scores":[{"criterion_id":"rubric id","points":number,"rationale":"evidence from response"}]}'
        ].join('\\n');
        const raw:any=await generateJSON(prompt,'essay-mark',{userId:req.user!.id,role:req.user!.role});
        const marked=validateAiRubricMark(raw,rubric,Number(q.marks));
        if(!marked) throw new Error('AI marking output did not satisfy the rubric contract.');
        confidence=marked.confidence;
        feedback=marked.feedback;
        details={method:'ai_rubric',criterion_scores:marked.criterion_scores};
        if(marked.confidence<0.75){
          awarded=null; marking='pending_review'; pending=true;
          feedback='AI confidence is below the review threshold. '+marked.feedback;
        } else {
          awarded=marked.points; marking='ai_marked';
        }
      }catch{
        awarded=null; marking='pending_review'; pending=true;
        feedback='This written response requires examiner review because automated rubric marking was unavailable or inconclusive.';
        details={method:'manual_review_required',criterion_scores:[]};
      }
    }
    if(awarded!=null) score+=awarded;
    graded.push({id:q.id,awarded,marking,feedback,confidence,details});
  }
  const final=await withTransaction(async client=>{
    for(const item of graded){
      await client.query(`
        UPDATE online_exam_responses SET awarded_marks=$3,marking_status=$4,feedback=$5,
          marking_confidence=$6,marking_details=$7::jsonb
         WHERE attempt_id=$1 AND exam_question_id=$2
      `,[claimed.attempt.id,item.id,item.awarded,item.marking,item.feedback,item.confidence,JSON.stringify(item.details??{})]);
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

router.get('/admin/exams',requireRole('admin'),async(req,res)=>{
  const schoolCode=schoolForAdmin(req.user);
  if(!schoolCode) return res.status(400).json({error:'Select a school before listing examinations.'});
  const {rows}=await query(`
    SELECT e.id,e.title,e.subject_name,e.class_name,e.board,e.examination_type,e.exam_year,
           e.status,e.starts_at,e.ends_at,e.duration_minutes,e.published_at,
           COUNT(DISTINCT q.id)::int AS question_count,
           COUNT(DISTINCT c.student_id)::int AS candidate_count,
           COUNT(DISTINCT a.id)::int AS attempt_count
      FROM online_exams e
      LEFT JOIN online_exam_questions q ON q.exam_id=e.id
      LEFT JOIN online_exam_candidates c ON c.exam_id=e.id
      LEFT JOIN online_exam_attempts a ON a.exam_id=e.id
     WHERE e.school_code=$1
     GROUP BY e.id
     ORDER BY e.starts_at DESC,e.created_at DESC
     LIMIT 200
  `,[schoolCode]);
  return res.json({exams:rows});
});

router.get('/admin/exams/:examId/attempts',requireRole('admin'),async(req,res)=>{
  const schoolCode=schoolForAdmin(req.user);
  if(!schoolCode) return res.status(400).json({error:'Select a school before viewing examination attempts.'});
  const {rows: examRows}=await query('SELECT id,title,class_name FROM online_exams WHERE id=$1 AND school_code=$2',[req.params.examId,schoolCode]);
  if(!examRows[0]) return res.status(404).json({error:'Examination not found in the selected school.'});
  const {rows}=await query(`
    SELECT c.student_id,u.username,a.id AS attempt_id,a.status,a.started_at,a.submitted_at,
           a.score,a.total_marks,a.percentage,
           (SELECT COUNT(*)::int FROM online_exam_responses r WHERE r.attempt_id=a.id AND r.marking_status='pending_review') AS pending_reviews
      FROM online_exam_candidates c
      JOIN students s ON s.id=c.student_id
      LEFT JOIN users u ON u.id=s.user_id
      LEFT JOIN online_exam_attempts a ON a.exam_id=c.exam_id AND a.student_id=c.student_id
     WHERE c.exam_id=$1 ORDER BY u.username NULLS LAST,c.student_id
  `,[req.params.examId]);
  return res.json({exam:examRows[0],attempts:rows});
});

router.get('/admin/attempts/:attemptId/responses',requireRole('admin'),async(req,res)=>{
  const schoolCode=schoolForAdmin(req.user);
  if(!schoolCode) return res.status(400).json({error:'Select a school before reviewing examination responses.'});
  const {rows: attempts}=await query(`
    SELECT a.id,a.status,a.score,a.total_marks,e.id AS exam_id,e.title,e.school_code
      FROM online_exam_attempts a JOIN online_exams e ON e.id=a.exam_id
     WHERE a.id=$1 AND e.school_code=$2
  `,[req.params.attemptId,schoolCode]);
  if(!attempts[0]) return res.status(404).json({error:'Examination attempt not found in the selected school.'});
  const {rows}=await query(`
    SELECT q.id AS question_id,q.question_snapshot->>'stem' AS stem,q.marks,
           q.question_snapshot->>'question_type' AS question_type,q.question_snapshot->'options' AS options,
           q.question_snapshot->'correct_answer' AS correct_answer,q.question_snapshot->'marking_rubric' AS marking_rubric,
           r.response,r.awarded_marks,r.marking_status,r.feedback,r.marking_confidence,r.marking_details
      FROM online_exam_questions q
      JOIN online_exam_sections s ON s.id=q.section_id
      LEFT JOIN online_exam_responses r ON r.exam_question_id=q.id AND r.attempt_id=$1
     WHERE q.exam_id=$2 ORDER BY s.position,q.position
  `,[req.params.attemptId,attempts[0].exam_id]);
  return res.json({attempt:attempts[0],responses:rows});
});

router.put('/admin/attempts/:attemptId/responses/:questionId/mark',requireRole('admin'),async(req,res)=>{
  const schoolCode=schoolForAdmin(req.user);
  if(!schoolCode) return res.status(400).json({error:'Select a school before marking online examination responses.'});
  const awarded=Number(req.body?.awarded_marks);
  const feedback=typeof req.body?.feedback==='string'?req.body.feedback.trim():'';
  if(!Number.isFinite(awarded)||awarded<0||awarded>100||feedback.length>2000)
    return res.status(400).json({error:'Provide awarded_marks from 0 to 100 and optional feedback up to 2,000 characters.'});
  const result:any=await withTransaction(async client=>{
    const {rows: attempts}=await client.query(`
      SELECT a.*,e.school_code FROM online_exam_attempts a
      JOIN online_exams e ON e.id=a.exam_id
     WHERE a.id=$1 AND e.school_code=$2 FOR UPDATE OF a
    `,[req.params.attemptId,schoolCode]);
    const attempt=attempts[0];
    if(!attempt) return {status:404,error:'Examination attempt not found in the selected school.'};
    if(attempt.status!=='under_review') return {status:409,error:'Only attempts awaiting written-response review can be manually marked.'};
    const {rows: responses}=await client.query(`
      SELECT r.exam_question_id,r.marking_status,q.marks FROM online_exam_responses r
      JOIN online_exam_questions q ON q.id=r.exam_question_id
     WHERE r.attempt_id=$1 AND r.exam_question_id=$2 FOR UPDATE OF r
    `,[attempt.id,req.params.questionId]);
    const response=responses[0];
    if(!response) return {status:404,error:'Saved response not found.'};
    if(response.marking_status!=='pending_review') return {status:409,error:'Only responses pending manual review can be marked here.'};
    if(awarded>Number(response.marks)) return {status:400,error:'Awarded marks cannot exceed this question’s available marks.'};
    await client.query(`
      UPDATE online_exam_responses SET awarded_marks=$3,marking_status='manual_marked',feedback=$4,
        marking_confidence=NULL,marking_details=$5::jsonb
       WHERE attempt_id=$1 AND exam_question_id=$2
    `,[attempt.id,response.exam_question_id,awarded,feedback||null,JSON.stringify({method:'manual_examiner',awarded_marks:awarded})]);
    const {rows: totals}=await client.query(`
      SELECT COALESCE(SUM(COALESCE(awarded_marks,0)),0) AS score,
             COUNT(*) FILTER (WHERE marking_status='pending_review')::int AS pending
        FROM online_exam_responses WHERE attempt_id=$1
    `,[attempt.id]);
    const pending=Number(totals[0].pending)>0;
    const score=Number(totals[0].score);
    const status=pending?'under_review':'submitted';
    const percentage=pending?null:(Number(attempt.total_marks)?score/Number(attempt.total_marks)*100:0);
    const {rows: updated}=await client.query(`
      UPDATE online_exam_attempts SET status=$2,score=$3,percentage=$4,
        submitted_at=CASE WHEN $2='submitted' THEN COALESCE(submitted_at,now()) ELSE submitted_at END
       WHERE id=$1 RETURNING id,status,score,total_marks,percentage,submitted_at
    `,[attempt.id,status,score,percentage]);
    await client.query(`
      INSERT INTO online_exam_audit_events(exam_id,attempt_id,actor_user_id,event_type,details)
      VALUES($1,$2,$3,'manual_response_marked',$4::jsonb)
    `,[attempt.exam_id,attempt.id,req.user!.id,JSON.stringify({question_id:response.exam_question_id,awarded_marks:awarded,remaining_reviews:totals[0].pending})]);
    return {status:200,attempt:updated[0]};
  });
  if(result.status!==200) return res.status(result.status).json({error:result.error});
  return res.json(result);
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
    SELECT q.id,q.question_snapshot->>'stem' AS stem,r.response,r.awarded_marks,r.marking_status,r.feedback,r.marking_confidence,r.marking_details,q.marks
      FROM online_exam_questions q
      JOIN online_exam_sections s ON s.id=q.section_id
      LEFT JOIN online_exam_responses r
        ON r.exam_question_id=q.id AND r.attempt_id=$1
     WHERE q.exam_id=(SELECT exam_id FROM online_exam_attempts WHERE id=$1)
     ORDER BY s.position,q.position
  `,[req.params.attemptId]);
  return res.json({attempt:rows[0],responses:answers});
});

export default router;
