import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/client';
import { useAuth } from '../api/AuthContext';

export interface AppNotification {
  id: string;
  kind: 'message' | 'assessment' | 'grade' | 'system' | 'announcement';
  title: string;
  body: string;
  createdAt: string;
  target?:
    | { type: 'message'; contact: { id: string; username: string; full_name: string; role: string }; screen: 'Messages' | 'ChatThread' }
    | { type: 'assessment'; assessmentId: string; title: string }
    | { type: 'score' };
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
  markRead: (id: string) => void;
}

const NotificationsContext = createContext<NotificationsState>({} as NotificationsState);
export const useNotifications = () => useContext(NotificationsContext);

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(false);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [readStateReady, setReadStateReady] = useState(false);
  const readStateReadyRef = useRef(false);
  const [announcementsLoaded, setAnnouncementsLoaded] = useState(false);
  const [announcementsError, setAnnouncementsError] = useState(false);
  const [feedErrors, setFeedErrors] = useState<string[]>([]);

  // Keep the last successful announcement response if a later refresh fails.
  // Refs avoid changing refresh's identity and triggering home-screen loops.
  const previousAnnouncementsRef = useRef<AppNotification[]>([]);
  const lastUserKeyRef = useRef<string | null>(null);
  const refreshGenerationRef = useRef(0);
  const readStateGenerationRef = useRef(0);
  const hydratedReadStorageKeyRef = useRef<string | null>(null);
  const notificationUserKey = user
    ? [user.id, user.role, user.school_code ?? '', user.assigned_class ?? ''].join(':')
    : null;
  const readStorageKey = notificationUserKey ? `notification_read_ids:${notificationUserKey}` : null;

  // Read state survives app restarts, but remains isolated by signed-in user
  // and role/school scope. Do not persist the initial empty state until the
  // corresponding key has finished hydrating.
  useEffect(() => {
    const key = readStorageKey;
    const generation = ++readStateGenerationRef.current;
    hydratedReadStorageKeyRef.current = null;
    readStateReadyRef.current = false;
    setReadStateReady(false);
    if (!key) {
      setReadIds(new Set());
      readStateReadyRef.current = true;
      setReadStateReady(true);
      return;
    }
    setReadIds(new Set());
    AsyncStorage.getItem(key).then(raw => {
      if (generation !== readStateGenerationRef.current) return;
      let parsed: unknown = [];
      try { parsed = raw ? JSON.parse(raw) : []; } catch { parsed = []; }
      const ids = Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : [];
      setReadIds(new Set(ids));
      hydratedReadStorageKeyRef.current = key;
      readStateReadyRef.current = true;
      setReadStateReady(true);
    }).catch(() => {
      if (generation !== readStateGenerationRef.current) return;
      hydratedReadStorageKeyRef.current = key;
      readStateReadyRef.current = true;
      setReadStateReady(true);
    });
    return () => { readStateGenerationRef.current += 1; };
  }, [readStorageKey]);

  useEffect(() => {
    if (!readStorageKey || !readStateReady || hydratedReadStorageKeyRef.current !== readStorageKey) return;
    AsyncStorage.setItem(readStorageKey, JSON.stringify([...readIds])).catch(() => {});
  }, [readStorageKey, readIds, readStateReady]);

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

    const userKey = notificationUserKey!;
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
            target: { type: 'assessment', assessmentId: String(a.id), title: a.title ?? '' },
          });
        }
      }
    } catch { failedSources.push('assessment alerts'); }

    try {
      const { data } = await api.get('/messages/contacts');
      const withUnread = (data.contacts ?? []).filter((c: any) => (c.unread_count ?? 0) > 0);
      for (const c of withUnread) {
        items.push({
          // Include the latest message marker/count so a genuinely new
          // unread message creates a fresh notification even after the
          // previous conversation alert was marked read.
          id: `message-${c.id}-${c.last_message_at ?? ''}-${c.unread_count}`,
          kind: 'message',
          title: `New message from ${c.full_name}`,
          body: c.unread_count === 1 ? '1 unread message' : `${c.unread_count} unread messages`,
          createdAt: c.last_message_at ?? new Date().toISOString(),
          target: {
            type: 'message',
            contact: { id: c.id, username: c.username, full_name: c.full_name, role: c.role },
            screen: user.role === 'admin' || user.role === 'finance_admin' ? 'Messages' : 'ChatThread',
          },
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
  const markAllRead = () => {
    if (!readStateReadyRef.current) return;
    setReadIds(new Set(notifications.map(n => n.id)));
  };
  const markRead = useCallback((id: string) => {
    if (!readStateReadyRef.current) return;
    setReadIds(current => {
      if (current.has(id)) return current;
      const next = new Set(current);
      next.add(id);
      return next;
    });
  }, []);

  return (
    <NotificationsContext.Provider value={{
      notifications, unreadCount, loading, announcementsLoaded, announcementsError, feedErrors, readIds, readStateReady, refresh, markAllRead, markRead,
    }}>
      {children}
    </NotificationsContext.Provider>
  );
}
