import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, RefreshControl } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import api from '../../api/client';
import { Card, Btn, Badge, Loader, Empty, SectionHeader } from '../../components/UI';
import { Colors, Spacing, Fonts } from '../../theme';
import { AppHeader } from '../../components/AppHeader';
import { useAdminSchool } from '../../api/AdminSchoolContext';
import { openNotifications } from '../../navigation/navigationRef';

// Mobile UI for backend/src/routes/admin.ts's POST/GET /admin/term-pins —
// the backend has existed since the term-PIN access-control feature was
// built, but nothing in the app could reach it: admin had no way to
// actually hand a student a PIN, which blocked testing the whole
// topics/curriculum-unlock flow end to end. Term labels are hardcoded here
// to match the backend's own TERM_LABELS constant exactly (not fetched —
// there's no endpoint for it, and it's a fixed, small, stable list).
const TERM_LABELS = ['1st Term', '2nd Term', '3rd Term'];

export default function AdminTermPinsScreen() {
  const { selectedSchoolCode } = useAdminSchool();
  const [students, setStudents] = useState<any[]>([]);
  const [studentId, setStudentId] = useState('');
  const [termLabel, setTermLabel] = useState(TERM_LABELS[0]);
  const [generating, setGenerating] = useState(false);

  const [pins, setPins] = useState<any[]>([]);
  const [loadingPins, setLoadingPins] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadStudents = useCallback(() => {
    api.get('/students', { params: { school_code: selectedSchoolCode ?? undefined } })
      .then(({ data }) => {
        setStudents(data.students ?? []);
        if (data.students?.length && !studentId) setStudentId(String(data.students[0].id));
      })
      .catch(() => {});
  }, [selectedSchoolCode]);

  const loadPins = useCallback(async () => {
    try {
      const { data } = await api.get('/admin/term-pins');
      setPins(data.term_pins ?? []);
    } catch { /* offline — keep whatever's already loaded */ }
    setLoadingPins(false);
  }, []);

  useEffect(() => { loadStudents(); }, [loadStudents]);
  useEffect(() => { loadPins(); }, [loadPins]);

  const generate = async () => {
    if (!studentId) { Alert.alert('Select a student first'); return; }
    setGenerating(true);
    try {
      const { data } = await api.post('/admin/term-pins', { student_id: studentId, term_label: termLabel });
      const studentName = students.find((s) => String(s.id) === studentId)?.full_name ?? 'this student';
      // Shown once, same "make sure it's copyable before it scrolls away"
      // pattern as AddStudentScreen's generated parent credentials and
      // ChangePasswordScreen's admin-issued temp passwords — this PIN is
      // handed over physically, there's no other record of the plaintext
      // value once this dialog closes (GET /admin/term-pins does return it
      // back, per its own comment, for exactly this "I need to re-check
      // what I gave them" case).
      Alert.alert(
        'PIN generated',
        `${studentName} — ${termLabel}\n\nPIN: ${data.term_pin.pin}\n\nHand this to the student to unlock their lessons for this term. Generating again for the same student/term replaces this PIN.`,
      );
      loadPins();
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.error ?? 'Could not generate a PIN. Check your connection and try again.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <AppHeader title="Term PINs" onPressBell={() => openNotifications()} />
      <ScrollView
        contentContainerStyle={{ padding: Spacing.md }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={async () => { setRefreshing(true); await loadPins(); setRefreshing(false); }} />}
      >
        <SectionHeader title="Generate a PIN" />
        <Card style={{ marginBottom: Spacing.lg }}>
          <Text style={styles.label}>Student</Text>
          <Picker selectedValue={studentId} onValueChange={setStudentId} style={styles.picker}>
            {students.map((s) => (
              <Picker.Item key={s.id} label={`${s.full_name} (${s.class_name})`} value={String(s.id)} />
            ))}
          </Picker>

          <Text style={styles.label}>Term</Text>
          <Picker selectedValue={termLabel} onValueChange={setTermLabel} style={styles.picker}>
            {TERM_LABELS.map((t) => <Picker.Item key={t} label={t} value={t} />)}
          </Picker>

          <Text style={styles.hint}>
            Generating a PIN for a student/term that already has one replaces it — the old PIN stops working immediately.
          </Text>
          <Btn label="Generate PIN" onPress={generate} loading={generating} disabled={!studentId} />
        </Card>

        <SectionHeader title="Issued PINs" />
        {loadingPins ? (
          <Loader />
        ) : pins.length === 0 ? (
          <Empty message="No PINs issued yet." />
        ) : (
          pins.map((p) => (
            <Card key={p.id} style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{p.student_name}</Text>
                <Text style={styles.sub}>{p.class_name} · {p.term_label} · PIN: {p.pin}</Text>
              </View>
              <Badge
                label={p.redeemed_at ? 'Redeemed' : 'Not redeemed'}
                color={p.redeemed_at ? Colors.success : Colors.textSub}
              />
            </Card>
          ))
        )}
        <View style={{ height: Spacing.xl }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: Fonts.sizes.sm, fontWeight: '600', color: Colors.textSub, marginTop: Spacing.xs },
  picker: { marginBottom: Spacing.xs },
  hint: { fontSize: Fonts.sizes.xs, color: Colors.textSub, marginBottom: Spacing.sm },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.sm, gap: Spacing.sm },
  name: { fontSize: Fonts.sizes.sm, fontWeight: '700', color: Colors.text },
  sub: { fontSize: Fonts.sizes.xs, color: Colors.textSub, marginTop: 2 },
});
