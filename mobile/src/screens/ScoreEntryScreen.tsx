import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import api from '../api/client';
import { Card, Btn, Input, Loader, Empty, SectionHeader, GradePill } from '../components/UI';
import { Colors, Spacing, Fonts, Radius } from '../theme';
import { useAuth } from '../api/AuthContext';
import { useAdminSchool } from '../api/AdminSchoolContext';
import { SchoolSwitcherBar } from '../components/SchoolSwitcherBar';

interface Student { id: string; full_name: string; class_name: string; }
interface Subject { id: number; name: string; }
interface Term    { id: number; name: string; academic_year: string; }
interface ScoreRow { student_id: string; name: string; ca1: string; ca2: string; exam: string; }

export default function ScoreEntryScreen() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const { selectedSchoolCode } = useAdminSchool();
  // Teachers already have their own school_code; admin has none of their own
  // and relies entirely on whichever one is picked in the switcher.
  const effectiveSchoolCode = isAdmin ? selectedSchoolCode : user?.school_code ?? null;

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
  const [schoolCfg, setSchoolCfg] = useState({ ca1_max: 20, ca2_max: 20, exam_max: 60 });
  const [showNewSub, setShowNewSub] = useState(false);
  const [newSubName, setNewSubName] = useState('');
  const [newSubCode, setNewSubCode] = useState('');
  const [addingSub,  setAddingSub]  = useState(false);

  useEffect(() => {
    // Admin: wait until a school is actually selected before fetching,
    // otherwise this repeats the exact "school_code=NULL" empty-result bug.
    if (isAdmin && !effectiveSchoolCode) { setLoading(false); return; }
    setLoading(true);
    const sc = effectiveSchoolCode ?? undefined;
    Promise.all([
      api.get('/academic/subjects', { params: { school_code: sc } }),
      api.get('/academic/terms', { params: { school_code: sc } }),
      // Found in the Pass 20 audit: this used to derive the class list from
      // GET /students (fetching every student in the school just to read
      // off distinct class_name values), which for a non-class teacher
      // meant pulling the FULL roster — names, admission numbers, dates of
      // birth — for a school-wide student list this screen never actually
      // needed. GET /academic/classes returns just the class names, no
      // student records attached, so it can't over-expose anything.
      api.get('/academic/classes', { params: { school_code: sc } }),
      api.get('/academic/schools'),
    ]).then(([sub, t, c, schoolsRes]) => {
      setSubjects(sub.data.subjects);
      setTerms(t.data.terms);
      // A class teacher's assigned_class always wins on the backend (see
      // GET /students, Pass 20) — so the picker only offers other classes
      // when this account has no assigned_class of its own to be pinned to
      // (a subject specialist), matching exactly what the backend will
      // actually honor. Showing a full class list to a class teacher, only
      // to have every choice silently come back as their own class anyway,
      // would just be confusing.
      const cls = (user?.role === 'teacher' && user?.assigned_class)
        ? [user.assigned_class]
        : [...new Set((c.data.classes as any[]).map((x: any) => x.name))].sort();
      setClasses(cls);
      setSelClass(cls[0] ?? '');
      // current term
      const cur = t.data.terms.find((x: Term & { is_current: boolean }) => x.is_current);
      setSelTerm(cur ? cur.id : '');
      // school config for max scores — match by the actual school code in
      // view, not just whichever school happens to come back first.
      const schools = schoolsRes.data.schools ?? [];
      const match = schools.find((s: any) => s.code === effectiveSchoolCode) ?? schools[0];
      if (match) {
        setSchoolCfg({ ca1_max: match.ca1_max, ca2_max: match.ca2_max, exam_max: match.exam_max });
      }
    }).catch(() => {}).finally(() => setLoading(false));
  }, [effectiveSchoolCode]);

  // Fetch just the selected class's roster — one class at a time, not the
  // whole school. GET /students now requires a non-class-teacher to name a
  // class explicitly (see backend/src/routes/students.ts, Pass 20); a class
  // teacher gets their own class regardless of what's asked for, same as
  // always.
  useEffect(() => {
    if (!selClass) { setStudents([]); return; }
    const sc = effectiveSchoolCode ?? undefined;
    let cancelled = false;
    api.get('/students', { params: { school_code: sc, class_name: selClass } })
      .then(({ data }) => { if (!cancelled) setStudents(data.students ?? []); })
      .catch(() => { if (!cancelled) setStudents([]); });
    return () => { cancelled = true; };
  }, [selClass, effectiveSchoolCode]);

  // Rebuild rows when class/subject/term changes
  useEffect(() => {
    if (!selClass) return;
    const classStudents = students.filter(s => s.class_name === selClass);
    setRows(classStudents.map(s => ({ student_id: s.id, name: s.full_name, ca1: '', ca2: '', exam: '' })));
    // Pre-fill existing scores if subject+term selected
    if (selSub && selTerm) {
      api.get(`/scores?class_name=${encodeURIComponent(selClass)}&subject_id=${selSub}&term_id=${selTerm}`)
        .then(({ data }) => {
          const scoreMap: Record<string, any> = {};
          data.scores.forEach((sc: any) => { scoreMap[sc.student_id] = sc; });
          setRows(classStudents.map(s => ({
            student_id: s.id, name: s.full_name,
            ca1:  String(scoreMap[s.id]?.ca1  ?? ''),
            ca2:  String(scoreMap[s.id]?.ca2  ?? ''),
            exam: String(scoreMap[s.id]?.exam ?? ''),
          })));
        }).catch(() => {});
    }
  }, [selClass, selSub, selTerm, students]);

  const updateRow = (idx: number, field: 'ca1'|'ca2'|'exam', val: string) => {
    setRows(prev => prev.map((r, i) => i === idx ? { ...r, [field]: val } : r));
  };

  const handleSave = async () => {
    if (!selSub || !selTerm) { Alert.alert('Select a subject and term first'); return; }
    const payload = rows
      .filter(r => r.ca1 !== '' || r.ca2 !== '' || r.exam !== '')
      .map(r => ({
        student_id: r.student_id,
        subject_id: Number(selSub),
        term_id: Number(selTerm),
        ca1: Number(r.ca1 || 0),
        ca2: Number(r.ca2 || 0),
        exam: Number(r.exam || 0),
      }));
    if (!payload.length) { Alert.alert('No scores entered'); return; }
    setSaving(true);
    try {
      await api.post('/scores/bulk', { scores: payload });
      Alert.alert('Saved', `${payload.length} scores saved successfully.`);
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.error ?? 'Save failed');
    } finally { setSaving(false); }
  };

  const handleAddSubject = async () => {
    if (!newSubName.trim()) { Alert.alert('Enter a subject name'); return; }
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
      Alert.alert('Error', e?.response?.data?.error ?? 'Could not add subject');
    } finally { setAddingSub(false); }
  };

  if (loading) return <Loader />;

  if (isAdmin && !effectiveSchoolCode) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.background }}>
        <SchoolSwitcherBar />
        <Empty message="Pick a school above to enter scores." />
      </View>
    );
  }

  const subName = subjects.find(s => s.id === selSub)?.name ?? '';

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      {isAdmin && <SchoolSwitcherBar />}
      {/* Filters */}
      <Card style={{ margin: Spacing.sm }}>
        <Text style={styles.filterLabel}>Class</Text>
        <View style={styles.pickerWrap}>
          <Picker selectedValue={selClass} onValueChange={setSelClass}>
            {classes.map(c => <Picker.Item key={c} label={c} value={c} />)}
          </Picker>
        </View>
        <Text style={styles.filterLabel}>Subject</Text>
        <View style={styles.pickerWrap}>
          <Picker selectedValue={selSub} onValueChange={v => setSelSub(Number(v))}>
            <Picker.Item label="Select subject…" value="" />
            {subjects.map(s => <Picker.Item key={s.id} label={s.name} value={s.id} />)}
          </Picker>
        </View>

        {!showNewSub ? (
          <TouchableOpacity onPress={() => setShowNewSub(true)} style={styles.addSubLink}>
            <Ionicons name="add-circle-outline" size={14} color={Colors.primary} />
            <Text style={styles.addSubLinkTxt}>Don't see the subject? Add it</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.newSubBox}>
            <Input value={newSubName} onChangeText={setNewSubName} placeholder="New subject name" style={{ marginBottom: 6 }} />
            <Input value={newSubCode} onChangeText={setNewSubCode} placeholder="Code (optional)" style={{ marginBottom: 6 }} />
            <View style={{ flexDirection: 'row', gap: Spacing.xs }}>
              <Btn label="Cancel" variant="outline" onPress={() => { setShowNewSub(false); setNewSubName(''); setNewSubCode(''); }} style={{ flex: 1 }} />
              <Btn label={addingSub ? 'Adding…' : 'Add Subject'} onPress={handleAddSubject} loading={addingSub} style={{ flex: 1 }} />
            </View>
          </View>
        )}
        <Text style={styles.filterLabel}>Term</Text>
        <View style={styles.pickerWrap}>
          <Picker selectedValue={selTerm} onValueChange={v => setSelTerm(Number(v))}>
            {terms.map(t => <Picker.Item key={t.id} label={`${t.name} – ${t.academic_year}`} value={t.id} />)}
          </Picker>
        </View>
        <Text style={styles.maxHint}>
          Max scores — CA1: {schoolCfg.ca1_max} | CA2: {schoolCfg.ca2_max} | Exam: {schoolCfg.exam_max}
        </Text>
      </Card>

      {/* Score grid */}
      {rows.length === 0
        ? <Empty message="No students in this class" />
        : (
          <ScrollView contentContainerStyle={{ padding: Spacing.sm, paddingBottom: Spacing.xl }}>
            <SectionHeader title={`${selClass} — ${subName}`} />
            {/* Header row */}
            <View style={styles.gridHeader}>
              <Text style={[styles.ghCell, { flex: 2 }]}>Student</Text>
              <Text style={styles.ghCell}>CA1</Text>
              <Text style={styles.ghCell}>CA2</Text>
              <Text style={styles.ghCell}>Exam</Text>
              <Text style={styles.ghCell}>Total</Text>
            </View>
            {rows.map((r, i) => {
              const total = (Number(r.ca1) || 0) + (Number(r.ca2) || 0) + (Number(r.exam) || 0);
              return (
                <View key={r.student_id} style={[styles.gridRow, i % 2 === 0 && { backgroundColor: '#F5F7FA' }]}>
                  <Text style={[styles.gdCell, { flex: 2 }]} numberOfLines={1}>{r.name}</Text>
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
                  <Text style={[styles.gdCell, { fontWeight: '700', color: Colors.primary }]}>{total || '—'}</Text>
                </View>
              );
            })}
            <Btn label={saving ? 'Saving…' : 'Save All Scores'} onPress={handleSave} loading={saving} style={{ marginTop: Spacing.md }} />
          </ScrollView>
        )
      }
    </View>
  );
}

const styles = StyleSheet.create({
  filterLabel: { fontSize: Fonts.sizes.xs, fontWeight: '700', color: Colors.textSub, marginBottom: 2, marginTop: Spacing.xs },
  pickerWrap:  { borderWidth: 1.5, borderColor: Colors.border, borderRadius: Radius.sm, backgroundColor: Colors.white, marginBottom: Spacing.xs },
  maxHint:     { fontSize: Fonts.sizes.xs, color: Colors.textSub, textAlign: 'center', marginTop: Spacing.xs },
  addSubLink:  { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4, marginBottom: 4 },
  addSubLinkTxt: { color: Colors.primary, fontSize: Fonts.sizes.xs, fontWeight: '700' },
  newSubBox:   { backgroundColor: '#F5F7FA', borderRadius: Radius.sm, padding: Spacing.sm, marginBottom: Spacing.xs },
  gridHeader:  { flexDirection: 'row', backgroundColor: Colors.primary, borderRadius: Radius.sm, padding: 6 },
  ghCell:      { flex: 1, color: Colors.white, fontWeight: '700', fontSize: Fonts.sizes.xs, textAlign: 'center' },
  gridRow:     { flexDirection: 'row', alignItems: 'center', paddingVertical: 4, borderBottomWidth: 1, borderColor: Colors.border },
  gdCell:      { flex: 1, fontSize: Fonts.sizes.xs, textAlign: 'center', color: Colors.text },
  scoreCell:   { flex: 1, paddingHorizontal: 2 },
});
