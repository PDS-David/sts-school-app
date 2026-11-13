import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../../api/client';
import { Card, Loader } from '../../components/UI';
import { Colors, Spacing, Fonts } from '../../theme';
import { AppHeader } from '../../components/AppHeader';
import { openNotifications } from '../../navigation/navigationRef';

type UpcomingAssessment = {
  id: string; school_code: string; title: string; subject_name: string; class_name: string | null;
  start_at: string | null; end_at: string | null;
};
type SchoolEvent = {
  id: number; school_code: string; title: string; description: string | null; event_type: string;
  start_at: string; end_at: string | null; class_name: string | null;
};

function dateLabel(value: string | null): string {
  if (!value) return 'Date to be announced';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Date to be announced' : date.toLocaleString();
}

export default function ParentActivitiesScreen({ navigation }: any) {
  const [assessments, setAssessments] = useState<UpcomingAssessment[]>([]);
  const [events, setEvents] = useState<SchoolEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [testsError, setTestsError] = useState(false);
  const [eventsError, setEventsError] = useState(false);

  const load = useCallback(async () => {
    const [testsResult, eventsResult] = await Promise.allSettled([
      api.get('/learning/parent/upcoming-assessments'),
      api.get('/school-events'),
    ]);
    setTestsError(testsResult.status === 'rejected');
    setEventsError(eventsResult.status === 'rejected');
    if (testsResult.status === 'fulfilled') setAssessments(testsResult.value.data.assessments ?? []);
    if (eventsResult.status === 'fulfilled') setEvents(eventsResult.value.data.events ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) return <Loader />;

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <AppHeader title="Activities" onPressBell={() => openNotifications()} />
      <ScrollView
        contentContainerStyle={{ padding: Spacing.md }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={async () => { setRefreshing(true); await load(); setRefreshing(false); }} />}
      >
        <Text style={styles.section}>Upcoming Tests</Text>
        {testsError ? <Card><Text style={styles.sub}>{assessments.length ? 'Could not refresh upcoming tests. Showing the last available list.' : 'Could not load upcoming tests. Pull down to retry.'}</Text></Card> : null}
        {!testsError && assessments.length === 0 ? (
          <Card><Text style={styles.sub}>No upcoming tests have been published for your children.</Text></Card>
        ) : !testsError ? assessments.map(test => (
          <Card key={test.id} style={styles.card}>
            <View style={styles.icon}><Ionicons name="clipboard-outline" size={22} color={Colors.primary} /></View>
            <View style={styles.content}>
              <Text style={styles.title}>{test.title}</Text>
              <Text style={styles.sub}>{test.school_code} · {test.subject_name}{test.class_name ? ` · ${test.class_name}` : ''}</Text>
              <Text style={styles.date}>{dateLabel(test.start_at)}</Text>
              {test.end_at ? <Text style={styles.sub}>Closes: {dateLabel(test.end_at)}</Text> : null}
            </View>
          </Card>
        ))}

        <Text style={styles.section}>School Calendar & Events</Text>
        {eventsError ? <Card><Text style={styles.sub}>{events.length ? 'Could not refresh school events. Showing the last available list.' : 'Could not load school events. Pull down to retry.'}</Text></Card> : null}
        {!eventsError && events.length === 0 ? (
          <Card><Text style={styles.sub}>No school events are scheduled in the current calendar window.</Text></Card>
        ) : !eventsError ? events.map(event => (
          <Card key={String(event.id)} style={styles.card}>
            <View style={styles.icon}><Ionicons name={event.event_type === 'holiday' ? 'sunny-outline' : event.event_type === 'exam' ? 'school-outline' : 'calendar-outline'} size={22} color={Colors.primary} /></View>
            <View style={styles.content}>
              <Text style={styles.title}>{event.title}</Text>
              <Text style={styles.sub}>{event.school_code} · {event.event_type.toUpperCase()}{event.class_name ? ` · ${event.class_name}` : ''}</Text>
              <Text style={styles.date}>{dateLabel(event.start_at)}</Text>
              {event.end_at ? <Text style={styles.sub}>Ends: {dateLabel(event.end_at)}</Text> : null}
              {event.description ? <Text style={styles.sub}>{event.description}</Text> : null}
            </View>
          </Card>
        ))}

        <Text style={styles.section}>Assignments & Results</Text>
        <TouchableOpacity onPress={() => navigation.navigate('MyResults')} activeOpacity={0.8}>
          <Card style={styles.card}>
            <View style={styles.icon}><Ionicons name="clipboard-outline" size={22} color={Colors.primary} /></View>
            <View style={styles.content}>
              <Text style={styles.title}>Assignments and Results</Text>
              <Text style={styles.sub}>View your child's available results and academic records.</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.textSub} />
          </Card>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { fontSize: Fonts.sizes.md, fontWeight: '700', color: Colors.textSub, marginTop: Spacing.md, marginBottom: Spacing.xs },
  card: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm },
  icon: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.primary + '20', alignItems: 'center', justifyContent: 'center' },
  content: { flex: 1 },
  title: { fontSize: Fonts.sizes.md, fontWeight: '700', color: Colors.text },
  sub: { fontSize: Fonts.sizes.xs, color: Colors.textSub, marginTop: 3 },
  date: { fontSize: Fonts.sizes.sm, fontWeight: '600', color: Colors.text, marginTop: 5 },
});
