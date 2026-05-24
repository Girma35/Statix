import { Tabs } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/use-theme';

function HomeIcon({ color }: { color: string }) {
  return <Text style={{ fontSize: 22 }}>🏠</Text>;
}
function ProgressIcon({ color }: { color: string }) {
  return <Text style={{ fontSize: 22 }}>📊</Text>;
}
function SettingsIcon({ color }: { color: string }) {
  return <Text style={{ fontSize: 22 }}>⚙️</Text>;
}
function CreateIcon({ focused }: { focused: boolean }) {
  return (
    <View style={[tabStyles.createIcon, focused && tabStyles.createIconFocused]}>
      <Text style={[tabStyles.createPlus, focused && tabStyles.createPlusFocused]}>+</Text>
    </View>
  );
}

const tabStyles = StyleSheet.create({
  createIcon: {
    width: 44,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  createIconFocused: {
    backgroundColor: '#0C5AC3',
  },
  createPlus: {
    fontSize: 22,
    fontWeight: '700',
    color: '#9CA3AF',
    lineHeight: 26,
  },
  createPlusFocused: {
    color: '#FFFFFF',
  },
});

export default function TabLayout() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#0C5AC3',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#F1F5F9',
          borderTopWidth: 1,
          height: 64,
          paddingBottom: 10,
          paddingTop: 8,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.06,
          shadowRadius: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <HomeIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: 'Create',
          tabBarIcon: ({ focused }) => <CreateIcon focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="headlists"
        options={{
          title: 'Progress',
          tabBarIcon: ({ color }) => <ProgressIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <SettingsIcon color={color} />,
        }}
      />
    </Tabs>
  );
}
