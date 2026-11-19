import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('class practice is isolated from physical reporting tables', async () => {
  const migration = await readFile(new URL('../backend/migrations/0013_ai_class_practice.sql', import.meta.url),'utf8');
  const route = await readFile(new URL('../backend/src/routes/classPractice.ts', import.meta.url),'utf8');
  for (const table of ['class_practice_sets','class_practice_attempts','class_practice_concept_performance','class_practice_remediation_recommendations']) {
    assert.match(migration,new RegExp('CREATE TABLE IF NOT EXISTS '+table));
  }
  const executableMigration = migration.replace(/--.*$/gm, '');
  assert.doesNotMatch(executableMigration,/\b(scores|attendance|report_remarks)\b/i);
  assert.doesNotMatch(route,/\b(?:FROM|JOIN|INTO|UPDATE|TABLE)\s+(?:public\.)?(?:scores|attendance|teacher_remarks|report_remarks|report_cards)\b/i);
  assert.match(route,/JOIN topic_completions tc ON tc\.topic_id=t\.id AND tc\.student_id=\$1/);
});

test('practice generator validates generated concepts against completed lesson objectives', async () => {
  const route = await readFile(new URL('../backend/src/routes/classPractice.ts', import.meta.url),'utf8');
  assert.match(route,/allowedConcepts/);
  assert.match(route,/allowed\.has\(clean\(raw\.concept\)\)/);
  assert.match(route,/STRICT GROUNDING/);
  assert.match(route,/weakConcepts/);
});

test('submissions persist attempts, concept accuracy and remediation separately', async () => {
  const route = await readFile(new URL('../backend/src/routes/classPractice.ts', import.meta.url),'utf8');
  assert.match(route,/INSERT INTO class_practice_attempts/);
  assert.match(route,/INSERT INTO class_practice_concept_performance/);
  assert.match(route,/INSERT INTO class_practice_remediation_recommendations/);
  assert.match(route,/accuracy < 0\.7/);
});

test('submission row lock and writes share one database transaction', async () => {
  const route = await readFile(new URL('../backend/src/routes/classPractice.ts', import.meta.url),'utf8');
  const submitHandler = route.slice(route.indexOf("router.post('/sets/:id/submit'"), route.indexOf("router.get('/progress'"));
  assert.match(submitHandler,/withTransaction\(async client =>/);
  assert.match(submitHandler,/client\.query\(\s*'SELECT \* FROM class_practice_sets WHERE id=\$1 AND student_id=\$2 FOR UPDATE'/);
  assert.doesNotMatch(submitHandler,/await query\(\s*'SELECT \* FROM class_practice_sets WHERE id=\$1 AND student_id=\$2 FOR UPDATE'/);
});

test('student adaptive practice UI is reachable only from a completed lesson and calls the owned practice API', async () => {
  const screen = await readFile(new URL('../mobile/src/screens/student/ClassPracticeScreen.tsx', import.meta.url), 'utf8');
  const topic = await readFile(new URL('../mobile/src/screens/TopicDetailScreen.tsx', import.meta.url), 'utf8');
  const navigation = await readFile(new URL('../mobile/src/navigation/StudentTabs.tsx', import.meta.url), 'utf8');
  assert.match(screen, /api\.post\('\/class-practice\/sets'/);
  assert.match(screen, /api\.post\('\/class-practice\/sets\/'\+submittedSetId\+'\/submit'/);
  assert.match(screen, /api\.get\('\/class-practice\/progress'/);
  assert.match(screen, /api\.get\('\/class-practice\/sets\/'\+submittedSetId\)/);
  assert.match(screen, /topicIdRef/);
  assert.match(screen, /queuedOffline/);
  assert.match(topic, /completed \? \(/);
  assert.match(topic, /screen: 'ClassPractice'/);
  assert.match(navigation, /name="ClassPractice" component=\{ClassPracticeScreen\}/);
});
