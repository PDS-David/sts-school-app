import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, RefreshControl } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import api from '../../api/client';
import { Card, Btn, Badge, Loader, Empty, SectionHeader } from '../../components/UI';
import { Colors, Spacing, Fonts } from '../../theme';
import { AppHeader } from '../../components/AppHeader';
import { useAdminSchool } from '../../api/AdminSchoolContext';
import { SchoolSwitcherBar } from '../../components/SchoolSwitcherBar';
import { openNotifications } from '../../navigation/navigationRef';

// Mobile UI for backend/src/routes/admin.ts's POST/GET /admin/class-codes —
// Task B: gives admin a way to generate the one-code-per-class a teacher
// reads out once, so students can self-claim their own account (find their
// name, set their own password — see StudentSelfClaimScreen.tsx / POST
// /auth/self-claim). Mirrors AdminTermPinsScreen.tsx's shape closely — same
// underlying pattern (generate, show once, list issued with status), one
// code per class instead of one PIN per student.
export default function AdminClassCodesScreen() {
  const { selectedSchoolCode } = useAdminSchool();
  const [classes, setClasses] = useState<string[]>([]);
  const [className, setClassName] = useState('');
  const [generating, setGenerating] = useState(false);

  const [codes, setCodes] = useState<any[]>([]);
  const [loadingCodes, setLoadingCodes] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadClasses = useCallback(() => {
    api.get('/academic/classes', { params: { school_code: selectedSchoolCode ?? undefined } })
      .then(({ data }) => {
        const names = (data.classes ?? []).map((c: any) => c.name);
        setClasses(names);
        if (names.length && !className) setClassName(names[0]);
      })
      .catch(() => {});
  }, [selectedSchoolCode]);

  const loadCodes = useCallback(async () => {
    try {
      const { data } = await api.get('/admin/class-codes', { params: { school_code: selectedSchoolCode ?? undefined } });
      setCodes(data.class_codes ?? []);
    } catch { /* offline — keep whatever's already loaded */ }
    setLoadingCodes(false);
  }, [selectedSchoolCode]);

  useEffect(() => { loadClasses(); }, [loadClasses]);
  useEffect(() => { loadCodes(); }, [loadCodes]);

  const generate = async () => {
    if (!className) { Alert.alert('Select a class first'); return; }
    setGenerating(true);
    try {
      const { data } = await api.post('/admin/class-codes', { school_code: selectedSchoolCode, class_name: className });
      Alert.alert(
        'Code generated',
        `${className}\n\nCode: ${data.class_code.code}\n\nGive this to the class teacher to read out to students. Generating again for this class replaces the code — anyone who hasn't claimed yet needs the new one.`,
      );
      loadCodes();
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.error ?? 'Could not generate a code. Check your connection and try again.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <AppHeader title="Class Codes" onPressBell={() => openNotifications()} rightExtra={<SchoolSwitcherBar compact />} />
      <ScrollView
        contentContainerStyle={{ padding: Spacing.md }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={async () => { setRefreshing(true); await loadCodes(); setRefreshing(false); }} />}
      >
        <SectionHeader title="Generate a Code" />
        <Card style={{ marginBottom: Spacing.lg }}>
          <Text style={styles.label}>Class</Text>
          <Picker selectedValue={className} onValueChange={setClassName} style={styles.picker}>
            {classes.map((c) => <Picker.Item key={c} label={c} value={c} />)}
          </Picker>

          <Text style={styles.hint}>
            One code per class — every student in it uses the same code once to claim their own account. Generating again replaces it; anyone already claimed keeps their account either way.
          </Text>
          <Btn label="Generate Code" onPress={generate} loading={generating} disabled={!className} />
        </Card>

        <SectionHeader title="Issued Codes" />
        {loadingCodes ? (
          <Loader />
        ) : codes.length === 0 ? (
          <Empty message="No codes issued yet." />
        ) : (
          codes.map((c) => (
            <Card key={c.id} style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{c.class_name}</Text>
                <Text style={styles.sub}>Code: {c.code} · {c.claimed_count} claimed, {c.unclaimed_count} remaining</Text>
              </View>
              <Badge
                label={Number(c.unclaimed_count) === 0 ? 'All claimed' : `${c.unclaimed_count} left`}
                color={Number(c.unclaimed_count) === 0 ? Colors.success : Colors.textSub}
              />
            </Card>
          ))
        )}
        <View style={{ height: Spacing.xl }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: Fonts.sizes.sm, fontWeight: '600', color: Colors.textSub, marginTop: Spacing.xs },
  picker: { marginBottom: Spacing.xs },
  hint: { fontSize: Fonts.sizes.xs, color: Colors.textSub, marginBottom: Spacing.sm },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.sm, gap: Spacing.sm },
  name: { fontSize: Fonts.sizes.sm, fontWeight: '700', color: Colors.text },
  sub: { fontSize: Fonts.sizes.xs, color: Colors.textSub, marginTop: 2 },
});
