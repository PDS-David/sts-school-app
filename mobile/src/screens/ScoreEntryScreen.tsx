import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import api from '../api/client';
import { Card, Btn, Input, Loader, Empty, SectionHeader, GradePill } from '../components/UI';
import { Colors, Spacing, Fonts, Radius } from '../theme';
import { PageContainer, useIsWide } from '../components/layout';
import { useAuth } from '../api/AuthContext';
import { useAdminSchool } from '../api/AdminSchoolContext';
import { SchoolSwitcherBar } from '../components/SchoolSwitcherBar';
import { ConfirmDialog } from '../components/ConfirmDialog';

interface Student { id: string; full_name: string; class_name: string; }
interface Subject { id: number; name: string; }
interface Term    { id: number; name: string; academic_year: string; }
interface ScoreRow { student_id: string; name: string; ca1: string; ca2: string; exam: string; }

export default function ScoreEntryScreen({ navigation }: any) {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const { selectedSchoolCode } = useAdminSchool();
  // Teachers already have their own school_code; admin has none of their own
  // and relies entirely on whichever one is picked in the switcher.
  const effectiveSchoolCode = isAdmin ? selectedSchoolCode : user?.school_code ?? null;
  // Must be called unconditionally, before any early return below — moved up
  // from right before the JSX return, which violated the Rules of Hooks: on
  // the first render (loading=true) the component returned before ever
  // reaching that call, then called it on a later render once loading
  // finished, so React saw a different number of hooks between renders and
  // threw "Rendered more hooks than during the previous render," which took
  // the whole screen down to a blank page.
  const isWide = useIsWide();

  // Compact switcher lives in the native header now (admin only), not as a
  // full-width block in the content area — see SchoolSwitcherBar.tsx's
  // `compact` doc.
  useEffect(() => {
    navigation.setOptions({ headerRight: isAdmin ? () => <SchoolSwitcherBar compact /> : undefined });
  }, [navigation, isAdmin]);

  const [students,  setStudents]  = useState<Student[]>([]);
  const [subjects,  setSubjects]  = useState<Subject[]>([]);
  const [terms,     setTerms]     = useState<Term[]>([]);
  const [classes,   setClasses]   = useState<string[]>([]);
  const [selClass,  setSelClass]  = useState('');
  const [selSub,    setSelSub]    = useState<number | ''>('');
  const [selTerm,   setSelTerm]   = useState<number | ''>('');
  const [rows,      setRows]      = useState<ScoreRow[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [saving,    setSaving]    = useState(false);
  const [setupError, setSetupError] = useState('');
  const [setupRetry, setSetupRetry] = useState(0);
  const [rosterLoading, setRosterLoading] = useState(false);
  const [rosterError, setRosterError] = useState('');
  const [rosterRetry, setRosterRetry] = useState(0);
  const [scoresLoading, setScoresLoading] = useState(false);
  const [scoresError, setScoresError] = useState('');
  const [scoresRetry, setScoresRetry] = useState(0);
  const [schoolCfg, setSchoolCfg] = useState({ ca1_max: 20, ca2_max: 20, exam_max: 60 });
  const [showNewSub, setShowNewSub] = useState(false);
  const [newSubName, setNewSubName] = useState('');
  const [newSubCode, setNewSubCode] = useState('');
  const [addingSub,  setAddingSub]  = useState(false);
  const [infoDialog, setInfoDialog] = useState<{ title: string; message: string } | null>(null);

  useEffect(() => {
    // Admin: wait until a school is actually selected before fetching,
    // otherwise this repeats the exact "school_code=NULL" empty-result bug.
    if (isAdmin && !effectiveSchoolCode) { setLoading(false); return; }
    let cancelled = false;
    setLoading(true);
    setSetupError('');
    const sc = effectiveSchoolCode ?? undefined;
    Promise.all([
      api.get('/academic/subjects', { params: { school_code: sc } }),
      api.get('/academic/terms', { params: { school_code: sc } }),
      api.get('/academic/classes', { params: { school_code: sc } }),
      api.get('/academic/schools'),
    ]).then(([sub, t, c, schoolsRes]) => {
      if (cancelled) return;
      setSubjects(sub.data.subjects);
      setTerms(t.data.terms);
      const cls = (user?.role === 'teacher' && user?.assigned_class)
        ? [user.assigned_class]
        : [...new Set((c.data.classes as any[]).map((x: any) => x.name))].sort();
      setClasses(cls);
      setSelClass(cls[0] ?? '');
      const cur = t.data.terms.find((x: Term & { is_current: boolean }) => x.is_current);
      setSelTerm(cur ? cur.id : '');
      const schools = schoolsRes.data.schools ?? [];
      const match = schools.find((s: any) => s.code === effectiveSchoolCode) ?? schools[0];
      if (match) {
        setSchoolCfg({ ca1_max: match.ca1_max, ca2_max: match.ca2_max, exam_max: match.exam_max });
      }
    }).catch(() => {
      if (!cancelled) setSetupError('Could not load classes, subjects and terms. Check your connection and try again.');
    }).finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [effectiveSchoolCode, setupRetry]);

  // Fetch just the selected class's roster — one class at a time, not the
  // whole school. GET /students now requires a non-class-teacher to name a
  // class explicitly (see backend/src/routes/students.ts, Pass 20); a class
  // teacher gets their own class regardless of what's asked for, same as
  // always.
  useEffect(() => {
    if (!selClass) { setStudents([]); return; }
    const sc = effectiveSchoolCode ?? undefined;
    let cancelled = false;
    setRosterLoading(true);
    setRosterError('');
    api.get('/students', { params: { school_code: sc, class_name: selClass } })
      .then(({ data }) => { if (!cancelled) setStudents(data.students ?? []); })
      .catch(() => { if (!cancelled) { setStudents([]); setRosterError('Could not load this class roster. Retry before entering scores.'); } })
      .finally(() => { if (!cancelled) setRosterLoading(false); });
    return () => { cancelled = true; };
  }, [selClass, effectiveSchoolCode, rosterRetry]);

  // Rebuild rows when class/subject/term changes. Never expose blank score
  // inputs as editable when the existing values failed to load.
  useEffect(() => {
    if (!selClass || rosterLoading || rosterError) return;
    const classStudents = students.filter(s => s.class_name === selClass);
    const blankRows = classStudents.map(s => ({ student_id: s.id, name: s.full_name, ca1: '', ca2: '', exam: '' }));
    setRows(blankRows);
    if (!selSub || !selTerm) {
      setScoresLoading(false);
      setScoresError('');
      return;
    }
    let cancelled = false;
    setScoresLoading(true);
    setScoresError('');
    api.get(`/scores?class_name=${encodeURIComponent(selClass)}&subject_id=${selSub}&term_id=${selTerm}`)
      .then(({ data }) => {
        if (cancelled) return;
        const scoreMap: Record<string, any> = {};
        data.scores.forEach((sc: any) => { scoreMap[sc.student_id] = sc; });
        setRows(classStudents.map(s => ({
          student_id: s.id, name: s.full_name,
          ca1: String(scoreMap[s.id]?.ca1 ?? ''),
          ca2: String(scoreMap[s.id]?.ca2 ?? ''),
          exam: String(scoreMap[s.id]?.exam ?? ''),
        })));
      })
      .catch(() => {
        if (!cancelled) setScoresError('Could not load saved scores. Retry before editing so existing marks are not overlooked.');
      })
      .finally(() => { if (!cancelled) setScoresLoading(false); });
    return () => { cancelled = true; };
  }, [selClass, selSub, selTerm, students, rosterLoading, rosterError, scoresRetry]);

  const updateRow = (idx: number, field: 'ca1'|'ca2'|'exam', val: string) => {
    setRows(prev => prev.map((r, i) => i === idx ? { ...r, [field]: val } : r));
  };

  const handleSave = async () => {
    if (saving) return;
    if (!selSub || !selTerm) { setInfoDialog({ title: 'Select subject and term', message: 'Choose both a subject and term before saving scores.' }); return; }
    const invalid = rows.find(r => (['ca1', 'ca2', 'exam'] as const).some(field => {
      const raw = r[field].trim();
      if (!raw) return false;
      const value = Number(raw);
      const maximum = field === 'ca1' ? schoolCfg.ca1_max : field === 'ca2' ? schoolCfg.ca2_max : schoolCfg.exam_max;
      return !Number.isFinite(value) || value < 0 || value > maximum;
    }));
    if (invalid) {
      setInfoDialog({ title: 'Score outside allowed range', message: `Each score must be a valid number within the school's limits: CA1 0–${schoolCfg.ca1_max}, CA2 0–${schoolCfg.ca2_max}, Exam 0–${schoolCfg.exam_max}.` });
      return;
    }
    const payload = rows
      .filter(r => r.ca1.trim() !== '' || r.ca2.trim() !== '' || r.exam.trim() !== '')
      .map(r => ({
        student_id: r.student_id,
        subject_id: Number(selSub),
        term_id: Number(selTerm),
        ca1: Number(r.ca1 || 0),
        ca2: Number(r.ca2 || 0),
        exam: Number(r.exam || 0),
      }));
    if (!payload.length) { setInfoDialog({ title: 'No scores entered', message: 'Enter at least one score before saving.' }); return; }
    setSaving(true);
    try {
      await api.post('/scores/bulk', { scores: payload });
      setInfoDialog({ title: 'Scores saved', message: `${payload.length} student score record(s) saved successfully.` });
    } catch (e: any) {
      setInfoDialog({ title: 'Could not save scores', message: e?.response?.data?.error ?? 'Save failed. Check your connection and try again.' });
    } finally { setSaving(false); }
  };

  const handleAddSubject = async () => {
    if (!newSubName.trim()) { setInfoDialog({ title: 'Subject name required', message: 'Enter a subject name before adding it.' }); return; }
    if (isAdmin && !effectiveSchoolCode) { setInfoDialog({ title: 'Select a school', message: 'Choose a school before adding a subject.' }); return; }
    setAddingSub(true);
    try {
      const { data } = await api.post('/academic/subjects', {
        name: newSubName.trim(), code: newSubCode.trim(),
        school_code: isAdmin ? (effectiveSchoolCode ?? undefined) : undefined,
      });
      const created = data.subject;
      setSubjects(prev => {
        const exists = prev.some(s => s.id === created.id);
        return exists ? prev : [...prev, created].sort((a, b) => a.name.localeCompare(b.name));
      });
      setSelSub(created.id);
      setNewSubName(''); setNewSubCode(''); setShowNewSub(false);
    } catch (e: any) {
      setInfoDialog({ title: 'Could not add subject', message: e?.response?.data?.error ?? 'Please check your connection and try again.' });
    } finally { setAddingSub(false); }
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
        <Empty message="Pick a school in the header above to enter scores." />
      </View>
    );
  }

  const subName = subjects.find(s => s.id === selSub)?.name ?? '';

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <PageContainer style={{ padding: Spacing.sm }}>
        {/* Filters */}
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
              <Text style={styles.filterLabel}>Subject</Text>
              <View style={styles.pickerWrap}>
                <Picker selectedValue={selSub} onValueChange={v => setSelSub(Number(v))}>
                  <Picker.Item label="Select subject…" value="" />
                  {subjects.map(s => <Picker.Item key={s.id} label={s.name} value={s.id} />)}
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
          </View>

          {!showNewSub ? (
            <TouchableOpacity onPress={() => setShowNewSub(true)} style={styles.addSubLink}>
              <Ionicons name="add-circle-outline" size={14} color={Colors.primary} />
              <Text style={styles.addSubLinkTxt}>Don't see the subject? Add it</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.newSubBox}>
              <View style={isWide ? styles.filterRow : undefined}>
                <Input value={newSubName} onChangeText={setNewSubName} placeholder="New subject name" style={isWide ? { flex: 2, marginBottom: 0 } : { marginBottom: 6 }} />
                <Input value={newSubCode} onChangeText={setNewSubCode} placeholder="Code (optional)" style={isWide ? { flex: 1, marginBottom: 0 } : { marginBottom: 6 }} />
              </View>
              <View style={{ flexDirection: 'row', gap: Spacing.xs, marginTop: Spacing.xs }}>
                <Btn label="Cancel" variant="outline" onPress={() => { setShowNewSub(false); setNewSubName(''); setNewSubCode(''); }} style={{ flex: 1 }} />
                <Btn label={addingSub ? 'Adding…' : 'Add Subject'} onPress={handleAddSubject} loading={addingSub} style={{ flex: 1 }} />
              </View>
            </View>
          )}

          <View style={styles.maxHintRow}>
            <Ionicons name="information-circle-outline" size={14} color={Colors.textSub} />
            <Text style={styles.maxHint}>
              Max scores — CA1: {schoolCfg.ca1_max} · CA2: {schoolCfg.ca2_max} · Exam: {schoolCfg.exam_max}
            </Text>
          </View>
        </Card>
      </PageContainer>

      {/* Score grid */}
      {rosterError ? (
        <PageContainer style={{ padding: Spacing.md }}>
          <Empty message={rosterError} />
          <Btn label="Retry roster" onPress={() => setRosterRetry(v => v + 1)} variant="outline" />
        </PageContainer>
      ) : rosterLoading ? <Loader /> : scoresLoading ? <Loader /> : scoresError ? (
        <PageContainer style={{ padding: Spacing.md }}>
          <Empty message={scoresError} />
          <Btn label="Retry saved scores" onPress={() => setScoresRetry(v => v + 1)} variant="outline" />
        </PageContainer>
      ) : rows.length === 0
        ? (
          <PageContainer style={{ padding: Spacing.sm }}>
            <Card style={styles.emptyCard}>
              <Ionicons name="people-outline" size={40} color={Colors.border} />
              <Text style={styles.emptyTitle}>No students in {selClass || 'this class'}</Text>
              <Text style={styles.emptySub}>Once students are enrolled in this class, they'll show up here to enter scores for.</Text>
            </Card>
          </PageContainer>
        )
        : (
          <ScrollView contentContainerStyle={{ paddingBottom: Spacing.xl }}>
            <PageContainer style={{ padding: Spacing.sm, paddingTop: 0 }}>
              <SectionHeader title={`${selClass} — ${subName}`} />
              <Card style={{ padding: 0, overflow: 'hidden' }}>
                {/* Header row */}
                <View style={styles.gridHeader}>
                  <Text style={[styles.ghCell, { flex: 2, textAlign: 'left' }]}>Student</Text>
                  <Text style={styles.ghCell}>CA1</Text>
                  <Text style={styles.ghCell}>CA2</Text>
                  <Text style={styles.ghCell}>Exam</Text>
                  <Text style={styles.ghCell}>Total</Text>
                </View>
                {rows.map((r, i) => {
                  const total = (Number(r.ca1) || 0) + (Number(r.ca2) || 0) + (Number(r.exam) || 0);
                  return (
                    <View key={r.student_id} style={[styles.gridRow, i % 2 === 0 && styles.gridRowAlt]}>
                      <Text style={[styles.gdCell, { flex: 2, textAlign: 'left' }]} numberOfLines={1}>{r.name}</Text>
                      {(['ca1','ca2','exam'] as const).map(f => (
                        <View key={f} style={styles.scoreCell}>
                          <Input
                            value={r[f]}
                            onChangeText={v => updateRow(i, f, v)}
                            keyboardType="numeric"
                            placeholder="0"
                            style={{ marginBottom: 0 }}
                          />
                        </View>
                      ))}
                      <Text style={[styles.gdCell, styles.totalCell]}>{total || '—'}</Text>
                    </View>
                  );
                })}
              </Card>
              <Btn label={saving ? 'Saving…' : 'Save All Scores'} onPress={handleSave} loading={saving} disabled={saving || rosterLoading || !!rosterError || scoresLoading || !!scoresError || !selSub || !selTerm || rows.length === 0} style={{ marginTop: Spacing.md }} />
            </PageContainer>
          </ScrollView>
        )
      }
      <ConfirmDialog visible={!!infoDialog} title={infoDialog?.title ?? ''} message={infoDialog?.message ?? ''} hideCancel onConfirm={() => setInfoDialog(null)} onCancel={() => setInfoDialog(null)} />
    </View>
  );
}

const styles = StyleSheet.create({
  filterLabel: { fontSize: Fonts.sizes.xs, fontWeight: '700', color: Colors.textSub, marginBottom: 2, marginTop: Spacing.xs },
  filterRow:   { flexDirection: 'row', gap: Spacing.md, alignItems: 'flex-start' },
  filterCol:   { flex: 1, minWidth: 0 },
  pickerWrap:  { borderWidth: 1.5, borderColor: Colors.border, borderRadius: Radius.sm, backgroundColor: Colors.white, marginBottom: Spacing.xs },
  maxHintRow:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, marginTop: Spacing.sm, paddingTop: Spacing.sm, borderTopWidth: 1, borderColor: Colors.border },
  maxHint:     { fontSize: Fonts.sizes.xs, color: Colors.textSub },
  addSubLink:  { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4, marginBottom: 4 },
  addSubLinkTxt: { color: Colors.primary, fontSize: Fonts.sizes.xs, fontWeight: '700' },
  newSubBox:   { backgroundColor: '#F5F7FA', borderRadius: Radius.sm, padding: Spacing.sm, marginBottom: Spacing.xs, marginTop: 4 },
  emptyCard:   { alignItems: 'center', paddingVertical: Spacing.xl, gap: 6 },
  emptyTitle:  { fontSize: Fonts.sizes.md, fontWeight: '700', color: Colors.text, marginTop: Spacing.xs },
  emptySub:    { fontSize: Fonts.sizes.sm, color: Colors.textSub, textAlign: 'center', maxWidth: 340 },
  gridHeader:  { flexDirection: 'row', backgroundColor: Colors.primary, padding: 10 },
  ghCell:      { flex: 1, color: Colors.white, fontWeight: '700', fontSize: Fonts.sizes.xs, textAlign: 'center', textTransform: 'uppercase', letterSpacing: 0.5 },
  gridRow:     { flexDirection: 'row', alignItems: 'center', paddingVertical: 6, paddingHorizontal: 10, borderBottomWidth: 1, borderColor: Colors.border },
  gridRowAlt:  { backgroundColor: '#F8FAFC' },
  gdCell:      { flex: 1, fontSize: Fonts.sizes.sm, textAlign: 'center', color: Colors.text },
  totalCell:   { fontWeight: '800', color: Colors.primary },
  scoreCell:   { flex: 1, paddingHorizontal: 4 },
});
