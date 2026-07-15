import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Spacing, Fonts } from '../theme';

interface ChatListItemProps {
  name: string;
  subtitle: string;
  timeLabel?: string;
  unread?: number;
  onPress: () => void;
}

export function ChatListItem({ name, subtitle, timeLabel, unread, onPress }: ChatListItemProps) {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{name?.[0]?.toUpperCase() ?? '?'}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.name} numberOfLines={1}>{name}</Text>
        <Text style={[styles.subtitle, !!unread && styles.subtitleUnread]} numberOfLines={1}>{subtitle}</Text>
      </View>
      <View style={{ alignItems: 'flex-end', gap: 6 }}>
        {timeLabel ? <Text style={styles.time}>{timeLabel}</Text> : null}
        {!!unread && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>{unread > 99 ? '99+' : unread}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    paddingVertical: Spacing.sm, paddingHorizontal: Spacing.md,
    borderBottomWidth: 1, borderBottomColor: Colors.border, backgroundColor: Colors.card,
  },
  avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: Colors.white, fontWeight: '800', fontSize: Fonts.sizes.lg },
  name: { fontSize: Fonts.sizes.md, fontWeight: '700', color: Colors.text },
  subtitle: { fontSize: Fonts.sizes.sm, color: Colors.textSub, marginTop: 2 },
  subtitleUnread: { color: Colors.text, fontWeight: '600' },
  time: { fontSize: Fonts.sizes.xs, color: Colors.textSub },
  unreadBadge: { backgroundColor: Colors.success, borderRadius: 10, minWidth: 20, height: 20, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 5 },
  unreadText: { color: Colors.white, fontSize: 10, fontWeight: '800' },
});
