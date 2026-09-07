import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import api from '../api/client';
import { Btn, Input, Card } from '../components/UI';
import { Colors, Spacing, Fonts } from '../theme';

// Public (no login) — the mobile side of GET /auth/forgot-password/question
// and POST /auth/forgot-password/reset (backend/src/routes/auth.ts). No
// email/SMS step: the whole flow is username -> security question -> answer
// + new password, in two screens' worth of state on this one screen.
export default function ForgotPasswordScreen({ navigation }: any) {
  const [step, setStep] = useState<'username' | 'answer' | 'done'>('username');
  const [username, setUsername] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [newPw, setNewPw] = useState('');
  const [conf, setConf] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLookup = async () => {
    setError('');
    if (!username.trim()) { setError('Enter your username'); return; }
    setLoading(true);
    try {
      const { data } = await api.get('/auth/forgot-password/question', { params: { username: username.trim() } });
      if (!data.available) {
        // Same message shown whether the account doesn't exist, has no
        // question set, or is deactivated/expired — the backend
        // deliberately doesn't distinguish these to the caller.
        setError(data.message ?? 'Self-service recovery is not available for this account. Contact your school admin.');
        return;
      }
      setQuestion(data.question);
      setStep('answer');
    } catch (e: any) {
      setError(e?.response?.data?.error ?? (!e?.response ? 'Could not reach the server — check your connection, or it may just be starting back up after a period of inactivity (can take up to a minute).' : 'Something went wrong. Try again.'));
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    setError('');
    if (!answer.trim() || !newPw || !conf) { setError('All fields are required'); return; }
    if (newPw.length < 8)  { setError('New password must be at least 8 characters'); return; }
    if (newPw !== conf)    { setError('Passwords do not match'); return; }
    setLoading(true);
    try {
      await api.post('/auth/forgot-password/reset', { username: username.trim(), answer: answer.trim(), new_password: newPw });
      setStep('done');
      setTimeout(() => navigation.replace('Login'), 1800);
    } catch (e: any) {
      setError(e?.response?.data?.error ?? (!e?.response ? 'Could not reach the server — check your connection, or it may just be starting back up after a period of inactivity (can take up to a minute).' : 'Something went wrong. Try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Card>
          <Text style={styles.title}>Reset Password</Text>

          {step === 'username' && (
            <>
              <Text style={styles.helper}>Enter your username and we'll show your recovery question.</Text>
              <Input label="Username" value={username} onChangeText={setUsername} placeholder="Enter your username" autoCapitalize="none" />
              {error ? <Text style={styles.error}>{error}</Text> : null}
              <Btn label="Continue" onPress={handleLookup} loading={loading} style={{ marginTop: Spacing.md }} />
            </>
          )}

          {step === 'answer' && (
            <>
              <Text style={styles.question}>{question}</Text>
              <Input label="Your Answer" value={answer} onChangeText={setAnswer} placeholder="Enter your answer" autoCapitalize="none" />
              <Input label="New Password" value={newPw} onChangeText={setNewPw} placeholder="At least 8 characters" secureTextEntry />
              <Input label="Confirm New Password" value={conf} onChangeText={setConf} placeholder="Re-enter new password" secureTextEntry />
              {error ? <Text style={styles.error}>{error}</Text> : null}
              <Btn label="Reset Password" onPress={handleReset} loading={loading} style={{ marginTop: Spacing.md }} />
            </>
          )}

          {step === 'done' && (
            <Text style={styles.success}>Password reset! Redirecting you to sign in…</Text>
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
  helper:    { fontSize: Fonts.sizes.sm, color: Colors.textSub, marginBottom: Spacing.md },
  question:  { fontSize: Fonts.sizes.md, fontWeight: '600', color: Colors.text, marginBottom: Spacing.md },
  error:     { color: Colors.error, fontSize: Fonts.sizes.sm, marginTop: Spacing.sm, marginBottom: Spacing.sm },
  success:   { color: Colors.success, fontSize: Fonts.sizes.md, fontWeight: '700', textAlign: 'center', paddingVertical: Spacing.lg },
});
