import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../../api/client';
import { useAuth } from '../../api/AuthContext';
import { Card, Loader } from '../../components/UI';
import { Colors, Spacing, Fonts, Radius } from '../../theme';
import { AppHeader } from '../../components/AppHeader';
import { FAB } from '../../components/FAB';
import { openNotifications } from '../../navigation/navigationRef';

export default function TeacherDashboardHomeScreen({ navigation }: any) {
  const { user } = useAuth();
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

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <AppHeader
        title={`Hi, ${user?.username ?? ''}`}
        subtitle={term ? `${term.name} · ${term.academic_year}` : undefined}
        onPressBell={() => openNotifications()}
      />
      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={async () => { setRefreshing(true); await load(); setRefreshing(false); }} />}>
        <View style={styles.statsRow}>
          <View style={styles.statChip}>
            <Text style={styles.statVal}>{studentCount ?? '0'}</Text>
            <Text style={styles.statLabel}>{studentCount === null ? 'No class assigned yet' : 'Students'}</Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>Quick Actions</Text>
        <View style={styles.grid}>
          {quickActions.map((q) => (
            <TouchableOpacity key={q.label} style={styles.tile} onPress={q.onPress} activeOpacity={0.8}>
              <View style={styles.tileIcon}><Ionicons name={q.icon} size={22} color={Colors.primary} /></View>
              <Text style={styles.tileLabel}>{q.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionLabel}>Notifications</Text>
        <Card style={{ marginHorizontal: Spacing.md }}>
          <Text style={{ color: Colors.textSub, fontSize: Fonts.sizes.sm }}>
            Tap the bell above for pending items across your classes.
          </Text>
        </Card>

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
  statsRow: { flexDirection: 'row', padding: Spacing.md, gap: Spacing.sm },
  statChip: { flex: 1, backgroundColor: Colors.card, borderRadius: Radius.md, padding: Spacing.md, alignItems: 'center', elevation: 1 },
  statVal: { fontSize: Fonts.sizes.lg, fontWeight: '800', color: Colors.primary },
  statLabel: { fontSize: Fonts.sizes.xs, color: Colors.textSub, marginTop: 2 },
  sectionLabel: { fontSize: Fonts.sizes.md, fontWeight: '700', color: Colors.textSub, marginHorizontal: Spacing.md, marginTop: Spacing.sm, marginBottom: Spacing.xs },
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: Spacing.sm },
  tile: { width: '30%', margin: '1.5%', backgroundColor: Colors.card, borderRadius: Radius.md, padding: Spacing.sm, alignItems: 'center', elevation: 1, minHeight: 90, justifyContent: 'center' },
  tileIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.primary + '18', alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  tileLabel: { fontSize: Fonts.sizes.xs, fontWeight: '600', color: Colors.text, textAlign: 'center' },
});
