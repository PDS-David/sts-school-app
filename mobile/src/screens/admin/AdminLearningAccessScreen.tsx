import React, { useCallback, useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import api from '../../api/client';
import { AppHeader } from '../../components/AppHeader';
import { Btn, Card, Loader, SectionHeader } from '../../components/UI';
import { openNotifications } from '../../navigation/navigationRef';
import { Colors, Fonts, Spacing } from '../../theme';

type Settings = {
  free_launch_mode: boolean;
  term_pin_enforced: boolean;
  curriculum_sequence_enforced: boolean;
  updated_at?: string;
};

type EffectivePolicy = {
  freeLaunchMode: boolean;
  termPinEnforced: boolean;
  curriculumSequenceEnforced: boolean;
  environmentOverrides: {
    freeLaunchMode: boolean;
    termPinEnforced: boolean;
    curriculumSequenceEnforced: boolean;
  };
  source: 'database' | 'environment-default';
};

const DEFAULT_SETTINGS: Settings = {
  free_launch_mode: true,
  term_pin_enforced: false,
  curriculum_sequence_enforced: false,
};

export default function AdminLearningAccessScreen() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [effective, setEffective] = useState<EffectivePolicy | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/admin/learning-access-settings');
      setSettings(data.settings);
      setEffective(data.effective);
    } catch (e: any) {
      setError(e?.response?.data?.error ?? 'Could not load learning access settings.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const save = async () => {
    setSaving(true);
    setError('');
    try {
      const { data } = await api.put('/admin/learning-access-settings', {
        free_launch_mode: settings.free_launch_mode,
        term_pin_enforced: settings.term_pin_enforced,
        curriculum_sequence_enforced: settings.curriculum_sequence_enforced,
      });
      setSettings(data.settings);
      setEffective(data.effective);
      Alert.alert('Settings saved', 'The online-learning access policy has been updated.');
    } catch (e: any) {
      setError(e?.response?.data?.error ?? 'Could not save learning access settings.');
    } finally {
      setSaving(false);
    }
  };

  const overridesActive = !!effective && Object.values(effective.environmentOverrides).some(Boolean);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <AppHeader title="Learning Access" onPressBell={() => openNotifications()} />
      {loading ? <Loader /> : (
        <ScrollView contentContainerStyle={{ padding: Spacing.md, gap: Spacing.md }}>
          <SectionHeader title="Online-learning access policy" />
          <Card>
            <View style={styles.settingRow}>
              <View style={styles.copy}>
                <Text style={styles.title}>Free launch mode</Text>
                <Text style={styles.description}>
                  Keep student learning free. While enabled, student account-expiry and pending-review gates are bypassed, and term PIN and topic-sequence restrictions do not apply.
                </Text>
              </View>
              <Switch
                value={settings.free_launch_mode}
                onValueChange={value => setSettings(current => ({ ...current, free_launch_mode: value }))}
                trackColor={{ true: Colors.primary }}
              />
            </View>
            <View style={styles.separator} />
            <View style={styles.settingRow}>
              <View style={styles.copy}>
                <Text style={styles.title}>Require term PINs</Text>
                <Text style={styles.description}>
                  Students must redeem the matching term PIN before opening that term's lessons. This setting is prepared but inactive during free launch.
                </Text>
              </View>
              <Switch
                value={settings.term_pin_enforced}
                onValueChange={value => setSettings(current => ({ ...current, term_pin_enforced: value }))}
                trackColor={{ true: Colors.primary }}
              />
            </View>
            <View style={styles.separator} />
            <View style={styles.settingRow}>
              <View style={styles.copy}>
                <Text style={styles.title}>Enforce topic sequence</Text>
                <Text style={styles.description}>
                  Require students to complete and pass the preceding topic before opening the next ordered topic. This setting is inactive during free launch.
                </Text>
              </View>
              <Switch
                value={settings.curriculum_sequence_enforced}
                onValueChange={value => setSettings(current => ({ ...current, curriculum_sequence_enforced: value }))}
                trackColor={{ true: Colors.primary }}
              />
            </View>
          </Card>

          <Card>
            <Text style={styles.title}>Current effective behaviour</Text>
            <Text style={styles.description}>
              {effective?.freeLaunchMode
                ? 'Students are currently in free-launch mode. Term PIN and topic-sequence restrictions are off.'
                : 'Free launch is off. Student expiry/review rules apply, with the selected term PIN and topic-sequence settings.'}
            </Text>
            {overridesActive ? (
              <Text style={styles.warning}>
                One or more deployment environment variables override the saved settings. Remove those overrides from the server environment for these saved values to take effect.
              </Text>
            ) : null}
            {settings.updated_at ? (
              <Text style={styles.updated}>Last updated: {new Date(settings.updated_at).toLocaleString()}</Text>
            ) : null}
          </Card>

          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Btn label="Save access settings" onPress={save} loading={saving} disabled={saving} />
          <Btn label="Refresh" onPress={load} variant="outline" disabled={saving} />
          <Text style={styles.footer}>
            These controls apply globally and are available only to a global administrator. They do not change teacher reporting or finance permissions.
          </Text>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  settingRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, paddingVertical: Spacing.sm },
  copy: { flex: 1 },
  title: { color: Colors.text, fontSize: Fonts.sizes.md, fontWeight: '700' },
  description: { color: Colors.textSub, fontSize: Fonts.sizes.sm, marginTop: 4, lineHeight: 20 },
  separator: { height: StyleSheet.hairlineWidth, backgroundColor: Colors.border, marginVertical: Spacing.xs },
  warning: { color: Colors.error, fontSize: Fonts.sizes.sm, marginTop: Spacing.sm, lineHeight: 20 },
  updated: { color: Colors.textSub, fontSize: Fonts.sizes.xs, marginTop: Spacing.sm },
  error: { color: Colors.error, fontSize: Fonts.sizes.sm },
  footer: { color: Colors.textSub, fontSize: Fonts.sizes.xs, lineHeight: 18, textAlign: 'center', marginBottom: Spacing.lg },
});
