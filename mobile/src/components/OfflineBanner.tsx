import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Fonts } from '../theme';
import { subscribeConnectivity, isOnline, outboxCount } from '../offline';
import { flushOutbox } from '../api/client';

export default function OfflineBanner() {
  const [online, setOnline]   = useState(true);
  const [pending, setPending] = useState(0);
  const [syncing, setSyncing] = useState(false);
  const [queueError, setQueueError] = useState(false);

  const refreshPending = useCallback(async () => {
    try {
      setPending(await outboxCount());
      setQueueError(false);
    } catch {
      // A storage read/parse failure must not be presented as an empty queue:
      // the user needs to know saved changes could not be inspected.
      setQueueError(true);
    }
  }, []);

  useEffect(() => {
    (async () => {
      try { setOnline(await isOnline()); } catch { setOnline(false); }
      await refreshPending();
    })();

    const unsub = subscribeConnectivity(async (isNowOnline) => {
      setOnline(isNowOnline);
      if (isNowOnline) {
        setSyncing(true);
        try { await flushOutbox(); } catch { /* retain the queue and show its state below */ }
        await refreshPending();
        setSyncing(false);
      } else {
        await refreshPending();
      }
    });

    // Also poll occasionally in case items get queued mid-session (e.g. a
    // write attempted while still "online" per NetInfo but the request
    // itself timed out or failed).
    const interval = setInterval(() => { refreshPending().catch(() => {}); }, 4000);

    return () => { unsub(); clearInterval(interval); };
  }, [refreshPending]);

  const handleRetryNow = async () => {
    setSyncing(true);
    try { await flushOutbox(); } catch { /* retain the queue */ }
    await refreshPending();
    setSyncing(false);
  };

  if (online && pending === 0 && !queueError) return null;

  return (
    <View style={[styles.bar, queueError ? styles.warning : !online ? styles.offline : styles.syncing]}>
      <Ionicons
        name={!online ? 'cloud-offline-outline' : 'sync-outline'}
        size={16}
        color={Colors.white}
      />
      <Text style={styles.text}>
        {queueError
          ? 'Unable to read saved changes — check device storage before signing out'
          : !online
          ? pending > 0
            ? `Offline — ${pending} change${pending === 1 ? '' : 's'} will sync automatically`
            : 'Offline — you can keep working'
          : syncing
            ? 'Syncing changes…'
            : `${pending} change${pending === 1 ? '' : 's'} pending sync`}
      </Text>
      {online && (pending > 0 || queueError) && !syncing && (
        <TouchableOpacity onPress={handleRetryNow}>
          <Text style={styles.retry}>Retry</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingVertical: 8, paddingHorizontal: Spacing.md,
  },
  offline: { backgroundColor: '#616161' },
  syncing: { backgroundColor: Colors.primary },
  warning: { backgroundColor: Colors.error },
  text: { color: Colors.white, fontSize: Fonts.sizes.xs, fontWeight: '600', flex: 1 },
  retry: { color: Colors.white, fontSize: Fonts.sizes.xs, fontWeight: '800', textDecorationLine: 'underline' },
});
