import { useEffect, useState } from 'react';
import { StyleSheet, Pressable, View, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/stores/useAuthStore';
import { useHeadlistStore } from '@/stores/useHeadlistStore';
import { useDistillationStore } from '@/stores/useDistillationStore';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function ReviewScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuthStore();
  const { headlists, fetchHeadlists } = useHeadlistStore();
  const theme = useTheme();

  const headlist = headlists.find((h) => h.id === id);
  const { session, loading, startSession, nextWord, markRemembered, markForgot, completeSession, resetSession } =
    useDistillationStore();

  const [finished, setFinished] = useState(false);
  const [results, setResults] = useState({ remembered: 0, forgot: 0 });

  useEffect(() => {
    if (user) fetchHeadlists(user.uid);
  }, [user]);

  useEffect(() => {
    if (headlist && !session) {
      startSession(headlist);
    }
  }, [headlist]);

  if (!headlist) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <ThemedText themeColor="textSecondary" style={styles.centered}>Loading...</ThemedText>
      </SafeAreaView>
    );
  }

  if (!session) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <ThemedView style={styles.centered}>
          <ThemedText type="subtitle">Starting review...</ThemedText>
        </ThemedView>
      </SafeAreaView>
    );
  }

  const currentWord = session.words[session.currentIndex];
  const progress = session.currentIndex + 1;

  const handleRemember = async () => {
    if (!user) return;
    await markRemembered(user.uid);
    if (session.currentIndex >= session.words.length - 1) {
      handleFinish();
    } else {
      nextWord();
    }
  };

  const handleForgot = async () => {
    if (!user) return;
    await markForgot(user.uid);
    if (session.currentIndex >= session.words.length - 1) {
      handleFinish();
    } else {
      nextWord();
    }
  };

  const handleFinish = async () => {
    if (!user) return;
    const result = await completeSession(user.uid);
    setResults({ remembered: result.remembered.length, forgot: result.forgot.length });
    setFinished(true);
  };

  if (finished) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <ThemedView style={styles.finishedBox}>
          <ThemedText type="title">🎉 Review Complete!</ThemedText>
          <ThemedView style={styles.resultsRow}>
            <ThemedView style={[styles.resultCard, { backgroundColor: '#D1FAE5' }]}>
              <ThemedText type="title" style={{ color: '#059669' }}>{results.remembered}</ThemedText>
              <ThemedText style={{ color: '#059669' }}>Remembered</ThemedText>
            </ThemedView>
            <ThemedView style={[styles.resultCard, { backgroundColor: '#FEE2E2' }]}>
              <ThemedText type="title" style={{ color: '#DC2626' }}>{results.forgot}</ThemedText>
              <ThemedText style={{ color: '#DC2626' }}>Forgot</ThemedText>
            </ThemedView>
          </ThemedView>
          {results.forgot > 0 && (
            <ThemedText themeColor="textSecondary" style={{ textAlign: 'center' }}>
              Forgotten words have been moved to a new headlist for the next cycle (D{session.cycle + 1}).
            </ThemedText>
          )}
          <Pressable
            style={styles.doneButton}
            onPress={() => {
              resetSession();
              router.back();
            }}
          >
            <ThemedText style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '600' }}>Done</ThemedText>
          </Pressable>
        </ThemedView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ThemedView style={styles.progressBar}>
        <ThemedText type="small" themeColor="textSecondary">
          {progress} / {session.words.length}
        </ThemedText>
        <View style={styles.progressTrack}>
          <View
            style={[styles.progressFill, { width: `${(progress / session.words.length) * 100}%` }]}
          />
        </View>
      </ThemedView>

      <ThemedView style={styles.cardContainer}>
        <ThemedView type="backgroundElement" style={styles.wordCard}>
          <ThemedText type="title" style={styles.wordDisplay}>{currentWord.word}</ThemedText>
          <ThemedView style={styles.divider} />
          <ThemedText themeColor="textSecondary" style={styles.translation}>{currentWord.translation}</ThemedText>
          {currentWord.notes ? (
            <ThemedText type="small" themeColor="textSecondary" style={styles.notes}>
              📝 {currentWord.notes}
            </ThemedText>
          ) : null}
          <ThemedView style={[styles.cycleIndicator]}>
            <ThemedText type="small" themeColor="textSecondary">
              Cycle: D{currentWord.cycle + 1}
            </ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.buttons}>
        <Pressable
          style={[styles.reviewButton, styles.forgotButton]}
          onPress={handleForgot}
          disabled={loading}
        >
          <ThemedText style={styles.buttonText}>❌ Forgot</ThemedText>
        </Pressable>
        <Pressable
          style={[styles.reviewButton, styles.rememberButton]}
          onPress={handleRemember}
          disabled={loading}
        >
          <ThemedText style={styles.buttonText}>✅ Remembered</ThemedText>
        </Pressable>
      </ThemedView>

      <ThemedView style={styles.stats}>
        <ThemedText type="small" themeColor="textSecondary">
          ✅ {session.rememberedCount} · ❌ {session.forgotCount}
        </ThemedText>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.four },
  progressBar: {
    padding: Spacing.four,
    gap: Spacing.two,
    alignItems: 'center',
  },
  progressTrack: {
    width: '100%',
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#208AEF',
    borderRadius: 3,
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
  },
  wordCard: {
    padding: Spacing.six,
    borderRadius: Spacing.three,
    alignItems: 'center',
    gap: Spacing.three,
  },
  wordDisplay: {
    fontSize: 36,
    fontWeight: '700',
    textAlign: 'center',
  },
  divider: {
    width: 40,
    height: 2,
    backgroundColor: '#E5E7EB',
    borderRadius: 1,
  },
  translation: {
    fontSize: 22,
    textAlign: 'center',
  },
  notes: {
    textAlign: 'center',
    fontStyle: 'italic',
  },
  cycleIndicator: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
    borderRadius: Spacing.five,
    backgroundColor: '#F3F4F6',
  },
  buttons: {
    flexDirection: 'row',
    gap: Spacing.three,
    padding: Spacing.four,
  },
  reviewButton: {
    flex: 1,
    padding: Spacing.four,
    borderRadius: Spacing.three,
    alignItems: 'center',
  },
  forgotButton: {
    backgroundColor: '#FEE2E2',
    borderWidth: 2,
    borderColor: '#FCA5A5',
  },
  rememberButton: {
    backgroundColor: '#D1FAE5',
    borderWidth: 2,
    borderColor: '#6EE7B7',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  stats: {
    alignItems: 'center',
    paddingBottom: Spacing.four,
  },
  finishedBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.four,
    gap: Spacing.four,
  },
  resultsRow: {
    flexDirection: 'row',
    gap: Spacing.three,
    width: '100%',
  },
  resultCard: {
    flex: 1,
    padding: Spacing.four,
    borderRadius: Spacing.three,
    alignItems: 'center',
    gap: Spacing.one,
  },
  doneButton: {
    backgroundColor: '#208AEF',
    paddingHorizontal: Spacing.six,
    paddingVertical: Spacing.three,
    borderRadius: Spacing.two,
    marginTop: Spacing.two,
  },
});
