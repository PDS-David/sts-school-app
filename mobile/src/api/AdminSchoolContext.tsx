import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './client';
import { useAuth } from './AuthContext';

export interface School {
  id: number;
  code: string;
  name: string;
}

interface AdminSchoolState {
  schools: School[];
  selectedSchoolCode: string | null;
  selectedSchool: School | null;
  loading: boolean;
  selectSchool: (code: string) => void;
  refreshSchools: () => Promise<void>;
}

const AdminSchoolContext = createContext<AdminSchoolState>({} as AdminSchoolState);
export const useAdminSchool = () => useContext(AdminSchoolContext);

const SELECTED_KEY = 'admin_selected_school_code';

// Admin and finance_admin accounts are not tied to a single school
// (users.school_code is NULL for both — a deliberate design choice since one
// account manages both `primary` and `secondary`). Every backend route that
// lists/creates school-scoped data (terms, subjects, classes, students,
// finance, etc.) falls back to the logged-in user's own school_code when no
// explicit school_code is passed — which is correct for teacher/student/
// parent, but for these two roles that fallback is NULL, so without this
// context every such screen was silently querying "school_code = NULL" and
// getting zero rows back (the empty "Terms" screen bug). This context is the
// one place that tracks which of the two schools the account is currently
// looking at, so every screen can pass `school_code: selectedSchoolCode`
// explicitly instead of relying on that fallback.
export function AdminSchoolProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [schools, setSchools] = useState<School[]>([]);
  const [selectedSchoolCode, setSelectedCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const refreshSchools = useCallback(async () => {
    if (user?.role !== 'admin' && user?.role !== 'finance_admin') { setSchools([]); setSelectedCode(null); return; }
    setLoading(true);
    try {
      const { data } = await api.get('/academic/schools');
      const list: School[] = data.schools ?? [];
      setSchools(list);

      const saved = await AsyncStorage.getItem(SELECTED_KEY);
      const stillValid = list.find(s => s.code === saved);
      const next = stillValid ? stillValid.code : (list[0]?.code ?? null);
      setSelectedCode(next);
      if (next) await AsyncStorage.setItem(SELECTED_KEY, next);
    } catch {
      // offline or request failed — keep whatever we last had
    } finally {
      setLoading(false);
    }
  }, [user?.role]);

  useEffect(() => { refreshSchools(); }, [refreshSchools]);

  const selectSchool = (code: string) => {
    setSelectedCode(code);
    AsyncStorage.setItem(SELECTED_KEY, code).catch(() => {});
  };

  const selectedSchool = schools.find(s => s.code === selectedSchoolCode) ?? null;

  return (
    <AdminSchoolContext.Provider value={{ schools, selectedSchoolCode, selectedSchool, loading, selectSchool, refreshSchools }}>
      {children}
    </AdminSchoolContext.Provider>
  );
}
