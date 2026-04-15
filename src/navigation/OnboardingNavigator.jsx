/**
 * OnboardingNavigator
 *
 * New flow (6 steps + paywall):
 *   Welcome → PainLocation → PainDetails → Lifestyle → Disclaimer
 *   → PainProfile (AI reveal) → Day1Protocol → Upgrade
 */

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import WelcomeScreen       from '../screens/onboarding/WelcomeScreen';
import PainLocationScreen  from '../screens/onboarding/PainLocationScreen';
import PainDetailsScreen   from '../screens/onboarding/PainDetailsScreen';
import LifestyleScreen     from '../screens/onboarding/LifestyleScreen';
import DisclaimerScreen    from '../screens/onboarding/DisclaimerScreen';
import PainProfileScreen   from '../screens/onboarding/PainProfileScreen';
import Day1ProtocolScreen  from '../screens/onboarding/Day1ProtocolScreen';
import UpgradeScreen       from '../screens/onboarding/UpgradeScreen';

const Stack = createStackNavigator();

export default function OnboardingNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#0E1625' },
        animationEnabled: true,
        cardStyleInterpolator: ({ current, layouts }) => ({
          cardStyle: {
            transform: [
              {
                translateX: current.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [layouts.screen.width, 0],
                }),
              },
            ],
          },
        }),
      }}
    >
      {/* Step 0 — Hook */}
      <Stack.Screen name="Welcome"       component={WelcomeScreen} />

      {/* Step 1 — Where does it hurt? */}
      <Stack.Screen name="PainLocation"  component={PainLocationScreen} />

      {/* Step 2 — Pain details (intensity, type, duration, triggers) */}
      <Stack.Screen name="PainDetails"   component={PainDetailsScreen} />

      {/* Step 3 — Lifestyle snapshot */}
      <Stack.Screen name="Lifestyle"     component={LifestyleScreen} />

      {/* Step 4 — Disclaimer */}
      <Stack.Screen name="Disclaimer"    component={DisclaimerScreen} />

      {/* Step 5 — AI Pain Profile reveal */}
      <Stack.Screen name="PainProfile"   component={PainProfileScreen} />

      {/* Step 6 — Day 1 Protocol (prove value before paywall) */}
      <Stack.Screen name="Day1Protocol"  component={Day1ProtocolScreen} />

      {/* Paywall */}
      <Stack.Screen name="Upgrade"       component={UpgradeScreen} />
    </Stack.Navigator>
  );
}
