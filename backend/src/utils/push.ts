import { Expo, type ExpoPushMessage } from 'expo-server-sdk';
import { query } from '../db/pool.js';

const expo = new Expo();

// ── Delivery ledger (DATA-04) ───────────────────────────────────────────────
// Every attempted push is recorded in push_deliveries. This is strictly best
// effort, the same rule as the push itself: a ledger failure is caught and
// logged (message only — never a token) and must never stop or fail a send.
// 'accepted' means Expo issued a ticket, not that the device received it.
const errText = (e: unknown) => (e instanceof Error ? e.message : String(e)).slice(0, 500);

/** Insert one 'queued' row per token before the provider call. Returns token → row id (empty on failure). */
async function ledgerQueue(
  userId: string, tokens: string[], title: string, body: string, messageId?: string,
): Promise<Map<string, string>> {
  const ids = new Map<string, string>();
  try {
    const { rows } = await query(
      `INSERT INTO push_deliveries(user_id, token, title, body_preview, status, message_id)
       SELECT $1::uuid, t, $3::text, $4::text, 'queued', $5::uuid FROM unnest($2::text[]) AS t
       RETURNING id, token`,
      [userId, tokens, title, body.slice(0, 120), messageId ?? null],
    );
    for (const r of rows) ids.set(r.token, String(r.id));
  } catch (err) {
    console.error('Push ledger insert failed:', errText(err));
  }
  return ids;
}

/** Set the outcome of a batch of ledger rows. Each entry is [rowId, status, ticketId|null, error|null]. */
async function ledgerSettle(entries: Array<[string, 'accepted' | 'error', string | null, string | null]>) {
  if (!entries.length) return;
  try {
    await query(
      `UPDATE push_deliveries d
       SET status=v.status, provider_ticket_id=v.tid, error=v.err, updated_at=now()
       FROM unnest($1::bigint[], $2::text[], $3::text[], $4::text[]) AS v(id, status, tid, err)
       WHERE d.id = v.id`,
      [entries.map(e => e[0]), entries.map(e => e[1]), entries.map(e => e[2]), entries.map(e => e[3])],
    );
  } catch (err) {
    console.error('Push ledger update failed:', errText(err));
  }
}

/** Mark the most recent delivery of each pruned token as 'pruned' (its error text is kept). */
async function ledgerMarkPruned(tokens: string[]) {
  try {
    await query(
      `UPDATE push_deliveries SET status='pruned', updated_at=now()
       WHERE id IN (SELECT DISTINCT ON (token) id FROM push_deliveries
                    WHERE token = ANY($1) ORDER BY token, id DESC)`,
      [tokens],
    );
  } catch (err) {
    console.error('Push ledger prune-mark failed:', errText(err));
  }
}

// ── sendPushToUser ──────────────────────────────────────────────────────────
// One user may have more than one device row in device_push_tokens (see
// schema.sql) — send to all of them. Respects notification_settings
// .push_enabled, the same column AppHeader's bell badge would eventually
// read, so there's a single source of truth for "does this user want
// pushes" rather than a second on/off mechanism.
export async function sendPushToUser(
  userId: string,
  notif: { title: string; body: string; data?: Record<string, unknown>; messageId?: string },
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

  // Ledger: one 'queued' row per token, written BEFORE the provider call.
  // Tokens that fail Expo.isExpoPushToken above are not attempted, so they
  // get no row. A failed insert yields an empty map and the push still goes.
  const ledgerIds = await ledgerQueue(
    userId, messages.map(m => m.to as string), notif.title, notif.body, notif.messageId,
  );

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
      const failure = `send failed: ${errText(err)}`;
      await ledgerSettle(chunk.flatMap(m => {
        const id = ledgerIds.get(m.to as string);
        return id ? [[id, 'error', null, failure] as [string, 'error', null, string]] : [];
      }));
      continue;
    }
    const settled: Array<[string, 'accepted' | 'error', string | null, string | null]> = [];
    tickets.forEach((ticket, i) => {
      const id = ledgerIds.get(chunk[i].to as string);
      if (ticket.status === 'ok') {
        if (id) settled.push([id, 'accepted', ticket.id ?? null, null]);
      } else if (id) {
        settled.push([id, 'error', null, `${ticket.details?.error ?? 'error'}: ${ticket.message}`.slice(0, 500)]);
      }
      // DeviceNotRegistered = uninstalled app / revoked permission. Prune it
      // now rather than retrying it forever on every future message.
      if (ticket.status === 'error' && ticket.details?.error === 'DeviceNotRegistered') {
        invalidTokens.push(chunk[i].to as string);
      }
    });
    await ledgerSettle(settled);
  }

  if (invalidTokens.length) {
    await query(
      `DELETE FROM device_push_tokens WHERE expo_push_token = ANY($1)`, [invalidTokens],
    );
    // Token pruning is unchanged; it now also annotates the delivery.
    await ledgerMarkPruned(invalidTokens);
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
