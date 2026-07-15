import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Spacing, Fonts, Radius } from '../theme';
import { useAdminSchool } from '../api/AdminSchoolContext';

// Dropped at the top of every admin screen that lists/creates school-scoped
// data (Terms, Subjects, Students, Classes, Finance, Materials, Assessments,
// Score Entry, Attendance, Class Summary, Export Excel). Admin accounts
// aren't tied to one school, so without this every one of those screens was
// silently asking the backend for "school_code = NULL" and getting nothing
// back — this is the one place that state lives, shared via AdminSchoolContext.
export function SchoolSwitcherBar() {
  const { schools, selectedSchoolCode, selectSchool, loading } = useAdminSchool();

  if (loading || schools.length === 0) return null;

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>Viewing school:</Text>
      <View style={styles.row}>
        {schools.map(s => {
          const active = s.code === selectedSchoolCode;
          return (
            <TouchableOpacity
              key={s.code}
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => selectSchool(s.code)}
              activeOpacity={0.8}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]} numberOfLines={1}>
                {s.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: Spacing.md, paddingTop: Spacing.sm, paddingBottom: Spacing.xs, backgroundColor: Colors.card, borderBottomWidth: 1, borderBottomColor: Colors.border },
  label: { fontSize: Fonts.sizes.xs, fontWeight: '700', color: Colors.textSub, marginBottom: 6 },
  row: { flexDirection: 'row', gap: Spacing.sm, flexWrap: 'wrap' },
  chip: { paddingVertical: 6, paddingHorizontal: Spacing.md, borderRadius: Radius.lg, backgroundColor: Colors.background, borderWidth: 1.5, borderColor: Colors.border },
  chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText: { fontSize: Fonts.sizes.sm, fontWeight: '700', color: Colors.text },
  chipTextActive: { color: Colors.white },
});
