import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import api from '../../api/client';
import { useAuth } from '../../api/AuthContext';
import { Card, Loader } from '../../components/UI';
import { PageContainer } from '../../components/layout';
import { Colors, Spacing, Fonts } from '../../theme';
import { AppHeader } from '../../components/AppHeader';

export default function TeacherDashboardHomeScreen({ navigation }: any) {
  const { user } = useAuth();
  const teacherClasses = [...new Set([user?.assigned_class, ...(user?.assigned_class_names ?? [])].filter(Boolean))];
  const [term, setTerm] = useState<any>(null);
  const [studentCount, setStudentCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    setLoadError('');
    const errors: string[] = [];
    try {
      const { data } = await api.get('/academic/terms/current');
      setTerm(data.term ?? null);
    } catch {
      errors.push('current term');
    }
    try {
      const { data } = await api.get('/students');
      setStudentCount((data.students ?? []).length);
    } catch {
      errors.push('assigned-class report roster');
    }
    if (errors.length) setLoadError(`Could not refresh ${errors.join(' and ')}. Pull down or retry.`);
    setLoading(false);
  }, [user?.id, user?.school_code, user?.assigned_class, user?.assigned_class_names?.join('|')]);

  useEffect(() => {
    setTerm(null);
    setStudentCount(null);
    setLoading(true);
    void load();
  }, [load]);

  if (loading) return <Loader />;

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <AppHeader
        title={`Hi, ${user?.username ?? ''}`}
        subtitle={[teacherClasses.length ? teacherClasses.join(', ') : null, term ? `${term.name} · ${term.academic_year}` : null].filter(Boolean).join(' · ') || undefined}
      />
      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={async () => { setRefreshing(true); await load(); setRefreshing(false); }} />}>
        <PageContainer style={{ padding: Spacing.md }}>
          {!!loadError && (
            <Card style={{ marginBottom: Spacing.sm }}>
              <Text style={{ color: Colors.error, fontSize: Fonts.sizes.sm }}>{loadError}</Text>
              <TouchableOpacity onPress={() => load()} style={{ marginTop: Spacing.sm }}>
                <Text style={{ color: Colors.primary, fontWeight: '700' }}>Retry</Text>
              </TouchableOpacity>
            </Card>
          )}
          <Card>
            <Text style={{ color: Colors.textSub, fontSize: Fonts.sizes.sm }}>Active physical report roster</Text>
            <Text style={{ color: Colors.text, fontSize: 30, fontWeight: '800' }}>{studentCount ?? '—'}</Text>
            <Text style={{ color: Colors.textSub, fontSize: Fonts.sizes.sm, marginTop: 6 }}>
              You can generate term and session reports for students in your assigned physical class. Online learning accounts and classes are managed separately.
            </Text>
            <TouchableOpacity onPress={() => navigation.getParent()?.navigate('ReportsTab', { screen: 'Students' })} style={{ marginTop: Spacing.md }}>
              <Text style={{ color: Colors.primary, fontWeight: '700' }}>Open student reports</Text>
            </TouchableOpacity>
          </Card>
        </PageContainer>
      </ScrollView>
    </View>
  );
}
