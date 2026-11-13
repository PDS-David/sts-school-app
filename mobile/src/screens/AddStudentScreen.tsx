import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import api from '../api/client';
import { Card, Btn, Input, SectionHeader } from '../components/UI';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { Colors, Spacing, Fonts } from '../theme';
import { useAdminSchool } from '../api/AdminSchoolContext';

const GENDERS = ['M', 'F', 'Other'] as const;

// Backend contract: POST /students (see routes/students.ts). parent_phone is
// the only trigger for auto-provisioning — leave it blank to add a student
// with no parent account yet (can be linked later the old way, via
// POST /students/:id/link-parent, if that screen exists). When given, the
// backend finds-or-creates a parent account (de-duplicated by phone within
// the school — siblings share one account) and returns its credentials in
// the response, which we show once so admin can hand them over physically —
// same as any other manually-created account in this app.
export default function AddStudentScreen({ navigation }: any) {
  const { selectedSchoolCode } = useAdminSchool();
  const [classes, setClasses] = useState<string[]>([]);
  const [classLoading, setClassLoading] = useState(true);
  const [classError, setClassError] = useState('');
  const [classRetry, setClassRetry] = useState(0);

  const [fullName, setFullName] = useState('');
  const [className, setClassName] = useState('');
  const [gender, setGender] = useState<typeof GENDERS[number]>('M');
  const [dob, setDob] = useState('');
  const [admissionNumber, setAdmissionNumber] = useState('');
  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [parentEmail, setParentEmail] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [dialog, setDialog] = useState<{ title: string; message: string; onDone?: () => void } | null>(null);

  useEffect(() => {
    let cancelled = false;
    setClassLoading(true);
    setClassError('');
    setClasses([]);
    setClassName('');
    api.get('/academic/classes', { params: { school_code: selectedSchoolCode ?? undefined } })
      .then(({ data }) => {
        if (cancelled) return;
        const names = (data.classes ?? []).map((c: any) => c.name);
        setClasses(names);
        if (names.length) setClassName(names[0]);
      })
      .catch((e: any) => {
        if (!cancelled) setClassError(e?.response?.data?.error ?? 'Could not load classes for this school. Retry before enrolling a student.');
      })
      .finally(() => { if (!cancelled) setClassLoading(false); });
    return () => { cancelled = true; };
  }, [selectedSchoolCode, classRetry]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (fullName.trim().length < 2) e.fullName = 'Enter the student\u2019s full name.';
    if (!className || !classes.includes(className)) e.className = 'Select a valid class for the selected school.';
    const phoneDigits = parentPhone.trim().replace(/\D/g, '');
    if (parentPhone.trim() && (phoneDigits.length < 10 || phoneDigits.length > 15)) {
      e.parentPhone = 'Enter a phone number containing 10 to 15 digits, or leave blank if no parent account is needed yet.';
    }
    if (dob.trim()) {
      const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dob.trim());
      const parsed = match ? new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3])) : null;
      if (!match || !parsed || parsed.getFullYear() !== Number(match[1]) || parsed.getMonth() !== Number(match[2]) - 1 || parsed.getDate() !== Number(match[3])) {
        e.dob = 'Enter a valid date in YYYY-MM-DD format.';
      } else if (parsed > new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())) {
        e.dob = 'Date of birth cannot be in the future.';
      }
    }
    if (parentEmail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(parentEmail.trim())) {
      e.parentEmail = 'Enter a valid email address.';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async () => {
    if (saving || classLoading || classError || !classes.length) return;
    if (!validate()) return;
    setSaving(true);
    try {
      const { data } = await api.post('/students', {
        full_name: fullName.trim(),
        class_name: className,
        school_code: selectedSchoolCode,
        gender,
        date_of_birth: dob.trim() || undefined,
        admission_number: admissionNumber.trim() || undefined,
        parent_name: parentName.trim() || undefined,
        parent_phone: parentPhone.trim() || undefined,
        parent_email: parentEmail.trim() || undefined,
      });

      if (data.parent?.temporary_password) {
        setDialog({
          title: 'Student & parent account created',
          message: `${fullName.trim()} has been enrolled.\n\nA new parent account was created:\nUsername: ${data.parent.username}\nTemporary password: ${data.parent.temporary_password}\n\nHand these to the parent — they’ll be asked to change the password on first login.`,
          onDone: () => navigation.goBack(),
        });
      } else if (data.parent?.username) {
        setDialog({
          title: 'Student created',
          message: `${fullName.trim()} has been enrolled and linked to the existing parent account "${data.parent.username}" (matched by phone number — likely a sibling).`,
          onDone: () => navigation.goBack(),
        });
      } else {
        setDialog({ title: 'Student created', message: `${fullName.trim()} has been enrolled.`, onDone: () => navigation.goBack() });
      }
    } catch (e: any) {
      setDialog({ title: 'Could not enroll student', message: e?.response?.data?.error?.formErrors?.[0] ?? e?.response?.data?.error ?? 'Could not create this student. Check your connection and try again.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: Colors.background }} contentContainerStyle={{ padding: Spacing.md }}>
      <SectionHeader title="Student details" />
      <Card style={{ marginBottom: Spacing.md }}>
        <Input label="Full name" value={fullName} onChangeText={setFullName} placeholder="e.g. Ade Ibrahim" error={errors.fullName} />

        <Text style={styles.label}>Class</Text>
        {classLoading ? <Text style={styles.hint}>Loading classes…</Text> : classError ? (
          <View><Text style={styles.errText}>{classError}</Text><Btn label='Retry classes' variant='outline' onPress={() => setClassRetry(v => v + 1)} /></View>
        ) : classes.length === 0 ? <Text style={styles.errText}>No classes have been set up for this school. Create classes before enrolling students.</Text> : (
          <Picker selectedValue={className} onValueChange={setClassName} style={styles.picker}>
            {classes.map((c) => <Picker.Item key={c} label={c} value={c} />)}
          </Picker>
        )}
        {errors.className ? <Text style={styles.errText}>{errors.className}</Text> : null}

        <Text style={styles.label}>Gender</Text>
        <Picker selectedValue={gender} onValueChange={(v) => setGender(v as typeof GENDERS[number])} style={styles.picker}>
          {GENDERS.map((g) => <Picker.Item key={g} label={g} value={g} />)}
        </Picker>

        <Input label="Date of birth (optional)" value={dob} onChangeText={setDob} placeholder="YYYY-MM-DD" error={errors.dob} />
        <Input label="Admission number (optional)" value={admissionNumber} onChangeText={setAdmissionNumber} placeholder="e.g. STS/2026/041" />
      </Card>

      <SectionHeader title="Parent / guardian (optional)" />
      <Card style={{ marginBottom: Spacing.lg }}>
        <Text style={styles.hint}>
          Leave phone blank to skip. If a parent account with this phone already exists at this school (e.g. a sibling), the student is linked to it instead of creating a duplicate.
        </Text>
        <Input label="Parent/guardian name" value={parentName} onChangeText={setParentName} placeholder="e.g. Mrs. Ibrahim" />
        <Input label="Parent phone" value={parentPhone} onChangeText={setParentPhone} placeholder="e.g. 08012345678" keyboardType="phone-pad" error={errors.parentPhone} />
        <Input label="Parent email (optional)" value={parentEmail} onChangeText={setParentEmail} placeholder="optional" keyboardType="email-address" autoCapitalize="none" error={errors.parentEmail} />
      </Card>

      <Btn label="Enroll Student" onPress={submit} loading={saving} disabled={saving || classLoading || !!classError || classes.length === 0 || !className} />
      <View style={{ height: Spacing.xl }} />
      <ConfirmDialog visible={!!dialog} title={dialog?.title ?? ''} message={dialog?.message ?? ''} hideCancel onConfirm={() => { const done = dialog?.onDone; setDialog(null); done?.(); }} onCancel={() => setDialog(null)} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: Fonts.sizes.sm, fontWeight: '600', color: Colors.textSub, marginTop: Spacing.xs },
  picker: { marginBottom: Spacing.xs },
  errText: { color: Colors.error, fontSize: Fonts.sizes.xs, marginBottom: Spacing.xs },
  hint: { fontSize: Fonts.sizes.xs, color: Colors.textSub, marginBottom: Spacing.sm },
});
