import 'react-native-gesture-handler';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ConvexProvider, ConvexReactClient } from 'convex/react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { OnboardingProvider, useOnboarding } from './src/context/OnboardingContext';
import { SubscriptionProvider } from './src/context/SubscriptionContext';
import OnboardingNavigator from './src/navigation/OnboardingNavigator';
import AppNavigator from './src/navigation/AppNavigator';
import RecoverySessionScreen from './src/screens/RecoverySessionScreen';

const convexUrl = process.env.EXPO_PUBLIC_CONVEX_URL;
if (!convexUrl) {
  throw new Error(
    'Missing EXPO_PUBLIC_CONVEX_URL. Add it to .env.local (from `npx convex dev` or the Convex dashboard).'
  );
}
const convex = new ConvexReactClient(convexUrl);

const AppStack = createStackNavigator();

function AppStackNavigator() {
  return (
    <AppStack.Navigator screenOptions={{ headerShown: false, cardStyle: { flex: 1 } }}>
      <AppStack.Screen name="AppTabs" component={AppNavigator} />
      <AppStack.Screen
        name="RecoverySession"
        component={RecoverySessionScreen}
        options={{
          gestureEnabled: false,
          cardStyle: { backgroundColor: '#07050F', flex: 1 },
          cardStyleInterpolator: ({ current }) => ({
            cardStyle: { opacity: current.progress },
          }),
        }}
      />
    </AppStack.Navigator>
  );
}

function RootNavigator() {
  const { isOnboardingComplete } = useOnboarding();

  return (
    <NavigationContainer>
      {isOnboardingComplete ? (
        <AppStackNavigator key="main-app" />
      ) : (
        <OnboardingNavigator key="onboarding" />
      )}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
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
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root:      { flex: 1 },
  container: { flex: 1, backgroundColor: '#0B1220' },
});
