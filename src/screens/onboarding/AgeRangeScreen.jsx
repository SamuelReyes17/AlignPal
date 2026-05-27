import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useOnboarding } from '../../context/OnboardingContext';
import { StepHeader } from '../../components/StepHeader';
import StepFooter from '../../components/StepFooter';
import { Colors, Shadows } from '../../constants/brand';
import { useResponsive, fs, sp } from '../../utils/responsive';

// Purple-only treatment — selection (border/fill) carries state, not hue.
const OPTIONS = [
  { id: '18-25', label: '18 – 25', sub: 'Young adult',       icon: 'flash-outline',            color: Colors.purpleLight },
  { id: '26-35', label: '26 – 35', sub: 'Prime years',       icon: 'briefcase-outline',        color: Colors.purpleLight },
  { id: '36-45', label: '36 – 45', sub: 'Peak experience',   icon: 'leaf-outline',             color: Colors.purpleLight },
  { id: '46-55', label: '46 – 55', sub: 'Active & wise',     icon: 'shield-checkmark-outline', color: Colors.purpleLight },
  { id: '56+',   label: '56+',     sub: 'Seasoned & strong', icon: 'heart-outline',            color: Colors.purpleLight },
];

export default function AgeRangeScreen({ navigation }) {
  const { onboardingData, updateOnboardingData } = useOnboarding();
  const [selected, setSelected] = useState(onboardingData.ageRange || null);
  const { isSmall, isTablet, isShort, horizPad, frameWidth, fontScale, gapScale } = useResponsive();

  const handleContinue = () => {
    if (!selected) return;
    updateOnboardingData({ ageRange: selected });
    navigation.navigate('Disclaimer');
  };

  const dyn = {
    scrollContent: { paddingHorizontal: horizPad, paddingVertical: sp(28, gapScale) },
    frame:         { maxWidth: frameWidth, gap: sp(32, gapScale) },
    question:      { fontSize: fs(38, fontScale), lineHeight: fs(46, fontScale) },
    hint:          { fontSize: fs(14, fontScale), lineHeight: fs(21, fontScale) },
    grid:          { gap: sp(12, gapScale) },
    cardLabel:     { fontSize: fs(20, fontScale) },
    cardSub:       { fontSize: fs(12, fontScale) },
    iconCircle:    { width: isSmall ? 52 : isTablet ? 68 : 60, height: isSmall ? 52 : isTablet ? 68 : 60 },
  };

  return (
    <SafeAreaView style={s.container} edges={['top', 'bottom']}>
      <StepHeader step={11} total={12} onBack={() => navigation.goBack()} />

      <ScrollView style={s.scroll} contentContainerStyle={[s.scrollContent, dyn.scrollContent]} showsVerticalScrollIndicator={false}>
        <View style={[s.frame, dyn.frame]}>
          <View style={s.topBlock}>
            <Text style={[s.question, dyn.question]}>What's your{'\n'}age range?</Text>
            <Text style={[s.hint, dyn.hint]}>
              Recovery timelines vary by age — this helps us{'\n'}set the right expectations for you
            </Text>
          </View>

          {/* 2-column grid of big pill options */}
          <View style={[s.grid, dyn.grid]}>
            {OPTIONS.map((opt) => {
              const isOn = selected === opt.id;
              return (
                <TouchableOpacity
                  key={opt.id}
                  style={[
                    s.card,
                    isOn && { borderColor: opt.color, backgroundColor: opt.color + '16' },
                    opt.id === '56+' && s.cardWide,
                  ]}
                  onPress={() => setSelected(opt.id)}
                  activeOpacity={0.82}
                >
                  {isOn && <View style={[s.glow, { backgroundColor: opt.color }]} />}

                  <View style={[s.iconCircle, dyn.iconCircle, isOn && { backgroundColor: opt.color + '22', borderColor: opt.color + '50' }]}>
                    <Ionicons name={opt.icon} size={isSmall ? 24 : isTablet ? 32 : 28} color={isOn ? opt.color : Colors.textMuted} />
                  </View>
                  <Text style={[s.cardLabel, dyn.cardLabel, isOn && { color: Colors.textPrimary }]}>{opt.label}</Text>
                  <Text style={[s.cardSub, dyn.cardSub,   isOn && { color: opt.color }]}>{opt.sub}</Text>

                  {isOn && (
                    <View style={[s.check, { backgroundColor: opt.color }]}>
                      <Ionicons name="checkmark" size={10} color="#fff" />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>

      <StepFooter
        label={selected ? 'Build My Plan' : 'Select your age range'}
        disabled={!selected}
        onPress={handleContinue}
      />
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

  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  card: {
    width: '46%',
    backgroundColor: Colors.bgCard,
    borderWidth: 2, borderColor: Colors.border,
    borderRadius: 22, paddingVertical: 22,
    alignItems: 'center', gap: 10,
    position: 'relative', overflow: 'hidden',
    ...Shadows.card,
  },
  cardWide: { width: '96%' },
  glow: {
    position: 'absolute', top: -24, right: -24,
    width: 80, height: 80, borderRadius: 40, opacity: 0.12,
  },
  iconCircle: {
    borderRadius: 20,
    backgroundColor: Colors.bgInput,
    borderWidth: 1.5, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  cardLabel: { fontWeight: '800', color: Colors.textMuted, letterSpacing: -0.5 },
  cardSub:   { color: Colors.textSecondary },
  check: {
    position: 'absolute', top: 10, right: 10,
    width: 18, height: 18, borderRadius: 9,
    alignItems: 'center', justifyContent: 'center',
  },
});
