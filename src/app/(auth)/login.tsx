import { useState } from 'react';
import { StyleSheet, TextInput, Pressable, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Link, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/stores/useAuthStore';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { logIn, loading, error, clearError } = useAuthStore();
  const theme = useTheme();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    await logIn(email, password);
    // If login succeeds, user state will be set and layout will redirect
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.inner}>
        <ThemedView style={styles.header}>
          <ThemedText type="title">Welcome Back</ThemedText>
          <ThemedText themeColor="textSecondary" style={styles.subtitle}>
            Log in to continue learning
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
          <TextInput
            style={[styles.input, { backgroundColor: theme.backgroundElement, color: theme.text, borderColor: theme.backgroundSelected }]}
            placeholder="Password"
            placeholderTextColor={theme.textSecondary}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <Pressable
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            <ThemedText style={styles.buttonText}>
              {loading ? 'Logging in...' : 'Log In'}
            </ThemedText>
          </Pressable>

          <Link href="/(auth)/signup" asChild>
            <Pressable style={styles.linkButton}>
              <ThemedText type="link">Don't have an account? Sign Up</ThemedText>
            </Pressable>
          </Link>

          <Link href="/(auth)/forgot-password" asChild>
            <Pressable style={styles.linkButton}>
              <ThemedText type="link">Forgot Password?</ThemedText>
            </Pressable>
          </Link>
        </ThemedView>
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
  linkButton: { alignItems: 'center', paddingVertical: Spacing.one },
});
