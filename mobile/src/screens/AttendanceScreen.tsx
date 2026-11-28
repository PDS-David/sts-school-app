import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import api from '../api/client';
import { Card, Btn, Input, Loader, Empty, SectionHeader } from '../components/UI';
import { Colors, Spacing, Fonts, Radius } from '../theme';
import { useAuth } from '../api/AuthContext';
import { useAdminSchool } from '../api/AdminSchoolContext';
import { SchoolSwitcherBar } from '../components/SchoolSwitcherBar';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { PageContainer, useIsWide } from '../components/layout';
import { normalizeNextTermBegins, parseDaysOpenedInput } from '../utils/termSettings';

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
  const [infoDialog, setInfoDialog] = useState<{ title: string; message: string } | null>(null);
  const [setupError, setSetupError] = useState('');
  const [setupRetry, setSetupRetry] = useState(0);
  const [rosterError, setRosterError] = useState('');
  const [rosterLoading, setRosterLoading] = useState(false);
  const [rosterRetry, setRosterRetry] = useState(0);
  const [attendanceError, setAttendanceError] = useState('');
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [attendanceRetry, setAttendanceRetry] = useState(0);
  const [daysOpened, setDaysOpened] = useState('');
  // Also teacher-filled, per the same PUT /academic/terms/:id save as
  // daysOpened — school's own decision that the class teacher, not admin,
  // records when the next term starts.
  const [nextTermBegins, setNextTermBegins] = useState('');

  useEffect(() => {
    if (isAdmin && !effectiveSchoolCode) { setLoading(false); return; }
    let cancelled = false;
    setLoading(true);
    setSetupError('');
    const sc = effectiveSchoolCode ?? undefined;
    // Fetch only class and term metadata; student records remain class-scoped below.
    Promise.all([
      api.get('/academic/classes', { params: { school_code: sc } }),
      api.get('/academic/terms', { params: { school_code: sc } }),
    ])
      .then(([c, t]) => {
        if (cancelled) return;
        const cls = [...new Set((c.data.classes as any[]).map((x: any) => x.name))].sort();
        setClasses(cls);
        setSelClass(cls[0] ?? '');
        setTerms(t.data.terms);
        const cur = t.data.terms.find((x: any) => x.is_current);
        if (cur) { setSelTerm(cur.id); setDaysOpened(String(cur.days_opened ?? '')); setNextTermBegins(cur.next_term_begins ?? ''); }
      })
      .catch(() => { if (!cancelled) setSetupError('Could not load classes and terms. Check your connection and try again.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [effectiveSchoolCode, setupRetry]);

  // Keep the editable term metadata in sync with the selected term.
  // Without this, switching terms leaves the previous term's days-opened and
  // next-term date in the form, so the teacher can validate/save against the
  // wrong term's values.
  useEffect(() => {
    const selectedTerm = terms.find(term => term.id === selTerm);
    if (!selectedTerm) return;
    setDaysOpened(String(selectedTerm.days_opened ?? ''));
    setNextTermBegins(selectedTerm.next_term_begins ?? '');
  }, [selTerm, terms]);

  // One class's roster at a time, fetched fresh whenever the selected class
  // changes — not the whole school in one shot.
  useEffect(() => {
    if (!selClass) { setStudents([]); return; }
    let cancelled = false;
    setRosterLoading(true);
    setRosterError('');
    api.get('/students', { params: { school_code: effectiveSchoolCode ?? undefined, class_name: selClass } })
      .then(({ data }) => { if (!cancelled) setStudents(data.students ?? []); })
      .catch(() => { if (!cancelled) { setStudents([]); setRosterError('Could not load this class roster. Try again before entering attendance.'); } })
      .finally(() => { if (!cancelled) setRosterLoading(false); });
    return () => { cancelled = true; };
  }, [selClass, effectiveSchoolCode, rosterRetry]);

  // Pre-fill existing attendance
  useEffect(() => {
    if (!selClass || !selTerm || rosterLoading || rosterError) return;
    const classStudents = students.filter(s => s.class_name === selClass);
    const init: Record<string, string> = {};
    classStudents.forEach(s => { init[s.id] = ''; });

    let cancelled = false;
    setAttendanceLoading(true);
    setAttendanceError('');
    api.get('/attendance', { params: { class_name: selClass, term_id: selTerm, school_code: effectiveSchoolCode ?? undefined } })
      .then(r => {
        if (cancelled) return;
        const existing: Record<string, string> = { ...init };
        for (const row of (r.data.attendance ?? [])) {
          existing[row.student_id] = String(row.days_present);
        }
        setEntries(existing);
      })
      .catch(() => {
        if (!cancelled) {
          setEntries(init);
          setAttendanceError('Could not load saved attendance. Retry before editing so existing records are not accidentally overlooked.');
        }
      })
      .finally(() => { if (!cancelled) setAttendanceLoading(false); });

    return () => { cancelled = true; };
  }, [selClass, selTerm, students, rosterLoading, rosterError, attendanceRetry]);

  // Term metadata is only ever sent when the teacher deliberately edited the
  // field. The form is prefilled from the term as it was when this screen
  // loaded; if another user has since changed the term, an ordinary attendance
  // save must NOT push those prefilled (stale) values back over the newer ones.
  const selectedTermRecord = terms.find(term => term.id === selTerm);
  const savedDaysText = String(selectedTermRecord?.days_opened ?? '').trim();
  const savedNextTerm = String(selectedTermRecord?.next_term_begins ?? '').trim();
  const daysChanged = daysOpened.trim() !== savedDaysText;
  const nextTermChanged = nextTermBegins.trim() !== savedNextTerm;

  const handleSave = async () => {
    if (saving) return;
    if (!selTerm) { setInfoDialog({ title: 'Select a term', message: 'Choose a term before saving attendance.' }); return; }

    const termUpdate: { days_opened?: number; next_term_begins?: string | null } = {};
    if (daysChanged) {
      const parsed = parseDaysOpenedInput(daysOpened);
      if (parsed.ok === false) { setInfoDialog({ title: 'Invalid school days', message: parsed.error }); return; }
      termUpdate.days_opened = parsed.value;
    }
    if (nextTermChanged) {
      // Blank means "clear the date"; anything else must be a sensible label.
      const normalized = normalizeNextTermBegins(nextTermBegins);
      if (normalized.ok === false) { setInfoDialog({ title: 'Invalid next-term date', message: normalized.error }); return; }
      termUpdate.next_term_begins = normalized.value;
    }
    const termUpdateRequested = Object.keys(termUpdate).length > 0;

    const targetDays = termUpdate.days_opened ?? Number(selectedTermRecord?.days_opened ?? 0);
    const invalid = Object.entries(entries).find(([studentId, value]) => {
      if (value.trim() === '') return false;
      const n = Number(value);
      return !Number.isFinite(n) || !Number.isInteger(n) || n < 0 || (targetDays > 0 && n > targetDays);
    });
    if (invalid) {
      const student = students.find(s => s.id === invalid[0]);
      setInfoDialog({ title: 'Invalid attendance value', message: `Enter a whole number between 0 and ${targetDays || 'the number of days opened'} for ${student?.full_name ?? 'the selected student'}.` });
      return;
    }
    const payload = Object.entries(entries)
      .filter(([, v]) => v.trim() !== '')
      .map(([student_id, days_present]) => ({ student_id, days_present: Number(days_present) }));
    if (!payload.length) { setInfoDialog({ title: 'No attendance entered', message: 'Enter at least one student attendance value before saving.' }); return; }

    setSaving(true);
    const errorText = (e: any, fallback: string) => e?.response?.data?.error ?? fallback;
    let termSaved = false;
    try {
      // Step 1 (only if deliberately edited): term details. These are a
      // separate request from the attendance batch, so the outcome of each is
      // reported separately below. If this step fails, attendance is NOT
      // attempted, so a failure never leaves a half-applied save.
      if (termUpdateRequested) {
        try {
          const response = await api.put(`/academic/terms/${selTerm}`, termUpdate);
          termSaved = true;
          const serverTerm = response?.data?.term;
          // Adopt the server's stored values (not the typed text) and let the
          // selected-term effect reset the form, so a retry cannot resend them.
          setTerms(prev => prev.map(term => term.id === selTerm ? {
            ...term,
            days_opened: serverTerm?.days_opened ?? termUpdate.days_opened ?? term.days_opened,
            next_term_begins: serverTerm
              ? serverTerm.next_term_begins
              : ('next_term_begins' in termUpdate ? termUpdate.next_term_begins : term.next_term_begins),
          } : term));
        } catch (e: any) {
          setInfoDialog({
            title: 'Nothing was saved',
            message: `Term details could not be saved, so attendance was not saved either. ${errorText(e, 'Check your connection and try again.')}`,
          });
          return;
        }
      }
      // Step 2: the attendance batch (atomic on the server).
      try {
        await api.put('/attendance/bulk', { term_id: Number(selTerm), entries: payload });
      } catch (e: any) {
        setInfoDialog({
          title: termSaved ? 'Term details saved, attendance NOT saved' : 'Could not save attendance',
          message: termSaved
            ? `Your term details were saved, but attendance for ${payload.length} student(s) was NOT saved. ${errorText(e, 'Check your connection')} Fix the problem and press Save again; the term details will not be resent.`
            : errorText(e, 'Save failed. Check your connection and try again.'),
        });
        return;
      }
      setInfoDialog({
        title: termSaved ? 'Term details and attendance saved' : 'Attendance saved',
        message: termSaved
          ? `Term details were updated and attendance for ${payload.length} student(s) was saved successfully.`
          : `Attendance for ${payload.length} student(s) was saved successfully.`,
      });
    } finally { setSaving(false); }
  };

  if (loading) return <Loader />;

  if (setupError) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.background, justifyContent: 'center', padding: Spacing.md }}>
        <Empty message={setupError} />
        <Btn label="Retry loading" onPress={() => { setLoading(true); setSetupRetry(v => v + 1); }} variant="outline" />
      </View>
    );
  }

  if (isAdmin && !effectiveSchoolCode) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.background }}>
        <Empty message="Pick a school in the header above to take attendance." />
      </View>
    );
  }

  const classStudents = students.filter(s => s.class_name === selClass);

  return (
    <>
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <PageContainer style={{ padding: Spacing.sm }}>
        <Card>
          <View style={isWide ? styles.filterRow : undefined}>
            <View style={isWide ? styles.filterCol : undefined}>
              <Text style={styles.filterLabel}>Class</Text>
              <View style={styles.pickerWrap}>
                <Picker selectedValue={selClass} onValueChange={setSelClass} accessibilityLabel="Select attendance class">
                  {classes.map(c => <Picker.Item key={c} label={c} value={c} />)}
                </Picker>
              </View>
            </View>
            <View style={isWide ? styles.filterCol : undefined}>
              <Text style={styles.filterLabel}>Term</Text>
              <View style={styles.pickerWrap}>
                <Picker selectedValue={selTerm} onValueChange={v => setSelTerm(Number(v))} accessibilityLabel="Select attendance term">
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
          {rosterError ? (
            <View style={styles.loadErrorWrap}>
              <Text style={styles.loadError}>{rosterError}</Text>
              <Btn label="Retry roster" onPress={() => setRosterRetry(v => v + 1)} variant="outline" />
            </View>
          ) : rosterLoading ? <Loader /> : attendanceError ? (
            <View style={styles.loadErrorWrap}>
              <Text style={styles.loadError}>{attendanceError}</Text>
              <Btn label="Retry saved attendance" onPress={() => setAttendanceRetry(v => v + 1)} variant="outline" />
            </View>
          ) : classStudents.length === 0 ? <Empty message="No students are registered in this class yet." /> : classStudents.map((s, i) => (
            <View key={s.id} style={[styles.row, i % 2 === 0 && styles.rowAlt]}>
              <Text style={[styles.td, { flex: 2, textAlign: 'left' }]} numberOfLines={1}>{s.full_name}</Text>
              <Input
                value={entries[s.id] ?? ''}
                onChangeText={v => setEntries(prev => ({ ...prev, [s.id]: v }))}
                keyboardType="numeric"
                placeholder="0"
                accessibilityLabel={`${s.full_name} days present`}
                style={{ flex: 1, marginBottom: 0 }}
              />
            </View>
          ))}
          <Btn label={saving ? 'Saving…' : 'Save Attendance'} onPress={handleSave} loading={saving} disabled={saving || rosterLoading || !!rosterError || attendanceLoading || !!attendanceError || classStudents.length === 0} style={{ marginTop: Spacing.md }} />
        </Card>
      </PageContainer>
    </ScrollView>
    <ConfirmDialog visible={!!infoDialog} title={infoDialog?.title ?? ''} message={infoDialog?.message ?? ''} hideCancel onConfirm={() => setInfoDialog(null)} onCancel={() => setInfoDialog(null)} />
    </>
  );
}

const styles = StyleSheet.create({
  loadErrorWrap: { paddingVertical: Spacing.md },
  loadError: { color: Colors.error, fontSize: Fonts.sizes.sm, marginBottom: Spacing.sm },
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
