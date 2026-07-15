// ai.ts — Standalone Gemini AI call hub
// ─────────────────────────────────────────────────────────────────────────────
// Ported from AISchoolonair's server/services/ai.js (2026-07). Zero dependency
// on that repo — everything it needs (model routing, retry/fallback logic,
// rate limiting) is self-contained in this one file. Converted to TypeScript
// only to match this project's convention (all of backend/src is .ts); the
// logic itself is unchanged from the source.
//
// WHY THIS FILE LOOKS THE WAY IT DOES (read before "cleaning it up"):
//   The routing config and retry/fallback chain below encode hard-won
//   lessons from real production incidents in the source project — Google
//   retiring models with little notice, "-latest"/"-preview" aliases
//   silently repointing at experimental/rate-limited models, and a fallback
//   chain that itself pointed at dead models (so failures fell through to
//   more failures instead of actually recovering). See the comments on
//   GEMINI_MODEL_MAP and FALLBACK_CHAIN below before changing either.
//
// Public API (unchanged from the source project):
//   generate(prompt, task, options?) → Promise<string>
//
// BRANDING NOTE (added Pass 22): the mobile app presents every feature built
// on this hub to end users as "Brainee" — that name exists only in the
// frontend and in route/response copy, never in task-routing keys or model
// names here, so this file stays a clean, reusable port regardless of what
// the product is branded as.
// ─────────────────────────────────────────────────────────────────────────────

import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

// ═══════════════════════════════════════════════════════════════════════════
// ROUTING CONFIG
// ═══════════════════════════════════════════════════════════════════════════

// Every task routes to the same model today — this map exists so you can
// give any task (e.g. a cheap/simple one) its own model later without
// touching call sites. 'default' is used for any task key not listed here.
//
// FIX HISTORY WORTH KNOWING (2026-06, from the source project): gemini-2.0-flash
// was retired by Google, and a "-preview" dated snapshot that was briefly used
// as a fallback stopped resolving. Both were 404ing, so any transient failure
// on the primary model fell through to two dead models and surfaced as "AI is
// temporarily busy" even though the real cause was unreachable fallbacks, not
// exhausted quota. gemini-2.5-flash is the current GA model as of this
// writing; Google's deprecation guidance (checked 2026-06-19) gives "no
// earlier than October 16, 2026" for the 2.5 generation's shutdown — revisit
// this before then.
const GEMINI_MODEL_MAP: Record<string, string> = {
  'generate-questions': 'gemini-2.5-flash',
  'chat':               'gemini-2.5-flash',
  'explain':            'gemini-2.5-flash',
  'hint':               'gemini-2.5-flash',
  'notes':              'gemini-2.5-flash',
  'remediation':        'gemini-2.5-flash',
  'essay-mark':         'gemini-2.5-flash',
  'complex_reasoning':  'gemini-2.5-flash',
  'ping':               'gemini-2.5-flash',
  'default':            'gemini-2.5-flash',
};

// Fallback chain — tried in order if the primary model fails (503, 429,
// 404, etc). gemini-2.5-flash-lite is the same generation as the primary
// (so it won't vanish on a different schedule) but a separate quota pool,
// so primary-quota exhaustion doesn't take this down too.
//
// IMPORTANT: keep this chain free of "-latest"/"-preview" aliases. Both
// alias types can silently start pointing at an experimental or
// rate-limited model without any code change here — defeating the entire
// purpose of a fallback (this exact thing happened in the source project;
// see the note above). Pin to dated/named stable releases only.
const FALLBACK_CHAIN: string[] = ['gemini-2.5-flash-lite'];

// ═══════════════════════════════════════════════════════════════════════════
// GEMINI CALL + RETRY/FALLBACK
// ═══════════════════════════════════════════════════════════════════════════

let _ai: GoogleGenAI | null = null;
function _getAI(): GoogleGenAI {
  if (!_ai) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error(
        'GEMINI_API_KEY is not set. Get one at https://aistudio.google.com/apikey ' +
        'and set it as an environment variable before calling generate().'
      );
    }
    _ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return _ai;
}

// Detects any retryable/unavailability error from Google so the fallback
// chain only kicks in for things worth retrying (quota, overload, a model
// name that's stopped resolving) — not for e.g. a genuinely malformed
// request, which would just fail the same way on every model in the chain.
function _isRetryableError(err: any): boolean {
  const msg    = (err?.message || '').toLowerCase();
  const status = err?.status || err?.statusCode || 0;
  return (
    status === 503 ||
    status === 429 ||
    status === 404 ||
    msg.includes('503') ||
    msg.includes('429') ||
    msg.includes('404') ||
    msg.includes('service unavailable') ||
    msg.includes('high demand') ||
    msg.includes('unavailable') ||
    msg.includes('overloaded') ||
    msg.includes('quota') ||
    msg.includes('resource_exhausted') ||
    msg.includes('too many requests') ||
    msg.includes('rate limit') ||
    msg.includes('no longer available') ||
    msg.includes('not available to new users') ||
    msg.includes('not found') ||
    msg.includes('deprecated')
  );
}

async function _callGemini(prompt: string, task: string): Promise<string> {
  const primaryModel = GEMINI_MODEL_MAP[task] || GEMINI_MODEL_MAP.default;
  const modelsToTry  = [primaryModel, ...FALLBACK_CHAIN];
  const ai           = _getAI();

  for (let i = 0; i < modelsToTry.length; i++) {
    const modelName = modelsToTry[i];
    const isLast    = i === modelsToTry.length - 1;

    try {
      const response = await ai.models.generateContent({
        model:    modelName,
        contents: prompt,
      });

      const text = response.text;

      if (!text?.trim()) {
        throw new Error('Empty response from model');
      }

      if (i > 0) {
        console.log(`[ai.ts] Fallback model served request: ${modelName}`);
      }

      return text.trim();

    } catch (err: any) {
      const isRetryable = _isRetryableError(err);

      if (isRetryable && !isLast) {
        console.warn(
          `[ai.ts] ${modelName} failed (${err?.status || err?.message?.slice(0, 60)}) ` +
          `— trying ${modelsToTry[i + 1]}`
        );
        continue;
      }

      // All models exhausted, or a non-retryable error. Never expose raw
      // Google error details to end users, but log enough server-side to
      // tell "everything is genuinely rate-limited right now" apart from
      // "a model name in this chain has stopped existing".
      console.error(
        `[ai.ts] All models exhausted or fatal error. ` +
        `Chain tried: ${modelsToTry.join(' -> ')}. Last error: ${err.message}`
      );

      throw Object.assign(
        new Error(isRetryable
          ? 'AI is temporarily busy. Please try again in a moment.'
          : 'AI request failed. Please try again.'),
        { statusCode: isRetryable ? 503 : 500 }
      );
    }
  }

  // Unreachable in practice (the loop above always returns or throws), but
  // keeps TypeScript's control-flow analysis happy under strict mode.
  throw Object.assign(new Error('AI request failed. Please try again.'), { statusCode: 500 });
}

// ═══════════════════════════════════════════════════════════════════════════
// OPTIONAL REDIS RATE LIMITING — fully fail-open
// ═══════════════════════════════════════════════════════════════════════════
// Caps a user to RATE_LIMIT_MAX requests per RATE_LIMIT_WINDOW seconds.
//
// This is entirely optional and safe to ignore if this project doesn't use
// Redis:
//   - If REDIS_URL isn't set, rate limiting is skipped entirely (every
//     request is allowed) — no Redis connection is even attempted.
//   - If REDIS_URL is set but the optional 'ioredis' package isn't
//     installed, this logs one warning and then behaves the same as above.
//   - If Redis is reachable but a single command fails for any reason
//     (network blip, Redis restart, etc.), that one request is allowed
//     through rather than blocking a real user because of an infra hiccup.
// In short: this can only ever make a request MORE permissive on failure,
// never less. Install ioredis (`npm install ioredis`) and set REDIS_URL to
// turn rate limiting on.
//
// NOTE FOR THIS PROJECT: this project's existing routes don't use Redis
// anywhere else — this stays fully no-op (REDIS_URL unset) unless you
// deliberately opt in.

const RATE_LIMIT_MAX    = 20;  // requests per window
const RATE_LIMIT_WINDOW = 60;  // seconds

let _redis: any          = null;
let _redisInitTried      = false;
let _warnedNoIoredis     = false;

async function _getRedis(): Promise<any> {
  if (_redisInitTried) return _redis;
  _redisInitTried = true;

  if (!process.env.REDIS_URL) {
    // No REDIS_URL configured — rate limiting is intentionally a no-op.
    return null;
  }

  try {
    // Dynamic import (not require) — this project's backend runs as an ESM
    // package ("type": "module" in package.json), so a CommonJS `require`
    // isn't available here the way it was in the source file. The module
    // name is passed through a variable (rather than a string literal) on
    // purpose: 'ioredis' is an optional dependency this project doesn't
    // install by default, so a literal import specifier would fail
    // `tsc --noEmit` with "cannot find module" even though the try/catch
    // handles it fine at runtime.
    const ioredisModuleName = 'ioredis';
    const { default: Redis } = await import(ioredisModuleName);
    _redis = new Redis(process.env.REDIS_URL);
    _redis.on('error', () => { /* swallowed — see fail-open note above */ });
  } catch {
    if (!_warnedNoIoredis) {
      _warnedNoIoredis = true;
      console.warn(
        "[ai.ts] REDIS_URL is set but the optional 'ioredis' package isn't " +
        "installed — rate limiting is disabled. Run `npm install ioredis` " +
        "to enable it."
      );
    }
    _redis = null;
  }

  return _redis;
}

async function _checkRateLimit(
  userId?: string,
  role?: string,
): Promise<{ allowed: boolean; error?: string }> {
  if (!userId)          return { allowed: true };
  if (role === 'admin') return { allowed: true };

  const redis = await _getRedis();
  if (!redis) return { allowed: true };

  try {
    const key   = `ai_rate:${userId}`;
    const count = await redis.incr(key);
    if (count === 1) await redis.expire(key, RATE_LIMIT_WINDOW);
    if (count > RATE_LIMIT_MAX) {
      return { allowed: false, error: 'Rate limit exceeded. Try again shortly.' };
    }
    return { allowed: true };
  } catch {
    return { allowed: true }; // fail-open
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// USAGE LOGGING (console only — no DB dependency)
// ═══════════════════════════════════════════════════════════════════════════

function _logUsage({ task, response, userId }: { task: string; response: string; userId?: string }) {
  // Rough token estimate (chars/4) — good enough for eyeballing cost trends
  // in logs, not intended to be billing-accurate.
  const outputTokens = Math.round(response.length / 4);
  const log: Record<string, unknown> = {
    feature:      task,
    provider:     'gemini',
    outputTokens,
    timestamp:    new Date().toISOString(),
  };
  if (userId) log.userId = userId;
  console.log('[AI Usage]', JSON.stringify(log));
}

// ═══════════════════════════════════════════════════════════════════════════
// PUBLIC API
// ═══════════════════════════════════════════════════════════════════════════

export interface GenerateOptions {
  /** Used for rate limiting + usage logging. Omit to skip rate limiting entirely. */
  userId?: string;
  /** Pass 'admin' to bypass the rate limit. */
  role?: string;
}

/**
 * generateJSON(prompt, task, options?) → Promise<unknown>
 *
 * For callers that need structured output (drafted questions, batched essay
 * scores) rather than prose. Appends an explicit instruction to respond with
 * JSON only, then parses the result. Gemini occasionally wraps JSON in a
 * ```json fence even when told not to — stripped before parsing. Throws a
 * plain Error (no special .statusCode) if the response isn't valid JSON, so
 * callers can tell "Brainee is down" (from generate()'s own thrown errors)
 * apart from "Brainee answered, but not in the shape we asked for".
 */
export async function generateJSON(
  prompt: string,
  task: string = 'default',
  options: GenerateOptions = {},
): Promise<unknown> {
  const jsonPrompt =
    `${prompt}\n\n` +
    'Respond with ONLY valid JSON — no prose before or after, no markdown code fences.';
  const raw = await generate(jsonPrompt, task, options);
  const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    throw new Error("Brainee's response wasn't valid JSON. Try again, or with a smaller request.");
  }
}

/**
 * generate(prompt, task, options?) → Promise<string>
 *
 * @param prompt           Full prompt text to send to the model
 * @param task             Routing key — see GEMINI_MODEL_MAP. Any key not
 *                          listed there uses 'default'.
 * @param options
 * @returns                Trimmed text response from Gemini.
 * @throws Error            .statusCode is 429 (rate limited), 503 (AI
 *                          temporarily unavailable — safe to retry), or 500
 *                          (non-retryable error).
 */
export async function generate(
  prompt: string,
  task: string = 'default',
  options: GenerateOptions = {},
): Promise<string> {
  const { userId, role } = options;

  const rateCheck = await _checkRateLimit(userId, role);
  if (!rateCheck.allowed) {
    const err = Object.assign(new Error(rateCheck.error), { statusCode: 429 });
    throw err;
  }

  const text = await _callGemini(prompt, task);

  _logUsage({ task, response: text, userId });

  return text;
}
