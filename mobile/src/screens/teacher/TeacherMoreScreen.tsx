import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, Badge } from '../../components/UI';
import { Colors, Spacing, Fonts } from '../../theme';
import { useAuth } from '../../api/AuthContext';
import { AppHeader } from '../../components/AppHeader';
import { openNotifications } from '../../navigation/navigationRef';

export default function TeacherMoreScreen({ navigation }: any) {
  const { user, logout } = useAuth();

  const ITEMS: { icon: keyof typeof Ionicons.glyphMap; label: string; sub: string; onPress?: () => void }[] = [
    { icon: 'stats-chart-outline', label: 'Analytics', sub: 'Coming soon' },
    { icon: 'calendar-number-outline', label: 'Calendar', sub: 'Coming soon' },
    { icon: 'trending-up-outline', label: 'Weekly Efforts', sub: 'Log weekly student effort', onPress: () => navigation.navigate('WeeklyEfforts') },
    { icon: 'settings-outline', label: 'Settings', sub: 'Change password and preferences', onPress: () => navigation.navigate('ChangePassword') },
    { icon: 'help-circle-outline', label: 'Security Question', sub: 'Used to reset your password if you forget it', onPress: () => navigation.navigate('SecurityQuestionSetup') },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <AppHeader title="More" onPressBell={() => openNotifications()} />
      <ScrollView contentContainerStyle={{ padding: Spacing.md }}>
        <Card style={styles.identity}>
          <View style={styles.bigAvatar}><Text style={styles.bigAvatarText}>{(user?.username?.[0] ?? '?').toUpperCase()}</Text></View>
          <Text style={styles.name}>{user?.username}</Text>
          <Badge label="teacher" color={Colors.roleBadge.teacher} />
        </Card>

        {ITEMS.map((it) => (
          <TouchableOpacity key={it.label} disabled={!it.onPress} onPress={it.onPress} activeOpacity={0.8}>
            <Card style={styles.row}>
              <View style={styles.iconWrap}><Ionicons name={it.icon} size={20} color={Colors.primary} /></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>{it.label}</Text>
                <Text style={styles.sub}>{it.sub}</Text>
              </View>
              {it.onPress && <Ionicons name="chevron-forward" size={18} color={Colors.textSub} />}
            </Card>
          </TouchableOpacity>
        ))}

        <TouchableOpacity onPress={logout} activeOpacity={0.8}>
          <Card style={[styles.row, { justifyContent: 'center' }]}>
            <Ionicons name="log-out-outline" size={20} color={Colors.error} />
            <Text style={[styles.title, { color: Colors.error }]}>Log Out</Text>
          </Card>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  identity: { alignItems: 'center', gap: 6, paddingVertical: Spacing.lg },
  bigAvatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  bigAvatarText: { color: Colors.white, fontWeight: '800', fontSize: Fonts.sizes.xxl },
  name: { fontSize: Fonts.sizes.lg, fontWeight: '700', color: Colors.text },
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  iconWrap: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.primary + '18', alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: Fonts.sizes.md, fontWeight: '700', color: Colors.text },
  sub: { fontSize: Fonts.sizes.xs, color: Colors.textSub, marginTop: 2 },
});
