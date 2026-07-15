import { Expo, type ExpoPushMessage } from 'expo-server-sdk';
import { query } from '../db/pool.js';

const expo = new Expo();

// ── sendPushToUser ──────────────────────────────────────────────────────────
// One user may have more than one device row in device_push_tokens (see
// schema.sql) — send to all of them. Respects notification_settings
// .push_enabled, the same column AppHeader's bell badge would eventually
// read, so there's a single source of truth for "does this user want
// pushes" rather than a second on/off mechanism.
export async function sendPushToUser(
  userId: string,
  notif: { title: string; body: string; data?: Record<string, unknown> },
) {
  const { rows: settingsRows } = await query(
    `SELECT push_enabled FROM notification_settings WHERE user_id=$1`, [userId],
  );
  if (settingsRows[0]?.push_enabled === false) return;

  const { rows: tokenRows } = await query(
    `SELECT expo_push_token FROM device_push_tokens WHERE user_id=$1`, [userId],
  );
  if (!tokenRows.length) return;

  const messages: ExpoPushMessage[] = tokenRows
    .filter(r => Expo.isExpoPushToken(r.expo_push_token))
    .map(r => ({
      to: r.expo_push_token,
      sound: 'default',
      title: notif.title,
      body: notif.body,
      data: notif.data ?? {},
    }));
  if (!messages.length) return;

  const chunks = expo.chunkPushNotifications(messages);
  const invalidTokens: string[] = [];

  for (const chunk of chunks) {
    let tickets;
    try {
      tickets = await expo.sendPushNotificationsAsync(chunk);
    } catch (err) {
      // Whole-chunk failure (e.g. Expo push service unreachable) — don't
      // let it take the calling request down with it (same
      // defense-in-depth philosophy as index.ts's unhandledRejection
      // handler). Just skip pruning for this chunk and move on.
      console.error('Push send failed for a chunk:', err);
      continue;
    }
    tickets.forEach((ticket, i) => {
      // DeviceNotRegistered = uninstalled app / revoked permission. Prune it
      // now rather than retrying it forever on every future message.
      if (ticket.status === 'error' && ticket.details?.error === 'DeviceNotRegistered') {
        invalidTokens.push(chunk[i].to as string);
      }
    });
  }

  if (invalidTokens.length) {
    await query(
      `DELETE FROM device_push_tokens WHERE expo_push_token = ANY($1)`, [invalidTokens],
    );
  }
}

// ── sendPushToClass ─────────────────────────────────────────────────────────
// For "everyone in this class" (assessment published) rather than one user.
// Pushes students only — parents are linked via parent_wards, and whether
// they should also get a push here is a product decision (digest vs. every
// publish), not a technical one, so it's left as an explicit follow-up
// rather than assumed.
export async function sendPushToClass(
  schoolCode: string, className: string,
  notif: { title: string; body: string; data?: Record<string, unknown> },
) {
  const { rows } = await query(
    `SELECT user_id FROM students WHERE school_code=$1 AND class_name=$2 AND user_id IS NOT NULL`,
    [schoolCode, className],
  );
  await Promise.all(rows.map(r => sendPushToUser(r.user_id, notif)));
}
