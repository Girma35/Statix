import { Tabs } from 'expo-router';
import { useTheme } from '@/hooks/use-theme';
import { Colors } from '@/constants/theme';

export default function TabLayout() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#208AEF',
        tabBarInactiveTintColor: theme.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.background,
          borderTopColor: theme.backgroundSelected,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => null, // Will use text-based tabs
        }}
      />
      <Tabs.Screen
        name="headlists"
        options={{
          title: 'Headlists',
          tabBarIcon: ({ color, size }) => null,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => null,
        }}
      />
    </Tabs>
  );
}
