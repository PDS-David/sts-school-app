import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../api/AuthContext';
import { useWards } from '../api/WardContext';
import { useAdminSchool } from '../api/AdminSchoolContext';
import { SchoolSwitcherBar } from '../components/SchoolSwitcherBar';
import api from '../api/client';
import { Card, Badge, Loader } from '../components/UI';
import { Colors, Spacing, Fonts, Radius } from '../theme';
import { getSchoolBrand } from '../schoolBranding';

interface DashTile { icon: string; label: string; screen: string; color: string; }

const TILES: Record<string, DashTile[]> = {
  student: [
    { icon: 'bar-chart',      label: 'My Results',     screen: 'MyResults',    color: '#1565C0' },
    { icon: 'book',           label: 'Materials',      screen: 'Materials',    color: '#6A1B9A' },
    { icon: 'clipboard',      label: 'Assessments',    screen: 'Assessments',  color: '#00838F' },
    { icon: 'chatbubbles',    label: 'Messages',       screen: 'Messages',     color: '#2E7D32' },
    { icon: 'trending-up',    label: 'Weekly Report',  screen: 'WeeklyEfforts',color: '#E65100' },
  ],
  parent: [
    { icon: 'bar-chart',      label: "Ward's Results", screen: 'MyResults',    color: '#1565C0' },
    { icon: 'trending-up',    label: 'Weekly Efforts', screen: 'WeeklyEfforts',color: '#E65100' },
    { icon: 'chatbubbles',    label: 'Messages',       screen: 'Messages',     color: '#2E7D32' },
    { icon: 'receipt',        label: 'Fees',           screen: 'Finance',      color: '#827717' },
  ],
  teacher: [
    { icon: 'people',         label: 'Students',       screen: 'Students',     color: '#1565C0' },
    { icon: 'create',         label: 'Enter Scores',   screen: 'ScoreEntry',   color: '#2E7D32' },
    { icon: 'calendar',       label: 'Attendance',     screen: 'Attendance',   color: '#E65100' },
    { icon: 'book',           label: 'Materials',      screen: 'Materials',    color: '#6A1B9A' },
    { icon: 'clipboard',      label: 'Assessments',    screen: 'Assessments',  color: '#00838F' },
    { icon: 'trending-up',    label: 'Weekly Efforts', screen: 'WeeklyEfforts',color: '#F57F17' },
    { icon: 'chatbubbles',    label: 'Messages',       screen: 'Messages',     color: '#4527A0' },
  ],
  admin: [
    { icon: 'people',         label: 'Students',       screen: 'Students',     color: '#1565C0' },
    { icon: 'person',         label: 'Users',          screen: 'AdminUsers',   color: '#880E4F' },
    { icon: 'bar-chart',      label: 'Class Summary',  screen: 'ClassSummary', color: '#2E7D32' },
    { icon: 'document',       label: 'Export Excel',   screen: 'ExportExcel',  color: '#1B5E20' },
    { icon: 'create',         label: 'Enter Scores',   screen: 'ScoreEntry',   color: '#E65100' },
    { icon: 'calendar',       label: 'Terms',          screen: 'TermsMgmt',    color: '#827717' },
    { icon: 'list',           label: 'Subjects',       screen: 'SubjectsMgmt', color: '#00838F' },
    { icon: 'chatbubbles',    label: 'Messages',       screen: 'Messages',     color: '#4527A0' },
    { icon: 'shield',         label: 'Audit Log',      screen: 'AuditLog',     color: '#37474F' },
    { icon: 'lock-closed',    label: 'Class Locks',    screen: 'ClassLock',    color: '#B71C1C' },
    { icon: 'trash-bin',      label: 'Deleted Students', screen: 'DeletedStudents', color: '#6D4C41' },
  ],
  // Separate path from admin (Operations Admin) — finance_admin only ever
  // sees these tiles; it has no route to Users/Terms/Subjects/Audit/etc.,
  // and admin above has no route to Finance any more.
  finance_admin: [
    { icon: 'receipt',        label: 'Finance',        screen: 'Finance',      color: '#4E342E' },
    { icon: 'chatbubbles',    label: 'Messages',       screen: 'Messages',     color: '#4527A0' },
  ],
};

export default function DashboardScreen({ navigation }: any) {
  const { user, logout } = useAuth();
  const { wards, selectedWardId, selectWard } = useWards();
  const { selectedSchoolCode } = useAdminSchool();
  const isAdmin = user?.role === 'admin';
  const isFinanceAdmin = user?.role === 'finance_admin';
  const [stats,     setStats]     = useState<any>(null);
  const [refreshing,setRefreshing]= useState(false);

  const fetchStats = async () => {
    try {
      if (user?.role === 'teacher' || user?.role === 'admin') {
        // Admin has no school of their own — everything here needs whichever
        // school is currently selected in the switcher, or it's the same
        // "school_code=NULL → nothing comes back" bug as everywhere else.
        const sc = isAdmin ? (selectedSchoolCode ?? undefined) : undefined;
        const [s, t] = await Promise.all([
          api.get('/students', { params: { school_code: sc } }),
          api.get('/academic/terms/current', { params: { school_code: sc } }),
        ]);
        setStats({ student_count: s.data.students.length, term: t.data.term });
      }
    } catch { /* offline — show tiles anyway */ }
  };

  useEffect(() => { fetchStats(); }, [selectedSchoolCode]);

  const tiles = TILES[user?.role ?? 'student'] ?? [];
  // Admin and finance_admin's own school_code is null (each manages both
  // schools), so branding follows whichever school is selected in the switcher.
  const brand = getSchoolBrand((isAdmin || isFinanceAdmin) ? selectedSchoolCode ?? undefined : user?.school_code);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={async () => { setRefreshing(true); await fetchStats(); setRefreshing(false); }} />}
    >
      {/* Header */}
      <View style={styles.headerBar}>
        <View style={styles.headerLeft}>
          {brand && (
            <Image source={brand.logo} style={styles.headerLogo} resizeMode="contain" />
          )}
          <View style={{ flex: 1 }}>
            <Text style={styles.greeting}>Hello, {user?.username} 👋</Text>
            <Badge label={user?.role ?? ''} color={Colors.roleBadge[user?.role ?? 'student']} />
            {brand && <Text style={styles.schoolNameSmall} numberOfLines={2}>{brand.name}</Text>}
          </View>
        </View>
        <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
          <Ionicons name="log-out-outline" size={24} color={Colors.white} />
        </TouchableOpacity>
      </View>

      {/* Motto banner */}
      {brand && (
        <View style={styles.mottoBanner}>
          <Text style={styles.mottoText} numberOfLines={2}>{brand.motto}</Text>
        </View>
      )}

      {/* Child switcher (parent, only shown once we know who their wards are) */}
      {user?.role === 'parent' && wards.length > 0 && (
        <View style={styles.wardSection}>
          <Text style={styles.sectionLabel}>Your Children</Text>
          <View style={styles.wardRow}>
            {wards.map(w => {
              const active = w.id === selectedWardId;
              return (
                <TouchableOpacity
                  key={w.id}
                  style={[styles.wardChip, active && styles.wardChipActive]}
                  onPress={() => selectWard(w.id)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.wardChipText, active && styles.wardChipTextActive]} numberOfLines={1}>
                    {w.full_name}
                  </Text>
                  <Text style={[styles.wardChipSub, active && styles.wardChipTextActive]} numberOfLines={1}>
                    {w.class_name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <Text style={styles.wardHint}>
            Everything below (Results, Weekly Efforts, Fees) shows {wards.find(w => w.id === selectedWardId)?.full_name ?? 'the selected child'} only.
          </Text>
        </View>
      )}
      {user?.role === 'parent' && wards.length === 0 && (
        <View style={styles.wardSection}>
          <Text style={styles.wardHint}>No children are linked to your account yet. Contact the school admin.</Text>
        </View>
      )}

      {/* School switcher (admin/finance_admin only — neither is tied to a single school) */}
      {(isAdmin || isFinanceAdmin) && <SchoolSwitcherBar />}

      {/* Stats strip (teacher/admin) */}
      {stats && (
        <View style={styles.statsRow}>
          {stats.term && (
            <View style={styles.statChip}>
              <Text style={styles.statVal}>{stats.term.name}</Text>
              <Text style={styles.statLabel}>{stats.term.academic_year}</Text>
            </View>
          )}
          {stats.student_count !== undefined && (
            <View style={styles.statChip}>
              <Text style={styles.statVal}>{stats.student_count}</Text>
              <Text style={styles.statLabel}>Students</Text>
            </View>
          )}
        </View>
      )}

      {/* Tile grid */}
      <Text style={styles.sectionLabel}>Quick Access</Text>
      <View style={styles.grid}>
        {tiles.map((t) => (
          <TouchableOpacity
            key={t.screen}
            style={[styles.tile, { borderTopColor: t.color }]}
            onPress={() => navigation.navigate(t.screen)}
            activeOpacity={0.8}
          >
            <View style={[styles.tileIcon, { backgroundColor: t.color + '18' }]}>
              <Ionicons name={t.icon as any} size={26} color={t.color} />
            </View>
            <Text style={styles.tileLabel}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ height: Spacing.xl }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:    { flex: 1, backgroundColor: Colors.background },
  headerBar:    { backgroundColor: Colors.primary, padding: Spacing.lg, paddingTop: Spacing.xl + 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerLeft:   { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, flex: 1 },
  headerLogo:   { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.white },
  schoolNameSmall: { color: Colors.white + 'CC', fontSize: Fonts.sizes.xs, marginTop: 4 },
  mottoBanner:  { backgroundColor: Colors.primary + 'E6', paddingHorizontal: Spacing.lg, paddingBottom: Spacing.sm },
  mottoText:    { color: Colors.white, fontSize: Fonts.sizes.xs, fontStyle: 'italic' },
  greeting:     { fontSize: Fonts.sizes.lg, fontWeight: '700', color: Colors.white, marginBottom: 4 },
  logoutBtn:    { padding: 8 },
  statsRow:     { flexDirection: 'row', padding: Spacing.md, gap: Spacing.sm },
  statChip:     { flex: 1, backgroundColor: Colors.card, borderRadius: Radius.md, padding: Spacing.md, alignItems: 'center', elevation: 1 },
  statVal:      { fontSize: Fonts.sizes.lg, fontWeight: '800', color: Colors.primary },
  statLabel:    { fontSize: Fonts.sizes.xs, color: Colors.textSub, marginTop: 2 },
  sectionLabel: { fontSize: Fonts.sizes.md, fontWeight: '700', color: Colors.textSub, paddingHorizontal: Spacing.md, marginTop: Spacing.sm, marginBottom: Spacing.xs },
  wardSection:  { paddingHorizontal: Spacing.md, marginTop: Spacing.sm },
  wardRow:      { flexDirection: 'row', gap: Spacing.sm, flexWrap: 'wrap' },
  wardChip:     { paddingVertical: Spacing.sm, paddingHorizontal: Spacing.md, borderRadius: Radius.md, backgroundColor: Colors.card, borderWidth: 1.5, borderColor: Colors.border, minWidth: 110 },
  wardChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  wardChipText: { fontSize: Fonts.sizes.sm, fontWeight: '700', color: Colors.text },
  wardChipSub:  { fontSize: Fonts.sizes.xs, color: Colors.textSub, marginTop: 1 },
  wardChipTextActive: { color: Colors.white },
  wardHint:     { fontSize: Fonts.sizes.xs, color: Colors.textSub, marginTop: Spacing.xs, fontStyle: 'italic' },
  grid:         { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: Spacing.sm },
  tile:         { width: '46%', margin: '2%', backgroundColor: Colors.card, borderRadius: Radius.md, padding: Spacing.md, borderTopWidth: 3, elevation: 2, alignItems: 'center' },
  tileIcon:     { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.sm },
  tileLabel:    { fontSize: Fonts.sizes.sm, fontWeight: '600', color: Colors.text, textAlign: 'center' },
});
