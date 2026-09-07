import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import api from '../../api/client';
import { useAuth } from '../../api/AuthContext';
import { useAdminSchool } from '../../api/AdminSchoolContext';
import { Card, Loader } from '../../components/UI';
import { PageContainer } from '../../components/layout';
import { Colors, Spacing, Fonts, Radius } from '../../theme';
import { AppHeader } from '../../components/AppHeader';
import { openNotifications } from '../../navigation/navigationRef';

// Replaces the old shared DashboardScreen.tsx tile grid for the 'admin' role
// (Operations Admin). Admin has no school_code of its own (manages both
// schools), so branding/stats follow whichever school is currently selected
// in the switcher — same logic the old DashboardScreen used, carried over.
//
// Layout, corrected after live testing on web: the centre of the screen is
// for actually viewing/doing something, not menus — Quick Actions (was a
// second, screen-local mini-sidebar here, duplicating both the real
// persistent Sidebar's nav AND a FAB with the same three destinations) now
// lives in that one real Sidebar instead (see AdminTabs.tsx's
// QUICK_ACTIONS). The school switcher (was its own full-width bar below
// the header) and the term/student-count stats (was a separate stat-chip
// row in the centre) both fold into the header itself, at the same level
// as "Hi, admin" — via AppHeader's `rightExtra` slot and an extended
// subtitle line, respectively. That leaves this screen's own content
// genuinely empty for now, which is correct, not a bug — there's nothing
// this specific screen needs to show yet beyond what the header now
// carries; it becomes a real content area once there's something worth
// putting here (e.g. a future activity feed).
export default function AdminDashboardHomeScreen() {
  const { user } = useAuth();
  const { schools, selectedSchoolCode, selectSchool, loading: schoolsLoading } = useAdminSchool();
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
    } catch { /* offline */ }
    setLoading(false);
  }, [selectedSchoolCode]);

  useEffect(() => { load(); }, [load]);

  if (loading) return <Loader />;

  const subtitleParts = [
    term ? `${term.name} · ${term.academic_year}` : null,
    studentCount != null ? `${studentCount} Students` : null,
  ].filter(Boolean);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <AppHeader
        title={`Hi, ${user?.username ?? ''}`}
        subtitle={subtitleParts.join(' · ')}
        onPressBell={() => openNotifications()}
        rightExtra={
          !schoolsLoading && schools.length > 0 ? (
            <View style={styles.switcher}>
              {schools.map((s) => {
                const active = s.code === selectedSchoolCode;
                return (
                  <TouchableOpacity
                    key={s.code}
                    style={[styles.switcherChip, active && styles.switcherChipActive]}
                    onPress={() => selectSchool(s.code)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.switcherChipText, active && styles.switcherChipTextActive]} numberOfLines={1}>
                      {s.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : undefined
        }
      />
      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={async () => { setRefreshing(true); await load(); setRefreshing(false); }} />}>
        <PageContainer style={{ padding: Spacing.md }}>
          <Card>
            <Text style={{ color: Colors.textSub, fontSize: Fonts.sizes.sm }}>
              Use Academics, Chats, or More to get started — or Quick Actions in the sidebar for Students, Users, and Enter Scores.
            </Text>
          </Card>
        </PageContainer>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  switcher: { flexDirection: 'row', gap: 6 },
  switcherChip: { paddingVertical: 5, paddingHorizontal: Spacing.sm, borderRadius: Radius.lg, backgroundColor: Colors.white + '20', borderWidth: 1, borderColor: Colors.white + '40' },
  switcherChipActive: { backgroundColor: Colors.white, borderColor: Colors.white },
  switcherChipText: { fontSize: Fonts.sizes.xs, fontWeight: '700', color: Colors.white },
  switcherChipTextActive: { color: Colors.primary },
});
