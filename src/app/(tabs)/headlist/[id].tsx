import { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, Pressable, TextInput, Alert, View, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/stores/useAuthStore';
import { useHeadlistStore } from '@/stores/useHeadlistStore';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { Word } from '@/types';

export default function HeadlistDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuthStore();
  const { headlists, fetchHeadlists, addWord, editWord, deleteWord } = useHeadlistStore();
  const theme = useTheme();

  const [showAdd, setShowAdd] = useState(false);
  const [newWord, setNewWord] = useState('');
  const [newTranslation, setNewTranslation] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [editingWord, setEditingWord] = useState<string | null>(null);
  const [editData, setEditData] = useState({ word: '', translation: '', notes: '' });

  const headlist = headlists.find((h) => h.id === id);

  useEffect(() => {
    if (user) fetchHeadlists(user.uid);
  }, [user]);

  if (!headlist) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <ThemedText themeColor="textSecondary" style={styles.centered}>Loading...</ThemedText>
      </SafeAreaView>
    );
  }

  const handleAddWord = async () => {
    if (!newWord.trim() || !newTranslation.trim()) return;
    if (!user) return;
    await addWord(user.uid, id, {
      word: newWord.trim(),
      translation: newTranslation.trim(),
      notes: newNotes.trim(),
    });
    setNewWord('');
    setNewTranslation('');
    setNewNotes('');
    setShowAdd(false);
  };

  const handleEditWord = async (wordId: string) => {
    if (!editData.word.trim() || !editData.translation.trim()) return;
    if (!user) return;
    await editWord(user.uid, id, wordId, {
      word: editData.word.trim(),
      translation: editData.translation.trim(),
      notes: editData.notes.trim(),
    });
    setEditingWord(null);
  };

  const handleDeleteWord = (wordId: string) => {
    if (!user) return;
    Alert.alert('Delete Word', 'Remove this word?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteWord(user.uid, id, wordId),
      },
    ]);
  };

  const daysLeft = Math.max(0, Math.ceil((headlist.distillationDate - Date.now()) / (1000 * 60 * 60 * 24)));
  const isFull = headlist.words.length >= 25;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <ScrollView contentContainerStyle={styles.scroll}>
          <ThemedView style={styles.header}>
            <Pressable onPress={() => router.back()}>
              <ThemedText type="link">← Back</ThemedText>
            </Pressable>
            <ThemedText type="title">{headlist.name}</ThemedText>
            <ThemedText themeColor="textSecondary">
              {headlist.words.length}/25 words · Review in {daysLeft} days
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.actions}>
            {!isFull && (
              <Pressable
                style={styles.addButton}
                onPress={() => setShowAdd(!showAdd)}
              >
                <ThemedText style={{ color: '#FFFFFF' }}>+ Add Word</ThemedText>
              </Pressable>
            )}
            {headlist.words.length > 0 && (
              <Pressable
                style={[styles.addButton, { backgroundColor: '#8B5CF6' }]}
                onPress={() => router.push(`/(tabs)/review/${id}`)}
              >
                <ThemedText style={{ color: '#FFFFFF' }}>Start Review</ThemedText>
              </Pressable>
            )}
          </ThemedView>

          {showAdd && (
            <ThemedView type="backgroundElement" style={styles.addForm}>
              <TextInput
                style={[styles.input, { backgroundColor: theme.background, color: theme.text, borderColor: theme.backgroundSelected }]}
                placeholder="Word"
                placeholderTextColor={theme.textSecondary}
                value={newWord}
                onChangeText={setNewWord}
              />
              <TextInput
                style={[styles.input, { backgroundColor: theme.background, color: theme.text, borderColor: theme.backgroundSelected }]}
                placeholder="Translation"
                placeholderTextColor={theme.textSecondary}
                value={newTranslation}
                onChangeText={setNewTranslation}
              />
              <TextInput
                style={[styles.input, { backgroundColor: theme.background, color: theme.text, borderColor: theme.backgroundSelected }]}
                placeholder="Notes (optional)"
                placeholderTextColor={theme.textSecondary}
                value={newNotes}
                onChangeText={setNewNotes}
              />
              <View style={styles.formActions}>
                <Pressable style={styles.cancelBtn} onPress={() => setShowAdd(false)}>
                  <ThemedText>Cancel</ThemedText>
                </Pressable>
                <Pressable
                  style={[styles.saveBtn, (!newWord.trim() || !newTranslation.trim()) && { opacity: 0.5 }]}
                  onPress={handleAddWord}
                  disabled={!newWord.trim() || !newTranslation.trim()}
                >
                  <ThemedText style={{ color: '#FFFFFF' }}>Save</ThemedText>
                </Pressable>
              </View>
            </ThemedView>
          )}

          <ThemedView style={styles.wordList}>
            {headlist.words.map((w) => (
              <ThemedView type="backgroundElement" key={w.id} style={styles.wordCard}>
                {editingWord === w.id ? (
                  <View style={styles.editForm}>
                    <TextInput
                      style={[styles.input, { backgroundColor: theme.background, color: theme.text, borderColor: theme.backgroundSelected }]}
                      value={editData.word}
                      onChangeText={(t) => setEditData((d) => ({ ...d, word: t }))}
                    />
                    <TextInput
                      style={[styles.input, { backgroundColor: theme.background, color: theme.text, borderColor: theme.backgroundSelected }]}
                      value={editData.translation}
                      onChangeText={(t) => setEditData((d) => ({ ...d, translation: t }))}
                    />
                    <TextInput
                      style={[styles.input, { backgroundColor: theme.background, color: theme.text, borderColor: theme.backgroundSelected }]}
                      value={editData.notes}
                      onChangeText={(t) => setEditData((d) => ({ ...d, notes: t }))}
                      placeholder="Notes"
                      placeholderTextColor={theme.textSecondary}
                    />
                    <View style={styles.formActions}>
                      <Pressable style={styles.cancelBtn} onPress={() => setEditingWord(null)}>
                        <ThemedText>Cancel</ThemedText>
                      </Pressable>
                      <Pressable style={styles.saveBtn} onPress={() => handleEditWord(w.id)}>
                        <ThemedText style={{ color: '#FFFFFF' }}>Save</ThemedText>
                      </Pressable>
                    </View>
                  </View>
                ) : (
                  <View style={styles.wordRow}>
                    <View style={styles.wordInfo}>
                      <View style={styles.wordHeader}>
                        <ThemedText style={styles.wordText}>{w.word}</ThemedText>
                        {w.cycle > 0 && (
                          <ThemedView style={[styles.cycleBadge, w.remembered ? styles.cycleRemembered : styles.cycleActive]}>
                            <ThemedText type="small" style={w.remembered ? { color: '#059669' } : { color: '#D97706' }}>
                              D{w.cycle}
                            </ThemedText>
                          </ThemedView>
                        )}
                      </View>
                      <ThemedText themeColor="textSecondary">{w.translation}</ThemedText>
                      {w.notes ? (
                        <ThemedText type="small" themeColor="textSecondary">{w.notes}</ThemedText>
                      ) : null}
                    </View>
                    <View style={styles.wordActions}>
                      <Pressable
                        style={styles.iconBtn}
                        onPress={() => {
                          setEditingWord(w.id);
                          setEditData({ word: w.word, translation: w.translation, notes: w.notes });
                        }}
                      >
                        <ThemedText type="small">✏️</ThemedText>
                      </Pressable>
                      <Pressable style={styles.iconBtn} onPress={() => handleDeleteWord(w.id)}>
                        <ThemedText type="small">🗑️</ThemedText>
                      </Pressable>
                    </View>
                  </View>
                )}
              </ThemedView>
            ))}
            {headlist.words.length === 0 && (
              <ThemedText themeColor="textSecondary" style={styles.centered}>
                No words yet. Add your first word!
              </ThemedText>
            )}
          </ThemedView>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1 },
  scroll: { padding: Spacing.four, gap: Spacing.three, paddingBottom: 100 },
  header: { gap: Spacing.one },
  actions: { flexDirection: 'row', gap: Spacing.two },
  addButton: {
    backgroundColor: '#208AEF',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.two,
  },
  addForm: {
    padding: Spacing.three,
    borderRadius: Spacing.two,
    gap: Spacing.two,
  },
  input: {
    borderWidth: 1,
    borderRadius: Spacing.two,
    padding: Spacing.two,
    fontSize: 16,
  },
  formActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: Spacing.two },
  cancelBtn: { paddingVertical: Spacing.one, paddingHorizontal: Spacing.three },
  saveBtn: {
    backgroundColor: '#208AEF',
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.four,
    borderRadius: Spacing.two,
  },
  wordList: { gap: Spacing.two },
  wordCard: { padding: Spacing.three, borderRadius: Spacing.two },
  wordRow: { flexDirection: 'row', justifyContent: 'space-between' },
  wordInfo: { flex: 1, gap: Spacing.half },
  wordHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  wordText: { fontSize: 16, fontWeight: '600' },
  cycleBadge: {
    paddingHorizontal: Spacing.two,
    paddingVertical: 1,
    borderRadius: Spacing.five,
  },
  cycleRemembered: { backgroundColor: '#D1FAE5' },
  cycleActive: { backgroundColor: '#FEF3C7' },
  wordActions: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  iconBtn: { padding: Spacing.one },
  editForm: { gap: Spacing.two },
  centered: { textAlign: 'center', padding: Spacing.four },
});
