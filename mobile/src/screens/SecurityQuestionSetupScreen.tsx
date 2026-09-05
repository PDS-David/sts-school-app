import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useAuth } from '../api/AuthContext';
import { Btn, Input, Card } from '../components/UI';
import { Colors, Spacing, Fonts } from '../theme';

// Sets/updates the caller's own security question+answer — POST
// /auth/security-question (backend/src/routes/auth.ts). Used two ways:
//  - forced: right after login, when must_set_security_question is true
//    (chained from LoginScreen, or from ChangePasswordScreen if a forced
//    password change happened first — see route.params.thenSetupSecurity)
//  - voluntary: from a role's Settings/Profile screen, to change it later
export default function SecurityQuestionSetupScreen({ route, navigation }: any) {
  const forced = route?.params?.forced ?? false;
  const { setSecurityQuestion } = useAuth();
  const [question, setQuestion] = useState('');
  const [answer,   setAnswer]   = useState('');
  const [confirm,  setConfirm]  = useState('');
  const [error,    setError]    = useState('');
  const [ok,       setOk]       = useState(false);
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = async () => {
    setError('');
    if (!question.trim() || !answer.trim() || !confirm.trim()) { setError('All fields are required'); return; }
    if (question.trim().length < 4) { setError('Question must be at least 4 characters'); return; }
    if (answer.trim().length < 2)   { setError('Answer must be at least 2 characters'); return; }
    // Answer comparison is case/whitespace-insensitive server-side (see
    // normalizeAnswer in utils/password.ts), so a plain string compare here
    // is the right check for "did you type it the same way twice."
    if (answer.trim().toLowerCase() !== confirm.trim().toLowerCase()) { setError('Answers do not match'); return; }
    setLoading(true);
    try {
      await setSecurityQuestion(question.trim(), answer.trim());
      setOk(true);
      setTimeout(() => navigation.replace(forced ? 'App' : 'Profile'), 1200);
    } catch (e: any) {
      if (!e?.response) {
        setError('No internet connection. This needs one — try again once you have signal.');
      } else {
        setError(e?.response?.data?.error ?? 'Failed to save your security question');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      {forced && (
        <View style={styles.banner}>
          <Text style={styles.bannerText}>⚠️  Set a recovery question before continuing — this is how you'll reset your password yourself if you ever forget it.</Text>
        </View>
      )}
      <Card>
        <Text style={styles.title}>Security Question</Text>
        <Text style={styles.helper}>Choose your own question and answer. Pick something only you would know — avoid anything guessable by a classmate or family member.</Text>
        <Input label="Your Question" value={question} onChangeText={setQuestion} placeholder="e.g. What street did I grow up on?" />
        <Input label="Your Answer" value={answer} onChangeText={setAnswer} placeholder="Enter your answer" autoCapitalize="none" />
        <Input label="Confirm Answer" value={confirm} onChangeText={setConfirm} placeholder="Re-enter your answer" autoCapitalize="none" />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        {ok    ? <Text style={styles.success}>Saved!</Text> : null}
        <Btn label="Save" onPress={handleSubmit} loading={loading} style={{ marginTop: Spacing.md }} />
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: Colors.background, padding: Spacing.lg },
  banner:    { backgroundColor: Colors.warning, borderRadius: 8, padding: Spacing.md, marginBottom: Spacing.md },
  bannerText:{ color: Colors.white, fontWeight: '700', fontSize: Fonts.sizes.sm },
  title:     { fontSize: Fonts.sizes.xl, fontWeight: '700', marginBottom: Spacing.sm, color: Colors.text },
  helper:    { fontSize: Fonts.sizes.sm, color: Colors.textSub, marginBottom: Spacing.md },
  error:     { color: Colors.error, fontSize: Fonts.sizes.sm, marginBottom: Spacing.sm },
  success:   { color: Colors.success, fontSize: Fonts.sizes.sm, marginBottom: Spacing.sm, fontWeight: '700' },
});
