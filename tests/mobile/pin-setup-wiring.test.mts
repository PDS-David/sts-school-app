import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  isPinRole, serverPinStateFromMe, mergePinRequirement, pinSetupRequiredFromFlags, resolveAuthPhase,
} from '../../mobile/src/api/authPhase.ts';

const read = (rel: string) => readFileSync(new URL(`../../mobile/src/${rel}`, import.meta.url), 'utf8');
const screen = read('screens/PinSetupScreen.tsx');
const navigator = read('navigation/RootNavigator.tsx');
const context = read('api/AuthContext.tsx');
const client = read('api/client.ts');

// ── Pure helpers ────────────────────────────────────────────────────────────
test('only student, parent and teacher are PIN roles', () => {
  for (const r of ['student', 'parent', 'teacher']) assert.equal(isPinRole(r), true, r);
  for (const r of ['admin', 'finance_admin', '', undefined, null, 'Student']) assert.equal(isPinRole(r), false, String(r));
});

test('server PIN state is read from /auth/me, and cached answers are never treated as the server', () => {
  assert.deepEqual(serverPinStateFromMe({ data: { must_set_pin: true } }), { reachable: true, mustSetPin: true });
  assert.deepEqual(serverPinStateFromMe({ data: { must_set_pin: false } }), { reachable: true, mustSetPin: false });
  // Offline cache hit (client.ts sets fromCache) must not clear or set the gate.
  assert.deepEqual(serverPinStateFromMe({ data: { must_set_pin: false }, fromCache: true }), { reachable: false });
  assert.deepEqual(serverPinStateFromMe({ data: {} }), { reachable: false });
  assert.deepEqual(serverPinStateFromMe({ data: { must_set_pin: 'false' } }), { reachable: false });
  assert.deepEqual(serverPinStateFromMe(null), { reachable: false });
  // So an offline restart with a known requirement stays on the setup screen.
  assert.equal(mergePinRequirement(true, serverPinStateFromMe({ data: { must_set_pin: false }, fromCache: true })), true);
});

// ── The screen has no bypass and leaks nothing ──────────────────────────────
test('the setup screen offers no skip, later or bypass option', () => {
  const visible = screen.replace(/\/\/.*$/gm, '');
  for (const word of [/\bskip\b/i, /\blater\b/i, /\bnot now\b/i, /\bremind me\b/i, /\bmaybe\b/i, /navigation\.(navigate|replace|reset)/]) {
    assert.ok(!word.test(visible), `unexpected ${word} in PinSetupScreen`);
  }
  // The only navigation allowed is leaving the VOLUNTARY screen after success.
  const back = visible.match(/navigation\.goBack\(\)/g) ?? [];
  assert.equal(back.length, 1, 'exactly one goBack');
  const at = visible.indexOf('navigation.goBack()');
  assert.ok(/if \(voluntary\)/.test(visible.slice(Math.max(0, at - 200), at)), 'goBack only inside the voluntary branch');
});

test('the setup screen never logs, stores or navigates with a secret', () => {
  assert.ok(!/console\./.test(screen), 'no console output in PinSetupScreen');
  assert.ok(!/AsyncStorage|SecureStore|setSecureItem|localStorage/.test(screen), 'no storage in PinSetupScreen');
  const code = screen.replace(/\/\/.*$/gm, '');
  assert.ok(!/initialParams/.test(code), 'no navigation params carry secrets');
  // The one param read is the boolean mode flag, never a credential.
  assert.deepEqual(code.match(/route\??\.params[^;]*/g), ['route?.params?.voluntary === true']);
  // show/hide controls exist for both the credential and the new PIN fields
  assert.ok(/Show current PIN or password/.test(screen) && /Show new PIN/.test(screen));
  assert.ok(/secureTextEntry=\{!showPins\}/.test(screen) && /secureTextEntry=\{!showCurrent\}/.test(screen));
});

test('the setup screen submits only through the context, which posts only to /auth/pin', () => {
  assert.ok(!/api\.(post|put|patch)|axios|fetch\(/.test(screen), 'screen must not call the network directly');
  assert.equal((context.match(/'\/auth\/pin'/g) ?? []).length, 1);
  assert.ok(/current_credential: currentCredential, new_pin: newPin/.test(context));
});

// ── Navigation is declarative and ordered ───────────────────────────────────
test('RootNavigator uses resolveAuthPhase and registers PinSetup before any app screen', () => {
  assert.ok(/resolveAuthPhase\(/.test(navigator));
  const order = [
    navigator.indexOf('!user ? ('),
    navigator.indexOf('mustSetPin && !user.pending_admin_review ? ('),
    navigator.indexOf(') : mustChangePw ? ('),
    navigator.indexOf(') : mustSetSecurityQuestion ? ('),
    navigator.indexOf(') : user.pending_admin_review ? ('),
    navigator.indexOf('<Stack.Screen name="App"'),
  ];
  assert.ok(order.every((i) => i >= 0), `branch markers missing: ${order}`);
  assert.deepEqual([...order].sort((a, b) => a - b), order, 'branch order must mirror resolveAuthPhase');
});

test('the PinSetup branch registers exactly one screen: no dashboard, no other route', () => {
  const start = navigator.indexOf('mustSetPin && !user.pending_admin_review ? (');
  const end = navigator.indexOf(') : mustChangePw ? (');
  const branch = navigator.slice(start, end).replace(/\/\/.*$/gm, '');
  assert.equal((branch.match(/<Stack\.Screen/g) ?? []).length, 1);
  assert.ok(branch.includes('name="PinSetup"'));
  assert.ok(!/RoleRouter|Tabs|name="App"|name="Profile"/.test(branch));
});

// ── The requirement survives restart, refresh and backgrounding ─────────────
test('AuthContext restores the hint, asks the server, and re-checks on foreground and on 403', () => {
  assert.ok(/pinGateHintFor\(await AsyncStorage\.getItem\(PIN_GATE_STORAGE_KEY\)/.test(context), 'restores the persisted hint');
  assert.ok(/mergePinRequirement\(hint, state\)/.test(context), 'server answer decides on restart');
  assert.ok(/AppState\.addEventListener\('change'/.test(context), 'foreground re-check');
  assert.ok(/onPinSetupRequired\(/.test(context), 'reacts to a 403 PIN_SETUP_REQUIRED');
  assert.ok(/serverPinStateFromMe\(/.test(context), 'ignores cached /auth/me');
});

test('the gate is set from the login response before the first authenticated render', () => {
  const setPin = context.indexOf('setMustSetPin(pinRequired);');
  const setUserCall = context.indexOf('setUser(data.user);');
  assert.ok(setPin > 0 && setUserCall > setPin, 'setMustSetPin must come before setUser in login()');
  assert.ok(/pinSetupRequiredFromFlags\(data\.user\?\.role, data\)/.test(context), 'derived from the login response flags');
});

test('the persisted hint is cleared on logout and on a forced logout, and holds no secret', () => {
  assert.ok((context.match(/removeItem\(PIN_GATE_STORAGE_KEY\)/g) ?? []).length >= 3, 'cleared on logout, forced logout and completion');
  assert.ok(/serializePinGate\(userId\)/.test(context));
  assert.ok(!/console\.(log|info|debug|warn|error)\([^)]*(pin|credential)/i.test(context.replace(/\[AuthContext\][^)]*\)/g, '')));
});

test('token refresh keeps the requirement: it is server state, never derived from the token', () => {
  // The refresh path in client.ts must not touch the PIN gate; the server re-evaluates it per request.
  const refreshBlock = client.slice(client.indexOf("axios.post(`${BASE_URL}/auth/refresh`"), client.indexOf('return api(original);'));
  assert.ok(!/must_set_pin|PIN_GATE|mustSetPin/.test(refreshBlock));
  assert.ok(/emitPinSetupRequired\(\)/.test(client));
});

// ── Network layer safety ────────────────────────────────────────────────────
test('the PIN request can never be queued in the offline outbox', () => {
  assert.ok(/url\.startsWith\('\/auth\/'\)/.test(client), '/auth/ writes are rejected, not queued');
});

test('a wrong-credential 401 from /auth/pin is excluded from refresh-and-replay', () => {
  assert.ok(/!isPinCredentialRejection\(original\.url, error\.response\.status, error\.response\.data\)/.test(client));
});

// ── Revised Prompt 2B: no first-login gate, voluntary change preserved ─────
const studentProfile = read('screens/student/StudentProfileScreen.tsx');
const parentProfile = read('screens/parent/ParentProfileScreen.tsx');
const teacherMore = read('screens/teacher/TeacherMoreScreen.tsx');

test('the client never decides the PIN requirement itself: only the server flag opens the gate', () => {
  // login() derives it solely from the server response; there is no
  // "first login" / "new device" / "legacy credential" rule on the client.
  assert.ok(/const pinRequired = pinSetupRequiredFromFlags\(data\.user\?\.role, data\);/.test(context));
  const all = [context, read('api/authPhase.ts'), read('api/pinSetup.ts'), screen, navigator].join('\n');
  const code = all.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
  assert.ok(!/first[ -]?login|newDevice|new device|legacy/i.test(code), 'no client-side first-login/legacy rule');
});

test('a user the server does not flag goes straight to the app (phase)', async () => {
  const { resolveAuthPhase } = await import('../../mobile/src/api/authPhase.ts');
  const base = { loading: false, mustChangePw: false, mustSetSecurityQuestion: false };
  assert.equal(resolveAuthPhase({ ...base, user: { pending_admin_review: false }, mustSetPin: false }), 'app');
  assert.equal(resolveAuthPhase({ ...base, user: { pending_admin_review: true }, mustSetPin: false }), 'pending-review');
  // administrator-issued temporary credential: still gated
  assert.equal(resolveAuthPhase({ ...base, user: { pending_admin_review: false }, mustSetPin: true }), 'pin-setup');
});

test('a stale "must set PIN" hint is cleared by the server once it says false', () => {
  assert.equal(mergePinRequirement(true, { reachable: true, mustSetPin: false }), false);
});

test('voluntary PIN change is a normal app screen with a back button, registered only for signed-in users in the app branch', () => {
  const appBranch = navigator.slice(navigator.indexOf('<Stack.Screen name="App"'));
  assert.ok(/name="ChangePin" component=\{PinSetupScreen\} initialParams=\{\{ voluntary: true \}\}/.test(appBranch));
  assert.ok(/name="ChangePin"[^>]*headerShown: true/.test(appBranch));
  const gate = navigator.slice(navigator.indexOf('mustSetPin && !user.pending_admin_review ? ('), navigator.indexOf(') : mustChangePw ? ('));
  assert.ok(!gate.includes('ChangePin'), 'the gate branch still registers a single screen');
});

test('student, parent and teacher Settings open the PIN screen, not the password route the server rejects for them', () => {
  for (const [name, src] of [['student', studentProfile], ['parent', parentProfile], ['teacher', teacherMore]] as const) {
    assert.ok(/label: 'Change PIN'[^\n]*navigation\.navigate\('ChangePin'\)/.test(src), `${name} entry point`);
    assert.ok(!/navigate\('ChangePassword'\)/.test(src), `${name} no longer routes to ChangePassword`);
  }
});

test('voluntary mode: no sign-out link, no temporary-credential banner, current PIN only', () => {
  assert.ok(/\{!voluntary && \(\s*<View style=\{styles\.banner\}>/.test(screen));
  assert.ok(/\{!voluntary && \(\s*<TouchableOpacity\s+onPress=\{\(\) => \{ if \(!loading\) logout\(\)/.test(screen));
  assert.ok(/confirmSetup: \(\) => \(voluntary \? Promise\.resolve\(true\) : depsRef\.current\.confirmPinSetup\(\)\)/.test(screen));
});


// ── must_change_pw is a PIN requirement for student, parent and teacher ─────
test('either flag, alone or together, requires PIN setup for PIN roles; both false never does', () => {
  for (const role of ['student', 'parent', 'teacher']) {
    assert.equal(pinSetupRequiredFromFlags(role, { must_set_pin: false, must_change_pw: false }), false, role);
    assert.equal(pinSetupRequiredFromFlags(role, { must_set_pin: true, must_change_pw: false }), true, role);
    assert.equal(pinSetupRequiredFromFlags(role, { must_set_pin: false, must_change_pw: true }), true, role);
    assert.equal(pinSetupRequiredFromFlags(role, { must_set_pin: true, must_change_pw: true }), true, role);
    assert.equal(pinSetupRequiredFromFlags(role, { must_set_pin: false, must_change_pw: false, pin_setup_required: true }), true, `${role}: server-derived flag honoured`);
    assert.equal(pinSetupRequiredFromFlags(role, {}), false, `${role}: absent flags are not a requirement`);
    assert.equal(pinSetupRequiredFromFlags(role, { must_change_pw: 'true' as any }), false, `${role}: only a real boolean counts`);
  }
  assert.equal(pinSetupRequiredFromFlags('student', null), false);
});

test('administrator roles are never sent to PIN setup, whatever flags they carry', () => {
  for (const role of ['admin', 'finance_admin', undefined, null, '']) {
    assert.equal(pinSetupRequiredFromFlags(role, { must_set_pin: true, must_change_pw: true, pin_setup_required: true }), false, String(role));
  }
});

test('/auth/me: must_change_pw alone is enough to hold the gate after restart, token refresh or foreground', () => {
  const me = (d: object) => serverPinStateFromMe({ data: d });
  assert.deepEqual(me({ must_set_pin: false, must_change_pw: true }), { reachable: true, mustSetPin: true });
  assert.deepEqual(me({ must_set_pin: true, must_change_pw: false }), { reachable: true, mustSetPin: true });
  assert.deepEqual(me({ must_set_pin: true, must_change_pw: true }), { reachable: true, mustSetPin: true });
  assert.deepEqual(me({ must_set_pin: false, must_change_pw: false }), { reachable: true, mustSetPin: false });
  assert.deepEqual(me({ must_set_pin: false, must_change_pw: false, pin_setup_required: true }), { reachable: true, mustSetPin: true });
  // A permanent PIN holder is released by the server's answer; a stale hint cannot keep them gated.
  assert.equal(mergePinRequirement(true, me({ must_set_pin: false, must_change_pw: false })), false);
  // A requirement the hint does not know about cannot be hidden by the server answering it.
  assert.equal(mergePinRequirement(false, me({ must_set_pin: false, must_change_pw: true })), true);
  // Cached /auth/me is never the server.
  assert.deepEqual(serverPinStateFromMe({ data: { must_change_pw: true }, fromCache: true }), { reachable: false });
  assert.deepEqual(serverPinStateFromMe({ data: { must_change_pw: true } }), { reachable: false }, 'no boolean answer, not treated as the server');
});

test('PIN roles reach PIN setup, never the old password screen; administrators keep their forced password change', () => {
  const user = { pending_admin_review: false };
  // After login the context derives mustSetPin from the flags and leaves mustChangePw false for PIN roles.
  assert.equal(resolveAuthPhase({ loading: false, user, mustChangePw: false, mustSetSecurityQuestion: false, mustSetPin: true }), 'pin-setup');
  assert.equal(resolveAuthPhase({ loading: false, user, mustChangePw: false, mustSetSecurityQuestion: false, mustSetPin: false }), 'app');
  // Pending still wins over the PIN gate.
  assert.equal(resolveAuthPhase({ loading: false, user: { pending_admin_review: true }, mustChangePw: false, mustSetSecurityQuestion: false, mustSetPin: true }), 'pending-review');
  // Administrator accounts: unchanged.
  assert.equal(resolveAuthPhase({ loading: false, user, mustChangePw: true, mustSetSecurityQuestion: false, mustSetPin: false }), 'change-pw');
});

test('AuthContext derives the gate from the flags and keeps PIN roles off the password-change screen', () => {
  assert.match(context, /pinSetupRequiredFromFlags\(data\.user\?\.role, data\)/, 'login derives the PIN requirement from both flags');
  assert.match(context, /const adminPwChangeRequired = !isPinRole\(data\.user\?\.role\) && !!data\.must_change_pw/, 'only non-PIN roles get the password-change screen');
  assert.match(context, /setMustChangePw\(adminPwChangeRequired\)/);
  assert.ok(!/setMustChangePw\(!!data\.must_change_pw\)/.test(context), 'the unconditional assignment is gone');
  // Restart, foreground and refresh all go through /auth/me -> serverPinStateFromMe.
  assert.match(context, /serverPinStateFromMe\(res as any\)/);
  assert.match(context, /serverPinStateFromMe\(meRes\)/);
  // A 403 PIN_SETUP_REQUIRED (e.g. after a token refresh) re-engages the gate.
  assert.match(client, /isPinSetupRequiredResponse/);
});
