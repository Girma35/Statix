import React, { useEffect, useMemo } from 'react';
import {
  StyleSheet, ScrollView, Pressable, View, Text,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/stores/useAuthStore';
import { useHeadlistStore } from '@/stores/useHeadlistStore';
import type { Headlist } from '@/types';

const BLUE = '#0C5AC3';
const LIGHT_BG = '#F4F7FD';

// Calculates a color for a given headlist progress
function progressColor(pct: number) {
  if (pct < 30) return '#EF4444';
  if (pct < 70) return '#0C5AC3';
  return '#22C55E';
}

function HeadlistRow({ headlist, onPress }: { headlist: Headlist; onPress: () => void }) {
  const learned = headlist.words.filter((w) => w.remembered).length;
  const pct = headlist.words.length > 0 ? Math.round((learned / headlist.words.length) * 100) : 0;
  const color = progressColor(pct);

  return (
    <Pressable onPress={onPress}>
      <View style={row.card}>
        <View style={[row.iconBox, { backgroundColor: '#EEF4FF' }]}>
          <Text style={row.iconText}>📖</Text>
        </View>
        <View style={row.info}>
          <Text style={row.title}>{headlist.name}</Text>
          <View style={row.barTrack}>
            <View style={[row.barFill, { width: `${pct}%`, backgroundColor: color }]} />
          </View>
        </View>
        <Text style={[row.pct, { color }]}>{pct}%</Text>
        <Text style={row.chevron}>›</Text>
      </View>
    </Pressable>
  );
}

const row = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E8EEF9',
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconText: { fontSize: 22 },
  info: { flex: 1 },
  title: { fontSize: 15, fontWeight: '600', color: '#0F172A', marginBottom: 6 },
  barTrack: { height: 5, backgroundColor: '#E5E7EB', borderRadius: 3, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 3 },
  pct: { fontSize: 13, fontWeight: '700', marginLeft: 10 },
  chevron: { fontSize: 20, color: '#CBD5E1', marginLeft: 6 },
});

export default function DashboardScreen() {
  const { user, profile, refreshProfile, updateStreak } = useAuthStore();
  const { headlists, fetchHeadlists } = useHeadlistStore();

  useEffect(() => {
    if (user) {
      fetchHeadlists(user.uid);
      refreshProfile();
      updateStreak();
    }
  }, [user]);

  const streak = profile?.streak ?? 0;
  const wordsLearned = profile?.totalWordsLearned ?? 0;
  const totalWords = headlists.reduce((s, h) => s + h.words.length, 0);
  const retentionRate = totalWords > 0
    ? Math.round((wordsLearned / totalWords) * 100)
    : 0;

  const activeHeadlists = headlists.slice(0, 3);

  return (
    <SafeAreaView style={s.container}>
      {/* Header */}
      <View style={s.header}>
        <Pressable><Text style={s.menuIcon}>☰</Text></Pressable>
        <Text style={s.headerTitle}>Gold List</Text>
        <View style={s.headerRight}>
          <Pressable><Text style={s.headerIcon}>🔍</Text></Pressable>
          <Pressable><Text style={s.headerIcon}>👤</Text></Pressable>
        </View>
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        {/* Hero Banner */}
        <View style={s.heroBanner}>
          <View style={s.heroText}>
            <Text style={s.helloText}>Hello, {profile?.displayName || 'Scholar'}!</Text>
            <Text style={s.heroSub}>Ready for your daily{'\n'}distillation?</Text>
          </View>
          <View style={s.streakBadge}>
            <Text style={s.streakIcon}>🏆</Text>
            <Text style={s.streakNum}>{streak} Day</Text>
            <Text style={s.streakLabel}>Streak</Text>
          </View>
        </View>

        {/* Stat Cards */}
        <View style={s.statsRow}>
          <View style={s.statCard}>
            <Text style={s.statIcon}>📚</Text>
            <Text style={s.statValue}>{wordsLearned.toLocaleString()}</Text>
            <Text style={s.statLabel}>Words Mastered</Text>
          </View>
          <View style={s.statCard}>
            <Text style={s.statIcon}>📊</Text>
            <Text style={s.statValue}>{retentionRate}%</Text>
            <Text style={s.statLabel}>Retention Rate</Text>
          </View>
        </View>

        {/* Active Headlists */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <Text style={s.sectionTitle}>Active Headlists</Text>
            <Pressable onPress={() => router.push('/(tabs)/headlists')}>
              <Text style={s.viewAll}>View All</Text>
            </Pressable>
          </View>

          {headlists.length === 0 ? (
            <View style={s.emptyState}>
              <Text style={s.emptyText}>No headlists yet.</Text>
              <Pressable style={s.emptyBtn} onPress={() => router.push('/(tabs)/create')}>
                <Text style={s.emptyBtnText}>Create your first list</Text>
              </Pressable>
            </View>
          ) : (
            activeHeadlists.map((h) => (
              <HeadlistRow
                key={h.id}
                headlist={h}
                onPress={() => router.push(`/(tabs)/headlist/${h.id}`)}
              />
            ))
          )}
        </View>

        {/* Tips Card */}
        <View style={s.tipsCard}>
          <View style={s.tipsImage}>
            <Text style={{ fontSize: 40 }}>👨‍💻</Text>
          </View>
          <View style={s.tipsText}>
            <Text style={s.tipsTitle}>Distillation Method Pro Tips</Text>
            <Text style={s.tipsSub}>Learn how to maximize your memory retention today.</Text>
            <Text style={s.tipsLink}>Read More</Text>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Floating Action Button */}
      <Pressable style={s.fab} onPress={() => router.push('/(tabs)/create')}>
        <Text style={s.fabIcon}>⊕</Text>
        <Text style={s.fabText}>Create New List</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: LIGHT_BG },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  menuIcon: { fontSize: 22, color: BLUE },
  headerTitle: { fontSize: 20, fontWeight: '800', color: BLUE },
  headerRight: { flexDirection: 'row', gap: 12 },
  headerIcon: { fontSize: 22 },
  scroll: { paddingHorizontal: 20, paddingTop: 20 },
  heroBanner: {
    backgroundColor: BLUE,
    borderRadius: 18,
    padding: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  heroText: { flex: 1 },
  helloText: { fontSize: 22, fontWeight: '800', color: '#FFFFFF', marginBottom: 6 },
  heroSub: { fontSize: 14, color: 'rgba(255,255,255,0.8)', lineHeight: 20 },
  streakBadge: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 14,
    width: 90,
    paddingVertical: 12,
    alignItems: 'center',
  },
  streakIcon: { fontSize: 28 },
  streakNum: { fontSize: 18, fontWeight: '800', color: '#FFFFFF', marginTop: 4 },
  streakLabel: { fontSize: 12, color: 'rgba(255,255,255,0.8)' },
  statsRow: { flexDirection: 'row', gap: 14, marginBottom: 24 },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E8EEF9',
    alignItems: 'flex-start',
  },
  statIcon: { fontSize: 26, marginBottom: 12 },
  statValue: { fontSize: 28, fontWeight: '800', color: '#0F172A' },
  statLabel: { fontSize: 13, color: '#64748B', marginTop: 2 },
  section: { marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#0F172A' },
  viewAll: { fontSize: 14, fontWeight: '600', color: BLUE },
  emptyState: { backgroundColor: '#FFFFFF', borderRadius: 14, padding: 24, alignItems: 'center', gap: 12 },
  emptyText: { color: '#64748B', fontSize: 15 },
  emptyBtn: { backgroundColor: BLUE, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 },
  emptyBtnText: { color: '#FFFFFF', fontWeight: '600' },
  tipsCard: {
    backgroundColor: '#EEF4FF',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DBEAFE',
    marginBottom: 20,
  },
  tipsImage: {
    width: 72,
    height: 72,
    borderRadius: 10,
    backgroundColor: '#BFDBFE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  tipsText: { flex: 1 },
  tipsTitle: { fontSize: 14, fontWeight: '700', color: '#0F172A', marginBottom: 4 },
  tipsSub: { fontSize: 12, color: '#475569', lineHeight: 18, marginBottom: 6 },
  tipsLink: { fontSize: 13, fontWeight: '700', color: BLUE },
  fab: {
    position: 'absolute',
    bottom: 82,
    right: 20,
    backgroundColor: BLUE,
    borderRadius: 28,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 22,
    gap: 8,
    elevation: 6,
    shadowColor: BLUE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  fabIcon: { fontSize: 22, color: '#FFFFFF' },
  fabText: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 },
});
