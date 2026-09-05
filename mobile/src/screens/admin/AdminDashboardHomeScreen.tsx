import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, useWindowDimensions } from 'react-native';
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
// short "Quick Actions" list for the handful of things admin does most
// often, everything else reachable via the More tab instead of one giant
// 11-tile grid. Admin has no school_code of its own (manages both schools),
// so branding/stats follow whichever school is currently selected in the
// switcher — same logic the old DashboardScreen used, carried over as-is.
//
// Layout: on a wide viewport (web/tablet — plenty of unused horizontal
// space otherwise, as seen testing this on web), Quick Actions becomes a
// fixed-width left sidebar, top-to-bottom, with stats/notifications filling
// the remaining space to its right. On a narrow phone screen there's no
// room for a sidebar, so it falls back to a single stacked column — Quick
// Actions is still a top-to-bottom list there too, just not positioned as
// a sidebar; there's nothing to its side to share space with.
const WIDE_BREAKPOINT = 768;

export default function AdminDashboardHomeScreen({ navigation }: any) {
  const { user } = useAuth();
  const { selectedSchoolCode } = useAdminSchool();
  const { width } = useWindowDimensions();
  const isWide = width >= WIDE_BREAKPOINT;
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
  // Students) lives under the More tab now instead of crowding this list.
  const quickActions: { icon: keyof typeof Ionicons.glyphMap; label: string; onPress: () => void }[] = [
    { icon: 'people-outline', label: 'Students', onPress: () => navigation.getParent()?.navigate('AcademicsTab', { screen: 'Students' }) },
    { icon: 'person-outline', label: 'Users', onPress: () => navigation.getParent()?.navigate('MoreTab', { screen: 'AdminUsers' }) },
    { icon: 'create-outline', label: 'Enter Scores', onPress: () => navigation.getParent()?.navigate('AcademicsTab', { screen: 'ScoreEntry' }) },
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

      <Text style={styles.sectionLabel}>Notifications</Text>
      <Card style={{ marginHorizontal: Spacing.md }}>
        <Text style={{ color: Colors.textSub, fontSize: Fonts.sizes.sm }}>
          Tap the bell above for pending items across both schools.
        </Text>
      </Card>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <AppHeader
        title={`Hi, ${user?.username ?? ''}`}
        subtitle={term ? `${term.name} · ${term.academic_year}` : brand?.name}
        onPressBell={() => openNotifications()}
      />
      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={async () => { setRefreshing(true); await load(); setRefreshing(false); }} />}>
        <SchoolSwitcherBar />

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
          { icon: 'person-add-outline', label: 'Add student', onPress: () => navigation.getParent()?.navigate('AcademicsTab', { screen: 'AddStudent' }) },
          { icon: 'people-outline', label: 'Add user', onPress: () => navigation.getParent()?.navigate('MoreTab', { screen: 'AdminUsers' }) },
          { icon: 'create-outline', label: 'Enter scores', onPress: () => navigation.getParent()?.navigate('AcademicsTab', { screen: 'ScoreEntry' }) },
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
  // Top-to-bottom list, replacing the old wrapping 3-column grid — each
  // action is now a full-width row (icon + label + chevron) rather than a
  // square tile.
  actionList: { paddingHorizontal: Spacing.md, gap: Spacing.xs },
  actionRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.card, borderRadius: Radius.md, padding: Spacing.sm, elevation: 1 },
  actionIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.primary + '18', alignItems: 'center', justifyContent: 'center', marginRight: Spacing.sm },
  actionLabel: { flex: 1, fontSize: Fonts.sizes.sm, fontWeight: '600', color: Colors.text },
});
