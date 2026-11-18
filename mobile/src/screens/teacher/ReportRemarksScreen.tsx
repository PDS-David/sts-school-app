import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import api from '../../api/client';
import { Card, Btn, Loader, Empty } from '../../components/UI';
import { PageContainer } from '../../components/layout';
import { Colors, Spacing, Fonts, Radius } from '../../theme';

export default function ReportRemarksScreen() {
  const [students, setStudents] = useState<any[]>([]);
  const [terms, setTerms] = useState<any[]>([]);
  const [studentId, setStudentId] = useState('');
  const [termId, setTermId] = useState<number | ''>('');
  const [classTeacherRemark, setClassTeacherRemark] = useState('');
  const [adminRemark, setAdminRemark] = useState('');
  const [loading, setLoading] = useState(true);
  const [recordLoading, setRecordLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    let cancelled = false;
    Promise.all([api.get('/students'), api.get('/academic/terms')])
      .then(([s, t]) => {
        if (cancelled) return;
        const roster = s.data.students ?? [];
        const availableTerms = t.data.terms ?? [];
        setStudents(roster);
        setTerms(availableTerms);
        setStudentId(roster[0]?.id ?? '');
        const current = availableTerms.find((x: any) => x.is_current) ?? availableTerms[0];
        setTermId(current?.id ?? '');
      })
      .catch((e: any) => { if (!cancelled) setError(e?.response?.data?.error ?? 'Could not load your class roster and terms.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!studentId || !termId) return;
    let cancelled = false;
    setRecordLoading(true);
    setNotice('');
    api.get(`/scores/report/${studentId}`, { params: { term_id: termId } })
      .then(({ data }) => {
        if (cancelled) return;
        setClassTeacherRemark(data.class_record?.class_teacher_remark ?? '');
        setAdminRemark(data.class_record?.admin_remark ?? '');
      })
      .catch((e: any) => {
        if (!cancelled) setError(e?.response?.data?.error ?? 'Could not load the selected report remarks.');
      })
      .finally(() => { if (!cancelled) setRecordLoading(false); });
    return () => { cancelled = true; };
  }, [studentId, termId]);

  const save = async () => {
    if (!studentId || !termId || saving) return;
    setSaving(true);
    setNotice('');
    setError('');
    try {
      await api.put(`/scores/class-record/${studentId}`, {
        term_id: Number(termId),
        class_teacher_remark: classTeacherRemark,
        admin_remark: adminRemark,
      });
      setNotice('Report remarks saved successfully.');
    } catch (e: any) {
      setError(e?.response?.data?.error ?? 'Could not save report remarks.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;
  if (error && !students.length) return <PageContainer style={{ padding: Spacing.md }}><Empty message={error} /></PageContainer>;

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <PageContainer style={{ padding: Spacing.md }}>
        <Card>
          <Text style={styles.label}>Student</Text>
          <View style={styles.picker}>
            <Picker selectedValue={studentId} onValueChange={setStudentId}>
              {students.map(s => <Picker.Item key={s.id} label={s.full_name} value={s.id} />)}
            </Picker>
          </View>
          <Text style={styles.label}>Term</Text>
          <View style={styles.picker}>
            <Picker selectedValue={termId} onValueChange={v => setTermId(Number(v))}>
              {terms.map(t => <Picker.Item key={t.id} label={`${t.name} – ${t.academic_year}`} value={t.id} />)}
            </Picker>
          </View>
        </Card>
        {recordLoading ? <Loader /> : (
          <Card style={{ marginTop: Spacing.md }}>
            <Text style={styles.label}>Class Teacher's Remark</Text>
            <TextInput value={classTeacherRemark} onChangeText={setClassTeacherRemark}
              multiline textAlignVertical="top" style={styles.textArea}
              placeholder="Enter the class teacher's remark" />
            <Text style={styles.label}>Principal / Head Teacher's Remark</Text>
            <TextInput value={adminRemark} onChangeText={setAdminRemark}
              multiline textAlignVertical="top" style={styles.textArea}
              placeholder="Enter the principal's or head teacher's remark" />
            <Btn label={saving ? 'Saving…' : 'Save Report Remarks'} onPress={save} loading={saving} />
            {!!notice && <Text style={styles.success}>{notice}</Text>}
            {!!error && <Text style={styles.error}>{error}</Text>}
          </Card>
        )}
      </PageContainer>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  label: { fontSize: Fonts.sizes.sm, color: Colors.text, fontWeight: '700', marginBottom: Spacing.xs, marginTop: Spacing.sm },
  picker: { borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.md, marginBottom: Spacing.sm, overflow: 'hidden' },
  textArea: { minHeight: 110, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.md, padding: Spacing.sm, color: Colors.text, backgroundColor: Colors.white, marginBottom: Spacing.md },
  success: { color: Colors.success ?? '#2E7D32', marginTop: Spacing.sm },
  error: { color: Colors.danger ?? '#C62828', marginTop: Spacing.sm },
});
