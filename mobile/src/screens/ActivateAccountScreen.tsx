import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import api from '../api/client';
import { Btn, Input, Card } from '../components/UI';
import { Colors, Spacing, Fonts } from '../theme';

// Public (no login) — Task C: a teacher/staff member sets their own
// password on first use, using the one-time activation code admin gave
// them when creating the account (see POST /admin/users and POST
// /auth/activate in backend/src/routes/auth.ts). Deliberately a single
// step, not a multi-step wizard like StudentSelfClaimScreen.tsx: admin
// already picked this exact account (username, role, class, etc.) at
// creation time, so there's no roster to search and no second identity
// factor to check here — the activation code alone, paired with the
// username server-side, is the only verification needed.
export default function ActivateAccountScreen({ navigation }: any) {
  const [username, setUsername] = useState('');
  const [code, setCode] = useState('');
  const [newPw, setNewPw] = useState('');
  const [conf, setConf] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleActivate = async () => {
    setError('');
    if (!username.trim() || !code.trim() || !newPw || !conf) { setError('All fields are required'); return; }
    if (newPw.length < 8) { setError('New password must be at least 8 characters'); return; }
    if (newPw !== conf)   { setError('Passwords do not match'); return; }
    setLoading(true);
    try {
      await api.post('/auth/activate', {
        username: username.trim(), activation_code: code.trim(), new_password: newPw,
      });
      setDone(true);
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
          <Text style={styles.title}>Account activated!</Text>
          <Text style={styles.helper}>You can now sign in with your username and the password you just set.</Text>
          <Btn label="Back to Sign In" onPress={() => navigation.replace('Login')} style={{ marginTop: Spacing.md }} />
        </Card>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Card>
          <Text style={styles.title}>Activate Your Account</Text>
          <Text style={styles.helper}>Your school admin created your account and gave you a one-time activation code. Enter it here to set your own password.</Text>

          <Input label="Username" value={username} onChangeText={setUsername} placeholder="The username your admin gave you" autoCapitalize="none" />
          <Input label="Activation Code" value={code} onChangeText={setCode} placeholder="Enter the code your admin gave you" keyboardType="numeric" />
          <Input label="New Password" value={newPw} onChangeText={setNewPw} placeholder="At least 8 characters" secureTextEntry />
          <Input label="Confirm New Password" value={conf} onChangeText={setConf} placeholder="Re-enter new password" secureTextEntry />

          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Btn label="Activate Account" onPress={handleActivate} loading={loading} style={{ marginTop: Spacing.md }} />
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
  error:     { color: Colors.error, fontSize: Fonts.sizes.sm, marginTop: Spacing.sm, marginBottom: Spacing.sm },
});
