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
    id: 'flexion',
    label: 'Bending forward',
    sub: 'Putting on socks, picking things up off the floor',
    icon: 'arrow-down-circle-outline',
  },
  {
    id: 'extension',
    label: 'Bending backward / arching',
    sub: 'Reaching overhead, leaning back, looking up',
    icon: 'arrow-up-circle-outline',
  },
  {
    id: 'rotation',
    label: 'Twisting / turning',
    sub: 'Reaching across, looking over the shoulder',
    icon: 'sync-circle-outline',
  },
  {
    id: 'sustained',
    label: 'Holding one position',
    sub: 'Sitting or standing still for too long',
    icon: 'pause-circle-outline',
  },
  {
    id: 'unclear',
    label: 'No clear pattern',
    sub: "Pain doesn't depend on a specific motion",
    icon: 'help-circle-outline',
  },
];

export default function DirectionalPreferenceScreen({ navigation }) {
  const { onboardingData, updateOnboardingData } = useOnboarding();
  const [selected, setSelected] = useState(onboardingData.directionalPreference || null);
  const { isSmall, isTablet, isShort, horizPad, frameWidth, fontScale, gapScale } = useResponsive();

  const handleContinue = () => {
    if (!selected) return;
    updateOnboardingData({ directionalPreference: selected });
    navigation.navigate('RadiatingPain');
  };

  const dyn = {
    scrollContent: { paddingHorizontal: horizPad, paddingVertical: sp(20, gapScale) },
    frame:         { maxWidth: frameWidth, gap: sp(24, gapScale) },
    question:      { fontSize: fs(36, fontScale), lineHeight: fs(44, fontScale) },
    hint:          { fontSize: fs(14, fontScale), lineHeight: fs(21, fontScale) },
    options:       { gap: sp(10, gapScale) },
    cardLabel:     { fontSize: fs(15, fontScale) },
    cardSub:       { fontSize: fs(12, fontScale), lineHeight: fs(17, fontScale) },
    iconWrap:      { width: isSmall ? 42 : isTablet ? 52 : 48, height: isSmall ? 42 : isTablet ? 52 : 48 },
    btnText:       { fontSize: fs(17, fontScale) },
    footer:        { paddingHorizontal: horizPad, paddingBottom: isShort ? 20 : 36, paddingTop: 12 },
    footerInner:   { maxWidth: frameWidth },
  };

  return (
    <SafeAreaView style={s.container} edges={['top', 'bottom']}>
      <StepHeader step={6} total={12} onBack={() => navigation.goBack()} />

      <ScrollView style={s.scroll} contentContainerStyle={[s.scrollContent, dyn.scrollContent]} showsVerticalScrollIndicator={false}>
        <View style={[s.frame, dyn.frame]}>
          <View style={s.topBlock}>
            <Text style={[s.question, dyn.question]}>What movement{'\n'}makes it worse?</Text>
            <Text style={[s.hint, dyn.hint]}>
              This tells us which direction your tissues prefer —{'\n'}
              and which exercises will help vs. hurt.
            </Text>
          </View>

          <View style={[s.options, dyn.options]}>
            {OPTIONS.map((opt) => {
              const isOn = selected === opt.id;
              return (
                <TouchableOpacity
                  key={opt.id}
                  style={[s.card, isOn && s.cardOn]}
                  onPress={() => setSelected(opt.id)}
                  activeOpacity={0.82}
                >
                  <View style={[s.iconWrap, dyn.iconWrap, isOn && s.iconWrapOn]}>
                    <Ionicons name={opt.icon} size={isSmall ? 22 : isTablet ? 28 : 26} color={isOn ? Colors.purple : Colors.textMuted} />
                  </View>
                  <View style={s.cardText}>
                    <Text style={[s.cardLabel, dyn.cardLabel, isOn && s.cardLabelOn]}>{opt.label}</Text>
                    <Text style={[s.cardSub, dyn.cardSub, isOn && s.cardSubOn]}>{opt.sub}</Text>
                  </View>
                  {isOn
                    ? <View style={s.radioOn}><Ionicons name="checkmark" size={14} color="#fff" /></View>
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
              {selected ? 'Continue' : 'Pick the closest match'}
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
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: Colors.bgCard,
    borderWidth: 1.5, borderColor: Colors.border,
    borderRadius: 18, paddingVertical: 16, paddingHorizontal: 16,
  },
  cardOn:      { backgroundColor: Colors.purpleDim, borderColor: Colors.purple },
  iconWrap:    { borderRadius: 14, backgroundColor: Colors.bgInput, borderWidth: 1, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center' },
  iconWrapOn:  { backgroundColor: Colors.purple + '22', borderColor: Colors.purple + '50' },
  cardText:    { flex: 1, gap: 3 },
  cardLabel:   { fontWeight: '700', color: Colors.textMuted },
  cardLabelOn: { color: Colors.textPrimary },
  cardSub:     { color: Colors.textDisabled },
  cardSubOn:   { color: Colors.purplePale, opacity: 0.85 },
  radioOn:     { width: 22, height: 22, borderRadius: 11, backgroundColor: Colors.purple, alignItems: 'center', justifyContent: 'center' },
  radioOff:    { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: Colors.border },

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
