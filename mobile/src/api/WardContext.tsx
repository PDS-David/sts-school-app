import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './client';
import { useAuth } from './AuthContext';

export interface Ward {
  id: string;
  admission_number: string | null;
  full_name: string;
  class_name: string;
  school_code: string;
}

interface WardState {
  wards: Ward[];
  selectedWardId: string | null;
  selectedWard: Ward | null;
  loading: boolean;
  selectWard: (id: string) => void;
  refreshWards: () => Promise<void>;
}

const WardContext = createContext<WardState>({} as WardState);
export const useWards = () => useContext(WardContext);

const SELECTED_KEY = 'selected_ward_id';

// Only ever populated for parent accounts. Each parent's list comes from
// GET /students/wards, which the backend scopes strictly to that parent's own
// linked children (via parent_wards) — so switching between them here never
// risks showing one family's child to another parent, and no child's data is
// ever blended with a sibling's: every screen reads exactly one selectedWardId
// at a time.
export function WardProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [wards, setWards]                 = useState<Ward[]>([]);
  const [selectedWardId, setSelectedId]   = useState<string | null>(null);
  const [loading, setLoading]             = useState(false);

  const refreshWards = useCallback(async () => {
    if (user?.role !== 'parent') { setWards([]); setSelectedId(null); return; }
    setLoading(true);
    try {
      const { data } = await api.get('/students/wards');
      const list: Ward[] = data.wards ?? [];
      setWards(list);

      const savedId = await AsyncStorage.getItem(SELECTED_KEY);
      const stillValid = list.find(w => w.id === savedId);
      const next = stillValid ? stillValid.id : (list[0]?.id ?? null);
      setSelectedId(next);
      if (next) await AsyncStorage.setItem(SELECTED_KEY, next);
    } catch {
      // offline or request failed — keep whatever we last had
    } finally {
      setLoading(false);
    }
  }, [user?.role]);

  useEffect(() => { refreshWards(); }, [refreshWards]);

  const selectWard = (id: string) => {
    setSelectedId(id);
    AsyncStorage.setItem(SELECTED_KEY, id).catch(() => {});
  };

  const selectedWard = wards.find(w => w.id === selectedWardId) ?? null;

  return (
    <WardContext.Provider value={{ wards, selectedWardId, selectedWard, loading, selectWard, refreshWards }}>
      {children}
    </WardContext.Provider>
  );
}
