import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import api from '../api/client';
import { Btn, Input, Card, Loader, Empty } from '../components/UI';
import { Colors, Spacing, Fonts } from '../theme';

// Public (no login) — POST /auth/self-register. Student, parent, and
// teacher can create their own account directly (own username + password,
// no admin-issued activation or class code) — see the detailed comment on
// that route in backend/src/routes/auth.ts for the full history of this
// decision. Deliberately a single flat form, not a multi-step wizard like
// StudentSelfClaimScreen.tsx — the project owner explicitly wanted this
// path to be low-friction. The real safeguard isn't at signup, it's
// afterward: students may start DIY learning immediately in free-launch mode;
// parent and teacher accounts remain subject to the admin-review gate.
type SelfRole = 'student' | 'parent' | 'teacher';

export default function SelfRegisterScreen({ navigation }: any) {
  const [role, setRole] = useState<SelfRole>('student');
  const [schools, setSchools] = useState<{ code: string; name: string }[]>([]);
  const [schoolCode, setSchoolCode] = useState('');
  const [loadingSchools, setLoadingSchools] = useState(true);
  const [schoolsError, setSchoolsError] = useState('');

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [className, setClassName] = useState('');
  const [classes, setClasses] = useState<string[]>([]);
  const [loadingClasses, setLoadingClasses] = useState(false);
  const [classError, setClassError] = useState('');
  const [wardAdmissionNumber, setWardAdmissionNumber] = useState(''); // parent
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState<{ username: string; approvalRequired: boolean } | null>(null);

  // Reuses the existing, already-public self-claim schools endpoint rather
  // than adding a near-duplicate one.
  const loadSchools = useCallback(async () => {
    setLoadingSchools(true);
    setSchoolsError('');
    try {
      const { data } = await api.get('/auth/self-claim/schools');
      setSchools(data.schools ?? []);
      if (data.schools?.length === 1) setSchoolCode(data.schools[0].code);
    } catch {
      setSchoolsError('Could not load schools. Check your connection and try again.');
    } finally {
      setLoadingSchools(false);
    }
  }, []);

  useEffect(() => { void loadSchools(); }, [loadSchools]);

  // The selected class scopes online curriculum only. It does not create
  // or claim a physical report-roster membership.
  useEffect(() => {
    let active = true;
    setClasses([]);
    setClassName('');
    setClassError('');
    if (role !== 'student' || !schoolCode) {
      setLoadingClasses(false);
      return () => { active = false; };
    }
    setLoadingClasses(true);
    api.get('/auth/self-claim/classes', { params: { school_code: schoolCode } })
      .then(({ data }) => {
        if (!active) return;
        const names = Array.isArray(data.classes) ? data.classes as string[] : [];
        setClasses(names);
        if (names.length === 1) setClassName(names[0]);
        if (names.length === 0) setClassError('No learning classes are configured for this school yet.');
      })
      .catch(() => { if (active) setClassError('Could not load classes. Please reselect the school and try again.'); })
      .finally(() => { if (active) setLoadingClasses(false); });
    return () => { active = false; };
  }, [role, schoolCode]);

  const handleSubmit = async () => {
    setError('');
    if (!schoolCode)             { setError('Select your school'); return; }
    if (!fullName.trim())        { setError('Full name is required'); return; }
    if (!phone.trim())           { setError('Phone number is required'); return; }
    if (role === 'student' && !className) { setError('Select your learning class'); return; }
    if (role === 'parent' && !wardAdmissionNumber.trim()) { setError("Your ward's admission number is required"); return; }
    if (!username.trim())        { setError('Choose a username'); return; }
    if (!password)               { setError('Choose a password'); return; }
    if (password.length < 8)     { setError('Password must be at least 8 characters'); return; }
    if (password !== confirm)    { setError('Passwords do not match'); return; }

    setLoading(true);
    try {
      const { data } = await api.post('/auth/self-register', {
        role,
        full_name: fullName.trim(),
        phone: phone.trim(),
        school_code: schoolCode,
        username: username.trim(),
        password,
        ...(role === 'student' ? { class_name: className } : {}),
        ...(role === 'parent' ? { ward_admission_number: wardAdmissionNumber.trim() } : {}),
      });
      setDone({ username: data.username, approvalRequired: Boolean(data.approval_required) });
    } catch (e: any) {
      setError(e?.response?.data?.error ?? (!e?.response ? 'No internet connection.' : 'Something went wrong. Try again.'));
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <View style={styles.container}>
        <Card>
          <Text style={styles.title}>Account created!</Text>
          <Text style={styles.helper}>Your username is:</Text>
          <Text style={styles.username}>{done.username}</Text>
          <Text style={styles.helper}>
            Write this down — you'll need it to sign in. {done.approvalRequired
              ? 'A school admin must approve this account before class-related access is enabled.'
              : 'Your online-learning account is ready. Sign in to start learning; no admission number, physical report record or teacher assignment is needed.'}
          </Text>
          <Btn label="Back to Sign In" onPress={() => navigation.replace('Login')} style={{ marginTop: Spacing.md }} />
        </Card>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Card>
          <Text style={styles.title}>Create Your Account</Text>
          <Text style={styles.helper}>
            {role === 'student'
              ? 'Create an independent online-learning account. Choose your school and learning class; no admission number or physical report record is required.'
              : 'No activation code needed. Parent and teacher accounts remain subject to school-admin review.'}
          </Text>

          <Text style={styles.label}>I am a…</Text>
          <Picker selectedValue={role} onValueChange={(v) => setRole(v as SelfRole)} style={styles.picker}>
            <Picker.Item label="Student" value="student" />
            <Picker.Item label="Parent" value="parent" />
            <Picker.Item label="Teacher" value="teacher" />
          </Picker>

          {loadingSchools ? <Loader /> : schoolsError ? (
            <>
              <Text style={styles.error}>{schoolsError}</Text>
              <Btn label="Retry loading schools" variant="outline" onPress={loadSchools} />
            </>
          ) : schools.length === 0 ? (
            <Empty message="No schools are available for account setup. Please contact your school admin." />
          ) : (
            <>
              <Text style={styles.label}>School</Text>
              <Picker selectedValue={schoolCode} onValueChange={(value) => { setSchoolCode(value); setError(''); }} style={styles.picker}>
                <Picker.Item label="Select your school…" value="" />
                {schools.map((s) => <Picker.Item key={s.code} label={s.name} value={s.code} />)}
              </Picker>
            </>
          )}

          <Input label="Full Name" value={fullName} onChangeText={setFullName} placeholder="Your full name" />
          <Input label="Phone Number" value={phone} onChangeText={setPhone} placeholder="e.g. 08012345678" keyboardType="phone-pad" />

          {role === 'student' && (
            <>
              <Text style={styles.label}>Learning Class</Text>
              <Picker selectedValue={className} onValueChange={(value) => setClassName(String(value))} style={styles.picker} enabled={!loadingClasses && classes.length > 0}>
                <Picker.Item label={loadingClasses ? 'Loading classes…' : 'Select your learning class'} value="" />
                {classes.map((name) => <Picker.Item key={name} label={name} value={name} />)}
              </Picker>
              {classError ? <Text style={styles.error}>{classError}</Text> : null}
            </>
          )}
          {role === 'parent' && (
            <Input label="Your Ward's Admission Number" value={wardAdmissionNumber} onChangeText={setWardAdmissionNumber} placeholder="Your child's admission number" />
          )}

          <Input label="Choose a Username" value={username} onChangeText={setUsername} placeholder="e.g. your name, no spaces" autoCapitalize="none" />
          <Input label="Choose a Password" value={password} onChangeText={setPassword} placeholder="At least 8 characters" secureTextEntry />
          <Input label="Confirm Password" value={confirm} onChangeText={setConfirm} placeholder="Re-enter password" secureTextEntry />

          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Btn label="Create My Account" onPress={handleSubmit} loading={loading} disabled={loadingSchools || loadingClasses || schools.length === 0 || !schoolCode || (role === 'student' && !className)} style={{ marginTop: Spacing.md }} />
        </Card>

        <Btn label="Back to Sign In" variant="outline" onPress={() => navigation.replace('Login')} style={{ marginTop: Spacing.md }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: Colors.background, padding: Spacing.lg, justifyContent: 'center' },
  title:     { fontSize: Fonts.sizes.xl, fontWeight: '700', marginBottom: Spacing.sm, color: Colors.text },
  label:     { fontSize: Fonts.sizes.sm, fontWeight: '600', color: Colors.textSub, marginTop: Spacing.xs },
  picker:    { marginBottom: Spacing.xs },
  helper:    { fontSize: Fonts.sizes.sm, color: Colors.textSub, marginBottom: Spacing.md },
  username:  { fontSize: Fonts.sizes.xl, fontWeight: '800', color: Colors.primary, marginBottom: Spacing.sm },
  error:     { color: Colors.error, fontSize: Fonts.sizes.sm, marginTop: Spacing.sm, marginBottom: Spacing.sm },
});
