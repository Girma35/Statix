import { useState } from 'react';
import { StyleSheet, ScrollView, Pressable, TextInput, Alert, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/stores/useAuthStore';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function SettingsScreen() {
  const { user, profile, logOut, loading } = useAuthStore();
  const theme = useTheme();
  const [editingProfile, setEditingProfile] = useState(false);
  const [displayName, setDisplayName] = useState(profile?.displayName || '');

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: logOut },
    ]);
  };

  const handleSaveProfile = async () => {
    if (!displayName.trim()) return;
    const { updateProfile } = useAuthStore.getState();
    await updateProfile({ displayName: displayName.trim() });
    setEditingProfile(false);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <ThemedView style={styles.header}>
          <ThemedText type="title">Settings</ThemedText>
        </ThemedView>

        {/* Profile Section */}
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">Profile</ThemedText>
          <ThemedView type="backgroundElement" style={styles.card}>
            {editingProfile ? (
              <View style={styles.editRow}>
                <TextInput
                  style={[styles.input, { backgroundColor: theme.background, color: theme.text, borderColor: theme.backgroundSelected }]}
                  value={displayName}
                  onChangeText={setDisplayName}
                  placeholder="Display Name"
                  placeholderTextColor={theme.textSecondary}
                  autoFocus
                />
                <View style={styles.editActions}>
                  <Pressable style={styles.cancelBtn} onPress={() => setEditingProfile(false)}>
                    <ThemedText>Cancel</ThemedText>
                  </Pressable>
                  <Pressable style={styles.saveBtn} onPress={handleSaveProfile}>
                    <ThemedText style={{ color: '#FFFFFF' }}>Save</ThemedText>
                  </Pressable>
                </View>
              </View>
            ) : (
              <View style={styles.profileRow}>
                <View>
                  <ThemedText style={styles.profileName}>{profile?.displayName || 'User'}</ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">{profile?.email}</ThemedText>
                </View>
                <Pressable
                  style={styles.editBtn}
                  onPress={() => {
                    setDisplayName(profile?.displayName || '');
                    setEditingProfile(true);
                  }}
                >
                  <ThemedText type="link">Edit</ThemedText>
                </Pressable>
              </View>
            )}
          </ThemedView>
        </ThemedView>

        {/* Stats Section */}
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">Stats</ThemedText>
          <ThemedView type="backgroundElement" style={styles.card}>
            <View style={styles.statRow}>
              <ThemedText>Total Words Learned</ThemedText>
              <ThemedText style={styles.statValue}>{profile?.totalWordsLearned ?? 0}</ThemedText>
            </View>
            <View style={styles.statRow}>
              <ThemedText>Day Streak</ThemedText>
              <ThemedText style={styles.statValue}>🔥 {profile?.streak ?? 0}</ThemedText>
            </View>
            <View style={styles.statRow}>
              <ThemedText>Member Since</ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}
              </ThemedText>
            </View>
          </ThemedView>
        </ThemedView>

        {/* Account Section */}
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">Account</ThemedText>
          <ThemedView type="backgroundElement" style={styles.card}>
            <Pressable style={styles.logoutButton} onPress={handleLogout} disabled={loading}>
              <ThemedText style={{ color: '#DC2626', fontSize: 16 }}>
                {loading ? 'Logging out...' : 'Log Out'}
              </ThemedText>
            </Pressable>
          </ThemedView>
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: Spacing.four, gap: Spacing.four, paddingBottom: 100 },
  header: { marginBottom: Spacing.two },
  section: { gap: Spacing.three },
  card: {
    padding: Spacing.three,
    borderRadius: Spacing.two,
    gap: Spacing.two,
  },
  profileRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileName: { fontSize: 18, fontWeight: '600' },
  editBtn: { padding: Spacing.one },
  editRow: { gap: Spacing.two },
  input: {
    borderWidth: 1,
    borderRadius: Spacing.two,
    padding: Spacing.two,
    fontSize: 16,
  },
  editActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: Spacing.two,
  },
  cancelBtn: { paddingVertical: Spacing.one, paddingHorizontal: Spacing.three },
  saveBtn: {
    backgroundColor: '#208AEF',
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.four,
    borderRadius: Spacing.two,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.two,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  statValue: { fontWeight: '600' },
  logoutButton: {
    alignItems: 'center',
    padding: Spacing.two,
  },
});
