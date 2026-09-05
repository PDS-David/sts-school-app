import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import api from '../api/client';
import { Card, Btn, Input, SectionHeader } from '../components/UI';
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

  useEffect(() => {
    api.get('/academic/classes', { params: { school_code: selectedSchoolCode ?? undefined } })
      .then(({ data }) => {
        const names = data.classes.map((c: any) => c.name);
        setClasses(names);
        if (names.length && !className) setClassName(names[0]);
      })
      .catch(() => {});
  }, [selectedSchoolCode]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (fullName.trim().length < 2) e.fullName = 'Enter the student\u2019s full name.';
    if (!className) e.className = 'Select a class.';
    if (parentPhone.trim() && parentPhone.trim().replace(/\D/g, '').length < 10) {
      e.parentPhone = 'Enter a full phone number, or leave blank if no parent account is needed yet.';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async () => {
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
        Alert.alert(
          'Student & parent account created',
          `${fullName.trim()} has been enrolled.\n\nA new parent account was created:\n` +
          `Username: ${data.parent.username}\nTemporary password: ${data.parent.temporary_password}\n\n` +
          `Hand these to the parent — they\u2019ll be asked to change the password on first login.`,
          [{ text: 'Done', onPress: () => navigation.goBack() }],
        );
      } else if (data.parent?.username) {
        Alert.alert(
          'Student created',
          `${fullName.trim()} has been enrolled and linked to the existing parent account "${data.parent.username}" (matched by phone number — likely a sibling).`,
          [{ text: 'Done', onPress: () => navigation.goBack() }],
        );
      } else {
        Alert.alert('Student created', `${fullName.trim()} has been enrolled.`, [{ text: 'Done', onPress: () => navigation.goBack() }]);
      }
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.error?.formErrors?.[0] ?? e?.response?.data?.error ?? 'Could not create this student. Check your connection and try again.');
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
        <Picker selectedValue={className} onValueChange={setClassName} style={styles.picker}>
          {classes.map((c) => <Picker.Item key={c} label={c} value={c} />)}
        </Picker>
        {errors.className ? <Text style={styles.errText}>{errors.className}</Text> : null}

        <Text style={styles.label}>Gender</Text>
        <Picker selectedValue={gender} onValueChange={(v) => setGender(v as typeof GENDERS[number])} style={styles.picker}>
          {GENDERS.map((g) => <Picker.Item key={g} label={g} value={g} />)}
        </Picker>

        <Input label="Date of birth (optional)" value={dob} onChangeText={setDob} placeholder="YYYY-MM-DD" />
        <Input label="Admission number (optional)" value={admissionNumber} onChangeText={setAdmissionNumber} placeholder="e.g. STS/2026/041" />
      </Card>

      <SectionHeader title="Parent / guardian (optional)" />
      <Card style={{ marginBottom: Spacing.lg }}>
        <Text style={styles.hint}>
          Leave phone blank to skip. If a parent account with this phone already exists at this school (e.g. a sibling), the student is linked to it instead of creating a duplicate.
        </Text>
        <Input label="Parent/guardian name" value={parentName} onChangeText={setParentName} placeholder="e.g. Mrs. Ibrahim" />
        <Input label="Parent phone" value={parentPhone} onChangeText={setParentPhone} placeholder="e.g. 08012345678" keyboardType="phone-pad" error={errors.parentPhone} />
        <Input label="Parent email (optional)" value={parentEmail} onChangeText={setParentEmail} placeholder="optional" keyboardType="email-address" autoCapitalize="none" />
      </Card>

      <Btn label="Enroll Student" onPress={submit} loading={saving} />
      <View style={{ height: Spacing.xl }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: Fonts.sizes.sm, fontWeight: '600', color: Colors.textSub, marginTop: Spacing.xs },
  picker: { marginBottom: Spacing.xs },
  errText: { color: Colors.error, fontSize: Fonts.sizes.xs, marginBottom: Spacing.xs },
  hint: { fontSize: Fonts.sizes.xs, color: Colors.textSub, marginBottom: Spacing.sm },
});
