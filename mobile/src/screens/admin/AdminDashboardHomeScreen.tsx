import React, { useEffect, useState, useCallback, useRef } from 'react';
import { View, Text, ScrollView, RefreshControl } from 'react-native';
import api from '../../api/client';
import { useAuth } from '../../api/AuthContext';
import { useAdminSchool } from '../../api/AdminSchoolContext';
import { SchoolSwitcherBar } from '../../components/SchoolSwitcherBar';
import { Card, Btn } from '../../components/UI';
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

// Backup controls are deliberately optional and collapsible. They never gate dashboard rendering.
function BackupCard() {
  const [st, setSt] = useState<BackupStatus | null>(null);
  const [statusError, setStatusError] = useState('');
  const [busy, setBusy] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setStatusError('');
    try { setSt((await api.get('/admin/backups/status')).data); }
    catch (e: any) { setStatusError(e?.response?.data?.error ?? 'Could not load backup status. Retry when connected.'); }
  }, []);
  useEffect(() => { void refresh(); }, [refresh]);

  const run = async () => {
    setBusy(true);
    setMsg(null);
    try {
      const r = (await api.post('/admin/backups/run')).data;
      setMsg(r.emailed
        ? 'Backup emailed to the admin recipients.'
        : 'Backup was created but NOT emailed (too large or no recipient set). Ask your developer to run the backup export.');
      // The run endpoint returns attempt metadata, not the complete status object.
      // Refresh instead of treating that response as BackupStatus.
      await refresh();
    } catch (e: any) {
      setMsg(e?.response?.data?.error ?? 'Backup failed. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const summary = !st
    ? (statusError ? 'Backup status unavailable' : 'Checking backup status…')
    : !st.configured
      ? 'Backup setup required'
      : st.overdue
        ? 'Backup overdue'
        : 'Backup up to date';
  const summaryColor = !st || !st.configured || st.overdue ? Colors.warning : Colors.success;

  return (
    <Card style={{ marginTop: Spacing.md }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: Spacing.sm }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: Fonts.sizes.md, fontWeight: '600', color: Colors.text }}>Database backup</Text>
          <Text style={{ color: summaryColor, fontSize: Fonts.sizes.sm, marginTop: 4 }}>{summary}</Text>
        </View>
        <Btn label={expanded ? 'Hide details' : 'View details'} variant="outline" onPress={() => setExpanded(v => !v)} />
      </View>

      {expanded && (
        <View style={{ marginTop: Spacing.sm }}>
          {!st ? (
            <>
              <Text style={{ color: statusError ? Colors.error : Colors.textSub, fontSize: Fonts.sizes.sm }}>
                {statusError || 'Checking backup status. The dashboard remains available while this check runs.'}
              </Text>
              {!!statusError && <Btn label="Retry backup status" variant="outline" onPress={() => { void refresh(); }} style={{ marginTop: Spacing.sm }} />}
            </>
          ) : (
            <>
              <Text style={{ color: summaryColor, fontSize: Fonts.sizes.sm }}>
                {!st.configured
                  ? 'Not set up: the server needs BACKUP_PASSPHRASE.'
                  : st.overdue
                    ? (st.days_since === null ? 'No emailed backup yet - one is due.' : `Overdue: last emailed backup ${st.days_since} days ago.`)
                    : `Up to date: last emailed backup ${st.days_since === 0 ? 'today' : `${st.days_since} day(s) ago`}.`}
              </Text>
              <Text style={{ color: Colors.textSub, fontSize: Fonts.sizes.sm, marginTop: 2 }}>
                Last attempt: {st.last_backup_at ? new Date(st.last_backup_at).toLocaleDateString() : 'never'}{st.last_status ? ` (${st.last_status})` : ''}
              </Text>
              {!!statusError && <Text style={{ color: Colors.error, fontSize: Fonts.sizes.sm, marginTop: 6 }}>{statusError}</Text>}
              {msg ? <Text style={{ color: Colors.textSub, fontSize: Fonts.sizes.sm, marginTop: 6 }}>{msg}</Text> : null}
              {confirming ? (
                <View style={{ marginTop: Spacing.sm, gap: Spacing.sm }}>
                  <Text style={{ color: Colors.text, fontSize: Fonts.sizes.sm }}>Send an encrypted copy of the whole database to the configured admin recipients?</Text>
                  <View style={{ flexDirection: 'row', gap: Spacing.sm }}>
                    <Btn label="Cancel" variant="outline" onPress={() => setConfirming(false)} style={{ flex: 1 }} disabled={busy} />
                    <Btn label="Confirm backup" onPress={() => { setConfirming(false); void run(); }} style={{ flex: 1 }} loading={busy} disabled={busy} />
                  </View>
                </View>
              ) : (
                <Btn label="Back up now" onPress={() => setConfirming(true)} loading={busy} disabled={busy || !st.configured} style={{ marginTop: Spacing.sm }} />
              )}
            </>
          )}
        </View>
      )}
    </Card>
  );
}

export default function AdminDashboardHomeScreen() {
  const { user } = useAuth();
  const { selectedSchoolCode } = useAdminSchool();
  const [term, setTerm] = useState<any>(null);
  const [studentCount, setStudentCount] = useState<number | null>(null);
  const [loadError, setLoadError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const requestGenerationRef = useRef(0);

  const load = useCallback(async () => {
    const generation = ++requestGenerationRef.current;
    const isCurrentRequest = () => generation === requestGenerationRef.current;
    setLoadError('');
    const errors: string[] = [];
    if (!selectedSchoolCode) { setTerm(null); setStudentCount(null); return; }
    const sc = selectedSchoolCode;
    const [studentsResult, termResult] = await Promise.allSettled([
      api.get('/students', { params: { school_code: sc } }),
      api.get('/academic/terms/current', { params: { school_code: sc } }),
    ]);
    if (!isCurrentRequest()) return;
    if (studentsResult.status === 'fulfilled') {
      setStudentCount(studentsResult.value.data.students?.length ?? null);
    } else {
      setStudentCount(null);
      errors.push('student count');
    }
    if (termResult.status === 'fulfilled') {
      setTerm(termResult.value.data.term ?? null);
    } else {
      setTerm(null);
      errors.push('current term');
    }
    if (errors.length) setLoadError(`Could not refresh ${errors.join(' and ')} for the selected school.`);
  }, [selectedSchoolCode]);

  useEffect(() => {
    setTerm(null);
    setStudentCount(null);
    setLoadError('');
    void load();
    return () => { requestGenerationRef.current += 1; };
  }, [load]);

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
          {!selectedSchoolCode && <Card style={{ marginBottom: Spacing.sm }}><Text style={{ color: Colors.text, fontSize: Fonts.sizes.md, fontWeight: '700' }}>Select a school</Text><Text style={{ color: Colors.textSub, fontSize: Fonts.sizes.sm, marginTop: 4 }}>Choose Primary or Secondary above. No school data is loaded until you make a selection. You can switch schools at any time.</Text></Card>}
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
