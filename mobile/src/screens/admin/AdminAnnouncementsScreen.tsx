import React, { useCallback, useEffect, useState } from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View, StyleSheet } from 'react-native';
import api from '../../api/client';
import { useAuth } from '../../api/AuthContext';
import { AppHeader } from '../../components/AppHeader';
import { Card, Loader } from '../../components/UI';
import { Colors, Fonts, Spacing } from '../../theme';
import { openNotifications } from '../../navigation/navigationRef';

const AUDIENCES = ['', 'student', 'parent', 'teacher'];

export default function AdminAnnouncementsScreen() {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [schoolCode, setSchoolCode] = useState(user?.school_code ?? '');
  const [className, setClassName] = useState('');
  const [audienceRole, setAudienceRole] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      const { data } = await api.get('/announcements');
      setAnnouncements(data.announcements ?? []);
    } catch { Alert.alert('Could not load announcements', 'Check your connection and try again.'); }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const publish = async () => {
    if (!title.trim() || !body.trim() || (!user?.school_code && !schoolCode.trim())) {
      Alert.alert('Missing details', 'Enter a title, message, and school code when required.');
      return;
    }
    const expiry = expiresAt.trim() ? new Date(expiresAt) : null;
    if (expiry && Number.isNaN(expiry.getTime())) {
      Alert.alert('Invalid expiry', 'Use an ISO date/time, for example 2026-12-01T17:00:00+01:00.');
      return;
    }
    if (expiry && expiry.getTime() <= Date.now()) {
      Alert.alert('Invalid expiry', 'The expiry date/time must be in the future.');
      return;
    }
    setSaving(true);
    try {
      await api.post('/announcements', {
        title: title.trim(), body: body.trim(), school_code: schoolCode.trim() || undefined,
        class_name: className.trim() || null, audience_role: audienceRole || null,
        expires_at: expiry ? expiry.toISOString() : null,
      });
      setTitle(''); setBody(''); setClassName(''); setExpiresAt('');
      Alert.alert('Announcement published', 'The notice is now visible to its selected audience.');
      await load();
    } catch (error: any) {
      Alert.alert('Could not publish announcement', error?.response?.data?.error ?? 'Please check the details and try again.');
    } finally { setSaving(false); }
  };

  const remove = (id: number) => {
    Alert.alert('Delete announcement?', 'This removes the notice from the school feed and notification bell.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        try { await api.delete(`/announcements/${id}`); await load(); }
        catch (error: any) { Alert.alert('Could not delete announcement', error?.response?.data?.error ?? 'Please try again.'); }
      }},
    ]);
  };

  if (loading) return <Loader />;

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <AppHeader title="School Announcements" onPressBell={() => openNotifications()} />
      <ScrollView contentContainerStyle={{ padding: Spacing.md }}>
        <Card>
          <Text style={styles.heading}>Publish announcement</Text>
          <Text style={styles.help}>Announcements are read-only for students, parents and teachers. No push or SMS is sent.</Text>
          <TextInput value={title} onChangeText={setTitle} placeholder="Announcement title" style={styles.input} maxLength={200} />
          <TextInput value={body} onChangeText={setBody} placeholder="Write the announcement" style={[styles.input, styles.multiline]} multiline maxLength={5000} />
          {!user?.school_code ? <TextInput value={schoolCode} onChangeText={setSchoolCode} placeholder="School code (primary or secondary)" style={styles.input} /> : null}
          <TextInput value={className} onChangeText={setClassName} placeholder="Class name (optional, e.g. JSS1)" style={styles.input} />
          <Text style={styles.label}>Audience</Text>
          <View style={styles.chips}>{AUDIENCES.map(role => <TouchableOpacity key={role || 'all'} onPress={() => setAudienceRole(role)} style={[styles.chip, audienceRole === role && styles.activeChip]}><Text style={[styles.chipText, audienceRole === role && styles.activeText]}>{role || 'All roles'}</Text></TouchableOpacity>)}</View>
          <TextInput value={expiresAt} onChangeText={setExpiresAt} placeholder="Expiry date/time (optional, ISO 8601)" style={styles.input} autoCapitalize="none" />
          <TouchableOpacity disabled={saving} onPress={publish} style={[styles.submit, saving && { opacity: 0.6 }]}><Text style={styles.submitText}>{saving ? 'Publishing…' : 'Publish announcement'}</Text></TouchableOpacity>
        </Card>

        <Text style={styles.section}>Published announcements</Text>
        {announcements.length === 0 ? <Card><Text style={styles.help}>No announcements have been published yet.</Text></Card> : announcements.map(item => (
          <Card key={String(item.id)} style={styles.notice}>
            <View style={{ flex: 1 }}>
              <Text style={styles.noticeTitle}>{item.title}</Text>
              <Text style={styles.help}>{item.school_code}{item.class_name ? ` · ${item.class_name}` : ''}{item.audience_role ? ` · ${item.audience_role}` : ' · all roles'}</Text>
              <Text style={styles.body} numberOfLines={4}>{item.body}</Text>
              <Text style={styles.help}>{new Date(item.created_at).toLocaleString()}{item.expires_at ? ` · Expires ${new Date(item.expires_at).toLocaleString()}` : ''}</Text>
            </View>
            <TouchableOpacity onPress={() => remove(item.id)} accessibilityLabel={`Delete ${item.title}`}><Text style={{ color: Colors.error, fontWeight: '700' }}>Delete</Text></TouchableOpacity>
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
  multiline: { minHeight: 110, textAlignVertical: 'top' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: { paddingVertical: 6, paddingHorizontal: 9, borderRadius: 16, borderWidth: 1, borderColor: Colors.border },
  activeChip: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText: { fontSize: Fonts.sizes.xs, color: Colors.text },
  activeText: { color: Colors.white, fontWeight: '700' },
  submit: { backgroundColor: Colors.primary, borderRadius: 8, padding: 12, alignItems: 'center', marginTop: 14 },
  submitText: { color: Colors.white, fontWeight: '700' },
  section: { fontSize: Fonts.sizes.md, fontWeight: '700', color: Colors.textSub, marginTop: 20, marginBottom: 8 },
  notice: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 8 },
  noticeTitle: { fontSize: Fonts.sizes.md, fontWeight: '700', color: Colors.text },
  body: { fontSize: Fonts.sizes.sm, color: Colors.text, marginTop: 4, marginBottom: 5 },
});
