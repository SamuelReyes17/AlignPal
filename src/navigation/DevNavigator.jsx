/**
 * DevNavigator — dev-only navigator behind the screen catalog.
 *
 * Registers the DevMenu plus EVERY screen in the app inside one stack, so the
 * catalog can jump straight to any of them. Each screen gets a header with a
 * back arrow that returns to the catalog.
 *
 * Active only when DEV.START === 'screen-catalog' (src/constants/devConfig.js).
 * Never reachable in a production build.
 */
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Colors } from '../constants/brand';

import DevMenuScreen              from '../screens/dev/DevMenuScreen';
import WelcomeScreen              from '../screens/onboarding/WelcomeScreen';
import PainLocationScreen         from '../screens/onboarding/PainLocationScreen';
import PainIntensityScreen        from '../screens/onboarding/PainIntensityScreen';
import PainTypeScreen             from '../screens/onboarding/PainTypeScreen';
import PainTriggersScreen         from '../screens/onboarding/PainTriggersScreen';
import PainDurationScreen         from '../screens/onboarding/PainDurationScreen';
import DirectionalPreferenceScreen from '../screens/onboarding/DirectionalPreferenceScreen';
import RadiatingPainScreen        from '../screens/onboarding/RadiatingPainScreen';
import RedFlagScreen              from '../screens/onboarding/RedFlagScreen';
import SittingScreen              from '../screens/onboarding/SittingScreen';
import ActivityLevelScreen        from '../screens/onboarding/ActivityLevelScreen';
import AgeRangeScreen             from '../screens/onboarding/AgeRangeScreen';
import DisclaimerScreen           from '../screens/onboarding/DisclaimerScreen';
import AnalyzingScreen            from '../screens/onboarding/AnalyzingScreen';
import EmailCaptureScreen         from '../screens/onboarding/EmailCaptureScreen';
import PainProfileScreen          from '../screens/onboarding/PainProfileScreen';
import Day1ProtocolScreen         from '../screens/onboarding/Day1ProtocolScreen';
import UpgradeScreen              from '../screens/onboarding/UpgradeScreen';
import RecoverySessionScreen      from '../screens/RecoverySessionScreen';
import AppNavigator               from './AppNavigator';

const Stack = createStackNavigator();

// [route name, component, header title]. Route names match what each screen
// uses internally for navigation.navigate(...), so the flow still works.
const SCREENS = [
  ['Welcome',               WelcomeScreen,               'Welcome'],
  ['PainLocation',          PainLocationScreen,          'Pain Location'],
  ['PainIntensity',         PainIntensityScreen,         'Pain Intensity'],
  ['PainType',              PainTypeScreen,              'Pain Type'],
  ['PainTriggers',          PainTriggersScreen,          'Pain Triggers'],
  ['PainDuration',          PainDurationScreen,          'Pain Duration'],
  ['DirectionalPreference', DirectionalPreferenceScreen, 'Directional Preference'],
  ['RadiatingPain',         RadiatingPainScreen,         'Radiating Pain'],
  ['RedFlag',               RedFlagScreen,               'Red Flag Check'],
  ['Sitting',               SittingScreen,               'Sitting Hours'],
  ['ActivityLevel',         ActivityLevelScreen,         'Activity Level'],
  ['AgeRange',              AgeRangeScreen,              'Age Range'],
  ['Disclaimer',            DisclaimerScreen,            'Disclaimer'],
  ['Analyzing',             AnalyzingScreen,             'Analyzing'],
  ['EmailCapture',          EmailCaptureScreen,          'Email Capture'],
  ['PainProfile',           PainProfileScreen,           'Pain Profile'],
  ['Day1Protocol',          Day1ProtocolScreen,          'Day 1 Protocol'],
  ['Upgrade',               UpgradeScreen,               'Upgrade'],
  ['RecoverySession',       RecoverySessionScreen,       'Recovery Session'],
];

export default function DevNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="DevMenu"
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: Colors.bgCard,
          shadowColor: 'transparent',
          elevation: 0,
          borderBottomWidth: 1,
          borderBottomColor: Colors.borderSubtle,
        },
        headerTintColor: Colors.purpleLight,
        headerTitleStyle: { color: Colors.textPrimary, fontWeight: '700', fontSize: 15 },
        headerBackTitleVisible: false,
        cardStyle: { backgroundColor: Colors.bg, flex: 1 },
      }}
    >
      <Stack.Screen name="DevMenu" component={DevMenuScreen} options={{ headerShown: false }} />

      {SCREENS.map(([name, component, title]) => (
        <Stack.Screen key={name} name={name} component={component} options={{ title }} />
      ))}

      <Stack.Screen name="MainApp" component={AppNavigator} options={{ title: 'Main App' }} />
    </Stack.Navigator>
  );
}
