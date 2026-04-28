import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useOnboarding } from '../../context/OnboardingContext';
import { StepHeader } from '../../components/StepHeader';
import { Colors, Shadows } from '../../constants/brand';

const OPTIONS = [
  { id: 'sitting',  label: 'Sitting',       icon: 'desktop-outline',   detail: 'At a desk or on a couch' },
  { id: 'standing', label: 'Standing',       icon: 'man-outline',       detail: 'On your feet for a while' },
  { id: 'lifting',  label: 'Lifting',        icon: 'barbell-outline',   detail: 'Picking things up' },
  { id: 'sleeping', label: 'Sleeping',       icon: 'bed-outline',       detail: 'During or after sleep' },
  { id: 'training', label: 'Exercising',     icon: 'bicycle-outline',   detail: 'During workouts' },
  { id: 'morning',  label: 'Mornings',       icon: 'sunny-outline',     detail: 'Worst when you wake up' },
  { id: 'walking',  label: 'Walking',        icon: 'footsteps-outline', detail: 'During regular movement' },
  { id: 'stress',   label: 'Stress / Tension', icon: 'pulse-outline',  detail: 'When anxious or tense' },
];

export default function PainTriggersScreen({ navigation }) {
  const { onboardingData, updateOnboardingData } = useOnboarding();
  const [selected, setSelected] = useState(onboardingData.worstTimeTriggers || []);

  const toggle = (id) =>
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  const handleContinue = () => {
    if (!selected.length) return;
    updateOnboardingData({ worstTimeTriggers: selected });
    navigation.navigate('Sitting');
  };

  return (
    <SafeAreaView style={s.container} edges={['top', 'bottom']}>
      <StepHeader step={4} total={8} onBack={() => navigation.goBack()} />

      <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <View style={s.topBlock}>
          <Text style={s.question}>When is it{'\n'}at its worst?</Text>
          <Text style={s.hint}>
            Select everything that triggers or worsens your pain.{'\n'}
            The more you tell us, the better your plan.
          </Text>
        </View>

        {/* 2-column grid */}
        <View style={s.grid}>
          {OPTIONS.map((opt) => {
            const isOn = selected.includes(opt.id);
            return (
              <TouchableOpacity
                key={opt.id}
                style={[s.card, isOn && s.cardOn]}
                onPress={() => toggle(opt.id)}
                activeOpacity={0.82}
              >
                <View style={[s.iconWrap, isOn && s.iconWrapOn]}>
                  <Ionicons name={opt.icon} size={20} color={isOn ? Colors.purple : Colors.textMuted} />
                </View>
                <Text style={[s.cardLabel, isOn && s.cardLabelOn]}>{opt.label}</Text>
                <Text style={[s.cardDetail, isOn && s.cardDetailOn]}>{opt.detail}</Text>
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
            <Ionicons name="checkmark-circle" size={14} color={Colors.green} />
            <Text style={s.countText}>{selected.length} trigger{selected.length !== 1 ? 's' : ''} selected</Text>
          </View>
        )}
      </ScrollView>

      <View style={s.footer}>
        <TouchableOpacity
          style={[s.btn, !selected.length && s.btnDisabled]}
          onPress={handleContinue}
          activeOpacity={0.88}
        >
          <Text style={[s.btnText, !selected.length && s.btnTextDisabled]}>
            {selected.length ? 'Continue' : 'Select triggers'}
          </Text>
          {!!selected.length && <Ionicons name="arrow-forward" size={16} color={Colors.white} />}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  scroll:    { flex: 1 },
  content:   { flexGrow: 1, paddingHorizontal: 24, justifyContent: 'center', gap: 20, paddingVertical: 16 },

  topBlock: { alignItems: 'center', gap: 10 },
  question: { fontSize: 38, fontWeight: '800', color: Colors.textPrimary, textAlign: 'center', letterSpacing: -0.8, lineHeight: 46 },
  hint:         { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', lineHeight: 21 },

  grid: {
    flexDirection: 'row', flexWrap: 'wrap',
    gap: 10, justifyContent: 'center',
  },
  card: {
    width: '47%', alignItems: 'center',
    backgroundColor: Colors.bgCard,
    borderWidth: 1.5, borderColor: Colors.border,
    borderRadius: 18, paddingVertical: 16, paddingHorizontal: 12,
    gap: 5, position: 'relative',
  },
  cardOn:      { backgroundColor: Colors.purpleDim, borderColor: Colors.purple },
  iconWrap:    { width: 42, height: 42, borderRadius: 14, backgroundColor: Colors.bgInput, borderWidth: 1, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center' },
  iconWrapOn:  { backgroundColor: Colors.purple + '22', borderColor: Colors.purple + '50' },
  cardLabel:   { fontSize: 14, fontWeight: '700', color: Colors.textMuted, textAlign: 'center' },
  cardLabelOn: { color: Colors.textPrimary },
  cardDetail:  { fontSize: 11, color: Colors.textDisabled, textAlign: 'center', lineHeight: 16 },
  cardDetailOn:{ color: Colors.purplePale, opacity: 0.8 },
  check: {
    position: 'absolute', top: 8, right: 8,
    width: 16, height: 16, borderRadius: 8,
    backgroundColor: Colors.purple,
    alignItems: 'center', justifyContent: 'center',
  },

  countRow: { flexDirection: 'row', alignItems: 'center', gap: 6, justifyContent: 'center' },
  countText:{ fontSize: 13, color: Colors.green, fontWeight: '600' },

  footer:      { paddingHorizontal: 28, paddingBottom: 36, paddingTop: 8 },
  btn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: Colors.purple, borderRadius: 20, paddingVertical: 19,
    ...Shadows.purple,
  },
  btnDisabled:     { backgroundColor: Colors.bgCard, shadowOpacity: 0, borderWidth: 1, borderColor: Colors.border },
  btnText:         { fontSize: 17, fontWeight: '700', color: Colors.white },
  btnTextDisabled: { color: Colors.textMuted },
});
