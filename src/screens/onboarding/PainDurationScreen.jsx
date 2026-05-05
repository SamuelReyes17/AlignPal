import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useOnboarding } from '../../context/OnboardingContext';
import { StepHeader } from '../../components/StepHeader';
import { Colors, Shadows } from '../../constants/brand';
import { useResponsive, fs, sp } from '../../utils/responsive';

const OPTIONS = [
  {
    id: 'acute',
    label: 'Less than 6 weeks',
    sub: 'Recent — started within the last month or so',
    icon: 'flash',
    color: '#FF6B9D',
  },
  {
    id: 'subacute',
    label: '6 to 12 weeks',
    sub: 'Started 1–3 months ago',
    icon: 'hourglass',
    color: '#FBBF24',
  },
  {
    id: 'chronic',
    label: 'More than 3 months',
    sub: 'Persistent — has been there for a while',
    icon: 'time',
    color: '#9B5DE5',
  },
  {
    id: 'recurrent',
    label: 'Comes and goes',
    sub: 'Recurring episodes over months or years',
    icon: 'sync',
    color: '#73C2FB',
  },
];

export default function PainDurationScreen({ navigation }) {
  const { onboardingData, updateOnboardingData } = useOnboarding();
  const [selected, setSelected] = useState(onboardingData.painDuration || null);
  const { isSmall, isTablet, isShort, horizPad, frameWidth, fontScale, gapScale } = useResponsive();

  const handleContinue = () => {
    if (!selected) return;
    updateOnboardingData({ painDuration: selected });
    navigation.navigate('DirectionalPreference');
  };

  // Dynamic style overrides
  const dyn = {
    scrollContent: { paddingHorizontal: horizPad, paddingVertical: sp(20, gapScale) },
    frame:         { maxWidth: frameWidth, gap: sp(28, gapScale) },
    question:      { fontSize: fs(36, fontScale), lineHeight: fs(44, fontScale) },
    hint:          { fontSize: fs(14, fontScale), lineHeight: fs(21, fontScale) },
    options:       { gap: sp(12, gapScale) },
    cardLabel:     { fontSize: fs(16, fontScale) },
    cardSub:       { fontSize: fs(12, fontScale), lineHeight: fs(17, fontScale) },
    iconCircle:    { width: isSmall ? 52 : isTablet ? 68 : 60, height: isSmall ? 52 : isTablet ? 68 : 60 },
    btnText:       { fontSize: fs(17, fontScale) },
    footer:        { paddingHorizontal: horizPad, paddingBottom: isShort ? 20 : 36, paddingTop: 12 },
    footerInner:   { maxWidth: frameWidth },
  };

  return (
    <SafeAreaView style={s.container} edges={['top', 'bottom']}>
      <StepHeader step={5} total={12} onBack={() => navigation.goBack()} />

      <ScrollView style={s.scroll} contentContainerStyle={[s.scrollContent, dyn.scrollContent]} showsVerticalScrollIndicator={false}>
        <View style={[s.frame, dyn.frame]}>
          <View style={s.topBlock}>
            <Text style={[s.question, dyn.question]}>How long have{'\n'}you had this pain?</Text>
            <Text style={[s.hint, dyn.hint]}>
              Recent pain and long-standing pain need very different protocols.{'\n'}
              This is one of the most important inputs.
            </Text>
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
                    <Ionicons name={opt.icon} size={isSmall ? 26 : isTablet ? 36 : 32} color={isOn ? opt.color : Colors.textMuted} />
                  </View>

                  <View style={s.cardText}>
                    <Text style={[s.cardLabel, dyn.cardLabel, isOn && { color: Colors.textPrimary }]}>{opt.label}</Text>
                    <Text style={[s.cardSub, dyn.cardSub, isOn && { color: opt.color }]}>{opt.sub}</Text>
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
              {selected ? 'Continue' : 'Pick a duration'}
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

  // Centered frame — capped width on tablets, full width on phones
  frame: { width: '100%', alignSelf: 'center' },

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
  radioOn:   { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  radioOff:  { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: Colors.border },

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
