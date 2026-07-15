import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  RefreshControl, TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../api/client';
import { Loader, Empty, Badge } from '../components/UI';
import { Colors, Spacing, Fonts, Radius } from '../theme';
import { useAdminSchool } from '../api/AdminSchoolContext';
import { SchoolSwitcherBar } from '../components/SchoolSwitcherBar';

interface Student {
  id: string; full_name: string; class_name: string;
  admission_number: string; gender: string;
}

export default function StudentsScreen({ navigation }: any) {
  const { selectedSchoolCode } = useAdminSchool();
  const [students,  setStudents]  = useState<Student[]>([]);
  const [filtered,  setFiltered]  = useState<Student[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [refreshing,setRefreshing]= useState(false);
  const [search,    setSearch]    = useState('');

  const fetch = async () => {
    try {
      // Admin has no school of their own — pass whichever one is selected in
      // the switcher, so this always shows exactly one school's students
      // rather than every student across both schools blended together.
      const { data } = await api.get('/students', { params: { school_code: selectedSchoolCode ?? undefined } });
      setStudents(data.students);
      setFiltered(data.students);
    } catch { } finally { setLoading(false); setRefreshing(false); }
  };

  useEffect(() => { fetch(); }, [selectedSchoolCode]);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(students.filter(s =>
      s.full_name.toLowerCase().includes(q) ||
      (s.admission_number ?? '').toLowerCase().includes(q) ||
      s.class_name.toLowerCase().includes(q)
    ));
  }, [search, students]);

  if (loading) return <Loader />;

  return (
    <View style={styles.container}>
      <SchoolSwitcherBar />
      <View style={styles.searchBar}>
        <Ionicons name="search" size={18} color={Colors.textSub} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search name, class, admission…"
          value={search}
          onChangeText={setSearch}
          placeholderTextColor={Colors.textSub}
        />
      </View>
      <FlatList
        data={filtered}
        keyExtractor={s => s.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetch(); }} />}
        ListEmptyComponent={<Empty message="No students found" />}
        renderItem={({ item: s }) => (
          <TouchableOpacity
            style={styles.row}
            onPress={() => navigation.navigate('StudentDetail', { studentId: s.id })}
            activeOpacity={0.7}
          >
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{s.full_name[0]}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{s.full_name}</Text>
              <Text style={styles.meta}>{s.class_name}  ·  {s.admission_number ?? '—'}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.textSub} />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container:   { flex: 1, backgroundColor: Colors.background },
  searchBar:   { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.card, margin: Spacing.sm, borderRadius: Radius.md, paddingHorizontal: Spacing.md, gap: Spacing.sm, borderWidth: 1, borderColor: Colors.border },
  searchInput: { flex: 1, paddingVertical: 10, fontSize: Fonts.sizes.md, color: Colors.text },
  row:         { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.card, marginHorizontal: Spacing.sm, marginBottom: 6, borderRadius: Radius.md, padding: Spacing.md, gap: Spacing.md, elevation: 1 },
  avatar:      { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  avatarText:  { color: Colors.white, fontWeight: '800', fontSize: Fonts.sizes.lg },
  name:        { fontSize: Fonts.sizes.md, fontWeight: '700', color: Colors.text },
  meta:        { fontSize: Fonts.sizes.sm, color: Colors.textSub, marginTop: 2 },
});
