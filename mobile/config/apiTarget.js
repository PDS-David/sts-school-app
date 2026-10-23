'use strict';
// Staging API-target guard (D_PREP). Plain CommonJS so BOTH app.config.js (build time, Node)
// and src/api/client.ts (runtime, Metro) share one implementation. No network, no secrets.
//
// A "staging" build (STS_BUILD_TARGET=staging, set only by the `staging` profile in eas.json)
// must be given an explicit HTTPS API origin through EXPO_PUBLIC_API_URL. It may never fall
// back to expo.extra.apiUrl in app.json (the production host) or to the emulator address.
// Ordinary builds (no STS_BUILD_TARGET) are not touched by anything here.

const STAGING = 'staging';

function hostOf(url) {
  try { return new URL(url).hostname.toLowerCase(); } catch (_e) { return null; }
}

/**
 * Returns the validated staging API origin, or throws an Error saying exactly what is wrong.
 * @param {string|undefined} url          EXPO_PUBLIC_API_URL as supplied to the build
 * @param {string|undefined} productionUrl the production URL baked in app.json (never hard-coded here)
 */
function assertStagingApiUrl(url, productionUrl) {
  const fail = (why) => {
    throw new Error(
      `[staging build] refusing to continue: ${why}. A staging build needs EXPO_PUBLIC_API_URL set ` +
      '(through EAS, see docs/jss3/completion/STAGE1/RUNBOOK.md §6) to the designated HTTPS staging API origin; ' +
      'it never falls back to app.json or to production.');
  };
  if (typeof url !== 'string' || url.trim() === '') fail('EXPO_PUBLIC_API_URL is not set');
  if (url !== url.trim()) fail('EXPO_PUBLIC_API_URL has leading/trailing whitespace');
  if (/[<>{}\s]/.test(url) || /^(https?:\/\/)?(<|\$|%)/.test(url)) fail('EXPO_PUBLIC_API_URL looks like an unfilled placeholder');
  let u;
  try { u = new URL(url); } catch (_e) { fail('EXPO_PUBLIC_API_URL is not a valid URL'); }
  if (u.protocol !== 'https:') fail('EXPO_PUBLIC_API_URL must be https (a phone build cannot use http or loopback)');
  if (u.username || u.password) fail('credentials in EXPO_PUBLIC_API_URL are not accepted');
  if (u.search || u.hash) fail('EXPO_PUBLIC_API_URL must not carry a query string or fragment');
  if (url !== u.origin) fail('EXPO_PUBLIC_API_URL must be a bare origin such as https://host (no path, no trailing slash)');
  const host = u.hostname.toLowerCase();
  if (['localhost', '127.0.0.1', '::1', '[::1]', '10.0.2.2'].includes(host)) fail(`${host} is not reachable from a phone`);
  const prod = productionUrl ? hostOf(productionUrl) : null;
  if (prod && host === prod) fail(`${host} is the production host baked into app.json`);
  return u.origin;
}

/** Build-time: is this environment a designated staging build? */
function isStagingBuild(env) {
  return (env && env.STS_BUILD_TARGET) === STAGING;
}

/** Throws on an unrecognised STS_BUILD_TARGET so a typo ("stagging") cannot silently mean "production". */
function assertKnownTarget(env) {
  const t = env && env.STS_BUILD_TARGET;
  if (t !== undefined && t !== '' && t !== STAGING) {
    throw new Error(`[build] unrecognised STS_BUILD_TARGET=${JSON.stringify(t)}; the only supported value is "staging" (leave unset for a normal build)`);
  }
}

module.exports = { assertStagingApiUrl, isStagingBuild, assertKnownTarget, STAGING };
