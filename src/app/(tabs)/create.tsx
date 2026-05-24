import React, { useState } from 'react';
import {
  StyleSheet, View, Text, TextInput, Pressable,
  ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAuthStore } from '@/stores/useAuthStore';
import { useHeadlistStore } from '@/stores/useHeadlistStore';

const BLUE = '#0C5AC3';

export default function CreateListScreen() {
  const [listName, setListName] = useState('');
  const { user } = useAuthStore();
  const { createHeadlist } = useHeadlistStore();

  const handleCreate = async () => {
    if (!listName.trim() || !user) return;
    try {
      const id = await createHeadlist(user.uid, listName.trim());
      setListName('');
      router.push(`/(tabs)/headlist/${id}`);
    } catch (error) {
      console.error('Failed to create list', error);
    }
  };

  return (
    <SafeAreaView style={s.container}>
      {/* Header */}
      <View style={s.header}>
        <Pressable onPress={() => router.push('/(tabs)/')} style={s.headerBtn}>
          <Text style={s.closeBtn}>✕</Text>
        </Pressable>
        <Text style={s.headerTitle}>Gold List</Text>
        <View style={s.headerBtn}>
          <Text style={s.profileIcon}>👤</Text>
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
          {/* Hero Card */}
          <View style={s.heroCard}>
            <View style={s.heroContent}>
              <Text style={s.heroTitle}>Start a New Journey</Text>
              <Text style={s.heroSub}>
                The Gold List method uses a systematic 14-day distillation
                process to move vocabulary from short-term to long-term memory
                effortlessly.
              </Text>
            </View>
            <Text style={s.heroWatermark}>📖</Text>
          </View>

          {/* Input */}
          <View style={s.formGroup}>
            <Text style={s.label}>LIST NAME</Text>
            <TextInput
              style={s.input}
              placeholder="e.g., German Adjectives, SQL Basics..."
              placeholderTextColor="#9CA3AF"
              value={listName}
              onChangeText={setListName}
            />
          </View>

          {/* Feature Cards */}
          <View style={s.featureCard}>
            <View style={[s.featureIcon, { backgroundColor: BLUE }]}>
              <Text style={s.featureEmoji}>⚗️</Text>
            </View>
            <View style={s.featureText}>
              <Text style={s.featureTitle}>Distill Every 2 Weeks</Text>
              <Text style={s.featureSub}>
                Review your list and remove 30% of what you've naturally memorized.
              </Text>
            </View>
          </View>

          <View style={s.featureCard}>
            <View style={[s.featureIcon, { backgroundColor: '#22C55E' }]}>
              <Text style={s.featureEmoji}>🧠</Text>
            </View>
            <View style={s.featureText}>
              <Text style={s.featureTitle}>Long-term Retention</Text>
              <Text style={s.featureSub}>
                No rote memorization required. Your brain filters the essential data.
              </Text>
            </View>
          </View>

          {/* Button */}
          <Pressable
            style={[s.btn, !listName.trim() && s.btnDisabled]}
            onPress={handleCreate}
            disabled={!listName.trim()}
          >
            <Text style={s.btnText}>Create List  ➔</Text>
          </Pressable>

          <Text style={s.footer}>By creating a list, you're starting your first Headlist.</Text>
          <View style={{ height: 30 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  closeBtn: { fontSize: 18, color: BLUE, fontWeight: '700' },
  headerTitle: {
    fontSize: 20, fontWeight: '800', color: BLUE,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  profileIcon: { fontSize: 24 },
  scroll: { padding: 20 },
  heroCard: {
    backgroundColor: '#EEF4FF',
    borderRadius: 18,
    padding: 24,
    borderWidth: 1,
    borderColor: '#DBEAFE',
    marginBottom: 28,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  heroContent: { flex: 1, paddingRight: 10 },
  heroTitle: {
    fontSize: 20, fontWeight: '800', color: BLUE, marginBottom: 10,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  heroSub: { fontSize: 14, color: '#475569', lineHeight: 22 },
  heroWatermark: {
    fontSize: 80,
    opacity: 0.12,
    position: 'absolute',
    right: -10,
    bottom: -10,
  },
  formGroup: { marginBottom: 24 },
  label: {
    fontSize: 11, fontWeight: '700', color: '#64748B',
    letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#0F172A',
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E8EEF9',
    marginBottom: 14,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  featureEmoji: { fontSize: 24 },
  featureText: { flex: 1 },
  featureTitle: { fontSize: 15, fontWeight: '700', color: '#0F172A', marginBottom: 4 },
  featureSub: { fontSize: 13, color: '#64748B', lineHeight: 19 },
  btn: {
    backgroundColor: BLUE,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 16,
    elevation: 4,
    shadowColor: BLUE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  btnDisabled: { opacity: 0.45 },
  btnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  footer: { textAlign: 'center', fontSize: 13, color: '#94A3B8' },
});
