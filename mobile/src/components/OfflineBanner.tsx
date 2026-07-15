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

  const refreshPending = useCallback(async () => {
    setPending(await outboxCount());
  }, []);

  useEffect(() => {
    (async () => {
      setOnline(await isOnline());
      await refreshPending();
    })();

    const unsub = subscribeConnectivity(async (isNowOnline) => {
      setOnline(isNowOnline);
      if (isNowOnline) {
        setSyncing(true);
        await flushOutbox().catch(() => {});
        await refreshPending();
        setSyncing(false);
      } else {
        await refreshPending();
      }
    });

    // Also poll occasionally in case items get queued mid-session (e.g. a
    // write attempted while still "online" per NetInfo but the request
    // itself timed out or failed).
    const interval = setInterval(refreshPending, 4000);

    return () => { unsub(); clearInterval(interval); };
  }, [refreshPending]);

  const handleRetryNow = async () => {
    setSyncing(true);
    await flushOutbox().catch(() => {});
    await refreshPending();
    setSyncing(false);
  };

  if (online && pending === 0) return null;

  return (
    <View style={[styles.bar, !online ? styles.offline : styles.syncing]}>
      <Ionicons
        name={!online ? 'cloud-offline-outline' : 'sync-outline'}
        size={16}
        color={Colors.white}
      />
      <Text style={styles.text}>
        {!online
          ? pending > 0
            ? `Offline — ${pending} change${pending === 1 ? '' : 's'} will sync automatically`
            : 'Offline — you can keep working'
          : syncing
            ? 'Syncing changes…'
            : `${pending} change${pending === 1 ? '' : 's'} pending sync`}
      </Text>
      {online && pending > 0 && !syncing && (
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
  text: { color: Colors.white, fontSize: Fonts.sizes.xs, fontWeight: '600', flex: 1 },
  retry: { color: Colors.white, fontSize: Fonts.sizes.xs, fontWeight: '800', textDecorationLine: 'underline' },
});
