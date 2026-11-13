import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, RefreshControl } from 'react-native';
import api from '../../api/client';
import { useAuth } from '../../api/AuthContext';
import { useAdminSchool } from '../../api/AdminSchoolContext';
import { SchoolSwitcherBar } from '../../components/SchoolSwitcherBar';
import { Card, Loader, Btn } from '../../components/UI';
import { PageContainer } from '../../components/layout';
import { Colors, Spacing, Fonts } from '../../theme';
import { AppHeader } from '../../components/AppHeader';
import { openNotifications } from '../../navigation/navigationRef';

// Replaces the old shared DashboardScreen.tsx tile grid for the 'admin' role
// (Operations Admin). Admin has no school_code of its own (manages both
// schools), so branding/stats follow whichever school is currently selected
// in the switcher — same logic the old DashboardScreen used, carried over.
//
// Layout, corrected after live testing on web: the centre of the screen is
// for actually viewing/doing something, not menus — Quick Actions (was a
// second, screen-local mini-sidebar here, duplicating both the real
// persistent Sidebar's nav AND a FAB with the same three destinations) now
// lives in that one real Sidebar instead (see AdminTabs.tsx's
// QUICK_ACTIONS). The school switcher (was its own full-width bar below
// the header) and the term/student-count stats (was a separate stat-chip
// row in the centre) both fold into the header itself, at the same level
// as "Hi, admin" — via AppHeader's `rightExtra` slot and an extended
// subtitle line, respectively. That leaves this screen's own content
// genuinely empty for now, which is correct, not a bug — there's nothing
// this specific screen needs to show yet beyond what the header now
// carries; it becomes a real content area once there's something worth
// putting here (e.g. a future activity feed).
type BackupStatus = {
  last_backup_at: string | null; last_status: string | null; days_since: number | null;
  overdue: boolean; configured: boolean;
};

// Weekly encrypted database backup, emailed to the admin recipients. The server sends a reminder
// (email + push) when one is more than 7 days overdue; this card shows the state and runs it on demand.
function BackupCard() {
  const [st, setSt] = useState<BackupStatus | null>(null);
  const [statusError, setStatusError] = useState('');
  const [busy, setBusy] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setStatusError('');
    try { setSt((await api.get('/admin/backups/status')).data); }
    catch (e: any) { setStatusError(e?.response?.data?.error ?? 'Could not load backup status. Retry when connected.'); }
  }, []);
  useEffect(() => { refresh(); }, [refresh]);

  const run = async () => {
    setBusy(true); setMsg(null);
    try {
      const r = (await api.post('/admin/backups/run')).data;
      setMsg(r.emailed
        ? 'Backup emailed to the admin recipients.'
        : 'Backup was created but NOT emailed (too large or no recipient set). Ask your developer to run the backup export.');
      setSt(r);
    } catch (e: any) {
      setMsg(e?.response?.data?.error ?? 'Backup failed. Please try again.');
    }
    setBusy(false);
  };
  const confirm = () => setConfirming(true);

  if (!st) return (
    <Card style={{ marginTop: Spacing.md }}>
      <Text style={{ fontSize: Fonts.sizes.md, fontWeight: '600', color: Colors.text }}>Database backup</Text>
      <Text style={{ color: Colors.error, fontSize: Fonts.sizes.sm, marginTop: 4 }}>{statusError || 'Loading backup status…'}</Text>
      {!!statusError && <Btn label='Retry backup status' variant='outline' onPress={() => refresh()} style={{ marginTop: Spacing.sm }} />}
    </Card>
  );
  const last = st.last_backup_at ? new Date(st.last_backup_at).toLocaleDateString() : 'never';
  const color = !st.configured || st.overdue ? Colors.warning : Colors.success;
  return (
    <Card style={{ marginTop: Spacing.md }}>
      <Text style={{ fontSize: Fonts.sizes.md, fontWeight: '600', color: Colors.text }}>Database backup</Text>
      <Text style={{ color, fontSize: Fonts.sizes.sm, marginTop: 4 }}>
        {!st.configured
          ? 'Not set up: the server needs BACKUP_PASSPHRASE.'
          : st.overdue
            ? (st.days_since === null ? 'No emailed backup yet - one is due.' : `Overdue: last emailed backup ${st.days_since} days ago.`)
            : `Up to date: last emailed backup ${st.days_since === 0 ? 'today' : `${st.days_since} day(s) ago`}.`}
      </Text>
      <Text style={{ color: Colors.textSub, fontSize: Fonts.sizes.sm, marginTop: 2 }}>
        Last attempt: {last}{st.last_status ? ` (${st.last_status})` : ''}
      </Text>
      {!!statusError && <Text style={{ color: Colors.error, fontSize: Fonts.sizes.sm, marginTop: 6 }}>{statusError}</Text>}
      {msg ? <Text style={{ color: Colors.textSub, fontSize: Fonts.sizes.sm, marginTop: 6 }}>{msg}</Text> : null}
      {confirming ? (
        <View style={{ marginTop: Spacing.sm, gap: Spacing.sm }}>
          <Text style={{ color: Colors.text, fontSize: Fonts.sizes.sm }}>Send an encrypted copy of the whole database to the configured admin recipients?</Text>
          <View style={{ flexDirection: 'row', gap: Spacing.sm }}>
            <Btn label="Cancel" variant="outline" onPress={() => setConfirming(false)} style={{ flex: 1 }} disabled={busy} />
            <Btn label="Confirm backup" onPress={() => { setConfirming(false); run(); }} style={{ flex: 1 }} loading={busy} disabled={busy} />
          </View>
        </View>
      ) : <Btn label="Back up now" onPress={confirm} loading={busy} disabled={busy || !st.configured} style={{ marginTop: Spacing.sm }} />}
    </Card>
  );
}

export default function AdminDashboardHomeScreen() {
  const { user } = useAuth();
  const { selectedSchoolCode } = useAdminSchool();
  const [term, setTerm] = useState<any>(null);
  const [studentCount, setStudentCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    setLoadError('');
    const errors: string[] = [];
    const sc = selectedSchoolCode ?? undefined;
    try {
      const { data } = await api.get('/students', { params: { school_code: sc } });
      setStudentCount(data.students?.length ?? null);
    } catch { errors.push('student count'); }
    try {
      const { data } = await api.get('/academic/terms/current', { params: { school_code: sc } });
      setTerm(data.term);
    } catch { errors.push('current term'); }
    if (errors.length) setLoadError(`Could not refresh ${errors.join(' and ')} for the selected school.`);
    setLoading(false);
  }, [selectedSchoolCode]);

  useEffect(() => { load(); }, [load]);

  if (loading) return <Loader />;

  const subtitleParts = [
    term ? `${term.name} · ${term.academic_year}` : null,
    studentCount != null ? `${studentCount} Students` : null,
  ].filter(Boolean);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <AppHeader
        title={`Hi, ${user?.username ?? ''}`}
        subtitle={subtitleParts.join(' · ')}
        onPressBell={() => openNotifications()}
        rightExtra={<SchoolSwitcherBar compact />}
      />
      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={async () => { setRefreshing(true); await load(); setRefreshing(false); }} />}>
        <PageContainer style={{ padding: Spacing.md }}>
          {!!loadError && <Card style={{ marginBottom: Spacing.sm }}><Text style={{ color: Colors.error, fontSize: Fonts.sizes.sm }}>{loadError}</Text><Btn label='Retry school summary' variant='outline' onPress={() => load()} style={{ marginTop: Spacing.sm }} /></Card>}
          <Card>
            <Text style={{ color: Colors.textSub, fontSize: Fonts.sizes.sm }}>
              Use Academics, Chats, or More to get started — or Quick Actions in the sidebar for Students, Users, and Enter Scores.
            </Text>
          </Card>
          <BackupCard />
        </PageContainer>
      </ScrollView>
    </View>
  );
}
