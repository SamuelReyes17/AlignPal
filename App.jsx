import React from 'react';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { ConvexProvider, ConvexReactClient } from 'convex/react';
import { OnboardingProvider, useOnboarding } from './src/context/OnboardingContext';
import { SubscriptionProvider } from './src/context/SubscriptionContext';
import OnboardingNavigator from './src/navigation/OnboardingNavigator';
import AppNavigator from './src/navigation/AppNavigator';

const convexUrl = process.env.EXPO_PUBLIC_CONVEX_URL;
if (!convexUrl) {
  throw new Error(
    'Missing EXPO_PUBLIC_CONVEX_URL. Add it to .env.local (from `npx convex dev` or the Convex dashboard).'
  );
}
const convex = new ConvexReactClient(convexUrl);

function RootNavigator() {
  const { isOnboardingComplete } = useOnboarding();

  return (
    <NavigationContainer>
      {isOnboardingComplete ? (
        <AppNavigator key="main-app" />
      ) : (
        <OnboardingNavigator key="onboarding" />
      )}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ConvexProvider client={convex}>
      <SubscriptionProvider>
        <OnboardingProvider>
          <View style={styles.container}>
            <StatusBar style="light" />
            <RootNavigator />
          </View>
        </OnboardingProvider>
      </SubscriptionProvider>
    </ConvexProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B1220',
  },
});
