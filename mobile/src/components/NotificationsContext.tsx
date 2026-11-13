import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import api from '../api/client';
import { useAuth } from '../api/AuthContext';

export interface AppNotification {
  id: string;
  kind: 'message' | 'assessment' | 'grade' | 'system' | 'announcement';
  title: string;
  body: string;
  createdAt: string;
}

interface NotificationsState {
  notifications: AppNotification[];
  unreadCount: number;
  loading: boolean;
  announcementsLoaded: boolean;
  announcementsError: boolean;
  feedErrors: string[];
  readIds: Set<string>;
  refresh: () => Promise<void>;
  markAllRead: () => void;
}

const NotificationsContext = createContext<NotificationsState>({} as NotificationsState);
export const useNotifications = () => useContext(NotificationsContext);

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(false);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [announcementsLoaded, setAnnouncementsLoaded] = useState(false);
  const [announcementsError, setAnnouncementsError] = useState(false);
  const [feedErrors, setFeedErrors] = useState<string[]>([]);

  // Keep the last successful announcement response if a later refresh fails.
  // Refs avoid changing refresh's identity and triggering home-screen loops.
  const previousAnnouncementsRef = useRef<AppNotification[]>([]);
  const lastUserKeyRef = useRef<string | null>(null);
  const refreshGenerationRef = useRef(0);

  const refresh = useCallback(async () => {
    const generation = ++refreshGenerationRef.current;
    if (!user) {
      lastUserKeyRef.current = null;
      previousAnnouncementsRef.current = [];
      setNotifications([]);
      setReadIds(new Set());
      setAnnouncementsLoaded(false);
      setAnnouncementsError(false);
      setFeedErrors([]);
      setLoading(false);
      return;
    }

    const userKey = [user.id, user.role, user.school_code ?? '', user.assigned_class ?? ''].join(':');
    if (lastUserKeyRef.current !== userKey) {
      lastUserKeyRef.current = userKey;
      previousAnnouncementsRef.current = [];
      setNotifications([]);
      setReadIds(new Set());
      setAnnouncementsLoaded(false);
      setAnnouncementsError(false);
      setFeedErrors([]);
    }

    setLoading(true);
    const items: AppNotification[] = [];
    const failedSources: string[] = [];

    try {
      // Students only: parents use the separate ward-scoped upcoming-tests endpoint.
      if (user.role === 'student') {
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
    } catch { failedSources.push('assessment alerts'); }

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
    } catch { failedSources.push('message alerts'); }

    let announcementItems: AppNotification[] = [];
    let announcementSucceeded = false;
    try {
      const { data } = await api.get('/announcements');
      announcementItems = (data.announcements ?? []).slice(0, 10).map((a: any) => ({
        id: `announcement-${a.id}`,
        kind: 'announcement' as const,
        title: a.title,
        body: a.body,
        createdAt: a.created_at ?? new Date().toISOString(),
      }));
      announcementSucceeded = true;
    } catch { failedSources.push('announcements'); }

    // A newer refresh or account switch supersedes this response.
    if (generation !== refreshGenerationRef.current) return;

    if (announcementSucceeded) previousAnnouncementsRef.current = announcementItems;
    else announcementItems = previousAnnouncementsRef.current;

    items.push(...announcementItems);
    items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setNotifications(items);
    setAnnouncementsLoaded(previous => previous || announcementSucceeded);
    setAnnouncementsError(!announcementSucceeded);
    setFeedErrors(failedSources);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    refresh();
    return () => { refreshGenerationRef.current += 1; };
  }, [refresh]);

  const unreadCount = notifications.filter(n => !readIds.has(n.id)).length;
  const markAllRead = () => setReadIds(new Set(notifications.map(n => n.id)));

  return (
    <NotificationsContext.Provider value={{
      notifications, unreadCount, loading, announcementsLoaded, announcementsError, feedErrors, readIds, refresh, markAllRead,
    }}>
      {children}
    </NotificationsContext.Provider>
  );
}
