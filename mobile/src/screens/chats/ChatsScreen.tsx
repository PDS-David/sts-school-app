import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import api from '../../api/client';
import { Loader } from '../../components/UI';
import { Colors, Spacing, Fonts } from '../../theme';
import { AppHeader } from '../../components/AppHeader';
import { ChatListItem } from '../../components/ChatListItem';
import { FAB } from '../../components/FAB';
import { openNotifications } from '../../navigation/navigationRef';

interface Contact {
  id: string; username: string; full_name: string; role: string;
  unread_count?: number; last_message_at?: string | null;
}

type ChatTab = 'all' | 'direct';

function formatTimeLabel(iso?: string | null): string | undefined {
  if (!iso) return undefined;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return undefined;
  const now = new Date();
  if (d.toDateString() === now.toDateString()) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const yesterday = new Date(now); yesterday.setDate(now.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

// The contacts endpoint returns only recipients the signed-in role is allowed
// to message. Reuse that server-enforced list for both existing chats and the
// new-message picker; never build a client-side recipient directory.
export default function ChatsScreen({ navigation }: any) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [tab, setTab] = useState<ChatTab>('all');
  const [startingNewMessage, setStartingNewMessage] = useState(false);
  const [search, setSearch] = useState('');

  const loadContacts = useCallback(async () => {
    setLoadError('');
    try {
      const { data } = await api.get('/messages/contacts');
      const sorted = [...(data.contacts ?? [])].sort((a: Contact, b: Contact) => {
        const at = a.last_message_at ? new Date(a.last_message_at).getTime() : 0;
        const bt = b.last_message_at ? new Date(b.last_message_at).getTime() : 0;
        return bt - at;
      });
      setContacts(sorted);
    } catch {
      setLoadError('Could not load contacts. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadContacts();
    const unsub = navigation.addListener?.('focus', loadContacts);
    return unsub;
  }, [navigation, loadContacts]);

  const filteredContacts = useMemo(() => {
    const term = search.trim().toLocaleLowerCase();
    if (!term) return contacts;
    return contacts.filter(c =>
      c.full_name.toLocaleLowerCase().includes(term) ||
      c.username.toLocaleLowerCase().includes(term) ||
      c.role.toLocaleLowerCase().includes(term)
    );
  }, [contacts, search]);

  const openThread = (contact: Contact) => {
    setStartingNewMessage(false);
    setSearch('');
    navigation.navigate('ChatThread', { contact });
  };

  const tabs: { key: ChatTab; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'direct', label: 'Direct Messages' },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <AppHeader title={startingNewMessage ? 'New message' : 'Chats'} onPressBell={() => openNotifications()} />

      {startingNewMessage ? (
        <View style={styles.composer}>
          <View style={styles.composerHeader}>
            <Text style={styles.sectionTitle}>Choose someone to message</Text>
            <TouchableOpacity
              onPress={() => { setStartingNewMessage(false); setSearch(''); }}
              accessibilityRole="button"
              accessibilityLabel="Cancel new message"
              style={styles.cancelButton}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search name or role"
            placeholderTextColor={Colors.textSub}
            style={styles.searchInput}
            accessibilityLabel="Search message recipients"
            returnKeyType="search"
            autoCapitalize="none"
          />
          {loading ? <Loader /> : loadError ? (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>{loadError}</Text>
              <TouchableOpacity onPress={loadContacts} style={styles.retryButton} accessibilityRole="button">
                <Text style={styles.retryText}>Try again</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              data={filteredContacts}
              keyExtractor={c => c.id}
              keyboardShouldPersistTaps="handled"
              ListEmptyComponent={
                <View style={styles.empty}>
                  <Text style={styles.emptyText}>
                    {contacts.length === 0 ? 'No message recipients are available for your account.' : 'No people match your search.'}
                  </Text>
                </View>
              }
              renderItem={({ item: c }) => (
                <ChatListItem
                  name={c.full_name}
                  subtitle={c.role.charAt(0).toUpperCase() + c.role.slice(1)}
                  onPress={() => openThread(c)}
                />
              )}
            />
          )}
        </View>
      ) : (
        <>
          <View style={styles.tabRow}>
            {tabs.map(t => (
              <TouchableOpacity
                key={t.key}
                style={[styles.tabBtn, tab === t.key && styles.tabBtnActive]}
                onPress={() => setTab(t.key)}
                accessibilityRole="tab"
                accessibilityState={{ selected: tab === t.key }}
              >
                <Text style={[styles.tabLabel, tab === t.key && styles.tabLabelActive]} numberOfLines={1}>{t.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {loading ? <Loader /> : loadError ? (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>{loadError}</Text>
              <TouchableOpacity onPress={loadContacts} style={styles.retryButton} accessibilityRole="button">
                <Text style={styles.retryText}>Try again</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              data={contacts}
              keyExtractor={c => c.id}
              ListEmptyComponent={
                <View style={styles.empty}>
                  <Text style={styles.emptyText}>No conversations yet. Use New message to start one.</Text>
                </View>
              }
              renderItem={({ item: c }) => (
                <ChatListItem
                  name={c.full_name}
                  subtitle={c.role.charAt(0).toUpperCase() + c.role.slice(1)}
                  unread={c.unread_count}
                  timeLabel={formatTimeLabel(c.last_message_at)}
                  onPress={() => openThread(c)}
                />
              )}
            />
          )}
          <FAB
            icon="chatbubble-ellipses"
            actions={[{ icon: 'create-outline', label: 'New message', onPress: () => { setSearch(''); setStartingNewMessage(true); } }]}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  tabRow: { flexDirection: 'row', backgroundColor: Colors.card, borderBottomWidth: 1, borderBottomColor: Colors.border },
  tabBtn: { flex: 1, paddingVertical: Spacing.sm, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabBtnActive: { borderBottomColor: Colors.primary },
  tabLabel: { fontSize: Fonts.sizes.xs, fontWeight: '600', color: Colors.textSub },
  tabLabelActive: { color: Colors.primary },
  composer: { flex: 1 },
  composerHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.md, paddingTop: Spacing.md },
  sectionTitle: { fontSize: Fonts.sizes.md, fontWeight: '700', color: Colors.text },
  cancelButton: { paddingVertical: Spacing.xs, paddingHorizontal: Spacing.sm },
  cancelText: { color: Colors.primary, fontSize: Fonts.sizes.sm, fontWeight: '700' },
  searchInput: { margin: Spacing.md, marginBottom: Spacing.sm, padding: Spacing.sm, borderWidth: 1, borderColor: Colors.border, borderRadius: 8, backgroundColor: Colors.card, color: Colors.text, fontSize: Fonts.sizes.md },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.xl },
  emptyText: { color: Colors.textSub, fontSize: Fonts.sizes.md, textAlign: 'center' },
  retryButton: { marginTop: Spacing.md, paddingVertical: Spacing.sm, paddingHorizontal: Spacing.lg, borderRadius: 8, backgroundColor: Colors.primary },
  retryText: { color: Colors.white, fontWeight: '700' },
});
