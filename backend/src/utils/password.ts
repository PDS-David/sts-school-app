const CHARSET = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';

export function generateTempPassword(length = 8): string {
  let pw = '';
  for (let i = 0; i < length; i++) {
    pw += CHARSET[Math.floor(Math.random() * CHARSET.length)];
  }
  return pw;
}

// Term-access PINs are handed to a student (often young, often verbally or
// on a paper slip), not typed off a screen like a password — a short
// all-numeric code is far more practical there than reusing
// generateTempPassword()'s full alphanumeric charset. Not cryptographically
// unguessable on its own (6 digits = 1e6 space), but it's paired with a
// specific student_id server-side (see term_access_pins' UNIQUE constraint
// and the redeem route) so brute-forcing it means guessing correctly against
// one specific account, not the whole keyspace — the same practical
// tradeoff a bank PIN or a one-time SMS code makes.
export function generateNumericPin(length = 6): string {
  let pin = '';
  for (let i = 0; i < length; i++) {
    pin += Math.floor(Math.random() * 10).toString();
  }
  return pin;
}

// Pure string transform, no DB access — the caller (POST /auth/self-claim)
// does the actual uniqueness dedup loop, same pattern as
// utils/parentProvisioning.ts's usernameFromPhone. "Abdul-Afeez Mahbub" ->
// "abdulafeez.mahbub" — strips anything that isn't a letter/space first so
// stray punctuation in a name (hyphens, apostrophes) doesn't leak into the
// username, then joins remaining words with a dot.
export function usernameBaseFromName(fullName: string): string {
  const words = fullName
    .toLowerCase()
    .replace(/[^a-z\s]/g, '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  return words.length ? words.join('.') : 'student';
}

// Security-question answers are compared case/whitespace-insensitively —
// a real user re-typing "Ibadan" vs "ibadan " months later shouldn't fail
// over formatting. Applied identically when setting and when checking the
// answer, so the hash and the comparison always see the same normalized form.
export function normalizeAnswer(answer: string): string {
  return answer.trim().toLowerCase();
}
