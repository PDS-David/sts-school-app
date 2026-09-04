const CHARSET = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';

export function generateTempPassword(length = 8): string {
  let pw = '';
  for (let i = 0; i < length; i++) {
    pw += CHARSET[Math.floor(Math.random() * CHARSET.length)];
  }
  return pw;
}

// Security-question answers are compared case/whitespace-insensitively —
// a real user re-typing "Ibadan" vs "ibadan " months later shouldn't fail
// over formatting. Applied identically when setting and when checking the
// answer, so the hash and the comparison always see the same normalized form.
export function normalizeAnswer(answer: string): string {
  return answer.trim().toLowerCase();
}
