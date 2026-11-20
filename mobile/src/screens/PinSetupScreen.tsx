import React, { useRef, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { useAuth } from '../api/AuthContext';
import { Btn, Input, Card } from '../components/UI';
import { Colors, Spacing, Fonts } from '../theme';
import {
  PIN_LENGTH, sanitizePin, createPinSetupSubmitter, CURRENT_CREDENTIAL_MAX_LENGTH,
  type PinSetupField, type PinSetupValues,
} from '../api/pinSetup';

// Six-digit PIN screen for students, parents and teachers. Two modes:
//
// 1. Required (default): after an administrator issued a temporary credential
//    (PIN reset, new account). RootNavigator renders this as the ONLY screen
//    while the server says must_set_pin (see resolveAuthPhase in
//    api/authPhase.ts), so there is nothing to navigate "back" to and no
//    Skip/Later path. The one exit besides finishing is Sign out, which grants
//    no access. Existing users with a six-digit PIN are never sent here.
// 2. Voluntary (route param `voluntary`): reached from Settings by a signed-in
//    user who simply wants a new PIN. A normal screen with a back button; the
//    server is not requiring anything, so success just returns to Settings.
//
// Rules, request shape and error text come from the Prompt 2A backend
// (POST /auth/pin). All decisions live in api/pinSetup.ts and are unit-tested;
// this component only collects input and renders the result.
//
// Secrets: nothing typed here is logged, persisted or put in navigation params.
// Values live only in component state and are cleared once the server accepts
// the PIN.
export default function PinSetupScreen({ route, navigation }: any) {
  const voluntary = route?.params?.voluntary === true;
  const { submitPin, confirmPinSetup, logout } = useAuth();

  const [current, setCurrent] = useState('');
  const [pin, setPin] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showPins, setShowPins] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fieldError, setFieldError] = useState<{ field: PinSetupField; message: string } | null>(null);
  const [error, setError] = useState('');
  // Server accepted the PIN but we could not yet confirm it by re-reading /auth/me.
  const [awaitingConfirm, setAwaitingConfirm] = useState(false);

  // The submitter keeps the in-flight guard, so create it once and always call
  // the latest context functions through a ref.
  const depsRef = useRef({ submitPin, confirmPinSetup });
  depsRef.current = { submitPin, confirmPinSetup };
  const submitter = useRef(createPinSetupSubmitter({
    postPin: (body) => depsRef.current.submitPin(body.current_credential, body.new_pin),
    // Voluntary change: no requirement to confirm, the PIN is simply changed.
    confirmSetup: () => (voluntary ? Promise.resolve(true) : depsRef.current.confirmPinSetup()),
  })).current;

  const handleSubmit = async () => {
    if (submitter.busy) return;
    setError('');
    setFieldError(null);
    setLoading(true);
    const values: PinSetupValues = { current, pin, confirm };
    const result = await submitter.submit(values);
    switch (result.status) {
      case 'busy':
        return; // a request is already running; keep the spinner
      case 'invalid':
        setFieldError({ field: result.field, message: result.message });
        break;
      case 'failed':
        setError(result.message);
        // A wrong current credential: make them retype it. The new PIN fields
        // are kept in memory so a retry after a network failure is one tap.
        if (result.kind === 'credential') setCurrent('');
        break;
      case 'saved':
        if (result.confirmed) {
          // Required mode: AuthContext now holds must_set_pin=false, so
          // RootNavigator is already replacing this screen with the role-based
          // app. Wipe the secrets and stop touching state.
          setCurrent(''); setPin(''); setConfirm('');
          setLoading(false);
          if (voluntary) {
            Alert.alert('PIN changed', 'Your new PIN is saved. Use it the next time you sign in.');
            navigation.goBack();
          }
          return;
        }
        setCurrent(''); setPin(''); setConfirm('');
        setAwaitingConfirm(true);
        setError('Your PIN was saved, but we could not confirm it with the server yet. Check your connection, then tap Continue.');
        break;
    }
    setLoading(false);
  };

  const errFor = (f: PinSetupField) => (fieldError?.field === f ? fieldError.message : undefined);
  const locked = loading || awaitingConfirm;

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: Colors.background }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        {!voluntary && (
          <View style={styles.banner}>
            <Text style={styles.bannerText}>You signed in with a temporary credential from your school. Set your own {PIN_LENGTH}-digit PIN before continuing.</Text>
          </View>
        )}
        <Card>
          <Text style={styles.title}>{voluntary ? 'Change your PIN' : 'Create your PIN'}</Text>
          <Text style={styles.helper}>
            Choose {PIN_LENGTH} numbers that only you know. Avoid repeated or sequential digits such as 123456 or 000000.
          </Text>

          {!awaitingConfirm && (
            <>
              <Input
                label={voluntary ? 'Current PIN' : 'Current PIN or password'}
                value={current}
                onChangeText={(v) => setCurrent(v.slice(0, CURRENT_CREDENTIAL_MAX_LENGTH))}
                placeholder={voluntary ? 'Your current six digits' : 'What you just signed in with'}
                secureTextEntry={!showCurrent}
                autoCapitalize="none"
                editable={!locked}
                error={errFor('current')}
              />
              <TouchableOpacity
                onPress={() => setShowCurrent((v) => !v)}
                accessibilityRole="button"
                accessibilityLabel={showCurrent ? 'Hide current PIN or password' : 'Show current PIN or password'}
                style={styles.toggle}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text style={styles.toggleText}>{showCurrent ? 'Hide' : 'Show'}</Text>
              </TouchableOpacity>

              <Input
                label={`New ${PIN_LENGTH}-digit PIN`}
                value={pin}
                onChangeText={(v) => setPin(sanitizePin(v))}
                placeholder="Six digits"
                keyboardType="numeric"
                secureTextEntry={!showPins}
                autoCapitalize="none"
                editable={!locked}
                error={errFor('pin')}
              />
              <Input
                label="Confirm new PIN"
                value={confirm}
                onChangeText={(v) => setConfirm(sanitizePin(v))}
                placeholder="Enter the same six digits"
                keyboardType="numeric"
                secureTextEntry={!showPins}
                autoCapitalize="none"
                editable={!locked}
                error={errFor('confirm')}
              />
              <View style={styles.row}>
                <Text style={styles.count}>{pin.length}/{PIN_LENGTH} digits</Text>
                <TouchableOpacity
                  onPress={() => setShowPins((v) => !v)}
                  accessibilityRole="button"
                  accessibilityLabel={showPins ? 'Hide new PIN' : 'Show new PIN'}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Text style={styles.toggleText}>{showPins ? 'Hide' : 'Show'}</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {error ? <Text style={[styles.error, awaitingConfirm && styles.notice]} accessibilityLiveRegion="polite">{error}</Text> : null}

          <Btn
            label={awaitingConfirm ? 'Continue' : 'Save PIN'}
            onPress={handleSubmit}
            loading={loading}
            style={{ marginTop: Spacing.md, width: '100%' }}
          />
          {loading ? <Text style={styles.wait}>Saving… this can take a moment if the server is waking up.</Text> : null}
        </Card>

        {!voluntary && (
        <TouchableOpacity
          onPress={() => { if (!loading) logout().catch(() => {}); }}
          accessibilityRole="button"
          accessibilityLabel="Sign out"
          style={styles.signOut}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={styles.signOutText}>Not you? Sign out</Text>
        </TouchableOpacity>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container:  { flexGrow: 1, padding: Spacing.lg },
  banner:     { backgroundColor: Colors.warning, borderRadius: 8, padding: Spacing.md, marginBottom: Spacing.md },
  bannerText: { color: Colors.white, fontWeight: '700', fontSize: Fonts.sizes.sm },
  title:      { fontSize: Fonts.sizes.xl, fontWeight: '700', marginBottom: Spacing.sm, color: Colors.text },
  helper:     { fontSize: Fonts.sizes.sm, color: Colors.textSub, marginBottom: Spacing.md },
  row:        { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: Spacing.xs },
  count:      { fontSize: Fonts.sizes.xs, color: Colors.textSub },
  toggle:     { alignSelf: 'flex-end', marginTop: -Spacing.xs, marginBottom: Spacing.sm },
  toggleText: { fontSize: Fonts.sizes.xs, fontWeight: '700', color: Colors.primary },
  error:      { color: Colors.error, fontSize: Fonts.sizes.sm, marginTop: Spacing.sm },
  notice:     { color: Colors.text },
  wait:       { color: Colors.textSub, fontSize: Fonts.sizes.xs, textAlign: 'center', marginTop: Spacing.sm },
  signOut:    { alignSelf: 'center', marginTop: Spacing.lg },
  signOutText:{ fontSize: Fonts.sizes.xs, fontWeight: '600', color: Colors.primary },
});
