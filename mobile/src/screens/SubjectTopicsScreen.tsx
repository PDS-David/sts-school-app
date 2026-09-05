import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../api/client';
import { Loader, Empty, Badge, Btn } from '../components/UI';
import { Colors, Spacing, Fonts, Radius } from '../theme';

// GET /learning/topics is a normal cached GET (see api/client.ts) — once
// loaded at least once online, this list (including each topic's `locked`/
// `completed` flags as of that last fetch, and any already-cached `summary`)
// stays browsable offline. The flags themselves can only be *refreshed* by
// a live fetch, since they depend on server-side PIN/pass state.
export default function SubjectTopicsScreen({ route, navigation }: any) {
  const { subjectId, subjectName } = route.params as { subjectId: number; subjectName: string };
  const [topics, setTopics]         = useState<any[]>([]);
  const [loading, setLoading]       = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [fromCache, setFromCache]   = useState(false);

  const fetchTopics = async () => {
    try {
      const res: any = await api.get(`/learning/topics?subject_id=${subjectId}`);
      setTopics(res.data.topics ?? []);
      setFromCache(!!res.fromCache);
    } catch {
      // leave whatever's already on screen
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchTopics(); }, [subjectId]);

  // A topic is locked either because the term hasn't been PIN-unlocked yet
  // (nothing in this subject/term has been passed) or because the previous
  // topic in sequence hasn't been passed. Only the *first* kind is fixed by
  // entering a PIN, so only show that shortcut when it would actually help.
  const anyPinLocked = topics.some((t) => t.locked && t.order_index === Math.min(
    ...topics.filter((x) => x.term_label === t.term_label).map((x) => x.order_index ?? Infinity),
  ));

  if (loading) return <Loader />;

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      {fromCache && (
        <View style={styles.offlineBanner}>
          <Ionicons name="cloud-offline-outline" size={14} color={Colors.textSub} />
          <Text style={styles.offlineText}>Showing saved topics — you're offline right now.</Text>
        </View>
      )}
      {anyPinLocked && (
        <Btn
          label="Enter Term PIN to Unlock"
          onPress={() => navigation.navigate('TermPinRedeem')}
          style={{ margin: Spacing.md }}
        />
      )}
      <FlatList
        data={topics}
        keyExtractor={(t) => String(t.id)}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchTopics(); }} />}
        contentContainerStyle={{ padding: Spacing.md, paddingTop: 0 }}
        ListEmptyComponent={<Empty message={`No topics yet for ${subjectName}.`} />}
        renderItem={({ item }) => {
          const locked = !!item.locked;
          return (
            <TouchableOpacity
              style={[styles.row, locked && styles.rowLocked]}
              activeOpacity={locked ? 1 : 0.8}
              disabled={locked}
              onPress={() => navigation.navigate('TopicDetail', { topic: item })}
            >
              <View style={[styles.rowIcon, locked && { backgroundColor: Colors.textSub + '18' }]}>
                <Ionicons
                  name={locked ? 'lock-closed' : (item.completed ? 'checkmark-circle' : 'book')}
                  size={20}
                  color={locked ? Colors.textSub : (item.completed ? Colors.success : Colors.primary)}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.rowTitle, locked && { color: Colors.textSub }]} numberOfLines={1}>{item.title}</Text>
                {item.term_label && <Text style={styles.rowSub}>{item.term_label}</Text>}
              </View>
              {item.summary && !locked && <Badge label="Saved offline" color={Colors.success} />}
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  offlineBanner: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#FFF3E0', padding: Spacing.sm, justifyContent: 'center' },
  offlineText: { fontSize: Fonts.sizes.xs, color: Colors.textSub },
  row: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.card, borderRadius: Radius.md, padding: Spacing.sm, marginBottom: Spacing.sm, elevation: 1, gap: Spacing.sm },
  rowLocked: { opacity: 0.6 },
  rowIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.primary + '18', alignItems: 'center', justifyContent: 'center' },
  rowTitle: { fontSize: Fonts.sizes.md, fontWeight: '700', color: Colors.text },
  rowSub: { fontSize: Fonts.sizes.xs, color: Colors.textSub, marginTop: 2 },
});
