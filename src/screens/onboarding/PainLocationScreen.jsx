import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useOnboarding } from '../../context/OnboardingContext';
import BodyMap from '../../components/BodyMap';
import { StepHeader } from '../../components/StepHeader';
import StepFooter from '../../components/StepFooter';
import { Colors, KitColors } from '../../constants/brand';
import { useResponsive, fs } from '../../utils/responsive';

/**
 * PainLocationScreen — onboarding step 1 of 12.
 *
 * Layout:
 *  - The content (headline + BodyMap) lives in a ScrollView, so on short
 *    phones nothing is clipped and everything stays reachable.
 *  - The Continue button is pinned below the scroll, so it's always visible.
 *  - Everything is held in a phone-width column (frameWidth) that stays
 *    centred and correctly proportioned on laptop / tablet as well as phone.
 *  - On tall screens the column floats to the vertical centre (auto margins);
 *    on short screens the auto margins collapse and the page scrolls.
 *
 * Data wiring (unchanged):
 *  - useOnboarding() reads/writes painLocations
 *  - BodyMap shows its own selected-area chips, so the screen no longer
 *    renders a second chip row.
 *  - Navigates to 'PainIntensity' on continue.
 */
export default function PainLocationScreen({ navigation }) {
  const { onboardingData, updateOnboardingData } = useOnboarding();
  const selected = onboardingData.painLocations || [];
  const canContinue = selected.length > 0;

  const { horizPad, frameWidth, fontScale, isShort } = useResponsive();

  return (
    <SafeAreaView style={s.container} edges={['top', 'bottom']}>
      <StepHeader step={1} total={12} onBack={() => navigation.goBack()} />

      <ScrollView
        style={s.scroll}
        contentContainerStyle={[
          s.scrollContent,
          { paddingHorizontal: horizPad, paddingBottom: isShort ? 20 : 32 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[s.frame, { maxWidth: frameWidth }]}>
          <Text style={[s.eyebrow, { fontSize: fs(13, fontScale) }]}>Step 1 of 12</Text>
          <Text
            style={[s.headline, { fontSize: fs(28, fontScale), lineHeight: fs(34, fontScale) }]}
          >
            Where does{'\n'}it hurt?
          </Text>
          <Text style={[s.sub, { fontSize: fs(14, fontScale) }]}>
            Tap the area — front or back. Select multiple if needed.
          </Text>

          <View style={s.mapWrap}>
            <BodyMap
              selectedParts={selected}
              onSelect={(locs) => updateOnboardingData({ painLocations: locs })}
            />
          </View>
        </View>
      </ScrollView>

      {/* Footer pinned below the scroll — Continue is always reachable */}
      <StepFooter
        label={canContinue ? 'Continue' : 'Tap where it hurts'}
        disabled={!canContinue}
        onPress={() => navigation.navigate('PainIntensity')}
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },

  scroll: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: 28,
    paddingBottom: 32,
  },

  // Phone-width column. marginTop/Bottom 'auto' centre it vertically when there
  // is spare room (laptop / tall screens) and collapse to 0 when there isn't.
  frame: {
    width: '100%',
    alignSelf: 'center',
    marginTop: 'auto',
    marginBottom: 'auto',
  },

  eyebrow: {
    color: KitColors.text3,
    fontWeight: '500',
    marginTop: 4,
    letterSpacing: 0.2,
  },
  headline: {
    fontWeight: '800',
    color: KitColors.text1,
    letterSpacing: -0.6,
    marginTop: 16,
  },
  sub: {
    color: KitColors.text2,
    lineHeight: 22,
    marginTop: 16,
    marginBottom: 36,
  },
  mapWrap: {
    width: '100%',
    alignItems: 'center',
    marginTop: 8,
  },
});
