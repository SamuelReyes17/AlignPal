import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/brand';

import DashboardScreen       from '../screens/DashboardScreen';
import WorkoutScreen         from '../screens/WorkoutScreen';
import HistoryScreen         from '../screens/HistoryScreen';
import ExploreScreen         from '../screens/ExploreScreen';
import ProfileScreen         from '../screens/ProfileScreen';
import RecoverySessionScreen from '../screens/RecoverySessionScreen';

const Tab   = createBottomTabNavigator();
const Stack = createStackNavigator();

const TABS = [
  { name: 'Home',    label: 'Home',    icon: 'home',        component: DashboardScreen },
  { name: 'Workout', label: 'Workout', icon: 'barbell',     component: WorkoutScreen   },
  { name: 'Progress',label: 'Progress',icon: 'trending-up', component: HistoryScreen   },
  { name: 'Explore', label: 'Explore', icon: 'compass',     component: ExploreScreen   },
  { name: 'Me',      label: 'Me',      icon: 'person',      component: ProfileScreen   },
];

const fadeTransition = {
  cardStyleInterpolator: ({ current }) => ({
    cardStyle: { opacity: current.progress },
  }),
};

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          const tab = TABS.find(t => t.name === route.name);
          return (
            <Ionicons
              name={focused ? tab.icon : `${tab.icon}-outline`}
              size={size}
              color={color}
            />
          );
        },
        tabBarActiveTintColor:   Colors.purple,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarStyle: {
          backgroundColor: Colors.bgCard,
          borderTopWidth: 1,
          borderTopColor: Colors.borderSubtle,
          paddingBottom: 8,
          paddingTop: 8,
          height: 70,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -8 },
          shadowOpacity: 0.25,
          shadowRadius: 14,
          elevation: 16,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700',
          letterSpacing: 0.2,
          marginTop: 1,
        },
        tabBarItemStyle: {
          borderRadius: 14,
          marginHorizontal: 2,
        },
        headerShown: false,
      })}
    >
      {TABS.map(tab => (
        <Tab.Screen
          key={tab.name}
          name={tab.name}
          component={tab.component}
          options={{ tabBarLabel: tab.label }}
        />
      ))}
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, cardStyle: { flex: 1 } }}>
      <Stack.Screen name="Tabs" component={TabNavigator} />
      <Stack.Screen
        name="RecoverySession"
        component={RecoverySessionScreen}
        options={{ gestureEnabled: false, ...fadeTransition }}
      />
    </Stack.Navigator>
  );
}
