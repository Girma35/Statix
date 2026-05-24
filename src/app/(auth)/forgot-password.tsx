import { useState } from 'react';
import { StyleSheet, TextInput, Pressable, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/stores/useAuthStore';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const { resetPassword, loading, error, clearError } = useAuthStore();
  const theme = useTheme();

  const handleReset = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }
    await resetPassword(email);
    setSent(true);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.inner}>
        <ThemedView style={styles.header}>
          <ThemedText type="title">Reset Password</ThemedText>
          <ThemedText themeColor="textSecondary" style={styles.subtitle}>
            {sent
              ? 'Check your email for reset instructions'
              : 'Enter your email to receive reset instructions'}
          </ThemedText>
        </ThemedView>

        {error && (
          <ThemedView style={styles.errorBox}>
            <ThemedText style={styles.errorText}>{error}</ThemedText>
            <Pressable onPress={clearError}>
              <ThemedText type="link">Dismiss</ThemedText>
            </Pressable>
          </ThemedView>
        )}

        {!sent && (
          <ThemedView style={styles.form}>
            <TextInput
              style={[styles.input, { backgroundColor: theme.backgroundElement, color: theme.text, borderColor: theme.backgroundSelected }]}
              placeholder="Email"
              placeholderTextColor={theme.textSecondary}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <Pressable
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleReset}
              disabled={loading}
            >
              <ThemedText style={styles.buttonText}>
                {loading ? 'Sending...' : 'Send Reset Email'}
              </ThemedText>
            </Pressable>
          </ThemedView>
        )}

        <Link href="/(auth)" asChild>
          <Pressable style={styles.linkButton}>
            <ThemedText type="link">Back to Log In</ThemedText>
          </Pressable>
        </Link>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: { flex: 1, justifyContent: 'center', paddingHorizontal: Spacing.four },
  header: { alignItems: 'center', marginBottom: Spacing.six, gap: Spacing.two },
  subtitle: { textAlign: 'center' },
  errorBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.three,
    backgroundColor: '#FEE2E2',
    borderRadius: Spacing.two,
    marginBottom: Spacing.three,
  },
  errorText: { color: '#DC2626', flex: 1 },
  form: { gap: Spacing.three },
  input: {
    borderWidth: 1,
    borderRadius: Spacing.two,
    padding: Spacing.three,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#208AEF',
    padding: Spacing.three,
    borderRadius: Spacing.two,
    alignItems: 'center',
    marginTop: Spacing.two,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  linkButton: { alignItems: 'center', paddingVertical: Spacing.three },
});
