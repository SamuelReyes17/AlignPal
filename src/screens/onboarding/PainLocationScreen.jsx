import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useOnboarding } from '../../context/OnboardingContext';
import BodyMap from '../../components/BodyMap';
import { StepHeader } from '../../components/StepHeader';
import { Colors, Shadows } from '../../constants/brand';

export default function PainLocationScreen({ navigation }) {
  const { onboardingData, updateOnboardingData } = useOnboarding();
  const selected = onboardingData.painLocations || [];
  const canContinue = selected.length > 0;

  return (
    <SafeAreaView style={s.container} edges={['top', 'bottom']}>
      {/* Header — compact */}
      <StepHeader step={1} total={8} onBack={() => navigation.goBack()} />

      {/* Question — tight, no wasted space */}
      <View style={s.questionBlock}>
        <Text style={s.question}>Where does it hurt?</Text>
        <Text style={s.hint}>Tap the area — front or back · Select multiple</Text>
      </View>

      {/* Body map — takes exactly the remaining flex space */}
      <View style={s.mapWrap}>
        <BodyMap
          selectedParts={selected}
          onSelect={(locs) => updateOnboardingData({ painLocations: locs })}
        />
      </View>

      {/* Footer — always visible, pinned at bottom */}
      <View style={s.footer}>
        {selected.length > 0 && (
          <View style={s.selectionBadge}>
            <View style={s.selectionDot} />
            <Text style={s.selectionText}>
              {selected.length} area{selected.length !== 1 ? 's' : ''} selected
            </Text>
          </View>
        )}
        <TouchableOpacity
          style={[s.btn, !canContinue && s.btnDisabled]}
          onPress={() => canContinue && navigation.navigate('PainIntensity')}
          activeOpacity={0.88}
        >
          <Text style={[s.btnText, !canContinue && s.btnTextDisabled]}>
            {canContinue ? 'Continue →' : 'Tap where it hurts'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },

  questionBlock: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 6,
  },
  question: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.textPrimary,
    textAlign: 'center',
    letterSpacing: -0.6,
    marginBottom: 4,
  },
  hint: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
  },

  // Map takes all remaining space between question and footer
  mapWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  footer: {
    paddingHorizontal: 24,
    paddingBottom: 28,
    paddingTop: 6,
    gap: 8,
  },

  selectionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    alignSelf: 'center',
    backgroundColor: Colors.purpleGlow,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: Colors.borderSelected,
  },
  selectionDot: {
    width: 7, height: 7, borderRadius: 4,
    backgroundColor: Colors.purple,
  },
  selectionText: {
    fontSize: 12,
    color: Colors.purplePale,
    fontWeight: '700',
  },

  btn: {
    backgroundColor: Colors.purple,
    borderRadius: 20,
    paddingVertical: 18,
    alignItems: 'center',
    ...Shadows.purple,
  },
  btnDisabled: {
    backgroundColor: Colors.bgCard,
    shadowOpacity: 0,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  btnText:         { fontSize: 17, fontWeight: '700', color: Colors.white },
  btnTextDisabled: { color: Colors.textMuted, fontSize: 14 },
});
