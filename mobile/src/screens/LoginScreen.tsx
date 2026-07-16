import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  KeyboardAvoidingView, Platform, Image,
} from 'react-native';
import { useAuth } from '../api/AuthContext';
import { Btn, Input } from '../components/UI';
import { Colors, Spacing, Fonts, Radius } from '../theme';
import { SCHOOL_BRANDS } from '../schoolBranding';

export default function LoginScreen({ navigation }: any) {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const handleLogin = async () => {
    setError('');
    if (!username.trim() || !password) { setError('Enter username and password'); return; }
    setLoading(true);
    try {
      const { must_change_pw } = await login(username.trim(), password);
      if (must_change_pw) navigation.replace('ChangePassword', { forced: true });
      // else AppNavigator handles the redirect via auth state
    } catch (e: any) {
      if (!e?.response) {
        setError('No internet connection. The first login on a device needs one — once signed in, you can keep working offline.');
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
          <Input
            label="Username"
            value={username}
            onChangeText={setUsername}
            placeholder="Enter your username"
            autoCapitalize="none"
          />

          <View style={styles.passwordLabelRow}>
            <Text style={styles.passwordLabel}>Password</Text>
            <TouchableOpacity onPress={() => setShowPassword(s => !s)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Text style={styles.showToggle}>{showPassword ? 'Hide' : 'Show'}</Text>
            </TouchableOpacity>
          </View>
          <Input
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            secureTextEntry={!showPassword}
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Btn label="Sign In" onPress={handleLogin} loading={loading} style={{ marginTop: Spacing.md }} />
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
  error:      { color: Colors.error, fontSize: Fonts.sizes.sm, marginBottom: Spacing.sm, textAlign: 'center' },
  footer:     { textAlign: 'center', color: Colors.textSub, fontSize: Fonts.sizes.xs, marginTop: Spacing.xl, paddingBottom: Spacing.lg },
});
