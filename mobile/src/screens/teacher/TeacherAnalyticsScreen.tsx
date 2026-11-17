import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import api from '../../api/client';
import { Card, Btn, Loader, Empty } from '../../components/UI';
import { AppHeader } from '../../components/AppHeader';
import { openNotifications } from '../../navigation/navigationRef';
import { Colors, Fonts, Spacing } from '../../theme';

export default function TeacherAnalyticsScreen({ navigation }: any) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    setLoadError('');
    try {
      const response = await api.get('/scores/teacher/overview');
      setData(response.data);
    } catch (e: any) {
      setLoadError(e?.response?.data?.error ?? 'Could not load marking analytics. Check your connection and retry.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading && !data) return <Loader />;
  if (loadError && !data) return (
    <View style={{ flex: 1, backgroundColor: Colors.background, justifyContent: 'center', padding: Spacing.md }}>
      <Empty message={loadError} />
      <Btn label="Retry analytics" variant="outline" onPress={() => load()} />
    </View>
  );

  const summary = data?.summary ?? {};
  const subjects = data?.subjects ?? [];

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <AppHeader title="Teacher Analytics" subtitle={data?.term ? `${data.term.name} · ${data.term.academic_year}` : 'No current term'} onPressBell={() => openNotifications()} />
      <ScrollView contentContainerStyle={{ padding: Spacing.md }} refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={async () => { setRefreshing(true); await load(); setRefreshing(false); }} />
      }>
        {!!loadError && <Card><Text style={{ color: Colors.error, fontSize: Fonts.sizes.sm }}>{loadError}</Text><Btn label="Retry analytics" variant="outline" onPress={() => load()} style={{ marginTop: Spacing.sm }} /></Card>}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm }}>
          {[
            { label: 'Students', value: summary.student_count ?? 0 },
            { label: 'Marks pending', value: summary.pending_score_entries ?? 0 },
            { label: 'Marks entered', value: summary.marked_score_entries ?? 0 },
            { label: 'Expected marks', value: summary.expected_score_entries ?? 0 },
          ].map(item => (
            <Card key={item.label} style={{ flexGrow: 1, minWidth: '44%' }}>
              <Text style={{ color: Colors.textSub, fontSize: Fonts.sizes.xs }}>{item.label}</Text>
              <Text style={{ color: Colors.text, fontSize: 26, fontWeight: '800', marginTop: 4 }}>{item.value}</Text>
            </Card>
          ))}
        </View>

        <Card style={{ marginTop: Spacing.sm }}>
          <Text style={{ color: Colors.text, fontSize: Fonts.sizes.md, fontWeight: '700' }}>Academic performance</Text>
          <Text style={{ color: Colors.textSub, fontSize: Fonts.sizes.sm, marginTop: 8 }}>Average score: {summary.average_score ?? 'Not available'}</Text>
          <Text style={{ color: Colors.textSub, fontSize: Fonts.sizes.sm, marginTop: 4 }}>Pass rate (40% and above): {summary.pass_rate == null ? 'Not available' : `${summary.pass_rate}%`}</Text>
          <Text style={{ color: Colors.textSub, fontSize: Fonts.sizes.sm, marginTop: 4 }}>Average attendance: {summary.attendance_rate == null ? 'Not available for this assignment scope' : `${summary.attendance_rate}%`}</Text>
          <Text style={{ color: Colors.textSub, fontSize: Fonts.sizes.sm, marginTop: 4 }}>Weekly effort records: {summary.weekly_effort_entries ?? 0}</Text>
        </Card>

        <Text style={{ color: Colors.text, fontSize: Fonts.sizes.md, fontWeight: '700', marginTop: Spacing.lg, marginBottom: Spacing.xs }}>Marking by subject</Text>
        {subjects.length === 0 ? (
          <Card><Text style={{ color: Colors.textSub, fontSize: Fonts.sizes.sm }}>No score-entry subjects are assigned for the current term.</Text></Card>
        ) : subjects.map((subject: any) => (
          <Card key={subject.subject_id} style={{ marginBottom: Spacing.xs }}>
            <Text style={{ color: Colors.text, fontWeight: '700', fontSize: Fonts.sizes.md }}>{subject.subject_name}</Text>
            <Text style={{ color: Colors.textSub, fontSize: Fonts.sizes.xs, marginTop: 4 }}>
              {subject.marked_score_entries} entered · {subject.pending_score_entries} pending · {subject.expected_score_entries} expected
            </Text>
            <View style={{ height: 7, backgroundColor: Colors.border, borderRadius: 4, overflow: 'hidden', marginTop: 8 }}>
              <View style={{ height: 7, width: `${subject.expected_score_entries ? Math.min(100, subject.marked_score_entries / subject.expected_score_entries * 100) : 0}%`, backgroundColor: Colors.success }} />
            </View>
            <Text style={{ color: Colors.textSub, fontSize: Fonts.sizes.xs, marginTop: 5 }}>Average: {subject.average_score ?? 'Not available'}</Text>
          </Card>
        ))}

        <TouchableOpacity onPress={() => navigation.getParent()?.navigate('ClassesTab', { screen: 'ScoreEntry' })} style={{ backgroundColor: Colors.primary, padding: Spacing.md, borderRadius: 10, alignItems: 'center', marginTop: Spacing.md }}>
          <Text style={{ color: Colors.white, fontWeight: '700' }}>Open score entry</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
