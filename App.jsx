import React from 'react';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { OnboardingProvider, useOnboarding } from './src/context/OnboardingContext';
import OnboardingNavigator from './src/navigation/OnboardingNavigator';
import AppNavigator from './src/navigation/AppNavigator';

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
    <OnboardingProvider>
      <View style={styles.container}>
        <StatusBar style="light" />
        <RootNavigator />
      </View>
    </OnboardingProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B1220',
  },
});
