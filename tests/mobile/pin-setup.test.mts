import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import {
  checkPin, isTrivialPin, validatePinSetupForm, pinSetupFailure, isPinCredentialRejection,
  createPinSetupSubmitter, sanitizePin,
  PIN_FORMAT_MESSAGE, PIN_TRIVIAL_MESSAGE, PIN_MISMATCH_MESSAGE, PIN_SAME_AS_CURRENT_MESSAGE,
  PIN_NETWORK_MESSAGE, PIN_CREDENTIAL_REJECTED_MESSAGE, CURRENT_CREDENTIAL_REQUIRED_MESSAGE,
} from '../../mobile/src/api/pinSetup.ts';
import {
  resolveAuthPhase, serializePinGate, parsePinGate, pinGateHintFor, mergePinRequirement,
  isPinSetupRequiredResponse, PIN_GATE_STORAGE_KEY,
} from '../../mobile/src/api/authPhase.ts';

const GOOD = { current: 'Temp-Pass-9', pin: '493021', confirm: '493021' };
const axiosError = (status: number, data: unknown) => ({ response: { status, data } });

// ── Backend parity ──────────────────────────────────────────────────────────
// Compile the backend's real checkPin/isTrivialPin and compare against the
// client mirror, so the two cannot drift silently.
function loadBackendPinRules() {
  const src = readFileSync(new URL('../../backend/src/utils/pin.ts', import.meta.url), 'utf8');
  const start = src.indexOf('const EXPLICIT_WEAK');
  const end = src.indexOf('// ── Hashing');
  assert.ok(start > 0 && end > start, 'could not locate PIN rules in backend/src/utils/pin.ts');
  const require = createRequire(import.meta.url);
  const ts = require('typescript');
  const js = ts.transpileModule(
    src.slice(start, end).replace(/export /g, '') + '\nreturn { checkPin, isTrivialPin };',
    { compilerOptions: { target: ts.ScriptTarget.ES2020 } },
  ).outputText;
  return new Function(js)() as { checkPin: (p: unknown) => any; isTrivialPin: (p: string) => boolean };
}

test('client PIN rules match the backend for every six-digit value', () => {
  const backend = loadBackendPinRules();
  for (let n = 0; n < 1_000_000; n++) {
    const pin = String(n).padStart(6, '0');
    if (isTrivialPin(pin) !== backend.isTrivialPin(pin)) assert.fail(`trivial mismatch for ${pin}`);
  }
  for (const input of ['', '12345', '1234567', 'abcdef', '12 456', '１２３４５６', 123456, null, undefined, '493021', '123456']) {
    assert.deepEqual(checkPin(input), backend.checkPin(input), `checkPin mismatch for ${String(input)}`);
  }
});

test('client messages for the contract match the backend text', () => {
  const route = readFileSync(new URL('../../backend/src/routes/auth.ts', import.meta.url), 'utf8');
  assert.ok(route.includes(PIN_CREDENTIAL_REJECTED_MESSAGE), 'backend wrong-credential message changed');
  assert.ok(route.includes(CURRENT_CREDENTIAL_REQUIRED_MESSAGE), 'backend missing-credential message changed');
  assert.ok(route.includes(PIN_SAME_AS_CURRENT_MESSAGE), 'backend same-PIN message changed');
  const pinSrc = readFileSync(new URL('../../backend/src/utils/pin.ts', import.meta.url), 'utf8');
  assert.ok(pinSrc.includes(PIN_FORMAT_MESSAGE) && pinSrc.includes(PIN_TRIVIAL_MESSAGE));
});

// ── Validation ──────────────────────────────────────────────────────────────
test('a valid six-digit PIN passes', () => {
  assert.equal(validatePinSetupForm(GOOD), null);
});

test('PINs shorter or longer than six digits are rejected', () => {
  for (const pin of ['', '1', '49302', '4930211', '49302112345']) {
    const err = validatePinSetupForm({ ...GOOD, pin, confirm: pin });
    assert.equal(err?.field, 'pin', `expected rejection for "${pin}"`);
    assert.equal(err?.message, PIN_FORMAT_MESSAGE);
  }
});

test('non-numeric input is rejected, and typing is filtered to digits', () => {
  for (const pin of ['49302a', 'abcdef', '49 302', '49-302', '４９３０２１']) {
    assert.equal(validatePinSetupForm({ ...GOOD, pin, confirm: pin })?.message, PIN_FORMAT_MESSAGE, pin);
  }
  assert.equal(sanitizePin('49a3-02 1999'), '493021');
});

test('weak or prohibited PINs are rejected with an explanation', () => {
  for (const pin of ['000000', '111111', '123456', '654321', '890123', '121212', '123123', '123321', '112233', '159753', '010203']) {
    const err = validatePinSetupForm({ ...GOOD, pin, confirm: pin });
    assert.equal(err?.field, 'pin', pin);
    assert.equal(err?.message, PIN_TRIVIAL_MESSAGE, pin);
  }
});

test('confirmation mismatch is rejected', () => {
  const err = validatePinSetupForm({ ...GOOD, confirm: '493022' });
  assert.deepEqual(err, { field: 'confirm', message: PIN_MISMATCH_MESSAGE });
});

test('current credential is required, and is not trimmed or digit-filtered', () => {
  assert.equal(validatePinSetupForm({ ...GOOD, current: '' })?.field, 'current');
  assert.equal(validatePinSetupForm({ ...GOOD, current: 'x'.repeat(129) })?.field, 'current');
  assert.equal(validatePinSetupForm({ ...GOOD, current: ' Mixed Case Password! ' }), null);
});

test('the new PIN must differ from the current credential', () => {
  const err = validatePinSetupForm({ current: '493021', pin: '493021', confirm: '493021' });
  assert.deepEqual(err, { field: 'pin', message: PIN_SAME_AS_CURRENT_MESSAGE });
});

// ── Submission ──────────────────────────────────────────────────────────────
test('successful setup posts exactly the contract body, then confirms with the server', async () => {
  const calls: any[] = [];
  const s = createPinSetupSubmitter({
    postPin: async (b) => { calls.push(b); },
    confirmSetup: async () => true,
  });
  const r = await s.submit(GOOD);
  assert.deepEqual(r, { status: 'saved', confirmed: true });
  assert.deepEqual(calls, [{ current_credential: 'Temp-Pass-9', new_pin: '493021' }]);
});

test('invalid input never reaches the network', async () => {
  let posts = 0;
  const s = createPinSetupSubmitter({ postPin: async () => { posts++; }, confirmSetup: async () => true });
  assert.equal((await s.submit({ ...GOOD, confirm: '000001' })).status, 'invalid');
  assert.equal((await s.submit({ ...GOOD, pin: '123456', confirm: '123456' })).status, 'invalid');
  assert.equal(posts, 0);
});

test('a second submit while one is in flight is refused (no duplicate request)', async () => {
  let posts = 0;
  let release!: () => void;
  const gate = new Promise<void>((r) => { release = r; });
  const s = createPinSetupSubmitter({
    postPin: async () => { posts++; await gate; },
    confirmSetup: async () => true,
  });
  const first = s.submit(GOOD);
  assert.equal(s.busy, true);
  assert.deepEqual(await s.submit(GOOD), { status: 'busy' });
  release();
  assert.equal((await first).status, 'saved');
  assert.equal(posts, 1);
  assert.equal(s.busy, false);
});

test('backend rejection is explained and leaves the user free to retry', async () => {
  const s = createPinSetupSubmitter({
    postPin: async () => { throw axiosError(400, { error: PIN_TRIVIAL_MESSAGE }); },
    confirmSetup: async () => true,
  });
  assert.deepEqual(await s.submit(GOOD), { status: 'failed', kind: 'policy', message: PIN_TRIVIAL_MESSAGE });
  assert.equal(s.busy, false);

  const wrong = createPinSetupSubmitter({
    postPin: async () => { throw axiosError(401, { error: PIN_CREDENTIAL_REJECTED_MESSAGE }); },
    confirmSetup: async () => true,
  });
  assert.deepEqual(await wrong.submit(GOOD), { status: 'failed', kind: 'credential', message: PIN_CREDENTIAL_REJECTED_MESSAGE });
});

test('server messages for throttling and outages are shown, and unknown failures get a safe message', () => {
  assert.equal(pinSetupFailure(axiosError(429, { error: 'Too many attempts. Please wait 5 minutes and try again.' })).kind, 'throttled');
  assert.equal(pinSetupFailure(axiosError(503, { error: 'PIN changes are temporarily unavailable. Please contact the school administrator.' })).kind, 'unavailable');
  const unknown = pinSetupFailure(axiosError(500, { stack: 'secret trace' }));
  assert.equal(unknown.kind, 'other');
  assert.ok(!unknown.message.includes('secret'));
});

test('network failure keeps the user on the form and a retry succeeds', async () => {
  let attempt = 0;
  const s = createPinSetupSubmitter({
    postPin: async () => { attempt++; if (attempt === 1) throw { message: 'Network Error' }; },
    confirmSetup: async () => true,
  });
  assert.deepEqual(await s.submit(GOOD), { status: 'failed', kind: 'network', message: PIN_NETWORK_MESSAGE });
  assert.deepEqual(await s.submit(GOOD), { status: 'saved', confirmed: true });
  assert.equal(attempt, 2);
});

test('if the PIN was saved but confirmation fails, a retry only re-confirms and never re-posts', async () => {
  let posts = 0;
  let confirms = 0;
  const s = createPinSetupSubmitter({
    postPin: async () => { posts++; },
    confirmSetup: async () => { confirms++; if (confirms === 1) throw new Error('offline'); return true; },
  });
  assert.deepEqual(await s.submit(GOOD), { status: 'saved', confirmed: false });
  assert.deepEqual(await s.submit(GOOD), { status: 'saved', confirmed: true });
  assert.equal(posts, 1);
});

test('the server saying must_set_pin is still true is not treated as complete', async () => {
  const s = createPinSetupSubmitter({ postPin: async () => {}, confirmSetup: async () => false });
  assert.deepEqual(await s.submit(GOOD), { status: 'saved', confirmed: false });
});

test('a wrong-credential 401 from /auth/pin is not refreshed and replayed', () => {
  const body = { error: PIN_CREDENTIAL_REJECTED_MESSAGE };
  assert.equal(isPinCredentialRejection('/auth/pin', 401, body), true);
  assert.equal(isPinCredentialRejection('/auth/pin?x=1', 401, body), true);
  assert.equal(isPinCredentialRejection('/auth/pin', 401, { error: 'Invalid or expired token' }), false);
  assert.equal(isPinCredentialRejection('/auth/pin', 403, body), false);
  assert.equal(isPinCredentialRejection('/students', 401, body), false);
});

// ── Navigation gating ───────────────────────────────────────────────────────
test('while a PIN is required, no combination of other flags reaches the app', () => {
  for (const mustChangePw of [false, true]) for (const mustSetSecurityQuestion of [false, true]) {
    const phase = resolveAuthPhase({
      loading: false, user: { pending_admin_review: false }, mustChangePw, mustSetSecurityQuestion, mustSetPin: true,
    });
    assert.equal(phase, 'pin-setup');
  }
});

test('loading, guest and app phases', () => {
  const base = { mustChangePw: false, mustSetSecurityQuestion: false, mustSetPin: false };
  assert.equal(resolveAuthPhase({ ...base, loading: true, user: { } }), 'loading');
  assert.equal(resolveAuthPhase({ ...base, loading: false, user: null }), 'guest');
  assert.equal(resolveAuthPhase({ ...base, loading: false, user: { pending_admin_review: false } }), 'app');
});

test('a pending account stays on the pending screen (PIN needs approval first) and is never sent to the app', () => {
  const phase = resolveAuthPhase({
    loading: false, user: { pending_admin_review: true }, mustChangePw: false, mustSetSecurityQuestion: false, mustSetPin: true,
  });
  assert.equal(phase, 'pending-review');
});

test('existing forced flows for other accounts are unchanged', () => {
  const user = { pending_admin_review: false };
  assert.equal(resolveAuthPhase({ loading: false, user, mustChangePw: true, mustSetSecurityQuestion: true, mustSetPin: false }), 'change-pw');
  assert.equal(resolveAuthPhase({ loading: false, user, mustChangePw: false, mustSetSecurityQuestion: true, mustSetPin: false }), 'security-q');
});

test('navigation moves to the app only after the server confirms setup', async () => {
  let mustSetPin = true;
  const phase = () => resolveAuthPhase({
    loading: false, user: { pending_admin_review: false }, mustChangePw: false, mustSetSecurityQuestion: false, mustSetPin,
  });
  const serverReports = { mustSetPin: true };
  const s = createPinSetupSubmitter({
    postPin: async () => { serverReports.mustSetPin = false; },
    confirmSetup: async () => {
      const ok = serverReports.mustSetPin === false;
      if (ok) mustSetPin = false; // what AuthContext does only on a confirmed answer
      return ok;
    },
  });
  assert.equal(phase(), 'pin-setup');
  await s.submit({ ...GOOD, confirm: '000000' }); // invalid → no change
  assert.equal(phase(), 'pin-setup');
  assert.equal((await s.submit(GOOD)).status, 'saved');
  assert.equal(phase(), 'app');
});

test('a 403 PIN_SETUP_REQUIRED from the server re-engages a stale client', () => {
  assert.equal(isPinSetupRequiredResponse(403, { code: 'PIN_SETUP_REQUIRED' }), true);
  assert.equal(isPinSetupRequiredResponse(403, { code: 'PENDING_APPROVAL' }), false);
  assert.equal(isPinSetupRequiredResponse(401, { code: 'PIN_SETUP_REQUIRED' }), false);
  assert.equal(isPinSetupRequiredResponse(undefined, undefined), false);
});

// ── Restart / restored session ──────────────────────────────────────────────
test('the persisted hint holds only the account id and is per-account', () => {
  const raw = serializePinGate('user-42');
  assert.deepEqual(JSON.parse(raw), { userId: 'user-42', required: true });
  assert.equal(PIN_GATE_STORAGE_KEY, 'pin_setup_required');
  assert.equal(pinGateHintFor(raw, 'user-42'), true);
  assert.equal(pinGateHintFor(raw, 'someone-else'), false);
});

test('malformed or absent hints are ignored', () => {
  for (const raw of [null, undefined, '', '{', 'true', '{"userId":"u"}', '{"userId":"","required":true}', '{"userId":7,"required":true}']) {
    assert.equal(parsePinGate(raw as any), null, String(raw));
  }
});

test('after a restart the server decides: it can set, keep or clear the requirement', () => {
  assert.equal(mergePinRequirement(false, { reachable: true, mustSetPin: true }), true);   // stale "no" is overridden
  assert.equal(mergePinRequirement(true, { reachable: true, mustSetPin: false }), false);  // stale "yes" is cleared
  assert.equal(mergePinRequirement(true, { reachable: true, mustSetPin: true }), true);
  assert.equal(mergePinRequirement(false, { reachable: true, mustSetPin: false }), false);
});

test('after a restart with the server unreachable, a known requirement still holds the user on setup', () => {
  assert.equal(mergePinRequirement(true, { reachable: false }), true);
  const phase = resolveAuthPhase({
    loading: false, user: { pending_admin_review: false }, mustChangePw: false, mustSetSecurityQuestion: false,
    mustSetPin: mergePinRequirement(pinGateHintFor(serializePinGate('u1'), 'u1'), { reachable: false }),
  });
  assert.equal(phase, 'pin-setup');
});
