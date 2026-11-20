import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { isPinRole, serverPinStateFromMe, mergePinRequirement } from '../../mobile/src/api/authPhase.ts';

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
  for (const word of [/\bskip\b/i, /\blater\b/i, /\bnot now\b/i, /\bremind me\b/i, /\bmaybe\b/i, /navigation\.(navigate|replace|reset|goBack)/]) {
    assert.ok(!word.test(visible), `unexpected ${word} in PinSetupScreen`);
  }
});

test('the setup screen never logs, stores or navigates with a secret', () => {
  assert.ok(!/console\./.test(screen), 'no console output in PinSetupScreen');
  assert.ok(!/AsyncStorage|SecureStore|setSecureItem|localStorage/.test(screen), 'no storage in PinSetupScreen');
  assert.ok(!/initialParams|route\.params|navigation\./.test(screen.replace(/\/\/.*$/gm, '')), 'no navigation params carry secrets');
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
  assert.ok(/data\.must_set_pin === true/.test(context));
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
