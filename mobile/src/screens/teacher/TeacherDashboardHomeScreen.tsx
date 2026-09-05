import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../../api/client';
import { useAuth } from '../../api/AuthContext';
import { Card, Loader } from '../../components/UI';
import { Colors, Spacing, Fonts, Radius } from '../../theme';
import { AppHeader } from '../../components/AppHeader';
import { FAB } from '../../components/FAB';
import { openNotifications } from '../../navigation/navigationRef';

// Same wide-screen-sidebar / narrow-screen-stacked-list treatment as
// AdminDashboardHomeScreen.tsx — see that file's comment for the reasoning.
const WIDE_BREAKPOINT = 768;

export default function TeacherDashboardHomeScreen({ navigation }: any) {
  const { user } = useAuth();
  const { width } = useWindowDimensions();
  const isWide = width >= WIDE_BREAKPOINT;
  const [term, setTerm] = useState<any>(null);
  const [studentCount, setStudentCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      // A teacher with no assigned_class (a subject-only specialist) no
      // longer gets a whole-school student count from GET /students with
      // no class_name (Pass 20 tightened that to prevent an unscoped
      // roster fetch) — skip the call entirely for that case rather than
      // show a misleading "0 Students" stat; '—' below already renders for
      // a null count.
      const calls: [Promise<any>, Promise<any>] = [
        api.get('/academic/terms/current'),
        user?.assigned_class ? api.get('/students') : Promise.resolve({ data: { students: null } }),
      ];
      const [t, s] = await Promise.all(calls);
      setTerm(t.data.term);
      setStudentCount(s.data.students?.length ?? null);
    } catch { /* offline */ }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) return <Loader />;

  // Teachers only ever CRUD their own students, enter CA1/CA2/Exam scores,
  // take attendance, and generate report cards — no "create assessment" or
  // AI marking action belongs here. See TeacherTabs.tsx for the full policy
  // note.
  const quickActions: { icon: keyof typeof Ionicons.glyphMap; label: string; onPress: () => void }[] = [
    { icon: 'create-outline', label: 'Enter Scores', onPress: () => navigation.getParent()?.navigate('ClassesTab', { screen: 'ScoreEntry' }) },
    { icon: 'calendar-outline', label: 'Attendance', onPress: () => navigation.getParent()?.navigate('ClassesTab', { screen: 'Attendance' }) },
    { icon: 'people-outline', label: 'Students', onPress: () => navigation.getParent()?.navigate('ClassesTab', { screen: 'Students' }) },
  ];

  const quickActionsList = (
    <View>
      <Text style={styles.sectionLabel}>Quick Actions</Text>
      <View style={styles.actionList}>
        {quickActions.map((q) => (
          <TouchableOpacity key={q.label} style={styles.actionRow} onPress={q.onPress} activeOpacity={0.8}>
            <View style={styles.actionIcon}><Ionicons name={q.icon} size={20} color={Colors.primary} /></View>
            <Text style={styles.actionLabel}>{q.label}</Text>
            <Ionicons name="chevron-forward" size={16} color={Colors.textSub} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const statsAndNotifications = (
    <View style={{ flex: 1 }}>
      <View style={styles.statsRow}>
        <View style={styles.statChip}>
          <Text style={styles.statVal}>{studentCount ?? '0'}</Text>
          <Text style={styles.statLabel}>{studentCount === null ? 'No class assigned yet' : 'Students'}</Text>
        </View>
      </View>

      <Text style={styles.sectionLabel}>Notifications</Text>
      <Card style={{ marginHorizontal: Spacing.md }}>
        <Text style={{ color: Colors.textSub, fontSize: Fonts.sizes.sm }}>
          Tap the bell above for pending items across your classes.
        </Text>
      </Card>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <AppHeader
        title={`Hi, ${user?.username ?? ''}`}
        subtitle={term ? `${term.name} · ${term.academic_year}` : undefined}
        onPressBell={() => openNotifications()}
      />
      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={async () => { setRefreshing(true); await load(); setRefreshing(false); }} />}>
        {isWide ? (
          <View style={styles.wideRow}>
            <View style={styles.sidebar}>{quickActionsList}</View>
            <View style={styles.wideMain}>{statsAndNotifications}</View>
          </View>
        ) : (
          <>
            {statsAndNotifications}
            {quickActionsList}
          </>
        )}

        <View style={{ height: Spacing.xl * 2 }} />
      </ScrollView>

      <FAB
        icon="add"
        actions={[
          { icon: 'document-attach-outline', label: 'Add resource', onPress: () => navigation.getParent()?.navigate('ClassesTab', { screen: 'Materials' }) },
          { icon: 'create-outline', label: 'Enter scores', onPress: () => navigation.getParent()?.navigate('ClassesTab', { screen: 'ScoreEntry' }) },
          { icon: 'checkmark-done-outline', label: 'Take attendance', onPress: () => navigation.getParent()?.navigate('ClassesTab', { screen: 'Attendance' }) },
          { icon: 'megaphone-outline', label: 'New announcement', onPress: () => navigation.getParent()?.navigate('ChatsTab') },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wideRow: { flexDirection: 'row', alignItems: 'flex-start' },
  sidebar: { width: 260, paddingRight: Spacing.sm },
  wideMain: { flex: 1 },
  statsRow: { flexDirection: 'row', padding: Spacing.md, gap: Spacing.sm },
  statChip: { flex: 1, backgroundColor: Colors.card, borderRadius: Radius.md, padding: Spacing.md, alignItems: 'center', elevation: 1 },
  statVal: { fontSize: Fonts.sizes.lg, fontWeight: '800', color: Colors.primary },
  statLabel: { fontSize: Fonts.sizes.xs, color: Colors.textSub, marginTop: 2 },
  sectionLabel: { fontSize: Fonts.sizes.md, fontWeight: '700', color: Colors.textSub, marginHorizontal: Spacing.md, marginTop: Spacing.sm, marginBottom: Spacing.xs },
  actionList: { paddingHorizontal: Spacing.md, gap: Spacing.xs },
  actionRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.card, borderRadius: Radius.md, padding: Spacing.sm, elevation: 1 },
  actionIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.primary + '18', alignItems: 'center', justifyContent: 'center', marginRight: Spacing.sm },
  actionLabel: { flex: 1, fontSize: Fonts.sizes.sm, fontWeight: '600', color: Colors.text },
});
