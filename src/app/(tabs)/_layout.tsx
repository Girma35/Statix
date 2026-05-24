import { Tabs } from 'expo-router';
import { View, Text } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { Colors } from '@/constants/theme';

export default function TabLayout() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#0C5AC3',
        tabBarInactiveTintColor: theme.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.background,
          borderTopColor: theme.backgroundSelected,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: 20, color }}>🏠</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: 'Create',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={{
              width: 48,
              height: 36,
              backgroundColor: focused ? '#0C5AC3' : '#E5E7EB',
              borderRadius: 12,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <Text style={{ color: focused ? '#FFFFFF' : '#9CA3AF', fontSize: 20, fontWeight: 'bold' }}>+</Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="headlists"
        options={{
          title: 'Progress',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: 20, color }}>📊</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: 20, color }}>⚙️</Text>
          ),
        }}
      />
    </Tabs>
  );
}
