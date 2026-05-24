import React, { useEffect } from 'react';
import { StyleSheet, ScrollView, Pressable, View, Text, Platform } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/stores/useAuthStore';
import { useHeadlistStore } from '@/stores/useHeadlistStore';
import { Icon } from '@/components/icon';
import type { Headlist } from '@/types';

const BLUE = '#0C5AC3';
const BG = '#F4F7FD';

function progressColor(pct: number) {
  if (pct < 30) return '#EF4444';
  if (pct < 70) return BLUE;
  return '#22C55E';
}

function HeadlistRow({ headlist, onPress }: { headlist: Headlist; onPress: () => void }) {
  const learned = headlist.words.filter((w) => w.remembered).length;
  const pct = headlist.words.length > 0 ? Math.round((learned / headlist.words.length) * 100) : 0;
  const color = progressColor(pct);

  return (
    <Pressable onPress={onPress} style={r.card}>
      <View style={r.iconBox}>
        <Icon name="chart.bar.fill" size={22} color={BLUE} />
      </View>
      <View style={r.info}>
        <Text style={r.title} numberOfLines={1}>{headlist.name}</Text>
        <View style={r.barTrack}>
          <View style={[r.barFill, { width: `${pct}%`, backgroundColor: color }]} />
        </View>
      </View>
      <Text style={[r.pct, { color }]}>{pct}%</Text>
      <Icon name="chevron.right" size={16} color="#CBD5E1" />
    </Pressable>
  );
}

const r = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E8EEF9',
  },
  iconBox: {
    width: 44, height: 44, borderRadius: 12,
    backgroundColor: '#EEF4FF',
    justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  info: { flex: 1 },
  title: { fontSize: 15, fontWeight: '600', color: '#0F172A', marginBottom: 7 },
  barTrack: { height: 5, backgroundColor: '#E5E7EB', borderRadius: 3, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 3 },
  pct: { fontSize: 13, fontWeight: '700', marginHorizontal: 10 },
});

export default function DashboardScreen() {
  const { user, profile, refreshProfile, updateStreak } = useAuthStore();
  const { headlists, fetchHeadlists } = useHeadlistStore();

  useEffect(() => {
    if (user) { fetchHeadlists(user.uid); refreshProfile(); updateStreak(); }
  }, [user]);

  const streak = profile?.streak ?? 0;
  const wordsLearned = profile?.totalWordsLearned ?? 0;
  const totalWords = headlists.reduce((s, h) => s + h.words.length, 0);
  const retentionRate = totalWords > 0 ? Math.round((wordsLearned / totalWords) * 100) : 0;

  return (
    <SafeAreaView style={s.container}>
      {/* Header */}
      <View style={s.header}>
        <Pressable><Icon name="house.fill" size={22} color={BLUE} /></Pressable>
        <Text style={s.headerTitle}>Gold List</Text>
        <View style={s.headerRight}>
          <Pressable style={s.headerBtn}><Icon name="person.circle.fill" size={26} color={BLUE} /></Pressable>
        </View>
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        {/* Hero Banner */}
        <View style={s.hero}>
          <View style={s.heroText}>
            <Text style={s.helloText}>Hello, {profile?.displayName || 'Scholar'}!</Text>
            <Text style={s.heroSub}>Ready for your daily{'\n'}distillation?</Text>
          </View>
          <View style={s.streakBadge}>
            <View style={s.streakIconWrap}>
              <Icon name="chart.bar.fill" size={28} color="#22C55E" />
            </View>
            <Text style={s.streakNum}>{streak} Day</Text>
            <Text style={s.streakLabel}>Streak</Text>
          </View>
        </View>

        {/* Stat Cards */}
        <View style={s.statsRow}>
          <View style={s.statCard}>
            <Icon name="chart.bar.fill" size={26} color={BLUE} />
            <Text style={s.statValue}>{wordsLearned.toLocaleString()}</Text>
            <Text style={s.statLabel}>Words Mastered</Text>
          </View>
          <View style={s.statCard}>
            <Icon name="gearshape.fill" size={26} color={BLUE} />
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
            <View style={s.empty}>
              <Text style={s.emptyText}>No headlists yet. Create your first one!</Text>
              <Pressable style={s.emptyBtn} onPress={() => router.push('/(tabs)/create')}>
                <Text style={s.emptyBtnTxt}>Create List</Text>
              </Pressable>
            </View>
          ) : (
            headlists.slice(0, 3).map((h) => (
              <HeadlistRow key={h.id} headlist={h}
                onPress={() => router.push(`/(tabs)/headlist/${h.id}`)} />
            ))
          )}
        </View>

        {/* Tips Card */}
        <View style={s.tipsCard}>
          <View style={s.tipsThumb}>
            <Icon name="info.circle.fill" size={36} color="#FFFFFF" />
          </View>
          <View style={s.tipsBody}>
            <Text style={s.tipsTitle}>Distillation Method Pro Tips</Text>
            <Text style={s.tipsSub}>Learn how to maximize your memory retention today.</Text>
            <Text style={s.tipsLink}>Read More</Text>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* FAB */}
      <Pressable style={s.fab} onPress={() => router.push('/(tabs)/create')}>
        <Icon name="plus.circle.fill" size={22} color="#FFFFFF" />
        <Text style={s.fabTxt}>Create New List</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 14,
    backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9',
  },
  headerTitle: { fontSize: 20, fontWeight: '800', color: BLUE,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif' },
  headerRight: { flexDirection: 'row', gap: 12 },
  headerBtn: { padding: 2 },
  scroll: { paddingHorizontal: 20, paddingTop: 20 },
  hero: {
    backgroundColor: BLUE, borderRadius: 18, padding: 24,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20,
  },
  heroText: { flex: 1 },
  helloText: { fontSize: 22, fontWeight: '800', color: '#FFF', marginBottom: 6 },
  heroSub: { fontSize: 14, color: 'rgba(255,255,255,0.8)', lineHeight: 20 },
  streakBadge: {
    backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 14,
    width: 92, paddingVertical: 12, alignItems: 'center', gap: 4,
  },
  streakIconWrap: { marginBottom: 2 },
  streakNum: { fontSize: 18, fontWeight: '800', color: '#FFF' },
  streakLabel: { fontSize: 12, color: 'rgba(255,255,255,0.8)' },
  statsRow: { flexDirection: 'row', gap: 14, marginBottom: 24 },
  statCard: {
    flex: 1, backgroundColor: '#FFFFFF', borderRadius: 14, padding: 18,
    borderWidth: 1, borderColor: '#E8EEF9', alignItems: 'flex-start', gap: 8,
  },
  statValue: { fontSize: 28, fontWeight: '800', color: '#0F172A' },
  statLabel: { fontSize: 13, color: '#64748B' },
  section: { marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#0F172A' },
  viewAll: { fontSize: 14, fontWeight: '600', color: BLUE },
  empty: { backgroundColor: '#FFF', borderRadius: 14, padding: 24, alignItems: 'center', gap: 12 },
  emptyText: { color: '#64748B', fontSize: 14, textAlign: 'center' },
  emptyBtn: { backgroundColor: BLUE, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 },
  emptyBtnTxt: { color: '#FFF', fontWeight: '600' },
  tipsCard: {
    backgroundColor: '#EEF4FF', borderRadius: 14, padding: 16,
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderColor: '#DBEAFE', marginBottom: 20,
  },
  tipsThumb: {
    width: 72, height: 72, borderRadius: 12,
    backgroundColor: BLUE, justifyContent: 'center', alignItems: 'center', marginRight: 14,
  },
  tipsBody: { flex: 1 },
  tipsTitle: { fontSize: 14, fontWeight: '700', color: '#0F172A', marginBottom: 4 },
  tipsSub: { fontSize: 12, color: '#475569', lineHeight: 18, marginBottom: 6 },
  tipsLink: { fontSize: 13, fontWeight: '700', color: BLUE },
  fab: {
    position: 'absolute', bottom: 82, right: 20,
    backgroundColor: BLUE, borderRadius: 28,
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 14, paddingHorizontal: 22, gap: 10,
    elevation: 6, shadowColor: BLUE,
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 10,
  },
  fabTxt: { color: '#FFF', fontWeight: '700', fontSize: 15 },
});
