import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useOnboarding } from '../../context/OnboardingContext';
import { StepHeader } from '../../components/StepHeader';
import { Colors, Shadows } from '../../constants/brand';
import { useResponsive, fs, sp } from '../../utils/responsive';

const NONE_ID = 'none';

const OPTIONS = [
  { id: NONE_ID,         label: 'No, it stays in one area',       icon: 'locate-outline'        },
  { id: 'glute',         label: 'Into the glute or buttock',      icon: 'ellipse-outline'        },
  { id: 'above_knee',    label: 'Down the leg, above the knee',   icon: 'arrow-down-outline'     },
  { id: 'below_knee',    label: 'Down the leg, below the knee',   icon: 'flash-outline'          },
  { id: 'arm',           label: 'Into the shoulder or arm',       icon: 'walk-outline'           },
  { id: 'hand',          label: 'Into the hand or fingers',       icon: 'hand-left-outline'      },
  { id: 'headache',      label: 'Up into a headache',             icon: 'thunderstorm-outline'   },
];

export default function RadiatingPainScreen({ navigation }) {
  const { onboardingData, updateOnboardingData } = useOnboarding();
  const [selected, setSelected] = useState(onboardingData.radiatingPain || []);
  const { isSmall, isTablet, isShort, horizPad, frameWidth, fontScale, gapScale } = useResponsive();

  const toggle = (id) => {
    setSelected((prev) => {
      // "None" is exclusive
      if (id === NONE_ID) return prev.includes(NONE_ID) ? [] : [NONE_ID];
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev.filter((x) => x !== NONE_ID), id];
      return next;
    });
  };

  const handleContinue = () => {
    if (!selected.length) return;
    updateOnboardingData({ radiatingPain: selected });
    navigation.navigate('RedFlag');
  };

  const dyn = {
    scrollContent: { paddingHorizontal: horizPad, paddingVertical: sp(20, gapScale) },
    frame:         { maxWidth: frameWidth, gap: sp(22, gapScale) },
    question:      { fontSize: fs(36, fontScale), lineHeight: fs(44, fontScale) },
    hint:          { fontSize: fs(14, fontScale), lineHeight: fs(21, fontScale) },
    options:       { gap: sp(8, gapScale) },
    rowLabel:      { fontSize: fs(15, fontScale) },
    iconWrap:      { width: isSmall ? 34 : isTablet ? 42 : 38, height: isSmall ? 34 : isTablet ? 42 : 38 },
    countText:     { fontSize: fs(12, fontScale) },
    btnText:       { fontSize: fs(17, fontScale) },
    footer:        { paddingHorizontal: horizPad, paddingBottom: isShort ? 20 : 36, paddingTop: 12 },
    footerInner:   { maxWidth: frameWidth },
  };

  return (
    <SafeAreaView style={s.container} edges={['top', 'bottom']}>
      <StepHeader step={7} total={12} onBack={() => navigation.goBack()} />

      <ScrollView style={s.scroll} contentContainerStyle={[s.scrollContent, dyn.scrollContent]} showsVerticalScrollIndicator={false}>
        <View style={[s.frame, dyn.frame]}>
          <View style={s.topBlock}>
            <Text style={[s.question, dyn.question]}>Does your pain{'\n'}travel anywhere?</Text>
            <Text style={[s.hint, dyn.hint]}>
              Pain that radiates often signals nerve involvement —{'\n'}
              and changes which exercises are safe.
            </Text>
          </View>

          <View style={[s.options, dyn.options]}>
            {OPTIONS.map((opt) => {
              const isOn = selected.includes(opt.id);
              return (
                <TouchableOpacity
                  key={opt.id}
                  style={[s.row, isOn && s.rowOn]}
                  onPress={() => toggle(opt.id)}
                  activeOpacity={0.82}
                >
                  <View style={[s.iconWrap, dyn.iconWrap, isOn && s.iconWrapOn]}>
                    <Ionicons name={opt.icon} size={isSmall ? 18 : isTablet ? 22 : 20} color={isOn ? Colors.purple : Colors.textMuted} />
                  </View>
                  <Text style={[s.rowLabel, dyn.rowLabel, isOn && s.rowLabelOn]}>{opt.label}</Text>
                  {isOn
                    ? <View style={s.checkOn}><Ionicons name="checkmark" size={12} color="#fff" /></View>
                    : <View style={s.checkOff} />
                  }
                </TouchableOpacity>
              );
            })}
          </View>

          {selected.length > 0 && selected[0] !== NONE_ID && (
            <View style={s.countRow}>
              <Ionicons name="information-circle" size={14} color={Colors.purplePale} />
              <Text style={[s.countText, dyn.countText]}>
                {selected.length} pattern{selected.length !== 1 ? 's' : ''} — we'll add nerve-safe exercises
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={[s.footer, dyn.footer]}>
        <View style={[s.footerInner, dyn.footerInner]}>
          <TouchableOpacity
            style={[s.btn, !selected.length && s.btnDisabled]}
            onPress={handleContinue}
            activeOpacity={0.88}
          >
            <Text style={[s.btnText, dyn.btnText, !selected.length && s.btnTextDisabled]}>
              {selected.length ? 'Continue' : 'Pick what fits'}
            </Text>
            {!!selected.length && <Ionicons name="arrow-forward" size={16} color={Colors.white} />}
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
  row: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: Colors.bgCard,
    borderWidth: 1.5, borderColor: Colors.border,
    borderRadius: 16, paddingVertical: 14, paddingHorizontal: 14,
  },
  rowOn:        { backgroundColor: Colors.purpleDim, borderColor: Colors.purple },
  iconWrap:     { borderRadius: 12, backgroundColor: Colors.bgInput, borderWidth: 1, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center' },
  iconWrapOn:   { backgroundColor: Colors.purple + '22', borderColor: Colors.purple + '50' },
  rowLabel:     { flex: 1, fontWeight: '600', color: Colors.textMuted },
  rowLabelOn:   { color: Colors.textPrimary },
  checkOn:      { width: 22, height: 22, borderRadius: 6, backgroundColor: Colors.purple, alignItems: 'center', justifyContent: 'center' },
  checkOff:     { width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: Colors.border },

  countRow:  { flexDirection: 'row', alignItems: 'center', gap: 6, justifyContent: 'center' },
  countText: { color: Colors.purplePale, fontWeight: '600' },

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
