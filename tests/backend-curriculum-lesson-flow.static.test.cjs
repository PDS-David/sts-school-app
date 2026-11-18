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
