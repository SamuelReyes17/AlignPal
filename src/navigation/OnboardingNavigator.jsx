/**
 * OnboardingNavigator
 *
 * Full flow (one question per screen):
 * Welcome → PainLocation → PainIntensity → PainType → PainTriggers
 * → PainDuration → DirectionalPreference → RadiatingPain → RedFlag
 * → Sitting → ActivityLevel → AgeRange → Disclaimer
 * → Analyzing (loader) → PainProfile → Day1Protocol → Upgrade
 */
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Colors } from '../constants/brand';

import WelcomeScreen               from '../screens/onboarding/WelcomeScreen';
import PainLocationScreen          from '../screens/onboarding/PainLocationScreen';
import PainIntensityScreen         from '../screens/onboarding/PainIntensityScreen';
import PainTypeScreen              from '../screens/onboarding/PainTypeScreen';
import PainTriggersScreen          from '../screens/onboarding/PainTriggersScreen';
import PainDurationScreen          from '../screens/onboarding/PainDurationScreen';
import DirectionalPreferenceScreen from '../screens/onboarding/DirectionalPreferenceScreen';
import RadiatingPainScreen         from '../screens/onboarding/RadiatingPainScreen';
import RedFlagScreen               from '../screens/onboarding/RedFlagScreen';
import SittingScreen               from '../screens/onboarding/SittingScreen';
import ActivityLevelScreen  from '../screens/onboarding/ActivityLevelScreen';
import AgeRangeScreen       from '../screens/onboarding/AgeRangeScreen';
import DisclaimerScreen     from '../screens/onboarding/DisclaimerScreen';
import AnalyzingScreen      from '../screens/onboarding/AnalyzingScreen';
import EmailCaptureScreen   from '../screens/onboarding/EmailCaptureScreen';
import PainProfileScreen    from '../screens/onboarding/PainProfileScreen';
import Day1ProtocolScreen    from '../screens/onboarding/Day1ProtocolScreen';
import UpgradeScreen         from '../screens/onboarding/UpgradeScreen';
import RecoverySessionScreen from '../screens/RecoverySessionScreen';

const Stack = createStackNavigator();

// Default slide+fade transition for onboarding steps
const slideTransition = {
  cardStyleInterpolator: ({ current, layouts }) => ({
    cardStyle: {
      opacity: current.progress,
      transform: [{
        translateX: current.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [layouts.screen.width * 0.06, 0],
        }),
      }],
    },
  }),
};

// Pure fade for the Analyzing screen — no slide, feels more cinematic
const fadeTransition = {
  cardStyleInterpolator: ({ current }) => ({
    cardStyle: { opacity: current.progress },
  }),
};

export default function OnboardingNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        // flex: 1 on cardStyle is required on RN Web so each screen inherits
        // a bounded height — without it ScrollViews inside grow with content.
        cardStyle: { backgroundColor: Colors.bg, flex: 1 },
        animationEnabled: true,
        ...slideTransition,
      }}
    >
      <Stack.Screen name="Welcome"       component={WelcomeScreen}       />
      <Stack.Screen name="PainLocation"  component={PainLocationScreen}  />
      <Stack.Screen name="PainIntensity" component={PainIntensityScreen} />
      <Stack.Screen name="PainType"      component={PainTypeScreen}      />
      <Stack.Screen name="PainTriggers"          component={PainTriggersScreen}          />
      <Stack.Screen name="PainDuration"          component={PainDurationScreen}          />
      <Stack.Screen name="DirectionalPreference" component={DirectionalPreferenceScreen} />
      <Stack.Screen name="RadiatingPain"         component={RadiatingPainScreen}         />
      <Stack.Screen name="RedFlag"               component={RedFlagScreen}               />
      <Stack.Screen name="Sitting"               component={SittingScreen}               />
      <Stack.Screen name="ActivityLevel" component={ActivityLevelScreen} />
      <Stack.Screen name="AgeRange"      component={AgeRangeScreen}      />
      <Stack.Screen name="Disclaimer"    component={DisclaimerScreen}    />

      {/* Analyzing loader — pure fade in/out, no back gesture */}
      <Stack.Screen
        name="Analyzing"
        component={AnalyzingScreen}
        options={{
          gestureEnabled: false,
          ...fadeTransition,
        }}
      />

      <Stack.Screen
        name="EmailCapture"
        component={EmailCaptureScreen}
        options={{ gestureEnabled: false, ...fadeTransition }}
      />
      <Stack.Screen name="PainProfile"  component={PainProfileScreen}  />
      <Stack.Screen name="Day1Protocol" component={Day1ProtocolScreen} />
      <Stack.Screen name="Upgrade"      component={UpgradeScreen}      />
      {/* Accessible from Day1Protocol before onboarding completes */}
      <Stack.Screen
        name="RecoverySession"
        component={RecoverySessionScreen}
        options={{ gestureEnabled: false, ...fadeTransition }}
      />
    </Stack.Navigator>
  );
}
