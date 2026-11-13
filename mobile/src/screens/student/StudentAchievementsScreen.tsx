import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../../api/client';
import { Card, Loader } from '../../components/UI';
import { AppHeader } from '../../components/AppHeader';
import { openNotifications } from '../../navigation/navigationRef';
import { Colors, Fonts, Spacing } from '../../theme';

const ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  'topic-first': 'book-outline',
  'topic-explorer': 'compass-outline',
  'topic-scholar': 'school-outline',
  'assessment-first': 'clipboard-outline',
  'assessment-ace': 'star-outline',
  'perfect-score': 'trophy-outline',
};

export default function StudentAchievementsScreen() {
  const [badges, setBadges] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const { data } = await api.get('/learning/achievements/me');
      setBadges(data.badges ?? []);
      setSummary(data.summary ?? null);
    } catch { /* preserve the last successful view when offline */ }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) return <Loader />;

  const earnedCount = badges.filter(b => b.earned).length;

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <AppHeader title="Badges & Achievements" subtitle={`${earnedCount} of ${badges.length} earned`} onPressBell={() => openNotifications()} />
      <ScrollView contentContainerStyle={{ padding: Spacing.md }} refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={async () => { setRefreshing(true); await load(); setRefreshing(false); }} />
      }>
        <Card style={{ marginBottom: Spacing.md }}>
          <Text style={{ color: Colors.text, fontSize: Fonts.sizes.md, fontWeight: '700' }}>Your learning milestones</Text>
          <Text style={{ color: Colors.textSub, fontSize: Fonts.sizes.sm, marginTop: 6 }}>
            {summary?.topics_passed ?? 0} topics passed · {summary?.assessments_submitted ?? 0} assessments submitted
          </Text>
          <Text style={{ color: Colors.textSub, fontSize: Fonts.sizes.xs, marginTop: 3 }}>
            {summary?.high_scores ?? 0} assessments at 80% or above · {summary?.perfect_scores ?? 0} perfect scores
          </Text>
        </Card>

        {badges.map(badge => {
          const progress = badge.target ? Math.min(100, badge.progress / badge.target * 100) : 0;
          return (
            <Card key={badge.id} style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.sm, opacity: badge.earned ? 1 : 0.88 }}>
              <View style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: badge.earned ? Colors.success + '20' : Colors.border, alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name={ICONS[badge.id] ?? 'ribbon-outline'} size={25} color={badge.earned ? Colors.success : Colors.textSub} />
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
                  <Text style={{ color: Colors.text, fontSize: Fonts.sizes.md, fontWeight: '700', flex: 1 }}>{badge.title}</Text>
                  <Text style={{ color: badge.earned ? Colors.success : Colors.textSub, fontSize: Fonts.sizes.xs, fontWeight: '700' }}>{badge.earned ? 'EARNED' : 'IN PROGRESS'}</Text>
                </View>
                <Text style={{ color: Colors.textSub, fontSize: Fonts.sizes.xs, marginTop: 3 }}>{badge.description}</Text>
                <View style={{ height: 6, backgroundColor: Colors.border, borderRadius: 3, overflow: 'hidden', marginTop: 8 }}>
                  <View style={{ height: 6, width: `${progress}%`, backgroundColor: badge.earned ? Colors.success : Colors.primary }} />
                </View>
                <Text style={{ color: Colors.textSub, fontSize: Fonts.sizes.xs, marginTop: 4 }}>{badge.progress} / {badge.target}</Text>
                {badge.earned_at ? <Text style={{ color: Colors.textSub, fontSize: Fonts.sizes.xs, marginTop: 2 }}>Earned {new Date(badge.earned_at).toLocaleDateString()}</Text> : null}
              </View>
            </Card>
          );
        })}
      </ScrollView>
    </View>
  );
}
