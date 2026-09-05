import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useAuth } from '../api/AuthContext';
import { Btn, Input, Card } from '../components/UI';
import { Colors, Spacing, Fonts } from '../theme';

export default function ChangePasswordScreen({ route, navigation }: any) {
  const forced = route?.params?.forced ?? false;
  const { changePassword } = useAuth();
  const [oldPw,  setOldPw]  = useState('');
  const [newPw,  setNewPw]  = useState('');
  const [conf,   setConf]   = useState('');
  const [error,  setError]  = useState('');
  const [ok,     setOk]     = useState(false);
  const [loading,setLoading]= useState(false);

  const handleSubmit = async () => {
    setError('');
    if (!oldPw || !newPw || !conf) { setError('All fields required'); return; }
    if (newPw.length < 8)          { setError('New password must be at least 8 characters'); return; }
    if (newPw !== conf)            { setError('Passwords do not match'); return; }
    setLoading(true);
    try {
      await changePassword(oldPw, newPw);
      setOk(true);
      setTimeout(() => {
        if (forced && route?.params?.thenSetupSecurity) {
          navigation.replace('SecurityQuestionSetup', { forced: true });
        } else {
          navigation.replace(forced ? 'App' : 'Profile');
        }
      }, 1500);
    } catch (e: any) {
      if (!e?.response) {
        setError('No internet connection. Changing your password needs one — try again once you have signal.');
      } else {
        setError(e?.response?.data?.error ?? 'Failed to change password');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      {forced && (
        <View style={styles.banner}>
          <Text style={styles.bannerText}>⚠️  You must set a new password before continuing.</Text>
        </View>
      )}
      <Card>
        <Text style={styles.title}>Change Password</Text>
        <Input label="Current Password"  value={oldPw} onChangeText={setOldPw} secureTextEntry />
        <Input label="New Password"      value={newPw} onChangeText={setNewPw} secureTextEntry />
        <Input label="Confirm Password"  value={conf}  onChangeText={setConf}  secureTextEntry />
        {error ? <Text style={styles.error}>{error}</Text>   : null}
        {ok    ? <Text style={styles.success}>Password changed!</Text> : null}
        <Btn label="Update Password" onPress={handleSubmit} loading={loading} style={{ marginTop: Spacing.md }} />
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: Colors.background, padding: Spacing.lg },
  banner:    { backgroundColor: Colors.warning, borderRadius: 8, padding: Spacing.md, marginBottom: Spacing.md },
  bannerText:{ color: Colors.white, fontWeight: '700', fontSize: Fonts.sizes.sm },
  title:     { fontSize: Fonts.sizes.xl, fontWeight: '700', marginBottom: Spacing.md, color: Colors.text },
  error:     { color: Colors.error, fontSize: Fonts.sizes.sm, marginBottom: Spacing.sm },
  success:   { color: Colors.success, fontSize: Fonts.sizes.sm, marginBottom: Spacing.sm, fontWeight: '700' },
});
