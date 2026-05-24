import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Pressable, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAuthStore } from '@/stores/useAuthStore';
import { useHeadlistStore } from '@/stores/useHeadlistStore';

export default function CreateListScreen() {
  const [listName, setListName] = useState('');
  const { user } = useAuthStore();
  const { createHeadlist } = useHeadlistStore();

  const handleCreate = async () => {
    if (!listName.trim() || !user) return;
    try {
      const id = await createHeadlist(user.uid, listName.trim());
      setListName('');
      // Navigate to the newly created headlist
      router.push(`/(tabs)/headlist/${id}`);
    } catch (error) {
      console.error('Failed to create list', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.push('/(tabs)/')} style={styles.headerIcon}>
          <Text style={styles.closeIcon}>✕</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Gold List</Text>
        <Pressable style={styles.headerIcon}>
          <Text style={styles.profileIcon}>👤</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Hero Card */}
        <View style={styles.heroCard}>
          <View style={styles.heroPattern} />
          <Text style={styles.heroTitle}>Start a New Journey</Text>
          <Text style={styles.heroSubtitle}>
            The Gold List method uses a systematic 14-day distillation process to move vocabulary from short-term to long-term memory effortlessly.
          </Text>
          <Text style={styles.watermarkIcon}>📖</Text>
        </View>

        {/* Input Form */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>LIST NAME</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., German Adjectives, SQL Basics..."
            placeholderTextColor="#9CA3AF"
            value={listName}
            onChangeText={setListName}
          />
        </View>

        {/* Feature Cards */}
        <View style={styles.featureCard}>
          <View style={[styles.featureIconContainer, { backgroundColor: '#208AEF' }]}>
            <Text style={styles.featureIcon}>⚗️</Text>
          </View>
          <View style={styles.featureTextContainer}>
            <Text style={styles.featureTitle}>Distill Every 2 Weeks</Text>
            <Text style={styles.featureDesc}>
              Review your list and remove 30% of what you've naturally memorized.
            </Text>
          </View>
        </View>

        <View style={styles.featureCard}>
          <View style={[styles.featureIconContainer, { backgroundColor: '#4ADE80' }]}>
            <Text style={styles.featureIcon}>🧠</Text>
          </View>
          <View style={styles.featureTextContainer}>
            <Text style={styles.featureTitle}>Long-term Retention</Text>
            <Text style={styles.featureDesc}>
              No rote memorization required. Your brain filters the essential data.
            </Text>
          </View>
        </View>

        {/* Create Button */}
        <Pressable
          style={[styles.createButton, !listName.trim() && styles.createButtonDisabled]}
          onPress={handleCreate}
          disabled={!listName.trim()}
        >
          <Text style={styles.createButtonText}>Create List ➔</Text>
        </Pressable>

        {/* Footer */}
        <Text style={styles.footerText}>
          By creating a list, you're starting your first Headlist.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerIcon: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIcon: {
    fontSize: 20,
    color: '#0C5AC3',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0C5AC3',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  profileIcon: {
    fontSize: 24,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  heroCard: {
    backgroundColor: '#F0F4FA',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  heroPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1,
    // A simple dots trick could be applied here with a tiled image if available, but omitting for now.
  },
  watermarkIcon: {
    position: 'absolute',
    right: -20,
    bottom: -20,
    fontSize: 120,
    opacity: 0.05,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0C5AC3',
    marginBottom: 12,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  heroSubtitle: {
    fontSize: 15,
    color: '#475569',
    lineHeight: 24,
    paddingRight: 40,
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 1,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#0F172A',
  },
  featureCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  featureIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureIcon: {
    fontSize: 24,
    color: '#FFFFFF',
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  featureDesc: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 20,
  },
  createButton: {
    backgroundColor: '#0C5AC3',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  createButtonDisabled: {
    opacity: 0.5,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  footerText: {
    textAlign: 'center',
    fontSize: 13,
    color: '#64748B',
  },
});
