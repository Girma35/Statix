import React, { useEffect, useState } from 'react';
import { StyleSheet, Pressable, View, Text, Platform } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/stores/useAuthStore';
import { useHeadlistStore } from '@/stores/useHeadlistStore';
import { useDistillationStore } from '@/stores/useDistillationStore';
import { Icon } from '@/components/icon';

const BLUE = '#0C5AC3';

export default function ReviewScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuthStore();
  const { headlists, fetchHeadlists } = useHeadlistStore();
  const { session, loading, startSession, nextWord, markRemembered, markForgot, completeSession, resetSession } =
    useDistillationStore();

  const [revealed, setRevealed] = useState(false);

  const headlist = headlists.find((h) => h.id === id);

  useEffect(() => { if (user) fetchHeadlists(user.uid); }, [user]);
  useEffect(() => { if (headlist && !session) { startSession(headlist); setRevealed(false); } }, [headlist]);

  if (!headlist) {
    return (
      <SafeAreaView style={s.container}>
        <View style={s.centered}><Text style={s.loadingTxt}>Loading...</Text></View>
      </SafeAreaView>
    );
  }

  // Results screen
  if (session?.completed) {
    return (
      <SafeAreaView style={s.container}>
        <View style={s.centered}>
          <Text style={s.doneTitle}>🎉 Review Complete!</Text>
          <View style={s.resultsRow}>
            <View style={[s.resultCard, { borderColor: '#22C55E' }]}>
              <Text style={[s.resultNum, { color: '#22C55E' }]}>{session.rememberedCount}</Text>
              <Text style={s.resultLabel}>Remembered</Text>
            </View>
            <View style={[s.resultCard, { borderColor: '#EF4444' }]}>
              <Text style={[s.resultNum, { color: '#EF4444' }]}>{session.forgotCount}</Text>
              <Text style={s.resultLabel}>Forgot</Text>
            </View>
          </View>
          {session.forgotCount > 0 && (
            <Text style={s.resultNote}>
              Forgotten words moved to a new headlist for the next cycle (D{session.cycle + 1}).
            </Text>
          )}
          <Pressable style={s.doneBtn} onPress={() => { resetSession(); router.back(); }}>
            <Text style={s.doneBtnTxt}>Done</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  if (!session) {
    return (
      <SafeAreaView style={s.container}>
        <View style={s.centered}><Text style={s.loadingTxt}>Starting review...</Text></View>
      </SafeAreaView>
    );
  }

  const currentWord = session.words[session.currentIndex];
  const progress = session.currentIndex + 1;
  const progressPct = (progress / session.words.length) * 100;
  const daysAgo = 12; // Would come from headlist.lastReviewedAt in real impl

  const handleRemember = () => {
    markRemembered();
    setRevealed(false);
    if (session.currentIndex >= session.words.length - 1) {
      if (user) completeSession(user.uid);
    } else {
      nextWord();
    }
  };

  const handleForgot = () => {
    markForgot();
    setRevealed(false);
    if (session.currentIndex >= session.words.length - 1) {
      if (user) completeSession(user.uid);
    } else {
      nextWord();
    }
  };

  return (
    <SafeAreaView style={s.container}>
      {/* Header */}
      <View style={s.header}>
        <Pressable onPress={() => { resetSession(); router.back(); }}>
          <Text style={s.closeBtn}>✕</Text>
        </Pressable>
        <Text style={s.headerTitle}>Gold List</Text>
        <Text style={s.headerProgress}>{progress} / {session.words.length}</Text>
        <Pressable><Icon name="person.circle.fill" size={26} color={BLUE} /></Pressable>
      </View>

      {/* Progress Bar */}
      <View style={s.progressSection}>
        <View style={s.progressMeta}>
          <Text style={s.progressLabel}>CURRENT SESSION</Text>
          <Text style={s.progressPct}>{Math.round(progressPct)}% Complete</Text>
        </View>
        <View style={s.progressTrack}>
          <View style={[s.progressFill, { width: `${progressPct}%` }]} />
        </View>
      </View>

      {/* Word Card */}
      <View style={s.cardWrap}>
        <View style={s.wordCard}>
          {/* Cycle badge */}
          <View style={s.cycleBadge}>
            <Icon name="chart.bar.fill" size={14} color={BLUE} />
            <Text style={s.cycleTxt}>{currentWord.cycle + 1}{ordinal(currentWord.cycle + 1)} Distillation</Text>
          </View>

          {/* Word */}
          <View style={s.wordArea}>
            <Text style={s.wordLabel}>TARGET{'\n'}PHRASE</Text>
            <Text style={s.wordText}>{currentWord.word}</Text>
          </View>

          {/* Tap to reveal */}
          {!revealed ? (
            <Pressable onPress={() => setRevealed(true)} style={s.revealBtn}>
              <Icon name="person.circle.fill" size={18} color="#94A3B8" />
              <Text style={s.revealTxt}>Tap to reveal translation</Text>
            </Pressable>
          ) : (
            <View style={s.translationArea}>
              <View style={s.translationDivider} />
              <Text style={s.translationTxt}>{currentWord.translation}</Text>
              {currentWord.notes ? <Text style={s.notesTxt}>📝 {currentWord.notes}</Text> : null}
            </View>
          )}
        </View>
      </View>

      {/* Action Buttons */}
      <View style={s.actionRow}>
        <Pressable style={[s.actionBtn, s.forgotBtn]} onPress={handleForgot} disabled={loading}>
          <View style={s.actionIcon}>
            <Text style={s.forgotX}>✕</Text>
          </View>
          <Text style={s.forgotLabel}>FORGOT</Text>
        </Pressable>
        <Pressable style={[s.actionBtn, s.rememberedBtn]} onPress={handleRemember} disabled={loading}>
          <View style={s.actionIcon}>
            <Text style={s.rememberedCheck}>✓</Text>
          </View>
          <Text style={s.rememberedLabel}>REMEMBERED</Text>
        </Pressable>
      </View>

      {/* Footer stats */}
      <View style={s.footer}>
        <View style={s.footerStat}>
          <Icon name="clock.fill" size={14} color="#64748B" />
          <Text style={s.footerTxt}>Last reviewed {daysAgo} days ago</Text>
        </View>
        <View style={s.footerStat}>
          <Icon name="arrow.right.square.fill" size={14} color="#64748B" />
          <Text style={s.footerTxt}>{session.rememberedCount} Streak</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

function ordinal(n: number): string {
  if (n === 1) return 'st';
  if (n === 2) return 'nd';
  if (n === 3) return 'rd';
  return 'th';
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F7FD' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  loadingTxt: { color: '#64748B', fontSize: 16 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 14,
    backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9',
  },
  closeBtn: { fontSize: 18, color: BLUE, fontWeight: '700' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: BLUE,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif' },
  headerProgress: { fontSize: 14, fontWeight: '600', color: '#64748B' },
  progressSection: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 10 },
  progressMeta: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  progressLabel: { fontSize: 11, fontWeight: '700', color: '#94A3B8', letterSpacing: 1 },
  progressPct: { fontSize: 13, fontWeight: '700', color: BLUE },
  progressTrack: { height: 6, backgroundColor: '#E5E7EB', borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: BLUE, borderRadius: 3 },
  cardWrap: { flex: 1, paddingHorizontal: 20, paddingVertical: 12 },
  wordCard: {
    flex: 1, backgroundColor: '#FFFFFF', borderRadius: 20,
    padding: 24, borderWidth: 1, borderColor: '#E8EEF9',
    alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 10, elevation: 3,
  },
  cycleBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#EEF4FF', borderRadius: 20,
    paddingHorizontal: 12, paddingVertical: 6, alignSelf: 'flex-start', marginBottom: 'auto',
  },
  cycleTxt: { fontSize: 13, color: BLUE, fontWeight: '600' },
  wordArea: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 8 },
  wordLabel: { fontSize: 11, fontWeight: '700', color: '#94A3B8', letterSpacing: 1.2, textAlign: 'center' },
  wordText: {
    fontSize: 40, fontWeight: '800', color: '#0F172A', textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  revealBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    marginTop: 'auto', paddingVertical: 8,
  },
  revealTxt: { color: '#94A3B8', fontSize: 14 },
  translationArea: { marginTop: 'auto', alignItems: 'center', gap: 8, width: '100%' },
  translationDivider: { width: 40, height: 2, backgroundColor: '#E5E7EB', borderRadius: 1 },
  translationTxt: { fontSize: 22, color: '#475569', textAlign: 'center' },
  notesTxt: { fontSize: 13, color: '#94A3B8', fontStyle: 'italic', textAlign: 'center' },
  actionRow: { flexDirection: 'row', gap: 14, paddingHorizontal: 20, paddingBottom: 8 },
  actionBtn: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    gap: 10, paddingVertical: 20, borderRadius: 16, borderWidth: 2,
  },
  forgotBtn: { borderColor: '#EF4444', backgroundColor: '#FFF5F5' },
  rememberedBtn: { borderColor: '#22C55E', backgroundColor: '#F0FDF4' },
  actionIcon: {
    width: 44, height: 44, borderRadius: 22, borderWidth: 2,
    justifyContent: 'center', alignItems: 'center',
  },
  forgotX: { fontSize: 20, color: '#EF4444', fontWeight: '700' },
  rememberedCheck: { fontSize: 20, color: '#22C55E', fontWeight: '700' },
  forgotLabel: { fontSize: 13, fontWeight: '800', color: '#EF4444', letterSpacing: 1 },
  rememberedLabel: { fontSize: 13, fontWeight: '800', color: '#22C55E', letterSpacing: 1 },
  footer: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingHorizontal: 24, paddingBottom: 16, paddingTop: 8,
  },
  footerStat: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  footerTxt: { fontSize: 12, color: '#64748B' },
  doneTitle: { fontSize: 28, fontWeight: '800', color: '#0F172A', marginBottom: 24, textAlign: 'center' },
  resultsRow: { flexDirection: 'row', gap: 14, marginBottom: 20 },
  resultCard: {
    flex: 1, alignItems: 'center', padding: 24,
    backgroundColor: '#FFF', borderRadius: 16, borderWidth: 2,
  },
  resultNum: { fontSize: 40, fontWeight: '800', marginBottom: 4 },
  resultLabel: { fontSize: 14, color: '#64748B', fontWeight: '500' },
  resultNote: { textAlign: 'center', fontSize: 13, color: '#64748B', lineHeight: 20, marginBottom: 24, paddingHorizontal: 10 },
  doneBtn: {
    backgroundColor: BLUE, borderRadius: 14, paddingHorizontal: 40, paddingVertical: 16,
  },
  doneBtnTxt: { color: '#FFF', fontWeight: '700', fontSize: 16 },
});
