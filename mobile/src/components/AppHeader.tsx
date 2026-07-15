import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing, Fonts } from '../theme';
import { useAuth } from '../api/AuthContext';
import { useNotifications } from './NotificationsContext';

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  onPressAvatar?: () => void;
  onPressBell?: () => void;
  rightExtra?: React.ReactNode;
}

// A single top bar shared by every landing screen across every role, so the
// app always feels the same at the top regardless of which tab you're on —
// mirrors WhatsApp's consistent header pattern (title left, actions right).
export function AppHeader({ title, subtitle, onPressAvatar, onPressBell, rightExtra }: AppHeaderProps) {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { unreadCount } = useNotifications();

  return (
    <View style={[styles.wrap, { paddingTop: insets.top + Spacing.sm }]}>
      <View style={{ flex: 1 }}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text> : null}
      </View>

      <View style={styles.actions}>
        {rightExtra}

        <TouchableOpacity style={styles.iconBtn} onPress={onPressBell} activeOpacity={0.7}>
          <Ionicons name="notifications-outline" size={23} color={Colors.white} />
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.avatar} onPress={onPressAvatar} activeOpacity={0.7}>
          <Text style={styles.avatarText}>{(user?.username?.[0] ?? '?').toUpperCase()}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
  },
  title: { color: Colors.white, fontSize: Fonts.sizes.xl, fontWeight: '800' },
  subtitle: { color: Colors.white + 'CC', fontSize: Fonts.sizes.xs, marginTop: 2 },
  actions: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  iconBtn: { padding: 4 },
  badge: {
    position: 'absolute', top: -2, right: -2, minWidth: 16, height: 16, borderRadius: 8,
    backgroundColor: Colors.accent, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3,
  },
  badgeText: { color: Colors.white, fontSize: 9, fontWeight: '800' },
  avatar: {
    width: 34, height: 34, borderRadius: 17, backgroundColor: Colors.white + '30',
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { color: Colors.white, fontWeight: '800', fontSize: Fonts.sizes.md },
});
