import { isPinConfigured } from './pin.js';

/**
 * Checks that must pass BEFORE `db:migrate` runs as part of `npm start`.
 *
 * Migrations 0019/0020 change authentication state in the database. If the
 * application then refuses to boot because PIN_PEPPER is missing or invalid,
 * the database has already been modified and the previously deployed instance
 * keeps serving against the new schema. So the same rule the server applies at
 * boot (index.ts -> assertPinConfiguredAtStartup: production requires a valid
 * pepper) is evaluated first, and nothing touches the database if it fails.
 *
 * This reuses pin.ts's own validation; it does not define a second rule and it
 * never reads, prints or returns the pepper value.
 */
export type StartupPreflightResult = { ok: true } | { ok: false; reason: string };

export function runStartupPreflight(env: NodeJS.ProcessEnv = process.env): StartupPreflightResult {
  if (env.NODE_ENV === 'production' && !isPinConfigured(env)) {
    return {
      ok: false,
      reason:
        'PIN_PEPPER is missing or invalid in this production environment. ' +
        'Refusing to start: no database migration has been run.',
    };
  }
  return { ok: true };
}
