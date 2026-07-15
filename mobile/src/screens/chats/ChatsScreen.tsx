import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import api from '../../api/client';
import { Loader } from '../../components/UI';
import { Colors, Spacing, Fonts, Radius } from '../../theme';
import { AppHeader } from '../../components/AppHeader';
import { ChatListItem } from '../../components/ChatListItem';
import { FAB } from '../../components/FAB';
import { openNotifications } from '../../navigation/navigationRef';

interface Contact {
  id: string; username: string; full_name: string; role: string;
  unread_count?: number; last_message_at?: string | null;
}

type ChatTab = 'all' | 'direct' | 'groups' | 'archived';

function formatTimeLabel(iso?: string | null): string | undefined {
  if (!iso) return undefined;
  const d = new Date(iso);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  if (sameDay) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const yesterday = new Date(now); yesterday.setDate(now.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

// Deliberately identical for student, teacher, and parent — the docx spec
// calls this out explicitly ("Regardless of role, Chats should always feel
// like WhatsApp"), so this screen takes no role-specific props at all.
export default function ChatsScreen({ navigation }: any) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<ChatTab>('all');

  const loadContacts = () => {
    api.get('/messages/contacts')
      .then(({ data }) => {
        // Found live in QA Pass 7: `unread_count`/`last_message_at` are now
        // returned per contact, but the list itself doesn't come pre-sorted
        // by them — most-recently-active conversations first matches the
        // WhatsApp-style behaviour the rest of this screen is going for.
        const sorted = [...(data.contacts ?? [])].sort((a: Contact, b: Contact) => {
          const at = a.last_message_at ? new Date(a.last_message_at).getTime() : 0;
          const bt = b.last_message_at ? new Date(b.last_message_at).getTime() : 0;
          return bt - at;
        });
        setContacts(sorted);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadContacts();
    // Refresh unread counts whenever this list regains focus (e.g. coming
    // back from a thread that was just read, or a new message having landed).
    const unsub = navigation.addListener?.('focus', loadContacts);
    return unsub;
  }, [navigation]);

  const openThread = (contact: Contact) => navigation.navigate('ChatThread', { contact });

  const tabs: { key: ChatTab; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'direct', label: 'Direct Messages' },
    { key: 'groups', label: 'Groups' },
    { key: 'archived', label: 'Archived' },
  ];

  const showList = tab === 'all' || tab === 'direct';

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <AppHeader title="Chats" onPressBell={() => openNotifications()} />

      <View style={styles.tabRow}>
        {tabs.map(t => (
          <TouchableOpacity key={t.key} style={[styles.tabBtn, tab === t.key && styles.tabBtnActive]} onPress={() => setTab(t.key)}>
            <Text style={[styles.tabLabel, tab === t.key && styles.tabLabelActive]} numberOfLines={1}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? <Loader /> : showList ? (
        <FlatList
          data={contacts}
          keyExtractor={c => c.id}
          ListEmptyComponent={
            <View style={styles.empty}><Text style={styles.emptyText}>No conversations yet</Text></View>
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
      ) : (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>
            {tab === 'groups' ? 'Group chats aren\u2019t available yet.' : 'Archived chats aren\u2019t available yet.'}
          </Text>
        </View>
      )}

      <FAB
        icon="chatbubble-ellipses"
        actions={[{ icon: 'create-outline', label: 'New message', onPress: () => setTab('direct') }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  tabRow: { flexDirection: 'row', backgroundColor: Colors.card, borderBottomWidth: 1, borderBottomColor: Colors.border },
  tabBtn: { flex: 1, paddingVertical: Spacing.sm, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabBtnActive: { borderBottomColor: Colors.primary },
  tabLabel: { fontSize: Fonts.sizes.xs, fontWeight: '600', color: Colors.textSub },
  tabLabelActive: { color: Colors.primary },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.xl },
  emptyText: { color: Colors.textSub, fontSize: Fonts.sizes.md, textAlign: 'center' },
});
