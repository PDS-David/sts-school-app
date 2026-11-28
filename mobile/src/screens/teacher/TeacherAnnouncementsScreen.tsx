import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import api from '../../api/client';
import { AppHeader } from '../../components/AppHeader';
import { Btn, Card, Empty, Loader } from '../../components/UI';
import { Colors, Fonts, Spacing } from '../../theme';

interface Announcement { id: string; title: string; body: string; class_name: string | null; audience_role: string | null; created_at: string }

// Every announcement relevant to this teacher: school-wide notices for everyone
// or teachers, plus notices aimed at any of their classes (whatever the
// audience). Tap a notice to read it in full; older ones load page by page.
export default function TeacherAnnouncementsScreen() {
  const [items, setItems] = useState<Announcement[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);

  const load = useCallback(async (before?: string | null) => {
    try {
      const { data } = await api.get('/announcements', { params: { limit: 20, ...(before ? { before } : {}) } });
      setItems(prev => before ? [...prev, ...(data.announcements ?? [])] : (data.announcements ?? []));
      setCursor(data.next_cursor ?? null);
      setError(false);
    } catch { setError(true); }
    setLoading(false);
    setLoadingMore(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) return <Loader />;
  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <AppHeader title="Announcements" />
      <FlatList
        data={items}
        keyExtractor={a => String(a.id)}
        contentContainerStyle={{ padding: Spacing.md, flexGrow: 1 }}
        refreshControl={<RefreshControl refreshing={false} onRefresh={() => load()} />}
        ListEmptyComponent={error ? <Empty message="Announcements could not be loaded. Pull down to retry." /> : <Empty message="No announcements yet" />}
        ListFooterComponent={cursor ? (
          <Btn label={loadingMore ? 'Loading…' : 'Load older announcements'} variant="outline" disabled={loadingMore}
            onPress={() => { setLoadingMore(true); load(cursor); }} />
        ) : null}
        renderItem={({ item: a }) => {
          const open = openId === String(a.id);
          return (
            <TouchableOpacity activeOpacity={0.8} onPress={() => setOpenId(open ? null : String(a.id))}
              accessibilityRole="button" accessibilityLabel={`${open ? 'Collapse' : 'Read full'} announcement ${a.title}`}>
              <Card style={{ marginBottom: Spacing.sm }}>
                <Text style={styles.title}>{a.title}</Text>
                <Text style={styles.meta}>
                  {new Date(a.created_at).toLocaleDateString()}
                  {a.class_name ? ` · ${a.class_name}` : ' · School-wide'}
                  {a.audience_role ? ` · for ${a.audience_role}s` : ''}
                </Text>
                <Text style={styles.body} numberOfLines={open ? undefined : 3}>{a.body}</Text>
              </Card>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: Fonts.sizes.md, fontWeight: '700', color: Colors.text },
  meta: { fontSize: Fonts.sizes.xs, color: Colors.textSub, marginTop: 2 },
  body: { fontSize: Fonts.sizes.sm, color: Colors.text, marginTop: Spacing.xs },
});
