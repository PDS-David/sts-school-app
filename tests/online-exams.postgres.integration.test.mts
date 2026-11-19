import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash, randomUUID } from 'node:crypto';
import { createRequire } from 'node:module';

const require=createRequire(new URL('../backend/package.json',import.meta.url));
const pg=require('pg');
const connectionString=process.env.TEST_DATABASE_URL;

test('PostgreSQL 18 migrations and live API: rights approval, eligibility, ownership, timer, autosave, duplicate submit and physical-data isolation',
  {skip:!connectionString?'TEST_DATABASE_URL is not configured (dedicated disposable PostgreSQL database required).':false},
  async()=>{
    const client=new pg.Client({connectionString});
    await client.connect();
    const schema='exam_it_'+randomUUID().replace(/-/g,'');
    let server:any=null;
    let pool:any=null;
    try{
      await client.query('CREATE SCHEMA '+schema);
      await client.query('SET search_path TO '+schema);
      await client.query('CREATE TABLE public.learning_access_settings(id INTEGER PRIMARY KEY,free_launch_mode BOOLEAN,term_pin_enforced BOOLEAN,curriculum_sequence_enforced BOOLEAN)');
      await client.query('INSERT INTO public.learning_access_settings VALUES(1,true,false,false)');
      await client.query('CREATE EXTENSION IF NOT EXISTS pgcrypto');
      await client.query('CREATE TABLE schools(code TEXT PRIMARY KEY)');
      await client.query(`CREATE TABLE users(
        id UUID PRIMARY KEY,username TEXT,role TEXT,school_code TEXT,assigned_class TEXT,
        assigned_class_names TEXT[] DEFAULT '{}',can_manage_all_schools BOOLEAN DEFAULT false,
        is_active BOOLEAN DEFAULT true,access_expires_at TIMESTAMPTZ,revocation_reason TEXT,
        pending_admin_review BOOLEAN DEFAULT false)`);
      await client.query('CREATE TABLE students(id UUID PRIMARY KEY,user_id UUID,school_code TEXT,class_name TEXT,deleted_at TIMESTAMPTZ)');
      await client.query('CREATE TABLE topics(id INTEGER PRIMARY KEY,school_code TEXT,class_name TEXT,subject_id INTEGER,title TEXT,term_id INTEGER,order_index INTEGER,description TEXT,summary TEXT)');
      await client.query('CREATE TABLE subjects(id INTEGER PRIMARY KEY,name TEXT,school_code TEXT)');
      await client.query('CREATE TABLE topic_completions(student_id UUID,topic_id INTEGER)');
      await client.query(`CREATE TABLE student_curriculum_lesson_progress(student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,lesson_key TEXT NOT NULL CHECK(length(lesson_key) BETWEEN 1 AND 240),class_name TEXT NOT NULL CHECK(class_name IN ('SS 1','SS 2','SS 3')),subject_name TEXT NOT NULL,term_label TEXT NOT NULL,lesson_title TEXT NOT NULL,completed_at TIMESTAMPTZ NOT NULL DEFAULT now(),PRIMARY KEY(student_id,lesson_key))`);
      await client.query('CREATE TABLE teacher_subjects(user_id UUID,subject_id INTEGER)');
      await client.query('CREATE TABLE scores(id BIGINT PRIMARY KEY,score NUMERIC)');
      await client.query('CREATE TABLE attendance(id BIGINT PRIMARY KEY,present BOOLEAN)');
      await client.query('CREATE TABLE report_remarks(id BIGINT PRIMARY KEY,remark TEXT)');
      await client.query('CREATE TABLE report_cards(id BIGINT PRIMARY KEY,payload TEXT)');
      await client.query("CREATE TABLE report_roster_memberships(student_id UUID PRIMARY KEY REFERENCES students(id) ON DELETE RESTRICT,class_name TEXT NOT NULL,source_class_name TEXT NOT NULL,status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active','removed')),joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),removed_at TIMESTAMPTZ,changed_by UUID REFERENCES users(id) ON DELETE SET NULL,updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),CHECK((status='active' AND removed_at IS NULL) OR (status='removed' AND removed_at IS NOT NULL)))");
      await client.query("INSERT INTO scores VALUES(1,72)");
      await client.query("INSERT INTO attendance VALUES(1,true)");
      await client.query("INSERT INTO report_remarks VALUES(1,'unchanged')");
      await client.query("INSERT INTO report_cards VALUES(1,'unchanged')");

      const questionBankSql=await readFile(new URL('../backend/migrations/0012_online_question_bank.sql',import.meta.url),'utf8');
      const classPracticeSql=await readFile(new URL('../backend/migrations/0013_ai_class_practice.sql',import.meta.url),'utf8');
      const examSql=await readFile(new URL('../backend/migrations/0014_formal_online_examinations.sql',import.meta.url),'utf8');
      const markingSql=await readFile(new URL('../backend/migrations/0015_online_exam_marking_confidence.sql',import.meta.url),'utf8');
      const reviewSql=await readFile(new URL('../backend/migrations/0016_question_bank_subject_reviews.sql',import.meta.url),'utf8');
      await client.query(questionBankSql);
      await client.query(classPracticeSql);
      await client.query(examSql);
      await client.query(markingSql);
      await client.query(reviewSql);
      const {rows: reviewTable}=await client.query(`SELECT to_regclass('question_bank_question_reviews') AS table_name`);
      assert.ok(reviewTable[0].table_name);
      const {rows: markingColumns}=await client.query(`SELECT column_name FROM information_schema.columns WHERE table_schema=$1 AND table_name='online_exam_responses' AND column_name IN ('marking_confidence','marking_details')`,[schema]);
      assert.deepEqual(markingColumns.map((row:any)=>row.column_name).sort(),['marking_confidence','marking_details']);

      const school='primary',foreignSchool='secondary',admin=randomUUID(),foreignAdmin=randomUUID(),studentUser=randomUUID(),otherUser=randomUUID(),teacherUser=randomUUID(),unassignedTeacher=randomUUID();
      const student=randomUUID(),otherStudent=randomUUID(),unrosteredStudent=randomUUID(),unrosteredUser=randomUUID(),ss1Student=randomUUID(),ss1User=randomUUID();
      await client.query('INSERT INTO schools(code) VALUES($1),($2)',[school,foreignSchool]);
      await client.query(`INSERT INTO users(id,username,role,school_code,can_manage_all_schools,is_active) VALUES
        ($1,'test-admin','admin',$3,true,true),($2,'test-student','student',$3,false,true),($4,'secondary-admin','admin',$5,true,true)`,[admin,studentUser,school,foreignAdmin,foreignSchool]);
      await client.query('INSERT INTO users(id,username,role,school_code,is_active) VALUES($1,$2,$3,$4,true),($5,$6,$7,$4,true),($8,$9,$10,$4,true),($11,$12,$13,$4,true)',[otherUser,'other-student','student',school,teacherUser,'math-teacher','teacher',unrosteredUser,'unrostered-student','student',ss1User,'ss1-student','student']);
      await client.query('INSERT INTO users(id,username,role,school_code,is_active) VALUES($1,$2,$3,$4,true)',[unassignedTeacher,'unassigned-teacher','teacher',school]);
      await client.query("INSERT INTO subjects(id,name,school_code) VALUES(1,'Mathematics',$1),(2,'Biology',$1)",[school]);
      await client.query('INSERT INTO teacher_subjects(user_id,subject_id) VALUES($1,1)',[teacherUser]);
      await client.query('INSERT INTO students(id,user_id,school_code,class_name) VALUES($1,$2,$3,$4),($5,$6,$3,$7),($8,$9,$3,$4),($10,$11,$3,$12)',
        [student,studentUser,school,'SS 3',otherStudent,otherUser,'JSS 3',unrosteredStudent,unrosteredUser,ss1Student,ss1User,'SS 1']);
      await client.query("INSERT INTO report_roster_memberships(student_id,class_name,source_class_name,status) VALUES($1,'SS 3','SS 3','active')",[student]);
      await client.query("INSERT INTO report_roster_memberships(student_id,class_name,source_class_name,status) VALUES($1,'SS 1','SS 1','active')",[ss1Student]);
      const coveredTopicId=900;
      await client.query("INSERT INTO topics(id,school_code,class_name,subject_id,title,term_id,order_index) VALUES($1,$2,'SS 3',1,'Linear Equations',1,1)",[coveredTopicId,school]);
      await client.query('INSERT INTO topic_completions(student_id,topic_id) VALUES($1,$2),($3,$2)',[student,coveredTopicId,unrosteredStudent]);

      const {rows: subjectRows}=await client.query("SELECT id FROM question_bank_subjects WHERE code='MATHEMATICS'");
      const {rows: questionRows}=await client.query("SELECT id FROM question_bank_questions WHERE question_number='AI-GEN-001' AND board='WAEC'");
      assert.ok(subjectRows[0]);assert.ok(questionRows[0]);
      const questionId=questionRows[0].id;
      const essayQuestionId=randomUUID();
      const {rows:generatedSources}=await client.query("SELECT id FROM question_bank_sources WHERE rights_status='original_generated' ORDER BY created_at LIMIT 1");
      const {rows:bankTopics}=await client.query('SELECT id FROM question_bank_topics WHERE subject_id=$1 ORDER BY name LIMIT 1',[subjectRows[0].id]);
      assert.ok(generatedSources[0]&&bankTopics[0]);
      await client.query(`
        INSERT INTO question_bank_questions(
          id,source_id,board,subject_id,topic_id,paper,question_number,question_type,stem,options,
          correct_answer,explanation,marks,content_origin,rights_status,review_status,created_by
        ) VALUES($1,$2,'WAEC',$3,$4,'Original practice — not a past paper','AI-GEN-ESSAY-001',
          'essay',$5,NULL,$6::jsonb,$7,5,'ai_generated','original_generated','reviewed',$8)
      `,[essayQuestionId,generatedSources[0].id,subjectRows[0].id,bankTopics[0].id,
        'Explain how a linear equation is solved and justify each step.',
        JSON.stringify({reference:'Isolate the variable using inverse operations.'}),
        'Award marks for a correct method and a justified solution.',admin]);
      const dbGuardExam=randomUUID(),dbGuardSection=randomUUID();
      await client.query(`INSERT INTO online_exams(id,school_code,subject_id,subject_name,class_name,board,examination_type,title,instructions,duration_minutes,starts_at,ends_at,created_by)
        VALUES($1,$2,$3,'Mathematics','SS 3','WAEC','Mock','Rights guard test','Test rights trigger.',30,now(),now()+interval '1 hour',$4)`,
        [dbGuardExam,school,subjectRows[0].id,admin]);
      await client.query('INSERT INTO online_exam_sections(id,exam_id,title,position) VALUES($1,$2,$3,0)',[dbGuardSection,dbGuardExam,'Section A']);
      await assert.rejects(
        client.query(`INSERT INTO online_exam_questions(exam_id,section_id,question_bank_question_id,position,marks,question_snapshot,provenance)
          VALUES($1,$2,$3,0,1,'{"stem":"Not approved yet","question_type":"mcq"}','{}')`,
          [dbGuardExam,dbGuardSection,questionId]),
        (err:any)=>err.code==='P0001'
      );
      await client.query('DELETE FROM online_exams WHERE id=$1',[dbGuardExam]);

      const dbUrl=new URL(connectionString);
      dbUrl.searchParams.set('options','-c search_path='+schema);
      process.env.DATABASE_URL=dbUrl.toString();
      process.env.JWT_SECRET='online-exam-integration-test-secret';
      process.env.JWT_REFRESH_SECRET='online-exam-integration-refresh-secret';
      process.env.FREE_LAUNCH_MODE='true';
      process.env.NODE_ENV='test';
      process.env.GEMINI_API_KEY='';
      process.env.AI_AGENT_SERVICE_URL='';
      const express=require('express');
      const [{default:router,validateMarkingRubric,validateAiRubricMark},{default:questionBankRouter},{signAccess},{pool:databasePool},{listStudentSs1Lessons}]=await Promise.all([
        import('../backend/src/routes/onlineExams.ts'),
        import('../backend/src/routes/questionBank.ts'),
        import('../backend/src/utils/jwt.ts'),
        import('../backend/src/db/pool.ts'),
        import('../backend/src/db/ss1/studentDelivery.ts')
      ]);
      const rubric=[{id:'method',description:'Shows the correct method',max_marks:3},{id:'result',description:'States the correct result',max_marks:2}];
      assert.deepEqual(validateMarkingRubric(rubric,5),rubric);
      assert.equal(validateMarkingRubric(rubric,4),null);
      const validAiMark={points:4,confidence:0.82,feedback:'The method and result are mostly correct.',criterion_scores:[
        {criterion_id:'method',points:3,rationale:'The response shows the correct method.'},
        {criterion_id:'result',points:1,rationale:'The result is partially correct.'}
      ]};
      assert.equal(validateAiRubricMark(validAiMark,rubric,5)?.points,4);
      assert.equal(validateAiRubricMark({...validAiMark,confidence:0.42},rubric,5)?.confidence,0.42,'low confidence is valid evidence but must be routed to pending review');
      assert.equal(validateAiRubricMark({...validAiMark,points:5},rubric,5),null);
      assert.equal(validateAiRubricMark({...validAiMark,criterion_scores:[validAiMark.criterion_scores[0]]},rubric,5),null);
      pool=databasePool;
      const app=express();app.use(express.json());app.use('/online-exams',router);app.use('/question-bank',questionBankRouter);
      server=app.listen(0);
      await new Promise(resolve=>server.once('listening',resolve));
      const base='http://127.0.0.1:'+server.address().port;
      const token=(id:string,username:string,role='student')=>signAccess({id,username,role,school_code:school,assigned_class:null,assigned_class_names:[],can_manage_all_schools:role==='admin'});
      const studentToken=token(studentUser,'test-student');
      const otherToken=token(otherUser,'other-student');
      const adminToken=token(admin,'test-admin','admin');
      const foreignAdminToken=signAccess({id:foreignAdmin,username:'secondary-admin',role:'admin',school_code:foreignSchool,assigned_class:null,assigned_class_names:[],can_manage_all_schools:true});
      const teacherToken=token(teacherUser,'math-teacher','teacher');
      const unassignedTeacherToken=token(unassignedTeacher,'unassigned-teacher','teacher');
      const request=async(path:string,method='GET',auth=studentToken,body?:any,schoolHeader?:string)=>{
        const response=await fetch(base+path,{method,headers:{...(auth?{Authorization:'Bearer '+auth}:{}),...(schoolHeader?{'x-school-code':schoolHeader}:{}),'Content-Type':'application/json'},...(body?{body:JSON.stringify(body)}:{}),signal:AbortSignal.timeout(15000)});
        return {status:response.status,data:await response.json()};
      };
      const reviewQueue=await request('/question-bank/review-queue','GET',teacherToken);
      assert.equal(reviewQueue.status,200);
      assert.ok(reviewQueue.data.questions.length>=3);
      assert.ok(reviewQueue.data.questions.every((item:any)=>item.subject==='Mathematics'));
      assert.equal((await request('/question-bank/questions','GET',teacherToken)).status,403,'teachers may review assigned subjects but cannot administer the global question bank');
      const otherSubjectQueue=await request('/question-bank/review-queue','GET',unassignedTeacherToken);
      assert.equal(otherSubjectQueue.status,200);assert.equal(otherSubjectQueue.data.questions.length,0);
      const invalidReview=await request('/question-bank/questions/'+questionId+'/review','POST',teacherToken,{decision:'approved',notes:'OK'});
      assert.equal(invalidReview.status,400);
      const schoolSubjects=await request('/online-exams/admin/question-bank/subjects','GET',adminToken,undefined,school);
      assert.equal(schoolSubjects.status,200);assert.ok(schoolSubjects.data.subjects.some((item:any)=>item.code==='MATHEMATICS'));
      assert.equal((await request('/online-exams/admin/question-bank/subjects','GET',teacherToken,undefined,school)).status,403);
      const approved=await request('/question-bank/questions/'+questionId+'/review','POST',teacherToken,{decision:'approved',notes:'Checked the answer key, explanation and syllabus alignment.'});
      assert.equal(approved.status,200);assert.equal(approved.data.review_status,'approved');
      const approvedEssay=await request('/question-bank/questions/'+essayQuestionId+'/review','POST',teacherToken,{decision:'approved',notes:'The response rubric aligns with the Mathematics learning objective.'});
      assert.equal(approvedEssay.status,200);assert.equal(approvedEssay.data.review_status,'approved');
      const approvedQuestions=await request('/online-exams/admin/question-bank/questions?board=WAEC&subject_code=MATHEMATICS','GET',adminToken,undefined,school);
      assert.equal(approvedQuestions.status,200);assert.ok(approvedQuestions.data.questions.some((item:any)=>item.id===questionId));
      const rejectedQuestion=reviewQueue.data.questions.find((item:any)=>item.id!==questionId&&item.id!==essayQuestionId);
      assert.ok(rejectedQuestion);
      const rejected=await request('/question-bank/questions/'+rejectedQuestion.id+'/review','POST',teacherToken,{decision:'rejected',notes:'The explanation needs correction before student use.'});
      assert.equal(rejected.status,200);assert.equal(rejected.data.review_status,'reviewed');
      const forbiddenReview=await request('/question-bank/questions/'+rejectedQuestion.id+'/review','POST',unassignedTeacherToken,{decision:'approved',notes:'Attempted approval without subject assignment.'});
      assert.equal(forbiddenReview.status,403);
      const reviewAudit=await client.query('SELECT decision FROM question_bank_question_reviews WHERE question_id=$1 ORDER BY reviewed_at',[questionId]);
      assert.deepEqual(reviewAudit.rows.map((row:any)=>row.decision),['approved']);
      const essayReviewAudit=await client.query('SELECT decision FROM question_bank_question_reviews WHERE question_id=$1',[essayQuestionId]);
      assert.deepEqual(essayReviewAudit.rows.map((row:any)=>row.decision),['approved']);
      const rejectedAudit=await client.query('SELECT decision FROM question_bank_question_reviews WHERE question_id=$1',[rejectedQuestion.id]);
      assert.deepEqual(rejectedAudit.rows.map((row:any)=>row.decision),['rejected']);

      const lessonTopics=await request('/online-exams/admin/lesson-topics?class_name=SS%203&subject_name=Mathematics','GET',adminToken,undefined,school);
      assert.equal(lessonTopics.status,200);const coveredLesson=lessonTopics.data.topics.find((item:any)=>item.id===coveredTopicId);assert.ok(coveredLesson?.eligible_for_all_candidates);assert.equal(Number(coveredLesson.candidate_count),1,'only active report-roster members with valid student accounts count as candidates');assert.equal(Number(coveredLesson.completed_count),1);
      const packageLesson=listStudentSs1Lessons()[0];
      assert.ok(packageLesson,'the production SS1 student-delivery package must expose an implemented lesson');
      const packageDraftRequest={board:'WAEC',class_name:'SS 1',subject_name:packageLesson.canonical_subject,lesson_ids:[packageLesson.id]};
      const missingPackageProgress=await request('/online-exams/admin/exams/generate-package-drafts','POST',adminToken,packageDraftRequest,school);
      assert.equal(missingPackageProgress.status,409,'package question generation must reject lessons not completed by every eligible roster candidate');
      const packageFingerprint=packageLesson.body_sha256??createHash('sha256').update(String(packageLesson.body??'')).digest('hex');
      const packageLessonKey='ss1:'+createHash('sha256').update(['SS 1',packageLesson.canonical_subject,packageLesson.term,String(packageLesson.id),packageFingerprint,JSON.stringify(packageLesson.objectives??[])].join('\\0')).digest('hex');
      await client.query('INSERT INTO student_curriculum_lesson_progress(student_id,lesson_key,class_name,subject_name,term_label,lesson_title) VALUES($1,$2,$3,$4,$5,$6)',
        [ss1Student,packageLessonKey,'SS 1',packageLesson.subject,packageLesson.term,packageLesson.title]);
      const packageProgressAccepted=await request('/online-exams/admin/exams/generate-package-drafts','POST',adminToken,packageDraftRequest,school);
      assert.equal(packageProgressAccepted.status,502,'the SS1 package progress record must satisfy coverage before the intentionally unavailable AI provider is called');

      const examDraft={
        board:'WAEC',subject_name:'Mathematics',class_name:'SS 3',examination_type:'Mock',
        title:'SS3 Mathematics Mock',instructions:'Read each question carefully.',duration_minutes:30,
        starts_at:new Date(Date.now()-60000).toISOString(),ends_at:new Date(Date.now()+2*60*60*1000).toISOString(),
        sections:[{title:'Section A',instructions:'Answer all questions.',questions:[{question_id:questionId,marks:2,covered_topic_id:coveredTopicId},{question_id:essayQuestionId,marks:5,covered_topic_id:coveredTopicId,marking_rubric:[{id:'method',description:'Shows the correct method',max_marks:3},{id:'result',description:'States the correct result',max_marks:2}]}]}]
      };

      assert.equal((await request('/online-exams/exams','GET','')).status,401);
      const rejectedDraft=structuredClone(examDraft);rejectedDraft.sections[0].questions[0].question_id=rejectedQuestion.id;
      const rejectedPilot=await request('/online-exams/admin/exams','POST',adminToken,rejectedDraft,school);
      assert.equal(rejectedPilot.status,400);
      const missingRubric=structuredClone(examDraft);delete missingRubric.sections[0].questions[1].marking_rubric;
      assert.equal((await request('/online-exams/admin/exams','POST',adminToken,missingRubric,school)).status,400);
      const missingCoverage=structuredClone(examDraft);delete missingCoverage.sections[0].questions[0].covered_topic_id;
      assert.equal((await request('/online-exams/admin/exams','POST',adminToken,missingCoverage,school)).status,400);
      const wrongCoverage=structuredClone(examDraft);wrongCoverage.sections[0].questions[0].covered_topic_id=99999;
      assert.equal((await request('/online-exams/admin/exams','POST',adminToken,wrongCoverage,school)).status,400);
      const created=await request('/online-exams/admin/exams','POST',adminToken,examDraft,school);
      assert.equal(created.status,201);
      const examId=created.data.exam.id;
      const adminExams=await request('/online-exams/admin/exams','GET',adminToken,undefined,school);
      assert.equal(adminExams.status,200);assert.equal(adminExams.data.exams.length,1);assert.equal(adminExams.data.exams[0].id,examId);
      await client.query('DELETE FROM report_roster_memberships WHERE student_id=$1',[student]);
      assert.equal((await request('/online-exams/admin/exams/'+examId+'/publish','POST',adminToken,{},school)).status,409,'publication must recheck current active roster membership');
      await client.query("INSERT INTO report_roster_memberships(student_id,class_name,source_class_name,status) VALUES($1,'SS 3','SS 3','active')",[student]);
      await client.query('DELETE FROM topic_completions WHERE student_id=$1 AND topic_id=$2',[student,coveredTopicId]);
      assert.equal((await request('/online-exams/admin/exams/'+examId+'/publish','POST',adminToken,{},school)).status,409,'publication must recheck completion for every current candidate');
      await client.query('INSERT INTO topic_completions(student_id,topic_id) VALUES($1,$2)',[student,coveredTopicId]);
      const published=await request('/online-exams/admin/exams/'+examId+'/publish','POST',adminToken,{},school);
      assert.equal(published.status,200);assert.equal(published.data.eligible_candidates,1);

      const otherList=await request('/online-exams/exams','GET',otherToken);
      assert.equal(otherList.status,200);assert.equal(otherList.data.exams.length,0);
      assert.equal((await request('/online-exams/exams/'+examId+'/start','POST',otherToken)).status,404);
      const list=await request('/online-exams/exams');
      assert.equal(list.status,200);assert.equal(list.data.exams.length,1);
      const started=await request('/online-exams/exams/'+examId+'/start','POST');
      assert.equal(started.status,200);
      assert.equal(started.data.questions.length,2);
      assert.equal(JSON.stringify(started.data).includes('correct_answer'),false);
      const attemptId=started.data.attempt.id;
      assert.equal((await request('/online-exams/admin/attempts/'+attemptId+'/responses','GET',foreignAdminToken,undefined,foreignSchool)).status,404,'examiner response access must be isolated to the owning school');
      const resumed=await request('/online-exams/exams/'+examId+'/start','POST');
      assert.equal(resumed.status,200);assert.equal(resumed.data.attempt.id,attemptId);
      const foreignRead=await request('/online-exams/attempts/'+attemptId,'GET',otherToken);
      assert.equal(foreignRead.status,404);

      const onlineQuestionId=started.data.questions[0].id;
      const saved=await request('/online-exams/attempts/'+attemptId+'/responses/'+onlineQuestionId,'PUT',studentToken,{response:{key:'B'}});
      assert.equal(saved.status,200);assert.equal(saved.data.saved,true);
      const essayExamQuestionId=started.data.questions[1].id;
      const savedEssay=await request('/online-exams/attempts/'+attemptId+'/responses/'+essayExamQuestionId,'PUT',studentToken,{response:'I isolate the variable by applying inverse operations and then verify the result.'});
      assert.equal(savedEssay.status,200);assert.equal(savedEssay.data.saved,true);
      const recovered=await request('/online-exams/attempts/'+attemptId);
      assert.equal(recovered.status,200);assert.equal(recovered.data.saved_responses.length,2);
      assert.deepEqual(recovered.data.saved_responses.find((item:any)=>item.exam_question_id===onlineQuestionId).response,{key:'B'});
      assert.equal(recovered.data.saved_responses.find((item:any)=>item.exam_question_id===essayExamQuestionId).response,'I isolate the variable by applying inverse operations and then verify the result.');

      await client.query('UPDATE online_exam_attempts SET deadline_at=now()-interval \'1 second\' WHERE id=$1',[attemptId]);
      const lateSave=await request('/online-exams/attempts/'+attemptId+'/responses/'+onlineQuestionId,'PUT',studentToken,{response:{key:'A'}});
      assert.equal(lateSave.status,409);
      const submitted=await request('/online-exams/attempts/'+attemptId+'/submit','POST',studentToken,{confirm:true});
      assert.equal(submitted.status,200);assert.equal(submitted.data.status,'under_review','unavailable AI marking must route the written response to examiner review');
      assert.equal(Number(submitted.data.score),2);
      const duplicate=await request('/online-exams/attempts/'+attemptId+'/submit','POST',studentToken,{confirm:true});
      assert.equal(duplicate.status,200);assert.equal(duplicate.data.already_submitted,true);
      const examinerResponses=await request('/online-exams/admin/attempts/'+attemptId+'/responses','GET',adminToken,undefined,school);
      assert.equal(examinerResponses.status,200);
      const pendingEssay=examinerResponses.data.responses.find((item:any)=>item.question_id===essayExamQuestionId);
      assert.equal(pendingEssay.marking_status,'pending_review');
      assert.equal(pendingEssay.marking_confidence,null);
      assert.equal(pendingEssay.marking_details.method,'manual_review_required');
      assert.equal(pendingEssay.marking_rubric.length,2);
      assert.equal((await request('/online-exams/admin/attempts/'+attemptId+'/responses/'+essayExamQuestionId+'/mark','PUT',foreignAdminToken,{awarded_marks:3,feedback:'Unauthorized cross-school mark.'},foreignSchool)).status,404,'manual marking must be isolated to the owning school');
      assert.equal((await request('/online-exams/admin/attempts/'+attemptId+'/responses/'+essayExamQuestionId+'/mark','PUT',adminToken,{awarded_marks:6,feedback:'Exceeds the question maximum.'},school)).status,400,'examiner marks cannot exceed the written question maximum');
      const manualMark=await request('/online-exams/admin/attempts/'+attemptId+'/responses/'+essayExamQuestionId+'/mark','PUT',adminToken,{awarded_marks:3,feedback:'Correct method; final justification is incomplete.'},school);
      assert.equal(manualMark.status,200);
      assert.equal(manualMark.data.attempt.status,'submitted');
      assert.equal(Number(manualMark.data.attempt.score),5);
      assert.equal((await request('/online-exams/admin/attempts/'+attemptId+'/responses/'+essayExamQuestionId+'/mark','PUT',adminToken,{awarded_marks:4,feedback:'Duplicate examiner mark.'},school)).status,409,'a manually marked response cannot be marked twice');
      const finalExamResponses=await request('/online-exams/admin/attempts/'+attemptId+'/responses','GET',adminToken,undefined,school);
      const manuallyMarked=finalExamResponses.data.responses.find((item:any)=>item.question_id===essayExamQuestionId);
      assert.equal(manuallyMarked.marking_status,'manual_marked');
      assert.equal(manuallyMarked.marking_confidence,null);
      assert.equal(manuallyMarked.marking_details.method,'manual_examiner');

      const result=await request('/online-exams/attempts/'+attemptId+'/results');
      assert.equal(result.status,200);assert.equal(Number(result.data.attempt.score),5);
      const duplicateAttempts=await client.query('SELECT COUNT(*)::int AS n FROM online_exam_attempts WHERE exam_id=$1 AND student_id=$2',[examId,student]);
      assert.equal(duplicateAttempts.rows[0].n,1);

      const physical=await client.query(`SELECT (SELECT score FROM scores WHERE id=1) AS score,
        (SELECT present FROM attendance WHERE id=1) AS present,
        (SELECT remark FROM report_remarks WHERE id=1) AS remark,
        (SELECT payload FROM report_cards WHERE id=1) AS report_card,
        (SELECT COUNT(*)::int FROM report_roster_memberships) AS roster_count`);
      assert.equal(Number(physical.rows[0].score),72);
      assert.equal(physical.rows[0].present,true);
      assert.equal(physical.rows[0].remark,'unchanged');
      assert.equal(physical.rows[0].report_card,'unchanged');
      assert.equal(physical.rows[0].roster_count,1);
      const rosterState=await client.query('SELECT class_name,status FROM report_roster_memberships WHERE student_id=$1',[student]);
      assert.deepEqual(rosterState.rows[0],{class_name:'SS 3',status:'active'});
      const audit=await client.query('SELECT COUNT(*)::int AS n FROM online_exam_audit_events WHERE exam_id=$1',[examId]);
      assert.ok(audit.rows[0].n>=4);
    }finally{
      if(server){server.closeAllConnections?.();await new Promise(resolve=>server.close(resolve));}
      if(pool) await pool.end();
      await client.query('RESET search_path');
      await client.query('DROP SCHEMA IF EXISTS '+schema+' CASCADE');
      await client.query('DROP TABLE IF EXISTS public.learning_access_settings');
      await client.end();
    }
  });
