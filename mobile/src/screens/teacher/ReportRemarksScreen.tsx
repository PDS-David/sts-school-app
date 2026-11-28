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
  const [selectedClass, setSelectedClass] = useState('');
  const [studentId, setStudentId] = useState('');
  const [termId, setTermId] = useState<number | ''>('');
  const [classTeacherRemark, setClassTeacherRemark] = useState('');
  const [adminRemark, setAdminRemark] = useState('');
  const [loading, setLoading] = useState(true);
  const [recordLoading, setRecordLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [setupRetry, setSetupRetry] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setError('');
    Promise.all([api.get('/students'), api.get('/academic/terms')])
      .then(([s, t]) => {
        if (cancelled) return;
        const roster = s.data.students ?? [];
        const availableTerms = t.data.terms ?? [];
        setStudents(roster);
        const rosterClasses = [...new Set(roster.map((student: any) => student.class_name).filter(Boolean))].sort();
        setSelectedClass(rosterClasses[0] ?? '');
        setStudentId(roster.find((student: any) => student.class_name === rosterClasses[0])?.id ?? '');
        setTerms(availableTerms);
        const current = availableTerms.find((x: any) => x.is_current) ?? availableTerms[0];
        setTermId(current?.id ?? '');
      })
      .catch((e: any) => { if (!cancelled) setError(e?.response?.data?.error ?? 'Could not load your class roster and terms.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [setupRetry]);

  const classStudents = students.filter(student => !selectedClass || student.class_name === selectedClass);

  useEffect(() => {
    if (!studentId || !termId) return;
    let cancelled = false;
    setRecordLoading(true);
    setNotice('');
    setError('');
    setClassTeacherRemark('');
    setAdminRemark('');
    api.get(`/attendance/class-records/${studentId}/${termId}`)
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
    if (!studentId || !termId || saving || recordLoading || !!error) return;
    setSaving(true);
    setNotice('');
    setError('');
    try {
      await api.put('/attendance/class-records', {
        student_id: studentId,
        term_id: Number(termId),
        class_teacher_remark: classTeacherRemark,
      });
      setNotice('Report remarks saved successfully.');
    } catch (e: any) {
      setError(e?.response?.data?.error ?? 'Could not save report remarks.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;
  if (error && !students.length) return (
    <PageContainer style={{ padding: Spacing.md }}>
      <Empty message={error} />
      <Btn label="Retry loading roster and terms" variant="outline" onPress={() => { setLoading(true); setSetupRetry(v => v + 1); }} />
    </PageContainer>
  );

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <PageContainer style={{ padding: Spacing.md }}>
        <Card>
          {students.some(student => student.class_name) && (
            <>
              <Text style={styles.label}>Class</Text>
              <View style={styles.picker}>
                <Picker
                  selectedValue={selectedClass}
                  onValueChange={value => {
                    setSelectedClass(String(value));
                    const nextStudent = students.find(student => student.class_name === String(value));
                    setStudentId(nextStudent?.id ?? '');
                  }}
                  accessibilityLabel="Select class for report remarks"
                >
                  {[...new Set(students.map(student => student.class_name).filter(Boolean))].sort().map(className => (
                    <Picker.Item key={className} label={className} value={className} />
                  ))}
                </Picker>
              </View>
            </>
          )}
          <Text style={styles.label}>Student</Text>
          <View style={styles.picker}>
            <Picker selectedValue={studentId} onValueChange={setStudentId}>
              {classStudents.map(s => <Picker.Item key={s.id} label={s.full_name} value={s.id} />)}
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
            <Text style={styles.label}>Principal / Head Teacher's Remark (view only)</Text>
            <TextInput value={adminRemark} editable={false}
              multiline textAlignVertical="top" style={[styles.textArea, styles.readOnly]}
              placeholder="No principal's or head teacher's remark recorded yet" />
            <Btn label={saving ? 'Saving…' : 'Save Report Remarks'} onPress={save} loading={saving} disabled={saving || recordLoading || !!error || !studentId || !termId || !classStudents.some(student => student.id === studentId)} />
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
  readOnly: { backgroundColor: Colors.background, color: Colors.textSub },
  success: { color: '#2E7D32', marginTop: Spacing.sm },
  error: { color: '#C62828', marginTop: Spacing.sm },
});
