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
//
// `compact`: renders just the chip row with no "Viewing school:" label and
// tighter spacing, sized to sit inline in a header (either a custom
// AppHeader's `rightExtra`, or a native stack header's `headerRight`) rather
// than as its own full-width block in the screen's content area — the
// latter was flagged live-testing the Admin dashboard as center-content
// space that should be for viewing/doing something, not identity/nav
// chrome; the same principle applies to every other admin screen using
// this component, not just the dashboard.
export function SchoolSwitcherBar({ compact = false }: { compact?: boolean }) {
  const { schools, selectedSchoolCode, selectSchool, loading } = useAdminSchool();

  if (loading || schools.length === 0) return null;

  if (compact) {
    return (
      <View style={styles.compactRow}>
        {schools.map(s => {
          const active = s.code === selectedSchoolCode;
          return (
            <TouchableOpacity
              key={s.code}
              style={[styles.compactChip, active && styles.chipActive]}
              onPress={() => selectSchool(s.code)}
              activeOpacity={0.8}
            >
              <Text style={[styles.compactChipText, active && styles.chipTextActive]} numberOfLines={1}>
                {s.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }

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
  compactRow: { flexDirection: 'row', gap: 6 },
  compactChip: { paddingVertical: 4, paddingHorizontal: Spacing.sm, borderRadius: Radius.lg, backgroundColor: 'rgba(255,255,255,0.15)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)' },
  compactChipText: { fontSize: Fonts.sizes.xs, fontWeight: '700', color: Colors.white },
});
