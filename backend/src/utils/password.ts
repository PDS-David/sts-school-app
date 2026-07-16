const CHARSET = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';

export function generateTempPassword(length = 8): string {
  let pw = '';
  for (let i = 0; i < length; i++) {
    pw += CHARSET[Math.floor(Math.random() * CHARSET.length)];
  }
  return pw;
}
