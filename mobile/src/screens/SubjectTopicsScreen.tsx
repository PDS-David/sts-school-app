import React, { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../api/client';
import { Loader, Empty, Badge, Btn } from '../components/UI';
import { Colors, Spacing, Fonts, Radius } from '../theme';

// GET /learning/topics is a normal cached GET (see api/client.ts). The SS1 and
// SS2/SS3 package endpoints remain server-gated; only approved, implemented,
// verified and rights-cleared packages are returned to the student.
export default function SubjectTopicsScreen({ route, navigation }: any) {
  const { subjectId, subjectName } = route.params as { subjectId: number | null; subjectName: string };
  const [topics, setTopics] = useState<any[]>([]);
  const [packageLessons, setPackageLessons] = useState<any[]>([]);
  const [ss23Lessons, setSs23Lessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [fromCache, setFromCache] = useState(false);
  const [topicsError, setTopicsError] = useState('');

  const fetchTopics = useCallback(async () => {
    setTopicsError('');
    try {
      if (subjectId !== null && subjectId !== undefined) {
        const res: any = await api.get(`/learning/topics?subject_id=${subjectId}`);
        setTopics(res.data.topics ?? []);
        setFromCache(!!res.fromCache);
      } else {
        // A package-only subject has no subjects-table ID. Its lesson list
        // comes from the server-side SS2/SS3 package registry instead.
        setTopics([]);
        setFromCache(false);
      }
    } catch {
      setTopicsError('Could not load topics for this subject. Check your connection and try again.');
    }

    try {
      if (subjectId !== null && subjectId !== undefined) {
        const packageRes: any = await api.get(`/learning/ss1/lessons?subject_name=${encodeURIComponent(subjectName)}`);
        setPackageLessons(packageRes.data.lessons ?? []);
      } else {
        setPackageLessons([]);
      }
    } catch {
      // Non-SS1 learners and subjects without certified SS1 package lessons retain the existing topic experience.
      setPackageLessons([]);
    }

    try {
      const [ss2Res, ss3Res] = await Promise.all([
        api.get(`/learning/ss23/lessons?subject_name=${encodeURIComponent(subjectName)}`),
        api.get(`/learning/ss23/preparation?subject_name=${encodeURIComponent(subjectName)}`),
      ]);
      setSs23Lessons([
        ...(ss2Res.data.units ?? []),
        ...(ss3Res.data.units ?? []),
      ]);
    } catch {
      // SS23 delivery is optional for non-secondary classes and stays hidden
      // if the server cannot confirm the package gate.
      setSs23Lessons([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [subjectId, subjectName]);

  // Refresh after returning from TermPinRedeem as well as when the subject
  // changes, so newly unlocked SS2/SS3 terms are reflected immediately.
  useFocusEffect(useCallback(() => {
    void fetchTopics();
  }, [fetchTopics]));

  // A topic is locked either because the term hasn't been PIN-unlocked yet
  // or because the previous topic in sequence hasn't been passed. The server
  // marks sequence-first topics explicitly; older servers use order_index.
  const anyPinLocked = packageLessons.some((lesson) => lesson.locked) ||
    ss23Lessons.some((lesson) => lesson.locked) ||
    topics.some((t) => t.locked && (t.is_sequence_first !== undefined
      ? t.is_sequence_first === true
      : t.order_index === Math.min(
        ...topics.filter((x) => x.term_label === t.term_label).map((x) => x.order_index ?? Infinity),
      )));

  if (loading) return <Loader />;

  if (topicsError) return (
    <View style={{ flex: 1, backgroundColor: Colors.background, justifyContent: 'center', padding: Spacing.md }}>
      <Empty message={topicsError} />
      <Btn label="Retry loading topics" variant="outline" onPress={() => { setLoading(true); void fetchTopics(); }} />
    </View>
  );

  const ss2Lessons = ss23Lessons.filter(lesson => lesson.class_name === 'SS 2');
  const ss3Preparation = ss23Lessons.filter(lesson => lesson.class_name === 'SS 3');

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
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); void fetchTopics(); }} />}
        contentContainerStyle={{ padding: Spacing.md, paddingTop: 0 }}
        ListEmptyComponent={packageLessons.length === 0 && ss23Lessons.length === 0 ? <Empty message={`No topics yet for ${subjectName}.`} /> : null}
        ListFooterComponent={packageLessons.length > 0 || ss2Lessons.length > 0 || ss3Preparation.length > 0 ? (
          <View style={{ marginTop: Spacing.md }}>
            {packageLessons.length > 0 && (
              <View>
                <Text style={styles.packageHeading}>Additional approved SS1 lessons</Text>
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
            )}

            {ss2Lessons.length > 0 && (
              <View style={{ marginTop: Spacing.md }}>
                <Text style={styles.packageHeading}>SS2 instructional lessons</Text>
                <Text style={styles.packageHint}>Only fully approved, verified and rights-cleared lessons are available.</Text>
                {ss2Lessons.map((lesson) => (
                  <TouchableOpacity key={lesson.id} style={[styles.row, lesson.locked && styles.rowLocked]} activeOpacity={lesson.locked ? 1 : 0.8}
                    disabled={!!lesson.locked}
                    onPress={() => navigation.navigate('Ss23PackageLesson', { lesson })}>
                    <View style={styles.rowIcon}><Ionicons name={lesson.locked ? 'lock-closed' : 'book-outline'} size={20} color={lesson.locked ? Colors.textSub : Colors.primary} /></View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.rowTitle}>{lesson.title}</Text>
                      <Text style={styles.rowSub}>{lesson.term} · Week {lesson.week_label} · {lesson.practice_count ?? 0} practice questions</Text>
                    </View>
                    <Ionicons name={lesson.locked ? 'lock-closed' : 'chevron-forward'} size={18} color={Colors.textSub} />
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {ss3Preparation.length > 0 && (
              <View style={{ marginTop: Spacing.md }}>
                <Text style={styles.packageHeading}>SS3 examination preparation</Text>
                <Text style={styles.packageHint}>Revision and examination practice only; no new instructional topics.</Text>
                {ss3Preparation.map((lesson) => (
                  <TouchableOpacity key={lesson.id} style={[styles.row, lesson.locked && styles.rowLocked]} activeOpacity={lesson.locked ? 1 : 0.8}
                    disabled={!!lesson.locked}
                    onPress={() => navigation.navigate('Ss23PackageLesson', { lesson })}>
                    <View style={styles.rowIcon}><Ionicons name={lesson.locked ? 'lock-closed' : 'clipboard-outline'} size={20} color={lesson.locked ? Colors.textSub : Colors.primary} /></View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.rowTitle}>{lesson.title}</Text>
                      <Text style={styles.rowSub}>{lesson.term} · Week {lesson.week_label} · {lesson.practice_count ?? 0} practice questions</Text>
                    </View>
                    <Ionicons name={lesson.locked ? 'lock-closed' : 'chevron-forward'} size={18} color={Colors.textSub} />
                  </TouchableOpacity>
                ))}
              </View>
            )}
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
