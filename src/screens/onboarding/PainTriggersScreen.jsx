import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useOnboarding } from '../../context/OnboardingContext';
import { StepHeader } from '../../components/StepHeader';
import StepFooter from '../../components/StepFooter';
import { Colors, Shadows } from '../../constants/brand';
import { useResponsive, fs, sp } from '../../utils/responsive';

const OPTIONS = [
  { id: 'sitting',  label: 'Sitting',         icon: 'desktop-outline',   detail: 'At a desk or on a couch' },
  { id: 'standing', label: 'Standing',        icon: 'man-outline',       detail: 'On your feet for a while' },
  { id: 'lifting',  label: 'Lifting',         icon: 'barbell-outline',   detail: 'Picking things up' },
  { id: 'sleeping', label: 'Sleeping',        icon: 'bed-outline',       detail: 'During or after sleep' },
  { id: 'training', label: 'Exercising',      icon: 'bicycle-outline',   detail: 'During workouts' },
  { id: 'morning',  label: 'Mornings',        icon: 'sunny-outline',     detail: 'Worst when you wake up' },
  { id: 'walking',  label: 'Walking',         icon: 'footsteps-outline', detail: 'During regular movement' },
  { id: 'stress',   label: 'Stress / Tension', icon: 'pulse-outline',    detail: 'When anxious or tense' },
];

export default function PainTriggersScreen({ navigation }) {
  const { onboardingData, updateOnboardingData } = useOnboarding();
  const [selected, setSelected] = useState(onboardingData.worstTimeTriggers || []);
  const { isSmall, isTablet, isShort, horizPad, frameWidth, fontScale, gapScale } = useResponsive();

  const toggle = (id) =>
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  const handleContinue = () => {
    if (!selected.length) return;
    updateOnboardingData({ worstTimeTriggers: selected });
    navigation.navigate('PainDuration');
  };

  const dyn = {
    scrollContent: { paddingHorizontal: horizPad, paddingVertical: sp(24, gapScale) },
    frame:         { maxWidth: frameWidth, gap: sp(20, gapScale) },
    question:      { fontSize: fs(38, fontScale), lineHeight: fs(46, fontScale) },
    hint:          { fontSize: fs(14, fontScale), lineHeight: fs(21, fontScale) },
    grid:          { gap: sp(10, gapScale) },
    cardLabel:     { fontSize: fs(14, fontScale) },
    cardDetail:    { fontSize: fs(11, fontScale) },
    iconWrap:      { width: isSmall ? 38 : isTablet ? 48 : 42, height: isSmall ? 38 : isTablet ? 48 : 42 },
    countText:     { fontSize: fs(13, fontScale) },
  };

  return (
    <SafeAreaView style={s.container} edges={['top', 'bottom']}>
      <StepHeader step={4} total={12} onBack={() => navigation.goBack()} />

      <ScrollView style={s.scroll} contentContainerStyle={[s.scrollContent, dyn.scrollContent]} showsVerticalScrollIndicator={false}>
        <View style={[s.frame, dyn.frame]}>
          <View style={s.topBlock}>
            <Text style={[s.question, dyn.question]}>When is it{'\n'}at its worst?</Text>
            <Text style={[s.hint, dyn.hint]}>
              Select everything that triggers or worsens your pain.{'\n'}
              The more you tell us, the better your plan.
            </Text>
          </View>

          {/* 2-column grid */}
          <View style={[s.grid, dyn.grid]}>
            {OPTIONS.map((opt) => {
              const isOn = selected.includes(opt.id);
              return (
                <TouchableOpacity
                  key={opt.id}
                  style={[s.card, isOn && s.cardOn]}
                  onPress={() => toggle(opt.id)}
                  activeOpacity={0.82}
                >
                  <View style={[s.iconWrap, dyn.iconWrap, isOn && s.iconWrapOn]}>
                    <Ionicons name={opt.icon} size={isSmall ? 18 : isTablet ? 24 : 20} color={isOn ? Colors.purple : Colors.textMuted} />
                  </View>
                  <Text style={[s.cardLabel, dyn.cardLabel, isOn && s.cardLabelOn]}>{opt.label}</Text>
                  <Text style={[s.cardDetail, dyn.cardDetail, isOn && s.cardDetailOn]}>{opt.detail}</Text>
                  {isOn && (
                    <View style={s.check}>
                      <Ionicons name="checkmark" size={9} color="#fff" />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {selected.length > 0 && (
            <View style={s.countRow}>
              <Ionicons name="checkmark-circle" size={14} color={Colors.purpleLight} />
              <Text style={[s.countText, dyn.countText]}>{selected.length} trigger{selected.length !== 1 ? 's' : ''} selected</Text>
            </View>
          )}
        </View>
      </ScrollView>

      <StepFooter
        label={selected.length ? 'Continue' : 'Select triggers'}
        disabled={!selected.length}
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

  topBlock: { alignItems: 'center', gap: 10 },
  question: { fontWeight: '800', color: Colors.textPrimary, textAlign: 'center', letterSpacing: -0.8 },
  hint:     { color: Colors.textSecondary, textAlign: 'center' },

  grid: {
    flexDirection: 'row', flexWrap: 'wrap',
    justifyContent: 'center',
  },
  card: {
    width: '47%', alignItems: 'center',
    backgroundColor: Colors.bgCard,
    borderWidth: 1.5, borderColor: Colors.border,
    borderRadius: 18, paddingVertical: 16, paddingHorizontal: 12,
    gap: 5, position: 'relative',
  },
  cardOn:      { backgroundColor: Colors.purpleDim, borderColor: Colors.purple },
  iconWrap:    { borderRadius: 14, backgroundColor: Colors.bgInput, borderWidth: 1, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center' },
  iconWrapOn:  { backgroundColor: Colors.purple + '22', borderColor: Colors.purple + '50' },
  cardLabel:   { fontWeight: '700', color: Colors.textMuted, textAlign: 'center' },
  cardLabelOn: { color: Colors.textPrimary },
  cardDetail:  { color: Colors.textDisabled, textAlign: 'center', lineHeight: 16 },
  cardDetailOn:{ color: Colors.purplePale, opacity: 0.8 },
  check: {
    position: 'absolute', top: 8, right: 8,
    width: 16, height: 16, borderRadius: 8,
    backgroundColor: Colors.purple,
    alignItems: 'center', justifyContent: 'center',
  },

  countRow:  { flexDirection: 'row', alignItems: 'center', gap: 6, justifyContent: 'center' },
  countText: { color: Colors.purpleLight, fontWeight: '600' },
});
