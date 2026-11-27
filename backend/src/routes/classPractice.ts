import { Router } from 'express';
import { randomUUID } from 'node:crypto';
import { requireAuth, requirePerm, requireRole } from '../middleware/auth.js';
import { query, withTransaction } from '../db/pool.js';
import { generateJSON } from '../utils/ai.js';
import { buildAdaptiveConceptTargets, validateGeneratedPracticeQuestions, type GeneratedPracticeQuestion } from '../utils/classPracticeAdaptive.js';

const router = Router();
router.use(requireAuth, requireRole('student'), requirePerm('topics.read'));

router.post('/sets', async (req, res) => {
  const topicId = Number(req.body?.topic_id);
  if (!Number.isSafeInteger(topicId) || topicId <= 0) {
    return res.status(400).json({ error: 'A valid topic_id is required.' });
  }

  const { rows: students } = await query(
    'SELECT id, school_code, class_name FROM students WHERE user_id=$1 LIMIT 1',
    [req.user!.id],
  );
  const student = students[0];
  if (!student) return res.status(404).json({ error: 'Student record not found.' });

  // Completion is the source of truth for "actually covered". Merely listing,
  // opening or requesting a topic never makes it eligible for practice.
  const { rows: covered } = await query(`
    SELECT t.id,t.school_code,t.class_name,t.title,t.summary,t.description,
           sub.name AS subject_name,
           COALESCE(to_jsonb(t)->>'term_label',term.name,'Unspecified term') AS term_label,
           to_jsonb(t)->'learning_objectives' AS learning_objectives
      FROM topics t
      JOIN topic_completions tc ON tc.topic_id=t.id AND tc.student_id=$1
      JOIN subjects sub ON sub.id=t.subject_id
      LEFT JOIN terms term ON term.id=t.term_id AND term.school_code=t.school_code
     WHERE t.id=$2 AND t.school_code=$3
       AND (t.class_name IS NULL OR t.class_name=$4)
  `, [student.id, topicId, student.school_code, student.class_name]);
  const topic = covered[0];
  if (!topic) return res.status(403).json({ error: 'Practice is available only for lessons/topics you have completed.' });

  const lessonText = [topic.summary, topic.description].filter((v: any) => typeof v === 'string' && v.trim()).join('\n\n');
  const objectives = Array.isArray(topic.learning_objectives) ? topic.learning_objectives : [];
  const concepts = [...new Set([
    topic.title,
    ...objectives.map((v: any) => typeof v === 'string' ? v : v?.title ?? v?.description).filter(Boolean),
  ].map((v: any) => String(v).trim()).filter(Boolean))].slice(0, 12);
  if (!lessonText && !objectives.length) {
    return res.status(409).json({ error: 'This completed topic has no lesson content or learning objectives to ground practice questions.' });
  }

  const { rows: history } = await query(`
    SELECT concept,attempts,correct_attempts,accuracy
      FROM class_practice_concept_performance
     WHERE student_id=$1 AND topic_id=$2
     ORDER BY accuracy ASC, attempts DESC
  `, [student.id, topicId]);
  const allowedConcepts = concepts;
  // Ignore historical labels that are no longer part of this completed lesson.
  const adaptiveTargets = buildAdaptiveConceptTargets(allowedConcepts, history);
  const weakConcepts = adaptiveTargets
    .filter(target => target.focus)
    .map(({ concept, accuracy, attempts }) => ({ concept, accuracy, attempts }));
  const prompt = `
Create 5 original multiple-choice class-practice questions for this student's already-completed lesson.
STRICT GROUNDING: Use ONLY facts, skills and concepts explicitly present in the lesson text/objectives below. Do not introduce prerequisite topics, adjacent syllabus topics, general knowledge or unrelated examples. Every question must test one exact allowed concept. If evidence is insufficient, return fewer than 3 and the request will be rejected.
Adaptation: use the per-concept targets below. At least 70% of generated questions must target concepts marked focus=true. Each question's difficulty MUST exactly match its concept target.
Difficulty rules:
- foundation: rebuild understanding with a direct, single-step question and clear wording for a concept the student is struggling with.
- standard: assess the normal lesson-level skill with a familiar application.
- challenge: use a more demanding, multi-step application only when the student has demonstrated sustained mastery (at least 3 attempts and 90% accuracy).
Do not add concepts or facts beyond this completed lesson. Do not mention student scores.
Per-concept adaptive targets:
${JSON.stringify(adaptiveTargets)}
Class: ${topic.class_name}; Subject: ${topic.subject_name}; Term: ${topic.term_label}; Lesson: ${topic.title}
Lesson content:
${lessonText.slice(0, 14000)}
Learning objectives:
${JSON.stringify(objectives).slice(0, 5000)}
Allowed concept labels (use exact labels):
${JSON.stringify(allowedConcepts)}
Weak concepts from this student's previous practice:
${JSON.stringify(weakConcepts)}
Return JSON object: {"questions":[{"concept":"exact allowed label","difficulty":"foundation|standard|challenge (must match the target)","question":"...","options":[{"key":"A","text":"..."},{"key":"B","text":"..."},{"key":"C","text":"..."},{"key":"D","text":"..."}],"correct_answer":"A","explanation":"...","marks":1}]}
Answers must be unambiguous; distractors must be plausible but clearly wrong from the lesson.
`;
  let generated: GeneratedPracticeQuestion[];
  try {
    const result: any = await generateJSON(prompt, 'generate-questions', { userId: req.user!.id, role: req.user!.role });
    generated = validateGeneratedPracticeQuestions(result?.questions, adaptiveTargets);
  } catch (error: any) {
    return res.status(502).json({ error: error?.message ?? 'Could not generate lesson-grounded practice. Please retry.' });
  }

  const questions = generated.map(q => ({ id: randomUUID(), ...q }));
  const { rows: sets } = await query(`
    INSERT INTO class_practice_sets(student_id,topic_id,class_name,subject_name,term_label,topic_title,questions,weak_concepts)
    VALUES($1,$2,$3,$4,$5,$6,$7::jsonb,$8::jsonb)
    RETURNING id,topic_id,topic_title,status,created_at
  `, [student.id,topic.id,topic.class_name ?? student.class_name,topic.subject_name,topic.term_label,topic.title,
      JSON.stringify(questions),JSON.stringify(weakConcepts.map(w => w.concept))]);
  const set = sets[0];
  return res.status(201).json({
    set,
    adapted_to_weak_concepts: weakConcepts,
    questions: questions.map(({ correct_answer: _answer, explanation: _explanation, ...q }) => q),
  });
});

router.get('/sets/:id', async (req, res) => {
  const { rows: students } = await query('SELECT id FROM students WHERE user_id=$1 LIMIT 1',[req.user!.id]);
  const student=students[0];
  if(!student) return res.status(404).json({error:'Student record not found.'});
  const {rows:sets}=await query(
    'SELECT id,topic_id,topic_title,status,created_at,completed_at,questions FROM class_practice_sets WHERE id=$1 AND student_id=$2',
    [req.params.id,student.id],
  );
  const set=sets[0];
  if(!set) return res.status(404).json({error:'Practice set not found.'});
  const questions=Array.isArray(set.questions)?set.questions:[];
  if(set.status!=='completed'){
    return res.json({
      set:{id:set.id,topic_id:set.topic_id,topic_title:set.topic_title,status:set.status,created_at:set.created_at},
      questions:questions.map(({correct_answer:_answer,explanation:_explanation,...q}:any)=>q),
    });
  }
  const {rows:attempts}=await query(
    'SELECT question_id,answer,correct,marks_awarded,marks_available FROM class_practice_attempts WHERE set_id=$1 AND student_id=$2',
    [set.id,student.id],
  );
  const byId=new Map(attempts.map((item:any)=>[item.question_id,item]));
  const results=questions.map((q:any)=>{
    const attempt:any=byId.get(q.id);
    return {question_id:q.id,concept:q.concept,difficulty:q.difficulty,answer:attempt?.answer??null,correct:attempt?.correct??false,
      marks_awarded:Number(attempt?.marks_awarded??0),marks_available:Number(attempt?.marks_available??q.marks),
      explanation:q.explanation};
  });
  const score=results.reduce((sum:number,item:any)=>sum+item.marks_awarded,0);
  const total=results.reduce((sum:number,item:any)=>sum+item.marks_available,0);
  return res.json({
    set:{id:set.id,topic_id:set.topic_id,topic_title:set.topic_title,status:set.status,created_at:set.created_at,completed_at:set.completed_at},
    result:{submitted:true,score,total,percentage:total?Math.round(score/total*100):0,results},
  });
});

router.post('/sets/:id/submit', async (req, res) => {
  const answers = req.body?.answers;
  if (!Array.isArray(answers) || answers.length < 1 || answers.length > 10 ||
      !answers.every((a: any) => a && typeof a.question_id === 'string' && typeof a.answer === 'string')) {
    return res.status(400).json({ error: 'Submit between 1 and 10 question_id/answer pairs.' });
  }
  const { rows: students } = await query('SELECT id FROM students WHERE user_id=$1 LIMIT 1',[req.user!.id]);
  const student = students[0];
  if (!student) return res.status(404).json({ error: 'Student record not found.' });
  // The row lock must be acquired on the same transaction client that performs
  // grading and persistence. A pool-level SELECT FOR UPDATE releases its lock
  // as soon as that standalone statement ends, allowing duplicate concurrent
  // submissions to race.
  const result = await withTransaction(async client => {
    const { rows: sets } = await client.query(
      'SELECT * FROM class_practice_sets WHERE id=$1 AND student_id=$2 FOR UPDATE',
      [req.params.id,student.id],
    );
    const set = sets[0];
    if (!set) return { status: 404, body: { error: 'Practice set not found.' } };
    if (set.status !== 'open') {
      return { status: 409, body: { error: 'This practice set has already been submitted.' } };
    }

    const questions = Array.isArray(set.questions) ? set.questions : [];
    const byId = new Map(questions.map((q: any) => [q.id,q]));
    if (answers.length !== questions.length || new Set(answers.map((a: any) => a.question_id)).size !== answers.length ||
        answers.some((a: any) => !byId.has(a.question_id))) {
      return { status: 400, body: { error: 'Submit exactly one answer for every question in this set.' } };
    }

    const graded = answers.map((a: any) => {
      const q: any = byId.get(a.question_id);
      const correct = cleanPracticeLabel(a.answer) === cleanPracticeLabel(q.correct_answer);
      return { q, answer: a.answer, correct, marks: correct ? q.marks : 0 };
    });
    // All submissions acquire shared concept-performance rows in the same order.
    // Preserve `graded` itself for the student's original response ordering.
    for (const item of [...graded].sort((a, b) => cleanPracticeLabel(a.q.concept).localeCompare(cleanPracticeLabel(b.q.concept)))) {
      await client.query(`
        INSERT INTO class_practice_attempts(set_id,student_id,topic_id,question_id,concept,answer,correct,marks_awarded,marks_available)
        VALUES($1,$2,$3,$4,$5,$6::jsonb,$7,$8,$9)
      `, [set.id,student.id,set.topic_id,item.q.id,item.q.concept,JSON.stringify(item.answer),item.correct,item.marks,item.q.marks]);
      await client.query(`
        INSERT INTO class_practice_concept_performance(student_id,topic_id,concept,attempts,correct_attempts,accuracy,last_attempt_at,updated_at)
        VALUES($1,$2,$3,1,$4,$5,now(),now())
        ON CONFLICT(student_id,topic_id,concept) DO UPDATE SET
          attempts=class_practice_concept_performance.attempts+1,
          correct_attempts=class_practice_concept_performance.correct_attempts+EXCLUDED.correct_attempts,
          accuracy=(class_practice_concept_performance.correct_attempts+EXCLUDED.correct_attempts)::numeric /
                   (class_practice_concept_performance.attempts+1),
          last_attempt_at=now(),updated_at=now()
      `, [student.id,set.topic_id,item.q.concept,item.correct ? 1 : 0,item.correct ? 1 : 0]);
    }
    await client.query("UPDATE class_practice_sets SET status='completed',completed_at=now() WHERE id=$1",[set.id]);
    for (const concept of [...new Set(graded.map(x => x.q.concept))]) {
      const { rows } = await client.query(`
        SELECT accuracy FROM class_practice_concept_performance
         WHERE student_id=$1 AND topic_id=$2 AND concept=$3
      `, [student.id,set.topic_id,concept]);
      const accuracy = Number(rows[0]?.accuracy ?? 0);
      if (accuracy < 0.7) {
        await client.query(`
          INSERT INTO class_practice_remediation_recommendations(student_id,topic_id,concept,recommendation,accuracy,status,updated_at)
          VALUES($1,$2,$3,$4,$5,'open',now())
          ON CONFLICT(student_id,topic_id,concept) DO UPDATE SET
            recommendation=EXCLUDED.recommendation,accuracy=EXCLUDED.accuracy,status='open',updated_at=now()
        `, [student.id,set.topic_id,concept,
          `Revisit the completed lesson section on "${concept}", review its worked examples, then practise a short set focused on this concept.`,accuracy]);
      } else {
        await client.query(`
          UPDATE class_practice_remediation_recommendations
             SET status='resolved',accuracy=$4,updated_at=now()
           WHERE student_id=$1 AND topic_id=$2 AND concept=$3
        `, [student.id,set.topic_id,concept,accuracy]);
      }
    }
    const total = graded.reduce((sum,x) => sum + Number(x.q.marks),0);
    const awarded = graded.reduce((sum,x) => sum + Number(x.marks),0);
    return {
      status: 200,
      body: {
        submitted: true, score: awarded, total, percentage: total ? Math.round(awarded / total * 100) : 0,
        results: graded.map(({ q, answer, correct, marks }) => ({
          question_id: q.id, concept: q.concept, difficulty: q.difficulty, answer, correct, marks_awarded: marks,
          marks_available: q.marks, explanation: q.explanation,
        })),
      },
    };
  });
  return res.status(result.status).json(result.body);
});

router.get('/progress', async (req, res) => {
  const { rows: students } = await query('SELECT id FROM students WHERE user_id=$1 LIMIT 1',[req.user!.id]);
  const student = students[0];
  if (!student) return res.status(404).json({ error: 'Student record not found.' });
  const [performance, recommendations] = await Promise.all([
    query(`
      SELECT cp.topic_id,t.title AS topic_title,sub.name AS subject_name,cp.concept,
             cp.attempts,cp.correct_attempts,cp.accuracy,cp.last_attempt_at
        FROM class_practice_concept_performance cp
        JOIN topics t ON t.id=cp.topic_id
        JOIN subjects sub ON sub.id=t.subject_id
       WHERE cp.student_id=$1 ORDER BY cp.accuracy ASC,cp.last_attempt_at DESC
    `,[student.id]),
    query(`
      SELECT r.id,r.topic_id,t.title AS topic_title,r.concept,r.recommendation,r.status,r.accuracy,r.updated_at
        FROM class_practice_remediation_recommendations r
        JOIN topics t ON t.id=r.topic_id
       WHERE r.student_id=$1 AND r.status <> 'resolved'
       ORDER BY r.accuracy ASC,r.updated_at DESC
    `,[student.id]),
  ]);
  return res.json({ concept_performance: performance.rows, remediation_recommendations: recommendations.rows });
});

export default router;
