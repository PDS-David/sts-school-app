import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Fonts, Radius } from '../theme';
import { useNotifications } from '../components/NotificationsContext';
import { Empty, Btn, Loader } from '../components/UI';

const KIND_ICON: Record<string, string> = {
  message: 'chatbubble', assessment: 'clipboard', grade: 'bar-chart', system: 'information-circle', announcement: 'megaphone',
};

export default function NotificationsScreen({ navigation }: any) {
  const { notifications, markAllRead, unreadCount, loading, feedErrors, readIds, refresh } = useNotifications();

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 6 }}>
          <Ionicons name="arrow-back" size={22} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity onPress={markAllRead} disabled={unreadCount === 0} style={{ padding: 6, opacity: unreadCount === 0 ? 0.55 : 1 }}>
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
            <Btn label="Retry notifications" variant="outline" onPress={refresh} />
          </View>
        ) : null}
        ListEmptyComponent={loading ? <Loader /> : feedErrors.length > 0 ? (
          <View style={styles.emptyRetry}>
            <Empty message="Notifications could not be loaded." />
            <Btn label="Try again" variant="outline" onPress={refresh} />
          </View>
        ) : <Empty message="You're all caught up" />}
        renderItem={({ item: n }) => (
          <View style={styles.card}>
            <View style={styles.iconWrap}>
              <Ionicons name={(KIND_ICON[n.kind] ?? 'notifications') as any} size={20} color={Colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{n.title}</Text>
              <Text style={styles.cardBody} numberOfLines={2}>{n.body}</Text>
            </View>
            {!readIds.has(n.id) ? <View style={styles.unreadDot} /> : null}
          </View>
        )}
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
