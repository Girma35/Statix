import React from 'react';
import { Tabs } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { Icon } from '@/components/icon';

const BLUE = '#0C5AC3';
const GRAY = '#9CA3AF';

function TabIcon({ name, focused }: { name: any; focused: boolean }) {
  return <Icon name={name} size={24} color={focused ? BLUE : GRAY} />;
}

function CreateTabIcon({ focused }: { focused: boolean }) {
  return (
    <View style={[ct.wrap, focused && ct.wrapActive]}>
      <Icon name="plus.circle.fill" size={22} color={focused ? '#FFFFFF' : GRAY} />
    </View>
  );
}

const ct = StyleSheet.create({
  wrap: {
    width: 48,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrapActive: { backgroundColor: BLUE },
});

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: BLUE,
        tabBarInactiveTintColor: GRAY,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#F1F5F9',
          borderTopWidth: 1,
          height: 64,
          paddingBottom: 10,
          paddingTop: 8,
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.07,
          shadowRadius: 10,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => <TabIcon name="house.fill" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: 'Create',
          tabBarIcon: ({ focused }) => <CreateTabIcon focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="headlists"
        options={{
          title: 'Progress',
          tabBarIcon: ({ focused }) => <TabIcon name="chart.bar.fill" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ focused }) => <TabIcon name="gearshape.fill" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="headlist/[id]"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="review/[id]"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
