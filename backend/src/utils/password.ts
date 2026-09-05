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

// Security-question answers are compared case/whitespace-insensitively —
// a real user re-typing "Ibadan" vs "ibadan " months later shouldn't fail
// over formatting. Applied identically when setting and when checking the
// answer, so the hash and the comparison always see the same normalized form.
export function normalizeAnswer(answer: string): string {
  return answer.trim().toLowerCase();
}
