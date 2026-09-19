import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../api/AuthContext';
import { Btn, Card } from '../components/UI';
import { Colors, Spacing, Fonts } from '../theme';

// Shown instead of the normal role-based app for any account created via
// POST /auth/self-register — see AuthContext.tsx's User.pending_admin_review
// and RootNavigator.tsx's pending-review phase. Deliberately shows nothing
// class-related at all, per explicit project-owner decision (the strictest
// of the options offered): just a waiting message, a way to check again,
// and a way to log out.
export default function PendingApprovalScreen() {
  const { user, logout, refreshApprovalStatus } = useAuth();
  const [checking, setChecking] = useState(false);
  const [justChecked, setJustChecked] = useState(false);

  // If an admin has approved in the meantime, refreshApprovalStatus() updates
  // the stored user object directly — RootNavigator reads
  // user.pending_admin_review on every render, so it swaps to the real app
  // on its own the moment this resolves false, with no extra navigation
  // call needed here.
  const checkAgain = async () => {
    setChecking(true);
    setJustChecked(false);
    try {
      await refreshApprovalStatus();
      setJustChecked(true);
    } catch {
      // Best-effort — a failed check just means try again in a moment,
      // not an error worth alarming someone stuck on a waiting screen over.
    } finally {
      setChecking(false);
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Ionicons name="hourglass-outline" size={48} color={Colors.warning} style={{ alignSelf: 'center', marginBottom: Spacing.md }} />
        <Text style={styles.title}>Waiting for Admin Approval</Text>
        <Text style={styles.body}>
          Your account (@{user?.username}) was created successfully, but a school admin
          still needs to review and approve it before you can use the app.
        </Text>
        <Text style={styles.body}>
          This is usually quick — check back in a bit, or contact your school admin
          directly if it's been a while.
        </Text>
        {justChecked && (
          <Text style={styles.stillPending}>Still waiting on admin approval — try again shortly.</Text>
        )}
        <Btn label="Check Again" onPress={checkAgain} loading={checking} style={{ marginTop: Spacing.lg }} />
        <Btn label="Log Out" onPress={logout} variant="outline" style={{ marginTop: Spacing.sm }} />
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center', padding: Spacing.lg },
  card: { maxWidth: 420, width: '100%' },
  title: { fontSize: Fonts.sizes.lg, fontWeight: '700', color: Colors.text, textAlign: 'center', marginBottom: Spacing.sm },
  body: { fontSize: Fonts.sizes.sm, color: Colors.textSub, textAlign: 'center', marginBottom: Spacing.sm, lineHeight: 20 },
  stillPending: { fontSize: Fonts.sizes.sm, color: Colors.warning, textAlign: 'center', fontWeight: '600', marginTop: Spacing.sm },
});
