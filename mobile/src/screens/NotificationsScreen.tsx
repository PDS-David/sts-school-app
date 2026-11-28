import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Fonts, Radius } from '../theme';
import { useNotifications } from '../components/NotificationsContext';
import { Empty, Btn, Loader } from '../components/UI';
import { openMessageThread, openAssessment, openMyResults } from '../navigation/navigationRef';

const KIND_ICON: Record<string, string> = {
  message: 'chatbubble', assessment: 'clipboard', grade: 'bar-chart', system: 'information-circle', announcement: 'megaphone',
};

export default function NotificationsScreen({ navigation }: any) {
  // Announcements carry no navigation target; tapping one expands it so the full text can be read.
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const toggleExpanded = (id: string) => setExpanded(prev => { const next = new Set(prev); if (next.has(id)) next.delete(id); else next.add(id); return next; });
  const { notifications, markAllRead, markRead, unreadCount, loading, feedErrors, readIds, readStateReady, refresh } = useNotifications();

  const openNotification = (notification: (typeof notifications)[number]) => {
    if (!notification.target) return;
    markRead(notification.id);
    switch (notification.target.type) {
      case 'message':
        openMessageThread(notification.target.contact, notification.target.screen);
        break;
      case 'assessment':
        openAssessment(notification.target.assessmentId, notification.target.title);
        break;
      case 'score':
        openMyResults();
        break;
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} accessibilityRole="button" accessibilityLabel="Go back" style={{ padding: 6 }}>
          <Ionicons name="arrow-back" size={22} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity onPress={markAllRead} disabled={unreadCount === 0 || !readStateReady} accessibilityRole="button" accessibilityLabel="Mark all notifications as read" accessibilityState={{ disabled: unreadCount === 0 || !readStateReady }} style={{ padding: 6, opacity: unreadCount === 0 || !readStateReady ? 0.55 : 1 }}>
          <Text style={styles.markRead}>Mark all read</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={notifications}
        keyExtractor={n => n.id}
        contentContainerStyle={{ padding: Spacing.sm, flexGrow: 1 }}
        refreshControl={<RefreshControl refreshing={loading && notifications.length > 0} onRefresh={refresh} />}
        ListHeaderComponent={feedErrors.length > 0 ? (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>Some notification sources could not be refreshed: {feedErrors.join(', ')}.</Text>
            <Btn label="Retry notifications" variant="outline" style={{ paddingVertical: 8, paddingHorizontal: Spacing.md }} onPress={refresh} />
          </View>
        ) : null}
        ListEmptyComponent={loading ? <Loader /> : feedErrors.length > 0 ? (
          <View style={styles.emptyRetry}>
            <Empty message="Notifications could not be loaded." />
            <Btn label="Try again" variant="outline" onPress={refresh} />
          </View>
        ) : <Empty message="You're all caught up" />}
        renderItem={({ item: n }) => {
          const card = (
            <View style={styles.card}>
              <View style={styles.iconWrap}>
                <Ionicons name={(KIND_ICON[n.kind] ?? 'notifications') as any} size={20} color={Colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{n.title}</Text>
                <Text style={styles.cardBody} numberOfLines={expanded.has(n.id) ? undefined : 2}>{n.body}</Text>
              </View>
              {!readIds.has(n.id) ? <View style={styles.unreadDot} /> : null}
            </View>
          );
          return n.target ? (
            <TouchableOpacity onPress={() => openNotification(n)} disabled={!readStateReady} activeOpacity={0.8} accessibilityRole="button" accessibilityLabel={`Open ${n.title}`} accessibilityState={{ disabled: !readStateReady }}>
              {card}
            </TouchableOpacity>
          ) : n.kind === 'announcement' ? (
            <TouchableOpacity onPress={() => { toggleExpanded(n.id); markRead(n.id); }} activeOpacity={0.8} accessibilityRole="button" accessibilityLabel={`${expanded.has(n.id) ? 'Collapse' : 'Read full'} announcement ${n.title}`}>
              {card}
            </TouchableOpacity>
          ) : card;
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: { backgroundColor: Colors.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: Spacing.md, paddingTop: Spacing.md + 20 },
  headerTitle: { color: Colors.white, fontWeight: '700', fontSize: Fonts.sizes.lg },
  markRead: { color: Colors.white, fontSize: Fonts.sizes.xs, fontWeight: '600' },
  card: { flexDirection: 'row', gap: Spacing.sm, backgroundColor: Colors.card, borderRadius: Radius.md, padding: Spacing.md, marginBottom: Spacing.sm, elevation: 1 },
  errorBanner: { backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.error, borderRadius: Radius.md, padding: Spacing.md, marginBottom: Spacing.sm, gap: Spacing.sm },
  errorText: { color: Colors.error, fontSize: Fonts.sizes.sm },
  emptyRetry: { alignItems: 'center', justifyContent: 'center', padding: Spacing.md },
  unreadDot: { width: 9, height: 9, borderRadius: 5, backgroundColor: Colors.primary, alignSelf: 'center' },
  iconWrap: { width: 38, height: 38, borderRadius: 19, backgroundColor: Colors.primary + '18', alignItems: 'center', justifyContent: 'center' },
  cardTitle: { fontSize: Fonts.sizes.md, fontWeight: '700', color: Colors.text },
  cardBody: { fontSize: Fonts.sizes.sm, color: Colors.textSub, marginTop: 2 },
});
