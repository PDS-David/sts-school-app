import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/client';
import { useAuth } from '../api/AuthContext';

export interface AppNotification {
  id: string;
  kind: 'message' | 'assessment' | 'grade' | 'system';
  title: string;
  body: string;
  createdAt: string;
}

interface NotificationsState {
  notifications: AppNotification[];
  unreadCount: number;
  loading: boolean;
  refresh: () => Promise<void>;
  markAllRead: () => void;
}

const NotificationsContext = createContext<NotificationsState>({} as NotificationsState);
export const useNotifications = () => useContext(NotificationsContext);

// There is no single "/notifications" endpoint in this API yet, so this
// assembles a best-effort feed from data the app already has permission to
// read (open assessments, unread conversations) rather than inventing
// content. Once a real notifications/announcements endpoint exists, swap
// the body of `refresh` to call it directly.
//
// Found live in QA Pass 7: the comment above always described "unread-
// looking conversations" as part of this feed, but the code never actually
// built any `kind: 'message'` entries — `AppNotification`'s type included
// it, `NotificationsScreen`'s icon map had one for it, but `refresh()` only
// ever pushed `'assessment'` items. Unread messages never showed up here or
// in the bell badge on `AppHeader`, no matter how many were waiting. Now
// that `GET /messages/contacts` returns real `unread_count`/`last_message_at`
// per contact (added this same pass), this folds those in too.
export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(false);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  const refresh = useCallback(async () => {
    if (!user) { setNotifications([]); return; }
    setLoading(true);
    const items: AppNotification[] = [];
    try {
      if (user.role === 'student' || user.role === 'parent') {
        const { data } = await api.get('/learning/assessments');
        const open = (data.assessments ?? []).filter((a: any) => a.status === 'open');
        for (const a of open.slice(0, 5)) {
          items.push({
            id: `assessment-${a.id}`,
            kind: 'assessment',
            title: 'Assessment open',
            body: a.title ?? 'A new assessment is available to take',
            createdAt: a.created_at ?? new Date().toISOString(),
          });
        }
      }
    } catch { /* offline or endpoint unavailable — skip silently */ }
    try {
      const { data } = await api.get('/messages/contacts');
      const withUnread = (data.contacts ?? []).filter((c: any) => (c.unread_count ?? 0) > 0);
      for (const c of withUnread) {
        items.push({
          id: `message-${c.id}`,
          kind: 'message',
          title: `New message from ${c.full_name}`,
          body: c.unread_count === 1 ? '1 unread message' : `${c.unread_count} unread messages`,
          createdAt: c.last_message_at ?? new Date().toISOString(),
        });
      }
    } catch { /* offline or endpoint unavailable — skip silently */ }
    items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setNotifications(items);
    setLoading(false);
  }, [user]);

  useEffect(() => { refresh(); }, [refresh]);

  const unreadCount = notifications.filter(n => !readIds.has(n.id)).length;
  const markAllRead = () => setReadIds(new Set(notifications.map(n => n.id)));

  return (
    <NotificationsContext.Provider value={{ notifications, unreadCount, loading, refresh, markAllRead }}>
      {children}
    </NotificationsContext.Provider>
  );
}
