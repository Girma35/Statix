import { useEffect, useMemo } from 'react';
import { StyleSheet, ScrollView, Pressable, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/stores/useAuthStore';
import { useHeadlistStore } from '@/stores/useHeadlistStore';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { Headlist } from '@/types';

function StatCard({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <ThemedView type="backgroundElement" style={[styles.statCard, { borderTopColor: color, borderTopWidth: 3 }]}>
      <ThemedText type="title" style={[styles.statValue, { color }]}>{value}</ThemedText>
      <ThemedText type="small" themeColor="textSecondary">{label}</ThemedText>
    </ThemedView>
  );
}

function HeadlistCard({ headlist, onPress }: { headlist: Headlist; onPress: () => void }) {
  const unreviewedCount = headlist.words.filter((w) => !w.remembered).length;
  const daysLeft = Math.ceil((headlist.distillationDate - Date.now()) / (1000 * 60 * 60 * 24));
  const dueNow = daysLeft <= 0 && unreviewedCount > 0;

  return (
    <Pressable onPress={onPress}>
      <ThemedView type="backgroundElement" style={styles.headlistCard}>
        <View style={styles.headlistHeader}>
          <ThemedText style={styles.headlistName}>{headlist.name}</ThemedText>
          {dueNow ? (
            <ThemedView style={[styles.badge, { backgroundColor: '#FEE2E2' }]}>
              <ThemedText type="small" style={{ color: '#DC2626' }}>Due!</ThemedText>
            </ThemedView>
          ) : (
            <ThemedView style={[styles.badge, { backgroundColor: '#D1FAE5' }]}>
              <ThemedText type="small" style={{ color: '#059669' }}>{Math.max(0, daysLeft)}d</ThemedText>
            </ThemedView>
          )}
        </View>
        <ThemedText type="small" themeColor="textSecondary">
          {headlist.words.length}/25 words · {headlist.words.filter((w) => w.remembered).length} learned
        </ThemedText>
        {unreviewedCount > 0 && (
          <ThemedText type="small" themeColor="textSecondary">
            {unreviewedCount} words to review
          </ThemedText>
        )}
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${headlist.words.length > 0 ? (headlist.words.filter((w) => w.remembered).length / headlist.words.length) * 100 : 0}%` },
            ]}
          />
        </View>
      </ThemedView>
    </Pressable>
  );
}

export default function DashboardScreen() {
  const { user, profile, refreshProfile, updateStreak } = useAuthStore();
  const { headlists, fetchHeadlists } = useHeadlistStore();
  const theme = useTheme();

  useEffect(() => {
    if (user) {
      fetchHeadlists(user.uid);
      refreshProfile();
      updateStreak();
    }
  }, [user]);

  const totalWords = headlists.reduce((sum, h) => sum + h.words.length, 0);
  const wordsLearned = profile?.totalWordsLearned ?? 0;
  const streak = profile?.streak ?? 0;
  const dueHeadlists = headlists.filter((h) => {
    const hasUnreviewed = h.words.some((w) => !w.remembered);
    return h.distillationDate <= Date.now() && hasUnreviewed;
  });

  // Words per cycle breakdown
  const cycleBreakdown = useMemo(() => {
    const cycles: Record<number, number> = {};
    for (const h of headlists) {
      for (const w of h.words) {
        if (w.cycle > 0) {
          cycles[w.cycle] = (cycles[w.cycle] || 0) + 1;
        }
      }
    }
    return Object.entries(cycles).sort(([a], [b]) => Number(a) - Number(b));
  }, [headlists]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <ThemedView style={styles.header}>
          <ThemedText type="title">Hello, {profile?.displayName || 'Learner'}</ThemedText>
          <ThemedText themeColor="textSecondary">Keep up the momentum!</ThemedText>
        </ThemedView>

        <ThemedView style={styles.statsRow}>
          <StatCard label="Words Learned" value={wordsLearned} color="#208AEF" />
          <StatCard label="Active Lists" value={headlists.length} color="#8B5CF6" />
          <StatCard label="Day Streak" value={`🔥 ${streak}`} color="#F59E0B" />
        </ThemedView>

        {/* Words per cycle breakdown */}
        {cycleBreakdown.length > 0 && (
          <ThemedView style={styles.section}>
            <ThemedText type="subtitle">Cycle Breakdown</ThemedText>
            <ThemedView type="backgroundElement" style={styles.cycleContainer}>
              {cycleBreakdown.map(([cycle, count]) => (
                <View key={cycle} style={styles.cycleItem}>
                  <ThemedText style={styles.cycleLabel}>D{cycle}</ThemedText>
                  <ThemedView style={styles.cycleBar}>
                    <View
                      style={[
                        styles.cycleFill,
                        {
                          width: `${Math.min(100, (count / Math.max(totalWords, 1)) * 200)}%`,
                          backgroundColor: cycle === '1' ? '#208AEF' : cycle === '2' ? '#8B5CF6' : '#F59E0B',
                        },
                      ]}
                    />
                  </ThemedView>
                  <ThemedText type="small" style={{ width: 32, textAlign: 'right', color: theme.textSecondary }}>
                    {count}
                  </ThemedText>
                </View>
              ))}
            </ThemedView>
          </ThemedView>
        )}

        {dueHeadlists.length > 0 && (
          <ThemedView style={styles.section}>
            <ThemedText type="subtitle">Due for Review</ThemedText>
            {dueHeadlists.map((h) => (
              <HeadlistCard
                key={h.id}
                headlist={h}
                onPress={() => router.push(`/(tabs)/review/${h.id}`)}
              />
            ))}
          </ThemedView>
        )}

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">Your Headlists</ThemedText>
          {headlists.length === 0 ? (
            <ThemedView type="backgroundElement" style={styles.emptyState}>
              <ThemedText themeColor="textSecondary">No headlists yet. Create one to start learning!</ThemedText>
              <Pressable
                style={styles.createButton}
                onPress={() => router.push('/(tabs)/headlists')}
              >
                <ThemedText style={{ color: '#FFFFFF' }}>Create Headlist</ThemedText>
              </Pressable>
            </ThemedView>
          ) : (
            headlists.map((h) => (
              <HeadlistCard
                key={h.id}
                headlist={h}
                onPress={() => router.push(`/(tabs)/headlist/${h.id}`)}
              />
            ))
          )}
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: Spacing.four, gap: Spacing.four, paddingBottom: 100 },
  header: { gap: Spacing.one, marginBottom: Spacing.two },
  statsRow: { flexDirection: 'row', gap: Spacing.two },
  statCard: {
    flex: 1,
    padding: Spacing.three,
    borderRadius: Spacing.two,
    alignItems: 'center',
    gap: Spacing.half,
  },
  statValue: { fontSize: 24, fontWeight: '700' },
  section: { gap: Spacing.three },
  cycleContainer: { padding: Spacing.three, borderRadius: Spacing.two, gap: Spacing.two },
  cycleItem: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  cycleLabel: { width: 24, fontWeight: '600' },
  cycleBar: { flex: 1, height: 8, backgroundColor: '#E5E7EB', borderRadius: 4, overflow: 'hidden' },
  cycleFill: { height: '100%', borderRadius: 4 },
  headlistCard: {
    padding: Spacing.three,
    borderRadius: Spacing.two,
    gap: Spacing.two,
  },
  headlistHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headlistName: { fontSize: 16, fontWeight: '600', flex: 1 },
  badge: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
    borderRadius: Spacing.five,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#208AEF',
    borderRadius: 2,
  },
  emptyState: {
    padding: Spacing.four,
    borderRadius: Spacing.two,
    alignItems: 'center',
    gap: Spacing.three,
  },
  createButton: {
    backgroundColor: '#208AEF',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.two,
  },
});
