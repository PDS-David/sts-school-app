import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { Card, Btn, SectionHeader } from '../components/UI';
import { Colors, Spacing, Fonts, Radius } from '../theme';
import { BASE_URL } from '../api/client';
import { getSecureItem } from '../api/secureTokenStorage';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';

export default function ExportExcelScreen() {
  const [school, setSchool] = useState('primary');
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      const token = await getSecureItem('access_token');
      if (!token) {
        Alert.alert('Not logged in', 'Please log in again and retry.');
        return;
      }
      const url = `${BASE_URL}/admin/export/excel?school_code=${school}`;
      const fileUri = `${FileSystem.cacheDirectory}school-report-${school}-${Date.now()}.xlsx`;

      // Downloaded (not opened directly in a browser) because the export
      // endpoint requires an Authorization header — a plain browser
      // navigation can't attach one, so that always 401'd before.
      const result = await FileSystem.downloadAsync(url, fileUri, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (result.status !== 200) {
        Alert.alert('Export failed', `Server returned status ${result.status}.`);
        return;
      }

      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(result.uri, {
          mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          dialogTitle: 'School Report',
        });
      } else {
        Alert.alert('Downloaded', `Saved to: ${result.uri}`);
      }
    } catch (e) {
      Alert.alert('Error', 'Export failed. Please check your connection and try again.');
    } finally { setLoading(false); }
  };

  return (
    <View style={styles.container}>
      <Card>
        <SectionHeader title="Export School Data" />
        <Text style={styles.desc}>
          Download a full Excel report containing: Students, Subjects, Terms, and Current Term Scores.
        </Text>
        <Text style={styles.label}>School</Text>
        <View style={styles.pickerWrap}>
          <Picker selectedValue={school} onValueChange={setSchool}>
            <Picker.Item label="Nursery & Primary School" value="primary" />
            <Picker.Item label="Model College (Secondary)" value="secondary" />
          </Picker>
        </View>
        <Btn
          label="Download Excel Report"
          onPress={handleExport}
          loading={loading}
          style={{ marginTop: Spacing.md }}
        />
        <View style={styles.note}>
          <Ionicons name="information-circle" size={18} color={Colors.primary} />
          <Text style={styles.noteText}>The file will download, then you can share or save it from the menu that opens.</Text>
        </View>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: Spacing.md },
  desc:      { fontSize: Fonts.sizes.sm, color: Colors.textSub, marginBottom: Spacing.md, lineHeight: 20 },
  label:     { fontSize: Fonts.sizes.xs, fontWeight: '700', color: Colors.textSub, marginBottom: 4 },
  pickerWrap:{ borderWidth: 1.5, borderColor: Colors.border, borderRadius: Radius.sm, backgroundColor: Colors.white },
  note:      { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginTop: Spacing.md, backgroundColor: Colors.primary + '12', borderRadius: Radius.sm, padding: Spacing.sm },
  noteText:  { fontSize: Fonts.sizes.xs, color: Colors.primary, flex: 1 },
});
