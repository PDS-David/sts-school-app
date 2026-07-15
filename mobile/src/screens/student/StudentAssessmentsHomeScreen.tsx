import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../../components/UI';
import { Colors, Spacing, Fonts, Radius } from '../../theme';
import { AppHeader } from '../../components/AppHeader';
import { openNotifications, openBraineeChat } from '../../navigation/navigationRef';

const ITEMS: { icon: keyof typeof Ionicons.glyphMap; label: string; sub: string; color: string; nav: { screen: string; params?: any } | null; onPress?: () => void }[] = [
  { icon: 'create-outline',   label: 'Assignments', sub: 'Practice work set for your class',  color: '#1565C0', nav: { screen: 'Assessments' } },
  { icon: 'help-circle-outline', label: 'Quizzes',  sub: 'Short, timed checks',                  color: '#00838F', nav: { screen: 'Assessments' } },
  { icon: 'school-outline',  label: 'Exams',        sub: 'Formal term exams',                    color: '#6A1B9A', nav: { screen: 'Assessments' } },
  { icon: 'bar-chart-outline', label: 'Results',    sub: 'Your scores and grades',                color: '#2E7D32', nav: { screen: 'MyResults' } },
  { icon: 'sparkles-outline', label: 'Ask Brainee', sub: 'Explanations, study notes, and hints',  color: '#E65100', nav: null, onPress: () => openBraineeChat() },
];

export default function StudentAssessmentsHomeScreen({ navigation }: any) {
  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <AppHeader title="Assessments" onPressBell={() => openNotifications()} />
      <ScrollView contentContainerStyle={{ padding: Spacing.md }}>
        {ITEMS.map((it) => (
          <TouchableOpacity
            key={it.label}
            disabled={!it.nav && !it.onPress}
            onPress={() => (it.onPress ? it.onPress() : it.nav && navigation.navigate(it.nav.screen, it.nav.params))}
            activeOpacity={0.8}
          >
            <Card style={styles.row}>
              <View style={[styles.iconWrap, { backgroundColor: it.color + '20' }]}>
                <Ionicons name={it.icon} size={22} color={it.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>{it.label}</Text>
                <Text style={styles.sub}>{it.sub}</Text>
              </View>
              {(it.nav || it.onPress) && <Ionicons name="chevron-forward" size={18} color={Colors.textSub} />}
            </Card>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  iconWrap: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: Fonts.sizes.md, fontWeight: '700', color: Colors.text },
  sub: { fontSize: Fonts.sizes.xs, color: Colors.textSub, marginTop: 2 },
});
