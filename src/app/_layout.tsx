import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useAuthStore } from '@/stores/useAuthStore';
import { useTheme } from '@/hooks/use-theme';
import { Colors } from '@/constants/theme';

export default function RootLayout() {
  const { user, loading, initialized, initialize } = useAuthStore();
  const theme = useTheme();

  useEffect(() => {
    const unsub = initialize();
    return () => unsub();
  }, []);

  if (!initialized || loading) {
    return (
      <View style={[styles.loading, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={Colors.light.text} />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.background },
      }}
    >
      {user ? (
        <Stack.Screen name="(tabs)" />
      ) : (
        <Stack.Screen name="(auth)" />
      )}
    </Stack>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
