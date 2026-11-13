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
  const [packageLessons, setPackageLessons] = useState<any[]>([]);
  const [loading, setLoading]       = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [fromCache, setFromCache]   = useState(false);
  const [topicsError, setTopicsError] = useState('');

  const fetchTopics = async () => {
    setTopicsError('');
    try {
      const res: any = await api.get(`/learning/topics?subject_id=${subjectId}`);
      setTopics(res.data.topics ?? []);
      setFromCache(!!res.fromCache);
    } catch {
      setTopicsError('Could not load topics for this subject. Check your connection and try again.');
    }
    try {
      const packageRes: any = await api.get(`/learning/ss1/lessons?subject_name=${encodeURIComponent(subjectName)}`);
      setPackageLessons(packageRes.data.lessons ?? []);
    } catch {
      // Non-SS1 learners and subjects without certified package lessons retain the existing topic experience.
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
  // Task 05: the server marks the sequence-first topic explicitly (placed supplements make order_index
  // comparison unsafe). Older servers omit the field, so fall back to the previous order_index rule.
  const anyPinLocked = packageLessons.some((lesson) => lesson.locked) || topics.some((t) => t.locked && (t.is_sequence_first !== undefined
    ? t.is_sequence_first === true
    : t.order_index === Math.min(
      ...topics.filter((x) => x.term_label === t.term_label).map((x) => x.order_index ?? Infinity),
    )));

  if (loading) return <Loader />;

  if (topicsError) return (
    <View style={{ flex: 1, backgroundColor: Colors.background, justifyContent: 'center', padding: Spacing.md }}>
      <Empty message={topicsError} />
      <Btn label="Retry loading topics" variant="outline" onPress={() => { setLoading(true); fetchTopics(); }} />
    </View>
  );

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
        ListEmptyComponent={packageLessons.length === 0 ? <Empty message={`No topics yet for ${subjectName}.`} /> : null}
        ListFooterComponent={packageLessons.length > 0 ? (
          <View style={{ marginTop: Spacing.md }}>
            <Text style={styles.packageHeading}>Additional approved lessons</Text>
            <Text style={styles.packageHint}>Approved, implemented lessons with permitted sources. Classroom verification status is shown for each lesson.</Text>
            {packageLessons.map((lesson) => (
              <TouchableOpacity key={lesson.id} style={[styles.row, lesson.locked && styles.rowLocked]} activeOpacity={lesson.locked ? 1 : 0.8}
                disabled={!!lesson.locked}
                onPress={() => navigation.navigate('Ss1PackageLesson', { lesson })}>
                <View style={styles.rowIcon}><Ionicons name={lesson.locked ? 'lock-closed' : 'book-outline'} size={20} color={lesson.locked ? Colors.textSub : Colors.primary} /></View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.rowTitle}>{lesson.title}</Text>
                  <Text style={styles.rowSub}>{lesson.term} · {lesson.practice_count ?? lesson.practice?.length ?? 0} practice questions{lesson.classroom_verification_pending ? ' · Teacher review pending' : ''}</Text>
                </View>
                <Ionicons name={lesson.locked ? 'lock-closed' : 'chevron-forward'} size={18} color={Colors.textSub} />
              </TouchableOpacity>
            ))}
          </View>
        ) : null}
        renderItem={({ item }) => {
          const locked = !!item.locked;
          return (
            <TouchableOpacity
              style={[styles.row, locked && styles.rowLocked]}
              activeOpacity={locked ? 1 : 0.8}
              disabled={locked}
              onPress={() => navigation.navigate('TopicDetail', {
                topic: item,
                openListening: String(subjectName).toLowerCase().includes('french') && /dialo(?:gue|que)/i.test(String(item.title ?? '')),
              })}
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
  packageHeading: { fontSize: Fonts.sizes.md, fontWeight: '700', color: Colors.text, marginBottom: 4 },
  packageHint: { fontSize: Fonts.sizes.xs, color: Colors.textSub, marginBottom: Spacing.sm },
  offlineBanner: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#FFF3E0', padding: Spacing.sm, justifyContent: 'center' },
  offlineText: { fontSize: Fonts.sizes.xs, color: Colors.textSub },
  row: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.card, borderRadius: Radius.md, padding: Spacing.sm, marginBottom: Spacing.sm, elevation: 1, gap: Spacing.sm },
  rowLocked: { opacity: 0.6 },
  rowIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.primary + '18', alignItems: 'center', justifyContent: 'center' },
  rowTitle: { fontSize: Fonts.sizes.md, fontWeight: '700', color: Colors.text },
  rowSub: { fontSize: Fonts.sizes.xs, color: Colors.textSub, marginTop: 2 },
});
