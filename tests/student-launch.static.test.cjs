// Run: node --test tests/student-launch.static.test.cjs
// Source-level regression checks only; not a substitute for API/device tests.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const read = p => fs.readFileSync(path.join(root,p),'utf8');
test('results screen hooks are all declared before conditional loading/error returns', () => {
  const s = read('mobile/src/screens/MyResultsScreen.tsx');
  const hook = s.indexOf('const [pdfBusy, setPdfBusy] = useState');
  assert.ok(hook >= 0 && hook < s.indexOf('if (loading) return') && hook < s.indexOf('if (error)'));
});
test('PIN enforcement is explicitly opt-in, preserving free launch access', () => {
  const s = read('backend/src/routes/learning.ts');
  assert.match(s, /TERM_PIN_ENFORCED === 'true'/);
  assert.match(s, /termPinEnforced && !redeemedTermLabels\.has/);
  assert.match(s, /termPinEnforced && !pinRows\[0\]/);
});
test('cached notes do not hide practice retrieval action', () => {
  const s = read('mobile/src/screens/TopicDetailScreen.tsx');
  assert.match(s, /Get Practice Questions/);
  assert.match(s, /onPress=\{complete\}/);
});
test('submitted assessments cannot overwrite existing grades', () => {
  const s = read('backend/src/routes/learning.ts');
  assert.match(s, /ON CONFLICT\(assessment_id,student_id\) DO NOTHING/);
  assert.match(s, /status\(409\)/);
});
test('invalid assessment answer bodies are rejected', () => {
  const s = read('backend/src/routes/learning.ts');
  assert.match(s, /Array\.isArray\(answers\)/);
  assert.match(s, /status\(400\)/);
});
test('unknown question types are rejected before marking', () => {
  const s = read('backend/src/routes/learning.ts');
  assert.match(s, /\['mcq', 'essay'\]\.includes\(q\.type\)/);
  assert.match(s, /status\(422\)/);
});
