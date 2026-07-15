import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Switch, Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import api from '../api/client';
import { Card, Btn, Input, Loader, SectionHeader, Badge } from '../components/UI';
import { Colors, Spacing, Fonts, Radius } from '../theme';
import { askBraineeToDraftQuestions, DraftQuestion } from '../api/brainee';

interface Question { id: number; stem: string; type: string; marks: number; subject_id?: number | string; }

export default function CreateAssessmentScreen({ navigation }: any) {
  const [subjects,  setSubjects]  = useState<any[]>([]);
  const [classes,   setClasses]   = useState<string[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selected,  setSelected]  = useState<number[]>([]);
  const [saving,    setSaving]    = useState(false);

  const [form, setForm] = useState({
    title: '', subject_id: '', class_name: '', start_at: '', end_at: '',
  });
  const [shuffle, setShuffle] = useState(true);

  // Brainee question drafting — never saves anything on its own; a teacher
  // must explicitly keep each draft, which POSTs it to the question bank
  // exactly like a hand-typed question would be.
  const [draftModal, setDraftModal] = useState(false);
  const [draftTopic, setDraftTopic] = useState('');
  const [draftType, setDraftType] = useState<'mcq' | 'essay'>('mcq');
  const [draftCount, setDraftCount] = useState('3');
  const [draftLoading, setDraftLoading] = useState(false);
  const [draftError, setDraftError] = useState('');
  const [drafts, setDrafts] = useState<DraftQuestion[]>([]);
  const [savingDraftIdx, setSavingDraftIdx] = useState<number | null>(null);

  useEffect(() => {
    Promise.all([
      api.get('/academic/subjects'),
      // Found while auditing teacher content-scope (Pass 17/19): this
      // previously derived the class list from GET /students, which for a
      // teacher restricts to their own assigned_class whenever one is set —
      // so a teacher who is BOTH a class teacher AND a subject specialist
      // (has assigned_class AND assigned_subject_id) only ever saw their own
      // class here, even though the backend already lets them create an
      // assessment for their subject in any class. GET /academic/classes
      // isn't roster-scoped (it just lists the school's classes, no student
      // data), so it gives every teacher the full, correct set of classes to
      // pick from — the backend (checkTeacherContentScope) is still what
      // actually enforces which of those choices are allowed to save.
      api.get('/academic/classes'),
      api.get('/learning/questions'),
    ]).then(([s, c, q]) => {
      setSubjects(s.data.subjects);
      const cls = [...new Set((c.data.classes as any[]).map((x: any) => x.name))].sort();
      setClasses(cls);
      setQuestions(q.data.questions);
    }).catch(() => {});
  }, []);

  // Filter questions by selected subject
  const filteredQ = form.subject_id
    ? questions.filter(q => String(q.subject_id ?? '') === form.subject_id ||
        !q.subject_id) // include unassigned questions
    : questions;

  const toggleQuestion = (id: number) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleCreate = async () => {
    if (!form.title.trim())   { Alert.alert('Title required'); return; }
    if (!form.subject_id)     { Alert.alert('Subject required'); return; }
    if (!form.class_name)     { Alert.alert('Class required'); return; }
    if (selected.length === 0){ Alert.alert('Select at least one question'); return; }

    setSaving(true);
    try {
      const question_ids = selected.map(id => {
        const q = questions.find(x => x.id === id);
        return { id, points: q?.marks ?? 1 };
      });
      await api.post('/learning/assessments', {
        title: form.title,
        subject_id: Number(form.subject_id),
        class_name: form.class_name,
        start_at: form.start_at || null,
        end_at: form.end_at || null,
        shuffle,
        question_ids,
      });
      Alert.alert('Created!', 'Assessment created successfully.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.error ?? 'Create failed');
    } finally { setSaving(false); }
  };

  const totalMarks = selected.reduce((s, id) => {
    const q = questions.find(x => x.id === id);
    return s + (q?.marks ?? 1);
  }, 0);

  const requestDrafts = async () => {
    if (!draftTopic.trim()) { setDraftError('Enter a topic first'); return; }
    setDraftLoading(true);
    setDraftError('');
    try {
      const subjectName = subjects.find(s => String(s.id) === form.subject_id)?.name;
      const result = await askBraineeToDraftQuestions({
        topic: draftTopic.trim(),
        subject: subjectName,
        class_name: form.class_name || undefined,
        type: draftType,
        count: Number(draftCount) || 3,
      });
      setDrafts(Array.isArray(result) ? result : []);
    } catch (e: any) {
      setDraftError(e?.message ?? "Brainee couldn't draft those right now.");
    } finally { setDraftLoading(false); }
  };

  const keepDraft = async (draft: DraftQuestion, index: number) => {
    if (!form.subject_id || !form.class_name) {
      Alert.alert('Pick a subject and class first', 'Brainee\'s drafts are saved against the subject/class chosen above.');
      return;
    }
    setSavingDraftIdx(index);
    try {
      const { data } = await api.post('/learning/questions', {
        subject_id: Number(form.subject_id),
        class_name: form.class_name,
        type: draftType,
        stem: draft.stem,
        options: draft.options ?? [],
        correct_keys: draft.correct_keys ?? [],
        marks: draft.marks ?? 1,
      });
      setQuestions(prev => [...prev, data.question]);
      setSelected(prev => [...prev, data.question.id]);
      setDrafts(prev => prev.filter((_, i) => i !== index));
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.error ?? 'Could not save that draft');
    } finally { setSavingDraftIdx(null); }
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <Card>
        <SectionHeader title="Assessment Details" />
        <Input label="Title" value={form.title} onChangeText={v => setForm(f => ({ ...f, title: v }))} placeholder="e.g. Mid-Term Mathematics Test" />

        <Text style={styles.pickerLabel}>Subject *</Text>
        <View style={styles.pickerWrap}>
          <Picker selectedValue={form.subject_id} onValueChange={v => setForm(f => ({ ...f, subject_id: v }))}>
            <Picker.Item label="Select subject…" value="" />
            {subjects.map(s => <Picker.Item key={s.id} label={s.name} value={String(s.id)} />)}
          </Picker>
        </View>

        <Text style={styles.pickerLabel}>Class *</Text>
        <View style={styles.pickerWrap}>
          <Picker selectedValue={form.class_name} onValueChange={v => setForm(f => ({ ...f, class_name: v }))}>
            <Picker.Item label="Select class…" value="" />
            {classes.map(c => <Picker.Item key={c} label={c} value={c} />)}
          </Picker>
        </View>

        <Input label="Opens (YYYY-MM-DDTHH:MM)"   value={form.start_at} onChangeText={v => setForm(f => ({ ...f, start_at: v }))} placeholder="Optional" autoCapitalize="none" />
        <Input label="Closes (YYYY-MM-DDTHH:MM)"  value={form.end_at}   onChangeText={v => setForm(f => ({ ...f, end_at: v }))}   placeholder="Optional" autoCapitalize="none" />

        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Shuffle Questions</Text>
          <Switch value={shuffle} onValueChange={setShuffle} thumbColor={Colors.primary} trackColor={{ true: Colors.primary + '66', false: Colors.border }} />
        </View>
      </Card>

      {/* Question picker */}
      <Card>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.sm }}>
          <Text style={styles.sectionTitle}>Select Questions</Text>
          <Text style={styles.badge}>{selected.length} selected · {totalMarks} marks</Text>
        </View>

        <TouchableOpacity style={styles.draftBtn} onPress={() => setDraftModal(true)} activeOpacity={0.8}>
          <Ionicons name="sparkles-outline" size={16} color={Colors.accent} />
          <Text style={styles.draftBtnTxt}>Draft with Brainee</Text>
        </TouchableOpacity>

        {filteredQ.length === 0 ? (
          <Text style={styles.emptyQ}>No questions available. Add questions first from the question bank.</Text>
        ) : (
          filteredQ.map(q => {
            const sel = selected.includes(q.id);
            return (
              <TouchableOpacity
                key={q.id}
                style={[styles.qRow, sel && styles.qRowSelected]}
                onPress={() => toggleQuestion(q.id)}
                activeOpacity={0.7}
              >
                <View style={[styles.qCheckbox, sel && { backgroundColor: Colors.primary, borderColor: Colors.primary }]}>
                  {sel && <Ionicons name="checkmark" size={14} color={Colors.white} />}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.qStem} numberOfLines={2}>{q.stem}</Text>
                  <Text style={styles.qMeta}>{q.type.toUpperCase()} · {q.marks} mark{q.marks !== 1 ? 's' : ''}</Text>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </Card>

      <Btn
        label={saving ? 'Creating…' : `Create Assessment (${totalMarks} marks)`}
        onPress={handleCreate}
        loading={saving}
        disabled={selected.length === 0}
        style={{ margin: Spacing.md }}
      />
      <View style={{ height: Spacing.xl }} />

      <Modal visible={draftModal} animationType="slide" onRequestClose={() => setDraftModal(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Draft with Brainee</Text>
            <TouchableOpacity onPress={() => { setDraftModal(false); setDrafts([]); setDraftError(''); }}>
              <Ionicons name="close" size={24} color={Colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={{ padding: Spacing.md }}>
            <Text style={styles.pickerLabel}>Topic</Text>
            <Input value={draftTopic} onChangeText={setDraftTopic} placeholder="e.g. Fractions, Photosynthesis…" style={{ marginBottom: Spacing.sm }} />

            <Text style={styles.pickerLabel}>Question type</Text>
            <View style={{ flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.sm }}>
              {(['mcq', 'essay'] as const).map(t => (
                <TouchableOpacity
                  key={t}
                  onPress={() => setDraftType(t)}
                  style={[styles.typeChip, draftType === t && styles.typeChipActive]}
                >
                  <Text style={[styles.typeChipTxt, draftType === t && { color: Colors.white }]}>{t.toUpperCase()}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.pickerLabel}>How many? (max 10)</Text>
            <Input value={draftCount} onChangeText={setDraftCount} keyboardType="numeric" style={{ marginBottom: Spacing.sm, width: 80 }} />

            <Btn label="Draft" onPress={requestDrafts} loading={draftLoading} style={{ marginBottom: Spacing.sm }} />
            {!!draftError && <Text style={styles.draftError}>{draftError}</Text>}

            <Text style={styles.draftNote}>
              Nothing is saved until you tap "Keep" on a draft — review each one first.
            </Text>

            {drafts.map((d, i) => (
              <Card key={i} style={{ marginBottom: Spacing.sm }}>
                <Text style={styles.qStem}>{d.stem}</Text>
                {d.options?.map(o => (
                  <Text key={o.key} style={styles.qMeta}>
                    {o.key}: {o.text}{d.correct_keys?.includes(o.key) ? '  ✓' : ''}
                  </Text>
                ))}
                <Text style={styles.qMeta}>{d.marks ?? 1} mark(s)</Text>
                <Btn
                  label="Keep this one"
                  onPress={() => keepDraft(d, i)}
                  loading={savingDraftIdx === i}
                  variant="outline"
                  style={{ marginTop: Spacing.xs }}
                />
              </Card>
            ))}
          </ScrollView>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:    { flex: 1, backgroundColor: Colors.background, padding: Spacing.sm },
  pickerLabel:  { fontSize: Fonts.sizes.xs, fontWeight: '700', color: Colors.textSub, marginBottom: 2 },
  pickerWrap:   { borderWidth: 1.5, borderColor: Colors.border, borderRadius: Radius.sm, backgroundColor: Colors.white, marginBottom: Spacing.sm },
  switchRow:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: Spacing.xs },
  switchLabel:  { fontSize: Fonts.sizes.sm, fontWeight: '600', color: Colors.text },
  sectionTitle: { fontSize: Fonts.sizes.md, fontWeight: '700', color: Colors.text },
  badge:        { backgroundColor: Colors.primary + '20', borderRadius: Radius.sm, paddingHorizontal: 8, paddingVertical: 3, fontSize: Fonts.sizes.xs, color: Colors.primary, fontWeight: '700' },
  emptyQ:       { color: Colors.textSub, textAlign: 'center', padding: Spacing.md, fontStyle: 'italic' },
  qRow:         { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm, padding: Spacing.sm, borderRadius: Radius.sm, borderWidth: 1, borderColor: Colors.border, marginBottom: 6 },
  qRowSelected: { borderColor: Colors.primary, backgroundColor: Colors.primary + '08' },
  qCheckbox:    { width: 22, height: 22, borderRadius: 4, borderWidth: 2, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center', marginTop: 2 },
  qStem:        { fontSize: Fonts.sizes.sm, color: Colors.text, lineHeight: 18 },
  qMeta:        { fontSize: Fonts.sizes.xs, color: Colors.textSub, marginTop: 2 },
  draftBtn:     { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', backgroundColor: Colors.accent + '15', borderRadius: Radius.sm, paddingHorizontal: Spacing.sm, paddingVertical: 6, marginBottom: Spacing.sm },
  draftBtnTxt:  { color: Colors.accent, fontWeight: '700', fontSize: Fonts.sizes.sm },
  modalContainer: { flex: 1, backgroundColor: Colors.background },
  modalHeader:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.border, paddingTop: 54 },
  modalTitle:   { fontSize: Fonts.sizes.lg, fontWeight: '700', color: Colors.text },
  typeChip:     { paddingHorizontal: Spacing.md, paddingVertical: 6, borderRadius: Radius.sm, borderWidth: 1.5, borderColor: Colors.border },
  typeChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  typeChipTxt:  { fontSize: Fonts.sizes.sm, fontWeight: '700', color: Colors.text },
  draftError:   { color: Colors.error, fontSize: Fonts.sizes.sm, marginBottom: Spacing.sm },
  draftNote:    { color: Colors.textSub, fontSize: Fonts.sizes.xs, fontStyle: 'italic', marginBottom: Spacing.sm },
});
