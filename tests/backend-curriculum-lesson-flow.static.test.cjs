const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

test('canonical topic lesson generation is separate from completion and assessment creation', () => {
  const route = read('backend/src/routes/learning.ts');
  const start = route.indexOf("router.post('/topics/:id/lesson'");
  const end = route.indexOf("router.post('/topics/:id/progress'", start);
  assert.ok(start >= 0 && end > start, 'dedicated lesson and progress endpoints exist');
  const lessonRoute = route.slice(start, end);
  assert.match(lessonRoute, /requireRole\('student'\)/);
  assert.match(lessonRoute, /getOrGenerateCurriculumLesson/);
  assert.match(lessonRoute, /curriculum_learning_objectives/);
  assert.match(lessonRoute, /resolveSequenceGroup\(siblingRows, new Set\(passRows\.map\(\(r: any\) => r\.topic_id\)\), pinOk\)/);
  assert.doesNotMatch(lessonRoute, /INSERT INTO topic_completions/i);
  assert.doesNotMatch(lessonRoute, /INSERT INTO assessments/i);
  assert.doesNotMatch(lessonRoute, /INSERT INTO questions/i);
});

test('progress endpoint records completion without triggering lesson generation', () => {
  const route = read('backend/src/routes/learning.ts');
  const start = route.indexOf("router.post('/topics/:id/progress'");
  const end = route.indexOf("router.post('/topics/:id/complete'", start);
  assert.ok(start >= 0 && end > start);
  const progressRoute = route.slice(start, end);
  assert.match(progressRoute, /INSERT INTO topic_completions/);
  assert.match(progressRoute, /studentTopicSequenceLocked/);
  assert.doesNotMatch(progressRoute, /getOrGenerateCurriculumLesson|generateCurriculumLesson/);
});

test('student topic screen requests the AI lesson first and records completion separately', () => {
  const screen = read('mobile/src/screens/TopicDetailScreen.tsx');
  assert.match(screen, /\/learning\/topics\/\$\{topic\.id\}\/lesson/);
  assert.match(screen, /\/learning\/topics\/\$\{topic\.id\}\/progress/);
  assert.doesNotMatch(screen, /\/learning\/topics\/\$\{topic\.id\}\/complete/);
  assert.match(screen, /generatedLesson\.sections\.map/);
  assert.match(screen, /setPractice\(data\.lesson\.practice_questions \?\? \[\]\)/);
});

test('SS1 and SS2/SS3 package screens consume AI-generated lesson endpoints', () => {
  const ss1 = read('mobile/src/screens/Ss1PackageLessonScreen.tsx');
  const ss23 = read('mobile/src/screens/Ss23PackageLessonScreen.tsx');
  assert.match(ss1, /\/learning\/ss1\/lessons\/\$\{encodeURIComponent\(lesson\.id\)\}\/generate/);
  assert.match(ss23, /\/learning\/ss23\/units\/\$\{encodeURIComponent\(lesson\.id\)\}\/generate/);
  assert.match(ss1, /generatedLesson\.practice_questions/);
  assert.match(ss23, /generatedLesson\.practice_questions/);
  assert.match(ss23, /SS3 examination preparation only/);
});

test('lesson cache is additive and isolated from formal assessment tables', () => {
  const migration = read('backend/migrations/0007_curriculum_generated_lessons.sql');
  const schema = read('backend/schema.sql');
  const cache = read('backend/src/services/curriculumLessonCache.ts');
  assert.match(migration, /CREATE TABLE IF NOT EXISTS public\.curriculum_generated_lessons/);
  assert.match(schema, /CREATE TABLE IF NOT EXISTS curriculum_generated_lessons/);
  assert.match(cache, /context_sha256/);
  assert.match(cache, /validateCurriculumLesson/);
  assert.match(cache, /42P01/);
});

test('all curriculum lesson generation endpoints enforce a shared per-account HTTP rate limit', () => {
  const route = read('backend/src/routes/learning.ts');
  assert.match(route, /createRedisRateLimitStore\('curriculum-lesson-http'\)/);
  assert.match(route, /const curriculumLessonLimiter = rateLimit\(/);
  assert.match(route, /router\.post\('\/topics\/:id\/lesson', curriculumLessonLimiter,/);
  assert.match(route, /router\.post\('\/ss1\/lessons\/:lessonId\/generate', curriculumLessonLimiter,/);
  assert.match(route, /router\.post\('\/ss23\/units\/:unitId\/generate', curriculumLessonLimiter,/);
});

test('SS1 student lesson endpoints use a safe projection instead of serializing teacher answer keys', () => {
  const route = read('backend/src/routes/learning.ts');
  const delivery = read('backend/src/db/ss1/studentDelivery.ts');
  assert.match(route, /safeStudentSs1Lesson\(lesson\)/);
  assert.match(delivery, /export function safeStudentSs1Lesson/);
  const start = delivery.indexOf('export function safeStudentSs1Lesson');
  const end = delivery.indexOf('export function getStudentSs1Lesson', start);
  const projection = delivery.slice(start, end);
  assert.doesNotMatch(projection, /practice:|state:|body_sha256:/);
});

test('global learning access policy is persisted, global-admin-only and audited', () => {
  const admin = read('backend/src/routes/admin.ts');
  const auth = read('backend/src/middleware/auth.ts');
  const migration = read('backend/migrations/0008_learning_access_settings.sql');
  const schema = read('backend/schema.sql');
  assert.match(admin, /router\.get\('\/learning-access-settings', requireGlobalAdmin/);
  assert.match(admin, /router\.put\('\/learning-access-settings', requireGlobalAdmin/);
  assert.match(admin, /auditInTransaction\(/);
  assert.match(admin, /Object\.keys\(body\)\.some\(key => !keys\.includes\(key\)\)/);
  assert.match(auth, /FROM public\.learning_access_settings WHERE id=1/);
  assert.match(auth, /error\?\.code === '42P01'/);
  assert.match(migration, /free_launch_mode\s+BOOLEAN NOT NULL DEFAULT TRUE/);
  assert.match(migration, /term_pin_enforced\s+BOOLEAN NOT NULL DEFAULT FALSE/);
  assert.match(migration, /curriculum_sequence_enforced\s+BOOLEAN NOT NULL DEFAULT FALSE/);
  assert.match(schema, /CREATE TABLE IF NOT EXISTS public\.learning_access_settings/);
  assert.match(read('backend/src/routes/learning.ts'), /curriculumSequenceEnforced\(req\.learningAccessPolicy\)/);
  assert.match(read('backend/src/routes/learning.ts'), /termPinEnforced\(req\.learningAccessPolicy\)/);
});

test('global administrators can manage learning access from the admin app while school admins cannot', () => {
  const screen = read('mobile/src/screens/admin/AdminLearningAccessScreen.tsx');
  const menu = read('mobile/src/screens/admin/AdminMoreScreen.tsx');
  const nav = read('mobile/src/navigation/AdminTabs.tsx');
  assert.match(screen, /\/admin\/learning-access-settings/);
  assert.match(screen, /free_launch_mode/);
  assert.match(screen, /term_pin_enforced/);
  assert.match(screen, /curriculum_sequence_enforced/);
  assert.match(menu, /user\?\.school_code === null/);
  assert.match(menu, /navigation\.navigate\('AdminLearningAccess'\)/);
  assert.match(nav, /name="AdminLearningAccess"/);
});

test('SS1 and SS2/SS3 package lessons persist student completion separately from canonical topics', () => {
  const route = read('backend/src/routes/learning.ts');
  const migration = read('backend/migrations/0009_student_curriculum_lesson_progress.sql');
  const ss1 = read('mobile/src/screens/Ss1PackageLessonScreen.tsx');
  const ss23 = read('mobile/src/screens/Ss23PackageLessonScreen.tsx');
  assert.ok(route.includes("router.post('/ss1/lessons/:lessonId/progress'"));
  assert.ok(route.includes("router.post('/ss23/units/:unitId/progress'"));
  assert.match(route, /completedPackageLessonKeys\(/);
  assert.match(route, /markPackageLessonCompleted\(/);
  assert.match(route, /contentFingerprint = lesson\.body_sha256/);
  assert.match(route, /contentFingerprint = unit\.body_sha256/);
  assert.match(migration, /PRIMARY KEY \(student_id, lesson_key\)/);
  assert.match(migration, /REFERENCES public\.students\(id\) ON DELETE CASCADE/);
  assert.match(ss1, /\/learning\/ss1\/lessons\/\$\{encodeURIComponent\(lesson\.id\)\}\/progress/);
  assert.match(ss23, /\/learning\/ss23\/units\/\$\{encodeURIComponent\(lesson\.id\)\}\/progress/);
  assert.match(ss1, /Mark lesson complete/);
  assert.match(ss23, /Mark lesson complete/);
  const list = read('mobile/src/screens/SubjectTopicsScreen.tsx');
  assert.match(list, /lesson\.completed \? 'checkmark-circle'/);
  assert.match(list, /lesson\.completed \? ' · Completed' : ''/);
  assert.match(ss1, /if \(lesson\.locked\)/);
  assert.match(ss1, /navigation\.navigate\('TermPinRedeem'\)/);
});
