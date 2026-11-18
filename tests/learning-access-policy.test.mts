import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveLearningAccessPolicy } from '../backend/src/utils/learningAccessPolicy.js';

test('fresh installs default to free launch with term and sequence gates disabled', () => {
  assert.deepEqual(resolveLearningAccessPolicy(null, {}), {
    freeLaunchMode: true,
    termPinEnforced: false,
    curriculumSequenceEnforced: false,
    environmentOverrides: {
      freeLaunchMode: false,
      termPinEnforced: false,
      curriculumSequenceEnforced: false,
    },
    source: 'environment-default',
  });
});

test('persisted global-admin settings activate restrictions only after free launch is disabled', () => {
  const policy = resolveLearningAccessPolicy({
    free_launch_mode: false,
    term_pin_enforced: true,
    curriculum_sequence_enforced: true,
  }, {});
  assert.equal(policy.source, 'database');
  assert.equal(policy.freeLaunchMode, false);
  assert.equal(policy.termPinEnforced, true);
  assert.equal(policy.curriculumSequenceEnforced, true);
});

test('free launch suppresses configured term PIN and curriculum sequence gates', () => {
  const policy = resolveLearningAccessPolicy({
    free_launch_mode: true,
    term_pin_enforced: true,
    curriculum_sequence_enforced: true,
  }, {});
  assert.equal(policy.freeLaunchMode, true);
  assert.equal(policy.termPinEnforced, false);
  assert.equal(policy.curriculumSequenceEnforced, false);
});

test('explicit deployment environment values override persisted settings', () => {
  const policy = resolveLearningAccessPolicy({
    free_launch_mode: false,
    term_pin_enforced: true,
    curriculum_sequence_enforced: true,
  }, {
    FREE_LAUNCH_MODE: 'true',
    TERM_PIN_ENFORCED: 'false',
    CURRICULUM_SEQUENCE_ENFORCED: 'false',
  });
  assert.equal(policy.freeLaunchMode, true);
  assert.equal(policy.termPinEnforced, false);
  assert.equal(policy.curriculumSequenceEnforced, false);
  assert.deepEqual(policy.environmentOverrides, {
    freeLaunchMode: true,
    termPinEnforced: true,
    curriculumSequenceEnforced: true,
  });
});

test('invalid deployment policy values are rejected instead of silently guessed', () => {
  assert.throws(
    () => resolveLearningAccessPolicy(null, { FREE_LAUNCH_MODE: 'sometimes' }),
    /FREE_LAUNCH_MODE must be set to true or false/,
  );
});
