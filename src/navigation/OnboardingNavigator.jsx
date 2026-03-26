import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from '../screens/onboarding/WelcomeScreen';
import PainLocationScreen from '../screens/onboarding/PainLocationScreen';
import PainDetailsScreen from '../screens/onboarding/PainDetailsScreen';
import LifestyleScreen from '../screens/onboarding/LifestyleScreen';
import DisclaimerScreen from '../screens/onboarding/DisclaimerScreen';
import ResultsScreen from '../screens/onboarding/ResultsScreen';
import UpgradeScreen from '../screens/onboarding/UpgradeScreen';

const Stack = createStackNavigator();

export default function OnboardingNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#0E1625' },
        animationEnabled: true,
      }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="PainLocation" component={PainLocationScreen} />
      <Stack.Screen name="PainDetails" component={PainDetailsScreen} />
      <Stack.Screen name="Lifestyle" component={LifestyleScreen} />
      <Stack.Screen name="Disclaimer" component={DisclaimerScreen} />
      <Stack.Screen name="Results" component={ResultsScreen} />
      <Stack.Screen name="Upgrade" component={UpgradeScreen} />
    </Stack.Navigator>
  );
}
