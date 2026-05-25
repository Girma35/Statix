import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, Text, Pressable, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAuthStore } from '@/stores/useAuthStore';
import { Icon } from '@/components/icon';

const BLUE = '#0C5AC3';
const BG = '#F4F7FD';

interface SettingRowProps {
  iconName: string;
  label: string;
  value?: string;
  onPress?: () => void;
  external?: boolean;
  danger?: boolean;
}

function SettingRow({ iconName, label, value, onPress, external, danger }: SettingRowProps) {
  return (
    <Pressable onPress={onPress} style={r.row}>
      <View style={r.rowLeft}>
        <Icon name={iconName as any} size={22} color={danger ? '#EF4444' : '#475569'} />
        <Text style={[r.rowLabel, danger && { color: '#EF4444' }]}>{label}</Text>
      </View>
      <View style={r.rowRight}>
        {value && <Text style={r.rowValue}>{value}</Text>}
        <Icon name={external ? 'arrow.up.right.square' : 'chevron.right'} size={16} color="#CBD5E1" />
      </View>
    </Pressable>
  );
}

const r = StyleSheet.create({
  row: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingVertical: 15, paddingHorizontal: 18,
  },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  rowLabel: { fontSize: 15, fontWeight: '500', color: '#0F172A' },
  rowRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  rowValue: { fontSize: 13, color: BLUE, fontWeight: '600' },
});

export default function SettingsScreen() {
  const { user, profile, logOut, deleteAccount, loading, error } = useAuthStore();
  const streak = profile?.streak ?? 0;
  const level = streak >= 30 ? 'PLATINUM LEVEL' : streak >= 14 ? 'GOLD LEVEL' : 'SILVER LEVEL';

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: logOut },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This will permanently delete your profile, all headlists, words, and progress data. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Everything',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Are you absolutely sure?',
              'All your vocabulary lists, streaks, and progress will be lost forever.',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: deleteAccount },
              ]
            );
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={s.container}>
      {/* Header */}
      <View style={s.header}>
        <Pressable><Icon name="house.fill" size={22} color={BLUE} /></Pressable>
        <Text style={s.headerTitle}>Gold List</Text>
        <Pressable><Icon name="person.circle.fill" size={26} color={BLUE} /></Pressable>
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <Text style={s.pageTitle}>Settings</Text>
        <Text style={s.pageSub}>Customize your Gold List learning experience.</Text>

        {/* Profile Card */}
        <View style={s.profileCard}>
          <View style={s.avatar}>
            <Icon name="person.fill" size={38} color="#FFFFFF" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.profileName}>{profile?.displayName || 'Learner'}</Text>
            <Text style={s.profileBadge}>{streak} DAY STREAK • {level}</Text>
          </View>
        </View>

        {/* Settings Group 1 */}
        <View style={s.group}>
          <SettingRow iconName="person.fill" label="Account" onPress={() => {}} />
          <View style={s.divider} />
          <SettingRow iconName="bell.fill" label="Notifications" onPress={() => {}} />
          <View style={s.divider} />
          <SettingRow iconName="clock.fill" label="Study Reminders" value="Daily 9:00 AM" onPress={() => {}} />
        </View>

        {/* Legal */}
        <View style={s.group}>
          <SettingRow iconName="info.circle.fill" label="Privacy Policy" onPress={() => router.push('/(tabs)/legal' as any)} />
          <View style={s.divider} />
          <SettingRow iconName="questionmark.circle.fill" label="Terms of Service" onPress={() => router.push('/(tabs)/legal?tab=terms' as any)} />
        </View>

        {/* Error */}
        {error && (
          <View style={s.errorBox}>
            <Text style={s.errorTxt}>{error}</Text>
          </View>
        )}

        {/* Delete Account */}
        <Pressable style={s.deleteBtn} onPress={handleDeleteAccount} disabled={loading}>
          <Icon name="person.circle.fill" size={22} color="#EF4444" />
          <Text style={s.deleteTxt}>{loading ? 'Deleting...' : 'Delete Account'}</Text>
        </Pressable>

        {/* Logout Button */}
        <Pressable style={s.logoutBtn} onPress={handleLogout} disabled={loading}>
          <Icon name="arrow.right.square.fill" size={22} color="#0F172A" />
          <Text style={s.logoutTxt}>{loading ? 'Logging out...' : 'Log Out'}</Text>
        </Pressable>

        <Text style={s.version}>Version 2.4.1 (Build 890)</Text>
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
  scroll: { padding: 20, gap: 16 },
  pageTitle: { fontSize: 28, fontWeight: '800', color: '#0F172A' },
  pageSub: { fontSize: 14, color: '#64748B', lineHeight: 20 },
  profileCard: {
    backgroundColor: '#FFF', borderRadius: 16, padding: 18,
    flexDirection: 'row', alignItems: 'center', gap: 16,
    borderWidth: 1, borderColor: '#E8EEF9',
  },
  avatar: {
    width: 58, height: 58, borderRadius: 29,
    backgroundColor: '#94A3B8',
    justifyContent: 'center', alignItems: 'center',
  },
  profileName: { fontSize: 18, fontWeight: '700', color: '#0F172A', marginBottom: 4 },
  profileBadge: { fontSize: 12, fontWeight: '700', color: '#22C55E', letterSpacing: 0.5 },
  group: {
    backgroundColor: '#FFF', borderRadius: 16,
    borderWidth: 1, borderColor: '#E8EEF9', overflow: 'hidden',
  },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginLeft: 54 },
  errorBox: { backgroundColor: '#FEF2F2', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: '#FECACA' },
  errorTxt: { fontSize: 14, color: '#DC2626', textAlign: 'center' },
  deleteBtn: {
    backgroundColor: '#FEF2F2', borderRadius: 16, borderWidth: 1, borderColor: '#FECACA',
    paddingVertical: 16, paddingHorizontal: 18,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12,
  },
  deleteTxt: { fontSize: 16, fontWeight: '600', color: '#EF4444' },
  logoutBtn: {
    backgroundColor: '#FFF', borderRadius: 16, borderWidth: 1, borderColor: '#E8EEF9',
    paddingVertical: 16, paddingHorizontal: 18,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12,
  },
  logoutTxt: { fontSize: 16, fontWeight: '600', color: '#0F172A' },
  version: { textAlign: 'center', fontSize: 12, color: '#94A3B8' },
});
