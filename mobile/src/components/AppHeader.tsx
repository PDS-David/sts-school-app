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
//
// Log Out is NOT here — it was, briefly (commit a28a9c6), to fix a real
// discoverability gap found in live testing. Moved to Sidebar.tsx's bottom
// instead per direct owner feedback after testing THAT version: the header
// icon rendered but silently did nothing on web, because it used React
// Native's Alert.alert() for confirmation, which react-native-web does not
// reliably implement (no visible dialog appears, so the tap looked dead).
// The sidebar only exists on wide/web layouts anyway (see SidebarLayout
// below), so it's also a better fit than a header icon that would need
// separate web-safe-confirmation handling in two places instead of one.
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
