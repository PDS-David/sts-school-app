import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, ScrollView, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../api/client';
import { Card, Btn, Input, Loader, Empty, SectionHeader, Badge } from '../components/UI';
import { Colors, Spacing, Fonts, Radius } from '../theme';
import { useAuth } from '../api/AuthContext';
import { useAdminSchool } from '../api/AdminSchoolContext';
import { SchoolSwitcherBar } from '../components/SchoolSwitcherBar';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { PageContainer, useIsWide } from '../components/layout';

// ══════════════════════════════════════════
// TERMS
// ══════════════════════════════════════════
export function TermsMgmtScreen({ navigation }: any) {
  const isWide = useIsWide();
  const { selectedSchoolCode } = useAdminSchool();
  const [terms,   setTerms]   = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [saving, setSaving] = useState(false);
  const [updatingCurrent, setUpdatingCurrent] = useState<number | null>(null);
  const [infoDialog, setInfoDialog] = useState<{ title: string; message: string } | null>(null);
  const [modal,   setModal]   = useState(false);
  const [form,    setForm]    = useState({
    name: '', academic_year: '', school_code: '',
    start_date: '', end_date: '', days_opened: '', next_term_begins: '',
  });
  const [isCurrent, setIsCurrent] = useState(false);

  useEffect(() => {
    navigation.setOptions({ headerRight: () => <SchoolSwitcherBar compact /> });
  }, [navigation]);

  const fetch = async () => {
    setLoading(true);
    setLoadError('');
    try {
      const { data } = await api.get('/academic/terms', { params: { school_code: selectedSchoolCode } });
      setTerms(data.terms ?? []);
    } catch (e: any) {
      setLoadError(e?.response?.data?.error ?? 'Could not load academic terms for the selected school.');
    } finally { setLoading(false); }
  };
  // Re-fetch whenever admin switches which school they're viewing.
  useEffect(() => { fetch(); }, [selectedSchoolCode]);

  const openAddModal = () => {
    setForm(f => ({ ...f, school_code: selectedSchoolCode ?? f.school_code }));
    setModal(true);
  };

  const handleSave = async () => {
    if (saving) return;
    if (!form.name.trim() || !form.academic_year.trim()) { setInfoDialog({ title: 'Required fields', message: 'Enter the term name and academic year.' }); return; }
    const days = form.days_opened.trim() ? Number(form.days_opened) : 0;
    if (!Number.isInteger(days) || days < 0) { setInfoDialog({ title: 'Invalid school days', message: 'Days school opened must be a whole number of zero or more.' }); return; }
    const datePattern = /^\\d{4}-\\d{2}-\\d{2}$/;
    if (form.start_date && !datePattern.test(form.start_date)) { setInfoDialog({ title: 'Invalid start date', message: 'Use YYYY-MM-DD for the start date.' }); return; }
    if (form.end_date && !datePattern.test(form.end_date)) { setInfoDialog({ title: 'Invalid end date', message: 'Use YYYY-MM-DD for the end date.' }); return; }
    if (form.start_date && form.end_date && form.end_date < form.start_date) { setInfoDialog({ title: 'Invalid date range', message: 'The end date must not be earlier than the start date.' }); return; }
    setSaving(true);
    try {
      await api.post('/academic/terms', { ...form, name: form.name.trim(), academic_year: form.academic_year.trim(), is_current: isCurrent, days_opened: days });
      setModal(false);
      fetch();
    } catch (e: any) { setInfoDialog({ title: 'Could not save term', message: e?.response?.data?.error ?? 'Save failed. Check your connection and try again.' }); }
    finally { setSaving(false); }
  };

  const setCurrentTerm = async (t: any) => {
    if (updatingCurrent !== null) return;
    setUpdatingCurrent(t.id);
    try {
      await api.put(`/academic/terms/${t.id}`, { is_current: true });
      fetch();
    } catch (e: any) {
      setInfoDialog({ title: 'Could not set current term', message: e?.response?.data?.error ?? 'Check your connection and try again.' });
    } finally { setUpdatingCurrent(null); }
  };

  if (loading) return <Loader />;

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <PageContainer style={{ padding: Spacing.sm, paddingBottom: 0 }}>
        <TouchableOpacity style={styles.addBtn} onPress={openAddModal}>
          <Ionicons name="add-circle" size={20} color={Colors.white} />
          <Text style={styles.addBtnTxt}>Add Term</Text>
        </TouchableOpacity>
      </PageContainer>

      <FlatList
        data={terms}
        keyExtractor={t => String(t.id)}
        // See AdminUsersScreen.tsx's FlatList for why this is set explicitly.
        removeClippedSubviews={false}
        contentContainerStyle={{ padding: Spacing.sm, ...(isWide ? { alignItems: 'center' as const } : null) }}
        ListEmptyComponent={<Empty message="No terms created yet" />}
        renderItem={({ item: t }) => (
          <PageContainer style={{ width: '100%' }}>
            <Card>
              <View style={styles.row}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.termName}>{t.name} – {t.academic_year}</Text>
                  <Text style={styles.termMeta}>{t.school_code} · Days: {t.days_opened}</Text>
                  {t.next_term_begins && <Text style={styles.termMeta}>Next term: {t.next_term_begins}</Text>}
                </View>
                {t.is_current
                  ? <Badge label="CURRENT" color={Colors.success} />
                  : <TouchableOpacity onPress={() => setCurrentTerm(t)} style={styles.setCurrentBtn}>
                      <Text style={styles.setCurrentTxt}>Set Current</Text>
                    </TouchableOpacity>
                }
              </View>
            </Card>
          </PageContainer>
        )}
      />

      <Modal visible={modal} animationType="slide" onRequestClose={() => setModal(false)}>
        <ScrollView style={styles.modalOuter} contentContainerStyle={styles.modal} keyboardShouldPersistTaps="handled">
          <SectionHeader title="New Term" />
          <Input label="Name (e.g. 1st Term)"          value={form.name}             onChangeText={v => setForm(f => ({ ...f, name: v }))} />
          <Input label="Academic Year (e.g. 2024/2025)" value={form.academic_year}    onChangeText={v => setForm(f => ({ ...f, academic_year: v }))} />
          <Input label="School Code"                    value={form.school_code}      onChangeText={v => setForm(f => ({ ...f, school_code: v }))} placeholder="primary / secondary" />
          <Input label="Start Date (YYYY-MM-DD)"        value={form.start_date}       onChangeText={v => setForm(f => ({ ...f, start_date: v }))} />
          <Input label="End Date (YYYY-MM-DD)"          value={form.end_date}         onChangeText={v => setForm(f => ({ ...f, end_date: v }))} />
          <Input label="Days School Opened"             value={form.days_opened}      onChangeText={v => setForm(f => ({ ...f, days_opened: v }))} keyboardType="numeric" />
          <Input label="Next Term Begins"               value={form.next_term_begins} onChangeText={v => setForm(f => ({ ...f, next_term_begins: v }))} placeholder="e.g. 14th January 2025" />
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Set as Current Term</Text>
            <Switch value={isCurrent} onValueChange={setIsCurrent} thumbColor={Colors.primary} />
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

// ══════════════════════════════════════════
// SUBJECTS
// ══════════════════════════════════════════
export function SubjectsMgmtScreen({ navigation }: any) {
  const { user } = useAuth();
  const { selectedSchoolCode } = useAdminSchool();
  const isAdmin = user?.role === 'admin';
  const isWide = useIsWide();
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [name,     setName]     = useState('');
  const [code,     setCode]     = useState('');
  const [saving,   setSaving]   = useState(false);

  // Compact switcher lives in the native header now, not as a full-width
  // block in the content area — see SchoolSwitcherBar.tsx's `compact` doc.
  // Kept unconditional (not gated on isAdmin) to match this screen's
  // pre-existing behavior exactly — not changing who sees it, just where.
  useEffect(() => {
    navigation.setOptions({ headerRight: () => <SchoolSwitcherBar compact /> });
  }, [navigation]);

  const fetch = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/academic/subjects', { params: { school_code: selectedSchoolCode ?? undefined } });
      setSubjects(data.subjects);
    }
    catch { } finally { setLoading(false); }
  };
  useEffect(() => { fetch(); }, [selectedSchoolCode]);

  const handleAdd = async () => {
    if (!name.trim()) { Alert.alert('Subject name required'); return; }
    setSaving(true);
    try {
      await api.post('/academic/subjects', { name: name.trim(), code: code.trim(), school_code: selectedSchoolCode ?? undefined });
      setName(''); setCode(''); fetch();
    }
    catch (e: any) { Alert.alert('Error', e?.response?.data?.error ?? 'Failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = (id: number) => {
    Alert.alert(
      'Delete subject?',
      'This is blocked if any scores, materials, questions, or assessments have already been recorded against it — deleting only works for a subject with no history.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: async () => {
          try {
            await api.delete(`/academic/subjects/${id}`);
            fetch();
          } catch (e: any) {
            Alert.alert('Error', e?.response?.data?.error ?? 'Could not delete this subject');
          }
        }},
      ],
    );
  };

  if (loading) return <Loader />;

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <PageContainer style={{ padding: Spacing.sm }}>
        <Card>
          <SectionHeader title="Add Subject" />
          <View style={isWide ? styles.filterRow : undefined}>
            <View style={isWide ? styles.filterCol : undefined}>
              <Input label="Subject Name" value={name} onChangeText={setName} placeholder="e.g. Mathematics" />
            </View>
            <View style={isWide ? styles.filterCol : undefined}>
              <Input label="Code (optional)" value={code} onChangeText={setCode} placeholder="e.g. MTH" />
            </View>
          </View>
          <Btn label={saving ? 'Adding…' : 'Add Subject'} onPress={handleAdd} loading={saving} />
          {!isAdmin && (
            <Text style={styles.hint}>You can add subjects here. Removing a subject requires an admin.</Text>
          )}
        </Card>
      </PageContainer>
      <FlatList
        data={subjects}
        keyExtractor={s => String(s.id)}
        // See AdminUsersScreen.tsx's FlatList for why this is set explicitly.
        removeClippedSubviews={false}
        contentContainerStyle={{ paddingHorizontal: Spacing.sm, ...(isWide ? { alignItems: 'center' as const } : null) }}
        ListEmptyComponent={<Empty message="No subjects yet" />}
        renderItem={({ item: s }) => (
          <PageContainer style={{ width: '100%' }}>
            <View style={styles.subRow}>
              <Text style={styles.subName}>{s.name}</Text>
              {s.code && <Text style={styles.subCode}>{s.code}</Text>}
              {isAdmin && (
                <TouchableOpacity onPress={() => handleDelete(s.id)} style={{ padding: 6 }}>
                  <Ionicons name="trash-outline" size={18} color={Colors.error} />
                </TouchableOpacity>
              )}
            </View>
          </PageContainer>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  addBtn:       { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, backgroundColor: Colors.primary, borderRadius: Radius.md, paddingVertical: 12, paddingHorizontal: Spacing.lg, alignSelf: 'flex-start', marginBottom: Spacing.sm },
  addBtnTxt:    { color: Colors.white, fontWeight: '700', fontSize: Fonts.sizes.md },
  filterRow:    { flexDirection: 'row', gap: Spacing.md, alignItems: 'flex-start' },
  filterCol:    { flex: 1, minWidth: 0 },
  row:          { flexDirection: 'row', alignItems: 'center' },
  termName:     { fontSize: Fonts.sizes.md, fontWeight: '700', color: Colors.text },
  termMeta:     { fontSize: Fonts.sizes.xs, color: Colors.textSub, marginTop: 2 },
  setCurrentBtn:{ borderWidth: 1, borderColor: Colors.primary, borderRadius: Radius.sm, paddingHorizontal: 8, paddingVertical: 4 },
  setCurrentTxt:{ color: Colors.primary, fontSize: Fonts.sizes.xs, fontWeight: '700' },
  modalOuter:   { flex: 1, backgroundColor: Colors.background },
  modal:        { padding: Spacing.lg, paddingBottom: Spacing.lg * 3 },
  switchRow:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: Spacing.sm },
  switchLabel:  { fontSize: Fonts.sizes.sm, color: Colors.text, fontWeight: '600' },
  subRow:       { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.card, borderRadius: Radius.sm, padding: Spacing.md, marginBottom: 6, elevation: 1 },
  subName:      { flex: 1, fontSize: Fonts.sizes.md, fontWeight: '600', color: Colors.text },
  subCode:      { fontSize: Fonts.sizes.sm, color: Colors.textSub, marginRight: Spacing.sm },
  hint:         { fontSize: Fonts.sizes.xs, color: Colors.textSub, marginTop: Spacing.xs, fontStyle: 'italic' },
});
