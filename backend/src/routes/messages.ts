import { Router } from 'express';
import { query } from '../db/pool.js';
import { requireAuth } from '../middleware/auth.js';
import { hasPerm } from '../utils/rbac.js';
import { getMessageableUsers } from '../utils/scope.js';
import { sendPushToUser } from '../utils/push.js';

const router = Router();
router.use(requireAuth);

const RECIPIENT_ERROR: Record<string, string> = {
  student: 'You may only message your teachers, admin, your parent(s), or a classmate',
  parent: "You may only message your child's/children's class teacher(s), subject teacher(s), or admin",
  teacher: 'You may only message other staff and students/parents in your own school, or any admin',
  admin: 'Recipient not found or inactive',
};

// ── POST /messages ────────────────────────────────────────────────────────────
router.post('/', async (req, res) => {
  const user = req.user!;
  if (!hasPerm(user.role, 'messages.write')) {
    return res.status(403).json({ error: 'Not allowed to send messages' });
  }

  const { recipient_id, body, context_type, context_id } = req.body as {
    recipient_id: string; body: string; context_type?: string; context_id?: string;
  };
  if (!recipient_id || !body?.trim()) {
    return res.status(400).json({ error: 'recipient_id and body required' });
  }

  // Found live in QA Pass 7: this used to only enforce scope for `student`
  // senders — `parent`/`teacher`/`admin` sends were gated on `messages.write`
  // alone, which every account of that role has regardless of school or
  // relationship to the recipient. `getMessageableUsers()` is the same scope
  // `GET /messages/contacts` already uses, so this now enforces exactly what
  // the UI already promises for every role, not just students. See
  // utils/scope.ts → getMessageableUsers() for the full writeup and the live
  // repro (a secondary-school parent messaging an unrelated primary-school
  // student).
  const allowed = await getMessageableUsers(user);
  const recipientInfo = allowed.find(r => r.id === recipient_id);
  if (!recipientInfo) {
    return res.status(403).json({ error: RECIPIENT_ERROR[user.role] ?? 'Not allowed to message this recipient' });
  }

  const { rows } = await query(
    `INSERT INTO messages(sender_id,recipient_id,body,context_type,context_id)
     VALUES($1,$2,$3,$4,$5) RETURNING *`,
    [user.id, recipient_id, body.trim(), context_type ?? 'general', context_id ?? null],
  );

  // Fire-and-forget: push failures shouldn't fail the message send itself
  // (the message is already saved above — a dead token or Expo hiccup is
  // not the sender's problem). Sender's full_name is needed both for the
  // push title and for the `contact` object ChatThreadScreen expects on
  // tap (it takes a full { id, username, full_name, role } contact, not
  // just an id — same shape ChatsScreen already passes when opening a
  // thread normally).
  //
  // `screen` tells the mobile app's push-tap handler which registered
  // screen name to navigate to: admin's navigator (AdminStack.tsx) has no
  // nested chats-stack, just a single flat "Messages" screen — unlike
  // parent/student/teacher, which each register a "ChatThread" screen.
  // Found live: a message sent to admin produced a push that landed fine,
  // but tapping it crashed with "The action 'NAVIGATE' ... was not handled
  // by any navigator" because the deep-link always hardcoded 'ChatThread',
  // which doesn't exist for admin. recipientInfo.role is already known here
  // from the scope check above, so no extra query is needed to decide this.
  const { rows: senderRows } = await query(
    `SELECT full_name FROM users WHERE id=$1`, [user.id],
  );
  const senderFullName = senderRows[0]?.full_name ?? user.username;
  sendPushToUser(recipient_id, {
    title: senderFullName,
    body: body.trim().slice(0, 120),
    data: {
      type: 'message',
      screen: recipientInfo.role === 'admin' ? 'Messages' : 'ChatThread',
      contact: { id: user.id, username: user.username, full_name: senderFullName, role: user.role },
    },
  }).catch(err => console.error('Push send failed (message):', err));

  return res.status(201).json({ message: rows[0] });
});

// ── GET /messages  (inbox) ────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  const user = req.user!;
  const { rows } = await query(
    `SELECT m.*,
            s.username AS sender_name, s.full_name AS sender_fullname,
            r.username AS recipient_name, r.full_name AS recipient_fullname
     FROM messages m
     JOIN users s ON s.id=m.sender_id
     JOIN users r ON r.id=m.recipient_id
     WHERE m.recipient_id=$1 OR m.sender_id=$1
     ORDER BY m.created_at DESC LIMIT 100`,
    [user.id],
  );
  return res.json({ messages: rows });
});

// ── GET /messages/conversation/:other_user_id ─────────────────────────────────
router.get('/conversation/:other', async (req, res) => {
  const user = req.user!;
  const other = req.params.other;
  const { rows } = await query(
    `SELECT m.*,
            s.username AS sender_name, s.full_name AS sender_fullname
     FROM messages m
     JOIN users s ON s.id=m.sender_id
     WHERE (m.sender_id=$1 AND m.recipient_id=$2)
        OR (m.sender_id=$2 AND m.recipient_id=$1)
     ORDER BY m.created_at ASC`,
    [user.id, other],
  );
  // Mark received as read
  await query(
    `UPDATE messages SET is_read=TRUE WHERE recipient_id=$1 AND sender_id=$2 AND is_read=FALSE`,
    [user.id, other],
  );
  return res.json({ messages: rows });
});

// ── GET /messages/contacts  (who can this user message?) ─────────────────────
// Found live in QA Pass 7: the ChatsScreen/MessagesScreen contact list never
// carried any unread/last-message info, even though `ChatListItem` (the
// WhatsApp-style row component) already accepts `unread` and `timeLabel`
// props — neither was ever populated. Attaching `unread_count` and
// `last_message_at` here per contact, computed from a single grouped query
// rather than one round-trip per contact.
router.get('/contacts', async (req, res) => {
  const user = req.user!;
  const contacts = await getMessageableUsers(user);
  if (!contacts.length) return res.json({ contacts: [] });

  const { rows: stats } = await query(
    `SELECT
       CASE WHEN sender_id = $1 THEN recipient_id ELSE sender_id END AS other_id,
       COUNT(*) FILTER (WHERE recipient_id = $1 AND is_read = FALSE) AS unread_count,
       MAX(created_at) AS last_message_at
     FROM messages
     WHERE sender_id = $1 OR recipient_id = $1
     GROUP BY other_id`,
    [user.id],
  );
  const statsById = new Map(stats.map(s => [s.other_id, s]));

  const enriched = contacts.map(c => {
    const s = statsById.get(c.id);
    return {
      ...c,
      unread_count: s ? Number(s.unread_count) : 0,
      last_message_at: s?.last_message_at ?? null,
    };
  });

  return res.json({ contacts: enriched });
});

export default router;