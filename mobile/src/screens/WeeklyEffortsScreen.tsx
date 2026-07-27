import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, Alert, ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import api from '../api/client';
import { useAuth } from '../api/AuthContext';
import { useWards } from '../api/WardContext';
import { Card, Btn, Input, Loader, Empty, SectionHeader, Badge } from '../components/UI';
import { Colors, Spacing, Fonts, Radius } from '../theme';

const WEEKS = Array.from({ length: 13 }, (_, i) => i + 1);
const FLAG_OPTIONS = ['needs_followup', 'excellent_progress', 'attendance_concern', 'conduct_issue'];

export default function WeeklyEffortsScreen() {
  const { user } = useAuth();
  const { selectedWardId } = useWards();
  const isTeacherRole = user?.role === 'teacher';
  const isAdmin    = user?.role === 'admin';
  const isTeacher  = isTeacherRole || isAdmin; // kept for the "Log Weekly Effort" button + form visibility, unchanged
  const isParent   = user?.role === 'parent';
  const [efforts,  setEfforts]  = useState<any[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [modal,    setModal]    = useState(false);
  const [students, setStudents] = useState<any[]>([]);
  const [classes,  setClasses]  = useState<string[]>([]);
  const [selClass, setSelClass] = useState('');
  const [subjects, setSubjects] = useState<any[]>([]);
  const [currentTerm, setCurrentTerm] = useState<any>(null);
  const [feedback, setFeedback] = useState<Record<number, any[]>>({});
  const [fbText,   setFbText]   = useState('');
  const [activeEfId, setActiveEfId] = useState<number | null>(null);

  const [form, setForm] = useState({
    student_id: '', subject_id: '', week: 1,
    attendance_percent: '', tasks_completed: '', tasks_assigned: '',
    mcq_avg: '', teacher_comment: '', flags: [] as string[],
  });

  const fetch = async () => {
    // Parent: scope to the single selected child so siblings' efforts never
    // blend together on screen (the backend would also reject a mismatched
    // student_id, but we filter here too so the UI only ever asks for one).
    const efUrl = isParent && selectedWardId
      ? `/weekly-efforts?student_id=${selectedWardId}`
      : '/weekly-efforts';
    try {
      const [e, t] = await Promise.all([
        api.get(efUrl),
        api.get('/academic/terms/current'),
      ]);
      setEfforts(e.data.weekly_efforts ?? []);
      setCurrentTerm(t.data.term);
    } catch { } finally { setLoading(false); }
  };

  useEffect(() => {
    fetch();
    if (isAdmin) {
      // Admin is unrestricted everywhere else in the app, and this screen
      // never had per-school scoping wired in to begin with — left as-is
      // here rather than bolted on as a side effect of a teacher-focused
      // fix (see ScoreEntryScreen/AttendanceScreen for the established
      // pattern if this screen gets that treatment later).
      api.get('/students').then(r => setStudents(r.data.students ?? [])).catch(() => {});
      api.get('/academic/subjects').then(r => setSubjects(r.data.subjects ?? [])).catch(() => {});
    } else if (isTeacherRole) {
      // Found in the Pass 20 audit: this used to fetch every student in the
      // school just to populate a flat name picker — a subject-only teacher
      // (no assigned_class) got the whole school's roster with no class
      // grouping at all. Now: pick a class first (from /academic/classes,
      // no student data attached), then fetch just that class's roster. A
      // class teacher's own class always wins on the backend regardless of
      // what's asked for, so the picker only offers other classes when this
      // account isn't pinned to one of its own.
      api.get('/academic/classes').then(r => {
        const cls = user?.assigned_class
          ? [user.assigned_class]
          : [...new Set((r.data.classes as any[]).map((x: any) => x.name))].sort();
        setClasses(cls);
        setSelClass(cls[0] ?? '');
      }).catch(() => {});
      api.get('/academic/subjects').then(r => setSubjects(r.data.subjects ?? [])).catch(() => {});
    }
  }, [selectedWardId]);

  // Teacher only: (re)fetch the selected class's roster whenever it changes.
  useEffect(() => {
    if (!isTeacherRole || !selClass) return;
    let cancelled = false;
    api.get('/students', { params: { class_name: selClass } })
      .then(({ data }) => { if (!cancelled) setStudents(data.students ?? []); })
      .catch(() => { if (!cancelled) setStudents([]); });
    return () => { cancelled = true; };
  }, [isTeacherRole, selClass]);

  const openFeedback = async (efId: number) => {
    setActiveEfId(efId);
    const { data } = await api.get(`/weekly-efforts/${efId}/feedback`);
    setFeedback(prev => ({ ...prev, [efId]: data.feedback }));
  };

  const sendFeedback = async (efId: number) => {
    if (!fbText.trim()) return;
    await api.post(`/weekly-efforts/${efId}/feedback`, { body: fbText.trim() });
    setFbText('');
    openFeedback(efId);
  };

  const handleSave = async () => {
    try {
      await api.post('/weekly-efforts', {
        student_id: form.student_id,
        subject_id: form.subject_id || null,
        term_id: currentTerm?.id,
        week: form.week,
        attendance_percent: form.attendance_percent ? Number(form.attendance_percent) : null,
        tasks_completed: form.tasks_completed ? Number(form.tasks_completed) : null,
        tasks_assigned: form.tasks_assigned ? Number(form.tasks_assigned) : null,
        mcq_avg: form.mcq_avg ? Number(form.mcq_avg) : null,
        teacher_comment: form.teacher_comment,
        flags: form.flags,
      });
      setModal(false);
      fetch();
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.error ?? 'Save failed');
    }
  };

  const toggleFlag = (f: string) => {
    setForm(prev => ({
      ...prev,
      flags: prev.flags.includes(f) ? prev.flags.filter(x => x !== f) : [...prev.flags, f],
    }));
  };

  if (loading) return <Loader />;

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      {isTeacher && (
        <TouchableOpacity style={styles.addBtn} onPress={() => setModal(true)}>
          <Ionicons name="add-circle" size={20} color={Colors.white} />
          <Text style={styles.addBtnTxt}>Log Weekly Effort</Text>
        </TouchableOpacity>
      )}

      <FlatList
        data={efforts}
        keyExtractor={(e, i) => String(e.id ?? i)}
        ListEmptyComponent={<Empty message="No weekly efforts recorded yet" />}
        contentContainerStyle={{ padding: Spacing.sm }}
        renderItem={({ item: e }) => (
          <Card>
            <View style={styles.efHeader}>
              <View>
                <Text style={styles.efName}>{e.student_name}</Text>
                <Text style={styles.efMeta}>{e.class_name} · Week {e.week} · {e.term_name}</Text>
              </View>
              {(e.flags ?? []).map((f: string) => (
                <Badge key={f} label={f.replace(/_/g, ' ')} color={Colors.warning} />
              ))}
            </View>
            {e.ai_summary && (
              <View style={styles.aiSummaryBox}>
                <View style={styles.aiSummaryHeader}>
                  <Ionicons name="sparkles" size={14} color={Colors.accent} />
                  <Text style={styles.aiSummaryLabel}>Brainee says</Text>
                </View>
                <Text style={styles.aiSummaryText}>{e.ai_summary}</Text>
              </View>
            )}
            {e.subject_name && <Text style={styles.efSub}>Subject: {e.subject_name}</Text>}
            {e.attendance_percent != null && <Text style={styles.efStat}>Attendance: {e.attendance_percent}%</Text>}
            {e.tasks_completed != null && (
              <Text style={styles.efStat}>Tasks: {e.tasks_completed}/{e.tasks_assigned ?? '?'} completed</Text>
            )}
            {e.mcq_avg != null && <Text style={styles.efStat}>MCQ Avg: {e.mcq_avg}%</Text>}
            {e.teacher_comment && <Text style={styles.efComment}>{e.teacher_comment}</Text>}

            {/* Feedback */}
            <TouchableOpacity onPress={() => openFeedback(e.id)} style={styles.fbToggle}>
              <Ionicons name="chatbubble-outline" size={16} color={Colors.primary} />
              <Text style={styles.fbToggleTxt}>Feedback ({feedback[e.id]?.length ?? '…'})</Text>
            </TouchableOpacity>
            {activeEfId === e.id && (
              <View style={styles.fbArea}>
                {(feedback[e.id] ?? []).map(f => (
                  <View key={f.id} style={styles.fbBubble}>
                    <Text style={styles.fbSender}>{f.sender_name} ({f.sender_role})</Text>
                    <Text style={styles.fbBody}>{f.body}</Text>
                  </View>
                ))}
                <View style={styles.fbInputRow}>
                  <Input value={fbText} onChangeText={setFbText} placeholder="Add feedback…" style={{ flex: 1, marginBottom: 0 }} />
                  <Btn label="Send" onPress={() => sendFeedback(e.id)} style={{ paddingHorizontal: Spacing.md }} />
                </View>
              </View>
            )}
          </Card>
        )}
      />

      {/* New Effort Modal */}
      <Modal visible={modal} animationType="slide" onRequestClose={() => setModal(false)}>
        <ScrollView style={styles.modalWrapOuter} contentContainerStyle={styles.modalWrap} keyboardShouldPersistTaps="handled">
          <SectionHeader title="Log Weekly Effort" />
          {isTeacherRole && (
            <>
              <Text style={styles.pickerLabel}>Class</Text>
              <View style={styles.pickerBox}>
                <Picker
                  selectedValue={selClass}
                  onValueChange={v => { setSelClass(v); setForm(f => ({ ...f, student_id: '' })); }}
                >
                  {classes.map(c => <Picker.Item key={c} label={c} value={c} />)}
                </Picker>
              </View>
            </>
          )}
          <Text style={styles.pickerLabel}>Student</Text>
          <View style={styles.pickerBox}>
            <Picker selectedValue={form.student_id} onValueChange={v => setForm(f => ({ ...f, student_id: v }))}>
              <Picker.Item label="Select student…" value="" />
              {students.map(s => <Picker.Item key={s.id} label={s.full_name} value={s.id} />)}
            </Picker>
          </View>
          <Text style={styles.pickerLabel}>Subject (optional)</Text>
          <View style={styles.pickerBox}>
            <Picker selectedValue={form.subject_id} onValueChange={v => setForm(f => ({ ...f, subject_id: v }))}>
              <Picker.Item label="All subjects" value="" />
              {subjects.map(s => <Picker.Item key={s.id} label={s.name} value={String(s.id)} />)}
            </Picker>
          </View>
          <Text style={styles.pickerLabel}>Week</Text>
          <View style={styles.pickerBox}>
            <Picker selectedValue={form.week} onValueChange={v => setForm(f => ({ ...f, week: Number(v) }))}>
              {WEEKS.map(w => <Picker.Item key={w} label={`Week ${w}`} value={w} />)}
            </Picker>
          </View>
          <Input label="Attendance %" value={form.attendance_percent} onChangeText={v => setForm(f => ({ ...f, attendance_percent: v }))} keyboardType="numeric" />
          <Input label="Tasks Completed" value={form.tasks_completed} onChangeText={v => setForm(f => ({ ...f, tasks_completed: v }))} keyboardType="numeric" />
          <Input label="Tasks Assigned"  value={form.tasks_assigned}  onChangeText={v => setForm(f => ({ ...f, tasks_assigned: v }))}  keyboardType="numeric" />
          <Input label="MCQ Average %"   value={form.mcq_avg}         onChangeText={v => setForm(f => ({ ...f, mcq_avg: v }))}         keyboardType="numeric" />
          <Input label="Teacher Comment" value={form.teacher_comment} onChangeText={v => setForm(f => ({ ...f, teacher_comment: v }))} multiline numberOfLines={3} />
          <Text style={styles.pickerLabel}>Flags</Text>
          <View style={styles.flagRow}>
            {FLAG_OPTIONS.map(fl => (
              <TouchableOpacity key={fl} onPress={() => toggleFlag(fl)}
                style={[styles.flagChip, form.flags.includes(fl) && { backgroundColor: Colors.warning }]}>
                <Text style={[styles.flagTxt, form.flags.includes(fl) && { color: Colors.white }]}>
                  {fl.replace(/_/g, ' ')}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={{ flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.md }}>
            <Btn label="Cancel" onPress={() => setModal(false)} variant="outline" style={{ flex: 1 }} />
            <Btn label="Save"   onPress={handleSave}            style={{ flex: 1 }} />
          </View>
        </ScrollView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  addBtn:      { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, backgroundColor: Colors.primary, margin: Spacing.sm, borderRadius: Radius.md, padding: Spacing.md, justifyContent: 'center' },
  addBtnTxt:   { color: Colors.white, fontWeight: '700', fontSize: Fonts.sizes.md },
  efHeader:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.xs },
  efName:      { fontSize: Fonts.sizes.md, fontWeight: '700', color: Colors.text },
  efMeta:      { fontSize: Fonts.sizes.xs, color: Colors.textSub },
  efSub:       { fontSize: Fonts.sizes.sm, color: Colors.primary, marginTop: 2 },
  aiSummaryBox:    { backgroundColor: Colors.accent + '15', borderRadius: Radius.sm, padding: Spacing.sm, marginTop: Spacing.xs, marginBottom: Spacing.xs },
  aiSummaryHeader: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 2 },
  aiSummaryLabel:  { fontSize: Fonts.sizes.xs, fontWeight: '700', color: Colors.accent },
  aiSummaryText:   { fontSize: Fonts.sizes.sm, color: Colors.text, lineHeight: 19 },
  efStat:      { fontSize: Fonts.sizes.sm, color: Colors.text, marginTop: 2 },
  efComment:   { fontSize: Fonts.sizes.sm, color: Colors.textSub, fontStyle: 'italic', marginTop: Spacing.xs },
  fbToggle:    { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: Spacing.sm },
  fbToggleTxt: { color: Colors.primary, fontSize: Fonts.sizes.sm },
  fbArea:      { marginTop: Spacing.xs, backgroundColor: Colors.background, borderRadius: Radius.sm, padding: Spacing.sm },
  fbBubble:    { backgroundColor: Colors.card, borderRadius: Radius.sm, padding: Spacing.sm, marginBottom: 6, borderLeftWidth: 3, borderLeftColor: Colors.primary },
  fbSender:    { fontSize: Fonts.sizes.xs, fontWeight: '700', color: Colors.primary, marginBottom: 2 },
  fbBody:      { fontSize: Fonts.sizes.sm, color: Colors.text },
  fbInputRow:  { flexDirection: 'row', gap: Spacing.sm, alignItems: 'center', marginTop: Spacing.xs },
  modalWrapOuter: { flex: 1, backgroundColor: Colors.background },
  modalWrap:   { padding: Spacing.lg, paddingBottom: Spacing.lg * 3 },
  pickerLabel: { fontSize: Fonts.sizes.xs, fontWeight: '700', color: Colors.textSub, marginBottom: 2 },
  pickerBox:   { borderWidth: 1.5, borderColor: Colors.border, borderRadius: Radius.sm, backgroundColor: Colors.white, marginBottom: Spacing.sm },
  flagRow:     { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  flagChip:    { borderRadius: Radius.sm, borderWidth: 1.5, borderColor: Colors.warning, paddingHorizontal: Spacing.sm, paddingVertical: 4 },
  flagTxt:     { fontSize: Fonts.sizes.xs, color: Colors.warning, fontWeight: '600' },
});
