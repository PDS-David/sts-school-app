import React, { useCallback, useEffect, useState } from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../../api/client';
import { useAuth } from '../../api/AuthContext';
import { AppHeader } from '../../components/AppHeader';
import { Card, Loader } from '../../components/UI';
import { Colors, Fonts, Spacing } from '../../theme';
import { openNotifications } from '../../navigation/navigationRef';

const TYPES = ['event', 'exam', 'holiday', 'meeting', 'deadline'];
const ROLES = ['', 'student', 'parent', 'teacher'];

export default function AdminSchoolEventsScreen() {
  const { user } = useAuth();
  const [events, setEvents] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [schoolCode, setSchoolCode] = useState(user?.school_code ?? '');
  const [className, setClassName] = useState('');
  const [startAt, setStartAt] = useState('');
  const [endAt, setEndAt] = useState('');
  const [eventType, setEventType] = useState('event');
  const [audienceRole, setAudienceRole] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      const { data } = await api.get('/school-events');
      setEvents(data.events ?? []);
    } catch { Alert.alert('Could not load events', 'Check your connection and try again.'); }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const create = async () => {
    if (!title.trim() || !startAt.trim() || (!user?.school_code && !schoolCode.trim())) {
      Alert.alert('Missing details', 'Enter an event title, start date/time, and school code when required.');
      return;
    }
    const parsedStart = new Date(startAt);
    const parsedEnd = endAt.trim() ? new Date(endAt) : null;
    if (Number.isNaN(parsedStart.getTime()) || (parsedEnd && Number.isNaN(parsedEnd.getTime()))) {
      Alert.alert('Invalid date', 'Use an ISO date/time, for example 2026-12-01T09:00:00+01:00.');
      return;
    }
    if (parsedEnd && parsedEnd.getTime() < parsedStart.getTime()) {
      Alert.alert('Invalid date range', 'The end date/time cannot be earlier than the start.');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        title: title.trim(), description: description.trim() || null,
        event_type: eventType, audience_role: audienceRole || null,
        class_name: className.trim() || null, start_at: parsedStart.toISOString(),
        end_at: parsedEnd ? parsedEnd.toISOString() : null,
        school_code: schoolCode.trim() || undefined,
      };
      if (editingId != null) await api.put(`/school-events/${editingId}`, payload);
      else await api.post('/school-events', payload);
      setTitle(''); setDescription(''); setClassName(''); setStartAt(''); setEndAt(''); setEditingId(null);
      Alert.alert(editingId != null ? 'Event updated' : 'Event created', 'The event is now available to its selected audience.');
      await load();
    } catch (error: any) {
      Alert.alert(editingId != null ? 'Could not update event' : 'Could not create event', error?.response?.data?.error ?? 'Please check the details and try again.');
    } finally { setSaving(false); }
  };

  const startEdit = (event: any) => {
    setEditingId(event.id);
    setTitle(event.title ?? '');
    setDescription(event.description ?? '');
    setSchoolCode(event.school_code ?? '');
    setClassName(event.class_name ?? '');
    setEventType(event.event_type ?? 'event');
    setAudienceRole(event.audience_role ?? '');
    setStartAt(event.start_at ? new Date(event.start_at).toISOString() : '');
    setEndAt(event.end_at ? new Date(event.end_at).toISOString() : '');
  };

  const cancelEdit = () => {
    setEditingId(null); setTitle(''); setDescription(''); setClassName('');
    setStartAt(''); setEndAt(''); setEventType('event'); setAudienceRole('');
    setSchoolCode(user?.school_code ?? '');
  };

  const remove = (id: number) => {
    Alert.alert('Delete event?', 'This removes the event from the school calendar.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        try { await api.delete(`/school-events/${id}`); await load(); }
        catch (error: any) { Alert.alert('Could not delete event', error?.response?.data?.error ?? 'Please try again.'); }
      }},
    ]);
  };

  if (loading) return <Loader />;

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <AppHeader title="School Calendar" onPressBell={() => openNotifications()} />
      <ScrollView contentContainerStyle={{ padding: Spacing.md }}>
        <Card>
          <Text style={styles.heading}>{editingId != null ? 'Edit school event' : 'Create school event'}</Text>
          <Text style={styles.help}>Dates must include a timezone. Example: 2026-12-01T09:00:00+01:00</Text>
          <TextInput value={title} onChangeText={setTitle} placeholder="Event title" style={styles.input} maxLength={200} />
          <TextInput value={description} onChangeText={setDescription} placeholder="Description (optional)" style={[styles.input, styles.multiline]} multiline maxLength={5000} />
          {!user?.school_code ? <TextInput value={schoolCode} onChangeText={setSchoolCode} placeholder="School code (primary or secondary)" style={styles.input} /> : null}
          <TextInput value={className} onChangeText={setClassName} placeholder="Class name (optional, e.g. JSS1)" style={styles.input} />
          <Text style={styles.label}>Event type</Text>
          <View style={styles.chips}>{TYPES.map(type => <TouchableOpacity key={type} onPress={() => setEventType(type)} style={[styles.chip, eventType === type && styles.activeChip]}><Text style={[styles.chipText, eventType === type && styles.activeText]}>{type}</Text></TouchableOpacity>)}</View>
          <Text style={styles.label}>Audience</Text>
          <View style={styles.chips}>{ROLES.map(role => <TouchableOpacity key={role || 'all'} onPress={() => setAudienceRole(role)} style={[styles.chip, audienceRole === role && styles.activeChip]}><Text style={[styles.chipText, audienceRole === role && styles.activeText]}>{role || 'All roles'}</Text></TouchableOpacity>)}</View>
          <TextInput value={startAt} onChangeText={setStartAt} placeholder="Start date/time (ISO 8601)" style={styles.input} autoCapitalize="none" />
          <TextInput value={endAt} onChangeText={setEndAt} placeholder="End date/time (optional, ISO 8601)" style={styles.input} autoCapitalize="none" />
          <TouchableOpacity disabled={saving} onPress={create} style={[styles.submit, saving && { opacity: 0.6 }]}><Text style={styles.submitText}>{saving ? 'Saving…' : editingId != null ? 'Update event' : 'Publish event'}</Text></TouchableOpacity>
          {editingId != null ? <TouchableOpacity onPress={cancelEdit} style={{ padding: 10, alignItems: 'center' }}><Text style={{ color: Colors.textSub }}>Cancel editing</Text></TouchableOpacity> : null}
        </Card>

        <Text style={styles.section}>Scheduled events</Text>
        {events.length === 0 ? <Card><Text style={styles.help}>No events in the current calendar window.</Text></Card> : events.map(event => (
          <Card key={String(event.id)} style={styles.eventRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.eventTitle}>{event.title}</Text>
              <Text style={styles.help}>{event.event_type} · {new Date(event.start_at).toLocaleString()}</Text>
              <Text style={styles.help}>{event.school_code}{event.class_name ? ` · ${event.class_name}` : ''}{event.audience_role ? ` · ${event.audience_role}` : ' · all roles'}</Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity onPress={() => startEdit(event)} accessibilityLabel={`Edit ${event.title}`}><Ionicons name="create-outline" size={20} color={Colors.primary} /></TouchableOpacity>
              <TouchableOpacity onPress={() => remove(event.id)} accessibilityLabel={`Delete ${event.title}`}><Ionicons name="trash-outline" size={20} color={Colors.error} /></TouchableOpacity>
            </View>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  heading: { fontSize: Fonts.sizes.lg, fontWeight: '700', color: Colors.text, marginBottom: 4 },
  help: { fontSize: Fonts.sizes.xs, color: Colors.textSub, marginBottom: 8 },
  label: { fontSize: Fonts.sizes.sm, fontWeight: '700', color: Colors.text, marginTop: 8, marginBottom: 4 },
  input: { borderWidth: 1, borderColor: Colors.border, borderRadius: 8, padding: 10, marginTop: 8, color: Colors.text, backgroundColor: Colors.background },
  multiline: { minHeight: 76, textAlignVertical: 'top' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: { paddingVertical: 6, paddingHorizontal: 9, borderRadius: 16, borderWidth: 1, borderColor: Colors.border },
  activeChip: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText: { fontSize: Fonts.sizes.xs, color: Colors.text },
  activeText: { color: Colors.white, fontWeight: '700' },
  submit: { backgroundColor: Colors.primary, borderRadius: 8, padding: 12, alignItems: 'center', marginTop: 14 },
  submitText: { color: Colors.white, fontWeight: '700' },
  section: { fontSize: Fonts.sizes.md, fontWeight: '700', color: Colors.textSub, marginTop: 20, marginBottom: 8 },
  eventRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  eventTitle: { fontSize: Fonts.sizes.md, fontWeight: '700', color: Colors.text },
});
