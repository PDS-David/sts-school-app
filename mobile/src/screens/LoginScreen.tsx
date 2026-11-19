import React, { useState, useEffect } from 'react';
import { Picker } from '@react-native-picker/picker';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  KeyboardAvoidingView, Platform, Image,
} from 'react-native';
import { useAuth } from '../api/AuthContext';
import api from '../api/client';
import { Btn, Input } from '../components/UI';
import { Colors, Spacing, Fonts, Radius } from '../theme';
import { SCHOOL_BRANDS } from '../schoolBranding';

export default function LoginScreen({ navigation }: any) {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [schoolCode, setSchoolCode] = useState('');
  const [teacherLogin, setTeacherLogin] = useState(true);
  const [teacherUsernames, setTeacherUsernames] = useState<string[]>([]);
  const [usernameLoading, setUsernameLoading] = useState(false);
  const [usernameError, setUsernameError] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  useEffect(() => {
    setUsername(''); setTeacherUsernames([]); setUsernameError('');
    if (!teacherLogin || !schoolCode) return;
    let cancelled = false;
    setUsernameLoading(true);
    api.get('/auth/teacher-logins', { params: { school_code: schoolCode } })
      .then(({ data }) => { if (!cancelled) setTeacherUsernames(Array.isArray(data.usernames) ? data.usernames : []); })
      .catch((e: any) => { if (!cancelled) setUsernameError(e?.response?.data?.error ?? 'Could not load teacher usernames. Retry.'); })
      .finally(() => { if (!cancelled) setUsernameLoading(false); });
    return () => { cancelled = true; };
  }, [schoolCode, teacherLogin]);

  const handleLogin = async () => {
    setError('');
    if (!username.trim() || !password) { setError(teacherLogin ? 'Select your username and enter your four-digit PIN' : 'Enter username and password'); return; }
    if (teacherLogin && !/^\\d{4}$/.test(password)) { setError('PIN must be exactly four digits'); return;}
    setLoading(true);
    try {
      // RootNavigator branches on AuthContext's mustChangePw/
      // mustSetSecurityQuestion state directly and handles the redirect —
      // no imperative navigation call needed (or safe to make) here. This
      // used to call navigation.replace('ChangePassword', ...) right after
      // login(), racing the exact same-tick re-render login()'s setUser()
      // triggers; losing that race silently skipped the forced flow
      // entirely, which is how an account could reach the Dashboard while
      // still on its temp/default password.
      await login(username.trim(), password, schoolCode || undefined);
    } catch (e: any) {
      if (!e?.response) {
        // axios sets `.response` only when a response actually came back —
        // no `.response` covers "genuinely offline" AND "server
        // unreachable" (down, or a Render free-tier cold start taking
        // longer than the request's timeout) equally. Claiming "no
        // internet" here was flatly wrong on a real, working connection
        // whenever it was actually the latter — this wording covers both
        // without asserting which one it is, while keeping the original's
        // useful "why login specifically needs this" context.
        setError('Could not reach the server — check your connection, or it may just be starting back up after a period of inactivity (can take up to a minute). The first login on a device needs this to succeed; once signed in, you can keep working offline.');
      } else {
        setError(e?.response?.data?.error ?? 'Login failed. Check your credentials.');
      }
    } finally {
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
          <Text style={styles.passwordLabel}>Account type</Text>
          <View style={{ borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.md, marginBottom: Spacing.md }}>
            <Picker selectedValue={teacherLogin ? 'teacher' : 'other'} onValueChange={v => setTeacherLogin(v === 'teacher')}>
              <Picker.Item label="Teacher (PIN)" value="teacher" />
              <Picker.Item label="Student / Parent / Admin" value="other" />
            </Picker>
          </View>
          <Text style={styles.passwordLabel}>School</Text>
          <View style={{ borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.md, marginBottom: Spacing.md }}>
            <Picker selectedValue={schoolCode} onValueChange={setSchoolCode}>
              <Picker.Item label="Select school..." value="" />
              <Picker.Item label="Primary School" value="primary" />
              <Picker.Item label="Secondary School" value="secondary" />
            </Picker>
          </View>
          {teacherLogin ? (
            <>
              <Text style={styles.passwordLabel}>Teacher Username</Text>
              <View style={{ borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.md, marginBottom: Spacing.md }}>
                <Picker selectedValue={username} onValueChange={setUsername} enabled={!usernameLoading && !!schoolCode}>
                  <Picker.Item label={usernameLoading ? 'Loading usernames…' : 'Select your username'} value="" />
                  {teacherUsernames.map(name => <Picker.Item key={name} label={name} value={name} />)}
                </Picker>
              </View>
              {!!usernameError && <Text style={styles.error}>{usernameError}</Text>}
              {!usernameLoading && schoolCode && !usernameError && teacherUsernames.length === 0 && <Text style={styles.error}>No active teacher accounts found.</Text>}
              <Input
                label="4-digit PIN"
                value={password}
                onChangeText={v => setPassword(v.replace(/\D/g, '').slice(0, 4))}
                placeholder="Enter your PIN"
                keyboardType="numeric"
                secureTextEntry
              />
            </>
          ) : (
            <>
              <Input label="Username" value={username} onChangeText={setUsername} placeholder="Enter your username" autoCapitalize="none" />
              <Input label="Password" value={password} onChangeText={setPassword} placeholder="Enter your password" secureTextEntry />
            </>
          )}

          <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')} style={styles.forgotLink} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={styles.forgotLinkText}>Forgot password?</Text>
          </TouchableOpacity>

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
  showToggle:       { fontSize: Fonts.sizes.xs, fontWeight: '700', color: Colors.primary },
  forgotLink:       { alignSelf: 'flex-end', marginTop: Spacing.xs },
  forgotLinkText:   { fontSize: Fonts.sizes.xs, fontWeight: '600', color: Colors.primary },
  selfClaimLink:    { alignSelf: 'center', marginTop: Spacing.md },
  selfClaimLinkText:{ fontSize: Fonts.sizes.xs, fontWeight: '600', color: Colors.primary, textAlign: 'center' },
  error:      { color: Colors.error, fontSize: Fonts.sizes.sm, marginBottom: Spacing.sm, textAlign: 'center' },
  footer:     { textAlign: 'center', color: Colors.textSub, fontSize: Fonts.sizes.xs, marginTop: Spacing.xl, paddingBottom: Spacing.lg },
});
