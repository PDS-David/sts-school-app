import React, { useState, useRef } from 'react';
import { Picker } from '@react-native-picker/picker';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  KeyboardAvoidingView, Platform, Image,
} from 'react-native';
import { useAuth } from '../api/AuthContext';
import { Btn, Input } from '../components/UI';
import { Colors, Spacing, Fonts, Radius } from '../theme';
import { SCHOOL_BRANDS } from '../schoolBranding';
import {
  CredentialMode, PIN_LENGTH, sanitizePin, validateLoginInput, loginErrorMessage,
} from '../api/loginForm';

export default function LoginScreen({ navigation }: any) {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [secret, setSecret] = useState('');
  // 'pin' = six-digit PIN (students, parents, teachers). 'password' keeps the
  // existing administrator / finance admin credentials usable. This is only
  // an input mode: the server decides the account's role.
  const [mode, setMode] = useState<CredentialMode>('pin');
  const [showSecret, setShowSecret] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  // Optional. Only used by the server to tell apart teachers who share a username across schools.
  const [schoolCode, setSchoolCode] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);
  // A ref (not state) so two taps in the same tick cannot both pass the guard.
  const submitting = useRef(false);

  const switchMode = (next: CredentialMode) => {
    setMode(next); setSecret(''); setShowSecret(false); setError('');
  };

  const handleLogin = async () => {
    if (submitting.current) return;
    setError('');
    const invalid = validateLoginInput(mode, username, secret);
    if (invalid) { setError(invalid); return; }
    submitting.current = true;
    setLoading(true);
    try {
      // RootNavigator branches on AuthContext state directly and handles any
      // forced flow — no imperative navigation call here (it used to race the
      // re-render login() triggers).
      await login(username.trim(), secret, { mode, rememberMe, school_code: schoolCode || undefined });
    } catch (e: any) {
      setError(loginErrorMessage(e));
    } finally {
      submitting.current = false;
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logosRow}>
            <View style={styles.logoCol}>
              <Image source={SCHOOL_BRANDS.secondary.logo} style={styles.logoImg} resizeMode="contain" />
              <Text style={styles.logoCaption}>{SCHOOL_BRANDS.secondary.shortName}</Text>
            </View>
            <View style={styles.logoCol}>
              <Image source={SCHOOL_BRANDS.primary.logo} style={styles.logoImg} resizeMode="contain" />
              <Text style={styles.logoCaption}>{SCHOOL_BRANDS.primary.shortName}</Text>
            </View>
          </View>
          <Text style={styles.schoolName}>Sow the Seed Schools</Text>
          <Text style={styles.tagline}>Unified School Management System</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Text style={styles.title}>Sign In</Text>
          <Text style={styles.passwordLabel}>School (optional)</Text>
          <View style={{ borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.md, marginBottom: Spacing.md }}>
            <Picker selectedValue={schoolCode} onValueChange={setSchoolCode} enabled={!loading}>
              <Picker.Item label="Select school..." value="" />
              <Picker.Item label="Primary School" value="primary" />
              <Picker.Item label="Secondary School" value="secondary" />
            </Picker>
          </View>
          <Input
            label="Username"
            value={username}
            onChangeText={setUsername}
            placeholder="Enter your username"
            autoCapitalize="none"
            editable={!loading}
          />
          <Input
            label={mode === 'pin' ? `${PIN_LENGTH}-digit PIN` : 'Password'}
            value={secret}
            onChangeText={v => setSecret(mode === 'pin' ? sanitizePin(v) : v)}
            placeholder={mode === 'pin' ? 'Enter your PIN' : 'Enter your password'}
            keyboardType={mode === 'pin' ? 'numeric' : 'default'}
            secureTextEntry={!showSecret}
            autoCapitalize="none"
            editable={!loading}
          />
          <View style={styles.optionsRow}>
            <TouchableOpacity
              onPress={() => setRememberMe(v => !v)}
              disabled={loading}
              style={styles.checkRow}
              accessibilityRole="checkbox"
              accessibilityLabel="Remember me"
              accessibilityState={{ checked: rememberMe, disabled: loading }}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <View style={[styles.checkBox, rememberMe && styles.checkBoxOn]}>
                {rememberMe ? <Text style={styles.checkMark}>✓</Text> : null}
              </View>
              <Text style={styles.checkLabel}>Remember me</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setShowSecret(v => !v)}
              accessibilityRole="button"
              accessibilityLabel={showSecret ? 'Hide PIN' : 'Show PIN'}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.showToggle}>{showSecret ? 'Hide' : 'Show'}</Text>
            </TouchableOpacity>
          </View>

          {mode === 'pin' ? (
            <>
              <Text style={[styles.forgotLinkText, { alignSelf: 'flex-end', marginTop: Spacing.xs }]}>Forgot your PIN? Contact the school Admin.</Text>
              <TouchableOpacity onPress={() => switchMode('password')} style={styles.forgotLink} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Text style={styles.forgotLinkText}>Administrator or Finance Admin? Sign in with a password</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')} style={styles.forgotLink} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Text style={styles.forgotLinkText}>Forgot password?</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => switchMode('pin')} style={styles.forgotLink} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Text style={styles.forgotLinkText}>Student, parent or teacher? Sign in with your PIN</Text>
              </TouchableOpacity>
            </>
          )}

          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Btn label="Sign In" onPress={handleLogin} loading={loading} style={{ marginTop: Spacing.md, width: '100%' }} />

          <TouchableOpacity onPress={() => navigation.navigate('StudentSelfClaim')} style={styles.selfClaimLink} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={styles.selfClaimLinkText}>Student, and don't have a login yet? Set up your account</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('ActivateAccount')} style={styles.selfClaimLink} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={styles.selfClaimLinkText}>Staff, and have an activation code? Activate your account</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('SelfRegister')} style={styles.selfClaimLink} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={styles.selfClaimLinkText}>New here? Create an account</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footer}>© {new Date().getFullYear()} Sow the Seed Schools, Ibadan</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container:  { flexGrow: 1, backgroundColor: Colors.background, padding: Spacing.lg },
  header:     { alignItems: 'center', paddingTop: Spacing.xl * 2, paddingBottom: Spacing.xl },
  logosRow:   { flexDirection: 'row', gap: Spacing.lg, marginBottom: Spacing.md },
  logoCol:    { alignItems: 'center', width: 90 },
  logoImg:    { width: 76, height: 76, borderRadius: 38 },
  logoCaption:{ fontSize: Fonts.sizes.xs, color: Colors.textSub, marginTop: 4, textAlign: 'center', fontWeight: '600' },
  schoolName: { fontSize: Fonts.sizes.xl, fontWeight: '800', color: Colors.primary, textAlign: 'center' },
  tagline:    { fontSize: Fonts.sizes.sm, color: Colors.textSub, marginTop: 4 },
  form:       { backgroundColor: Colors.card, borderRadius: Radius.lg, padding: Spacing.lg, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 },
  title:      { fontSize: Fonts.sizes.xl, fontWeight: '700', color: Colors.text, marginBottom: Spacing.md },
  passwordLabelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  passwordLabel:    { fontSize: Fonts.sizes.xs, fontWeight: '700', color: Colors.textSub },
  optionsRow:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: Spacing.xs },
  checkRow:         { flexDirection: 'row', alignItems: 'center' },
  checkBox:         { width: 20, height: 20, borderRadius: 4, borderWidth: 1.5, borderColor: Colors.primary, alignItems: 'center', justifyContent: 'center', marginRight: Spacing.sm },
  checkBoxOn:       { backgroundColor: Colors.primary },
  checkMark:        { color: Colors.white, fontSize: 13, fontWeight: '800', lineHeight: 16 },
  checkLabel:       { fontSize: Fonts.sizes.sm, color: Colors.text },
  showToggle:       { fontSize: Fonts.sizes.xs, fontWeight: '700', color: Colors.primary },
  forgotLink:       { alignSelf: 'flex-end', marginTop: Spacing.xs },
  forgotLinkText:   { fontSize: Fonts.sizes.xs, fontWeight: '600', color: Colors.primary },
  selfClaimLink:    { alignSelf: 'center', marginTop: Spacing.md },
  selfClaimLinkText:{ fontSize: Fonts.sizes.xs, fontWeight: '600', color: Colors.primary, textAlign: 'center' },
  error:      { color: Colors.error, fontSize: Fonts.sizes.sm, marginBottom: Spacing.sm, textAlign: 'center' },
  footer:     { textAlign: 'center', color: Colors.textSub, fontSize: Fonts.sizes.xs, marginTop: Spacing.xl, paddingBottom: Spacing.lg },
});
