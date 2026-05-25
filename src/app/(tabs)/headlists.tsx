/**
 * Progress screen — matches the "Learning Progress" mockup.
 * Shows: total words, current distillation cycle, completion rate, retention chart, streak banner, milestones.
 */
import React, { useEffect, useMemo } from 'react';
import { StyleSheet, ScrollView, View, Text, Pressable, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAuthStore } from '@/stores/useAuthStore';
import { useHeadlistStore } from '@/stores/useHeadlistStore';
import { Icon } from '@/components/icon';

const BLUE = '#0C5AC3';
const BG = '#F4F7FD';
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

export default function ProgressScreen() {
  const { user, profile, refreshProfile } = useAuthStore();
  const { headlists, fetchHeadlists } = useHeadlistStore();

  useEffect(() => {
    if (user) { fetchHeadlists(user.uid); refreshProfile(); }
  }, [user]);

  const streak = profile?.streak ?? 0;
  const wordsLearned = profile?.totalWordsLearned ?? 0;

  const currentCycle = useMemo(() => {
    const cycles = headlists.flatMap((h) => h.words.map((w) => w.cycle));
    return cycles.length > 0 ? Math.max(...cycles) : 1;
  }, [headlists]);

  const cycleProgress = useMemo(() => {
    const total = headlists.reduce((s, h) => s + h.words.length, 0);
    const done = headlists.reduce((s, h) => s + h.words.filter((w) => w.remembered).length, 0);
    return total > 0 ? Math.round((done / total) * 100) : 0;
  }, [headlists]);

  const completionRate = cycleProgress;

  // Retention chart data — will display once backend analytics are live
  const retentionAvailable = false;

  const milestones = [
    wordsLearned >= 1000 && { icon: 'chart.bar.fill', label: '1,000 Word Club', when: '2 days ago' },
    headlists.length >= 50 && { icon: 'gearshape.fill', label: '50th Headlist Done', when: 'Last week' },
    wordsLearned >= 500 && { icon: 'info.circle.fill', label: '500 Words Mastered', when: '2 weeks ago' },
  ].filter(Boolean) as { icon: string; label: string; when: string }[];

  return (
    <SafeAreaView style={s.container}>
      {/* Header */}
      <View style={s.header}>
        <Pressable><Icon name="house.fill" size={22} color={BLUE} /></Pressable>
        <Text style={s.headerTitle}>Gold List</Text>
        <Pressable><Icon name="person.circle.fill" size={26} color={BLUE} /></Pressable>
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <Text style={s.pageTitle}>Learning Progress</Text>
        <Text style={s.pageSub}>Track your distillation milestones and vocabulary growth.</Text>

        {/* Total Words */}
        <View style={s.card}>
          <View style={s.cardRow}>
            <Text style={s.cardLabel}>Total Words Learned</Text>
            <Icon name="chart.bar.fill" size={20} color={BLUE} />
          </View>
          <Text style={s.bigNum}>{wordsLearned.toLocaleString()}</Text>
          <Text style={s.greenTag}>▲ +12% this month</Text>
        </View>

        {/* Current Cycle */}
        <View style={s.card}>
          <View style={s.cardRow}>
            <Text style={s.cardLabel}>Current Cycle</Text>
            <Icon name="arrow.right.square.fill" size={20} color={BLUE} />
          </View>
          <Text style={s.bigNum}>Distillation {currentCycle}</Text>
          <View style={s.progressTrack}>
            <View style={[s.progressFill, { width: `${Math.min(cycleProgress, 100)}%` }]} />
          </View>
        </View>

        {/* Completion Rate */}
        <View style={s.card}>
          <View style={s.cardRow}>
            <Text style={s.cardLabel}>Completion Rate</Text>
            <Icon name="gearshape.fill" size={20} color={BLUE} />
          </View>
          <Text style={[s.bigNum, { color: '#22C55E' }]}>{completionRate}%</Text>
          <Text style={s.targetText}>Target: 70% retention</Text>
        </View>          {/* Retention Growth Chart */}
        <View style={[s.card, { paddingBottom: 8 }]}>
          <Text style={s.chartTitle}>Retention Growth</Text>
          <Text style={s.chartSub}>Average retention rate over the last 6 months</Text>

          {retentionAvailable ? (
            <>
              {/* Toggle buttons */}
              <View style={s.toggleRow}>
                <Pressable style={s.toggleBtn}><Text style={s.toggleTxtInactive}>Week</Text></Pressable>
                <Pressable style={[s.toggleBtn, s.toggleActive]}><Text style={s.toggleTxtActive}>Month</Text></Pressable>
              </View>

              {/* Bar chart */}
              <View style={s.chartWrap}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ color: '#94A3B8', fontSize: 14 }}>Chart data coming soon</Text>
                </View>
              </View>
            </>
          ) : (
            <View style={s.chartPlaceholder}>
              <Text style={s.chartPlaceholderTitle}>📊 Retention analytics are on their way</Text>
              <Text style={s.chartPlaceholderSub}>
                Once you've completed a few review cycles, your retention data will appear here.
              </Text>
            </View>
          )}
        </View>

        {/* Streak Banner */}
        <View style={s.streakBanner}>
          <View style={s.streakLeft}>
            <Text style={s.streakTitle}>{streak} Day Streak</Text>
            <Text style={s.streakSub}>You're in the top 5% of active Gold List learners this week.</Text>
            <Pressable style={s.leaderboardBtn}>
              <Text style={s.leaderboardBtnTxt}>View Leaderboard</Text>
            </Pressable>
          </View>
          <View style={s.streakFireWrap}>
            <Icon name="arrow.right.square.fill" size={56} color="rgba(255,255,255,0.18)" />
          </View>
        </View>

        {/* Milestones */}
        <View style={s.card}>
          <Text style={s.milestonesTitle}>MILESTONES</Text>
          {milestones.length === 0 ? (
            <Text style={s.noMilestone}>Keep learning to unlock milestones! 🚀</Text>
          ) : (
            milestones.map((m, i) => (
              <View key={i} style={[s.milestoneRow, i < milestones.length - 1 && s.milestoneBorder]}>
                <View style={s.milestoneIconBox}>
                  <Icon name={m.icon as any} size={20} color={BLUE} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.milestoneLabel}>{m.label}</Text>
                  <Text style={s.milestoneWhen}>{m.when}</Text>
                </View>
              </View>
            ))
          )}
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 14,
    backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9',
  },
  headerTitle: { fontSize: 20, fontWeight: '800', color: BLUE,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif' },
  scroll: { padding: 20 },
  pageTitle: { fontSize: 24, fontWeight: '800', color: '#0F172A', marginBottom: 6 },
  pageSub: { fontSize: 14, color: '#64748B', marginBottom: 20, lineHeight: 20 },
  card: {
    backgroundColor: '#FFF', borderRadius: 16, padding: 18,
    borderWidth: 1, borderColor: '#E8EEF9', marginBottom: 16,
  },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  cardLabel: { fontSize: 13, color: '#64748B', fontWeight: '500' },
  bigNum: { fontSize: 32, fontWeight: '800', color: '#0F172A', marginBottom: 6 },
  greenTag: { fontSize: 13, color: '#22C55E', fontWeight: '600' },
  progressTrack: { height: 7, backgroundColor: '#E5E7EB', borderRadius: 4, overflow: 'hidden', marginTop: 6 },
  progressFill: { height: '100%', backgroundColor: BLUE, borderRadius: 4 },
  targetText: { fontSize: 13, color: '#94A3B8', marginTop: 4 },
  chartTitle: { fontSize: 16, fontWeight: '700', color: '#0F172A', marginBottom: 4 },
  chartSub: { fontSize: 12, color: '#64748B', marginBottom: 14 },
  chartPlaceholder: { paddingVertical: 24, alignItems: 'center' as const },
  chartPlaceholderTitle: { fontSize: 16, color: '#0F172A', fontWeight: '600', marginBottom: 8, textAlign: 'center' as const },
  chartPlaceholderSub: { fontSize: 13, color: '#94A3B8', textAlign: 'center' as const, lineHeight: 19, maxWidth: '80%' },
  toggleRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  toggleBtn: {
    paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20,
    backgroundColor: '#F1F5F9',
  },
  toggleActive: { backgroundColor: BLUE },
  toggleTxtInactive: { fontSize: 13, color: '#64748B', fontWeight: '600' },
  toggleTxtActive: { fontSize: 13, color: '#FFF', fontWeight: '600' },
  chartWrap: {
    flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between',
    height: 100, paddingBottom: 4,
  },
  barCol: { flex: 1, alignItems: 'center', gap: 6 },
  barTrack: { flex: 1, width: '60%', backgroundColor: '#F1F5F9', borderRadius: 4, justifyContent: 'flex-end', overflow: 'hidden' },
  barFill: { width: '100%', backgroundColor: BLUE, borderRadius: 4 },
  barLabel: { fontSize: 11, color: '#94A3B8' },
  streakBanner: {
    backgroundColor: BLUE, borderRadius: 16, padding: 24,
    marginBottom: 16, flexDirection: 'row', overflow: 'hidden',
  },
  streakLeft: { flex: 1 },
  streakTitle: { fontSize: 20, fontWeight: '800', color: '#FFF', marginBottom: 8 },
  streakSub: { fontSize: 13, color: 'rgba(255,255,255,0.8)', lineHeight: 19, marginBottom: 16 },
  leaderboardBtn: {
    alignSelf: 'flex-start', borderWidth: 1.5, borderColor: '#FFF',
    borderRadius: 8, paddingHorizontal: 16, paddingVertical: 8,
  },
  leaderboardBtnTxt: { color: '#FFF', fontWeight: '600', fontSize: 13 },
  streakFireWrap: { justifyContent: 'center', marginLeft: 10 },
  milestonesTitle: { fontSize: 11, fontWeight: '700', letterSpacing: 1.2, color: '#94A3B8', marginBottom: 14 },
  noMilestone: { color: '#64748B', textAlign: 'center', paddingVertical: 10 },
  milestoneRow: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 12 },
  milestoneBorder: { borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  milestoneIconBox: {
    width: 40, height: 40, borderRadius: 10, backgroundColor: '#EEF4FF',
    justifyContent: 'center', alignItems: 'center',
  },
  milestoneLabel: { fontSize: 14, fontWeight: '600', color: '#0F172A', marginBottom: 2 },
  milestoneWhen: { fontSize: 12, color: '#94A3B8' },
});
