import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import DashboardScreen from '../screens/DashboardScreen';
import HistoryScreen from '../screens/HistoryScreen';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Dashboard') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'History') {
              iconName = focused ? 'time' : 'time-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#73A3FF',
          tabBarInactiveTintColor: '#8090AA',
          tabBarStyle: {
            backgroundColor: '#101A2F',
            borderTopWidth: 0,
            paddingBottom: 8,
            paddingTop: 8,
            height: 70,
            shadowColor: '#060B16',
            shadowOffset: { width: 0, height: -8 },
            shadowOpacity: 0.25,
            shadowRadius: 14,
            elevation: 16,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
            letterSpacing: 0.25,
          },
          tabBarItemStyle: {
            borderRadius: 14,
            marginHorizontal: 6,
          },
          headerShown: false,
        })}
      >
        <Tab.Screen 
          name="Dashboard" 
          component={DashboardScreen}
          options={{
            tabBarLabel: 'Dashboard',
          }}
        />
        <Tab.Screen 
          name="History" 
          component={HistoryScreen}
          options={{
            tabBarLabel: 'History',
          }}
        />
      </Tab.Navigator>
  );
}
