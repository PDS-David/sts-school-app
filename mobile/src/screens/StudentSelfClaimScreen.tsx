import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import api from '../api/client';
import { Btn, Input, Card, Loader, Empty } from '../components/UI';
import { Colors, Spacing, Fonts } from '../theme';

// Public (no login) — Task B: a student finds their own name and sets their
// own password, gated by a per-class code a teacher reads out once (see
// GET/POST /auth/self-claim/* in backend/src/routes/auth.ts). Four steps in
// one screen, mirroring ForgotPasswordScreen.tsx's single-screen-with-steps
// shape rather than a multi-screen wizard.
type Step = 'school' | 'class' | 'name' | 'code';

export default function StudentSelfClaimScreen({ navigation }: any) {
  const [step, setStep] = useState<Step>('school');

  const [schools, setSchools] = useState<{ code: string; name: string }[]>([]);
  const [schoolCode, setSchoolCode] = useState('');
  const [loadingSchools, setLoadingSchools] = useState(true);

  const [classes, setClasses] = useState<string[]>([]);
  const [className, setClassName] = useState('');
  const [loadingClasses, setLoadingClasses] = useState(false);

  const [roster, setRoster] = useState<{ id: string; full_name: string }[]>([]);
  const [studentId, setStudentId] = useState('');
  const [loadingRoster, setLoadingRoster] = useState(false);

  const [code, setCode] = useState('');
  const [newPw, setNewPw] = useState('');
  const [conf, setConf] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState<{ username: string } | null>(null);

  useEffect(() => {
    api.get('/auth/self-claim/schools')
      .then(({ data }) => {
        setSchools(data.schools ?? []);
        if (data.schools?.length === 1) setSchoolCode(data.schools[0].code);
      })
      .catch(() => setError('Could not load schools. Check your connection and try again.'))
      .finally(() => setLoadingSchools(false));
  }, []);

  const handleSchoolNext = async () => {
    if (!schoolCode) { setError('Select your school'); return; }
    setError('');
    setLoadingClasses(true);
    setStep('class');
    try {
      const { data } = await api.get('/auth/self-claim/classes', { params: { school_code: schoolCode } });
      setClasses(data.classes ?? []);
    } catch {
      setError('Could not load classes. Check your connection and try again.');
    } finally {
      setLoadingClasses(false);
    }
  };

  const handleClassNext = async () => {
    if (!className) { setError('Select your class'); return; }
    setError('');
    setLoadingRoster(true);
    setStep('name');
    try {
      const { data } = await api.get('/auth/self-claim/roster', { params: { school_code: schoolCode, class_name: className } });
      setRoster(data.students ?? []);
    } catch {
      setError('Could not load the class list. Check your connection and try again.');
    } finally {
      setLoadingRoster(false);
    }
  };

  const handleNameNext = () => {
    if (!studentId) { setError('Select your name'); return; }
    setError('');
    setStep('code');
  };

  const handleClaim = async () => {
    setError('');
    if (!code.trim() || !newPw || !conf) { setError('All fields are required'); return; }
    if (newPw.length < 8) { setError('New password must be at least 8 characters'); return; }
    if (newPw !== conf)   { setError('Passwords do not match'); return; }
    setLoading(true);
    try {
      const { data } = await api.post('/auth/self-claim', {
        school_code: schoolCode, class_name: className, student_id: studentId,
        code: code.trim(), new_password: newPw,
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
          <Text style={styles.helper}>Write this down — you'll need it to sign in from now on, along with the password you just set.</Text>
          <Btn label="Back to Sign In" onPress={() => navigation.replace('Login')} style={{ marginTop: Spacing.md }} />
        </Card>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Card>
          <Text style={styles.title}>Set Up Your Account</Text>

          {step === 'school' && (
            loadingSchools ? <Loader /> : (
              <>
                <Text style={styles.label}>School</Text>
                <Picker selectedValue={schoolCode} onValueChange={setSchoolCode} style={styles.picker}>
                  <Picker.Item label="Select your school…" value="" />
                  {schools.map((s) => <Picker.Item key={s.code} label={s.name} value={s.code} />)}
                </Picker>
                {error ? <Text style={styles.error}>{error}</Text> : null}
                <Btn label="Next" onPress={handleSchoolNext} style={{ marginTop: Spacing.md }} />
              </>
            )
          )}

          {step === 'class' && (
            loadingClasses ? <Loader /> : (
              <>
                <Text style={styles.label}>Class</Text>
                <Picker selectedValue={className} onValueChange={setClassName} style={styles.picker}>
                  <Picker.Item label="Select your class…" value="" />
                  {classes.map((c) => <Picker.Item key={c} label={c} value={c} />)}
                </Picker>
                {error ? <Text style={styles.error}>{error}</Text> : null}
                <Btn label="Next" onPress={handleClassNext} style={{ marginTop: Spacing.md }} />
              </>
            )
          )}

          {step === 'name' && (
            loadingRoster ? <Loader /> : roster.length === 0 ? (
              <Empty message="No unclaimed students found in this class. If you already have an account, use Forgot Password on the sign-in screen instead. Otherwise, ask your school admin." />
            ) : (
              <>
                <Text style={styles.label}>Your Name</Text>
                <Picker selectedValue={studentId} onValueChange={setStudentId} style={styles.picker}>
                  <Picker.Item label="Select your name…" value="" />
                  {roster.map((s) => <Picker.Item key={s.id} label={s.full_name} value={s.id} />)}
                </Picker>
                {error ? <Text style={styles.error}>{error}</Text> : null}
                <Btn label="Next" onPress={handleNameNext} style={{ marginTop: Spacing.md }} />
              </>
            )
          )}

          {step === 'code' && (
            <>
              <Text style={styles.helper}>Ask your teacher for this term's class code.</Text>
              <Input label="Class Code" value={code} onChangeText={setCode} placeholder="Enter the code your teacher gave you" keyboardType="numeric" />
              <Input label="New Password" value={newPw} onChangeText={setNewPw} placeholder="At least 8 characters" secureTextEntry />
              <Input label="Confirm New Password" value={conf} onChangeText={setConf} placeholder="Re-enter new password" secureTextEntry />
              {error ? <Text style={styles.error}>{error}</Text> : null}
              <Btn label="Create My Account" onPress={handleClaim} loading={loading} style={{ marginTop: Spacing.md }} />
            </>
          )}
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
