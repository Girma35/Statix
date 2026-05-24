import { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, Pressable, TextInput, Alert, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/stores/useAuthStore';
import { useHeadlistStore } from '@/stores/useHeadlistStore';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function HeadlistsScreen() {
  const [newName, setNewName] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const { user } = useAuthStore();
  const { headlists, loading, error, fetchHeadlists, createHeadlist, deleteHeadlist, clearError } = useHeadlistStore();
  const theme = useTheme();

  useEffect(() => {
    if (user) fetchHeadlists(user.uid);
  }, [user]);

  const handleCreate = async () => {
    if (!newName.trim()) return;
    if (!user) return;
    try {
      const id = await createHeadlist(user.uid, newName.trim());
      setNewName('');
      setShowCreate(false);
      router.push(`/(tabs)/headlist/${id}`);
    } catch {}
  };

  const handleDelete = (headlistId: string, name: string) => {
    Alert.alert('Delete Headlist', `Delete "${name}" and all its words?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          if (user) await deleteHeadlist(user.uid, headlistId);
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <ThemedView style={styles.header}>
          <ThemedText type="title">Headlists</ThemedText>
          <Pressable
            style={styles.addButton}
            onPress={() => setShowCreate(!showCreate)}
          >
            <ThemedText style={{ color: '#FFFFFF', fontSize: 20 }}>+</ThemedText>
          </Pressable>
        </ThemedView>

        {error && (
          <ThemedView style={styles.errorBox}>
            <ThemedText style={styles.errorText}>{error}</ThemedText>
            <Pressable onPress={clearError}>
              <ThemedText type="link">Dismiss</ThemedText>
            </Pressable>
          </ThemedView>
        )}

        {showCreate && (
          <ThemedView type="backgroundElement" style={styles.createBox}>
            <TextInput
              style={[styles.input, { backgroundColor: theme.background, color: theme.text, borderColor: theme.backgroundSelected }]}
              placeholder="Headlist name..."
              placeholderTextColor={theme.textSecondary}
              value={newName}
              onChangeText={setNewName}
              autoFocus
            />
            <View style={styles.createActions}>
              <Pressable style={styles.cancelBtn} onPress={() => { setShowCreate(false); setNewName(''); }}>
                <ThemedText>Cancel</ThemedText>
              </Pressable>
              <Pressable
                style={[styles.createBtn, !newName.trim() && { opacity: 0.5 }]}
                onPress={handleCreate}
                disabled={!newName.trim()}
              >
                <ThemedText style={{ color: '#FFFFFF' }}>Create</ThemedText>
              </Pressable>
            </View>
          </ThemedView>
        )}

        {loading ? (
          <ThemedText themeColor="textSecondary" style={styles.centered}>Loading...</ThemedText>
        ) : headlists.length === 0 ? (
          <ThemedView type="backgroundElement" style={styles.emptyState}>
            <ThemedText themeColor="textSecondary">
              No headlists yet. Tap + to create one!
            </ThemedText>
          </ThemedView>
        ) : (
          headlists.map((h) => {
            const daysLeft = Math.max(0, Math.ceil((h.distillationDate - Date.now()) / (1000 * 60 * 60 * 24)));
            const learned = h.words.filter((w) => w.remembered).length;
            return (
              <Pressable
                key={h.id}
                onPress={() => router.push(`/(tabs)/headlist/${h.id}`)}
                onLongPress={() => handleDelete(h.id, h.name)}
              >
                <ThemedView type="backgroundElement" style={styles.card}>
                  <View style={styles.cardHeader}>
                    <ThemedText style={styles.cardTitle}>{h.name}</ThemedText>
                    <ThemedText type="small" themeColor="textSecondary">{daysLeft}d</ThemedText>
                  </View>
                  <ThemedText type="small" themeColor="textSecondary">
                    {h.words.length}/25 words · {learned} learned
                  </ThemedText>
                </ThemedView>
              </Pressable>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: Spacing.four, gap: Spacing.three, paddingBottom: 100 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  addButton: {
    backgroundColor: '#208AEF',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: Spacing.three,
    backgroundColor: '#FEE2E2',
    borderRadius: Spacing.two,
  },
  errorText: { color: '#DC2626', flex: 1 },
  createBox: {
    padding: Spacing.three,
    borderRadius: Spacing.two,
    gap: Spacing.two,
  },
  input: {
    borderWidth: 1,
    borderRadius: Spacing.two,
    padding: Spacing.three,
    fontSize: 16,
  },
  createActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: Spacing.two,
  },
  cancelBtn: { paddingVertical: Spacing.one, paddingHorizontal: Spacing.three },
  createBtn: {
    backgroundColor: '#208AEF',
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.four,
    borderRadius: Spacing.two,
  },
  card: {
    padding: Spacing.three,
    borderRadius: Spacing.two,
    gap: Spacing.one,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  cardTitle: { fontSize: 16, fontWeight: '600' },
  centered: { textAlign: 'center', padding: Spacing.four },
  emptyState: {
    padding: Spacing.six,
    borderRadius: Spacing.two,
    alignItems: 'center',
  },
});
