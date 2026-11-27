import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  sanitizePin, normalizeLoginSecret, validateLoginInput, loginErrorMessage, generateDeviceId, isValidDeviceId,
  GENERIC_LOGIN_FAILURE, NETWORK_FAILURE,
} from '../../mobile/src/api/loginForm.ts';

test('sanitizePin keeps digits only and caps at six', () => {
  assert.equal(sanitizePin('12a3-4 5678'), '123456');
  assert.equal(sanitizePin('abc'), '');
});

test('PIN input is sanitized but administrator password input is preserved exactly', () => {
  assert.equal(normalizeLoginSecret('pin', '12a3-4 5678'), '123456');
  assert.equal(normalizeLoginSecret('password', 'AbC!@#-09_xY'), 'AbC!@#-09_xY');
  assert.equal(normalizeLoginSecret('password', '1234'), '1234');
});

test('PIN mode requires username and exactly six digits', () => {
  assert.ok(validateLoginInput('pin', '', '123456'));
  assert.ok(validateLoginInput('pin', 'ada', ''));
  assert.ok(validateLoginInput('pin', 'ada', '1234'));
  assert.ok(validateLoginInput('pin', 'ada', '1234567'));
  assert.equal(validateLoginInput('pin', 'ada', '493021'), null);
});

test('password mode does not impose a PIN rule (admin / finance admin)', () => {
  assert.equal(validateLoginInput('password', 'admin', 'Some-Existing#Password1'), null);
  assert.equal(validateLoginInput('password', 'admin', '1234'), null);
  assert.ok(validateLoginInput('password', 'admin', ''));
});

test('401 always shows the generic message, whatever the server text says', () => {
  assert.equal(loginErrorMessage({ response: { status: 401, data: { error: 'No such user' } } }), GENERIC_LOGIN_FAILURE);
  assert.equal(loginErrorMessage({ response: { status: 401, data: {} } }), GENERIC_LOGIN_FAILURE);
});

test('403 / 429 / 503 show the server message; other statuses are generic', () => {
  assert.equal(loginErrorMessage({ response: { status: 403, data: { error: 'Please see or call the E.O. for your approval' } } }), 'Please see or call the E.O. for your approval');
  assert.equal(loginErrorMessage({ response: { status: 429, data: { error: 'Too many attempts. Please wait 1 minute and try again.' } } }), 'Too many attempts. Please wait 1 minute and try again.');
  assert.equal(loginErrorMessage({ response: { status: 503, data: { error: 'Sign-in is temporarily unavailable.' } } }), 'Sign-in is temporarily unavailable.');
  assert.equal(loginErrorMessage({ response: { status: 500, data: { error: 'SQL error near x' } } }), GENERIC_LOGIN_FAILURE);
  assert.equal(loginErrorMessage({ response: { status: 403, data: {} } }), GENERIC_LOGIN_FAILURE);
});

test('no response means network failure', () => {
  assert.equal(loginErrorMessage(new Error('timeout')), NETWORK_FAILURE);
});

test('generated device ids match the backend format and differ', () => {
  const a = generateDeviceId();
  const b = generateDeviceId();
  assert.ok(isValidDeviceId(a));
  assert.notEqual(a, b);
  assert.ok(isValidDeviceId(generateDeviceId(() => 0.5)));
  assert.equal(isValidDeviceId('short'), false);
  assert.equal(isValidDeviceId('has spaces in it, not valid!!'), false);
});
