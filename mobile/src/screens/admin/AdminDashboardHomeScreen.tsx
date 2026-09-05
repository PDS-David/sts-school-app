import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../../api/client';
import { useAuth } from '../../api/AuthContext';
import { useAdminSchool } from '../../api/AdminSchoolContext';
import { SchoolSwitcherBar } from '../../components/SchoolSwitcherBar';
import { Card, Loader } from '../../components/UI';
import { Colors, Spacing, Fonts, Radius } from '../../theme';
import { AppHeader } from '../../components/AppHeader';
import { FAB } from '../../components/FAB';
import { openNotifications } from '../../navigation/navigationRef';
import { getSchoolBrand } from '../../schoolBranding';

// Replaces the old shared DashboardScreen.tsx tile grid for the 'admin' role
// (Operations Admin) — same structural pattern already established by
// TeacherDashboardHomeScreen.tsx: AppHeader up top, a small stats row, a
// short "Quick Actions" grid for the handful of things admin does most
// often, everything else reachable via the More tab instead of one giant
// 11-tile grid. Admin has no school_code of its own (manages both schools),
// so branding/stats follow whichever school is currently selected in the
// switcher — same logic the old DashboardScreen used, carried over as-is.
export default function AdminDashboardHomeScreen({ navigation }: any) {
  const { user } = useAuth();
  const { selectedSchoolCode } = useAdminSchool();
  const [term, setTerm] = useState<any>(null);
  const [studentCount, setStudentCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const sc = selectedSchoolCode ?? undefined;
      const [s, t] = await Promise.all([
        api.get('/students', { params: { school_code: sc } }),
        api.get('/academic/terms/current', { params: { school_code: sc } }),
      ]);
      setStudentCount(s.data.students?.length ?? null);
      setTerm(t.data.term);
    } catch { /* offline — show quick actions anyway */ }
    setLoading(false);
  }, [selectedSchoolCode]);

  useEffect(() => { load(); }, [load]);

  if (loading) return <Loader />;

  const brand = getSchoolBrand(selectedSchoolCode ?? undefined);

  // The three highest-frequency admin actions — everything else (Class
  // Summary, Export Excel, Terms, Subjects, Audit Log, Class Locks, Deleted
  // Students) lives under the More tab now instead of crowding this grid.
  const quickActions: { icon: keyof typeof Ionicons.glyphMap; label: string; onPress: () => void }[] = [
    { icon: 'people-outline', label: 'Students', onPress: () => navigation.getParent()?.navigate('AcademicsTab', { screen: 'Students' }) },
    { icon: 'person-outline', label: 'Users', onPress: () => navigation.getParent()?.navigate('MoreTab', { screen: 'AdminUsers' }) },
    { icon: 'create-outline', label: 'Enter Scores', onPress: () => navigation.getParent()?.navigate('AcademicsTab', { screen: 'ScoreEntry' }) },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <AppHeader
        title={`Hi, ${user?.username ?? ''}`}
        subtitle={term ? `${term.name} · ${term.academic_year}` : brand?.name}
        onPressBell={() => openNotifications()}
      />
      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={async () => { setRefreshing(true); await load(); setRefreshing(false); }} />}>
        <SchoolSwitcherBar />

        <View style={styles.statsRow}>
          {term && (
            <View style={styles.statChip}>
              <Text style={styles.statVal}>{term.name}</Text>
              <Text style={styles.statLabel}>{term.academic_year}</Text>
            </View>
          )}
          <View style={styles.statChip}>
            <Text style={styles.statVal}>{studentCount ?? '—'}</Text>
            <Text style={styles.statLabel}>Students</Text>
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
            Tap the bell above for pending items across both schools.
          </Text>
        </Card>

        <View style={{ height: Spacing.xl * 2 }} />
      </ScrollView>

      <FAB
        icon="add"
        actions={[
          { icon: 'person-add-outline', label: 'Add student', onPress: () => navigation.getParent()?.navigate('AcademicsTab', { screen: 'AddStudent' }) },
          { icon: 'people-outline', label: 'Add user', onPress: () => navigation.getParent()?.navigate('MoreTab', { screen: 'AdminUsers' }) },
          { icon: 'create-outline', label: 'Enter scores', onPress: () => navigation.getParent()?.navigate('AcademicsTab', { screen: 'ScoreEntry' }) },
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
