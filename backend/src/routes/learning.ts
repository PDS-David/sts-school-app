import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { createHash } from 'node:crypto';
import { z } from 'zod';
import type { PoolClient } from 'pg';
import { query, withTransaction } from '../db/pool.js';
import { verifyTopicAssetPayload } from '../db/attachTopicAssets.js';
import { requireAuth, requirePerm, requireRole, denyTeacherAccess } from '../middleware/auth.js';
import { resolveViewerClassNames, checkTeacherContentScope } from '../utils/scope.js';
import { generate, generateJSON } from '../utils/ai.js';
import { getOrGenerateCurriculumLesson } from '../services/curriculumLessonCache.js';
import { createRedisRateLimitStore } from '../utils/redisRateLimitStore.js';
import { sendPushToClass } from '../utils/push.js';
import type { AuthUser, LearningAccessPolicyState } from '../types/index.js';
import { isSafeExternalMaterialUrl } from '../utils/materialUrl.js';
import { attributionsForTopic, publicAttribution } from '../db/jss3Attributions.js';
import { resolveSequenceGroup, studentTopicPreview } from '../utils/jss3Sequence.js';
import { resolveDelivery, safeJss3Topic, retireStaleJss3Cache, assessmentDeliverable, withdrawnAssessmentIds } from '../utils/jss3DeliveryCorrection.js';
import { resolveSs1Delivery, safeSs1Topic, retireStaleSs1Cache, ss1AssessmentDeliverable, ss1WithdrawnAssessmentIds } from '../utils/ss1CateringDeliveryCorrection.js';
import { resolveSs1FrenchDelivery, retireStaleSs1FrenchCache } from '../utils/ss1FrenchDeliveryCorrection.js';
import { resolveSs1LiteratureDelivery, retireStaleSs1LiteratureCache } from '../utils/ss1LiteratureDelivery.js';
import { resolveSs1MathematicsDelivery, safeSs1MathematicsTopic, mathematicsAssetDeliverable, mathematicsAssetsForTopic, readMathematicsAsset, retireStaleSs1MathematicsCache } from '../utils/ss1MathematicsDeliveryCorrection.js';
import { resolveAgriculturalScienceDelivery, resolveAgriculturalScienceSupplement, resolveAgriculturalScienceSourceProjection, safeAgriculturalScienceTopic, retireStaleAgriculturalScienceCache, retireStaleAgriculturalScienceSupplementCache, retireStaleAgriculturalScienceSourceCache, agriculturalScienceAssessmentDeliverable, agriculturalScienceWithdrawnAssessmentIds, agriculturalScienceAssetDeliverable } from '../utils/ss1AgriculturalScienceDeliveryCorrection.js';
import { resolveEnglishDelivery, safeEnglishTopic, safeEnglishSupplementTopic, retireStaleEnglishCache, englishAssessmentDeliverable, englishWithdrawnAssessmentIds } from '../utils/ss1EnglishDeliveryCorrection.js';
import { listStudentSs1Lessons, getStudentSs1Lesson, listStudentSs1Assets, readStudentSs1Asset, studentSs1LessonPreview, safeStudentSs1Lesson } from '../db/ss1/studentDelivery.js';
import { listStudentSs23Units, listStudentSs23Subjects, getStudentSs23Unit, listStudentSs23Assets, readStudentSs23Asset, studentSs23UnitPreview, safeStudentSs23Unit, type Ss23ClassName } from '../db/ss23/studentDelivery.js';
import { resolvePrimary4SourceDelivery, safePrimary4Topic, primary4WithdrawnAssessmentIds, primary4AssessmentDeliverable, retireStalePrimary4Cache } from '../utils/primary4Delivery.js';

// Term PINs remain available, but enforcement starts only when explicitly enabled.
// Read per request (value is constant in a running server) so tests can exercise PIN on and off in one process.
const freeLaunchMode = () => process.env.FREE_LAUNCH_MODE !== 'false';
const termPinEnforced = (policy?: LearningAccessPolicyState) =>
  policy?.termPinEnforced ?? (!freeLaunchMode() && process.env.TERM_PIN_ENFORCED === 'true');
const curriculumSequenceEnforced = (policy?: LearningAccessPolicyState) =>
  policy?.curriculumSequenceEnforced ?? (!freeLaunchMode() && process.env.CURRICULUM_SEQUENCE_ENFORCED === 'true');

/** Strip teacher-only practice answers, marking guidance and source metadata before AI lesson grounding. */
function curriculumTeachingSource(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const markers = ['PRACTICE QUESTIONS AND MARKING GUIDE', 'SOURCES AND ATTRIBUTION'];
  const end = markers.reduce((limit, marker) => {
    const index = value.indexOf(marker);
    return index >= 0 ? Math.min(limit, index) : limit;
  }, value.length);
  const teachingText = value.slice(0, end).trim();
  return teachingText || null;
}

function verifyStudentDeliveryAsset(bytes: Buffer, mediaType: string, expectedSha256: string): boolean {
  if (!Buffer.isBuffer(bytes) || bytes.length === 0 || bytes.length > 10 * 1024 * 1024) return false;
  const actualHash = createHash('sha256').update(bytes).digest('hex');
  if (actualHash !== expectedSha256.toLowerCase()) return false;
  if (mediaType === 'audio/mpeg') {
    const hasId3 = bytes.length >= 3 && bytes.subarray(0, 3).toString('ascii') === 'ID3';
    const hasMpegFrame = bytes.length >= 2 && bytes[0] === 0xff && (bytes[1] & 0xe0) === 0xe0;
    return hasId3 || hasMpegFrame;
  }
  return verifyTopicAssetPayload(bytes, mediaType, expectedSha256);
}

const router = Router();
router.use(requireAuth, denyTeacherAccess);

// Curriculum lessons invoke the paid model directly from /learning (not /ai),
// so they need the same shared per-account HTTP ceiling as Brainee requests.
// The PostgreSQL-backed store keeps limits consistent across API instances.
const curriculumLessonLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.user!.id,
  message: { error: 'Curriculum lesson generation limit exceeded. Try again in one minute.' },
  store: createRedisRateLimitStore('curriculum-lesson-http'),
});
router.use((req, res, next) => {
  if (req.user?.role === 'teacher') {
    return res.status(403).json({ error: 'Teacher accounts are limited to physical-class report workflows.' });
  }
  next();
});

type ContentReferenceError = { status: 400; error: string } | null;

/**
 * Lock and validate the school-owned reference rows before a learning-content
 * write. The row locks prevent an administrator changing a subject/term's
 * school assignment between validation and persistence.
 */
async function validateContentReferences(
  client: PoolClient,
  schoolCode: string,
  subjectId: number,
  termId: number | null,
): Promise<ContentReferenceError> {
  const { rows: schoolRows } = await client.query(
    'SELECT code FROM schools WHERE code=$1 FOR SHARE',
    [schoolCode],
  );
  if (!schoolRows[0]) return { status: 400, error: 'Unknown school_code.' };

  const { rows: subjectRows } = await client.query(
    'SELECT id FROM subjects WHERE id=$1 AND school_code=$2 FOR SHARE',
    [subjectId, schoolCode],
  );
  if (!subjectRows[0]) return { status: 400, error: 'subject_id must belong to the target school.' };

  if (termId != null) {
    const { rows: termRows } = await client.query(
      'SELECT id FROM terms WHERE id=$1 AND school_code=$2 FOR SHARE',
      [termId, schoolCode],
    );
    if (!termRows[0]) return { status: 400, error: 'term_id must belong to the target school.' };
  }
  return null;
}

function resolveContentSchool(
  user: AuthUser,
  requestedSchoolCode?: string,
): { schoolCode: string } | { status: 400 | 403; error: string } {
  if (user.role === 'admin') {
    const schoolCode = requestedSchoolCode?.trim() || user.school_code?.trim();
    return schoolCode
      ? { schoolCode }
      : { status: 400, error: 'school_code is required when an administrator creates learning content.' };
  }
  const schoolCode = user.school_code?.trim();
  return schoolCode
    ? { schoolCode }
    : { status: 403, error: 'Your account is not assigned to a school.' };
}

function resolveLearningAssetSchool(
  user: AuthUser,
  requestedSchoolCode?: string,
): { schoolCode: string } | { status: 400 | 403; error: string } {
  const ownSchool = user.school_code?.trim();
  if (user.role === 'admin') {
    if (ownSchool) {
      if (requestedSchoolCode?.trim() && requestedSchoolCode.trim() !== ownSchool) {
        return { status: 403, error: 'This administrator is restricted to their assigned school.' };
      }
      return { schoolCode: ownSchool };
    }
    const requested = requestedSchoolCode?.trim();
    return requested
      ? { schoolCode: requested }
      : { status: 400, error: 'school_code is required for a global administrator to access school assets.' };
  }
  return ownSchool
    ? { schoolCode: ownSchool }
    : { status: 403, error: 'Your account is not assigned to a school.' };
}


// Individually certified SS1 package lessons are read-only student content.
// Existing database topics, term PINs and topic-completion sequencing remain unchanged.
async function ss1StudentId(user: AuthUser): Promise<string | null> {
  if (user.role !== 'student') return null;
  const classes = await resolveViewerClassNames(user);
  if (!Array.isArray(classes) || !classes.includes('SS 1')) return null;
  const { rows } = await query(
    'SELECT id FROM students WHERE user_id=$1 AND class_name=$2 AND deleted_at IS NULL',
    [user.id, 'SS 1'],
  );
  return rows[0]?.id ?? null;
}

async function redeemedSs1Terms(studentId: string, policy?: LearningAccessPolicyState): Promise<Set<string>> {
  if (!termPinEnforced(policy)) return new Set(['1st Term', '2nd Term', '3rd Term']);
  const { rows } = await query(
    'SELECT term_label FROM term_access_pins WHERE student_id=$1 AND redeemed_at IS NOT NULL',
    [studentId],
  );
  return new Set(rows.map((row: any) => String(row.term_label)));
}

// Resolve the same sequence policy used by GET /topics for direct asset access.
// A missing student record is fail-closed: no ordered lesson content/assets.
function ss1ProgressKey(lesson: any): string {
  const contentFingerprint = lesson.body_sha256
    ?? createHash('sha256').update(String(lesson.body ?? '')).digest('hex');
  return 'ss1:' + createHash('sha256').update([
    'SS 1', lesson.canonical_subject, lesson.term, String(lesson.id),
    String(contentFingerprint), JSON.stringify(lesson.objectives ?? []),
  ].join('\\0')).digest('hex');
}

function ss23ProgressKey(unit: any): string {
  const contentFingerprint = unit.body_sha256
    ?? createHash('sha256').update(String(unit.body ?? '')).digest('hex');
  return 'ss23:' + createHash('sha256').update([
    unit.class_name, unit.subject, unit.term, String(unit.id),
    String(contentFingerprint), JSON.stringify(unit.objectives ?? []),
  ].join('\\0')).digest('hex');
}

async function completedPackageLessonKeys(studentId: string, className: 'SS 1' | 'SS 2' | 'SS 3'): Promise<Set<string>> {
  try {
    const { rows } = await query(
      'SELECT lesson_key FROM student_curriculum_lesson_progress WHERE student_id=$1 AND class_name=$2',
      [studentId, className],
    );
    return new Set(rows.map((row: any) => String(row.lesson_key)));
  } catch (error: any) {
    // Package progress remains non-blocking until migration 0009 is applied.
    if (error?.code === '42P01') return new Set();
    throw error;
  }
}

async function markPackageLessonCompleted(
  studentId: string,
  lessonKey: string,
  className: 'SS 1' | 'SS 2' | 'SS 3',
  subject: string,
  term: string,
  title: string,
): Promise<string | null> {
  await query(
    `INSERT INTO student_curriculum_lesson_progress
       (student_id, lesson_key, class_name, subject_name, term_label, lesson_title)
     VALUES ($1,$2,$3,$4,$5,$6)
     ON CONFLICT (student_id, lesson_key) DO NOTHING`,
    [studentId, lessonKey, className, subject, term, title],
  );
  const { rows } = await query(
    'SELECT completed_at FROM student_curriculum_lesson_progress WHERE student_id=$1 AND lesson_key=$2',
    [studentId, lessonKey],
  );
  return rows[0]?.completed_at ?? null;
}

async function studentTopicSequenceLocked(user: AuthUser, topic: any, policy?: LearningAccessPolicyState): Promise<boolean> {
  if (user.role !== 'student' || !curriculumSequenceEnforced(policy)) return false;
  if (topic.order_index == null) return false;
  const { rows: studentRows } = await query('SELECT id FROM students WHERE user_id=$1', [user.id]);
  const studentId = studentRows[0]?.id;
  if (!studentId) return true;
  const { rows: group } = await query(
    `SELECT t.id, t.order_index, (to_jsonb(t)->>'sequence_rank')::numeric AS sequence_rank
       FROM topics t
      WHERE t.school_code=$1 AND t.subject_id=$2 AND t.class_name IS NOT DISTINCT FROM $3
        AND t.term_label IS NOT DISTINCT FROM $4 AND t.order_index IS NOT NULL
      ORDER BY COALESCE((to_jsonb(t)->>'sequence_rank')::numeric, t.order_index) NULLS LAST, t.order_index NULLS LAST, t.created_at DESC`,
    [topic.school_code, topic.subject_id, topic.class_name, topic.term_label],
  );
  const ids = group.map((row: any) => row.id);
  const [{ rows: completionRows }, { rows: pinRows }] = await Promise.all([
    query('SELECT topic_id, passed FROM topic_completions WHERE student_id=$1 AND topic_id=ANY($2)', [studentId, ids]),
    query('SELECT term_label FROM term_access_pins WHERE student_id=$1 AND redeemed_at IS NOT NULL', [studentId]),
  ]);
  const passedIds = new Set(completionRows.filter((row: any) => row.passed === true).map((row: any) => Number(row.topic_id)));
  const redeemedTerms = new Set(pinRows.map((row: any) => String(row.term_label)));
  const pinOk = !termPinEnforced(policy) || redeemedTerms.has(String(topic.term_label));
  return resolveSequenceGroup(group, passedIds, pinOk).get(Number(topic.id))?.locked ?? true;
}

async function studentAssessmentTopicLocked(user: AuthUser, assessmentId: string | number, policy?: LearningAccessPolicyState): Promise<boolean> {
  if (user.role !== 'student') return false;
  const { rows: linkedTopics } = await query(
    `SELECT t.id, t.school_code, t.subject_id, t.class_name, t.term_label, t.order_index,
            (to_jsonb(t)->>'sequence_rank')::numeric AS sequence_rank
       FROM topics t WHERE t.generated_assessment_id=$1`,
    [assessmentId],
  );
  for (const topic of linkedTopics) {
    if (await studentTopicSequenceLocked(user, topic, policy)) return true;
  }
  return false;
}

router.get('/ss1/lessons', requirePerm('topics.read'), async (req, res) => {
  const studentId = await ss1StudentId(req.user!);
  if (!studentId) return res.json({ lessons: [] });
  const subjectName = typeof req.query.subject_name === 'string' ? req.query.subject_name : undefined;
  if (subjectName && subjectName.trim().length > 120) {
    return res.status(400).json({ error: 'subject_name is too long' });
  }
  const unlockedTerms = await redeemedSs1Terms(studentId, req.learningAccessPolicy);
  const completedKeys = await completedPackageLessonKeys(studentId, 'SS 1');
  const lessons = listStudentSs1Lessons(subjectName).map(lesson => {
    const completed = completedKeys.has(ss1ProgressKey(lesson));
    const locked = !unlockedTerms.has(lesson.term);
    // A locked list row is metadata only. Do not serialize lesson body,
    // practice questions/answers, source provenance or asset URLs.
    if (locked) return { ...studentSs1LessonPreview(lesson, true), completed, assets: [] };
    return {
      ...safeStudentSs1Lesson(lesson),
      ...studentSs1LessonPreview(lesson, false),
      completed,
      assets: listStudentSs1Assets(lesson.id).map(asset => ({
        id: asset.id,
        alt: asset.alt,
        mime: asset.media_type,
        url: `/learning/ss1/assets/${encodeURIComponent(asset.id)}`,
        order: asset.order,
      })),
    };
  });
  return res.json({ lessons });
});

router.get('/ss1/lessons/:lessonId', requirePerm('topics.read'), async (req, res) => {
  const studentId = await ss1StudentId(req.user!);
  if (!studentId) return res.status(404).json({ error: 'Lesson not found' });
  const lesson = getStudentSs1Lesson(req.params.lessonId);
  if (!lesson) return res.status(404).json({ error: 'Lesson not found' });
  const unlockedTerms = await redeemedSs1Terms(studentId, req.learningAccessPolicy);
  if (!unlockedTerms.has(lesson.term)) {
    return res.status(423).json({ error: 'Redeem the Term PIN to unlock lessons for this term.' });
  }
  const completedKeys = await completedPackageLessonKeys(studentId, 'SS 1');
  return res.json({
    lesson: {
      ...safeStudentSs1Lesson(lesson),
      completed: completedKeys.has(ss1ProgressKey(lesson)),
      assets: listStudentSs1Assets(lesson.id).map(asset => ({
        id: asset.id,
        alt: asset.alt,
        mime: asset.media_type,
        url: `/learning/ss1/assets/${encodeURIComponent(asset.id)}`,
        order: asset.order,
      })),
    },
  });
});

router.post('/ss1/lessons/:lessonId/generate', curriculumLessonLimiter, requirePerm('topics.read'), async (req, res) => {
  const studentId = await ss1StudentId(req.user!);
  if (!studentId) return res.status(404).json({ error: 'Lesson not found' });
  const lesson = getStudentSs1Lesson(req.params.lessonId);
  if (!lesson) return res.status(404).json({ error: 'Lesson not found' });
  const unlockedTerms = await redeemedSs1Terms(studentId, req.learningAccessPolicy);
  if (!unlockedTerms.has(lesson.term)) {
    return res.status(423).json({ error: 'Redeem the Term PIN to generate this lesson.' });
  }
  try {
    const result = await getOrGenerateCurriculumLesson({
      cacheKey: `ss1:${encodeURIComponent(lesson.canonical_subject)}:${encodeURIComponent(lesson.term)}:${encodeURIComponent(String(lesson.id))}`,
      input: {
        className: 'SS 1',
        subject: lesson.canonical_subject,
        term: lesson.term,
        topic: lesson.title,
        objectives: lesson.objectives,
        sourceMaterial: lesson.body,
      },
      identity: { userId: req.user!.id, role: req.user!.role },
    });
    return res.json({ ok: true, lesson: result.lesson, cached: result.cached });
  } catch (error: any) {
    return res.status(error?.statusCode ?? 502).json({
      ok: false, error: error?.message ?? 'A complete lesson could not be generated. Please retry.',
      code: 'CURRICULUM_LESSON_GENERATION_FAILED',
    });
  }
});

router.post('/ss1/lessons/:lessonId/progress', requireRole('student'), requirePerm('topics.complete'), async (req, res) => {
  const studentId = await ss1StudentId(req.user!);
  if (!studentId) return res.status(404).json({ error: 'Lesson not found' });
  const lesson = getStudentSs1Lesson(req.params.lessonId);
  if (!lesson) return res.status(404).json({ error: 'Lesson not found' });
  const unlockedTerms = await redeemedSs1Terms(studentId, req.learningAccessPolicy);
  if (!unlockedTerms.has(lesson.term)) {
    return res.status(423).json({ error: 'Redeem the Term PIN before completing this lesson.' });
  }
  try {
    const completedAt = await markPackageLessonCompleted(
      studentId, ss1ProgressKey(lesson), 'SS 1',
      lesson.canonical_subject, lesson.term, lesson.title,
    );
    return res.json({ completed: true, completed_at: completedAt });
  } catch (error: any) {
    if (error?.code === '42P01') return res.status(503).json({ error: 'Package progress storage is not installed. Apply migration 0009 first.' });
    throw error;
  }
});

router.get('/ss1/assets/:assetId', requirePerm('topics.read'), async (req, res) => {
  const studentId = await ss1StudentId(req.user!);
  if (!studentId) return res.status(404).json({ error: 'Asset not found' });
  const result = readStudentSs1Asset(req.params.assetId);
  if (!result) return res.status(404).json({ error: 'Asset not found' });
  const unlockedTerms = await redeemedSs1Terms(studentId, req.learningAccessPolicy);
  if (!unlockedTerms.has(result.asset.term)) {
    return res.status(423).json({ error: 'Redeem the Term PIN to unlock this lesson asset.' });
  }
  if (!verifyStudentDeliveryAsset(result.bytes, result.asset.media_type, result.asset.sha256)) {
    console.error('[assets] SS1 student asset failed MIME/SHA-256 verification', { assetId: result.asset.id });
    return res.status(500).json({ error: 'Asset integrity verification failed.' });
  }
  res.set('Content-Type', result.asset.media_type);
  res.set('Content-Length', String(result.bytes.length));
  res.set('ETag', `"${result.asset.sha256}"`);
  res.set('X-Content-Type-Options', 'nosniff');
  res.set('Content-Disposition', 'inline');
  if (result.asset.media_type === 'image/svg+xml') res.set('Content-Security-Policy', "default-src 'none'; sandbox");
  res.set('Cache-Control', 'private, no-store, max-age=0');
  return res.send(result.bytes);
});

// SS2 instructional lessons and SS3 examination-preparation resources are
// delivered only from individually approved, implemented and verified packages.
// Class membership is resolved server-side; request parameters never select a class.
async function ss23StudentContext(user: AuthUser): Promise<{ studentId: string; className: Ss23ClassName } | null> {
  if (user.role !== 'student') return null;
  const classes = await resolveViewerClassNames(user);
  if (!Array.isArray(classes)) return null;
  const allowed = classes.filter((name): name is Ss23ClassName => name === 'SS 2' || name === 'SS 3');
  if (allowed.length !== 1) return null;
  const className = allowed[0];
  const { rows } = await query(
    'SELECT id FROM students WHERE user_id=$1 AND class_name=$2 AND deleted_at IS NULL',
    [user.id, className],
  );
  return rows[0]?.id ? { studentId: rows[0].id, className } : null;
}

async function redeemedSs23Terms(studentId: string, policy?: LearningAccessPolicyState): Promise<Set<string>> {
  if (!termPinEnforced(policy)) return new Set(['1st Term', '2nd Term', '3rd Term']);
  const { rows } = await query(
    'SELECT term_label FROM term_access_pins WHERE student_id=$1 AND redeemed_at IS NOT NULL',
    [studentId],
  );
  return new Set(rows.map((row: any) => String(row.term_label)));
}

function studentSs23Assets(unitId: string, className: Ss23ClassName) {
  return listStudentSs23Assets(unitId, className).map(asset => ({
    id: asset.id,
    alt: asset.alt,
    mime: asset.media_type,
    url: `/learning/ss23/assets/${encodeURIComponent(asset.id)}`,
    order: asset.order,
  }));
}

router.get('/ss23/subjects', requirePerm('topics.read'), async (req, res) => {
  const context = await ss23StudentContext(req.user!);
  if (!context) return res.json({ subjects: [] });
  // This list is derived from the same server-side delivery gate as lesson
  // delivery. Draft, unverified, rights-pending or otherwise blocked packages
  // must not create visible subject tiles in the student app.
  return res.json({ subjects: listStudentSs23Subjects(context.className) });
});

router.get('/ss23/lessons', requirePerm('topics.read'), async (req, res) => {
  const context = await ss23StudentContext(req.user!);
  if (!context || context.className !== 'SS 2') return res.json({ units: [] });
  const subjectName = typeof req.query.subject_name === 'string' ? req.query.subject_name : undefined;
  if (subjectName && subjectName.trim().length > 120) {
    return res.status(400).json({ error: 'subject_name is too long' });
  }
  const unlockedTerms = await redeemedSs23Terms(context.studentId, req.learningAccessPolicy);
  const completedKeys = await completedPackageLessonKeys(context.studentId, 'SS 2');
  const units = listStudentSs23Units('SS 2', subjectName).map(unit => {
    const locked = !unlockedTerms.has(unit.term);
    const completed = completedKeys.has(ss23ProgressKey(unit));
    if (locked) return { ...studentSs23UnitPreview(unit, true), completed, assets: [] };
    return {
      ...safeStudentSs23Unit(unit),
      ...studentSs23UnitPreview(unit, false),
      completed,
      assets: studentSs23Assets(unit.id, 'SS 2'),
    };
  });
  return res.json({ units });
});

router.get('/ss23/preparation', requirePerm('topics.read'), async (req, res) => {
  const context = await ss23StudentContext(req.user!);
  if (!context || context.className !== 'SS 3') return res.json({ units: [] });
  const subjectName = typeof req.query.subject_name === 'string' ? req.query.subject_name : undefined;
  if (subjectName && subjectName.trim().length > 120) {
    return res.status(400).json({ error: 'subject_name is too long' });
  }
  const unlockedTerms = await redeemedSs23Terms(context.studentId, req.learningAccessPolicy);
  const completedKeys = await completedPackageLessonKeys(context.studentId, 'SS 3');
  const units = listStudentSs23Units('SS 3', subjectName).map(unit => {
    const locked = !unlockedTerms.has(unit.term);
    const completed = completedKeys.has(ss23ProgressKey(unit));
    if (locked) return { ...studentSs23UnitPreview(unit, true), completed, assets: [] };
    return {
      ...safeStudentSs23Unit(unit),
      ...studentSs23UnitPreview(unit, false),
      completed,
      assets: studentSs23Assets(unit.id, 'SS 3'),
    };
  });
  return res.json({ units });
});

router.get('/ss23/units/:unitId', requirePerm('topics.read'), async (req, res) => {
  const context = await ss23StudentContext(req.user!);
  if (!context) return res.status(404).json({ error: 'Unit not found' });
  const unit = getStudentSs23Unit(req.params.unitId, context.className);
  if (!unit) return res.status(404).json({ error: 'Unit not found' });
  const unlockedTerms = await redeemedSs23Terms(context.studentId, req.learningAccessPolicy);
  if (!unlockedTerms.has(unit.term)) {
    return res.status(423).json({ error: 'Redeem the Term PIN to unlock this curriculum unit.' });
  }
  const completedKeys = await completedPackageLessonKeys(context.studentId, context.className);
  return res.json({
    unit: {
      ...safeStudentSs23Unit(unit),
      ...studentSs23UnitPreview(unit, false),
      completed: completedKeys.has(ss23ProgressKey(unit)),
      assets: studentSs23Assets(unit.id, context.className),
    },
  });
});

router.post('/ss23/units/:unitId/generate', curriculumLessonLimiter, requirePerm('topics.read'), async (req, res) => {
  const context = await ss23StudentContext(req.user!);
  if (!context) return res.status(404).json({ error: 'Unit not found' });
  const unit = getStudentSs23Unit(req.params.unitId, context.className);
  if (!unit) return res.status(404).json({ error: 'Unit not found' });
  const unlockedTerms = await redeemedSs23Terms(context.studentId, req.learningAccessPolicy);
  if (!unlockedTerms.has(unit.term)) {
    return res.status(423).json({ error: 'Redeem the Term PIN to generate this lesson.' });
  }
  const sourceMaterial = unit.class_name === 'SS 3' && unit.delivery_mode === 'EXAM_PREPARATION'
    ? `SS3 EXAMINATION PREPARATION: revise the approved topic and objectives only. Do not introduce new syllabus content or represent this as a new instructional unit.\n\n${unit.body}`
    : unit.body;
  try {
    const result = await getOrGenerateCurriculumLesson({
      cacheKey: `ss23:${encodeURIComponent(unit.class_name)}:${encodeURIComponent(unit.subject)}:${encodeURIComponent(unit.term)}:${encodeURIComponent(String(unit.id))}`,
      input: {
        className: unit.class_name,
        subject: unit.subject,
        term: unit.term,
        topic: unit.title,
        objectives: unit.objectives,
        sourceMaterial,
        mode: unit.class_name === 'SS 3' && unit.delivery_mode === 'EXAM_PREPARATION' ? 'EXAM_PREPARATION' : 'INSTRUCTION',
      },
      identity: { userId: req.user!.id, role: req.user!.role },
    });
    return res.json({ ok: true, lesson: result.lesson, cached: result.cached });
  } catch (error: any) {
    return res.status(error?.statusCode ?? 502).json({
      ok: false, error: error?.message ?? 'A complete lesson could not be generated. Please retry.',
      code: 'CURRICULUM_LESSON_GENERATION_FAILED',
    });
  }
});

router.post('/ss23/units/:unitId/progress', requireRole('student'), requirePerm('topics.complete'), async (req, res) => {
  const context = await ss23StudentContext(req.user!);
  if (!context) return res.status(404).json({ error: 'Unit not found' });
  const unit = getStudentSs23Unit(req.params.unitId, context.className);
  if (!unit) return res.status(404).json({ error: 'Unit not found' });
  const unlockedTerms = await redeemedSs23Terms(context.studentId, req.learningAccessPolicy);
  if (!unlockedTerms.has(unit.term)) {
    return res.status(423).json({ error: 'Redeem the Term PIN before completing this lesson.' });
  }
  try {
    const completedAt = await markPackageLessonCompleted(
      context.studentId, ss23ProgressKey(unit), context.className,
      unit.subject, unit.term, unit.title,
    );
    return res.json({ completed: true, completed_at: completedAt });
  } catch (error: any) {
    if (error?.code === '42P01') return res.status(503).json({ error: 'Package progress storage is not installed. Apply migration 0009 first.' });
    throw error;
  }
});

router.get('/ss23/assets/:assetId', requirePerm('topics.read'), async (req, res) => {
  const context = await ss23StudentContext(req.user!);
  if (!context) return res.status(404).json({ error: 'Asset not found' });
  const result = readStudentSs23Asset(req.params.assetId, context.className);
  if (!result) return res.status(404).json({ error: 'Asset not found' });
  const unlockedTerms = await redeemedSs23Terms(context.studentId, req.learningAccessPolicy);
  if (!unlockedTerms.has(result.asset.term)) {
    return res.status(423).json({ error: 'Redeem the Term PIN to unlock this curriculum asset.' });
  }
  if (!verifyStudentDeliveryAsset(result.bytes, result.asset.media_type, result.asset.sha256)) {
    console.error('[assets] SS23 student asset failed MIME/SHA-256 verification', { assetId: result.asset.id });
    return res.status(500).json({ error: 'Asset integrity verification failed.' });
  }
  res.set('Content-Type', result.asset.media_type);
  res.set('Content-Length', String(result.bytes.length));
  res.set('ETag', `"${result.asset.sha256}"`);
  res.set('X-Content-Type-Options', 'nosniff');
  res.set('Content-Disposition', 'inline');
  if (result.asset.media_type === 'image/svg+xml') res.set('Content-Security-Policy', "default-src 'none'; sandbox");
  res.set('Cache-Control', 'private, no-store, max-age=0');
  return res.send(result.bytes);
});

// ════════════════════════════════════════════════════════
// MATERIALS
// ════════════════════════════════════════════════════════

router.get('/materials', requirePerm('materials.read'), async (req, res) => {
  const { subject_id, class_name, term_id, school_code } = req.query as Record<string, string>;
  const user = req.user!;
  const schoolScope = resolveLearningAssetSchool(user, school_code);
  if ('error' in schoolScope) return res.status(schoolScope.status).json({ error: schoolScope.error });
  const sc = schoolScope.schoolCode;
  res.set('Cache-Control', 'private, no-store');

  // Students/parents can't be trusted to pass class_name themselves (no
  // screen does), so their viewable classes are resolved server-side and
  // enforced regardless of what (if anything) the client sent. See
  // resolveViewerClassNames() for why.
  const viewerClasses = await resolveViewerClassNames(user);

  let sql = `SELECT m.*,sub.name AS subject_name,u.full_name AS uploaded_by
             FROM materials m
             JOIN subjects sub ON sub.id=m.subject_id AND sub.school_code=m.school_code
             JOIN users u ON u.id=m.created_by
             WHERE m.school_code=$1
               AND (m.term_id IS NULL OR EXISTS (SELECT 1 FROM terms t WHERE t.id=m.term_id AND t.school_code=m.school_code))`;
  const params: unknown[] = [sc];

  if (user.role === 'teacher') {
    // A subject teacher sees their subject across every class; a class
    // teacher sees their own class across every subject; a teacher with
    // both gets the union — same "own class OR own subject" scope the
    // write side already enforces (see checkTeacherContentScope above).
    // Previously this fell through to the unrestricted (null) branch below
    // like admin, which meant any teacher could browse every class's
    // materials school-wide regardless of assignment — tightened per
    // school request.
    const clauses: string[] = [];
    if (user.assigned_class) { params.push(user.assigned_class); clauses.push(`m.class_name=$${params.length}`); }
    if (user.assigned_subject_ids?.length) { params.push(user.assigned_subject_ids); clauses.push(`m.subject_id = ANY($${params.length})`); }
    // A teacher with neither assignment can't create content either (see
    // checkTeacherContentScope) — FALSE rather than showing everything
    // keeps read and write scope consistent for that same unassigned state.
    sql += clauses.length ? ` AND (${clauses.join(' OR ')})` : ' AND FALSE';
  } else if (viewerClasses) {
    if (!viewerClasses.length) {
      // Student with no linked record, or parent with no wards — nothing to show.
      return res.json({ materials: [] });
    }
    params.push(viewerClasses);
    sql += ` AND (m.class_name = ANY($${params.length}) OR m.class_name IS NULL)`;
  } else if (class_name) {
    params.push(class_name); sql += ` AND m.class_name=$${params.length}`;
  }

  if (subject_id) { params.push(subject_id); sql += ` AND m.subject_id=$${params.length}`; }
  if (term_id)    { params.push(term_id);    sql += ` AND m.term_id=$${params.length}`; }
  sql += ' ORDER BY m.created_at DESC';

  const { rows } = await query(sql, params);
  return res.json({ materials: rows.map((material: any) => ({
    ...material,
    // Legacy unsafe URLs remain visible as metadata but cannot be opened or downloaded.
    url: isSafeExternalMaterialUrl(material.url) ? material.url : null,
  })) });
});

const materialCreateSchema = z.object({
  subject_id: z.coerce.number().int().positive(),
  class_name: z.string().trim().min(1).max(100).nullable().optional(),
  term_id: z.coerce.number().int().positive().nullable().optional(),
  title: z.string().trim().min(1).max(255),
  type: z.enum(['pdf', 'video', 'doc', 'link']),
  url: z.string().min(1).max(2048).refine(isSafeExternalMaterialUrl, 'Material URL must be a safe HTTPS link to a public hostname.'),
  school_code: z.string().trim().min(1).max(50).optional(),
});

router.post('/materials', requirePerm('materials.write'), async (req, res) => {
  const parsed = materialCreateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const data = parsed.data;
  const user = req.user!;
  if (user.role === 'admin' && user.school_code && data.school_code && data.school_code !== user.school_code) {
    return res.status(403).json({ error: 'This administrator is restricted to their assigned school.' });
  }
  const target = resolveContentSchool(user, user.school_code ?? data.school_code);
  if ('error' in target) return res.status(target.status).json({ error: target.error });

  const scopeError = await checkTeacherContentScope(req.user!, {
    class_name: data.class_name ?? null,
    subject_id: data.subject_id,
  });
  if (scopeError) return res.status(scopeError.status).json({ error: scopeError.error });

  const result = await withTransaction(async (client) => {
    const referenceError = await validateContentReferences(
      client, target.schoolCode, data.subject_id, data.term_id ?? null,
    );
    if (referenceError) return { ok: false as const, ...referenceError };

    const { rows } = await client.query(
      `INSERT INTO materials(school_code,subject_id,class_name,term_id,title,type,url,created_by)
       VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [target.schoolCode, data.subject_id, data.class_name ?? null, data.term_id ?? null,
       data.title, data.type, data.url, req.user!.id],
    );
    return { ok: true as const, material: rows[0] };
  });
  if (!result.ok) return res.status(result.status).json({ error: result.error });
  return res.status(201).json({ material: result.material });
});

router.delete('/materials/:id', requirePerm('materials.write'), async (req, res) => {
  const user = req.user!;
  const materialId = Number(req.params.id);
  if (!Number.isSafeInteger(materialId) || materialId <= 0) return res.status(400).json({ error: 'Invalid material id' });

  let sql: string;
  let params: unknown[];
  if (user.role === 'admin' && !user.school_code) {
    // Global administrators may remove material from any school.
    sql = 'DELETE FROM materials WHERE id=$1 RETURNING id';
    params = [materialId];
  } else if (user.role === 'admin') {
    // School-bound administrators can remove any material in their own school only.
    sql = 'DELETE FROM materials WHERE id=$1 AND school_code=$2 RETURNING id';
    params = [materialId, user.school_code];
  } else {
    // Teachers can remove only their own uploads within their assigned school.
    if (!user.school_code) return res.status(403).json({ error: 'Your account is not assigned to a school.' });
    sql = 'DELETE FROM materials WHERE id=$1 AND school_code=$2 AND created_by=$3 RETURNING id';
    params = [materialId, user.school_code, user.id];
  }
  const { rows } = await query(sql, params);
  if (!rows[0]) return res.status(404).json({ error: 'Material not found' });
  return res.json({ ok: true });
});

// ════════════════════════════════════════════════════════
// TOPICS
// ════════════════════════════════════════════════════════

// ── GET /achievements/me — earned badges derived from verified learning data ──
// No duplicate badge ledger is maintained: topic passes and assessment
// submissions are the source of truth, so achievements cannot drift from
// grades or be duplicated by retries. Students can read only their own data.
router.get('/achievements/me', requireRole('student'), async (req, res) => {
  const { rows: studentRows } = await query(
    'SELECT id FROM students WHERE user_id=$1 AND deleted_at IS NULL LIMIT 1',
    [req.user!.id],
  );
  const student = studentRows[0];
  if (!student) return res.status(404).json({ error: 'No active student record for this account' });

  const [{ rows: topicRows }, { rows: assessmentRows }] = await Promise.all([
    query(
      `SELECT COUNT(*) FILTER (WHERE passed IS TRUE)::int AS passed_topics,
              MIN(completed_at) FILTER (WHERE passed IS TRUE) AS first_topic_passed_at,
              (SELECT completed_at FROM topic_completions
                WHERE student_id=$1 AND passed IS TRUE ORDER BY completed_at OFFSET 9 LIMIT 1) AS tenth_topic_passed_at,
              (SELECT completed_at FROM topic_completions
                WHERE student_id=$1 AND passed IS TRUE ORDER BY completed_at OFFSET 24 LIMIT 1) AS twenty_fifth_topic_passed_at
         FROM topic_completions WHERE student_id=$1`,
      [student.id],
    ),
    query(
      `SELECT COUNT(*)::int AS submitted_assessments,
              MIN(sub.submitted_at) AS first_assessment_at,
              COUNT(*) FILTER (
                WHERE sub.fully_graded IS TRUE AND a.total_marks > 0
                  AND NOT EXISTS (
                    SELECT 1 FROM submission_answers sa
                     WHERE sa.submission_id=sub.id
                       AND sa.grading_status IN ('ai_graded','ai_unavailable')
                  )
                  AND sub.total_score >= a.total_marks * 0.8
              )::int AS high_scores,
              MIN(sub.submitted_at) FILTER (
                WHERE sub.fully_graded IS TRUE AND a.total_marks > 0
                  AND NOT EXISTS (
                    SELECT 1 FROM submission_answers sa
                     WHERE sa.submission_id=sub.id
                       AND sa.grading_status IN ('ai_graded','ai_unavailable')
                  )
                  AND sub.total_score >= a.total_marks * 0.8
              ) AS first_high_score_at,
              COUNT(*) FILTER (
                WHERE sub.fully_graded IS TRUE AND a.total_marks > 0
                  AND NOT EXISTS (
                    SELECT 1 FROM submission_answers sa
                     WHERE sa.submission_id=sub.id
                       AND sa.grading_status IN ('ai_graded','ai_unavailable')
                  )
                  AND sub.total_score >= a.total_marks
              )::int AS perfect_scores,
              MIN(sub.submitted_at) FILTER (
                WHERE sub.fully_graded IS TRUE AND a.total_marks > 0
                  AND NOT EXISTS (
                    SELECT 1 FROM submission_answers sa
                     WHERE sa.submission_id=sub.id
                       AND sa.grading_status IN ('ai_graded','ai_unavailable')
                  )
                  AND sub.total_score >= a.total_marks
              ) AS first_perfect_score_at
         FROM submissions sub
         JOIN assessments a ON a.id=sub.assessment_id
        WHERE sub.student_id=$1`,
      [student.id],
    ),
  ]);

  const topicsPassed = Number(topicRows[0]?.passed_topics ?? 0);
  const assessmentsSubmitted = Number(assessmentRows[0]?.submitted_assessments ?? 0);
  const highScores = Number(assessmentRows[0]?.high_scores ?? 0);
  const perfectScores = Number(assessmentRows[0]?.perfect_scores ?? 0);
  const badges = [
    { id: 'topic-first', title: 'First Topic Passed', description: 'Pass your first topic assessment.', icon: 'book', progress: Math.min(topicsPassed, 1), target: 1, earned: topicsPassed >= 1, earned_at: topicRows[0]?.first_topic_passed_at ?? null },
    { id: 'topic-explorer', title: 'Topic Explorer', description: 'Pass 10 topic assessments.', icon: 'compass', progress: Math.min(topicsPassed, 10), target: 10, earned: topicsPassed >= 10, earned_at: topicsPassed >= 10 ? topicRows[0]?.tenth_topic_passed_at ?? null : null },
    { id: 'topic-scholar', title: 'Topic Scholar', description: 'Pass 25 topic assessments.', icon: 'graduation-cap', progress: Math.min(topicsPassed, 25), target: 25, earned: topicsPassed >= 25, earned_at: topicsPassed >= 25 ? topicRows[0]?.twenty_fifth_topic_passed_at ?? null : null },
    { id: 'assessment-first', title: 'Assessment Starter', description: 'Submit your first assessment.', icon: 'clipboard', progress: Math.min(assessmentsSubmitted, 1), target: 1, earned: assessmentsSubmitted >= 1, earned_at: assessmentRows[0]?.first_assessment_at ?? null },
    { id: 'assessment-ace', title: 'Assessment Ace', description: 'Earn at least 80% on a fully graded assessment.', icon: 'star', progress: Math.min(highScores, 1), target: 1, earned: highScores >= 1, earned_at: assessmentRows[0]?.first_high_score_at ?? null },
    { id: 'perfect-score', title: 'Perfect Score', description: 'Earn full marks on a fully graded assessment.', icon: 'trophy', progress: Math.min(perfectScores, 1), target: 1, earned: perfectScores >= 1, earned_at: assessmentRows[0]?.first_perfect_score_at ?? null },
  ];
  return res.json({ badges, summary: { topics_passed: topicsPassed, assessments_submitted: assessmentsSubmitted, high_scores: highScores, perfect_scores: perfectScores } });
});









router.get('/topics', requirePerm('topics.read'), async (req, res) => {
  const { subject_id, class_name, term_id, term_label, school_code } = req.query as Record<string, string>;
  const user = req.user!;
  const sc = (school_code && user.role === 'admin') ? school_code : user.school_code;

  const viewerClasses = await resolveViewerClassNames(user);

  let sql = `SELECT t.*, sub.name AS subject_name
             FROM topics t
             JOIN subjects sub ON sub.id=t.subject_id
             WHERE t.school_code=$1`;
  const params: unknown[] = [sc];

  if (user.role === 'teacher') {
    // Same class-OR-subject scope as GET /materials above — see the
    // comment there for the full reasoning.
    const clauses: string[] = [];
    if (user.assigned_class) { params.push(user.assigned_class); clauses.push(`t.class_name=$${params.length}`); }
    if (user.assigned_subject_ids?.length) { params.push(user.assigned_subject_ids); clauses.push(`t.subject_id = ANY($${params.length})`); }
    sql += clauses.length ? ` AND (${clauses.join(' OR ')})` : ' AND FALSE';
  } else if (viewerClasses) {
    if (!viewerClasses.length) return res.json({ topics: [] });
    params.push(viewerClasses);
    sql += ` AND (t.class_name = ANY($${params.length}) OR t.class_name IS NULL)`;
  } else if (class_name) {
    params.push(class_name); sql += ` AND t.class_name=$${params.length}`;
  }

  if (subject_id)  { params.push(subject_id);  sql += ` AND t.subject_id=$${params.length}`; }
  if (term_id)     { params.push(term_id);     sql += ` AND t.term_id=$${params.length}`; }
  // term_label is the evergreen filter for ingested curriculum topics (see
  // schema.sql's "Curriculum ingestion for topics" section) — term_id above
  // still works unchanged for any older admin/teacher-authored topic rows.
  if (term_label)  { params.push(term_label);  sql += ` AND t.term_label=$${params.length}`; }
  // order_index reflects the school's actual teaching sequence for ingested
  // topics; NULLS LAST keeps manually-authored topics (no order_index) at
  // the end rather than sorting ahead of real sequence data.
  // Optional additive metadata: reading the row as JSON yields NULL before the sequence_rank migration.
  // This preserves legacy access without running schema changes from a request; migrated ranks still sort normally.
  sql += " ORDER BY COALESCE((to_jsonb(t)->>'sequence_rank')::numeric, t.order_index) NULLS LAST, t.order_index NULLS LAST, t.created_at DESC";

  const { rows: rawRows } = await query(sql, params);
  // Subject-specific delivery corrections are applied before any topic payload reaches a learner.
  const projectedRows = rawRows.map((r: any) => safePrimary4Topic(safeSs1MathematicsTopic(safeEnglishTopic(safeAgriculturalScienceTopic(safeSs1Topic(safeJss3Topic(r))), user.role))));
  // Retired outline/merged Primary 4 source rows remain visible to staff for audit, but not to students or parents.
  const rows = viewerClasses
    ? projectedRows.filter((r: any) => r.primary4_delivery?.hide_from_student !== true)
    : projectedRows;

  // For a student, also report whether they've completed each topic, and
  // whether it's currently locked. Locking (see schema.sql's "Term-PIN
  // gating" section for the full decision writeup):
  //   - A topic with no order_index (manually-authored, pre-dates
  //     ingestion) is always unlocked — this whole scheme only applies to
  //     the ordered, ingested curriculum sequence.
  //   - The first ordered topic in each (subject_id, class_name,
  //     term_label) group is locked until the student has redeemed a PIN
  //     for that term_label.
  //   - Every later ordered topic in that same group is locked until the
  //     immediately-preceding one (by position in the ordered sequence,
  //     not raw order_index arithmetic — real data has gaps) has been
  //     completed with passed=true.
  if (user.role === 'student' && rows.length) {
    const { rows: stRows } = await query('SELECT id FROM students WHERE user_id=$1', [user.id]);
    const studentId = stRows[0]?.id;
    if (studentId) {
      const { rows: compRows } = await query(
        'SELECT topic_id, passed FROM topic_completions WHERE student_id=$1 AND topic_id=ANY($2)',
        [studentId, rows.map((r: any) => r.id)],
      );
      const completedIds = new Set(compRows.map((r: any) => r.topic_id));
      const passedIds = new Set(compRows.filter((r: any) => r.passed === true).map((r: any) => r.topic_id));

      const { rows: pinRows } = await query(
        'SELECT term_label FROM term_access_pins WHERE student_id=$1 AND redeemed_at IS NOT NULL',
        [studentId],
      );
      const redeemedTermLabels = new Set(pinRows.map((r: any) => r.term_label));

      // Group only the ordered (order_index NOT NULL) topics, per
      // (subject_id, class_name, term_label), sorted by order_index — this
      // sequence position, not the raw order_index value, is what "first"
      // and "immediately preceding" mean, so gaps in order_index don't
      // break the chain.
      const groups = new Map<string, any[]>();
      for (const t of rows) {
        if (t.order_index == null) continue;
        const key = `${t.subject_id}|${t.class_name}|${t.term_label}`;
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key)!.push(t);
      }
      const lockedIds = new Set<number>();
      const seqById = new Map<number, { locked: boolean; sequence_position: number | null; is_sequence_first: boolean }>();
      if (curriculumSequenceEnforced(req.learningAccessPolicy)) {
        for (const group of groups.values()) {
          const pinOk = !termPinEnforced(req.learningAccessPolicy) || redeemedTermLabels.has(group[0].term_label);
          for (const [id, r] of resolveSequenceGroup(group, passedIds, pinOk)) {
            if (r.locked) lockedIds.add(id);
            seqById.set(id, r);
          }
        }
      }

      return res.json({
        topics: rows.map((r: any) => {
          const completed = completedIds.has(r.id);
          const locked = lockedIds.has(r.id);
          const sequence = {
            completed,
            locked,
            sequence_position: seqById.get(r.id)?.sequence_position ?? null,
            is_sequence_first: seqById.get(r.id)?.is_sequence_first ?? false,
          };
          // Locked rows are navigation metadata only. Do not send descriptions,
          // generated summaries, source text/provenance or any lesson payload.
          if (locked) return studentTopicPreview(
            r,
            completed,
            seqById.get(r.id) ?? { locked: true, sequence_position: null, is_sequence_first: false },
          );
          return { ...r, ...sequence };
        }),
      });
    }
    // A student without a linked student record must never fall through to
    // the unrestricted raw-topic response.
    return res.json({ topics: [] });
  }

  return res.json({ topics: rows });
});

// ── Topic assets (images shown inside a lesson) ─────────────────────────────
// Added for Task 2 (Music notation pictures, Basic Technology diagrams). Rows
// live in topic_assets (see schema.sql); lesson text is never modified. Two
// read-only endpoints, deliberately separate so list queries never touch the
// image bytes:
//   GET /learning/topics/:id/assets  → metadata only (displayed=true, ordered)
//   GET /learning/assets/:id         → the bytes, with Content-Type + ETag
// Visibility is exactly GET /topics's: same school, and a student/parent only
// sees topics of their own class(es), a teacher only their class/subject.

// Appends the same class/subject restriction GET /topics uses, for topics
// aliased `t`. Returns null when the viewer can see no topics at all.
async function topicVisibilitySql(user: AuthUser, params: unknown[]): Promise<string | null> {
  if (user.role === 'teacher') {
    const clauses: string[] = [];
    if (user.assigned_class) { params.push(user.assigned_class); clauses.push(`t.class_name=$${params.length}`); }
    if (user.assigned_subject_ids?.length) { params.push(user.assigned_subject_ids); clauses.push(`t.subject_id = ANY($${params.length})`); }
    return clauses.length ? ` AND (${clauses.join(' OR ')})` : ' AND FALSE';
  }
  const viewerClasses = await resolveViewerClassNames(user);
  if (viewerClasses) {
    if (!viewerClasses.length) return null;
    params.push(viewerClasses);
    return ` AND (t.class_name = ANY($${params.length}) OR t.class_name IS NULL)`;
  }
  return '';
}

router.get('/topics/:id/assets', requirePerm('topics.read'), async (req, res) => {
  const topicId = Number(req.params.id);
  if (!Number.isInteger(topicId) || topicId <= 0) return res.status(400).json({ error: 'Invalid topic id' });
  const user = req.user!;
  const { school_code } = req.query as Record<string, string>;
  const schoolScope = resolveLearningAssetSchool(user, school_code);
  if ('error' in schoolScope) return res.status(schoolScope.status).json({ error: schoolScope.error });
  const sc = schoolScope.schoolCode;
  res.set('Cache-Control', 'private, no-store, max-age=0');

  const params: unknown[] = [topicId, sc];
  const scope = await topicVisibilitySql(user, params);
  // Not visible to this viewer (or not there): same empty answer GET /topics
  // gives for a topic outside the viewer's classes.
  if (scope === null) return res.json({ assets: [], attributions: [] });
  const { rows: visible } = await query(
    `SELECT t.id, t.school_code, t.subject_id, (to_jsonb(t)->>'sequence_rank')::numeric AS sequence_rank, t.title, t.term_label, t.class_name, t.source_file, t.source_reference, t.order_index, s.name AS subject_name
       FROM topics t LEFT JOIN subjects s ON s.id=t.subject_id WHERE t.id=$1 AND t.school_code=$2${scope}`, params,
  );
  if (!visible[0]) return res.json({ assets: [], attributions: [] });
  const primary4AssetTopic = safePrimary4Topic(visible[0]);
  if ((user.role === 'student' || user.role === 'parent') && (primary4AssetTopic as any).primary4_delivery?.hide_from_student === true) {
    return res.json({ assets: [], attributions: [] });
  }
  if (await studentTopicSequenceLocked(user, visible[0], req.learningAccessPolicy)) return res.json({ assets: [], attributions: [] });

  // Metadata only — `bytes` is never selected here.
  const { rows: storedAssets } = await query(
    `SELECT a.id, a.asset_key, a.kind, a.mime, a.sha256, a.caption, a.alt_text, a.sort_order
       FROM topic_assets a
       JOIN topics t ON t.id=a.topic_id
      WHERE a.topic_id=$1 AND t.school_code=$2 AND a.displayed=true${scope}
      ORDER BY a.sort_order, a.id`,
    params,
  );
  const rows = visible[0].school_code === 'secondary' && visible[0].class_name === 'SS 1' && visible[0].subject_name === 'Agricultural Science'
    ? storedAssets.filter((asset: any) => agriculturalScienceAssetDeliverable(visible[0], asset))
    : visible[0].school_code === 'secondary' && visible[0].class_name === 'SS 1' && visible[0].subject_name === 'Mathematics'
      ? storedAssets.filter((asset: any) => mathematicsAssetDeliverable(visible[0], asset))
      : storedAssets;
  const mathematicsAssets = visible[0].school_code === 'secondary' && visible[0].class_name === 'SS 1' && visible[0].subject_name === 'Mathematics'
    ? mathematicsAssetsForTopic(visible[0])
    : [];
  const deliveredRows = [...rows, ...mathematicsAssets];

  // Licence/credit records for third-party material in this lesson (jss3Attributions.ts): delivered with the lesson,
  // matched by exact identity. A requested cover/logo is reported displayed only if a displayed asset with that key exists.
  const boundKeys = new Set<string>(deliveredRows.map((r: any) => r.asset_key));
  const attributions = attributionsForTopic(visible[0]).map(a => publicAttribution(a, boundKeys));
  return res.json({
    assets: deliveredRows.map((r: any) => ({ ...r, url: r.url ?? `/learning/assets/${r.id}` })),
    attributions,
  });
});

router.get('/mathematics-assets/:assetKey', requirePerm('topics.read'), async (req, res) => {
  const assetKey = String(req.params.assetKey ?? '');
  const topicId = Number(req.query.topicId);
  if (!assetKey || !Number.isInteger(topicId) || topicId <= 0) return res.status(404).json({ error: 'Asset not found' });
  const user = req.user!;
  const { school_code } = req.query as Record<string, string>;
  const schoolScope = resolveLearningAssetSchool(user, school_code);
  if ('error' in schoolScope) return res.status(schoolScope.status).json({ error: schoolScope.error });
  const sc = schoolScope.schoolCode;
  res.set('Cache-Control', 'private, no-store, max-age=0');
  const params: unknown[] = [topicId, sc];
  const scope = await topicVisibilitySql(user, params);
  if (scope === null) return res.status(404).json({ error: 'Asset not found' });
  const { rows: visible } = await query(
    `SELECT t.id, t.school_code, t.subject_id, (to_jsonb(t)->>'sequence_rank')::numeric AS sequence_rank, t.title, t.term_label, t.class_name, t.source_file, t.order_index, s.name AS subject_name
       FROM topics t LEFT JOIN subjects s ON s.id=t.subject_id
      WHERE t.id=$1 AND t.school_code=$2${scope}`,
    params,
  );
  const topic = visible[0];
  if (!topic || await studentTopicSequenceLocked(user, topic, req.learningAccessPolicy) || topic.school_code !== 'secondary' || topic.class_name !== 'SS 1' || topic.subject_name !== 'Mathematics') {
    return res.status(404).json({ error: 'Asset not found' });
  }
  const asset = mathematicsAssetsForTopic(topic).find((item: any) => item.asset_key === assetKey);
  if (!asset) return res.status(404).json({ error: 'Asset not found' });
  const file = readMathematicsAsset(assetKey);
  if (!file) return res.status(404).json({ error: 'Asset not found' });
  if (!verifyTopicAssetPayload(file.bytes, file.mime, file.sha256)) {
    console.error('[assets] mathematics asset failed MIME/SHA-256 verification', { assetKey });
    return res.status(500).json({ error: 'Asset integrity verification failed.' });
  }
  res.setHeader('Cache-Control', 'private, no-store, max-age=0');
  res.setHeader('Content-Type', file.mime);
  res.setHeader('Content-Length', String(file.bytes.length));
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Content-Disposition', 'inline');
  if (file.mime === 'image/svg+xml') res.setHeader('Content-Security-Policy', "default-src 'none'; sandbox");
  return res.end(file.bytes);
});

router.get('/assets/:id', requirePerm('topics.read'), async (req, res) => {
  const assetId = Number(req.params.id);
  if (!Number.isInteger(assetId) || assetId <= 0) return res.status(400).json({ error: 'Invalid asset id' });
  const user = req.user!;
  const { school_code } = req.query as Record<string, string>;
  const schoolScope = resolveLearningAssetSchool(user, school_code);
  if ('error' in schoolScope) return res.status(schoolScope.status).json({ error: schoolScope.error });
  const sc = schoolScope.schoolCode;
  res.set('Cache-Control', 'private, no-store, max-age=0');

  const params: unknown[] = [assetId, sc];
  const scope = await topicVisibilitySql(user, params);
  if (scope === null) return res.status(404).json({ error: 'Asset not found' });
  // Resolve authorization metadata first, then fetch and verify the bytes under the same school/topic scope.
  const { rows: meta } = await query(
    `SELECT a.mime, a.sha256, a.asset_key, t.id AS topic_id, t.school_code, t.subject_id, (to_jsonb(t)->>'sequence_rank')::numeric AS sequence_rank, t.class_name, t.term_label, t.title,
            t.source_file, t.source_reference, t.order_index, s.name AS subject_name
       FROM topic_assets a
       JOIN topics t ON t.id=a.topic_id
       LEFT JOIN subjects s ON s.id=t.subject_id
      WHERE a.id=$1 AND a.displayed=true AND t.school_code=$2${scope}`,
    params,
  );
  if (!meta[0] || await studentTopicSequenceLocked(user, meta[0] && { ...meta[0], id: meta[0].topic_id, order_index: meta[0].order_index }, req.learningAccessPolicy)) return res.status(404).json({ error: 'Asset not found' });
  if (meta[0].school_code === 'secondary' && meta[0].class_name === 'SS 1' && meta[0].subject_name === 'Agricultural Science' &&
      !agriculturalScienceAssetDeliverable(meta[0], meta[0])) return res.status(404).json({ error: 'Asset not found' });
  if (meta[0].school_code === 'secondary' && meta[0].class_name === 'SS 1' && meta[0].subject_name === 'Mathematics' &&
      !mathematicsAssetDeliverable(meta[0], meta[0])) return res.status(404).json({ error: 'Asset not found' });

  res.setHeader('Cache-Control', 'private, no-store, max-age=0');

  const bytesParams = [...params, meta[0].topic_id];
  const { rows } = await query(
    `SELECT a.bytes
       FROM topic_assets a
       JOIN topics t ON t.id=a.topic_id
      WHERE a.id=$1 AND a.displayed=true AND t.school_code=$2 AND t.id=$${bytesParams.length}${scope}`,
    bytesParams,
  );
  if (!rows[0]) return res.status(404).json({ error: 'Asset not found' });
  const buf: Buffer = rows[0].bytes;
  if (!verifyTopicAssetPayload(buf, meta[0].mime, meta[0].sha256)) {
    console.error('[assets] topic asset failed MIME/SHA-256 verification', { assetId, topicId: meta[0].topic_id });
    return res.status(500).json({ error: 'Asset integrity verification failed.' });
  }
  res.setHeader('Content-Type', meta[0].mime);
  res.setHeader('Content-Length', String(buf.length));
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Content-Disposition', 'inline');
  if (meta[0].mime === 'image/svg+xml') res.setHeader('Content-Security-Policy', "default-src 'none'; sandbox");
  return res.end(buf);
});

router.post('/topics', requirePerm('topics.write'), async (req, res) => {
  const { subject_id, class_name, term_id, title, description, school_code } = req.body;
  const sc = (school_code && req.user!.role === 'admin') ? school_code : req.user!.school_code;

  // Same rule as /materials and /questions above — a teacher may only add a
  // topic for their own assigned_class (any subject) or their own assigned
  // subject(s) (any class in their school).
  const scopeError = await checkTeacherContentScope(req.user!, { class_name: class_name ?? null, subject_id });
  if (scopeError) return res.status(scopeError.status).json({ error: scopeError.error });

  if (!title?.trim()) return res.status(400).json({ error: 'title is required' });

  const { rows } = await query(
    `INSERT INTO topics(school_code,subject_id,class_name,term_id,title,description,created_by)
     VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
    [sc, subject_id, class_name ?? null, term_id ?? null, title.trim(), description ?? null, req.user!.id],
  );
  return res.status(201).json({ topic: rows[0] });
});

router.put('/topics/:id', requirePerm('topics.write'), async (req, res) => {
  const { title, description, subject_id, class_name, term_id } = req.body;
  const { rows: existingRows } = await query('SELECT * FROM topics WHERE id=$1', [req.params.id]);
  const existing = existingRows[0];
  if (!existing) return res.status(404).json({ error: 'Topic not found' });

  // Scope-check against the topic's (possibly updated) subject/class — same
  // rule as creation, so a teacher can't edit their way into a class/subject
  // they don't teach.
  const scopeError = await checkTeacherContentScope(req.user!, {
    class_name: class_name ?? existing.class_name,
    subject_id: subject_id ?? existing.subject_id,
  });
  if (scopeError) return res.status(scopeError.status).json({ error: scopeError.error });

  const { rows } = await query(
    `UPDATE topics SET title=COALESCE($1,title), description=COALESCE($2,description),
       subject_id=COALESCE($3,subject_id), class_name=COALESCE($4,class_name),
       term_id=COALESCE($5,term_id)
     WHERE id=$6 RETURNING *`,
    [title, description, subject_id, class_name, term_id, req.params.id],
  );
  // Same delivery guard as the list/detail paths: an edited JSS3 or SS1 corrected row must not hand back stale, withheld or
  // audited-original text (or a stale assessment link). The stored row itself is not touched here.
  const { rows: full } = await query(
    'SELECT t.*, sub.name AS subject_name FROM topics t LEFT JOIN subjects sub ON sub.id=t.subject_id WHERE t.id=$1', [req.params.id],
  );
  const { subject_name: _subjectName, ...safe } = safeSs1MathematicsTopic(safeEnglishTopic(safeAgriculturalScienceTopic(safeSs1Topic(safeJss3Topic(full[0] ?? rows[0])))));
  return res.json({ topic: safe });
});

router.delete('/topics/:id', requirePerm('topics.write'), async (req, res) => {
  const user = req.user!;
  // Same admin-bypasses-created_by rule as /materials above.
  const { rows } = await query(
    user.role === 'admin'
      ? 'DELETE FROM topics WHERE id=$1 RETURNING id'
      : 'DELETE FROM topics WHERE id=$1 AND created_by=$2 RETURNING id',
    user.role === 'admin' ? [req.params.id] : [req.params.id, user.id],
  );
  if (!rows[0]) return res.status(404).json({ error: 'Topic not found' });
  return res.json({ ok: true });
});

// ── POST /topics/:id/complete (student) ─────────────────────────────────────
// Generates the curriculum lesson and its practice set from the approved
// class, subject, term, topic, available objectives and source material.
// This is the DIY learning-content pipeline, not Brainee chat/tutoring.
// The validated practice questions may also seed the existing standard
// topic assessment. Student access, term PINs and sequence gates are checked
// before any generation or content delivery.
router.post('/topics/:id/lesson', curriculumLessonLimiter, requirePerm('topics.read'), requireRole('student'), async (req, res) => {
  const user = req.user!;
  const { rows: stRows } = await query('SELECT id, school_code, class_name FROM students WHERE user_id=$1 LIMIT 1', [user.id]);
  const student = stRows[0];
  if (!student) return res.status(404).json({ error: 'No student record for this user' });

  const { rows: tRows } = await query(`SELECT t.*, sub.name AS subject_name, COALESCE(to_jsonb(t)->>'term_label', term.name) AS curriculum_term_label, term.academic_year AS curriculum_academic_year, to_jsonb(t)->'learning_objectives' AS curriculum_learning_objectives FROM topics t LEFT JOIN subjects sub ON sub.id=t.subject_id LEFT JOIN terms term ON term.id=t.term_id AND term.school_code=t.school_code WHERE t.id=$1`, [req.params.id]);
  const topic = tRows[0];
  if (!topic) return res.status(404).json({ error: 'Topic not found' });
  if (topic.school_code !== student.school_code || (topic.class_name && topic.class_name !== student.class_name)) {
    return res.status(403).json({ error: 'This topic is not available to you' });
  }

  // Enforce the same lock GET /topics computes for display — without this,
  // a student could bypass the whole PIN/pass-gate scheme by calling this
  // route directly for a topic the UI never let them open. Only applies to
  // ordered (ingested) topics; see schema.sql's "Term-PIN gating" section.
  if (curriculumSequenceEnforced(req.learningAccessPolicy) && topic.order_index != null) {
    // Same resolver as GET /topics (Task 05) so the list and this direct guard cannot disagree.
    const { rows: siblingRows } = await query(
      `SELECT id, order_index, (to_jsonb(t)->>'sequence_rank')::numeric AS sequence_rank FROM topics t
       WHERE school_code=$4 AND subject_id=$1 AND class_name=$2 AND term_label=$3 AND order_index IS NOT NULL`,
      [topic.subject_id, topic.class_name, topic.term_label, topic.school_code],
    );
    const { rows: passRows } = await query(
      'SELECT topic_id FROM topic_completions WHERE student_id=$1 AND passed=true AND topic_id=ANY($2)',
      [student.id, siblingRows.map((r: any) => r.id)],
    );
    const { rows: pinRows } = await query(
      'SELECT 1 FROM term_access_pins WHERE student_id=$1 AND term_label=$2 AND redeemed_at IS NOT NULL',
      [student.id, topic.term_label],
    );
    const pinOk = !termPinEnforced(req.learningAccessPolicy) || !!pinRows[0];
    const verdict = resolveSequenceGroup(siblingRows, new Set(passRows.map((r: any) => r.topic_id)), pinOk).get(topic.id);
    if (verdict?.locked) {
      return res.status(403).json({ error: verdict.is_sequence_first
        ? 'This topic is locked. Redeem your term PIN first.'
        : 'This topic is locked. Complete and pass the previous topic first.' });
    }
  }

  // Subject-specific delivery correction (after access/lock checks, so correction never widens access). A topic whose original
  // text is audited as unsafe is taught from the corrected lessons only; if its stored source changed unreviewed it
  // is withheld. Stale cached summary/assessment built from the original text is retired atomically first.
  const delivery = resolveDelivery(topic);
  if (delivery) {
    await retireStaleJss3Cache(query, topic.id, delivery);
    const { rows: fresh } = await query('SELECT generated_assessment_id FROM topics WHERE id=$1', [topic.id]);
    topic.generated_assessment_id = fresh[0]?.generated_assessment_id ?? null;
    topic.summary = delivery.text;
    if (delivery.kind === 'withheld') {
      return res.json({ ok: true, summary: delivery.text, summary_is_fallback: false, practice_questions: [], assessment_status: null,
        delivery_correction: { id: delivery.correctionId, status: 'withheld' }, note: 'This topic is temporarily unavailable pending review.' });
    }
  }
  const ss1Delivery = resolveSs1Delivery(topic);
  if (ss1Delivery) {
    await retireStaleSs1Cache(query, topic.id, ss1Delivery);
    const { rows: fresh } = await query('SELECT generated_assessment_id FROM topics WHERE id=$1', [topic.id]);
    topic.generated_assessment_id = fresh[0]?.generated_assessment_id ?? null;
    topic.summary = ss1Delivery.text;
    if (ss1Delivery.kind === 'withheld') {
      return res.json({ ok: true, summary: ss1Delivery.text, summary_is_fallback: false, practice_questions: [], assessment_status: null,
        delivery_correction: { id: ss1Delivery.correctionId, status: 'withheld', provenance: 'withheld pending source review' },
        note: 'This Catering Craft topic is temporarily unavailable while its source is checked.' });
    }
  }

  // SS1 French source corrections are served from the approved lesson package.
  // The resolver only replaces an exact source-body fingerprint for this
  // class/subject/term/file, so unrelated French topics are left untouched.
  const frenchDelivery = resolveSs1FrenchDelivery(topic);
  if (frenchDelivery) {
    await retireStaleSs1FrenchCache(query, topic.id, frenchDelivery);
    const { rows: fresh } = await query('SELECT generated_assessment_id FROM topics WHERE id=$1', [topic.id]);
    topic.generated_assessment_id = fresh[0]?.generated_assessment_id ?? null;
    topic.summary = frenchDelivery.text;
  }

  // SS1 Literature lessons are selected only by the registered term, exact source filename and source topic heading.
  // The package preserves separate mappings for the second and third term even where their teaching text repeats.
  const literatureDelivery = resolveSs1LiteratureDelivery(topic);
  if (literatureDelivery) {
    await retireStaleSs1LiteratureCache(query, topic.id, literatureDelivery);
    const { rows: fresh } = await query('SELECT generated_assessment_id FROM topics WHERE id=$1', [topic.id]);
    topic.generated_assessment_id = fresh[0]?.generated_assessment_id ?? null;
    topic.summary = literatureDelivery.text;
  }

  // SS1 Mathematics corrections are bound to the exact source row fingerprint,
  // term, class, subject and source file. A changed source row or incomplete
  // approval/verification is withheld rather than passed to Brainee as lesson text.
  const mathematicsDelivery = resolveSs1MathematicsDelivery(topic);
  if (mathematicsDelivery) {
    await retireStaleSs1MathematicsCache(query, topic.id, mathematicsDelivery);
    const { rows: fresh } = await query('SELECT generated_assessment_id FROM topics WHERE id=$1', [topic.id]);
    topic.generated_assessment_id = fresh[0]?.generated_assessment_id ?? null;
    topic.summary = mathematicsDelivery.text;
    if (mathematicsDelivery.kind === 'withheld') {
      return res.json({ ok: true, summary: mathematicsDelivery.text, summary_is_fallback: false,
        practice_questions: [], assessment_status: null,
        delivery_correction: { id: mathematicsDelivery.correctionId, status: 'withheld', provenance: 'withheld pending exact source, approval and verification' },
        note: 'This Mathematics topic is temporarily unavailable pending source and lesson verification.' });
    }
  }
  const agriculturalScienceSupplement = resolveAgriculturalScienceSupplement(topic);
  if (agriculturalScienceSupplement) {
    await retireStaleAgriculturalScienceSupplementCache(query, topic.id, agriculturalScienceSupplement);
    const { rows: fresh } = await query('SELECT generated_assessment_id FROM topics WHERE id=$1', [topic.id]);
    topic.generated_assessment_id = fresh[0]?.generated_assessment_id ?? null;
    if (agriculturalScienceSupplement.kind === 'withheld') {
      return res.json({ ok: true, summary: agriculturalScienceSupplement.text, summary_is_fallback: false,
        practice_questions: [], assessment_status: null,
        delivery_correction: { id: agriculturalScienceSupplement.lessonId, status: 'withheld', provenance: 'withheld pending exact package identity and verification' },
        note: 'This Agricultural Science supplement is temporarily unavailable pending package verification.' });
    }
  }
  const agriculturalScienceDelivery = resolveAgriculturalScienceDelivery(topic);
  if (agriculturalScienceDelivery) {
    await retireStaleAgriculturalScienceCache(query, topic.id, agriculturalScienceDelivery);
    const { rows: fresh } = await query('SELECT generated_assessment_id FROM topics WHERE id=$1', [topic.id]);
    topic.generated_assessment_id = fresh[0]?.generated_assessment_id ?? null;
    topic.summary = agriculturalScienceDelivery.text;
    if (agriculturalScienceDelivery.kind === 'withheld') {
      return res.json({ ok: true, summary: agriculturalScienceDelivery.text, summary_is_fallback: false, practice_questions: [], assessment_status: null,
        delivery_correction: { id: agriculturalScienceDelivery.correctionId, status: 'withheld', provenance: 'withheld pending subject approval/verification' },
        note: 'This Agricultural Science topic is temporarily unavailable pending subject approval and verification.' });
    }
  }
  const agriculturalScienceSourceProjection = resolveAgriculturalScienceSourceProjection(topic);
  if (agriculturalScienceSourceProjection) {
    await retireStaleAgriculturalScienceSourceCache(query, topic.id, agriculturalScienceSourceProjection);
    const { rows: fresh } = await query('SELECT generated_assessment_id FROM topics WHERE id=$1', [topic.id]);
    topic.generated_assessment_id = fresh[0]?.generated_assessment_id ?? null;
    if (agriculturalScienceSourceProjection.kind === 'withheld') {
      return res.json({ ok: true, summary: agriculturalScienceSourceProjection.text, summary_is_fallback: false,
        practice_questions: [], assessment_status: null,
        delivery_correction: { id: agriculturalScienceSourceProjection.sourceLessonId, status: 'withheld' },
        note: 'This Agricultural Science source row contains no learner-safe teaching material.' });
    }
  }
  const englishDelivery = resolveEnglishDelivery(topic);
  if (englishDelivery) {
    await retireStaleEnglishCache(query, topic.id, englishDelivery);
    const { rows: fresh } = await query('SELECT generated_assessment_id FROM topics WHERE id=$1', [topic.id]);
    topic.generated_assessment_id = fresh[0]?.generated_assessment_id ?? null;
    topic.summary = englishDelivery.text;
    if (englishDelivery.kind === 'withheld') {
      return res.json({ ok: true, summary: englishDelivery.text, summary_is_fallback: false, practice_questions: [], assessment_status: null,
        delivery_correction: { id: englishDelivery.correctionId, status: 'withheld', provenance: 'withheld pending English approval/verification' },
        note: 'This English Language topic is temporarily unavailable pending subject approval and verification.' });
    }
  }
  // Primary 4 lessons are grounded only in source rows whose identity and source_reference hash
  // match the supplied read-only export. Short source notes remain visibly flagged to pupils.
  const primary4Delivery = resolvePrimary4SourceDelivery(topic);
  if (primary4Delivery && (primary4Delivery.kind === 'withheld' || primary4Delivery.source !== 'primary4-export')) {
    await retireStalePrimary4Cache(query, topic.id, primary4Delivery);
    const { rows: freshPrimary4 } = await query(
      'SELECT summary, generated_assessment_id FROM topics WHERE id=$1',
      [topic.id],
    );
    topic.summary = freshPrimary4[0]?.summary ?? null;
    topic.generated_assessment_id = freshPrimary4[0]?.generated_assessment_id ?? null;
  }
  if (primary4Delivery?.kind === 'withheld') {
    if (primary4Delivery.hideFromStudent) return res.status(404).json({ error: 'Topic not found' });
    return res.json({ ok: true, summary: primary4Delivery.text, summary_is_fallback: false,
      practice_questions: [], assessment_status: null,
      delivery_correction: { id: String(primary4Delivery.topicId ?? req.params.id), status: 'withheld', provenance: primary4Delivery.source },
      note: 'This Primary 4 topic is temporarily unavailable while its curriculum source is checked.' });
  }
  if (primary4Delivery?.kind === 'matched' && primary4Delivery.source === 'archive-correction') {
    topic.title = primary4Delivery.displayTitle ?? topic.title;
    topic.source_reference = primary4Delivery.text;
    topic.summary = null;
    topic.generated_assessment_id = null;
  }
  if (primary4Delivery?.kind === 'matched') topic.source_reference = primary4Delivery.text;

  // Agricultural Science compiled supplements contain teacher answer keys. Replace the stored
  // compiler payload with the exact verified learner projection before any AI grounding or fallback.
  const agriculturalScienceLearnerTopic = safeAgriculturalScienceTopic(topic);
  topic.source_reference = agriculturalScienceLearnerTopic.source_reference;
  topic.summary = agriculturalScienceLearnerTopic.summary;

  // A compiled English supplement stores teacher marking keys in source_reference.
  // Sanitize the student copy before using it as AI grounding or fallback text.
  const learnerTopic = safeEnglishSupplementTopic(topic, user.role);
  topic.source_reference = learnerTopic.source_reference;
  topic.summary = learnerTopic.summary;

  const groundingSource: string | null = primary4Delivery?.kind === 'matched' ? curriculumTeachingSource(primary4Delivery.text)
    : mathematicsDelivery?.kind === 'corrected' ? curriculumTeachingSource(mathematicsDelivery.text)
    : englishDelivery?.kind === 'corrected' ? curriculumTeachingSource(englishDelivery.text)
    : agriculturalScienceDelivery?.kind === 'corrected' || agriculturalScienceSupplement?.kind === 'supplement' || agriculturalScienceSourceProjection
      ? curriculumTeachingSource(topic.source_reference)
    : ss1Delivery?.kind === 'corrected' ? curriculumTeachingSource(ss1Delivery.text)
    : frenchDelivery?.kind === 'corrected' ? curriculumTeachingSource(frenchDelivery.text)
    : literatureDelivery?.text ? curriculumTeachingSource(literatureDelivery.text)
    : delivery?.kind === 'corrected' ? curriculumTeachingSource(delivery.text)
    : curriculumTeachingSource(topic.source_reference);

  // Generate the teaching lesson from approved curriculum context. Brainee
  // remains a separate tutor/chat experience and is not the lesson author.
  let summary: string | null = null;
  let summary_is_fallback = false;
  let practice_questions: Array<{
    stem: string;
    options: Array<{ key: 'A' | 'B' | 'C' | 'D'; text: string }>;
    correct_keys: Array<'A' | 'B' | 'C' | 'D'>;
    explanation: string;
    marks: number;
  }> = [];

  // Read optional objective metadata from the resolved curriculum row without
  // assuming every legacy topic schema has that column. No schema migration
  // or student-supplied curriculum identifiers are required for this path.
  const rawObjectives = topic.curriculum_learning_objectives;
  const objectives: string[] = Array.isArray(rawObjectives)
    ? rawObjectives.filter((value: unknown): value is string => typeof value === 'string' && value.trim().length > 0)
    : typeof rawObjectives === 'string'
      ? (() => { try { const parsed = JSON.parse(rawObjectives); return Array.isArray(parsed) ? parsed.filter((value): value is string => typeof value === 'string' && value.trim().length > 0) : []; } catch { return []; } })()
      : [];

  let generatedLesson: Awaited<ReturnType<typeof getOrGenerateCurriculumLesson>>['lesson'];
  try {
    const generated = await getOrGenerateCurriculumLesson({
      cacheKey: `topic:${topic.id}`,
      topicId: Number(topic.id),
      input: {
        className: student.class_name,
        subject: topic.subject_name || 'Subject not recorded',
        term: topic.curriculum_term_label ? `${topic.curriculum_term_label}${topic.curriculum_academic_year ? ` (${topic.curriculum_academic_year})` : ''}` : 'Term not recorded',
        topic: topic.title,
        objectives,
        sourceMaterial: groundingSource || topic.description || null,
      },
      identity: { userId: user.id, role: user.role },
    });
    generatedLesson = generated.lesson;

    summary = [
      generatedLesson.title,
      generatedLesson.introduction,
      ...generatedLesson.sections.map(section => `${section.heading}\n${section.content}`),
      `Lesson recap\n${generatedLesson.summary}`,
    ].join('\n\n');
    practice_questions = generatedLesson.practice_questions.map(question => ({ ...question, marks: 1 }));
  } catch (error: any) {
    console.error('[curriculum] AI lesson generation/validation failed', {
      topicId: topic.id,
      message: error?.message ?? 'Unknown generation error',
    });
    return res.status(error?.statusCode ?? 502).json({
      ok: false,
      error: error?.message ?? 'A complete lesson could not be generated. Please retry.',
      code: 'CURRICULUM_LESSON_GENERATION_FAILED',
    });
  }

  return res.json({
    ok: true,
    lesson: generatedLesson,
    summary,
    summary_is_fallback,
    practice_questions,
    delivery_correction: primary4Delivery?.kind === 'matched'
      ? { id: String(primary4Delivery.topicId), status: primary4Delivery.source === 'primary4-export' ? 'source-export-match' : 'researched-package-match' }
      : ss1Delivery ? { id: ss1Delivery.correctionId, status: ss1Delivery.kind }
      : delivery ? { id: delivery.correctionId, status: delivery.kind }
      : undefined,
  });
});

router.post('/topics/:id/progress', requirePerm('topics.complete'), requireRole('student'), async (req, res) => {
  const user = req.user!;
  const { rows: students } = await query(
    'SELECT id, school_code, class_name FROM students WHERE user_id=$1 AND deleted_at IS NULL LIMIT 1',
    [user.id],
  );
  const student = students[0];
  if (!student) return res.status(404).json({ error: 'No active student record for this user' });

  const { rows: topics } = await query(
    `SELECT id, school_code, class_name, subject_id, term_label, order_index,
            (to_jsonb(t)->>'sequence_rank')::numeric AS sequence_rank
       FROM topics t WHERE id=$1`,
    [req.params.id],
  );
  const topic = topics[0];
  if (!topic) return res.status(404).json({ error: 'Topic not found' });
  if (topic.school_code !== student.school_code || (topic.class_name && topic.class_name !== student.class_name)) {
    return res.status(403).json({ error: 'This topic is not available to you' });
  }
  if (await studentTopicSequenceLocked(user, topic, req.learningAccessPolicy)) {
    return res.status(403).json({ error: 'This topic is locked. Complete the required preceding topic first.' });
  }

  await query(
    `INSERT INTO topic_completions(topic_id, student_id) VALUES($1,$2)
     ON CONFLICT (topic_id, student_id) DO NOTHING`,
    [topic.id, student.id],
  );
  return res.json({ ok: true, completed: true });
});

/**
 * @deprecated Compatibility route for older installed mobile clients.
 * The current app uses POST /topics/:id/lesson and POST /topics/:id/progress
 * so lesson generation, practice and completion remain independent. Keep
 * this route until deployed-client adoption is verified before removing it.
 */
router.post('/topics/:id/complete', requirePerm('topics.complete'), async (req, res) => {
  const user = req.user!;
  const { rows: stRows } = await query('SELECT id, school_code, class_name FROM students WHERE user_id=$1 LIMIT 1', [user.id]);
  const student = stRows[0];
  if (!student) return res.status(404).json({ error: 'No student record for this user' });

  const { rows: tRows } = await query(`SELECT t.*, sub.name AS subject_name, COALESCE(to_jsonb(t)->>'term_label', term.name) AS curriculum_term_label, term.academic_year AS curriculum_academic_year, to_jsonb(t)->'learning_objectives' AS curriculum_learning_objectives FROM topics t LEFT JOIN subjects sub ON sub.id=t.subject_id LEFT JOIN terms term ON term.id=t.term_id AND term.school_code=t.school_code WHERE t.id=$1`, [req.params.id]);
  const topic = tRows[0];
  if (!topic) return res.status(404).json({ error: 'Topic not found' });
  if (topic.school_code !== student.school_code || (topic.class_name && topic.class_name !== student.class_name)) {
    return res.status(403).json({ error: 'This topic is not available to you' });
  }

  // Enforce the same lock GET /topics computes for display — without this,
  // a student could bypass the whole PIN/pass-gate scheme by calling this
  // route directly for a topic the UI never let them open. Only applies to
  // ordered (ingested) topics; see schema.sql's "Term-PIN gating" section.
  if (curriculumSequenceEnforced(req.learningAccessPolicy) && topic.order_index != null) {
    // Same resolver as GET /topics (Task 05) so the list and this direct guard cannot disagree.
    const { rows: siblingRows } = await query(
      `SELECT id, order_index, (to_jsonb(t)->>'sequence_rank')::numeric AS sequence_rank FROM topics t
       WHERE school_code=$4 AND subject_id=$1 AND class_name=$2 AND term_label=$3 AND order_index IS NOT NULL`,
      [topic.subject_id, topic.class_name, topic.term_label, topic.school_code],
    );
    const { rows: passRows } = await query(
      'SELECT topic_id FROM topic_completions WHERE student_id=$1 AND passed=true AND topic_id=ANY($2)',
      [student.id, siblingRows.map((r: any) => r.id)],
    );
    const { rows: pinRows } = await query(
      'SELECT 1 FROM term_access_pins WHERE student_id=$1 AND term_label=$2 AND redeemed_at IS NOT NULL',
      [student.id, topic.term_label],
    );
    const pinOk = !termPinEnforced(req.learningAccessPolicy) || !!pinRows[0];
    const verdict = resolveSequenceGroup(siblingRows, new Set(passRows.map((r: any) => r.topic_id)), pinOk).get(topic.id);
    if (verdict?.locked) {
      return res.status(403).json({ error: verdict.is_sequence_first
        ? 'This topic is locked. Redeem your term PIN first.'
        : 'This topic is locked. Complete and pass the previous topic first.' });
    }
  }

  // Subject-specific delivery correction (after access/lock checks, so correction never widens access). A topic whose original
  // text is audited as unsafe is taught from the corrected lessons only; if its stored source changed unreviewed it
  // is withheld. Stale cached summary/assessment built from the original text is retired atomically first.
  const delivery = resolveDelivery(topic);
  if (delivery) {
    await retireStaleJss3Cache(query, topic.id, delivery);
    const { rows: fresh } = await query('SELECT generated_assessment_id FROM topics WHERE id=$1', [topic.id]);
    topic.generated_assessment_id = fresh[0]?.generated_assessment_id ?? null;
    topic.summary = delivery.text;
    if (delivery.kind === 'withheld') {
      return res.json({ ok: true, summary: delivery.text, summary_is_fallback: false, practice_questions: [], assessment_status: null,
        delivery_correction: { id: delivery.correctionId, status: 'withheld' }, note: 'This topic is temporarily unavailable pending review.' });
    }
  }
  const ss1Delivery = resolveSs1Delivery(topic);
  if (ss1Delivery) {
    await retireStaleSs1Cache(query, topic.id, ss1Delivery);
    const { rows: fresh } = await query('SELECT generated_assessment_id FROM topics WHERE id=$1', [topic.id]);
    topic.generated_assessment_id = fresh[0]?.generated_assessment_id ?? null;
    topic.summary = ss1Delivery.text;
    if (ss1Delivery.kind === 'withheld') {
      return res.json({ ok: true, summary: ss1Delivery.text, summary_is_fallback: false, practice_questions: [], assessment_status: null,
        delivery_correction: { id: ss1Delivery.correctionId, status: 'withheld', provenance: 'withheld pending source review' },
        note: 'This Catering Craft topic is temporarily unavailable while its source is checked.' });
    }
  }

  // SS1 French source corrections are served from the approved lesson package.
  // The resolver only replaces an exact source-body fingerprint for this
  // class/subject/term/file, so unrelated French topics are left untouched.
  const frenchDelivery = resolveSs1FrenchDelivery(topic);
  if (frenchDelivery) {
    await retireStaleSs1FrenchCache(query, topic.id, frenchDelivery);
    const { rows: fresh } = await query('SELECT generated_assessment_id FROM topics WHERE id=$1', [topic.id]);
    topic.generated_assessment_id = fresh[0]?.generated_assessment_id ?? null;
    topic.summary = frenchDelivery.text;
  }

  // SS1 Literature lessons are selected only by the registered term, exact source filename and source topic heading.
  // The package preserves separate mappings for the second and third term even where their teaching text repeats.
  const literatureDelivery = resolveSs1LiteratureDelivery(topic);
  if (literatureDelivery) {
    await retireStaleSs1LiteratureCache(query, topic.id, literatureDelivery);
    const { rows: fresh } = await query('SELECT generated_assessment_id FROM topics WHERE id=$1', [topic.id]);
    topic.generated_assessment_id = fresh[0]?.generated_assessment_id ?? null;
    topic.summary = literatureDelivery.text;
  }

  // SS1 Mathematics corrections are bound to the exact source row fingerprint,
  // term, class, subject and source file. A changed source row or incomplete
  // approval/verification is withheld rather than passed to Brainee as lesson text.
  const mathematicsDelivery = resolveSs1MathematicsDelivery(topic);
  if (mathematicsDelivery) {
    await retireStaleSs1MathematicsCache(query, topic.id, mathematicsDelivery);
    const { rows: fresh } = await query('SELECT generated_assessment_id FROM topics WHERE id=$1', [topic.id]);
    topic.generated_assessment_id = fresh[0]?.generated_assessment_id ?? null;
    topic.summary = mathematicsDelivery.text;
    if (mathematicsDelivery.kind === 'withheld') {
      return res.json({ ok: true, summary: mathematicsDelivery.text, summary_is_fallback: false,
        practice_questions: [], assessment_status: null,
        delivery_correction: { id: mathematicsDelivery.correctionId, status: 'withheld', provenance: 'withheld pending exact source, approval and verification' },
        note: 'This Mathematics topic is temporarily unavailable pending source and lesson verification.' });
    }
  }
  const agriculturalScienceSupplement = resolveAgriculturalScienceSupplement(topic);
  if (agriculturalScienceSupplement) {
    await retireStaleAgriculturalScienceSupplementCache(query, topic.id, agriculturalScienceSupplement);
    const { rows: fresh } = await query('SELECT generated_assessment_id FROM topics WHERE id=$1', [topic.id]);
    topic.generated_assessment_id = fresh[0]?.generated_assessment_id ?? null;
    if (agriculturalScienceSupplement.kind === 'withheld') {
      return res.json({ ok: true, summary: agriculturalScienceSupplement.text, summary_is_fallback: false,
        practice_questions: [], assessment_status: null,
        delivery_correction: { id: agriculturalScienceSupplement.lessonId, status: 'withheld', provenance: 'withheld pending exact package identity and verification' },
        note: 'This Agricultural Science supplement is temporarily unavailable pending package verification.' });
    }
  }
  const agriculturalScienceDelivery = resolveAgriculturalScienceDelivery(topic);
  if (agriculturalScienceDelivery) {
    await retireStaleAgriculturalScienceCache(query, topic.id, agriculturalScienceDelivery);
    const { rows: fresh } = await query('SELECT generated_assessment_id FROM topics WHERE id=$1', [topic.id]);
    topic.generated_assessment_id = fresh[0]?.generated_assessment_id ?? null;
    topic.summary = agriculturalScienceDelivery.text;
    if (agriculturalScienceDelivery.kind === 'withheld') {
      return res.json({ ok: true, summary: agriculturalScienceDelivery.text, summary_is_fallback: false, practice_questions: [], assessment_status: null,
        delivery_correction: { id: agriculturalScienceDelivery.correctionId, status: 'withheld', provenance: 'withheld pending subject approval/verification' },
        note: 'This Agricultural Science topic is temporarily unavailable pending subject approval and verification.' });
    }
  }
  const agriculturalScienceSourceProjection = resolveAgriculturalScienceSourceProjection(topic);
  if (agriculturalScienceSourceProjection) {
    await retireStaleAgriculturalScienceSourceCache(query, topic.id, agriculturalScienceSourceProjection);
    const { rows: fresh } = await query('SELECT generated_assessment_id FROM topics WHERE id=$1', [topic.id]);
    topic.generated_assessment_id = fresh[0]?.generated_assessment_id ?? null;
    if (agriculturalScienceSourceProjection.kind === 'withheld') {
      return res.json({ ok: true, summary: agriculturalScienceSourceProjection.text, summary_is_fallback: false,
        practice_questions: [], assessment_status: null,
        delivery_correction: { id: agriculturalScienceSourceProjection.sourceLessonId, status: 'withheld' },
        note: 'This Agricultural Science source row contains no learner-safe teaching material.' });
    }
  }
  const englishDelivery = resolveEnglishDelivery(topic);
  if (englishDelivery) {
    await retireStaleEnglishCache(query, topic.id, englishDelivery);
    const { rows: fresh } = await query('SELECT generated_assessment_id FROM topics WHERE id=$1', [topic.id]);
    topic.generated_assessment_id = fresh[0]?.generated_assessment_id ?? null;
    topic.summary = englishDelivery.text;
    if (englishDelivery.kind === 'withheld') {
      return res.json({ ok: true, summary: englishDelivery.text, summary_is_fallback: false, practice_questions: [], assessment_status: null,
        delivery_correction: { id: englishDelivery.correctionId, status: 'withheld', provenance: 'withheld pending English approval/verification' },
        note: 'This English Language topic is temporarily unavailable pending subject approval and verification.' });
    }
  }
  // Primary 4 lessons are grounded only in source rows whose identity and source_reference hash
  // match the supplied read-only export. Short source notes remain visibly flagged to pupils.
  const primary4Delivery = resolvePrimary4SourceDelivery(topic);
  if (primary4Delivery && (primary4Delivery.kind === 'withheld' || primary4Delivery.source !== 'primary4-export')) {
    await retireStalePrimary4Cache(query, topic.id, primary4Delivery);
    const { rows: freshPrimary4 } = await query(
      'SELECT summary, generated_assessment_id FROM topics WHERE id=$1',
      [topic.id],
    );
    topic.summary = freshPrimary4[0]?.summary ?? null;
    topic.generated_assessment_id = freshPrimary4[0]?.generated_assessment_id ?? null;
  }
  if (primary4Delivery?.kind === 'withheld') {
    if (primary4Delivery.hideFromStudent) return res.status(404).json({ error: 'Topic not found' });
    return res.json({ ok: true, summary: primary4Delivery.text, summary_is_fallback: false,
      practice_questions: [], assessment_status: null,
      delivery_correction: { id: String(primary4Delivery.topicId ?? req.params.id), status: 'withheld', provenance: primary4Delivery.source },
      note: 'This Primary 4 topic is temporarily unavailable while its curriculum source is checked.' });
  }
  if (primary4Delivery?.kind === 'matched' && primary4Delivery.source === 'archive-correction') {
    topic.title = primary4Delivery.displayTitle ?? topic.title;
    topic.source_reference = primary4Delivery.text;
    topic.summary = null;
    topic.generated_assessment_id = null;
  }
  if (primary4Delivery?.kind === 'matched') topic.source_reference = primary4Delivery.text;

  // Agricultural Science compiled supplements contain teacher answer keys. Replace the stored
  // compiler payload with the exact verified learner projection before any AI grounding or fallback.
  const agriculturalScienceLearnerTopic = safeAgriculturalScienceTopic(topic);
  topic.source_reference = agriculturalScienceLearnerTopic.source_reference;
  topic.summary = agriculturalScienceLearnerTopic.summary;

  // A compiled English supplement stores teacher marking keys in source_reference.
  // Sanitize the student copy before using it as AI grounding or fallback text.
  const learnerTopic = safeEnglishSupplementTopic(topic, user.role);
  topic.source_reference = learnerTopic.source_reference;
  topic.summary = learnerTopic.summary;

  const groundingSource: string | null = primary4Delivery?.kind === 'matched' ? curriculumTeachingSource(primary4Delivery.text)
    : mathematicsDelivery?.kind === 'corrected' ? curriculumTeachingSource(mathematicsDelivery.text)
    : englishDelivery?.kind === 'corrected' ? curriculumTeachingSource(englishDelivery.text)
    : agriculturalScienceDelivery?.kind === 'corrected' || agriculturalScienceSupplement?.kind === 'supplement' || agriculturalScienceSourceProjection
      ? curriculumTeachingSource(topic.source_reference)
    : ss1Delivery?.kind === 'corrected' ? curriculumTeachingSource(ss1Delivery.text)
    : frenchDelivery?.kind === 'corrected' ? curriculumTeachingSource(frenchDelivery.text)
    : literatureDelivery?.text ? curriculumTeachingSource(literatureDelivery.text)
    : delivery?.kind === 'corrected' ? curriculumTeachingSource(delivery.text)
    : curriculumTeachingSource(topic.source_reference);

  // Generate the teaching lesson from approved curriculum context. Brainee
  // remains a separate tutor/chat experience and is not the lesson author.
  let summary: string | null = null;
  let summary_is_fallback = false;
  let practice_questions: Array<{
    stem: string;
    options: Array<{ key: 'A' | 'B' | 'C' | 'D'; text: string }>;
    correct_keys: Array<'A' | 'B' | 'C' | 'D'>;
    explanation: string;
    marks: number;
  }> = [];

  // Read optional objective metadata from the resolved curriculum row without
  // assuming every legacy topic schema has that column. No schema migration
  // or student-supplied curriculum identifiers are required for this path.
  const rawObjectives = topic.curriculum_learning_objectives;
  const objectives: string[] = Array.isArray(rawObjectives)
    ? rawObjectives.filter((value: unknown): value is string => typeof value === 'string' && value.trim().length > 0)
    : typeof rawObjectives === 'string'
      ? (() => { try { const parsed = JSON.parse(rawObjectives); return Array.isArray(parsed) ? parsed.filter((value): value is string => typeof value === 'string' && value.trim().length > 0) : []; } catch { return []; } })()
      : [];

  let generatedLesson: Awaited<ReturnType<typeof getOrGenerateCurriculumLesson>>['lesson'];
  try {
    const generated = await getOrGenerateCurriculumLesson({
      cacheKey: `topic:${topic.id}`,
      topicId: Number(topic.id),
      input: {
        className: student.class_name,
        subject: topic.subject_name || 'Subject not recorded',
        term: topic.curriculum_term_label ? `${topic.curriculum_term_label}${topic.curriculum_academic_year ? ` (${topic.curriculum_academic_year})` : ''}` : 'Term not recorded',
        topic: topic.title,
        objectives,
        sourceMaterial: groundingSource || topic.description || null,
      },
      identity: { userId: user.id, role: user.role },
    });
    generatedLesson = generated.lesson;

    summary = [
      generatedLesson.title,
      generatedLesson.introduction,
      ...generatedLesson.sections.map(section => `${section.heading}\n${section.content}`),
      `Lesson recap\n${generatedLesson.summary}`,
    ].join('\n\n');
    practice_questions = generatedLesson.practice_questions.map(question => ({ ...question, marks: 1 }));
    await query('UPDATE topics SET summary=$1 WHERE id=$2', [summary, topic.id]);
  } catch (error: any) {
    console.error('[curriculum] AI lesson generation/validation failed', {
      topicId: topic.id,
      message: error?.message ?? 'Unknown generation error',
    });
    return res.status(error?.statusCode ?? 502).json({
      ok: false,
      error: error?.message ?? 'A complete lesson could not be generated. Please retry.',
      code: 'CURRICULUM_LESSON_GENERATION_FAILED',
    });
  }

  await query(
    `INSERT INTO topic_completions(topic_id, student_id) VALUES($1,$2)
     ON CONFLICT (topic_id, student_id) DO NOTHING`,
    [topic.id, student.id],
  );

  // Standard assessment — generate once per topic, reusing real infra.
  // Status is 'open' immediately: no per-item admin approval, per explicit
  // decision (account-level access is the only gate — see comment above).
  // created_by is intentionally NULL: Brainee generated this, no human
  // authored it, and the calling student shouldn't be attributed as the
  // author of a bank item on an admin-facing assessment.
  // NOTE: two students completing the same never-before-completed topic in
  // quick succession could both pass the `!topic.generated_assessment_id`
  // check before either write lands, producing two open assessments for
  // one topic. Low-probability and low-harm (admin would just see a
  // duplicate to discard) — not worth a DB-level lock for this pass.
  let assessment_status: string | null = null;
  if (!topic.generated_assessment_id) {
    try {
      // Reuse the validated questions generated from this exact lesson.
      const drafts = practice_questions;

      // ASM-03: the model call above is finished before BEGIN; everything
      // below is DB-only and commits as one unit, so a failure cannot leave
      // orphan questions or an assessment with missing question links. Any
      // throw rolls back and falls to the catch below (assessment_status null).
      assessment_status = await withTransaction(async (client): Promise<string | null> => {
        const questionIds: number[] = [];
        for (const d of drafts) {
          const { rows: qRows } = await client.query(
            `INSERT INTO questions(school_code,subject_id,class_name,term_id,type,stem,options,correct_keys,marks,created_by)
             VALUES($1,$2,$3,$4,'mcq',$5,$6,$7,$8,NULL) RETURNING id`,
            [topic.school_code, topic.subject_id, topic.class_name, topic.term_id,
             d.stem, JSON.stringify(d.options ?? []), d.correct_keys ?? [], d.marks ?? 1],
          );
          questionIds.push(qRows[0].id);
        }

        const { rows: aRows } = await client.query(
          `INSERT INTO assessments(school_code,subject_id,class_name,term_id,title,total_marks,status,created_by,content_fingerprint)
           VALUES($1,$2,$3,$4,$5,$6,'open',NULL,$7) RETURNING id`,
          [topic.school_code, topic.subject_id, topic.class_name, topic.term_id,
           `${topic.title} — Topic Assessment`, questionIds.length, primary4Delivery?.kind === 'matched' && primary4Delivery.source !== 'primary4-export' ? primary4Delivery.sourceHash : mathematicsDelivery?.kind === 'corrected' ? mathematicsDelivery.fingerprint : ss1Delivery?.kind === 'corrected' ? ss1Delivery.fingerprint : agriculturalScienceSupplement?.kind === 'supplement' ? agriculturalScienceSupplement.fingerprint : agriculturalScienceSourceProjection && agriculturalScienceSourceProjection.kind !== 'withheld' ? agriculturalScienceSourceProjection.fingerprint : delivery?.kind === 'corrected' ? delivery.fingerprint : null],
        );
        const assessmentId = aRows[0].id;

        for (let i = 0; i < questionIds.length; i++) {
          await client.query(
            `INSERT INTO assessment_questions(assessment_id, question_id, points, order_index) VALUES($1,$2,1,$3)`,
            [assessmentId, questionIds[i], i],
          );
        }

        // Link only if no concurrent request linked one first; the loser closes its own copy (no duplicate open assessments).
        // Still a compare-and-set: under READ COMMITTED a second transaction's UPDATE waits on the
        // first one's row lock, then re-checks `generated_assessment_id IS NULL` and matches nothing.
        const { rows: linked } = await client.query('UPDATE topics SET generated_assessment_id=$1 WHERE id=$2 AND generated_assessment_id IS NULL RETURNING id', [assessmentId, topic.id]);
        if (linked[0]) return 'open';
        await client.query("UPDATE assessments SET status='closed' WHERE id=$1", [assessmentId]);
        const { rows: winner } = await client.query('SELECT a.status FROM topics t JOIN assessments a ON a.id=t.generated_assessment_id WHERE t.id=$1', [topic.id]);
        return winner[0]?.status ?? null;
      });
    } catch {
      assessment_status = null;
    }
  } else {
    const { rows: existingA } = await query('SELECT status FROM assessments WHERE id=$1', [topic.generated_assessment_id]);
    assessment_status = existingA[0]?.status ?? null;
  }

  return res.json({
    ok: true,
    summary,
    summary_is_fallback,
    lesson: generatedLesson,
    delivery_correction: primary4Delivery?.kind === 'matched' ? { id: String(primary4Delivery.topicId), status: primary4Delivery.source === 'primary4-export' ? 'source-export-match' : 'researched-package-match', provenance: primary4Delivery.source === 'primary4-export' ? 'source_reference hash matches the supplied database export' : 'source_reference hash matches an approved researched lesson package' } : ss1Delivery ? { id: ss1Delivery.correctionId, status: ss1Delivery.kind, provenance: ss1Delivery.kind === 'corrected' ? 'approved project-authored correction' : 'withheld pending source review' } : delivery ? { id: delivery.correctionId, status: delivery.kind, provenance: 'corrected/equivalent teaching' } : undefined,
    practice_questions,
    assessment_status,
    note: [
      primary4Delivery?.kind === 'matched' && primary4Delivery.reviewRequired
        ? 'The supplied curriculum source for this topic is brief. These study notes are grounded in that source, but your teacher may need to add fuller classroom explanations.'
        : undefined,
      assessment_status === 'open' ? 'A standard assessment for this topic is available now — check Assessments.' : undefined,
    ].filter(Boolean).join(' ') || undefined,
  });
});

// ── POST /term-pins/redeem (student) ─────────────────────────────────────────
// Unlocks order_index=1 for every subject in the student's class for the
// PIN's term_label — see schema.sql's "Term-PIN gating" section for the
// locked decisions this implements (one PIN per student per term, no tie to
// Finance, only the first topic is PIN-gated). The actual "is this topic
// locked" computation lives in GET /topics below, driven by whether a
// redeemed row exists here — this route only flips that one bit.
router.post('/term-pins/redeem', requireRole('student'), async (req, res) => {
  const { pin } = req.body as { pin?: string };
  if (!pin) return res.status(400).json({ error: 'pin is required' });

  const { rows: stRows } = await query('SELECT id FROM students WHERE user_id=$1 LIMIT 1', [req.user!.id]);
  const student = stRows[0];
  if (!student) return res.status(404).json({ error: 'No student record for this user' });

  const { rows } = await query(
    `UPDATE term_access_pins SET redeemed_at=now()
     WHERE student_id=$1 AND pin=$2 AND redeemed_at IS NULL
     RETURNING *`,
    [student.id, pin],
  );
  if (!rows[0]) {
    // Deliberately one generic message for "wrong PIN", "already redeemed",
    // and "PIN belongs to a different student" — distinguishing them would
    // let someone narrow down a guess (e.g. confirm a PIN is valid but
    // already used, meaning they're just guessing the wrong student).
    return res.status(400).json({ error: 'That PIN is invalid or has already been used.' });
  }
  return res.json({ ok: true, term_label: rows[0].term_label });
});

// ════════════════════════════════════════════════════════
// SELF-STUDY TIMETABLE
// ════════════════════════════════════════════════════════
// Student-only self-study planning tool — deliberately separate from
// physical-classroom attendance (see AGENT_CONTINUATION.md's "Confirmed
// product intent"). Subjects come from `topics`, not a new class-subject
// mapping, since that's already the real source of "what this class
// studies". Priority is computed here at read time from `scores`, never
// stored — a subject with a weaker recent score gets more of the
// student's chosen daily minutes; a subject with no score yet gets a
// neutral (not maximal, not minimal) weight, since we don't yet know if
// it's a strength or a weakness.
const STUDY_WEIGHT_FLOOR = 15;   // even a 100%-scoring subject keeps some study time
const STUDY_WEIGHT_NEUTRAL = 50; // no score yet — treat as moderate priority, not weak or strong

async function resolveOwnStudent(userId: string) {
  const { rows } = await query('SELECT id, class_name, school_code FROM students WHERE user_id=$1 LIMIT 1', [userId]);
  return rows[0] as { id: string; class_name: string; school_code: string } | undefined;
}

router.get('/study-plan', requireRole('student'), async (req, res) => {
  const student = await resolveOwnStudent(req.user!.id);
  if (!student) return res.status(404).json({ error: 'No student record for this user' });

  const [settingsRes, subjectsRes, toggleRes, scoreRes] = await Promise.all([
    query('SELECT daily_minutes FROM student_study_settings WHERE student_id=$1', [student.id]),
    query(
      `SELECT DISTINCT sub.id, sub.name
       FROM topics t JOIN subjects sub ON sub.id = t.subject_id
       WHERE t.class_name=$1 AND t.school_code=$2
       ORDER BY sub.name`,
      [student.class_name, student.school_code],
    ),
    query('SELECT subject_id, included FROM student_study_subjects WHERE student_id=$1', [student.id]),
    // Most recent score per subject, regardless of term — "recent" per the
    // project owner's own phrasing, not scoped to the current term only.
    query(
      `SELECT DISTINCT ON (subject_id) subject_id, total
       FROM scores WHERE student_id=$1 ORDER BY subject_id, updated_at DESC`,
      [student.id],
    ),
  ]);

  const dailyMinutes = settingsRes.rows[0]?.daily_minutes ?? 120;
  const includedMap = new Map<number, boolean>(toggleRes.rows.map((r: any) => [r.subject_id, r.included]));
  const scoreMap = new Map<number, number>(scoreRes.rows.map((r: any) => [r.subject_id, Number(r.total)]));

  const withWeights = subjectsRes.rows.map((s: any) => {
    const included = includedMap.get(s.id) ?? true; // absence of a row = included, see schema.sql
    const avgScore = scoreMap.has(s.id) ? scoreMap.get(s.id)! : null;
    const weight = !included ? 0 : (avgScore != null ? Math.max(100 - avgScore, STUDY_WEIGHT_FLOOR) : STUDY_WEIGHT_NEUTRAL);
    return { subject_id: s.id, name: s.name, included, avg_score: avgScore, weight };
  });

  const totalWeight = withWeights.reduce((sum: number, s: any) => sum + s.weight, 0);
  const subjects = withWeights
    .map(({ weight, ...s }: any) => ({
      ...s,
      allocated_minutes: (s.included && totalWeight > 0) ? Math.round((dailyMinutes * weight) / totalWeight) : 0,
    }))
    // Highest study-time first — the priority ordering the feature exists to produce.
    .sort((a: any, b: any) => b.allocated_minutes - a.allocated_minutes);

  return res.json({ daily_minutes: dailyMinutes, subjects });
});

router.put('/study-plan/settings', requireRole('student'), async (req, res) => {
  const student = await resolveOwnStudent(req.user!.id);
  if (!student) return res.status(404).json({ error: 'No student record for this user' });

  const { daily_minutes } = req.body as { daily_minutes?: number };
  const minutes = Number(daily_minutes);
  if (!Number.isInteger(minutes) || minutes < 1 || minutes > 960) {
    return res.status(400).json({ error: 'daily_minutes must be a whole number between 1 and 960' });
  }

  await query(
    `INSERT INTO student_study_settings (student_id, daily_minutes)
     VALUES ($1, $2)
     ON CONFLICT (student_id) DO UPDATE SET daily_minutes=$2, updated_at=now()`,
    [student.id, minutes],
  );
  return res.json({ ok: true, daily_minutes: minutes });
});

router.put('/study-plan/subjects/:subject_id', requireRole('student'), async (req, res) => {
  const student = await resolveOwnStudent(req.user!.id);
  if (!student) return res.status(404).json({ error: 'No student record for this user' });

  const subjectId = Number(req.params.subject_id);
  const { included } = req.body as { included?: boolean };
  if (typeof included !== 'boolean') return res.status(400).json({ error: 'included must be a boolean' });

  // Reject toggling a subject that isn't actually part of this student's
  // class curriculum — same defensive-scoping pattern used throughout this
  // file (e.g. term-pins/redeem's ownership check above).
  const { rows: belongs } = await query(
    `SELECT 1 FROM topics WHERE subject_id=$1 AND class_name=$2 AND school_code=$3 LIMIT 1`,
    [subjectId, student.class_name, student.school_code],
  );
  if (!belongs[0]) return res.status(404).json({ error: 'That subject is not part of your class curriculum' });

  await query(
    `INSERT INTO student_study_subjects (student_id, subject_id, included)
     VALUES ($1, $2, $3)
     ON CONFLICT (student_id, subject_id) DO UPDATE SET included=$3`,
    [student.id, subjectId, included],
  );
  return res.json({ ok: true });
});

// ════════════════════════════════════════════════════════
// QUESTIONS
// ════════════════════════════════════════════════════════

router.get('/questions', requirePerm('questions.read'), async (req, res) => {
  const { subject_id, class_name, type } = req.query as Record<string, string>;
  let sql = `SELECT * FROM questions q WHERE q.school_code=$1
               AND EXISTS (SELECT 1 FROM subjects sub WHERE sub.id=q.subject_id AND sub.school_code=q.school_code)
               AND (q.term_id IS NULL OR EXISTS (SELECT 1 FROM terms t WHERE t.id=q.term_id AND t.school_code=q.school_code))`;
  const params: unknown[] = [req.user!.school_code];
  if (subject_id) { params.push(subject_id); sql += ` AND subject_id=$${params.length}`; }
  if (class_name) { params.push(class_name); sql += ` AND class_name=$${params.length}`; }
  if (type)       { params.push(type);       sql += ` AND type=$${params.length}`; }
  const { rows } = await query(sql, params);
  return res.json({ questions: rows });
});

const questionCreateSchema = z.object({
  subject_id: z.coerce.number().int().positive(),
  class_name: z.string().trim().min(1).max(100).nullable().optional(),
  term_id: z.coerce.number().int().positive().nullable().optional(),
  type: z.enum(['mcq', 'essay']).optional(),
  stem: z.string().trim().min(1).max(10000),
  options: z.unknown().optional(),
  correct_keys: z.array(z.string().min(1)).optional(),
  marks: z.number().int().positive().max(1000).optional(),
  school_code: z.string().trim().min(1).max(50).optional(),
});

router.post('/questions', requirePerm('questions.write'), async (req, res) => {
  const parsed = questionCreateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const data = parsed.data;
  const target = resolveContentSchool(req.user!, data.school_code);
  if ('error' in target) return res.status(target.status).json({ error: target.error });

  const scopeError = await checkTeacherContentScope(req.user!, {
    class_name: data.class_name ?? null,
    subject_id: data.subject_id,
  });
  if (scopeError) return res.status(scopeError.status).json({ error: scopeError.error });

  const result = await withTransaction(async (client) => {
    const referenceError = await validateContentReferences(
      client, target.schoolCode, data.subject_id, data.term_id ?? null,
    );
    if (referenceError) return { ok: false as const, ...referenceError };

    const { rows } = await client.query(
      `INSERT INTO questions(school_code,subject_id,class_name,term_id,type,stem,options,correct_keys,marks,created_by)
       VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      [target.schoolCode, data.subject_id, data.class_name ?? null, data.term_id ?? null,
       data.type ?? 'mcq', data.stem, JSON.stringify(data.options ?? []),
       data.correct_keys ?? [], data.marks ?? 1, req.user!.id],
    );
    return { ok: true as const, question: rows[0] };
  });
  if (!result.ok) return res.status(result.status).json({ error: result.error });
  return res.status(201).json({ question: result.question });
});

// ════════════════════════════════════════════════════════
// ASSESSMENTS
// ════════════════════════════════════════════════════════

// Parent-only summary of published tests for active linked wards. This is
// deliberately separate from the class-wide assessment endpoint: parents
// never receive question content, submissions from other students, or draft tests.
router.get('/parent/upcoming-assessments', requireRole('parent'), async (req, res) => {
  const { rows } = await query(
    `SELECT DISTINCT a.id, a.school_code, a.title, a.start_at, a.end_at, a.class_name,
            sub.name AS subject_name
       FROM parent_wards pw
       JOIN students st ON st.id=pw.student_id AND st.deleted_at IS NULL
       JOIN assessments a ON a.school_code=st.school_code
         AND (a.class_name IS NULL OR a.class_name=st.class_name)
       JOIN subjects sub ON sub.id=a.subject_id AND sub.school_code=a.school_code AND sub.school_code=a.school_code
      WHERE pw.parent_id=$1
        AND a.status='open'
        AND (a.start_at IS NULL OR a.start_at >= now())
        AND (a.end_at IS NULL OR a.end_at >= now())
      ORDER BY a.start_at ASC NULLS LAST, a.title ASC`,
    [req.user!.id],
  );
  const ids = rows.map((r: any) => r.id);
  const [jss3Gone, ss1Gone, agGone, englishGone, primary4Gone] = await Promise.all([
    withdrawnAssessmentIds(query, ids),
    ss1WithdrawnAssessmentIds(query, ids),
    agriculturalScienceWithdrawnAssessmentIds(query, ids),
    englishWithdrawnAssessmentIds(query, ids),
    primary4WithdrawnAssessmentIds(query, ids),
  ]);
  const withdrawn = new Set([...jss3Gone, ...ss1Gone, ...agGone, ...englishGone, ...primary4Gone]);
  return res.json({ assessments: rows.filter((r: any) => !withdrawn.has(r.id)) });
});




router.get('/assessments', requirePerm('assessments.read'), async (req, res) => {
  const { class_name, subject_id, status, school_code } = req.query as Record<string, string>;
  const user = req.user!;
  const sc = (school_code && user.role === 'admin') ? school_code : user.school_code;

  // Same class-scoping gap as /materials above, plus: a student/parent has no
  // business seeing an assessment that's still 'draft' — it isn't published
  // to anyone yet. Live-verified: a JSS1 student's account could see the
  // title of an unpublished SS3-only assessment before this fix.
  const viewerClasses = await resolveViewerClassNames(user);

  const params: unknown[] = [sc];

  // For a student, also report whether they've already submitted this
  // assessment (and their score, if so) — added alongside the
  // already_submitted UI fix: previously nothing distinguished a fresh
  // assessment from one already answered, so AssessmentsScreen always
  // showed the same "Take Assessment" button, and re-tapping it silently
  // overwrote the student's prior (possibly AI-graded) submission with no
  // warning. Not added for admin/teacher — the extra subquery/join is
  // meaningless for them (a teacher never reaches this route at all per
  // rbac.ts; admin's "own submission" has no meaning here).
  let submittedCol = '';
  if (user.role === 'student') {
    params.push(user.id);
    const p = params.length;
    submittedCol = `, EXISTS (
         SELECT 1 FROM submissions sm JOIN students st ON st.id = sm.student_id
         WHERE sm.assessment_id = a.id AND st.user_id = $${p}
       ) AS already_submitted,
       (SELECT sm.id FROM submissions sm JOIN students st ON st.id = sm.student_id
        WHERE sm.assessment_id = a.id AND st.user_id = $${p}) AS my_submission_id,
       (SELECT sm.total_score FROM submissions sm JOIN students st ON st.id = sm.student_id
        WHERE sm.assessment_id = a.id AND st.user_id = $${p}) AS my_score`;
  }

  let sql = `SELECT a.*,sub.name AS subject_name,
                    (SELECT COUNT(*) FROM assessment_questions aq WHERE aq.assessment_id=a.id) AS question_count
                    ${submittedCol}
             FROM assessments a JOIN subjects sub ON sub.id=a.subject_id AND sub.school_code=a.school_code
             WHERE a.school_code=$1
               AND (a.term_id IS NULL OR EXISTS (SELECT 1 FROM terms t WHERE t.id=a.term_id AND t.school_code=a.school_code))`;

  if (viewerClasses) {
    if (!viewerClasses.length) return res.json({ assessments: [] });
    params.push(viewerClasses);
    sql += ` AND (a.class_name = ANY($${params.length}) OR a.class_name IS NULL)`;
    sql += ` AND a.status != 'draft'`;
  } else if (class_name) {
    params.push(class_name); sql += ` AND a.class_name=$${params.length}`;
  }

  if (subject_id) { params.push(subject_id); sql += ` AND a.subject_id=$${params.length}`; }
  if (status)     { params.push(status);     sql += ` AND a.status=$${params.length}`; }
  sql += ' ORDER BY a.created_at DESC';
  const { rows } = await query(sql, params);
  let visibleRows = rows;
  if (user.role === 'student' && rows.length) {
    // Topic-generated assessments become globally linked after one student
    // reaches the topic. Keep them hidden from students whose own sequence
    // state still locks that topic.
    const { rows: linkedTopics } = await query(
      `SELECT t.id, t.generated_assessment_id, t.school_code, t.subject_id, t.class_name,
              t.term_label, t.order_index, (to_jsonb(t)->>'sequence_rank')::numeric AS sequence_rank
         FROM topics t WHERE t.generated_assessment_id=ANY($1)`,
      [rows.map((row: any) => row.id)],
    );
    const lockStates = await Promise.all(linkedTopics.map((topic: any) => studentTopicSequenceLocked(user, topic, req.learningAccessPolicy)));
    const lockedAssessmentIds = new Set(linkedTopics.filter((topic: any, index: number) => lockStates[index]).map((topic: any) => topic.generated_assessment_id));
    if (lockedAssessmentIds.size) visibleRows = rows.filter((assessment: any) => !lockedAssessmentIds.has(assessment.id));
  }
  if (viewerClasses) {
    // Students/parents never see a topic assessment built from since-corrected teaching (admins keep the audit view).
    const openIds = visibleRows.map((r: any) => r.id);
    const jss3Gone = await withdrawnAssessmentIds(query, openIds);
    const ss1Gone = await ss1WithdrawnAssessmentIds(query, openIds);
    const agriculturalScienceGone = await agriculturalScienceWithdrawnAssessmentIds(query, openIds);
    const englishGone = await englishWithdrawnAssessmentIds(query, openIds);
    const primary4Gone = await primary4WithdrawnAssessmentIds(query, openIds);
    const gone = new Set([...jss3Gone, ...ss1Gone, ...agriculturalScienceGone, ...englishGone, ...primary4Gone]);
    if (gone.size) visibleRows = visibleRows.filter((r: any) => !gone.has(r.id));
  }
  return res.json({ assessments: visibleRows });
});

const assessmentCreateSchema = z.object({
  subject_id: z.coerce.number().int().positive(),
  class_name: z.string().trim().min(1).max(100),
  term_id: z.coerce.number().int().positive().nullable().optional(),
  title: z.string().trim().min(1).max(255),
  start_at: z.string().optional(),
  end_at: z.string().optional(),
  shuffle: z.boolean().optional(),
  question_ids: z.array(z.object({
    id: z.coerce.number().int().positive(),
    points: z.coerce.number().int().positive().max(1000).optional(),
  })).min(1).max(200)
    .refine(items => new Set(items.map(item => item.id)).size === items.length,
      'question_ids must not contain duplicates'),
  school_code: z.string().trim().min(1).max(50).optional(),
});

router.post('/assessments', requirePerm('assessments.create'), async (req, res) => {
  const parsed = assessmentCreateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const data = parsed.data;
  const target = resolveContentSchool(req.user!, data.school_code);
  if ('error' in target) return res.status(target.status).json({ error: target.error });

  const scopeError = await checkTeacherContentScope(req.user!, {
    class_name: data.class_name,
    subject_id: data.subject_id,
  });
  if (scopeError) return res.status(scopeError.status).json({ error: scopeError.error });

  const result = await withTransaction(async (client) => {
    const referenceError = await validateContentReferences(
      client, target.schoolCode, data.subject_id, data.term_id ?? null,
    );
    if (referenceError) return { ok: false as const, ...referenceError };

    const questionIds = data.question_ids.map(item => item.id);
    const { rows: questions } = await client.query(
      'SELECT id, school_code, subject_id, class_name, term_id FROM questions WHERE id=ANY($1::int[]) ORDER BY id FOR SHARE',
      [questionIds],
    );
    if (questions.length !== questionIds.length) {
      return { ok: false as const, status: 400, error: 'One or more question_ids do not exist.' };
    }

    const invalidQuestion = questions.find(question =>
      question.school_code !== target.schoolCode ||
      Number(question.subject_id) !== data.subject_id ||
      (question.class_name != null && question.class_name !== data.class_name) ||
      (question.term_id != null && Number(question.term_id) !== (data.term_id ?? null)),
    );
    if (invalidQuestion) {
      return {
        ok: false as const,
        status: 400,
        error: 'Every question must belong to the assessment school and subject, and any class/term-specific question must match the assessment.',
      };
    }

    const totalMarks = data.question_ids.reduce((sum, item) => sum + (item.points ?? 1), 0);
    const { rows } = await client.query(
      `INSERT INTO assessments(school_code,subject_id,class_name,term_id,title,total_marks,
         start_at,end_at,shuffle,created_by)
       VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      [target.schoolCode, data.subject_id, data.class_name, data.term_id ?? null,
       data.title, totalMarks, data.start_at ?? null, data.end_at ?? null,
       data.shuffle !== false, req.user!.id],
    );
    const created = rows[0];

    for (let index = 0; index < data.question_ids.length; index++) {
      const item = data.question_ids[index];
      await client.query(
        `INSERT INTO assessment_questions(assessment_id,question_id,points,order_index)
         VALUES($1,$2,$3,$4)`,
        [created.id, item.id, item.points ?? 1, index],
      );
    }
    return { ok: true as const, assessment: created };
  });
  if (!result.ok) return res.status(result.status).json({ error: result.error });
  return res.status(201).json({ assessment: result.assessment });
});

// ── PUT /assessments/:id/status  (draft → open → closed) ──────────────────────
// Found in QA Pass 6: assessments.status defaults to 'draft' at creation and
// NOTHING anywhere (backend route or UI control) ever changed it — every
// assessment ever created was permanently stuck in 'draft', so the "Take
// Assessment" button (gated on status === 'open') could never work for any
// student, for any assessment, ever. This is the missing publish/close action.
router.put('/assessments/:id/status', requirePerm('assessments.schedule'), async (req, res) => {
  const { status } = req.body as { status: string };
  if (!['draft', 'open', 'closed'].includes(status)) {
    return res.status(400).json({ error: "status must be 'draft', 'open', or 'closed'" });
  }
  const { rows: aRows } = await query(
    'SELECT school_code, class_name, subject_id, title FROM assessments WHERE id=$1', [req.params.id],
  );
  if (!aRows[0]) return res.status(404).json({ error: 'Assessment not found' });
  if (req.user!.role !== 'admin' && aRows[0].school_code !== req.user!.school_code) {
    return res.status(404).json({ error: 'Assessment not found' });
  }

  // Found in the Pass 20 comparison audit: creating an assessment is
  // already scoped to "your own class or your own subject" via
  // checkTeacherContentScope(), but publishing/closing one (this route)
  // only ever checked school_code — so any teacher in the school could
  // open or close an assessment they had no part in creating, as long as
  // it belonged to their school. Same rule now applies here: a teacher may
  // change status only when they're the class teacher for aRows[0]
  // .class_name OR the subject teacher for aRows[0].subject_id. Admin
  // remains unrestricted.
  const scopeError = await checkTeacherContentScope(req.user!, {
    class_name: aRows[0].class_name, subject_id: aRows[0].subject_id,
  });
  if (scopeError) return res.status(scopeError.status).json({ error: scopeError.error });

  const { rows } = await query(
    'UPDATE assessments SET status=$1 WHERE id=$2 RETURNING *', [status, req.params.id],
  );

  // Only on publish, not on close — a closed assessment isn't something a
  // student needs pushed to them. TakeAssessmentScreen needs both
  // assessmentId and title in its route params, so both travel in `data`.
  if (status === 'open') {
    sendPushToClass(aRows[0].school_code, aRows[0].class_name, {
      title: 'New assessment available',
      body: `${aRows[0].title} has been published for your class.`,
      data: { type: 'assessment', assessmentId: req.params.id, title: aRows[0].title },
    }).catch(err => console.error('Push send failed (assessment publish):', err));
  }

  return res.json({ assessment: rows[0] });
});

// ── GET /assessments/:id/questions  (for the student taking it) ───────────────
// Found in QA Pass 6: TakeAssessmentScreen.tsx never actually fetched this
// assessment's own questions — no such endpoint existed. It called the
// unrelated, unscoped GET /learning/questions (which 403s for students
// anyway — 'questions.read' is admin-only per rbac.ts) and, per a
// comment in the old code, "simplified" by taking whichever 20 questions
// happened to come back first. Had that 403 not already blocked it, a
// student would have been shown questions with no relationship at all to
// the assessment they opened, while /submit (correctly) grades against the
// *real* assessment_questions — meaning a student could never actually pass
// the assessment they were shown. This route returns the real, correct,
// ordered question set for a specific assessment.
router.get('/assessments/:id/questions', async (req, res) => {
  const user = req.user!;
  const { rows: aRows } = await query(
    'SELECT * FROM assessments WHERE id=$1', [req.params.id],
  );
  const assessment = aRows[0];
  if (!assessment) return res.status(404).json({ error: 'Assessment not found' });

  if (user.role !== 'admin') {
    const { rows: validReferences } = await query(
      `SELECT 1 FROM subjects s
        WHERE s.id=$1 AND s.school_code=$2
          AND ($3::int IS NULL OR EXISTS (
            SELECT 1 FROM terms t WHERE t.id=$3 AND t.school_code=$2
          ))`,
      [assessment.subject_id, assessment.school_code, assessment.term_id],
    );
    if (!validReferences[0]) return res.status(404).json({ error: 'Assessment not found' });
  }

  if (user.role === 'student') {
    const { rows: stRows } = await query(
      'SELECT school_code, class_name FROM students WHERE user_id=$1', [user.id],
    );
    const student = stRows[0];
    if (!student || assessment.school_code !== student.school_code || assessment.class_name !== student.class_name) {
      return res.status(404).json({ error: 'Assessment not found' });
    }
    if (await studentAssessmentTopicLocked(user, assessment.id, req.learningAccessPolicy)) {
      return res.status(403).json({ error: 'This assessment is locked until its topic is unlocked.' });
    }
    if (assessment.status !== 'open') {
      return res.status(403).json({ error: `This assessment is ${assessment.status === 'draft' ? 'not yet open' : 'closed'}.` });
    }
    const now = Date.now();
    if (assessment.start_at && now < new Date(assessment.start_at).getTime()) {
      return res.status(403).json({ error: 'This assessment has not started yet' });
    }
    if (assessment.end_at && now > new Date(assessment.end_at).getTime()) {
      return res.status(403).json({ error: 'This assessment has already closed' });
    }
    const deliverable = await assessmentDeliverable(query, assessment.id);
    if (!deliverable.ok) return res.status(403).json({ error: deliverable.reason });
    const ss1Deliverable = await ss1AssessmentDeliverable(query, assessment.id);
    if (!ss1Deliverable.ok) return res.status(403).json({ error: ss1Deliverable.reason });
    const agriculturalScienceDeliverable = await agriculturalScienceAssessmentDeliverable(query, assessment.id);
    if (!agriculturalScienceDeliverable.ok) return res.status(403).json({ error: agriculturalScienceDeliverable.reason });
    const englishDeliverable = await englishAssessmentDeliverable(query, assessment.id);
    if (!englishDeliverable.ok) return res.status(403).json({ error: englishDeliverable.reason });
    const primary4Deliverable = await primary4AssessmentDeliverable(query, assessment.id);
    if (!primary4Deliverable.ok) return res.status(403).json({ error: primary4Deliverable.reason });
  } else if (user.role !== 'admin') {
    // Teachers never get here: creating, viewing, or opening the questions of
    // an assessment is Brainee/admin territory on this platform, not a
    // teacher's — same policy enforced in rbac.ts.
    return res.status(403).json({ error: 'Not authorized' });
  }

  // Students never get correct_keys back — teachers/admin do, for review.
  const cols = user.role === 'student'
    ? 'q.id, q.type, q.stem, q.options'
    : 'q.id, q.type, q.stem, q.options, q.correct_keys';
  const { rows: qRows } = await query(
    `SELECT ${cols}, aq.points, aq.order_index
     FROM assessment_questions aq JOIN questions q ON q.id = aq.question_id
     WHERE aq.assessment_id=$1
       AND q.school_code=$2
       AND q.subject_id=$3
       AND (q.class_name IS NULL OR q.class_name=$4)
       AND (q.term_id IS NULL OR q.term_id IS NOT DISTINCT FROM $5)
     ORDER BY aq.order_index`,
    [req.params.id, assessment.school_code, assessment.subject_id, assessment.class_name, assessment.term_id],
  );
  return res.json({ assessment, questions: qRows });
});

// ── Essay review backlog (ASM-04) ─────────────────────────────────────────────
// One definition of "still needs a human" for a submission: an essay answer is
// unconfirmed while it is 'ai_graded' (Brainee marked it but its mark is hidden
// from the student until reviewed — see GET /submissions/:id/answers) or
// 'ai_unavailable' (Brainee failed). Only 'auto' and 'teacher_reviewed' are
// final. `fully_graded` therefore means "no review outstanding", not "Brainee
// has seen every answer". The SQL constant must list the same statuses.
const PENDING_REVIEW_STATUSES = ['ai_graded', 'ai_unavailable'];
const PENDING_REVIEW_SQL = "('ai_graded','ai_unavailable')";

function reviewBacklog(gradingStatuses: string[]): { pending_review_count: number; fully_graded: boolean } {
  const pending_review_count = gradingStatuses.filter(s => PENDING_REVIEW_STATUSES.includes(s)).length;
  return { pending_review_count, fully_graded: pending_review_count === 0 };
}

// Thrown inside the submit transaction when this student already has a
// submission, so the rollback is translated to the existing 409 instead of a
// generic 500 (ASM-03).
class AlreadySubmittedError extends Error {}

// ── POST /assessments/:id/submit (student) ────────────────────────────────────
router.post('/assessments/:id/submit', requirePerm('assessments.take'), async (req, res) => {
  const user = req.user!;
  const answers = req.body?.answers;
  if (!answers || typeof answers !== 'object' || Array.isArray(answers) ||
      Object.values(answers).some(value => typeof value !== 'string')) {
    return res.status(400).json({ error: 'answers must map question IDs to string answers' });
  }

  // Get student record
  const { rows: stRows } = await query('SELECT id, school_code, class_name FROM students WHERE user_id=$1 LIMIT 1', [user.id]);
  if (!stRows[0]) return res.status(404).json({ error: 'No student record for this user' });
  const student = stRows[0];
  const student_id = student.id;

  // Found in QA Pass 4: this route never checked the assessment's status or
  // time window, so a student could submit to (and get auto-graded on) a
  // still-draft/never-published assessment, or one whose end_at had already
  // passed — live-verified: a draft assessment returned a full auto-score.
  // Also add the same school/class scoping used on every other write route.
  const { rows: aRows } = await query(
    'SELECT status, start_at, end_at, school_code, class_name, total_marks FROM assessments WHERE id=$1', [req.params.id],
  );
  const assessment = aRows[0];
  if (!assessment) return res.status(404).json({ error: 'Assessment not found' });
  if (assessment.school_code !== student.school_code || assessment.class_name !== student.class_name) {
    return res.status(403).json({ error: 'This assessment is not available to you' });
  }
  if (await studentAssessmentTopicLocked(user, req.params.id, req.learningAccessPolicy)) {
    return res.status(403).json({ error: 'This assessment is locked until its topic is unlocked.' });
  }
  if (assessment.status !== 'open') {
    return res.status(403).json({ error: `This assessment is ${assessment.status === 'draft' ? 'not yet open' : 'closed'}.` });
  }
  const now = Date.now();
  if (assessment.start_at && now < new Date(assessment.start_at).getTime()) {
    return res.status(403).json({ error: 'This assessment has not started yet' });
  }
  if (assessment.end_at && now > new Date(assessment.end_at).getTime()) {
    return res.status(403).json({ error: 'This assessment has already closed' });
  }
  const deliverable = await assessmentDeliverable(query, req.params.id);
  if (!deliverable.ok) return res.status(403).json({ error: deliverable.reason });
  const ss1Deliverable = await ss1AssessmentDeliverable(query, req.params.id);
  if (!ss1Deliverable.ok) return res.status(403).json({ error: ss1Deliverable.reason });
  const agriculturalScienceDeliverable = await agriculturalScienceAssessmentDeliverable(query, req.params.id);
  if (!agriculturalScienceDeliverable.ok) return res.status(403).json({ error: agriculturalScienceDeliverable.reason });
  const englishDeliverable = await englishAssessmentDeliverable(query, req.params.id);
  if (!englishDeliverable.ok) return res.status(403).json({ error: englishDeliverable.reason });
  const primary4Deliverable = await primary4AssessmentDeliverable(query, req.params.id);
  if (!primary4Deliverable.ok) return res.status(403).json({ error: primary4Deliverable.reason });

  // Auto-mark MCQs; hand essay answers to Brainee (this is the STS Virtual
  // School's own AI grading path — see submission_answers in schema.sql.
  // This never touches `scores`, `attendance`, or `class_records`, which
  // remain the separate, teacher-entered traditional grading system used
  // for report cards.)
  const { rows: qRows } = await query(
    `SELECT aq.question_id, aq.points, q.correct_keys, q.type, q.stem
     FROM assessment_questions aq JOIN questions q ON q.id=aq.question_id
     WHERE aq.assessment_id=$1`,
    [req.params.id],
  );

  if (qRows.some(q => !['mcq', 'essay'].includes(q.type) ||
      (q.type === 'mcq' && (!Array.isArray(q.correct_keys) || q.correct_keys.length === 0)))) {
    return res.status(422).json({ error: 'Assessment contains an unsupported or invalid question' });
  }

  let auto_score = 0;
  const essayRows: { question_id: number; points: number; stem: string; answer_text: string }[] = [];

  for (const q of qRows) {
    if (q.type === 'mcq') {
      const selected = answers[q.question_id];
      if (selected && q.correct_keys.includes(selected)) {
        auto_score += Number(q.points);
      }
    } else if (q.type === 'essay') {
      const answer_text = (answers[q.question_id] ?? '').toString();
      essayRows.push({ question_id: q.question_id, points: Number(q.points), stem: q.stem, answer_text });
    }
  }

  // Early duplicate check (ASM-03). Essay grading below now runs BEFORE the
  // submission row exists, so without this a repeat submit would spend a
  // model call per essay before being rejected. The in-transaction insert
  // below stays authoritative for the concurrent-request race.
  const { rows: existingSub } = await query(
    'SELECT 1 FROM submissions WHERE assessment_id=$1 AND student_id=$2', [req.params.id, student_id],
  );
  if (existingSub[0]) {
    return res.status(409).json({ error: 'Assessment already submitted; previous results are preserved' });
  }

  // Essay marking — Brainee grades each one, in memory, BEFORE any
  // transaction opens (ASM-03: never hold a pool client across a model call).
  // An unanswered essay gets 0 with no AI call (nothing to grade). A failed
  // Brainee call leaves it explicitly 'ai_unavailable' rather than silently
  // scoring it 0 or dropping it — an admin has to grade it by hand via
  // PUT /submissions/:id/answers/:answerId/review.
  type GradedEssay = {
    question_id: number; points: number; answer_text: string;
    status: 'auto' | 'ai_graded' | 'ai_unavailable';
    awarded: number | null; feedback: string | null;
  };
  const gradedEssays: GradedEssay[] = [];
  for (const e of essayRows) {
    if (!e.answer_text.trim()) {
      gradedEssays.push({ question_id: e.question_id, points: e.points, answer_text: e.answer_text, status: 'auto', awarded: 0, feedback: null });
      continue;
    }
    try {
      const prompt =
        `Grade this student's essay answer out of ${e.points} marks.\n` +
        `Question: "${e.stem}"\n` +
        `Student's answer: "${e.answer_text}"\n` +
        `Return JSON exactly like: {"points": number (0-${e.points}), "feedback": string (1-2 short, encouraging, age-appropriate sentences)}`;
      const result: any = await generateJSON(prompt, 'essay-mark', { userId: user.id, role: user.role });
      const points = Math.max(0, Math.min(e.points, Number(result?.points) || 0));
      const feedback = typeof result?.feedback === 'string' ? result.feedback : null;
      gradedEssays.push({ question_id: e.question_id, points: e.points, answer_text: e.answer_text, status: 'ai_graded', awarded: points, feedback });
    } catch {
      gradedEssays.push({ question_id: e.question_id, points: e.points, answer_text: e.answer_text, status: 'ai_unavailable', awarded: null, feedback: null });
    }
  }

  // grading_status of each essay row, fed to reviewBacklog().
  const essayStatuses = gradedEssays.map(g => g.status);
  const essayPointsTotal = gradedEssays.reduce((sum, g) => sum + (g.status === 'ai_graded' ? Number(g.awarded) : 0), 0);
  const total_score = auto_score + essayPointsTotal;

  // One transaction for every write: submission row, per-answer rows, final
  // total/fully_graded, and the topic_completions upsert. A failure at any
  // statement rolls all of it back, so no submission can exist without its
  // answers (which previously blocked resubmission with a 409 and had no marks).
  let updatedSubmission: any;
  try {
    updatedSubmission = await withTransaction(async (client) => {
      const { rows } = await client.query(
        `INSERT INTO submissions(assessment_id,student_id,answers,auto_score,total_score,started_at,submitted_at)
         VALUES($1,$2,$3,$4,$4,now(),now())
         ON CONFLICT(assessment_id,student_id) DO NOTHING
         RETURNING *`,
        [req.params.id, student_id, JSON.stringify(answers), auto_score],
      );
      const submission = rows[0];
      if (!submission) throw new AlreadySubmittedError();

      // A new submission has no previous answer rows to delete.

      // MCQ rows — final immediately, same as auto_score above.
      for (const q of qRows) {
        if (q.type !== 'mcq') continue;
        const selected = answers[q.question_id] ?? null;
        const correct = !!selected && q.correct_keys.includes(selected);
        await client.query(
          `INSERT INTO submission_answers(submission_id,question_id,question_type,selected_key,max_points,awarded_points,grading_status)
           VALUES($1,$2,'mcq',$3,$4,$5,'auto')`,
          [submission.id, q.question_id, selected, q.points, correct ? q.points : 0],
        );
      }

      // Essay rows, in the same order as before (MCQ rows first, then essays).
      for (const g of gradedEssays) {
        if (g.status === 'auto') {
          await client.query(
            `INSERT INTO submission_answers(submission_id,question_id,question_type,answer_text,max_points,awarded_points,grading_status)
             VALUES($1,$2,'essay',$3,$4,0,'auto')`,
            [submission.id, g.question_id, g.answer_text, g.points],
          );
        } else if (g.status === 'ai_graded') {
          await client.query(
            `INSERT INTO submission_answers(submission_id,question_id,question_type,answer_text,max_points,awarded_points,ai_suggested_points,ai_feedback,grading_status)
             VALUES($1,$2,'essay',$3,$4,$5,$5,$6,'ai_graded')`,
            [submission.id, g.question_id, g.answer_text, g.points, g.awarded, g.feedback],
          );
        } else {
          await client.query(
            `INSERT INTO submission_answers(submission_id,question_id,question_type,answer_text,max_points,grading_status)
             VALUES($1,$2,'essay',$3,$4,'ai_unavailable')`,
            [submission.id, g.question_id, g.answer_text, g.points],
          );
        }
      }

      const { rows: updated } = await client.query(
        `UPDATE submissions SET total_score=$2, fully_graded=$3 WHERE id=$1 RETURNING *`,
        [submission.id, total_score, reviewBacklog(essayStatuses).fully_graded],
      );

      // If this assessment is a topic's auto-generated "standard assessment"
      // (topics.generated_assessment_id), record the student's pass/fail on the
      // matching topic_completions row — this is what drives the next topic's
      // lock state in GET /topics above (score_percent >= 60 to unlock it).
      // Topic-generated assessments are always all-MCQ (see the generation
      // prompt in POST /topics/:id/complete), so total_score is already final
      // the moment this route finishes — there's no essay/ai_unavailable case
      // to wait on here the way a human-authored assessment might have.
      if (assessment.total_marks > 0) {
        const { rows: topicRows } = await client.query(
          'SELECT id FROM topics WHERE generated_assessment_id=$1', [req.params.id],
        );
        if (topicRows[0]) {
          const score_percent = Math.round((total_score / assessment.total_marks) * 10000) / 100;
          await client.query(
            `INSERT INTO topic_completions(topic_id, student_id, passed, score_percent)
             VALUES($1,$2,$3,$4)
             ON CONFLICT (topic_id, student_id) DO UPDATE SET passed=EXCLUDED.passed, score_percent=EXCLUDED.score_percent`,
            [topicRows[0].id, student_id, score_percent >= 60, score_percent],
          );
        }
      }

      return updated[0];
    });
  } catch (e) {
    if (e instanceof AlreadySubmittedError) {
      return res.status(409).json({ error: 'Assessment already submitted; previous results are preserved' });
    }
    throw e;
  }

  return res.json({ submission: updatedSubmission, auto_score });
});

// ── GET /assessments/:id/results (admin oversight only) ────────────────────────
// A student's self-assessment results with Brainee are the student's own
// business, not a teacher's — see rbac.ts. Only admin gets this oversight
// view, with the power to correct a grade Brainee clearly got wrong (see the
// /review route below).
router.get('/assessments/:id/results', requirePerm('aiResults.read'), async (req, res) => {
  const { rows: aRows } = await query('SELECT school_code FROM assessments WHERE id=$1', [req.params.id]);
  if (!aRows[0]) return res.status(404).json({ error: 'Assessment not found' });
  if (req.user!.role !== 'admin' && aRows[0].school_code !== req.user!.school_code) {
    return res.status(404).json({ error: 'Assessment not found' });
  }

  const { rows } = await query(
    `SELECT sub.id,sub.answers,sub.auto_score,sub.total_score,sub.submitted_at,sub.fully_graded,
            st.full_name AS student_name,st.class_name,
            (SELECT count(*)::int FROM submission_answers sa WHERE sa.submission_id=sub.id AND sa.grading_status IN ${PENDING_REVIEW_SQL}) AS pending_review_count
     FROM submissions sub JOIN students st ON st.id=sub.student_id
     WHERE sub.assessment_id=$1 ORDER BY st.full_name`,
    [req.params.id],
  );
  // `pending_essay_count` is the old name for this number. It used to count
  // only 'ai_unavailable'; AssessmentResultsScreen still reads it, so it is
  // kept for one release as an alias of pending_review_count (ASM-04).
  // Remove once the mobile screen reads pending_review_count.
  return res.json({ results: rows.map((r: any) => ({ ...r, pending_essay_count: r.pending_review_count })) });
});

// ── GET /assessments/:id/submissions (teacher/admin) ───────────────────────────
// Same data as /results but framed for the "essay marking inbox" screen —
// includes each submission's per-question essay answers needing attention.
// This is the query that fills the "Teacher pending marking" gap noted in
// docs/ARCHIVED_redesign-branch-NOTES.md — there was no graded/ungraded flag
// on submissions at all before this pass.
router.get('/assessments/:id/submissions', requirePerm('aiResults.read'), async (req, res) => {
  const { rows: aRows } = await query('SELECT school_code, title FROM assessments WHERE id=$1', [req.params.id]);
  if (!aRows[0]) return res.status(404).json({ error: 'Assessment not found' });
  if (req.user!.role !== 'admin' && aRows[0].school_code !== req.user!.school_code) {
    return res.status(404).json({ error: 'Assessment not found' });
  }

  const { rows } = await query(
    `SELECT sub.id AS submission_id, sub.auto_score, sub.total_score, sub.fully_graded, sub.submitted_at,
            st.full_name AS student_name, st.class_name,
            (SELECT count(*)::int FROM submission_answers sa WHERE sa.submission_id=sub.id AND sa.grading_status IN ${PENDING_REVIEW_SQL}) AS pending_review_count
     FROM submissions sub JOIN students st ON st.id=sub.student_id
     WHERE sub.assessment_id=$1 ORDER BY pending_review_count DESC, st.full_name`,
    [req.params.id],
  );
  return res.json({ assessment_title: aRows[0].title, submissions: rows });
});

// ── GET /submissions/:id/answers ────────────────────────────────────────────
// Full per-question breakdown. Teacher/admin see everything, including
// Brainee's suggested essay score/feedback before it's been reviewed.
// Students/parents only ever see a final, human-or-auto-confirmed score for
// each question — an 'ai_graded' essay answer that hasn't been reviewed yet
// shows as "Pending your teacher's review" with no numbers, so a
// provisional AI score can never be mistaken for a confirmed one.
router.get('/submissions/:id/answers', async (req, res) => {
  const user = req.user!;
  const { rows: subRows } = await query(
    `SELECT sub.*, st.user_id AS student_user_id, st.school_code, st.class_name, st.id AS student_id
     FROM submissions sub JOIN students st ON st.id=sub.student_id WHERE sub.id=$1`,
    [req.params.id],
  );
  const submission = subRows[0];
  if (!submission) return res.status(404).json({ error: 'Submission not found' });

  if (user.role === 'admin') { /* unrestricted — Brainee ↔ student grading, admin oversight only */ }
  else if (user.role === 'student') {
    if (submission.student_user_id !== user.id) return res.status(403).json({ error: 'Not your submission' });
  } else if (user.role === 'parent') {
    const { rows: pw } = await query('SELECT 1 FROM parent_wards WHERE parent_id=$1 AND student_id=$2', [user.id, submission.student_id]);
    if (!pw.length) return res.status(403).json({ error: 'Not your ward' });
  } else {
    return res.status(403).json({ error: 'Not authorized' });
  }

  // A previously submitted SS1 Catering Craft or Agricultural Science assessment may be withdrawn after a source correction.
  // Preserve the submission rows, but do not expose question/answer content to students or parents
  // once its linked assessment is no longer deliverable.
  if (user.role === 'student' || user.role === 'parent') {
    const assessmentId = submission.assessment_id;
    if (assessmentId) {
      const ss1Deliverable = await ss1AssessmentDeliverable(query, assessmentId);
      if (!ss1Deliverable.ok) return res.status(410).json({ error: ss1Deliverable.reason });
      const agriculturalScienceDeliverable = await agriculturalScienceAssessmentDeliverable(query, assessmentId);
      if (!agriculturalScienceDeliverable.ok) return res.status(410).json({ error: agriculturalScienceDeliverable.reason });
      const englishDeliverable = await englishAssessmentDeliverable(query, assessmentId);
      if (!englishDeliverable.ok) return res.status(410).json({ error: englishDeliverable.reason });
      const primary4Deliverable = await primary4AssessmentDeliverable(query, assessmentId);
      if (!primary4Deliverable.ok) return res.status(410).json({ error: primary4Deliverable.reason });
    }
  }

  const { rows: answers } = await query(
    `SELECT sa.*, q.stem
     FROM submission_answers sa JOIN questions q ON q.id = sa.question_id
     WHERE sa.submission_id=$1 ORDER BY sa.id`,
    [req.params.id],
  );

  const isStaff = user.role === 'admin';
  const shaped = answers.map((a: any) => {
    if (isStaff) return a;
    const finalized = a.grading_status === 'auto' || a.grading_status === 'teacher_reviewed';
    return {
      ...a,
      awarded_points: finalized ? a.awarded_points : null,
      ai_suggested_points: undefined,
      ai_feedback: finalized ? a.ai_feedback : null,
      pending_review: !finalized,
    };
  });

  return res.json({ submission, answers: shaped });
});

// ── PUT /submissions/:id/answers/:answerId/review (admin override only) ───────
// Confirms or overrides Brainee's essay score. Body: { awarded_points,
// feedback? }. This is the only route that can move an essay answer to
// 'teacher_reviewed' (kept as a DB/status literal for backward compatibility;
// the only human who can reach this route is admin), and the only route
// that can resolve an 'ai_unavailable' answer (Brainee failed to grade it,
// so a human must). No teacher permission maps to 'aiGrading.override' — a
// teacher must never open, view, or touch a grade Brainee gave a student.
// Admin retains this purely as an oversight/correction power, e.g. Brainee
// clearly misread a valid answer as incorrect.
router.put('/submissions/:id/answers/:answerId/review', requirePerm('aiGrading.override'), async (req, res) => {
  const { rows: check } = await query(
    `SELECT st.school_code FROM submissions sub JOIN students st ON st.id=sub.student_id WHERE sub.id=$1`,
    [req.params.id],
  );
  if (!check[0]) return res.status(404).json({ error: 'Submission not found' });
  if (req.user!.role !== 'admin' && check[0].school_code !== req.user!.school_code) {
    return res.status(404).json({ error: 'Submission not found' });
  }

  const { awarded_points, feedback } = req.body as { awarded_points: number; feedback?: string };
  if (awarded_points == null || Number.isNaN(Number(awarded_points))) {
    return res.status(400).json({ error: 'awarded_points is required' });
  }

  const { rows: ansRows } = await query(
    `UPDATE submission_answers
     SET awarded_points=$3, ai_feedback=COALESCE($4, ai_feedback), grading_status='teacher_reviewed',
         graded_by=$5, graded_at=now()
     WHERE id=$2 AND submission_id=$1 AND question_type='essay'
     RETURNING *`,
    [req.params.id, req.params.answerId, Math.max(0, Number(awarded_points)), feedback ?? null, req.user!.id],
  );
  if (!ansRows[0]) return res.status(404).json({ error: 'Essay answer not found on this submission' });

  // Recompute the submission's total from every per-question row — simplest
  // way to keep total_score consistent regardless of how many essay
  // questions this assessment has or what order they're reviewed in.
  const { rows: allAnswers } = await query(
    `SELECT awarded_points, grading_status FROM submission_answers WHERE submission_id=$1`,
    [req.params.id],
  );
  const total = allAnswers.reduce((sum: number, a: any) => sum + (a.awarded_points != null ? Number(a.awarded_points) : 0), 0);
  const { fully_graded } = reviewBacklog(allAnswers.map((a: any) => a.grading_status));

  const { rows: updatedSub } = await query(
    `UPDATE submissions SET total_score=$2, fully_graded=$3 WHERE id=$1 RETURNING *`,
    [req.params.id, total, fully_graded],
  );

  return res.json({ answer: ansRows[0], submission: updatedSub[0] });
});

export default router;
