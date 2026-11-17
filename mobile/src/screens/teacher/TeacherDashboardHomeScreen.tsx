import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import api from '../../api/client';
import { useAuth } from '../../api/AuthContext';
import { Card, Loader, Btn } from '../../components/UI';
import { PageContainer } from '../../components/layout';
import { Colors, Spacing, Fonts } from '../../theme';
import { AppHeader } from '../../components/AppHeader';
import { openNotifications } from '../../navigation/navigationRef';

export default function TeacherDashboardHomeScreen({ navigation }: any) {
  const { user } = useAuth();
  const [term, setTerm] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadError, setLoadError] = useState('');

  const load = useCallback(async () => {
    setLoadError('');
    try {
      const { data } = await api.get('/academic/terms/current');
      setTerm(data.term ?? null);
    } catch (error: any) {
      setLoadError(error?.response?.data?.error ?? 'Could not load the current reporting term.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  if (loading) return <Loader />;

  const openReports = () => navigation.getParent()?.navigate('ReportsTab', { screen: 'Students' });
  const openDecisions = () => navigation.getParent()?.navigate('ReportsTab', { screen: 'PromoteStudents' });

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <AppHeader
        title={`Welcome, ${user?.username ?? 'Teacher'}`}
        subtitle={[user?.assigned_class ?? 'No class assigned', term ? `${term.name} · ${term.academic_year}` : null].filter(Boolean).join(' · ')}
        onPressBell={() => openNotifications()}
      />
      <ScrollView
        contentContainerStyle={{ padding: Spacing.md }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); void load(); }} />}
      >
        {!!loadError && (
          <Card style={{ marginBottom: Spacing.sm }}>
            <Text style={{ color: Colors.error, fontSize: Fonts.sizes.sm }}>{loadError}</Text>
            <TouchableOpacity onPress={() => void load()} style={{ marginTop: Spacing.sm }}>
              <Text style={{ color: Colors.primary, fontWeight: '700' }}>Retry</Text>
            </TouchableOpacity>
          </Card>
        )}
        <Card>
          <Text style={{ color: Colors.text, fontSize: Fonts.sizes.lg, fontWeight: '800' }}>Student report generation</Text>
          <Text style={{ color: Colors.textSub, fontSize: Fonts.sizes.sm, lineHeight: 20, marginTop: 6 }}>
            Select a student in your assigned physical class, review the term's recorded information,
            add your class-teacher remark, then print or export the official report card.
          </Text>
          <Btn label="Generate Student Reports" onPress={openReports} style={{ marginTop: Spacing.md }} />
        </Card>
        <Card style={{ marginTop: Spacing.sm }}>
          <Text style={{ color: Colors.text, fontSize: Fonts.sizes.md, fontWeight: '700' }}>Class progression decisions</Text>
          <Text style={{ color: Colors.textSub, fontSize: Fonts.sizes.sm, lineHeight: 20, marginTop: 5 }}>
            When the school requests end-of-session decisions, choose promote, retain, or demote for each
            student in your assigned class. These decisions are made at runtime, never pre-filled by the app.
          </Text>
          <Btn label="Review Class Decisions" variant="outline" onPress={openDecisions} style={{ marginTop: Spacing.sm }} />
        </Card>
      </ScrollView>
    </View>
  );
}
