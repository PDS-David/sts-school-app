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
  // Task 05: read per request and shared by the list and the direct guard through resolveSequenceGroup(..., pinOk).
  assert.match(s, /const termPinEnforced = \(\) => process\.env\.TERM_PIN_ENFORCED === 'true'/);
  assert.match(s, /!termPinEnforced\(\) \|\| redeemedTermLabels\.has/);
  assert.match(s, /!termPinEnforced\(\) \|\| !!pinRows\[0\]/);
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

test('SS1 French dialogue topic routes through its lesson into the listening activity', () => {
  const topics = read('mobile/src/screens/SubjectTopicsScreen.tsx');
  const detail = read('mobile/src/screens/TopicDetailScreen.tsx');
  assert.match(topics, /openListening: String\(subjectName\)\.toLowerCase\(\)\.includes\('french'\)/);
  assert.match(topics, /\/dialo\(\?:gue\|que\)\/i\.test/);
  assert.match(detail, /if \(openListening && !routedToListening\.current\)/);
  assert.match(detail, /navigation\.navigate\('FrenchListening'/);
});
test('SS1 French approved replacement lessons are delivered through the student lesson route', () => {
  const route = read('backend/src/routes/learning.ts');
  const adapter = read('backend/src/utils/ss1FrenchDeliveryCorrection.ts');
  assert.match(route, /resolveSs1FrenchDelivery\(topic\)/);
  assert.match(route, /retireStaleSs1FrenchCache\(query, topic\.id, frenchDelivery\)/);
  assert.match(adapter, /package_status !== 'IMPLEMENTED'/);
  assert.match(adapter, /content_approval !== 'APPROVED'/);
  assert.match(adapter, /sourceHash !== replacement\.sourceHash/);
  assert.match(adapter, /PRACTICE QUESTIONS AND MARKING GUIDE/);
});

test('French listening activity speaks the lesson dialogue and provides transcript and comprehension', () => {
  const screen = read('mobile/src/screens/FrenchListeningScreen.tsx');
  const pkg = read('mobile/package.json');
  assert.match(screen, /Speech\.speak\(/);
  assert.match(screen, /language: 'fr-FR'/);
  assert.match(screen, /Speech\.getAvailableVoicesAsync\(\)/);
  assert.match(screen, /Speech\.stop\(\)/);
  const content = read('mobile/src/data/frenchListening.ts');
  assert.match(screen, /FRENCH_DIALOGUE as DIALOGUE/);
  assert.match(screen, /FRENCH_LISTENING_QUESTIONS as QUESTIONS/);
  assert.match(screen, /gradeFrenchListeningAnswers\(selectedAnswers\)/);
  assert.match(content, /export const FRENCH_DIALOGUE/);
  assert.match(content, /export const FRENCH_LISTENING_QUESTIONS/);
  assert.match(screen, /Dialogue transcript/);
  assert.match(screen, /Compréhension orale/);
  assert.match(pkg, /"expo-speech": "~56\.0\.3"/);
});

test('French listening screen plays the two committed offline dialogue recordings', () => {
  const screen = read('mobile/src/screens/FrenchListeningScreen.tsx');
  const pkg = read('mobile/package.json');
  assert.match(screen, /from 'expo-audio'/);
  assert.match(screen, /useAudioPlayer\(STANDARD_AUDIO\)/);
  assert.match(screen, /useAudioPlayer\(SLOW_AUDIO\)/);
  assert.match(screen, /SS1_French_Dialogue_standard\.mp3/);
  assert.match(screen, /SS1_French_Dialogue_slow\.mp3/);
  assert.match(pkg, /"expo-audio": "~56\.0\.13"/);
  for (const asset of [
    'mobile/assets/french/SS1_French_Dialogue_standard.mp3',
    'mobile/assets/french/SS1_French_Dialogue_slow.mp3',
  ]) {
    assert.ok(fs.statSync(path.join(root, asset)).size > 10000, asset + ' must be a real audio asset');
  }
});
