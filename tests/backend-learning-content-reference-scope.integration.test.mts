import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import type { AddressInfo } from 'node:net';
import type { Server } from 'node:http';
import express from 'express';
import test, { after } from 'node:test';
import { pool, query } from '../backend/src/db/pool.js';
import learningRouter from '../backend/src/routes/learning.js';
import { signAccess } from '../backend/src/utils/jwt.js';

after(async () => {
  await pool.end();
});

async function createUser(label: string, role: 'admin' | 'teacher' | 'student', schoolCode: string | null, assignedClass: string | null = null) {
  const username = `bsec19-${label}-${randomUUID()}`;
  const { rows } = await query(
    `INSERT INTO users(username,password_hash,role,full_name,school_code,assigned_class,is_active,pending_admin_review)
     VALUES($1,'test-hash',$2,$3,$4,$5,TRUE,FALSE) RETURNING id`,
    [username, role, `BSEC19 ${label}`, schoolCode, assignedClass],
  );
  const id = String(rows[0].id);
  return {
    id,
    token: signAccess({
      id,
      username,
      role,
      school_code: schoolCode,
      assigned_class: assignedClass,
      assigned_subject_ids: [],
    }),
  };
}

async function startServer(): Promise<{ server: Server; baseUrl: string }> {
  const app = express();
  app.use(express.json());
  app.use('/learning', learningRouter);
  const server = app.listen(0, '127.0.0.1');
  await new Promise<void>((resolve, reject) => {
    server.once('listening', resolve);
    server.once('error', reject);
  });
  const port = (server.address() as AddressInfo).port;
  return { server, baseUrl: `http://127.0.0.1:${port}/learning` };
}

test('learning content writes and reads reject cross-school subject, term and question links', async () => {
  const suffix = randomUUID();
  const year = `BSEC19/${suffix.slice(0, 8)}`;
  const teacher = await createUser('teacher', 'teacher', 'primary', 'Primary 4');
  const admin = await createUser('admin', 'admin', 'primary');
  const student = await createUser('student', 'student', 'primary');
  const subjectIds: number[] = [];
  const termIds: number[] = [];
  const questionIds: number[] = [];
  const materialIds: number[] = [];
  const assessmentIds: string[] = [];
  let studentId: string | undefined;
  let server: Server | undefined;

  try {
    for (const [school, label] of [['primary', 'Primary A'], ['primary', 'Primary B'], ['secondary', 'Secondary A']] as const) {
      const { rows } = await query(
        'INSERT INTO subjects(school_code,name,code) VALUES($1,$2,$3) RETURNING id',
        [school, `BSEC19 ${label} ${suffix}`, `B19-${label.replaceAll(' ', '')}-${suffix.slice(0, 6)}`],
      );
      subjectIds.push(Number(rows[0].id));
    }
    for (const school of ['primary', 'secondary']) {
      const { rows } = await query(
        `INSERT INTO terms(name,academic_year,school_code) VALUES('1st Term',$1,$2) RETURNING id`,
        [year, school],
      );
      termIds.push(Number(rows[0].id));
    }

    const { rows: students } = await query(
      `INSERT INTO students(full_name,class_name,school_code,admission_number,user_id)
       VALUES('BSEC19 Student','Primary 4','primary',$1,$2) RETURNING id`,
      [`BSEC19-${suffix}`, student.id],
    );
    studentId = String(students[0].id);

    const { rows: primaryQuestion } = await query(
      `INSERT INTO questions(school_code,subject_id,class_name,term_id,type,stem,options,correct_keys,marks,created_by)
       VALUES('primary',$1,'Primary 4',$2,'mcq','Primary question','[]'::jsonb,ARRAY['A'],1,$3) RETURNING id`,
      [subjectIds[0], termIds[0], teacher.id],
    );
    questionIds.push(Number(primaryQuestion[0].id));

    const { rows: wrongSubjectQuestion } = await query(
      `INSERT INTO questions(school_code,subject_id,class_name,term_id,type,stem,options,correct_keys,marks,created_by)
       VALUES('primary',$1,'Primary 4',$2,'mcq','Wrong subject question','[]'::jsonb,ARRAY['A'],1,$3) RETURNING id`,
      [subjectIds[1], termIds[0], teacher.id],
    );
    questionIds.push(Number(wrongSubjectQuestion[0].id));

    const { rows: secondaryQuestion } = await query(
      `INSERT INTO questions(school_code,subject_id,class_name,term_id,type,stem,options,correct_keys,marks,created_by)
       VALUES('secondary',$1,'Primary 4',$2,'mcq','Secondary question','[]'::jsonb,ARRAY['A'],1,$3) RETURNING id`,
      [subjectIds[2], termIds[1], teacher.id],
    );
    questionIds.push(Number(secondaryQuestion[0].id));

    const { rows: wrongTermQuestion } = await query(
      `INSERT INTO questions(school_code,subject_id,class_name,term_id,type,stem,options,correct_keys,marks,created_by)
       VALUES('primary',$1,'Primary 4',$2,'mcq','Wrong term question','[]'::jsonb,ARRAY['A'],1,$3) RETURNING id`,
      [subjectIds[0], termIds[1], teacher.id],
    );
    questionIds.push(Number(wrongTermQuestion[0].id));

    const { rows: adminState } = await query(
      'SELECT role, is_active, pending_admin_review FROM users WHERE id=$1',
      [admin.id],
    );
    assert.equal(adminState[0].role, 'admin');
    assert.equal(adminState[0].is_active, true);
    assert.equal(adminState[0].pending_admin_review, false);

    const started = await startServer();
    server = started.server;
    const headers = (token: string) => ({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
    const post = (path: string, body: unknown, token = teacher.token) => fetch(
      `${started.baseUrl}${path}`,
      { method: 'POST', headers: headers(token), body: JSON.stringify(body) },
    );

    const wrongSubjectMaterial = await post('/materials', {
      subject_id: subjectIds[2], term_id: termIds[0], class_name: 'Primary 4',
      title: 'Wrong school subject', type: 'pdf', url: 'https://example.test/foreign.pdf',
    });
    assert.equal(wrongSubjectMaterial.status, 400);

    const wrongTermMaterial = await post('/materials', {
      subject_id: subjectIds[0], term_id: termIds[1], class_name: 'Primary 4',
      title: 'Wrong school term', type: 'pdf', url: 'https://example.test/foreign-term.pdf',
    });
    assert.equal(wrongTermMaterial.status, 400);

    const validMaterial = await post('/materials', {
      subject_id: subjectIds[0], term_id: termIds[0], class_name: 'Primary 4',
      title: 'Valid material', type: 'pdf', url: 'https://example.test/valid.pdf',
    });
    assert.equal(validMaterial.status, 201);
    const validMaterialPayload = await validMaterial.json() as { material: { id: number } };
    materialIds.push(validMaterialPayload.material.id);

    const wrongSubjectQuestionResponse = await post('/questions', {
      school_code: 'primary', subject_id: subjectIds[2], term_id: termIds[0], class_name: 'Primary 4',
      type: 'mcq', stem: 'Foreign subject question', options: [], correct_keys: ['A'], marks: 1,
    }, admin.token);
    const wrongSubjectQuestionBody = await wrongSubjectQuestionResponse.json();
    assert.equal(wrongSubjectQuestionResponse.status, 400, JSON.stringify(wrongSubjectQuestionBody));

    const wrongTermQuestionResponse = await post('/questions', {
      school_code: 'primary', subject_id: subjectIds[0], term_id: termIds[1], class_name: 'Primary 4',
      type: 'mcq', stem: 'Foreign term question', options: [], correct_keys: ['A'], marks: 1,
    }, admin.token);
    assert.equal(wrongTermQuestionResponse.status, 400);

    const validQuestion = await post('/questions', {
      school_code: 'primary', subject_id: subjectIds[0], term_id: termIds[0], class_name: 'Primary 4',
      type: 'mcq', stem: 'Valid new question', options: [], correct_keys: ['A'], marks: 1,
    }, admin.token);
    assert.equal(validQuestion.status, 201);
    const validQuestionPayload = await validQuestion.json() as { question: { id: number } };
    questionIds.push(validQuestionPayload.question.id);

    const foreignSchoolQuestionAssessment = await post('/assessments', {
      school_code: 'primary', subject_id: subjectIds[0], term_id: termIds[0], class_name: 'Primary 4',
      title: 'Foreign school question', question_ids: [{ id: questionIds[2], points: 1 }],
    }, admin.token);
    assert.equal(foreignSchoolQuestionAssessment.status, 400);

    const wrongSubjectQuestionAssessment = await post('/assessments', {
      school_code: 'primary', subject_id: subjectIds[0], term_id: termIds[0], class_name: 'Primary 4',
      title: 'Wrong subject question', question_ids: [{ id: questionIds[1], points: 1 }],
    }, admin.token);
    assert.equal(wrongSubjectQuestionAssessment.status, 400);

    const wrongTermQuestionAssessment = await post('/assessments', {
      school_code: 'primary', subject_id: subjectIds[0], term_id: termIds[0], class_name: 'Primary 4',
      title: 'Wrong term question', question_ids: [{ id: questionIds[3], points: 1 }],
    }, admin.token);
    assert.equal(wrongTermQuestionAssessment.status, 400);

    const validAssessment = await post('/assessments', {
      school_code: 'primary', subject_id: subjectIds[0], term_id: termIds[0], class_name: 'Primary 4',
      title: 'Valid assessment', question_ids: [{ id: questionIds[0], points: 3 }],
    }, admin.token);
    assert.equal(validAssessment.status, 201);
    const validAssessmentPayload = await validAssessment.json() as { assessment: { id: string; total_marks: number } };
    assessmentIds.push(validAssessmentPayload.assessment.id);
    assert.equal(Number(validAssessmentPayload.assessment.total_marks), 3);

    const adminCrossSchool = await post('/materials', {
      school_code: 'primary', subject_id: subjectIds[2], term_id: termIds[0],
      class_name: 'Primary 4', title: 'Admin cross-school', type: 'pdf', url: 'https://example.test/admin.pdf',
    }, admin.token);
    assert.equal(adminCrossSchool.status, 400, 'admin bypasses role assignment checks but not referential school integrity');

    // Simulate legacy cross-linked rows to prove read endpoints fail closed.
    const { rows: legacyMaterial } = await query(
      `INSERT INTO materials(school_code,subject_id,class_name,term_id,title,type,url,created_by)
       VALUES('primary',$1,'Primary 4',$2,'Legacy foreign material','pdf','https://example.test/legacy.pdf',$3)
       RETURNING id`,
      [subjectIds[2], termIds[1], admin.id],
    );
    materialIds.push(Number(legacyMaterial[0].id));

    const { rows: legacyQuestion } = await query(
      `INSERT INTO questions(school_code,subject_id,class_name,term_id,type,stem,options,correct_keys,marks,created_by)
       VALUES('primary',$1,'Primary 4',$2,'mcq','Legacy foreign question','[]'::jsonb,ARRAY['A'],1,$3)
       RETURNING id`,
      [subjectIds[2], termIds[1], admin.id],
    );
    questionIds.push(Number(legacyQuestion[0].id));

    const { rows: legacyAssessment } = await query(
      `INSERT INTO assessments(school_code,subject_id,class_name,term_id,title,status,created_by)
       VALUES('primary',$1,'Primary 4',$2,'Legacy foreign assessment','open',$3)
       RETURNING id`,
      [subjectIds[2], termIds[1], admin.id],
    );
    assessmentIds.push(String(legacyAssessment[0].id));
    await query(
      'INSERT INTO assessment_questions(assessment_id,question_id,points,order_index) VALUES($1,$2,1,0)',
      [legacyAssessment[0].id, questionIds[2]],
    );

    const get = (path: string, token: string) => fetch(`${started.baseUrl}${path}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const materialsResponse = await get('/materials', teacher.token);
    const materialsPayload = await materialsResponse.json() as { materials: Array<{ id: number }> };
    assert.ok(materialsPayload.materials.some(item => item.id === validMaterialPayload.material.id));
    assert.ok(!materialsPayload.materials.some(item => item.id === Number(legacyMaterial[0].id)));

    const questionsResponse = await get('/questions', admin.token);
    const questionsPayload = await questionsResponse.json() as { questions: Array<{ id: number }> };
    assert.ok(!questionsPayload.questions.some(item => item.id === Number(legacyQuestion[0].id)));

    const assessmentsResponse = await get('/assessments?school_code=primary', admin.token);
    const assessmentsPayload = await assessmentsResponse.json() as { assessments: Array<{ id: string }> };
    assert.ok(!assessmentsPayload.assessments.some(item => item.id === String(legacyAssessment[0].id)));

    const legacyQuestionResponse = await get(`/assessments/${legacyAssessment[0].id}/questions`, admin.token);
    assert.equal(legacyQuestionResponse.status, 200);
    const legacyQuestionPayload = await legacyQuestionResponse.json() as { questions: unknown[] };
    assert.equal(legacyQuestionPayload.questions.length, 0,
      'assessment question delivery must filter legacy cross-school question links');
    const studentLegacyAssessment = await get(
      `/assessments/${legacyAssessment[0].id}/questions`,
      student.token,
    );
    assert.equal(studentLegacyAssessment.status, 404,
      'students must not open legacy assessments whose subject or term belongs to another school');

    const validQuestionResponse = await get(`/assessments/${validAssessmentPayload.assessment.id}/questions`, admin.token);
    assert.equal(validQuestionResponse.status, 200);
    const validQuestionList = await validQuestionResponse.json() as { questions: Array<{ id: number }> };
    assert.deepEqual(validQuestionList.questions.map(item => item.id), [questionIds[0]]);
  } finally {
    if (server) {
      server.closeAllConnections();
      await new Promise<void>(resolve => server!.close(() => resolve()));
    }
    if (assessmentIds.length) {
      await query('DELETE FROM assessment_questions WHERE assessment_id=ANY($1::uuid[])', [assessmentIds]);
      await query('DELETE FROM assessments WHERE id=ANY($1::uuid[])', [assessmentIds]);
    }
    if (materialIds.length) await query('DELETE FROM materials WHERE id=ANY($1::int[])', [materialIds]);
    if (questionIds.length) await query('DELETE FROM questions WHERE id=ANY($1::int[])', [questionIds]);
    if (studentId) await query('DELETE FROM students WHERE id=$1', [studentId]);
    if (termIds.length) await query('DELETE FROM terms WHERE id=ANY($1::int[])', [termIds]);
    if (subjectIds.length) await query('DELETE FROM subjects WHERE id=ANY($1::int[])', [subjectIds]);
    await query('DELETE FROM users WHERE id=ANY($1::uuid[])', [[teacher.id, admin.id, student.id]]);
  }
});
