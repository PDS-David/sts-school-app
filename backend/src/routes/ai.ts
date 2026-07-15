import { Router } from 'express';
import type { Response } from 'express';
import { query } from '../db/pool.js';
import { requireAuth, requireRole, requirePerm } from '../middleware/auth.js';
import { generate, generateJSON } from '../utils/ai.js';

const router = Router();
router.use(requireAuth);

// This file is the technical AI hub — every route here is what the mobile
// app presents to users as "Brainee". Nothing in this file, or anywhere else
// this pass touches, ever writes to `scores`, `attendance`, or
// `class_records` (the traditional, teacher-entered term-grading system).
// Brainee only ever operates inside the STS Virtual School's own tables
// (questions/assessments/submissions/weekly_efforts).

// Runs a generate() call and normalizes any failure into a consistent HTTP
// response shape, since generate() throws plain Errors with a .statusCode
// that this project's global error handler doesn't already recognize (it
// only special-cases SyntaxError and pg error codes — see index.ts).
async function respondWithGenerate(
  res: Response,
  prompt: string,
  task: string,
  userId: string,
  role: string,
) {
  try {
    const text = await generate(prompt, task, { userId, role });
    return res.json({ ok: true, reply: text });
  } catch (err: any) {
    const statusCode = err?.statusCode ?? 500;
    return res.status(statusCode).json({ ok: false, error: err?.message ?? 'Brainee request failed.' });
  }
}

// ── POST /ai/ping ──────────────────────────────────────────────────────────
// Verifies the Gemini wiring end-to-end (env var present, @google/genai
// reachable, model/fallback chain working). Admin-only, does nothing else.
router.post('/ping', requireRole('admin'), async (req, res) => {
  const prompt = typeof req.body?.prompt === 'string' && req.body.prompt.trim()
    ? req.body.prompt.trim()
    : 'Reply with exactly one short sentence confirming you received this test message.';
  return respondWithGenerate(res, prompt, 'ping', req.user!.id, req.user!.role);
});

// ── POST /ai/chat ──────────────────────────────────────────────────────────
// General-purpose "Ask Brainee" conversation. Any authenticated role. Not
// persisted server-side (kept deliberately separate from the human
// `messages` table/thread system — Brainee is not a person in the school's
// messaging directory).
router.post('/chat', async (req, res) => {
  const { message, history } = req.body as {
    message?: string;
    history?: Array<{ role: 'user' | 'brainee'; text: string }>;
  };
  if (!message?.trim()) return res.status(400).json({ error: 'message is required' });

  const priorTurns = Array.isArray(history) ? history.slice(-6) : [];
  const transcript = priorTurns
    .map((h) => `${h.role === 'user' ? 'Student' : 'Brainee'}: ${h.text}`)
    .join('\n');

  const prompt =
    `You are Brainee, a friendly, encouraging study assistant inside a Nigerian ` +
    `school app, talking with a ${req.user!.role}. Keep answers short, clear, and ` +
    `age-appropriate. Do not provide answers to a live school exam/assessment — ` +
    `if asked to solve what sounds like a current test question, offer to explain ` +
    `the underlying concept instead.\n\n` +
    (transcript ? `Recent conversation:\n${transcript}\n\n` : '') +
    `Student: ${message.trim()}`;

  return respondWithGenerate(res, prompt, 'chat', req.user!.id, req.user!.role);
});

// ── POST /ai/explain ───────────────────────────────────────────────────────
router.post('/explain', async (req, res) => {
  const { topic, subject, class_name } = req.body as { topic?: string; subject?: string; class_name?: string };
  if (!topic?.trim()) return res.status(400).json({ error: 'topic is required' });

  const prompt =
    `Explain "${topic.trim()}" to a ${class_name ?? 'school'} student` +
    (subject ? ` in the subject ${subject}` : '') +
    `. Use simple words, short sentences, and one relatable everyday example. ` +
    `Keep it to 3-5 sentences unless the topic genuinely needs more.`;

  return respondWithGenerate(res, prompt, 'explain', req.user!.id, req.user!.role);
});

// ── POST /ai/notes ──────────────────────────────────────────────────────────
router.post('/notes', async (req, res) => {
  const { topic, subject } = req.body as { topic?: string; subject?: string };
  if (!topic?.trim()) return res.status(400).json({ error: 'topic is required' });

  const prompt =
    `Write short, clear study notes on "${topic.trim()}"` +
    (subject ? ` for the subject ${subject}` : '') +
    `. Use bullet points, plain language, and no more than 6 bullets.`;

  return respondWithGenerate(res, prompt, 'notes', req.user!.id, req.user!.role);
});

// ── POST /ai/hint ───────────────────────────────────────────────────────────
// Body: { question_id }. Only for a question that's actually part of a
// currently-open assessment in the requesting student's own class/school —
// same scoping rule as GET /learning/assessments/:id/questions. The prompt
// deliberately never includes correct_keys, so Brainee structurally cannot
// leak the answer — it only ever sees the stem and options.
router.post('/hint', requireRole('student'), async (req, res) => {
  const user = req.user!;
  const { question_id } = req.body as { question_id?: number };
  if (!question_id) return res.status(400).json({ error: 'question_id is required' });

  const { rows: stRows } = await query('SELECT school_code, class_name FROM students WHERE user_id=$1', [user.id]);
  const student = stRows[0];
  if (!student) return res.status(404).json({ error: 'No student record for this user' });

  const { rows } = await query(
    `SELECT q.stem, q.options, q.type
     FROM assessment_questions aq
     JOIN questions q ON q.id = aq.question_id
     JOIN assessments a ON a.id = aq.assessment_id
     WHERE aq.question_id = $1
       AND a.status = 'open'
       AND a.school_code = $2
       AND a.class_name = $3
       AND (a.start_at IS NULL OR a.start_at <= now())
       AND (a.end_at IS NULL OR a.end_at >= now())
     LIMIT 1`,
    [question_id, student.school_code, student.class_name],
  );
  const q = rows[0];
  if (!q) return res.status(404).json({ error: 'That question is not in an assessment currently open to you' });

  const optionsText = Array.isArray(q.options)
    ? q.options.map((o: any) => `${o.key}: ${o.text}`).join('; ')
    : '';

  const prompt =
    `A student is attempting this question:\n"${q.stem}"\n` +
    (optionsText ? `Options: ${optionsText}\n` : '') +
    `Give ONE short hint (max 2 sentences) that helps them think through how to ` +
    `approach it. Do NOT state or imply the final answer or which option is correct.`;

  return respondWithGenerate(res, prompt, 'hint', user.id, user.role);
});

// ── POST /ai/generate-questions ─────────────────────────────────────────────
// Teacher/admin only. Drafts candidate questions for the teacher to review —
// nothing here is saved to the question bank automatically. A teacher who
// wants to keep a draft still calls the existing POST /learning/questions
// themselves, exactly as if they'd typed it in by hand. This keeps a human
// in the loop before anything Brainee writes becomes a real question a
// student can be assessed on.
router.post('/generate-questions', requirePerm('questions.write'), async (req, res) => {
  const { subject, class_name, topic, type, count } = req.body as {
    subject?: string; class_name?: string; topic?: string;
    type?: 'mcq' | 'essay'; count?: number;
  };
  if (!topic?.trim()) return res.status(400).json({ error: 'topic is required' });
  const qType = type === 'essay' ? 'essay' : 'mcq';
  const n = Math.min(Math.max(Number(count) || 3, 1), 10);

  const shape = qType === 'mcq'
    ? `{"stem": string, "options": [{"key":"A","text":string}, {"key":"B","text":string}, {"key":"C","text":string}, {"key":"D","text":string}], "correct_keys": [string], "marks": number}`
    : `{"stem": string, "marks": number}`;

  const prompt =
    `Draft ${n} ${qType === 'mcq' ? 'multiple-choice' : 'essay'} question(s) on the topic ` +
    `"${topic.trim()}"` +
    (subject ? ` for the subject ${subject}` : '') +
    (class_name ? ` at ${class_name} level` : '') +
    `. Return a JSON array where each item has exactly this shape: ${shape}`;

  try {
    const drafts = await generateJSON(prompt, 'generate-questions', { userId: req.user!.id, role: req.user!.role });
    return res.json({
      ok: true,
      drafts,
      note: 'Draft only — nothing has been saved. Review each item and POST the ones you want to keep to /learning/questions.',
    });
  } catch (err: any) {
    const statusCode = err?.statusCode ?? 502;
    return res.status(statusCode).json({ ok: false, error: err?.message ?? 'Brainee request failed.' });
  }
});

export default router;
