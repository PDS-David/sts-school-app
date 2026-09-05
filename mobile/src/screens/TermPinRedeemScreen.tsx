import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../api/client';
import { Card, Btn, Input } from '../components/UI';
import { Colors, Spacing, Fonts } from '../theme';

// POST /learning/term-pins/redeem is excluded from the offline outbox (see
// api/client.ts) — a PIN is single-use server-side, so this must always be
// a live check: queuing it would risk telling the student their PIN worked
// when the server never actually saw it.
export default function TermPinRedeemScreen({ navigation }: any) {
  const [pin, setPin]         = useState('');
  const [saving, setSaving]   = useState(false);

  const redeem = async () => {
    if (!pin.trim()) return;
    setSaving(true);
    try {
      const { data } = await api.post('/learning/term-pins/redeem', { pin: pin.trim() });
      Alert.alert('Unlocked!', `Your topics for ${data.term_label} are now unlocked.`, [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (e: any) {
      const msg = e?.response?.data?.error;
      Alert.alert(
        'Could not redeem PIN',
        msg ?? "You're offline — redeeming a PIN needs a connection. Try again once you're back online.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background, padding: Spacing.md }}>
      <Card>
        <View style={{ alignItems: 'center', marginBottom: Spacing.md }}>
          <Ionicons name="key" size={40} color={Colors.primary} />
          <Text style={styles.title}>Enter Your Term PIN</Text>
          <Text style={styles.sub}>
            Ask your school admin for this term's access PIN if you don't have it yet.
          </Text>
        </View>
        <Input
          label="6-digit PIN"
          value={pin}
          onChangeText={(v: string) => setPin(v.replace(/\D/g, '').slice(0, 6))}
          keyboardType="numeric"
          placeholder="••••••"
        />
        <Btn label={saving ? 'Checking…' : 'Unlock'} onPress={redeem} loading={saving} disabled={!pin.trim()} />
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: Fonts.sizes.lg, fontWeight: '800', color: Colors.text, marginTop: Spacing.sm },
  sub: { fontSize: Fonts.sizes.sm, color: Colors.textSub, textAlign: 'center', marginTop: 4 },
});
