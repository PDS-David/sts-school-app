import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
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
export default function TeacherDashboardHomeScreen({ navigation }: any) {
  const { user } = useAuth();
  const [term, setTerm] = useState<any>(null);
  const [studentCount, setStudentCount] = useState<number | null>(null);
  const [overview, setOverview] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    setLoadError('');
    const errors: string[] = [];
    try {
      const { data } = await api.get('/academic/terms/current');
      setTerm(data.term);
    } catch { errors.push('term details'); }
    try {
      const { data } = await api.get('/scores/teacher/overview');
      setOverview(data);
      setStudentCount(data.summary?.student_count ?? 0);
    } catch { errors.push('marking analytics'); }
    if (errors.length) setLoadError(`Could not refresh ${errors.join(' and ')}. Pull down or retry to try again.`);
    setLoading(false);
  }, [user?.assigned_class]);

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
          {!!loadError && <Card style={{ marginBottom: Spacing.sm }}><Text style={{ color: Colors.error, fontSize: Fonts.sizes.sm }}>{loadError}</Text><TouchableOpacity onPress={() => load()} style={{ marginTop: Spacing.sm }}><Text style={{ color: Colors.primary, fontWeight: '700' }}>Retry dashboard</Text></TouchableOpacity></Card>}
          <Card>
            <Text style={{ color: Colors.textSub, fontSize: Fonts.sizes.sm }}>
              Use Classes, Chats, or More to get started — or Quick Actions in the sidebar for Enter Scores, Attendance, and Students.
            </Text>
          </Card>
          {overview?.summary ? (
            <>
              <Card style={{ marginTop: Spacing.md }}>
                <Text style={{ color: Colors.textSub, fontSize: Fonts.sizes.sm }}>Pending marks this term</Text>
                <Text style={{ color: Colors.text, fontSize: 30, fontWeight: '800' }}>{overview.summary.pending_score_entries ?? 0}</Text>
                <Text style={{ color: Colors.textSub, fontSize: Fonts.sizes.xs }}>
                  {overview.summary.marked_score_entries ?? 0} of {overview.summary.expected_score_entries ?? 0} expected subject marks entered
                </Text>
                <TouchableOpacity onPress={() => navigation.getParent()?.navigate('ClassesTab', { screen: 'ScoreEntry' })} style={{ marginTop: 10 }}>
                  <Text style={{ color: Colors.primary, fontWeight: '700' }}>Enter or complete marks</Text>
                </TouchableOpacity>
              </Card>
              <Card style={{ marginTop: Spacing.sm }}>
                <Text style={{ color: Colors.textSub, fontSize: Fonts.sizes.sm }}>Term performance</Text>
                <Text style={{ color: Colors.text, fontSize: Fonts.sizes.md, fontWeight: '700', marginTop: 5 }}>
                  Average: {overview.summary.average_score ?? '—'} · Pass rate: {overview.summary.pass_rate == null ? '—' : `${overview.summary.pass_rate}%`}
                </Text>
                <Text style={{ color: Colors.textSub, fontSize: Fonts.sizes.xs, marginTop: 4 }}>
                  {overview.summary.attendance_rate == null ? 'Attendance analytics unavailable for this assignment scope' : `Average attendance: ${overview.summary.attendance_rate}%`}
                </Text>
              </Card>
            </>
          ) : null}
        </PageContainer>
      </ScrollView>
    </View>
  );
}
