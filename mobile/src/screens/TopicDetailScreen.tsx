import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api, { BASE_URL } from '../api/client';
import { getSecureItem } from '../api/secureTokenStorage';
import { loadLessonAssets } from '../api/lessonAssets';
import { Card, Btn, Loader, SectionHeader } from '../components/UI';
import { Colors, Spacing, Fonts, Radius } from '../theme';

// A lesson picture (Music notation, Basic Technology diagram) served by
// GET /learning/assets/:id. The bytes need the same Bearer token as every other
// call, so the image is loaded with an Authorization header. Labels live inside
// the picture, so it is shown whole (resizeMode="contain", never cropped) at
// full width, with its height taken from the picture's own proportions once it
// has loaded. Animated GIFs are passed straight through unchanged.
function LessonImage({ asset, token, onRetry }: { asset: any; token: string; onRetry: () => void }) {
  const [ratio, setRatio] = useState(4 / 3);
  const [failed, setFailed] = useState(false);
  if (failed) {
    return <View style={styles.assetWrap}>
      <Text style={styles.assetFailed}>This lesson picture could not be loaded.</Text>
      <Btn label="Retry pictures" onPress={onRetry} />
    </View>;
  }
  return (
    <View style={styles.assetWrap}>
      <Image
        source={{ uri: `${BASE_URL}${asset.url}`, headers: { Authorization: `Bearer ${token}` } }}
        style={{ width: '100%', aspectRatio: ratio, backgroundColor: '#fff' }}
        resizeMode="contain"
        accessibilityLabel={asset.caption ?? 'Lesson illustration'}
        onLoad={(e: any) => {
          const src = e?.nativeEvent?.source;
          if (src?.width && src?.height) setRatio(src.width / src.height);
        }}
        onError={() => setFailed(true)}
      />
      {asset.caption ? <Text style={styles.assetCaption}>{asset.caption}</Text> : null}
    </View>
  );
}

// POST /learning/topics/:id/complete is excluded from the offline outbox
// (see api/client.ts) — it needs a live round trip and fails immediately,
// honestly, when offline. Once it's been called successfully at least once
// for a topic, though, the resulting `summary` comes back on every GET
// /learning/topics (a normal cached GET), so re-reading an
// already-completed topic works fully offline from then on.
export default function TopicDetailScreen({ route, navigation }: any) {
  const { topic: initialTopic } = route.params as { topic: any };
  const [topic, setTopic]           = useState(initialTopic);
  const [loading, setLoading]       = useState(false);
  const [practice, setPractice]     = useState<any[]>([]);
  const [revealed, setRevealed]     = useState<Record<number, boolean>>({});
  const [assessmentStatus, setAssessmentStatus] = useState<string | null>(null);
  const [note, setNote]             = useState<string | undefined>(undefined);
  const [summaryIsFallback, setSummaryIsFallback] = useState(false);
  const [assets, setAssets]         = useState<any[]>([]);
  const [token, setToken]           = useState<string | null>(null);

  const [assetError, setAssetError] = useState(false);
  const [assetsLoading, setAssetsLoading] = useState(false);
  const [assetAttempt, setAssetAttempt] = useState(0);
  const retryAssets = () => setAssetAttempt(n => n + 1);

  // Read the token AFTER the API request: its interceptor may refresh it.
  // Do not silently present a lesson as complete when its pictures failed.
  useEffect(() => {
    let alive = true;
    setAssets([]);
    setToken(null);
    setAssetError(false);
    setAssetsLoading(true);
    (async () => {
      try {
        const result = await loadLessonAssets(
          initialTopic.id, url => api.get(url), () => getSecureItem('access_token'),
        );
        if (alive) { setAssets(result.assets); setToken(result.token); }
      } catch {
        if (alive) setAssetError(true);
      } finally {
        if (alive) setAssetsLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [initialTopic.id, assetAttempt]);

  const complete = async () => {
    setLoading(true);
    try {
      const { data } = await api.post(`/learning/topics/${topic.id}/complete`);
      setTopic((t: any) => ({ ...t, summary: data.summary }));
      setSummaryIsFallback(!!data.summary_is_fallback);
      setPractice(data.practice_questions ?? []);
      setAssessmentStatus(data.assessment_status ?? null);
      setNote(data.note);
    } catch (e: any) {
      const msg = e?.response?.data?.error;
      Alert.alert(
        'Could not load this topic',
        msg ?? "You're offline — getting a new topic's study notes needs a connection. Try again once you're back online.",
      );
    } finally {
      setLoading(false);
    }
  };

  const takeAssessment = () => {
    // TakeAssessment lives in the Assessments tab's own stack, not the
    // Learning stack this screen is in — explicit nested navigation here
    // rather than a bare navigate('TakeAssessment', ...), which isn't
    // reliably guaranteed to resolve across sibling tab stacks.
    navigation.navigate('AssessmentsTab', {
      screen: 'TakeAssessment',
      params: {
        assessmentId: topic.generated_assessment_id,
        title: `${topic.title} — Topic Assessment`,
      },
    });
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: Colors.background }} contentContainerStyle={{ padding: Spacing.md }}>
      <Card>
        <SectionHeader title={topic.title} />
        {topic.description ? <Text style={styles.desc}>{topic.description}</Text> : null}

        {topic.summary ? (
          <View style={{ marginTop: Spacing.sm }}>
            <Text style={styles.summaryLabel}>Study Notes</Text>
            {summaryIsFallback && (
              <View style={styles.fallbackBox}>
                <Ionicons name="information-circle-outline" size={16} color={Colors.textSub} />
                <Text style={styles.fallbackText}>
                  We couldn't generate a polished lesson right now, so here's the school's
                  original curriculum note for this topic instead. Try again later for the
                  full write-up.
                </Text>
              </View>
            )}
            <Text style={styles.summaryText}>{topic.summary}</Text>
          </View>
        ) : null}
        {assetsLoading ? <Text style={styles.assetCaption}>Loading lesson pictures…</Text> : null}
        {assetError ? <View style={styles.assetWrap}>
          <Text style={styles.assetFailed}>Lesson pictures could not be checked. This lesson may be missing illustrations.</Text>
          <Btn label="Retry pictures" onPress={retryAssets} />
        </View> : null}
        {token && assets.length > 0 ? (
          <View style={{ marginTop: Spacing.md }}>
            {assets.map((a: any) => <LessonImage key={`${initialTopic.id}:${a.id}:${assetAttempt}`} asset={a} token={token} onRetry={retryAssets} />)}
          </View>
        ) : null}
        <Btn
            label={loading ? 'Loading…' : topic.summary ? 'Get Practice Questions' : 'Get Study Notes'}
            onPress={complete}
            loading={loading}
            style={{ marginTop: Spacing.sm }}
          />

        {note && (
          <View style={styles.noteBox}>
            <Ionicons name="checkmark-circle-outline" size={16} color={Colors.success} />
            <Text style={styles.noteText}>{note}</Text>
          </View>
        )}
      </Card>

      {(assessmentStatus === 'open' || topic.generated_assessment_id) && (
        <Btn
          label="Take Topic Assessment"
          onPress={takeAssessment}
          style={{ marginTop: Spacing.md }}
        />
      )}

      {practice.length > 0 && (
        <Card style={{ marginTop: Spacing.md }}>
          <SectionHeader title="Practice Questions" />
          <Text style={styles.practiceHint}>Just for your own revision — these aren't graded.</Text>
          {practice.map((q: any, i: number) => (
            <View key={i} style={styles.practiceQ}>
              <Text style={styles.stem}>{i + 1}. {q.stem}</Text>
              {(q.options ?? []).map((o: any) => (
                <Text
                  key={o.key}
                  style={[
                    styles.option,
                    revealed[i] && (q.correct_keys ?? []).includes(o.key) && styles.correctOption,
                  ]}
                >
                  {o.key}. {o.text}
                </Text>
              ))}
              <TouchableOpacity onPress={() => setRevealed((r) => ({ ...r, [i]: !r[i] }))}>
                <Text style={styles.revealTxt}>{revealed[i] ? 'Hide answer' : 'Reveal answer'}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </Card>
      )}

      <View style={{ height: Spacing.xl }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  desc: { fontSize: Fonts.sizes.sm, color: Colors.textSub, marginTop: 4 },
  summaryLabel: { fontSize: Fonts.sizes.sm, fontWeight: '700', color: Colors.primary, marginBottom: 4 },
  fallbackBox: { flexDirection: 'row', alignItems: 'flex-start', gap: 6, backgroundColor: Colors.textSub + '15', padding: Spacing.sm, borderRadius: Radius.sm, marginBottom: Spacing.sm },
  fallbackText: { fontSize: Fonts.sizes.xs, color: Colors.textSub, flex: 1, lineHeight: 16 },
  summaryText: { fontSize: Fonts.sizes.sm, color: Colors.text, lineHeight: 20 },
  assetWrap: { marginBottom: Spacing.md },
  assetCaption: { fontSize: Fonts.sizes.xs, color: Colors.textSub, textAlign: 'center', marginTop: 4 },
  assetFailed: { fontSize: Fonts.sizes.xs, color: Colors.textSub, fontStyle: 'italic', marginBottom: Spacing.md },
  noteBox: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: Spacing.sm, backgroundColor: Colors.success + '15', padding: Spacing.sm, borderRadius: Radius.sm },
  noteText: { fontSize: Fonts.sizes.xs, color: Colors.text, flex: 1 },
  practiceHint: { fontSize: Fonts.sizes.xs, color: Colors.textSub, fontStyle: 'italic', marginBottom: Spacing.sm },
  practiceQ: { marginBottom: Spacing.md, paddingBottom: Spacing.sm, borderBottomWidth: 1, borderBottomColor: Colors.border },
  stem: { fontSize: Fonts.sizes.sm, fontWeight: '700', color: Colors.text, marginBottom: 4 },
  option: { fontSize: Fonts.sizes.sm, color: Colors.text, paddingVertical: 2 },
  correctOption: { color: Colors.success, fontWeight: '700' },
  revealTxt: { fontSize: Fonts.sizes.xs, color: Colors.primary, fontWeight: '700', marginTop: 4 },
});
