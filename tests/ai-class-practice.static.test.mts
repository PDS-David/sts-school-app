import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('class practice is isolated from physical reporting tables', async () => {
  const migration = await readFile(new URL('../backend/migrations/0013_ai_class_practice.sql', import.meta.url),'utf8');
  const route = await readFile(new URL('../backend/src/routes/classPractice.ts', import.meta.url),'utf8');
  for (const table of ['class_practice_sets','class_practice_attempts','class_practice_concept_performance','class_practice_remediation_recommendations']) {
    assert.match(migration,new RegExp('CREATE TABLE IF NOT EXISTS '+table));
  }
  assert.doesNotMatch(migration,/\b(scores|attendance|report_remarks)\b/i);
  assert.doesNotMatch(route,/\b(scores|attendance|teacher_remark|report_remarks)\b/i);
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
