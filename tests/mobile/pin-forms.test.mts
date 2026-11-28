// Mobile contract tests for the single six-digit teacher/student PIN experience.
// Pure helpers are exercised directly; screen wiring is checked against source
// (the screens import React Native, which cannot load under node:test).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  validateNewPinPair, validateActivationSecret, activationBody, sanitizePin,
  ADMIN_PASSWORD_LENGTH_MESSAGE, PASSWORD_MISMATCH_MESSAGE, PIN_ROLES,
} from '../../mobile/src/api/pinForms.ts';
import { PIN_FORMAT_MESSAGE, PIN_TRIVIAL_MESSAGE, PIN_MISMATCH_MESSAGE, checkPin } from '../../mobile/src/api/pinSetup.ts';
import { isPinRole } from '../../mobile/src/api/authPhase.ts';

const src = (rel: string) => readFileSync(new URL(`../../mobile/src/${rel}`, import.meta.url), 'utf8');

// ── Policy helpers ───────────────────────────────────────────────────────────

test('accepts 123456 and other sequential six-digit PINs', () => {
  for (const pin of ['123456', '234567', '654321', '012345', '482913']) {
    assert.equal(validateNewPinPair(pin, pin), null, pin);
    assert.deepEqual(checkPin(pin), { ok: true }, pin);
  }
});

test('rejects 000000, 111111 and every other repeated-digit PIN', () => {
  for (let d = 0; d <= 9; d++) {
    const pin = String(d).repeat(6);
    assert.equal(validateNewPinPair(pin, pin), PIN_TRIVIAL_MESSAGE, pin);
  }
});

test('rejects five-digit, seven-digit, letters and non-numeric input', () => {
  for (const pin of ['12345', '1234567', 'abcdef', '12a456', '12-456', '12 456', '１２３４５６', '']) {
    assert.equal(validateNewPinPair(pin, pin), PIN_FORMAT_MESSAGE, pin);
  }
  assert.equal(validateNewPinPair('482913', '482914'), PIN_MISMATCH_MESSAGE);
  assert.equal(sanitizePin('4a8-2 9139'), '482913', 'typing is filtered to six digits');
});

test('PIN roles are exactly student, parent and teacher; administrators never use the PIN rule', () => {
  assert.deepEqual([...PIN_ROLES], ['student', 'parent', 'teacher']);
  for (const r of PIN_ROLES) assert.equal(isPinRole(r), true);
  for (const r of ['admin', 'finance_admin', undefined, null]) assert.equal(isPinRole(r), false);
});

test('activation: PIN mode uses the PIN rule and sends new_pin; admin mode keeps the 8+ character password', () => {
  assert.equal(validateActivationSecret('pin', '123456', '123456'), null);
  assert.equal(validateActivationSecret('pin', '111111', '111111'), PIN_TRIVIAL_MESSAGE);
  assert.equal(validateActivationSecret('pin', 'LongPassword1', 'LongPassword1'), PIN_FORMAT_MESSAGE);
  assert.equal(validateActivationSecret('password', '123456', '123456'), ADMIN_PASSWORD_LENGTH_MESSAGE);
  assert.equal(validateActivationSecret('password', 'Strong-Passw0rd', 'Strong-Passw0rd!'), PASSWORD_MISMATCH_MESSAGE);
  assert.equal(validateActivationSecret('password', 'Strong-Passw0rd', 'Strong-Passw0rd'), null);
  assert.deepEqual(activationBody('pin', ' amaka ', ' 123 ', '123456'), { username: 'amaka', activation_code: '123', new_pin: '123456' });
  assert.deepEqual(activationBody('password', 'admin1', '9', 'Strong-Passw0rd'), { username: 'admin1', activation_code: '9', new_password: 'Strong-Passw0rd' });
});

// ── Screen wiring (source contracts) ────────────────────────────────────────

test('the obsolete four-digit teacher PIN experience is gone from every screen', () => {
  for (const file of ['screens/ChangePasswordScreen.tsx', 'screens/AdminUsersScreen.tsx', 'screens/LoginScreen.tsx', 'screens/PinSetupScreen.tsx']) {
    const s = src(file);
    assert.doesNotMatch(s, /\\d\{4\}/, `${file}: four-digit regex`);
    assert.doesNotMatch(s, /four[- ]digit|4[- ]digit|slice\(0, 4\)/i, `${file}: four-digit copy or input cap`);
  }
});

test('admin teacher creation validates the temporary PIN with the shared six-digit rule', () => {
  const s = src('screens/AdminUsersScreen.tsx');
  assert.match(s, /form\.role === 'teacher' && !checkPin\(form\.initial_password\)\.ok/);
  assert.match(s, /label="Temporary six-digit PIN"/);
  assert.match(s, /initial_password: sanitizePin\(v\)/);
  // Reset dialog treats every PIN role the same and shows the temporary PIN.
  assert.match(s, /isPinRole\(u\.role\) \? 'Reset PIN' : 'Reset Password'/);
  assert.match(s, /data\?\.temporary_pin \?\? data\?\.temporary_password/);
});

test('ChangePasswordScreen never runs the administrator flow for a teacher, student or parent', () => {
  const s = src('screens/ChangePasswordScreen.tsx');
  assert.match(s, /if \(isPinRole\(user\?\.role\)\) \{\s*return <PinSetupScreen/);
  assert.match(s, /voluntary: true/);
  assert.match(s, /newPw\.length < 8/, 'administrator password rule unchanged');
});

test('teacher, student and parent tab stacks no longer register the administrator ChangePassword screen', () => {
  for (const file of ['navigation/TeacherTabs.tsx', 'navigation/StudentTabs.tsx', 'navigation/ParentTabs.tsx']) {
    assert.doesNotMatch(src(file), /ChangePassword/, file);
  }
  const teacherTabs = src('navigation/TeacherTabs.tsx');
  assert.match(teacherTabs, /name="ChangePin" component=\{PinSetupScreen\}/, 'teacher PIN route is registered');
  assert.match(src('screens/teacher/TeacherMoreScreen.tsx'), /navigate\('ChangePin', \{ voluntary: true \}\)/, 'teacher opens voluntary PIN change, not forced setup');
  for (const file of ['navigation/AdminTabs.tsx', 'navigation/FinanceAdminTabs.tsx']) {
    assert.match(src(file), /name="ChangePassword" component=\{ChangePasswordScreen\}/, `${file} keeps the admin password screen`);
  }
});

test('student/teacher onboarding screens collect a six-digit PIN with the shared validator', () => {
  const claim = src('screens/StudentSelfClaimScreen.tsx');
  assert.match(claim, /validateNewPinPair\(newPw, conf\)/);
  assert.match(claim, /new_pin: newPw/);
  assert.doesNotMatch(claim, /at least 8 characters/i);

  const reg = src('screens/SelfRegisterScreen.tsx');
  assert.match(reg, /validateNewPinPair\(password, confirm\)/);
  assert.match(reg, /pin: password,/);
  assert.doesNotMatch(reg, /at least 8 characters/i);

  const act = src('screens/ActivateAccountScreen.tsx');
  assert.match(act, /validateActivationSecret\(mode, newPw, conf\)/);
  assert.match(act, /activationBody\(mode, username, code, newPw\)/);
  assert.match(act, /useState<ActivationMode>\('pin'\)/, 'PIN is the default');
  assert.match(act, /students\/parents\/teachers/, 'activation copy includes teachers as PIN users');
  assert.doesNotMatch(act, /Only administrators should choose|Admin password|Six-digit PIN.*variant=/, 'ordinary users are not shown a credential-mode selector');
  assert.match(act, /onLongPress=\{\(\) => \{ setMode\('password'\)/, 'administrator password activation is available through the discreet title gesture');
  assert.match(act, /delayLongPress=\{1800\}/, 'hidden activation requires a deliberate long press');
});

test('PIN setup copy matches the policy (no "avoid sequential" advice)', () => {
  const s = src('screens/PinSetupScreen.tsx');
  assert.doesNotMatch(s, /sequential/i);
  assert.match(s, /except the same digit six times/);
});
