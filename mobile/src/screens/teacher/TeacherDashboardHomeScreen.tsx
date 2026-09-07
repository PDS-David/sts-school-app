import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import api from '../../api/client';
import { useAuth } from '../../api/AuthContext';
import { Card, Loader } from '../../components/UI';
import { PageContainer } from '../../components/layout';
import { Colors, Spacing, Fonts } from '../../theme';
import { AppHeader } from '../../components/AppHeader';
import { openNotifications } from '../../navigation/navigationRef';

// Corrected after live testing on web, same reasoning as
// AdminDashboardHomeScreen.tsx: Quick Actions (was a screen-local
// mini-sidebar here, duplicating both the real persistent Sidebar's nav
// AND a FAB with the same destinations) now lives in that one real
// Sidebar instead (see TeacherTabs.tsx's QUICK_ACTIONS). Student count
// folds into the header subtitle rather than a separate centre stat row.
export default function TeacherDashboardHomeScreen() {
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
      // show a misleading "0 Students" stat.
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

  const subtitleParts = [
    term ? `${term.name} · ${term.academic_year}` : null,
    studentCount != null ? `${studentCount} Students` : null,
  ].filter(Boolean);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <AppHeader
        title={`Hi, ${user?.username ?? ''}`}
        subtitle={subtitleParts.join(' · ') || undefined}
        onPressBell={() => openNotifications()}
      />
      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={async () => { setRefreshing(true); await load(); setRefreshing(false); }} />}>
        <PageContainer style={{ padding: Spacing.md }}>
          <Card>
            <Text style={{ color: Colors.textSub, fontSize: Fonts.sizes.sm }}>
              Use Classes, Chats, or More to get started — or Quick Actions in the sidebar for Enter Scores, Attendance, and Students.
            </Text>
          </Card>
        </PageContainer>
      </ScrollView>
    </View>
  );
}
