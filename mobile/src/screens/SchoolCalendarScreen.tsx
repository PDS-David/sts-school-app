import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../api/client';
import { AppHeader } from '../components/AppHeader';
import { Card, Loader } from '../components/UI';
import { openNotifications } from '../navigation/navigationRef';
import { Colors, Fonts, Spacing } from '../theme';

type SchoolEvent = {
  id: number; school_code: string; title: string; description: string | null;
  event_type: 'event' | 'exam' | 'holiday' | 'meeting' | 'deadline';
  class_name: string | null; start_at: string; end_at: string | null;
};

function formatDate(value: string | null): string {
  if (!value) return 'Date to be announced';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Date to be announced' : date.toLocaleString();
}

export default function SchoolCalendarScreen() {
  const [events, setEvents] = useState<SchoolEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [failed, setFailed] = useState(false);

  const load = useCallback(async () => {
    try {
      const { data } = await api.get('/school-events');
      setEvents(data.events ?? []);
      setFailed(false);
    } catch { setFailed(true); }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) return <Loader />;

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <AppHeader title="School Calendar" subtitle="School events, exams and important dates" onPressBell={() => openNotifications()} />
      <ScrollView contentContainerStyle={{ padding: Spacing.md }} refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={async () => { setRefreshing(true); await load(); setRefreshing(false); }} />
      }>
        {failed ? (
          <Card><Text style={{ color: Colors.textSub, fontSize: Fonts.sizes.sm }}>The calendar could not be loaded. Pull down to retry.</Text></Card>
        ) : events.length === 0 ? (
          <Card><Text style={{ color: Colors.textSub, fontSize: Fonts.sizes.sm }}>No school events are scheduled in the current calendar window.</Text></Card>
        ) : events.map(event => (
          <Card key={String(event.id)} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm, marginBottom: Spacing.sm }}>
            <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.primary + '20', alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name={event.event_type === 'holiday' ? 'sunny-outline' : event.event_type === 'exam' ? 'school-outline' : event.event_type === 'deadline' ? 'alarm-outline' : 'calendar-outline'} size={22} color={Colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: Colors.text, fontSize: Fonts.sizes.md, fontWeight: '700' }}>{event.title}</Text>
              <Text style={{ color: Colors.textSub, fontSize: Fonts.sizes.xs, marginTop: 3 }}>
                {event.school_code} · {event.event_type.toUpperCase()}{event.class_name ? ` · ${event.class_name}` : ''}
              </Text>
              <Text style={{ color: Colors.text, fontSize: Fonts.sizes.sm, fontWeight: '600', marginTop: 5 }}>{formatDate(event.start_at)}</Text>
              {event.end_at ? <Text style={{ color: Colors.textSub, fontSize: Fonts.sizes.xs, marginTop: 2 }}>Ends: {formatDate(event.end_at)}</Text> : null}
              {event.description ? <Text style={{ color: Colors.textSub, fontSize: Fonts.sizes.sm, marginTop: 5 }}>{event.description}</Text> : null}
            </View>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
}
