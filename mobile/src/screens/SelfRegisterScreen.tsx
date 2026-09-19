import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import api from '../api/client';
import { Btn, Input, Card, Loader } from '../components/UI';
import { Colors, Spacing, Fonts } from '../theme';

// Public (no login) — POST /auth/self-register. Student, parent, and
// teacher can create their own account directly (own username + password,
// no admin-issued activation or class code) — see the detailed comment on
// that route in backend/src/routes/auth.ts for the full history of this
// decision. Deliberately a single flat form, not a multi-step wizard like
// StudentSelfClaimScreen.tsx — the project owner explicitly wanted this
// path to be low-friction. The real safeguard isn't at signup, it's
// afterward: the account can log in immediately but sees only
// PendingApprovalScreen.tsx until an admin approves it.
type SelfRole = 'student' | 'parent' | 'teacher';

export default function SelfRegisterScreen({ navigation }: any) {
  const [role, setRole] = useState<SelfRole>('student');
  const [schools, setSchools] = useState<{ code: string; name: string }[]>([]);
  const [schoolCode, setSchoolCode] = useState('');
  const [loadingSchools, setLoadingSchools] = useState(true);

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [admissionNumber, setAdmissionNumber] = useState('');       // student
  const [wardAdmissionNumber, setWardAdmissionNumber] = useState(''); // parent
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState<{ username: string } | null>(null);

  // Reuses the existing, already-public self-claim schools endpoint rather
  // than adding a near-duplicate one.
  useEffect(() => {
    api.get('/auth/self-claim/schools')
      .then(({ data }) => {
        setSchools(data.schools ?? []);
        if (data.schools?.length === 1) setSchoolCode(data.schools[0].code);
      })
      .catch(() => setError('Could not load schools. Check your connection and try again.'))
      .finally(() => setLoadingSchools(false));
  }, []);

  const handleSubmit = async () => {
    setError('');
    if (!schoolCode)             { setError('Select your school'); return; }
    if (!fullName.trim())        { setError('Full name is required'); return; }
    if (!phone.trim())           { setError('Phone number is required'); return; }
    if (role === 'student' && !admissionNumber.trim()) { setError('Your admission number is required'); return; }
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
        ...(role === 'student' ? { admission_number: admissionNumber.trim() } : {}),
        ...(role === 'parent' ? { ward_admission_number: wardAdmissionNumber.trim() } : {}),
      });
      setDone({ username: data.username });
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
            Write this down — you'll need it to sign in. A school admin still needs to
            review and approve your account before you can use the app; you'll see a
            waiting screen after signing in until then.
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
            No activation code needed — just fill this in. Your account will need a quick
            admin approval before you can access any class content.
          </Text>

          <Text style={styles.label}>I am a…</Text>
          <Picker selectedValue={role} onValueChange={(v) => setRole(v as SelfRole)} style={styles.picker}>
            <Picker.Item label="Student" value="student" />
            <Picker.Item label="Parent" value="parent" />
            <Picker.Item label="Teacher" value="teacher" />
          </Picker>

          {loadingSchools ? <Loader /> : (
            <>
              <Text style={styles.label}>School</Text>
              <Picker selectedValue={schoolCode} onValueChange={setSchoolCode} style={styles.picker}>
                <Picker.Item label="Select your school…" value="" />
                {schools.map((s) => <Picker.Item key={s.code} label={s.name} value={s.code} />)}
              </Picker>
            </>
          )}

          <Input label="Full Name" value={fullName} onChangeText={setFullName} placeholder="Your full name" />
          <Input label="Phone Number" value={phone} onChangeText={setPhone} placeholder="e.g. 08012345678" keyboardType="phone-pad" />

          {role === 'student' && (
            <Input label="Your Admission Number" value={admissionNumber} onChangeText={setAdmissionNumber} placeholder="As given at enrollment" />
          )}
          {role === 'parent' && (
            <Input label="Your Ward's Admission Number" value={wardAdmissionNumber} onChangeText={setWardAdmissionNumber} placeholder="Your child's admission number" />
          )}

          <Input label="Choose a Username" value={username} onChangeText={setUsername} placeholder="e.g. your name, no spaces" autoCapitalize="none" />
          <Input label="Choose a Password" value={password} onChangeText={setPassword} placeholder="At least 8 characters" secureTextEntry />
          <Input label="Confirm Password" value={confirm} onChangeText={setConfirm} placeholder="Re-enter password" secureTextEntry />

          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Btn label="Create My Account" onPress={handleSubmit} loading={loading} style={{ marginTop: Spacing.md }} />
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
