import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useOnboarding } from '../../context/OnboardingContext';
import BodyMap from '../../components/BodyMap';
import { StepHeader } from '../../components/StepHeader';
import { Colors, Shadows } from '../../constants/brand';
import { useResponsive, fs, sp } from '../../utils/responsive';

export default function PainLocationScreen({ navigation }) {
  const { onboardingData, updateOnboardingData } = useOnboarding();
  const selected = onboardingData.painLocations || [];
  const canContinue = selected.length > 0;
  const { isSmall, isTablet, isShort, horizPad, frameWidth, fontScale } = useResponsive();

  const dyn = {
    questionBlock: { paddingHorizontal: horizPad },
    frame:         { maxWidth: frameWidth },
    question:      { fontSize: fs(26, fontScale) },
    hint:          { fontSize: fs(13, fontScale) },
    btnText:       { fontSize: fs(17, fontScale) },
    btnTextDisabled: { fontSize: fs(14, fontScale) },
    selectionText: { fontSize: fs(12, fontScale) },
    footer:        { paddingHorizontal: horizPad, paddingBottom: isShort ? 18 : 28, paddingTop: 6 },
    footerInner:   { maxWidth: frameWidth },
  };

  return (
    <SafeAreaView style={s.container} edges={['top', 'bottom']}>
      <StepHeader step={1} total={12} onBack={() => navigation.goBack()} />

      <View style={[s.questionBlock, dyn.questionBlock]}>
        <View style={[s.frame, dyn.frame]}>
          <Text style={[s.question, dyn.question]}>Where does it hurt?</Text>
          <Text style={[s.hint, dyn.hint]}>Tap the area — front or back · Select multiple</Text>
        </View>
      </View>

      {/* Body map — takes the remaining flex space, centered */}
      <View style={s.mapWrap}>
        <BodyMap
          selectedParts={selected}
          onSelect={(locs) => updateOnboardingData({ painLocations: locs })}
        />
      </View>

      {/* Footer — pinned, capped to frame width on tablets */}
      <View style={[s.footer, dyn.footer]}>
        <View style={[s.footerInner, dyn.footerInner]}>
          {selected.length > 0 && (
            <View style={s.selectionBadge}>
              <View style={s.selectionDot} />
              <Text style={[s.selectionText, dyn.selectionText]}>
                {selected.length} area{selected.length !== 1 ? 's' : ''} selected
              </Text>
            </View>
          )}
          <TouchableOpacity
            style={[s.btn, !canContinue && s.btnDisabled]}
            onPress={() => canContinue && navigation.navigate('PainIntensity')}
            activeOpacity={0.88}
          >
            <Text style={[s.btnText, dyn.btnText, !canContinue && [s.btnTextDisabled, dyn.btnTextDisabled]]}>
              {canContinue ? 'Continue →' : 'Tap where it hurts'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },

  questionBlock: { alignItems: 'center', paddingBottom: 6 },
  frame: { width: '100%', alignSelf: 'center', alignItems: 'center' },
  question: {
    fontWeight: '800', color: Colors.textPrimary,
    textAlign: 'center', letterSpacing: -0.6, marginBottom: 4,
  },
  hint: { color: Colors.textSecondary, textAlign: 'center' },

  mapWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  footer: { alignItems: 'center' },
  footerInner: { width: '100%', alignSelf: 'center', gap: 8 },

  selectionBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 7,
    alignSelf: 'center',
    backgroundColor: Colors.purpleGlow,
    borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6,
    borderWidth: 1, borderColor: Colors.borderSelected,
  },
  selectionDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: Colors.purple },
  selectionText: { color: Colors.purplePale, fontWeight: '700' },

  btn: {
    backgroundColor: Colors.purple, borderRadius: 20, paddingVertical: 18,
    alignItems: 'center', ...Shadows.purple,
  },
  btnDisabled: { backgroundColor: Colors.bgCard, shadowOpacity: 0, borderWidth: 1, borderColor: Colors.border },
  btnText:         { fontWeight: '700', color: Colors.white },
  btnTextDisabled: { color: Colors.textMuted },
});
