import React from 'react';
import { Tabs } from 'expo-router';
import { useLocalization } from '@/contexts/LocalizationContext';
import { Colors } from '@/constants/Colors';
import { Chrome as Home, History, Settings } from 'lucide-react-native';

export default function TabLayout() {
  const { t } = useLocalization();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary.main,
        tabBarInactiveTintColor: Colors.neutral[500],
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopColor: Colors.neutral[300],
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarLabelStyle: {
          fontFamily: 'Inter-Regular',
          fontSize: 12,
        },
        headerStyle: {
          backgroundColor: Colors.primary.dark,
        },
        headerTintColor: Colors.white,
        headerTitleStyle: {
          fontFamily: 'Inter-SemiBold',
          fontSize: 18,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('newGame'),
          tabBarLabel: t('newGame'),
          tabBarIcon: ({ color, size }) => (
            <Home color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="game"
        options={{
          title: t('currentGame'),
          tabBarLabel: t('currentGame'),
          tabBarIcon: ({ color, size }) => (
            <Settings color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: t('history'),
          tabBarLabel: t('history'),
          tabBarIcon: ({ color, size }) => (
            <History color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}