export interface StoredLearningAccessSettings {
  free_launch_mode: boolean;
  term_pin_enforced: boolean;
  curriculum_sequence_enforced: boolean;
}

export interface EffectiveLearningAccessPolicy {
  freeLaunchMode: boolean;
  termPinEnforced: boolean;
  curriculumSequenceEnforced: boolean;
  environmentOverrides: {
    freeLaunchMode: boolean;
    termPinEnforced: boolean;
    curriculumSequenceEnforced: boolean;
  };
  source: 'database' | 'environment-default';
}

function environmentBoolean(
  env: NodeJS.ProcessEnv,
  name: string,
): boolean | null {
  const raw = env[name];
  if (raw === undefined || raw.trim() === '') return null;
  const value = raw.trim().toLowerCase();
  if (value === 'true' || value === '1') return true;
  if (value === 'false' || value === '0') return false;
  throw new Error(`${name} must be set to true or false.`);
}

/**
 * Resolve deployment overrides over the persisted global-admin policy.
 * Free launch deliberately suppresses term-PIN and sequence enforcement,
 * even when those controls are preconfigured for the later paid phase.
 */
export function resolveLearningAccessPolicy(
  stored: StoredLearningAccessSettings | null,
  env: NodeJS.ProcessEnv = process.env,
): EffectiveLearningAccessPolicy {
  const envFreeLaunch = environmentBoolean(env, 'FREE_LAUNCH_MODE');
  const envTermPin = environmentBoolean(env, 'TERM_PIN_ENFORCED');
  const envSequence = environmentBoolean(env, 'CURRICULUM_SEQUENCE_ENFORCED');

  const freeLaunchMode = envFreeLaunch ?? stored?.free_launch_mode ?? true;
  const requestedTermPin = envTermPin ?? stored?.term_pin_enforced ?? false;
  const requestedSequence = envSequence ?? stored?.curriculum_sequence_enforced ?? false;

  return {
    freeLaunchMode,
    termPinEnforced: !freeLaunchMode && requestedTermPin,
    curriculumSequenceEnforced: !freeLaunchMode && requestedSequence,
    environmentOverrides: {
      freeLaunchMode: envFreeLaunch !== null,
      termPinEnforced: envTermPin !== null,
      curriculumSequenceEnforced: envSequence !== null,
    },
    source: stored ? 'database' : 'environment-default',
  };
}
