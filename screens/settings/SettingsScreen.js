import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Ionicons } from '@expo/vector-icons';
import ProfileScreen from './settings/ProfileScreen';
import PointsScreen from './settings/PointsScreen';
import WithdrawScreen from './settings/WithdrawScreen';

const Tab = createMaterialTopTabNavigator();

export default function SettingsScreen() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#16a34a',
        tabBarIndicatorStyle: { backgroundColor: '#16a34a' },
      }}
    >
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profil',
          tabBarIcon: ({ color }) => (
            <Ionicons name="person-outline" size={20} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Points"
        component={PointsScreen}
        options={{
          tabBarLabel: 'Points',
          tabBarIcon: ({ color }) => (
            <Ionicons name="star-outline" size={20} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Withdraw"
        component={WithdrawScreen}
        options={{
          tabBarLabel: 'Retrait',
          tabBarIcon: ({ color }) => (
            <Ionicons name="cash-outline" size={20} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
