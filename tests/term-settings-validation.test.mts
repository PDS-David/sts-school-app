import assert from 'node:assert/strict';
import test from 'node:test';
import * as server from '../backend/src/utils/termSettings.js';
import * as client from '../mobile/src/utils/termSettings.js';

// One vector table, run through BOTH copies, so client and server validation cannot drift.
const nextTermVectors: Array<[string, unknown, { ok: true; value: string | null } | { ok: false }]> = [
  ['label', 'Monday, 12th January', { ok: true, value: 'Monday, 12th January' }],
  ['padded', '  14th January 2025  ', { ok: true, value: '14th January 2025' }],
  ['iso-like', '2026-01-12', { ok: true, value: '2026-01-12' }],
  ['unicode', 'Lundi 12 janvier', { ok: true, value: 'Lundi 12 janvier' }],
  ['exactly 120', 'a'.repeat(120), { ok: true, value: 'a'.repeat(120) }],
  ['null clears', null, { ok: true, value: null }],
  ['empty clears', '', { ok: true, value: null }],
  ['whitespace clears', '   ', { ok: true, value: null }],
  ['121 chars', 'a'.repeat(121), { ok: false }],
  ['newline', 'a\nb', { ok: false }],
  ['tab', 'a\tb', { ok: false }],
  ['NUL', 'a\u0000b', { ok: false }],
  ['symbols only', '--- !!!', { ok: false }],
  ['number', 42, { ok: false }],
  ['boolean', false, { ok: false }],
  ['object', {}, { ok: false }],
  ['array', ['x'], { ok: false }],
];

for (const [label, input, expected] of nextTermVectors) {
  test(`next_term_begins vector: ${label}`, () => {
    for (const [side, impl] of [['server', server], ['client', client]] as const) {
      const result = impl.normalizeNextTermBegins(input);
      assert.equal(result.ok, expected.ok, `${side} ok`);
      if (expected.ok && result.ok) assert.equal(result.value, expected.value, `${side} value`);
      if (!expected.ok && !result.ok) assert.ok(result.error.length > 0, `${side} gives a message`);
    }
  });
}

test('days_opened rules match between client and server', () => {
  for (const value of [0, 1, 60, 366, 2_147_483_647, -1, 1.5, 2_147_483_648, Number.NaN, Infinity, '60', null, undefined, {}]) {
    assert.equal(
      client.validateDaysOpenedValue(value) === null,
      server.validateDaysOpenedValue(value) === null,
      `disagree on ${String(value)}`,
    );
  }
  assert.equal(server.validateDaysOpenedValue(60), null);
  assert.notEqual(server.validateDaysOpenedValue(-1), null);
});

test('shared limits are identical', () => {
  assert.equal(client.NEXT_TERM_BEGINS_MAX_LENGTH, server.NEXT_TERM_BEGINS_MAX_LENGTH);
  assert.equal(client.DAYS_OPENED_MAX, server.DAYS_OPENED_MAX);
});

test('the days-opened text box parser rejects blanks and non-integers but accepts whole numbers', () => {
  assert.deepEqual(client.parseDaysOpenedInput(' 60 '), { ok: true, value: 60 });
  assert.deepEqual(client.parseDaysOpenedInput('0'), { ok: true, value: 0 });
  for (const bad of ['', '   ', '-5', '1.5', '6e1', 'abc', '99999999999']) {
    assert.equal(client.parseDaysOpenedInput(bad).ok, false, `reject "${bad}"`);
  }
});
