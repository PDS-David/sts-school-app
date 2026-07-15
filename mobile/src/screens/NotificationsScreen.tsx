import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Fonts, Radius } from '../theme';
import { useNotifications } from '../components/NotificationsContext';
import { Empty } from '../components/UI';

const KIND_ICON: Record<string, string> = {
  message: 'chatbubble', assessment: 'clipboard', grade: 'bar-chart', system: 'information-circle',
};

export default function NotificationsScreen({ navigation }: any) {
  const { notifications, markAllRead } = useNotifications();

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 6 }}>
          <Ionicons name="arrow-back" size={22} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity onPress={markAllRead} style={{ padding: 6 }}>
          <Text style={styles.markRead}>Mark all read</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={notifications}
        keyExtractor={n => n.id}
        contentContainerStyle={{ padding: Spacing.sm }}
        ListEmptyComponent={<Empty message="You're all caught up" />}
        renderItem={({ item: n }) => (
          <View style={styles.card}>
            <View style={styles.iconWrap}>
              <Ionicons name={(KIND_ICON[n.kind] ?? 'notifications') as any} size={20} color={Colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{n.title}</Text>
              <Text style={styles.cardBody} numberOfLines={2}>{n.body}</Text>
            </View>
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
  iconWrap: { width: 38, height: 38, borderRadius: 19, backgroundColor: Colors.primary + '18', alignItems: 'center', justifyContent: 'center' },
  cardTitle: { fontSize: Fonts.sizes.md, fontWeight: '700', color: Colors.text },
  cardBody: { fontSize: Fonts.sizes.sm, color: Colors.textSub, marginTop: 2 },
});
