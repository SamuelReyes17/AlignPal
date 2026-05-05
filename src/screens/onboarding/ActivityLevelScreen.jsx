import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useOnboarding } from '../../context/OnboardingContext';
import { StepHeader } from '../../components/StepHeader';
import { Colors, Shadows } from '../../constants/brand';
import { useResponsive, fs, sp } from '../../utils/responsive';

const OPTIONS = [
  { id: 'sedentary', label: 'Not very active',    sub: 'Little to no exercise right now', icon: 'bed-outline',     color: Colors.purpleLight },
  { id: 'light',     label: 'Lightly active',     sub: 'Walk or move 1–2× a week',        icon: 'walk-outline',    color: Colors.green },
  { id: 'moderate',  label: 'Moderately active',  sub: 'Exercise or gym 3–4× a week',     icon: 'bicycle-outline', color: Colors.amber },
  { id: 'active',    label: 'Very active',        sub: 'Train hard 5+ days a week',       icon: 'barbell-outline', color: Colors.red },
];

export default function ActivityLevelScreen({ navigation }) {
  const { onboardingData, updateOnboardingData } = useOnboarding();
  const [selected, setSelected] = useState(onboardingData.trainingFrequency || null);
  const { isSmall, isTablet, isShort, horizPad, frameWidth, fontScale, gapScale } = useResponsive();

  const handleContinue = () => {
    if (!selected) return;
    updateOnboardingData({ trainingFrequency: selected });
    navigation.navigate('AgeRange');
  };

  const dyn = {
    scrollContent: { paddingHorizontal: horizPad, paddingVertical: sp(20, gapScale) },
    frame:         { maxWidth: frameWidth, gap: sp(28, gapScale) },
    question:      { fontSize: fs(38, fontScale), lineHeight: fs(46, fontScale) },
    hint:          { fontSize: fs(14, fontScale) },
    options:       { gap: sp(10, gapScale) },
    cardLabel:     { fontSize: fs(16, fontScale) },
    cardSub:       { fontSize: fs(12, fontScale) },
    iconCircle:    { width: isSmall ? 50 : isTablet ? 64 : 58, height: isSmall ? 50 : isTablet ? 64 : 58 },
    btnText:       { fontSize: fs(17, fontScale) },
    footer:        { paddingHorizontal: horizPad, paddingBottom: isShort ? 20 : 36, paddingTop: 12 },
    footerInner:   { maxWidth: frameWidth },
  };

  return (
    <SafeAreaView style={s.container} edges={['top', 'bottom']}>
      <StepHeader step={10} total={12} onBack={() => navigation.goBack()} />

      <ScrollView style={s.scroll} contentContainerStyle={[s.scrollContent, dyn.scrollContent]} showsVerticalScrollIndicator={false}>
        <View style={[s.frame, dyn.frame]}>
          <View style={s.topBlock}>
            <Text style={[s.question, dyn.question]}>How active{'\n'}are you?</Text>
            <Text style={[s.hint, dyn.hint]}>Be honest — there's no wrong answer here</Text>
          </View>

          <View style={[s.options, dyn.options]}>
            {OPTIONS.map((opt) => {
              const isOn = selected === opt.id;
              return (
                <TouchableOpacity
                  key={opt.id}
                  style={[s.card, isOn && { borderColor: opt.color, backgroundColor: opt.color + '14' }]}
                  onPress={() => setSelected(opt.id)}
                  activeOpacity={0.82}
                >
                  <View style={[s.iconCircle, dyn.iconCircle, isOn && { backgroundColor: opt.color + '22', borderColor: opt.color + '60' }]}>
                    <Ionicons name={opt.icon} size={isSmall ? 26 : isTablet ? 34 : 30} color={isOn ? opt.color : Colors.textMuted} />
                  </View>
                  <View style={s.cardText}>
                    <Text style={[s.cardLabel, dyn.cardLabel, isOn && { color: Colors.textPrimary }]}>{opt.label}</Text>
                    <Text style={[s.cardSub, dyn.cardSub,   isOn && { color: opt.color }]}>{opt.sub}</Text>
                  </View>
                  {isOn
                    ? <View style={[s.radioOn, { backgroundColor: opt.color }]}><Ionicons name="checkmark" size={14} color="#fff" /></View>
                    : <View style={s.radioOff} />
                  }
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>

      <View style={[s.footer, dyn.footer]}>
        <View style={[s.footerInner, dyn.footerInner]}>
          <TouchableOpacity
            style={[s.btn, !selected && s.btnDisabled]}
            onPress={handleContinue}
            activeOpacity={0.88}
          >
            <Text style={[s.btnText, dyn.btnText, !selected && s.btnTextDisabled]}>
              {selected ? 'Continue' : 'Select activity level'}
            </Text>
            {!!selected && <Ionicons name="arrow-forward" size={16} color={Colors.white} />}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container:     { flex: 1, backgroundColor: Colors.bg },
  scroll:        { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: 'center' },
  frame:         { width: '100%', alignSelf: 'center' },

  topBlock: { alignItems: 'center', gap: 12 },
  question: { fontWeight: '800', color: Colors.textPrimary, textAlign: 'center', letterSpacing: -0.8 },
  hint:     { color: Colors.textSecondary, textAlign: 'center' },

  options: {},
  card: {
    flexDirection: 'row', alignItems: 'center', gap: 16,
    backgroundColor: Colors.bgCard,
    borderWidth: 2, borderColor: Colors.border,
    borderRadius: 20, paddingVertical: 18, paddingHorizontal: 18,
    ...Shadows.card,
  },
  iconCircle: {
    borderRadius: 18,
    backgroundColor: Colors.bgInput,
    borderWidth: 1.5, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  cardText:  { flex: 1, gap: 3 },
  cardLabel: { fontWeight: '700', color: Colors.textMuted },
  cardSub:   { color: Colors.textSecondary },
  radioOn:   { width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  radioOff:  { width: 26, height: 26, borderRadius: 13, borderWidth: 2, borderColor: Colors.border },

  footer:      { alignItems: 'center' },
  footerInner: { width: '100%', alignSelf: 'center' },
  btn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: Colors.purple, borderRadius: 20, paddingVertical: 19,
    ...Shadows.purple,
  },
  btnDisabled:     { backgroundColor: Colors.bgCard, shadowOpacity: 0, borderWidth: 1, borderColor: Colors.border },
  btnText:         { fontWeight: '700', color: Colors.white },
  btnTextDisabled: { color: Colors.textMuted },
});
