import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import api from '../api/client';
import { Card, Btn, Input, Loader, Empty, SectionHeader } from '../components/UI';
import { Colors, Spacing, Fonts, Radius } from '../theme';
import { useAuth } from '../api/AuthContext';
import { useAdminSchool } from '../api/AdminSchoolContext';
import { SchoolSwitcherBar } from '../components/SchoolSwitcherBar';
import { PageContainer, useIsWide } from '../components/layout';

interface Student { id: string; full_name: string; class_name: string; }

export default function AttendanceScreen({ navigation }: any) {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const { selectedSchoolCode } = useAdminSchool();
  // Same pattern as ScoreEntryScreen: teachers already have their own
  // school_code; admin has none of their own and needs whichever one is
  // picked in the switcher. Previously this screen passed no school_code at
  // all, which for admin meant GET /students silently returned every
  // student from every school mixed together with no way to tell them
  // apart — not fixed as its own bug before now, but worth calling out
  // since it's what made that omission harmless-looking until this pass
  // required an explicit, real school scope.
  const effectiveSchoolCode = isAdmin ? selectedSchoolCode : user?.school_code ?? null;
  // Placed with the component's other hooks, before any early return below —
  // see ScoreEntryScreen.tsx's own fix for why this ordering matters.
  const isWide = useIsWide();

  // Compact switcher lives in the native header now (admin only), not as a
  // full-width block in the content area — see SchoolSwitcherBar.tsx's
  // `compact` doc.
  useEffect(() => {
    navigation.setOptions({ headerRight: isAdmin ? () => <SchoolSwitcherBar compact /> : undefined });
  }, [navigation, isAdmin]);
  const [students, setStudents] = useState<Student[]>([]);
  const [classes,  setClasses]  = useState<string[]>([]);
  const [terms,    setTerms]    = useState<any[]>([]);
  const [selClass, setSelClass] = useState('');
  const [selTerm,  setSelTerm]  = useState<number | ''>('');
  const [entries,  setEntries]  = useState<Record<string, string>>({});
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [daysOpened, setDaysOpened] = useState('');
  // Also teacher-filled, per the same PUT /academic/terms/:id save as
  // daysOpened — school's own decision that the class teacher, not admin,
  // records when the next term starts.
  const [nextTermBegins, setNextTermBegins] = useState('');

  useEffect(() => {
    if (isAdmin && !effectiveSchoolCode) { setLoading(false); return; }
    setLoading(true);
    const sc = effectiveSchoolCode ?? undefined;
    // Found in the Pass 20 audit: this used to derive the class list from
    // GET /students, fetching the whole school's roster just to read off
    // class names. GET /academic/classes carries no student data at all —
    // see ScoreEntryScreen.tsx for the identical reasoning. A class
    // teacher's own class always wins on the backend regardless of what's
    // asked for, so the picker only offers other classes when this account
    // isn't pinned to one of its own.
    Promise.all([
      api.get('/academic/classes', { params: { school_code: sc } }),
      api.get('/academic/terms', { params: { school_code: sc } }),
    ])
      .then(([c, t]) => {
        const cls = (user?.role === 'teacher' && user?.assigned_class)
          ? [user.assigned_class]
          : [...new Set((c.data.classes as any[]).map((x: any) => x.name))].sort();
        setClasses(cls);
        setSelClass(cls[0] ?? '');
        setTerms(t.data.terms);
        const cur = t.data.terms.find((x: any) => x.is_current);
        if (cur) { setSelTerm(cur.id); setDaysOpened(String(cur.days_opened ?? '')); setNextTermBegins(cur.next_term_begins ?? ''); }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [effectiveSchoolCode]);

  // One class's roster at a time, fetched fresh whenever the selected class
  // changes — not the whole school in one shot.
  useEffect(() => {
    if (!selClass) { setStudents([]); return; }
    let cancelled = false;
    api.get('/students', { params: { school_code: effectiveSchoolCode ?? undefined, class_name: selClass } })
      .then(({ data }) => { if (!cancelled) setStudents(data.students ?? []); })
      .catch(() => { if (!cancelled) setStudents([]); });
    return () => { cancelled = true; };
  }, [selClass, effectiveSchoolCode]);

  // Pre-fill existing attendance
  useEffect(() => {
    if (!selClass || !selTerm) return;
    const classStudents = students.filter(s => s.class_name === selClass);
    const init: Record<string, string> = {};
    classStudents.forEach(s => { init[s.id] = ''; });

    let cancelled = false;
    api.get(`/attendance?class_name=${encodeURIComponent(selClass)}&term_id=${selTerm}`)
      .then(r => {
        if (cancelled) return;
        const existing: Record<string, string> = { ...init };
        for (const row of (r.data.attendance ?? [])) {
          existing[row.student_id] = String(row.days_present);
        }
        setEntries(existing);
      })
      .catch(() => { if (!cancelled) setEntries(init); });

    return () => { cancelled = true; };
  }, [selClass, selTerm, students]);

  const handleSave = async () => {
    if (!selTerm) { Alert.alert('Select a term first'); return; }
    const payload = Object.entries(entries)
      .filter(([, v]) => v !== '')
      .map(([student_id, days_present]) => ({ student_id, days_present: Number(days_present) }));
    if (!payload.length) { Alert.alert('No attendance values entered'); return; }
    setSaving(true);
    try {
      await api.put('/attendance/bulk', { term_id: Number(selTerm), entries: payload });
      // Update term days_opened / next_term_begins if changed
      if (daysOpened || nextTermBegins) {
        await api.put(`/academic/terms/${selTerm}`, {
          days_opened: daysOpened ? Number(daysOpened) : undefined,
          next_term_begins: nextTermBegins || undefined,
        });
      }
      Alert.alert('Saved', 'Attendance saved successfully.');
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.error ?? 'Save failed');
    } finally { setSaving(false); }
  };

  if (loading) return <Loader />;

  if (isAdmin && !effectiveSchoolCode) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.background }}>
        <Empty message="Pick a school in the header above to take attendance." />
      </View>
    );
  }

  const classStudents = students.filter(s => s.class_name === selClass);

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <PageContainer style={{ padding: Spacing.sm }}>
        <Card>
          <View style={isWide ? styles.filterRow : undefined}>
            <View style={isWide ? styles.filterCol : undefined}>
              <Text style={styles.filterLabel}>Class</Text>
              <View style={styles.pickerWrap}>
                <Picker selectedValue={selClass} onValueChange={setSelClass}>
                  {classes.map(c => <Picker.Item key={c} label={c} value={c} />)}
                </Picker>
              </View>
            </View>
            <View style={isWide ? styles.filterCol : undefined}>
              <Text style={styles.filterLabel}>Term</Text>
              <View style={styles.pickerWrap}>
                <Picker selectedValue={selTerm} onValueChange={v => setSelTerm(Number(v))}>
                  {terms.map(t => <Picker.Item key={t.id} label={`${t.name} – ${t.academic_year}`} value={t.id} />)}
                </Picker>
              </View>
            </View>
            <View style={isWide ? styles.filterCol : undefined}>
              <Input
                label="Days School Opened (this term)"
                value={daysOpened}
                onChangeText={setDaysOpened}
                keyboardType="numeric"
                placeholder="e.g. 60"
              />
            </View>
            <View style={isWide ? styles.filterCol : undefined}>
              <Input
                label="Next Term Begins"
                value={nextTermBegins}
                onChangeText={setNextTermBegins}
                placeholder="e.g. Monday, 12th January"
              />
            </View>
          </View>
        </Card>
      </PageContainer>

      <PageContainer style={{ padding: Spacing.sm, paddingTop: 0 }}>
        <Card>
          <SectionHeader title={`${selClass} Attendance`} />
          <View style={styles.tableHeader}>
            <Text style={[styles.th, { flex: 2, textAlign: 'left' }]}>Student</Text>
            <Text style={styles.th}>Days Present</Text>
          </View>
          {classStudents.map((s, i) => (
            <View key={s.id} style={[styles.row, i % 2 === 0 && styles.rowAlt]}>
              <Text style={[styles.td, { flex: 2, textAlign: 'left' }]} numberOfLines={1}>{s.full_name}</Text>
              <Input
                value={entries[s.id] ?? ''}
                onChangeText={v => setEntries(prev => ({ ...prev, [s.id]: v }))}
                keyboardType="numeric"
                placeholder="0"
                style={{ flex: 1, marginBottom: 0 }}
              />
            </View>
          ))}
          <Btn label={saving ? 'Saving…' : 'Save Attendance'} onPress={handleSave} loading={saving} style={{ marginTop: Spacing.md }} />
        </Card>
      </PageContainer>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:   { flex: 1, backgroundColor: Colors.background },
  filterLabel: { fontSize: Fonts.sizes.xs, fontWeight: '700', color: Colors.textSub, marginBottom: 2, marginTop: Spacing.xs },
  filterRow:   { flexDirection: 'row', gap: Spacing.md, alignItems: 'flex-start' },
  filterCol:   { flex: 1, minWidth: 0 },
  pickerWrap:  { borderWidth: 1.5, borderColor: Colors.border, borderRadius: Radius.sm, backgroundColor: Colors.white, marginBottom: Spacing.xs },
  tableHeader: { flexDirection: 'row', backgroundColor: Colors.primary, borderRadius: Radius.sm, padding: 8, marginBottom: 4 },
  th:          { flex: 1, color: Colors.white, fontWeight: '700', fontSize: Fonts.sizes.xs, textAlign: 'center', textTransform: 'uppercase', letterSpacing: 0.5 },
  row:         { flexDirection: 'row', alignItems: 'center', paddingVertical: 6, borderBottomWidth: 1, borderColor: Colors.border, gap: Spacing.sm },
  rowAlt:      { backgroundColor: '#F8FAFC' },
  td:          { flex: 1, fontSize: Fonts.sizes.sm, color: Colors.text, textAlign: 'center' },
});
